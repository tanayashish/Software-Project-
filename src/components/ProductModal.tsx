import React, { useState, useEffect } from 'react';
import { X, Package, Plus, Save } from 'lucide-react';
import { Product, Store, Supplier } from '../types';
import { addProduct, updateProduct } from '../services/store';
import { cn } from '../lib/utils';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  productToEdit?: Product | null;
  stores: Store[];
  suppliers: Supplier[];
  activeStoreId?: string;
}

export default function ProductModal({ isOpen, onClose, productToEdit, stores, suppliers, activeStoreId }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    sku: '',
    currentStock: 0,
    minStockThreshold: 10,
    maxStockCapacity: 100,
    unitPrice: 0,
    costPrice: 0,
    unit: 'Units',
    storeId: activeStoreId || '',
    supplierId: '',
    isPerishable: false,
    leadTime: 2,
    lastRestocked: new Date().toISOString()
  });

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        name: productToEdit.name,
        category: productToEdit.category,
        sku: productToEdit.sku,
        currentStock: productToEdit.currentStock,
        minStockThreshold: productToEdit.minStockThreshold,
        maxStockCapacity: productToEdit.maxStockCapacity,
        unitPrice: productToEdit.unitPrice,
        costPrice: productToEdit.costPrice,
        unit: productToEdit.unit,
        storeId: productToEdit.storeId,
        supplierId: productToEdit.supplierId,
        isPerishable: productToEdit.isPerishable,
        leadTime: productToEdit.leadTime,
        lastRestocked: productToEdit.lastRestocked
      });
    } else {
      setFormData({
        name: '',
        category: '',
        sku: '',
        currentStock: 0,
        minStockThreshold: 10,
        maxStockCapacity: 100,
        unitPrice: 0,
        costPrice: 0,
        unit: 'Units',
        storeId: activeStoreId || (stores[0]?.id || ''),
        supplierId: suppliers[0]?.id || '',
        isPerishable: false,
        leadTime: 2,
        lastRestocked: new Date().toISOString()
      });
    }
  }, [productToEdit, isOpen, activeStoreId, stores, suppliers]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, formData);
      } else {
        await addProduct(formData as Omit<Product, 'id'>);
      }
      onClose();
    } catch (error) {
      console.error("Failed to save product:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center">
            <div className={cn("p-2 rounded-lg mr-3", productToEdit ? "bg-amber-600" : "bg-blue-600")}>
              <Package className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-xl font-bold text-slate-900">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Product Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
                placeholder="e.g. Organic Almond Milk"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category</label>
              <input
                required
                type="text"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
                placeholder="e.g. Dairy"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">SKU</label>
              <input
                required
                type="text"
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
                placeholder="e.g. DAI-001"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Current Stock</label>
              <input
                required
                type="number"
                value={formData.currentStock}
                onChange={e => setFormData({ ...formData, currentStock: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Unit Price (₹)</label>
              <input
                required
                type="number"
                step="0.01"
                value={formData.unitPrice}
                onChange={e => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Cost Price (₹)</label>
              <input
                required
                type="number"
                step="0.01"
                value={formData.costPrice}
                onChange={e => setFormData({ ...formData, costPrice: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Target Store</label>
              <select
                value={formData.storeId}
                onChange={e => setFormData({ ...formData, storeId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-medium"
              >
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Primary Supplier</label>
              <select
                value={formData.supplierId}
                onChange={e => setFormData({ ...formData, supplierId: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-medium"
              >
                {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>

            <div className="flex items-center space-x-3 pt-4">
              <input
                type="checkbox"
                id="isPerishable"
                checked={formData.isPerishable}
                onChange={e => setFormData({ ...formData, isPerishable: e.target.checked })}
                className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="isPerishable" className="text-sm font-bold text-slate-700">Perishable Item (Spoilage possible)</label>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Lead Time (Ticks)</label>
              <input
                required
                type="number"
                value={formData.leadTime}
                onChange={e => setFormData({ ...formData, leadTime: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Min Threshold</label>
              <input
                required
                type="number"
                value={formData.minStockThreshold}
                onChange={e => setFormData({ ...formData, minStockThreshold: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Max Capacity</label>
              <input
                required
                type="number"
                value={formData.maxStockCapacity}
                onChange={e => setFormData({ ...formData, maxStockCapacity: parseInt(e.target.value) || 0 })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={cn(
              "w-full flex items-center justify-center py-4 text-white rounded-2xl font-bold text-lg transition-all shadow-xl disabled:opacity-50 disabled:cursor-not-allowed group",
              productToEdit ? "bg-amber-600 hover:bg-amber-700 shadow-amber-100" : "bg-blue-600 hover:bg-blue-700 shadow-blue-100"
            )}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                {productToEdit ? (
                  <>
                    <Save className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Update Product
                  </>
                ) : (
                  <>
                    <Plus className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform" />
                    Add Product to Inventory
                  </>
                )}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
