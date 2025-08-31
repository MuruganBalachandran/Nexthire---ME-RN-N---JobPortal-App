import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';
import StatusBadge from '../../StatusBadge';

const ApplicationCard = ({ application, onPress }) => {
  const { applicant, status, appliedDate } = application;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.header}>
        <Text style={styles.applicantName}>{applicant.name}</Text>
        <StatusBadge status={status} />
      </View>
      <Text style={styles.email}>{applicant.email}</Text>
      <Text style={styles.date}>Applied on: {new Date(appliedDate).toLocaleDateString()}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  applicantName: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
  },
  email: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 5,
  },
  date: {
    fontSize: 12,
    color: COLORS.textTertiary,
  },
});

export default ApplicationCard;
