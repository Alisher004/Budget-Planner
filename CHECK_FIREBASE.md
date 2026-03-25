# ⚠️ CONFIGURATION_NOT_FOUND Error - Fix Guide

This error means **Email/Password authentication is NOT enabled** in your Firebase project.

---

## 🔴 Current Status: Authentication NOT Configured

Your Firebase project exists, but authentication isn't set up yet.

---

## ✅ Step-by-Step Fix (5 minutes)

### Step 1: Open Firebase Console
1. Go to: **https://console.firebase.google.com/**
2. You should see your project: **"budget-planner-8fb85"**
3. **Click on it** to open the project

---

### Step 2: Navigate to Authentication
1. Look at the **left sidebar menu**
2. Find and click: **"Authentication"** (🔑 icon)
3. You'll see one of two things:
   - **Option A:** A blue button saying **"Get started"** → Click it
   - **Option B:** You're already in Authentication → Continue to Step 3

---

### Step 3: Go to Sign-in Method
1. At the top, you'll see tabs: **Users | Sign-in method | Settings | Usage**
2. Click on: **"Sign-in method"**

---

### Step 4: Enable Email/Password
1. You'll see a list of "Sign-in providers"
2. Find **"Email/Password"** (usually the first one)
3. **Click on the entire row** (not just the text)
4. A popup/panel will appear
5. Find the toggle switch next to **"Enable"**
6. **Turn it ON** (it should turn blue/green)
7. Click **"Save"** button at the bottom

---

### Step 5: Verify It's Enabled
After saving, you should see:
```
Sign-in providers
  Email/Password     ✓ Enabled  ← Should say "Enabled"
  Google             Disabled
  Phone              Disabled
  ...
```

---

### Step 6: Restart Your App
1. Go back to your terminal
2. Stop the dev server: **Ctrl+C** (or **Cmd+C** on Mac)
3. Start it again:
   ```bash
   npm run dev
   ```
4. Open: **http://localhost:3000/register**
5. Try creating an account

---

## 🎯 Quick Checklist

Before trying again, make sure:

- [ ] You opened Firebase Console
- [ ] You selected "budget-planner-8fb85" project
- [ ] You clicked "Authentication" in sidebar
- [ ] You clicked "Sign-in method" tab
- [ ] You clicked on "Email/Password" row
- [ ] You toggled "Enable" to ON
- [ ] You clicked "Save"
- [ ] You see "Email/Password" shows "Enabled" status
- [ ] You restarted your dev server

---

## 🔍 Still Not Working?

### Check if you're in the right project:
1. In Firebase Console, look at the top left
2. You should see: **"budget-planner-8fb85"**
3. If you see a different project name, click it and select the correct one

### Make sure you saved:
1. After toggling "Enable" ON
2. You MUST click the "Save" button
3. Don't just close the popup

### Clear browser cache:
1. Open DevTools (F12)
2. Right-click the refresh button
3. Select "Empty Cache and Hard Reload"

---

## 📸 What You Should See

**Before enabling:**
```
Email/Password     Disabled
```

**After enabling:**
```
Email/Password     ✓ Enabled
```

---

## 🆘 Alternative: Use Firebase CLI

If the console isn't working, you can enable it via CLI:

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Enable Email/Password auth
firebase auth:enable email
```

---

## Direct Link

Try this direct link to your project's authentication settings:

**https://console.firebase.google.com/project/budget-planner-8fb85/authentication/providers**

This should take you directly to the Sign-in method page.

---

Once you complete these steps, the error will disappear and registration will work! 🎉
