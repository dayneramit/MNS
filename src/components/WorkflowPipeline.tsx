import React, { useState } from 'react';
import { 
  Building2, 
  Truck, 
  UserCheck, 
  QrCode, 
  Send, 
  CheckCircle2, 
  Gauge, 
  Droplet, 
  Database, 
  Archive, 
  FileSpreadsheet,
  ChevronRight,
  ShieldCheck,
  Play
} from 'lucide-react';

interface WorkflowPipelineProps {
  lang: 'th' | 'en';
  onSimulate: () => void;
}

interface StepDetail {
  id: string;
  step: number;
  labelEn: string;
  labelTh: string;
  descEn: string;
  descTh: string;
  badgeEn: string;
  badgeTh: string;
  icon: React.ElementType;
}

export const WorkflowPipeline: React.FC<WorkflowPipelineProps> = ({ lang, onSimulate }) => {
  const [selectedStep, setSelectedStep] = useState<number>(3); // Default on QR step

  const steps: StepDetail[] = [
    {
      id: 'company',
      step: 1,
      labelEn: 'COMPANY',
      labelTh: 'องค์กร / บริษัท',
      descEn: 'Defines fleet diesel policies, budget limits, daily liter caps, and approved industrial depot locations.',
      descTh: 'กำหนดนโยบายโควตาน้ำมันดีเซล เพดานลิตรรายวัน และจุดคลังเติมน้ำมันภายในโรงงาน/นิคมอุตสาหกรรม',
      badgeEn: 'Policy Control',
      badgeTh: 'ควบคุมสิทธิ์องค์กร',
      icon: Building2,
    },
    {
      id: 'fleet',
      step: 2,
      labelEn: 'FLEET',
      labelTh: 'กองยานพาหนะ',
      descEn: '6-wheel, 10-wheel, and tractor trailers registered with telemetry, license plates, and fuel tank profiles.',
      descTh: 'ขึ้นทะเบียนรถบรรทุก 6 ล้อ, 10 ล้อ และรถหัวลาก 22 ล้อ พร้อมผูกข้อมูลถังและความจุน้ำมัน',
      badgeEn: 'Asset Registry',
      badgeTh: 'ทะเบียนทรัพย์สิน',
      icon: Truck,
    },
    {
      id: 'driver',
      step: 3,
      labelEn: 'DRIVER',
      labelTh: 'พนักงานขับรถ',
      descEn: 'Certified Thai logistics driver with biometric or mobile ID verifies odometer and vehicle readiness.',
      descTh: 'พนักงานขับรถเข้าจุดเติมน้ำมัน ยืนยันตัวตนพร้อมบันทึกเลขไมล์ (Odometer) ก่อนเติม',
      badgeEn: 'Driver ID',
      badgeTh: 'คนขับยืนยันตัวตน',
      icon: UserCheck,
    },
    {
      id: 'qr',
      step: 4,
      labelEn: 'QR CODE',
      labelTh: 'รหัสคิวอาร์ไดนามิก',
      descEn: 'Generates dynamic, single-use, time-limited encrypted QR token tied to the specific vehicle and trip.',
      descTh: 'สร้าง QR Code เข้ารหัส ใช้ได้ครั้งเดียว จำกัดเวลา ผูกกับทะเบียนรถและเลขที่เที่ยววิ่ง',
      badgeEn: 'Dynamic Security',
      badgeTh: 'ความปลอดภัยสูง',
      icon: QrCode,
    },
    {
      id: 'request',
      step: 5,
      labelEn: 'REQUEST',
      labelTh: 'ส่งคำขอเติม',
      descEn: 'Driver requests specific fuel volume (e.g. 220L) transmitted securely to fleet dispatch over MNS DataLink.',
      descTh: 'ส่งคำขออนุมัติจำนวนลิตรแบบเรียลไทม์เข้าสู่ศูนย์ควบคุมผ่านโครงข่าย MNS DataLink',
      badgeEn: 'Real-time Request',
      badgeTh: 'ส่งสัญญาณดิจิทัล',
      icon: Send,
    },
    {
      id: 'approval',
      step: 6,
      labelEn: 'APPROVAL',
      labelTh: 'อนุมัติการเติม',
      descEn: 'Fleet dispatcher or automated rule engine verifies quota and odometer sanity before authorizing unlock.',
      descTh: 'เจ้าหน้าที่ควบคุมกองรถหรือระบบอัจฉริยะตรวจสอบความสมเหตุสมผลของระยะทางแล้วกดอนุมัติ',
      badgeEn: 'Remote Authorization',
      badgeTh: 'ปลดล็อกระยะไกล',
      icon: CheckCircle2,
    },
    {
      id: 'dispenser',
      step: 7,
      labelEn: 'DISPENSER',
      labelTh: 'หัวจ่ายน้ำมันคลัง',
      descEn: 'Heavy-duty industrial dispenser unlocks solenoid valve only after optical QR validation at the bay.',
      descTh: 'หัวจ่ายน้ำมันอุตสาหกรรมปลดล็อกวาล์วโซลินอยด์เฉพาะเมื่อสแกน QR หน้าตู้ผ่านเท่านั้น',
      badgeEn: 'Hardware Interlock',
      badgeTh: 'ระบบล็อกหัวจ่าย',
      icon: Gauge,
    },
    {
      id: 'fuel',
      step: 8,
      labelEn: 'FUEL',
      labelTh: 'จ่ายน้ำมันจริง',
      descEn: 'Precise volume dispensed with positive displacement meter. Dispenser halts immediately at approved limit.',
      descTh: 'จ่ายน้ำมันเข้าถังรถด้วยมิเตอร์ความแม่นยำสูง และตัดอัตโนมัติเมื่อถึงจำนวนลิตรที่ได้รับอนุมัติ',
      badgeEn: 'Precision Metering',
      badgeTh: 'ตัดยอดแม่นยำ',
      icon: Droplet,
    },
    {
      id: 'data',
      step: 9,
      labelEn: 'DATA',
      labelTh: 'บันทึกข้อมูลเรียลไทม์',
      descEn: 'Exact liters, temperature, timestamp, and flow duration pushed immediately to corporate cloud servers.',
      descTh: 'บันทึกลิตรจริง อุณหภูมิ เวลา และอัตราการไหลเข้าสู่ฐานข้อมูลระบบส่วนกลางทันที',
      badgeEn: 'Instant Telemetry',
      badgeTh: 'โทรมาตรทันที',
      icon: Database,
    },
    {
      id: 'stock',
      step: 10,
      labelEn: 'STOCK',
      labelTh: 'หักลบสต๊อกคลัง',
      descEn: 'Depot bulk tank inventory (Tank-01/02) is automatically deducted, updating ullage and reorder levels.',
      descTh: 'ตัดยอดคงเหลือในถังเก็บน้ำมันขนาดใหญ่ของโรงงานอัตโนมัติ อัปเดตพื้นที่ว่างและความต้องการสั่งเติม',
      badgeEn: 'Inventory Sync',
      badgeTh: 'ตัดสต๊อกอัตโนมัติ',
      icon: Archive,
    },
    {
      id: 'report',
      step: 11,
      labelEn: 'REPORT',
      labelTh: 'รายงานสรุป & ออดิต',
      descEn: 'Shift reconciliation, km/L consumption efficiency analysis, and zero-loss compliance audit generated.',
      descTh: 'สร้างรายงานสรุปกะ ตรวจสอบประสิทธิภาพ กม./ลิตร และกระทบยอดน้ำมันรั่วไหลเป็น 0%',
      badgeEn: 'Zero-Loss Audit',
      badgeTh: 'ตรวจสอบไร้การสูญหาย',
      icon: FileSpreadsheet,
    },
  ];

  const active = steps[selectedStep];

  return (
    <div id="workflow-pipeline-section" className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Decorative background grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      {/* Top Banner & Positioning */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold tracking-wide uppercase bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{lang === 'th' ? 'ระบบควบคุมการเติมน้ำมันของรถตัวเอง' : 'Internal Fleet Fuel Security'}</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              CLOSED-LOOP TELEMETRY
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2 font-mono">
            <span>POST LINK</span>
            <span className="text-amber-400 font-sans font-semibold text-lg">
              {lang === 'th' ? 'กระบวนการควบคุม 10 ขั้นตอน' : '10-Step Operational Control Cycle'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
            {lang === 'th'
              ? 'สถาปัตยกรรมความปลอดภัยแบบปิด: บริษัทควบคุมการเติมน้ำมันของรถตัวเอง ป้องกันการทุจริต การลักลอบถ่ายน้ำมัน และบันทึกข้อมูลเข้าสต๊อกคลังโรงงานโดยอัตโนมัติ'
              : 'A fully controlled closed-loop architecture: the company strictly manages its own fleet fueling, preventing fuel loss and instantly reconciling industrial bulk tank stock.'}
          </p>
        </div>

        <button
          id="btn-simulate-workflow"
          onClick={onSimulate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm transition shadow-lg shadow-amber-500/20 whitespace-nowrap self-start md:self-center"
        >
          <Play className="w-4 h-4 fill-slate-950" />
          <span>{lang === 'th' ? 'ทดสอบจำลองกระบวนการจริง' : 'Simulate Live Workflow'}</span>
        </button>
      </div>

      {/* Horizontal Stepper Pipeline */}
      <div className="pt-6 relative z-10">
        <div className="overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-slate-700">
          <div className="flex items-center gap-1.5 min-w-[980px]">
            {steps.map((s, idx) => {
              const IconComp = s.icon;
              const isSelected = selectedStep === idx;
              return (
                <React.Fragment key={s.id}>
                  <button
                    id={`pipeline-step-${s.id}`}
                    onClick={() => setSelectedStep(idx)}
                    className={`group flex flex-col items-center p-2.5 rounded-xl transition border text-center relative ${
                      isSelected
                        ? 'bg-amber-500/15 border-amber-400 text-amber-300 ring-1 ring-amber-400/50 shadow-md'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-800/50 hover:text-slate-200'
                    }`}
                    style={{ flex: 1 }}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-1.5 transition ${
                      isSelected ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-300 group-hover:bg-slate-700'
                    }`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <span className="text-[10px] font-mono font-bold tracking-wider uppercase">
                      {s.step}. {s.labelEn}
                    </span>
                    <span className="text-[10px] font-medium text-slate-300 mt-0.5 whitespace-nowrap truncate max-w-[80px]">
                      {lang === 'th' ? s.labelTh : s.badgeEn}
                    </span>
                  </button>

                  {idx < steps.length - 1 && (
                    <ChevronRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Selected Step Detail Panel */}
        {active && (
          <div className="mt-4 p-4 rounded-xl bg-slate-950/80 border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                {React.createElement(active.icon, { className: 'w-5 h-5' })}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-amber-400 font-bold">
                    STEP {active.step} OF 11:
                  </span>
                  <h4 className="text-sm sm:text-base font-bold text-white">
                    {lang === 'th' ? active.labelTh : active.labelEn}
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 text-slate-300 border border-slate-700">
                    {lang === 'th' ? active.badgeTh : active.badgeEn}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-300 mt-1">
                  {lang === 'th' ? active.descTh : active.descEn}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center">
              <button
                onClick={() => setSelectedStep((prev) => (prev > 0 ? prev - 1 : steps.length - 1))}
                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
              >
                {lang === 'th' ? 'ก่อนหน้า' : 'Prev'}
              </button>
              <button
                onClick={() => setSelectedStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0))}
                className="px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-xs text-slate-950 font-bold"
              >
                {lang === 'th' ? 'ถัดไป' : 'Next'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
