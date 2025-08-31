import React from 'react';
import { View, Text, ScrollView, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import JobCard from '../JobCard';
import ApplicantCard from '../ApplicantCard';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';

const { width } = Dimensions.get('window');

const RecentSection = ({ isJobSeeker, navigation, recentJobs, recentApplications }) => (
  <View style={styles.recentSection}>
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>
          {isJobSeeker ? 'Recommended Jobs' : 'Recent Applications'}
        </Text>
        <Text style={styles.sectionSubtitle}>
          {isJobSeeker
            ? 'Based on your profile and preferences'
            : 'Latest candidate applications'}
        </Text>
      </View>
      <View style={styles.seeAllButton}>
        <Text style={styles.seeAllText}>See All</Text>
        <Icon name="arrow-forward" size={16} color={COLORS.primary} />
      </View>
    </View>

    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.horizontalScroll}
    >
      {isJobSeeker
        ? recentJobs.length > 0
          ? recentJobs.map((job, index) => (
              <View key={job._id || job.id} style={[styles.cardWrapper, index === 0 && styles.firstCard]}>
                <JobCard
                  job={job}
                  style={styles.horizontalCard}
                />
              </View>
            ))
          : <View style={styles.nothingFound}><Text style={styles.nothingFoundText}>Nothing found</Text></View>
        : recentApplications.length > 0
          ? recentApplications.map((app, index) => (
              <View key={app._id || app.id} style={[styles.cardWrapper, index === 0 && styles.firstCard]}>
                <ApplicantCard
                  application={app}
                  style={styles.horizontalCard}
                  hideViewDetails={true}
                />
              </View>
            ))
          : <View style={styles.nothingFound}><Text style={styles.nothingFoundText}>Nothing found</Text></View>
      }
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  recentSection: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginTop: 4,
  },
  seeAllButton: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  seeAllText: { fontSize: 14, fontFamily: FONTS.medium, color: COLORS.primary },
  horizontalScroll: { paddingLeft: 20, paddingRight: 20 },
  cardWrapper: { marginRight: 16, width: width * 0.8 },
  firstCard: { marginLeft: 0 },
  horizontalCard: { width: '100%' },
  nothingFound: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 32,
  },
  nothingFoundText: {
    fontSize: 16,
    color: COLORS.textSecondary,
    fontFamily: FONTS.medium,
  },
});

export default RecentSection;
