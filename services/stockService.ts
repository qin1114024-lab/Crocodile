import { StockData, CandleData, TimeRange } from '../types';
import { generateMockCandles, generateMockStockData } from './mockData';

const API_KEY = process.env.VITE_FINNHUB_API_KEY;

export const isRealStockMode = (): boolean => {
  return !!API_KEY && API_KEY.length > 0;
};

export const fetchQuote = async (symbol: string): Promise<StockData> => {
  if (!isRealStockMode()) {
    console.log(`[System] Mock Quote for ${symbol}`);
    return new Promise(resolve => setTimeout(() => resolve(generateMockStockData(symbol)), 500));
  }

  try {
    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${API_KEY}`);
    const data = await response.json();
    if (!data.c) throw new Error("No data");
    return data;
  } catch (error) {
    console.warn("API Error, falling back to mock", error);
    return generateMockStockData(symbol);
  }
};

export const fetchCandles = async (symbol: string, range: TimeRange): Promise<CandleData[]> => {
  if (!isRealStockMode()) {
    console.log(`[System] Mock Candles for ${symbol} (${range})`);
    const count = range === '1D' ? 24 : range === '1M' ? 30 : 252;
    return new Promise(resolve => setTimeout(() => resolve(generateMockCandles(count)), 600));
  }

  // Real API implementation mapping would go here
  // For simplicity in this demo, strictly mapping '1Y' (Daily resolution)
  // Finnhub free tier has limits, so we handle basic daily candles
  try {
    const to = Math.floor(Date.now() / 1000);
    const from = to - (range === '1Y' ? 31536000 : range === '1M' ? 2592000 : 86400);
    const resolution = 'D';
    
    const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol}&resolution=${resolution}&from=${from}&to=${to}&token=${API_KEY}`);
    const data = await response.json();

    if (data.s === 'ok') {
      return data.t.map((timestamp: number, index: number) => ({
        time: new Date(timestamp * 1000).toISOString().split('T')[0],
        open: data.o[index],
        high: data.h[index],
        low: data.l[index],
        close: data.c[index],
        volume: data.v[index]
      }));
    }
    throw new Error("Invalid API response");
  } catch (error) {
    console.warn("API Error, falling back to mock", error);
    return generateMockCandles(30);
  }
};