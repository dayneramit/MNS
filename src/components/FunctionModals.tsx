import React from 'react';
import { FleetVehicle, TankTelemetry, DispenserBay, FuelTransaction, FuelRequest, AutoLogEntry } from '../types';
import { 
  Building2, 
  Truck, 
  Users, 
  UserCheck, 
  Shield, 
  BarChart3, 
  X, 
  CheckCircle2, 
  Fuel, 
  Gauge, 
  MapPin, 
  FileText,
  Calendar,
  DollarSign,
  TrendingDown,
  AlertTriangle
} from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

// 1. บริษัท (Company / Organization)
export const CompanyInfoModal: React.FC<ModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Building2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-mono">
                {lang === 'th' ? 'ข้อมูลบริษัท / องค์กร' : 'Company Organization'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">Meena Oil Service Co., Ltd.</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
            <span className="text-xs text-slate-500 font-medium block">ระบบควบคุมการเติมน้ำมัน</span>
            <span className="text-base font-bold text-slate-800 font-mono">POST LINK / MNS DATALINK</span>
            <span className="text-xs text-amber-600 font-semibold block mt-1">Closed-Loop Enterprise Fleet System</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
              <span className="text-[11px] text-slate-500 block">รหัสสาขา/คลัง</span>
              <span className="text-sm font-bold text-slate-800 font-mono">MNS-RY-04</span>
              <span className="text-xs text-slate-600 block mt-0.5">มาบตาพุด จ.ระยอง</span>
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
              <span className="text-[11px] text-slate-500 block">จำนวนรถในระบบ</span>
              <span className="text-sm font-bold text-slate-800 font-mono">24 คัน</span>
              <span className="text-xs text-slate-600 block mt-0.5">พร้อมหัวจ่าย 2 ตู้</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">ประเภทระบบ:</span>
              <span className="font-semibold text-slate-800">คลังน้ำมันองค์กร (Corporate Depot)</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">นโยบายจ่ายน้ำมัน:</span>
              <span className="font-semibold text-emerald-600">ต้องผ่านการอนุมัติ QR + ตู้จ่าย</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-500">ศูนย์ประสานงาน:</span>
              <span className="font-semibold text-slate-800 font-mono">038-999-888</span>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-md"
        >
          {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
        </button>
      </div>
    </div>
  );
};

// 2. ผู้ขับขี่ (Drivers Roster)
interface DriversModalProps extends ModalProps {
  vehicles: FleetVehicle[];
}

