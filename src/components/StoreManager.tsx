import React, { useState } from 'react';
import { Store, MapPin, Users, Warehouse, TrendingUp, Trash2, Plus } from 'lucide-react';
import { Store as StoreType } from '../types';
import { cn, formatCurrency } from '../lib/utils';
import { addStore, updateStore, deleteStore } from '../services/store';

interface StoreManagerProps {
  stores: StoreType[];
  selectedStoreId: string;
  setSelectedStoreId: (id: string) => void;
}

export default function StoreManager({ stores, selectedStoreId, setSelectedStoreId }: StoreManagerProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [newStore, setNewStore] = useState<Omit<StoreType, 'id'>>({
    name: '',
    location: '',
    warehouseCapacity: 5000,
    staffCount: 3,
    demandMultiplier: 1.0
  });

  const handleCreate = async () => {
    if (!newStore.name || !newStore.location) return;
    await addStore(newStore);
    setShowAddModal(false);
    setNewStore({
      name: '',
      location: '',
      warehouseCapacity: 5000,
      staffCount: 3,
      demandMultiplier: 1.0
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Store Network</h2>
          <p className="text-slate-500">Manage your retail locations and their individual configurations.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Store
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stores.map((s) => (
          <div
            key={s.id}
            onClick={() => setSelectedStoreId(s.id)}
            className={cn(
              "p-6 bg-white border-2 rounded-3xl cursor-pointer transition-all hover:shadow-xl",
              selectedStoreId === s.id ? "border-blue-600 shadow-blue-50 ring-4 ring-blue-50" : "border-slate-100 hover:border-slate-300"
            )}
          >
            <div className="flex justify-between items-start mb-6">
              <div className={cn("p-3 rounded-2xl", selectedStoreId === s.id ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600")}>
                <Store className="w-6 h-6" />
              </div>
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (confirm('Are you sure you want to delete this store?')) {
                    deleteStore(s.id);
                  }
                }}
                className="text-slate-300 hover:text-red-500 transition-colors p-2"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-1">{s.name}</h3>
            <div className="flex items-center text-slate-500 text-sm mb-4 font-medium">
              <MapPin className="w-4 h-4 mr-1.5" />
              {s.location}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <div className="bg-slate-50 p-3 rounded-2xl">
                <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  <Warehouse className="w-3 h-3 mr-1" />
                  Capacity
                </div>
                <div className="text-sm font-bold text-slate-900">{s.warehouseCapacity.toLocaleString()} units</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl">
                <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  <Users className="w-3 h-3 mr-1" />
                  Staff
                </div>
                <div className="text-sm font-bold text-slate-900">{s.staffCount} personnel</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-2xl col-span-2">
                <div className="flex items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Demand Factor
                </div>
                <div className="text-sm font-bold text-blue-600">x{s.demandMultiplier.toFixed(1)} activity multiplier</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in-95 duration-200">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Deploy New Store</h3>
            <p className="text-slate-500 mb-6">Initialize a new branch in your retail network.</p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Store Name</label>
                <input
                  type="text"
                  value={newStore.name}
                  onChange={e => setNewStore({ ...newStore, name: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-medium"
                  placeholder="e.g. Westside Plaza"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Location</label>
                <input
                  type="text"
                  value={newStore.location}
                  onChange={e => setNewStore({ ...newStore, location: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-medium"
                  placeholder="e.g. Midtown District"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Capacity</label>
                  <input
                    type="number"
                    value={newStore.warehouseCapacity}
                    onChange={e => setNewStore({ ...newStore, warehouseCapacity: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-medium"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Staff</label>
                  <input
                    type="number"
                    value={newStore.staffCount}
                    onChange={e => setNewStore({ ...newStore, staffCount: parseInt(e.target.value) || 0 })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-medium"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button
                onClick={() => setShowAddModal(false)}
                className="py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleCreate}
                className="py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
              >
                Launch Store
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
