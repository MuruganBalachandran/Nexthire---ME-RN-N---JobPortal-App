const { body, validationResult } = require('express-validator');

// Validation rules for user registration
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('fullName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  body('userType')
    .isIn(['jobseeker', 'recruiter'])
    .withMessage('User type must be either jobseeker or recruiter'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters')
];

// Validation rules for user login
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

// Validation rules for job posting
const jobValidation = [
  body('title')
    .trim()
    .isLength({ min: 5, max: 100 })
    .withMessage('Job title must be between 5 and 100 characters'),
  body('company')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Company name must be between 2 and 100 characters'),
  body('location')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Location must be between 2 and 100 characters'),
  body('type')
    .isIn(['full-time', 'part-time', 'contract', 'internship', 'freelance'])
    .withMessage('Invalid job type'),
  body('remote')
    .isBoolean()
    .withMessage('Remote must be a boolean value'),
  body('salary.min')
    .isNumeric()
    .withMessage('Minimum salary must be a number')
    .custom((value) => value > 0)
    .withMessage('Minimum salary must be greater than 0'),
  body('salary.max')
    .isNumeric()
    .withMessage('Maximum salary must be a number')
    .custom((value, { req }) => value >= req.body.salary.min)
    .withMessage('Maximum salary must be greater than or equal to minimum salary'),
  body('experience')
    .isIn(['entry', 'junior', 'mid-level', 'senior', 'lead', 'executive'])
    .withMessage('Invalid experience level'),
  body('description')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Description must be between 50 and 2000 characters'),
  body('requirements')
    .optional()
    .isArray()
    .withMessage('Requirements must be an array'),
  body('requirements.*')
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage('Each requirement must be between 5 and 200 characters'),
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Benefits must be an array'),
  body('benefits.*')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Each benefit cannot exceed 200 characters'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array'),
  body('skills.*')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Each skill cannot exceed 50 characters')
];

// Validation rules for job application
const applicationValidation = [
  body('coverLetter')
    .trim()
    .isLength({ min: 50, max: 2000 })
    .withMessage('Cover letter must be between 50 and 2000 characters'),
  body('expectedSalary.amount')
    .isNumeric()
    .withMessage('Expected salary must be a number')
    .custom((value) => value > 0)
    .withMessage('Expected salary must be greater than 0'),
  body('experience')
    .trim()
    .isLength({ min: 10, max: 500 })
    .withMessage('Experience must be between 10 and 500 characters')
];

// Validation rules for profile update
const profileValidation = [
  body('fullName')
    .optional()
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Full name must be between 2 and 50 characters'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Please enter a valid phone number'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Location cannot exceed 100 characters'),
  body('bio')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Bio cannot exceed 500 characters'),
  body('skills')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Skills cannot exceed 200 characters'),
  body('experience')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Experience cannot exceed 50 characters'),
  body('company')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Company name cannot exceed 100 characters'),
  body('companyWebsite')
    .optional()
    .isURL()
    .withMessage('Please enter a valid website URL'),
  body('companyDescription')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Company description cannot exceed 500 characters')
];

// Validation rules for password reset
const passwordResetValidation = [
  body('email')
    .isEmail()
    .withMessage('Please enter a valid email')
    .normalizeEmail()
];

// Validation rules for password change
const passwordChangeValidation = [
  body('currentPassword')
    .notEmpty()
    .withMessage('Current password is required'),
  body('newPassword')
    .isLength({ min: 6 })
    .withMessage('New password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('New password must contain at least one uppercase letter, one lowercase letter, and one number'),
  body('confirmPassword')
    .custom((value, { req }) => value === req.body.newPassword)
    .withMessage('Password confirmation does not match new password')
];

// Middleware to check validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
  }
  next();
};

module.exports = {
  registerValidation,
  loginValidation,
  jobValidation,
  applicationValidation,
  profileValidation,
  passwordResetValidation,
  passwordChangeValidation,
  handleValidationErrors
};
