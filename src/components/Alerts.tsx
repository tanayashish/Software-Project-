import React from 'react';
import { Bell, Trash2, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { Alert } from '../types';
import { cn } from '../lib/utils';

interface AlertsProps {
  alerts: Alert[];
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
}

export default function Alerts({ alerts, onMarkAsRead, onClearAll }: AlertsProps) {
  const unreadCount = alerts.filter(a => !a.read).length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">System Alerts</h1>
          <p className="text-slate-500 mt-1">Manage notifications and stock level warnings.</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button 
            onClick={onClearAll}
            className="flex items-center px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-rose-600 shadow-sm hover:bg-rose-50 hover:border-rose-100 transition-colors"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Unread Alerts</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-slate-900">{unreadCount}</h2>
            <Bell className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">High Priority</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-rose-600">
              {alerts.filter(a => a.priority === 'high' && !a.read).length}
            </h2>
            <AlertCircle className="w-8 h-8 text-rose-500" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Resolved Today</p>
          <div className="flex items-center justify-between">
            <h2 className="text-3xl font-black text-emerald-600">14</h2>
            <CheckCircle2 className="w-8 h-8 text-emerald-500" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[400px]">
        {alerts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-96 text-center">
            <div className="p-4 bg-slate-50 rounded-full text-slate-300 mb-4">
              <Bell className="w-12 h-12" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">All caught up!</h3>
            <p className="text-sm text-slate-500">No new notifications to review.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {alerts.map((alert) => (
              <div 
                key={alert.id} 
                className={cn(
                  "p-6 flex items-start gap-6 transition-colors",
                  alert.read ? "opacity-60" : "bg-blue-50/10 hover:bg-white"
                )}
              >
                <div className={cn(
                  "p-2.5 rounded-xl shrink-0 border",
                  alert.type === 'out_of_stock' ? "bg-rose-50 text-rose-600 border-rose-100" :
                  alert.type === 'low_stock' ? "bg-amber-50 text-amber-600 border-amber-100" :
                  "bg-blue-50 text-blue-600 border-blue-100"
                )}>
                  {alert.priority === 'high' ? <AlertCircle className="w-5 h-5" /> : <Bell className="w-5 h-5" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className={cn("font-bold text-slate-900", alert.read ? "font-semibold" : "font-black")}>
                      {alert.type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')} Warning
                    </h4>
                    <span className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(alert.timestamp).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">{alert.message}</p>
                  
                  {!alert.read && (
                    <div className="mt-4 flex items-center space-x-3">
                      <button 
                        onClick={() => onMarkAsRead(alert.id)}
                        className="text-[10px] font-bold text-blue-600 uppercase tracking-widest hover:text-blue-700 underline underline-offset-4"
                      >
                        Mark as read
                      </button>
                      <span className="text-slate-200">|</span>
                      <button className="text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600">
                        View Details
                      </button>
                    </div>
                  )}
                </div>

                <div className={cn(
                  "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                  alert.priority === 'high' ? "bg-rose-100 text-rose-600" : 
                  alert.priority === 'medium' ? "bg-amber-100 text-amber-600" : 
                  "bg-slate-100 text-slate-600"
                )}>
                  {alert.priority}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
