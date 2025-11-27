import React, { useState, useEffect, useCallback } from 'react';
import { 
  fetchQuote, 
  fetchCandles, 
  isRealStockMode 
} from './services/stockService';
import { getMarketAnalysis, isRealAIMode } from './services/geminiService';
import { 
  getTransactions, 
  getAssets, 
  addTransaction 
} from './services/portfolioService';
import { 
  StockData, 
  CandleData, 
  Transaction, 
  Asset, 
  TransactionType, 
  TimeRange 
} from './types';

import TradingChart from './components/TradingChart';
import AssetDashboard from './components/AssetDashboard';
import TradingPanel from './components/TradingPanel';
import EducationPanel from './components/EducationPanel';

const App: React.FC = () => {
  // State
  const [symbol, setSymbol] = useState<string>('AAPL');
  const [searchQuery, setSearchQuery] = useState<string>('AAPL');
  const [quote, setQuote] = useState<StockData | null>(null);
  const [candles, setCandles] = useState<CandleData[]>([]);
  const [timeRange, setTimeRange] = useState<TimeRange>('1M');
  const [assets, setAssets] = useState<Asset[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // System Status
  const status = {
    realStock: isRealStockMode(),
    realAI: isRealAIMode()
  };

  // Initial Data Load
  useEffect(() => {
    refreshPortfolio();
    handleSearch(); // Load default symbol
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const refreshPortfolio = () => {
    setAssets(getAssets());
    setTransactions(getTransactions());
  };

  const handleSearch = useCallback(async () => {
    setIsLoading(true);
    setAiAnalysis(''); 
    
    try {
      // Parallel fetch
      const [quoteData, candleData] = await Promise.all([
        fetchQuote(searchQuery),
        fetchCandles(searchQuery, timeRange)
      ]);
      
      setQuote(quoteData);
      setCandles(candleData);
      setSymbol(searchQuery.toUpperCase());

      // Trigger AI Analysis
      handleAnalyze(searchQuery, quoteData);

    } catch (error) {
      console.error("Failed to fetch data", error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, timeRange]);

  const handleAnalyze = async (sym: string, q: StockData) => {
    setIsAiLoading(true);
    const analysis = await getMarketAnalysis(sym, q.c, q.dp);
    setAiAnalysis(analysis);
    setIsAiLoading(false);
  };

  const handleOrder = (type: TransactionType, shares: number, price: number) => {
    const tx: Transaction = {
      id: Date.now().toString(),
      symbol: symbol,
      type,
      shares,
      price,
      total: shares * price,
      date: new Date().toISOString()
    };
    
    addTransaction(tx);
    refreshPortfolio();
    alert(`交易成功！\n${type === TransactionType.BUY ? '買入' : '賣出'} ${symbol} ${shares} 股`);
  };

  const calculateTotalValue = () => {
    return assets.reduce((acc, curr) => {
      // Use current quote if available for this symbol, else avgPrice (simplified)
      const currentPrice = (curr.symbol === symbol && quote) ? quote.c : curr.avgPrice;
      return acc + (curr.shares * currentPrice);
    }, 0);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">α</span>
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800">AlphaTrade <span className="text-slate-400 font-normal">Pro</span></h1>
          </div>
          
          <div className="flex space-x-4 text-xs font-mono">
            <span className={`flex items-center ${status.realStock ? 'text-green-600' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full mr-1 ${status.realStock ? 'bg-green-500' : 'bg-slate-300'}`}></span>
              {status.realStock ? 'LIVE DATA' : 'MOCK DATA'}
            </span>
            <span className={`flex items-center ${status.realAI ? 'text-purple-600' : 'text-slate-400'}`}>
              <span className={`w-2 h-2 rounded-full mr-1 ${status.realAI ? 'bg-purple-500' : 'bg-slate-300'}`}></span>
              {status.realAI ? 'GEMINI AI' : 'MOCK AI'}
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Asset Dashboard */}
        <AssetDashboard assets={assets} totalValue={calculateTotalValue()} />

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Chart & Analysis (2/3 width) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Search & Toolbar */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center justify-between">
              <div className="flex space-x-2">
                <input 
                  type="text" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                  className="bg-slate-50 border border-slate-300 rounded-lg px-4 py-2 text-sm font-bold w-32 focus:ring-2 focus:ring-accent outline-none"
                  placeholder="AAPL"
                />
                <button 
                  onClick={handleSearch}
                  disabled={isLoading}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-700 disabled:opacity-50"
                >
                  {isLoading ? '載入中...' : '查詢報價'}
                </button>
              </div>

              <div className="flex bg-slate-100 rounded-lg p-1">
                {(['1D', '1M', '1Y'] as TimeRange[]).map((range) => (
                  <button
                    key={range}
                    onClick={() => { setTimeRange(range); handleSearch(); }}
                    className={`px-3 py-1 text-xs font-bold rounded-md transition-all ${timeRange === range ? 'bg-white shadow-sm text-slate-800' : 'text-slate-500'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            {/* Quote Summary */}
            {quote && (
              <div className="flex items-end space-x-4 px-2">
                <h2 className="text-4xl font-bold text-slate-900">{symbol}</h2>
                <div className={`text-2xl font-bold flex items-center ${quote.d >= 0 ? 'text-up' : 'text-down'}`}>
                  ${quote.c.toFixed(2)}
                  <span className="text-sm ml-2 px-2 py-0.5 bg-slate-100 rounded-full">
                    {quote.d > 0 ? '+' : ''}{quote.d.toFixed(2)} ({quote.dp.toFixed(2)}%)
                  </span>
                </div>
              </div>
            )}

            {/* Chart */}
            <TradingChart data={candles} />

            {/* Gemini AI Analysis */}
            <div className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-xl border border-slate-200 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 opacity-10">
                <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"/><path d="M12 6a1 1 0 0 0-1 1v4.59l-3.29-3.3a1 1 0 0 0-1.42 1.42l5 5a1 1 0 0 0 1.42 0l5-5a1 1 0 0 0-1.42-1.42L13 11.59V7a1 1 0 0 0-1-1z"/></svg>
              </div>
              <h3 className="flex items-center text-lg font-bold text-slate-800 mb-3">
                <span className="mr-2">✨</span> Gemini 智能投顧分析
              </h3>
              {isAiLoading ? (
                <div className="animate-pulse space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  <div className="h-4 bg-slate-200 rounded w-full"></div>
                </div>
              ) : (
                <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-wrap">
                  {aiAnalysis}
                </p>
              )}
            </div>
            
            {/* Education Panel */}
            <EducationPanel />

          </div>

          {/* Right Column: Trading & History (1/3 width) */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Trading Panel */}
            <div className="sticky top-24">
              <TradingPanel 
                symbol={symbol} 
                quote={quote} 
                onOrder={handleOrder}
                isLoading={isLoading}
              />

              {/* Transaction History Mini Table */}
              <div className="mt-8">
                <h3 className="text-slate-800 font-bold mb-4">近期交易紀錄</h3>
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-4 py-2">標的</th>
                        <th className="px-4 py-2">買賣</th>
                        <th className="px-4 py-2 text-right">價格</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {transactions.slice(0, 5).map(tx => (
                        <tr key={tx.id} className="hover:bg-slate-50">
                          <td className="px-4 py-3 font-bold">{tx.symbol}</td>
                          <td className="px-4 py-3">
                            <span className={`px-1.5 py-0.5 rounded ${tx.type === 'BUY' ? 'bg-red-100 text-up' : 'bg-green-100 text-down'}`}>
                              {tx.type === 'BUY' ? '買進' : '賣出'}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right font-mono">${tx.price}</td>
                        </tr>
                      ))}
                      {transactions.length === 0 && (
                        <tr>
                          <td colSpan={3} className="px-4 py-4 text-center text-slate-400">尚無交易紀錄</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
