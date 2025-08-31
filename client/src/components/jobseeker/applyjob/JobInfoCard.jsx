import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const JobInfoCard = ({ job }) => (
  <View style={styles.cardContainer}>
    <LinearGradient
      colors={['rgba(99, 102, 241, 0.05)', 'rgba(139, 92, 246, 0.02)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.card}
    >
      {/* Background Pattern */}
      <View style={styles.backgroundPattern} />
      
      {/* Job Badge */}
      <View style={styles.jobBadge}>
        <Icon name="work-outline" size={16} color={COLORS.primary} />
        <Text style={styles.badgeText}>Job Application</Text>
      </View>
      
      {/* Job Title Section */}
      <View style={styles.titleSection}>
        <Text style={styles.jobTitle} numberOfLines={2}>{job.title}</Text>
        <View style={styles.titleUnderline} />
      </View>
      
      {/* Company Info */}
      <View style={styles.companySection}>
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Icon name="business" size={18} color={COLORS.primary} />
          </View>
          <Text style={styles.companyName} numberOfLines={1}>{job.company}</Text>
          <View style={styles.verifiedBadge}>
            <Icon name="verified" size={14} color={COLORS.success} />
          </View>
        </View>
        
        <View style={styles.infoRow}>
          <View style={styles.iconContainer}>
            <Icon name="location-on" size={18} color={COLORS.secondary} />
          </View>
          <Text style={styles.jobLocation} numberOfLines={1}>{job.location}</Text>
        </View>
      </View>
      
      {/* Additional Info */}
      <View style={styles.additionalInfo}>
        <View style={styles.infoChip}>
          <Icon name="schedule" size={14} color={COLORS.info} />
          <Text style={styles.chipText}>Full-time</Text>
        </View>
        <View style={styles.infoChip}>
          <Icon name="trending-up" size={14} color={COLORS.success} />
          <Text style={styles.chipText}>High Priority</Text>
        </View>
      </View>
      
      {/* Decorative Element */}
      <View style={styles.decorativeCorner} />
    </LinearGradient>
  </View>
);

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 20,
    padding: 24,
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
    position: 'relative',
    overflow: 'hidden',
  },
  backgroundPattern: {
    position: 'absolute',
    top: -20,
    right: -20,
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
  },
  jobBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginLeft: 6,
  },
  titleSection: {
    marginBottom: 20,
  },
  jobTitle: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    lineHeight: 28,
  },
  titleUnderline: {
    width: 60,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginTop: 8,
  },
  companySection: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 10,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  companyName: {
    fontSize: 16,
    fontFamily: FONTS.semibold,
    color: COLORS.primary,
    flex: 1,
  },
  verifiedBadge: {
    marginLeft: 8,
  },
  jobLocation: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    flex: 1,
  },
  additionalInfo: {
    flexDirection: 'row',
    gap: 10,
  },
  infoChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  chipText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.success,
    marginLeft: 4,
  },
  decorativeCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 40,
    height: 40,
    backgroundColor: 'rgba(244, 114, 182, 0.1)',
    borderTopLeftRadius: 20,
  },
});

export default JobInfoCard;