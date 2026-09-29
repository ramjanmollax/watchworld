import React, { useState } from 'react';
import { Search, User, Phone, MapPin, ShoppingBag, DollarSign } from 'lucide-react';
import { Order } from '../types';
import { formatPrice, formatBanglaDate, toBanglaDigits } from '../utils/formatters';

interface CustomersManagerProps {
  orders: Order[];
}

interface CustomerSummary {
  phone: string;
  name: string;
  district: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
}

export const CustomersManager: React.FC<CustomersManagerProps> = ({ orders }) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Aggregate customers from orders
  const customerMap: { [phone: string]: CustomerSummary } = {};

  orders.forEach(ord => {
    const phone = ord.customerPhone;
    if (!customerMap[phone]) {
      customerMap[phone] = {
        phone,
        name: ord.customerName,
        district: ord.district,
        address: `${ord.address}, ${ord.upazilaThana}`,
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: ord.createdAt
      };
    }

    customerMap[phone].totalOrders += 1;
    if (ord.status !== 'cancelled') {
      customerMap[phone].totalSpent += ord.grandTotal;
    }
  });

  const customers = Object.values(customerMap);

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase().trim();
    return !q || c.name.toLowerCase().includes(q) || c.phone.includes(q) || c.district.toLowerCase().includes(q);
  });

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">গ্রাহক তালিকা ও বিবরণ</h2>
          <p className="text-xs text-gray-500 mt-0.5">অর্ডার থেকে সংগৃহীত মোট {toBanglaDigits(customers.length)} জন গ্রাহকের প্রোফাইল</p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs">
        <div className="relative max-w-md">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="গ্রাহকের নাম, ফোন বা জেলা দিয়ে খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">গ্রাহক</th>
                <th className="px-6 py-3.5">মোবাইল নম্বর</th>
                <th className="px-6 py-3.5">জেলা ও ঠিকানা</th>
                <th className="px-6 py-3.5 text-center">মোট অর্ডার</th>
                <th className="px-6 py-3.5 text-right">মোট কেনাকাটা</th>
                <th className="px-6 py-3.5 text-right">সর্বশেষ অর্ডার</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-gray-400">
                    কোনো কাস্টমার নেই
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust, idx) => (
                  <tr key={idx} className="hover:bg-gray-50/80 transition">
                    <td className="px-6 py-4 font-bold text-gray-900 whitespace-nowrap flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">
                        {cust.name.charAt(0)}
                      </div>
                      <span>{cust.name}</span>
                    </td>
                    <td className="px-6 py-4 text-xs font-semibold whitespace-nowrap">
                      {cust.phone}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs">
                      <span className="font-semibold text-gray-800 block">{cust.district}</span>
                      <span className="text-gray-500">{cust.address}</span>
                    </td>
                    <td className="px-6 py-4 text-center whitespace-nowrap font-bold text-emerald-700">
                      {toBanglaDigits(cust.totalOrders)} টি
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-gray-900 whitespace-nowrap">
                      {formatPrice(cust.totalSpent)}
                    </td>
                    <td className="px-6 py-4 text-right text-xs text-gray-500 whitespace-nowrap">
                      {formatBanglaDate(cust.lastOrderDate)}
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
