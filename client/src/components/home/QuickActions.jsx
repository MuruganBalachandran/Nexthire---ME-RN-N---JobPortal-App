import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';

const { width } = Dimensions.get('window');

const QuickActions = ({ isJobSeeker, navigation }) => (
  <View style={styles.quickActionsContainer}>
    <Text style={styles.sectionTitle}>Quick Actions</Text>
    <View style={styles.actionGrid}>
      {isJobSeeker ? (
        <>
          <QuickAction
            icon="search"
            title="Browse Jobs"
            subtitle="Find opportunities"
            color={COLORS.primary}
            onPress={() => navigation.navigate('Jobs')}
          />
          <QuickAction
            icon="assignment-turned-in"
            title="Applications"
            subtitle="Track status"
            color={COLORS.success}
            onPress={() => navigation.navigate('Applications')}
          />
          <QuickAction
            icon="person"
            title="Profile"
            subtitle="View profile"
            color={COLORS.warning}
            onPress={() => navigation.navigate('Profile')}
          />
          <QuickAction
            icon="notifications-active"
            title="Job Alerts"
            subtitle="Get notified"
            color={COLORS.info}
            onPress={() => Alert.alert('Coming Soon', 'Job Alerts will be available in a future update.')}
          />
        </>
      ) : (
        <>
          <QuickAction
            icon="add-circle-outline"
            title="Post Job"
            subtitle="Create listing"
            color={COLORS.primary}
            onPress={() => navigation.navigate('PostJob')}
          />
          <QuickAction
            icon="people-outline"
            title="Applications"
            subtitle="Review candidates"
            color={COLORS.success}
            onPress={() => navigation.navigate('Applications')}
          />
          <QuickAction
            icon="person"
            title="Profile"
            subtitle="View profile"
            color={COLORS.warning}
            onPress={() => navigation.navigate('Profile')}
          />
          <QuickAction
            icon="settings"
            title="Settings"
            subtitle="Manage account"
            color={COLORS.textSecondary}
            onPress={() => navigation.navigate('Settings')}
          />
        </>
      )}
    </View>
  </View>
);

const QuickAction = ({ icon, title, subtitle, color, onPress }) => (
  <TouchableOpacity style={styles.actionCard} onPress={onPress} activeOpacity={0.7}>
    <View style={[styles.actionIconContainer, { backgroundColor: `${color}15` }]}>
      <Icon name={icon} size={24} color={color} />
    </View>
    <Text style={styles.actionTitle} numberOfLines={1}>
      {title}
    </Text>
    <Text style={styles.actionSubtitle} numberOfLines={1}>
      {subtitle}
    </Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  quickActionsContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  actionCard: {
    backgroundColor: COLORS.white,
    width: (width - 56) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
    textAlign: 'center',
  },
  actionSubtitle: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});

export default QuickActions;
