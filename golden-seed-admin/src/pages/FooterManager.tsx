import React, { useState } from 'react';
import { 
  Save, 
  CheckCircle2, 
  SlidersHorizontal, 
  Sparkles, 
  Plus, 
  Trash2, 
  ShieldCheck, 
  Truck, 
  Heart, 
  Sprout, 
  Package, 
  Award, 
  Globe, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Layers, 
  FileText, 
  CreditCard,
  Eye,
  AlertCircle
} from 'lucide-react';
import { WebsiteSettings, FooterSettings, FooterTrustItem, FooterQuickLink } from '../types';
import { api } from '../services/api';
import { ImageUpload } from '../components/ImageUpload';
import { toBanglaDigits } from '../utils/formatters';

interface FooterManagerProps {
  settings: WebsiteSettings;
  onRefresh: () => void;
}

const DEFAULT_FOOTER_SETTINGS: FooterSettings = {
  showTrustStrip: true,
  trustItems: [
    { id: 'trust-1', icon: 'sprout', title: 'উন্নত মানের', subtitle: 'সবজি বীজ', enabled: true },
    { id: 'trust-2', icon: 'truck', title: 'সারা দেশে', subtitle: 'ডেলিভারি', enabled: true },
    { id: 'trust-3', icon: 'shield', title: 'নিরাপদ', subtitle: 'অর্ডার', enabled: true },
    { id: 'trust-4', icon: 'heart', title: 'বিশ্বস্ত', subtitle: 'গ্রাহক সেবা', enabled: true }
  ],
  brandName: 'Golden Seed',
  logoType: 'icon',
  logoImage: '',
  footerBio: 'আপনার ঘরে পৌঁছে দেই উন্নত মানের সবজি বীজ, ফুলের বীজ, ফলের বীজ এবং কৃষির যত রকম সমাধান।',
  showSocialLinks: true,
  facebookUrl: 'https://facebook.com',
  youtubeUrl: 'https://youtube.com',
  tiktokUrl: 'https://tiktok.com',
  instagramUrl: 'https://instagram.com',
  whatsappNumber: '01712-345678',
  quickLinksTitle: 'দ্রুত লিংক',
  showQuickLinks: true,
  quickLinks: [
    { id: 'ql-1', label: 'হোম', actionType: 'page', target: 'home', enabled: true },
    { id: 'ql-2', label: 'সব পণ্য', actionType: 'page', target: 'seeds', enabled: true },
    { id: 'ql-3', label: 'কম্বো প্যাক', actionType: 'page', target: 'combo-section', enabled: true },
    { id: 'ql-4', label: 'বীজের ধরন', actionType: 'page', target: 'seeds', enabled: true },
    { id: 'ql-5', label: 'আমাদের সম্পর্কে', actionType: 'page', target: 'about', enabled: true },
    { id: 'ql-6', label: 'যোগাযোগ', actionType: 'page', target: 'contact', enabled: true }
  ],
  contactTitle: 'যোগাযোগ',
  showContact: true,
  phone: '01712-345678',
  email: 'goldenseedbd@gmail.com',
  address: 'বাংলাদেশের যেকোনো স্থানে হোম ডেলিভারি',
  supportHours: 'সকাল ৯টা - রাত ১০টা',
  showNewsletter: true,
  newsletterTitle: 'নতুন অফার ও টিপস পেতে যুক্ত থাকুন',
  newsletterSubtitle: 'সরাসরি আপনার ইমেইলে বাগান ও বীজ সংক্রান্ত পরামর্শ পান।',
  newsletterButtonText: 'সাবস্ক্রাইব',
  copyrightText: '© ২০২৬ Golden Seed. সর্বস্বত্ব সংরক্ষিত।',
  developerCredit: 'Developed with excellence',
  showPolicies: true,
  privacyPolicyText: 'Golden Seed গ্রাহকদের তথ্যের গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেয়। আপনার নাম, ঠিকানা ও ফোন নম্বর শুধুমাত্র পণ্য ডেলিভারির কাজে ব্যবহৃত হয়।',
  termsText: '১. পণ্য গ্রহণের সময় ডেলিভারি ম্যানের সামনে চেক করে নিন। ২. কোনো সমস্যা থাকলে তাৎক্ষণিক আমাদের হটলাইনে কল করুন।',
  returnPolicyText: 'পণ্য পাওয়ার পর কোনো প্যাকেটে ক্ষতি বা ভুল পণ্য আসলে ২৪ ঘণ্টার মধ্যে আমাদের অবহিত করলে সম্পূর্ণ ফ্রিতে রিপ্লেসমেন্ট প্রদান করা হবে।',
  showPaymentBadges: true
};

