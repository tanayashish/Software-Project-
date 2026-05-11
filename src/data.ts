import { Product, SaleRecord, Alert } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Organic Milk 1L',
    category: 'Dairy',
    currentStock: 45,
    minStockThreshold: 50,
    maxStockCapacity: 200,
    unitPrice: 3.50,
    costPrice: 2.10,
    unit: 'Units',
    lastRestocked: '2024-05-01',
    sku: 'DAI-001',
    storeId: 's1',
    supplierId: 'sup1',
    isPerishable: true,
    leadTime: 2
  },
  {
    id: 'p2',
    name: 'Whole Grain Bread',
    category: 'Bakery',
    currentStock: 120,
    minStockThreshold: 40,
    maxStockCapacity: 150,
    unitPrice: 2.80,
    costPrice: 1.60,
    unit: 'Units',
    lastRestocked: '2024-05-05',
    sku: 'BAK-002',
    storeId: 's1',
    supplierId: 'sup2',
    isPerishable: true,
    leadTime: 1
  },
  {
    id: 'p3',
    name: 'Greek Yogurt 500g',
    category: 'Dairy',
    currentStock: 15,
    minStockThreshold: 30,
    maxStockCapacity: 100,
    unitPrice: 4.20,
    costPrice: 2.50,
    unit: 'Units',
    lastRestocked: '2024-04-28',
    sku: 'DAI-003',
    storeId: 's1',
    supplierId: 'sup1',
    isPerishable: true,
    leadTime: 2
  },
  {
    id: 'p4',
    name: 'Fresh Fuji Apples',
    category: 'Produce',
    currentStock: 85,
    minStockThreshold: 100,
    maxStockCapacity: 500,
    unitPrice: 0.90,
    costPrice: 0.40,
    unit: 'Kg',
    lastRestocked: '2024-05-08',
    sku: 'PRO-004',
    storeId: 's1',
    supplierId: 'sup1',
    isPerishable: true,
    leadTime: 3
  },
  {
    id: 'p5',
    name: 'Sparkling Water 500ml',
    category: 'Beverages',
    currentStock: 300,
    minStockThreshold: 150,
    maxStockCapacity: 1000,
    unitPrice: 1.20,
    costPrice: 0.50,
    unit: 'Units',
    lastRestocked: '2024-05-02',
    sku: 'BEV-005',
    storeId: 's1',
    supplierId: 'sup2',
    isPerishable: false,
    leadTime: 1
  }
];

export const MOCK_SALES: SaleRecord[] = Array.from({ length: 50 }, (_, i) => ({
  id: `s${i}`,
  productId: MOCK_PRODUCTS[Math.floor(Math.random() * MOCK_PRODUCTS.length)].id,
  storeId: 's1',
  quantity: Math.floor(Math.random() * 10) + 1,
  timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
  priceAtSale: 0,
  costAtSale: 0
})).map(sale => {
  const product = MOCK_PRODUCTS.find(p => p.id === sale.productId)!;
  return { ...sale, priceAtSale: product.unitPrice, costAtSale: product.costPrice };
});

export const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    type: 'low_stock',
    message: 'Organic Milk 1L is below threshold (45/50).',
    timestamp: new Date().toISOString(),
    productId: 'p1',
    priority: 'medium',
    read: false
  },
  {
    id: 'a2',
    type: 'out_of_stock',
    message: 'Greek Yogurt 500g is critically low (15/30).',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    productId: 'p3',
    priority: 'high',
    read: false
  }
];
