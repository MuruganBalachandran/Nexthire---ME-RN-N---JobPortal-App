import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const MenuItem = ({ item, isLast }) => {
  const handlePress = () => {
    if (typeof item.onPress === 'function') {
      item.onPress();
    } else {
      Alert.alert('Coming Soon', 'This feature will be available in a future update.');
    }
  };
  return (
    <TouchableOpacity style={[styles.menuItem, isLast && styles.lastMenuItem]} onPress={handlePress}>
      <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
        <Icon name={item.icon} size={22} color={item.color} />
        {item.badge && <View style={styles.menuItemBadge} />}
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <View style={styles.chevronContainer}>
        <Icon name="chevron-right" size={22} color={COLORS.gray400} />
      </View>
    </TouchableOpacity>
  );
};

const MenuSection = ({ title, items, isLastSection }) => (
  <View style={[styles.menuSection, isLastSection && styles.lastMenuSection]}>
    <View style={styles.sectionHeaderContainer}>
      <Text style={styles.sectionTitle}>{title}</Text>
      <View style={styles.sectionUnderline} />
    </View>
    <View style={styles.menuContainer}>
      {items.map((item, index) => (
        <MenuItem key={index} item={item} isLast={index === items.length - 1} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  menuSection: {
    marginTop: 32,
  },
  lastMenuSection: {
    marginBottom: 24,
  },
  sectionHeaderContainer: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionUnderline: {
    width: 30,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  menuContainer: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    position: 'relative',
  },
  menuItemBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ff4757',
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  menuSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MenuSection;
