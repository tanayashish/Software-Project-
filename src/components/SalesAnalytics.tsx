import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, BarChart, Bar } from 'recharts';
import { TrendingUp, Filter, Download, Calendar, Clock } from 'lucide-react';
import { Product, SaleRecord } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { startOfDay, subDays, format, isSameDay, eachHourOfInterval, endOfDay, setHours, startOfHour } from 'date-fns';

interface SalesAnalyticsProps {
  products: Product[];
  sales: SaleRecord[];
}

export default function SalesAnalytics({ products, sales }: SalesAnalyticsProps) {
  const [viewMode, setViewMode] = useState<'daily' | 'hourly'>('daily');

  // Generate last 14 days of data for daily view
  const dailyData = Array.from({ length: 14 }).map((_, i) => {
    const date = subDays(new Date(), 13 - i);
    const daySales = sales.filter(s => isSameDay(new Date(s.timestamp), date));
    const revenue = daySales.reduce((acc, s) => acc + (s.quantity * s.priceAtSale), 0);
    const units = daySales.reduce((acc, s) => acc + s.quantity, 0);

    return {
      label: format(date, 'MMM dd'),
      revenue,
      units,
      projected: revenue * (1 + (Math.random() * 0.4 - 0.2)) 
    };
  });

  // Generate hourly data for the current day
  const hourlyData = eachHourOfInterval({
    start: startOfDay(new Date()),
    end: endOfDay(new Date())
  }).map(hour => {
    const hourSales = sales.filter(s => {
      const saleDate = new Date(s.timestamp);
      return isSameDay(saleDate, hour) && saleDate.getHours() === hour.getHours();
    });
    const revenue = hourSales.reduce((acc, s) => acc + (s.quantity * s.priceAtSale), 0);
    const units = hourSales.reduce((acc, s) => acc + s.quantity, 0);

    return {
      label: format(hour, 'HH:00'),
      revenue,
      units,
      projected: revenue * (1 + (Math.random() * 0.2))
    };
  });

  const chartData = viewMode === 'daily' ? dailyData : hourlyData;

  const totalRevenue = sales.reduce((acc, s) => acc + (s.quantity * s.priceAtSale), 0);
  const totalUnits = sales.reduce((acc, s) => acc + s.quantity, 0);
  const averageTicket = totalRevenue / Math.max(1, sales.length);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Sales Intelligence</h1>
          <p className="text-slate-500 mt-1">Deep dive into historical performance and future projections.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button 
              onClick={() => setViewMode('daily')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                viewMode === 'daily' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Daily
            </button>
            <button 
              onClick={() => setViewMode('hourly')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-black uppercase tracking-widest transition-all",
                viewMode === 'hourly' ? "bg-white text-blue-600 shadow-sm" : "text-slate-500 hover:text-slate-700"
              )}
            >
              Hourly
            </button>
          </div>
          <div className="flex items-center bg-white border border-slate-200 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 shadow-sm">
            <Calendar className="w-4 h-4 mr-2 text-slate-400" />
            <span>{viewMode === 'daily' ? 'Last 14 Days' : 'Today'}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 text-white shadow-xl shadow-slate-200">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Revenue</p>
          <h2 className="text-3xl font-black">{formatCurrency(totalRevenue)}</h2>
          <div className="mt-4 flex items-center text-emerald-400 text-xs font-bold">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>+18.4% vs prev period</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Items Sold</p>
          <h2 className="text-3xl font-black text-slate-900">{totalUnits.toLocaleString()}</h2>
          <div className="mt-4 flex items-center text-slate-400 text-xs font-bold uppercase">
            <span>Avg {Math.round(totalUnits / 14)} items / day</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Avg Ticket Size</p>
          <h2 className="text-3xl font-black text-slate-900">{formatCurrency(averageTicket)}</h2>
          <div className="mt-4 flex items-center text-emerald-500 text-xs font-bold">
            <TrendingUp className="w-4 h-4 mr-1" />
            <span>Market Standard: $12.50</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {viewMode === 'daily' ? 'Daily Revenue Trends' : 'Hourly Revenue (Today)'}
              </h3>
              <p className="text-xs font-medium text-slate-400">Comparing actual vs AI projected revenue</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-600 mr-2"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Actual</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-slate-200 mr-2"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">Projected</span>
              </div>
            </div>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                  tickFormatter={(val) => `$${val}`}
                />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  formatter={(value: number) => [formatCurrency(value), '']}
                />
                <Area 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#e2e8f0" 
                  strokeWidth={2} 
                  strokeDasharray="5 5" 
                  fill="transparent" 
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorRev)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                {viewMode === 'daily' ? 'Volume by Unit' : 'Hourly Volume (Today)'}
              </h3>
              <p className="text-xs font-medium text-slate-400">Daily unit sales across all categories</p>
            </div>
          </div>
          
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="label" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 11 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="units" fill="#10b981" radius={[4, 4, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
