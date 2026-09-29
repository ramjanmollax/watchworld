import React, { useState, useEffect } from 'react';
import { Save, Image as ImageIcon, Sparkles, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { WebsiteSettings } from '../types';
import { api } from '../services/api';
import { ImageUpload } from '../components/ImageUpload';

interface HomepageManagerProps {
  settings: WebsiteSettings;
  onRefresh: () => void;
}

export const HomepageManager: React.FC<HomepageManagerProps> = ({
  settings,
  onRefresh
}) => {
  const [formData, setFormData] = useState<WebsiteSettings>({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sync state whenever settings change in parent or Firestore
  useEffect(() => {
    if (settings) {
      setFormData({ ...settings });
    }
  }, [settings]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      await api.saveSettings(formData);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
      onRefresh();
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      setErrorMsg(err.message || 'সেটিংস সংরক্ষণ ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h2 className="text-xl font-bold text-gray-900">হোমপেজ ও কন্টেন্ট ব্যবস্থাপনা</h2>
        <p className="text-xs text-gray-500 mt-0.5">ওয়েবসাইটের ব্যানার, শিরোনাম, টেক্সট এবং নোটিশ সম্পাদন করুন</p>
      </div>

      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>কন্টেন্ট সফলভাবে আপডেট করা হয়েছে! ওয়েবসাইটে সাথে সাথে পরিবর্তন কার্যকর হয়েছে।</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 rounded-xl text-sm flex items-center gap-2 animate-in fade-in duration-200">
          <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Hero Section Settings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>হিরো ব্যানার সেটিংস</span>
          </h3>

          <div className="space-y-4 text-sm">
            <div>
              <label className="font-semibold text-gray-700 block mb-1">প্রধান শিরোনাম (Hero Heading)</label>
              <input
                type="text"
                value={formData.heroHeadline ?? ''}
                onChange={(e) => setFormData({ ...formData, heroHeadline: e.target.value })}
                placeholder="যেমন: আপনার সবুজ স্বপ্নের সাথী (বা খালি রাখুন)"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">উপশিরোনাম (Subheadline)</label>
              <input
                type="text"
                value={formData.heroSubheadline ?? ''}
                onChange={(e) => setFormData({ ...formData, heroSubheadline: e.target.value })}
                placeholder="যেমন: উন্নত মানের সবজি বীজ, ছাদবাগান ও কৃষির জন্য (বা খালি রাখুন)"
                className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">CTA বাটন টেক্সট</label>
                <input
                  type="text"
                  value={formData.heroCtaText ?? ''}
                  onChange={(e) => setFormData({ ...formData, heroCtaText: e.target.value })}
                  placeholder="যেমন: এখনই বীজ কিনুন (বা খালি রাখুন)"
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="font-semibold text-gray-700 block mb-1">ট্যাগলাইন</label>
                <input
                  type="text"
                  value={formData.tagline ?? ''}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <ImageUpload
                label="হিরো ব্যাকগ্রাউন্ড ইমেজ (ছবি বা লিংক)"
                value={formData.heroBgImage ?? ''}
                folder="banners"
                helperText="কম্পিউটার/মোবাইল থেকে সরাসরি ছবি আপলোড করতে পারেন অথবা যেকোনো ছবির ওয়েব লিংক দিন।"
                onChange={(url) => setFormData({ ...formData, heroBgImage: url })}
              />
            </div>

            {/* Banner Display Mode & Overlay controls */}
            <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-4">
              <div>
                <label className="font-semibold text-gray-800 block mb-1.5 text-xs">
                  ছবি প্রদর্শনের নিয়ম (Banner Display Style)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                    (formData.heroDisplayMode || 'cover') === 'cover' 
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs' 
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="heroDisplayMode"
                      value="cover"
                      checked={(formData.heroDisplayMode || 'cover') === 'cover'}
                      onChange={() => setFormData({ ...formData, heroDisplayMode: 'cover' })}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">ফুল ব্যাকগ্রাউন্ড (Cover - রিকমেন্ডেড)</span>
                      <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                        পিসি এবং মোবাইলে পুরো স্ক্রিন জুড়ে সুন্দরভাবে বিস্তৃত থাকবে (কোনো ফাঁকা কালো বর্ডার থাকবে না)।
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                    formData.heroDisplayMode === 'contain' 
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs' 
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="heroDisplayMode"
                      value="contain"
                      checked={formData.heroDisplayMode === 'contain'}
                      onChange={() => setFormData({ ...formData, heroDisplayMode: 'contain' })}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">সম্পূর্ণ ছবি (Contain)</span>
                      <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                        ছবির আসল সাইজ ও অনুপাতে থাকবে এবং চারপাশে ব্লার আবহ থাকবে।
                      </span>
                    </div>
                  </label>

                  <label className={`flex items-start gap-2.5 p-3 rounded-xl border cursor-pointer transition ${
                    formData.heroDisplayMode === 'split' 
                      ? 'bg-white border-emerald-600 ring-2 ring-emerald-500/20 shadow-xs' 
                      : 'bg-white/60 border-gray-200 hover:bg-white'
                  }`}>
                    <input
                      type="radio"
                      name="heroDisplayMode"
                      value="split"
                      checked={formData.heroDisplayMode === 'split'}
                      onChange={() => setFormData({ ...formData, heroDisplayMode: 'split' })}
                      className="mt-0.5 text-emerald-600 focus:ring-emerald-500"
                    />
                    <div>
                      <span className="font-bold text-gray-900 block text-xs">শোকেস ভিউ (Split)</span>
                      <span className="text-[11px] text-gray-500 block leading-tight mt-0.5">
                        বামে থাকবে লেখার অংশ এবং ডানে আলাদা ফ্রেমে পুরো ছবি ফুটে উঠবে।
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-gray-800 block mb-1 text-xs">
                  ডার্ক ওভারলে (ছবির ওপর ছায়ার তীব্রতা)
                </label>
                <select
                  value={formData.heroOverlay || 'light'}
                  onChange={(e) => setFormData({ ...formData, heroOverlay: e.target.value as any })}
                  className="w-full sm:w-72 px-3 py-2 bg-white border rounded-xl text-xs focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="none">কোনো ডার্ক ছায়া নেই (১০০% ছবির আসল উজ্জ্বলতা)</option>
                  <option value="light">হালকা ছায়া (লেখা সহজে পড়ার সুবিধার্থে - রিকমেন্ডেড)</option>
                  <option value="medium">মিডিয়াম ছায়া (গাঢ় ব্যাকগ্রাউন্ড)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Notice Banner */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-4">
          <h3 className="text-base font-bold text-gray-900 border-b pb-2">জরুরি নোটিশ বার</h3>
          
          <div className="space-y-3 text-sm">
            <label className="flex items-center gap-2 cursor-pointer font-medium text-gray-800">
              <input
                type="checkbox"
                checked={formData.noticeBanner?.enabled || false}
                onChange={(e) => setFormData({
                  ...formData,
                  noticeBanner: {
                    text: formData.noticeBanner?.text || '',
                    enabled: e.target.checked
                  }
                })}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span>ওয়েবসাইটের শীর্ষে নোটিশ বার প্রদর্শন করুন</span>
            </label>

            {formData.noticeBanner?.enabled && (
              <div>
                <label className="font-semibold text-gray-700 block mb-1">নোটিশের বার্তা</label>
                <input
                  type="text"
                  value={formData.noticeBanner?.text || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    noticeBanner: {
                      ...formData.noticeBanner!,
                      text: e.target.value
                    }
                  })}
                  className="w-full px-4 py-2.5 bg-gray-50 border rounded-xl focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl flex items-center gap-2 shadow-md transition cursor-pointer ${
            saving ? 'opacity-70 pointer-events-none' : ''
          }`}
        >
          {saving ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>সংরক্ষণ হচ্ছে...</span>
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              <span>পরিবর্তন সংরক্ষণ করুন</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
