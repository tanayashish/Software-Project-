import React, { useState } from 'react';
import { Truck, Mail, Phone, Calendar, ShieldCheck, AlertCircle, Send, Loader2 } from 'lucide-react';
import { Supplier, Product } from '../types';
import { cn } from '../lib/utils';
import { generateSupplierEmail } from '../services/gemini';

interface SuppliersProps {
  suppliers: Supplier[];
  products: Product[];
}

export default function Suppliers({ suppliers, products }: SuppliersProps) {
  const [selectedSupId, setSelectedSupId] = useState(suppliers[0]?.id || '');
  const [generating, setGenerating] = useState(false);
  const [generatedEmail, setGeneratedEmail] = useState('');

  const selectedSup = suppliers.find(s => s.id === selectedSupId) || suppliers[0];
  const supProducts = products.filter(p => p.supplierId === selectedSupId);

  const handleGenerateEmail = async () => {
    if (!selectedSup) return;
    setGenerating(true);
    
    const lowStockItems = supProducts
      .filter(p => p.currentStock < p.minStockThreshold)
      .map(p => `${p.name} (Current: ${p.currentStock}, Target: ${p.maxStockCapacity})`)
      .join(', ');
    
    const context = lowStockItems || "General stock replenishment of all assigned catalog items.";
    
    const email = await generateSupplierEmail(selectedSup.name, context);
    setGeneratedEmail(email);
    setGenerating(false);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 animate-in fade-in duration-500">
      {/* Sidebar: Supplier List */}
      <div className="lg:col-span-1 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-2">Active Suppliers</h3>
        {suppliers.map((s) => (
          <button
            key={s.id}
            onClick={() => setSelectedSupId(s.id)}
            className={cn(
              "w-full p-4 rounded-3xl text-left transition-all border-2",
              selectedSupId === s.id 
                ? "bg-white border-blue-600 shadow-lg shadow-blue-50" 
                : "bg-transparent border-transparent hover:bg-slate-100 text-slate-600"
            )}
          >
            <div className="font-bold text-sm mb-1">{s.name}</div>
            <div className="flex items-center text-[10px] uppercase font-bold text-slate-400">
              <ShieldCheck className={cn("w-3 h-3 mr-1", s.reliability > 0.9 ? "text-emerald-500" : "text-amber-500")} />
              {Math.round(s.reliability * 100)}% Reliability
            </div>
          </button>
        ))}
      </div>

      {/* Main Content: Supplier Detail */}
      <div className="lg:col-span-3 space-y-8">
        {selectedSup ? (
          <>
            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-black text-slate-900 mb-2">{selectedSup.name}</h2>
                  <div className="flex space-x-4">
                    <div className="flex items-center text-sm font-medium text-slate-500">
                      <Mail className="w-4 h-4 mr-2" />
                      {selectedSup.contactEmail}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Status</div>
                  <div className="inline-flex items-center px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-xs font-bold">
                    <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-2"></span>
                    Verified Partner
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Performance</div>
                  <div className="text-2xl font-black text-slate-900">
                    {Math.round(selectedSup.reliability * 100)}%
                  </div>
                  <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 rounded-full" 
                      style={{ width: `${selectedSup.reliability * 100}%` }}
                    />
                  </div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Avg Lead Time</div>
                  <div className="text-2xl font-black text-slate-900">{selectedSup.defaultLeadTime} Ticks</div>
                  <div className="text-[10px] text-slate-500 font-bold mt-1">ESTIMATED ARRIVAL WINDOW</div>
                </div>
                <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Min Order</div>
                  <div className="text-2xl font-black text-slate-900">{selectedSup.minOrderQuantity} Units</div>
                  <div className="text-[10px] text-slate-500 font-bold mt-1">BATCH SIZE REQUIREMENT</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">Assigned Catalog</h3>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  {supProducts.length} Items Total
                </span>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {supProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{p.name}</div>
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{p.sku}</div>
                    </div>
                    <div className="text-right">
                      <div className={cn(
                        "text-xs font-bold",
                        p.currentStock < p.minStockThreshold ? "text-red-500" : "text-emerald-500"
                      )}>
                        {p.currentStock} / {p.maxStockCapacity}
                      </div>
                      <div className="text-[10px] font-medium text-slate-400">STOCK LEVEL</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-slate-900 p-8 rounded-[40px] text-white shadow-xl shadow-slate-200">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h3 className="text-2xl font-black mb-2">AI Procurement Tool</h3>
                  <p className="text-slate-400 max-w-md">Generate data-driven procurement emails for restocking based on current inventory health at all stores.</p>
                </div>
                <button
                  onClick={handleGenerateEmail}
                  disabled={generating}
                  className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
                >
                  {generating ? (
                    <span className="flex items-center">
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Analyzing Demand...
                    </span>
                  ) : (
                    <span className="flex items-center">
                      <Send className="w-5 h-5 mr-2" />
                      Draft Restock Email
                    </span>
                  )}
                </button>
              </div>

              {generatedEmail && (
                <div className="mt-8 p-6 bg-slate-800 rounded-2xl border border-slate-700 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-700">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Draft</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(generatedEmail);
                        alert('Copied to clipboard!');
                      }}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      COPY TO CLIPBOARD
                    </button>
                  </div>
                  <pre className="text-sm text-slate-300 whitespace-pre-wrap font-sans leading-relaxed">
                    {generatedEmail}
                  </pre>
                </div>
              )}
            </div>
          </>
        ) : (
          <div className="h-96 flex items-center justify-center text-slate-400 font-medium">
            Select a supplier to view details.
          </div>
        )}
      </div>
    </div>
  );
}
