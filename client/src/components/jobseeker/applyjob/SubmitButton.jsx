import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const SubmitButton = ({ loading, handleApply }) => (
  <View style={styles.submitContainer}>
    <TouchableOpacity
      style={[styles.submitButton, loading && styles.disabledButton]}
      onPress={handleApply}
      disabled={loading}
    >
      <Text style={styles.buttonText}>
        {loading ? 'Submitting...' : 'Submit Application'}
      </Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  submitContainer: {
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
  disabledButton: {
    backgroundColor: COLORS.textSecondary,
    opacity: 0.6,
  },
});

export default SubmitButton;
