import { Category, DailyExpense } from '@/app/types';

export interface Insight {
  id: string;
  type: 'warning' | 'suggestion' | 'positive';
  title: string;
  message: string;
  icon: string;
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

  const totalPlanned = categories.reduce((sum, cat) => sum + cat.amount, 0);
  const totalDailySpent = dailyExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const totalExpenses = totalPlanned + totalDailySpent;
  const remaining = salary - totalExpenses;
  const savingsPercentage = (remaining / salary) * 100;

  // Insight 1: Budget exceeded
  if (totalExpenses > salary) {
    insights.push({
      id: 'budget-exceeded',
      type: 'warning',
      title: 'Превышение бюджета',
      message: `Ваши расходы (${totalExpenses.toLocaleString('ru-RU')} ₽) превышают доход на ${(totalExpenses - salary).toLocaleString('ru-RU')} ₽. Необходимо сократить расходы.`,
      icon: '⚠️',
    });
  }

  // Insight 2: Low savings
  if (remaining > 0 && savingsPercentage < 20) {
    insights.push({
      id: 'low-savings',
      type: 'suggestion',
      title: 'Низкий уровень накоплений',
      message: `Вы откладываете только ${savingsPercentage.toFixed(1)}%. Рекомендуется откладывать минимум 20% дохода (${(salary * 0.2).toLocaleString('ru-RU')} ₽).`,
      icon: '💡',
    });
  }

  // Insight 3: Good savings
  if (savingsPercentage >= 30) {
    insights.push({
      id: 'good-savings',
      type: 'positive',
      title: 'Отличные накопления!',
      message: `Вы откладываете ${savingsPercentage.toFixed(1)}% дохода. Продолжайте в том же духе!`,
      icon: '🎉',
    });
  }

  // Insight 4: High category spending
  categories.forEach((cat) => {
    if (cat.percentage > 30) {
      insights.push({
        id: `high-category-${cat.id}`,
        type: 'warning',
        title: `Высокие расходы: ${cat.name}`,
        message: `Категория "${cat.name}" занимает ${cat.percentage.toFixed(1)}% бюджета. Рекомендуется не превышать 30% на одну категорию.`,
        icon: '📊',
      });
    }
  });

  // Insight 5: Balanced budget
  const totalPercentage = categories.reduce((sum, cat) => sum + cat.percentage, 0);
  if (totalPercentage <= 100 && totalPercentage >= 80 && remaining >= 0) {
    insights.push({
      id: 'balanced-budget',
      type: 'positive',
      title: 'Сбалансированный бюджет',
      message: 'Ваш бюджет хорошо распределен по категориям. Продолжайте следить за расходами!',
      icon: '✅',
    });
  }

  // Insight 6: No daily expenses
  if (dailyExpenses.length === 0) {
    insights.push({
      id: 'no-daily-tracking',
      type: 'suggestion',
      title: 'Начните отслеживать расходы',
      message: 'Добавьте ежедневные расходы для более точного анализа вашего бюджета.',
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

  // Calculate average daily spending (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const recentExpenses = dailyExpenses.filter(
    exp => new Date(exp.date) >= thirtyDaysAgo
  );

  if (recentExpenses.length === 0) {
    return insights;
  }

  const totalRecent = recentExpenses.reduce((sum, exp) => sum + exp.amount, 0);
  const daysWithExpenses = new Set(recentExpenses.map(exp => exp.date)).size;
  const averageDaily = daysWithExpenses > 0 ? totalRecent / daysWithExpenses : 0;

  // Insight 1: Today vs average
  if (todayTotal > averageDaily * 1.5) {
    insights.push({
      id: 'high-daily-spending',
      type: 'warning',
      title: 'Высокие расходы сегодня',
      message: `Сегодня вы потратили ${todayTotal.toLocaleString('ru-RU')} ₽, что на ${((todayTotal / averageDaily - 1) * 100).toFixed(0)}% больше среднего (${averageDaily.toLocaleString('ru-RU')} ₽).`,
      icon: '📈',
    });
  } else if (todayTotal < averageDaily * 0.5 && todayTotal > 0) {
    insights.push({
      id: 'low-daily-spending',
      type: 'positive',
      title: 'Экономный день!',
      message: `Сегодня вы потратили ${todayTotal.toLocaleString('ru-RU')} ₽, что ниже среднего. Отличная работа!`,
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

  // Insight 3: Frequent category
  const categoryCount: { [key: string]: number } = {};
  recentExpenses.forEach(exp => {
    categoryCount[exp.category] = (categoryCount[exp.category] || 0) + 1;
  });

  const mostFrequent = Object.entries(categoryCount).sort((a, b) => b[1] - a[1])[0];
  if (mostFrequent && mostFrequent[1] > recentExpenses.length * 0.3) {
    insights.push({
      id: 'frequent-category',
      type: 'suggestion',
      title: 'Частая категория расходов',
      message: `Большинство ваших расходов приходится на "${mostFrequent[0]}". Возможно, стоит оптимизировать эту категорию.`,
      icon: '🔍',
    });
  }

  // Insight 4: Spending streak
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
