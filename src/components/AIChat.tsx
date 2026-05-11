import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, Loader2, Bot, User as UserIcon, Trash2, Sparkles } from 'lucide-react';
import { cn } from '../lib/utils';
import { chatInventoryAnalyst } from '../services/gemini';
import { Product, Store, SaleRecord, Alert } from '../types';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  products: Product[];
  stores: Store[];
  sales: SaleRecord[];
  alerts: Alert[];
}

export default function AIChat({ products, stores, sales, alerts }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'assistant', 
      content: "Hello! I'm your AI Inventory Analyst. I have access to your current stock levels, store data, and sales history. How can I help you optimize your supply chain today?" 
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    // Prepare context
    const lowStock = products.filter(p => p.currentStock < p.minStockThreshold);
    const criticalAlerts = alerts.filter(a => !a.read && a.priority === 'high');
    const totSales = sales.length;
    
    const context = `
      Stores: ${stores.length} (${stores.map(s => s.name).join(', ')})
      Products: ${products.length} across all stores.
      Low Stock Items: ${lowStock.length}
      Critical Alerts: ${criticalAlerts.length}
      Total Sales Records: ${totSales}
      
      Recent Low Stock Names: ${lowStock.slice(0, 5).map(p => p.name).join(', ')}
      Weather is currently being simulated.
      Lead times vary by supplier.
    `;

    try {
      const aiResponse = await chatInventoryAnalyst(userMessage, context);
      setMessages(prev => [...prev, { role: 'assistant', content: aiResponse }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden animate-in fade-in duration-500">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
        <div className="flex items-center">
          <div className="p-3 bg-blue-600 text-white rounded-2xl mr-4 shadow-lg shadow-blue-100">
            <Bot className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-slate-900">AI Inventory Analyst</h2>
            <div className="flex items-center text-[10px] font-bold text-emerald-600 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 animate-pulse"></span>
              Gemini 3 Flash Connected
            </div>
          </div>
        </div>
        <button 
          onClick={() => setMessages([{ role: 'assistant', content: "Conversation reset. How can I help?" }])}
          className="text-slate-400 hover:text-slate-600 p-2"
        >
          <Trash2 className="w-5 h-5" />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth"
      >
        {messages.map((m, i) => (
          <div 
            key={i} 
            className={cn(
              "flex group",
              m.role === 'user' ? "justify-end" : "justify-start"
            )}
          >
            <div className={cn(
              "flex max-w-[80%] items-start",
              m.role === 'user' ? "flex-row-reverse" : "flex-row"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-sm",
                m.role === 'user' ? "bg-slate-900 text-white ml-4" : "bg-blue-50 text-blue-600 mr-4"
              )}>
                {m.role === 'user' ? <UserIcon className="w-5 h-5" /> : <Sparkles className="w-4 h-4" />}
              </div>
              <div className={cn(
                "p-4 rounded-[24px] text-sm font-medium leading-relaxed shadow-sm",
                m.role === 'user' 
                  ? "bg-slate-900 text-white rounded-tr-none" 
                  : "bg-slate-50 text-slate-700 border border-slate-100 rounded-tl-none"
              )}>
                {m.content}
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[80%] items-start">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 mr-4 flex items-center justify-center">
                <Loader2 className="w-5 h-5 animate-spin" />
              </div>
              <div className="p-4 rounded-[24px] rounded-tl-none bg-slate-50 text-slate-400 font-bold text-xs uppercase tracking-widest flex items-center">
                AI is thinking...
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-50">
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            placeholder="Ask about stockouts, demand trends, or optimization tips..."
            className="w-full pl-6 pr-16 py-5 bg-white border border-slate-200 rounded-[28px] focus:ring-4 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all font-bold placeholder:text-slate-300 shadow-sm group-hover:shadow-md"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || loading}
            className="absolute right-3 top-3 bottom-3 px-5 bg-blue-600 text-white rounded-2xl hover:bg-blue-700 transition-all font-black flex items-center shadow-lg shadow-blue-100 disabled:opacity-50 disabled:bg-slate-400"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-[10px] text-center mt-4 text-slate-400 font-bold uppercase tracking-widest">
          Contextual Store Data is Automatically included in every query
        </p>
      </div>
    </div>
  );
}
