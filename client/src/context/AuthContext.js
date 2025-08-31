
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as api from '../services/api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const userData = await AsyncStorage.getItem('user');
      const token = await AsyncStorage.getItem('token');
      
      console.log('AuthContext: Loading stored user data:', userData);
      console.log('AuthContext: Token exists:', !!token);
      
      if (userData && token) {
        const parsedUser = JSON.parse(userData);
        console.log('AuthContext: Parsed user:', parsedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } else {
        console.log('AuthContext: No stored user data or token found');
      }
    } catch (error) {
      console.error('Error loading user:', error);
    } finally {
      setLoading(false);
    }
  };


  const login = async (email, password) => {
    try {
      const response = await api.login(email, password);
      console.log('AuthContext: Login response:', response);
      if (!response || !response.success) {
        throw new Error(response?.error || 'Login failed');
      }
      const userData = response.data;
      const token = response.token;
      if (!userData || !token) {
        throw new Error('Invalid response from server');
      }
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      await AsyncStorage.setItem('token', token);
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      console.error('AuthContext: Login error:', error);
      throw new Error(error.message || 'Invalid email or password');
    }
  };


  const signup = async ({ fullName, email, password, userType }) => {
    try {
      const newUser = await api.signup({ fullName, email, password, userType });
      await AsyncStorage.setItem('user', JSON.stringify(newUser));
      setUser(newUser);
      setIsAuthenticated(true);
      return newUser;
    } catch (error) {
      throw new Error(error.message || 'Failed to create account');
    }
  };

  const updateProfile = async (profileData) => {
    try {
      if (!user) throw new Error('No user logged in');
      // Call backend API to update profile
      const updatedUser = await api.updateUserProfile(user._id, profileData);
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      return updatedUser;
    } catch (error) {
      throw new Error(error.message || 'Failed to update profile');
    }
  };

  const logout = async () => {
    console.log('AuthContext: Starting logout process');
    try {
      console.log('AuthContext: Removing user data from AsyncStorage');
      await AsyncStorage.removeItem('user');
      console.log('AuthContext: Setting user to null');
      setUser(null);
      console.log('AuthContext: Setting isAuthenticated to false');
      setIsAuthenticated(false);
      console.log('AuthContext: Logout complete');
    } catch (error) {
      console.error('AuthContext: Error during logout:', error);
      throw error; // Re-throw the error so we can handle it in the component
    }
  };

  const resetPassword = async (email) => {
    try {
      // Mock password reset - In real app, this would call your API
      console.log('Password reset email sent to:', email);
      return { success: true, message: 'Password reset email sent' };
    } catch (error) {
      throw new Error('Failed to send password reset email');
    }
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    login,
    signup,
    logout,
    updateProfile,
    resetPassword,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

