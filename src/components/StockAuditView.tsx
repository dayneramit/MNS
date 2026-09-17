import React, { useState } from 'react';
import { 
  Fuel, 
  FileSpreadsheet, 
  CheckCircle2, 
  Truck, 
  ArrowDownCircle, 
  Download, 
  Send, 
  ShieldAlert, 
  Calendar,
  AlertTriangle,
  RefreshCw
} from 'lucide-react';
import { TankTelemetry } from '../types';

interface StockAuditViewProps {
  lang: 'th' | 'en';
  tanks: TankTelemetry[];
}

export const StockAuditView: React.FC<StockAuditViewProps> = ({ lang, tanks }) => {
  const [orderSent, setOrderSent] = useState<boolean>(false);
  const [orderVolume, setOrderVolume] = useState<number>(32000);
  const [orderProduct, setOrderProduct] = useState<string>('HSD B7 (Euro 5)');

  const handleOrderReplenishment = (e: React.FormEvent) => {
    e.preventDefault();
    setOrderSent(true);
    setTimeout(() => {
      setOrderSent(false);
    }, 5000);
  };

  return (
    <div id="stock-audit-view" className="space-y-6">
      {/* Top Banner with Storage Tank Visual */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 overflow-hidden shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  POST LINK • BULK INVENTORY
                </span>
                <span className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>VARIANCE: 0.00% (ZERO LEAKAGE)</span>
                </span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight font-mono">
                {lang === 'th' ? 'การกระทบยอดสต๊อกน้ำมันคลัง & ออดิต' : 'Bulk Stock Telemetry & Shift Reconciliation'}
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                {lang === 'th'
                  ? 'ระบบเปรียบเทียบ 3 ฝั่ง: ระดับในถังวัดด้วยเซนเซอร์ดิจิทัล (ATG) เทียบกับยอดจ่ายสะสมจากมิเตอร์หัวจ่าย (Totalizer) และยอดคำนวณตามบิลอนุมัติ เพื่อป้องกันการสูญหาย 100%'
                  : 'Three-way automated reconciliation: Digital Automated Tank Gauge (ATG) vs Dispenser Positive Displacement Totalizer vs Approved Fleet Fuel Slips.'}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-6 border-t border-slate-800/80 mt-6">
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">{lang === 'th' ? 'กะปัจจุบัน' : 'CURRENT SHIFT'}</span>
                <span className="text-sm sm:text-base font-bold text-white font-mono">Shift #1 (Day)</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">{lang === 'th' ? 'ยอดจ่ายตามมิเตอร์' : 'TOTAL DISPENSED'}</span>
                <span className="text-sm sm:text-base font-bold text-amber-400 font-mono">7,250.0 L</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-mono uppercase block">{lang === 'th' ? 'ความคลาดเคลื่อน' : 'VARIANCE'}</span>
                <span className="text-sm sm:text-base font-bold text-emerald-400 font-mono">0.00 L</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 relative min-h-[220px] lg:min-h-full">
            <img
              src="/src/assets/images/depot_storage_tank_1789659698292.jpg"
              alt="Meena Oil Service Industrial Bulk Storage Tanks"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover brightness-95"
            />
            <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-slate-900 via-transparent to-transparent" />
            <div className="absolute bottom-3 right-3 px-2 py-1 rounded bg-slate-950/80 text-[10px] font-mono text-slate-300 border border-slate-800 backdrop-blur">
              Photo: Rayong Industrial Fuel Depot T-01/02
            </div>
          </div>
        </div>
      </div>

      {/* Shift Reconciliation Table */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-amber-400" />
              <span>{lang === 'th' ? 'ตารางกระทบยอดประจำกะ (Shift Reconciliation Sheet)' : 'Daily Shift Reconciliation Sheet'}</span>
            </h4>
            <p className="text-xs text-slate-400">
              Date: 2026-09-17 • Depot #04 (Rayong) • Supervisor: ชาญวิทย์ รุ่งอรุณ
            </p>
          </div>

          <button
            onClick={() => alert(lang === 'th' ? 'ส่งออกรายงาน CSV/PDF สำเร็จ' : 'Report Exported Successfully')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 hover:text-white transition border border-slate-700 self-start sm:self-center"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'ส่งออกรายงาน (Export CSV)' : 'Export Audit CSV'}</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400">
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'ถังคลัง' : 'TANK ID'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'ผลิตภัณฑ์' : 'PRODUCT'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'ยอดเปิดกะ (L)' : 'OPENING STOCK'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'รับเข้า (L)' : 'INFLOW'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'จ่ายออก (L)' : 'OUTFLOW'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'คำนวณตามบิล (L)' : 'BOOK STOCK'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'วัดจริง ATG (L)' : 'PHYSICAL ATG'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'ผลต่าง (Variance)' : 'VARIANCE'}</th>
                <th className="pb-2.5 font-medium">{lang === 'th' ? 'สถานะ' : 'AUDIT'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-3 font-bold text-amber-400">TANK-01</td>
                <td className="py-3 text-slate-300 font-sans">HSD B7 (Euro 5)</td>
                <td className="py-3 text-slate-200">35,900.0</td>
                <td className="py-3 text-slate-400">0.0</td>
                <td className="py-3 text-slate-200">4,450.0</td>
                <td className="py-3 text-slate-200">31,450.0</td>
                <td className="py-3 font-bold text-white">31,450.0</td>
                <td className="py-3 text-emerald-400 font-bold">0.00 L (0.00%)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    RECONCILED
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-800/40 transition">
                <td className="py-3 font-bold text-amber-400">TANK-02</td>
                <td className="py-3 text-slate-300 font-sans">Diesel B20</td>
                <td className="py-3 text-slate-200">21,000.0</td>
                <td className="py-3 text-slate-400">0.0</td>
                <td className="py-3 text-slate-200">2,800.0</td>
                <td className="py-3 text-slate-200">18,200.0</td>
                <td className="py-3 font-bold text-white">18,200.0</td>
                <td className="py-3 text-emerald-400 font-bold">0.00 L (0.00%)</td>
                <td className="py-3">
                  <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                    RECONCILED
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Meena Oil Bulk Replenishment Order Dispatcher */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-6 shadow-lg">
        <div className="flex items-center gap-2 mb-2">
          <Truck className="w-5 h-5 text-amber-400" />
          <h4 className="text-base font-bold text-white font-mono">
            {lang === 'th' ? 'สั่งเติมน้ำมันเข้าคลังล่วงหน้า (Meena Oil Service Logistics Dispatch)' : 'Direct Bulk Fuel Replenishment Order to Meena Oil Service'}
          </h4>
        </div>
        <p className="text-xs text-slate-400 mb-5 max-w-2xl">
          {lang === 'th'
            ? 'ออกใบสั่งน้ำมันดีเซลล็อตใหญ่จาก Meena Oil Service ขนส่งด้วยรถบรรทุกน้ำมันขนาด 16,000 หรือ 32,000 ลิตร พร้อมระบบวัดความหนาแน่นและซีลป้องกันการปลอมปน'
            : 'Order certified bulk diesel replenishment from Meena Oil Service tankers directly into industrial depot storage.'}
        </p>

        {orderSent ? (
          <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-center space-y-1">
            <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
            <h5 className="text-sm font-bold text-white font-mono">
              {lang === 'th' ? 'ส่งคำสั่งเติมน้ำมันเข้าสู่ Meena Oil Service สำเร็จ' : 'Requisition Transmitted to Meena Oil Logistics'}
            </h5>
            <p className="text-xs text-slate-300">
              PO #MNS-BULK-2026-8819 • {orderVolume.toLocaleString()} Liters of {orderProduct} • ETA: Tomorrow 09:30 AM
            </p>
          </div>
        ) : (
          <form onSubmit={handleOrderReplenishment} className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {lang === 'th' ? 'ชนิดน้ำมันดีเซล:' : 'Diesel Grade:'}
              </label>
              <select
                value={orderProduct}
                onChange={(e) => setOrderProduct(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
              >
                <option value="HSD B7 (Euro 5)">HSD B7 (Euro 5) - Tank-01</option>
                <option value="Diesel B20">Diesel B20 - Tank-02</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {lang === 'th' ? 'ปริมาณที่ต้องการ (ลิตร):' : 'Replenish Volume:'}
              </label>
              <select
                value={orderVolume}
                onChange={(e) => setOrderVolume(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs font-mono focus:border-amber-500 focus:outline-none"
              >
                <option value={16000}>16,000 Liters (Single Tanker)</option>
                <option value={32000}>32,000 Liters (Full Semi-Trailer)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {lang === 'th' ? 'กำหนดส่งปลายทาง:' : 'Delivery Depot:'}
              </label>
              <input
                type="text"
                disabled
                value="Rayong Ind. Park Depot #04"
                className="w-full px-3 py-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-400 text-xs font-mono"
              />
            </div>

            <div>
              <button
                type="submit"
                className="w-full py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition shadow-md flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{lang === 'th' ? 'ส่งคำสั่งสั่งน้ำมัน' : 'Send Requisition'}</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
