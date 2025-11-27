import React from 'react';

const EducationPanel: React.FC = () => {
  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm mt-8">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200">
        <h3 className="font-bold text-slate-800">投資新手村：交易系統基本常識</h3>
      </div>
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h4 className="font-bold text-accent mb-2">1. 如何看懂 K 線圖 (Candlestick)</h4>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start">
              <span className="mr-2 text-up">●</span>
              <span><strong>紅 K (陽線)：</strong> 收盤價 > 開盤價。代表買方力道強，價格上漲。實體下緣為開盤，上緣為收盤。</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-down">●</span>
              <span><strong>綠 K (陰線)：</strong> 收盤價 &lt; 開盤價。代表賣方力道強，價格下跌。實體上緣為開盤，下緣為收盤。</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2 text-slate-400">●</span>
              <span><strong>影線 (Wick)：</strong> K 線上下突出的細線，代表當日曾經到達的最高價與最低價。</span>
            </li>
          </ul>
        </div>
        <div>
          <h4 className="font-bold text-accent mb-2">2. 成交量與趨勢判讀</h4>
          <p className="text-sm text-slate-600 leading-relaxed">
            成交量 (Volume) 是價格的先行指標。「量增價漲」通常視為健康的多頭趨勢；「量縮價跌」則可能代表賣壓不重。
            若股價創新高但成交量未跟上 (量價背離)，需小心反轉風險。
            本系統的下方長條圖即代表每日成交量。
          </p>
        </div>
      </div>
    </div>
  );
};

export default EducationPanel;
