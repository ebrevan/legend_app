/**
 * Settings Screen
 * Privacy Policy and Terms & Conditions
 */

import PrivacySvg from '@/assets/icons/privacy.svg';
import TermsSvg from '@/assets/icons/terms.svg';
import { LegendColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
    Alert,
    Dimensions,
    Image,
    ImageBackground,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { resetUserPreferences } = useUser();

  const handleBack = () => {
    router.back();
  };

  const handlePrivacyPolicy = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://legendmotivation.com/privacy.html');
    } catch (error) {
      console.error('Error opening privacy policy:', error);
      Alert.alert('Error', 'Unable to open Privacy Policy. Please visit legendmotivation.com');
    }
  };

  const handleTermsAndConditions = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://legendmotivation.com/terms.html');
    } catch (error) {
      console.error('Error opening terms:', error);
      Alert.alert('Error', 'Unable to open Terms & Conditions. Please visit legendmotivation.com');
    }
  };

  const handleResetAccount = () => {
    Alert.alert(
      'Reset Account',
      'This will delete all your data including preferences, favorites, and settings. Your subscription will remain active. Are you sure?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            try {
              await resetUserPreferences();
              Alert.alert(
                'Account Reset',
                'Your data has been deleted. The app will restart.',
                [
                  {
                    text: 'OK',
                    onPress: () => {
                      // Navigate to welcome screen
                      router.replace('/');
                    },
                  },
                ]
              );
            } catch (error) {
              console.error('Error resetting account:', error);
              Alert.alert('Error', 'Unable to reset account. Please try again.');
            }
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Background Image */}
      <ImageBackground
        source={require('@/assets/images/app_background.jpg')}
        style={styles.background}
        resizeMode="cover"
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleBack}
              activeOpacity={0.7}
            >
              <Image
                source={require('@/assets/icons/back.png')}
                style={styles.backIcon}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>

          {/* Title */}
          <Text style={styles.title}>Settings</Text>

          {/* Settings Options Container */}
          <View style={styles.optionsContainer}>
            {/* Privacy Policy Button */}
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handlePrivacyPolicy}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  <PrivacySvg width={28} height={28} stroke={LegendColors.white} fill="none" />
                </View>
                <Text style={styles.optionText}>Privacy Policy</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>

            {/* Terms and Conditions Button */}
            <TouchableOpacity
              style={styles.optionButton}
              onPress={handleTermsAndConditions}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  <TermsSvg width={28} height={28} stroke={LegendColors.white} fill="none" />
                </View>
                <Text style={styles.optionText}>Terms and Conditions</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="rgba(255, 255, 255, 0.5)" />
            </TouchableOpacity>
          </View>

          {/* Danger Zone */}
          <View style={styles.dangerZone}>
            <Text style={styles.dangerZoneTitle}>Danger Zone</Text>
            
            <TouchableOpacity
              style={styles.dangerButton}
              onPress={handleResetAccount}
              activeOpacity={0.7}
            >
              <View style={styles.optionLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons name="trash-outline" size={28} color="#FF3B30" />
                </View>
                <View>
                  <Text style={styles.dangerButtonText}>Reset Account</Text>
                  <Text style={styles.dangerButtonSubtext}>Delete all data and start fresh</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LegendColors.black,
  },
  background: {
    position: 'absolute',
    width: width,
    height: height,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 70,
    paddingBottom: 40,
    paddingHorizontal: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 50,
  },
  backButton: {
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
  },
  backIcon: {
    width: 26,
    height: 26,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: LegendColors.white,
    marginBottom: 40,
    letterSpacing: 0.5,
  },
  optionsContainer: {
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 22,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    marginRight: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 19,
    fontWeight: '500',
    color: LegendColors.white,
    letterSpacing: 0.3,
  },
  dangerZone: {
    marginTop: 40,
  },
  dangerZoneTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: 'rgba(255, 255, 255, 0.5)',
    marginBottom: 15,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  dangerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 22,
    paddingHorizontal: 24,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 59, 48, 0.3)',
  },
  dangerButtonText: {
    fontSize: 19,
    fontWeight: '600',
    color: '#FF3B30',
    letterSpacing: 0.3,
  },
  dangerButtonSubtext: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 59, 48, 0.7)',
    marginTop: 4,
  },
});