export const FooterManager: React.FC<FooterManagerProps> = ({ settings, onRefresh }) => {
  const [footerData, setFooterData] = useState<FooterSettings>({
    ...DEFAULT_FOOTER_SETTINGS,
    ...(settings.footerSettings || {}),
    phone: settings.footerSettings?.phone || settings.phone || DEFAULT_FOOTER_SETTINGS.phone,
    email: settings.footerSettings?.email || settings.email || DEFAULT_FOOTER_SETTINGS.email,
    address: settings.footerSettings?.address || settings.address || DEFAULT_FOOTER_SETTINGS.address,
    facebookUrl: settings.footerSettings?.facebookUrl || settings.socialLinks?.facebook || DEFAULT_FOOTER_SETTINGS.facebookUrl,
    youtubeUrl: settings.footerSettings?.youtubeUrl || settings.socialLinks?.youtube || DEFAULT_FOOTER_SETTINGS.youtubeUrl,
    instagramUrl: settings.footerSettings?.instagramUrl || settings.socialLinks?.instagram || DEFAULT_FOOTER_SETTINGS.instagramUrl,
    whatsappNumber: settings.footerSettings?.whatsappNumber || settings.socialLinks?.whatsapp || DEFAULT_FOOTER_SETTINGS.whatsappNumber,
  });

  const [activeTab, setActiveTab] = useState<'general' | 'trust' | 'social' | 'links' | 'contact' | 'policies'>('general');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrorMsg(null);
    try {
      const updatedSettings: WebsiteSettings = {
        ...settings,
        phone: footerData.phone,
        email: footerData.email,
        address: footerData.address,
        socialLinks: {
          facebook: footerData.facebookUrl,
          youtube: footerData.youtubeUrl,
          instagram: footerData.instagramUrl,
          whatsapp: footerData.whatsappNumber
        },
        footerSettings: footerData
      };

      await api.saveSettings(updatedSettings);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
      onRefresh();
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err?.message || 'সংরক্ষণ করতে সমস্যা হয়েছে');
    } finally {
      setSaving(false);
    }
  };

  // Trust items helper
  const handleUpdateTrustItem = (index: number, field: keyof FooterTrustItem, value: any) => {
    const list = [...footerData.trustItems];
    list[index] = { ...list[index], [field]: value };
    setFooterData({ ...footerData, trustItems: list });
  };

  const handleAddTrustItem = () => {
    const list = [...footerData.trustItems];
    list.push({
      id: `trust-${Date.now()}`,
      icon: 'award',
      title: 'নতুন সুবিধা',
      subtitle: 'বিবরণ লিখুন',
      enabled: true
    });
    setFooterData({ ...footerData, trustItems: list });
  };

  const handleRemoveTrustItem = (index: number) => {
    const list = footerData.trustItems.filter((_, i) => i !== index);
    setFooterData({ ...footerData, trustItems: list });
  };

  // Quick links helper
  const handleUpdateQuickLink = (index: number, field: keyof FooterQuickLink, value: any) => {
    const list = [...footerData.quickLinks];
    list[index] = { ...list[index], [field]: value };
    setFooterData({ ...footerData, quickLinks: list });
  };

  const handleAddQuickLink = () => {
    const list = [...footerData.quickLinks];
    list.push({
      id: `ql-${Date.now()}`,
      label: 'নতুন লিংক',
      actionType: 'page',
      target: 'seeds',
      enabled: true
    });
    setFooterData({ ...footerData, quickLinks: list });
  };

  const handleRemoveQuickLink = (index: number) => {
    const list = footerData.quickLinks.filter((_, i) => i !== index);
    setFooterData({ ...footerData, quickLinks: list });
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-emerald-950 rounded-2xl p-5 sm:p-6 text-white shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/40 text-xs font-semibold mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5 text-amber-300" />
            <span>সম্পূর্ণ ফুটার নিয়ন্ত্রণ</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-black">ফুটার ও ট্রাস্ট বার এডিটর</h1>
          <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
            ওয়েবসাইটের নিচের ফুটারের লোগো, ট্রাস্ট বার, কুইক লিংক, সোশ্যাল মিডিয়া, ঠিকানা ও পলিসি এখান থেকে নিয়ন্ত্রণ করুন।
          </p>
        </div>

        {savedSuccess && (
          <div className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-lg animate-in fade-in shrink-0">
            <CheckCircle2 className="w-4 h-4" />
            <span>ফুটার সফলভাবে সেভ হয়েছে!</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 font-bold">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none border-b border-gray-200">
        <button
          type="button"
          onClick={() => setActiveTab('general')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'general'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>ব্র্যান্ড ও বায়ো</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('trust')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'trust'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>টপ ট্রাস্ট ফিচার বার ({toBanglaDigits(footerData.trustItems.length)})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'social'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Globe className="w-4 h-4" />
          <span>সোশ্যাল মিডিয়া বাটন</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'links'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>দ্রুত লিংকসমূহ</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('contact')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'contact'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <Phone className="w-4 h-4" />
          <span>যোগাযোগ ও ঠিকানা</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('policies')}
          className={`px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-2 cursor-pointer whitespace-nowrap ${
            activeTab === 'policies'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>কপিরাইট ও পলিসি</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* 1. GENERAL & BRAND TAB */}
        {activeTab === 'general' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>ব্র্যান্ড নাম, লোগো ও ফুটার বিবরণ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 text-sm">ফুটার ব্র্যান্ড নাম *</label>
                <input
                  type="text"
                  required
                  value={footerData.brandName || ''}
                  onChange={(e) => setFooterData({ ...footerData, brandName: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="যেমন: Golden Seed"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 text-sm">লোগো স্টাইল</label>
                <select
                  value={footerData.logoType || 'icon'}
                  onChange={(e) => setFooterData({ ...footerData, logoType: e.target.value as 'icon' | 'image' })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold focus:bg-white focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="icon">ডিফল্ট সবুজ পাতা আইকন লোগো</option>
                  <option value="image">কাস্টম ইমেজ লোগো (ছবি আপলোড)</option>
                </select>
              </div>

              {footerData.logoType === 'image' && (
                <div className="sm:col-span-2 p-4 bg-emerald-50/50 rounded-xl border border-emerald-200">
                  <ImageUpload
                    label="কাস্টম লোগো ছবি (PNG/WebP)"
                    value={footerData.logoImage || ''}
                    folder="logo"
                    helperText="স্বচ্ছ ব্যাকগ্রাউন্ডের (Transparent PNG) লোগো দিলে দেখতে সুন্দর লাগবে।"
                    onChange={(url) => setFooterData({ ...footerData, logoImage: url })}
                  />
                </div>
              )}

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-gray-700 text-sm">ফুটার সংক্ষিপ্ত বিবরণ / স্লোগান *</label>
                <textarea
                  rows={3}
                  required
                  value={footerData.footerBio || ''}
                  onChange={(e) => setFooterData({ ...footerData, footerBio: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500"
                  placeholder="আপনার ঘরে পৌঁছে দেই উন্নত মানের সবজি বীজ, ফুলের বীজ, ফলের বীজ এবং কৃষির যত রকম সমাধান।"
                />
              </div>

              {/* Newsletter Settings */}
              <div className="sm:col-span-2 pt-4 border-t space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-sm flex items-center gap-2">
                    <Mail className="w-4 h-4 text-emerald-600" />
                    <span>নিউজলেটার ও সাবস্ক্রিপশন বক্স</span>
                  </h4>

                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerData.showNewsletter}
                      onChange={(e) => setFooterData({ ...footerData, showNewsletter: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                    />
                    <span>নিউজলেটার বক্স চালু রাখুন</span>
                  </label>
                </div>

                {footerData.showNewsletter && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 text-xs">নিউজলেটার টাইটেল</label>
                      <input
                        type="text"
                        value={footerData.newsletterTitle}
                        onChange={(e) => setFooterData({ ...footerData, newsletterTitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white border rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 text-xs">বাটন টেক্সট</label>
                      <input
                        type="text"
                        value={footerData.newsletterButtonText}
                        onChange={(e) => setFooterData({ ...footerData, newsletterButtonText: e.target.value })}
                        className="w-full px-3 py-2 bg-white border rounded-lg text-xs font-bold"
                      />
                    </div>

                    <div className="sm:col-span-2 space-y-1">
                      <label className="font-semibold text-gray-700 text-xs">সাবটাইটেল / বার্তা</label>
                      <input
                        type="text"
                        value={footerData.newsletterSubtitle}
                        onChange={(e) => setFooterData({ ...footerData, newsletterSubtitle: e.target.value })}
                        className="w-full px-3 py-2 bg-white border rounded-lg text-xs font-medium"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. TOP TRUST BAR TAB */}
        {activeTab === 'trust' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>টপ ট্রাস্ট ফিচার বার সেটিংস</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">ফুটারের ঠিক উপরে যে ৪টি বিশ্বস্ততার আইকন ও লেখা থাকে সেটির নিয়ন্ত্রণ</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerData.showTrustStrip}
                    onChange={(e) => setFooterData({ ...footerData, showTrustStrip: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <span>ট্রাস্ট বার দেখান</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddTrustItem}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন সুবিধা যোগ করুন</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {footerData.trustItems.map((item, idx) => (
                <div key={item.id || idx} className="p-3.5 bg-[#f0f9f3] rounded-xl border border-[#cbe8d8] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#116e3c] text-white text-xs font-black flex items-center justify-center shrink-0">
                        {toBanglaDigits(idx + 1)}
                      </span>
                      <span className="text-xs font-black text-gray-900">ফিচার #{toBanglaDigits(idx + 1)}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="text-[11px] font-bold text-emerald-900 flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.enabled}
                          onChange={(e) => handleUpdateTrustItem(idx, 'enabled', e.target.checked)}
                          className="w-3.5 h-3.5 text-emerald-600 rounded"
                        />
                        <span>সক্রিয়</span>
                      </label>

                      {footerData.trustItems.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveTrustItem(idx)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded-md transition cursor-pointer"
                          title="মুছে ফেলুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 text-[11px]">আইকন</label>
                      <select
                        value={item.icon}
                        onChange={(e) => handleUpdateTrustItem(idx, 'icon', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                      >
                        <option value="sprout">🌱 চারা/গাছ (Sprout)</option>
                        <option value="truck">🚚 ডেলিভারি (Truck)</option>
                        <option value="shield">🛡️ নিরাপদ (Shield)</option>
                        <option value="heart">❤️ বিশ্বস্ত (Heart)</option>
                        <option value="package">📦 প্যাকেজ (Package)</option>
                        <option value="award">🏆 সেরা মান (Award)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 text-[11px]">মূল শিরোনাম *</label>
                      <input
                        type="text"
                        required
                        value={item.title}
                        onChange={(e) => handleUpdateTrustItem(idx, 'title', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold"
                        placeholder="যেমন: উন্নত মানের"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-semibold text-gray-700 text-[11px]">উপ-শিরোনাম</label>
                      <input
                        type="text"
                        value={item.subtitle}
                        onChange={(e) => handleUpdateTrustItem(idx, 'subtitle', e.target.value)}
                        className="w-full px-2 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-medium"
                        placeholder="যেমন: সবজি বীজ"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 3. SOCIAL MEDIA BUTTONS TAB */}
        {activeTab === 'social' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Globe className="w-4 h-4 text-emerald-600" />
                  <span>সোশ্যাল মিডিয়া পেজ লিংক ও আইকন বাটন</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">ফুটারের লোগোর নিচে রঙিন গোল বাটনে এই লিংকগুলো প্রদর্শিত হবে</p>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={footerData.showSocialLinks}
                  onChange={(e) => setFooterData({ ...footerData, showSocialLinks: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
                <span>সোশ্যাল বাটন চালু রাখুন</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Facebook */}
              <div className="space-y-1 p-3.5 bg-blue-50/50 rounded-xl border border-blue-200">
                <label className="font-bold text-blue-900 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#1877F2] text-white flex items-center justify-center text-[10px] font-bold">f</span>
                  <span>Facebook Page URL</span>
                </label>
                <input
                  type="text"
                  value={footerData.facebookUrl || ''}
                  onChange={(e) => setFooterData({ ...footerData, facebookUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-blue-200 rounded-lg text-xs font-medium"
                  placeholder="https://facebook.com/yourpage"
                />
              </div>

              {/* YouTube */}
              <div className="space-y-1 p-3.5 bg-red-50/50 rounded-xl border border-red-200">
                <label className="font-bold text-red-900 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#FF0000] text-white flex items-center justify-center text-[10px] font-bold">▶</span>
                  <span>YouTube Channel URL</span>
                </label>
                <input
                  type="text"
                  value={footerData.youtubeUrl || ''}
                  onChange={(e) => setFooterData({ ...footerData, youtubeUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-red-200 rounded-lg text-xs font-medium"
                  placeholder="https://youtube.com/@yourchannel"
                />
              </div>

              {/* TikTok */}
              <div className="space-y-1 p-3.5 bg-neutral-50 rounded-xl border border-neutral-300">
                <label className="font-bold text-neutral-900 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-black text-white flex items-center justify-center text-[10px] font-bold">♪</span>
                  <span>TikTok Profile URL</span>
                </label>
                <input
                  type="text"
                  value={footerData.tiktokUrl || ''}
                  onChange={(e) => setFooterData({ ...footerData, tiktokUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-neutral-300 rounded-lg text-xs font-medium"
                  placeholder="https://tiktok.com/@yourprofile"
                />
              </div>

              {/* Instagram */}
              <div className="space-y-1 p-3.5 bg-pink-50/50 rounded-xl border border-pink-200">
                <label className="font-bold text-pink-900 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white flex items-center justify-center text-[10px] font-bold">📷</span>
                  <span>Instagram Profile URL</span>
                </label>
                <input
                  type="text"
                  value={footerData.instagramUrl || ''}
                  onChange={(e) => setFooterData({ ...footerData, instagramUrl: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-pink-200 rounded-lg text-xs font-medium"
                  placeholder="https://instagram.com/yourprofile"
                />
              </div>

              {/* WhatsApp */}
              <div className="sm:col-span-2 space-y-1 p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-300">
                <label className="font-bold text-emerald-900 text-xs flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-[#25D366] text-white flex items-center justify-center text-[10px] font-bold">💬</span>
                  <span>WhatsApp Number (সরাসরি মেসেজ ও অর্ডারের জন্য)</span>
                </label>
                <input
                  type="text"
                  value={footerData.whatsappNumber || ''}
                  onChange={(e) => setFooterData({ ...footerData, whatsappNumber: e.target.value })}
                  className="w-full px-3 py-2 bg-white border border-emerald-300 rounded-lg text-xs font-bold text-emerald-950"
                  placeholder="যেমন: 01712-345678"
                />
              </div>
            </div>
          </div>
        )}

        {/* 4. QUICK LINKS TAB */}
        {activeTab === 'links' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-emerald-600" />
                  <span>দ্রুত লিংক কলাম সেটিংস</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">ফুটারের 'দ্রুত লিংক' সেকশনের লিংকসমূহ কাস্টমাইজ করুন</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={footerData.showQuickLinks}
                    onChange={(e) => setFooterData({ ...footerData, showQuickLinks: e.target.checked })}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                  <span>লিংক কলাম দেখান</span>
                </label>

                <button
                  type="button"
                  onClick={handleAddQuickLink}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs cursor-pointer transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>নতুন লিংক যোগ করুন</span>
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <div className="max-w-xs space-y-1">
                <label className="font-bold text-gray-700 text-xs">কলাম শিরোনাম</label>
                <input
                  type="text"
                  value={footerData.quickLinksTitle}
                  onChange={(e) => setFooterData({ ...footerData, quickLinksTitle: e.target.value })}
                  className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs font-bold"
                  placeholder="যেমন: দ্রুত লিংক"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {footerData.quickLinks.map((link, idx) => (
                  <div key={link.id || idx} className="p-3 bg-gray-50 rounded-xl border border-gray-200 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="w-5 h-5 rounded-full bg-gray-300 text-gray-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                        {toBanglaDigits(idx + 1)}
                      </span>

                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleUpdateQuickLink(idx, 'label', e.target.value)}
                        className="w-28 px-2 py-1 bg-white border rounded text-xs font-bold"
                        placeholder="লিংক নাম"
                      />

                      <select
                        value={link.target}
                        onChange={(e) => handleUpdateQuickLink(idx, 'target', e.target.value)}
                        className="flex-1 px-2 py-1 bg-white border rounded text-xs font-medium"
                      >
                        <option value="home">হোম পেজ</option>
                        <option value="seeds">সব বীজ পণ্য</option>
                        <option value="combo-section">কম্বো প্যাকেজ</option>
                        <option value="about">আমাদের সম্পর্কে</option>
                        <option value="contact">যোগাযোগ পেজ</option>
                      </select>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <label className="text-[10px] font-bold text-gray-600 flex items-center gap-1 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={link.enabled}
                          onChange={(e) => handleUpdateQuickLink(idx, 'enabled', e.target.checked)}
                          className="w-3.5 h-3.5 text-emerald-600 rounded"
                        />
                      </label>

                      {footerData.quickLinks.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveQuickLink(idx)}
                          className="p-1 text-red-500 hover:bg-red-100 rounded-md transition cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 5. CONTACT INFO TAB */}
        {activeTab === 'contact' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
            <div className="flex items-center justify-between border-b pb-2">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>যোগাযোগ ও সাপোর্ট ইনফো সেটিংস</span>
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">ফুটারের যোগাযোগ কলামের ফোন নম্বর, ইমেইল ও ঠিকানা</p>
              </div>

              <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={footerData.showContact}
                  onChange={(e) => setFooterData({ ...footerData, showContact: e.target.checked })}
                  className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                />
                <span>যোগাযোগ কলাম দেখান</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 text-xs">কলাম শিরোনাম</label>
                <input
                  type="text"
                  value={footerData.contactTitle}
                  onChange={(e) => setFooterData({ ...footerData, contactTitle: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold focus:bg-white"
                  placeholder="যেমন: যোগাযোগ"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 text-xs">হটলাইন ফোন নম্বর *</label>
                <input
                  type="text"
                  required
                  value={footerData.phone}
                  onChange={(e) => setFooterData({ ...footerData, phone: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold focus:bg-white"
                  placeholder="যেমন: 01712-345678"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 text-xs">ইমেইল ঠিকানা *</label>
                <input
                  type="email"
                  required
                  value={footerData.email}
                  onChange={(e) => setFooterData({ ...footerData, email: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-medium focus:bg-white"
                  placeholder="যেমন: goldenseedbd@gmail.com"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 text-xs">সাপোর্ট কাজের সময় (Helpline Hours)</label>
                <input
                  type="text"
                  value={footerData.supportHours || ''}
                  onChange={(e) => setFooterData({ ...footerData, supportHours: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-medium focus:bg-white"
                  placeholder="যেমন: সকাল ৯টা - রাত ১০টা"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-bold text-gray-700 text-xs">অফিস / ডেলিভারি এরিয়া ঠিকানা *</label>
                <input
                  type="text"
                  required
                  value={footerData.address}
                  onChange={(e) => setFooterData({ ...footerData, address: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-medium focus:bg-white"
                  placeholder="যেমন: বাংলাদেশের যেকোনো স্থানে হোম ডেলিভারি"
                />
              </div>
            </div>
          </div>
        )}

        {/* 6. POLICIES & COPYRIGHT TAB */}
        {activeTab === 'policies' && (
          <div className="bg-white p-5 sm:p-6 rounded-2xl border border-gray-200 shadow-2xs space-y-5">
            <h3 className="text-base font-bold text-gray-900 border-b pb-2 flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              <span>কপিরাইট, পলিসি পপআপ ও পার্টনার ব্যাজ</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="font-bold text-gray-700 text-xs">কপিরাইট টেক্সট *</label>
                <input
                  type="text"
                  required
                  value={footerData.copyrightText}
                  onChange={(e) => setFooterData({ ...footerData, copyrightText: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-bold focus:bg-white"
                  placeholder="যেমন: © ২০২৬ Golden Seed. সর্বস্বত্ব সংরক্ষিত।"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-gray-700 text-xs">ডেভেলপার বা ক্রেডিটস টেক্সট</label>
                <input
                  type="text"
                  value={footerData.developerCredit || ''}
                  onChange={(e) => setFooterData({ ...footerData, developerCredit: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-gray-50 border rounded-xl font-medium focus:bg-white"
                  placeholder="Developed with excellence"
                />
              </div>

              {/* Policy texts */}
              <div className="sm:col-span-2 pt-3 border-t space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-gray-900 text-sm">পলিসি পপআপ বিবরণ (ক্লিক করলে গ্রাহক যা দেখতে পাবেন)</h4>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={footerData.showPolicies}
                      onChange={(e) => setFooterData({ ...footerData, showPolicies: e.target.checked })}
                      className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                    />
                    <span>পলিসি লিংকগুলো ফুটারের নিচে দেখান</span>
                  </label>
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 text-xs">🔒 প্রাইভেসি পলিসি (Privacy Policy)</label>
                  <textarea
                    rows={2}
                    value={footerData.privacyPolicyText || ''}
                    onChange={(e) => setFooterData({ ...footerData, privacyPolicyText: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                    placeholder="প্রাইভেসি পলিসি বিবরণ..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 text-xs">📜 শর্তাবলী (Terms & Conditions)</label>
                  <textarea
                    rows={2}
                    value={footerData.termsText || ''}
                    onChange={(e) => setFooterData({ ...footerData, termsText: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                    placeholder="শর্তাবলী সংক্রান্ত তথ্য..."
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-gray-700 text-xs">🔄 রিটার্ন ও রিফান্ড পলিসি (Return Policy)</label>
                  <textarea
                    rows={2}
                    value={footerData.returnPolicyText || ''}
                    onChange={(e) => setFooterData({ ...footerData, returnPolicyText: e.target.value })}
                    className="w-full px-3 py-2 bg-gray-50 border rounded-xl text-xs"
                    placeholder="রিটার্ন পলিসি বিবরণ..."
                  />
                </div>
              </div>

              {/* Payment Badges Toggle */}
              <div className="sm:col-span-2 pt-2 flex items-center gap-3">
                <input
                  type="checkbox"
                  id="payBadgesCheck"
                  checked={footerData.showPaymentBadges}
                  onChange={(e) => setFooterData({ ...footerData, showPaymentBadges: e.target.checked })}
                  className="w-5 h-5 text-emerald-600 rounded cursor-pointer"
                />
                <label htmlFor="payBadgesCheck" className="text-xs font-bold text-gray-800 cursor-pointer">
                  ফুটারের নিচে নিরাপদ পেমেন্ট ব্যাজ (ক্যাশ অন ডেলিভারি, বিকাশ, ইত্যাদি) প্রদর্শন করুন
                </label>
              </div>
            </div>
          </div>
        )}

        {/* Global Save Button */}
        <div className="pt-3 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-extrabold text-base rounded-xl shadow-md hover:shadow-emerald-700/30 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <Save className="w-5 h-5" />
            <span>{saving ? 'সংরক্ষণ হচ্ছে...' : 'ফুটার সেটিংস সংরক্ষণ করুন'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
