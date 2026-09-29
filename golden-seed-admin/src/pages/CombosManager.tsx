import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Search, Save, X, Layers, Check } from 'lucide-react';
import { Combo, Product } from '../types';
import { formatPrice, toBanglaDigits } from '../utils/formatters';
import { api } from '../services/api';
import { ImageUpload } from '../components/ImageUpload';

interface CombosManagerProps {
  combos: Combo[];
  products: Product[];
  onRefresh: () => void;
}

export const CombosManager: React.FC<CombosManagerProps> = ({
  combos,
  products,
  onRefresh
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCombo, setEditingCombo] = useState<Partial<Combo> | null>(null);
  const [seedSearch, setSeedSearch] = useState('');

  const handleAddNew = () => {
    setEditingCombo({
      id: 'combo-' + Date.now(),
      name: '',
      badge: 'বিশেষ ছাড়',
      tag: `${toBanglaDigits(products.length)} প্রকার বীজ`,
      regularPrice: 1000,
      salePrice: 799,
      discount: 20,
      stock: 50,
      inStock: true,
      featured: true,
      displayOrder: combos.length + 1,
      rating: 4.9,
      reviewsCount: 20,
      thumbnail: 'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=600&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?w=800&auto=format&fit=crop&q=80'
      ],
      description: 'ছাদবাগান ও আঙিনায় চাষের জন্য বিশেষ সবজি বীজ কম্বো প্যাকেজ।',
      packageInfo: 'ইনট্যাক্ট প্রিমিয়াম প্যাকেট ও চাষাবাদ গাইড।',
      deliveryInfo: 'সারাদেশে হোম ডেলিভারি ও ক্যাশ অন ডেলিভারি সুবিধা।',
      importantNotes: 'ঠাণ্ডা ও শুষ্ক স্থানে আলো-বাতাসমুক্ত অবস্থায় রাখুন।',
      includedProductIds: products.slice(0, 10).map(p => p.id)
    });
    setIsModalOpen(true);
  };

  const handleEdit = (combo: Combo) => {
    setEditingCombo({ ...combo });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('আপনি কি সত্যিই এই কম্বো প্যাকেজটি মুছে ফেলতে চান?')) {
      await api.deleteCombo(id);
      onRefresh();
    }
  };

  const handleToggleActive = async (combo: Combo) => {
    await api.saveCombo({
      ...combo,
      inStock: !combo.inStock
    });
    onRefresh();
  };

  const handleToggleProductInCombo = (productId: string) => {
    if (!editingCombo) return;
    const current = editingCombo.includedProductIds || [];
    let updated: string[];
    if (current.includes(productId)) {
      updated = current.filter(id => id !== productId);
    } else {
      updated = [...current, productId];
    }
    setEditingCombo({
      ...editingCombo,
      includedProductIds: updated,
      tag: `${toBanglaDigits(updated.length)} প্রকার বীজ`
    });
  };

  const handleSaveCombo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCombo?.name || !editingCombo?.salePrice) {
      alert('কম্বোর নাম ও বিক্রয় মূল্য দিন');
      return;
    }

    const reg = Number(editingCombo.regularPrice) || 0;
    const sale = Number(editingCombo.salePrice) || 0;
    const discount = reg > sale ? Math.round(((reg - sale) / reg) * 100) : 0;

    await api.saveCombo({
      ...(editingCombo as Combo),
      discount,
      regularPrice: reg,
      salePrice: sale,
      stock: Number(editingCombo.stock) || 0,
      includedProductIds: editingCombo.includedProductIds || []
    });

    setIsModalOpen(false);
    setEditingCombo(null);
    onRefresh();
  };

  const filteredSeeds = products.filter(p => 
    !seedSearch.trim() || 
    p.name.toLowerCase().includes(seedSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(seedSearch.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">কম্বো প্যাকেজ ব্যবস্থাপনা</h2>
          <p className="text-xs text-gray-500 mt-0.5">গ্রাহকদের জন্য আকর্ষণীয় বান্ডেল ও অফার তৈরি করুন</p>
        </div>

        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন কম্বো তৈরি করুন</span>
        </button>
      </div>

      {/* Combos Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">ছবি</th>
                <th className="px-6 py-3.5">কম্বো নাম</th>
                <th className="px-6 py-3.5">অন্তর্ভুক্ত বীজ</th>
                <th className="px-6 py-3.5">বিক্রয় মূল্য</th>
                <th className="px-6 py-3.5">পূর্বমূল্য</th>
                <th className="px-6 py-3.5">স্টক</th>
                <th className="px-6 py-3.5">স্ট্যাটাস</th>
                <th className="px-6 py-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {combos.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    কোনো কম্বো নেই
                  </td>
                </tr>
              ) : (
                combos.map((combo) => (
                  <tr key={combo.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <img
                      src={combo.thumbnail || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&q=80&w=200'}
                      alt={combo.name}
                      className="w-14 h-12 rounded-xl object-cover border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                    {combo.name}
                    {combo.badge && (
                      <span className="ml-2 px-2 py-0.5 text-[10px] bg-red-100 text-red-700 rounded-full font-bold">
                        {combo.badge}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
                      <Layers className="w-3.5 h-3.5" />
                      {toBanglaDigits(combo.includedProductIds?.length || 0)} প্রকার বীজ
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-emerald-700 whitespace-nowrap">
                    {formatPrice(combo.salePrice)}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-gray-400 line-through whitespace-nowrap">
                    {formatPrice(combo.regularPrice)}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="font-semibold text-gray-800">
                      {toBanglaDigits(combo.stock)} টি
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleActive(combo)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        combo.inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {combo.inStock ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>সক্রিয়</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3.5 h-3.5 text-red-600" />
                          <span>নিষ্ক্রিয়</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-6 py-3.5 text-right whitespace-nowrap">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(combo)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(combo.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                        title="মুছে ফেলুন"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Combo Modal */}
      {isModalOpen && editingCombo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-4xl w-full p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {editingCombo.id?.startsWith('combo-') && editingCombo.name ? 'কম্বো প্যাকেজ সম্পাদনা' : 'নতুন কম্বো প্যাকেজ তৈরি করুন'}
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingCombo(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCombo} className="space-y-5 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Name */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-gray-700">কম্বোর শিরোনাম *</label>
                  <input
                    type="text"
                    required
                    value={editingCombo.name || ''}
                    onChange={(e) => setEditingCombo({ ...editingCombo, name: e.target.value })}
                    placeholder="যেমন: ২৫ প্রকার সবজি বীজ কম্বো"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Subtitle */}
                <div className="space-y-1 sm:col-span-3">
                  <label className="font-semibold text-gray-700">উপশিরোনাম (Subtitle)</label>
                  <input
                    type="text"
                    value={editingCombo.subtitle || ''}
                    onChange={(e) => setEditingCombo({ ...editingCombo, subtitle: e.target.value })}
                    placeholder="যেমন: বাড়ির ছাদে/উঠানে নিজের সবজি বাগান অথবা ছোট জায়গাতেও সহজে সবজি চাষ"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Badge */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">অফার ব্যাজ</label>
                  <input
                    type="text"
                    value={editingCombo.badge || ''}
                    onChange={(e) => setEditingCombo({ ...editingCombo, badge: e.target.value })}
                    placeholder="সেরা অফার / জনপ্রিয়"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Regular Price */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">পূর্বমূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingCombo.regularPrice || 0}
                    onChange={(e) => setEditingCombo({ ...editingCombo, regularPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Sale Price */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">অফার বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingCombo.salePrice || 0}
                    onChange={(e) => setEditingCombo({ ...editingCombo, salePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Stock */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">স্টক সংখ্যা</label>
                  <input
                    type="number"
                    value={editingCombo.stock || 0}
                    onChange={(e) => setEditingCombo({ ...editingCombo, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Rating */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">রেটিং (১ - ৫)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={editingCombo.rating || 4.8}
                    onChange={(e) => setEditingCombo({ ...editingCombo, rating: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Reviews Count */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">রিভিউ সংখ্যা (যেমন: ১৩৫)</label>
                  <input
                    type="number"
                    value={editingCombo.reviewsCount || 135}
                    onChange={(e) => setEditingCombo({ ...editingCombo, reviewsCount: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Main Thumbnail Image (1 Single Photo) */}
                <div className="space-y-1 sm:col-span-3">
                  <ImageUpload
                    label="কম্বো প্যাকেজের ছবি (Display Photo) *"
                    value={editingCombo.thumbnail || ''}
                    folder="combos"
                    helperText="কম্বো প্যাকেজের ১টি আকর্ষণীয় পরিষ্কার ছবি আপলোড করুন।"
                    onChange={(url) => {
                      setEditingCombo({ 
                        ...editingCombo, 
                        thumbnail: url, 
                        images: [url] 
                      });
                    }}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-3">
                  <label className="font-semibold text-gray-700">বিবরণ</label>
                  <textarea
                    rows={2}
                    value={editingCombo.description || ''}
                    onChange={(e) => setEditingCombo({ ...editingCombo, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>
              </div>

              {/* Seed Products Multi-Select Section */}
              <div className="space-y-3 pt-3 border-t">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="font-bold text-gray-900 block">
                      কম্বোতে অন্তর্ভুক্ত বীজ নির্বাচন করুন ({toBanglaDigits(editingCombo.includedProductIds?.length || 0)}টি নির্বাচিত)
                    </label>
                    <p className="text-xs text-gray-500">ডাটাবেজে থাকা বিদ্যমান বীজগুলোর মধ্য থেকে পছন্দ করুন</p>
                  </div>

                  <div className="relative w-full sm:w-64">
                    <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={seedSearch}
                      onChange={(e) => setSeedSearch(e.target.value)}
                      placeholder="বীজ ফিল্টার করুন..."
                      className="w-full pl-8 pr-3 py-1.5 text-xs bg-gray-50 border rounded-lg"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-2 bg-gray-50 rounded-xl border border-gray-200">
                  {filteredSeeds.map((prod) => {
                    const isSelected = editingCombo.includedProductIds?.includes(prod.id);
                    return (
                      <div
                        key={prod.id}
                        onClick={() => handleToggleProductInCombo(prod.id)}
                        className={`flex items-center gap-2.5 p-2 rounded-lg border text-xs cursor-pointer transition select-none ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-1 ring-emerald-400'
                            : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <div className={`w-4 h-4 rounded flex items-center justify-center shrink-0 ${
                          isSelected ? 'bg-emerald-600 text-white' : 'border border-gray-300 bg-white'
                        }`}>
                          {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <img src={prod.thumbnail || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&q=80&w=100'} alt={prod.name} className="w-7 h-7 rounded object-cover" />
                        <span className="truncate">{prod.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl font-medium"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold flex items-center gap-1.5"
                >
                  <Save className="w-4 h-4" />
                  <span>সংরক্ষণ করুন</span>
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
};
