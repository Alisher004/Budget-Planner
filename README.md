# Budget Planner with Firebase Authentication

A budget planner web app built with Next.js, TypeScript, Tailwind CSS, and Firebase Authentication.

## Features

- Firebase Authentication (email/password)
- Protected dashboard route
- Enter monthly salary
- Default categories with emoji icons
- Add/edit/delete categories
- Adjust budget using percentage or amount inputs
- Real-time calculations
- Total validation (warns if exceeds 100%)
- Data persists in localStorage
- Responsive design
- Russian language UI

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication → Email/Password
4. Get your Firebase config from Project Settings

### 3. Configure environment variables

Create a `.env.local` file in the root directory:


### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
budget-planner/
├── app/
│   ├── components/
│   │   ├── SalaryInput.tsx
│   │   ├── CategoryList.tsx
│   │   ├── CategoryItem.tsx
│   │   ├── Summary.tsx
│   │   └── AddCategoryButton.tsx
│   ├── login/
│   │   └── page.tsx
│   ├── register/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   └── types.ts
├── hooks/
│   └── useAuth.ts
├── lib/
│   └── firebase.ts
├── package.json
├── tsconfig.json
└── tailwind.config.ts
```

## How It Works

### Authentication Flow

1. User visits home page → redirected to `/login`
2. User can register at `/register` or login at `/login`
3. After successful auth → redirected to `/dashboard`
4. Dashboard is protected - only accessible when logged in
5. User can logout from dashboard

### Budget Management

- Enter your monthly salary
- Use percentage inputs to adjust budget per category
- Or enter amounts directly
- Percentages and amounts sync automatically
- All data saves to localStorage (per user)
- Refresh the page - your data persists!

## Tech Stack

- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Firebase Authentication
- localStorage

## Security Notes

- Never commit `.env.local` to version control
- Firebase config is safe to expose in client-side code
- Use Firebase Security Rules for database protection (when added)
