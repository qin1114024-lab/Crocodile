import { CandleData, StockData } from '../types';

export const generateMockStockData = (symbol: string): StockData => {
  const basePrice = Math.random() * 100 + 100;
  return {
    c: basePrice,
    d: basePrice * 0.02,
    dp: 2.1,
    h: basePrice * 1.05,
    l: basePrice * 0.95,
    o: basePrice * 0.98,
    pc: basePrice * 0.96
  };
};

export const generateMockCandles = (count: number): CandleData[] => {
  let price = 150;
  const data: CandleData[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = new Date(now);
    date.setDate(date.getDate() - (count - i));
    
    const volatility = price * 0.02;
    const change = (Math.random() - 0.5) * volatility;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * volatility * 0.5;
    const low = Math.min(open, close) - Math.random() * volatility * 0.5;
    const volume = Math.floor(Math.random() * 1000000) + 500000;

    data.push({
      time: date.toISOString().split('T')[0],
      open,
      high,
      low,
      close,
      volume
    });

    price = close;
  }
  return data;
};

export const MOCK_AI_RESPONSE = `[模擬模式分析]
關於此標的之技術面分析：
1. 目前股價呈現多頭排列，均線向上發散，顯示買盤力道強勁。
2. K值雖處於高檔，但鈍化後仍有機會續攻，建議觀察成交量是否持續放大。

投資建議：
建議採取分批佈局策略，若拉回五日線不破可視為買點。長期持有者可續抱，短線操作者請嚴設停損點。

(請注意：此為模擬生成的建議，非真實AI運算結果。)`;
