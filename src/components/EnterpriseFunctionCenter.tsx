import React from 'react';
import { UserRole, FleetVehicle, FuelRequest, FuelTransaction, TankTelemetry, DispenserBay } from '../types';
import { 
  QrCode, 
  ScanLine, 
  Activity, 
  History, 
  Truck, 
  Info, 
  User, 
  Building2, 
  Users, 
  UserCheck, 
  MapPin, 
  Fuel, 
  Shield, 
  Hourglass, 
  ClipboardList, 
  Clock, 
  BarChart3,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface EnterpriseFunctionCenterProps {
  lang: 'th' | 'en';
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  activeVehicle: FleetVehicle;
  pendingRequestsCount: number;
  activeRequest: FuelRequest | null;
  onNavigateAction: (action: string) => void;
}

export const EnterpriseFunctionCenter: React.FC<EnterpriseFunctionCenterProps> = ({
  lang,
  userRole,
  setUserRole,
  activeVehicle,
  pendingRequestsCount,
  activeRequest,
  onNavigateAction,
}) => {
  return (
    <div className="space-y-6 pb-4">
      {/* ========================================================================= */}
      {/* DRIVER HOME FUNCTION MENU                                                 */}
      {/* ========================================================================= */}
      {userRole === 'driver' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Active Fuel Request Quick Banner (if driver has one active) */}
          {activeRequest && activeRequest.status !== 'completed' && activeRequest.status !== 'rejected' && (
            <div 
              onClick={() => onNavigateAction('qr_status')}
              className="p-4 rounded-3xl bg-amber-500 text-slate-950 border border-amber-400 shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-between transition hover:bg-amber-400"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
                  <QrCode className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block text-slate-900">
                    {lang === 'th' ? 'มีคำขอเติมน้ำมันที่กำลังทำงาน' : 'Active Fueling Request'}
                  </span>
                  <span className="text-sm font-black font-mono">
                    {activeRequest.plateNumber} • {activeRequest.approvedLiters || activeRequest.requestedLiters} L
                    {activeRequest.status === 'approved' ? ' (อนุมัติแล้ว พร้อมเติม)' : ' (รอศูนย์อนุมัติ)'}
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-950" />
            </div>
          )}

          {/* SECTION 1: การเติมน้ำมัน */}
          <section aria-labelledby="section-fueling">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 id="section-fueling" className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="text-base">⛽</span>
                <span>{lang === 'th' ? 'การเติมน้ำมัน' : 'Fueling Operations'}</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {lang === 'th' ? 'ระบบจ่ายน้ำมันองค์กร' : 'Enterprise Nozzle System'}
              </span>
            </div>

            {/* Grid 2 Columns */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* 1. ขอน้ำมัน QR */}
              <button
                id="btn-func-request-qr"
                type="button"
                onClick={() => onNavigateAction('request_qr')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-amber-400 hover:ring-1 hover:ring-amber-400 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
                    <QrCode className="w-6 h-6 stroke-[2.3]" />
                  </div>
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'ขอน้ำมัน QR' : 'Request Fuel QR'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'เริ่มคำขอเติมน้ำมัน' : 'Start fuel allocation'}
                  </p>
                </div>
              </button>

              {/* 2. QR ของฉัน */}
              <button
                id="btn-func-my-qr"
                type="button"
                onClick={() => onNavigateAction('my_qr')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition">
                    <ScanLine className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  {activeRequest && (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-100 text-amber-800">
                      Active
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'QR ของฉัน' : 'My Active QR'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'แสดง QR ที่กำลังใช้งาน' : 'Show valid pass'}
                  </p>
                </div>
              </button>

              {/* 3. สถานะการเติม */}
              <button
                id="btn-func-fuel-status"
                type="button"
                onClick={() => onNavigateAction('fuel_status')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Activity className="w-6 h-6 stroke-[2.2]" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'สถานะการเติม' : 'Fueling Status'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'ดูขั้นตอนและสถานะคำขอ' : 'Track dispense stage'}
                  </p>
                </div>
              </button>

              {/* 4. ประวัติการเติม */}
              <button
                id="btn-func-driver-history"
                type="button"
                onClick={() => onNavigateAction('history')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition">
                    <History className="w-6 h-6 stroke-[2.2]" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'ประวัติการเติม' : 'Fuel Logs'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'ดูรายการเติมที่ผ่านมา' : 'Past completed dispenses'}
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* SECTION 2: รถและผู้ขับ */}
          <section aria-labelledby="section-vehicles">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 id="section-vehicles" className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="text-base">🚚</span>
                <span>{lang === 'th' ? 'รถและผู้ขับ' : 'Vehicles & Driver'}</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {activeVehicle.plateNumber}
              </span>
            </div>

            {/* Grid 2 Columns */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* 5. รถของฉัน */}
              <button
                id="btn-func-my-vehicle"
                type="button"
                onClick={() => onNavigateAction('my_vehicle')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                    <Truck className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[11px] font-mono font-bold text-slate-500">
                    {activeVehicle.plateNumber}
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'รถของฉัน' : 'My Vehicle'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'รถที่ Driver ใช้งาน' : 'Assigned fleet truck'}
                  </p>
                </div>
              </button>

              {/* 6. ข้อมูลรถ */}
              <button
                id="btn-func-vehicle-info"
                type="button"
                onClick={() => onNavigateAction('vehicle_info')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition">
                    <Info className="w-6 h-6 stroke-[2.2]" />
                  </div>
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'ข้อมูลรถ' : 'Vehicle Info'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'ดูข้อมูลรถที่ผูกกับระบบ' : 'All vehicle details'}
                  </p>
                </div>
              </button>

              {/* 7. โปรไฟล์ */}
              <button
                id="btn-func-driver-profile"
                type="button"
                onClick={() => onNavigateAction('profile')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer col-span-2 sm:col-span-1"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                    <User className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    สมพงษ์ ชัยภูมิ
                  </span>
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'โปรไฟล์' : 'Driver Profile'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'ข้อมูลผู้ขับ & ตั้งค่าระบบ' : 'Driver identity & settings'}
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADMIN HOME FUNCTION MENU                                                  */}
      {/* ========================================================================= */}
      {userRole === 'admin' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Pending Requests Alert Banner */}
          {pendingRequestsCount > 0 && (
            <div 
              onClick={() => onNavigateAction('admin_approvals')}
              className="p-4 rounded-3xl bg-amber-500 text-slate-950 border border-amber-400 shadow-md shadow-amber-500/20 cursor-pointer flex items-center justify-between transition hover:bg-amber-400"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-slate-950 text-amber-400 flex items-center justify-center font-bold">
                  <Hourglass className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider block text-slate-900">
                    {lang === 'th' ? 'มีรายการรอการอนุมัติจ่ายน้ำมัน' : 'Pending Fuel Requests'}
                  </span>
                  <span className="text-sm font-black font-mono">
                    {pendingRequestsCount} {lang === 'th' ? 'รายการจากพนักงานขับรถ' : 'requests waiting for dispatcher'}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-1 rounded-xl bg-slate-950 text-amber-400 text-xs font-bold font-mono">
                  {lang === 'th' ? 'กดเพื่ออนุมัติ' : 'Review'}
                </span>
                <ChevronRight className="w-5 h-5 text-slate-950" />
              </div>
            </div>
          )}

          {/* SECTION 1: การจัดการ (สำหรับ ADMIN) */}
          <section aria-labelledby="section-admin-mgmt">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 id="section-admin-mgmt" className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="text-base">🏢</span>
                <span>{lang === 'th' ? 'การจัดการ' : 'Depot Management'}</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {lang === 'th' ? 'ศูนย์ควบคุมส่วนกลาง' : 'Central Dispatch'}
              </span>
            </div>

            {/* Grid 2 Columns */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* 1. บริษัท */}
              <button
                id="btn-admin-company"
                type="button"
                onClick={() => onNavigateAction('company')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition">
                  <Building2 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'บริษัท' : 'Company'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'ข้อมูลบริษัท/หน่วยงาน' : 'Organization profile'}
                  </p>
                </div>
              </button>

              {/* 2. Fleet */}
              <button
                id="btn-admin-fleet"
                type="button"
                onClick={() => onNavigateAction('fleet')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition">
                  <Truck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'Fleet' : 'Fleet Vehicles'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'จัดการกลุ่มรถ & โควตา' : 'Vehicles & quota'}
                  </p>
                </div>
              </button>

              {/* 3. ผู้ขับขี่ */}
              <button
                id="btn-admin-drivers"
                type="button"
                onClick={() => onNavigateAction('drivers')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                  <Users className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'ผู้ขับขี่' : 'Drivers'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'จัดการ Driver และรถ' : 'Manage fleet operators'}
                  </p>
                </div>
              </button>

              {/* 4. ผู้อนุมัติ */}
              <button
                id="btn-admin-approvers"
                type="button"
                onClick={() => onNavigateAction('approvers')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                  <UserCheck className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'ผู้อนุมัติ' : 'Approvers'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'จัดการผู้มีสิทธิ์อนุมัติ' : 'Authorized dispatchers'}
                  </p>
                </div>
              </button>

              {/* 5. จุดเติมน้ำมัน */}
              <button
                id="btn-admin-fuel-point"
                type="button"
                onClick={() => onNavigateAction('depot_telemetry')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
                  <MapPin className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'จุดเติมน้ำมัน' : 'Fuel Depots'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'จัดการสถานี/ระดับถัง' : 'Station & bulk tanks'}
                  </p>
                </div>
              </button>

              {/* 6. ตู้จ่ายน้ำมัน */}
              <button
                id="btn-admin-dispensers"
                type="button"
                onClick={() => onNavigateAction('dispensers')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-800 flex items-center justify-center group-hover:scale-105 transition">
                  <Fuel className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'ตู้จ่ายน้ำมัน' : 'Dispensers'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'ข้อมูลตู้จ่าย & วาล์ว' : 'Bays & solenoid valves'}
                  </p>
                </div>
              </button>

              {/* 7. สิทธิ์การใช้งาน */}
              <button
                id="btn-admin-permissions"
                type="button"
                onClick={() => onNavigateAction('permissions')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer col-span-2 sm:col-span-1"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition">
                  <Shield className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'สิทธิ์การใช้งาน' : 'Permissions'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'จัดการ Role และสิทธิ์' : 'RBAC and access policy'}
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* SECTION 2: รายการและรายงาน */}
          <section aria-labelledby="section-admin-reports">
            <div className="flex items-center justify-between mb-3 px-1">
              <h2 id="section-admin-reports" className="text-sm sm:text-base font-bold text-slate-800 flex items-center gap-2">
                <span className="text-base">📋</span>
                <span>{lang === 'th' ? 'รายการและรายงาน' : 'Transactions & Reports'}</span>
              </h2>
              <span className="text-xs font-mono text-slate-500">
                {lang === 'th' ? 'ตรวจสอบแบบ Real-time' : 'Real-time Audit'}
              </span>
            </div>

            {/* Grid 2 Columns */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {/* 8. รออนุมัติ */}
              <button
                id="btn-admin-pending"
                type="button"
                onClick={() => onNavigateAction('admin_approvals')}
                className={`p-4 sm:p-5 rounded-3xl border shadow-sm hover:shadow-md text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer ${
                  pendingRequestsCount > 0 
                    ? 'bg-amber-500/10 border-amber-400 hover:border-amber-500' 
                    : 'bg-white border-slate-200/90 hover:border-slate-300'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-105 transition ${
                    pendingRequestsCount > 0 ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' : 'bg-slate-100 text-slate-700'
                  }`}>
                    <Hourglass className="w-6 h-6 stroke-[2.2]" />
                  </div>
                  {pendingRequestsCount > 0 && (
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold font-mono bg-red-500 text-white animate-pulse">
                      {pendingRequestsCount} รอ
                    </span>
                  )}
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'รออนุมัติ' : 'Pending Queue'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'รายการที่ต้องดำเนินการ' : 'Requires dispatch action'}
                  </p>
                </div>
              </button>

              {/* 9. รายการเติมน้ำมัน */}
              <button
                id="btn-admin-tx-list"
                type="button"
                onClick={() => onNavigateAction('history')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition">
                  <ClipboardList className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'รายการเติมน้ำมัน' : 'Dispense Logs'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'รายการทั้งหมด' : 'All completed dispenses'}
                  </p>
                </div>
              </button>

              {/* 10. ประวัติการใช้งาน */}
              <button
                id="btn-admin-audit-logs"
                type="button"
                onClick={() => onNavigateAction('audit_logs')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:scale-105 transition">
                  <Clock className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'ประวัติการใช้งาน' : 'Audit Logs'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'Audit & System Logs' : 'Security & event records'}
                  </p>
                </div>
              </button>

              {/* 11. รายงาน */}
              <button
                id="btn-admin-reports-summary"
                type="button"
                onClick={() => onNavigateAction('reports')}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md hover:border-slate-300 text-left transition flex flex-col justify-between min-h-[110px] sm:min-h-[125px] group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition">
                  <BarChart3 className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div className="mt-3">
                  <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-tight">
                    {lang === 'th' ? 'รายงาน' : 'Reports'}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                    {lang === 'th' ? 'สรุปข้อมูลสำหรับ Admin' : 'Executive fuel summaries'}
                  </p>
                </div>
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
