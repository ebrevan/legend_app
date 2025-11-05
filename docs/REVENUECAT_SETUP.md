# RevenueCat Integration Setup Guide

This guide will walk you through setting up RevenueCat for in-app purchases in the Legend app.

## Prerequisites

- **Apple Developer Account** ($99/year) - [Sign up here](https://developer.apple.com)
- **RevenueCat Account** (free tier available) - [Sign up here](https://revenuecat.com)
- **App Store Connect Access**

---

## Step 1: App Store Connect Setup

### 1.1 Create Your App
1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Click **My Apps** → **+** (Add New App)
3. Fill in app details:
   - Platform: iOS
   - Name: Legend
   - Bundle ID: (your bundle ID from app.json)

### 1.2 Create Subscription Products

**Create Annual Subscription with Free Trial:**
1. Go to your app → **Features** → **In-App Purchases**
2. Click **+** → **Auto-Renewable Subscription**
3. Configure:
   - **Reference Name**: Annual Subscription
   - **Product ID**: `legend_annual_trial`
   - **Subscription Group**: Create new group "Legend Subscriptions"
   - **Subscription Duration**: 1 Year
   - **Price**: $29.99 USD
   - **Free Trial**: 7 Days
   - **Localization**: Add app name, description

**Create Monthly Subscription:**
1. Click **+** → **Auto-Renewable Subscription**
2. Configure:
   - **Reference Name**: Monthly Subscription
   - **Product ID**: `legend_monthly`
   - **Subscription Group**: Legend Subscriptions (same as above)
   - **Subscription Duration**: 1 Month
   - **Price**: $4.99 USD
   - **Free Trial**: None
   - **Localization**: Add app name, description

3. Submit products for review (required before testing)

---

## Step 2: RevenueCat Dashboard Setup

### 2.1 Create Project
1. Sign up/login at [RevenueCat](https://app.revenuecat.com)
2. Click **Create new project**
3. Name: "Legend"

### 2.2 Add iOS App
1. Click **Add app**
2. Select **Apple App Store**
3. Enter your app name and bundle ID
4. Click **Save**

### 2.3 Connect to App Store
1. Go to **Settings** → **App Store Connect**
2. Follow instructions to create App Store Connect API Key:
   - Go to App Store Connect → Users and Access → Keys
   - Create new key with **Admin** role
   - Download the .p8 file (keep it safe!)
   - Copy Key ID and Issuer ID
3. Upload .p8 file to RevenueCat
4. Enter Key ID and Issuer ID
5. Click **Save**

### 2.4 Create Entitlement
1. Go to **Entitlements** tab
2. Click **+ New**
3. Create entitlement:
   - **Identifier**: `premium`
   - **Description**: Premium access to Legend features

### 2.5 Attach Products to Entitlement
1. Click on the `premium` entitlement
2. Click **Attach products**
3. Select both:
   - `legend_annual_trial`
   - `legend_monthly`
4. Click **Save**

### 2.6 Get API Keys
1. Go to **Settings** → **API Keys**
2. Copy your **Public iOS SDK Key** (starts with `appl_`)
3. Save this for the next step

---

## Step 3: Update App Code

### 3.1 Install Dependencies
```bash
npm install react-native-purchases
npx pod-install
```

### 3.2 Configure API Key
Open `config/revenuecat.ts` and update:

```typescript
export const REVENUECAT_CONFIG = {
  apiKey: {
    ios: 'appl_YOUR_ACTUAL_KEY_HERE', // Paste your key here
    android: 'YOUR_ANDROID_API_KEY_HERE',
  },
  // ... rest stays the same
};
```

### 3.3 Enable Purchase Code
Open `app/(onboarding)/paywall.tsx` and:

1. Find the commented purchase code (around line 78)
2. **Uncomment** the entire `/* ... */` block in `handleContinue`
3. **Remove** or comment out the temporary fallback alert (lines 143-160)
4. Find the commented restore code (around line 170)
5. **Uncomment** the entire `/* ... */` block in `handleRestore`
6. **Remove** or comment out the demo mode alert (line 195)

---

## Step 4: Testing

### 4.1 Create Sandbox Test Account
1. Go to App Store Connect → Users and Access → Sandbox Testers
2. Click **+** to add new tester
3. Enter email and password
4. Complete the form

### 4.2 Configure Test Device
1. On your iOS device: Settings → App Store
2. Scroll down to **Sandbox Account**
3. Sign in with your sandbox test account

### 4.3 Test Purchase Flow
1. Run your app on the test device
2. Complete onboarding
3. Tap Continue on paywall
4. Native payment sheet should appear
5. Purchase will auto-approve (no charge in sandbox)
6. Verify you reach the home screen

### 4.4 Test Subscription Features
- **Trial Period**: In sandbox, 7-day trial = 3 minutes
- **Renewals**: Auto-renew every few minutes in sandbox
- **Cancellation**: Cancel in Settings → App Store → Subscriptions
- **Restore**: Test "Restore Purchases" button

### 4.5 Monitor in RevenueCat
1. Go to RevenueCat Dashboard → **Overview**
2. Watch for real-time events:
   - Initial purchase
   - Trial start
   - Renewals
3. Check **Customers** tab to see test user

---

## Step 5: Production Checklist

Before launching to production:

- [ ] Products approved in App Store Connect
- [ ] RevenueCat API key configured in code
- [ ] Purchase code uncommented and tested
- [ ] Restore purchases tested
- [ ] Tested in sandbox with multiple scenarios
- [ ] Added proper error handling
- [ ] Privacy policy and terms linked
- [ ] Subscription management info added
- [ ] Tested on multiple devices/iOS versions

---

## Common Issues & Solutions

### Issue: "No products available"
- **Solution**: Products must be approved in App Store Connect
- Check RevenueCat dashboard shows products synced
- Wait 1-2 hours after creating products

### Issue: "Unable to connect to iTunes Store"
- **Solution**: Make sure you're signed in with sandbox account
- Check internet connection
- Try signing out and back into sandbox account

### Issue: "Invalid product IDs"
- **Solution**: Product IDs in code must exactly match App Store Connect
- Check for typos in `config/revenuecat.ts`
- Verify products are attached to entitlement in RevenueCat

### Issue: Purchase succeeds but app doesn't unlock
- **Solution**: Check entitlement identifier matches
- Verify products are attached to `premium` entitlement
- Check RevenueCat debugger for events

---

## Resources

- [RevenueCat Documentation](https://docs.revenuecat.com)
- [React Native SDK Guide](https://docs.revenuecat.com/docs/reactnative)
- [Testing Guide](https://docs.revenuecat.com/docs/sandbox)
- [App Store Connect Help](https://developer.apple.com/app-store-connect/)

---

## Support

If you run into issues:
1. Check RevenueCat debugger in dashboard
2. Check Xcode console logs
3. Visit RevenueCat Community: https://community.revenuecat.com
4. Email RevenueCat support (very responsive!)

---

**Last Updated**: October 2024



