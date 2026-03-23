'use client';

import { useState, useEffect } from 'react';
import { Category } from './types';
import SalaryInput from './components/SalaryInput';
import CategoryList from './components/CategoryList';
import Summary from './components/Summary';
import AddCategoryButton from './components/AddCategoryButton';

const DEFAULT_CATEGORIES: Category[] = [
  { id: '1', name: '🏠 Аренда', percentage: 35, amount: 0 },
  { id: '2', name: '🛒 Продукты', percentage: 15, amount: 0 },
  { id: '3', name: '⚡ Коммун услуги', percentage: 5, amount: 0 },
  { id: '4', name: '📞 Связь', percentage: 3, amount: 0 },
  { id: '5', name: '🚗 Транспорт', percentage: 5, amount: 0 },
  { id: '6', name: '🧼 Гигиена', percentage: 3, amount: 0 },
  { id: '7', name: '💊 Лекарства', percentage: 7, amount: 0 },
];

export default function Home() {
  const [salary, setSalary] = useState(0);
  const [categories, setCategories] = useState<Category[]>(DEFAULT_CATEGORIES);

  // Load from localStorage
  useEffect(() => {
    const savedSalary = localStorage.getItem('salary');
    const savedCategories = localStorage.getItem('categories');
    
    if (savedSalary) setSalary(Number(savedSalary));
    if (savedCategories) setCategories(JSON.parse(savedCategories));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('salary', salary.toString());
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [salary, categories]);

  const handleSalaryChange = (newSalary: number) => {
    setSalary(newSalary);
    // Recalculate amounts
    setCategories(cats => 
      cats.map(cat => ({
        ...cat,
        amount: (newSalary * cat.percentage) / 100
      }))
    );
  };

  const handlePercentageChange = (id: string, percentage: number) => {
    setCategories(cats =>
      cats.map(cat =>
        cat.id === id
          ? { ...cat, percentage, amount: (salary * percentage) / 100 }
          : cat
      )
    );
  };

  const handleAmountChange = (id: string, amount: number) => {
    setCategories(cats =>
      cats.map(cat =>
        cat.id === id
          ? { ...cat, amount, percentage: salary > 0 ? (amount / salary) * 100 : 0 }
          : cat
      )
    );
  };

  const handleNameChange = (id: string, name: string) => {
    setCategories(cats =>
      cats.map(cat => (cat.id === id ? { ...cat, name } : cat))
    );
  };

  const handleDelete = (id: string) => {
    setCategories(cats => cats.filter(cat => cat.id !== id));
  };

  const handleAddCategory = () => {
    const newCategory: Category = {
      id: Date.now().toString(),
      name: '📝 Новая категория',
      percentage: 0,
      amount: 0,
    };
    setCategories([...categories, newCategory]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-[480px] space-y-4">
        <SalaryInput salary={salary} onChange={handleSalaryChange} />
        
        <CategoryList
          categories={categories}
          onPercentageChange={handlePercentageChange}
          onAmountChange={handleAmountChange}
          onNameChange={handleNameChange}
          onDelete={handleDelete}
        />
        
        <Summary salary={salary} categories={categories} />
        
        <AddCategoryButton onClick={handleAddCategory} />
      </div>
    </div>
  );
}
