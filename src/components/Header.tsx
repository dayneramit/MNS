import React from 'react';
import { UserRole } from '../types';
import { Layers, Globe, RotateCcw, Cpu } from 'lucide-react';

interface HeaderProps {
  lang: 'th' | 'en';
  setLang: (l: 'th' | 'en') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  onSelectWorkspace?: () => void;
  onReplaySplash?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  setLang,
  userRole,
  setUserRole,
  onSelectWorkspace,
  onReplaySplash,
}) => {
  return (
    <header id="main-header" className="border-b border-slate-800 bg-[#070B14] sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-3">
          {/* NC SMART CONTROL & POST LINK Branding */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700/80 text-cyan-400 flex items-center justify-center font-black shadow-md shadow-blue-950/40 shrink-0">
              <Cpu className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base sm:text-lg font-black tracking-wider text-white font-mono uppercase">
                  NC SMART CONTROL
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-cyan-950 text-cyan-400 border border-cyan-800">
                  POST LINK
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-mono tracking-wide">
                INDUSTRIAL ENTERPRISE PLATFORM
              </p>
            </div>
          </div>

          {/* Right Actions: Workspaces, Replay Splash, Language */}
          <div className="flex items-center gap-2">
            {onSelectWorkspace && (
              <button
                id="btn-nav-workspaces"
                type="button"
                onClick={onSelectWorkspace}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-mono font-medium border border-slate-700 transition cursor-pointer"
                title="Switch Workspace"
              >
                <Layers className="w-3.5 h-3.5 text-cyan-400" />
                <span className="hidden sm:inline">WORKSPACES</span>
              </button>
            )}

            {onReplaySplash && (
              <button
                id="btn-header-replay-splash"
                type="button"
                onClick={onReplaySplash}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs transition cursor-pointer border border-slate-700/80"
                title="Replay System Initialization Splash"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              id="btn-lang-toggle"
              type="button"
              onClick={() => setLang(lang === 'th' ? 'en' : 'th')}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono font-medium border border-slate-700/80 transition cursor-pointer"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'th' ? 'TH' : 'EN'}</span>
            </button>
          </div>
        </div>

        {/* ROLE SWITCH: [ DRIVER ] [ ADMIN ] */}
        <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between">
          <div className="text-[11px] font-bold text-slate-400 font-mono uppercase tracking-wider">
            {lang === 'th' ? 'โหมดการทำงาน:' : 'OPERATING MODE:'}
          </div>
          
          <div className="inline-flex p-1 bg-slate-950/90 rounded-2xl border border-slate-800 gap-1.5 shadow-inner">
            <button
              id="role-switch-driver"
              type="button"
              onClick={() => setUserRole('driver')}
              className={`px-3.5 sm:px-5 py-1.5 rounded-xl text-xs sm:text-sm font-black font-mono tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                userRole === 'driver'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>[ DRIVER ]</span>
            </button>
            <button
              id="role-switch-admin"
              type="button"
              onClick={() => setUserRole('admin')}
              className={`px-3.5 sm:px-5 py-1.5 rounded-xl text-xs sm:text-sm font-black font-mono tracking-wider transition-all duration-150 flex items-center gap-1.5 cursor-pointer ${
                userRole === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-bold scale-[1.02]'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <span>[ ADMIN ]</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
