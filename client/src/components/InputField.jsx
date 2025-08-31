import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/fonts';

const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  error,
  icon,
  secureTextEntry = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
  editable = true,
  style,
  inputStyle,
  containerStyle,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const getInputStyle = () => {
    const baseStyle = [styles.input];
    
    if (multiline) {
      baseStyle.push(styles.multilineInput);
    }
    
    if (isFocused) {
      baseStyle.push(styles.inputFocused);
    }
    
    if (error) {
      baseStyle.push(styles.inputError);
    }
    
    if (!editable) {
      baseStyle.push(styles.inputDisabled);
    }

    return baseStyle;
  };

  const getContainerStyle = () => {
    const baseStyle = [styles.container];
    
    if (error) {
      baseStyle.push(styles.containerError);
    }
    
    if (isFocused) {
      baseStyle.push(styles.containerFocused);
    }

    return baseStyle;
  };

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {label && <Text style={styles.label}>{label}</Text>}
      
      <View style={getContainerStyle()}>
        {icon && (
          <Icon 
            name={icon} 
            size={20} 
            color={isFocused ? COLORS.primary : COLORS.textSecondary} 
            style={styles.leftIcon}
          />
        )}
        
        <TextInput
          style={[getInputStyle(), inputStyle, style]}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          value={value}
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          multiline={multiline}
          numberOfLines={multiline ? numberOfLines : 1}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={styles.rightIcon}
          >
            <Icon
              name={isPasswordVisible ? 'visibility-off' : 'visibility'}
              size={20}
              color={COLORS.textSecondary}
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 6,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 12,
    minHeight: 48,
  },
  containerFocused: {
    borderColor: COLORS.primary,
    backgroundColor: COLORS.white,
  },
  containerError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    paddingVertical: 12,
  },
  inputFocused: {
    color: COLORS.text,
  },
  inputError: {
    color: COLORS.text,
  },
  inputDisabled: {
    color: COLORS.textSecondary,
  },
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 12,
    paddingBottom: 12,
    minHeight: 80,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
    padding: 4,
  },
  errorText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
});

export default InputField;

