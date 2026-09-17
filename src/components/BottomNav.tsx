import React from 'react';
import { Home, LayoutGrid, Clock, User } from 'lucide-react';

export type BottomNavTab = 'home' | 'functions' | 'history' | 'profile';

interface BottomNavProps {
  activeTab: BottomNavTab;
  setActiveTab: (tab: BottomNavTab) => void;
  lang: 'th' | 'en';
  pendingApprovalsCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  lang,
  pendingApprovalsCount = 0,
}) => {
  return (
    <nav 
      id="bottom-navigation" 
      aria-label="Bottom Bar"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] pb-safe"
    >
      <div className="max-w-md sm:max-w-xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* 1. หน้าแรก */}
        <button
          id="btn-nav-home"
          type="button"
          onClick={() => setActiveTab('home')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'home'
              ? 'text-amber-600 font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${activeTab === 'home' ? 'bg-amber-500/15' : ''}`}>
            <Home className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] leading-none">
            {lang === 'th' ? 'หน้าแรก' : 'Home'}
          </span>
        </button>

        {/* 2. ฟังก์ชัน */}
        <button
          id="btn-nav-functions"
          type="button"
          onClick={() => setActiveTab('functions')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'functions'
              ? 'text-amber-600 font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${activeTab === 'functions' ? 'bg-amber-500/15' : ''}`}>
            <LayoutGrid className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] leading-none">
            {lang === 'th' ? 'ฟังก์ชัน' : 'Functions'}
          </span>
        </button>

        {/* 3. ประวัติ */}
        <button
          id="btn-nav-history"
          type="button"
          onClick={() => setActiveTab('history')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl transition relative cursor-pointer ${
            activeTab === 'history'
              ? 'text-amber-600 font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${activeTab === 'history' ? 'bg-amber-500/15' : ''}`}>
            <Clock className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] leading-none">
            {lang === 'th' ? 'ประวัติ' : 'History'}
          </span>
        </button>

        {/* 4. โปรไฟล์ */}
        <button
          id="btn-nav-profile"
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center gap-1 rounded-2xl transition cursor-pointer ${
            activeTab === 'profile'
              ? 'text-amber-600 font-bold'
              : 'text-slate-400 hover:text-slate-700'
          }`}
        >
          <div className={`p-1.5 rounded-xl transition ${activeTab === 'profile' ? 'bg-amber-500/15' : ''}`}>
            <User className="w-5 h-5 stroke-[2.2]" />
          </div>
          <span className="text-[11px] leading-none">
            {lang === 'th' ? 'โปรไฟล์' : 'Profile'}
          </span>
        </button>
      </div>
    </nav>
  );
};
