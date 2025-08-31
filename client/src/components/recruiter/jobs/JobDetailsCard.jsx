import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import COLORS from '../../../styles/colors';

const JobDetailsCard = ({ job }) => {
  const { title, description, location, salary, requirements, postedDate } = job;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.location}>{location}</Text>
      <Text style={styles.salary}>₹{salary}</Text>
      
      <Text style={styles.sectionTitle}>Description</Text>
      <Text style={styles.description}>{description}</Text>
      
      <Text style={styles.sectionTitle}>Requirements</Text>
      <Text style={styles.requirements}>{requirements}</Text>
      
      <Text style={styles.postedDate}>
        Posted on: {new Date(postedDate).toLocaleDateString()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    margin: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 8,
  },
  location: {
    fontSize: 16,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  salary: {
    fontSize: 16,
    color: COLORS.success,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: 12,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  requirements: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
  postedDate: {
    fontSize: 12,
    color: COLORS.textTertiary,
    marginTop: 16,
  },
});

export default JobDetailsCard;
