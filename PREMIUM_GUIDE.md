# 👑 Premium System Guide

## Overview

Your budget planner now includes a premium subscription system with admin approval workflow.

---

## System Architecture

### Firestore Collections

#### 1. `users` Collection
```typescript
{
  email: string,
  isPremium: boolean,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

#### 2. `payments` Collection
```typescript
{
  userId: string,
  userEmail: string,
  status: 'pending' | 'approved' | 'rejected',
  createdAt: timestamp,
  updatedAt: timestamp
}
```

---

## User Flow

### For Regular Users:

1. **Login** → User document created automatically
2. **See locked features** → Analytics, Reports, Insights show 🔒
3. **Click "Upgrade to Premium"** → Payment request created
4. **Wait for approval** → Status shows "pending"
5. **Get approved** → isPremium = true, access unlocked

### For Admin Users:

1. **Login** → Admin panel link appears in sidebar
2. **Go to /admin** → See all payment requests
3. **Review requests** → See user email and date
4. **Approve/Reject** → Update user status
5. **Track history** → See approved/rejected requests

---

## Premium Features

### Locked for Free Users:
- 📈 **Analytics** - Charts and data visualization
- 📋 **Reports** - Monthly reports and exports
- 💡 **Insights** - Financial recommendations

### Available for Everyone:
- 📊 **Dashboard** - Overview (with upgrade prompt)
- 💼 **Planner** - Budget planning
- 🧮 **Calculator** - Simple calculator
- 📝 **Daily** - Daily expense tracking
- 🎯 **Goals** - Financial goals

---

## Admin Configuration

### Set Admin Emails

Edit `lib/admin.ts`:

```typescript
const ADMIN_EMAILS = [
  'admin@example.com',  // Replace with your email
  'another@admin.com',  // Add more admins
];
```

### Admin Panel Features

Located at `/admin`:
- View all payment requests
- Filter by status (pending/approved/rejected)
- Approve requests (sets isPremium = true)
- Reject requests (sets status = rejected)
- See statistics

---

## Components

### 1. `usePremium` Hook
```typescript
const { isPremium, loading } = usePremium(user);
```
- Checks user's premium status
- Auto-creates user document if missing
- Returns loading state

### 2. `PremiumGate` Component
```typescript
<PremiumGate isPremium={isPremium}>
  <YourPremiumContent />
</PremiumGate>
```
- Wraps premium pages
- Shows upgrade prompt if not premium
- Allows access if premium

### 3. `UpgradeToPremium` Component
```typescript
<UpgradeToPremium userId={user.uid} userEmail={user.email} />
```
- Shows upgrade button
- Creates payment request
- Shows pending status

### 4. `PremiumBadge` Component
```typescript
<PremiumBadge />
```
- Shows ⭐ Premium badge
- Displayed in sidebar for premium users

---

## Implementation Details

### Sidebar Updates
- Shows 🔒 icon on locked features
- Displays premium badge for premium users
- Shows admin panel link for admins
- Passes `isPremium` prop to all pages

### Dashboard Updates
- Loads premium status
- Shows upgrade button for insights
- Displays premium badge
- Real-time status updates

### Premium Pages
- Wrapped in `PremiumGate`
- Redirect non-premium users
- Show upgrade prompt
- Full access for premium users

---

## Firestore Security Rules

Add these rules to your Firestore:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Payments collection
    match /payments/{paymentId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null;
      allow update: if request.auth != null; // Admin only in practice
    }
  }
}
```

---

## Testing

### Test as Regular User:
1. Register new account
2. Try accessing Analytics → See lock screen
3. Click "Upgrade to Premium"
4. See pending status

### Test as Admin:
1. Add your email to `ADMIN_EMAILS`
2. Login with admin email
3. See "Admin Panel" in sidebar
4. Go to `/admin`
5. Approve/reject requests

---

## Customization

### Change Premium Features

Edit `app/components/Sidebar.tsx`:

```typescript
const menuItems = [
  { name: 'Feature', path: '/path', icon: '🔒', premium: true },
  // Add premium: true to lock features
];
```

### Change Upgrade Button Text

Edit `app/components/UpgradeToPremium.tsx`:

```typescript
{loading ? 'Sending...' : '⭐ Your Custom Text'}
```

### Change Lock Screen Message

Edit `app/components/PremiumGate.tsx`:

```typescript
<p className="text-gray-600 mb-6">
  Your custom message here
</p>
```

---

## Future Enhancements

Potential additions:
- [ ] Real payment integration (Stripe, PayPal)
- [ ] Subscription tiers (Basic, Pro, Enterprise)
- [ ] Auto-renewal system
- [ ] Trial period (7 days free)
- [ ] Promo codes
- [ ] Referral system
- [ ] Email notifications
- [ ] Invoice generation

---

## Troubleshooting

### User not seeing premium features after approval:
- Refresh the page
- Check Firestore: users/{userId}/isPremium = true
- Clear browser cache
- Re-login

### Admin panel not showing:
- Check email in `ADMIN_EMAILS`
- Email must match exactly (case-sensitive)
- Re-login after adding email

### Payment request not creating:
- Check Firestore permissions
- Check browser console for errors
- Verify user is logged in

---

## Security Notes

- Admin emails are hardcoded (not in database)
- No real payment processing (mock system)
- Firestore rules should restrict admin operations
- Use environment variables for sensitive data
- Implement proper authentication checks

---

Enjoy your premium system! 👑✨
