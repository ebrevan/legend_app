# 🌐 Legend Documentation Website - Deployment Guide

Your professional documentation website is ready! Follow these steps to deploy it to GitHub Pages with your custom domain.

---

## 📁 What Was Created

Your `docs/` folder now contains:

```
docs/
├── index.html         # Homepage with navigation
├── privacy.html       # Full privacy policy
├── terms.html         # Terms of service
├── support.html       # Support center & FAQ
└── CNAME              # Custom domain configuration
```

**Live URL (after deployment):** `https://legendmotivation.com`

---

## 🚀 Step 1: Push to GitHub

First, let's get your documentation on GitHub:

```bash
# Navigate to your project
cd /Users/edgardoreyes/Developer/legend_app

# Add the docs folder to git
git add docs/

# Commit the changes
git commit -m "Add Legend documentation website with privacy policy, terms, and support"

# Push to GitHub
git push origin main
```

**Note:** If your default branch is `master` instead of `main`, use:
```bash
git push origin master
```

---

## ⚙️ Step 2: Enable GitHub Pages

1. Go to your GitHub repository: `https://github.com/ebrevan/legend_app`
2. Click **Settings** (top right)
3. Scroll down and click **Pages** (left sidebar)
4. Under "Build and deployment":
   - **Source:** Select "Deploy from a branch"
   - **Branch:** Select `main` (or `master`) and `/docs` folder
   - Click **Save**

GitHub will start building your site. This takes 1-2 minutes.

---

## 🌍 Step 3: Configure Custom Domain

### A. In GitHub (Repository Settings)

1. Still in **Settings → Pages**
2. Under "Custom domain", enter: `legendmotivation.com`
3. Click **Save**
4. Check the box: **"Enforce HTTPS"** (wait a few minutes if not available yet)

### B. In Your Domain Provider (Where you bought legendmotivation.com)

You need to add DNS records. The exact steps depend on your provider (GoDaddy, Namecheap, Google Domains, etc.), but here's what to add:

#### **Option A: Use A Records (Recommended)**

Add these 4 A records:

| Type | Name | Value              | TTL  |
|------|------|--------------------|------|
| A    | @    | 185.199.108.153    | 3600 |
| A    | @    | 185.199.109.153    | 3600 |
| A    | @    | 185.199.110.153    | 3600 |
| A    | @    | 185.199.111.153    | 3600 |

#### **Option B: Use CNAME Record**

Add this CNAME record:

| Type  | Name | Value                      | TTL  |
|-------|------|----------------------------|------|
| CNAME | www  | ebrevan.github.io          | 3600 |

**Then** add A records for the root domain (same as Option A above).

#### **For WWW Subdomain (Optional)**

If you want `www.legendmotivation.com` to work:

| Type  | Name | Value                 | TTL  |
|-------|------|-----------------------|------|
| CNAME | www  | legendmotivation.com  | 3600 |

### C. Wait for DNS Propagation

DNS changes can take **up to 24-48 hours** to propagate globally, but usually happen within 15 minutes to a few hours.

Check propagation status: https://www.whatsmydns.net/#A/legendmotivation.com

---

## ✅ Step 4: Verify It's Working

After DNS propagates, visit:

- `https://legendmotivation.com` - Should load your homepage
- `https://legendmotivation.com/privacy.html` - Privacy policy
- `https://legendmotivation.com/terms.html` - Terms of service
- `https://legendmotivation.com/support.html` - Support center

**If you see a 404 error:**
- Wait a bit longer for DNS propagation
- Clear your browser cache (Cmd+Shift+R on Mac)
- Try in incognito/private browsing mode

---

## 📱 Step 5: Add to App Store Connect

Once your site is live:

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Select your Legend app
3. Go to **App Information**
4. Find **Privacy Policy URL**
5. Enter: `https://legendmotivation.com/privacy.html`
6. Find **Terms of Service URL** (if available)
7. Enter: `https://legendmotivation.com/terms.html`
8. Click **Save**

---

## 🔧 Common Issues & Solutions

