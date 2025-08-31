import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';
import InputField from '../../../components/InputField';
import Button from '../../../components/Button';

const JobForm = ({ 
  title, 
  setTitle, 
  description, 
  setDescription, 
  location,
  setLocation,
  salary,
  setSalary,
  requirements,
  setRequirements,
  onSubmit 
}) => {
  return (
    <View style={styles.container}>
      <InputField
        label="Job Title"
        value={title}
        onChangeText={setTitle}
        placeholder="Enter job title"
      />
      <InputField
        label="Description"
        value={description}
        onChangeText={setDescription}
        placeholder="Enter job description"
        multiline
        numberOfLines={4}
      />
      <InputField
        label="Location"
        value={location}
        onChangeText={setLocation}
        placeholder="Enter job location"
      />
      <InputField
        label="Salary"
        value={salary}
        onChangeText={setSalary}
        placeholder="Enter salary range"
        keyboardType="numeric"
      />
      <InputField
        label="Requirements"
        value={requirements}
        onChangeText={setRequirements}
        placeholder="Enter job requirements"
        multiline
        numberOfLines={3}
      />
      <Button 
        title="Post Job"
        onPress={onSubmit}
        style={styles.submitButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.background,
  },
  submitButton: {
    marginTop: 20,
    backgroundColor: COLORS.primary,
  }
});

export default JobForm;
