import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { Package, AlertTriangle, ArrowUpRight, ArrowDownRight, RefreshCw, BarChart3 } from 'lucide-react';
import { Product, SaleRecord, Alert } from '../types';
import { formatCurrency, cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
  trend?: string;
  trendType?: 'up' | 'down';
  color: 'blue' | 'emerald' | 'amber' | 'rose';
}

function StatCard({ title, value, icon: Icon, trend, trendType, color }: StatCardProps) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600 border-blue-100",
    emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
    amber: "bg-amber-50 text-amber-600 border-amber-100",
    rose: "bg-rose-50 text-rose-600 border-rose-100"
  };

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm transition-all hover:shadow-md">
      <div className="flex items-center justify-between mb-4">
        <div className={cn("p-3 rounded-xl border", colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
        {trend && (
          <div className={cn(
            "flex items-center text-xs font-bold px-2 py-1 rounded-full",
            trendType === 'up' ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {trendType === 'up' ? <ArrowUpRight className="w-3 h-3 mr-1" /> : <ArrowDownRight className="w-3 h-3 mr-1" />}
            {trend}
          </div>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h3 className="text-2xl font-bold tracking-tight text-slate-900">{value}</h3>
      </div>
    </div>
  );
}

interface OverviewProps {
  products: Product[];
  sales: SaleRecord[];
  alerts: Alert[];
  onSync: () => Promise<void>;
}

export default function Overview({ products, sales, alerts, onSync }: OverviewProps) {
  const [syncing, setSyncing] = React.useState(false);

  const handleSyncClick = async () => {
    setSyncing(true);
    await onSync();
    setTimeout(() => setSyncing(false), 2000); // Visual feedback duration
  };

  // Aggregate data
  const totalStock = products.reduce((acc, p) => acc + p.currentStock, 0);
  const totalValue = products.reduce((acc, p) => acc + (p.currentStock * p.unitPrice), 0);
  const lowStockCount = products.filter(p => p.currentStock <= p.minStockThreshold).length;
  const recentSalesTotal = sales.slice(0, 10).reduce((acc, s) => acc + (s.quantity * s.priceAtSale), 0);

  // Chart data
  const categoryData = products.reduce((acc: any[], p) => {
    const existing = acc.find(item => item.name === p.category);
    if (existing) {
      existing.value += p.currentStock;
    } else {
      acc.push({ name: p.category, value: p.currentStock });
    }
    return acc;
  }, []);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">General Overview {syncing && <span className="ml-2 text-xs font-black text-blue-600 animate-pulse uppercase tracking-widest">Auditing System...</span>}</h1>
          <p className="text-slate-500 mt-1">Real-time metrics for your retail ecosystem.</p>
        </div>
        <button 
          onClick={handleSyncClick}
          disabled={syncing}
          className={cn(
            "flex items-center px-4 py-2 border rounded-lg text-sm font-semibold transition-all shadow-sm",
            syncing 
              ? "bg-blue-50 border-blue-200 text-blue-600 opacity-80" 
              : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
          )}
        >
          <RefreshCw className={cn("w-4 h-4 mr-2", syncing && "animate-spin")} />
          {syncing ? 'Syncing...' : 'Sync Data'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Stock Volume" 
          value={totalStock.toLocaleString()} 
          icon={Package} 
          trend="+5.2%" 
          trendType="up"
          color="blue"
        />
        <StatCard 
          title="Total Inventory Value" 
          value={formatCurrency(totalValue)} 
          icon={BarChart3} 
          trend="-2.1%" 
          trendType="down"
          color="emerald"
        />
        <StatCard 
          title="Low Stock Items" 
          value={lowStockCount} 
          icon={AlertTriangle} 
          trend="3 new" 
          trendType="up"
          color="amber"
        />
        <StatCard 
          title="Recent Revenue" 
          value={formatCurrency(recentSalesTotal)} 
          icon={ArrowUpRight} 
          trend="+12%" 
          trendType="up"
          color="rose"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">Category Distribution</h3>
            <p className="text-xs font-bold text-slate-400 uppercase">Stock Units by Category</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold">System Alerts</h3>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded">Live</span>
          </div>
          <div className="space-y-4 flex-1">
            {alerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 group transition-all hover:bg-white hover:border-slate-200">
                <div className={cn(
                  "mt-0.5 p-1.5 rounded-lg shrink-0",
                  alert.priority === 'high' ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
                )}>
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900 leading-tight mb-1">{alert.message}</p>
                  <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">
                    {new Date(alert.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-2 text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors uppercase tracking-widest text-center border-t border-slate-100 pt-6">
            View All Alerts
          </button>
        </div>
      </div>
    </div>
  );
}
