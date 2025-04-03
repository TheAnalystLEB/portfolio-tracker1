
import { useState, useEffect } from 'react';
import './App.css';

const portfolioData = {
  startingBalance: 100000,
  trades: [
    { date: '2025-03-01', asset: 'BTC', type: 'buy', quantity: 0.5, price: 30000 },
    { date: '2025-03-10', asset: 'ETH', type: 'buy', quantity: 2, price: 3200 },
    { date: '2025-03-20', asset: 'BTC', type: 'sell', quantity: 0.1, price: 35000 },
  ],
  currentPrices: {
    BTC: 36000,
    ETH: 3400,
  },
};

function calculateHoldings(trades) {
  const holdings = {};
  trades.forEach(({ asset, type, quantity }) => {
    if (!holdings[asset]) holdings[asset] = 0;
    holdings[asset] += type === 'buy' ? quantity : -quantity;
  });
  return holdings;
}

function calculatePnL(trades, prices) {
  const pnl = {};
  const costs = {};
  const quantities = {};

  trades.forEach(({ asset, type, quantity, price }) => {
    if (!quantities[asset]) quantities[asset] = 0;
    if (!costs[asset]) costs[asset] = 0;

    if (type === 'buy') {
      costs[asset] += quantity * price;
      quantities[asset] += quantity;
    } else {
      costs[asset] -= (costs[asset] / quantities[asset]) * quantity;
      quantities[asset] -= quantity;
    }
  });

  Object.keys(prices).forEach(asset => {
    const quantity = quantities[asset] || 0;
    const avgCost = quantity ? costs[asset] / quantity : 0;
    const marketValue = quantity * prices[asset];
    const invested = quantity * avgCost;
    pnl[asset] = marketValue - invested;
  });

  return pnl;
}

function App() {
  const holdings = calculateHoldings(portfolioData.trades);
  const pnl = calculatePnL(portfolioData.trades, portfolioData.currentPrices);

  return (
    <div className="container">
      <h1>📈 Portfolio Tracker</h1>
      <div className="card">
        <p><strong>Starting Balance:</strong> ${portfolioData.startingBalance.toLocaleString()}</p>
      </div>

      <div className="card">
        <h2>💼 Current Holdings</h2>
        <table>
          <thead>
            <tr><th>Asset</th><th>Quantity</th><th>Price</th><th>PnL</th></tr>
          </thead>
          <tbody>
            {Object.entries(holdings).map(([asset, qty]) => (
              <tr key={asset}>
                <td>{asset}</td>
                <td>{qty}</td>
                <td>${portfolioData.currentPrices[asset]}</td>
                <td className={pnl[asset] >= 0 ? 'green' : 'red'}>
                  {pnl[asset].toFixed(2)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="card">
        <h2>📜 Trade History</h2>
        <ul>
          {portfolioData.trades.map((t, index) => (
            <li key={index}>{t.date} - {t.type.toUpperCase()} {t.quantity} {t.asset} @ ${t.price}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
