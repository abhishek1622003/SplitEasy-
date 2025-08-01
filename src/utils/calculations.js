export function calculateBalances(expenses, friends) {
  const allPeople = ['You', ...friends.map(f => f.name)];
  const balances = {};

  // Initialize balance matrix
  allPeople.forEach(person => {
    balances[person] = {};
    allPeople.forEach(otherPerson => {
      if (person !== otherPerson) {
        balances[person][otherPerson] = 0;
      }
    });
  });

  // Calculate balances from expenses
  expenses.forEach(expense => {
    const { paidBy, splits } = expense;
    
    Object.entries(splits).forEach(([person, amount]) => {
      if (person !== paidBy && amount > 0) {
        balances[person][paidBy] += amount;
      }
    });
  });

  // Simplify balances (net out mutual debts)
  const simplifiedBalances = [];
  
  allPeople.forEach(person1 => {
    allPeople.forEach(person2 => {
      if (person1 !== person2) {
        const debt1to2 = balances[person1][person2] || 0;
        const debt2to1 = balances[person2][person1] || 0;
        
        if (debt1to2 > debt2to1) {
          const netDebt = debt1to2 - debt2to1;
          if (netDebt > 0.01) { // Only include significant amounts
            simplifiedBalances.push({
              from: person1,
              to: person2,
              amount: -netDebt // Negative because person1 owes person2
            });
          }
        }
      }
    });
  });

  // Filter to only show balances involving "You"
  return simplifiedBalances.filter(balance => 
    balance.from === 'You' || balance.to === 'You'
  );
}

export function calculateSettlements(balances) {
  // Create a map of net balances for each person
  const netBalances = {};
  
  balances.forEach(balance => {
    if (!netBalances[balance.from]) netBalances[balance.from] = 0;
    if (!netBalances[balance.to]) netBalances[balance.to] = 0;
    
    netBalances[balance.from] += balance.amount;
    netBalances[balance.to] -= balance.amount;
  });

  // Separate creditors (positive balance) and debtors (negative balance)
  const creditors = Object.entries(netBalances).filter(([_, amount]) => amount > 0.01);
  const debtors = Object.entries(netBalances).filter(([_, amount]) => amount < -0.01);

  const settlements = [];

  // Simple settlement algorithm
  let debtorIndex = 0;
  let creditorIndex = 0;

  while (debtorIndex < debtors.length && creditorIndex < creditors.length) {
    const [debtorName, debtorAmount] = debtors[debtorIndex];
    const [creditorName, creditorAmount] = creditors[creditorIndex];

    const settlementAmount = Math.min(Math.abs(debtorAmount), creditorAmount);

    if (settlementAmount > 0.01) {
      settlements.push({
        from: debtorName,
        to: creditorName,
        amount: settlementAmount
      });
    }

    // Update amounts
    debtors[debtorIndex][1] += settlementAmount;
    creditors[creditorIndex][1] -= settlementAmount;

    // Move to next debtor/creditor if current one is settled
    if (Math.abs(debtors[debtorIndex][1]) < 0.01) {
      debtorIndex++;
    }
    if (Math.abs(creditors[creditorIndex][1]) < 0.01) {
      creditorIndex++;
    }
  }

  return settlements;
}