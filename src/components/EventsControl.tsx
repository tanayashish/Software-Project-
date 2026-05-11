import React, { useState } from 'react';
import { Zap, CloudRain, Sun, Thermometer, Wind, Snowflake, Calendar, AlertTriangle, Plus, X, Store as StoreIcon } from 'lucide-react';
import { SimulationEvent, Weather, Store } from '../types';
import { cn, formatDate } from '../lib/utils';
import { addEvent, deleteEvent } from '../services/store';

const WEATHERS: Weather[] = [
  { type: 'sunny', icon: '☀️', label: 'Sunny', multipliers: { Beverages: 1.3, Produce: 1.1 }, hasDelay: false },
  { type: 'rainy', icon: '🌧️', label: 'Rainy', multipliers: { Bakery: 1.4, Beverages: 0.8 }, hasDelay: false },
  { type: 'heatwave', icon: '🔥', label: 'Heatwave', multipliers: { Beverages: 2.0, Dairy: 1.3 }, hasDelay: false },
  { type: 'storm', icon: '⛈️', label: 'Storm', multipliers: { Staples: 1.8, Bakery: 1.5, Beverages: 0.6 }, hasDelay: true },
  { type: 'cold', icon: '❄️', label: 'Cold', multipliers: { Dairy: 1.2, Pantry: 1.3 }, hasDelay: true },
];

interface EventsControlProps {
  events: SimulationEvent[];
  stores: Store[];
  currentWeather: Weather;
  onWeatherChange: (w: Weather) => void;
}

export default function EventsControl({ events, stores, currentWeather, onWeatherChange }: EventsControlProps) {
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [newEvent, setNewEvent] = useState<Omit<SimulationEvent, 'id'>>({
    type: 'flashsale',
    label: '',
    storeId: 'all',
    endsAt: new Date(Date.now() + 86400000).toISOString()
  });

  const handleCreateEvent = async () => {
    if (!newEvent.label) return;
    await addEvent(newEvent);
    setShowAddEvent(false);
    setNewEvent({
      type: 'flashsale',
      label: '',
      storeId: 'all',
      endsAt: new Date(Date.now() + 86400000).toISOString()
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <section>
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
            <Zap className="w-5 h-5 font-bold" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Active Simulation Events</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => setShowAddEvent(true)}
            className="flex flex-col items-center justify-center p-8 border-4 border-dashed border-slate-100 rounded-[40px] text-slate-400 hover:border-blue-100 hover:text-blue-500 transition-all group"
          >
            <div className="p-4 bg-slate-50 text-slate-400 rounded-3xl group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors mb-4">
              <Plus className="w-8 h-8 font-black" />
            </div>
            <div className="font-black text-lg">Spawn Event</div>
            <div className="text-sm font-medium mt-1">Impact simulation demand</div>
          </button>

          {events.map((e) => (
            <div key={e.id} className="relative p-8 bg-white border border-slate-100 rounded-[40px] shadow-sm hover:shadow-md transition-all">
              <button 
                onClick={() => deleteEvent(e.id)}
                className="absolute top-6 right-6 p-2 text-slate-300 hover:text-red-500 transition-colors"
              >
                <X className="w-5 h-5 font-bold" />
              </button>

              <div className={cn(
                "w-12 h-12 flex items-center justify-center rounded-2xl mb-6",
                e.type === 'flashsale' ? "bg-pink-100 text-pink-600" : 
                e.type === 'competitor' ? "bg-amber-100 text-amber-600" : "bg-purple-100 text-purple-600"
              )}>
                {e.type === 'flashsale' ? <Zap className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
              </div>

              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{e.type}</div>
              <h3 className="text-xl font-black text-slate-900 mb-4 leading-tight">{e.label}</h3>

              <div className="space-y-3">
                <div className="flex items-center text-sm font-bold text-slate-600">
                  <StoreIcon className="w-4 h-4 mr-2 text-slate-400" />
                  {e.storeId === 'all' ? 'All Locations' : stores.find(s => s.id === e.storeId)?.name || 'Unknown Store'}
                </div>
                <div className="flex items-center text-sm font-bold text-slate-600">
                  <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                  Ends: {new Date(e.endsAt).toLocaleDateString()}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-50">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-400 uppercase tracking-widest">Impact</span>
                  <span className={cn(
                    "font-black px-2 py-1 rounded-lg",
                    e.type === 'flashsale' ? "bg-pink-50 text-pink-600" : "bg-amber-50 text-amber-600"
                  )}>
                    {e.type === 'flashsale' ? 'x2.5 Demand' : '-25% Demand'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-center space-x-2 mb-6">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-lg">
            <CloudRain className="w-5 h-5 font-bold" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Environmental Control</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {WEATHERS.map((w) => (
            <button
              key={w.type}
              onClick={() => onWeatherChange(w)}
              className={cn(
                "p-6 border-2 rounded-[32px] text-center transition-all",
                currentWeather.type === w.type 
                  ? "bg-white border-blue-600 shadow-xl shadow-blue-50 ring-4 ring-blue-50" 
                  : "bg-transparent border-slate-100 hover:border-slate-300 text-slate-600"
              )}
            >
              <div className="text-4xl mb-4">{w.icon}</div>
              <div className="font-black text-sm uppercase tracking-wider">{w.label}</div>
              <div className="mt-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {w.hasDelay ? '⚠ Supply Delays' : 'Normal Shipping'}
              </div>
            </button>
          ))}
        </div>
      </section>

      {showAddEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-[40px] shadow-2xl p-10 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-black text-slate-900 mb-2">Simulate Event</h3>
            <p className="text-slate-500 mb-8 font-medium">Inject a specific event into the simulation engine.</p>

            <div className="space-y-6">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Event Label</label>
                <input
                  type="text"
                  value={newEvent.label}
                  onChange={e => setNewEvent({ ...newEvent, label: e.target.value })}
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-bold placeholder:text-slate-300"
                  placeholder="e.g. Rival Store Grand Opening"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Type</label>
                  <select
                    value={newEvent.type}
                    onChange={e => setNewEvent({ ...newEvent, type: e.target.value as any })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-bold"
                  >
                    <option value="flashsale">Flash Sale</option>
                    <option value="competitor">Competitor</option>
                    <option value="festival">Festival</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">Target Store</label>
                  <select
                    value={newEvent.storeId}
                    onChange={e => setNewEvent({ ...newEvent, storeId: e.target.value })}
                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-bold"
                  >
                    <option value="all">All Stores</option>
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-10">
              <button
                onClick={() => setShowAddEvent(false)}
                className="py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateEvent}
                className="py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all shadow-xl shadow-slate-200"
              >
                Spawn Now
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
