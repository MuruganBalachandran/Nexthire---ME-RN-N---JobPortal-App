import React from 'react';
import { TouchableOpacity, Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';

const FilterChip = ({ option, isSelected, onPress, unreadCount }) => (
  <TouchableOpacity
    style={[styles.filterChip, isSelected && styles.selectedFilterChip]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Icon
      name={option.icon}
      size={16}
      color={isSelected ? COLORS.white : COLORS.textSecondary}
    />
    <Text
      style={[styles.filterChipText, isSelected && styles.selectedFilterChipText]}
    >
      {option.label}
    </Text>
    {option.key === 'unread' && unreadCount > 0 && (
      <View style={styles.filterBadge}>
        <Text style={styles.filterBadgeText}>
          {unreadCount > 99 ? '99+' : unreadCount}
        </Text>
      </View>
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    gap: 6,
  },
  selectedFilterChip: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  selectedFilterChipText: {
    color: COLORS.white,
  },
  filterBadge: {
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#ff4757',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  filterBadgeText: {
    fontSize: 10,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
});

export default FilterChip;
