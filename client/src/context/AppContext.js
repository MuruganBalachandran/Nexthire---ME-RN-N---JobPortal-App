import React, { createContext, useState, useContext } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState([]);
  const [appSettings, setAppSettings] = useState({
    pushNotifications: true,
    emailNotifications: true,
    darkMode: false,
    language: 'en',
  });

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
    setAppSettings(prev => ({ ...prev, darkMode: theme === 'light' }));
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      read: false,
      ...notification,
    };
    setNotifications(prev => [newNotification, ...prev]);
  };

  const markNotificationAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev =>
      prev.filter(notification => notification.id !== notificationId)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const updateAppSettings = (newSettings) => {
    setAppSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Mock notifications for demo
  const mockNotifications = [
    {
      id: '1',
      type: 'application',
      title: 'Application Received',
      message: 'Your application for Software Developer at Tech Corp has been received.',
      timestamp: new Date().toISOString(),
      read: false,
    },
    {
      id: '2',
      type: 'job',
      title: 'New Job Match',
      message: 'A new job matching your skills has been posted.',
      timestamp: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
      read: false,
    },
    {
      id: '3',
      type: 'profile',
      title: 'Profile Updated',
      message: 'Your profile has been successfully updated.',
      timestamp: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      read: true,
    },
  ];

  const initializeMockNotifications = () => {
    if (notifications.length === 0) {
      setNotifications(mockNotifications);
    }
  };

  const value = {
    theme,
    notifications,
    appSettings,
    toggleTheme,
    addNotification,
    markNotificationAsRead,
    removeNotification,
    clearAllNotifications,
    updateAppSettings,
    initializeMockNotifications,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

