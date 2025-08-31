// Form validation utilities

import { PATTERNS } from './constants';

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {boolean} True if email is valid
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') return false;
  return PATTERNS.email.test(email.trim());
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {boolean} True if phone is valid
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') return false;
  return PATTERNS.phone.test(phone.trim());
};

/**
 * Validate URL
 * @param {string} url - URL to validate
 * @returns {boolean} True if URL is valid
 */
export const validateUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  return PATTERNS.url.test(url.trim());
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} Validation result with isValid boolean and errors array
 */
export const validatePassword = (password) => {
  const errors = [];
  
  if (!password || typeof password !== 'string') {
    errors.push('Password is required');
    return { isValid: false, errors };
  }

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (!/[@$!%*?&]/.test(password)) {
    errors.push('Password must contain at least one special character (@$!%*?&)');
  }

  return {
    isValid: errors.length === 0,
    errors,
    strength: getPasswordStrength(password)
  };
};

/**
 * Get password strength level
 * @param {string} password - Password to check
 * @returns {string} Strength level ('weak', 'medium', 'strong')
 */
const getPasswordStrength = (password) => {
  if (!password) return 'weak';
  
  let score = 0;
  
  // Length check
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  
  // Character variety checks
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/\d/.test(password)) score++;
  if (/[@$!%*?&]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
};

/**
 * Validate required field
 * @param {string} value - Value to validate
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} Validation result
 */
export const validateRequired = (value, fieldName = 'Field') => {
  const isValid = value && typeof value === 'string' && value.trim().length > 0;
  return {
    isValid,
    error: isValid ? null : `${fieldName} is required`
  };
};

/**
 * Validate minimum length
 * @param {string} value - Value to validate
 * @param {number} minLength - Minimum required length
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} Validation result
 */
