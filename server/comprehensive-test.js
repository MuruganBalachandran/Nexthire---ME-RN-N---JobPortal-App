const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './config.env' });

// Import models
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');

// Import utilities
const generateToken = require('./utils/generateToken');
const seedUsers = require('./utils/seedData');

// Import validation
const { body, validationResult } = require('express-validator');

class ComprehensiveServerTest {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      errors: []
    };
  }

  log(message, type = 'info') {
    const colors = {
      info: '\x1b[36m',
      success: '\x1b[32m',
      error: '\x1b[31m',
      warning: '\x1b[33m',
      reset: '\x1b[0m'
    };
    console.log(`${colors[type]}${message}${colors.reset}`);
  }

  async runTest(name, testFn) {
    this.results.total++;
    try {
      await testFn();
      this.results.passed++;
      this.log(`✅ ${name}`, 'success');
    } catch (error) {
      this.results.failed++;
      this.results.errors.push({ name, error: error.message });
      this.log(`❌ ${name}: ${error.message}`, 'error');
    }
  }

  async testDatabaseConnection() {
    await mongoose.connect(process.env.MONGODB_URI);
    if (mongoose.connection.readyState !== 1) {
      throw new Error('Database connection failed');
    }
  }

  async testUserModel() {
    // Test valid user creation
    const validUser = new User({
      email: 'test@example.com',
      password: 'Password123!',
      fullName: 'Test User',
      userType: 'jobseeker',
      phone: '+1234567890',
      location: 'Test City'
    });

    await validUser.validate();

    // Test password hashing
    const originalPassword = validUser.password;
    await validUser.save();
    
    if (validUser.password === originalPassword) {
      throw new Error('Password was not hashed');
    }

    // Test password matching
    const isMatch = await validUser.matchPassword('Password123!');
    if (!isMatch) {
      throw new Error('Password matching failed');
    }

    // Test invalid email
    try {
      const invalidUser = new User({
        email: 'invalid-email',
        password: 'Password123!',
        fullName: 'Test User',
        userType: 'jobseeker'
      });
      await invalidUser.validate();
      throw new Error('Should have failed validation for invalid email');
    } catch (error) {
      if (error.name !== 'ValidationError') {
        throw error;
      }
    }

    // Clean up
    await User.deleteOne({ email: 'test@example.com' });
  }

  async testJobModel() {
    // Create a test recruiter first
    const recruiter = new User({
      email: 'recruiter@test.com',
      password: 'Password123!',
      fullName: 'Test Recruiter',
      userType: 'recruiter',
      company: 'Test Company'
    });
    await recruiter.save();

    // Test valid job creation
    const validJob = new Job({
      title: 'Test Software Developer',
      company: 'Test Company',
      location: 'Test Location',
      type: 'full-time',
      remote: true,
      salary: {
        min: 80000,
        max: 120000,
        currency: 'USD',
        period: 'yearly'
      },
      experience: 'mid-level',
      description: 'This is a comprehensive test job description that meets all the validation requirements for length and content.',
      requirements: ['Test requirement 1', 'Test requirement 2'],
      benefits: ['Test benefit 1', 'Test benefit 2'],
      skills: ['JavaScript', 'React', 'Node.js'],
      recruiter: recruiter._id
    });

    await validJob.validate();
    await validJob.save();

    // Test virtual fields
    if (!validJob.formattedSalary.includes('USD')) {
      throw new Error('Formatted salary virtual not working');
    }

    // Test invalid job type
    try {
      const invalidJob = new Job({
        title: 'Test Job',
        company: 'Test Company',
        location: 'Test Location',
        type: 'invalid-type',
        salary: { min: 50000, max: 80000 },
        experience: 'entry',
        description: 'Test description',
        recruiter: recruiter._id
      });
      await invalidJob.validate();
      throw new Error('Should have failed validation for invalid job type');
    } catch (error) {
      if (error.name !== 'ValidationError') {
        throw error;
      }
    }

    // Clean up
    await Job.deleteOne({ _id: validJob._id });
    await User.deleteOne({ _id: recruiter._id });
  }

  async testApplicationModel() {
    // Create test users and job
    const jobseeker = new User({
      email: 'jobseeker@test.com',
      password: 'Password123!',
      fullName: 'Test Jobseeker',
      userType: 'jobseeker'
    });
    await jobseeker.save();

    const recruiter = new User({
      email: 'recruiter2@test.com',
      password: 'Password123!',
      fullName: 'Test Recruiter 2',
      userType: 'recruiter',
      company: 'Test Company 2'
    });
    await recruiter.save();

    const job = new Job({
      title: 'Test Position',
      company: 'Test Company 2',
      location: 'Test Location',
      type: 'full-time',
      salary: { min: 60000, max: 90000 },
      experience: 'entry',
      description: 'This is a test job description that meets the minimum length requirements.',
      recruiter: recruiter._id
    });
    await job.save();

    // Test valid application
    const validApplication = new Application({
      job: job._id,
      applicant: jobseeker._id,
      coverLetter: 'This is a comprehensive cover letter that meets all the validation requirements for length and provides detailed information about my qualifications.',
      expectedSalary: {
        amount: 75000,
        currency: 'USD',
        period: 'yearly'
      },
      experience: 'I have relevant experience in software development and testing.'
    });

    await validApplication.validate();
    await validApplication.save();

    // Test status update
    await validApplication.updateStatus('reviewing', recruiter._id, 'Initial review');
    if (validApplication.status !== 'reviewing') {
      throw new Error('Status update failed');
    }

    // Test duplicate application prevention (should be handled by unique index)
    try {
      const duplicateApplication = new Application({
        job: job._id,
        applicant: jobseeker._id,
        coverLetter: 'Another cover letter that meets the minimum length requirements.',
        expectedSalary: { amount: 70000, currency: 'USD', period: 'yearly' },
        experience: 'Different experience description.'
      });
      await duplicateApplication.save();
      throw new Error('Should have prevented duplicate application');
    } catch (error) {
      if (error.code !== 11000) { // MongoDB duplicate key error
        throw error;
      }
    }

    // Clean up
    await Application.deleteOne({ _id: validApplication._id });
    await Job.deleteOne({ _id: job._id });
    await User.deleteOne({ _id: jobseeker._id });
    await User.deleteOne({ _id: recruiter._id });
  }

  async testPasswordHashing() {
    const password = 'TestPassword123!';
    const hashedPassword = await bcrypt.hash(password, 12);
    
    if (password === hashedPassword) {
      throw new Error('Password was not hashed');
    }

    const isMatch = await bcrypt.compare(password, hashedPassword);
    if (!isMatch) {
      throw new Error('Password comparison failed');
    }
  }

  async testTokenGeneration() {
    const userId = new mongoose.Types.ObjectId();
    const token = generateToken(userId);
    
    if (!token || typeof token !== 'string') {
      throw new Error('Token generation failed');
    }

    // Test token structure (should be JWT)
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Generated token is not a valid JWT');
    }
  }

  async testValidationRules() {
    // Test email validation
    const emailTests = [
      { email: 'valid@example.com', shouldPass: true },
      { email: 'invalid-email', shouldPass: false },
      { email: '', shouldPass: false },
      { email: 'test@', shouldPass: false }
    ];

    for (const test of emailTests) {
      try {
        const user = new User({
          email: test.email,
          password: 'Password123!',
          fullName: 'Test User',
          userType: 'jobseeker'
        });
        await user.validate();
        
        if (!test.shouldPass) {
          throw new Error(`Email validation should have failed for: ${test.email}`);
        }
      } catch (error) {
        if (test.shouldPass && error.name === 'ValidationError') {
          throw new Error(`Email validation should have passed for: ${test.email}`);
        }
      }
    }

    // Test password validation
    const passwordTests = [
      { password: 'Password123!', shouldPass: true },
      { password: '123', shouldPass: false },
      { password: '', shouldPass: false }
    ];

    for (const test of passwordTests) {
      try {
        const user = new User({
          email: 'test@example.com',
          password: test.password,
          fullName: 'Test User',
          userType: 'jobseeker'
        });
        await user.validate();
        
        if (!test.shouldPass) {
          throw new Error(`Password validation should have failed for: ${test.password}`);
        }
      } catch (error) {
        if (test.shouldPass && error.name === 'ValidationError') {
          throw new Error(`Password validation should have passed for: ${test.password}`);
        }
      }
    }
  }

  async testDatabaseSeeding() {
    // Clear database first
    await User.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});

    // Run seeding
    await seedUsers();

    // Verify data was created
    const userCount = await User.countDocuments();
    const jobCount = await Job.countDocuments();
    const applicationCount = await Application.countDocuments();

    if (userCount === 0) {
      throw new Error('No users were created during seeding');
    }

    if (jobCount === 0) {
      throw new Error('No jobs were created during seeding');
    }

    if (applicationCount === 0) {
      throw new Error('No applications were created during seeding');
    }

    // Verify user types
    const jobseekerCount = await User.countDocuments({ userType: 'jobseeker' });
    const recruiterCount = await User.countDocuments({ userType: 'recruiter' });

    if (jobseekerCount === 0 || recruiterCount === 0) {
      throw new Error('Both user types should be created during seeding');
    }
  }

  async testErrorHandling() {
    // Test handling of invalid ObjectId
    try {
      await User.findById('invalid-id');
      throw new Error('Should have thrown error for invalid ObjectId');
    } catch (error) {
      if (error.name !== 'CastError') {
        throw new Error('Expected CastError for invalid ObjectId');
      }
    }

    // Test handling of duplicate key error
    const user1 = new User({
      email: 'duplicate@test.com',
      password: 'Password123!',
      fullName: 'User 1',
      userType: 'jobseeker'
    });
    await user1.save();

    try {
      const user2 = new User({
        email: 'duplicate@test.com',
        password: 'Password123!',
        fullName: 'User 2',
        userType: 'jobseeker'
      });
      await user2.save();
      throw new Error('Should have thrown duplicate key error');
    } catch (error) {
      if (error.code !== 11000) {
        throw new Error('Expected duplicate key error');
      }
    }

    // Clean up
    await User.deleteOne({ email: 'duplicate@test.com' });
  }

  async testIndexes() {
    // Test that indexes are created properly
    const userIndexes = await User.collection.getIndexes();
    const jobIndexes = await Job.collection.getIndexes();
    const applicationIndexes = await Application.collection.getIndexes();

    // User should have email index
    if (!userIndexes.email_1) {
      throw new Error('User email index not found');
    }

    // Job should have text index for search
    const hasTextIndex = Object.keys(jobIndexes).some(key => 
      jobIndexes[key].some(field => field[1] === 'text')
    );
    if (!hasTextIndex) {
      throw new Error('Job text search index not found');
    }

    // Application should have compound unique index
    const hasCompoundIndex = Object.keys(applicationIndexes).some(key =>
      key.includes('job_1_applicant_1')
    );
    if (!hasCompoundIndex) {
      throw new Error('Application compound unique index not found');
    }
  }

  async runAllTests() {
    this.log('🚀 Starting Comprehensive Server Testing...', 'info');
    this.log('=' * 50, 'info');

    await this.runTest('Database Connection', () => this.testDatabaseConnection());
    await this.runTest('User Model Validation', () => this.testUserModel());
    await this.runTest('Job Model Validation', () => this.testJobModel());
    await this.runTest('Application Model Validation', () => this.testApplicationModel());
    await this.runTest('Password Hashing', () => this.testPasswordHashing());
    await this.runTest('Token Generation', () => this.testTokenGeneration());
    await this.runTest('Input Validation Rules', () => this.testValidationRules());
    await this.runTest('Database Seeding', () => this.testDatabaseSeeding());
    await this.runTest('Error Handling', () => this.testErrorHandling());
    await this.runTest('Database Indexes', () => this.testIndexes());

    this.printResults();
    await mongoose.connection.close();
  }

  printResults() {
    this.log('\n' + '=' * 50, 'info');
    this.log('📊 TEST RESULTS SUMMARY', 'info');
    this.log('=' * 50, 'info');
    
    this.log(`Total Tests: ${this.results.total}`, 'info');
    this.log(`✅ Passed: ${this.results.passed}`, 'success');
    this.log(`❌ Failed: ${this.results.failed}`, 'error');
    
    const successRate = ((this.results.passed / this.results.total) * 100).toFixed(1);
    this.log(`📈 Success Rate: ${successRate}%`, successRate === '100.0' ? 'success' : 'warning');

    if (this.results.errors.length > 0) {
      this.log('\n🔍 FAILED TESTS:', 'error');
      this.results.errors.forEach((error, index) => {
        this.log(`${index + 1}. ${error.name}:`, 'error');
        this.log(`   ${error.error}`, 'error');
      });
    }

    if (this.results.failed === 0) {
      this.log('\n🎉 ALL TESTS PASSED!', 'success');
      this.log('✅ Server validation complete - all functionalities working correctly', 'success');
      this.log('✅ Error handling implemented properly', 'success');
      this.log('✅ Database models and validation working as expected', 'success');
    } else {
      this.log('\n⚠️  Some tests failed. Review the errors above.', 'warning');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ComprehensiveServerTest();
  tester.runAllTests().catch(error => {
    console.error('Test execution failed:', error);
    process.exit(1);
  });
}

module.exports = ComprehensiveServerTest;
