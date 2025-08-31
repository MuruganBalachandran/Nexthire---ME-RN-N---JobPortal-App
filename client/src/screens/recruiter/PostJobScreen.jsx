import React, { useState, useEffect } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { ToastAndroid, StyleSheet } from 'react-native';
import {
  View,
  Text,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { useDispatch, useSelector } from 'react-redux';
import { postJob } from '../../redux/slices/jobsSlice';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';

const PostJobScreen = ({ navigation, route }) => {
  // Detect edit mode and job from route params
  const editMode = route?.params?.editMode || false;
  const job = route?.params?.job || null;

  // Allowed fields for editing
  const EDITABLE_FIELDS = [
    'location',
    'type',
    'remote',
    'requirements',
    'responsibilities', // If present in your model
    'benefits',
    'skills', // If present in your model
  ];

  // Pre-fill form in edit mode
  useEffect(() => {
    if (editMode && job) {
      setJobData(prev => ({
        ...prev,
        // Only pre-fill allowed fields
        location: job.location || '',
        type: job.type || 'full-time',
        remote: job.remote || false,
        requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
        benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : (job.benefits || ''),
        // Optionally handle responsibilities/skills if present
        ...(job.responsibilities ? { responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : job.responsibilities } : {}),
        ...(job.skills ? { skills: Array.isArray(job.skills) ? job.skills.join(', ') : job.skills } : {}),
      }));
    }
  }, [editMode, job]);
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.jobs);
  const [jobData, setJobData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    remote: false,
    salaryMin: '',
    salaryMax: '',
    salaryCurrency: 'USD',
    salaryPeriod: 'yearly',
    salaryStartDate: '',
    experience: 'entry',
    description: '',
    requirements: '',
    benefits: '',
  });
  const [errors, setErrors] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  // loading is now from Redux

  const handleInputChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined })); // Clear error on change
  };

  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (event.type === 'set' && selectedDate) {
      handleInputChange('salaryStartDate', selectedDate);
    }
  };

  const validateForm = () => {
    const { title, company, location, description, salaryMin, salaryMax, experience, requirements, benefits } = jobData;
    const newErrors = {};
    // Title validation
    if (!title.trim()) {
      newErrors.title = 'Please enter job title';
    } else if (title.trim().length < 5 || title.trim().length > 100) {
      newErrors.title = 'Job title must be between 5 and 100 characters';
    }
    // Company validation
    if (!company.trim()) {
      newErrors.company = 'Please enter company name';
    } else if (company.trim().length < 2 || company.trim().length > 100) {
      newErrors.company = 'Company name must be between 2 and 100 characters';
    }
    // Location validation
    if (!location.trim()) {
      newErrors.location = 'Please enter job location';
    } else if (location.trim().length < 2 || location.trim().length > 100) {
      newErrors.location = 'Location must be between 2 and 100 characters';
    }
    // Description validation
    if (!description.trim()) {
      newErrors.description = 'Please enter a job description';
    } else if (description.trim().length < 50 || description.trim().length > 2000) {
      newErrors.description = 'Description must be between 50 and 2000 characters';
    }
    // Salary validation
    if (!salaryMin || isNaN(salaryMin) || Number(salaryMin) <= 0) {
      newErrors.salaryMin = 'Please enter a valid minimum salary';
    }
    if (!salaryMax || isNaN(salaryMax) || Number(salaryMax) < Number(salaryMin)) {
      newErrors.salaryMax = 'Maximum salary must be greater than or equal to minimum salary';
    }
    // Experience validation
    const validExperiences = ['entry', 'junior', 'mid-level', 'senior', 'lead', 'executive'];
    if (!validExperiences.includes(experience)) {
      newErrors.experience = 'Please select a valid experience level';
    }
    // Requirements validation (if provided)
    if (requirements.trim()) {
      const reqArr = requirements.split(/\r?\n/).map(r => r.trim()).filter(r => r.length > 0);
      if (!Array.isArray(reqArr)) {
        newErrors.requirements = 'Requirements must be an array';
      } else if (reqArr.some(r => r.length < 5 || r.length > 200)) {
        newErrors.requirements = 'Each requirement must be between 5 and 200 characters';
      }
    }
    // Benefits validation (if provided)
    if (benefits.trim()) {
      const benArr = benefits.split(/\r?\n/).map(b => b.trim()).filter(b => b.length > 0);
      if (!Array.isArray(benArr)) {
        newErrors.benefits = 'Benefits must be an array';
      } else if (benArr.some(b => b.length > 200)) {
        newErrors.benefits = 'Each benefit cannot exceed 200 characters';
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (loading) return; // Prevent double submit
    setErrors({});
    if (!validateForm()) return;

    try {
      // Convert multiline text to array, splitting by newlines and trimming
      const requirementsArray = jobData.requirements
        ? jobData.requirements.split(/\r?\n/).map(r => r.trim()).filter(r => r.length > 0)
        : [];
      const benefitsArray = jobData.benefits
        ? jobData.benefits.split(/\r?\n/).map(b => b.trim()).filter(b => b.length > 0)
        : [];

      if (editMode && job && job._id) {
        // Only send allowed fields for update
        const updateFields = {
          location: jobData.location,
          type: jobData.type,
          remote: jobData.remote,
          requirements: requirementsArray,
          benefits: benefitsArray,
        };
        // Optionally add responsibilities/skills if present in form
        if ('responsibilities' in jobData) updateFields.responsibilities = jobData.responsibilities;
        if ('skills' in jobData) updateFields.skills = jobData.skills;

        const res = await import('../../services/api').then(api => api.updateJob(job._id, updateFields));
        if (res && res.success) {
          if (Platform.OS === 'android') {
            ToastAndroid.show('Job updated successfully!', ToastAndroid.SHORT);
          }
          navigation.goBack();
        } else {
          throw new Error(res?.message || 'Failed to update job');
        }
        return;
      }

      // Normal post job flow
      const cleanedJobData = {
        title: jobData.title,
        company: jobData.company,
        location: jobData.location,
        type: jobData.type,
        remote: jobData.remote,
        salary: {
          min: Number(jobData.salaryMin),
          max: Number(jobData.salaryMax),
          currency: jobData.salaryCurrency,
          period: jobData.salaryPeriod,
        },
        experience: jobData.experience,
        description: jobData.description,
        requirements: requirementsArray,
        benefits: benefitsArray,
        salaryStartDate: jobData.salaryStartDate,
      };

      const resultAction = await dispatch(postJob(cleanedJobData));

      if (postJob.fulfilled.match(resultAction)) {
        setJobData({
          title: '',
          company: '',
          location: '',
          type: 'full-time',
          remote: false,
          salaryMin: '',
          salaryMax: '',
          salaryCurrency: 'USD',
          salaryPeriod: 'yearly',
          experience: 'entry',
          description: '',
          requirements: '',
          benefits: '',
        });
        setErrors({});
        if (Platform.OS === 'android') {
          ToastAndroid.show('Job posted successfully!', ToastAndroid.SHORT);
        }
        navigation.navigate('Applications');
      } else {
        throw new Error(resultAction.payload || 'Failed to post job');
      }
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to post job' });
      if (Platform.OS === 'android') {
        ToastAndroid.show('Failed to post job', ToastAndroid.LONG);
      }
    }
  };

  const renderRequirements = () => (
    <View style={styles.dynamicSection}>
      <Text style={styles.sectionTitle}>Requirements</Text>
      <InputField
        placeholder="List requirements for the job..."
        value={jobData.requirements}
        onChangeText={value => handleInputChange('requirements', value)}
        multiline
        numberOfLines={4}
        style={styles.descriptionInput}
      />
    </View>
  );

  const renderBenefits = () => (
    <View style={styles.dynamicSection}>
      <Text style={styles.sectionTitle}>Benefits</Text>
      <InputField
        placeholder="List benefits for the job..."
        value={jobData.benefits}
        onChangeText={value => handleInputChange('benefits', value)}
        multiline
        numberOfLines={4}
        style={styles.descriptionInput}
      />
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{editMode ? 'Edit Job' : 'Post a New Job'}</Text>
          <Text style={styles.headerSubtitle}>
            {editMode ? 'Update your job details' : 'Find the perfect candidate'}
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.sectionTitle}>Basic Information</Text>

          {/* Only allow editing title/company/description/experience/salary in create mode */}
          <InputField
            placeholder="Job Title *"
            value={jobData.title}
            onChangeText={(value) => handleInputChange('title', value)}
            icon="work"
            editable={!editMode}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          <InputField
            placeholder="Company Name *"
            value={jobData.company}
            onChangeText={(value) => handleInputChange('company', value)}
            icon="business"
            editable={!editMode}
          />
          {errors.company && <Text style={styles.errorText}>{errors.company}</Text>}

          <InputField
            placeholder="Location *"
            value={jobData.location}
            onChangeText={(value) => handleInputChange('location', value)}
            icon="location-on"
            editable={editMode || !editMode}
          />
          {errors.location && <Text style={styles.errorText}>{errors.location}</Text>}

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Job Type</Text>
            <Picker
              selectedValue={jobData.type}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('type', value)}
              enabled={true}
            >
              {JOB_TYPES.map(type => (
                <Picker.Item key={type.value} label={type.label} value={type.value} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Experience Level</Text>
            <Picker
              selectedValue={jobData.experience}
              style={styles.picker}
              onValueChange={(value) => handleInputChange('experience', value)}
              enabled={true}
            >
              {EXPERIENCE_LEVELS.map(level => (
                <Picker.Item key={level.value} label={level.label} value={level.value} />
              ))}
            </Picker>
            {errors.experience && <Text style={styles.errorText}>{errors.experience}</Text>}
          </View>

          {/* Salary fields */}
          <View style={styles.salarySection}>
            <Text style={styles.salaryLabel}>Min Salary *</Text>
            <InputField
              placeholder="Min Salary"
              value={jobData.salaryMin}
              onChangeText={(value) => handleInputChange('salaryMin', value)}
              icon="attach-money"
              keyboardType="numeric"
              style={styles.bigInput}
              editable={true}
            />
            {errors.salaryMin && <Text style={styles.errorText}>{errors.salaryMin}</Text>}
            <Text style={styles.salaryLabel}>Max Salary *</Text>
            <InputField
              placeholder="Max Salary"
              value={jobData.salaryMax}
              onChangeText={(value) => handleInputChange('salaryMax', value)}
              icon="attach-money"
              keyboardType="numeric"
              style={styles.bigInput}
              editable={true}
            />
            {errors.salaryMax && <Text style={styles.errorText}>{errors.salaryMax}</Text>}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={styles.pickerLabel}>Currency</Text>
              <Picker
                selectedValue={jobData.salaryCurrency}
                style={styles.picker}
                onValueChange={(value) => handleInputChange('salaryCurrency', value)}
                enabled={true}
              >
                <Picker.Item label="USD" value="USD" />
                <Picker.Item label="INR" value="INR" />
                <Picker.Item label="EUR" value="EUR" />
                <Picker.Item label="GBP" value="GBP" />
                <Picker.Item label="JPY" value="JPY" />
              </Picker>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.pickerLabel}>Period</Text>
              <Picker
                selectedValue={jobData.salaryPeriod}
                style={styles.picker}
                onValueChange={(value) => handleInputChange('salaryPeriod', value)}
                enabled={true}
              >
                <Picker.Item label="Yearly" value="yearly" />
                <Picker.Item label="Monthly" value="monthly" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Daily" value="daily" />
              </Picker>
            </View>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text style={styles.pickerLabel}>Salary Start Date</Text>
            <TouchableOpacity
              style={styles.datePickerButton}
              onPress={() => !editMode && setShowDatePicker(true)}
              disabled={editMode}
            >
              <Text style={styles.datePickerText}>
                {jobData.salaryStartDate
                  ? new Date(jobData.salaryStartDate).toLocaleDateString()
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {showDatePicker && (
              <DateTimePicker
                value={jobData.salaryStartDate ? new Date(jobData.salaryStartDate) : new Date()}
                mode="date"
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={handleDateChange}
                maximumDate={new Date(2100, 11, 31)}
                minimumDate={new Date(2000, 0, 1)}
              />
            )}
          </View>

          {/* Remote toggle always editable */}
          <TouchableOpacity
            style={[styles.remoteToggle, jobData.remote && styles.remoteToggleActive]}
            onPress={() => handleInputChange('remote', !jobData.remote)}
          >
            <Icon
              name={jobData.remote ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color={jobData.remote ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[styles.remoteText, jobData.remote && styles.remoteTextActive]}>
              Remote Work Available
            </Text>
          </TouchableOpacity>

          {/* Description only editable in create mode */}
          <Text style={styles.sectionTitle}>Job Description *</Text>
          <InputField
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            value={jobData.description}
            onChangeText={(value) => handleInputChange('description', value)}
            multiline
            numberOfLines={6}
            style={styles.descriptionInput}
            editable={!editMode}
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}

          {/* Requirements, Benefits always editable */}
          {renderRequirements()}
          {errors.requirements && <Text style={styles.errorText}>{errors.requirements}</Text>}
          {renderBenefits()}
          {errors.benefits && <Text style={styles.errorText}>{errors.benefits}</Text>}
          {errors.submit && <Text style={styles.errorText}>{errors.submit}</Text>}

          <Button
            title={editMode ? 'Update Job' : 'Post Job'}
            onPress={handleSubmit}
            loading={loading}
            style={styles.submitButton}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  errorText: {
    color: COLORS.error,
    fontSize: 13,
    marginTop: 2,
    marginBottom: 8,
    fontFamily: FONTS.medium,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: 20,
    paddingTop: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: FONTS.bold,
    color: COLORS.white,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: FONTS.regular,
    color: COLORS.white,
    opacity: 0.9,
  },
  form: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 16,
    marginTop: 16,
  },
  pickerContainer: {
    marginVertical: 10,
  },
  pickerLabel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 5,
  },
  picker: {
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
  },
    fullWidthInputWrapper: {
    width: '100%',
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },
  fullWidthInput: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.inputBackground,
    fontSize: 16
  },

  remoteToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.inputBackground,
    marginVertical: 10,
  },
  remoteToggleActive: {
    backgroundColor: COLORS.primaryLight,
  },
  remoteText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginLeft: 12,
  },
  remoteTextActive: {
    color: COLORS.primary,
  },
  descriptionInput: {
    minHeight: 120,
    textAlignVertical: 'top',
  },
  dynamicSection: {
    marginVertical: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  addButton: {
    padding: 8,
  },
  dynamicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dynamicInput: {
    flex: 1,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    width: '100%',
  },
  bigInput: {
    flex: 1,
    width: '100%',
    borderWidth: 1,
    borderColor: COLORS.inputBorder,
    borderRadius: 8,
    padding: 12,
    backgroundColor: COLORS.inputBackground,
    fontSize: 16,
  },
  salarySection: {
    marginVertical: 16,
  },
  salaryLabel: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    marginBottom: 4,
    marginTop: 8,
  },
  datePickerButton: {
    padding: 12,
    backgroundColor: COLORS.inputBackground,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  datePickerText: {
    fontSize: 16,
    color: COLORS.text,
  },
  removeButton: {
    padding: 8,
    marginLeft: 8,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default PostJobScreen;

