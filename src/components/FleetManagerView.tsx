import React, { useState } from 'react';
import { 
  Truck, 
  Search, 
  Filter, 
  QrCode, 
  Plus, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Gauge,
  Sliders,
  ChevronRight
} from 'lucide-react';
import { FleetVehicle } from '../types';

interface FleetManagerViewProps {
  lang: 'th' | 'en';
  vehicles: FleetVehicle[];
  onOpenFuelingModal: () => void;
  onUpdateQuota: (vehicleId: string, newQuota: number) => void;
}

export const FleetManagerView: React.FC<FleetManagerViewProps> = ({
  lang,
  vehicles,
  onOpenFuelingModal,
  onUpdateQuota,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedDept, setSelectedDept] = useState<string>('all');
  const [editingVehicle, setEditingVehicle] = useState<FleetVehicle | null>(null);
  const [tempQuota, setTempQuota] = useState<number>(250);

  const departments = ['all', 'Rayong Logistics', 'Chonburi Heavy Haul', 'Cold-Chain Central', 'Eastern Distribution'];

  const filteredVehicles = vehicles.filter((v) => {
    const matchesSearch =
      v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.assignedDriver.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.model.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDept = selectedDept === 'all' || v.department === selectedDept;
    return matchesSearch && matchesDept;
  });

  const handleSaveQuota = () => {
    if (editingVehicle) {
      onUpdateQuota(editingVehicle.id, tempQuota);
      setEditingVehicle(null);
    }
  };

  return (
    <div id="fleet-manager-view" className="space-y-6">
      {/* Top Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/90 border border-slate-800 p-4 rounded-xl">
        <div>
          <h3 className="text-lg font-bold text-white font-mono flex items-center gap-2">
            <Truck className="w-5 h-5 text-amber-400" />
            <span>{lang === 'th' ? 'ทะเบียนรถและโควตาน้ำมันกองเรือ' : 'Corporate Fleet Diesel Roster & Quotas'}</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'th' ? 'ควบคุมเพดานการจ่ายน้ำมันต่อคัน • สิทธิ์ผ่านรหัส QR เฉพาะบุคคล' : 'Per-vehicle diesel limits, driver assignments & dynamic QR authorizations.'}
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenFuelingModal}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-md"
          >
            <QrCode className="w-4 h-4" />
            <span>{lang === 'th' ? 'สร้าง QR เติมน้ำมัน' : 'Issue QR Pass'}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={lang === 'th' ? 'ค้นหาทะเบียนรถ, ชื่อคนขับ หรือรุ่นรถ...' : 'Search license plate, driver name or truck model...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-white text-xs sm:text-sm placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 hidden sm:block" />
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition border ${
                selectedDept === dept
                  ? 'bg-amber-500/15 border-amber-400 text-amber-300'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
              }`}
            >
              {dept === 'all' ? (lang === 'th' ? 'ทุกสายงาน' : 'All Divisions') : dept}
            </button>
          ))}
        </div>
      </div>

      {/* Vehicle Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredVehicles.map((vehicle) => {
          const quotaUsedPct = Math.round((vehicle.todayDispensedLiters / vehicle.dailyQuotaLiters) * 100);
          return (
            <div
              key={vehicle.id}
              id={`vehicle-card-${vehicle.id}`}
              className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <span className="text-base font-black text-amber-400 font-mono tracking-tight block">
                      {vehicle.plateNumber}
                    </span>
                    <span className="text-xs text-slate-300 font-medium">
                      {vehicle.vehicleType}
                    </span>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      vehicle.status === 'fueling'
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : vehicle.status === 'ready'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {vehicle.status}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mb-3">{vehicle.model}</p>

                {/* Driver Info */}
                <div className="p-3 rounded-lg bg-slate-950/70 border border-slate-800/80 mb-3 space-y-1.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-400">{lang === 'th' ? 'พนักงานขับ:' : 'Driver:'}</span>
                    <strong className="text-white">{vehicle.assignedDriver}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{lang === 'th' ? 'สังกัด:' : 'Department:'}</span>
                    <span className="text-slate-300">{vehicle.department}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{lang === 'th' ? 'เลขไมล์ล่าสุด:' : 'Odometer:'}</span>
                    <span className="text-slate-200 font-mono">{vehicle.lastOdometerKm.toLocaleString()} km</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">{lang === 'th' ? 'อัตราสิ้นเปลืองเฉลี่ย:' : 'Avg Consumption:'}</span>
                    <span className="text-emerald-400 font-mono font-bold">{vehicle.avgKmL} km/L</span>
                  </div>
                </div>

                {/* Daily Quota Bar */}
                <div className="space-y-1 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-slate-400">{lang === 'th' ? 'โควตารายวัน:' : 'Daily Diesel Quota:'}</span>
                    <span className="text-amber-300 font-mono font-bold">
                      {vehicle.todayDispensedLiters} / {vehicle.dailyQuotaLiters} L ({quotaUsedPct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                    <div
                      className={`h-full ${quotaUsedPct > 90 ? 'bg-rose-500' : 'bg-amber-400'}`}
                      style={{ width: `${Math.min(100, quotaUsedPct)}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => {
                    setEditingVehicle(vehicle);
                    setTempQuota(vehicle.dailyQuotaLiters);
                  }}
                  className="flex items-center gap-1 text-xs text-slate-400 hover:text-white px-2 py-1 rounded bg-slate-800/80 hover:bg-slate-700 transition"
                >
                  <Sliders className="w-3 h-3" />
                  <span>{lang === 'th' ? 'ปรับโควตา' : 'Set Cap'}</span>
                </button>

                <button
                  onClick={onOpenFuelingModal}
                  className="flex items-center gap-1 text-xs font-bold text-slate-950 bg-amber-400 hover:bg-amber-300 px-3 py-1.5 rounded-lg transition"
                >
                  <QrCode className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'ออก QR เติม' : 'Authorize'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Quota Modal */}
      {editingVehicle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="w-full max-w-md bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Sliders className="w-4 h-4 text-amber-400" />
              <span>{lang === 'th' ? 'ปรับเพดานโควตาน้ำมัน' : 'Adjust Daily Diesel Cap'}</span>
            </h4>
            <p className="text-xs text-slate-400">
              {editingVehicle.plateNumber} ({editingVehicle.vehicleType}) - {editingVehicle.assignedDriver}
            </p>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {lang === 'th' ? 'เพดานจำนวนลิตรต่อวัน (Liters/Day):' : 'Daily Max Liters:'}
              </label>
              <input
                type="number"
                value={tempQuota}
                onChange={(e) => setTempQuota(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono font-bold text-lg focus:border-amber-500 focus:outline-none"
              />
              <span className="text-[11px] text-slate-500 mt-1 block">
                Truck Tank Capacity: {editingVehicle.tankCapacityLiters} L
              </span>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3">
              <button
                onClick={() => setEditingVehicle(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
              >
                {lang === 'th' ? 'ยกเลิก' : 'Cancel'}
              </button>
              <button
                onClick={handleSaveQuota}
                className="px-5 py-2 rounded-xl bg-amber-500 text-slate-950 text-xs font-bold hover:bg-amber-400 shadow-md"
              >
                {lang === 'th' ? 'บันทึกการเปลี่ยนแปลง' : 'Save Quota'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
