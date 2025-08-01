import React from 'react';
import { DollarSign, Users, Receipt, TrendingUp } from 'lucide-react';
import { calculateBalances } from '../utils/calculations';

export function Dashboard({ expenses, friends, onViewChange }) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const balances = calculateBalances(expenses, friends);
  const yourBalance = balances.reduce((sum, balance) => {
    if (balance.from === 'You') return sum - balance.amount;
    if (balance.to === 'You') return sum + balance.amount;
    return sum;
  }, 0);

  const recentExpenses = expenses.slice(-3);

  const stats = [
    {
      label: 'Total Expenses',
      value: `₹${totalExpenses.toFixed(2)}`,
      icon: DollarSign,
      color: 'bg-blue-500',
    },
    {
      label: 'Your Balance',
      value: yourBalance >= 0 ? `+₹${yourBalance.toFixed(2)}` : `-₹${Math.abs(yourBalance).toFixed(2)}`,
      icon: TrendingUp,
      color: yourBalance >= 0 ? 'bg-green-500' : 'bg-red-500',
    },
    {
      label: 'Friends',
      value: friends.length.toString(),
      icon: Users,
      color: 'bg-purple-500',
    },
    {
      label: 'Expenses',
      value: expenses.length.toString(),
      icon: Receipt,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Expenses */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Expenses</h2>
            <button
              onClick={() => onViewChange('history')}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              View All
            </button>
          </div>
          <div className="space-y-3">
            {recentExpenses.length > 0 ? (
              recentExpenses.map((expense) => (
                <div key={expense.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900">{expense.description}</p>
                    <p className="text-sm text-gray-600">
                      Paid by {expense.paidBy} • {expense.date.toLocaleDateString()}
                    </p>
                  </div>
                  <span className="font-semibold text-gray-900">₹{expense.amount.toFixed(2)}</span>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4">No expenses yet</p>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button
              onClick={() => onViewChange('add-expense')}
              className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-green-500 to-blue-500 text-white p-3 rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200"
            >
              <DollarSign className="w-5 h-5" />
              <span>Add New Expense</span>
            </button>
            <button
              onClick={() => onViewChange('friends')}
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Users className="w-5 h-5" />
              <span>Manage Friends</span>
            </button>
            <button
              onClick={() => onViewChange('balances')}
              className="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 p-3 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <Receipt className="w-5 h-5" />
              <span>View Balances</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}