/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Overview from './components/Overview';
import InventoryTable from './components/InventoryTable';
import SalesAnalytics from './components/SalesAnalytics';
import Alerts from './components/Alerts';
import StoreManager from './components/StoreManager';
import Suppliers from './components/Suppliers';
import EventsControl from './components/EventsControl';
import AIChat from './components/AIChat';
import { auth, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { 
  subscribeToProducts, 
  subscribeToSales, 
  subscribeToAlerts, 
  markAlertRead, 
  clearAlerts,
  performSystemSync,
  seedDatabase,
  addSale,
  updateStock,
  createAlert,
  subscribeToStores,
  subscribeToSuppliers,
  subscribeToOrders,
  subscribeToEvents,
  updateOrderStatus
} from './services/store';
import { Product, SaleRecord, Alert, Store, Supplier, InventoryOrder, SimulationEvent, Weather } from './types';
import { LogIn, TrendingUp, Play, Pause, Database, CloudSun } from 'lucide-react';
import { SEED_PRODUCTS, SEED_STORES, SEED_SUPPLIERS } from './seedData';
import { Logo } from './components/Logo';
import { cn } from './lib/utils';

const DEFAULT_WEATHER: Weather = { type: 'sunny', icon: '', label: 'Sunny', multipliers: {}, hasDelay: false };

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [orders, setOrders] = useState<InventoryOrder[]>([]);
  const [events, setEvents] = useState<SimulationEvent[]>([]);
  const [weather, setWeather] = useState<Weather>(DEFAULT_WEATHER);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedStoreId, setSelectedStoreId] = useState<string>('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [tickSpeed, setTickSpeed] = useState(4000);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribeAuth();
  }, []);

  useEffect(() => {
    if (!user) return;

    // Seed if empty
    seedDatabase(SEED_PRODUCTS, SEED_STORES, SEED_SUPPLIERS);

    const unsubProducts = subscribeToProducts(setProducts);
    const unsubSales = subscribeToSales(setSales);
    const unsubAlerts = subscribeToAlerts(setAlerts);
    const unsubStores = subscribeToStores((fetchedStores) => {
      setStores(fetchedStores);
      if (fetchedStores.length > 0 && !selectedStoreId) {
        setSelectedStoreId(fetchedStores[0].id);
      }
    });
    const unsubSuppliers = subscribeToSuppliers(setSuppliers);
    const unsubOrders = subscribeToOrders(setOrders);
    const unsubEvents = subscribeToEvents(setEvents);

    return () => {
      unsubProducts();
      unsubSales();
      unsubAlerts();
      unsubStores();
      unsubSuppliers();
      unsubOrders();
      unsubEvents();
    };
  }, [user]);

  // Enhanced Simulation Logic
  useEffect(() => {
    if (!isSimulating || products.length === 0 || stores.length === 0) return;

    const interval = setInterval(async () => {
      // 0. Process Incoming Orders (Fulfillment)
      const now = new Date();
      const pendingOrders = orders.filter(o => o.status === 'pending');
      
      for (const order of pendingOrders) {
        if (new Date(order.arriveAt) <= now) {
          const product = products.find(p => p.id === order.productId);
          if (product) {
            await updateStock(product.id, product.currentStock + order.quantity, 0);
            await updateOrderStatus(order.id, 'delivered');
            
            await createAlert({
              type: 'system',
              message: `Order for ${product.name} has arrived at ${stores.find(s => s.id === order.storeId)?.name}. +${order.quantity} units added to stock.`,
              timestamp: new Date().toISOString(),
              productId: product.id,
              storeId: order.storeId,
              priority: 'low',
              read: false
            });
          }
        }
      }

      // 1. Pick a random product from any store
      const randomProduct = products[Math.floor(Math.random() * products.length)];
      const store = stores.find(s => s.id === randomProduct.storeId);
      if (!store || randomProduct.currentStock <= 0) return;

      // Calculate Demand Multipliers
      let multiplier = store.demandMultiplier;
      
      // Weather Multiplier
      if (weather.multipliers[randomProduct.category]) {
        multiplier *= weather.multipliers[randomProduct.category];
      }

      // Events Multiplier (flash sale, etc)
      const activeStoreEvents = events.filter(e => (e.storeId === 'all' || e.storeId === store.id) && new Date(e.endsAt) > new Date());
      activeStoreEvents.forEach(e => {
        if (e.type === 'flashsale' && e.productId === randomProduct.id) multiplier *= 2.5;
        if (e.type === 'competitor') multiplier *= 0.75;
        if (e.type === 'festival') multiplier *= 1.5;
      });

      // Random factor
      const randomFactor = 0.5 + Math.random() * 1.5;
      const baseDemand = 2; // average units per tick
      const saleQty = Math.min(Math.round(baseDemand * multiplier * randomFactor), randomProduct.currentStock);
      
      if (saleQty <= 0) return;

      const newStock = randomProduct.currentStock - saleQty;

      // 1. Record Sale
      await addSale({
        productId: randomProduct.id,
        storeId: store.id,
        quantity: saleQty,
        timestamp: new Date().toISOString(),
        priceAtSale: randomProduct.unitPrice,
        costAtSale: randomProduct.costPrice
      });

      // 2. Update Stock (and check for spoilage if perishable)
      let spoiled = 0;
      if (randomProduct.isPerishable && Math.random() < 0.05) {
        spoiled = Math.min(Math.floor(Math.random() * 3) + 1, newStock);
      }
      
      await updateStock(randomProduct.id, newStock - spoiled, spoiled);

      if (spoiled > 0) {
        await createAlert({
          type: 'spoilage',
          message: `${spoiled} units of ${randomProduct.name} spoiled at ${store.name}.`,
          timestamp: new Date().toISOString(),
          productId: randomProduct.id,
          storeId: store.id,
          priority: 'medium',
          read: false
        });
      }

      // 3. Generate Alert if low
      if (newStock <= randomProduct.minStockThreshold) {
        const alreadyHasAlert = alerts.some(a => a.productId === randomProduct.id && !a.read && (a.type === 'low_stock' || a.type === 'out_of_stock'));
        
        if (!alreadyHasAlert) {
          await createAlert({
            type: newStock <= 0 ? 'out_of_stock' : 'low_stock',
            message: `${randomProduct.name} at ${store.name} is ${newStock <= 0 ? 'out of stock' : 'running low'} (${Math.max(0, newStock)}/${randomProduct.minStockThreshold}).`,
            timestamp: new Date().toISOString(),
            productId: randomProduct.id,
            storeId: store.id,
            priority: newStock <= 0 ? 'high' : 'medium',
            read: false
          });
        }
      }
    }, tickSpeed); // Dynamic simulation speed

    return () => clearInterval(interval);
  }, [isSimulating, products, stores, weather, events, alerts, tickSpeed]);

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-slate-50 p-6">
        <div className="max-w-md w-full bg-white p-12 rounded-3xl border border-slate-200 shadow-2xl shadow-blue-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="bg-blue-600 w-20 h-20 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-blue-200">
            <Logo className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 mb-2">PredictStock AI</h1>
          <p className="text-slate-500 mb-8 font-medium">Smart Retail Inventory Forecasting & Auto-Restocking</p>
          
          <button 
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center py-4 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:bg-slate-800 transition-all shadow-xl shadow-slate-200 group"
          >
            <LogIn className="w-5 h-5 mr-3 group-hover:translate-x-1 transition-transform" />
            Sign in with Google
          </button>
          
          <p className="mt-8 text-xs text-slate-400 font-bold uppercase tracking-widest">
            Authorized Personnel Only
          </p>
        </div>
      </div>
    );
  }

  const handleSync = async () => {
    // Perform system audit and cleanup
    await performSystemSync();
    
    // Create a system alert about the sync
    await createAlert({
      type: 'system',
      message: 'System audit completed successfully. Database integrity verified and old logs purged.',
      timestamp: new Date().toISOString(),
      priority: 'low',
      read: false
    });
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview products={products} sales={sales} alerts={alerts} onSync={handleSync} />;
      case 'inventory':
        return (
          <InventoryTable 
            products={products.filter(p => p.storeId === selectedStoreId)} 
            stores={stores}
            suppliers={suppliers}
            activeStoreId={selectedStoreId}
          />
        );
      case 'sales':
        return <SalesAnalytics products={products} sales={sales} />;
      case 'stores':
        return <StoreManager stores={stores} selectedStoreId={selectedStoreId} setSelectedStoreId={setSelectedStoreId} />;
      case 'suppliers':
        return <Suppliers suppliers={suppliers} products={products} />;
      case 'events':
        return <EventsControl events={events} stores={stores} currentWeather={weather} onWeatherChange={setWeather} />;
      case 'chat':
        return <AIChat products={products} stores={stores} sales={sales} alerts={alerts} />;
      case 'alerts':
        return <Alerts alerts={alerts} onMarkAsRead={markAlertRead} onClearAll={clearAlerts} />;
      case 'settings':
        return (
          <div className="p-8 space-y-8 animate-in fade-in duration-500">
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-2">Simulate Store Environment</h2>
              <p className="text-slate-500 mb-8">Enable real-time sales simulation to see how the inventory auto-restock suggestions and alerts behave.</p>
              
              <div className="flex items-center justify-between p-6 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center">
                  <div className={cn("p-3 rounded-xl mr-4", isSimulating ? "bg-emerald-100 text-emerald-600" : "bg-slate-200 text-slate-400")}>
                    {isSimulating ? <Play className="w-6 h-6" /> : <Pause className="w-6 h-6" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">Virtual Customer Loop</p>
                    <p className="text-sm text-slate-500">{isSimulating ? `Generating random sales every ${tickSpeed / 1000}s` : 'Simulation paused'}</p>
                  </div>
                </div>

                <div className="flex-1 max-w-xs mx-8">
                  <div className="flex justify-between items-center mb-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Simulation Speed</label>
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-widest">
                      {tickSpeed === 1000 ? 'Ultra' : tickSpeed <= 2500 ? 'Fast' : tickSpeed <= 5000 ? 'Normal' : 'Slow'}
                    </span>
                  </div>
                  <input 
                    type="range"
                    min="1000"
                    max="10000"
                    step="500"
                    value={tickSpeed}
                    onChange={(e) => setTickSpeed(parseInt(e.target.value))}
                    className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between mt-1 text-[9px] font-bold text-slate-400 uppercase">
                    <span>1s (Ultra)</span>
                    <span>10s (Slow)</span>
                  </div>
                </div>

                <button 
                  onClick={() => setIsSimulating(!isSimulating)}
                  className={cn(
                    "px-8 py-3 rounded-xl font-bold text-sm transition-all shadow-lg shadow-slate-100",
                    isSimulating ? "bg-rose-50 text-rose-600 hover:bg-rose-100" : "bg-blue-600 text-white hover:bg-blue-700"
                  )}
                >
                  {isSimulating ? 'Stop Simulation' : 'Start Simulation'}
                </button>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-2">Data Management</h2>
              <p className="text-slate-500 mb-8">Reset the store to initial state if the database is empty.</p>
              
              <div className="flex items-center justify-between">
                <button 
                  disabled={products.length > 0}
                  onClick={() => seedDatabase(SEED_PRODUCTS, SEED_STORES, SEED_SUPPLIERS)}
                  className="flex items-center px-6 py-3 bg-white border border-slate-200 text-slate-600 font-bold rounded-xl hover:bg-slate-50 disabled:opacity-50"
                >
                  <Database className="w-4 h-4 mr-2" />
                  Seed Initial Product Batch
                </button>
                
                <button 
                  onClick={() => auth.signOut()}
                  className="px-6 py-3 bg-rose-50 text-rose-600 font-bold rounded-xl border border-rose-100 hover:bg-rose-100 transition-colors"
                >
                  Sign Out Account
                </button>
              </div>
            </div>
          </div>
        );
      default:
        return <Overview products={products} sales={sales} alerts={alerts} onSync={handleSync} />;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={setActiveTab} 
      alertCount={alerts.filter(a => !a.read).length}
    >
      {renderContent()}
    </Layout>
  );
}

