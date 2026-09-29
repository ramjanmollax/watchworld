import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  setDoc, 
  deleteDoc, 
  updateDoc, 
  onSnapshot, 
  query 
} from 'firebase/firestore';
import { db } from './firebase';
import { uploadStoreImage } from './storage';
import { Product, Combo, Category, Order, WebsiteSettings } from '../types';

const COLLECTIONS = {
  PRODUCTS: 'products',
  COMBOS: 'combos',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  SETTINGS: 'settings',
  CUSTOMERS: 'customers'
};

const SETTINGS_DOC_ID = 'store_settings';

export const DEFAULT_SETTINGS: WebsiteSettings = {
  websiteName: 'Golden Seed',
  tagline: 'আপনার সবুজ স্বপ্নের সাথী',
  heroHeadline: 'ছাদবাগান ও মাঠ ফসলের জন্য সেরা বীজ',
  heroSubheadline: 'উন্নত জাতের হাইব্রিড ও দেশি বীজ সরাসরি আপনার দোরগোড়ায়।',
  heroCtaText: 'পণ্য দেখুন',
  heroBgImage: 'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&q=80&w=1920',
  heroDisplayMode: 'cover',
  heroOverlay: 'light',
  phone: '',
  email: '',
  address: '',
  socialLinks: {
    facebook: '',
    youtube: '',
    instagram: '',
    whatsapp: ''
  },
  deliveryCharges: {
    insideDhaka: 60,
    outsideDhaka: 120,
    freeDeliveryThreshold: 1000,
    isFreeDeliveryActive: false
  },
  paymentSettings: {
    codEnabled: true,
    codNote: 'পণ্য হাতে পেয়ে মূল্য পরিশোধ করুন।',
    bkashEnabled: true,
    bkashNumber: '',
    bkashType: 'personal',
    bkashInstructions: 'বিকাশ সেন্ড মানি বা পেমেন্ট করে নিচের ঘরে ট্রানজেকশন আইডি (TrxID) ও নম্বর দিন।',
    nagadEnabled: true,
    nagadNumber: '',
    nagadType: 'personal',
    nagadInstructions: 'নগদ সেন্ড মানি করে নিচের ঘরে ট্রানজেকশন আইডি (TrxID) ও নম্বর দিন।'
  },
  noticeBanner: {
    enabled: false,
    text: ''
  },
  searchEnabled: false
};

