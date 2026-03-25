# Firebase Authentication Setup Guide

## Quick Setup Steps

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "budget-planner")
4. Follow the setup wizard

### 2. Enable Email/Password Authentication

1. In Firebase Console, go to **Authentication**
2. Click **Get Started**
3. Go to **Sign-in method** tab
4. Click on **Email/Password**
5. Enable it and click **Save**

### 3. Get Firebase Configuration

1. In Firebase Console, go to **Project Settings** (gear icon)
2. Scroll down to "Your apps"
3. Click the **Web** icon (`</>`)
4. Register your app (name: "Budget Planner Web")
5. Copy the `firebaseConfig` object

### 4. Create Environment File

Create `.env.local` in the root directory:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef1234567890
```

Replace the values with your actual Firebase config.

### 5. Run the App

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing Authentication

### Register a New User

1. Go to `/register`
2. Enter email and password (min 6 characters)
3. Click "Зарегистрироваться"
4. You'll be redirected to `/dashboard`

### Login

1. Go to `/login`
2. Enter your credentials
3. Click "Войти"
4. You'll be redirected to `/dashboard`

### Logout

1. In `/dashboard`, click "Выйти" button
2. You'll be redirected to `/login`

## File Structure

```
├── app/
│   ├── login/page.tsx          # Login page
│   ├── register/page.tsx       # Registration page
│   ├── dashboard/page.tsx      # Protected dashboard
│   └── page.tsx                # Home (redirects to login)
├── hooks/
│   └── useAuth.ts              # Auth state hook
├── lib/
│   └── firebase.ts             # Firebase initialization
└── .env.local                  # Firebase config (create this!)
```

## How It Works

### Authentication Flow

1. **Home page** (`/`) → Redirects to `/login`
2. **Login/Register** → Firebase authenticates user
3. **Success** → Redirects to `/dashboard`
4. **Dashboard** → Protected route (checks auth state)
5. **Not authenticated** → Redirects back to `/login`

### useAuth Hook

The `useAuth` hook:
- Listens to Firebase auth state changes
- Returns `{ user, loading }`
- Used in dashboard to protect the route

### Data Storage

- Budget data is stored in **localStorage**
- Each user's data is isolated (localStorage is per-browser)
- Future: Can sync to Firebase Firestore

## Troubleshooting

### "Firebase: Error (auth/configuration-not-found)"

- Make sure `.env.local` exists
- Check all environment variables are set
- Restart dev server after creating `.env.local`

### "Firebase: Error (auth/invalid-api-key)"

- Double-check your API key in `.env.local`
- Make sure there are no extra spaces
- Verify the key matches Firebase Console

### Redirect loop

- Clear browser localStorage
- Clear browser cookies
- Check Firebase Authentication is enabled

## Security Notes

- `.env.local` is in `.gitignore` (never commit it!)
- Firebase config is safe to expose in client code
- API key restrictions can be set in Firebase Console
- Use Firebase Security Rules for database protection

## Next Steps

- Add password reset functionality
- Add email verification
- Sync budget data to Firestore
- Add social auth (Google, Facebook)
- Add user profile management
