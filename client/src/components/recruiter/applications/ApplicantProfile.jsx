import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import { formatDate } from '../../../utils/formatDate';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const ApplicantProfile = ({ 
  application,
  currentStatus,
  onBackPress 
}) => {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '#FF9800';
      case 'reviewing': return '#2196F3';
      case 'accepted': return '#4CAF50';
      case 'rejected': return '#F44336';
      case 'shortlisted': return '#9C27B0';
      default: return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'hourglass-empty';
      case 'reviewing': return 'rate-review';
      case 'accepted': return 'check-circle';
      case 'rejected': return 'cancel';
      case 'shortlisted': return 'star';
      default: return 'help-outline';
    }
  };

  return (
    <LinearGradient
      colors={[COLORS.primary, COLORS.primaryDark]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.header}
    >
      <View style={styles.headerTop}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={onBackPress}
        >
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Applicant Details</Text>
        
        <TouchableOpacity style={styles.moreButton}>
          <Icon name="more-vert" size={24} color={COLORS.white} />
        </TouchableOpacity>
      </View>

      <View style={styles.profileCard}>
        <View style={styles.avatarContainer}>
          <LinearGradient
            colors={['#667eea', '#764ba2']}
            style={styles.avatar}
          >
            <Text style={styles.avatarText}>
              {application.applicant.name.charAt(0).toUpperCase()}
            </Text>
          </LinearGradient>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor(currentStatus) }]} />
        </View>
        
        <View style={styles.profileInfo}>
          <Text style={styles.applicantName}>{application.applicant.name}</Text>
          <Text style={styles.jobTitle} numberOfLines={1}>
            Applied for: {application.job.title}
          </Text>
          
          <View style={styles.statusRow}>
            <View style={[
              styles.statusBadge, 
              { backgroundColor: getStatusColor(currentStatus) + '20' }
            ]}>
              <Icon 
                name={getStatusIcon(currentStatus)} 
                size={14} 
                color={getStatusColor(currentStatus)} 
              />
              <Text style={[
                styles.statusText, 
                { color: getStatusColor(currentStatus) }
              ]}>
                {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
              </Text>
            </View>
            
            <Text style={styles.appliedDate}>
              Applied {formatDate(application.appliedDate, 'relative')}
            </Text>
          </View>
        </View>
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  appliedDate: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
});

export default ApplicantProfile;
