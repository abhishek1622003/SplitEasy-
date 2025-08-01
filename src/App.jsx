import React, { useState } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { ExpenseForm } from './components/ExpenseForm';
import { FriendsList } from './components/FriendsList';
import { BalancesView } from './components/BalancesView';
import { ExpenseHistory } from './components/ExpenseHistory';
import { useExpenses } from './hooks/useExpenses';
import { useFriends } from './hooks/useFriends';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const { expenses, addExpense, deleteExpense } = useExpenses();
  const { friends, addFriend, deleteFriend } = useFriends();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard expenses={expenses} friends={friends} onViewChange={setCurrentView} />;
      case 'add-expense':
        return <ExpenseForm friends={friends} onAddExpense={addExpense} onCancel={() => setCurrentView('dashboard')} />;
      case 'friends':
        return <FriendsList friends={friends} onAddFriend={addFriend} onDeleteFriend={deleteFriend} />;
      case 'balances':
        return <BalancesView expenses={expenses} friends={friends} />;
      case 'history':
        return <ExpenseHistory expenses={expenses} friends={friends} onDeleteExpense={deleteExpense} />;
      default:
        return <Dashboard expenses={expenses} friends={friends} onViewChange={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      <main className="max-w-6xl mx-auto px-4 py-6">
        {renderView()}
      </main>
    </div>
  );
}

export default App;