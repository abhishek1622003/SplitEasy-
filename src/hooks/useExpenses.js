import { useState } from 'react';

export function useExpenses() {
  const [expenses, setExpenses] = useState([]);

  const addExpense = (expense) => {
    const newExpense = {
      ...expense,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9)
    };
    setExpenses(prev => [...prev, newExpense]);
  };

  const deleteExpense = (id) => {
    setExpenses(prev => prev.filter(expense => expense.id !== id));
  };

  return {
    expenses,
    addExpense,
    deleteExpense
  };
}