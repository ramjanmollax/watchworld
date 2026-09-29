import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, CheckCircle2, XCircle, Image as ImageIcon, Save, X } from 'lucide-react';
import { Product, Category } from '../types';
import { formatPrice, toBanglaDigits } from '../utils/formatters';
import { api } from '../services/api';
import { ImageUpload } from '../components/ImageUpload';

interface ProductsManagerProps {
  products: Product[];
  categories: Category[];
  onRefresh: () => void;
}

export const ProductsManager: React.FC<ProductsManagerProps> = ({
  products,
  categories,
  onRefresh
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const filteredProducts = products.filter(p => {
    const matchCat = selectedCategory === 'all' || p.category === selectedCategory;
    const matchQuery = !searchQuery.trim() || 
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchQuery;
  });

  const handleAddNew = () => {
    setEditingProduct({
      id: 'prod-' + Date.now(),
      name: '',
      category: categories[1]?.name || 'সবজি',
      regularPrice: 50,
      salePrice: 40,
      discount: 20,
      stock: 100,
      inStock: true,
      featured: true,
      displayOrder: products.length + 1,
      rating: 4.8,
      reviewsCount: 15,
      packetInfo: 'অরিজিনাল ইনট্যাক্ট প্যাকেট',
      seedCountWeight: '১০ গ্রাম (প্রায় ২৫০ বীজ)',
      seedVariety: 'হাইব্রিড F1 উন্নত জাত',
      sowingSeason: 'সারা বছর',
      germinationTime: '৪-৭ দিন',
      germinationRate: '৮৫-৯০%',
      moistureLevel: '৮% এর নিচে',
      soilType: 'উর্বর দোআঁশ মাটি',
      sunlight: 'পূর্ণ সূর্যালোক',
      harvestTime: '৬০-৭০ দিন',
      cultivationGuide: 'টবে বা জমিতে চারা তৈরি করে রোপণ করুন।',
      description: 'উন্নত মানের আকর্ষণীয় ফলনশীল সবজি বীজ।',
      thumbnail: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80',
      images: [
        'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=800&auto=format&fit=crop&q=80'
      ]
    });
    setIsModalOpen(true);
  };

  const handleEdit = (prod: Product) => {
    setEditingProduct({ ...prod });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('আপনি কি সত্যিই এই পণ্যটি মুছে ফেলতে চান?')) {
      await api.deleteProduct(id);
      onRefresh();
    }
  };

  const handleToggleStock = async (prod: Product) => {
    await api.saveProduct({
      ...prod,
      inStock: !prod.inStock
    });
    onRefresh();
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct?.name || !editingProduct?.salePrice) {
      alert('পণ্য নাম ও বিক্রয় মূল্য প্রদান করুন');
      return;
    }

    // Calculate discount automatically
    const reg = Number(editingProduct.regularPrice) || 0;
    const sale = Number(editingProduct.salePrice) || 0;
    const discount = reg > sale ? Math.round(((reg - sale) / reg) * 100) : 0;

    await api.saveProduct({
      ...(editingProduct as Product),
      discount,
      regularPrice: reg,
      salePrice: sale,
      stock: Number(editingProduct.stock) || 0,
      images: editingProduct.images?.length ? editingProduct.images : [editingProduct.thumbnail || '']
    });

    setIsModalOpen(false);
    setEditingProduct(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-900">পণ্য ব্যবস্থাপনা (সবজি বীজ)</h2>
          <p className="text-xs text-gray-500 mt-0.5">মোট {toBanglaDigits(products.length)}টি বীজ তালিকাভুক্ত আছে</p>
        </div>

        <button
          onClick={handleAddNew}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm shadow-md transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>নতুন বীজ যোগ করুন</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম বা ক্যাটাগরি দিয়ে বীজ খুঁজুন..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full sm:w-48 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
        >
          <option value="all">সকল ক্যাটাগরি</option>
          {categories.filter(c => c.slug !== 'all').map(c => (
            <option key={c.id} value={c.name}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="px-6 py-3.5">ছবি</th>
                <th className="px-6 py-3.5">পণ্যের নাম</th>
                <th className="px-6 py-3.5">ক্যাটাগরি</th>
                <th className="px-6 py-3.5">বিক্রয় মূল্য</th>
                <th className="px-6 py-3.5">পূর্বমূল্য</th>
                <th className="px-6 py-3.5">স্টক</th>
                <th className="px-6 py-3.5">স্ট্যাটাস</th>
                <th className="px-6 py-3.5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-gray-400">
                    কোনো প্রোডাক্ট নেই
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => (
                  <tr key={prod.id} className="hover:bg-gray-50/80 transition">
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <img
                      src={prod.thumbnail || 'https://images.unsplash.com/photo-1592417817098-8f3d6eb22509?auto=format&fit=crop&q=80&w=200'}
                      alt={prod.name}
                      className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                    />
                  </td>
                  <td className="px-6 py-3.5 font-bold text-gray-900 whitespace-nowrap">
                    {prod.name}
                    {prod.featured && (
                      <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-amber-100 text-amber-800 rounded font-semibold">
                        ফিচার্ড
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-700 text-xs rounded-md">
                      {prod.category}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 font-bold text-emerald-700 whitespace-nowrap">
                    {formatPrice(prod.salePrice)}
                  </td>
                  <td className="px-6 py-3.5 text-xs text-gray-400 line-through whitespace-nowrap">
                    {formatPrice(prod.regularPrice)}
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <span className={`font-semibold ${prod.stock < 20 ? 'text-red-600' : 'text-gray-800'}`}>
                      {toBanglaDigits(prod.stock)} প্যাকেট
                    </span>
                  </td>
                  <td className="px-6 py-3.5 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStock(prod)}
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition cursor-pointer ${
                        prod.inStock
                          ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                          : 'bg-red-100 text-red-800 hover:bg-red-200'
                      }`}
                    >
                      {prod.inStock ? (
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
                        onClick={() => handleEdit(prod)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="সম্পাদনা করুন"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod.id)}
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

      {/* Add / Edit Product Modal */}
      {isModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 space-y-6 my-8 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="text-lg font-bold text-gray-900">
                {editingProduct.id?.startsWith('prod-') && editingProduct.name ? 'পণ্য সম্পাদনা করুন' : 'নতুন বীজ যুক্ত করুন'}
              </h3>
              <button 
                onClick={() => { setIsModalOpen(false); setEditingProduct(null); }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Product Name */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">বীজের নাম *</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, name: e.target.value })}
                    placeholder="যেমন: টমেটো বীজ"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Category */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">ক্যাটাগরি *</label>
                  <select
                    value={editingProduct.category || 'সবজি'}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  >
                    {categories.filter(c => c.slug !== 'all').map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Regular Price */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">মূল বা পূর্বের দাম (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.regularPrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, regularPrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Sale Price */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">বিক্রয় মূল্য (৳) *</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.salePrice || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, salePrice: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Stock Count */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">স্টক পরিমাণ (প্যাকেট)</label>
                  <input
                    type="number"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: Number(e.target.value) })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Seed Count / Weight */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">প্যাকেটের ওজন / বীজের সংখ্যা</label>
                  <input
                    type="text"
                    value={editingProduct.seedCountWeight || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, seedCountWeight: e.target.value })}
                    placeholder="১০ গ্রাম (প্রায় ৩০০ বীজ)"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Sowing Season */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">বপন সময়</label>
                  <input
                    type="text"
                    value={editingProduct.sowingSeason || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sowingSeason: e.target.value })}
                    placeholder="সারা বছর / শীতকাল"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Germination rate */}
                <div className="space-y-1">
                  <label className="font-semibold text-gray-700">অঙ্কুরোদগম হার</label>
                  <input
                    type="text"
                    value={editingProduct.germinationRate || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, germinationRate: e.target.value })}
                    placeholder="৮৫-৯০%"
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Image Upload with Firebase Storage */}
                <div className="space-y-1 sm:col-span-2">
                  <ImageUpload
                    label="পণ্যের ছবি (Firebase Storage)"
                    value={editingProduct.thumbnail || ''}
                    folder="products"
                    helperText="ছবি আপলোড করলে তা ফায়ারবেস ক্লাউড স্টোরেজে সেভ হয়ে সরাসরি ওয়েবসাইটে দৃশ্যমান হবে।"
                    onChange={(url) => setEditingProduct({ 
                      ...editingProduct, 
                      thumbnail: url, 
                      images: [url] 
                    })}
                  />
                </div>

                {/* Description */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-gray-700">বিবরণ</label>
                  <textarea
                    rows={2}
                    value={editingProduct.description || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
                </div>

                {/* Cultivation Guide */}
                <div className="space-y-1 sm:col-span-2">
                  <label className="font-semibold text-gray-700">চাষাবাদ নির্দেশিকা</label>
                  <textarea
                    rows={2}
                    value={editingProduct.cultivationGuide || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, cultivationGuide: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl"
                  />
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
