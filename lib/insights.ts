import { Category, DailyExpense } from '@/app/types';

export interface Insight {
  id: string;
  type: 'warning' | 'suggestion' | 'positive';
  title: string;
  message: string;
  icon: string;
}

// Helper function to get current month expenses only
function getCurrentMonthExpenses(dailyExpenses: DailyExpense[]): DailyExpense[] {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  
  return dailyExpenses.filter(exp => {
    const expDate = new Date(exp.date);
    return expDate.getMonth() === currentMonth && expDate.getFullYear() === currentYear;
  });
}

// Helper function to get last 7 days expenses
function getRecentExpenses(dailyExpenses: DailyExpense[], days: number = 7): DailyExpense[] {
  const daysAgo = new Date();
  daysAgo.setDate(daysAgo.getDate() - days);
  
  return dailyExpenses.filter(exp => new Date(exp.date) >= daysAgo);
}

export function generateBudgetInsights(
  salary: number,
  categories: Category[],
  dailyExpenses: DailyExpense[]
): Insight[] {
  const insights: Insight[] = [];

  if (salary === 0) {
    return insights;
  }

  // Use ONLY current month expenses
  const currentMonthExpenses = getCurrentMonthExpenses(dailyExpenses);
  const totalDailySpent = currentMonthExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalPlanned = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalExpenses = totalPlanned + totalDailySpent;
  const remaining = salary - totalExpenses;
  const savingsPercentage = (remaining / salary) * 100;

  // Insight 1: Budget exceeded
  if (totalExpenses > salary) {
    insights.push({
      id: 'budget-exceeded',
      type: 'warning',
      title: 'Превышение бюджета',
      message: `Ваши расходы в этом месяце (${totalExpenses.toLocaleString('ru-RU')} с) превышают доход на ${(totalExpenses - salary).toLocaleString('ru-RU')} с.`,
      icon: '⚠️',
    });
  }

  // Insight 2: Low savings
  if (remaining > 0 && savingsPercentage < 20) {
    insights.push({
      id: 'low-savings',
      type: 'suggestion',
      title: 'Низкий уровень накоплений',
      message: `Вы откладываете только ${savingsPercentage.toFixed(1)}% в этом месяце. Рекомендуется откладывать минимум 20% дохода.`,
      icon: '💡',
    });
  }

  // Insight 3: Good savings
  if (savingsPercentage >= 30) {
    insights.push({
      id: 'good-savings',
      type: 'positive',
      title: 'Отличные накопления!',
      message: `Вы откладываете ${savingsPercentage.toFixed(1)}% дохода в этом месяце. Продолжайте в том же духе!`,
      icon: '🎉',
    });
  }

  // Insight 4: High category spending (current month only)
  if (currentMonthExpenses.length > 0) {
    const categorySpending: { [key: string]: number } = {};
    currentMonthExpenses.forEach(exp => {
      categorySpending[exp.category] = (categorySpending[exp.category] || 0) + exp.amount;
    });

    Object.entries(categorySpending).forEach(([category, amount]) => {
      const percentage = (amount / salary) * 100;
      if (percentage > 30) {
        insights.push({
          id: `high-category-${category}`,
          type: 'warning',
          title: `Высокие расходы: ${category}`,
          message: `В этом месяце "${category}" занимает ${percentage.toFixed(1)}% бюджета (${amount.toLocaleString('ru-RU')} с).`,
          icon: '📊',
        });
      }
    });
  }

  // Insight 5: No daily expenses this month
  if (currentMonthExpenses.length === 0) {
    insights.push({
      id: 'no-daily-tracking',
      type: 'suggestion',
      title: 'Начните отслеживать расходы',
      message: 'Добавьте ежедневные расходы для более точного анализа вашего бюджета в этом месяце.',
      icon: '📝',
    });
  }

  return insights;
}

