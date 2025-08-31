import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Switch } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const SettingItem = ({ item, isLast }) => (
  <TouchableOpacity
    style={[styles.settingItem, isLast && styles.lastSettingItem]}
    onPress={item.onPress}
    disabled={item.type === 'switch'}
  >
    <View style={[styles.settingIconContainer, { backgroundColor: item.color + '15' }]}>
      <Icon 
        name={item.icon} 
        size={22} 
        color={item.color} 
      />
    </View>
    <View style={styles.settingContent}>
      <Text style={[styles.settingTitle, item.destructive && styles.destructiveText]}>
        {item.title}
      </Text>
      <Text style={[styles.settingSubtitle, item.destructive && styles.destructiveSubtext]}>
        {item.subtitle}
      </Text>
    </View>
    {item.type === 'switch' ? (
      <Switch
        value={item.value}
        onValueChange={item.onValueChange}
        trackColor={{ false: COLORS.gray300, true: item.color + '40' }}
        thumbColor={item.value ? item.color : COLORS.gray400}
        ios_backgroundColor={COLORS.gray300}
      />
    ) : (
      item.onPress && (
        <View style={styles.chevronContainer}>
          <Icon name="chevron-right" size={20} color={COLORS.gray400} />
        </View>
      )
    )}
  </TouchableOpacity>
);

const SettingsSection = ({ title, icon, items }) => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View style={styles.sectionHeaderContent}>
        <View style={styles.sectionIconContainer}>
          <Icon name={icon} size={20} color={COLORS.primary} />
        </View>
        <Text style={styles.sectionTitle}>{title}</Text>
      </View>
      <View style={styles.sectionDivider} />
    </View>
    <View style={styles.sectionContent}>
      {items.map((item, index) => (
        <SettingItem key={index} item={item} isLast={index === items.length - 1} />
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  section: {
    marginTop: 32,
  },
  sectionHeader: {
    marginHorizontal: 20,
    marginBottom: 16,
  },
  sectionHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary + '15',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
  sectionDivider: {
    height: 2,
    backgroundColor: COLORS.primary,
    width: 40,
    borderRadius: 1,
  },
  sectionContent: {
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
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.borderLight,
  },
  lastSettingItem: {
    borderBottomWidth: 0,
  },
  settingIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 4,
  },
  settingSubtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  destructiveText: {
    color: COLORS.error,
  },
  destructiveSubtext: {
    color: COLORS.error + '80',
  },
  chevronContainer: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SettingsSection;
