import React from 'react';
import { useParams } from 'react-router-dom';

const Transactions = () => {
  const { transactionType } = useParams();

  return (
    <div>
      {transactionType === 'Deposits' && (
        <h1>Deposits</h1>
        // Render deposits content
      )}
      {transactionType === 'Withdrawals' && (
        <h1>Withdrawals</h1>
        // Render withdrawals content
      )}
      {(!transactionType) && (
        <h1>All Transactions</h1>
        // Render general transactions content
      )}
    </div>
  );
};

export default Transactions;
