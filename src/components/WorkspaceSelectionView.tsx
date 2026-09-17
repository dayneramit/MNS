import React from 'react';
import { 
  Fuel, 
  Database, 
  ShieldCheck, 
  RotateCcw, 
  ChevronRight, 
  CheckCircle2, 
  Cpu, 
  Activity,
  Layers
} from 'lucide-react';

interface WorkspaceSelectionProps {
  onSelectWorkspace: (workspaceId: 'fuel_fleet' | 'depot_telemetry' | 'security_audit') => void;
  onReplaySplash: () => void;
}

export const WorkspaceSelectionView: React.FC<WorkspaceSelectionProps> = ({
  onSelectWorkspace,
  onReplaySplash,
}) => {
  const workspaces = [
    {
      id: 'fuel_fleet' as const,
      code: 'WS-01',
      title: 'FUEL & FLEET CONTROL',
      titleTh: 'ศูนย์ควบคุมการจ่ายน้ำมันและยานพาหนะ',
      description: 'Vehicle authorization, dynamic QR workflow, remote dispenser solenoid control, and driver dispatch.',
      badge: 'ACTIVE OPERATIONS',
      badgeColor: 'text-amber-400 bg-amber-950/60 border-amber-800/80',
      icon: Fuel,
      accentColor: 'group-hover:border-amber-500/60 text-amber-400',
    },
    {
      id: 'depot_telemetry' as const,
      code: 'WS-02',
      title: 'DEPOT & TANK TELEMETRY',
      titleTh: 'ระบบตรวจวัดถังและสถานะคลังน้ำมัน',
      description: 'Real-time hydrostatic level monitoring, automated stock reconciliation, and dispenser totalizer telemetry.',
      badge: 'MONITORING',
      badgeColor: 'text-cyan-400 bg-cyan-950/60 border-cyan-800/80',
      icon: Database,
      accentColor: 'group-hover:border-cyan-500/60 text-cyan-400',
    },
    {
      id: 'security_audit' as const,
      code: 'WS-03',
      title: 'SECURITY & AUDIT LOGS',
      titleTh: 'ระบบตรวจสอบความปลอดภัยและบันทึกกิจกรรม',
      description: 'Immutable timeline tracking, electronic interlock authorization records, and enterprise compliance logs.',
      badge: 'VERIFIED',
      badgeColor: 'text-emerald-400 bg-emerald-950/60 border-emerald-800/80',
      icon: ShieldCheck,
      accentColor: 'group-hover:border-emerald-500/60 text-emerald-400',
    },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col space-y-6 animate-in fade-in duration-300">
      {/* Top System Bar */}
      <div className="flex items-center justify-between bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl shadow-sm text-slate-200">
        <div className="flex items-center gap-3">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <div>
            <div className="text-xs font-mono font-bold tracking-wider text-slate-200">
              NC SMART CONTROL
            </div>
            <div className="text-[10px] font-mono text-emerald-400 font-semibold tracking-wide flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>SYSTEM READY • PRODUCTION GATEWAY</span>
            </div>
          </div>
        </div>

        <button
          id="btn-replay-splash"
          type="button"
          onClick={onReplaySplash}
          title="Re-run System Initialization"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer border border-slate-700"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">INIT SPLASH</span>
        </button>
      </div>

      {/* Screen Title */}
      <div className="space-y-1.5 text-center sm:text-left px-1">
        <div className="flex items-center justify-center sm:justify-start gap-2 text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
          <Layers className="w-3.5 h-3.5" />
          <span>WORKSPACE SELECTION</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 font-sans">
          เลือกระบบปฏิบัติการองค์กร
        </h2>
        <p className="text-sm text-slate-600 font-sans">
          เลือกสภาพแวดล้อมการทำงานของระบบควบคุมอัตโนมัติ NC SMART CONTROL
        </p>
      </div>

      {/* Touch-Friendly Enterprise Workspace Cards (BIG, CLEAN, MODERN, FUNCTION FIRST) */}
      <div className="grid grid-cols-1 gap-4">
        {workspaces.map((ws) => {
          const Icon = ws.icon;
          return (
            <button
              key={ws.id}
              id={`btn-workspace-${ws.id}`}
              type="button"
              onClick={() => onSelectWorkspace(ws.id)}
              className="group relative flex flex-col text-left p-5 sm:p-6 bg-white hover:bg-slate-50/80 rounded-3xl border-2 border-slate-200 hover:border-slate-400 shadow-sm transition-all duration-200 cursor-pointer overflow-hidden focus:outline-none focus:ring-4 focus:ring-slate-300 active:scale-[0.99]"
            >
              {/* Header row inside card */}
              <div className="flex items-start justify-between w-full mb-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-md">
                    <Icon className="w-6 h-6 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[11px] font-mono font-bold tracking-wider text-slate-400 block">
                      {ws.code}
                    </span>
                    <h3 className="text-lg sm:text-xl font-black tracking-tight text-slate-900 font-mono">
                      {ws.title}
                    </h3>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-mono font-bold tracking-widest px-2.5 py-1 rounded-full border ${ws.badgeColor}`}
                >
                  {ws.badge}
                </span>
              </div>

              {/* Thai Title & Functional Description */}
              <div className="space-y-1.5 pl-0.5">
                <div className="text-sm font-bold text-slate-800">
                  {ws.titleTh}
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-sans">
                  {ws.description}
                </p>
              </div>

              {/* Bottom Launch Indicator */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-semibold text-slate-700 group-hover:text-slate-950">
                <span className="flex items-center gap-1.5 text-slate-500 group-hover:text-slate-900">
                  <Activity className="w-3.5 h-3.5 text-cyan-600" />
                  <span>ENTER WORKSPACE</span>
                </span>
                <div className="flex items-center gap-1 text-slate-900 group-hover:translate-x-1 transition-transform">
                  <span>เข้าสู่ระบบ</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* System Technical Telemetry Bar */}
      <div className="p-4 bg-slate-900 text-slate-400 rounded-2xl border border-slate-800 text-xs font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-cyan-400" />
          <span>NC SMART CORE v2026.4</span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300">STATION INTERLOCK: ARMED</span>
        </div>
        <div className="text-slate-500 text-[11px]">
          SESSION SECURED • ENCRYPTION 256-BIT
        </div>
      </div>
    </div>
  );
};
