import React, { useState, useEffect } from 'react';
import { AdminSidebar } from './components/AdminSidebar';
import { AdminNavbar } from './components/AdminNavbar';
import { Dashboard } from './pages/Dashboard';
import { OrdersManager } from './pages/OrdersManager';
import { ProductsManager } from './pages/ProductsManager';
import { CombosManager } from './pages/CombosManager';
import { ComboEditorPage } from './pages/ComboEditorPage';
import { CategoriesManager } from './pages/CategoriesManager';
import { HomepageManager } from './pages/HomepageManager';
import { DeliveryManager } from './pages/DeliveryManager';
import { PaymentManager } from './pages/PaymentManager';
import { CustomersManager } from './pages/CustomersManager';
import { SettingsManager } from './pages/SettingsManager';
import { FooterManager } from './pages/FooterManager';
import { api } from './services/api';
import { Order, Product, Combo, Category, WebsiteSettings } from './types';

interface GoldenSeedAdminAppProps {
  onSwitchToStore?: () => void;
}

export const GoldenSeedAdminApp: React.FC<GoldenSeedAdminAppProps> = ({ onSwitchToStore }) => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [combos, setCombos] = useState<Combo[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [settings, setSettings] = useState<WebsiteSettings | null>(null);
  const [selectedOrderForModal, setSelectedOrderForModal] = useState<Order | null>(null);

  const loadAllData = async () => {
    try {
      const [o, p, c, cats, s] = await Promise.all([
        api.getOrders(),
        api.getProducts(),
        api.getCombos(),
        api.getCategories(),
        api.getSettings()
      ]);
      setOrders(o);
      setProducts(p);
      setCombos(c);
      setCategories(cats);
      setSettings(s);
    } catch (err) {
      console.error('Error loading admin data:', err);
    }
  };

  // Real-time Firestore sync & initial load
  useEffect(() => {
    loadAllData();

    const unsubOrders = api.subscribeToOrders((newOrders) => setOrders(newOrders));
    const unsubProducts = api.subscribeToProducts((newProds) => setProducts(newProds));
    const unsubCombos = api.subscribeToCombos((newCombos) => setCombos(newCombos));
    const unsubCats = api.subscribeToCategories((newCats) => setCategories(newCats));
    const unsubSettings = api.subscribeToSettings((newSettings) => setSettings(newSettings));

    const handleDataChange = () => {
      loadAllData();
    };
    window.addEventListener('golden_seed_data_changed', handleDataChange);

    return () => {
      unsubOrders();
      unsubProducts();
      unsubCombos();
      unsubCats();
      unsubSettings();
      window.removeEventListener('golden_seed_data_changed', handleDataChange);
    };
  }, []);

  const tabTitles: { [key: string]: string } = {
    dashboard: 'এডমিন ড্যাশবোর্ড',
    orders: 'অর্ডার ব্যবস্থাপনা',
    'combo-25': '১. ২৫ প্রকার মেগা কম্বো এডিটর',
    'combo-10': '২. স্পেশাল কম্বো এডিটর (১৪ প্রকার)',
    products: '৩. সিঙ্গেল বীজ পণ্য ব্যবস্থাপনা',
    combos: 'সকল কম্বো প্যাকেজ',
    categories: 'ক্যাটাগরি সমূহ',
    homepage: 'হোমপেজ ও ব্যানার কন্টেন্ট',
    delivery: 'ডেলিভারি চার্জ সেটিংস',
    payment: 'পেমেন্ট গেটওয়ে সেটিংস',
    footer: 'ফুটার ও ট্রাস্ট বার এডিটর',
    customers: 'গ্রাহক ডিরেক্টরি',
    settings: 'স্টোর সেটিংস',
  };

  return (
    <div className="min-h-screen bg-gray-100 flex font-sans antialiased text-gray-800">
      
      {/* Sidebar */}
      <AdminSidebar
        currentTab={currentTab}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          setSelectedOrderForModal(null);
        }}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        onSwitchToStore={onSwitchToStore}
      />

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        
        {/* Navbar */}
        <AdminNavbar
          title={tabTitles[currentTab] || 'Golden Seed Admin'}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          onRefreshData={loadAllData}
          onSwitchToStore={onSwitchToStore}
        />

        {/* Tab Pages */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto max-w-7xl w-full">
          {currentTab === 'dashboard' && (
            <Dashboard
              orders={orders}
              products={products}
              combos={combos}
              onSelectTab={setCurrentTab}
              onViewOrder={(ord) => {
                setSelectedOrderForModal(ord);
                setCurrentTab('orders');
              }}
            />
          )}

          {currentTab === 'orders' && (
            <OrdersManager
              orders={orders}
              onRefresh={loadAllData}
              selectedOrderForModal={selectedOrderForModal}
            />
          )}

          {currentTab === 'combo-25' && (
            <ComboEditorPage
              comboId="combo-25"
              defaultTitle="২৫ প্রকার সবজি বীজ কম্বো"
              defaultCount={25}
              combos={combos}
              products={products}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'combo-10' && (
            <ComboEditorPage
              comboId="combo-10"
              defaultTitle="১০ প্রকার সবজি বীজ কম্বো"
              defaultCount={10}
              combos={combos}
              products={products}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'products' && (
            <ProductsManager
              products={products}
              categories={categories}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'combos' && (
            <CombosManager
              combos={combos}
              products={products}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'categories' && (
            <CategoriesManager
              categories={categories}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'homepage' && settings && (
            <HomepageManager
              settings={settings}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'delivery' && settings && (
            <DeliveryManager
              settings={settings}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'payment' && settings && (
            <PaymentManager
              settings={settings}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'footer' && settings && (
            <FooterManager
              settings={settings}
              onRefresh={loadAllData}
            />
          )}

          {currentTab === 'customers' && (
            <CustomersManager
              orders={orders}
            />
          )}

          {currentTab === 'settings' && settings && (
            <SettingsManager
              settings={settings}
              onRefresh={loadAllData}
            />
          )}
        </main>

      </div>

    </div>
  );
};

export default GoldenSeedAdminApp;
