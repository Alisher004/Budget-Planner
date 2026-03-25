# 📊 Dashboard Guide

## Overview

Your budget planner now has a full-featured dashboard with 5 main sections:

### 1. 📊 Обзор (Dashboard Overview)
- Quick summary cards showing:
  - Monthly income
  - Total spent
  - Remaining balance
  - Budget usage percentage
- Top 5 categories overview
- Budget status with progress bar
- Quick action buttons to other sections

### 2. 🧮 Калькулятор (Budget Calculator)
- Enter monthly salary
- Add/edit/delete budget categories
- Adjust percentages with sliders
- Edit amounts directly
- Real-time calculations
- Visual progress bar
- Over-budget warnings

### 3. 📈 Аналитика (Analytics)
- **Pie Chart**: Category distribution
- **Bar Chart**: Monthly comparison (income vs spent vs remaining)
- Color-coded indicators
- Detailed category breakdown with colors
- Summary cards

### 4. 📋 Отчеты (Reports)
- Monthly summary report
- Filter by month
- Detailed category table with status indicators
- Export buttons (CSV/PDF - mock for now)
- Budget usage progress bar

### 5. 🎯 Цели (Financial Goals)
- Create financial goals
- Set target amounts and deadlines
- Track progress with visual bars
- Auto-calculate from remaining budget
- Goal completion notifications

---

## Features

### ✅ Implemented
- Sidebar navigation with user info
- Responsive layout
- Real-time calculations
- localStorage persistence
- Firebase Authentication integration
- Charts (Pie & Bar using Recharts)
- Progress tracking
- Color-coded status indicators
- Smooth transitions

### 🎨 UI/UX
- Clean fintech design
- Tailwind CSS styling
- Card-based layout
- Hover effects
- Responsive grid system
- Color-coded warnings (red for over-budget, green for good)

---

## Navigation

### Sidebar Menu
- **Обзор** - Dashboard overview
- **Калькулятор** - Budget calculator
- **Аналитика** - Charts and analytics
- **Отчеты** - Monthly reports
- **Цели** - Financial goals
- **Выйти** - Logout

---

## How to Use

### Getting Started
1. Login to your account
2. You'll land on the **Dashboard Overview**
3. Click **Калькулятор** to set up your budget

### Setting Up Budget
1. Go to **Калькулятор**
2. Enter your monthly salary
3. Adjust category percentages or amounts
4. Add new categories as needed
5. Delete unwanted categories

### Viewing Analytics
1. Go to **Аналитика**
2. See pie chart of category distribution
3. View bar chart for monthly trends
4. Check detailed breakdown

### Creating Goals
1. Go to **Цели**
2. Click "Добавить цель"
3. Set goal name, target amount, and deadline
4. Track progress automatically

### Generating Reports
1. Go to **Отчеты**
2. Select month from dropdown
3. View detailed breakdown
4. Export to CSV or PDF (coming soon)

---

## Data Storage

### Current Implementation
- **localStorage**: All data stored locally per user
- **Firebase Auth**: User authentication only
- **No Firestore yet**: Data not synced to cloud

### Future Enhancement
- Sync data to Firestore
- Multi-device access
- Historical data tracking
- Cloud backup

---

## File Structure

```
app/
├── dashboard/
│   ├── page.tsx              # Overview
│   ├── calculator/
│   │   └── page.tsx          # Budget calculator
│   ├── analytics/
│   │   └── page.tsx          # Charts & analytics
│   ├── reports/
│   │   └── page.tsx          # Monthly reports
│   └── goals/
│       └── page.tsx          # Financial goals
├── components/
│   ├── Sidebar.tsx           # Navigation sidebar
│   ├── SummaryCard.tsx       # Summary stat cards
│   └── CategoryCard.tsx      # Category item card
└── ...
```

---

## Dependencies

### New Package Added
```json
"recharts": "^2.12.0"  // For charts
```

### Install
```bash
npm install
```

---

## Customization

### Colors
Edit Tailwind classes in components:
- Blue: Primary actions
- Green: Positive indicators
- Red: Warnings/over-budget
- Yellow: Caution

### Charts
Modify chart colors in `analytics/page.tsx`:
```typescript
const COLORS = ['#3B82F6', '#10B981', '#F59E0B', ...];
```

### Categories
Default categories in `calculator/page.tsx`:
```typescript
const DEFAULT_CATEGORIES = [
  { id: '1', name: '🏠 Аренда', percentage: 35, amount: 0 },
  // Add more...
];
```

---

## Tips

1. **Budget Planning**: Start with the calculator to set up your budget
2. **Track Progress**: Check analytics weekly to see trends
3. **Set Goals**: Use the goals section to stay motivated
4. **Monthly Review**: Generate reports at month-end
5. **Stay Under 100%**: Keep total percentage under 100% to avoid overspending

---

## Troubleshooting

### Charts not showing?
- Make sure you have categories with amounts > 0
- Check that salary is set
- Verify recharts is installed: `npm install recharts`

### Data not persisting?
- Check browser localStorage is enabled
- Don't use incognito/private mode
- Clear cache and try again

### Sidebar not showing?
- Make sure you're logged in
- Check that user email is available
- Verify Firebase auth is working

---

## Next Steps

### Planned Features
- [ ] Firestore integration for cloud sync
- [ ] Real CSV/PDF export
- [ ] Historical data tracking
- [ ] Budget templates
- [ ] Recurring expenses
- [ ] Income tracking
- [ ] Multi-currency support
- [ ] Dark mode

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Verify Firebase is configured
3. Make sure all dependencies are installed
4. Clear localStorage and try again

Enjoy your budget planner! 💰
