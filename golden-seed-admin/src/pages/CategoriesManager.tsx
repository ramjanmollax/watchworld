import React, { useState } from 'react';
import { Plus, Edit2, Trash2, CheckCircle2, XCircle, Save, Tag } from 'lucide-react';
import { Category } from '../types';
import { api } from '../services/api';

interface CategoriesManagerProps {
  categories: Category[];
  onRefresh: () => void;
}

export const CategoriesManager: React.FC<CategoriesManagerProps> = ({
  categories,
  onRefresh
}) => {
  const [newCatName, setNewCatName] = useState('');
  const [editingCat, setEditingCat] = useState<Category | null>(null);

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    const slug = newCatName.toLowerCase().replace(/\s+/g, '-');
    await api.saveCategory({
      id: 'cat-' + Date.now(),
      name: newCatName.trim(),
      slug,
      order: categories.length + 1,
      isActive: true
    });

    setNewCatName('');
    onRefresh();
  };

  const handleUpdateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCat) return;

    await api.saveCategory(editingCat);
    setEditingCat(null);
    onRefresh();
  };

  const handleDeleteCategory = async (id: string) => {
    if (confirm('আপনি কি এই ক্যাটাগরিটি মুছে ফেলতে চান?')) {
      await api.deleteCategory(id);
      onRefresh();
    }
  };

  const handleToggleCategory = async (cat: Category) => {
    await api.saveCategory({
      ...cat,
      isActive: !cat.isActive
    });
    onRefresh();
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">ক্যাটাগরি ব্যবস্থাপনা</h2>
        <p className="text-xs text-gray-500 mt-0.5">বীজের ক্যাটাগরি এবং ফিল্টার তালিকা নিয়ন্ত্রণ করুন</p>
      </div>

      {/* Add New Category Form */}
      <div className="bg-white p-5 rounded-2xl border border-gray-200 shadow-2xs">
        <h3 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4 text-emerald-600" />
          <span>নতুন ক্যাটাগরি তৈরি করুন</span>
        </h3>
        <form onSubmit={handleAddCategory} className="flex gap-3">
          <input
            type="text"
            required
            value={newCatName}
            onChange={(e) => setNewCatName(e.target.value)}
            placeholder="ক্যাটাগরির নাম লিখুন (যেমন: ফলমূল, মশলা)"
            className="flex-1 px-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          <button
            type="submit"
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-xl flex items-center gap-1.5 shadow-xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>যোগ করুন</span>
          </button>
        </form>
      </div>

      {/* Categories List */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-xs overflow-hidden">
        <table className="w-full text-left text-sm text-gray-600">
          <thead className="bg-gray-50 text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">
            <tr>
              <th className="px-6 py-3.5">ক্রম</th>
              <th className="px-6 py-3.5">ক্যাটাগরির নাম</th>
              <th className="px-6 py-3.5">স্লাগ</th>
              <th className="px-6 py-3.5">স্ট্যাটাস</th>
              <th className="px-6 py-3.5 text-right">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {categories.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400">
                  কোনো ক্যাটাগরি নেই
                </td>
              </tr>
            ) : (
              categories.map((cat, idx) => (
                <tr key={cat.id} className="hover:bg-gray-50/80">
                <td className="px-6 py-3.5 font-bold text-gray-400">
                  {idx + 1}
                </td>
                <td className="px-6 py-3.5 font-bold text-gray-900">
                  {editingCat?.id === cat.id ? (
                    <input
                      type="text"
                      value={editingCat.name}
                      onChange={(e) => setEditingCat({ ...editingCat, name: e.target.value })}
                      className="px-2 py-1 text-sm border rounded"
                    />
                  ) : (
                    cat.name
                  )}
                </td>
                <td className="px-6 py-3.5 text-xs text-gray-400">
                  {cat.slug}
                </td>
                <td className="px-6 py-3.5">
                  <button
                    onClick={() => handleToggleCategory(cat)}
                    className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                      cat.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {cat.isActive ? 'সক্রিয়' : 'লুকানো'}
                  </button>
                </td>
                <td className="px-6 py-3.5 text-right">
                  {editingCat?.id === cat.id ? (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={handleUpdateCategory}
                        className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded"
                      >
                        <Save className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingCat(null)}
                        className="p-1.5 text-gray-400 hover:bg-gray-50 rounded text-xs"
                      >
                        বাতিল
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setEditingCat(cat)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {cat.slug !== 'all' && (
                        <button
                          onClick={() => handleDeleteCategory(cat.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>

    </div>
  );
};
