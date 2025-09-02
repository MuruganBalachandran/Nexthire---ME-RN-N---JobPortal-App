import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';
import { useRoute } from '@react-navigation/native';

const SalarySection = ({ expectedSalary, setExpectedSalary, job }) => {
  // Support salary as object {min, max} or number
  let min = 20000, max = 200000, currency = 'USD', period = 'yearly';
  if (job?.salary) {
    if (typeof job.salary === 'object') {
      min = job.salary.min || min;
      max = job.salary.max || max;
      currency = job.salary.currency || currency;
      period = job.salary.period || period;
    } else if (!isNaN(Number(job.salary))) {
      min = Number(job.salary) * 0.8;
      max = Number(job.salary) * 1.2;
    }
  }
  // Generate options in steps of 5000
  const options = [];
  for (let i = Math.ceil(min/5000)*5000; i <= max; i += 5000) {
    options.push(i);
  }
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Expected Salary</Text>
      <Text style={styles.currencyInfo}>{currency} ({period})</Text>
      <View style={styles.pickerWrapper}>
        <Picker
          selectedValue={expectedSalary}
          onValueChange={setExpectedSalary}
          style={styles.picker}
        >
          <Picker.Item label={`Select expected salary (${currency})`} value="" />
          {options.map(val => (
            <Picker.Item key={val} label={`${currency} ${val.toLocaleString()}`} value={val.toString()} />
          ))}
        </Picker>
      </View>
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
  currencyInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginLeft: 2,
  },
  pickerWrapper: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    marginTop: 4,
    marginBottom: 4,
    paddingVertical:5,
    paddingHorizontal: 8,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    width: '100%',
    fontSize: 18,
  },
    currencyInfo: {
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 4,
    marginLeft: 2,
  },
});

export default SalarySection;
