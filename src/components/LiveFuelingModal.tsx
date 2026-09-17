import React, { useState, useEffect } from 'react';
import { 
  X, 
  Fuel, 
  QrCode, 
  CheckCircle2, 
  Truck, 
  UserCheck, 
  Gauge, 
  ShieldCheck, 
  Clock, 
  Check, 
  AlertTriangle,
  Play,
  RotateCcw,
  FileCheck
} from 'lucide-react';
import { FleetVehicle, FuelTransaction } from '../types';

interface LiveFuelingModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
  vehicles: FleetVehicle[];
  onCompleteFueling: (transaction: FuelTransaction) => void;
}

export const LiveFuelingModal: React.FC<LiveFuelingModalProps> = ({
  isOpen,
  onClose,
  lang,
  vehicles,
  onCompleteFueling,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  // Step 1: Vehicle & Driver Selection
  // Step 2: Driver Request & Dynamic QR Generation
  // Step 3: Central Dispatch Remote Approval
  // Step 4: Dispenser Optical QR Scan & Hardware Unlock
  // Step 5: Live Pumping / Flow Telemetry
  // Step 6: Completion, Digital Slip & Tank Stock Sync

  const [selectedVehicle, setSelectedVehicle] = useState<FleetVehicle>(vehicles[0]);
  const [requestedLiters, setRequestedLiters] = useState<number>(180);
  const [odometerInput, setOdometerInput] = useState<number>((vehicles[0]?.lastOdometerKm || 340000) + 350);
  const [qrToken, setQrToken] = useState<string>('MNS-QR-88219-9402');
  const [approvedLiters, setApprovedLiters] = useState<number>(180);
  const [dispensedCounter, setDispensedCounter] = useState<number>(0);
  const [isPumping, setIsPumping] = useState<boolean>(false);

  // Generate QR token when entering step 2
  useEffect(() => {
    if (currentStep === 2) {
      const randToken = `MNS-QR-${selectedVehicle.driverId}-${Math.floor(1000 + Math.random() * 9000)}`;
      setQrToken(randToken);
      setApprovedLiters(requestedLiters);
    }
  }, [currentStep, selectedVehicle, requestedLiters]);

  // Simulate active pumping animation
  useEffect(() => {
    let timer: any;
    if (currentStep === 5 && isPumping) {
      timer = setInterval(() => {
        setDispensedCounter((prev) => {
          const next = prev + 3.6; // Increment by flow rate
          if (next >= approvedLiters) {
            clearInterval(timer);
            setIsPumping(false);
            setCurrentStep(6);
            return approvedLiters;
          }
          return next;
        });
      }, 80);
    }
    return () => clearInterval(timer);
  }, [currentStep, isPumping, approvedLiters]);

  const handleFinish = () => {
    const newTx: FuelTransaction = {
      id: `TX-${Date.now().toString().slice(-8)}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
      plateNumber: selectedVehicle.plateNumber,
      vehicleType: selectedVehicle.vehicleType,
      driverName: selectedVehicle.assignedDriver,
      driverId: selectedVehicle.driverId,
      litersDispensed: approvedLiters,
      tankId: 'TANK-01',
      bayId: 'BAY-01',
      odometerKm: odometerInput,
      approvalCode: `MNS-APP-${Math.floor(10000 + Math.random() * 90000)}`,
      approvedBy: 'Fleet Central Dispatch (MNS Remote Engine)',
      status: 'completed',
      kmPerLiterEfficiency: Number(((odometerInput - selectedVehicle.lastOdometerKm) / approvedLiters).toFixed(2)),
      notes: 'Rayong Industrial Depot #04 Bay 01 Authorized',
    };
    onCompleteFueling(newTx);
    onClose();
  };

  const resetSimulation = () => {
    setCurrentStep(1);
    setDispensedCounter(0);
    setIsPumping(false);
  };

  if (!isOpen) return null;

  return (
    <div id="live-fueling-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div id="live-fueling-modal" className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Fuel className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-mono flex items-center gap-2">
                <span>POST LINK</span>
                <span className="text-xs text-amber-400 font-sans font-medium px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20">
                  {lang === 'th' ? 'จำลองกระบวนการเติมน้ำมันรถตัวเอง' : 'Internal Fleet Fueling Simulator'}
                </span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                "บริษัทควบคุมการเติมน้ำมันของรถตัวเอง" • 10-Step Controlled Sequence
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Workflow Progress Steps */}
        <div className="px-6 py-2.5 bg-slate-950/40 border-b border-slate-800/80">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className={`flex items-center gap-1 ${currentStep >= 1 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              1. Fleet Vehicle
            </span>
            <span className="text-slate-700">→</span>
            <span className={`flex items-center gap-1 ${currentStep >= 2 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              2. Driver QR
            </span>
            <span className="text-slate-700">→</span>
            <span className={`flex items-center gap-1 ${currentStep >= 3 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              3. Dispatch Approval
            </span>
            <span className="text-slate-700">→</span>
            <span className={`flex items-center gap-1 ${currentStep >= 4 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              4. Dispenser Interlock
            </span>
            <span className="text-slate-700">→</span>
            <span className={`flex items-center gap-1 ${currentStep >= 5 ? 'text-amber-400 font-bold' : 'text-slate-500'}`}>
              5. Pumping Telemetry
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: Select Fleet Truck & Driver */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
                <strong className="text-amber-300 block mb-1">
                  {lang === 'th' ? 'ขั้นที่ 1: ตรวจสอบรถกองเรือและพนักงานขับรถ' : 'Step 1: Identify Fleet Asset & Driver'}
                </strong>
                {lang === 'th'
                  ? 'รถบรรทุกของบริษัทเดินทางเข้าสู่จุดเติมน้ำมันคลังโรงงาน ระบบจะตรวจสอบโควตาคงเหลือรายวันก่อนออกคำขอ'
                  : 'Commercial fleet truck arrives at the factory fuel depot bay. The system validates daily diesel quota.'}
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  {lang === 'th' ? 'เลือกรถในกองเรือของบริษัท' : 'Select Company Fleet Vehicle:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {vehicles.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => {
                        setSelectedVehicle(v);
                        setOdometerInput(v.lastOdometerKm + 380);
                      }}
                      className={`p-3 rounded-xl border text-left transition flex items-start justify-between ${
                        selectedVehicle.id === v.id
                          ? 'bg-amber-500/15 border-amber-400 text-white ring-1 ring-amber-400/40'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-400">{v.plateNumber}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-300">
                            {v.vehicleType.split(' ')[0]}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 mt-0.5">{v.model}</p>
                        <p className="text-[11px] text-slate-300 mt-1">
                          {lang === 'th' ? 'คนขับ:' : 'Driver:'} <strong className="text-white">{v.assignedDriver}</strong>
                        </p>
                      </div>
                      <span className="text-xs font-mono text-emerald-400 font-bold">
                        {v.dailyQuotaLiters} L Quota
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    {lang === 'th' ? 'จำนวนลิตรที่ต้องการเติม (L):' : 'Requested Diesel Liters:'}
                  </label>
                  <input
                    type="number"
                    value={requestedLiters}
                    onChange={(e) => setRequestedLiters(Math.max(10, Math.min(selectedVehicle.tankCapacityLiters, Number(e.target.value))))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Tank Capacity: {selectedVehicle.tankCapacityLiters} L
                  </span>
                </div>

                <div>
                  <label className="block text-xs text-slate-400 mb-1">
                    {lang === 'th' ? 'เลขไมล์ปัจจุบัน (Odometer):' : 'Current Odometer (km):'}
                  </label>
                  <input
                    type="number"
                    value={odometerInput}
                    onChange={(e) => setOdometerInput(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-white font-mono font-bold text-sm focus:border-amber-500 focus:outline-none"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Last Logged: {selectedVehicle.lastOdometerKm.toLocaleString()} km
                  </span>
                </div>
              </div>

              <div className="pt-3">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2"
                >
                  <QrCode className="w-4 h-4" />
                  <span>{lang === 'th' ? 'สร้างรหัส QR ขอเติมน้ำมัน (Driver QR Request)' : 'Generate Driver Fuel Request QR'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: Driver Generates Dynamic Encrypted QR */}
          {currentStep === 2 && (
            <div className="space-y-4 text-center">
              <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200 text-left">
                <strong className="text-blue-300 block mb-1">
                  {lang === 'th' ? 'ขั้นที่ 2: รหัส QR ดิจิทัลสำหรับคนขับ (One-Time Dynamic QR)' : 'Step 2: Single-Use Encrypted QR Code'}
                </strong>
                {lang === 'th'
                  ? 'รหัส QR ถูกสร้างขึ้นบนมือถือคนขับ ผูกกับทะเบียนรถ คลังระยอง และจำนวนลิตรที่ร้องขอ พร้อมส่งคำขออนุมัติสู่ศูนย์ควบคุม'
                  : 'A time-limited encrypted QR token is generated on the driver device and pushed to central dispatch.'}
              </div>

              {/* Mock QR Code Graphic Box */}
              <div className="p-5 rounded-2xl bg-white text-slate-950 max-w-xs mx-auto shadow-2xl flex flex-col items-center">
                <div className="w-44 h-44 bg-slate-950 rounded-xl p-3 flex flex-col items-center justify-between text-white relative">
                  {/* Decorative QR look */}
                  <div className="w-full flex justify-between">
                    <div className="w-10 h-10 border-4 border-amber-400 rounded-sm flex items-center justify-center">
                      <div className="w-4 h-4 bg-amber-400"></div>
                    </div>
                    <div className="w-10 h-10 border-4 border-amber-400 rounded-sm flex items-center justify-center">
                      <div className="w-4 h-4 bg-amber-400"></div>
                    </div>
                  </div>
                  <div className="text-[10px] font-mono font-bold tracking-widest text-amber-300">
                    POST LINK • MNS
                  </div>
                  <div className="w-full flex justify-between">
                    <div className="w-10 h-10 border-4 border-amber-400 rounded-sm flex items-center justify-center">
                      <div className="w-4 h-4 bg-amber-400"></div>
                    </div>
                    <div className="w-6 h-6 bg-emerald-400 rounded-sm"></div>
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <span className="font-mono text-xs font-bold text-slate-900 block">{qrToken}</span>
                  <span className="text-[11px] text-slate-600 font-medium">
                    {selectedVehicle.plateNumber} • {requestedLiters} L requested
                  </span>
                  <div className="mt-1 flex items-center justify-center gap-1 text-[10px] text-emerald-600 font-bold">
                    <Clock className="w-3 h-3" />
                    <span>Valid for 14:59 min</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                >
                  {lang === 'th' ? 'ย้อนกลับ' : 'Back'}
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md"
                >
                  {lang === 'th' ? 'ส่งเข้าห้องควบคุมเพื่ออนุมัติ (Dispatch Approval)' : 'Push to Central Dispatch for Approval'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Fleet Central Dispatcher Remote Approval */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className="p-3.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-xs text-purple-200">
                <strong className="text-purple-300 block mb-1">
                  {lang === 'th' ? 'ขั้นที่ 3: ศูนย์ควบคุมองค์กรอนุมัติระยะไกล (Corporate Remote Approval)' : 'Step 3: Central Dispatch Authorization'}
                </strong>
                {lang === 'th'
                  ? 'เจ้าหน้าที่ควบคุมกองยานพาหนะตรวจสอบอัตราสิ้นเปลืองและโควตา ก่อนกดอนุมัติเพื่อสั่งปลดล็อกหัวจ่ายคลัง'
                  : 'Fleet operations supervisor verifies fuel consumption telemetry before unlocking the depot dispenser.'}
              </div>

              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-slate-400">VEHICLE ASSET:</span>
                  <span className="font-bold text-amber-400 text-sm">{selectedVehicle.plateNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ASSIGNED DRIVER:</span>
                  <span className="text-white">{selectedVehicle.assignedDriver} ({selectedVehicle.driverId})</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">TRIP DISTANCE:</span>
                  <span className="text-white">{(odometerInput - selectedVehicle.lastOdometerKm).toLocaleString()} km</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">ESTIMATED EFFICIENCY:</span>
                  <span className="text-emerald-400 font-bold">
                    {((odometerInput - selectedVehicle.lastOdometerKm) / requestedLiters).toFixed(2)} km/L (Normal)
                  </span>
                </div>
                <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                  <span className="text-slate-400">APPROVED DIESEL CAP:</span>
                  <span className="font-bold text-amber-300 text-base">{approvedLiters} LITERS</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300"
                >
                  {lang === 'th' ? 'ปฏิเสธ' : 'Reject'}
                </button>
                <button
                  onClick={() => setCurrentStep(4)}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{lang === 'th' ? 'อนุมัติ & ส่งคำสั่งปลดล็อกหัวจ่าย' : 'Approve & Unlock Depot Dispenser Bay'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Dispenser Hardware Interlock Unlock */}
          {currentStep === 4 && (
            <div className="space-y-4 text-center">
              <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 text-left">
                <strong className="text-emerald-300 block mb-1">
                  {lang === 'th' ? 'ขั้นที่ 4: สแกน QR หน้าตู้หัวจ่ายคลัง (Optical Scanner Validation)' : 'Step 4: Optical Bay QR Scan & Interlock'}
                </strong>
                {lang === 'th'
                  ? 'คนขับสแกน QR หน้าตู้หัวจ่าย Bay 01 โซลินอยด์วาล์วปลดล็อกพร้อมจ่ายน้ำมันตามเพดานที่อนุมัติ'
                  : 'Driver presents QR at Bay 01 terminal. Solenoid interlock clicks open, armed for exact approved liters.'}
              </div>

              <div className="p-6 rounded-2xl bg-slate-950 border border-emerald-500/40 max-w-sm mx-auto space-y-3 shadow-xl">
                <div className="w-14 h-14 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/50 flex items-center justify-center mx-auto animate-bounce">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-white font-mono">SOLENOID INTERLOCK: UNLOCKED</h4>
                <p className="text-xs text-slate-300">
                  Bay #01 Dual-Nozzle Dispenser ready. Lift nozzle to start diesel delivery.
                </p>
                <div className="py-2 px-3 rounded-lg bg-slate-900 text-xs font-mono text-amber-400">
                  Target Cap: <strong className="text-white text-sm">{approvedLiters} Liters</strong>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => {
                    setCurrentStep(5);
                    setIsPumping(true);
                  }}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm tracking-wide shadow-xl flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-slate-950" />
                  <span>{lang === 'th' ? 'ยกหัวจ่ายและเริ่มจ่ายน้ำมัน (Start Pumping)' : 'Lift Nozzle & Start Dispensing'}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 5: Live Pumping / Flow Telemetry */}
          {currentStep === 5 && (
            <div className="space-y-4 text-center">
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200 text-left">
                <strong className="text-amber-300 block mb-1">
                  {lang === 'th' ? 'ขั้นที่ 5: จ่ายน้ำมันและส่งข้อมูลโทรมาตรเรียลไทม์' : 'Step 5: High-Flow Dispensing & Telemetry Stream'}
                </strong>
                {lang === 'th'
                  ? 'มิเตอร์วัดอัตราการไหลส่งข้อมูลทุกวินาที หัวจ่ายจะตัดการทำงานอัตโนมัติเมื่อครบยอดอนุมัติ'
                  : 'Positive displacement meter streaming volume to cloud. Dispenser will auto-cutoff at exactly approved volume.'}
              </div>

              {/* Digital Dispenser Display Screen */}
              <div className="p-6 rounded-2xl bg-slate-950 border-2 border-amber-500/60 max-w-sm mx-auto shadow-2xl space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <span className="text-[10px] font-mono uppercase text-amber-400 tracking-wider">
                    POST LINK DISPENSER BAY #01
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                    <span>FLOW: 72.5 L/MIN</span>
                  </span>
                </div>

                <div className="py-2">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">{lang === 'th' ? 'จำนวนลิตรที่จ่ายแล้ว' : 'DISPENSED VOLUME'}</span>
                  <div className="text-4xl sm:text-5xl font-black text-amber-400 font-mono tracking-tight my-1">
                    {dispensedCounter.toFixed(1)} <span className="text-lg text-slate-400 font-normal">L</span>
                  </div>
                  <span className="text-xs font-mono text-slate-400">
                    Target Limit: {approvedLiters.toFixed(1)} L
                  </span>
                </div>

                <div className="w-full h-3 rounded-full bg-slate-900 border border-slate-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-600 to-amber-400 transition-all"
                    style={{ width: `${Math.min(100, (dispensedCounter / approvedLiters) * 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 pt-2 border-t border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block">PRODUCT:</span>
                    <span>HSD B7 Euro 5</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block">SOURCE:</span>
                    <span>Tank T-01 (Bulk)</span>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-400 animate-pulse">
                {lang === 'th' ? 'กำลังจ่ายน้ำมันเข้าถังรถ...' : 'Pumping diesel into fleet truck fuel tank...'}
              </div>
            </div>
          )}

          {/* STEP 6: Completion & Stock Sync */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center mx-auto font-bold shadow-lg">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-white font-mono">
                  {lang === 'th' ? 'จ่ายน้ำมันเสร็จสมบูรณ์ - ตัดสต๊อกคลังอัตโนมัติ' : 'Dispensing Completed & Tank Stock Deducted'}
                </h4>
                <p className="text-xs text-slate-300">
                  {lang === 'th'
                    ? `เติมน้ำมัน ${approvedLiters} ลิตร เข้าสู่รถ ${selectedVehicle.plateNumber} เรียบร้อยแล้ว สต๊อกในถัง Tank-01 ถูกตัดยอดทันที`
                    : `Successfully dispensed ${approvedLiters} Liters into ${selectedVehicle.plateNumber}. Tank-01 stock reconciled.`}
                </p>
              </div>

              {/* Digital Slip Summary */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                <div className="flex justify-between border-b border-slate-800 pb-2">
                  <span className="text-slate-400">DIGITAL SLIP NO:</span>
                  <span className="font-bold text-amber-400">MNS-SLIP-{Date.now().toString().slice(-6)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">VEHICLE PLATE:</span>
                  <span className="text-white font-bold">{selectedVehicle.plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">DRIVER:</span>
                  <span className="text-white">{selectedVehicle.assignedDriver} ({selectedVehicle.driverId})</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">ODOMETER:</span>
                  <span className="text-white">{odometerInput.toLocaleString()} km</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">CALCULATED EFFICIENCY:</span>
                  <span className="text-emerald-400 font-bold">
                    {((odometerInput - selectedVehicle.lastOdometerKm) / approvedLiters).toFixed(2)} km/L
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                  <span className="text-slate-300">VOLUME DISPENSED:</span>
                  <span className="text-amber-400">{approvedLiters.toFixed(1)} LITERS</span>
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={resetSimulation}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300 flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'จำลองใหม่อีกครั้ง' : 'Simulate Again'}</span>
                </button>
                <button
                  onClick={handleFinish}
                  className="flex-1 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>{lang === 'th' ? 'บันทึกเข้าระบบส่วนกลาง (Complete & Close)' : 'Save to Central Corporate Records'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
