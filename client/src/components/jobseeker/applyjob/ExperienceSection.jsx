import React, { useState, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const ExperienceSection = ({ value, onChangeText }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedValue = useRef(new Animated.Value(0)).current;

  const handleFocus = () => {
    setIsFocused(true);
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleBlur = () => {
    setIsFocused(false);
    Animated.timing(animatedValue, {
      toValue: 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const borderColor = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [COLORS.border, COLORS.primary],
  });

  return (
    <View style={styles.section}>
      <View style={styles.header}>
        <Icon name="work" size={20} color={COLORS.primary} style={styles.icon} />
        <Text style={styles.sectionTitle}>Experience</Text>
      </View>

      <Text style={styles.sectionSubtitle}>
        Briefly describe your relevant experience (minimum 10 characters)
      </Text>

      <Animated.View style={[styles.inputWrapper, { borderColor }]}>
        <TextInput
          style={styles.input}
          placeholder="Describe your experience..."
          placeholderTextColor={COLORS.textDisabled}
          value={value}
          onChangeText={onChangeText}
          onFocus={handleFocus}
          onBlur={handleBlur}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          maxLength={500}
        />
      </Animated.View>

      <Text
        style={[
          styles.characterCount,
          { color: value.length < 10 ? COLORS.error : COLORS.textSecondary },
        ]}
      >
        {value.length}/500 characters
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  icon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  inputWrapper: {
    borderWidth: 2,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    elevation: 1,
  },
  input: {
    padding: 12,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    minHeight: 100,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    textAlign: 'right',
    marginTop: 6,
  },
});

export default ExperienceSection;
