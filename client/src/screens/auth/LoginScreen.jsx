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
import { useAuth } from '../../hooks/useAuth';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import { validateEmail } from '../../utils/validateForm';

const { width, height } = Dimensions.get('window');

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('jobseeker');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Animation values
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(50));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    // Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogin = async () => {
    if (!validateEmail(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // Navigation will be handled by AppNavigator based on auth state
    } catch (error) {
      Alert.alert('Login Failed', error.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const RoleOption = ({ role, title, description, icon, isSelected, onPress }) => (
    <TouchableOpacity
      style={[styles.roleOption, isSelected && styles.roleOptionSelected]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.roleContent}>
        <View style={[styles.roleIcon, isSelected && styles.roleIconSelected]}>
          <Icon name={icon} size={20} color={isSelected ? COLORS.white : COLORS.primary} />
        </View>
        <View style={styles.roleTextContainer}>
          <Text style={[styles.roleTitle, isSelected && styles.roleTitleSelected]}>{title}</Text>
          <Text style={[styles.roleDescription, isSelected && styles.roleDescriptionSelected]}>
            {description}
          </Text>
        </View>
      </View>
      {isSelected && (
        <View style={styles.checkIconContainer}>
          <Icon name="check" size={16} color={COLORS.primary} />
        </View>
      )}
    </TouchableOpacity>
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
                transform: [
                  { translateY: slideAnim },
                  { scale: scaleAnim }
                ]
              }
            ]}
          >
            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBackground}>
                  <Icon name="work" size={32} color={COLORS.white} />
                </View>
                <View style={styles.logoBadge}>
                  <Icon name="star" size={12} color={COLORS.warning} />
                </View>
              </View>
              <Text style={styles.title}>Welcome Back</Text>
              <Text style={styles.subtitle}>Sign in to continue your professional journey</Text>
            </View>

            {/* Role Selection */}
            <View style={styles.roleSection}>
              <Text style={styles.sectionLabel}>Continue as</Text>
              <View style={styles.roleContainer}>
                <RoleOption
                  role="jobseeker"
                  title="Job Seeker"
                  description="Find opportunities"
                  icon="person-search"
                  isSelected={selectedRole === 'jobseeker'}
                  onPress={() => setSelectedRole('jobseeker')}
                />
                <RoleOption
                  role="recruiter"
                  title="Recruiter"
                  description="Hire talent"
                  icon="business"
                  isSelected={selectedRole === 'recruiter'}
                  onPress={() => setSelectedRole('recruiter')}
                />
              </View>
            </View>

            {/* Login Form */}
            <View style={styles.formContainer}>
              <View style={styles.inputContainer}>
                <InputField
                  placeholder="Enter your email"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  icon="email"
                  style={styles.enhancedInput}
                />
              </View>

              <View style={styles.inputContainer}>
                <InputField
                  placeholder="Enter your password"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  icon="lock"
                  style={styles.enhancedInput}
                />
              </View>

              <TouchableOpacity style={styles.forgotPassword}>
                <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
              </TouchableOpacity>

              <Button
                title="Sign In"
                onPress={handleLogin}
                loading={isLoading}
                style={styles.loginButton}
              />
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>or</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity
                style={styles.signupLink}
                onPress={() => navigation.navigate('Signup')}
                activeOpacity={0.7}
              >
                <Text style={styles.signupText}>
                  New to Job Portal?{' '}
                  <Text style={styles.signupTextBold}>Create Account</Text>
                </Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
        {/* Loading Spinner Overlay */}
        {isLoading && (
          <View style={styles.loadingOverlay}>
            <View style={styles.loadingSpinnerBox}>
              <Icon name="hourglass-empty" size={40} color={COLORS.primary} />
              <Text style={styles.loadingText}>Signing in...</Text>
            </View>
          </View>
        )}
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
    opacity: 0.05,
  },
  circle1: {
    width: 200,
    height: 200,
    backgroundColor: COLORS.primary,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    backgroundColor: COLORS.secondary,
    bottom: -30,
    left: -30,
  },
  circle3: {
    width: 100,
    height: 100,
    backgroundColor: COLORS.accent,
    top: height * 0.3,
    left: -20,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  content: {
    backgroundColor: COLORS.white,
    borderRadius: 24,
    padding: 32,
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
  },
  roleSection: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  roleContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  roleOption: {
    flex: 1,
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
  roleContent: {
    alignItems: 'center',
  },
  roleIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  roleIconSelected: {
    backgroundColor: COLORS.primary,
  },
  roleTextContainer: {
    alignItems: 'center',
  },
  roleTitle: {
    fontSize: 14,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 2,
  },
  roleTitleSelected: {
    color: COLORS.primary,
  },
  roleDescription: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  roleDescriptionSelected: {
    color: COLORS.primary,
  },
  checkIconContainer: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: `${COLORS.primary}15`,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 20,
  },
  enhancedInput: {
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1.5,
    borderColor: '#e9ecef',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  loginButton: {
    borderRadius: 12,
    height: 48,
    elevation: 4,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  footer: {
    alignItems: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
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
  signupLink: {
    paddingVertical: 8,
  },
  signupText: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  signupTextBold: {
    fontFamily: FONTS.bold,
    color: COLORS.primary,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 99,
  },
  loadingSpinnerBox: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    elevation: 8,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
});

export default LoginScreen;

