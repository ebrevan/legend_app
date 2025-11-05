# Quick Guide: Enable RevenueCat Purchases

Once you have your Apple Developer account and RevenueCat configured, follow these steps to enable real purchases:

## Step 1: Install Package

```bash
npm install react-native-purchases
npx pod-install
```

## Step 2: Add Your API Key

Edit `config/revenuecat.ts`:

```typescript
export const REVENUECAT_CONFIG = {
  apiKey: {
    ios: 'appl_YOUR_KEY_HERE', // Replace with your actual key
    android: 'YOUR_ANDROID_API_KEY_HERE',
  },
  // ...
};
```

## Step 3: Uncomment Purchase Code

In `app/(onboarding)/paywall.tsx`:

### Find this section (around line 78):
```typescript
// TODO: Uncomment this code after installing react-native-purchases
/*
setIsLoading(true);
// ... lots of code ...
*/
```

**Action**: Remove the `/*` and `*/` to uncomment

### Find this section (around line 143):
```typescript
// Temporary fallback while RevenueCat is being set up
Alert.alert(
  'Ready for Production',
  // ...
);
```

**Action**: Delete or comment out this entire Alert.alert block

### Find the restore section (around line 170):
```typescript
// TODO: Uncomment after installing react-native-purchases
/*
setIsLoading(true);
// ... restore code ...
*/
```

**Action**: Remove the `/*` and `*/` to uncomment

### Find this section (around line 195):
```typescript
Alert.alert('Demo Mode', 'Restore purchases will be available after RevenueCat integration.');
```

**Action**: Delete or comment out this line

## Step 4: Test

1. Build the app: `npx expo run:ios`
2. Sign in with sandbox test account
3. Try purchasing
4. Native payment sheet should appear!

---

## Current Status

Right now the app is in **DEMO MODE**:
- ✅ Full UI is ready
- ✅ All code is written (just commented out)
- ✅ User flow works end-to-end
- ⏸️  Real payments are disabled until you uncomment the code

When you tap "Continue" on paywall, you'll see an alert explaining this is demo mode, then you'll be granted access to test the rest of the app.

---

**Need help?** Check `docs/REVENUECAT_SETUP.md` for full setup instructions.



