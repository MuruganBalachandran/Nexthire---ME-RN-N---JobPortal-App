// screens/NotificationsScreen.jsx
import React, { useState , useEffect} from 'react';
import { View, StyleSheet, FlatList, StatusBar, Platform, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { clearNotifications } from '../redux/slices/notificationsSlice';
import { COLORS } from '../styles/colors';
import { FONTS } from '../styles/fonts';


import Header from '../components/notifications/Header';
import FilterChip from '../components/notifications/FilterChip';
import NotificationItem from '../components/notifications/NotificationItem';
import EmptyState from '../components/notifications/EmptyState';
import { getNotifications, markNotificationAsRead } from '../services/api';

const NotificationsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState('all');

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setLoading(true);
        const response = await getNotifications();
        setNotifications(response?.data || []);
        setError(null);
      } catch (err) {
        setError(err?.message || 'Failed to load notifications');
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const filterOptions = [
    { key: 'all', label: 'All', icon: 'notifications' },
    { key: 'unread', label: 'Unread', icon: 'circle' },
    { key: 'application', label: 'Applications', icon: 'assignment' },
    { key: 'job', label: 'Jobs', icon: 'work' },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  const getFilteredNotifications = () => {
    if (selectedFilter === 'all') return notifications;
    if (selectedFilter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === selectedFilter);
  };

  const filteredNotifications = getFilteredNotifications();

  // Mark notification as read handler
  const handleMarkAsRead = async (notification) => {
    try {
      await markNotificationAsRead(notification._id || notification.id);
      setNotifications((prev) => prev.map((n) =>
        (n._id === notification._id || n.id === notification.id)
          ? { ...n, read: true }
          : n
      ));
    } catch (err) {
      // Optionally show error
      console.error('Failed to mark notification as read', err);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <Header
        unreadCount={unreadCount}
        hasNotifications={notifications.length > 0}
        onClear={() => dispatch(clearNotifications())}
        onBack={() => navigation.goBack()}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          {/* Filters */}
          {notifications.length > 0 && (
            <View style={styles.filterContainer}>
              <FlatList
                horizontal
                data={filterOptions}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => (
                  <FilterChip
                    option={item}
                    isSelected={selectedFilter === item.key}
                    unreadCount={unreadCount}
                    onPress={() => setSelectedFilter(item.key)}
                  />
                )}
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.filterScrollContainer}
              />
            </View>
          )}

          {/* Notifications */}
          <FlatList
            data={filteredNotifications}
            keyExtractor={(item) => item.id?.toString?.() || item._id?.toString?.()}
            renderItem={({ item, index }) => (
              <NotificationItem
                item={item}
                index={index}
                onMarkRead={async (notification) => {
                  // Only mark this notification as read and update state for this card
                  try {
                    await markNotificationAsRead(notification._id || notification.id);
                    setNotifications((prev) => prev.map((n) =>
                      (n._id === notification._id || n.id === notification.id)
                        ? { ...n, read: true }
                        : n
                    ));
                  } catch (err) {
                    console.error('Failed to mark notification as read', err);
                  }
                }}
              />
            )}
            contentContainerStyle={[
              styles.listContainer,
              filteredNotifications.length === 0 && styles.emptyListContainer
            ]}
            ListEmptyComponent={<EmptyState selectedFilter={selectedFilter} />}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </>
      )}
    </View>
  );

};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
  },
  filterContainer: {
    backgroundColor: COLORS.white,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  filterScrollContainer: {
    paddingHorizontal: 20,
    gap: 12,
  },
  listContainer: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  emptyListContainer: {
    flex: 1,
  },
  separator: {
    height: 12,
  },
    loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
});

export default NotificationsScreen;
