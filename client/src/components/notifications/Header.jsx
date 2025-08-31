import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { COLORS } from '../../styles/colors';
import { FONTS } from '../../styles/fonts';

const Header = ({ unreadCount, onClear, hasNotifications, onBack }) => (
  <LinearGradient
    colors={[COLORS.primary, COLORS.primaryDark]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.header}
  >
    <View style={styles.headerContent}>
      <View style={styles.headerTop}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Icon name="arrow-back" size={24} color={COLORS.white} />
        </TouchableOpacity>
        <View style={styles.headerTitleWrapper}>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            {unreadCount > 0 && (
              <View style={styles.headerBadge}>
                <Text style={styles.headerBadgeText}>
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
        {hasNotifications && (
          <TouchableOpacity style={styles.clearButton} onPress={onClear}>
            <Icon name="clear-all" size={20} color={COLORS.white} />
            <Text style={styles.clearText}>Clear</Text>
          </TouchableOpacity>
        )}
      </View>

    </View>
  </LinearGradient>
);

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'ios' ? 50 : 40,
    paddingBottom: 20,
  },
  headerContent: {
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 5,
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 22,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  headerBadge: {
    marginLeft: 8,
    minWidth: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ff4757',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  headerBadgeText: {
    fontSize: 12,
    color: COLORS.white,
    fontFamily: FONTS.bold,
  },
  clearButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 4,
  },
  clearText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: 14,
  },
    headerTitleWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
});

export default Header;
