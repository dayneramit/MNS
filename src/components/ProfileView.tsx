import React from 'react';
import { UserRole, FleetVehicle } from '../types';
import { User, ShieldCheck, Truck, Building2, Radio, Phone, Globe, CheckCircle2 } from 'lucide-react';

interface ProfileViewProps {
  lang: 'th' | 'en';
  setLang: (l: 'th' | 'en') => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeVehicle: FleetVehicle;
  lastAutoSavedTime: string | null;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  lang,
  setLang,
  userRole,
  setUserRole,
  activeVehicle,
  lastAutoSavedTime,
}) => {
  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {/* User Card */}
      <div className="p-5 sm:p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black text-2xl shadow-lg shadow-amber-500/20 shrink-0">
            {userRole === 'driver' ? <Truck className="w-8 h-8" /> : <ShieldCheck className="w-8 h-8" />}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg sm:text-xl font-bold text-white font-mono">
                {userRole === 'driver' ? 'สมพงษ์ ชัยภูมิ (Sompong C.)' : 'สมชาย ทองดี (Somchai T.)'}
              </h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold uppercase ${
                userRole === 'driver'
                  ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              }`}>
                {userRole === 'driver' ? (lang === 'th' ? 'พนักงานขับรถ (Driver)' : 'Fleet Driver') : (lang === 'th' ? 'ผู้ดูแลระบบ (Admin)' : 'System Admin')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono mt-1">
              ID: {userRole === 'driver' ? 'DRV-0821-MNS' : 'ADM-004-MNS'} • {lang === 'th' ? 'สังกัด: กองรถระยอง-ชลบุรี' : 'Dept: Rayong-Chonburi Logistics'}
            </p>
          </div>
        </div>

        {/* Quick Role Switch for Testing / Operation */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-200 block">
              {lang === 'th' ? 'สลับโหมดการทำงานของผู้ใช้' : 'Switch Operational Role'}
            </span>
            <span className="text-[11px] text-slate-400">
              {lang === 'th' ? 'เลือกว่าต้องการใช้งานในฐานะคนขับ หรือเจ้าหน้าที่ศูนย์ควบคุม' : 'Toggle between Driver Terminal and Dispatch Admin'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="profile-switch-driver"
              onClick={() => setUserRole('driver')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                userRole === 'driver'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Truck className="w-3.5 h-3.5" />
              <span>DRIVER</span>
            </button>
            <button
              id="profile-switch-admin"
              onClick={() => setUserRole('admin')}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-1.5 ${
                userRole === 'admin'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMIN</span>
            </button>
          </div>
        </div>

        {/* Assigned Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">
              {lang === 'th' ? 'องค์กร / บริษัท' : 'Company / Organization'}
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              Meena Oil Service Co., Ltd.
            </span>
            <span className="text-[11px] text-amber-400/90 font-mono mt-0.5 block">
              POST LINK / MNS DataLink
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">
              {lang === 'th' ? 'สถานีคลังน้ำมันหลัก' : 'Operating Fuel Depot'}
            </span>
            <span className="text-sm font-bold text-white mt-0.5 block">
              นิคมอุตสาหกรรมมาบตาพุด-ระยอง #04
            </span>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              Depot ID: MNS-RY-04
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">
              {lang === 'th' ? 'รถประจำตำแหน่ง' : 'Assigned Vehicle'}
            </span>
            <span className="text-sm font-bold text-white font-mono mt-0.5 block">
              {activeVehicle.plateNumber}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              {activeVehicle.model} ({activeVehicle.vehicleType})
            </span>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">
              {lang === 'th' ? 'สถานะการเชื่อมต่อระบบ' : 'Telemetry Link'}
            </span>
            <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>ONLINE (4G Cat-M1)</span>
            </span>
            <span className="text-[11px] text-slate-400 font-mono mt-0.5 block">
              Cloud Sync: {lastAutoSavedTime || 'Active'}
            </span>
          </div>
        </div>

        {/* Language Selection */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-slate-200">
              {lang === 'th' ? 'ภาษาของระบบ (Language)' : 'System Language'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLang('th')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition ${
                lang === 'th' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              ไทย (TH)
            </button>
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded text-xs font-mono font-bold transition ${
                lang === 'en' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-white'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>

        {/* Dispatch Contact */}
        <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Phone className="w-4 h-4 text-amber-400" />
            <span>{lang === 'th' ? 'ศูนย์ควบคุมส่วนกลาง (Dispatch Hotline):' : 'Central Dispatch Hotline:'}</span>
          </div>
          <span className="font-mono font-bold text-amber-400">038-999-888 (24 ชม.)</span>
        </div>
      </div>
    </div>
  );
};
