import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const ApplicationsHeader = ({ count }) => (
  <View style={styles.header}>
    <Text style={styles.title}>My Applications</Text>
    <Text style={styles.subtitle}>
      {count} application{count !== 1 ? 's' : ''}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.9,
  },
});

export default ApplicationsHeader;