export const api = {
  // PRODUCTS
  async getProducts(): Promise<Product[]> {
    try {
      const q = query(collection(db, COLLECTIONS.PRODUCTS));
      const snap = await getDocs(q);
      if (snap.empty) {
        return [];
      }
      const list: Product[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id } as Product));
      list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      return list;
    } catch (err) {
      console.error('Error getting products from Firestore:', err);
      return [];
    }
  },

  async getProductById(id: string): Promise<Product | null> {
    try {
      const d = await getDoc(doc(db, COLLECTIONS.PRODUCTS, id));
      if (d.exists()) {
        return { ...d.data(), id: d.id } as Product;
      }
      return null;
    } catch {
      return null;
    }
  },

  async saveProduct(product: Product): Promise<Product> {
    const prodId = product.id || 'prod-' + Date.now();
    const updatedProd: Product = {
      ...product,
      id: prodId,
      updatedAt: new Date().toISOString()
    } as Product;

    await setDoc(doc(db, COLLECTIONS.PRODUCTS, prodId), updatedProd);
    window.dispatchEvent(new Event('golden_seed_data_changed'));
    return updatedProd;
  },

  async deleteProduct(id: string): Promise<boolean> {
    await deleteDoc(doc(db, COLLECTIONS.PRODUCTS, id));
    window.dispatchEvent(new Event('golden_seed_data_changed'));
    return true;
  },

  subscribeToProducts(callback: (products: Product[]) => void): () => void {
    const q = query(collection(db, COLLECTIONS.PRODUCTS));
    return onSnapshot(q, (snap) => {
      const list: Product[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id } as Product));
      list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      callback(list);
    }, (error) => {
      console.warn('Realtime products listener error:', error);
      callback([]);
    });
  },

  // COMBOS
  async getCombos(): Promise<Combo[]> {
    try {
      const q = query(collection(db, COLLECTIONS.COMBOS));
      const snap = await getDocs(q);
      if (snap.empty) {
        return [];
      }
      const list: Combo[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id } as Combo));
      list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      return list;
    } catch (err) {
      console.error('Error getting combos from Firestore:', err);
      return [];
    }
  },

  async getComboById(id: string): Promise<Combo | null> {
    try {
      const d = await getDoc(doc(db, COLLECTIONS.COMBOS, id));
      if (d.exists()) {
        return { ...d.data(), id: d.id } as Combo;
      }
      return null;
    } catch {
      return null;
    }
  },

  async saveCombo(combo: Combo): Promise<Combo> {
    const comboId = combo.id || 'combo-' + Date.now();
    const updatedCombo: Combo = {
      ...combo,
      id: comboId,
      updatedAt: new Date().toISOString()
    } as Combo;

    await setDoc(doc(db, COLLECTIONS.COMBOS, comboId), updatedCombo);
    window.dispatchEvent(new Event('golden_seed_data_changed'));
    return updatedCombo;
  },

  async deleteCombo(id: string): Promise<boolean> {
    await deleteDoc(doc(db, COLLECTIONS.COMBOS, id));
    window.dispatchEvent(new Event('golden_seed_data_changed'));
    return true;
  },

  subscribeToCombos(callback: (combos: Combo[]) => void): () => void {
    const q = query(collection(db, COLLECTIONS.COMBOS));
    return onSnapshot(q, (snap) => {
      const list: Combo[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id } as Combo));
      list.sort((a, b) => (a.displayOrder || 0) - (b.displayOrder || 0));
      callback(list);
    }, (error) => {
      console.warn('Realtime combos listener error:', error);
      callback([]);
    });
  },

  // CATEGORIES
  async getCategories(): Promise<Category[]> {
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.CATEGORIES));
      if (snap.empty) {
        return [];
      }
      const list: Category[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id } as Category));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      return list;
    } catch (err) {
      console.error('Error getting categories from Firestore:', err);
      return [];
    }
  },

  async saveCategory(category: Category): Promise<Category> {
    const catId = category.id || 'cat-' + Date.now();
    const updatedCat: Category = {
      ...category,
      id: catId
    };

    await setDoc(doc(db, COLLECTIONS.CATEGORIES, catId), updatedCat);
    window.dispatchEvent(new Event('golden_seed_data_changed'));
    return updatedCat;
  },

  async deleteCategory(id: string): Promise<boolean> {
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, id));
    window.dispatchEvent(new Event('golden_seed_data_changed'));
    return true;
  },

  subscribeToCategories(callback: (categories: Category[]) => void): () => void {
    const q = query(collection(db, COLLECTIONS.CATEGORIES));
    return onSnapshot(q, (snap) => {
      const list: Category[] = [];
      snap.forEach(d => list.push({ ...d.data(), id: d.id } as Category));
      list.sort((a, b) => (a.order || 0) - (b.order || 0));
      callback(list);
    }, (error) => {
      console.warn('Realtime categories listener error:', error);
      callback([]);
    });
  },

  // ORDERS
  async getOrders(): Promise<Order[]> {
    const listMap = new Map<string, Order>();

    // 1. Fetch from Firestore
    try {
      const snap = await getDocs(collection(db, COLLECTIONS.ORDERS));
      snap.forEach(d => {
        listMap.set(d.id, { ...d.data(), id: d.id } as Order);
      });
    } catch (err) {
      console.error('Error getting orders from Firestore:', err);
    }

    // 2. Merge local storage backup if any
    try {
      const localStr = localStorage.getItem('golden_seed_orders_backup');
      if (localStr) {
        const localList: Order[] = JSON.parse(localStr);
        localList.forEach(item => {
          if (!listMap.has(item.id)) {
            listMap.set(item.id, item);
          }
        });
      }
    } catch {}

    const list = Array.from(listMap.values());
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    return list;
  },

  async getOrderById(id: string): Promise<Order | null> {
    try {
      const d = await getDoc(doc(db, COLLECTIONS.ORDERS, id));
      if (d.exists()) {
        return { ...d.data(), id: d.id } as Order;
      }
    } catch {}

    try {
      const localStr = localStorage.getItem('golden_seed_orders_backup');
      if (localStr) {
        const localList: Order[] = JSON.parse(localStr);
        const found = localList.find(o => o.id === id);
        if (found) return found;
      }
    } catch {}

    return null;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'orderCode' | 'createdAt' | 'status'>): Promise<Order> {
    const now = new Date();
    const randNum = Math.floor(100000 + Math.random() * 900000);
    const orderId = 'ord-' + Date.now();
    const orderCode = `#GS-${randNum}`;

    const newOrder: Order = {
      id: orderId,
      orderCode,
      customerName: (orderData.customerName || '').trim(),
      customerPhone: (orderData.customerPhone || '').trim(),
      district: orderData.district || 'সারাদেশ',
      upazilaThana: orderData.upazilaThana || 'হোম ডেলিভারি',
      address: (orderData.address || '').trim(),
      orderNote: orderData.orderNote ? orderData.orderNote.trim() : '',
      items: orderData.items || [],
      subtotal: Number(orderData.subtotal) || 0,
      discount: Number(orderData.discount) || 0,
      deliveryCharge: Number(orderData.deliveryCharge) || 0,
      grandTotal: Number(orderData.grandTotal) || 0,
      paymentMethod: orderData.paymentMethod || 'ক্যাশ অন ডেলিভারি',
      paymentTrxId: orderData.paymentTrxId ? orderData.paymentTrxId.trim() : '',
      paymentPhone: orderData.paymentPhone ? orderData.paymentPhone.trim() : '',
      status: 'pending',
      createdAt: now.toISOString()
    };

    try {
      const localStr = localStorage.getItem('golden_seed_orders_backup');
      const localList: Order[] = localStr ? JSON.parse(localStr) : [];
      localList.unshift(newOrder);
      localStorage.setItem('golden_seed_orders_backup', JSON.stringify(localList.slice(0, 100)));
    } catch {}

    try {
      await setDoc(doc(db, COLLECTIONS.ORDERS, orderId), newOrder);
    } catch (err) {
      console.warn('Firestore admin order save warning:', err);
    }

    window.dispatchEvent(new Event('golden_seed_data_changed'));
    return newOrder;
  },

  async updateOrderStatus(id: string, status: Order['status']): Promise<Order | null> {
    try {
      const ref = doc(db, COLLECTIONS.ORDERS, id);
      await updateDoc(ref, { status, updatedAt: new Date().toISOString() });
      const updated = await getDoc(ref);
      
      // Update local storage backup too
      try {
        const localStr = localStorage.getItem('golden_seed_orders_backup');
        if (localStr) {
          const localList: Order[] = JSON.parse(localStr);
          const idx = localList.findIndex(o => o.id === id);
          if (idx !== -1) {
            localList[idx].status = status;
            localStorage.setItem('golden_seed_orders_backup', JSON.stringify(localList));
          }
        }
      } catch {}

      window.dispatchEvent(new Event('golden_seed_data_changed'));
      if (updated.exists()) {
        return { ...updated.data(), id: updated.id } as Order;
      }
      return null;
    } catch (err) {
      console.error('Error updating order status:', err);
      return null;
    }
  },

  async deleteOrder(id: string): Promise<boolean> {
    try {
      await deleteDoc(doc(db, COLLECTIONS.ORDERS, id));
    } catch {}

    try {
      const localStr = localStorage.getItem('golden_seed_orders_backup');
      if (localStr) {
        const localList: Order[] = JSON.parse(localStr);
        const filtered = localList.filter(o => o.id !== id);
        localStorage.setItem('golden_seed_orders_backup', JSON.stringify(filtered));
      }
    } catch {}

    window.dispatchEvent(new Event('golden_seed_data_changed'));
    return true;
  },

  subscribeToOrders(callback: (orders: Order[]) => void): () => void {
    const q = query(collection(db, COLLECTIONS.ORDERS));
    return onSnapshot(q, (snap) => {
      const listMap = new Map<string, Order>();
      snap.forEach(d => listMap.set(d.id, { ...d.data(), id: d.id } as Order));

      // Also merge local backup
      try {
        const localStr = localStorage.getItem('golden_seed_orders_backup');
        if (localStr) {
          const localList: Order[] = JSON.parse(localStr);
          localList.forEach(item => {
            if (!listMap.has(item.id)) {
              listMap.set(item.id, item);
            }
          });
        }
      } catch {}

      const list = Array.from(listMap.values());
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    }, (error) => {
      console.warn('Realtime orders listener error:', error);
      // Fallback to getOrders
      this.getOrders().then(orders => callback(orders));
    });
  },

  // SETTINGS
  async getSettings(): Promise<WebsiteSettings> {
    try {
      const d = await getDoc(doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID));
      if (d.exists()) {
        const data = d.data() as WebsiteSettings;
        try {
          localStorage.setItem('golden_seed_cached_settings', JSON.stringify(data));
        } catch {}
        return data;
      }
      const cached = localStorage.getItem('golden_seed_cached_settings');
      if (cached) return JSON.parse(cached);
      return DEFAULT_SETTINGS;
    } catch (err) {
      console.error('Error getting settings from Firestore:', err);
      const cached = localStorage.getItem('golden_seed_cached_settings');
      if (cached) return JSON.parse(cached);
      return DEFAULT_SETTINGS;
    }
  },

  async saveSettings(settings: WebsiteSettings): Promise<WebsiteSettings> {
    try {
      localStorage.setItem('golden_seed_cached_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    await setDoc(doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID), settings);
    window.dispatchEvent(new Event('golden_seed_data_changed'));
    return settings;
  },

  subscribeToSettings(callback: (settings: WebsiteSettings) => void): () => void {
    return onSnapshot(doc(db, COLLECTIONS.SETTINGS, SETTINGS_DOC_ID), (snap) => {
      if (snap.exists()) {
        const data = snap.data() as WebsiteSettings;
        try {
          localStorage.setItem('golden_seed_cached_settings', JSON.stringify(data));
        } catch {}
        callback(data);
      } else {
        const cached = localStorage.getItem('golden_seed_cached_settings');
        if (cached) {
          callback(JSON.parse(cached));
        } else {
          callback(DEFAULT_SETTINGS);
        }
      }
    }, (error) => {
      console.warn('Realtime settings listener error:', error);
      const cached = localStorage.getItem('golden_seed_cached_settings');
      if (cached) {
        callback(JSON.parse(cached));
      } else {
        callback(DEFAULT_SETTINGS);
      }
    });
  },

  // IMAGE UPLOADS
  async uploadImage(file: File, folder: string = 'general'): Promise<string> {
    return uploadStoreImage(file, folder);
  }
};