export const validateMinLength = (value, minLength, fieldName = 'Field') => {
  if (!value || typeof value !== 'string') {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const isValid = value.trim().length >= minLength;
  return {
    isValid,
    error: isValid ? null : `${fieldName} must be at least ${minLength} characters long`
  };
};

/**
 * Validate maximum length
 * @param {string} value - Value to validate
 * @param {number} maxLength - Maximum allowed length
 * @param {string} fieldName - Name of the field for error message
 * @returns {object} Validation result
 */
export const validateMaxLength = (value, maxLength, fieldName = 'Field') => {
  if (!value || typeof value !== 'string') return { isValid: true, error: null };
  
  const isValid = value.trim().length <= maxLength;
  return {
    isValid,
    error: isValid ? null : `${fieldName} must not exceed ${maxLength} characters`
  };
};

/**
 * Validate numeric value
 * @param {string|number} value - Value to validate
 * @param {object} options - Validation options (min, max, integer)
 * @returns {object} Validation result
 */
export const validateNumeric = (value, options = {}) => {
  const { min, max, integer = false, fieldName = 'Field' } = options;
  
  if (value === '' || value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, error: `${fieldName} must be a valid number` };
  }
  
  if (integer && !Number.isInteger(numValue)) {
    return { isValid: false, error: `${fieldName} must be a whole number` };
  }
  
  if (min !== undefined && numValue < min) {
    return { isValid: false, error: `${fieldName} must be at least ${min}` };
  }
  
  if (max !== undefined && numValue > max) {
    return { isValid: false, error: `${fieldName} must not exceed ${max}` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate date
 * @param {string|Date} date - Date to validate
 * @param {object} options - Validation options (minDate, maxDate, future, past)
 * @returns {object} Validation result
 */
export const validateDate = (date, options = {}) => {
  const { minDate, maxDate, future = false, past = false, fieldName = 'Date' } = options;
  
  if (!date) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return { isValid: false, error: `${fieldName} must be a valid date` };
  }
  
  const now = new Date();
  
  if (future && dateObj <= now) {
    return { isValid: false, error: `${fieldName} must be in the future` };
  }
  
  if (past && dateObj >= now) {
    return { isValid: false, error: `${fieldName} must be in the past` };
  }
  
  if (minDate && dateObj < minDate) {
    return { isValid: false, error: `${fieldName} must be after ${minDate.toDateString()}` };
  }
  
  if (maxDate && dateObj > maxDate) {
    return { isValid: false, error: `${fieldName} must be before ${maxDate.toDateString()}` };
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate file upload
 * @param {object} file - File object to validate
 * @param {object} options - Validation options (maxSize, allowedTypes)
 * @returns {object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const { maxSize, allowedTypes, fieldName = 'File' } = options;
  
  if (!file) {
    return { isValid: false, error: `${fieldName} is required` };
  }
  
  if (maxSize && file.size > maxSize) {
    const maxSizeMB = Math.round(maxSize / (1024 * 1024));
    return { isValid: false, error: `${fieldName} size must not exceed ${maxSizeMB}MB` };
  }
  
  if (allowedTypes && allowedTypes.length > 0) {
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!allowedTypes.includes(fileExtension)) {
      return { 
        isValid: false, 
        error: `${fieldName} must be one of: ${allowedTypes.join(', ')}` 
      };
    }
  }
  
  return { isValid: true, error: null };
};

/**
 * Validate form object with multiple fields
 * @param {object} formData - Form data to validate
 * @param {object} validationRules - Validation rules for each field
 * @returns {object} Validation result with errors object
 */
export const validateForm = (formData, validationRules) => {
  const errors = {};
  let isValid = true;
  
  Object.keys(validationRules).forEach(fieldName => {
    const rules = validationRules[fieldName];
    const value = formData[fieldName];
    
    // Check each rule for the field
    for (const rule of rules) {
      const result = rule(value);
      if (!result.isValid) {
        errors[fieldName] = result.error;
        isValid = false;
        break; // Stop at first error for this field
      }
    }
  });
  
  return { isValid, errors };
};

/**
 * Create validation rule for required field
 * @param {string} fieldName - Name of the field
 * @returns {function} Validation function
 */
export const required = (fieldName) => (value) => validateRequired(value, fieldName);

/**
 * Create validation rule for email field
 * @param {string} fieldName - Name of the field
 * @returns {function} Validation function
 */
export const email = (fieldName = 'Email') => (value) => {
  if (!value) return { isValid: true, error: null }; // Optional field
  return {
    isValid: validateEmail(value),
    error: validateEmail(value) ? null : `${fieldName} must be a valid email address`
  };
};

/**
 * Create validation rule for phone field
 * @param {string} fieldName - Name of the field
 * @returns {function} Validation function
 */
export const phone = (fieldName = 'Phone') => (value) => {
  if (!value) return { isValid: true, error: null }; // Optional field
  return {
    isValid: validatePhone(value),
    error: validatePhone(value) ? null : `${fieldName} must be a valid phone number`
  };
};

/**
 * Create validation rule for minimum length
 * @param {number} minLength - Minimum length required
 * @param {string} fieldName - Name of the field
 * @returns {function} Validation function
 */
export const minLength = (minLength, fieldName) => (value) => 
  validateMinLength(value, minLength, fieldName);

/**
 * Create validation rule for maximum length
 * @param {number} maxLength - Maximum length allowed
 * @param {string} fieldName - Name of the field
 * @returns {function} Validation function
 */
export const maxLength = (maxLength, fieldName) => (value) => 
  validateMaxLength(value, maxLength, fieldName);

/**
 * Create validation rule for numeric values
 * @param {object} options - Validation options
 * @returns {function} Validation function
 */
export const numeric = (options) => (value) => validateNumeric(value, options);

export default {
  validateEmail,
  validatePhone,
  validateUrl,
  validatePassword,
  validateRequired,
  validateMinLength,
  validateMaxLength,
  validateNumeric,
  validateDate,
  validateFile,
  validateForm,
  required,
  email,
  phone,
  minLength,
  maxLength,
  numeric,
};

