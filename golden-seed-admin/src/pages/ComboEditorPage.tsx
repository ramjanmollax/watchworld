import React, { useState, useEffect } from 'react';
import { 
  Save, 
  Loader2, 
  Sparkles, 
  CheckCircle2, 
  Layers, 
  Plus, 
  Trash2, 
  Scale, 
  Tag, 
  DollarSign, 
  Package, 
  ImageIcon, 
  AlertCircle 
} from 'lucide-react';
import { Combo, Product } from '../types';
import { api as adminApi } from '../services/api';
import { ImageUpload } from '../components/ImageUpload';
import { toBanglaDigits } from '../utils/formatters';

interface ComboEditorPageProps {
  comboId: string;
  defaultTitle: string;
  defaultCount: number;
  combos: Combo[];
  products?: Product[];
  onRefresh?: () => Promise<void>;
  onSave?: (combo: Combo) => Promise<void>;
}

export const ComboEditorPage: React.FC<ComboEditorPageProps> = ({
  comboId,
  defaultTitle,
  defaultCount,
  combos,
  products,
  onRefresh,
  onSave
}) => {
  // Find current combo from live combos array
  const currentCombo = combos.find(c => c.id === comboId);

  const [formData, setFormData] = useState<Partial<Combo>>({
    id: comboId,
    name: defaultTitle,
    badge: defaultCount === 25 ? 'সেরা অফার' : 'জনপ্রিয়',
    tag: `${defaultCount} প্রকার বীজ`,
    subtitle: 'ছাদবাগান ও আঙিনায় সহজে ফল ও সবজি চাষ',
    regularPrice: defaultCount === 25 ? 790 : 650,
    salePrice: defaultCount === 25 ? 590 : 480,
    discount: defaultCount === 25 ? 25 : 26,
    stock: 50,
    inStock: true,
    featured: true,
    displayOrder: defaultCount === 25 ? 1 : 2,
    rating: 4.8,
    reviewsCount: defaultCount === 25 ? 135 : 88,
    thumbnail: 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&q=80&w=800',
    images: [
      'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&q=80&w=800'
    ],
    itemsList: [],
    description: `${defaultTitle} প্যাকেজ।`
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state when combo loaded from Firestore
  useEffect(() => {
    if (currentCombo) {
      setFormData({
        ...currentCombo,
        images: currentCombo.images && currentCombo.images.length > 0 
          ? currentCombo.images 
          : [currentCombo.thumbnail || '']
      });
    }
  }, [currentCombo]);

  const handlePriceChange = (reg: number, sale: number) => {
    const discount = reg > sale ? Math.round(((reg - sale) / reg) * 100) : 0;
    setFormData(prev => ({
      ...prev,
      regularPrice: reg,
      salePrice: sale,
      discount
    }));
  };

  const handleUpdateItemName = (idx: number, newName: string) => {
    const list = [...(formData.itemsList || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], name: newName };
      setFormData(prev => ({ ...prev, itemsList: list }));
    }
  };

  const handleUpdateItemQty = (idx: number, newQty: string) => {
    const list = [...(formData.itemsList || [])];
    if (list[idx]) {
      list[idx] = { ...list[idx], qty: newQty };
      setFormData(prev => ({ ...prev, itemsList: list }));
    }
  };

  const handleAddItem = () => {
    const list = [...(formData.itemsList || [])];
    list.push({
      name: `নতুন বীজ #${list.length + 1}`,
      qty: '১ প্যাকেট'
    });
    setFormData(prev => ({ ...prev, itemsList: list }));
  };

  const handleRemoveItem = (idx: number) => {
    const list = (formData.itemsList || []).filter((_, i) => i !== idx);
    setFormData(prev => ({ ...prev, itemsList: list }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const finalCombo: Combo = {
        id: comboId,
        name: formData.name || defaultTitle,
        badge: formData.badge || 'সেরা অফার',
        tag: formData.tag || `${defaultCount} প্রকার বীজ`,
        subtitle: formData.subtitle || '',
        regularPrice: Number(formData.regularPrice || 0),
        salePrice: Number(formData.salePrice || 0),
        discount: Number(formData.discount || 0),
        stock: Number(formData.stock || 0),
        inStock: formData.inStock ?? true,
        featured: true,
        displayOrder: Number(formData.displayOrder || 1),
        rating: Number(formData.rating || 4.8),
        reviewsCount: Number(formData.reviewsCount || 100),
        thumbnail: formData.thumbnail || formData.images?.[0] || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&q=80&w=800',
        images: formData.images && formData.images.length > 0 ? formData.images : [formData.thumbnail || ''],
        description: formData.description || '',
        packageInfo: formData.packageInfo || `${formData.itemsList?.length || defaultCount}টি আলাদা প্যাকেট ও রোপণ গাইড।`,
        deliveryInfo: formData.deliveryInfo || 'সারাদেশে দ্রুত হোম ডেলিভারি।',
        importantNotes: formData.importantNotes || 'শুকনো স্থানে সংরক্ষণ করুন।',
        itemsList: formData.itemsList || [],
        includedProductIds: formData.includedProductIds || [],
        updatedAt: new Date().toISOString()
      };

      if (onSave) {
        await onSave(finalCombo);
      } else {
        await adminApi.saveCombo(finalCombo);
        if (onRefresh) {
          await onRefresh();
        }
      }
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-xs font-semibold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>সরাসরি এডিটর</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">{formData.name || defaultTitle}</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            এই ফর্ম থেকে সরাসরি প্যাকেজের নাম, অফার মূল্য, মূল ছবি এবং বীজের নাম ও পরিমাণের তালিকা পরিবর্তন করতে পারবেন।
          </p>
        </div>

        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4" />
            <span>সফলভাবে সেভ হয়েছে!</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Editor Form */}
      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. Basic Information */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Tag className="w-4 h-4 text-emerald-600" />
            <span>মূল তথ্য ও শিরোনাম</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Title */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-gray-700 text-sm">কম্বো প্যাকেজের নাম *</label>
              <input
                type="text"
                required
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500"
                placeholder="যেমন: ২৫ প্রকার সবজি বীজ কম্বো"
              />
            </div>

            {/* Subtitle */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-sm">উপ-শিরোনাম (Subtitle)</label>
              <input
                type="text"
                value={formData.subtitle || ''}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
                placeholder="যেমন: বাড়ির ছাদে/উঠানে নিজের সবজি বাগান"
              />
            </div>

            {/* Badge */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-sm">অফার ব্যাজ (Badge)</label>
              <input
                type="text"
                value={formData.badge || ''}
                onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
                placeholder="যেমন: সেরা অফার, জনপ্রিয়"
              />
            </div>

            {/* Tag */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-sm">ট্যাগ (Tag)</label>
              <input
                type="text"
                value={formData.tag || ''}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
                placeholder="যেমন: ২৫ প্রকার বীজ"
              />
            </div>

            {/* Description */}
            <div className="sm:col-span-2 space-y-1">
              <label className="font-bold text-gray-700 text-sm">সংক্ষিপ্ত বিবরণ (Description)</label>
              <textarea
                rows={2}
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
                placeholder="প্যাকেজের বর্ণনা লিখুন..."
              />
            </div>
          </div>
        </div>

        {/* 2. Pricing & Stock */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span>মূল্য ও স্টক সেটিং</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Regular Price */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-sm">নিয়মিত মূল্য (৳) *</label>
              <input
                type="number"
                required
                value={formData.regularPrice || 0}
                onChange={(e) => handlePriceChange(Number(e.target.value), formData.salePrice || 0)}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold text-gray-700 focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Sale Price */}
            <div className="space-y-1">
              <label className="font-bold text-[#e50014] text-sm">অফার বিক্রয় মূল্য (৳) *</label>
              <input
                type="number"
                required
                value={formData.salePrice || 0}
                onChange={(e) => handlePriceChange(formData.regularPrice || 0, Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-black text-[#e50014] text-base focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Discount Percentage Live Preview */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-sm">স্বয়ংক্রিয় ছাড় (%)</label>
              <div className="px-3.5 py-2.5 bg-red-50 border border-red-200 rounded-xl font-black text-red-700">
                {toBanglaDigits(formData.discount || 0)}% ছাড়
              </div>
            </div>

            {/* Stock */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-sm">স্টক সংখ্যা</label>
              <input
                type="number"
                value={formData.stock || 0}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Rating */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-sm">রেটিং (১-৫)</label>
              <input
                type="number"
                step="0.1"
                min="1"
                max="5"
                value={formData.rating || 4.8}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Reviews Count */}
            <div className="space-y-1">
              <label className="font-bold text-gray-700 text-sm">রিভিউ সংখ্যা</label>
              <input
                type="number"
                value={formData.reviewsCount || 120}
                onChange={(e) => setFormData({ ...formData, reviewsCount: Number(e.target.value) })}
                className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Stock Active Toggle */}
            <div className="sm:col-span-3 pt-2 flex items-center gap-3">
              <input
                type="checkbox"
                id="inStockCheck"
                checked={formData.inStock ?? true}
                onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                className="w-5 h-5 text-emerald-600 rounded-md cursor-pointer"
              />
              <label htmlFor="inStockCheck" className="text-sm font-bold text-gray-800 cursor-pointer">
                এই কম্বো প্যাকেজটি ওয়েবসাইটে স্টকে আছে এবং বিক্রি চালু থাকবে
              </label>
            </div>
          </div>
        </div>

        {/* 3. Single Combo Photo Manager */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4 text-emerald-600" />
            <span>কম্বো প্যাকেজের মূল ছবি (Display Photo)</span>
          </h3>

          <div className="p-4 bg-emerald-50/40 rounded-xl border border-emerald-200">
            <ImageUpload
              label="কম্বো প্যাকেজের মূল ছবি *"
              value={formData.thumbnail || formData.images?.[0] || ''}
              folder="combos"
              helperText="কম্বো প্যাকেজের ১টি আকর্ষণীয় পরিষ্কার ছবি আপলোড করুন বা লিংক দিন।"
              onChange={(url) => {
                setFormData({
                  ...formData,
                  thumbnail: url,
                  images: [url]
                });
              }}
            />
          </div>
        </div>

        {/* 4. Included Seeds List Manager (শুধুমাত্র নাম ও পরিমাণ/সংখ্যা - No Image/Emoji) */}
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              <span>এই কম্বোতে অন্তর্ভুক্ত বীজের তালিকা ({toBanglaDigits(formData.itemsList?.length || 0)} প্রকার)</span>
            </h3>

            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন বীজ যোগ করুন</span>
            </button>
          </div>

          <p className="text-xs text-gray-500">
            এখানে শুধুমাত্র বীজের নাম এবং কয়টা বীজ বা কয় গ্রাম থাকবে তা লিখুন। ওয়েবসাইটে কোনো ছবি ছাড়াই সুন্দর বক্সে দেখাবে:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-[500px] overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
            {(formData.itemsList || []).map((item, idx) => (
              <div key={idx} className="p-2 bg-[#f0f9f3] rounded-xl border border-[#cbe8d8] shadow-2xs flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <span className="w-6 h-6 rounded-full bg-[#116e3c] text-white text-xs font-bold flex items-center justify-center shrink-0 shadow-xs">
                    {toBanglaDigits(idx + 1)}
                  </span>
                  
                  <input
                    type="text"
                    value={item.name}
                    onChange={(e) => handleUpdateItemName(idx, e.target.value)}
                    className="flex-1 px-2 py-1 text-xs font-bold bg-white border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#116e3c] text-gray-900"
                    placeholder="বীজের নাম"
                  />
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <input
                    type="text"
                    value={item.qty || ''}
                    onChange={(e) => handleUpdateItemQty(idx, e.target.value)}
                    className="w-24 px-2 py-1 text-xs font-bold bg-[#dcf1e4] text-[#116e3c] border border-emerald-300/60 rounded-lg focus:bg-white text-center"
                    placeholder="যেমন: ১০টি বীজ"
                  />

                  <button
                    type="button"
                    onClick={() => handleRemoveItem(idx)}
                    className="p-1 text-red-500 hover:bg-red-100 rounded-md transition cursor-pointer"
                    title="মুছে ফেলুন"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Save CTA Button */}
        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base rounded-xl shadow-md hover:shadow-emerald-700/30 transition cursor-pointer flex items-center justify-center gap-2"
          >
            {saving ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>সংরক্ষণ হচ্ছে...</span>
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                <span>পরিবর্তনসমূহ সংরক্ষণ করুন</span>
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
