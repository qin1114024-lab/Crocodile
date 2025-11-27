import { Transaction, Asset, TransactionType } from '../types';

const STORAGE_KEY_TX = 'alphatrade_transactions';
const STORAGE_KEY_ASSETS = 'alphatrade_assets';

// Initialize with some data if empty
const initMockData = () => {
  if (!localStorage.getItem(STORAGE_KEY_TX)) {
    const mockTx: Transaction[] = [
      { id: '1', symbol: 'AAPL', type: TransactionType.BUY, shares: 10, price: 150, total: 1500, date: '2023-10-01' },
      { id: '2', symbol: 'TSLA', type: TransactionType.BUY, shares: 5, price: 200, total: 1000, date: '2023-10-05' },
    ];
    localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(mockTx));
  }
  if (!localStorage.getItem(STORAGE_KEY_ASSETS)) {
    const mockAssets: Asset[] = [
      { symbol: 'AAPL', shares: 10, avgPrice: 150 },
      { symbol: 'TSLA', shares: 5, avgPrice: 200 },
    ];
    localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(mockAssets));
  }
};

export const getTransactions = (): Transaction[] => {
  initMockData();
  const data = localStorage.getItem(STORAGE_KEY_TX);
  return data ? JSON.parse(data) : [];
};

export const getAssets = (): Asset[] => {
  initMockData();
  const data = localStorage.getItem(STORAGE_KEY_ASSETS);
  return data ? JSON.parse(data) : [];
};

export const addTransaction = (tx: Transaction) => {
  const transactions = getTransactions();
  const assets = getAssets();
  
  // Update History
  transactions.unshift(tx);
  localStorage.setItem(STORAGE_KEY_TX, JSON.stringify(transactions));

  // Update Portfolio Logic
  const existingAssetIndex = assets.findIndex(a => a.symbol === tx.symbol);
  
  if (tx.type === TransactionType.BUY) {
    if (existingAssetIndex >= 0) {
      const asset = assets[existingAssetIndex];
      const newTotalValue = (asset.shares * asset.avgPrice) + (tx.shares * tx.price);
      const newTotalShares = asset.shares + tx.shares;
      assets[existingAssetIndex] = {
        ...asset,
        shares: newTotalShares,
        avgPrice: newTotalValue / newTotalShares
      };
    } else {
      assets.push({ symbol: tx.symbol, shares: tx.shares, avgPrice: tx.price });
    }
  } else {
    // SELL
    if (existingAssetIndex >= 0) {
      assets[existingAssetIndex].shares -= tx.shares;
      if (assets[existingAssetIndex].shares <= 0) {
        assets.splice(existingAssetIndex, 1);
      }
    }
  }
  
  localStorage.setItem(STORAGE_KEY_ASSETS, JSON.stringify(assets));
  return { transactions, assets };
};
