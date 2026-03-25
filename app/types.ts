export interface Category {
  id: string;
  name: string;
  percentage: number;
  amount: number;
}

export interface DailyExpense {
  id: string;
  amount: number;
  category: string;
  note: string;
  date: string;
  timestamp: number;
}
