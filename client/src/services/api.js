import { API_BASE_URL, API_ENDPOINTS } from '../utils/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Helper for requests
const request = async (url, options = {}) => {
  try {
    console.log('Making request to:', url, 'with method:', options.method || 'GET');
    
    const token = await AsyncStorage.getItem('token');
    const headers = {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const res = await fetch(url, { 
      ...options, 
      headers,
      timeout: 10000 // 10 second timeout
    });

    let data;
    const contentType = res.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await res.json();
    } else {
      const text = await res.text();
      console.error('Non-JSON response:', text);
      throw new Error('Invalid response format from server');
    }
    
    if (!res.ok) {
      const errorMessage = data.error || data.message || 'API Error';
      // Log validation details if present
      if (data.details) {
        console.error('Validation details:', data.details);
      }
      console.error('API Error:', {
        status: res.status,
        message: errorMessage,
        url: url,
        method: options.method || 'GET',
        response: data
      });
      throw new Error(errorMessage + (data.details ? `\nDetails: ${JSON.stringify(data.details)}` : ''));
    }
    
    console.log('Successful response from:', url);
    return data;
  } catch (error) {
    console.error('Request failed:', {
      url: url,
      method: options.method || 'GET',
      error: error.message
    });

    if (error.message === 'Network request failed') {
      throw new Error('Unable to connect to server. Please check your internet connection.');
    } else if (error.message.includes('timeout')) {
      throw new Error('Request timed out. Please try again.');
    }
    
    throw error;
  }
};

// Auth
export const login = async (email, password) => {
  const response = await request(`${API_BASE_URL}${API_ENDPOINTS.auth.login}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return response;
};

export const signup = async (userData) =>
  request(`${API_BASE_URL}${API_ENDPOINTS.auth.signup}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

// Jobs
export const getJobs = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await request(`${API_BASE_URL}${API_ENDPOINTS.jobs.list}${params ? `?${params}` : ''}`);
  return response.data;
};

export const getJobById = async (jobId) =>
  request(`${API_BASE_URL}${API_ENDPOINTS.jobs.detail.replace(':id', jobId)}`);

export const postJob = async (jobData) =>
  request(`${API_BASE_URL}${API_ENDPOINTS.jobs.create}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });

export const updateJob = async (jobId, jobData) =>
  request(`${API_BASE_URL}${API_ENDPOINTS.jobs.update.replace(':id', jobId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(jobData),
  });

export const deleteJob = async (jobId) =>
  request(`${API_BASE_URL}${API_ENDPOINTS.jobs.delete.replace(':id', jobId)}`, {
    method: 'DELETE' });

// Applications
export const submitJobApplication = async (jobId, applicationData) => {
  console.log('[api] submitJobApplication called with jobId:', jobId, 'and applicationData:', applicationData);
  try {
    const response = await request(`${API_BASE_URL}${API_ENDPOINTS.applications.create}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ jobId, ...applicationData }),
    });
    console.log('[api] submitJobApplication response:', response);
    return response;
  } catch (error) {
    console.error('[api] Error in submitJobApplication:', error);
    throw error;
  }
};

export const getUserApplications = async (userId) =>
  request(`${API_BASE_URL}/applications/my-applications`);

export const getJobApplications = async (recruiterId) => {
  console.log('Calling getJobApplications with ID:', recruiterId);
  const response = await request(`${API_BASE_URL}/applications/recruiter/all`);
  console.log('getJobApplications raw response:', response);
  return response;
};

export const getRecruiterJobs = async (recruiterId) => {
  console.log('API: Fetching jobs for recruiter:', recruiterId);
  const response = await request(`${API_BASE_URL}${API_ENDPOINTS.jobs.list}?recruiter=${recruiterId}`);
  console.log('API: Raw jobs response:', response);
  return response;
};

export const updateApplicationStatus = async (applicationId, status) =>
  request(`${API_BASE_URL}/applications/${applicationId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });

// User profile
export const getUserProfile = async (userId) =>
  request(`${API_BASE_URL}${API_ENDPOINTS.users.profile}?userId=${userId}`);

export const updateUserProfile = async (profileData) =>
  request(`${API_BASE_URL}/users/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(profileData),
  });

// Saved Jobs
export const getSavedJobs = async () =>
  request(`${API_BASE_URL}/jobs/saved`);

export const saveJob = async (jobId) =>
  request(`${API_BASE_URL}/jobs/${jobId}/save`, {
    method: 'POST'
  });

export const unsaveJob = async (jobId) =>
  request(`${API_BASE_URL}/jobs/${jobId}/unsave`, {
    method: 'DELETE'
  });

// Stats
export const getJobStats = async () =>
  request(`${API_BASE_URL}/stats/jobs`);

export const getRecruiterStats = async (recruiterId) => {
  console.log('Calling getRecruiterStats with ID:', recruiterId);
  try {
    // Use recruiterId parameter as it matches the backend
    const url = `${API_BASE_URL}/stats/recruiter?recruiterId=${recruiterId}`;
    console.log('Stats URL:', url);
    const response = await request(url);
    console.log('getRecruiterStats raw response:', response);
    // Return the raw response since backend already includes success and data properties
    return response;
  } catch (error) {
    console.error('Error in getRecruiterStats:', error);
    throw error;
  }
};

// Notifications
export const getNotifications = async () =>
  request(`${API_BASE_URL}/notifications`);

export const markNotificationAsRead = async (notificationId) =>
  request(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PATCH'
  });

export const getUnreadNotificationCount = async () =>
  request(`${API_BASE_URL}/notifications/unread-count`);

// Analytics
export const getUserAnalytics = async (userId) =>
  request(`${API_BASE_URL}/analytics/user/${userId}`);

export const getJobAnalytics = async (jobId) =>
  request(`${API_BASE_URL}/analytics/job/${jobId}`);

export const getCompanyAnalytics = async (companyId) =>
  request(`${API_BASE_URL}/analytics/company/${companyId}`);

export const getPlatformStats = async () =>
  request(`${API_BASE_URL}/analytics/stats`);

// Companies
export const getCompanies = async () =>
  request(`${API_BASE_URL}/companies`);

export const getCompanyById = async (companyId) =>
  request(`${API_BASE_URL}/companies/${companyId}`);

export const createCompany = async (companyData) =>
  request(`${API_BASE_URL}/companies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companyData)
  });

export const updateCompany = async (companyId, companyData) =>
  request(`${API_BASE_URL}/companies/${companyId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(companyData)
  });

export const deleteCompany = async (companyId) =>
  request(`${API_BASE_URL}/companies/${companyId}`, {
    method: 'DELETE'
  });

