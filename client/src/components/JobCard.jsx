import React, { useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StatusBadge from './StatusBadge';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/fonts';
import { GRADIENTS } from '../styles/globalStyles';
import { formatDate } from '../utils/formatDate';

const JobCard = ({ job = {}, onPress }) => {
  // Default values for job properties
  const {
    title = 'Untitled Position',
    company = 'Unknown Company',
    location = 'Location not specified',
    type = 'full-time',
    remote = false,
    salary = 'Not specified',
    experience = 'Not specified',
    description = 'No description available',
    postedDate = new Date(),
  } = job;
  // Animated press feedback
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };
  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      speed: 50,
      bounciness: 8,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={styles.touchable}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={0.92}
      >
        <LinearGradient
          colors={GRADIENTS.primary}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.container}
        >
          <View style={styles.header}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <Icon name="work" size={24} color={COLORS.white} />
              </View>
            </View>
            <View style={styles.titleContainer}>
              <Text style={styles.jobTitle} numberOfLines={2}>
                {title}
              </Text>
              <Text style={styles.company} numberOfLines={1}>
                {company}
              </Text>
            </View>
            <View style={styles.badgeContainer}>
              <StatusBadge status={type} />
              {remote && <StatusBadge status="Remote" color={COLORS.success} />}
            </View>
          </View>

          <View style={styles.details}>
            <View style={styles.detailRow}>
              <Icon name="location-on" size={16} color={COLORS.white} />
              <Text style={styles.detailText} numberOfLines={1}>
                {location}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="attach-money" size={16} color={COLORS.white} />
              <Text style={styles.detailText} numberOfLines={1}>
                {typeof salary === 'object' && salary?.min && salary?.max
                  ? `${salary.currency || 'USD'} ${salary.min.toLocaleString()} - ${salary.max.toLocaleString()} ${salary.period || 'yearly'}`
                  : typeof salary === 'string' ? salary : 'Salary not specified'}
              </Text>
            </View>
            <View style={styles.detailRow}>
              <Icon name="work" size={16} color={COLORS.white} />
              <Text style={styles.detailText} numberOfLines={1}>
                {experience} experience
              </Text>
            </View>
          </View>

          <View style={styles.description}>
            <Text style={styles.descriptionText} numberOfLines={2}>
              {description}
            </Text>
          </View>

          <View style={styles.footer}>
            <View style={styles.dateContainer}>
              <Icon name="schedule" size={14} color={COLORS.white} />
              <Text style={styles.dateText}>
                Posted {formatDate(job.postedDate)}
              </Text>
            </View>
            <TouchableOpacity style={styles.applyButton} onPress={onPress}>
              <Text style={styles.applyButtonText}>View Details</Text>
              <Icon name="arrow-forward" size={16} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  touchable: {
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 16,
    overflow: 'hidden',
  },
  container: {
    borderRadius: 16,
    padding: 18,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.18,
        shadowRadius: 8,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  titleContainer: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.white,
    opacity: 0.85,
  },
  badgeContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 4,
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
    color: COLORS.white,
    marginLeft: 6,
    flex: 1,
    opacity: 0.92,
  },
  description: {
    marginBottom: 12,
  },
  descriptionText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    lineHeight: 20,
    opacity: 0.95,
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
    color: COLORS.white,
    marginLeft: 4,
    opacity: 0.8,
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 8,
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12,
    shadowRadius: 4,
    elevation: 2,
  },
  applyButtonText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
    marginRight: 4,
  },
});

export default JobCard;

