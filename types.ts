export enum TransactionType {
  BUY = 'BUY',
  SELL = 'SELL'
}

export interface StockData {
  c: number; // Current price
  d: number; // Change
  dp: number; // Percent change
  h: number; // High price of the day
  l: number; // Low price of the day
  o: number; // Open price of the day
  pc: number; // Previous close price
}

export interface CandleData {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface Transaction {
  id: string;
  symbol: string;
  type: TransactionType;
  shares: number;
  price: number;
  total: number;
  date: string;
}

export interface Asset {
  symbol: string;
  shares: number;
  avgPrice: number;
}

export type TimeRange = '1D' | '1M' | '1Y';

// Helper for Mock Mode status
export interface SystemStatus {
  isRealData: boolean;
  isRealAI: boolean;
}