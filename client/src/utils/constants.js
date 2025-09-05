// App-wide constants

// Job types
export const JOB_TYPES = [
  { label: 'Full-time', value: 'full-time' },
  { label: 'Part-time', value: 'part-time' },
  { label: 'Contract', value: 'contract' },
  { label: 'Internship', value: 'internship' },
  { label: 'Freelance', value: 'freelance' },
];

// Experience levels
export const EXPERIENCE_LEVELS = [
  { label: 'Entry-level (0-2 years)', value: 'entry' },
  { label: 'Mid-level (2-5 years)', value: 'mid' },
  { label: 'Senior (5+ years)', value: 'senior' },
  { label: 'Lead/Principal (8+ years)', value: 'lead' },
  { label: 'Executive', value: 'executive' },
];

// Application statuses
export const APPLICATION_STATUSES = [
  { label: 'Pending', value: 'pending', color: '#FF9800' },
  { label: 'Reviewing', value: 'reviewing', color: '#2196F3' },
  { label: 'Interviewed', value: 'interviewed', color: '#9C27B0' },
  { label: 'Accepted', value: 'accepted', color: '#4CAF50' },
  { label: 'Rejected', value: 'rejected', color: '#F44336' },
  { label: 'Withdrawn', value: 'withdrawn', color: '#757575' },
];

// Job statuses
export const JOB_STATUSES = [
  { label: 'Active', value: 'active', color: '#4CAF50' },
  { label: 'Paused', value: 'paused', color: '#FF9800' },
  { label: 'Closed', value: 'closed', color: '#F44336' },
  { label: 'Draft', value: 'draft', color: '#757575' },
];

// User types
export const USER_TYPES = [
  { label: 'Job Seeker', value: 'jobseeker' },
  { label: 'Recruiter', value: 'recruiter' },
  { label: 'Admin', value: 'admin' },
];

// Work arrangements
export const WORK_ARRANGEMENTS = [
  { label: 'On-site', value: 'onsite' },
  { label: 'Remote', value: 'remote' },
  { label: 'Hybrid', value: 'hybrid' },
];

// Salary ranges (annual)
export const SALARY_RANGES = [
  { label: 'Under $50k', value: '0-50000' },
  { label: '$50k - $75k', value: '50000-75000' },
  { label: '$75k - $100k', value: '75000-100000' },
  { label: '$100k - $125k', value: '100000-125000' },
  { label: '$125k - $150k', value: '125000-150000' },
  { label: '$150k - $200k', value: '150000-200000' },
  { label: '$200k+', value: '200000+' },
];

// Popular job categories
export const JOB_CATEGORIES = [
  { label: 'Software Development', value: 'software-development' },
  { label: 'Mobile Development', value: 'mobile-development' },
  { label: 'Frontend Development', value: 'frontend-development' },
  { label: 'Backend Development', value: 'backend-development' },
  { label: 'Full Stack Development', value: 'fullstack-development' },
  { label: 'DevOps', value: 'devops' },
  { label: 'Data Science', value: 'data-science' },
  { label: 'Machine Learning', value: 'machine-learning' },
  { label: 'UI/UX Design', value: 'ui-ux-design' },
  { label: 'Product Management', value: 'product-management' },
  { label: 'Quality Assurance', value: 'quality-assurance' },
  { label: 'Cybersecurity', value: 'cybersecurity' },
];

// Popular skills
export const POPULAR_SKILLS = [
  'JavaScript',
  'React',
  'React Native',
  'Node.js',
  'Python',
  'Java',
  'TypeScript',
  'Swift',
  'Kotlin',
  'Flutter',
  'Angular',
  'Vue.js',
  'Express.js',
  'MongoDB',
  'PostgreSQL',
  'MySQL',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'Git',
  'GraphQL',
  'REST API',
  'Redux',
  'HTML',
  'CSS',
  'Sass',
  'Webpack',
  'Jest',
  'Cypress',
];

// Company sizes
export const COMPANY_SIZES = [
  { label: 'Startup (1-10)', value: 'startup' },
  { label: 'Small (11-50)', value: 'small' },
  { label: 'Medium (51-200)', value: 'medium' },
  { label: 'Large (201-1000)', value: 'large' },
  { label: 'Enterprise (1000+)', value: 'enterprise' },
];

// Industries
export const INDUSTRIES = [
  { label: 'Technology', value: 'technology' },
  { label: 'Healthcare', value: 'healthcare' },
  { label: 'Finance', value: 'finance' },
  { label: 'Education', value: 'education' },
  { label: 'E-commerce', value: 'ecommerce' },
  { label: 'Gaming', value: 'gaming' },
  { label: 'Media & Entertainment', value: 'media' },
  { label: 'Transportation', value: 'transportation' },
  { label: 'Real Estate', value: 'real-estate' },
  { label: 'Non-profit', value: 'non-profit' },
  { label: 'Government', value: 'government' },
  { label: 'Consulting', value: 'consulting' },
];

// Notification types
export const NOTIFICATION_TYPES = [
  { label: 'Application Update', value: 'application' },
  { label: 'New Job Match', value: 'job-match' },
  { label: 'Profile View', value: 'profile-view' },
  { label: 'Message', value: 'message' },
  { label: 'Interview Invite', value: 'interview' },
  { label: 'System Update', value: 'system' },
];

// App configuration
export const APP_CONFIG = {
  name: 'Job Portal',
  version: '1.0.0',
  supportEmail: 'support@jobportal.com',
  privacyPolicyUrl: 'https://jobportal.com/privacy',
  termsOfServiceUrl: 'https://jobportal.com/terms',
  maxFileUploadSize: 10 * 1024 * 1024, // 10MB
  supportedFileTypes: ['pdf', 'doc', 'docx'],
  maxApplicationsPerDay: 10,
  maxJobPostsPerMonth: 50,
};

// Regex patterns
export const PATTERNS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s\-\(\)]{10,}$/,
  url: /^https?:\/\/.+/,
  strongPassword: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// Date formats
export const DATE_FORMATS = {
  short: 'MMM DD, YYYY',
  long: 'MMMM DD, YYYY',
  withTime: 'MMM DD, YYYY HH:mm',
  timeOnly: 'HH:mm',
  iso: 'YYYY-MM-DDTHH:mm:ssZ',
};



// API base URL from .env (using react-native-dotenv for React Native)
import { API_BASE_URL as ENV_API_BASE_URL } from '@env';
export const API_BASE_URL = ENV_API_BASE_URL || "http://10.0.2.2:5000/api";

export const API_ENDPOINTS = {
  base: API_BASE_URL,
  auth: {
    login: '/auth/login',
    signup: '/auth/register', // Updated to match server route
    logout: '/auth/logout',
    refresh: '/auth/refresh',
    forgotPassword: '/auth/forgot-password',
    resetPassword: '/auth/reset-password',
  },
  users: {
    profile: '/users/profile',
    update: '/users/update',
    upload: '/users/upload',
  },
  jobs: {
    list: '/jobs',
    create: '/jobs',
    detail: '/jobs/:id',
    update: '/jobs/:id',
    delete: '/jobs/:id',
    search: '/jobs/search',
  },
  applications: {
    list: '/applications',
    create: '/applications',
    detail: '/applications/:id',
    update: '/applications/:id',
    byJob: '/applications/job/:jobId',
    byUser: '/applications/user/:userId',
  },
};

// Default values
export const DEFAULTS = {
  pagination: {
    limit: 20,
    offset: 0,
  },
  search: {
    debounceMs: 300,
    minQueryLength: 2,
  },
  cache: {
    ttl: 5 * 60 * 1000, // 5 minutes
  },
};

