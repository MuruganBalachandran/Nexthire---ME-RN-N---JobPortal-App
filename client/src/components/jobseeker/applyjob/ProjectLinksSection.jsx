import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const ProjectLinksSection = ({ value, onChangeText }) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Relevant Projects</Text>
      <Text style={styles.sectionSubtitle}>
        Please provide links to your relevant projects (e.g., GitHub, Drive, portfolio). Separate multiple links with commas.
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Paste your project links here..."
        placeholderTextColor={COLORS.textDisabled}
        value={value}
        onChangeText={onChangeText}
        multiline
        numberOfLines={2}
        textAlignVertical="top"
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
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

export default ProjectLinksSection;
