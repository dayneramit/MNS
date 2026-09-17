import React, { useState } from 'react';
import { 
  FuelRequest, 
  AutoTimelineEvent, 
  AutoLogEntry, 
  TankTelemetry, 
  DispenserBay, 
  FleetVehicle, 
  FuelTransaction 
} from '../types';
import { 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Fuel, 
  Truck, 
  FileText, 
  Database, 
  Download, 
  Search, 
  Filter, 
  AlertTriangle, 
  Check, 
  Sparkles,
  CloudCheck,
  Layers,
  Activity,
  ArrowUpRight
} from 'lucide-react';

interface AdminPortalViewProps {
  lang: 'th' | 'en';
  requests: FuelRequest[];
  timelineEvents: AutoTimelineEvent[];
  autoLogs: AutoLogEntry[];
  tanks: TankTelemetry[];
  dispensers: DispenserBay[];
  vehicles: FleetVehicle[];
  transactions: FuelTransaction[];
  onApproveRequest: (reqId: string, approvedLiters: number) => Promise<void>;
  onRejectRequest: (reqId: string, reason: string) => Promise<void>;
  onTriggerAutoSave: () => Promise<void>;
  lastAutoSavedTime: string | null;
  onOpenFuelingModal: () => void;
}

export const AdminPortalView: React.FC<AdminPortalViewProps> = ({
  lang,
  requests,
  timelineEvents,
  autoLogs,
  tanks,
  dispensers,
  vehicles,
  transactions,
  onApproveRequest,
  onRejectRequest,
  onTriggerAutoSave,
  lastAutoSavedTime,
  onOpenFuelingModal,
}) => {
  const [adminTab, setAdminTab] = useState<'approvals' | 'timeline' | 'autologs' | 'quick_telemetry'>('approvals');
  const [logFilterCategory, setLogFilterCategory] = useState<string>('ALL');
  const [logSearchQuery, setLogSearchQuery] = useState<string>('');
  const [timelineFilterStage, setTimelineFilterStage] = useState<string>('ALL');
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // Filter pending approvals
  const pendingRequests = requests.filter((r) => r.status === 'pending_approval');
  const recentRequests = requests.filter((r) => r.status !== 'pending_approval');

  // Filter logs
  const filteredLogs = autoLogs.filter((log) => {
    const matchesCat = logFilterCategory === 'ALL' || log.category === logFilterCategory;
    const matchesSearch = 
      !logSearchQuery || 
      log.action.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.actor.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(logSearchQuery.toLowerCase()) ||
      (log.cloudDocId && log.cloudDocId.toLowerCase().includes(logSearchQuery.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  // Filter timeline
  const filteredTimeline = timelineEvents.filter((ev) => {
    return timelineFilterStage === 'ALL' || ev.stage === timelineFilterStage;
  });

  // Calculate totals
  const totalBulkLiters = tanks.reduce((acc, t) => acc + t.currentLiters, 0);
  const totalDispensedToday = vehicles.reduce((acc, v) => acc + v.todayDispensedLiters, 0);
  const totalFleetQuotas = vehicles.reduce((acc, v) => acc + v.dailyQuotaLiters, 0);

  // Handle Approve
  const handleApprove = async (req: FuelRequest) => {
    setActionLoadingId(req.id);
    try {
      await onApproveRequest(req.id, req.requestedLiters);
    } finally {
      setActionLoadingId(null);
    }
  };

  // Handle Reject
  const handleReject = async (req: FuelRequest) => {
    setActionLoadingId(req.id);
    try {
      await onRejectRequest(req.id, 'Odometer verification / Daily Quota limit exceeded');
    } finally {
      setActionLoadingId(null);
    }
  };

  // Export AutoLogs as CSV
  const handleExportLogs = () => {
    const headers = ['ID', 'Timestamp', 'Category', 'Level', 'Action', 'Actor', 'Role', 'Details', 'SavedToCloud'];
    const rows = autoLogs.map((l) => [
      l.id,
      `"${l.timestamp}"`,
      l.category,
      l.level,
      `"${l.action.replace(/"/g, '""')}"`,
      `"${l.actor.replace(/"/g, '""')}"`,
      l.role,
      `"${l.details.replace(/"/g, '""')}"`,
      l.savedToCloud ? 'YES' : 'NO'
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `POST_LINK_AutoLog_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="admin-portal-container" className="space-y-6">
      {/* Admin Top Dashboard Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Pending Approvals */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'th' ? 'คำขอรออนุมัติ' : 'Pending Approvals'}
            </span>
            <div className={`p-2 rounded-xl ${pendingRequests.length > 0 ? 'bg-amber-500/20 text-amber-400 animate-pulse' : 'bg-slate-800 text-slate-500'}`}>
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {pendingRequests.length}
            </span>
            <span className="text-xs font-mono text-slate-400">
              {lang === 'th' ? 'รายการจากคนขับ' : 'driver requests'}
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-amber-400 flex items-center gap-1">
            <span>{pendingRequests.length > 0 ? (lang === 'th' ? 'ต้องการการตรวจสอบด่วน' : 'Requires verification') : (lang === 'th' ? 'คิวอนุมัติว่าง' : 'Queue cleared')}</span>
          </div>
        </div>

        {/* Metric 2: Today's Dispensed vs Quota */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'th' ? 'จ่ายน้ำมันแล้ววันนี้' : 'Dispensed Today'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <Fuel className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
              {totalDispensedToday.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">/ {totalFleetQuotas.toLocaleString()} L</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-slate-400">
            {((totalDispensedToday / totalFleetQuotas) * 100).toFixed(1)}% {lang === 'th' ? 'ของโควตากองเรือรวม' : 'of fleet quota'}
          </div>
        </div>

        {/* Metric 3: Bulk Storage Level */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'th' ? 'สต๊อกน้ำมันคลังรวม' : 'Total Bulk Fuel'}
            </span>
            <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400">
              <Database className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-black text-white font-mono">
              {totalBulkLiters.toLocaleString()}
            </span>
            <span className="text-xs font-mono text-slate-400">Liters</span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-blue-400">
            2 {lang === 'th' ? 'ถังเหล็กเหนียว (TG-01 & TG-02)' : 'Depot Bulk Tanks'}
          </div>
        </div>

        {/* Metric 4: Auto-Save & Cloud Sync Engine */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 relative overflow-hidden shadow-lg">
          <div className="flex justify-between items-start">
            <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              {lang === 'th' ? 'สถานะ Auto-Save & Cloud' : 'Cloud Auto-Save'}
            </span>
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400">
              <CloudCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-2 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-lg font-black text-emerald-400 font-mono">
              CONNECTED
            </span>
          </div>
          <div className="mt-2 text-[11px] font-mono text-slate-400 truncate">
            {lastAutoSavedTime ? `${lang === 'th' ? 'บันทึกล่าสุด:' : 'Synced:'} ${lastAutoSavedTime}` : 'Cloud Firestore Active'}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Admin View */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <button
            id="admin-tab-approvals"
            onClick={() => setAdminTab('approvals')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono transition flex items-center gap-2 ${
              adminTab === 'approvals'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>{lang === 'th' ? 'คิวอนุมัติระยะไกล' : 'Dispatch Approvals'}</span>
            {pendingRequests.length > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-red-600 text-white text-[10px] font-bold">
                {pendingRequests.length}
              </span>
            )}
          </button>

          <button
            id="admin-tab-timeline"
            onClick={() => setAdminTab('timeline')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono transition flex items-center gap-2 ${
              adminTab === 'timeline'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Activity className="w-4 h-4" />
            <span>Auto Timeline</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {timelineEvents.length}
            </span>
          </button>

          <button
            id="admin-tab-autologs"
            onClick={() => setAdminTab('autologs')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold font-mono transition flex items-center gap-2 ${
              adminTab === 'autologs'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>AutoLog Trail</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300 font-mono">
              {autoLogs.length}
            </span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-admin-manual-autosave"
            onClick={onTriggerAutoSave}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono flex items-center gap-1.5 border border-slate-700 transition"
          >
            <CloudCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'th' ? 'ซิงค์เซฟคลาวด์' : 'Sync to Cloud'}</span>
          </button>

          <button
            id="btn-admin-open-simulator"
            onClick={onOpenFuelingModal}
            className="px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 border border-amber-500/40 transition"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{lang === 'th' ? 'เปิดจำลองขั้นตอนการเติม' : 'Interactive Simulator'}</span>
          </button>
        </div>
      </div>

      {/* TAB 1: Dispatch Approvals Queue */}
      {adminTab === 'approvals' && (
        <div className="space-y-6">
          {/* Section: Pending Driver Requests */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>{lang === 'th' ? 'คำขอเติมน้ำมันรอการอนุมัติระยะไกล' : 'Pending Fuel Allocation Requests'}</span>
                </h3>
                <p className="text-xs text-slate-400 font-mono">
                  {lang === 'th' ? 'ตรวจโควตารถและเลขไมล์ เพื่อกดอนุมัติก่อนหัวจ่ายปลดล็อก' : 'Verify vehicle quota & odometer delta before releasing nozzle solenoid'}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/40">
                {pendingRequests.length} {lang === 'th' ? 'รายการค้าง' : 'Pending'}
              </span>
            </div>

            {pendingRequests.length === 0 ? (
              <div className="text-center py-12 border border-dashed border-slate-800 rounded-xl space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <p className="text-sm font-bold text-slate-300">
                  {lang === 'th' ? 'ไม่มีคำขอรออนุมัติในขณะนี้' : 'All fuel requests have been approved or processed'}
                </p>
                <p className="text-xs text-slate-500 font-mono">
                  {lang === 'th' ? 'เมื่อคนขับสร้าง QR จาก Driver Portal คำขอจะปรากฏที่นี่แบบเรียลไทม์' : 'New requests from driver terminals will stream in real-time'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pendingRequests.map((req) => {
                  const veh = vehicles.find((v) => v.id === req.vehicleId);
                  const remainingQuota = veh ? veh.dailyQuotaLiters - veh.todayDispensedLiters : 350;
                  const deltaKm = veh ? req.odometerKm - veh.lastOdometerKm : 350;

                  return (
                    <div 
                      key={req.id}
                      className="p-5 rounded-xl bg-slate-950 border border-amber-500/30 shadow-lg space-y-4 relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/30">
                              {req.id}
                            </span>
                            <span className="text-xs text-slate-500 font-mono">{req.timestamp}</span>
                          </div>
                          <h4 className="text-base font-bold text-white font-mono mt-1">
                            {req.plateNumber}
                          </h4>
                          <p className="text-xs text-slate-400 font-mono">
                            {req.driverName} ({req.driverId})
                          </p>
                        </div>

                        <div className="text-right">
                          <span className="text-2xl font-black text-amber-400 font-mono block">
                            {req.requestedLiters} L
                          </span>
                          <span className="text-[11px] text-slate-400 font-mono">
                            ดีเซล B7 (Euro 5)
                          </span>
                        </div>
                      </div>

                      {/* Verification Checklist */}
                      <div className="grid grid-cols-2 gap-2 text-xs font-mono p-3 rounded-lg bg-slate-900 border border-slate-800">
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase">เลขไมล์ที่แจ้ง</span>
                          <span className="text-white font-bold">{req.odometerKm.toLocaleString()} km</span>
                          <span className="text-[10px] text-emerald-400 block">+{deltaKm} km</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block text-[10px] uppercase">โควตาคงเหลือ</span>
                          <span className="text-emerald-400 font-bold">{remainingQuota} L</span>
                          <span className="text-[10px] text-slate-400 block">{req.requestedLiters <= remainingQuota ? '✓ อยู่ในเกณฑ์' : '⚠ เกินโควตา'}</span>
                        </div>
                      </div>

                      {/* Dynamic Token preview */}
                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 pt-1">
                        <span>QR Token: <strong className="text-slate-300">{req.qrToken}</strong></span>
                        <span className="text-amber-400 font-bold">Expires: {req.qrExpiresAt}</span>
                      </div>

                      {/* Action Buttons: 1-Click Approve / Reject */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                        <button
                          id={`btn-approve-${req.id}`}
                          onClick={() => handleApprove(req)}
                          disabled={actionLoadingId === req.id}
                          className="flex-1 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold font-mono text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950/40 transition"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{lang === 'th' ? 'อนุมัติทันที (Auto-Save)' : 'Authorize Allocation'}</span>
                        </button>

                        <button
                          id={`btn-reject-${req.id}`}
                          onClick={() => handleReject(req)}
                          disabled={actionLoadingId === req.id}
                          className="py-2.5 px-3 rounded-lg bg-red-950/60 hover:bg-red-900/80 border border-red-800/60 text-red-300 font-bold font-mono text-xs flex items-center justify-center gap-1 transition"
                        >
                          <XCircle className="w-4 h-4" />
                          <span>{lang === 'th' ? 'ปฏิเสธ' : 'Reject'}</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Section: Processed / Approved Requests Log */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Check className="w-4 h-4 text-emerald-400" />
                <span>{lang === 'th' ? 'รายการคำขอที่อนุมัติแล้วล่าสุด' : 'Recent Approved / Dispensed Requests'}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {recentRequests.length} {lang === 'th' ? 'รายการ' : 'records'}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
                  <tr>
                    <th className="py-2.5 px-3">Req ID</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Vehicle Plate</th>
                    <th className="py-2.5 px-3">Driver</th>
                    <th className="py-2.5 px-3">Liters</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Approver</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60">
                  {recentRequests.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-800/30 transition">
                      <td className="py-2.5 px-3 font-bold text-white">{r.id}</td>
                      <td className="py-2.5 px-3 text-slate-400">{r.timestamp}</td>
                      <td className="py-2.5 px-3 font-bold text-amber-400">{r.plateNumber}</td>
                      <td className="py-2.5 px-3 text-slate-300">{r.driverName}</td>
                      <td className="py-2.5 px-3 font-bold text-emerald-400">{r.requestedLiters} L</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 uppercase">
                          {r.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-slate-400 truncate max-w-[180px]">
                        {r.approvedBy || 'Auto-Quota System'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Auto Timeline Stream */}
      {adminTab === 'timeline' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                <span>Auto Timeline: {lang === 'th' ? 'ไทม์ไลน์ความเคลื่อนไหวคลังน้ำมันแบบเรียลไทม์' : 'Real-time Fleet Activity Feed'}</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {lang === 'th' ? 'บันทึกเหตุการณ์ต่อเนื่องตั้งแต่รถเข้าเกต, คำขอ QR, อนุมัติ, จ่ายน้ำมัน, จนถึงตัดสต๊อก' : 'End-to-end continuous lifecycle tracking from gate ingress to zero-loss inventory sync'}
              </p>
            </div>

            {/* Stage filter */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-mono">Filter Stage:</span>
              <select
                id="timeline-stage-filter"
                value={timelineFilterStage}
                onChange={(e) => setTimelineFilterStage(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">ALL STAGES (ทุกขั้นตอน)</option>
                <option value="GATE_ARRIVAL">GATE ARRIVAL (เข้าเกต)</option>
                <option value="QR_REQUEST">QR REQUEST (คำขอคนขับ)</option>
                <option value="DISPATCH_APPROVAL">DISPATCH APPROVAL (การอนุมัติ)</option>
                <option value="SOLENOID_DISPENSE">SOLENOID DISPENSE (จ่ายน้ำมัน)</option>
                <option value="STOCK_SYNC">STOCK SYNC (ตัดสต๊อกถัง)</option>
              </select>
            </div>
          </div>

          {/* Timeline Feed Items */}
          <div className="space-y-4 relative pl-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
            {filteredTimeline.map((ev) => (
              <div 
                key={ev.id}
                className="relative pl-6 p-4 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition space-y-2 shadow-sm"
              >
                {/* Status Dot */}
                <span className={`absolute -left-[27px] top-5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${
                  ev.status === 'in_progress' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                }`} />

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/10 text-amber-300 border border-amber-500/30 uppercase">
                      {ev.stage.replace('_', ' ')}
                    </span>
                    <span className="text-sm font-bold text-white font-mono">
                      {lang === 'th' ? ev.titleTh : ev.titleEn}
                    </span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    {ev.timeFormatted}
                  </span>
                </div>

                <p className="text-xs text-slate-300">
                  {lang === 'th' ? ev.descriptionTh : ev.descriptionEn}
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] font-mono text-slate-400 border-t border-slate-900">
                  {ev.plateNumber && (
                    <span className="text-amber-400 font-bold">
                      Vehicle: {ev.plateNumber}
                    </span>
                  )}
                  {ev.driverName && (
                    <span>Driver: {ev.driverName}</span>
                  )}
                  <span>Actor: <strong className="text-slate-300">{ev.actor}</strong></span>
                  <span className="text-emerald-400 flex items-center gap-1 ml-auto">
                    <Check className="w-3 h-3" />
                    <span>Auto-Logged</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: AutoLog Audit Trail */}
      {adminTab === 'autologs' && (
        <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-400" />
                <span>AutoLog: {lang === 'th' ? 'ระบบบันทึก Audit Log อัตโนมัติ (Continuous Cloud Ledger)' : 'Continuous System Audit Log'}</span>
              </h3>
              <p className="text-xs text-slate-400 font-mono">
                {lang === 'th' ? 'บันทึกออโต้เซฟทุกการกระทำ ทุกการตรวจสิทธิ์ และการซิงค์ข้อมูลลง Cloud Firestore แบบอัตโนมัติ' : 'Immutable event auditing with automatic cloud persistence'}
              </p>
            </div>

            {/* Filter and Export Controls */}
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-500" />
                <input
                  id="autolog-search"
                  type="text"
                  placeholder={lang === 'th' ? 'ค้นหา Log...' : 'Search logs...'}
                  value={logSearchQuery}
                  onChange={(e) => setLogSearchQuery(e.target.value)}
                  className="bg-slate-950 border border-slate-700 text-white text-xs font-mono rounded-lg pl-8 pr-3 py-1.5 focus:outline-none focus:border-amber-400 w-44"
                />
              </div>

              <select
                id="autolog-category-select"
                value={logFilterCategory}
                onChange={(e) => setLogFilterCategory(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs font-mono rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-400"
              >
                <option value="ALL">ALL CATEGORIES</option>
                <option value="AUTO_SAVE">AUTO_SAVE</option>
                <option value="REQUEST">REQUEST</option>
                <option value="APPROVAL">APPROVAL</option>
                <option value="DISPENSE">DISPENSE</option>
                <option value="INVENTORY">INVENTORY</option>
                <option value="SECURITY">SECURITY</option>
              </select>

              <button
                id="btn-export-autologs"
                onClick={handleExportLogs}
                className="px-3 py-1.5 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>

          {/* Logs Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="text-[11px] text-slate-400 uppercase bg-slate-950/80 border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Log ID</th>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Category</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Action & Details</th>
                  <th className="py-2.5 px-3">Actor / Role</th>
                  <th className="py-2.5 px-3">Cloud Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition">
                    <td className="py-2.5 px-3 font-bold text-slate-300">{log.id}</td>
                    <td className="py-2.5 px-3 text-slate-400 whitespace-nowrap">{log.timestamp}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-800 text-amber-400 border border-slate-700">
                        {log.category}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.level === 'SUCCESS' ? 'bg-emerald-500/20 text-emerald-400' :
                        log.level === 'WARN' ? 'bg-amber-500/20 text-amber-400' :
                        log.level === 'ERROR' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {log.level}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 max-w-md">
                      <div className="font-bold text-white">{log.action}</div>
                      <div className="text-slate-400 text-[11px] truncate mt-0.5">{log.details}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <div className="text-slate-200">{log.actor}</div>
                      <div className="text-slate-500 text-[10px] uppercase">{log.role}</div>
                    </td>
                    <td className="py-2.5 px-3 whitespace-nowrap">
                      <span className="flex items-center gap-1 text-emerald-400 text-[11px]">
                        <CloudCheck className="w-3.5 h-3.5" />
                        <span>Saved</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
