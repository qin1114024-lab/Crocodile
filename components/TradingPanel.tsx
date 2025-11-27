import React, { useState } from 'react';
import { TransactionType, StockData } from '../types';

interface Props {
  symbol: string;
  quote: StockData | null;
  onOrder: (type: TransactionType, shares: number, price: number) => void;
  isLoading: boolean;
}

const TradingPanel: React.FC<Props> = ({ symbol, quote, onOrder, isLoading }) => {
  const [shares, setShares] = useState<number>(1);
  const [mode, setMode] = useState<TransactionType>(TransactionType.BUY);

  const price = quote?.c || 0;
  const total = price * shares;

  const handleSubmit = () => {
    if (price > 0 && shares > 0) {
      onOrder(mode, shares, price);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-bold text-slate-800">下單交易</h3>
        <span className={`px-2 py-1 rounded text-xs font-bold ${isLoading ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
          {isLoading ? '連線中...' : '系統就緒'}
        </span>
      </div>

      <div className="flex bg-slate-100 rounded-lg p-1 mb-6">
        <button
          onClick={() => setMode(TransactionType.BUY)}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === TransactionType.BUY ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          買入
        </button>
        <button
          onClick={() => setMode(TransactionType.SELL)}
          className={`flex-1 py-2 rounded-md text-sm font-bold transition-all ${mode === TransactionType.SELL ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
        >
          賣出
        </button>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">標的代號</label>
          <div className="text-xl font-bold text-slate-800">{symbol}</div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">成交價格 (Ask/Bid)</label>
          <div className="flex items-center">
            <span className="text-slate-400 mr-2">$</span>
            <input 
              type="number" 
              value={price} 
              disabled 
              className="w-full bg-slate-50 border border-slate-200 rounded px-3 py-2 font-mono text-slate-700 cursor-not-allowed"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">交易股數</label>
          <input 
            type="number" 
            min="1"
            value={shares}
            onChange={(e) => setShares(parseInt(e.target.value) || 0)}
            className="w-full bg-white border border-slate-300 rounded px-3 py-2 font-mono text-slate-800 focus:ring-2 focus:ring-accent focus:border-accent outline-none transition-all"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 mt-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-slate-500">預估總額</span>
            <span className="text-xl font-bold text-slate-800">${total.toLocaleString(undefined, {maximumFractionDigits: 2})}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleSubmit}
        disabled={isLoading || price === 0}
        className={`w-full py-3 rounded-lg text-white font-bold text-lg mt-6 shadow-md transition-transform active:scale-95 ${
          mode === TransactionType.BUY 
            ? 'bg-up hover:bg-red-600 shadow-red-200' 
            : 'bg-down hover:bg-green-600 shadow-green-200'
        }`}
      >
        確認{mode === TransactionType.BUY ? '買進' : '賣出'}
      </button>
    </div>
  );
};

export default TradingPanel;
