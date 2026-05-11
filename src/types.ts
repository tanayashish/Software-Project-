
export interface Product {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStockThreshold: number;
  maxStockCapacity: number;
  unitPrice: number; // This is selling price
  costPrice: number;
  unit: string;
  lastRestocked: string;
  sku: string;
  storeId: string;
  supplierId: string;
  isPerishable: boolean;
  leadTime: number; // in days/ticks
  totalSpoiled?: number;
}

export interface Store {
  id: string;
  name: string;
  location: string;
  warehouseCapacity: number;
  staffCount: number;
  demandMultiplier: number;
}

export interface Supplier {
  id: string;
  name: string;
  reliability: number; // 0-1
  minOrderQuantity: number;
  defaultLeadTime: number;
  contactEmail: string;
}

export interface SaleRecord {
  id: string;
  productId: string;
  storeId: string;
  quantity: number;
  timestamp: string;
  priceAtSale: number;
  costAtSale: number;
}

export interface InventoryOrder {
  id: string;
  productId: string;
  storeId: string;
  supplierId: string;
  quantity: number;
  unitCost: number;
  placedAt: string;
  arriveAt: string; // timestamp or tick
  status: 'pending' | 'delivered' | 'cancelled';
}

export interface SimulationEvent {
  id: string;
  type: 'competitor' | 'flashsale' | 'festival';
  label: string;
  storeId: string | 'all';
  productId?: string; // used for flashsale
  endsAt: string;
}

export interface Weather {
  type: 'sunny' | 'rainy' | 'heatwave' | 'storm' | 'cold' | 'festival';
  icon: string;
  label: string;
  multipliers: Record<string, number>; // Category -> Multiplier
  hasDelay: boolean;
}

export interface FinancialDetail {
  revenue: number;
  cost: number;
  waste: number;
  loss: number; // lost sales due to stockout
  orderCount: number;
}

export interface Forecast {
  productId: string;
  storeId: string;
  predictedDemand: number;
  confidenceScore: number;
  reasoning: string;
  suggestedRestock: number;
  forecastDate: string;
}

export interface Alert {
  id: string;
  type: 'low_stock' | 'out_of_stock' | 'demand_surge' | 'system' | 'spoilage' | 'anomaly';
  message: string;
  timestamp: string;
  productId?: string;
  storeId?: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
}
