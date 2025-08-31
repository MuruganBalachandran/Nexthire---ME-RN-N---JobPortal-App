import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Linking,
  Platform,
  StatusBar,
  Animated,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';
import ApplicantProfile from '../../components/recruiter/applications/ApplicantProfile';
import QuickActions from '../../components/recruiter/applications/QuickActions';
import StatusActions from '../../components/recruiter/applications/StatusActions';
import { useDispatch } from 'react-redux';
import { updateApplicationStatus } from '../../redux/slices/applicationsSlice';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';
import { formatDate } from '../../utils/formatDate';

const ApplicantDetailScreen = ({ route, navigation }) => {
  const { application } = route.params;
  const dispatch = useDispatch();
  
  // Ensure we have valid data
  const applicant = application?.applicant || {};
  const job = application?.job || {};
  const [currentStatus, setCurrentStatus] = useState(application?.status || 'pending');
  const [loading, setLoading] = useState(false);
  const [expandedSection, setExpandedSection] = useState(null);

  const handleStatusUpdate = (newStatus) => {
    Alert.alert(
      'Update Status',
      `Are you sure you want to ${newStatus} this application?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: async () => {
            setLoading(true);
            try {
              const resultAction = await dispatch(updateApplicationStatus({ 
                applicationId: application.id || application._id, 
                status: newStatus 
              }));
              if (updateApplicationStatus.fulfilled.match(resultAction)) {
                setCurrentStatus(newStatus);
                Alert.alert('Success', `Application status updated to ${newStatus}`);
              } else {
                // Show a user-friendly error if route not found
                const errorMsg = resultAction.payload || 'Failed to update status';
                if (errorMsg.includes('not found')) {
                  Alert.alert('Error', `Route not found for this application.\n\n${errorMsg}`);
                } else {
                  Alert.alert('Error', errorMsg);
                }
              }
            } catch (error) {
              // Show a user-friendly error if route not found
              if (error.message && error.message.includes('not found')) {
                Alert.alert('Error', `Route not found for this application.\n\n${error.message}`);
              } else {
                Alert.alert('Error', error.message || 'Failed to update status');
              }
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  const handleContactApplicant = (type) => {
    const { applicant } = application;
    
    if (type === 'email') {
      Linking.openURL(`mailto:${applicant.email}`);
    } else if (type === 'phone') {
      Linking.openURL(`tel:${applicant.phone}`);
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return '#FF9800';
      case 'reviewing':
        return '#2196F3';
      case 'accepted':
        return '#4CAF50';
      case 'rejected':
        return '#F44336';
      case 'shortlisted':
        return '#9C27B0';
      default:
        return COLORS.textSecondary;
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'hourglass-empty';
      case 'reviewing':
        return 'rate-review';
      case 'accepted':
        return 'check-circle';
      case 'rejected':
        return 'cancel';
      case 'shortlisted':
        return 'star';
      default:
        return 'help-outline';
    }
  };

  const InfoRow = ({ icon, label, value, onPress, color = COLORS.primary }) => (
    <TouchableOpacity 
      style={styles.infoRow} 
      onPress={onPress}
      disabled={!onPress}
      activeOpacity={onPress ? 0.7 : 1}
    >
      <View style={[styles.infoIcon, { backgroundColor: color + '15' }]}>
        <Icon name={icon} size={22} color={color} />
      </View>
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[
          styles.infoValue, 
          onPress && styles.infoValueClickable
        ]}>
          {value}
        </Text>
      </View>
      {onPress && (
        <View style={styles.externalLinkIcon}>
          <Icon name="open-in-new" size={18} color={COLORS.textSecondary} />
        </View>
      )}
    </TouchableOpacity>
  );

  const ExpandableSection = ({ title, icon, children, sectionKey }) => {
    const isExpanded = expandedSection === sectionKey;
    
    return (
      <View style={styles.expandableSection}>
        <TouchableOpacity 
          style={styles.expandableHeader}
          onPress={() => setExpandedSection(isExpanded ? null : sectionKey)}
        >
          <View style={styles.expandableHeaderLeft}>
            <View style={[styles.sectionIcon, { backgroundColor: COLORS.primary + '15' }]}>
              <Icon name={icon} size={20} color={COLORS.primary} />
            </View>
            <Text style={styles.sectionTitle}>{title}</Text>
          </View>
          <Icon 
            name={isExpanded ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
            size={24} 
            color={COLORS.textSecondary} 
          />
        </TouchableOpacity>
        {isExpanded && (
          <Animated.View style={styles.expandableContent}>
            {children}
          </Animated.View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />
      
      {/* Enhanced Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Applicant Details</Text>
          
          <TouchableOpacity style={styles.moreButton}>
            <Icon name="more-vert" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Applicant Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.avatar}
            >
              <Text style={styles.avatarText}>
                {(applicant.fullName || 'A').charAt(0).toUpperCase()}
              </Text>
            </LinearGradient>
            <View style={[styles.statusDot, { backgroundColor: getStatusColor(currentStatus) }]} />
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.applicantName}>{applicant.fullName || 'Anonymous'}</Text>
            <Text style={styles.jobTitle} numberOfLines={1}>
              Applied for: {job.title || 'Unknown Position'}
            </Text>
            
            <View style={styles.statusRow}>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: getStatusColor(currentStatus) + '20' }
              ]}>
                <Icon 
                  name={getStatusIcon(currentStatus)} 
                  size={14} 
                  color={getStatusColor(currentStatus)} 
                />
                <Text style={[
                  styles.statusText, 
                  { color: getStatusColor(currentStatus) }
                ]}>
                  {currentStatus.charAt(0).toUpperCase() + currentStatus.slice(1)}
                </Text>
              </View>
              
              <Text style={styles.appliedDate}>
                Applied {formatDate(application.appliedDate, 'relative')}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.scrollView} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Quick Actions */}
        <View style={styles.quickActionsContainer}>
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleContactApplicant('email')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#4CAF50' + '15' }]}>
              <Icon name="email" size={20} color="#4CAF50" />
            </View>
            <Text style={styles.quickActionText}>Email</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => handleContactApplicant('phone')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#2196F3' + '15' }]}>
              <Icon name="phone" size={20} color="#2196F3" />
            </View>
            <Text style={styles.quickActionText}>Call</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Coming Soon', 'Schedule interview feature will be available in a future update.')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#FF9800' + '15' }]}>
              <Icon name="schedule" size={20} color="#FF9800" />
            </View>
            <Text style={styles.quickActionText}>Schedule</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.quickActionButton}
            onPress={() => Alert.alert('Coming Soon', 'Notes feature will be available in a future update.')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: '#9C27B0' + '15' }]}>
              <Icon name="note-add" size={20} color="#9C27B0" />
            </View>
            <Text style={styles.quickActionText}>Notes</Text>
          </TouchableOpacity>
        </View>

        {/* Contact Information */}
        <ExpandableSection 
          title="Contact Information" 
          icon="contacts" 
          sectionKey="contact"
        >
          <View style={styles.infoCard}>
            <InfoRow
              icon="email"
              label="Email Address"
              value={applicant.email || 'Not provided'}
              onPress={() => handleContactApplicant('email')}
              color="#4CAF50"
            />
            <InfoRow
              icon="phone"
              label="Phone Number"
              value={applicant.phone || 'Not provided'}
              onPress={() => handleContactApplicant('phone')}
              color="#2196F3"
            />
            <InfoRow
              icon="location-on"
              label="Location"
              value={applicant.location || 'Not specified'}
              color="#FF5722"
            />
          </View>
        </ExpandableSection>

        {/* Professional Details */}
        <ExpandableSection 
          title="Professional Details" 
          icon="work" 
          sectionKey="professional"
        >
          <View style={styles.infoCard}>
            <InfoRow
              icon="schedule"
              label="Applied Date"
              value={formatDate(application.appliedDate)}
              color="#673AB7"
            />
            <InfoRow
              icon="trending-up"
              label="Experience"
              value={`${application.experience} years`}
              color="#009688"
            />
            {application.expectedSalary && (
              <InfoRow
                icon="attach-money"
                label="Expected Salary"
                value={application.expectedSalary}
                color="#4CAF50"
              />
            )}
            {application.applicant.currentCompany && (
              <InfoRow
                icon="business"
                label="Current Company"
                value={application.applicant.currentCompany}
                color="#FF9800"
              />
            )}
          </View>
        </ExpandableSection>

        {/* Cover Letter */}
        <ExpandableSection 
          title="Cover Letter" 
          icon="description" 
          sectionKey="coverLetter"
        >
          <View style={styles.coverLetterCard}>
            {application.coverLetter ? (
              <>
                <View style={styles.coverLetterHeader}>
                  <Icon name="format-quote" size={24} color={COLORS.primary} />
                  <Text style={styles.coverLetterLabel}>Personal Message</Text>
                </View>
                <Text style={styles.coverLetterText}>
                  {application.coverLetter}
                </Text>
              </>
            ) : (
              <View style={styles.noCoverLetter}>
                <Icon name="description" size={32} color={COLORS.textSecondary} />
                <Text style={styles.noCoverLetterText}>No cover letter provided</Text>
              </View>
            )}
          </View>
        </ExpandableSection>

        {/* Skills */}
        {applicant.skills && (
          <ExpandableSection 
            title="Skills & Expertise" 
            icon="psychology" 
            sectionKey="skills"
          >
            <View style={styles.skillsCard}>
              <View style={styles.skillsContainer}>
                {Array.isArray(applicant.skills) 
                  ? applicant.skills.map((skill, index) => (
                      <View key={index} style={styles.skillBadge}>
                        <Text style={styles.skillText}>{skill}</Text>
                      </View>
                    ))
                  : typeof applicant.skills === 'string'
                    ? applicant.skills.split(',').map((skill, index) => (
                        <View key={index} style={styles.skillBadge}>
                          <Text style={styles.skillText}>{skill.trim()}</Text>
                        </View>
                      ))
                    : (
                      <View style={styles.noSkills}>
                        <Text style={styles.noSkillsText}>No skills listed</Text>
                      </View>
                    )
                }
              </View>
            </View>
          </ExpandableSection>
        )}

        {/* Application Timeline */}
        <ExpandableSection 
          title="Application Timeline" 
          icon="timeline" 
          sectionKey="timeline"
        >
          <View style={styles.timelineCard}>
            <View style={styles.timelineItem}>
              <View style={[styles.timelineIcon, { backgroundColor: '#4CAF50' + '20' }]}>
                <Icon name="send" size={16} color="#4CAF50" />
              </View>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>Application Submitted</Text>
                <Text style={styles.timelineDate}>
                  {formatDate(application.appliedDate)}
                </Text>
              </View>
            </View>
            
            {currentStatus !== 'pending' && (
              <View style={styles.timelineItem}>
                <View style={[styles.timelineIcon, { backgroundColor: getStatusColor(currentStatus) + '20' }]}>
                  <Icon name={getStatusIcon(currentStatus)} size={16} color={getStatusColor(currentStatus)} />
                </View>
                <View style={styles.timelineContent}>
                  <Text style={styles.timelineTitle}>Status Updated</Text>
                  <Text style={styles.timelineDate}>
                    Status changed to {currentStatus}
                  </Text>
                </View>
              </View>
            )}
          </View>
        </ExpandableSection>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Enhanced Action Buttons */}
      {(currentStatus === 'pending' || currentStatus === 'reviewing') && (
        <View style={styles.actionContainer}>
          <LinearGradient
            colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,1)']}
            style={styles.actionGradient}
          >
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.rejectButton]}
                onPress={() => handleStatusUpdate('rejected')}
                disabled={loading}
              >
                <Icon name="cancel" size={20} color="#F44336" />
                <Text style={[styles.actionButtonText, { color: '#F44336' }]}>
                  Reject
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.shortlistButton]}
                onPress={() => handleStatusUpdate('shortlisted')}
                disabled={loading}
              >
                <Icon name="star" size={20} color="#FF9800" />
                <Text style={[styles.actionButtonText, { color: '#FF9800' }]}>
                  Shortlist
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.actionButton, styles.acceptButton]}
                onPress={() => handleStatusUpdate('accepted')}
                disabled={loading}
              >
                <LinearGradient
                  colors={['#4CAF50', '#45a049']}
                  style={styles.acceptGradient}
                >
                  <Icon name="check-circle" size={20} color={COLORS.white} />
                  <Text style={[styles.actionButtonText, { color: COLORS.white }]}>
                    Accept
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </LinearGradient>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  
  // Header Styles
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 24,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  moreButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Profile Card Styles
  profileCard: {
    marginHorizontal: 20,
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 20,
    padding: 24,
    flexDirection: 'row',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  avatarText: {
    fontSize: 28,
    fontFamily: FONTS.bold,
    color: COLORS.white,
  },
  statusDot: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 3,
    borderColor: COLORS.white,
  },
  profileInfo: {
    flex: 1,
  },
  applicantName: {
    fontSize: 22,
    fontFamily: FONTS.bold,
    color: COLORS.text,
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 15,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  statusText: {
    fontSize: 13,
    fontFamily: FONTS.semiBold,
  },
  appliedDate: {
    fontSize: 12,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  // Quick Actions Styles
  quickActionsContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 12,
  },
  quickActionButton: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  quickActionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  quickActionText: {
    fontSize: 12,
    fontFamily: FONTS.medium,
    color: COLORS.text,
  },

  // Scroll Content Styles
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },

  // Expandable Section Styles
  expandableSection: {
    marginHorizontal: 20,
    marginBottom: 16,
    backgroundColor: COLORS.white,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  expandableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: COLORS.white,
  },
  expandableHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: FONTS.bold,
    color: COLORS.text,
  },
  expandableContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },

  // Info Card Styles
  infoCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  infoIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.text,
    lineHeight: 20,
  },
  infoValueClickable: {
    color: COLORS.primary,
  },
  externalLinkIcon: {
    marginLeft: 8,
  },

  // Cover Letter Styles
  coverLetterCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 20,
  },
  coverLetterHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  coverLetterLabel: {
    fontSize: 16,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginLeft: 12,
  },
  coverLetterText: {
    fontSize: 15,
    fontFamily: FONTS.regular,
    color: COLORS.text,
    lineHeight: 24,
  },
  noCoverLetter: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  noCoverLetterText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
    marginTop: 12,
  },

  // Skills Styles
  skillsCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: COLORS.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  skillText: {
    fontSize: 14,
    fontFamily: FONTS.medium,
    color: COLORS.primary,
  },
  noSkills: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  noSkillsText: {
    fontSize: 16,
    fontFamily: FONTS.medium,
    color: COLORS.textSecondary,
  },

  // Timeline Styles
  timelineCard: {
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    padding: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  timelineIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  timelineContent: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 15,
    fontFamily: FONTS.semiBold,
    color: COLORS.text,
    marginBottom: 4,
  },
  timelineDate: {
    fontSize: 13,
    fontFamily: FONTS.regular,
    color: COLORS.textSecondary,
  },

  // Action Container Styles
  actionContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  actionGradient: {
    paddingTop: 16,
    paddingBottom: Platform.OS === 'ios' ? 34 : 20,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 16,
    gap: 8,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  rejectButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#F44336',
  },
  shortlistButton: {
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: '#FF9800',
  },
  acceptButton: {
    overflow: 'hidden',
  },
  acceptGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    gap: 8,
  },
  actionButtonText: {
    fontSize: 16,
    fontFamily: FONTS.bold,
  },
});

export default ApplicantDetailScreen;