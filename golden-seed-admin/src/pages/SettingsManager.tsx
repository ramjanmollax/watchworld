import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  Search, 
  Trash2, 
  AlertTriangle,
  Banknote,
  Smartphone,
  CreditCard
} from 'lucide-react';
import { WebsiteSettings } from '../types';
import { api } from '../services/api';

interface SettingsManagerProps {
  settings: WebsiteSettings;
  onRefresh: () => void;
}

export const SettingsManager: React.FC<SettingsManagerProps> = ({
  settings,
  onRefresh
}) => {
  const [formData, setFormData] = useState<WebsiteSettings>({
    ...settings,
    paymentSettings: {
      codEnabled: settings.paymentSettings?.codEnabled ?? true,
      codNote: settings.paymentSettings?.codNote ?? 'পণ্য হাতে পেয়ে দেখে মূল্য পরিশোধ করুন।',
      bkashEnabled: settings.paymentSettings?.bkashEnabled ?? false,
      bkashNumber: settings.paymentSettings?.bkashNumber ?? '',
      bkashType: settings.paymentSettings?.bkashType ?? 'personal',
      bkashInstructions: settings.paymentSettings?.bkashInstructions ?? 'বিকাশ নম্বরে টাকা পাঠিয়ে ট্রানজেকশন আইডি (TrxID) ও প্রেরক নম্বর লিখুন।',
      nagadEnabled: settings.paymentSettings?.nagadEnabled ?? false,
      nagadNumber: settings.paymentSettings?.nagadNumber ?? '',
      nagadType: settings.paymentSettings?.nagadType ?? 'personal',
      nagadInstructions: settings.paymentSettings?.nagadInstructions ?? 'নগদ নম্বরে টাকা পাঠিয়ে ট্রানজেকশন আইডি (TrxID) ও প্রেরক নম্বর লিখুন।'
    }
  });

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [clearingOrders, setClearingOrders] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.saveSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  const handleClearAllOrders = async () => {
    if (!confirm('আপনি কি সত্যিই সকল টেস্ট/ডেমো অর্ডার মুছে ফেলতে চান? এটি আর ফিরিয়ে আনা যাবে না।')) {
      return;
    }

    setClearingOrders(true);
    try {
      const orders = await api.getOrders();
      for (const ord of orders) {
        await api.deleteOrder(ord.id);
      }
      try {
        localStorage.removeItem('golden_seed_orders_backup');
      } catch {}
      setActionSuccess('সকল টেস্ট অর্ডার সফলভাবে মুছে ফেলা হয়েছে!');
      setTimeout(() => setActionSuccess(null), 4000);
      onRefresh();
    } catch (err) {
      console.error(err);
      alert('অর্ডার ক্লিয়ার করতে সমস্যা হয়েছে।');
    } finally {
      setClearingOrders(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">সাধারণ স্টোর ও পেমেন্ট সেটিংস</h2>
        <p className="text-xs text-gray-500 mt-0.5">প্রতিষ্ঠানের তথ্য, ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ পেমেন্ট গেটওয়ে কনফিগার করুন</p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>সেটিংস সফলভাবে আপডেট করা হয়েছে! ওয়েবসাইটে সাথে সাথে কার্যকর হয়েছে।</span>
        </div>
      )}

      {actionSuccess && (
        <div className="p-4 bg-blue-50 border border-blue-200 text-blue-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 text-sm">
        
        {/* Basic Store Info */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="font-bold text-gray-900 text-base border-b pb-2">প্রতিষ্ঠানের সাধারণ তথ্য</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">প্রতিষ্ঠানের নাম *</label>
              <input
                type="text"
                required
                value={formData.websiteName}
                onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">ট্যাগলাইন</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">হটলাইন ফোন নম্বর *</label>
              <input
                type="text"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl font-bold"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-gray-700">অফিসিয়াল ইমেইল *</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="font-semibold text-gray-700">অফিস ও স্টোরের পূর্ণ ঠিকানা *</label>
              <input
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
          </div>
        </div>

        {/* Payment Gateways Settings (COD, bKash, Nagad) */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
          <div className="border-b pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-gray-900 text-base flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-emerald-600" />
                <span>পেমেন্ট গেটওয়ে সেটিংস (ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ)</span>
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                চেকআউট পেজে গ্রাহক কোন কোন মাধ্যমে পেমেন্ট করতে পারবেন তা এখান থেকে চালু ও নম্বর নির্ধারণ করুন
              </p>
            </div>
          </div>

          {/* 1. Cash on Delivery (COD) */}
          <div className="p-4 rounded-xl border border-gray-200 bg-gray-50/70 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Banknote className="w-4 h-4 text-emerald-700" />
                <span className="font-bold text-gray-900 text-sm">১. ক্যাশ অন ডেলিভারি (Cash on Delivery)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.paymentSettings?.codEnabled ?? true}
                  onChange={(e) => setFormData({
                    ...formData,
                    paymentSettings: { ...formData.paymentSettings, codEnabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald-600"></div>
                <span className="ml-2 text-xs font-bold text-gray-700">
                  {formData.paymentSettings?.codEnabled ? 'চালু' : 'বন্ধ'}
                </span>
              </label>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">গ্রাহকের জন্য নোট / বার্তা</label>
              <input
                type="text"
                value={formData.paymentSettings?.codNote || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  paymentSettings: { ...formData.paymentSettings, codNote: e.target.value }
                })}
                placeholder="যেমন: প্যাকেট হাতে পেয়ে চেক করে সম্পূর্ণ মূল্য পরিশোধ করুন।"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* 2. bKash Payment */}
          <div className="p-4 rounded-xl border border-pink-200 bg-pink-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#e2136e] text-white flex items-center justify-center font-black text-[10px]">
                  ব
                </div>
                <span className="font-bold text-gray-900 text-sm">২. বিকাশ পেমেন্ট (bKash)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.paymentSettings?.bkashEnabled ?? false}
                  onChange={(e) => setFormData({
                    ...formData,
                    paymentSettings: { ...formData.paymentSettings, bkashEnabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#e2136e]"></div>
                <span className="ml-2 text-xs font-bold text-[#e2136e]">
                  {formData.paymentSettings?.bkashEnabled ? 'চালু (Active)' : 'বন্ধ (Inactive)'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">বিকাশ মোবাইল নম্বর *</label>
                <input
                  type="text"
                  value={formData.paymentSettings?.bkashNumber || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    paymentSettings: { ...formData.paymentSettings, bkashNumber: e.target.value }
                  })}
                  placeholder="যেমন: 017XXXXXXXX"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold font-mono text-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">একাউন্টের ধরন</label>
                <select
                  value={formData.paymentSettings?.bkashType || 'personal'}
                  onChange={(e) => setFormData({
                    ...formData,
                    paymentSettings: { ...formData.paymentSettings, bkashType: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                >
                  <option value="personal">পার্সোনাল (Personal - সেন্ড মানি)</option>
                  <option value="merchant">মার্চেন্ট (Merchant - পেমেন্ট)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">বিকাশ পেমেন্ট নির্দেশিকা</label>
              <input
                type="text"
                value={formData.paymentSettings?.bkashInstructions || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  paymentSettings: { ...formData.paymentSettings, bkashInstructions: e.target.value }
                })}
                placeholder="যেমন: নম্বরে টাকা পাঠিয়ে নিচে ট্রানজেকশন আইডি (TrxID) ও প্রেরক নম্বর লিখুন।"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
              />
            </div>
          </div>

          {/* 3. Nagad Payment */}
          <div className="p-4 rounded-xl border border-orange-200 bg-orange-50/40 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-[#f7941d] text-white flex items-center justify-center font-black text-[10px]">
                  ন
                </div>
                <span className="font-bold text-gray-900 text-sm">৩. নগদ পেমেন্ট (Nagad)</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.paymentSettings?.nagadEnabled ?? false}
                  onChange={(e) => setFormData({
                    ...formData,
                    paymentSettings: { ...formData.paymentSettings, nagadEnabled: e.target.checked }
                  })}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#f7941d]"></div>
                <span className="ml-2 text-xs font-bold text-[#ea580c]">
                  {formData.paymentSettings?.nagadEnabled ? 'চালু (Active)' : 'বন্ধ (Inactive)'}
                </span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">নগদ মোবাইল নম্বর *</label>
                <input
                  type="text"
                  value={formData.paymentSettings?.nagadNumber || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    paymentSettings: { ...formData.paymentSettings, nagadNumber: e.target.value }
                  })}
                  placeholder="যেমন: 018XXXXXXXX"
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold font-mono text-gray-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">একাউন্টের ধরন</label>
                <select
                  value={formData.paymentSettings?.nagadType || 'personal'}
                  onChange={(e) => setFormData({
                    ...formData,
                    paymentSettings: { ...formData.paymentSettings, nagadType: e.target.value as any }
                  })}
                  className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-semibold text-gray-800"
                >
                  <option value="personal">পার্সোনাল (Personal - সেন্ড মানি)</option>
                  <option value="merchant">মার্চেন্ট (Merchant - পেমেন্ট)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-600 block mb-1">নগদ পেমেন্ট নির্দেশিকা</label>
              <input
                type="text"
                value={formData.paymentSettings?.nagadInstructions || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  paymentSettings: { ...formData.paymentSettings, nagadInstructions: e.target.value }
                })}
                placeholder="যেমন: নম্বরে টাকা পাঠিয়ে নিচে ট্রানজেকশন আইডি (TrxID) ও প্রেরক নম্বর লিখুন।"
                className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-xs"
              />
            </div>
          </div>

        </div>

        {/* Social Links */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h4 className="font-bold text-gray-900 text-base border-b pb-2">সোশ্যাল মিডিয়া পেজ লিংক</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-gray-600 block mb-1">ফেসবুক পেজ লিংক</label>
              <input
                type="url"
                value={formData.socialLinks?.facebook || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, facebook: e.target.value }
                })}
                className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600 block mb-1">হোয়াটসঅ্যাপ নম্বর লিংক</label>
              <input
                type="text"
                value={formData.socialLinks?.whatsapp || ''}
                onChange={(e) => setFormData({
                  ...formData,
                  socialLinks: { ...formData.socialLinks, whatsapp: e.target.value }
                })}
                className="w-full px-3 py-2 bg-gray-50 border rounded-lg text-xs font-bold"
              />
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-gray-900 flex items-center gap-2">
                <Search className="w-4 h-4 text-emerald-600" />
                <span>সার্চ অপশন (Search Bar)</span>
              </h4>
              <p className="text-xs text-gray-500 mt-1">
                ওয়েবসাইটের হেডারে সার্চ বার দেখাবেন কি না তা এখান থেকে চালু বা বন্ধ করতে পারেন।
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer shrink-0">
              <input
                type="checkbox"
                checked={formData.searchEnabled || false}
                onChange={(e) => setFormData({ ...formData, searchEnabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
              <span className={`ml-3 text-xs font-bold px-2 py-0.5 rounded-full ${
                formData.searchEnabled ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-200 text-gray-600'
              }`}>
                {formData.searchEnabled ? 'চালু (ON)' : 'বন্ধ (OFF)'}
              </span>
            </label>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end items-center">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs transition cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>সেটিংস সংরক্ষণ করুন</span>
          </button>
        </div>

      </form>

      {/* Demo / Test Data Reset Section */}
      <div className="bg-red-50/60 p-6 rounded-2xl border border-red-200 shadow-2xs space-y-4">
        <div className="flex items-center gap-2 text-red-900">
          <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
          <div>
            <h3 className="text-base font-bold">ডেমো / টেস্ট ডাটা ক্লিনআপ</h3>
            <p className="text-xs text-red-700/80">টেস্টিং চলাকালীন তৈরি করা টেস্ট অর্ডারগুলো এক ক্লিকে সম্পূর্ণ পরিষ্কার করতে পারেন</p>
          </div>
        </div>

        <div className="pt-2 flex items-center justify-between">
          <span className="text-xs text-gray-600">সকল ডেমো বা পরীক্ষামূলক অর্ডার ডাটাবেস থেকে মুছে ফেলুন</span>
          <button
            type="button"
            disabled={clearingOrders}
            onClick={handleClearAllOrders}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition cursor-pointer shadow-xs disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{clearingOrders ? 'পরিষ্কার হচ্ছে...' : 'সকল টেস্ট অর্ডার মুছুন'}</span>
          </button>
        </div>
      </div>

    </div>
  );
};