export function generateDailyInsights(dailyExpenses: DailyExpense[]): Insight[] {
  const insights: Insight[] = [];

  if (dailyExpenses.length === 0) {
    return insights;
  }

  const today = new Date().toISOString().split('T')[0];
  const todayExpenses = dailyExpenses.filter(exp => exp.date === today);
  const todayTotal = todayExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  // Use only last 7 days for recent comparison
  const recentExpenses = getRecentExpenses(dailyExpenses, 7);

  if (recentExpenses.length === 0) {
    return insights;
  }

  const totalRecent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const daysWithExpenses = new Set(recentExpenses.map(exp => exp.date)).size;
  const averageDaily = daysWithExpenses > 0 ? totalRecent / daysWithExpenses : 0;

  // Insight 1: Today vs average (last 7 days)
  if (todayTotal > averageDaily * 1.5 && averageDaily > 0) {
    insights.push({
      id: 'high-daily-spending',
      type: 'warning',
      title: 'Высокие расходы сегодня',
      message: `Сегодня вы потратили ${todayTotal.toLocaleString('ru-RU')} с, что на ${((todayTotal / averageDaily - 1) * 100).toFixed(0)}% больше среднего за неделю.`,
      icon: '📈',
    });
  } else if (todayTotal < averageDaily * 0.5 && todayTotal > 0 && averageDaily > 0) {
    insights.push({
      id: 'low-daily-spending',
      type: 'positive',
      title: 'Экономный день!',
      message: `Сегодня вы потратили ${todayTotal.toLocaleString('ru-RU')} с, что ниже среднего за неделю. Отличная работа!`,
      icon: '🌟',
    });
  }

  // Insight 2: No spending today
  if (todayExpenses.length === 0) {
    insights.push({
      id: 'no-spending-today',
      type: 'positive',
      title: 'День без расходов',
      message: 'Сегодня вы еще ничего не потратили. Продолжайте экономить!',
      icon: '💰',
    });
  }

  // Insight 3: Frequent category (last 7 days only)
  const categoryCount: { [key: string]: number } = {};
  const categoryAmount: { [key: string]: number } = {};
  
  recentExpenses.forEach(exp => {
    categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
    categoryAmount[exp.category] = (categoryAmount[exp.category] || 0) + exp.amount;
  });

  const mostExpensive = Object.entries(categoryAmount).sort((a, b) => b[1] - a[1])[0];
  if (mostExpensive && mostExpensive[1] > totalRecent * 0.4) {
    insights.push({
      id: 'expensive-category',
      type: 'suggestion',
      title: 'Высокие расходы на категорию',
      message: `На этой неделе больше всего вы тратите на "${mostExpensive[0]}" (${mostExpensive[1].toLocaleString('ru-RU')} с).`,
      icon: '🔍',
    });
  }

  // Insight 4: Spending streak (last 7 days)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const daysWithSpending = last7Days.filter(date =>
    dailyExpenses.some(exp => exp.date === date)
  ).length;

  if (daysWithSpending === 7) {
    insights.push({
      id: 'spending-streak',
      type: 'suggestion',
      title: 'Расходы каждый день',
      message: 'Вы тратили деньги каждый день на этой неделе. Попробуйте устроить день без покупок.',
      icon: '📅',
    });
  }

  // Insight 5: Stable spending
  if (daysWithSpending >= 3 && daysWithSpending < 7) {
    const variance = recentExpenses.reduce((sum, exp) => {
      const diff = exp.amount - averageDaily;
      return sum + (diff * diff);
    }, 0) / recentExpenses.length;
    
    if (variance < averageDaily * 0.5) {
      insights.push({
        id: 'stable-spending',
        type: 'positive',
        title: 'Стабильные расходы',
        message: 'Ваши расходы на этой неделе стабильны. Вы хорошо контролируете бюджет!',
        icon: '✅',
      });
    }
  }

  return insights;
}

export function generateAllInsights(
  salary: number,
  categories: Category[],
  dailyExpenses: DailyExpense[]
): Insight[] {
  const budgetInsights = generateBudgetInsights(salary, categories, dailyExpenses);
  const dailyInsights = generateDailyInsights(dailyExpenses);

  return [...budgetInsights, ...dailyInsights];
}
