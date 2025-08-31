const mongoose = require('mongoose');
const express = require('express');
const request = require('supertest');
require('dotenv').config({ path: './config.env' });

// Import models and utilities
const User = require('./models/User');
const Job = require('./models/Job');
const Application = require('./models/Application');
const seedUsers = require('./utils/seedData');

// Import the main app
const app = require('./server-test-app');

class ServerTester {
  constructor() {
    this.testResults = {
      passed: 0,
      failed: 0,
      errors: []
    };
    this.authTokens = {};
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'success' ? '✅' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  }

  async test(description, testFn) {
    try {
      this.log(`Testing: ${description}`);
      await testFn();
      this.testResults.passed++;
      this.log(`✅ PASSED: ${description}`, 'success');
    } catch (error) {
      this.testResults.failed++;
      this.testResults.errors.push({ description, error: error.message });
      this.log(`❌ FAILED: ${description} - ${error.message}`, 'error');
    }
  }

  async connectDatabase() {
    try {
      await mongoose.connect(process.env.MONGODB_URI);
      this.log('✅ Database connected successfully', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Database connection failed: ${error.message}`, 'error');
      return false;
    }
  }

  async seedDatabase() {
    try {
      await seedUsers();
      this.log('✅ Database seeded successfully', 'success');
      return true;
    } catch (error) {
      this.log(`❌ Database seeding failed: ${error.message}`, 'error');
      return false;
    }
  }

  async testHealthEndpoint() {
    const response = await request(app).get('/health');
    if (response.status !== 200) {
      throw new Error(`Expected status 200, got ${response.status}`);
    }
    if (!response.body.status || response.body.status !== 'OK') {
      throw new Error('Health check response invalid');
    }
  }

  async testUserRegistration() {
    const userData = {
      email: 'test@example.com',
      password: 'Password123!',
      fullName: 'Test User',
      userType: 'jobseeker',
      phone: '+1234567890',
      location: 'Test City'
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(userData);

    if (response.status !== 201) {
      throw new Error(`Registration failed with status ${response.status}: ${response.body.error}`);
    }

    if (!response.body.success || !response.body.token) {
      throw new Error('Registration response invalid');
    }

    this.authTokens.testUser = response.body.token;
  }

  async testUserLogin() {
    const loginData = {
      email: 'john.dev@gmail.com',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    if (response.status !== 200) {
      throw new Error(`Login failed with status ${response.status}: ${response.body.error}`);
    }

    if (!response.body.success || !response.body.token) {
      throw new Error('Login response invalid');
    }

    this.authTokens.jobseeker = response.body.token;
  }

  async testRecruiterLogin() {
    const loginData = {
      email: 'sarah.tech@techcorp.com',
      password: 'Password123!'
    };

    const response = await request(app)
      .post('/api/auth/login')
      .send(loginData);

    if (response.status !== 200) {
      throw new Error(`Recruiter login failed with status ${response.status}: ${response.body.error}`);
    }

    this.authTokens.recruiter = response.body.token;
  }

  async testProtectedRoute() {
    // Test without token
    const response1 = await request(app).get('/api/auth/me');
    if (response1.status !== 401) {
      throw new Error('Protected route should return 401 without token');
    }

    // Test with valid token
    const response2 = await request(app)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${this.authTokens.jobseeker}`);

    if (response2.status !== 200) {
      throw new Error(`Protected route failed with valid token: ${response2.status}`);
    }
  }

  async testJobCreation() {
    const jobData = {
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
      description: 'This is a test job description that meets the minimum length requirement for validation.',
      requirements: ['Test requirement 1', 'Test requirement 2'],
      benefits: ['Test benefit 1', 'Test benefit 2'],
      skills: ['JavaScript', 'React', 'Node.js']
    };

    const response = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${this.authTokens.recruiter}`)
      .send(jobData);

    if (response.status !== 201) {
      throw new Error(`Job creation failed with status ${response.status}: ${JSON.stringify(response.body)}`);
    }

    if (!response.body.success || !response.body.data) {
      throw new Error('Job creation response invalid');
    }

    this.testJobId = response.body.data._id;
  }

  async testJobListing() {
    const response = await request(app).get('/api/jobs');

    if (response.status !== 200) {
      throw new Error(`Job listing failed with status ${response.status}`);
    }

    if (!response.body.success || !Array.isArray(response.body.data)) {
      throw new Error('Job listing response invalid');
    }

    if (response.body.data.length === 0) {
      throw new Error('No jobs found in listing');
    }
  }

  async testJobSearch() {
    const response = await request(app)
      .get('/api/jobs?search=developer&location=San Francisco');

    if (response.status !== 200) {
      throw new Error(`Job search failed with status ${response.status}`);
    }

    if (!response.body.success) {
      throw new Error('Job search response invalid');
    }
  }

  async testJobApplication() {
    // First get a job to apply to
    const jobsResponse = await request(app).get('/api/jobs');
    const jobId = jobsResponse.body.data[0]._id;

    const applicationData = {
      jobId: jobId,
      coverLetter: 'This is a test cover letter that meets the minimum length requirement for the application validation.',
      expectedSalary: {
        amount: 100000,
        currency: 'USD',
        period: 'yearly'
      },
      experience: 'I have relevant experience in software development and testing applications.'
    };

    const response = await request(app)
      .post('/api/applications')
      .set('Authorization', `Bearer ${this.authTokens.jobseeker}`)
      .send(applicationData);

    if (response.status !== 201) {
      throw new Error(`Job application failed with status ${response.status}: ${JSON.stringify(response.body)}`);
    }

    if (!response.body.success || !response.body.data) {
      throw new Error('Job application response invalid');
    }
  }

  async testUserProfile() {
    const response = await request(app)
      .get('/api/users/profile')
      .set('Authorization', `Bearer ${this.authTokens.jobseeker}`);

    if (response.status !== 200) {
      throw new Error(`Profile fetch failed with status ${response.status}`);
    }

    if (!response.body.success || !response.body.data) {
      throw new Error('Profile response invalid');
    }
  }

  async testValidationErrors() {
    // Test invalid registration data
    const invalidData = {
      email: 'invalid-email',
      password: '123', // Too short
      fullName: '', // Empty
      userType: 'invalid' // Invalid type
    };

    const response = await request(app)
      .post('/api/auth/register')
      .send(invalidData);

    if (response.status !== 400) {
      throw new Error('Validation should fail with status 400');
    }

    if (!response.body.error || !response.body.details) {
      throw new Error('Validation error response should include details');
    }
  }

  async testUnauthorizedAccess() {
    // Test recruiter-only endpoint with jobseeker token
    const response = await request(app)
      .post('/api/jobs')
      .set('Authorization', `Bearer ${this.authTokens.jobseeker}`)
      .send({
        title: 'Test Job',
        company: 'Test Company',
        location: 'Test Location',
        type: 'full-time',
        salary: { min: 50000, max: 80000 },
        experience: 'entry',
        description: 'Test description that is long enough for validation'
      });

    if (response.status !== 403) {
      throw new Error('Should return 403 for unauthorized access');
    }
  }

  async testStatistics() {
    const response = await request(app).get('/api/stats/platform');

    if (response.status !== 200) {
      throw new Error(`Statistics failed with status ${response.status}`);
    }

    if (!response.body.success || !response.body.data) {
      throw new Error('Statistics response invalid');
    }
  }

  async testModelValidation() {
    // Test User model validation
    try {
      const invalidUser = new User({
        email: 'invalid-email',
        password: '123',
        fullName: ''
      });
      await invalidUser.save();
      throw new Error('User model should have failed validation');
    } catch (error) {
      if (!error.name || error.name !== 'ValidationError') {
        throw new Error('Expected ValidationError from User model');
      }
    }

    // Test Job model validation
    try {
      const invalidJob = new Job({
        title: '',
        company: '',
        location: ''
      });
      await invalidJob.save();
      throw new Error('Job model should have failed validation');
    } catch (error) {
      if (!error.name || error.name !== 'ValidationError') {
        throw new Error('Expected ValidationError from Job model');
      }
    }
  }

  async runAllTests() {
    this.log('🚀 Starting comprehensive server testing...', 'info');
    
    // Database tests
    await this.test('Database Connection', () => this.connectDatabase());
    await this.test('Database Seeding', () => this.seedDatabase());
    
    // Basic endpoint tests
    await this.test('Health Endpoint', () => this.testHealthEndpoint());
    
    // Authentication tests
    await this.test('User Registration', () => this.testUserRegistration());
    await this.test('User Login', () => this.testUserLogin());
    await this.test('Recruiter Login', () => this.testRecruiterLogin());
    await this.test('Protected Route Access', () => this.testProtectedRoute());
    
    // Job-related tests
    await this.test('Job Creation', () => this.testJobCreation());
    await this.test('Job Listing', () => this.testJobListing());
    await this.test('Job Search', () => this.testJobSearch());
    
    // Application tests
    await this.test('Job Application', () => this.testJobApplication());
    
    // User profile tests
    await this.test('User Profile', () => this.testUserProfile());
    
    // Validation tests
    await this.test('Input Validation', () => this.testValidationErrors());
    await this.test('Authorization Checks', () => this.testUnauthorizedAccess());
    
    // Statistics tests
    await this.test('Platform Statistics', () => this.testStatistics());
    
    // Model validation tests
    await this.test('Model Validation', () => this.testModelValidation());
    
    // Print results
    this.printResults();
  }

  printResults() {
    this.log('\n📊 TEST RESULTS SUMMARY', 'info');
    this.log(`✅ Passed: ${this.testResults.passed}`, 'success');
    this.log(`❌ Failed: ${this.testResults.failed}`, 'error');
    this.log(`📈 Success Rate: ${((this.testResults.passed / (this.testResults.passed + this.testResults.failed)) * 100).toFixed(1)}%`);
    
    if (this.testResults.errors.length > 0) {
      this.log('\n🔍 FAILED TESTS:', 'error');
      this.testResults.errors.forEach((error, index) => {
        this.log(`${index + 1}. ${error.description}: ${error.error}`, 'error');
      });
    }
    
    if (this.testResults.failed === 0) {
      this.log('\n🎉 ALL TESTS PASSED! Server is fully functional.', 'success');
    } else {
      this.log('\n⚠️ Some tests failed. Please review the errors above.', 'error');
    }
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  const tester = new ServerTester();
  tester.runAllTests().then(() => {
    process.exit(tester.testResults.failed === 0 ? 0 : 1);
  }).catch((error) => {
    console.error('Test runner failed:', error);
    process.exit(1);
  });
}

module.exports = ServerTester;
