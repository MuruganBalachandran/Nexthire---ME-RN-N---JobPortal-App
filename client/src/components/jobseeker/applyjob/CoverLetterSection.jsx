// components/jobseeker/applyjob/CoverLetterSection.jsx

import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../../styles/colors';
import { FONTS } from '../../../styles/fonts';

const CoverLetterSection = ({ value, onChangeText, onAISuggestion, job }) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const animatedValue = new Animated.Value(0);

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

  const getCharacterCountColor = () => {
    if (value.length < 50) return COLORS.error;
    if (value.length < 100) return COLORS.warning;
    return COLORS.success;
  };

  return (
    <View style={styles.section}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <View style={styles.headerLeft}>
          <View style={styles.iconContainer}>
            <Icon name="edit" size={20} color={COLORS.primary} />
          </View>
          <View>
            <Text style={styles.sectionTitle}>Cover Letter</Text>
            <View style={styles.requiredIndicator}>
              <Text style={styles.requiredText}>Required</Text>
              <Icon name="star" size={12} color={COLORS.error} />
            </View>
          </View>
        </View>
        
        <TouchableOpacity 
          style={styles.tipsButton}
          onPress={() => setShowTips(!showTips)}
          activeOpacity={0.7}
        >
          <Icon name="lightbulb-outline" size={18} color={COLORS.warning} />
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionSubtitle}>
        Tell us why you're the perfect fit for this role (minimum 50 characters)
      </Text>

      {/* Tips Section */}
      {showTips && (
        <View style={styles.tipsContainer}>
          <Text style={styles.tipsTitle}>💡 Writing Tips:</Text>
          <Text style={styles.tipItem}>• Highlight relevant skills and experience</Text>
          <Text style={styles.tipItem}>• Show enthusiasm for the role</Text>
          <Text style={styles.tipItem}>• Keep it concise and professional</Text>
          <Text style={styles.tipItem}>• Personalize for the company</Text>
        </View>
      )}

      {/* Enhanced Input Container */}
      <View style={styles.inputContainer}>
        <Animated.View style={[styles.inputWrapper, { borderColor }]}>
          <TextInput
            style={styles.input}
            placeholder="Write your cover letter here... Start with why you're interested in this position."
            placeholderTextColor={COLORS.textDisabled}
            value={value}
            onChangeText={onChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          
          {/* Input Enhancement Overlay */}
          <View style={styles.inputOverlay}>
            <View style={styles.wordCount}>
              <Icon name="text-fields" size={14} color={COLORS.textSecondary} />
              <Text style={styles.wordCountText}>
                {value.split(' ').filter(word => word.length > 0).length} words
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Character Count and Status */}
        <View style={styles.inputFooter}>
          <View style={styles.characterCountContainer}>
            <Text style={[styles.characterCount, { color: getCharacterCountColor() }]}>
              {value.length}/1000 characters
            </Text>
            <View style={[styles.statusDot, { backgroundColor: getCharacterCountColor() }]} />
          </View>
          
          {value.length >= 50 && (
            <View style={styles.validationSuccess}>
              <Icon name="check-circle" size={16} color={COLORS.success} />
              <Text style={styles.validationText}>Looks good!</Text>
            </View>
          )}
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View 
              style={[
                styles.progressFill, 
                { 
                  width: `${Math.min((value.length / 50) * 100, 100)}%`,
                  backgroundColor: getCharacterCountColor()
                }
              ]} 
            />
          </View>
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity
          style={styles.actionButton}
          activeOpacity={0.7}
          onPress={() => {
            const template = `I am excited to apply for the ${job?.title || '[Job Title]'} position at ${job?.company || '[Company Name]'}.\nWith my background in [Your Key Skill/Experience], I bring strong expertise in [specific relevant skill or achievement].\nI am particularly drawn to this role because [reason you admire the company, its values, or the role].\nI would welcome the opportunity to contribute my skills to your team and help drive ${job?.company ? job.company + "'s" : "[Company’s]"} Goal/Project/Initiative.`;
            onChangeText(template);
          }}
        >
          <Icon name="auto-fix-high" size={16} color={COLORS.primary} />
          <Text style={styles.actionText}>AI Suggestions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    flex: 1,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  requiredIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  requiredText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.error,
  },
  tipsButton: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  tipsContainer: {
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.warning,
  },
  tipsTitle: {
    fontSize: 14,
    fontFamily: FONTS.semibold,
    color: COLORS.warning,
    marginBottom: 8,
  },
  tipItem: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputWrapper: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    borderWidth: 2,
    elevation: 2,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    position: 'relative',
    overflow: 'hidden',
  },
  input: {
    padding: 16,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    minHeight: 140,
    lineHeight: 24,
  },
  inputOverlay: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  wordCount: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  wordCountText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  inputFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  characterCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  characterCount: {
    fontSize: 12,
    fontFamily: FONTS.medium,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  validationSuccess: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  validationText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.success,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressTrack: {
    height: 3,
    backgroundColor: COLORS.gray200,
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(99, 102, 241, 0.05)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    gap: 6,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.1)',
  },
  actionText: {
    fontSize: 13,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
});

export default CoverLetterSection;
