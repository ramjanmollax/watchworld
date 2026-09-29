import React from 'react';
import { Menu, ExternalLink, RefreshCw, CheckCircle2 } from 'lucide-react';

interface AdminNavbarProps {
  onToggleSidebar: () => void;
  title: string;
  onRefreshData?: () => void;
  onSwitchToStore?: () => void;
}

export const AdminNavbar: React.FC<AdminNavbarProps> = ({
  onToggleSidebar,
  title,
  onRefreshData,
  onSwitchToStore
}) => {
  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg sm:text-xl font-bold text-gray-900">{title}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {onRefreshData && (
          <button
            onClick={onRefreshData}
            className="p-2 text-gray-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        )}

        {onSwitchToStore && (
          <button
            onClick={onSwitchToStore}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-emerald-600 text-emerald-700 text-xs font-semibold hover:bg-emerald-50 transition cursor-pointer"
          >
            <span>ওয়েবসাইট দেখুন</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}

        <div className="flex items-center gap-2 pl-2 border-l border-gray-200 text-xs font-medium text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span className="hidden sm:inline">Firebase লাইভ সক্রিয়</span>
          <span className="sm:hidden">লাইভ</span>
        </div>
      </div>
    </header>
  );
};
