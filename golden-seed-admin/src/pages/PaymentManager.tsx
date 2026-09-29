import React, { useState } from 'react';
import { Save, CreditCard, CheckCircle2 } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { api } from '../services/api';

interface PaymentManagerProps {
  settings: WebsiteSettings;
  onRefresh: () => void;
}

export const PaymentManager: React.FC<PaymentManagerProps> = ({
  settings,
  onRefresh
}) => {
  const [formData, setFormData] = useState<WebsiteSettings['paymentSettings']>({
    ...settings.paymentSettings
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.saveSettings({
      ...settings,
      paymentSettings: formData
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">পেমেন্ট গেটওয়ে সেটিংস</h2>
        <p className="text-xs text-gray-500 mt-0.5">ক্যাশ অন ডেলিভারি ও ডিজিটাল পেমেন্ট পদ্ধতি নিয়ন্ত্রণ করুন</p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>পেমেন্ট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5 text-sm">
        
        {/* Cash On Delivery Settings */}
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-900">
            <input
              type="checkbox"
              checked={formData.codEnabled}
              onChange={(e) => setFormData({ ...formData, codEnabled: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>ক্যাশ অন ডেলিভারি (Cash on Delivery) সক্রিয় রাখুন</span>
          </label>

          <div className="space-y-1">
            <label className="font-semibold text-gray-700">চেকআউটে গ্রাহকদের জন্য নোট</label>
            <input
              type="text"
              value={formData.codNote}
              onChange={(e) => setFormData({ ...formData, codNote: e.target.value })}
              className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl"
            />
          </div>
        </div>

        {/* bKash / Mobile Banking */}
        <div className="pt-4 border-t space-y-3">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-900">
            <input
              type="checkbox"
              checked={formData.bkashEnabled}
              onChange={(e) => setFormData({ ...formData, bkashEnabled: e.target.checked })}
              className="rounded text-emerald-600 focus:ring-emerald-500"
            />
            <span>বিকাশ / নগদ পেমেন্ট অপশন প্রদর্শন করুন</span>
          </label>

          {formData.bkashEnabled && (
            <div className="space-y-1">
              <label className="font-semibold text-gray-700">মার্চেন্ট / পার্সোনাল বিকাশ নম্বর</label>
              <input
                type="text"
                value={formData.bkashNumber || ''}
                onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                placeholder="017XXXXXXXX"
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
