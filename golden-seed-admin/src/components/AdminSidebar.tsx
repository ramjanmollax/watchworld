import React from 'react';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Layers, 
  Tag, 
  Home, 
  Truck, 
  CreditCard, 
  Users, 
  Settings, 
  Sprout, 
  Sparkles,
  SlidersHorizontal,
  X
} from 'lucide-react';

interface AdminSidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onSwitchToStore?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  currentTab,
  onSelectTab,
  isOpen,
  onClose,
  onSwitchToStore
}) => {
  const menuItems = [
    { id: 'dashboard', label: 'ড্যাশবোর্ড', icon: LayoutDashboard },
    { id: 'orders', label: 'অর্ডার সমূহ', icon: ShoppingBag },
    
    // 3 Distinct Section Edit Options
    { id: 'combo-25', label: '১. ২৫ প্রকার কম্বো', icon: Sparkles, badge: 'সেকশন ১' },
    { id: 'combo-10', label: '২. স্পেশাল কম্বো (১৪ প্রকার)', icon: Layers, badge: 'সেকশন ২' },
    { id: 'products', label: '৩. সিঙ্গেল বীজ পণ্য', icon: Package, badge: 'সেকশন ৩' },
    
    { id: 'categories', label: 'ক্যাটাগরি সমূহ', icon: Tag },
    { id: 'homepage', label: 'হোমপেজ ও ব্যানার', icon: Home },
    { id: 'delivery', label: 'ডেলিভারি সেটিংস', icon: Truck },
    { id: 'payment', label: 'পেমেন্ট সেটিংস', icon: CreditCard },
    { id: 'footer', label: 'ফুটার কন্ট্রোল', icon: SlidersHorizontal },
    { id: 'customers', label: 'গ্রাহক তালিকা', icon: Users },
    { id: 'settings', label: 'সাধারণ সেটিংস', icon: Settings },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        
        {/* Sidebar Header */}
        <div>
          <div className="h-16 flex items-center justify-between px-5 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-white text-base leading-none">Golden Seed</span>
                <span className="text-[10px] text-emerald-400 font-medium tracking-wider uppercase mt-1">Admin Panel</span>
              </div>
            </div>
            
            <button 
              onClick={onClose}
              className="lg:hidden text-slate-400 hover:text-white p-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Items */}
          <nav className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    onSelectTab(item.id);
                    onClose();
                  }}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                      : 'text-slate-400 hover:bg-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom User / Storefront shortcut */}
        <div className="p-3 border-t border-slate-800 space-y-2">
          {onSwitchToStore && (
            <button
              onClick={onSwitchToStore}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-slate-800 text-emerald-400 hover:bg-slate-700 text-xs font-semibold transition"
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>ওয়েবসাইট ভিজিট করুন</span>
            </button>
          )}

          <div className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-400 bg-slate-950/40 rounded-xl">
            <div className="w-7 h-7 rounded-full bg-emerald-700 text-white font-bold flex items-center justify-center shrink-0">
              A
            </div>
            <div className="truncate">
              <p className="font-semibold text-slate-200 truncate">এডমিন ম্যানেজার</p>
              <p className="text-[10px] text-emerald-400 font-medium">অনলাইন • স্টোর সক্রিয়</p>
            </div>
          </div>
        </div>

      </aside>
    </>
  );
};
