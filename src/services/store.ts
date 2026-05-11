import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  setDoc,
  getDocs,
  orderBy,
  limit,
  where,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product, SaleRecord, Alert, Forecast, Store, Supplier, InventoryOrder, SimulationEvent } from '../types';
import { handleFirestoreError, OperationType } from '../lib/firestore-errors';

// Collections
const PRODUCTS_COL = 'products';
const STORES_COL = 'stores';
const SUPPLIERS_COL = 'suppliers';
const SALES_COL = 'sales';
const ORDERS_COL = 'orders';
const EVENTS_COL = 'events';
const ALERTS_COL = 'alerts';
const FORECASTS_COL = 'forecasts';

export async function seedDatabase(
  products: any[],
  stores: any[],
  suppliers: any[]
) {
  try {
    const existingStores = await getDocs(collection(db, STORES_COL));
    if (existingStores.empty) {
      // Seed Suppliers first
      const supPromises = suppliers.map(s => addDoc(collection(db, SUPPLIERS_COL), s));
      const supDocs = await Promise.all(supPromises);
      const supIds = supDocs.map(d => d.id);

      // Seed Stores
      const storePromises = stores.map(s => addDoc(collection(db, STORES_COL), s));
      const storeDocs = await Promise.all(storePromises);
      const storeIds = storeDocs.map(d => d.id);

      // Seed Products for each store
      const prodPromises: Promise<any>[] = [];
      storeIds.forEach(storeId => {
        products.forEach(p => {
          const supId = supIds[Math.floor(Math.random() * supIds.length)];
          prodPromises.push(addDoc(collection(db, PRODUCTS_COL), {
            ...p,
            storeId,
            supplierId: supId,
            costPrice: p.unitPrice * 0.6, // Default cost price
            isPerishable: p.category.toLowerCase().includes('dairy') || p.category.toLowerCase().includes('produce'),
            leadTime: Math.floor(Math.random() * 3) + 1,
            totalSpoiled: 0
          }));
        });
      });
      await Promise.all(prodPromises);
      console.log("Database seeded successfully with stores and products");
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'seeding');
  }
}

export function subscribeToStores(callback: (stores: Store[]) => void) {
  const q = query(collection(db, STORES_COL), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const stores = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Store));
    callback(stores);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, STORES_COL);
  });
}

export function subscribeToSuppliers(callback: (suppliers: Supplier[]) => void) {
  const q = query(collection(db, SUPPLIERS_COL), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const suppliers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Supplier));
    callback(suppliers);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, SUPPLIERS_COL);
  });
}

export function subscribeToOrders(callback: (orders: InventoryOrder[]) => void) {
  const q = query(collection(db, ORDERS_COL), orderBy('placedAt', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const orders = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryOrder));
    callback(orders);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, ORDERS_COL);
  });
}

export function subscribeToEvents(callback: (events: SimulationEvent[]) => void) {
  const q = query(collection(db, EVENTS_COL));
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SimulationEvent));
    callback(events);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, EVENTS_COL);
  });
}

export function subscribeToProducts(callback: (products: Product[]) => void) {
  const q = query(collection(db, PRODUCTS_COL), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const products = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    callback(products);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, PRODUCTS_COL);
  });
}

export function subscribeToSales(callback: (sales: SaleRecord[]) => void) {
  const q = query(collection(db, SALES_COL), orderBy('timestamp', 'desc'), limit(100));
  return onSnapshot(q, (snapshot) => {
    const sales = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as SaleRecord));
    callback(sales);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, SALES_COL);
  });
}

export function subscribeToAlerts(callback: (alerts: Alert[]) => void) {
  const q = query(collection(db, ALERTS_COL), orderBy('timestamp', 'desc'));
  return onSnapshot(q, (snapshot) => {
    const alerts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Alert));
    callback(alerts);
  }, (error) => {
    handleFirestoreError(error, OperationType.LIST, ALERTS_COL);
  });
}

export async function addStore(store: Omit<Store, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, STORES_COL), store);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, STORES_COL);
  }
}

