import React, { useState } from 'react';
import { Save, Truck, CheckCircle2 } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { api } from '../services/api';
import { formatPrice } from '../utils/formatters';

interface DeliveryManagerProps {
  settings: WebsiteSettings;
  onRefresh: () => void;
}

export const DeliveryManager: React.FC<DeliveryManagerProps> = ({
  settings,
  onRefresh
}) => {
  const [formData, setFormData] = useState<WebsiteSettings['deliveryCharges']>({
    ...settings.deliveryCharges
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rate = Number(formData.insideDhaka) || Number(formData.outsideDhaka) || 60;
    await api.saveSettings({
      ...settings,
      deliveryCharges: {
        insideDhaka: rate,
        outsideDhaka: rate,
        freeDeliveryThreshold: Number(formData.freeDeliveryThreshold) || 2000,
        isFreeDeliveryActive: formData.isFreeDeliveryActive
      }
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">ডেলিভারি সেটিংস</h2>
        <p className="text-xs text-gray-500 mt-0.5">সারাদেশে একক হোম ডেলিভারি চার্জ এবং ফ্রি শিপিং শর্ত নির্ধারণ করুন</p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>ডেলিভারি সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5 text-sm">
        
        <div className="space-y-1 max-w-sm">
          <label className="font-bold text-gray-800">সারাদেশে একক হোম ডেলিভারি চার্জ (৳) *</label>
          <p className="text-xs text-gray-500 mb-1">বাংলাদেশের যেকোনো জেলা বা উপজেলায় এই একটি নির্দিষ্ট ডেলিভারি চার্জ প্রযোজ্য হবে।</p>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 font-bold">৳</span>
            <input
              type="number"
              required
              value={formData.insideDhaka}
              onChange={(e) => {
                const val = Number(e.target.value);
                setFormData({ ...formData, insideDhaka: val, outsideDhaka: val });
              }}
              className="w-full pl-8 pr-4 py-2.5 bg-gray-50 border rounded-xl font-bold text-gray-900"
              placeholder="যেমন: 60"
            />
          </div>
        </div>

        {/* Free Delivery */}
        <div className="pt-4 border-t space-y-3">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-900">
            <input
              type="checkbox"
              checked={formData.isFreeDeliveryActive}
              onChange={(e) => setFormData({ ...formData, isFreeDeliveryActive: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>নির্দিষ্ট অর্ডারে ফ্রি ডেলিভারি সুবিধা চালু করুন</span>
          </label>

          {formData.isFreeDeliveryActive && (
            <div className="space-y-1 max-w-sm">
              <label className="font-semibold text-gray-700">নূন্যতম কত টাকার অর্ডারে ফ্রি ডেলিভারি প্রযোজ্য হবে (৳)</label>
              <input
                type="number"
                value={formData.freeDeliveryThreshold}
                onChange={(e) => setFormData({ ...formData, freeDeliveryThreshold: Number(e.target.value) })}
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
              />
            </div>
          )}
        </div>

        <div className="pt-4 border-t">
          <button
            type="submit"
            className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-xs transition"
          >
            <Save className="w-4 h-4" />
            <span>সংরক্ষণ করুন</span>
          </button>
        </div>

      </form>
    </div>
  );
};
