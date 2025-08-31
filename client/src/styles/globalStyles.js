
// Gradient color sets for modern UI
export const GRADIENTS = {
  primary: ['#6a11cb', '#2575fc'],
  accent: ['#ff512f', '#dd2476'],
  success: ['#43e97b', '#38f9d7'],
  warning: ['#f7971e', '#ffd200'],
  info: ['#43cea2', '#185a9d'],
};

import { StyleSheet, Dimensions } from 'react-native';
import { COLORS } from './colors';
import { FONTS, FONT_SIZES, TEXT_STYLES } from './fonts';

// Screen dimensions
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Common spacing values
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

// Common border radius values
export const BORDER_RADIUS = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  round: 50,
};

// Common elevation/shadow values
export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

// Global styles
export const globalStyles = StyleSheet.create({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  safeAreaContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: COLORS.background,
  },
  
  // Layout styles
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rowCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  columnCenter: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  flex1: {
    flex: 1,
  },
  
  // Padding styles
  paddingXS: { padding: SPACING.xs },
  paddingSM: { padding: SPACING.sm },
  paddingMD: { padding: SPACING.md },
  paddingLG: { padding: SPACING.lg },
  paddingXL: { padding: SPACING.xl },
  
  paddingHorizontalXS: { paddingHorizontal: SPACING.xs },
  paddingHorizontalSM: { paddingHorizontal: SPACING.sm },
  paddingHorizontalMD: { paddingHorizontal: SPACING.md },
  paddingHorizontalLG: { paddingHorizontal: SPACING.lg },
  paddingHorizontalXL: { paddingHorizontal: SPACING.xl },
  
  paddingVerticalXS: { paddingVertical: SPACING.xs },
  paddingVerticalSM: { paddingVertical: SPACING.sm },
  paddingVerticalMD: { paddingVertical: SPACING.md },
  paddingVerticalLG: { paddingVertical: SPACING.lg },
  paddingVerticalXL: { paddingVertical: SPACING.xl },
  
  // Margin styles
  marginXS: { margin: SPACING.xs },
  marginSM: { margin: SPACING.sm },
  marginMD: { margin: SPACING.md },
  marginLG: { margin: SPACING.lg },
  marginXL: { margin: SPACING.xl },
  
  marginHorizontalXS: { marginHorizontal: SPACING.xs },
  marginHorizontalSM: { marginHorizontal: SPACING.sm },
  marginHorizontalMD: { marginHorizontal: SPACING.md },
  marginHorizontalLG: { marginHorizontal: SPACING.lg },
  marginHorizontalXL: { marginHorizontal: SPACING.xl },
  
  marginVerticalXS: { marginVertical: SPACING.xs },
  marginVerticalSM: { marginVertical: SPACING.sm },
  marginVerticalMD: { marginVertical: SPACING.md },
  marginVerticalLG: { marginVertical: SPACING.lg },
  marginVerticalXL: { marginVertical: SPACING.xl },
  
  marginTopXS: { marginTop: SPACING.xs },
  marginTopSM: { marginTop: SPACING.sm },
  marginTopMD: { marginTop: SPACING.md },
  marginTopLG: { marginTop: SPACING.lg },
  marginTopXL: { marginTop: SPACING.xl },
  
  marginBottomXS: { marginBottom: SPACING.xs },
  marginBottomSM: { marginBottom: SPACING.sm },
  marginBottomMD: { marginBottom: SPACING.md },
  marginBottomLG: { marginBottom: SPACING.lg },
  marginBottomXL: { marginBottom: SPACING.xl },
  
  // Text styles
  textCenter: { textAlign: 'center' },
  textLeft: { textAlign: 'left' },
  textRight: { textAlign: 'right' },
  textJustify: { textAlign: 'justify' },
  
  textPrimary: { color: COLORS.primary },
  textSecondary: { color: COLORS.textSecondary },
  textSuccess: { color: COLORS.success },
  textError: { color: COLORS.error },
  textWarning: { color: COLORS.warning },
  textWhite: { color: COLORS.white },
  textBlack: { color: COLORS.black },
  
  // Typography styles
  ...Object.keys(TEXT_STYLES).reduce((acc, key) => {
    acc[key] = TEXT_STYLES[key];
    return acc;
  }, {}),
  
  // Card styles
  card: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.medium,
  },
  cardSmall: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.sm,
    padding: SPACING.sm,
    ...SHADOWS.small,
  },
  cardLarge: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.large,
  },
  
  // Border styles
  border: {
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  borderTop: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  borderLeft: {
    borderLeftWidth: 1,
    borderLeftColor: COLORS.border,
  },
  borderRight: {
    borderRightWidth: 1,
    borderRightColor: COLORS.border,
  },
  
  // Rounded corners
  roundedXS: { borderRadius: BORDER_RADIUS.xs },
  roundedSM: { borderRadius: BORDER_RADIUS.sm },
  roundedMD: { borderRadius: BORDER_RADIUS.md },
  roundedLG: { borderRadius: BORDER_RADIUS.lg },
  roundedXL: { borderRadius: BORDER_RADIUS.xl },
  roundedFull: { borderRadius: BORDER_RADIUS.round },
  
  // Shadow styles
  shadowSmall: SHADOWS.small,
  shadowMedium: SHADOWS.medium,
  shadowLarge: SHADOWS.large,
  
  // Button base styles
  buttonBase: {
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Input base styles
  inputBase: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.sm,
    fontSize: FONT_SIZES.medium,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    backgroundColor: COLORS.inputBackground,
  },
  
  // List styles
  listItem: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  listItemLast: {
    borderBottomWidth: 0,
  },
  
  // Separator styles
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.sm,
  },
  separatorThick: {
    height: 2,
    backgroundColor: COLORS.border,
    marginVertical: SPACING.md,
  },
  
  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.overlay,
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    maxWidth: SCREEN_WIDTH * 0.9,
    maxHeight: SCREEN_HEIGHT * 0.8,
    ...SHADOWS.large,
  },
  
  // Header styles
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.lg,
  },
  gradientHeader: {
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },

  animatedCard: {
    backgroundColor: COLORS.cardBackground,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.large,
    marginBottom: SPACING.md,
    // For animation: transform/scale/opacity can be animated in component
  },
  headerTitle: {
    ...TEXT_STYLES.headerTitle,
    color: COLORS.white,
  },
  headerSubtitle: {
    ...TEXT_STYLES.bodyRegular,
    color: COLORS.white,
    opacity: 0.9,
  },
  
  // Status bar styles
  statusBarLight: {
    backgroundColor: COLORS.primary,
  },
  statusBarDark: {
    backgroundColor: COLORS.black,
  },
  
  // Utility styles
  absolute: {
    position: 'absolute',
  },
  relative: {
    position: 'relative',
  },
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
  },
  disabled: {
    opacity: 0.5,
  },
  
  // Screen-specific styles
  screenPadding: {
    paddingHorizontal: SPACING.md,
  },
  screenPaddingVertical: {
    paddingVertical: SPACING.md,
  },
  screenPaddingFull: {
    padding: SPACING.md,
  },
});

// Utility functions
export const getSpacing = (multiplier = 1) => SPACING.md * multiplier;

export const getResponsiveWidth = (percentage) => SCREEN_WIDTH * (percentage / 100);

export const getResponsiveHeight = (percentage) => SCREEN_HEIGHT * (percentage / 100);

export const isSmallScreen = () => SCREEN_WIDTH < 375;

export const isMediumScreen = () => SCREEN_WIDTH >= 375 && SCREEN_WIDTH < 414;

export const isLargeScreen = () => SCREEN_WIDTH >= 414;

// Export dimensions
export const DIMENSIONS = {
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};

export default {
  globalStyles,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
  DIMENSIONS,
  getSpacing,
  getResponsiveWidth,
  getResponsiveHeight,
  isSmallScreen,
  isMediumScreen,
  isLargeScreen,
};

