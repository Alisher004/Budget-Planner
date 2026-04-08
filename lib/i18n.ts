// Simple i18n system for Kyrgyz and Russian languages

export type Language = 'kg' | 'ru';

export const translations = {
  kg: {
    // Common
    loading: 'Жүктөлүүдө...',
    logout: 'Чыгуу',
    save: 'Сактоо',
    cancel: 'Жокко чыгаруу',
    delete: 'Өчүрүү',
    edit: 'Өзгөртүү',
    add: 'Кошуу',
    close: 'Жабуу',
    
    // Auth
    login: 'Кирүү',
    register: 'Катталуу',
    email: 'Email',
    password: 'Сыр сөз',
    confirmPassword: 'Сыр сөздү ырастоо',
    
    // Navigation
    dashboard: 'Башкы бет',
    planner: 'Пландаштыруучу',
    calculator: 'Калькулятор',
    daily: 'Күнүмдүк',
    analytics: 'Аналитика',
    reports: 'Отчеттор',
    goals: 'Максаттар',
    adminPanel: 'Админ панель',
    
    // User
    user: 'Колдонуучу',
    premium: 'Премиум',
    trial: 'Сыноо мөөнөтү',
    freePlan: 'Акысыз план',
    daysLeft: 'күн калды',
    
    // Dashboard
    overview: 'Жалпы көрүнүш',
    welcomeMessage: 'Финансылык пландаштыруучуга кош келиңиз',
    monthlyIncome: 'Айлык киреше',
    spent: 'Чыгымдалды',
    remaining: 'Калдык',
    used: 'Колдонулду',
    budget: 'Бюджет',
    
    // Categories
    categories: 'Категориялар',
    categoryName: 'Категория аталышы',
    percentage: 'Пайыз',
    amount: 'Сумма',
    addCategory: 'Категория кошуу',
    
    // Expenses
    expenses: 'Чыгымдар',
    dailyExpenses: 'Күнүмдүк чыгымдар',
    addExpense: 'Чыгым кошуу',
    category: 'Категория',
    note: 'Эскертме',
    date: 'Күн',
    todaySpent: 'Бүгүн чыгымдалды',
    
    // Reports
    monthlyReport: 'Айлык отчет',
    yearlyReport: 'Жылдык отчет',
    selectMonth: 'Айды тандаңыз',
    selectYear: 'Жылды тандаңыз',
    totalIncome: 'Жалпы киреше',
    totalSpent: 'Жалпы чыгым',
    exportCSV: 'CSV экспорт',
    exportPDF: 'PDF экспорт',
    
    // Status
    budgetStatus: 'Бюджет абалы',
    budgetOk: 'Бюджет нормада',
    budgetExceeded: 'Бюджет ашты',
    deficit: 'Дефицит',
    
    // Insights
    financialInsights: 'Финансылык сунуштар',
    
    // Goals
    savingsAvailable: 'Топтомго жеткиликтүү',
    goalProgress: 'Максат прогресси',
    target: 'Максат',
    current: 'Учурдагы',
    
    // Premium
    premiumFeatures: 'Премиум функциялар',
    upgradeToPremium: 'Премиумга өтүү',
    
    // Months
    january: 'Январь',
    february: 'Февраль',
    march: 'Март',
    april: 'Апрель',
    may: 'Май',
    june: 'Июнь',
    july: 'Июль',
    august: 'Август',
    september: 'Сентябрь',
    october: 'Октябрь',
    november: 'Ноябрь',
    december: 'Декабрь',
  },
  ru: {
    // Common
    loading: 'Загрузка...',
    logout: 'Выйти',
    save: 'Сохранить',
    cancel: 'Отмена',
    delete: 'Удалить',
    edit: 'Изменить',
    add: 'Добавить',
    close: 'Закрыть',
    
    // Auth
    login: 'Вход',
    register: 'Регистрация',
    email: 'Email',
    password: 'Пароль',
    confirmPassword: 'Подтвердите пароль',
    
    // Navigation
    dashboard: 'Обзор',
    planner: 'Планировщик',
    calculator: 'Калькулятор',
    daily: 'Ежедневные',
    analytics: 'Аналитика',
    reports: 'Отчеты',
    goals: 'Цели',
    adminPanel: 'Админ панель',
    
    // User
    user: 'Пользователь',
    premium: 'Премиум',
    trial: 'Пробный период',
    freePlan: 'Бесплатный план',
    daysLeft: 'дней осталось',
    
    // Dashboard
    overview: 'Обзор',
    welcomeMessage: 'Добро пожаловать в ваш финансовый планировщик',
    monthlyIncome: 'Месячный доход',
    spent: 'Потрачено',
    remaining: 'Остаток',
    used: 'Использовано',
    budget: 'Бюджет',
    
    // Categories
    categories: 'Категории',
    categoryName: 'Название категории',
    percentage: 'Процент',
    amount: 'Сумма',
    addCategory: 'Добавить категорию',
    
    // Expenses
    expenses: 'Расходы',
    dailyExpenses: 'Ежедневные расходы',
    addExpense: 'Добавить расход',
    category: 'Категория',
    note: 'Заметка',
    date: 'Дата',
    todaySpent: 'Сегодня потрачено',
    
    // Reports
    monthlyReport: 'Месячный отчет',
    yearlyReport: 'Годовой отчет',
    selectMonth: 'Выберите месяц',
    selectYear: 'Выберите год',
    totalIncome: 'Общий доход',
    totalSpent: 'Всего потрачено',
    exportCSV: 'Экспорт CSV',
    exportPDF: 'Экспорт PDF',
    
    // Status
    budgetStatus: 'Статус бюджета',
    budgetOk: 'Бюджет в норме',
    budgetExceeded: 'Превышение бюджета',
    deficit: 'Дефицит',
    
    // Insights
    financialInsights: 'Финансовые рекомендации',
    
    // Goals
    savingsAvailable: 'Доступно для накоплений',
    goalProgress: 'Прогресс цели',
    target: 'Цель',
    current: 'Текущее',
    
    // Premium
    premiumFeatures: 'Премиум функции',
    upgradeToPremium: 'Обновиться до Premium',
    
    // Months
    january: 'Январь',
    february: 'Февраль',
    march: 'Март',
    april: 'Апрель',
    may: 'Май',
    june: 'Июнь',
    july: 'Июль',
    august: 'Август',
    september: 'Сентябрь',
    october: 'Октябрь',
    november: 'Ноябрь',
    december: 'Декабрь',
  },
};

export function getTranslation(lang: Language, key: keyof typeof translations.ru): string {
  return translations[lang][key] || translations.ru[key] || key;
}

// Hook for using translations
export function useTranslations(lang: Language) {
  return {
    t: (key: keyof typeof translations.ru) => getTranslation(lang, key),
    lang,
  };
}
