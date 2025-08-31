import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';

const StatItem = ({ icon, color, number, label, badge }) => (
  <View style={styles.statItem}>
    <View style={[styles.statIconContainer, { backgroundColor: color + '15' }]}>
      <Icon name={icon} size={24} color={color} />
      {badge && <View style={styles.statBadge} />}
    </View>
    <Text style={[styles.statNumber, { color }]}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const StatsCard = ({ stats, unreadNotifications }) => (
  <View style={styles.statsCard}>
    <StatItem icon="work" color="#4CAF50" number={stats.applied} label="Applied" />
    <View style={styles.statDivider} />
    <StatItem icon="question-answer" color="#2196F3" number={stats.interviews} label="Interviews" />
    <View style={styles.statDivider} />
    <StatItem icon="notifications" color="#FF9800" number={unreadNotifications} label="Updates" badge={unreadNotifications > 0} />
  </View>
);

const styles = StyleSheet.create({
  statsCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    marginTop: -40,
    borderRadius: 20,
    paddingVertical: 24,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    zIndex: 1,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    position: 'relative',
  },
  statBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ff4757',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.border,
    marginVertical: 16,
  },
});

export default StatsCard;