### Issue: "Domain is already taken" in GitHub
**Solution:** Make sure you removed the domain from any other GitHub repos first.

### Issue: "DNS_PROBE_FINISHED_NXDOMAIN"
**Solution:** DNS hasn't propagated yet. Wait 15-60 minutes and try again.

### Issue: HTTPS not available
**Solution:** 
1. Wait 15-20 minutes after adding custom domain
2. Uncheck "Enforce HTTPS" in GitHub Pages
3. Wait a few minutes
4. Re-check "Enforce HTTPS"

### Issue: 404 Page Not Found
**Solution:** 
1. Verify you selected `/docs` folder (not `/root`)
2. Make sure CNAME file is in the `docs/` folder
3. Check that files were pushed to GitHub (`git push`)

### Issue: CSS/Styling not loading
**Solution:** Hard refresh the page (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows)

---

## 🎨 Updating Your Website

To make changes to your documentation:

1. **Edit the HTML files** in the `docs/` folder
2. **Test locally** by opening the files in your browser
3. **Commit and push changes:**
   ```bash
   git add docs/
   git commit -m "Update documentation"
   git push origin main
   ```
4. **Wait 1-2 minutes** for GitHub to rebuild and deploy

---

## 📊 Analytics (Optional)

Want to track visitors to your documentation?

### Add Google Analytics:

1. Create account at [analytics.google.com](https://analytics.google.com)
2. Get your tracking ID (e.g., `G-XXXXXXXXXX`)
3. Add this code before `</head>` in all HTML files:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

---

## 🔒 Security & Best Practices

### Enable HTTPS (Already Done)
✅ Your site uses HTTPS by default via GitHub Pages

### Content Security
✅ No external scripts or tracking (unless you add analytics)
✅ All content is static HTML (very secure)

### Regular Updates
- Review privacy policy annually or when you make major app changes
- Update "Last Updated" dates when you modify policies
- Keep support FAQ updated with common user questions

---

## 📝 Testing Checklist

Before submitting to App Store, verify:

- [ ] `legendmotivation.com` loads correctly
- [ ] All 4 pages accessible (index, privacy, terms, support)
- [ ] HTTPS working (green padlock in browser)
- [ ] Mobile responsive (test on iPhone)
- [ ] All links work correctly
- [ ] Email links open mail app (`mailto:support@legendmotivation.com`)
- [ ] No broken images or styling issues
- [ ] Navigation works between pages
- [ ] Privacy policy URL works in browser
- [ ] Terms of service URL works in browser

---

## 🎯 Next Steps

1. **Deploy now:**
   ```bash
   git add docs/ WEBSITE_DEPLOYMENT.md
   git commit -m "Add documentation website"
   git push origin main
   ```

2. **Enable GitHub Pages** (Step 2 above)

3. **Configure DNS** with your domain provider (Step 3 above)

4. **Wait for DNS propagation** (15 min to 24 hours)

5. **Add URLs to App Store Connect** (Step 5 above)

6. **Submit your app for review!** 🚀

---

## 📞 Need Help?

If you run into issues:

1. Check GitHub Pages deployment status in repo Settings → Pages
2. Verify DNS records with: https://www.whatsmydns.net
3. Test GitHub Pages URL first: `https://ebrevan.github.io/legend_app/`
4. Contact GitHub Support if custom domain issues persist

---

## 🎉 Your URLs

Once deployed, these will be your live URLs:

| Page            | URL                                           |
|-----------------|-----------------------------------------------|
| **Homepage**    | https://legendmotivation.com                  |
| **Privacy**     | https://legendmotivation.com/privacy.html     |
| **Terms**       | https://legendmotivation.com/terms.html       |
| **Support**     | https://legendmotivation.com/support.html     |

**For App Store Connect:**
- Privacy Policy URL: `https://legendmotivation.com/privacy.html`
- Terms of Service URL: `https://legendmotivation.com/terms.html`

---

**Ready to deploy? Run the commands in Step 1 and you're on your way!** 🚀

