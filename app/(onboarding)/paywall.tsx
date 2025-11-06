/**
 * Onboarding - Paywall Screen
 * Subscription selection screen with pricing options
 */

import { REVENUECAT_CONFIG } from '@/config/revenuecat';
import { LegendColors } from '@/constants/theme';
import { useUser } from '@/context/UserContext';
import { useVideo } from '@/context/VideoContext';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { VideoView } from 'expo-video';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Dimensions,
    Image,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import Purchases from 'react-native-purchases';

const { width, height } = Dimensions.get('window');

type SubscriptionPlan = 'annual' | 'monthly';

export default function PaywallScreen() {
  const router = useRouter();
  const { player } = useVideo();
  const { updateUserPreferences } = useUser();
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan>('annual');
  const [isLoading, setIsLoading] = useState(false);
  const [isRevenueCatConfigured, setIsRevenueCatConfigured] = useState(false);

  // Check if RevenueCat is configured on mount
  useEffect(() => {
    const apiKey = Platform.OS === 'ios' 
      ? REVENUECAT_CONFIG.apiKey.ios 
      : REVENUECAT_CONFIG.apiKey.android;
      
    if (apiKey && !apiKey.includes('YOUR_')) {
      setIsRevenueCatConfigured(true);
      console.log('✅ RevenueCat is configured');
    } else {
      console.log('⚠️ RevenueCat not configured - using demo mode');
      console.log('📝 Update config/revenuecat.ts with your API keys when ready');
    }
  }, []);

  const handleContinue = async () => {
    // DEMO MODE: If RevenueCat not configured, show alert and navigate
    if (!isRevenueCatConfigured) {
      Alert.alert(
        'Demo Mode',
        'RevenueCat is not configured yet.\n\nIn production, this would:\n1. Open the native payment sheet\n2. Process the payment\n3. Activate the subscription\n\nFor now, you\'ll be granted access to test the app.',
        [
          {
            text: 'Continue',
            onPress: () => {
              updateUserPreferences({
                hasCompletedOnboarding: true,
                hasActiveSubscription: true,
                subscriptionType: selectedPlan,
              });
              router.replace('/(tabs)');
            }
          }
        ]
      );
      return;
    }
    
    // PRODUCTION MODE: Purchase with RevenueCat
    setIsLoading(true);
    
    try {
      // Get available offerings
      const offerings = await Purchases.getOfferings();
      if (!offerings.current || offerings.current.availablePackages.length === 0) {
        Alert.alert('Error', 'No subscription plans available. Please try again later.');
        setIsLoading(false);
        return;
      }

      // Find the selected package
      const packages = offerings.current.availablePackages;
      const selectedPackage = packages.find((pkg: any) => {
        const productId = pkg.product.identifier;
        if (selectedPlan === 'annual') {
          return productId === REVENUECAT_CONFIG.products.annualTrial;
        } else {
          return productId === REVENUECAT_CONFIG.products.monthly;
        }
      });

      if (!selectedPackage) {
        Alert.alert('Error', 'Selected plan not available. Please try again.');
        setIsLoading(false);
        return;
      }

      // Purchase the package - Opens native iOS/Android payment sheet
      const { customerInfo } = await Purchases.purchasePackage(selectedPackage);

      // Check if user now has access to premium entitlement
      if (customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlement] !== undefined) {
        // ✅ Purchase successful
        const entitlement = customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlement];
        
        updateUserPreferences({
          hasCompletedOnboarding: true,
          hasActiveSubscription: true,
          subscriptionType: selectedPlan,
          subscriptionExpirationDate: entitlement.expirationDate || null,
        });

        // Navigate to home feed
        router.replace('/(tabs)');
      } else {
        Alert.alert('Error', 'Purchase completed but subscription not activated. Please contact support.');
      }
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('Purchase error:', error);
        Alert.alert(
          'Purchase Failed', 
          error.message || 'Unable to complete purchase. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestore = async () => {
    if (!isRevenueCatConfigured) {
      Alert.alert('Demo Mode', 'Restore purchases requires RevenueCat configuration.');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const customerInfo = await Purchases.restorePurchases();
      
      if (customerInfo.entitlements.active[REVENUECAT_CONFIG.entitlement] !== undefined) {
        Alert.alert('Success', 'Your subscription has been restored!');
        updateUserPreferences({ 
          hasActiveSubscription: true,
          hasCompletedOnboarding: true,
        });
        router.replace('/(tabs)');
      } else {
        Alert.alert('No Subscription Found', 'No active subscriptions found for this account.');
      }
    } catch (error: any) {
      Alert.alert('Restore Failed', 'Unable to restore purchases. Please try again.');
      console.error('Restore error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTerms = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://legendmotivation.com/terms.html');
    } catch (error) {
      console.error('Error opening terms:', error);
      Alert.alert('Error', 'Unable to open Terms & Conditions. Please visit legendmotivation.com');
    }
  };

  const handlePrivacy = async () => {
    try {
      await WebBrowser.openBrowserAsync('https://legendmotivation.com/privacy.html');
    } catch (error) {
      console.error('Error opening privacy:', error);
      Alert.alert('Error', 'Unable to open Privacy Policy. Please visit legendmotivation.com');
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      
      {/* Video Background */}
      <View style={styles.videoContainer}>
        <VideoView
          player={player}
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
          allowsPictureInPicture={false}
        />
      </View>

      {/* Dark Overlay */}
      <View style={styles.darkOverlay} />
      
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Crown Icon */}
        <Image
          source={require('@/assets/icons/crown.png')}
          style={styles.crownIcon}
          resizeMode="contain"
        />

        {/* Title */}
        <Text style={styles.title}>UNLOCK LEGEND STATUS</Text>

        {/* Features List */}
        <View style={styles.featuresList}>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Motivational quotes scrolling feed.</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Daily motivational notifications.</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Customizable preferences.</Text>
          </View>
        </View>

        {/* Subscription Options */}
        <View style={styles.subscriptionOptions}>
          {/* Annual Trial Option */}
          <TouchableOpacity
            style={[
              styles.planButton,
              styles.annualPlanButton,
              selectedPlan === 'annual' && styles.planButtonSelected
            ]}
            onPress={() => setSelectedPlan('annual')}
            activeOpacity={0.8}
          >
            {/* Best Value Badge */}
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Best Value</Text>
            </View>

            <View style={styles.planContent}>
              <Text style={styles.planTitle}>
                <Text style={styles.planTitleYellow}>Free</Text>
                <Text style={styles.planTitleWhite}> Trial</Text>
              </Text>
              
              <View style={styles.planDetail}>
                <Text style={styles.detailBullet}>•</Text>
                <Text style={styles.detailText}>7-days free. Cancel anytime.</Text>
              </View>

              <Text style={styles.planSubtitle}>After trial ends</Text>

              <View style={styles.planDetail}>
                <Text style={styles.detailBullet}>•</Text>
                <Text style={styles.detailText}>
                  $2.49/mo{' '}
                  <Text style={styles.billingText}>Billed annually ($29.99/yr)</Text>
                </Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Monthly Plan Option */}
          <TouchableOpacity
            style={[
              styles.planButton,
              styles.monthlyPlanButton,
              selectedPlan === 'monthly' && styles.planButtonSelected
            ]}
            onPress={() => setSelectedPlan('monthly')}
            activeOpacity={0.8}
          >
            <View style={styles.planContent}>
              <Text style={styles.planTitle}>
                <Text style={styles.planTitleWhite}>Monthly Plan</Text>
              </Text>
              
              <View style={styles.planDetail}>
                <Text style={styles.detailBullet}>•</Text>
                <Text style={styles.detailText}>$4.99/mo. Cancel anytime.</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.continueButton}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color={LegendColors.black} size="small" />
          ) : (
            <Text style={styles.continueButtonText}>Continue</Text>
          )}
        </TouchableOpacity>

        {/* Restore Purchases Button */}
        <TouchableOpacity 
          onPress={handleRestore} 
          activeOpacity={0.7}
          disabled={isLoading}
          style={styles.restoreButton}
        >
          <Text style={styles.restoreText}>Restore Purchases</Text>
        </TouchableOpacity>

        {/* Terms & Privacy Links */}
        <View style={styles.legalLinks}>
          <TouchableOpacity onPress={handleTerms} activeOpacity={0.7} style={styles.legalButton}>
            <Text style={styles.legalText}>Terms & Conditions</Text>
          </TouchableOpacity>
          <Text style={styles.legalSeparator}>•</Text>
          <TouchableOpacity onPress={handlePrivacy} activeOpacity={0.7} style={styles.legalButton}>
            <Text style={styles.legalText}>Privacy Policy</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: LegendColors.black,
  },
  videoContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  video: {
    width: width,
    height: height,
  },
  darkOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
    backgroundColor: LegendColors.darkOverlay,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 30,
    alignItems: 'center',
  },
  crownIcon: {
    width: 70,
    height: 70,
    marginBottom: 8,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: LegendColors.white,
    textAlign: 'center',
    letterSpacing: 1,
    marginBottom: 16,
  },
  featuresList: {
    width: '100%',
    maxWidth: 500,
    marginBottom: 18,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  featureBullet: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginRight: 8,
    lineHeight: 24,
  },
  featureText: {
    flex: 1,
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    lineHeight: 24,
  },
  subscriptionOptions: {
    width: '100%',
    maxWidth: 500,
    gap: 12,
    marginBottom: 16,
  },
  planButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    position: 'relative',
    overflow: 'visible',
  },
  planButtonSelected: {
    backgroundColor: 'rgba(255, 193, 7, 0.15)',
    borderColor: LegendColors.yellow,
    borderWidth: 3,
  },
  annualPlanButton: {
    minHeight: 180,
  },
  monthlyPlanButton: {
    minHeight: 100,
  },
  planContent: {
    padding: 20,
  },
  badge: {
    position: 'absolute',
    top: -12,
    right: 16,
    backgroundColor: LegendColors.black,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: LegendColors.white,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: LegendColors.white,
    letterSpacing: 0.5,
  },
  planTitle: {
    fontSize: 24,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: 1,
  },
  planTitleYellow: {
    color: LegendColors.yellow,
  },
  planTitleWhite: {
    color: LegendColors.white,
  },
  planDetail: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  detailBullet: {
    fontSize: 16,
    color: LegendColors.white,
    marginRight: 8,
    lineHeight: 22,
  },
  detailText: {
    flex: 1,
    fontSize: 16,
    color: LegendColors.white,
    lineHeight: 22,
  },
  planSubtitle: {
    fontSize: 14,
    fontWeight: '600',
    color: LegendColors.white,
    marginTop: 8,
    marginBottom: 8,
  },
  billingText: {
    fontSize: 14,
    fontWeight: '400',
    color: 'rgba(255, 255, 255, 0.5)',
  },
  continueButton: {
    backgroundColor: LegendColors.yellow,
    paddingVertical: 16,
    paddingHorizontal: 60,
    borderRadius: 30,
    width: '100%',
    maxWidth: 500,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: LegendColors.yellow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    marginBottom: 12,
  },
  continueButtonText: {
    fontSize: 18,
    fontWeight: '900',
    color: LegendColors.black,
    letterSpacing: 2,
  },
  restoreButton: {
    marginBottom: 8,
    paddingVertical: 6,
  },
  restoreText: {
    fontSize: 15,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
  legalLinks: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 500,
    marginTop: 8,
    paddingBottom: 20,
  },
  legalButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  legalText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    textDecorationLine: 'underline',
    fontWeight: '500',
  },
  legalSeparator: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.5)',
    marginHorizontal: 8,
  },
});

