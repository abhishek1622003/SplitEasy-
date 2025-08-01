import React from 'react';
import { ArrowRight, DollarSign } from 'lucide-react';
import { calculateBalances, calculateSettlements } from '../utils/calculations';

export function BalancesView({ expenses, friends }) {
  const balances = calculateBalances(expenses, friends);
  const settlements = calculateSettlements(balances);

  const positiveBalances = balances.filter(b => b.amount > 0);
  const negativeBalances = balances.filter(b => b.amount < 0);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Overview */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Balances Overview</h2>
        
        {balances.length === 0 ? (
          <div className="text-center py-8">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No balances to show</p>
            <p className="text-sm text-gray-400">Add some expenses to see who owes what</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* You owe */}
            <div>
              <h3 className="text-lg font-semibold text-red-600 mb-3">You owe</h3>
              <div className="space-y-2">
                {negativeBalances.length === 0 ? (
                  <p className="text-gray-500">You don't owe anyone</p>
                ) : (
                  negativeBalances.map((balance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                      <span className="text-gray-700">{balance.to}</span>
                      <span className="font-semibold text-red-600">${Math.abs(balance.amount).toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* You are owed */}
            <div>
              <h3 className="text-lg font-semibold text-green-600 mb-3">You are owed</h3>
              <div className="space-y-2">
                {positiveBalances.length === 0 ? (
                  <p className="text-gray-500">No one owes you</p>
                ) : (
                  positiveBalances.map((balance, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-gray-700">{balance.from}</span>
                      <span className="font-semibold text-green-600">${balance.amount.toFixed(2)}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Settlement Suggestions */}
      {settlements.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Settlement Suggestions</h3>
          <p className="text-sm text-gray-600 mb-4">
            Here's the most efficient way to settle all debts:
          </p>
          <div className="space-y-3">
            {settlements.map((settlement, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="font-medium text-gray-900">{settlement.from}</span>
                  <ArrowRight className="w-4 h-4 text-gray-500" />
                  <span className="font-medium text-gray-900">{settlement.to}</span>
                </div>
                <span className="font-semibold text-blue-600">${settlement.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Balances Detail */}
      {balances.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detailed Balances</h3>
          <div className="space-y-2">
            {balances.map((balance, index) => (
              <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                <div className="flex items-center space-x-3">
                  <span className="text-gray-700">{balance.from}</span>
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-700">{balance.to}</span>
                </div>
                <span className={`font-semibold ${balance.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  ${Math.abs(balance.amount).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}