import React from 'react';
import { View, Text, StatusBar, Animated, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import { COLORS } from '../../styles/colors';
import { FONT_WEIGHTS, FONTS } from '../../styles/fonts';

const HeaderSection = ({ scrollY, user, unreadCount }) => {
  const navigation = useNavigation();
  const headerOpacity = scrollY.interpolate({
    inputRange: [0, 100],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  return (
    <Animated.View style={[styles.headerContainer, { opacity: headerOpacity }]}>
      <StatusBar backgroundColor={COLORS.primary} barStyle="light-content" />
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.greeting}>
            <Text style={styles.welcome}>
              {new Date().getHours() < 12
                ? 'Good Morning'
                : new Date().getHours() < 18
                ? 'Good Afternoon'
                : 'Good Evening'}
            </Text>
            <Text style={styles.name} numberOfLines={1}>
              {user?.fullName?.split(' ')[0] || 'Guest'}
            </Text>
          </View>
          <View style={styles.headerIcons}>
            {user?.userType === 'jobseeker' && (
              <TouchableOpacity onPress={() => navigation.navigate('SavedJobs')}>
                <Icon name="bookmark-border" size={28} color={COLORS.white} style={styles.icon} />
              </TouchableOpacity>
            )}
            {user?.userType === 'recruiter' && (
              <TouchableOpacity onPress={() => navigation.navigate('RecruiterJobs')}>
                <Icon name="work" size={28} color={COLORS.white} style={styles.icon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={{ position: 'relative' }}>
              <Icon name="notifications" size={28} color={COLORS.white} style={styles.icon} />
              {unreadCount > 0 && (
                <View style={styles.unreadBadge}>
                  <Text style={styles.unreadBadgeText}>{unreadCount > 9 ? '9+' : unreadCount}</Text>
                </View>
              )}
            </TouchableOpacity>


          </View>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 8,
    paddingTop:20,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 32,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { flex: 1 },
  welcome: {
    fontSize: 24,
    color: COLORS.gray200,
    fontFamily: FONTS.large,
    marginBottom: 4,
    fontWeight: "600",
  },
  name: {
    fontSize: 28,
    color: COLORS.white,
    fontFamily: FONTS.bold,
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
  },
  icon: {
    marginLeft: 15,
  },
    unreadBadge: {
    position: 'absolute',
    top: -2,
    right: 6,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F44336',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
    paddingHorizontal: 3,
  },
  unreadBadgeText: {
    color: COLORS.white,
    fontSize: 11,
    fontFamily: FONTS.bold,
    fontWeight: 'bold',
  },
});

export default HeaderSection;
