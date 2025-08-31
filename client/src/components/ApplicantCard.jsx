import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StatusBadge from './StatusBadge';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/fonts';
import { formatDate } from '../utils/formatDate';

const ApplicantCard = ({ application, onPress, hideViewDetails }) => {
  if (!application) {
    console.warn('ApplicantCard received null/undefined application');
    return null;
  }

  const { 
    applicant = {}, 
    job = {}, 
    status = 'pending',
    createdAt,
    experience = 'N/A'
  } = application;

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return COLORS.warning;
      case 'reviewing':
        return COLORS.info;
      case 'accepted':
        return COLORS.success;
      case 'rejected':
        return COLORS.error;
      default:
        return COLORS.textSecondary;
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.applicantInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(applicant?.fullName || 'A').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.nameContainer}>
            <Text style={styles.applicantName} numberOfLines={1}>
              {applicant?.fullName || 'Anonymous'}
            </Text>
            <Text style={styles.jobTitle} numberOfLines={1}>
              Applied for: {job?.title || 'Unknown Position'}
            </Text>
          </View>
        </View>
        <StatusBadge 
          status={status} 
          color={getStatusColor(status)}
        />
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Icon name="email" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {applicant.email}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="phone" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {applicant.phone || 'Not provided'}
          </Text>
        </View>

        <View style={styles.detailRow}>
          <Icon name="work" size={16} color={COLORS.textSecondary} />
          <Text style={styles.detailText} numberOfLines={1}>
            {experience} years experience
          </Text>
        </View>

        {applicant.location && (
          <View style={styles.detailRow}>
            <Icon name="location-on" size={16} color={COLORS.textSecondary} />
            <Text style={styles.detailText} numberOfLines={1}>
              {applicant.location}
            </Text>
          </View>
        )}
      </View>

      {applicant?.skills && Array.isArray(applicant.skills) ? (
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Skills:</Text>
          <View style={styles.skills}>
            {applicant.skills.slice(0, 3).map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
            {applicant.skills.length > 3 && (
              <Text style={styles.moreSkills}>
                +{applicant.skills.length - 3} more
              </Text>
            )}
          </View>
        </View>
      ) : applicant?.skills && typeof applicant.skills === 'string' ? (
        <View style={styles.skillsContainer}>
          <Text style={styles.skillsLabel}>Skills:</Text>
          <View style={styles.skills}>
            {applicant.skills.split(',').slice(0, 3).map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill.trim()}</Text>
              </View>
            ))}
            {applicant.skills.split(',').length > 3 && (
              <Text style={styles.moreSkills}>
                +{applicant.skills.split(',').length - 3} more
              </Text>
            )}
          </View>
        </View>
      ) : null}

      <View style={styles.footer}>
        <View style={styles.dateContainer}>
          <Icon name="schedule" size={14} color={COLORS.textSecondary} />
          <Text style={styles.dateText}>
            Applied {formatDate(createdAt)}
          </Text>
        </View>
        {!hideViewDetails && (
          <TouchableOpacity style={styles.viewButton} onPress={onPress}>
            <Text style={styles.viewButtonText}>View Details</Text>
            <Icon name="arrow-forward" size={16} color={COLORS.primary} />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  applicantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  nameContainer: {
    flex: 1,
  },
  applicantName: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  details: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: 6,
    flex: 1,
  },
  skillsContainer: {
    marginBottom: 12,
  },
  skillsLabel: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 6,
  },
  skills: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: 6,
  },
  skillBadge: {
    backgroundColor: COLORS.primaryLight,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  skillText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  moreSkills: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 12,
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: 4,
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: COLORS.primaryLight,
  },
  viewButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginRight: 4,
  },
});

export default ApplicantCard;

