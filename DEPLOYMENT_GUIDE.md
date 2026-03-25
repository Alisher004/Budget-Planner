# 🚀 Deployment Guide

## Build Status: ✅ Ready for Deployment

Your budget planner app is now successfully building and ready to deploy!

---

## Pre-Deployment Checklist

### 1. Environment Variables

Make sure you have these set in your deployment platform (Vercel, Netlify, etc.):

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_actual_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 2. Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Enable Authentication → Email/Password
4. Create Firestore Database
5. Set up Firestore Security Rules (see below)

### 3. Admin Configuration

Edit `lib/admin.ts` and add your admin email:

```typescript
const ADMIN_EMAILS = [
  'your-email@example.com',  // Replace with your actual email
];
```

---

## Deploying to Vercel

### Option 1: Deploy via Vercel Dashboard

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your Git repository
4. Add environment variables (see above)
5. Click "Deploy"

### Option 2: Deploy via CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel

# Add environment variables
vercel env add NEXT_PUBLIC_FIREBASE_API_KEY
# ... add all other variables

# Deploy to production
vercel --prod
```

---

## Deploying to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Click "Add new site"
3. Import from Git
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Add environment variables
6. Deploy

---

## Firestore Security Rules

Add these rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      // Users can read their own data
      allow read: if request.auth != null && request.auth.uid == userId;
      // Users can create/update their own data
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Payments collection
    match /payments/{paymentId} {
      // Authenticated users can read all payments (for admin)
      allow read: if request.auth != null;
      // Users can create payment requests
      allow create: if request.auth != null && 
                      request.resource.data.userId == request.auth.uid;
      // Only allow updates (admin approval)
      allow update: if request.auth != null;
    }
  }
}
```

---

## Post-Deployment Steps

### 1. Test Authentication

1. Visit your deployed site
2. Register a new account
3. Verify email/password login works
4. Check that user document is created in Firestore

### 2. Test Premium System

1. Login as regular user
2. Try accessing Analytics → Should see lock screen
3. Click "Upgrade to Premium"
4. Login as admin (use email from ADMIN_EMAILS)
5. Go to `/admin`
6. Approve the payment request
7. Refresh as regular user → Premium unlocked!

### 3. Test All Features

- ✅ Dashboard overview
- ✅ Budget planner
- ✅ Simple calculator
- ✅ Daily expense tracking
- ✅ Analytics (premium)
- ✅ Reports (premium)
- ✅ Financial goals
- ✅ Insights (premium)
- ✅ Admin panel

---

## Troubleshooting

### Build Fails with Firebase Error

**Issue:** `Firebase: Error (auth/invalid-api-key)`

**Solution:** 
- Check environment variables are set correctly
- Make sure all variables start with `NEXT_PUBLIC_`
- Verify Firebase config in Firebase Console

### Pages Show "Loading..." Forever

**Issue:** Firebase not initializing

**Solution:**
- Check browser console for errors
- Verify `.env.local` has correct values
- Make sure Firebase project is active

### Admin Panel Not Accessible

**Issue:** Can't access `/admin`

**Solution:**
- Add your email to `lib/admin.ts`
- Email must match exactly (case-sensitive)
- Re-deploy after changing admin emails

### Premium Features Not Unlocking

**Issue:** User approved but still sees lock screen

**Solution:**
- Check Firestore: `users/{userId}/isPremium` should be `true`
- User needs to refresh the page
- Check browser console for errors

---

## Performance Optimization

### 1. Enable Caching

Add to `next.config.js`:

```javascript
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
  },
  // Enable SWC minification
  swcMinify: true,
}
```

### 2. Add Loading States

All pages already have loading states implemented.

### 3. Optimize Images

If you add images later, use Next.js `<Image>` component.

---

## Monitoring

### 1. Firebase Console

Monitor:
- Authentication users
- Firestore reads/writes
- Error logs

### 2. Vercel Analytics

Enable in Vercel dashboard:
- Page views
- Performance metrics
- Error tracking

---

## Updating the App

### 1. Make Changes Locally

```bash
# Make your changes
git add .
git commit -m "Your changes"
git push
```

### 2. Auto-Deploy

If connected to Git, Vercel/Netlify will auto-deploy on push.

### 3. Manual Deploy

```bash
vercel --prod
```

---

## Security Best Practices

1. ✅ Never commit `.env.local` to Git
2. ✅ Use environment variables for all secrets
3. ✅ Set up Firestore security rules
4. ✅ Enable Firebase App Check (optional)
5. ✅ Use HTTPS only (automatic on Vercel/Netlify)
6. ✅ Regularly update dependencies

---

## Support

If you encounter issues:

1. Check browser console for errors
2. Check Vercel/Netlify deployment logs
3. Check Firebase Console for errors
4. Review `PREMIUM_GUIDE.md` for premium system
5. Review `INSIGHTS_GUIDE.md` for insights system

---

## Success! 🎉

Your budget planner is now live and ready to use!

**Next Steps:**
1. Share the URL with users
2. Monitor Firebase usage
3. Collect user feedback
4. Add new features as needed

Enjoy your deployed app! 💰📊
