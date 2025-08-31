import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/fonts';

const StatusBadge = ({ 
  status, 
  color, 
  size = 'medium',
  variant = 'filled',
  style 
}) => {
  const getStatusColor = (status) => {
    if (color) return color;
    
    switch (status.toLowerCase()) {
      case 'pending':
        return COLORS.warning;
      case 'reviewing':
        return COLORS.info;
      case 'accepted':
      case 'approved':
      case 'active':
        return COLORS.success;
      case 'rejected':
      case 'declined':
      case 'inactive':
        return COLORS.error;
      case 'full-time':
      case 'part-time':
      case 'contract':
      case 'internship':
        return COLORS.primary;
      case 'remote':
        return COLORS.success;
      case 'on-site':
      case 'onsite':
        return COLORS.info;
      case 'hybrid':
        return COLORS.secondary;
      default:
        return COLORS.textSecondary;
    }
  };

  const getContainerStyle = () => {
    const statusColor = getStatusColor(status);
    const baseStyle = [styles.container, styles[size]];
    
    if (variant === 'filled') {
      baseStyle.push({
        backgroundColor: statusColor,
      });
    } else if (variant === 'outline') {
      baseStyle.push({
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: statusColor,
      });
    } else if (variant === 'light') {
      baseStyle.push({
        backgroundColor: `${statusColor}20`, // 20% opacity
      });
    }

    return baseStyle;
  };

  const getTextStyle = () => {
    const statusColor = getStatusColor(status);
    const baseStyle = [styles.text, styles[`${size}Text`]];
    
    if (variant === 'filled') {
      baseStyle.push({
        color: COLORS.white,
      });
    } else {
      baseStyle.push({
        color: statusColor,
      });
    }

    return baseStyle;
  };

  const formatStatus = (status) => {
    return status
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <View style={[getContainerStyle(), style]}>
      <Text style={getTextStyle()}>
        {formatStatus(status)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  
  // Sizes
  small: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  medium: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  large: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },

  // Text styles
  text: {
    fontFamily: FONTS.medium,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 10,
  },
  mediumText: {
    fontSize: 12,
  },
  largeText: {
    fontSize: 14,
  },
});

export default StatusBadge;

