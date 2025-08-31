// Date formatting utilities

/**
 * Format a date string into a human-readable format
 * @param {string|Date} date - The date to format
 * @param {string} format - The format type ('short', 'long', 'relative', 'time')
 * @returns {string} Formatted date string
 */
export const formatDate = (date, format = 'short') => {
  if (!date) return '';

  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const now = new Date();
  const diffInMs = now.getTime() - dateObj.getTime();
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));

  switch (format) {
    case 'relative':
      return formatRelativeDate(diffInMinutes, diffInHours, diffInDays, dateObj);
    
    case 'short':
      return formatShortDate(dateObj);
    
    case 'long':
      return formatLongDate(dateObj);
    
    case 'time':
      return formatTime(dateObj);
    
    case 'datetime':
      return formatDateTime(dateObj);
    
    default:
      return formatShortDate(dateObj);
  }
};

/**
 * Format date in relative terms (e.g., "2 hours ago", "yesterday")
 */
const formatRelativeDate = (diffInMinutes, diffInHours, diffInDays, dateObj) => {
  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes === 1 ? '' : 's'} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours === 1 ? '' : 's'} ago`;
  } else if (diffInDays === 1) {
    return 'Yesterday';
  } else if (diffInDays < 7) {
    return `${diffInDays} day${diffInDays === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 30) {
    const weeks = Math.floor(diffInDays / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'} ago`;
  } else if (diffInDays < 365) {
    const months = Math.floor(diffInDays / 30);
    return `${months} month${months === 1 ? '' : 's'} ago`;
  } else {
    const years = Math.floor(diffInDays / 365);
    return `${years} year${years === 1 ? '' : 's'} ago`;
  }
};

/**
 * Format date in short format (e.g., "Jan 15, 2024")
 */
const formatShortDate = (dateObj) => {
  const months = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];
  
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  
  return `${month} ${day}, ${year}`;
};

/**
 * Format date in long format (e.g., "January 15, 2024")
 */
const formatLongDate = (dateObj) => {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  
  const month = months[dateObj.getMonth()];
  const day = dateObj.getDate();
  const year = dateObj.getFullYear();
  
  return `${month} ${day}, ${year}`;
};

/**
 * Format time (e.g., "2:30 PM")
 */
const formatTime = (dateObj) => {
  return dateObj.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date and time (e.g., "Jan 15, 2024 at 2:30 PM")
 */
const formatDateTime = (dateObj) => {
  return `${formatShortDate(dateObj)} at ${formatTime(dateObj)}`;
};

/**
 * Get the start of day for a given date
 * @param {Date} date - The date
 * @returns {Date} Start of day
 */
export const getStartOfDay = (date = new Date()) => {
  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);
  return startOfDay;
};

/**
 * Get the end of day for a given date
 * @param {Date} date - The date
 * @returns {Date} End of day
 */
export const getEndOfDay = (date = new Date()) => {
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);
  return endOfDay;
};

/**
 * Check if a date is today
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is today
 */
export const isToday = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();
  
  return dateObj.getDate() === today.getDate() &&
         dateObj.getMonth() === today.getMonth() &&
         dateObj.getFullYear() === today.getFullYear();
};

/**
 * Check if a date is yesterday
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is yesterday
 */
export const isYesterday = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  return dateObj.getDate() === yesterday.getDate() &&
         dateObj.getMonth() === yesterday.getMonth() &&
         dateObj.getFullYear() === yesterday.getFullYear();
};

/**
 * Check if a date is within the last week
 * @param {string|Date} date - The date to check
 * @returns {boolean} True if the date is within the last week
 */
export const isThisWeek = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const weekAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
  
  return dateObj >= weekAgo && dateObj <= now;
};

/**
 * Get the difference between two dates in days
 * @param {string|Date} date1 - First date
 * @param {string|Date} date2 - Second date
 * @returns {number} Difference in days
 */
export const getDaysDifference = (date1, date2) => {
  const dateObj1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const dateObj2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffInMs = Math.abs(dateObj2.getTime() - dateObj1.getTime());
  return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
};

/**
 * Add days to a date
 * @param {string|Date} date - The base date
 * @param {number} days - Number of days to add
 * @returns {Date} New date with added days
 */
export const addDays = (date, days) => {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
};

/**
 * Format a date for API usage (ISO string)
 * @param {string|Date} date - The date to format
 * @returns {string} ISO formatted date string
 */
export const formatForAPI = (date) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.toISOString();
};

/**
 * Parse a date string safely
 * @param {string} dateString - The date string to parse
 * @returns {Date|null} Parsed date or null if invalid
 */
export const parseDate = (dateString) => {
  if (!dateString) return null;
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? null : date;
};

export default formatDate;

