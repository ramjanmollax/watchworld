import React, { useState } from 'react';
import { 
  Search, 
  Eye, 
  Trash2, 
  Printer, 
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Phone,
  MapPin,
  Clock,
  Filter
} from 'lucide-react';
import { Order, OrderStatus } from '../types';
import { formatPrice, formatBanglaDate, toBanglaDigits } from '../utils/formatters';
import { api } from '../services/api';

interface OrdersManagerProps {
  orders: Order[];
  onRefresh: () => void;
  selectedOrderForModal?: Order | null;
}

export const OrdersManager: React.FC<OrdersManagerProps> = ({
  orders,
  onRefresh,
  selectedOrderForModal
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeModalOrder, setActiveModalOrder] = useState<Order | null>(selectedOrderForModal || null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null);

  const filteredOrders = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const q = searchQuery.toLowerCase().trim();
    const matchQuery = !q ||
      o.orderCode.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.customerPhone.includes(q) ||
      (o.district && o.district.toLowerCase().includes(q)) ||
      (o.address && o.address.toLowerCase().includes(q));
    return matchStatus && matchQuery;
  });

  const handleStatusChange = async (orderId: string, newStatus: OrderStatus) => {
    await api.updateOrderStatus(orderId, newStatus);
    if (activeModalOrder && activeModalOrder.id === orderId) {
      setActiveModalOrder({ ...activeModalOrder, status: newStatus });
    }
    onRefresh();
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;
    setDeletingId(orderToDelete.id);
    try {
      await api.deleteOrder(orderToDelete.id);
      if (activeModalOrder?.id === orderToDelete.id) {
        setActiveModalOrder(null);
      }
      setOrderToDelete(null);
      onRefresh();
    } catch (err) {
      console.error('Failed to delete order:', err);
    } finally {
      setDeletingId(null);
    }
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">পেন্ডিং</span>;
      case 'confirmed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">কনফার্মড</span>;
      case 'shipped':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">শিপড</span>;
      case 'delivered':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">ডেলিভারিড</span>;
      case 'cancelled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-800">বাতিল</span>;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">অর্ডার ব্যবস্থাপনা</h2>
          <p className="text-xs text-gray-500 mt-0.5">গ্রাহকদের অর্ডারের স্ট্যাটাস পরিবর্তন, ডিলিট ও ইনভয়েস প্রিন্ট করুন</p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-black px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200">
            মোট অর্ডার: {toBanglaDigits(orders.length)}
          </span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="অর্ডার নং, গ্রাহকের নাম, ফোন নম্বর বা ঠিকানা দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-xs sm:text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold text-gray-700"
        >
          <option value="all">সকল স্ট্যাটাস ({toBanglaDigits(orders.length)})</option>
          <option value="pending">পেন্ডিং ({toBanglaDigits(orders.filter(o => o.status === 'pending').length)})</option>
          <option value="confirmed">কনফার্মড ({toBanglaDigits(orders.filter(o => o.status === 'confirmed').length)})</option>
          <option value="shipped">শিপড ({toBanglaDigits(orders.filter(o => o.status === 'shipped').length)})</option>
          <option value="delivered">ডেলিভারিড ({toBanglaDigits(orders.filter(o => o.status === 'delivered').length)})</option>
          <option value="cancelled">বাতিল ({toBanglaDigits(orders.filter(o => o.status === 'cancelled').length)})</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm text-gray-600">
            <thead className="bg-gray-50 text-[11px] sm:text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-5 py-3.5">অর্ডার কোড</th>
                <th className="px-5 py-3.5">তারিখ</th>
                <th className="px-5 py-3.5">গ্রাহক তথ্য</th>
                <th className="px-5 py-3.5">ঠিকানা</th>
                <th className="px-5 py-3.5">আইটেম</th>
                <th className="px-5 py-3.5">মোট বিল</th>
                <th className="px-5 py-3.5">স্ট্যাটাস</th>
                <th className="px-5 py-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400 font-medium">
                    কোনো অর্ডার পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-gray-50/80 transition">
                    <td className="px-5 py-4 font-black text-emerald-800 whitespace-nowrap">
                      {ord.orderCode}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap text-xs text-gray-500">
                      {formatBanglaDate(ord.createdAt)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <p className="font-bold text-gray-900">{ord.customerName}</p>
                      <p className="text-xs text-gray-500 font-mono">{ord.customerPhone}</p>
                    </td>
                    <td className="px-5 py-4 max-w-xs text-xs">
                      <p className="font-medium text-gray-800 line-clamp-2" title={ord.address}>
                        {ord.address}
                      </p>
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <span className="px-2 py-0.5 bg-gray-100 text-gray-800 text-xs font-bold rounded-md">
                        {toBanglaDigits(ord.items.length)} টি আইটেম
                      </span>
                    </td>
                    <td className="px-5 py-4 font-black text-emerald-900 whitespace-nowrap">
                      {formatPrice(ord.grandTotal)}
                    </td>
                    <td className="px-5 py-4 whitespace-nowrap">
                      <select
                        value={ord.status}
                        onChange={(e) => handleStatusChange(ord.id, e.target.value as OrderStatus)}
                        className="text-xs font-bold px-2 py-1.5 rounded-lg border border-gray-300 bg-white shadow-2xs focus:ring-2 focus:ring-emerald-500 cursor-pointer"
                      >
                        <option value="pending">পেন্ডিং</option>
                        <option value="confirmed">কনফার্মড</option>
                        <option value="shipped">শিপড</option>
                        <option value="delivered">ডেলিভারিড</option>
                        <option value="cancelled">বাতিল</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setActiveModalOrder(ord)}
                          className="p-1.5 text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                          title="সম্পূর্ণ অর্ডার বিবরণ দেখুন"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setOrderToDelete(ord)}
                          className="p-1.5 text-red-500 hover:bg-red-50 hover:text-red-700 rounded-lg transition cursor-pointer"
                          title="অর্ডার মুছে ফেলুন"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <div className="text-center space-y-1.5">
              <h3 className="text-lg font-bold text-gray-900">অর্ডারটি মুছে ফেলতে চান?</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                অর্ডার কোড: <span className="font-bold text-gray-800">{orderToDelete.orderCode}</span> ({orderToDelete.customerName})<br />
                এটি মুছে ফেললে ডাটাবেস থেকে স্থায়ীভাবে রিমুভ হয়ে যাবে।
              </p>
            </div>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-xs cursor-pointer"
              >
                বাতিল করুন
              </button>
              <button
                type="button"
                disabled={deletingId === orderToDelete.id}
                onClick={confirmDeleteOrder}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs cursor-pointer flex items-center gap-1.5 shadow-sm"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{deletingId === orderToDelete.id ? 'মুছে ফেলা হচ্ছে...' : 'হ্যাঁ, মুছে ফেলুন'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Invoice / Order Detail Modal */}
      {activeModalOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto shadow-2xl">
            
            <div className="flex items-center justify-between border-b pb-3">
              <div>
                <h3 className="text-lg font-bold text-gray-900">অর্ডার ইনভয়েস</h3>
                <p className="text-xs text-gray-500 font-mono">{activeModalOrder.orderCode}</p>
              </div>
              <button 
                onClick={() => setActiveModalOrder(null)}
                className="text-gray-400 hover:text-gray-600 font-bold p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl text-xs sm:text-sm border border-gray-100">
              <div className="space-y-1">
                <span className="font-bold text-gray-900 block mb-1">গ্রাহকের বিবরণ:</span>
                <p className="text-gray-900 font-bold">{activeModalOrder.customerName}</p>
                <p className="text-gray-600 font-mono">{activeModalOrder.customerPhone}</p>
                <p className="text-gray-700 leading-snug">{activeModalOrder.address}</p>
                {activeModalOrder.orderNote && (
                  <p className="text-amber-800 text-xs bg-amber-50 p-1.5 rounded-lg border border-amber-200 mt-1 font-medium">
                    নোট: {activeModalOrder.orderNote}
                  </p>
                )}
              </div>
              <div className="space-y-1">
                <span className="font-bold text-gray-900 block mb-1">অর্ডার তথ্য:</span>
                <p className="text-gray-600">তারিখ: {formatBanglaDate(activeModalOrder.createdAt)}</p>
                <p className="text-gray-600 font-bold text-emerald-800">পেমেন্ট মেথড: {activeModalOrder.paymentMethod}</p>
                {activeModalOrder.paymentTrxId && (
                  <p className="text-xs font-mono font-bold bg-pink-50 text-pink-700 px-2 py-1 rounded border border-pink-200 mt-1">
                    TrxID: {activeModalOrder.paymentTrxId}
                  </p>
                )}
                {activeModalOrder.paymentPhone && (
                  <p className="text-xs font-mono text-gray-700 mt-0.5">
                    প্রেরক নম্বর: {activeModalOrder.paymentPhone}
                  </p>
                )}
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs font-semibold">স্ট্যাটাস:</span>
                  {getStatusBadge(activeModalOrder.status)}
                </div>
              </div>
            </div>

            {/* Ordered Items Table */}
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-gray-100 text-gray-700 font-bold">
                  <tr>
                    <th className="p-3">পণ্য</th>
                    <th className="p-3 text-center">পরিমাণ</th>
                    <th className="p-3 text-right">একক মূল্য</th>
                    <th className="p-3 text-right">মোট</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {activeModalOrder.items.map((it, idx) => (
                    <tr key={idx}>
                      <td className="p-3 flex items-center gap-2">
                        <img 
                          src={it.image || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&q=80&w=100'} 
                          alt={it.name} 
                          className="w-8 h-8 rounded object-cover border border-gray-200" 
                        />
                        <span className="font-semibold text-gray-900">{it.name}</span>
                      </td>
                      <td className="p-3 text-center font-bold">{toBanglaDigits(it.quantity)}</td>
                      <td className="p-3 text-right">{formatPrice(it.unitPrice)}</td>
                      <td className="p-3 text-right font-bold text-emerald-800">{formatPrice(it.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Calculations */}
            <div className="space-y-1.5 text-xs sm:text-sm border-t pt-3">
              <div className="flex justify-between text-gray-600">
                <span>পণ্যের সাবটোটাল:</span>
                <span className="font-semibold text-gray-900">{formatPrice(activeModalOrder.subtotal)}</span>
              </div>
              {activeModalOrder.discount > 0 && (
                <div className="flex justify-between text-red-600 font-semibold">
                  <span>ছাড়:</span>
                  <span>- {formatPrice(activeModalOrder.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-gray-600">
                <span>ডেলিভারি চার্জ:</span>
                <span className="font-semibold text-gray-900">{formatPrice(activeModalOrder.deliveryCharge)}</span>
              </div>
              <div className="flex justify-between text-base font-black text-emerald-900 border-t pt-2">
                <span>সর্বমোট আদায়যোগ্য:</span>
                <span>{formatPrice(activeModalOrder.grandTotal)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => setOrderToDelete(activeModalOrder)}
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>অর্ডার মুছুন</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>প্রিন্ট ইনভয়েস</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveModalOrder(null)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs cursor-pointer"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
