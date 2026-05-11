import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, ArrowUpDown, ChevronRight, PackageCheck, PackageX, TrendingUp, Plus, Truck } from 'lucide-react';
import { Product, Forecast } from '../types';
import { cn, formatCurrency, formatDate } from '../lib/utils';
import { getForecastForProduct } from '../services/gemini';
import { MOCK_SALES } from '../data';
import ProductModal from './ProductModal';
import OrderModal from './OrderModal';
import { Store, Supplier } from '../types';

interface InventoryTableProps {
  products: Product[];
  stores: Store[];
  suppliers: Supplier[];
  activeStoreId: string;
}

export default function InventoryTable({ products, stores, suppliers, activeStoreId }: InventoryTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [forecast, setForecast] = useState<Forecast | null>(null);
  const [loadingForecast, setLoadingForecast] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [productToOrder, setProductToOrder] = useState<Product | null>(null);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleForecastClick = async (product: Product) => {
    setSelectedProduct(product);
    setLoadingForecast(true);
    const result = await getForecastForProduct(product, MOCK_SALES);
    setForecast(result);
    setLoadingForecast(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Inventory Management</h1>
          <p className="text-slate-500 mt-1">Track stock levels and get AI-powered refill insights.</p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by SKU, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all hover:-translate-y-0.5"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </button>
        </div>
      </div>

      <ProductModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setProductToEdit(null);
        }} 
        productToEdit={productToEdit}
        stores={stores}
        suppliers={suppliers}
        activeStoreId={activeStoreId}
      />

      <OrderModal 
        isOpen={isOrderModalOpen}
        onClose={() => {
          setIsOrderModalOpen(false);
          setProductToOrder(null);
        }}
        product={productToOrder}
        stores={stores}
        suppliers={suppliers}
      />

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                    <div className="flex items-center space-x-1 cursor-pointer hover:text-slate-900">
                      <span>Product Info</span>
                      <ArrowUpDown className="w-3 h-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Current Stock</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Base Rate</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest">Inventory Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredProducts.map((p) => {
                  const stockRatio = p.currentStock / p.maxStockCapacity;
                  const isLow = p.currentStock <= p.minStockThreshold;
                  
                  return (
                    <tr 
                      key={p.id} 
                      className={cn(
                        "hover:bg-slate-50/50 transition-colors cursor-pointer group",
                        selectedProduct?.id === p.id && "bg-blue-50/50"
                      )}
                      onClick={() => handleForecastClick(p)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className={cn(
                            "w-10 h-10 rounded-lg mr-4 flex items-center justify-center font-bold text-xs shadow-sm",
                            isLow ? "bg-rose-50 text-rose-600" : "bg-blue-50 text-blue-600"
                          )}>
                            {p.sku.slice(0, 3)}
                          </div>
                          <div>
                            <p className="text-sm font-bold text-slate-900">{p.name}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase">{p.category} • {p.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <span className="text-sm font-bold text-slate-900 mr-2">{p.currentStock}</span>
                          <span className="text-xs font-medium text-slate-400">{p.unit}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-bold text-sm text-slate-600">
                        {formatCurrency(p.unitPrice)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="w-32">
                          <div className="flex items-center justify-between mb-1.5">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider",
                              isLow ? "bg-rose-100 text-rose-600" : "bg-emerald-100 text-emerald-600"
                            )}>
                              {isLow ? 'Restock Soon' : 'Optimal'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">{Math.round(stockRatio * 100)}%</span>
                          </div>
                          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className={cn(
                                "h-full rounded-full transition-all duration-500",
                                isLow ? "bg-rose-500" : "bg-blue-600"
                              )} 
                              style={{ width: `${Math.min(stockRatio * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-1">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductToOrder(p);
                              setIsOrderModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center text-xs font-black uppercase tracking-widest"
                          >
                            <Truck className="w-4 h-4 mr-1" />
                            Order
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setProductToEdit(p);
                              setIsModalOpen(true);
                            }}
                            className="p-2 text-slate-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Side Panel */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 h-fit sticky top-8">
          {!selectedProduct ? (
            <div className="flex flex-col items-center justify-center h-64 text-center space-y-4">
              <div className="p-4 bg-blue-50 rounded-full text-blue-600">
                <PackageCheck className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-slate-900">Predictive Analysis</h4>
                <p className="text-sm text-slate-500 px-4">Select a product to generate demand forecast and restocking plan.</p>
              </div>
            </div>
          ) : (
            <div className="space-y-6 animate-in slide-in-from-right-4 duration-300">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-slate-900 text-lg">{selectedProduct.name}</h4>
                  <p className="text-xs font-bold text-blue-600 uppercase">AI Forecasting Insight</p>
                </div>
                <button onClick={() => setSelectedProduct(null)} className="text-slate-400 hover:text-slate-600">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>

              {loadingForecast ? (
                <div className="py-12 flex flex-col items-center justify-center space-y-4">
                  <div className="w-12 h-12 border-4 border-blue-50 border-t-blue-600 rounded-full animate-spin"></div>
                  <p className="text-sm font-medium text-slate-500">Analyzing Sales History...</p>
                </div>
              ) : forecast && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Predicted Demand</p>
                      <p className="text-xl font-black text-slate-900">{forecast.predictedDemand}</p>
                      <p className="text-[10px] font-medium text-slate-500">Next 7 days</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Confidence</p>
                      <p className="text-xl font-black text-slate-900">{Math.round(forecast.confidenceScore * 100)}%</p>
                      <p className="text-[10px] font-medium text-emerald-600">High Reliability</p>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-xl border border-blue-100 relative overflow-hidden">
                    <div className="relative z-10">
                      <p className="text-[10px] font-bold text-blue-600 uppercase mb-2 flex items-center">
                        <TrendingUp className="w-3 h-3 mr-1" /> Recommendation
                      </p>
                      <p className="text-sm font-bold text-slate-800 leading-tight">
                        Order <span className="text-blue-700 font-black">{forecast.suggestedRestock} {selectedProduct.unit}</span> today to maintain optimal coverage.
                      </p>
                    </div>
                    <TrendingUp className="absolute -bottom-2 -right-2 w-16 h-16 text-blue-100" />
                  </div>

                  <div>
                    <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">AI Reasoning</h5>
                    <p className="text-sm text-slate-600 leading-relaxed italic bg-slate-50 p-4 rounded-xl border border-slate-100">
                      "{forecast.reasoning}"
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setProductToOrder(selectedProduct);
                      setIsOrderModalOpen(true);
                    }}
                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all hover:-translate-y-0.5 active:translate-y-0"
                  >
                    Process Restock Order
                  </button>
                  
                  <p className="text-[10px] text-center text-slate-400 font-medium">
                    Calculated: {formatDate(forecast.forecastDate)}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
