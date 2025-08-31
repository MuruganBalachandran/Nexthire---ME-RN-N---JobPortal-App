import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import InputField from '../../components/InputField';
import Button from '../../components/Button';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import { JOB_TYPES, EXPERIENCE_LEVELS } from '../../utils/constants';
import { updateJob } from '../../services/api';

const EditJobScreen = ({ navigation, route }) => {
  const job = route?.params?.job || null;
  const [jobData, setJobData] = useState({
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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (job) {
      setJobData({
        location: job.location || '',
        type: job.type || 'full-time',
        remote: job.remote || false,
        salaryMin: job.salary?.min?.toString() || '',
        salaryMax: job.salary?.max?.toString() || '',
        salaryCurrency: job.salary?.currency || 'USD',
        salaryPeriod: job.salary?.period || 'yearly',
        salaryStartDate: job.salaryStartDate || '',
        experience: job.experience || 'entry',
        description: job.description || '',
        requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : (job.requirements || ''),
        benefits: Array.isArray(job.benefits) ? job.benefits.join('\n') : (job.benefits || ''),
      });
    }
  }, [job]);

  const handleInputChange = (field, value) => {
    setJobData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const validateForm = () => {
    const { location, description, salaryMin, salaryMax, experience, requirements, benefits } = jobData;
    const newErrors = {};
    if (!location.trim()) {
      newErrors.location = 'Please enter job location';
    }
    if (!description.trim()) {
      newErrors.description = 'Please enter a job description';
    }
    if (!salaryMin || isNaN(salaryMin) || Number(salaryMin) <= 0) {
      newErrors.salaryMin = 'Please enter a valid minimum salary';
    }
    if (!salaryMax || isNaN(salaryMax) || Number(salaryMax) < Number(salaryMin)) {
      newErrors.salaryMax = 'Maximum salary must be greater than or equal to minimum salary';
    }
    if (!EXPERIENCE_LEVELS.map(e => e.value).includes(experience)) {
      newErrors.experience = 'Please select a valid experience level';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    console.log('[EditJobScreen] Update button pressed');
    if (loading) {
      console.log('[EditJobScreen] Prevented double submit');
      return;
    }
    setErrors({});
    if (!validateForm()) {
      console.log('[EditJobScreen] Validation failed', errors);
      return;
    }
    setLoading(true);
    try {
      const requirementsArray = jobData.requirements
        ? jobData.requirements.split(/\r?\n/).map(r => r.trim()).filter(r => r.length > 0)
        : [];
      const benefitsArray = jobData.benefits
        ? jobData.benefits.split(/\r?\n/).map(b => b.trim()).filter(b => b.length > 0)
        : [];
      const updateFields = {
        // Always include title and company for backend validation
        title: job?.title || '',
        company: job?.company || '',
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
      console.log('[EditJobScreen] Sending updateJob for id:', job?._id, updateFields);
      const res = await updateJob(job._id, updateFields);
      console.log('[EditJobScreen] updateJob response:', res);
      if (res && res.success) {
        Alert.alert('Success', 'Job updated successfully!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      } else {
        throw new Error(res?.message || 'Failed to update job');
      }
    } catch (error) {
      console.log('[EditJobScreen] Update error:', error);
      setErrors({ submit: error.message || 'Failed to update job' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: COLORS.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        <View style={{ backgroundColor: COLORS.primary, padding: 20, paddingTop: 40 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 12, padding: 4 }}>
              <Icon name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <Text style={{ fontSize: 24, fontFamily: FONTS.bold, color: COLORS.white, marginBottom: 4 }}>Edit Job</Text>
          </View>
          <Text style={{ fontSize: 16, fontFamily: FONTS.regular, color: COLORS.white, opacity: 0.9 }}>Update job details (title and company cannot be changed)</Text>
        </View>
        <View style={{ padding: 20 }}>
          <Text style={{ fontSize: 18, fontFamily: FONTS.bold, color: COLORS.text, marginBottom: 16, marginTop: 16 }}>Basic Information</Text>
          <InputField
            placeholder="Job Title"
            value={job?.title || ''}
            icon="work"
            editable={false}
          />
          <InputField
            placeholder="Company Name"
            value={job?.company || ''}
            icon="business"
            editable={false}
          />
          <InputField
            placeholder="Location *"
            value={jobData.location}
            onChangeText={value => handleInputChange('location', value)}
            icon="location-on"
          />
          {errors.location && <Text style={{ color: COLORS.error }}>{errors.location}</Text>}
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 16, fontFamily: FONTS.medium, color: COLORS.text, marginBottom: 5 }}>Job Type</Text>
            <Picker
              selectedValue={jobData.type}
              style={{ backgroundColor: COLORS.inputBackground, borderRadius: 8 }}
              onValueChange={value => handleInputChange('type', value)}
            >
              {JOB_TYPES.map(type => (
                <Picker.Item key={type.value} label={type.label} value={type.value} />
              ))}
            </Picker>
          </View>
          <View style={{ marginVertical: 10 }}>
            <Text style={{ fontSize: 16, fontFamily: FONTS.medium, color: COLORS.text, marginBottom: 5 }}>Experience Level</Text>
            <Picker
              selectedValue={jobData.experience}
              style={{ backgroundColor: COLORS.inputBackground, borderRadius: 8 }}
              onValueChange={value => handleInputChange('experience', value)}
            >
              {EXPERIENCE_LEVELS.map(level => (
                <Picker.Item key={level.value} label={level.label} value={level.value} />
              ))}
            </Picker>
            {errors.experience && <Text style={{ color: COLORS.error }}>{errors.experience}</Text>}
          </View>
          <View style={{ marginVertical: 16 }}>
            <Text style={{ fontSize: 16, fontFamily: FONTS.medium, color: COLORS.text, marginBottom: 4, marginTop: 8 }}>Min Salary *</Text>
            <InputField
              placeholder="Min Salary"
              value={jobData.salaryMin}
              onChangeText={value => handleInputChange('salaryMin', value)}
              icon="attach-money"
              keyboardType="numeric"
            />
            {errors.salaryMin && <Text style={{ color: COLORS.error }}>{errors.salaryMin}</Text>}
            <Text style={{ fontSize: 16, fontFamily: FONTS.medium, color: COLORS.text, marginBottom: 4, marginTop: 8 }}>Max Salary *</Text>
            <InputField
              placeholder="Max Salary"
              value={jobData.salaryMax}
              onChangeText={value => handleInputChange('salaryMax', value)}
              icon="attach-money"
              keyboardType="numeric"
            />
            {errors.salaryMax && <Text style={{ color: COLORS.error }}>{errors.salaryMax}</Text>}
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 8 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: FONTS.medium, color: COLORS.text, marginBottom: 5 }}>Currency</Text>
              <Picker
                selectedValue={jobData.salaryCurrency}
                style={{ backgroundColor: COLORS.inputBackground, borderRadius: 8 }}
                onValueChange={value => handleInputChange('salaryCurrency', value)}
              >
                <Picker.Item label="USD" value="USD" />
                <Picker.Item label="INR" value="INR" />
                <Picker.Item label="EUR" value="EUR" />
                <Picker.Item label="GBP" value="GBP" />
                <Picker.Item label="JPY" value="JPY" />
              </Picker>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontFamily: FONTS.medium, color: COLORS.text, marginBottom: 5 }}>Period</Text>
              <Picker
                selectedValue={jobData.salaryPeriod}
                style={{ backgroundColor: COLORS.inputBackground, borderRadius: 8 }}
                onValueChange={value => handleInputChange('salaryPeriod', value)}
              >
                <Picker.Item label="Yearly" value="yearly" />
                <Picker.Item label="Monthly" value="monthly" />
                <Picker.Item label="Weekly" value="weekly" />
                <Picker.Item label="Daily" value="daily" />
              </Picker>
            </View>
          </View>
          <View style={{ marginTop: 8 }}>
            <Text style={{ fontSize: 16, fontFamily: FONTS.medium, color: COLORS.text, marginBottom: 5 }}>Salary Start Date</Text>
            <TouchableOpacity
              style={{ padding: 12, backgroundColor: COLORS.inputBackground, borderRadius: 8, alignItems: 'center', marginTop: 4 }}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={{ fontSize: 16, color: COLORS.text }}>
                {jobData.salaryStartDate
                  ? new Date(jobData.salaryStartDate).toLocaleDateString()
                  : 'Select Date'}
              </Text>
            </TouchableOpacity>
            {/* DateTimePicker logic can be added here if needed */}
          </View>
          <TouchableOpacity
            style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 16, paddingHorizontal: 12, borderRadius: 8, backgroundColor: jobData.remote ? COLORS.primaryLight : COLORS.inputBackground, marginVertical: 10 }}
            onPress={() => handleInputChange('remote', !jobData.remote)}
          >
            <Icon
              name={jobData.remote ? 'check-box' : 'check-box-outline-blank'}
              size={24}
              color={jobData.remote ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={{ fontSize: 16, fontFamily: FONTS.medium, color: jobData.remote ? COLORS.primary : COLORS.textSecondary, marginLeft: 12 }}>
              Remote Work Available
            </Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontFamily: FONTS.bold, color: COLORS.text, marginBottom: 16, marginTop: 16 }}>Job Description *</Text>
          <InputField
            placeholder="Describe the role, responsibilities, and what you're looking for..."
            value={jobData.description}
            onChangeText={value => handleInputChange('description', value)}
            multiline
            numberOfLines={6}
            style={{ minHeight: 120, textAlignVertical: 'top' }}
          />
          {errors.description && <Text style={{ color: COLORS.error }}>{errors.description}</Text>}
          <View style={{ marginVertical: 16 }}>
            <Text style={{ fontSize: 18, fontFamily: FONTS.bold, color: COLORS.text, marginBottom: 8 }}>Requirements</Text>
            <InputField
              placeholder="List requirements for the job..."
              value={jobData.requirements}
              onChangeText={value => handleInputChange('requirements', value)}
              multiline
              numberOfLines={4}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
          </View>
          <View style={{ marginVertical: 16 }}>
            <Text style={{ fontSize: 18, fontFamily: FONTS.bold, color: COLORS.text, marginBottom: 8 }}>Benefits</Text>
            <InputField
              placeholder="List benefits for the job..."
              value={jobData.benefits}
              onChangeText={value => handleInputChange('benefits', value)}
              multiline
              numberOfLines={4}
              style={{ minHeight: 80, textAlignVertical: 'top' }}
            />
          </View>
          {errors.submit && <Text style={{ color: COLORS.error }}>{errors.submit}</Text>}
          <Button
              title={loading ? 'Updating...' : 'Update Job'}
              onPress={() => {
                console.log('[EditJobScreen] Update button onPress fired');
                handleSubmit();
              }}
              loading={loading}
              style={{ marginTop: 24, marginBottom: 40 }}
            />
  console.log('[EditJobScreen] handleSubmit called');
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditJobScreen;
