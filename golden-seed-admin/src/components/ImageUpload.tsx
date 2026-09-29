import React, { useState, useRef, useId } from 'react';
import { UploadCloud, Image as ImageIcon, Loader2, X, Link, CheckCircle2, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

interface ImageUploadProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  folder?: string;
  helperText?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  label,
  value,
  onChange,
  folder = 'products',
  helperText
}) => {
  const [uploading, setUploading] = useState(false);
  const [useUrlInput, setUseUrlInput] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const inputId = useId();

  React.useEffect(() => {
    setImgError(false);
  }, [value]);

  const processFile = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('অনুগ্রহ করে শুধুমাত্র ছবি ফাইল (JPG, PNG, WebP) নির্বাচন করুন।');
      return;
    }

    setError(null);
    setSuccessMsg(null);
    setUploading(true);

    try {
      const url = await api.uploadImage(file, folder);
      onChange(url);
      setSuccessMsg('ছবি সফলভাবে যুক্ত হয়েছে!');
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err: any) {
      console.error('Image upload error:', err);
      setError('ছবি প্রসেস করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSuccessMsg(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const hasImage = Boolean(value && value.trim() !== '' && !imgError);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-800">{label}</label>
        <button
          type="button"
          onClick={() => {
            setUseUrlInput(!useUrlInput);
            setError(null);
          }}
          className="text-[11px] text-emerald-600 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer transition"
        >
          {useUrlInput ? (
            <>
              <UploadCloud className="w-3.5 h-3.5" />
              <span>ফাইল থেকে আপলোড করুন</span>
            </>
          ) : (
            <>
              <Link className="w-3.5 h-3.5" />
              <span>ছবি লিংক (URL) দিন</span>
            </>
          )}
        </button>
      </div>

      {useUrlInput ? (
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="url"
              value={value || ''}
              onChange={(e) => onChange(e.target.value)}
              placeholder="https://images.unsplash.com/... বা যেকোনো ওয়েব লিংক"
              className="flex-1 px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:bg-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
            />
            {value && (
              <button
                type="button"
                onClick={handleClear}
                className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-xs font-bold transition cursor-pointer"
              >
                মুছুন
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            {/* Image Preview Box */}
            <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-100 border border-gray-200 overflow-hidden shrink-0 flex items-center justify-center shadow-2xs group">
              {hasImage ? (
                <>
                  <img 
                    src={value} 
                    alt="Preview" 
                    className="w-full h-full object-cover" 
                    onError={() => setImgError(true)}
                  />
                  <button
                    type="button"
                    onClick={handleClear}
                    className="absolute top-1 right-1 p-1 bg-black/75 hover:bg-red-600 text-white rounded-full transition cursor-pointer shadow-xs"
                    title="ছবি মুছে ফেলুন"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400 p-1 text-center">
                  <ImageIcon className="w-7 h-7 mb-1 text-gray-300" />
                  <span className="text-[10px] text-gray-400 font-medium">কোনো ছবি নেই</span>
                </div>
              )}
            </div>

            {/* Upload Button Area */}
            <div className="flex-1 min-w-0">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                id={`img-file-input-${inputId}`}
              />
              
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                className={`w-full border-2 border-dashed rounded-xl p-3.5 flex items-center justify-center gap-2 cursor-pointer transition ${
                  uploading 
                    ? 'bg-emerald-50 border-emerald-400 opacity-80 pointer-events-none' 
                    : 'border-emerald-300 hover:border-emerald-600 bg-emerald-50/40 hover:bg-emerald-50/80'
                }`}
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span className="text-xs font-bold text-emerald-800">ছবি প্রসেস হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <UploadCloud className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span className="text-xs font-bold text-emerald-900">
                      {hasImage ? 'নতুন ছবি পরিবর্তন করতে ক্লিক করুন' : 'কম্পিউটার বা মোবাইল থেকে ছবি সিলেক্ট করুন'}
                    </span>
                  </>
                )}
              </div>

              {helperText && <p className="text-[10px] text-gray-500 mt-1 font-medium">{helperText}</p>}
              {successMsg && (
                <p className="text-[11px] text-emerald-700 mt-1 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{successMsg}</span>
                </p>
              )}
              {error && <p className="text-[11px] text-red-600 mt-1 font-bold">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
