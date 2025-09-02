import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';

const StatsCard = ({ isJobSeeker, activeJobs = 0, candidates = 0, successRate = 0 }) => (
  <View style={styles.statsCard}>
    <View style={styles.statsContent}>
      <Text style={styles.statsTitle}>
        {isJobSeeker ? 'Your Job Search' : 'Your Hiring Stats'}
      </Text>
      <View style={styles.statsGrid}>
        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Icon
              name={isJobSeeker ? 'work-outline' : 'business'}
              size={20}
              color={COLORS.primary}
            />
          </View>
          <Text style={styles.statNumber}>
            {typeof activeJobs === 'number' ? activeJobs : 0}
          </Text>
          <Text style={styles.statLabel}>
            {isJobSeeker ? 'Available Jobs' : 'Active Jobs'}
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Icon
              name={isJobSeeker ? 'send' : 'people'}
              size={20}
              color={COLORS.success}
            />
          </View>
          <Text style={styles.statNumber}>
            {typeof candidates === 'number' ? candidates : 0}
          </Text>
          <Text style={styles.statLabel}>
            {isJobSeeker ? 'Applications' : 'Candidates'}
          </Text>
        </View>

        <View style={styles.statItem}>
          <View style={styles.statIconContainer}>
            <Icon
              name={isJobSeeker ? 'trending-up' : 'analytics'}
              size={20}
              color={COLORS.warning}
            />
          </View>
          <Text style={styles.statNumber}>
            {typeof successRate === 'number' ? `${successRate}%` : '0%'}
          </Text>
          <Text style={styles.statLabel}>
            {isJobSeeker ? 'Match Rate' : 'Success Rate'}
          </Text>
        </View>
      </View>
    </View>
    <View style={styles.statsDecoration}>
      <Icon name="trending-up" size={40} color="rgba(99, 102, 241, 0.1)" />
    </View>
  </View>
);

const styles = StyleSheet.create({
  statsCard: {
    backgroundColor: COLORS.white,
    marginHorizontal: 20,
    borderRadius: 20,
    padding: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    marginBottom: 24,
    position: 'relative',
    overflow: 'hidden',
  },
  statsContent: { zIndex: 1 },
  statsTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: { alignItems: 'center', flex: 1 },
  statIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statNumber: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  statsDecoration: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 0,
  },
});

export default StatsCard;
