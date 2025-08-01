import React, { useState } from 'react';
import { X, Plus, Minus } from 'lucide-react';

export function ExpenseForm({ friends, onAddExpense, onCancel }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [paidBy, setPaidBy] = useState('You');
  const [selectedFriends, setSelectedFriends] = useState(['You']);
  const [splitType, setSplitType] = useState('equal');
  const [customSplits, setCustomSplits] = useState({});
  const [category, setCategory] = useState('General');

  const categories = [
    'General', 'Food', 'Transportation', 'Entertainment', 'Utilities', 
    'Groceries', 'Rent', 'Travel', 'Shopping', 'Healthcare'
  ];

  const allPeople = ['You', ...friends.map(f => f.name)];

  const handleFriendToggle = (person) => {
    if (person === 'You') return; // You are always included
    
    setSelectedFriends(prev => {
      const newSelection = prev.includes(person)
        ? prev.filter(p => p !== person)
        : [...prev, person];
      
      // Update custom splits when selection changes
      if (splitType === 'custom') {
        const newCustomSplits = { ...customSplits };
        if (!prev.includes(person)) {
          newCustomSplits[person] = '0';
        } else {
          delete newCustomSplits[person];
        }
        setCustomSplits(newCustomSplits);
      }
      
      return newSelection;
    });
  };

  const handleCustomSplitChange = (person, value) => {
    setCustomSplits(prev => ({
      ...prev,
      [person]: value
    }));
  };

  const calculateSplits = () => {
    const amountNum = parseFloat(amount) || 0;
    
    if (splitType === 'equal') {
      const splitAmount = amountNum / selectedFriends.length;
      return selectedFriends.reduce((acc, person) => ({
        ...acc,
        [person]: splitAmount
      }), {});
    } else {
      return selectedFriends.reduce((acc, person) => ({
        ...acc,
        [person]: parseFloat(customSplits[person] || '0') || 0
      }), {});
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!description || !amount || selectedFriends.length === 0) return;

    const splits = calculateSplits();
    const totalSplit = Object.values(splits).reduce((sum, val) => sum + val, 0);
    const amountNum = parseFloat(amount);

    if (splitType === 'custom' && Math.abs(totalSplit - amountNum) > 0.01) {
      alert('Custom splits must add up to the total amount');
      return;
    }

    onAddExpense({
      description,
      amount: amountNum,
      paidBy,
      splitBetween: selectedFriends,
      date: new Date(),
      category,
      splits
    });

    // Reset form
    setDescription('');
    setAmount('');
    setPaidBy('You');
    setSelectedFriends(['You']);
    setSplitType('equal');
    setCustomSplits({});
    setCategory('General');
  };

  const totalCustomSplit = Object.values(customSplits).reduce((sum, val) => sum + (parseFloat(val) || 0), 0);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Add New Expense</h2>
          <button
            onClick={onCancel}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="What was this expense for?"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="0.00"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Paid by
            </label>
            <select
              value={paidBy}
              onChange={(e) => setPaidBy(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {allPeople.map(person => (
                <option key={person} value={person}>{person}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Split between
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {allPeople.map(person => (
                <label key={person} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <input
                    type="checkbox"
                    checked={selectedFriends.includes(person)}
                    onChange={() => handleFriendToggle(person)}
                    disabled={person === 'You'}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className={person === 'You' ? 'font-medium' : ''}>{person}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Split type
            </label>
            <div className="flex space-x-4 mb-4">
              <button
                type="button"
                onClick={() => setSplitType('equal')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  splitType === 'equal'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                Equal Split
              </button>
              <button
                type="button"
                onClick={() => setSplitType('custom')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  splitType === 'custom'
                    ? 'bg-blue-100 text-blue-700 border-2 border-blue-500'
                    : 'bg-gray-100 text-gray-700 border-2 border-transparent hover:bg-gray-200'
                }`}
              >
                Custom Split
              </button>
            </div>

            {splitType === 'equal' && (
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">
                  Each person will pay: <span className="font-semibold">₹{(parseFloat(amount) / selectedFriends.length || 0).toFixed(2)}</span>
                </p>
              </div>
            )}

            {splitType === 'custom' && (
              <div className="space-y-3">
                {selectedFriends.map(person => (
                  <div key={person} className="flex items-center space-x-3">
                    <span className="w-20 text-sm font-medium">{person}:</span>
                    <input
                      type="number"
                      step="0.01"
                      value={customSplits[person] || ''}
                      onChange={(e) => handleCustomSplitChange(person, e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="0.00"
                    />
                  </div>
                ))}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Total: <span className="font-semibold">${totalCustomSplit.toFixed(2)}</span> / ${parseFloat(amount) || 0}
                    {Math.abs(totalCustomSplit - (parseFloat(amount) || 0)) > 0.01 && (
                      <span className="text-red-600 ml-2">(Doesn't match total amount)</span>
                    )}
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:from-green-600 hover:to-blue-600 transition-all duration-200 font-medium"
            >
              Add Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}