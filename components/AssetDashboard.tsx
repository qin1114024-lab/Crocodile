import React from 'react';
import { Asset } from '../types';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';

interface Props {
  assets: Asset[];
  totalValue: number;
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

const AssetDashboard: React.FC<Props> = ({ assets, totalValue }) => {
  
  const data = assets.map(a => ({
    name: a.symbol,
    value: a.shares * a.avgPrice
  }));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {/* Total Value Card */}
      <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <h3 className="text-slate-400 text-sm font-medium mb-1">總資產估值</h3>
        <div className="text-4xl font-bold mb-4 tracking-tight">
          ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </div>
        <div className="flex space-x-4 text-sm text-slate-300">
          <div>
            <span className="block text-xs text-slate-500">持倉數量</span>
            <span className="font-semibold">{assets.length} 檔標的</span>
          </div>
          <div>
            <span className="block text-xs text-slate-500">現金水位 (模擬)</span>
            <span className="font-semibold">$10,000.00</span>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 flex flex-col items-center justify-center">
        <h3 className="text-slate-800 font-bold mb-2 self-start">資產配置分佈</h3>
        {assets.length > 0 ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip formatter={(val: number) => `$${val.toLocaleString()}`} />
                <Legend verticalAlign="middle" align="right" layout="vertical" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-48 flex items-center justify-center text-slate-400 text-sm">
            尚無持倉數據
          </div>
        )}
      </div>
    </div>
  );
};

export default AssetDashboard;
