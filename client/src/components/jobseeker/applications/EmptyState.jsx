import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const EmptyState = ({ navigation }) => (
  <View style={styles.container}>
    <Icon name="assignment" size={72} color={COLORS.textSecondary} />
    <Text style={styles.title}>No Applications Yet</Text>
    <Text style={styles.subtitle}>
      Start applying to jobs to see your application status here.
    </Text>
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('Jobs')}
    >
      <Text style={styles.buttonText}>Browse Jobs</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 100,
  },
  title: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.white,
  },
});

export default EmptyState;
