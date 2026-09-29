import React from 'react';
import { 
  ShoppingBag, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Package, 
  Layers, 
  Eye, 
  ArrowUpRight,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';
import { Order, Product, Combo } from '../types';
import { formatPrice, formatBanglaDate, toBanglaDigits } from '../utils/formatters';

interface DashboardProps {
  orders: Order[];
  products: Product[];
  combos: Combo[];
  onSelectTab: (tab: string) => void;
  onViewOrder: (order: Order) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  orders,
  products,
  combos,
  onSelectTab,
  onViewOrder
}) => {
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const confirmedOrders = orders.filter(o => o.status === 'confirmed').length;
  const shippedOrders = orders.filter(o => o.status === 'shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'delivered').length;
  
  const totalSales = orders
    .filter(o => o.status !== 'cancelled')
    .reduce((sum, o) => sum + o.grandTotal, 0);

  const lowStockProducts = products.filter(p => p.stock < 20);

  const statusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">পেন্ডিং</span>;
      case 'confirmed':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800">কনফার্মড</span>;
      case 'shipped':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800">শিপড</span>;
      case 'delivered':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">ডেলিভারিড</span>;
      case 'cancelled':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">বাতিল</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* 6 Stats Overview Cards matching reference layout */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* 1. Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">মোট অর্ডার</span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{toBanglaDigits(totalOrders)}</p>
        </div>

        {/* 2. Pending Orders */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">পেন্ডিং অর্ডার</span>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-amber-600">{toBanglaDigits(pendingOrders)}</p>
        </div>

        {/* 3. Delivered */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">ডেলিভারিড</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <CheckCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{toBanglaDigits(deliveredOrders)}</p>
        </div>

        {/* 4. Total Sales */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">মোট সেলস</span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-lg sm:text-xl font-bold text-emerald-800 truncate">{formatPrice(totalSales)}</p>
        </div>

        {/* 5. Active Seeds */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">চলতি বীজ</span>
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{toBanglaDigits(products.length)}</p>
        </div>

        {/* 6. Active Combos */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-2">
          <div className="flex items-center justify-between text-gray-500">
            <span className="text-xs font-medium">কম্বো বীজ</span>
            <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-900">{toBanglaDigits(combos.length)}</p>
        </div>
      </div>

      {/* Low stock alert banner if any */}
      {lowStockProducts.length > 0 && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <span className="text-sm font-semibold text-amber-900">
              {toBanglaDigits(lowStockProducts.length)}টি বীজের স্টক ফুরিয়ে আসছে!
            </span>
          </div>
          <button
            onClick={() => onSelectTab('products')}
            className="text-xs font-bold text-amber-900 hover:underline"
          >
            পণ্য তালিকা দেখুন →
          </button>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-bold text-gray-900">সাম্প্রতিক অর্ডারসমূহ</h2>
            <p className="text-xs text-gray-500 mt-0.5">গ্রাহকদের সর্বশেষ অর্ডার তালিকা</p>
          </div>
          <button
            onClick={() => onSelectTab('orders')}
            className="text-xs sm:text-sm font-semibold text-emerald-700 hover:underline inline-flex items-center gap-1"
          >
            <span>সকল অর্ডার</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">অর্ডার কোড</th>
                <th className="px-6 py-3.5">তারিখ</th>
                <th className="px-6 py-3.5">গ্রাহকের নাম</th>
                <th className="px-6 py-3.5">মোবাইল</th>
                <th className="px-6 py-3.5">জেলা</th>
                <th className="px-6 py-3.5">মোট মূল্য</th>
                <th className="px-6 py-3.5">স্ট্যাটাস</th>
                <th className="px-6 py-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    কোনো সাম্প্রতিক অর্ডার নেই
                  </td>
                </tr>
              ) : (
                orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 font-bold text-emerald-800 whitespace-nowrap">
                      {ord.orderCode}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500">
                      {formatBanglaDate(ord.createdAt)}
                    </td>
                    <td className="px-6 py-4 font-semibold text-gray-900 whitespace-nowrap">
                      {ord.customerName}
                    </td>
                    <td className="px-6 py-4 text-xs whitespace-nowrap">
                      {ord.customerPhone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {ord.district}
                    </td>
                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap">
                      {formatPrice(ord.grandTotal)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {statusBadge(ord.status)}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <button
                        onClick={() => onViewOrder(ord)}
                        className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                        title="বিস্তারিত দেখুন"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
