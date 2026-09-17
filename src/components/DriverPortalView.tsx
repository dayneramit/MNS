import React, { useState, useEffect } from 'react';
import { FleetVehicle, FuelRequest, AutoTimelineEvent, AutoLogEntry, TankTelemetry, DispenserBay } from '../types';
import { 
  Truck, 
  QrCode, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Fuel, 
  Gauge, 
  ArrowRight, 
  RefreshCw, 
  FileText, 
  Sparkles,
  Zap,
  Play,
  RotateCcw,
  CloudCheck,
  Check,
  Camera,
  Scan
} from 'lucide-react';
import { DriverQrCameraScanner, ScannedBayVerification } from './DriverQrCameraScanner';

interface DriverPortalViewProps {
  lang: 'th' | 'en';
  vehicles: FleetVehicle[];
  activeVehicle: FleetVehicle;
  onSelectVehicle: (v: FleetVehicle) => void;
  onRequestFuel: (request: FuelRequest) => Promise<void>;
  onSimulateDispense: (request: FuelRequest) => void;
  timelineEvents: AutoTimelineEvent[];
  myRequests: FuelRequest[];
  lastAutoSavedTime: string | null;
}

export const DriverPortalView: React.FC<DriverPortalViewProps> = ({
  lang,
  vehicles,
  activeVehicle,
  onSelectVehicle,
  onRequestFuel,
  onSimulateDispense,
  timelineEvents,
  myRequests,
  lastAutoSavedTime,
}) => {
  const [odometer, setOdometer] = useState<number>(activeVehicle.lastOdometerKm + 380);
  const [requestedLiters, setRequestedLiters] = useState<number>(180);
  const [activeRequest, setActiveRequest] = useState<FuelRequest | null>(
    myRequests.find((r) => r.vehicleId === activeVehicle.id && r.status !== 'completed' && r.status !== 'rejected') || null
  );
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [qrCountdown, setQrCountdown] = useState<number>(280); // seconds remaining
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannedBay, setScannedBay] = useState<ScannedBayVerification | null>(null);

  // Sync odometer if active vehicle changes
  useEffect(() => {
    setOdometer(activeVehicle.lastOdometerKm + 380);
    const existing = myRequests.find((r) => r.vehicleId === activeVehicle.id && r.status !== 'completed' && r.status !== 'rejected');
    setActiveRequest(existing || null);
  }, [activeVehicle, myRequests]);

  // QR countdown timer
  useEffect(() => {
    if (!activeRequest || activeRequest.status === 'completed' || activeRequest.status === 'rejected') return;
    const timer = setInterval(() => {
      setQrCountdown((prev) => (prev > 0 ? prev - 1 : 300));
    }, 1000);
    return () => clearInterval(timer);
  }, [activeRequest]);

  const maxAllowedLiters = Math.max(0, activeVehicle.dailyQuotaLiters - activeVehicle.todayDispensedLiters);
  const estimatedKmSinceLast = Math.max(0, odometer - activeVehicle.lastOdometerKm);

  // Handle successful camera verification of dispenser bay
  const handleVerificationComplete = (verification: ScannedBayVerification) => {
    setScannedBay(verification);
    if (activeRequest) {
      const updated: FuelRequest = {
        ...activeRequest,
        bayId: verification.bayId,
        verifiedBayId: verification.bayId,
        verifiedBayName: verification.bayName,
        verifiedAt: verification.timestamp,
        scannerVerificationStatus: 'verified',
      };
      setActiveRequest(updated);
      onRequestFuel(updated);
    }
  };

  // Submit fuel request (Triggers Auto-Save, Auto-Timeline, and Auto-Log)
  const handleGenerateQr = async () => {
    if (requestedLiters <= 0) return;
    setIsSubmitting(true);

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];
    const newReq: FuelRequest = {
      id: `REQ-${Date.now().toString().slice(-6)}`,
      timestamp: `${now.toISOString().split('T')[0]} ${timeStr}`,
      vehicleId: activeVehicle.id,
      plateNumber: activeVehicle.plateNumber,
      driverName: activeVehicle.assignedDriver,
      driverId: activeVehicle.driverId,
      requestedLiters: Math.min(requestedLiters, maxAllowedLiters),
      odometerKm: odometer,
      tankId: 'TANK-01',
      bayId: scannedBay ? scannedBay.bayId : 'BAY-01',
      verifiedBayId: scannedBay?.bayId,
      verifiedBayName: scannedBay?.bayName,
      verifiedAt: scannedBay?.timestamp,
      scannerVerificationStatus: scannedBay ? 'verified' : 'unverified',
      qrToken: `MNS-QR-${Math.floor(10000 + Math.random() * 90000)}-${Date.now().toString().slice(-4)}`,
      qrExpiresAt: new Date(Date.now() + 5 * 60 * 1000).toTimeString().split(' ')[0],
      status: 'pending_approval',
    };

    try {
      await onRequestFuel(newReq);
      setActiveRequest(newReq);
      setQrCountdown(300);
    } finally {
      setIsSubmitting(false);
    }
  };

  const myVehicleTimeline = timelineEvents.filter(
    (e) => e.plateNumber === activeVehicle.plateNumber || e.driverName === activeVehicle.assignedDriver
  );

  return (
    <div id="driver-portal-container" className="space-y-6">
      {/* Top Banner: Driver Context & Switcher */}
      <div className="rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 uppercase">
                  {lang === 'th' ? 'พอร์ทัลคนขับรถ' : 'Driver Portal'}
                </span>
                <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                  <CloudCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'ออโต้เซฟคลาวด์เปิดทำงาน' : 'Cloud Auto-Save Active'}</span>
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-white mt-1">
                {activeVehicle.assignedDriver} ({activeVehicle.driverId})
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 font-mono">
                {activeVehicle.plateNumber} • {activeVehicle.vehicleType} • {activeVehicle.department}
              </p>
            </div>
          </div>

          {/* Quick Vehicle Switcher */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 font-mono whitespace-nowrap pl-1">
              {lang === 'th' ? 'เปลี่ยนรถประจำตัว:' : 'Switch Assigned Truck:'}
            </span>
            <select
              id="driver-vehicle-select"
              value={activeVehicle.id}
              onChange={(e) => {
                const found = vehicles.find((v) => v.id === e.target.value);
                if (found) onSelectVehicle(found);
              }}
              className="bg-slate-900 text-white text-xs sm:text-sm rounded-lg border border-slate-700 px-3 py-1.5 focus:outline-none focus:border-amber-400 font-mono"
            >
              {vehicles.map((v) => (
                <option key={v.id} value={v.id}>
                  {v.plateNumber} - {v.assignedDriver} ({v.vehicleType})
                </option>
              ))}
            </select>
          </div>
        </div>

        {lastAutoSavedTime && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{lang === 'th' ? 'ออโต้เซฟล่าสุด:' : 'Last Cloud Auto-Save:'} {lastAutoSavedTime}</span>
            </span>
            <span>{lang === 'th' ? 'บันทึกประวัติและไทม์ไลน์อัตโนมัติ (AutoLog & AutoTimeline Enabled)' : 'Zero manual save required'}</span>
          </div>
        )}
      </div>

      {/* Main Grid: Left Request & QR Action / Right Vehicle Stats & Journey */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Interactive Fuel Request & Dynamic QR Terminal (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Fuel Request Form or Active QR Pass */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <Fuel className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">
                    {lang === 'th' ? 'คำขอเติมน้ำมันดีเซล B7 ประจำเที่ยว' : 'Diesel Fuel Request Terminal'}
                  </h2>
                  <p className="text-xs text-slate-400 font-mono">
                    {lang === 'th' ? 'ระบุเลขไมล์และจำนวนลิตร เพื่อสร้างรหัส QR ไดนามิก' : 'Input odometer & volume to generate dynamic pass'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="btn-open-camera-scanner-top"
                  type="button"
                  onClick={() => setIsScannerOpen(true)}
                  className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-1.5 transition shadow-sm ${
                    scannedBay
                      ? 'bg-emerald-950/50 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/50'
                      : 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-amber-400 hover:text-amber-300'
                  }`}
                  title="Open Camera QR Scanner"
                >
                  <Camera className="w-3.5 h-3.5" />
                  <span>{scannedBay ? `✓ ${scannedBay.bayId}` : (lang === 'th' ? 'สแกนกล้อง QR ตู้จ่าย' : 'Camera Scanner')}</span>
                </button>

                {activeRequest && (
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold uppercase ${
                    activeRequest.status === 'approved' 
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse'
                      : activeRequest.status === 'dispensing'
                      ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/40 animate-pulse'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}>
                    {activeRequest.status.replace('_', ' ')}
                  </span>
                )}
              </div>
            </div>

            {/* If NO active request: Request Form */}
            {!activeRequest ? (
              <div className="space-y-5">
                {/* Dispenser Bay Camera Verification Card */}
                <div className={`p-4 rounded-xl border transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  scannedBay 
                    ? 'bg-emerald-950/25 border-emerald-500/40 text-emerald-300'
                    : 'bg-slate-950/80 border-slate-800 text-slate-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      scannedBay ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                    }`}>
                      {scannedBay ? <ShieldCheck className="w-5 h-5" /> : <Scan className="w-5 h-5 animate-pulse" />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono">
                          {scannedBay 
                            ? `${scannedBay.bayId}: ${scannedBay.bayName}` 
                            : (lang === 'th' ? 'การยืนยันตู้จ่ายน้ำมัน (Dispenser Verification)' : 'Dispenser Verification')}
                        </span>
                        {scannedBay && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                            CAMERA VERIFIED
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                        {scannedBay 
                          ? `${scannedBay.fuelType} • มิเตอร์: ${scannedBay.meterCalibrationId} • วาล์ว: ปลดล็อกพร้อมจ่าย`
                          : (lang === 'th' ? 'เปิดกล้องสแกน QR หน้าตู้หัวจ่ายเพื่อยืนยันพิกัดและปลดล็อกวาล์วจ่าย' : 'Scan dispenser QR tag via camera to verify bay & arm solenoid')}
                      </p>
                    </div>
                  </div>

                  <button
                    id="btn-trigger-camera-verification"
                    type="button"
                    onClick={() => setIsScannerOpen(true)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold shrink-0 transition flex items-center gap-2 ${
                      scannedBay
                        ? 'bg-slate-900 border border-emerald-500/30 text-emerald-300 hover:bg-slate-850'
                        : 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-lg shadow-amber-500/20'
                    }`}
                  >
                    <Camera className="w-4 h-4" />
                    <span>{scannedBay ? (lang === 'th' ? 'สแกนเปลี่ยนตู้' : 'Rescan Bay') : (lang === 'th' ? 'เปิดกล้องสแกนตู้' : 'Scan Bay QR')}</span>
                  </button>
                </div>

                {/* Odometer Field */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-300 font-mono uppercase">
                      {lang === 'th' ? 'เลขไมล์ปัจจุบัน (กม.)' : 'Current Odometer (km)'}
                    </label>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {lang === 'th' ? 'เลขไมล์ครั้งก่อน:' : 'Last Recorded:'} {activeVehicle.lastOdometerKm.toLocaleString()} km
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id="driver-odometer-input"
                      type="number"
                      value={odometer}
                      onChange={(e) => setOdometer(Number(e.target.value))}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white font-mono text-lg font-bold focus:outline-none focus:border-amber-400"
                    />
                    <span className="absolute right-3.5 top-3.5 text-xs text-slate-400 font-mono font-bold">KM</span>
                  </div>
                  <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-emerald-400">
                    <span>{lang === 'th' ? 'ระยะทางวิ่งรอบนี้:' : 'Distance since last fill:'} +{estimatedKmSinceLast} km</span>
                    <span className="text-slate-400">
                      ~{(estimatedKmSinceLast / (activeVehicle.avgKmL || 3.4)).toFixed(1)} L {lang === 'th' ? 'คำนวณคาดการณ์' : 'estimated use'}
                    </span>
                  </div>
                </div>

                {/* Liters Request Slider & Quick Buttons */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <label className="text-xs font-bold text-slate-300 font-mono uppercase">
                      {lang === 'th' ? 'จำนวนลิตรที่ต้องการเติม' : 'Requested Volume (Liters)'}
                    </label>
                    <span className="text-xs font-bold text-amber-400 font-mono">
                      {requestedLiters} L / {maxAllowedLiters} L {lang === 'th' ? 'โควตาวันนี้' : 'Quota'}
                    </span>
                  </div>

                  <input
                    id="driver-liters-slider"
                    type="range"
                    min="20"
                    max={maxAllowedLiters}
                    step="5"
                    value={requestedLiters}
                    onChange={(e) => setRequestedLiters(Number(e.target.value))}
                    className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-amber-500 mb-3"
                  />

                  {/* Quick Volume Selectors */}
                  <div className="grid grid-cols-4 gap-2">
                    {[100, 150, 180, maxAllowedLiters].map((lit) => (
                      <button
                        key={lit}
                        type="button"
                        onClick={() => setRequestedLiters(lit)}
                        className={`py-2 rounded-lg text-xs font-mono font-bold border transition ${
                          requestedLiters === lit
                            ? 'bg-amber-500 text-slate-950 border-amber-400'
                            : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        {lit === maxAllowedLiters ? `${lit}L (เต็มโควตา)` : `${lit} L`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Primary Action Button */}
                <button
                  id="btn-generate-driver-qr"
                  onClick={handleGenerateQr}
                  disabled={isSubmitting || requestedLiters <= 0 || maxAllowedLiters <= 0}
                  className="w-full py-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-black text-sm sm:text-base flex items-center justify-center gap-2 shadow-xl shadow-amber-500/20 transition group"
                >
                  <QrCode className="w-5 h-5 group-hover:rotate-12 transition" />
                  <span>
                    {isSubmitting
                      ? (lang === 'th' ? 'กำลังส่งคำขอ & ออโต้เซฟ...' : 'Submitting & Auto-Saving...')
                      : (lang === 'th' ? 'สร้างรหัส QR ขอน้ำมัน (บันทึกออโต้เซฟ)' : 'Generate Dynamic Fuel QR (Auto-Save)')}
                  </span>
                </button>
              </div>
            ) : (
              /* If ACTIVE request: Show Live Dynamic QR Pass */
              <div className="space-y-5">
                <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 flex flex-col sm:flex-row items-center gap-6">
                  {/* Digital QR Render */}
                  <div className="p-3 rounded-2xl bg-white flex flex-col items-center justify-center shadow-lg shrink-0">
                    <div className="w-40 h-40 relative flex items-center justify-center bg-slate-100 rounded-lg p-2">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(activeRequest.qrToken)}`}
                        alt="Dynamic Driver Fuel QR"
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-800 mt-1">
                      {activeRequest.qrToken}
                    </span>
                  </div>

                  {/* QR Details & Status Information */}
                  <div className="space-y-3 w-full">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono text-slate-400 uppercase font-bold">
                        {lang === 'th' ? 'สถานะคำขอ' : 'Request Status'}
                      </span>
                      <span className="text-xs font-mono text-amber-400 font-bold flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{Math.floor(qrCountdown / 60)}:{(qrCountdown % 60).toString().padStart(2, '0')}</span>
                      </span>
                    </div>

                    {/* Progress timeline pills */}
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">✓</span>
                        <span className="text-white font-semibold">{lang === 'th' ? '1. สร้างคำขอ QR สำเร็จ' : '1. QR Request Generated'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          activeRequest.status === 'pending_approval'
                            ? 'bg-amber-500 text-slate-950 animate-pulse'
                            : 'bg-emerald-500 text-slate-950'
                        }`}>
                          {activeRequest.status === 'pending_approval' ? '⏳' : '✓'}
                        </span>
                        <span className={activeRequest.status === 'pending_approval' ? 'text-amber-400 font-bold' : 'text-white'}>
                          {lang === 'th' ? '2. รอศูนย์ควบคุมอนุมัติ' : '2. Dispatch Remote Approval'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs font-mono">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[10px] ${
                          activeRequest.status === 'dispensing'
                            ? 'bg-cyan-400 text-slate-950 animate-ping'
                            : 'bg-slate-800 text-slate-500'
                        }`}>
                          {activeRequest.status === 'dispensing' ? '⚡' : '3'}
                        </span>
                        <span className={activeRequest.status === 'dispensing' ? 'text-cyan-400 font-bold' : 'text-slate-500'}>
                          {lang === 'th' ? '3. สแกนหน้าตู้ & จ่ายน้ำมัน' : '3. Scan at Dispenser Bay'}
                        </span>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-mono space-y-1">
                      <div className="flex justify-between text-slate-400">
                        <span>{lang === 'th' ? 'รหัสคำขอ:' : 'Request ID:'}</span>
                        <span className="text-white font-bold">{activeRequest.id}</span>
                      </div>
                      <div className="flex justify-between text-slate-400">
                        <span>{lang === 'th' ? 'จำนวนลิตรที่ขอ:' : 'Volume:'}</span>
                        <span className="text-amber-400 font-bold">{activeRequest.requestedLiters} L</span>
                      </div>
                      {activeRequest.approvedBy && (
                        <div className="flex justify-between text-slate-400">
                          <span>{lang === 'th' ? 'ผู้อนุมัติ:' : 'Approved By:'}</span>
                          <span className="text-emerald-400 font-bold">{activeRequest.approvedBy}</span>
                        </div>
                      )}
                      {activeRequest.verifiedBayId && (
                        <div className="flex justify-between text-emerald-400 pt-1 border-t border-slate-800/80">
                          <span>{lang === 'th' ? 'ยืนยันตู้จ่าย:' : 'Verified Bay:'}</span>
                          <span className="font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            {activeRequest.verifiedBayId} ({activeRequest.verifiedBayName})
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions: Camera QR Scan & Simulated Dispense */}
                <div className="space-y-2 pt-2">
                  <div className="flex flex-col sm:flex-row gap-2.5">
                    <button
                      id="btn-active-camera-scanner"
                      type="button"
                      onClick={() => setIsScannerOpen(true)}
                      className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 transition"
                    >
                      <Camera className="w-4 h-4" />
                      <span>{lang === 'th' ? 'เปิดกล้องสแกน QR หน้าตู้หัวจ่าย' : 'Scan Bay QR with Camera'}</span>
                    </button>

                    <button
                      id="btn-simulate-driver-scan"
                      onClick={() => onSimulateDispense(activeRequest)}
                      className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/30 transition"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>{lang === 'th' ? 'เริ่มเติมน้ำมัน (Bay 01)' : 'Dispense Fuel (Bay 01)'}</span>
                    </button>
                  </div>

                  <div className="flex justify-end">
                    <button
                      id="btn-cancel-driver-request"
                      onClick={() => setActiveRequest(null)}
                      className="py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-300 font-mono text-xs flex items-center gap-1.5 transition"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{lang === 'th' ? 'ยกเลิกคำขอนี้' : 'Cancel Request'}</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Card: Driver's Active Refueling Journey Auto Timeline */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
                  <Clock className="w-4 h-4" />
                </span>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  {lang === 'th' ? 'Auto Timeline: ไทม์ไลน์การเดินทางของรถคันนี้' : 'Auto Timeline: Vehicle Refueling Journey'}
                </h3>
              </div>
              <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Real-time</span>
              </span>
            </div>

            <div className="space-y-3 relative pl-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {myVehicleTimeline.length === 0 ? (
                <p className="text-xs text-slate-400 font-mono py-3">
                  {lang === 'th' ? 'ยังไม่มีเหตุการณ์ไทม์ไลน์ล่าสุดสำหรับรถคันนี้' : 'No recent timeline events for this vehicle'}
                </p>
              ) : (
                myVehicleTimeline.map((ev) => (
                  <div key={ev.id} className="relative pl-4 space-y-1">
                    <span className={`absolute -left-[19px] top-1 w-3 h-3 rounded-full border-2 border-slate-900 ${
                      ev.status === 'in_progress' ? 'bg-amber-400 animate-ping' : 'bg-emerald-400'
                    }`} />
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-white font-mono">
                        {lang === 'th' ? ev.titleTh : ev.titleEn}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{ev.timeFormatted}</span>
                    </div>
                    <p className="text-xs text-slate-400">
                      {lang === 'th' ? ev.descriptionTh : ev.descriptionEn}
                    </p>
                    <div className="text-[10px] font-mono text-slate-500 flex items-center gap-2 pt-0.5">
                      <span>Actor: {ev.actor}</span>
                      <span>•</span>
                      <span className="uppercase text-amber-400/80">{ev.stage}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right: Vehicle Quotas & Recent Receipts (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Assigned Truck Status */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>{lang === 'th' ? 'ข้อมูลกองเรือ & สิทธิ์โควตา' : 'Fleet Vehicle Quota Summary'}</span>
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">
                  {lang === 'th' ? 'โควตารายวัน' : 'Daily Quota'}
                </span>
                <span className="text-lg font-black text-white font-mono mt-0.5 block">
                  {activeVehicle.dailyQuotaLiters} L
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider font-mono block">
                  {lang === 'th' ? 'คงเหลือเติมได้' : 'Remaining Allowed'}
                </span>
                <span className="text-lg font-black text-emerald-400 font-mono mt-0.5 block">
                  {maxAllowedLiters} L
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">
                  {lang === 'th' ? 'เลขไมล์สะสม' : 'Last Odometer'}
                </span>
                <span className="text-sm font-bold text-slate-200 font-mono mt-0.5 block">
                  {activeVehicle.lastOdometerKm.toLocaleString()} km
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider font-mono block">
                  {lang === 'th' ? 'อัตราเฉลี่ย กม./ลิตร' : 'Avg Efficiency'}
                </span>
                <span className="text-sm font-bold text-amber-400 font-mono mt-0.5 block">
                  {activeVehicle.avgKmL} km/L
                </span>
              </div>
            </div>

            {/* Quota Progress Bar */}
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-400 mb-1">
                <span>{lang === 'th' ? 'การใช้โควตาวันนี้' : 'Quota Utilized'}</span>
                <span>{((activeVehicle.todayDispensedLiters / activeVehicle.dailyQuotaLiters) * 100).toFixed(0)}%</span>
              </div>
              <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-amber-500 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(100, (activeVehicle.todayDispensedLiters / activeVehicle.dailyQuotaLiters) * 100)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Card: Recent Digital Fuel Slips for Driver */}
          <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 sm:p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>{lang === 'th' ? 'สลิปเติมน้ำมันดิจิทัลล่าสุด' : 'Recent Digital Fuel Slips'}</span>
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                {activeVehicle.plateNumber}
              </span>
            </div>

            <div className="space-y-2.5">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-white">TX-2026-8802</span>
                  <span className="text-emerald-400 font-semibold">250.0 L (ดีเซล B7)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>2026-09-17 14:14</span>
                  <span>Bay 01 • ปั๊มระยอง #04</span>
                </div>
                <div className="pt-1.5 border-t border-slate-800/80 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Approval: MNS-APPR-9011</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Auto-Saved</span>
                  </span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="font-bold text-white">TX-2026-8794</span>
                  <span className="text-emerald-400 font-semibold">180.0 L (ดีเซล B7)</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                  <span>2026-09-16 17:30</span>
                  <span>Bay 02 • ปั๊มระยอง #04</span>
                </div>
                <div className="pt-1.5 border-t border-slate-800/80 flex justify-between items-center text-[10px] font-mono text-slate-500">
                  <span>Approval: MNS-APPR-8821</span>
                  <span className="text-emerald-400 flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    <span>Auto-Saved</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Camera-based Optical QR Code Scanner for Dispenser Bay Verification */}
      <DriverQrCameraScanner
        isOpen={isScannerOpen}
        onClose={() => setIsScannerOpen(false)}
        lang={lang}
        activeRequest={activeRequest}
        onVerificationComplete={handleVerificationComplete}
        onProceedToDispense={(req: FuelRequest) => {
          setIsScannerOpen(false);
          onSimulateDispense(req);
        }}
      />
    </div>
  );
};