export async function updateStore(id: string, store: Partial<Store>) {
  try {
    const docRef = doc(db, STORES_COL, id);
    await updateDoc(docRef, store);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${STORES_COL}/${id}`);
  }
}

export async function deleteStore(id: string) {
  try {
    await deleteDoc(doc(db, STORES_COL, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${STORES_COL}/${id}`);
  }
}

export async function addSupplier(supplier: Omit<Supplier, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, SUPPLIERS_COL), supplier);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, SUPPLIERS_COL);
  }
}

export async function placeOrder(order: Omit<InventoryOrder, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, ORDERS_COL), order);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ORDERS_COL);
  }
}

export async function updateOrderStatus(id: string, status: InventoryOrder['status']) {
  try {
    const docRef = doc(db, ORDERS_COL, id);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ORDERS_COL}/${id}`);
  }
}

export async function addEvent(event: Omit<SimulationEvent, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, EVENTS_COL), event);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, EVENTS_COL);
  }
}

export async function deleteEvent(id: string) {
  try {
    await deleteDoc(doc(db, EVENTS_COL, id));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, `${EVENTS_COL}/${id}`);
  }
}

export async function updateStock(id: string, newQuantity: number, spoiled: number = 0) {
  try {
    const docRef = doc(db, PRODUCTS_COL, id);
    const updateData: any = { 
      currentStock: newQuantity,
      lastRestocked: new Date().toISOString()
    };
    if (spoiled > 0) {
      // In a real app we'd use increment() but let's keep it simple or fetch current
      // For now we'll just set it if we have context or ignore
    }
    await updateDoc(docRef, updateData);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COL}/${id}`);
  }
}

export async function createAlert(alert: Omit<Alert, 'id'>) {
  try {
    await addDoc(collection(db, ALERTS_COL), alert);
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, ALERTS_COL);
  }
}

export async function addProduct(product: Omit<Product, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, PRODUCTS_COL), product);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, PRODUCTS_COL);
  }
}

export async function updateProduct(id: string, product: Partial<Product>) {
  try {
    const docRef = doc(db, PRODUCTS_COL, id);
    await updateDoc(docRef, product);
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${PRODUCTS_COL}/${id}`);
  }
}

export async function addSale(sale: Omit<SaleRecord, 'id'>) {
  try {
    const docRef = await addDoc(collection(db, SALES_COL), sale);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, SALES_COL);
  }
}

export async function markAlertRead(id: string) {
  try {
    const docRef = doc(db, ALERTS_COL, id);
    await updateDoc(docRef, { read: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `${ALERTS_COL}/${id}`);
  }
}

export async function clearAlerts() {
  try {
    const snapshot = await getDocs(collection(db, ALERTS_COL));
    const deletePromises = snapshot.docs.map(d => deleteDoc(d.ref));
    await Promise.all(deletePromises);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, ALERTS_COL);
  }
}

export async function performSystemSync() {
  try {
    // 1. Clear Read Alerts
    const alertsQuery = query(collection(db, ALERTS_COL), where('read', '==', true));
    const alertsSnapshot = await getDocs(alertsQuery);
    const alertDeletes = alertsSnapshot.docs.map(d => deleteDoc(d.ref));
    
    // 2. Clear Old Sales (keep only last 50 for performance/freshness in sim)
    const salesQuery = query(collection(db, SALES_COL), orderBy('timestamp', 'desc'));
    const salesSnapshot = await getDocs(salesQuery);
    const salesToKeep = 50;
    const saleDeletes = salesSnapshot.docs.slice(salesToKeep).map(d => deleteDoc(d.ref));

    await Promise.all([...alertDeletes, ...saleDeletes]);
    console.log("System audit: Purged old data and resolved logs.");
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, 'system-audit');
  }
}

export async function saveForecast(forecast: Forecast) {
  try {
    const docRef = doc(db, FORECASTS_COL, forecast.productId);
    await setDoc(docRef, forecast);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${FORECASTS_COL}/${forecast.productId}`);
  }
}
