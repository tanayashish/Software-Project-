import React from 'react';
import { ShoppingCart, LayoutDashboard, Package, TrendingUp, Bell, Settings, Store, Truck, Zap, MessageSquare } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
  badge?: number;
}

function NavItem({ icon: Icon, label, active, onClick, badge }: NavItemProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-4 py-3 mb-1 text-sm font-medium transition-colors rounded-lg group",
        active 
          ? "bg-blue-50 text-blue-700 shadow-sm" 
          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
      )}
    >
      <Icon className={cn("w-5 h-5 mr-3", active ? "text-blue-600" : "text-slate-400 group-hover:text-slate-600")} />
      <span>{label}</span>
      {badge && (
        <span className="ml-auto bg-red-100 text-red-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  alertCount: number;
}

export default function Layout({ children, activeTab, setActiveTab, alertCount }: LayoutProps) {
  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 flex items-center">
          <div className="bg-blue-600 p-2 rounded-lg mr-3 shadow-lg shadow-blue-200">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">PredictStock AI</h1>
        </div>

        <nav className="flex-1 px-4 mt-2">
          <NavItem 
            icon={LayoutDashboard} 
            label="Overview" 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')} 
          />
          <NavItem 
            icon={Package} 
            label="Inventory" 
            active={activeTab === 'inventory'} 
            onClick={() => setActiveTab('inventory')} 
          />
          <NavItem 
            icon={TrendingUp} 
            label="Sales Analytics" 
            active={activeTab === 'sales'} 
            onClick={() => setActiveTab('sales')} 
          />
          <NavItem 
            icon={Store} 
            label="Store Manager" 
            active={activeTab === 'stores'} 
            onClick={() => setActiveTab('stores')} 
          />
          <NavItem 
            icon={Truck} 
            label="Suppliers" 
            active={activeTab === 'suppliers'} 
            onClick={() => setActiveTab('suppliers')} 
          />
          <NavItem 
            icon={Zap} 
            label="Events Control" 
            active={activeTab === 'events'} 
            onClick={() => setActiveTab('events')} 
          />
          <NavItem 
            icon={MessageSquare} 
            label="AI Analyst" 
            active={activeTab === 'chat'} 
            onClick={() => setActiveTab('chat')} 
          />
          <NavItem 
            icon={Bell} 
            label="Alerts" 
            active={activeTab === 'alerts'} 
            onClick={() => setActiveTab('alerts')} 
            badge={alertCount}
          />
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavItem 
            icon={Settings} 
            label="Settings" 
            active={activeTab === 'settings'} 
            onClick={() => setActiveTab('settings')} 
          />
          <div className="mt-4 p-4 bg-slate-50 rounded-xl">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-1">Status</p>
            <div className="flex items-center text-xs font-medium text-emerald-600">
              <span className="w-2 h-2 bg-emerald-500 rounded-full mr-2"></span>
              AI Engine Ready
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-bottom border-slate-200 flex items-center justify-between px-8 z-10 shadow-sm shadow-slate-100">
          <div className="flex items-center">
            <h2 className="text-sm font-semibold text-slate-400 uppercase tracking-widest mr-2">System</h2>
            <div className="bg-slate-100 h-1 w-8 rounded-full"></div>
            <h2 className="text-sm font-semibold text-slate-900 ml-2">PredictStock AI</h2>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right mr-4">
              <p className="text-sm font-bold text-slate-900">Central Warehouse</p>
              <p className="text-[10px] font-medium text-slate-500 uppercase">Manager: Tanay Ashish</p>
            </div>
            <div className="w-10 h-10 bg-slate-200 rounded-full border-2 border-white shadow-sm flex items-center justify-center text-slate-500 font-bold">
              TA
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
