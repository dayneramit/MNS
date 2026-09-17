export interface TankTelemetry {
  id: string;
  name: string;
  fuelType: 'HSD B7 (Euro 5)' | 'Diesel B20' | 'Bio-Diesel B10';
  capacityLiters: number;
  currentLiters: number;
  temperatureC: number;
  waterBottomMm: number;
  densityKgM3: number;
  flowRateLpm: number;
  status: 'normal' | 'low' | 'reorder' | 'filling';
  lastReplenished: string;
}

export interface DispenserBay {
  id: string;
  bayNumber: number;
  name: string;
  nozzleType: 'High Flow 80L/m' | 'Standard 45L/m';
  status: 'idle' | 'authorizing' | 'dispensing' | 'completed' | 'offline';
  currentVehiclePlate?: string;
  currentDriverName?: string;
  targetLiters?: number;
  dispensedLiters?: number;
  flowRateLpm?: number;
  totalShiftLiters: number;
}

export interface FleetVehicle {
  id: string;
  plateNumber: string; // e.g., 70-4821 กทม.
  vehicleType: '10-Wheel Truck (สิบล้อ)' | '6-Wheel Truck (หกล้อ)' | 'Tractor Trailer (หัวลาก 22 ล้อ)' | 'Fuel Logistics Tanker (รถน้ำมัน)';
  model: string;
  assignedDriver: string;
  driverName?: string;
  driverId: string;
  department: 'Rayong Logistics' | 'Chonburi Heavy Haul' | 'Cold-Chain Central' | 'Eastern Distribution';
  dailyQuotaLiters: number;
  todayDispensedLiters: number;
  tankCapacityLiters: number;
  avgKmL: number;
  lastOdometerKm: number;
  qrStatus: 'active' | 'expired' | 'suspended';
  status: 'ready' | 'fueling' | 'on_route' | 'maintenance';
}

export interface FuelTransaction {
  id: string;
  timestamp: string;
  plateNumber: string;
  vehicleType: string;
  driverName: string;
  driverId: string;
  litersDispensed: number;
  tankId: string;
  bayId: string;
  bayName?: string;
  requestId?: string;
  startMeter?: number;
  endMeter?: number;
  odometerKm: number;
  approvalCode: string;
  approvedBy: string;
  status: 'completed' | 'flagged_anomaly' | 'in_progress';
  kmPerLiterEfficiency?: number;
  notes?: string;
}

export interface WorkflowStep {
  step: number;
  id: string;
  labelEn: string;
  labelTh: string;
  subEn: string;
  subTh: string;
  iconName: string;
  status: 'active' | 'completed' | 'standby';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  modelUsed?: string;
}

export interface DepotAsset {
  id: string;
  title: string;
  category: 'depot_hero' | 'storage_tanks' | 'dispenser_qr' | 'inspection' | 'generated';
  imageUrl: string;
  description: string;
  timestamp: string;
  location: string;
}

export type UserRole = 'driver' | 'admin';

export interface FuelRequest {
  id: string;
  timestamp: string;
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  driverId: string;
  requestedLiters: number;
  odometerKm: number;
  tankId: string;
  qrToken: string;
  qrExpiresAt: string;
  status: 'pending_approval' | 'approved' | 'dispensing' | 'completed' | 'rejected';
  approvedLiters?: number;
  approvedBy?: string;
  approvedAt?: string;
  rejectionReason?: string;
  dispensedLiters?: number;
  bayId?: string;
  verifiedBayId?: string;
  verifiedBayName?: string;
  verifiedAt?: string;
  scannerVerificationStatus?: 'verified' | 'unverified';
}

export interface AutoTimelineEvent {
  id: string;
  timestamp: string;
  timeFormatted: string;
  stage: 'GATE_ARRIVAL' | 'QR_REQUEST' | 'DISPATCH_APPROVAL' | 'SOLENOID_DISPENSE' | 'STOCK_SYNC' | 'AUDIT_LOG';
  titleEn: string;
  titleTh: string;
  descriptionEn: string;
  descriptionTh: string;
  plateNumber?: string;
  driverName?: string;
  actor: string;
  status: 'completed' | 'in_progress' | 'pending' | 'alert';
  savedToCloud?: boolean;
}

export interface AutoLogEntry {
  id: string;
  timestamp: string;
  category: 'AUTO_SAVE' | 'REQUEST' | 'APPROVAL' | 'DISPENSE' | 'INVENTORY' | 'SECURITY' | 'SYSTEM';
  level: 'INFO' | 'SUCCESS' | 'WARN' | 'ERROR';
  action: string;
  actor: string;
  role: 'driver' | 'admin' | 'iot_gateway' | 'system';
  details: string;
  savedToCloud: boolean;
  cloudDocId?: string;
}
