import React from 'react';
import { 
  Fuel, 
  Thermometer, 
  Droplets, 
  Activity, 
  AlertCircle, 
  Truck, 
  CheckCircle2, 
  ArrowUpRight, 
  Clock, 
  FileText,
  ShieldCheck,
  Zap,
  RotateCw
} from 'lucide-react';
import { TankTelemetry, DispenserBay, FuelTransaction } from '../types';

interface DepotTelemetryViewProps {
  lang: 'th' | 'en';
  tanks: TankTelemetry[];
  dispensers: DispenserBay[];
  transactions: FuelTransaction[];
  onOpenFuelingModal: () => void;
  onRefreshTelemetry: () => void;
}

export const DepotTelemetryView: React.FC<DepotTelemetryViewProps> = ({
  lang,
  tanks,
  dispensers,
  transactions,
  onOpenFuelingModal,
  onRefreshTelemetry,
}) => {
  const totalCapacity = tanks.reduce((acc, t) => acc + t.capacityLiters, 0);
  const totalCurrent = tanks.reduce((acc, t) => acc + t.currentLiters, 0);
  const tankFillPercent = Math.round((totalCurrent / totalCapacity) * 100);

  return (
    <div id="depot-telemetry-view" className="space-y-6">
      {/* Industrial Hero Banner with Realistic Generated Facility Image */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="relative h-64 sm:h-80 md:h-96 w-full">
          <img
            src="/src/assets/images/onboarding_hero_1789660102836.jpg"
            alt="POST LINK Industrial Corporate Fuel Management Depot"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center brightness-90 contrast-105"
          />
          {/* Subtle industrial gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Location & Depot Badges */}
          <div className="absolute top-4 left-4 flex flex-wrap items-center gap-2">
            <span className="px-3 py-1 rounded-md bg-slate-900/90 text-amber-400 font-mono text-xs font-bold border border-amber-500/40 backdrop-blur flex items-center gap-1.5 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>DEPOT #04 • RAYONG INDUSTRIAL PARK</span>
            </span>
            <span className="px-3 py-1 rounded-md bg-slate-900/90 text-slate-200 text-xs font-medium border border-slate-700 backdrop-blur">
              {lang === 'th' ? 'คลังน้ำมันองค์กรเพื่อรถกองเรือ' : 'Corporate Fleet Fueling Facility'}
            </span>
          </div>

          <div className="absolute top-4 right-4">
            <button
              onClick={onRefreshTelemetry}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-medium border border-slate-700 backdrop-blur transition"
              title="Refresh Telemetry"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'รีเฟรชโทรมาตร' : 'Sync Telemetry'}</span>
            </button>
          </div>

          {/* Hero Content Overlay */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500 text-slate-950 mb-2">
                POST LINK • MNS DATALINK
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight font-mono">
                {lang === 'th' ? 'ระบบควบคุมการเติมน้ำมันของรถตัวเอง' : 'Internal Fleet Fuel Telemetry & Control'}
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 font-medium">
                {lang === 'th'
                  ? 'คลังน้ำมันประจำโรงงานและศูนย์กระจายสินค้าภาคตะวันออก บริหารจัดการการจ่ายน้ำมันสำหรับรถสิบล้อ รถหกล้อ และรถหัวลาก ด้วยรหัส QR ไดนามิกและโซลินอยด์ล็อกหัวจ่าย'
                  : 'Factory-owned fuel depot for 6-wheel, 10-wheel, and tractor trailer fleets. Real-time solenoid interlock with QR approval and bulk tank telemetry.'}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={onOpenFuelingModal}
                className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-sm tracking-wide transition shadow-xl shadow-amber-500/25 flex items-center gap-2 whitespace-nowrap"
              >
                <Fuel className="w-4 h-4 fill-slate-950" />
                <span>{lang === 'th' ? 'อนุมัติการเติมน้ำมัน (QR Pass)' : 'Authorize Vehicle (QR)'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Industrial Key Metric Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-slate-800 bg-slate-950/90 border-t border-slate-800">
          <div className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                {lang === 'th' ? 'น้ำมันคงเหลือรวมในคลัง' : 'Total Bulk Stock'}
              </p>
              <p className="text-lg sm:text-xl font-bold text-white font-mono">
                {totalCurrent.toLocaleString()} <span className="text-xs text-slate-400 font-normal">/ {totalCapacity.toLocaleString()} L</span>
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                {lang === 'th' ? 'จ่ายวันนี้ (กะเช้า/บ่าย)' : "Today's Dispensed"}
              </p>
              <p className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
                7,250.0 <span className="text-xs text-slate-400 font-normal">Liters</span>
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                {lang === 'th' ? 'รถในกองเรือเติมวันนี้' : 'Active Fleet Serviced'}
              </p>
              <p className="text-lg sm:text-xl font-bold text-white font-mono">
                24 / 28 <span className="text-xs text-slate-400 font-normal">Trucks (85.7%)</span>
              </p>
            </div>
          </div>

          <div className="p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs text-slate-400 font-medium">
                {lang === 'th' ? 'การสูญหายที่ไม่ทราบสาเหตุ' : 'Unaccounted Loss'}
              </p>
              <p className="text-lg sm:text-xl font-bold text-emerald-400 font-mono">
                0.00% <span className="text-xs text-slate-400 font-normal">(Zero Leakage)</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Industrial Bulk Storage Tanks Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
              <span>{lang === 'th' ? 'โทรมาตรถังเก็บน้ำมันคลัง (Bulk Storage Tanks)' : 'Industrial Bulk Fuel Tanks Telemetry'}</span>
            </h3>
            <span className="text-xs font-mono text-slate-400">
              [AS 1940 / NFPA 30 Compliant]
            </span>
          </div>
          <span className="text-xs text-emerald-400 font-mono flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>BUND SENSORS: DRY</span>
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {tanks.map((tank) => {
            const fillPct = Math.round((tank.currentLiters / tank.capacityLiters) * 100);
            return (
              <div
                key={tank.id}
                id={`tank-card-${tank.id}`}
                className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg relative overflow-hidden"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                        {tank.id}
                      </span>
                      <h4 className="text-base font-bold text-white">{tank.name}</h4>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      {lang === 'th' ? 'ชนิดน้ำมัน:' : 'Product:'} <strong className="text-amber-300">{tank.fuelType}</strong>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono">
                    {tank.status.toUpperCase()}
                  </span>
                </div>

                {/* Visual Level Bar */}
                <div className="space-y-1.5 mb-4">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 font-medium">
                      {lang === 'th' ? 'ระดับสต๊อกคงเหลือ' : 'Current Stock Volume'}
                    </span>
                    <span className="text-white font-mono font-bold">
                      {tank.currentLiters.toLocaleString()} / {tank.capacityLiters.toLocaleString()} L ({fillPct}%)
                    </span>
                  </div>
                  <div className="w-full h-4 rounded-full bg-slate-950 border border-slate-800 p-0.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-amber-600 via-amber-500 to-amber-400 transition-all duration-500"
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>

                {/* Telemetry Sensor Readouts */}
                <div className="grid grid-cols-4 gap-2 py-2 px-3 rounded-lg bg-slate-950/70 border border-slate-800/80 text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'th' ? 'อุณหภูมิ' : 'TEMP'}</span>
                    <span className="font-bold text-slate-200">{tank.temperatureC}°C</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'th' ? 'น้ำก้นถัง' : 'WATER'}</span>
                    <span className="font-bold text-emerald-400">{tank.waterBottomMm} mm</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'th' ? 'ความหนาแน่น' : 'DENSITY'}</span>
                    <span className="font-bold text-slate-200">{tank.densityKgM3}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">{lang === 'th' ? 'ที่ว่าง (Ullage)' : 'ULLAGE'}</span>
                    <span className="font-bold text-amber-400">{(tank.capacityLiters - tank.currentLiters).toLocaleString()} L</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between">
                  <span>{lang === 'th' ? 'เติมสต๊อกล่าสุด:' : 'Last Inflow:'} {tank.lastReplenished}</span>
                  <span className="text-amber-400 font-medium">Meena Oil Delivery</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Dispenser Bays & Pumping Telemetry */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-400"></span>
            <span>{lang === 'th' ? 'สถานะหัวจ่ายน้ำมันคลัง (Dispenser Bays)' : 'Live Dispenser Bays & Solenoid Status'}</span>
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            OPTICAL QR TERMINALS: READY
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {dispensers.map((bay) => {
            const isDispensing = bay.status === 'dispensing';
            return (
              <div
                key={bay.id}
                id={`dispenser-bay-${bay.id}`}
                className={`rounded-xl border p-4 shadow-lg transition relative ${
                  isDispensing
                    ? 'bg-slate-900 border-amber-500/60 ring-1 ring-amber-400/30'
                    : 'bg-slate-900/80 border-slate-800'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-slate-800 text-slate-200 font-mono font-bold text-xs flex items-center justify-center border border-slate-700">
                      #{bay.bayNumber}
                    </span>
                    <h4 className="text-sm font-bold text-white">{bay.name}</h4>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                      isDispensing
                        ? 'bg-amber-500 text-slate-950 animate-pulse'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {isDispensing ? 'DISPENSING' : 'STANDBY'}
                  </span>
                </div>

                {isDispensing ? (
                  <div className="space-y-3">
                    <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{lang === 'th' ? 'ทะเบียนรถ:' : 'Vehicle Plate:'}</span>
                        <strong className="text-amber-400 font-mono text-sm">{bay.currentVehiclePlate}</strong>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-slate-400">{lang === 'th' ? 'คนขับรถ:' : 'Driver:'}</span>
                        <span className="text-slate-200">{bay.currentDriverName}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                        <span className="text-slate-400">{lang === 'th' ? 'อัตราการไหล:' : 'Flow Rate:'}</span>
                        <span className="text-emerald-400 font-mono font-bold">{bay.flowRateLpm} L/min</span>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-slate-400">{lang === 'th' ? 'กำลังจ่ายน้ำมัน:' : 'Pumping:'}</span>
                        <span className="text-amber-300 font-bold">
                          {bay.dispensedLiters?.toFixed(1)} / {bay.targetLiters?.toFixed(1)} L
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
                        <div
                          className="h-full bg-amber-400 animate-pulse"
                          style={{
                            width: `${Math.min(100, ((bay.dispensedLiters || 0) / (bay.targetLiters || 1)) * 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-6 text-center space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                      <Fuel className="w-5 h-5" />
                    </div>
                    <p className="text-xs text-slate-400">
                      {lang === 'th' ? 'พร้อมรับคำขอเติม (รอสแกน QR)' : 'Awaiting Next Fleet Vehicle (Ready for QR)'}
                    </p>
                    <p className="text-[11px] text-slate-500 font-mono">
                      Shift Total: {bay.totalShiftLiters.toLocaleString()} L
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Real-time Fleet Fueling Logs */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              <span>{lang === 'th' ? 'บันทึกการเติมน้ำมันล่าสุด (Digital Fuel Slips)' : 'Recent Fleet Fuel Authorization Slips'}</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'th' ? 'ตรวจสอบสิทธิ์เรียลไทม์ • รหัส QR ปลดล็อกเฉพาะคัน • หักสต๊อกอัตโนมัติ' : 'Real-time verified slips with dynamic QR authorization code & instantaneous tank deduction.'}
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
            AUDIT TRAIL VERIFIED
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-mono">
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'เวลา / วันที่' : 'TIMESTAMP'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'ทะเบียนรถ' : 'PLATE NO.'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'ประเภทรถ' : 'CLASS'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'พนักงานขับรถ' : 'DRIVER'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'จำนวนลิตร' : 'LITERS'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'เลขไมล์' : 'ODOMETER'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'กม./ลิตร' : 'KM/L'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'รหัสอนุมัติ' : 'APPROVAL CODE'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-slate-800/40 transition">
                  <td className="py-3 text-slate-300 font-sans">{tx.timestamp}</td>
                  <td className="py-3 font-bold text-amber-400">{tx.plateNumber}</td>
                  <td className="py-3 text-slate-300 font-sans">{tx.vehicleType}</td>
                  <td className="py-3 text-slate-200 font-sans">{tx.driverName}</td>
                  <td className="py-3 font-bold text-emerald-400">{tx.litersDispensed.toFixed(1)} L</td>
                  <td className="py-3 text-slate-300">{tx.odometerKm.toLocaleString()} km</td>
                  <td className="py-3">
                    <span className="px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold">
                      {tx.kmPerLiterEfficiency?.toFixed(2)} km/L
                    </span>
                  </td>
                  <td className="py-3 text-slate-400 font-mono text-[11px]">{tx.approvalCode}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
