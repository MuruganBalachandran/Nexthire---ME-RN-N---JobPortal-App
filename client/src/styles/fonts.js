// Font configuration for the Job Portal app

export const FONTS = {
  // Font families
  regular: 'System',
  medium: 'System',
  bold: 'System',
  light: 'System',
  
  // For iOS, you might want to use:
  // regular: 'SF Pro Text',
  // medium: 'SF Pro Text Medium',
  // bold: 'SF Pro Text Bold',
  // light: 'SF Pro Text Light',
  
  // For Android, you might want to use:
  // regular: 'Roboto-Regular',
  // medium: 'Roboto-Medium',
  // bold: 'Roboto-Bold',
  // light: 'Roboto-Light',
};

// Font sizes
export const FONT_SIZES = {
  // Headings
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  h6: 16,
  
  // Body text
  large: 18,
  medium: 16,
  regular: 14,
  small: 12,
  tiny: 10,
  
  // Specific use cases
  title: 24,
  subtitle: 18,
  body: 16,
  caption: 12,
  button: 16,
  input: 16,
  label: 14,
  helper: 12,
  error: 12,
};

// Line heights
export const LINE_HEIGHTS = {
  tight: 1.2,
  normal: 1.4,
  relaxed: 1.6,
  loose: 1.8,
  
  // Specific sizes
  h1: 40,
  h2: 36,
  h3: 32,
  h4: 28,
  h5: 24,
  h6: 22,
  
  large: 26,
  medium: 22,
  regular: 20,
  small: 16,
  tiny: 14,
};

// Font weights
export const FONT_WEIGHTS = {
  light: '300',
  normal: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  extrabold: '800',
};

// Text styles for common use cases
export const TEXT_STYLES = {
  // Headings
  h1: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.h1,
    lineHeight: LINE_HEIGHTS.h1,
    fontWeight: FONT_WEIGHTS.bold,
  },
  h2: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.h2,
    lineHeight: LINE_HEIGHTS.h2,
    fontWeight: FONT_WEIGHTS.bold,
  },
  h3: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.h3,
    lineHeight: LINE_HEIGHTS.h3,
    fontWeight: FONT_WEIGHTS.bold,
  },
  h4: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.h4,
    lineHeight: LINE_HEIGHTS.h4,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  h5: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.h5,
    lineHeight: LINE_HEIGHTS.h5,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  h6: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.h6,
    lineHeight: LINE_HEIGHTS.h6,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  
  // Body text
  bodyLarge: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.large,
    lineHeight: LINE_HEIGHTS.large,
    fontWeight: FONT_WEIGHTS.normal,
  },
  bodyMedium: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.medium,
    lineHeight: LINE_HEIGHTS.medium,
    fontWeight: FONT_WEIGHTS.normal,
  },
  bodyRegular: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.regular,
    lineHeight: LINE_HEIGHTS.regular,
    fontWeight: FONT_WEIGHTS.normal,
  },
  bodySmall: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.small,
    lineHeight: LINE_HEIGHTS.small,
    fontWeight: FONT_WEIGHTS.normal,
  },
  
  // Special text styles
  title: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.title,
    lineHeight: LINE_HEIGHTS.h3,
    fontWeight: FONT_WEIGHTS.bold,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.subtitle,
    lineHeight: LINE_HEIGHTS.h5,
    fontWeight: FONT_WEIGHTS.medium,
  },
  caption: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.caption,
    lineHeight: LINE_HEIGHTS.small,
    fontWeight: FONT_WEIGHTS.normal,
  },
  overline: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.small,
    lineHeight: LINE_HEIGHTS.small,
    fontWeight: FONT_WEIGHTS.medium,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  
  // Button text
  buttonLarge: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.large,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  buttonMedium: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.button,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  buttonSmall: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.regular,
    fontWeight: FONT_WEIGHTS.medium,
  },
  
  // Input text
  input: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.input,
    fontWeight: FONT_WEIGHTS.normal,
  },
  inputLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.label,
    fontWeight: FONT_WEIGHTS.medium,
  },
  inputHelper: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.helper,
    fontWeight: FONT_WEIGHTS.normal,
  },
  inputError: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.error,
    fontWeight: FONT_WEIGHTS.normal,
  },
  
  // Navigation text
  tabLabel: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.medium,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.h5,
    fontWeight: FONT_WEIGHTS.bold,
  },
  
  // Card text
  cardTitle: {
    fontFamily: FONTS.bold,
    fontSize: FONT_SIZES.h6,
    fontWeight: FONT_WEIGHTS.bold,
  },
  cardSubtitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.regular,
    fontWeight: FONT_WEIGHTS.medium,
  },
  cardBody: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.regular,
    fontWeight: FONT_WEIGHTS.normal,
  },
  
  // List text
  listTitle: {
    fontFamily: FONTS.medium,
    fontSize: FONT_SIZES.medium,
    fontWeight: FONT_WEIGHTS.semibold,
  },
  listSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.regular,
    fontWeight: FONT_WEIGHTS.normal,
  },
  listCaption: {
    fontFamily: FONTS.regular,
    fontSize: FONT_SIZES.small,
    fontWeight: FONT_WEIGHTS.normal,
  },
};

// Typography utility functions
export const getTextStyle = (variant) => {
  return TEXT_STYLES[variant] || TEXT_STYLES.bodyRegular;
};

export const createTextStyle = (options = {}) => {
  const {
    family = FONTS.regular,
    size = FONT_SIZES.regular,
    weight = FONT_WEIGHTS.normal,
    lineHeight,
    letterSpacing,
    textTransform,
  } = options;
  
  return {
    fontFamily: family,
    fontSize: size,
    fontWeight: weight,
    ...(lineHeight && { lineHeight }),
    ...(letterSpacing && { letterSpacing }),
    ...(textTransform && { textTransform }),
  };
};

// Responsive font scaling (for different screen sizes)
export const scaleFont = (size, scaleFactor = 1) => {
  return Math.round(size * scaleFactor);
};

// Platform-specific font adjustments
export const getPlatformFont = (fontFamily) => {
  // You can implement platform-specific font logic here
  // For now, returning the same font for all platforms
  return fontFamily;
};

export default {
  FONTS,
  FONT_SIZES,
  LINE_HEIGHTS,
  FONT_WEIGHTS,
  TEXT_STYLES,
  getTextStyle,
  createTextStyle,
  scaleFont,
  getPlatformFont,
};

