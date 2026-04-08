export interface Category {
  id: string;
  name: string;
  percentage: number;
  amount: number;
}

export interface DailyExpense {
  id: string;
  userId: string;
  amount: number;
  category: string;
  note: string;
  date: string; // ISO string format
  timestamp: number;
  createdAt: any; // Firestore Timestamp
}

export interface MonthlyPlan {
  id: string;
  userId: string;
  title: string;
  amount: number;
  category?: string;
  isCompleted: boolean;
  month: string; // Format: YYYY-MM
  createdAt: any; // Firestore Timestamp
}
