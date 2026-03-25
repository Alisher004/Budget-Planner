# 🔥 Firebase Setup Instructions

## You're seeing the "invalid-api-key" error because Firebase isn't configured yet.

Follow these steps to fix it:

---

## Step 1: Create Firebase Project

1. Go to **[Firebase Console](https://console.firebase.google.com/)**
2. Click **"Add project"** or **"Create a project"**
3. Enter a project name (e.g., "budget-planner")
4. Click **Continue**
5. Disable Google Analytics (optional, you can enable it later)
6. Click **Create project**
7. Wait for the project to be created, then click **Continue**

---

## Step 2: Enable Email/Password Authentication

1. In the left sidebar, click **Authentication**
2. Click **Get started**
3. Click on the **Sign-in method** tab
4. Find **Email/Password** in the list
5. Click on it
6. Toggle **Enable** to ON
7. Click **Save**

---

## Step 3: Get Your Firebase Configuration

1. Click the **gear icon** (⚙️) next to "Project Overview" in the left sidebar
2. Click **Project settings**
3. Scroll down to **"Your apps"** section
4. Click the **Web icon** (`</>`) to add a web app
5. Enter app nickname: **"Budget Planner Web"**
6. **Don't** check "Also set up Firebase Hosting"
7. Click **Register app**
8. You'll see a `firebaseConfig` object that looks like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

---

## Step 4: Update .env.local File

1. Open the `.env.local` file in your project root
2. Replace the placeholder values with your actual Firebase config:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

3. **Save the file**

---

## Step 5: Restart Your Dev Server

1. Stop your dev server (Ctrl+C or Cmd+C)
2. Run it again:

```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000)

---

## ✅ Test It

1. Go to `/register`
2. Create an account with any email and password
3. You should be redirected to `/dashboard`
4. Your budget planner should work!

---

## 🚨 Common Issues

### Still seeing "invalid-api-key"?

- Make sure you saved `.env.local`
- Make sure there are no extra spaces in the values
- Restart your dev server
- Clear browser cache

### Can't find the config?

- In Firebase Console, go to Project Settings
- Scroll to "Your apps"
- If you don't see a web app, click the `</>` icon to add one

### Authentication not working?

- Make sure Email/Password is enabled in Firebase Console
- Check Authentication -> Sign-in method -> Email/Password is ON

---

## 📝 Quick Reference

**Firebase Console:** https://console.firebase.google.com/

**Your .env.local location:** `/Users/macintosh/Desktop/finance/.env.local`

**After setup, you can delete this file!**
