import { Product, Store, Supplier } from './types';

export const SEED_SUPPLIERS: any[] = [
  { name: "FreshFarm Co.", reliability: 0.95, minOrderQuantity: 30, defaultLeadTime: 2, contactEmail: "freshfarm@supply.in" },
  { name: "QuickDeliver Ltd.", reliability: 0.82, minOrderQuantity: 20, defaultLeadTime: 1, contactEmail: "quick@supply.in" },
  { name: "BulkBusters Inc.", reliability: 0.70, minOrderQuantity: 100, defaultLeadTime: 3, contactEmail: "bulk@supply.in" }
];

export const SEED_STORES: any[] = [
  { name: "Downtown Store", location: "Central District", warehouseCapacity: 5000, staffCount: 4, demandMultiplier: 1.2 },
  { name: "Suburb Store", location: "Green Valley", warehouseCapacity: 4000, staffCount: 3, demandMultiplier: 1.0 },
  { name: "Mall Store", location: "City Mall", warehouseCapacity: 3500, staffCount: 3, demandMultiplier: 1.1 }
];

export const SEED_PRODUCTS: any[] = [
  {
    name: 'Organic Milk 1L',
    category: 'Dairy',
    currentStock: 45,
    minStockThreshold: 50,
    maxStockCapacity: 200,
    unitPrice: 3.50,
    unit: 'Units',
    lastRestocked: '2024-05-01',
    sku: 'DAI-001'
  },
  {
    name: 'Whole Grain Bread',
    category: 'Bakery',
    currentStock: 120,
    minStockThreshold: 40,
    maxStockCapacity: 150,
    unitPrice: 2.80,
    unit: 'Units',
    lastRestocked: '2024-05-05',
    sku: 'BAK-002'
  },
  {
    name: 'Greek Yogurt 500g',
    category: 'Dairy',
    currentStock: 15,
    minStockThreshold: 30,
    maxStockCapacity: 100,
    unitPrice: 4.20,
    unit: 'Units',
    lastRestocked: '2024-04-28',
    sku: 'DAI-003'
  },
  {
    name: 'Fresh Fuji Apples',
    category: 'Produce',
    currentStock: 85,
    minStockThreshold: 100,
    maxStockCapacity: 500,
    unitPrice: 0.90,
    unit: 'Kg',
    lastRestocked: '2024-05-08',
    sku: 'PRO-004'
  },
  {
    name: 'Sparkling Water 500ml',
    category: 'Beverages',
    currentStock: 300,
    minStockThreshold: 150,
    maxStockCapacity: 1000,
    unitPrice: 1.20,
    unit: 'Units',
    lastRestocked: '2024-05-02',
    sku: 'BEV-005'
  },
  {
    name: 'Himalayan Pink Salt',
    category: 'Pantry',
    currentStock: 50,
    minStockThreshold: 20,
    maxStockCapacity: 200,
    unitPrice: 4.99,
    unit: 'Units',
    lastRestocked: '2024-05-10',
    sku: 'PAN-101'
  },
  {
    name: 'Avocado Bag (5 count)',
    category: 'Produce',
    currentStock: 12,
    minStockThreshold: 25,
    maxStockCapacity: 60,
    unitPrice: 6.50,
    unit: 'Bags',
    lastRestocked: '2024-05-11',
    sku: 'PRO-202'
  },
  {
    name: 'Cold Brew Coffee 1L',
    category: 'Beverages',
    currentStock: 30,
    minStockThreshold: 15,
    maxStockCapacity: 80,
    unitPrice: 7.25,
    unit: 'Units',
    lastRestocked: '2024-05-09',
    sku: 'BEV-303'
  },
  {
    name: 'Dark Chocolate 70%',
    category: 'Snacks',
    currentStock: 150,
    minStockThreshold: 50,
    maxStockCapacity: 300,
    unitPrice: 3.99,
    unit: 'Bars',
    lastRestocked: '2024-05-07',
    sku: 'SNA-404'
  },
  {
    name: 'Extra Virgin Olive Oil',
    category: 'Pantry',
    currentStock: 22,
    minStockThreshold: 10,
    maxStockCapacity: 50,
    unitPrice: 15.99,
    unit: 'Bottles',
    lastRestocked: '2024-05-05',
    sku: 'PAN-505'
  },
  {
    name: 'Quinoa 500g',
    category: 'Pantry',
    currentStock: 35,
    minStockThreshold: 15,
    maxStockCapacity: 80,
    unitPrice: 5.50,
    unit: 'Units',
    lastRestocked: '2024-05-10',
    sku: 'PAN-606'
  },
  {
    name: 'Peanut Butter 400g',
    category: 'Pantry',
    currentStock: 42,
    minStockThreshold: 20,
    maxStockCapacity: 100,
    unitPrice: 3.25,
    unit: 'Units',
    lastRestocked: '2024-05-08',
    sku: 'PAN-707'
  },
  {
    name: 'Basmati Rice 5kg',
    category: 'Pantry',
    currentStock: 18,
    minStockThreshold: 10,
    maxStockCapacity: 40,
    unitPrice: 12.99,
    unit: 'Bags',
    lastRestocked: '2024-05-01',
    sku: 'PAN-808'
  },
  {
    name: 'Dishwasher Pods (30ct)',
    category: 'Household',
    currentStock: 25,
    minStockThreshold: 15,
    maxStockCapacity: 60,
    unitPrice: 9.99,
    unit: 'Packs',
    lastRestocked: '2024-05-05',
    sku: 'HOU-101'
  },
  {
    name: 'Paper Towels (6 pack)',
    category: 'Household',
    currentStock: 14,
    minStockThreshold: 10,
    maxStockCapacity: 40,
    unitPrice: 8.50,
    unit: 'Units',
    lastRestocked: '2024-05-09',
    sku: 'HOU-202'
  },
  {
    name: 'Almond Breeze 1L',
    category: 'Dairy',
    currentStock: 60,
    minStockThreshold: 30,
    maxStockCapacity: 120,
    unitPrice: 2.99,
    unit: 'Units',
    lastRestocked: '2024-05-11',
    sku: 'DAI-404'
  },
  {
    name: 'Mixed Nuts 200g',
    category: 'Snacks',
    currentStock: 85,
    minStockThreshold: 25,
    maxStockCapacity: 150,
    unitPrice: 6.99,
    unit: 'Units',
    lastRestocked: '2024-05-06',
    sku: 'SNA-505'
  },
  {
    name: 'Potato Chips 150g',
    category: 'Snacks',
    currentStock: 110,
    minStockThreshold: 40,
    maxStockCapacity: 200,
    unitPrice: 2.50,
    unit: 'Bags',
    lastRestocked: '2024-05-10',
    sku: 'SNA-606'
  },
  {
    name: 'Laundry Detergent 3L',
    category: 'Household',
    currentStock: 9,
    minStockThreshold: 10,
    maxStockCapacity: 30,
    unitPrice: 14.50,
    unit: 'Bottles',
    lastRestocked: '2024-05-02',
    sku: 'HOU-303'
  },
  {
    name: 'Granola Bars (12ct)',
    category: 'Snacks',
    currentStock: 48,
    minStockThreshold: 20,
    maxStockCapacity: 100,
    unitPrice: 5.99,
    unit: 'Packs',
    lastRestocked: '2024-05-04',
    sku: 'SNA-707'
  },
  {
    name: 'Frozen Pizza Pepperoni',
    category: 'Frozen',
    currentStock: 30,
    minStockThreshold: 15,
    maxStockCapacity: 60,
    unitPrice: 8.99,
    unit: 'Units',
    lastRestocked: '2024-05-08',
    sku: 'FRO-101'
  },
  {
    name: 'Frozen Mixed Veggies 1kg',
    category: 'Frozen',
    currentStock: 45,
    minStockThreshold: 20,
    maxStockCapacity: 80,
    unitPrice: 4.50,
    unit: 'Bags',
    lastRestocked: '2024-05-05',
    sku: 'FRO-202'
  },
  {
    name: 'Vanilla Ice Cream 2L',
    category: 'Frozen',
    currentStock: 22,
    minStockThreshold: 10,
    maxStockCapacity: 40,
    unitPrice: 6.99,
    unit: 'Tubs',
    lastRestocked: '2024-05-10',
    sku: 'FRO-303'
  },
  {
    name: 'Chicken Breast 1kg',
    category: 'Meat',
    currentStock: 18,
    minStockThreshold: 15,
    maxStockCapacity: 50,
    unitPrice: 12.50,
    unit: 'Kg',
    lastRestocked: '2024-05-11',
    sku: 'MEA-101'
  },
  {
    name: 'Ground Beef 500g',
    category: 'Meat',
    currentStock: 25,
    minStockThreshold: 20,
    maxStockCapacity: 60,
    unitPrice: 7.99,
    unit: 'Units',
    lastRestocked: '2024-05-11',
    sku: 'MEA-202'
  },
  {
    name: 'Fresh Salmon Fillet',
    category: 'Meat',
    currentStock: 10,
    minStockThreshold: 12,
    maxStockCapacity: 30,
    unitPrice: 22.00,
    unit: 'Kg',
    lastRestocked: '2024-05-11',
    sku: 'MEA-303'
  },
  {
    name: 'Shampoo 500ml',
    category: 'Personal Care',
    currentStock: 40,
    minStockThreshold: 20,
    maxStockCapacity: 100,
    unitPrice: 5.50,
    unit: 'Bottles',
    lastRestocked: '2024-05-01',
    sku: 'PER-101'
  },
  {
    name: 'Toothpaste 150g',
    category: 'Personal Care',
    currentStock: 65,
    minStockThreshold: 30,
    maxStockCapacity: 150,
    unitPrice: 3.25,
    unit: 'Units',
    lastRestocked: '2024-05-03',
    sku: 'PER-202'
  },
  {
    name: 'Toilet Paper (12 pack)',
    category: 'Household',
    currentStock: 32,
    minStockThreshold: 15,
    maxStockCapacity: 80,
    unitPrice: 12.99,
    unit: 'Packs',
    lastRestocked: '2024-05-09',
    sku: 'HOU-404'
  },
  {
    name: 'All-Purpose Cleaner',
    category: 'Household',
    currentStock: 28,
    minStockThreshold: 10,
    maxStockCapacity: 50,
    unitPrice: 4.50,
    unit: 'Bottles',
    lastRestocked: '2024-05-06',
    sku: 'HOU-505'
  },
  {
    name: 'Spaghetti 500g',
    category: 'Pantry',
    currentStock: 90,
    minStockThreshold: 40,
    maxStockCapacity: 200,
    unitPrice: 1.50,
    unit: 'Units',
    lastRestocked: '2024-05-07',
    sku: 'PAN-909'
  },
  {
    name: 'Tomato Sauce 400g',
    category: 'Pantry',
    currentStock: 120,
    minStockThreshold: 50,
    maxStockCapacity: 250,
    unitPrice: 2.20,
    unit: 'Cans',
    lastRestocked: '2024-05-07',
    sku: 'PAN-010'
  },
  {
    name: 'Frozen Lasagna 1kg',
    category: 'Frozen',
    currentStock: 15,
    minStockThreshold: 10,
    maxStockCapacity: 40,
    unitPrice: 12.99,
    unit: 'Units',
    lastRestocked: '2024-05-01',
    sku: 'FRO-404'
  },
  {
    name: 'Fish Sticks (30ct)',
    category: 'Frozen',
    currentStock: 28,
    minStockThreshold: 15,
    maxStockCapacity: 60,
    unitPrice: 7.50,
    unit: 'Packs',
    lastRestocked: '2024-05-04',
    sku: 'FRO-505'
  },
  {
    name: 'Sirloin Steak (2 pack)',
    category: 'Meat',
    currentStock: 12,
    minStockThreshold: 10,
    maxStockCapacity: 25,
    unitPrice: 18.99,
    unit: 'Packs',
    lastRestocked: '2024-05-11',
    sku: 'MEA-404'
  },
  {
    name: 'Pork Chops 500g',
    category: 'Meat',
    currentStock: 20,
    minStockThreshold: 15,
    maxStockCapacity: 40,
    unitPrice: 9.50,
    unit: 'Units',
    lastRestocked: '2024-05-10',
    sku: 'MEA-505'
  },
  {
    name: 'Body Wash 400ml',
    category: 'Personal Care',
    currentStock: 35,
    minStockThreshold: 15,
    maxStockCapacity: 80,
    unitPrice: 6.25,
    unit: 'Bottles',
    lastRestocked: '2024-05-05',
    sku: 'PER-303'
  },
  {
    name: 'Hand Soap Refill 1L',
    category: 'Personal Care',
    currentStock: 50,
    minStockThreshold: 20,
    maxStockCapacity: 120,
    unitPrice: 4.99,
    unit: 'Bottles',
    lastRestocked: '2024-05-08',
    sku: 'PER-404'
  },
  {
    name: 'Kitchen Sponges (4 pack)',
    category: 'Household',
    currentStock: 60,
    minStockThreshold: 20,
    maxStockCapacity: 150,
    unitPrice: 3.50,
    unit: 'Packs',
    lastRestocked: '2024-05-02',
    sku: 'HOU-606'
  },
  {
    name: 'Aluminum Foil 25m',
    category: 'Household',
    currentStock: 18,
    minStockThreshold: 10,
    maxStockCapacity: 50,
    unitPrice: 5.20,
    unit: 'Rolls',
    lastRestocked: '2024-05-01',
    sku: 'HOU-707'
  },
  {
    name: 'Honey 500g',
    category: 'Pantry',
    currentStock: 25,
    minStockThreshold: 15,
    maxStockCapacity: 60,
    unitPrice: 8.50,
    unit: 'Units',
    lastRestocked: '2024-05-09',
    sku: 'PAN-011'
  },
  {
    name: 'Instant Noodles (Case of 12)',
    category: 'Pantry',
    currentStock: 40,
    minStockThreshold: 20,
    maxStockCapacity: 100,
    unitPrice: 11.99,
    unit: 'Cases',
    lastRestocked: '2024-05-05',
    sku: 'PAN-012'
  }
];
