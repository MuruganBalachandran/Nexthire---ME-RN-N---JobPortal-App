// Enhanced attractive color palette for the Job Portal app

export const COLORS = {
  // Primary colors (Modern vibrant purple-blue gradient)
  primary: '#6366f1',
  primaryLight: '#f0f4ff',
  primaryDark: '#4338ca',
  
  // Secondary colors (Electric coral/pink)
  secondary: '#f472b6',
  secondaryLight: '#fdf2f8',
  secondaryDark: '#ec4899',
  
  // Status colors (Fresh and vibrant)
  success: '#10b981',
  successLight: '#ecfdf5',
  successDark: '#059669',
  
  error: '#ef4444',
  errorLight: '#fef2f2',
  errorDark: '#dc2626',
  
  warning: '#f59e0b',
  warningLight: '#fffbeb',
  warningDark: '#d97706',
  
  info: '#06b6d4',
  infoLight: '#f0fdfa',
  infoDark: '#0891b2',
  
  // Neutral colors
  white: '#ffffff',
  black: '#000000',
  
  // Gray scale (Warmer tones)
  gray50: '#fafaf9',
  gray100: '#f5f5f4',
  gray200: '#e7e5e4',
  gray300: '#d6d3d1',
  gray400: '#a8a29e',
  gray500: '#78716c',
  gray600: '#57534e',
  gray700: '#44403c',
  gray800: '#292524',
  gray900: '#1c1917',
  
  // Text colors
  text: '#1c1917',
  textSecondary: '#57534e',
  textDisabled: '#a8a29e',
  textOnPrimary: '#ffffff',
  textOnSecondary: '#ffffff',
  
  // Background colors (Modern and clean)
  background: '#fafaf9',
  backgroundSecondary: '#ffffff',
  surface: '#ffffff',
  
  // Border colors
  border: '#e7e5e4',
  borderLight: '#f5f5f4',
  borderDark: '#a8a29e',
  
  // Input colors
  inputBackground: '#f9fafb',
  inputBorder: '#d1d5db',
  inputFocused: '#6366f1',
  inputError: '#ef4444',
  
  // Card colors
  cardBackground: '#ffffff',
  cardShadow: 'rgba(0, 0, 0, 0.08)',
  
  // Button colors (Vibrant and modern)
  buttonPrimary: '#6366f1',
  buttonSecondary: '#f472b6',
  buttonDisabled: '#a8a29e',
  buttonText: '#ffffff',
  buttonTextDisabled: '#57534e',
  
  // Navigation colors (Modern purple theme)
  tabBarActive: '#6366f1',
  tabBarInactive: '#57534e',
  tabBarBackground: '#ffffff',
  headerBackground: '#6366f1',
  headerText: '#ffffff',
  
  // Job status colors (Vibrant and distinct)
  jobActive: '#10b981',
  jobPaused: '#f59e0b',
  jobClosed: '#ef4444',
  jobDraft: '#78716c',
  
  // Application status colors (Modern and appealing)
  applicationPending: '#f59e0b',
  applicationReviewing: '#06b6d4',
  applicationInterview: '#8b5cf6',
  applicationAccepted: '#10b981',
  applicationRejected: '#ef4444',
  applicationWithdrawn: '#78716c',
  
  // Job type colors (Colorful and distinctive)
  fullTime: '#6366f1',
  partTime: '#f472b6',
  contract: '#8b5cf6',
  internship: '#10b981',
  freelance: '#f59e0b',
  
  // Work arrangement colors (Fresh and modern)
  remote: '#10b981',
  onsite: '#06b6d4',
  hybrid: '#8b5cf6',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',
  overlayDark: 'rgba(0, 0, 0, 0.7)',
  
  // Transparent colors
  transparent: 'transparent',
  
  // Social media colors (Updated and vibrant)
  linkedin: '#0a66c2',
  github: '#24292f',
  twitter: '#1d9bf0',
  facebook: '#1877f2',
  google: '#ea4335',
  
  // Gradient colors (Modern and eye-catching)
  gradientPrimary: ['#6366f1', '#8b5cf6'],
  gradientSecondary: ['#f472b6', '#ec4899'],
  gradientSuccess: ['#10b981', '#059669'],
  gradientError: ['#ef4444', '#dc2626'],
  
  // Chart colors (Vibrant and harmonious)
  chart1: '#6366f1',
  chart2: '#10b981',
  chart3: '#f472b6',
  chart4: '#f59e0b',
  chart5: '#8b5cf6',
  chart6: '#06b6d4',
  chart7: '#84cc16',
  chart8: '#f97316',
};

// Color themes
export const LIGHT_THEME = {
  ...COLORS,
  background: '#fafaf9',
  surface: '#ffffff',
  text: '#1c1917',
  textSecondary: '#57534e',
  border: '#e7e5e4',
};

export const DARK_THEME = {
  ...COLORS,
  background: '#0f0f23',
  surface: '#1a1a2e',
  text: '#ffffff',
  textSecondary: '#a8a29e',
  border: '#374151',
  cardBackground: '#1a1a2e',
  inputBackground: '#374151',
  tabBarBackground: '#1a1a2e',
  primary: '#8b5cf6',
  secondary: '#f472b6',
  success: '#34d399',
  error: '#f87171',
  warning: '#fbbf24',
  info: '#22d3ee',
};

// Utility functions for colors
export const hexToRgba = (hex, alpha = 1) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

export const getStatusColor = (status) => {
  const statusColors = {
    active: COLORS.success,
    inactive: COLORS.error,
    pending: COLORS.warning,
    approved: COLORS.success,
    rejected: COLORS.error,
    draft: COLORS.gray500,
    published: COLORS.success,
    archived: COLORS.gray500,
  };
  
  return statusColors[status.toLowerCase()] || COLORS.gray500;
};

export const getJobTypeColor = (type) => {
  const typeColors = {
    'full-time': COLORS.fullTime,
    'part-time': COLORS.partTime,
    'contract': COLORS.contract,
    'internship': COLORS.internship,
    'freelance': COLORS.freelance,
  };
  
  return typeColors[type.toLowerCase()] || COLORS.primary;
};

export const getApplicationStatusColor = (status) => {
  const statusColors = {
    pending: COLORS.applicationPending,
    reviewing: COLORS.applicationReviewing,
    interview: COLORS.applicationInterview,
    accepted: COLORS.applicationAccepted,
    rejected: COLORS.applicationRejected,
    withdrawn: COLORS.applicationWithdrawn,
  };
  
  return statusColors[status.toLowerCase()] || COLORS.gray500;
};

export default COLORS;