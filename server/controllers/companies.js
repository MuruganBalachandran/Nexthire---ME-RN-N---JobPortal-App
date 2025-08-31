const Company = require('../models/Company');
const User = require('../models/User');
const { asyncHandler } = require('../middleware/errorHandler');
const { uploadToCloudinary, removeFromCloudinary } = require('../utils/cloudinary');

// @desc    Create company profile
// @route   POST /api/companies
exports.createCompany = asyncHandler(async (req, res) => {
  try {
    // Check if user already has a company
    const existingCompany = await Company.findOne({ owner: req.user._id });
    if (existingCompany) {
      return res.status(400).json({
        success: false,
        error: 'User already has a company profile'
      });
    }

    const companyData = {
      ...req.body,
      owner: req.user._id
    };

    // Handle logo upload if provided
    if (req.files && req.files.logo) {
      const result = await uploadToCloudinary(req.files.logo[0], 'company-logos');
      companyData.logo = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    const company = await Company.create(companyData);

    // Update user's company reference
    await User.findByIdAndUpdate(req.user._id, {
      company: company._id
    });

    res.status(201).json({
      success: true,
      data: company
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Update company profile
// @route   PUT /api/companies/:id
exports.updateCompany = asyncHandler(async (req, res) => {
  try {
    let company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    // Check ownership
    if (company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this company'
      });
    }

    // Handle logo update if provided
    if (req.files && req.files.logo) {
      // Remove old logo if exists
      if (company.logo && company.logo.publicId) {
        await removeFromCloudinary(company.logo.publicId);
      }

      const result = await uploadToCloudinary(req.files.logo[0], 'company-logos');
      req.body.logo = {
        url: result.secure_url,
        publicId: result.public_id
      };
    }

    company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Get company profile
// @route   GET /api/companies/:id
exports.getCompany = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.id)
      .populate('owner', 'fullName email phone');

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    res.json({
      success: true,
      data: company
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Delete company
// @route   DELETE /api/companies/:id
exports.deleteCompany = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    // Check ownership
    if (company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this company'
      });
    }

    // Remove company logo from cloud storage
    if (company.logo && company.logo.publicId) {
      await removeFromCloudinary(company.logo.publicId);
    }

    await company.remove();

    // Update user's company reference
    await User.findByIdAndUpdate(req.user._id, {
      $unset: { company: 1 }
    });

    res.json({
      success: true,
      data: {}
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Upload company document
// @route   POST /api/companies/:id/documents
exports.uploadDocument = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    // Check ownership
    if (company.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to upload documents'
      });
    }

    if (!req.files || !req.files.document) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a document'
      });
    }

    const result = await uploadToCloudinary(
      req.files.document[0],
      'company-documents'
    );

    company.documents.push({
      type: req.body.type || 'other',
      url: result.secure_url,
      publicId: result.public_id,
      verified: false
    });

    await company.save();

    res.status(201).json({
      success: true,
      data: company.documents[company.documents.length - 1]
    });
  } catch (error) {
    throw new Error(error.message);
  }
});

// @desc    Update company metrics
// @route   PATCH /api/companies/:id/metrics
exports.updateMetrics = asyncHandler(async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({
        success: false,
        error: 'Company not found'
      });
    }

    // Update specific metrics
    Object.keys(req.body).forEach(key => {
      if (company.metrics.hasOwnProperty(key)) {
        company.metrics[key] = req.body[key];
      }
    });

    await company.save();

    res.json({
      success: true,
      data: company.metrics
    });
  } catch (error) {
    throw new Error(error.message);
  }
});
