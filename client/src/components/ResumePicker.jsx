import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import DocumentPicker from '@react-native-documents/picker';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/fonts';

const ResumePicker = ({ value, onChange }) => {
  const [error, setError] = useState(null);

  const attachResume = async () => {
    try {
      setError(null);
      const result = await DocumentPicker.pick({
        type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
      });
      onChange?.(result);
    } catch (e) {
      if (!DocumentPicker.isCancel(e)) {
        setError('Failed to attach resume');
      }
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Resume (PDF, DOC, DOCX)</Text>
      {value ? (
        <View style={styles.fileRow}>
          <Text style={styles.fileName} numberOfLines={1}>{value.name}</Text>
          <TouchableOpacity style={styles.changeBtn} onPress={attachResume}>
            <Text style={styles.changeText}>Change</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity style={styles.pickButton} onPress={attachResume}>
          <Text style={styles.pickText}>Upload Resume</Text>
        </TouchableOpacity>
      )}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    marginBottom: 12,
  },
  label: {
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 6,
  },
  pickButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    gap: 8,
  },
  pickText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
  },
  fileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    padding: 12,
    gap: 8,
  },
  fileName: {
    flex: 1,
    color: COLORS.text,
    fontFamily: FONTS.regular,
  },
  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.primaryLight,
    borderRadius: 6,
  },
  changeText: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  error: {
    marginTop: 6,
    color: COLORS.error,
    fontFamily: FONTS.regular,
  },
});

export default ResumePicker;


