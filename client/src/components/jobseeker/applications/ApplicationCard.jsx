import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import StatusBadge from '../../StatusBadge';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';
import { formatDate } from '../../../utils/formatDate';

const ApplicationCard = ({ item, navigation, getStatusColor, getStatusIcon }) => {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('JobDetail', { job: item.job })}
      activeOpacity={0.85}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <View style={styles.jobInfo}>
          <Text style={styles.jobTitle}>{item.job.title}</Text>
          <Text style={styles.company}>{item.job.company}</Text>
          <Text style={styles.location}>{item.job.location}</Text>
        </View>
        <StatusBadge status={item.status} color={getStatusColor(item.status)} />
      </View>

      {/* Footer */}
      <View style={styles.cardFooter}>
        <View style={styles.row}>
          <Icon name="schedule" size={16} color={COLORS.textSecondary} />
          <Text style={styles.footerText}>
            Applied on {formatDate(item.appliedDate)}
          </Text>
        </View>

        {item.lastUpdate && (
          <View style={styles.row}>
            <Icon
              name={getStatusIcon(item.status)}
              size={16}
              color={getStatusColor(item.status)}
            />
            <Text style={styles.footerText}>
              Updated {formatDate(item.lastUpdate)}
            </Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  jobInfo: {
    flex: 1,
    marginRight: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  company: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 2,
  },
  location: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },
  cardFooter: {
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    paddingTop: 10,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  footerText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginLeft: 6,
  },
});

export default ApplicationCard;
