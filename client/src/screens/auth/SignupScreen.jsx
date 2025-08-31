import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../../redux/slices/authSlice';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import { validateEmail } from '../../utils/validateForm';

const { width, height } = Dimensions.get('window');

const SignupScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    userType: 'jobseeker',
  });
  
  const [validations, setValidations] = useState({
    fullName: { isValid: true, message: '' },
    email: { isValid: true, message: '' },
    password: { isValid: true, message: '' },
    confirmPassword: { isValid: true, message: '' },
  });

  const [currentStep, setCurrentStep] = useState(0);
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.auth);

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(30));
  const [progressAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Progress animation
    Animated.timing(progressAnim, {
      toValue: (currentStep + 1) / 3,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Real-time validation
    switch (field) {
      case 'fullName':
        setValidations(prev => ({
          ...prev,
          fullName: {
            isValid: value.trim().length >= 2,
            message: value.trim().length < 2 ? 'Full name must be at least 2 characters' : ''
          }
        }));
        break;
        
      case 'email':
        setValidations(prev => ({
          ...prev,
          email: {
            isValid: validateEmail(value),
            message: !validateEmail(value) ? 'Please enter a valid email address' : ''
          }
        }));
        break;
        
      case 'password':
        const passwordValidation = {
          isValid: true,
          message: ''
        };
        
        if (value.length < 6) {
          passwordValidation.isValid = false;
          passwordValidation.message = 'Password must be at least 6 characters';
        } else if (!/[A-Z]/.test(value)) {
          passwordValidation.isValid = false;
          passwordValidation.message = 'Password must contain an uppercase letter';
        } else if (!/[a-z]/.test(value)) {
          passwordValidation.isValid = false;
          passwordValidation.message = 'Password must contain a lowercase letter';
        } else if (!/\d/.test(value)) {
          passwordValidation.isValid = false;
          passwordValidation.message = 'Password must contain a number';
        }
        
        setValidations(prev => ({
          ...prev,
          password: passwordValidation,
          confirmPassword: {
            isValid: formData.confirmPassword === value,
            message: formData.confirmPassword !== value ? 'Passwords do not match' : ''
          }
        }));
        break;
        
      case 'confirmPassword':
        setValidations(prev => ({
          ...prev,
          confirmPassword: {
            isValid: formData.password === value,
            message: formData.password !== value ? 'Passwords do not match' : ''
          }
        }));
        break;
    }
  };

  const validateForm = () => {
    const errors = [];
    const { fullName, email, password, confirmPassword } = formData;

    if (!fullName.trim() || fullName.length < 2) {
      errors.push('Full name must be at least 2 characters long');
    }

    if (!validateEmail(email)) {
      errors.push('Please enter a valid email address');
    }

    if (password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    }

    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    }

    if (!/\d/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    if (password !== confirmPassword) {
      errors.push('Passwords do not match');
    }

    return errors;
  };

  const handleSignup = async () => {
    const errors = validateForm();
    if (errors.length > 0) {
      Alert.alert(
        'Validation Error',
        errors.join('\n\n'),
        [{ text: 'OK', style: 'default' }]
      );
      return;
    }

    const { fullName, email, password, userType } = formData;
    
    try {
      await dispatch(signupUser({ fullName, email, password, userType })).unwrap();
      navigation.navigate('Login');
    } catch (err) {
      if (err.includes('already exists')) {
        Alert.alert(
          'Account Exists',
          'An account with this email already exists. Would you like to sign in instead?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign In', onPress: () => navigation.navigate('Login') }
          ]
        );
      } else {
        Alert.alert(
          'Signup Failed',
          err || 'An error occurred during signup. Please try again.',
          [{ text: 'OK', style: 'default' }]
        );
      }
    }
  };

  const PasswordStrengthIndicator = ({ password }) => {
    const getStrength = () => {
      let strength = 0;
      if (password.length >= 6) strength++;
      if (/[A-Z]/.test(password)) strength++;
      if (/[a-z]/.test(password)) strength++;
      if (/\d/.test(password)) strength++;
      return strength;
    };

    const strength = getStrength();
    const colors = ['#ff4757', '#ff6b7a', '#ffa502', '#2ed573'];
    const labels = ['Weak', 'Fair', 'Good', 'Strong'];

    return (
      <View style={styles.passwordStrength}>
        <View style={styles.strengthBars}>
          {[1, 2, 3, 4].map((level) => (
            <View
              key={level}
              style={[
                styles.strengthBar,
                {
                  backgroundColor: strength >= level ? colors[strength - 1] : '#e9ecef',
                }
              ]}
            />
          ))}
        </View>
        {password.length > 0 && (
          <Text style={[styles.strengthText, { color: colors[strength - 1] || '#6c757d' }]}>
            {labels[strength - 1] || 'Too Weak'}
          </Text>
        )}
      </View>
    );
  };

  const RoleOption = ({ role, title, description, icon, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.roleOption, isSelected && styles.roleOptionSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.roleIconContainer}>
        <View style={[styles.roleIcon, isSelected && styles.roleIconSelected]}>
          <Icon name={icon} size={24} color={isSelected ? COLORS.white : COLORS.primary} />
        </View>
      </View>
      <View style={styles.roleContent}>
        <Text style={[styles.roleTitle, isSelected && styles.roleTitleSelected]}>{title}</Text>
        <Text style={[styles.roleDescription, isSelected && styles.roleDescriptionSelected]}>
          {description}
        </Text>
      </View>
      {isSelected && (
        <View style={styles.checkIcon}>
          <Icon name="check-circle" size={20} color={COLORS.primary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const StepIndicator = () => (
    <View style={styles.stepIndicator}>
      <View style={styles.progressBarBackground}>
        <Animated.View 
          style={[
            styles.progressBarFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            }
          ]} 
        />
      </View>
      <Text style={styles.stepText}>Step {currentStep + 1} of 3</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Background decoration */}
      <View style={styles.backgroundDecoration}>
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <Animated.View 
            style={[
              styles.content,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <Icon name="person-add" size={32} color={COLORS.white} />
                </View>
                <View style={styles.logoBadge}>
                  <Icon name="add" size={12} color={COLORS.success} />
                </View>
              </View>
              <Text style={styles.title}>Join Job Portal</Text>
              <Text style={styles.subtitle}>Create your account and unlock new opportunities</Text>
              <StepIndicator />
            </View>

            {/* Form Content */}
            <View style={styles.formContainer}>
              {/* Personal Information */}
              <View style={styles.inputGroup}>
                <Text style={styles.sectionTitle}>Personal Information</Text>
                
                <View style={styles.inputContainer}>
                  <InputField
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChangeText={(value) => handleInputChange('fullName', value)}
                    icon="person"
                    style={styles.enhancedInput}
                  />
                  {!validations.fullName.isValid && (
                    <Text style={styles.errorText}>{validations.fullName.message}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <InputField
                    placeholder="Enter your email address"
                    value={formData.email}
                    onChangeText={(value) => handleInputChange('email', value)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    icon="email"
                    style={styles.enhancedInput}
                  />
                  {!validations.email.isValid && (
                    <Text style={styles.errorText}>{validations.email.message}</Text>
                  )}
                </View>
              </View>

              {/* Security */}
              <View style={styles.inputGroup}>
                <Text style={styles.sectionTitle}>Security</Text>
                
                <View style={styles.inputContainer}>
                  <InputField
                    placeholder="Create a password"
                    value={formData.password}
                    onChangeText={(value) => handleInputChange('password', value)}
                    secureTextEntry
                    icon="lock"
                    style={styles.enhancedInput}
                  />
                  <PasswordStrengthIndicator password={formData.password} />
                  {!validations.password.isValid && (
                    <Text style={styles.errorText}>{validations.password.message}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <InputField
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChangeText={(value) => handleInputChange('confirmPassword', value)}
                    secureTextEntry
                    icon="lock"
                    style={styles.enhancedInput}
                  />
                  {!validations.confirmPassword.isValid && (
                    <Text style={styles.errorText}>{validations.confirmPassword.message}</Text>
                  )}
                </View>
              </View>

              {/* Role Selection */}
              <View style={styles.roleSection}>
                <Text style={styles.sectionTitle}>Account Type</Text>
                <Text style={styles.sectionSubtitle}>Choose how you'll use Job Portal</Text>
                
                <View style={styles.roleContainer}>
                  <RoleOption
                    role="jobseeker"
                    title="Job Seeker"
                    description="Find and apply for job opportunities"
                    icon="person-search"
                    isSelected={formData.userType === 'jobseeker'}
                    onPress={() => handleInputChange('userType', 'jobseeker')}
                  />
                  <RoleOption
                    role="recruiter"
                    title="Recruiter"
                    description="Post jobs and find talent"
                    icon="business"
                    isSelected={formData.userType === 'recruiter'}
                    onPress={() => handleInputChange('userType', 'recruiter')}
                  />
                </View>
              </View>

              {/* Submit Button */}
              <Button
                title="Create Account"
                onPress={handleSignup}
                loading={loading}
                style={styles.signupButton}
              />

              {/* Terms and Privacy */}
              <Text style={styles.termsText}>
                By creating an account, you agree to our{' '}
                <Text style={styles.termsLink}>Terms of Service</Text> and{' '}
                <Text style={styles.termsLink}>Privacy Policy</Text>
              </Text>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.loginLink}
                onPress={() => navigation.navigate('Login')}
                activeOpacity={0.7}
              >
                <Text style={styles.loginText}>
                  Already have an account?{' '}
                  <Text style={styles.loginTextBold}>Sign In</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  backgroundDecoration: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  circle: {
    position: 'absolute',
    borderRadius: 1000,
    opacity: 0.06,
  },
  circle1: {
    width: 180,
    height: 180,
    backgroundColor: COLORS.primary,
    top: -40,
    right: -40,
  },
  circle2: {
    width: 120,
    height: 120,
    backgroundColor: COLORS.secondary,
    bottom: -20,
    left: -20,
  },
  circle3: {
    width: 80,
    height: 80,
    backgroundColor: COLORS.accent,
    top: height * 0.4,
    right: -10,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  logoBackground: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logoBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.white,
    elevation: 2,
  },
  title: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  stepIndicator: {
    alignItems: 'center',
    width: '100%',
  },
  progressBarBackground: {
    width: '60%',
    height: 4,
    backgroundColor: '#e9ecef',
    borderRadius: 2,
    marginBottom: 8,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  stepText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },
  formContainer: {
    marginBottom: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  enhancedInput: {
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1.5,
    borderColor: '#e9ecef',
  },
  errorText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.error,
    marginTop: 4,
    marginLeft: 4,
  },
  passwordStrength: {
    marginTop: 8,
  },
  strengthBars: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 4,
  },
  strengthBar: {
    flex: 1,
    height: 3,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 11,
    fontFamily: FONTS.medium,
    textAlign: 'right',
  },
  roleSection: {
    marginBottom: 32,
  },
  roleContainer: {
    gap: 12,
  },
  roleOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#e9ecef',
    position: 'relative',
  },
  roleOptionSelected: {
    backgroundColor: `${COLORS.primary}08`,
    borderColor: COLORS.primary,
  },
  roleIconContainer: {
    marginRight: 16,
  },
  roleIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleIconSelected: {
    backgroundColor: COLORS.primary,
  },
  roleContent: {
    flex: 1,
  },
  roleTitle: {
    fontSize: 16,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  roleTitleSelected: {
    color: COLORS.primary,
  },
  roleDescription: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    lineHeight: 18,
  },
  roleDescriptionSelected: {
    color: COLORS.primary,
  },
  checkIcon: {
    position: 'absolute',
    top: 12,
    right: 12,
  },
  signupButton: {
    borderRadius: 12,
    height: 48,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 16,
  },
  termsText: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 24,
  },
  termsLink: {
    color: COLORS.primary,
    fontFamily: FONTS.medium,
  },
  footer: {
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    width: '100%',
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e9ecef',
  },
  dividerText: {
    fontSize: 14,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginHorizontal: 16,
  },
  loginLink: {
    paddingVertical: 8,
  },
  loginText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  loginTextBold: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
});

export default SignupScreen;