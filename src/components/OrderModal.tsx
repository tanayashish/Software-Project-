import React, { useState } from 'react';
import { X, Truck, Package, Calendar } from 'lucide-react';
import { Product, Store, Supplier, InventoryOrder } from '../types';
import { placeOrder } from '../services/store';
import { cn, formatCurrency } from '../lib/utils';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  stores: Store[];
  suppliers: Supplier[];
}

export default function OrderModal({ isOpen, onClose, product, stores, suppliers }: OrderModalProps) {
  const [quantity, setQuantity] = useState(100);
  const [loading, setLoading] = useState(false);

  if (!isOpen || !product) return null;

  const store = stores.find(s => s.id === product.storeId);
  const supplier = suppliers.find(s => s.id === product.supplierId);

  const handlePlaceOrder = async () => {
    if (!product || !store || !supplier) return;
    
    setLoading(true);
    const order: Omit<InventoryOrder, 'id'> = {
      productId: product.id,
      storeId: store.id,
      supplierId: supplier.id,
      quantity: quantity,
      unitCost: product.costPrice,
      status: 'pending',
      placedAt: new Date().toISOString(),
      arriveAt: new Date(Date.now() + (product.leadTime * 60 * 1000 * 5)).toISOString() // Simplified arrival time based on leadTime ticks
    };

    await placeOrder(order);
    setLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl p-8 animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-start mb-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl mr-4">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900">Place Restock Order</h3>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.name}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-50 rounded-xl text-slate-400 transition-all">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex justify-between items-center">
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Current Stock</p>
              <p className="text-lg font-black text-slate-900">{product.currentStock} {product.unit}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Max Capacity</p>
              <p className="text-lg font-black text-slate-600">{product.maxStockCapacity} {product.unit}</p>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-500 uppercase tracking-widest block ml-1">Order Quantity</label>
            <div className="flex items-center space-x-4">
              <input
                type="number"
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value) || 0)}
                className="flex-1 px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-black"
                min="1"
              />
              <div className="flex space-x-2">
                <button 
                  onClick={() => setQuantity(prev => Math.max(0, prev - 10))}
                  className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all"
                >
                  -10
                </button>
                <button 
                  onClick={() => setQuantity(prev => prev + 10)}
                  className="w-12 h-12 flex items-center justify-center bg-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-200 transition-all"
                >
                  +10
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Est. Cost</p>
              <p className="text-sm font-bold text-slate-900">{formatCurrency(quantity * product.costPrice)}</p>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Lead Time</p>
              <p className="text-sm font-bold text-slate-900">{product.leadTime} Ticks</p>
            </div>
          </div>

          <div className="pt-2">
            <button
              onClick={handlePlaceOrder}
              disabled={loading || quantity <= 0}
              className="w-full py-4 bg-blue-600 text-white rounded-2xl font-black text-sm shadow-xl shadow-blue-100 hover:bg-blue-700 transition-all disabled:opacity-50 flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin mr-2"></div>
              ) : (
                <Truck className="w-4 h-4 mr-2" />
              )}
              Confirm Procurement Order
            </button>
            <p className="text-[10px] text-center text-slate-400 font-bold uppercase tracking-widest mt-4">
              Restock arrives after ${product.leadTime} simulation ticks
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