export const DriversModal: React.FC<DriversModalProps> = ({ isOpen, onClose, lang, vehicles }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-mono">
                {lang === 'th' ? 'รายชื่อผู้ขับขี่ (Drivers)' : 'Driver Roster'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">{vehicles.length} คนขับที่ได้รับมอบหมาย</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {vehicles.map((v, i) => (
            <div key={v.id} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center font-bold text-sm font-mono">
                  0{i + 1}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 text-sm">{v.assignedDriver}</h4>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono mt-0.5">
                    <span>รถประจำ: <strong>{v.plateNumber}</strong></span>
                    <span>•</span>
                    <span>{v.vehicleType}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold font-mono bg-emerald-100 text-emerald-700">
                  {lang === 'th' ? 'มีสิทธิ์เติม' : 'Active'}
                </span>
                <span className="block text-[11px] text-slate-500 font-mono mt-1">
                  โควตา {v.dailyQuotaLiters}L/วัน
                </span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-md"
        >
          {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
        </button>
      </div>
    </div>
  );
};

// 3. ผู้อนุมัติ (Approvers)
export const ApproversModal: React.FC<ModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  const approvers = [
    { name: 'สมชาย ทองดี', role: 'หัวหน้างานจ่ายน้ำมัน (Lead Dispatcher)', id: 'ADM-01', phone: '081-445-1234', level: 'Level 2 (สูงสุด 600 ลิตร)' },
    { name: 'วิชัย มั่นคง', role: 'เจ้าหน้าที่ศูนย์ควบคุมระยอง (Dispatcher)', id: 'ADM-02', phone: '089-223-8899', level: 'Level 1 (สูงสุด 300 ลิตร)' },
    { name: 'สุรศักดิ์ เจริญดี', role: 'ผู้จัดการฝ่ายโลจิสติกส์ (Fleet Manager)', id: 'ADM-00', phone: '086-777-5555', level: 'Admin (ไม่จำกัดวงเงิน)' },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <UserCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-mono">
                {lang === 'th' ? 'รายชื่อผู้อนุมัติ (Approvers)' : 'Authorized Approvers'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">ผู้มีสิทธิ์ปลดล็อกวาล์วจ่ายน้ำมันระยะไกล</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {approvers.map((a) => (
            <div key={a.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-1.5">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-slate-800 text-sm">{a.name}</h4>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-700">
                  {a.id}
                </span>
              </div>
              <p className="text-xs text-slate-600">{a.role}</p>
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 pt-1 border-t border-slate-200/60">
                <span>{a.level}</span>
                <span>โทร: {a.phone}</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-md"
        >
          {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
        </button>
      </div>
    </div>
  );
};

// 4. สิทธิ์การใช้งาน (Roles & Permissions)
export const PermissionsModal: React.FC<ModalProps> = ({ isOpen, onClose, lang }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-mono">
                {lang === 'th' ? 'สิทธิ์การใช้งาน (Permissions)' : 'Roles & Permissions'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">การแบ่งระดับสิทธิ์ความปลอดภัยในระบบ</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">บทบาท DRIVER (พนักงานขับรถ)</span>
              <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-bold font-mono">Operator</span>
            </div>
            <ul className="text-slate-600 list-disc list-inside space-y-0.5 pt-1">
              <li>สร้างคำขอเติมน้ำมัน (ระบุเลขไมล์ + ปริมาณลิตร)</li>
              <li>สร้างและแสดงรหัส Dynamic QR Code ประจำรอบ</li>
              <li>สแกนกล้องยืนยันตู้จ่ายน้ำมัน (Bay Verification)</li>
              <li>ดูประวัติการเติมของรถที่ตนเองดูแล</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-800 text-sm">บทบาท ADMIN (ผู้ควบคุมศูนย์)</span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-700 font-bold font-mono">Dispatcher</span>
            </div>
            <ul className="text-slate-600 list-disc list-inside space-y-0.5 pt-1">
              <li>รับแจ้งเตือนและตรวจสอบคำขอเติมน้ำมันแบบ Real-time</li>
              <li>กดอนุมัติหรือปฏิเสธคำขอเติมน้ำมัน</li>
              <li>ปลดล็อกวาล์วโซลินอยด์ตู้จ่ายระยะไกล</li>
              <li>ดูระดับสต๊อกน้ำมันในถังใหญ่และมิเตอร์ตู้จ่าย</li>
              <li>ส่งออกรายงานและตรวจดู Activity / Audit Log</li>
            </ul>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-md"
        >
          {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
        </button>
      </div>
    </div>
  );
};

// 5. รายงานสรุป (Report Summary)
interface ReportModalProps extends ModalProps {
  transactions: FuelTransaction[];
  tanks: TankTelemetry[];
}

export const ReportSummaryModal: React.FC<ReportModalProps> = ({ isOpen, onClose, lang, transactions, tanks }) => {
  if (!isOpen) return null;
  const totalDispensed = transactions.reduce((acc, tx) => acc + tx.litersDispensed, 0);
  const totalStock = tanks.reduce((acc, t) => acc + t.currentLiters, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <BarChart3 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-mono">
                {lang === 'th' ? 'รายงานสรุปการใช้น้ำมัน' : 'Fuel Analytics Report'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">ข้อมูลสรุปประจำวันของคลัง</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
            <span className="text-xs text-slate-500 block">ปริมาณที่จ่ายรวม</span>
            <span className="text-xl font-black text-amber-600 font-mono block mt-1">
              {totalDispensed.toLocaleString()} <span className="text-xs text-slate-500 font-normal">ลิตร</span>
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">{transactions.length} รายการจ่ายสำเร็จ</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150">
            <span className="text-xs text-slate-500 block">น้ำมันคงเหลือในถัง</span>
            <span className="text-xl font-black text-emerald-600 font-mono block mt-1">
              {totalStock.toLocaleString()} <span className="text-xs text-slate-500 font-normal">ลิตร</span>
            </span>
            <span className="text-[11px] text-slate-500 block mt-0.5">ถังรวม {tanks.length} ถัง</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-2">
          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">ประสิทธิภาพการควบคุมการใช้น้ำมัน</h4>
          <div className="flex justify-between text-xs text-slate-600">
            <span>อัตราความคลาดเคลื่อนมิเตอร์:</span>
            <span className="font-bold text-emerald-600 font-mono">0.00% (ตรง 100%)</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>การรั่วไหล / ไม่ทราบสาเหตุ:</span>
            <span className="font-bold text-emerald-600 font-mono">0.00 ลิตร</span>
          </div>
          <div className="flex justify-between text-xs text-slate-600">
            <span>เฉลี่ยต่อเที่ยว:</span>
            <span className="font-bold text-slate-800 font-mono">
              {transactions.length ? Math.round(totalDispensed / transactions.length) : 0} ลิตร/ครั้ง
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-md"
        >
          {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
        </button>
      </div>
    </div>
  );
};

// 6. รถของฉัน (My Vehicle Details)
interface MyVehicleModalProps extends ModalProps {
  vehicle: FleetVehicle;
}

export const MyVehicleModal: React.FC<MyVehicleModalProps> = ({ isOpen, onClose, lang, vehicle }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-mono">
                {lang === 'th' ? 'รถของฉัน' : 'My Vehicle'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">ทะเบียน: {vehicle.plateNumber}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-xs text-slate-400 font-mono">ป้ายทะเบียน</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-amber-500 text-slate-950">
              {vehicle.vehicleType}
            </span>
          </div>
          <div className="text-2xl font-black font-mono tracking-wide">{vehicle.plateNumber}</div>
          <div className="text-xs text-slate-400">{vehicle.model} • พนักงาน: {vehicle.assignedDriver}</div>
        </div>

        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block">เลขไมล์ล่าสุด</span>
            <span className="text-base font-bold text-slate-800 font-mono mt-0.5 block">
              {vehicle.lastOdometerKm.toLocaleString()} km
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block">ขนาดถังน้ำมัน</span>
            <span className="text-base font-bold text-slate-800 font-mono mt-0.5 block">
              {vehicle.tankCapacityLiters} ลิตร
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block">โควตาประจำวัน</span>
            <span className="text-base font-bold text-amber-600 font-mono mt-0.5 block">
              {vehicle.dailyQuotaLiters} ลิตร
            </span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150">
            <span className="text-slate-500 block">เติมไปแล้ววันนี้</span>
            <span className="text-base font-bold text-emerald-600 font-mono mt-0.5 block">
              {vehicle.todayDispensedLiters} ลิตร
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-md"
        >
          {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
        </button>
      </div>
    </div>
  );
};

// 7. ข้อมูลรถ (Fleet Vehicle Directory)
interface VehiclesListModalProps extends ModalProps {
  vehicles: FleetVehicle[];
  activeVehicle: FleetVehicle;
  onSelectVehicle?: (v: FleetVehicle) => void;
}

export const VehiclesListModal: React.FC<VehiclesListModalProps> = ({ 
  isOpen, 
  onClose, 
  lang, 
  vehicles, 
  activeVehicle,
  onSelectVehicle 
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white text-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 font-mono">
                {lang === 'th' ? 'ข้อมูลรถทั้งหมด' : 'Vehicle Directory'}
              </h3>
              <p className="text-xs text-slate-500 font-mono">จำนวน {vehicles.length} คันในระบบ</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 rounded-xl hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {vehicles.map((v) => {
            const isCurrent = v.id === activeVehicle.id;
            return (
              <div 
                key={v.id} 
                onClick={() => {
                  if (onSelectVehicle) onSelectVehicle(v);
                  onClose();
                }}
                className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between ${
                  isCurrent 
                    ? 'bg-amber-50/70 border-amber-300 shadow-sm' 
                    : 'bg-slate-50 border-slate-150 hover:bg-slate-100/80'
                }`}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900 font-mono text-sm">{v.plateNumber}</span>
                    {isCurrent && (
                      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-amber-500 text-slate-950">
                        รถของฉัน
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {v.model} • {v.vehicleType} ({v.assignedDriver})
                  </div>
                </div>
                <div className="text-right text-xs font-mono">
                  <span className="font-bold text-slate-700 block">ถัง {v.tankCapacityLiters}L</span>
                  <span className="text-slate-400 text-[11px] block">{v.lastOdometerKm.toLocaleString()} km</span>
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition shadow-md"
        >
          {lang === 'th' ? 'ปิดหน้าต่าง' : 'Close'}
        </button>
      </div>
    </div>
  );
};

