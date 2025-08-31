import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';
import { useRoute } from '@react-navigation/native';

const SalarySection = ({ expectedSalary, setExpectedSalary }) => {
  const route = useRoute();
  const { job } = route.params || {};

  // ✅ Handle object or number/string
  const jobSalary = job?.salary
    ? typeof job.salary === "object"
      ? job.salary.amount?.toString() || "Enter expected salary (e.g. 50000)"
      : job.salary.toString()
    : "Enter expected salary (e.g. 50000)";

  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Expected Salary</Text>
      <TextInput
        style={styles.input}
        placeholder={jobSalary}
        value={expectedSalary}
        onChangeText={setExpectedSalary}
        keyboardType="numeric"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 12,
  },
  input: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    minHeight: 48,
  },
});

export default SalarySection;
