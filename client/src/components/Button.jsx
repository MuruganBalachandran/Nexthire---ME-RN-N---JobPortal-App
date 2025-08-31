import React, { useRef } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/fonts';
import { GRADIENTS } from '../styles/globalStyles';

const Button = ({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  icon,
  iconPosition = 'left',
  style,
  textStyle,
  ...props
}) => {
  const getButtonStyle = () => {
    const baseStyle = [styles.button, styles[size], styles.shadow];
    if (variant === 'outline') baseStyle.push(styles.outline);
    if (variant === 'ghost') baseStyle.push(styles.ghost);
    if (variant === 'danger') baseStyle.push(styles.danger);
    if (variant === 'secondary') baseStyle.push(styles.secondary);
    if (disabled || loading) baseStyle.push(styles.disabled);
    return baseStyle;
  };

  const getTextStyle = () => {
    const baseTextStyle = [styles.text, styles[`${size}Text`]];
    
    switch (variant) {
      case 'secondary':
        baseTextStyle.push(styles.secondaryText);
        break;
      case 'outline':
        baseTextStyle.push(styles.outlineText);
        break;
      case 'ghost':
        baseTextStyle.push(styles.ghostText);
        break;
      case 'danger':
        baseTextStyle.push(styles.dangerText);
        break;
      default:
        baseTextStyle.push(styles.primaryText);
    }

    if (disabled || loading) {
      baseTextStyle.push(styles.disabledText);
    }

    return baseTextStyle;
  };

  const getIconColor = () => {
    if (disabled || loading) return COLORS.textSecondary;
    
    switch (variant) {
      case 'outline':
      case 'ghost':
        return COLORS.primary;
      case 'danger':
        return COLORS.white;
      default:
        return COLORS.white;
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.loadingContainer}>
          <ActivityIndicator 
            size="small" 
            color={variant === 'outline' || variant === 'ghost' ? COLORS.primary : COLORS.white} 
          />
          <Text style={[getTextStyle(), { marginLeft: 8 }]}>
            {title}
          </Text>
        </View>
      );
    }

    const iconElement = icon && (
      <Icon 
        name={icon} 
        size={size === 'small' ? 16 : size === 'large' ? 24 : 20} 
        color={getIconColor()} 
      />
    );

    return (
      <View style={styles.contentContainer}>
        {icon && iconPosition === 'left' && iconElement}
        <Text style={[getTextStyle(), icon && { marginHorizontal: 8 }]}>
          {title}
        </Text>
        {icon && iconPosition === 'right' && iconElement}
      </View>
    );
  };

  // Animated press feedback
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.96,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  const gradientVariants = ['primary', 'accent'];
  const useGradient = gradientVariants.includes(variant) && !disabled && !loading;
  const gradientColors = variant === 'accent' ? GRADIENTS.accent : GRADIENTS.primary;

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[getButtonStyle(), style]}
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.85}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        {...props}
      >
        {useGradient ? (
          <LinearGradient
            colors={gradientColors}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[StyleSheet.absoluteFill, styles.gradient]}
          />
        ) : null}
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
          {renderContent()}
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 48,
  },
  large: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    minHeight: 56,
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: COLORS.secondary,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  danger: {
    backgroundColor: COLORS.error,
  },
  disabled: {
    backgroundColor: COLORS.disabled,
    borderColor: COLORS.disabled,
  },

  // Text styles
  text: {
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 14,
  },
  mediumText: {
    fontSize: 16,
  },
  largeText: {
    fontSize: 18,
  },
  primaryText: {
    color: COLORS.white,
  },
  secondaryText: {
    color: COLORS.white,
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: COLORS.primary,
  },
  dangerText: {
    color: COLORS.white,
  },
  disabledText: {
    color: COLORS.textSecondary,
  },

  // Content containers
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gradient: {
    borderRadius: 8,
    zIndex: -1,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
});

export default Button;

