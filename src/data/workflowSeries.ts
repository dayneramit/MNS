export interface WorkflowGalleryItem {
  id: string;
  stepNumber: number;
  stageCode: 'ARRIVAL' | 'QR_REQUEST' | 'DISPATCH_APPROVAL' | 'METERED_DISPENSE' | 'STOCK_REPORT';
  titleEn: string;
  titleTh: string;
  subEn: string;
  subTh: string;
  detailEn: string;
  detailTh: string;
  imageUrl: string;
  technicalSpecs: {
    protocol: string;
    hardware: string;
    securityLevel: string;
    metric: string;
  };
}

export const WORKFLOW_SERIES: WorkflowGalleryItem[] = [
  {
    id: 'wf-step-1',
    stepNumber: 1,
    stageCode: 'ARRIVAL',
    titleEn: '1. Fleet Truck Check-in at Secure Gate',
    titleTh: '1. รถบรรทุกกองเรือเข้าจุดคลังผ่านเกตความปลอดภัย',
    subEn: 'RFID / License Plate & Geofenced Arrival Verification',
    subTh: 'ตรวจสอบป้ายทะเบียนและพิกัด Geofence ก่อนเข้าพื้นที่จ่ายน้ำมัน',
    detailEn: 'Thai 10-wheel company fleet truck arrives at the industrial corporate fuel depot in an industrial estate. Access is strictly granted to pre-registered logistics vehicles equipped with MNS DataLink telematics.',
    detailTh: 'รถบรรทุก 10 ล้อของบริษัทเข้าสู่สถานีบริการน้ำมันภายในนิคมอุตสาหกรรม โดยระบบตรวจสอบสิทธิ์เฉพาะรถที่ขึ้นทะเบียนล่วงหน้า ไม่อนุญาตให้รถภายนอกหรือรถสาธารณะเข้าใช้งาน',
    imageUrl: '/src/assets/images/workflow_truck_arrival_1789660135332.jpg',
    technicalSpecs: {
      protocol: 'Geofence GPS + ANPR Camera',
      hardware: 'Industrial Boom Barrier & RFID Scanner',
      securityLevel: 'Restricted Corporate Asset Access',
      metric: 'Entry Time: < 3.2 sec',
    },
  },
  {
    id: 'wf-step-2',
    stepNumber: 2,
    stageCode: 'QR_REQUEST',
    titleEn: '2. Dynamic QR Fuel Authorization Request',
    titleTh: '2. พนักงานขับรถสร้าง QR ขออนุมัติเติมน้ำมัน',
    subEn: 'Encrypted Single-Use Dynamic QR Token Generation',
    subTh: 'สร้างรหัส QR ไดนามิกแบบใช้ครั้งเดียว ผูกกับเลขไมล์และเที่ยววิ่ง',
    detailEn: 'The certified Thai driver logs in via the POST LINK mobile driver terminal, inputs the current odometer reading (e.g. 340,110 km), and requests diesel allotment (up to daily quota). An encrypted time-limited QR token is generated.',
    detailTh: 'พนักงานขับรถระบุเลขไมล์ปัจจุบันและจำนวนลิตรที่ต้องการเติมผ่านระบบ POST LINK สร้าง QR Code ดิจิทัลที่เข้ารหัส AES-256 มีอายุจำกัด 5 นาที ป้องกันการส่งต่อหรือถ่ายภาพซ้ำ',
    imageUrl: '/src/assets/images/workflow_driver_qr_1789660168548.jpg',
    technicalSpecs: {
      protocol: 'Time-based OTP & AES-256 QR Token',
      hardware: 'Rugged Driver Industrial Handheld / Mobile',
      securityLevel: 'Anti-Replay / Anti-Tamper Dynamic Token',
      metric: 'Validity Window: 300 seconds',
    },
  },
  {
    id: 'wf-step-3',
    stepNumber: 3,
    stageCode: 'DISPATCH_APPROVAL',
    titleEn: '3. Central Dispatch Remote Authorization',
    titleTh: '3. ศูนย์ควบคุมอนุมัติการเติมน้ำมันระยะไกล',
    subEn: 'Real-time Quota, Odometer Sanity & Route Matching',
    subTh: 'ตรวจสอบโควตารายวัน ความสมเหตุสมผลของอัตราสิ้นเปลือง และเส้นทาง',
    detailEn: 'Central Fleet Operations supervisor reviews the live fuel request. Automated logic cross-checks vehicle quota limits and estimated consumption (km/L). Upon dispatcher validation or auto-policy match, remote unlock authorization is signed.',
    detailTh: 'เจ้าหน้าที่ศูนย์ควบคุมส่วนกลางตรวจสอบข้อมูลคำขอ ระบบคำนวณอัตราสิ้นเปลืองน้ำมันเทียบกับระยะทางวิ่งจริง หากตรงตามเงื่อนไข จะส่งสัญญาณดิจิทัลปลดล็อกไปยังหัวจ่ายที่คลังทันที',
    imageUrl: '/src/assets/images/workflow_dispatch_appr_1789660193381.jpg',
    technicalSpecs: {
      protocol: 'MNS DataLink 4G/LTE Cat-M1 MQTT',
      hardware: 'Central Ops Cloud Dispatch Console',
      securityLevel: 'Two-Man Rule / Automated Quota Guard',
      metric: 'Approval Latency: 1.4 sec',
    },
  },
  {
    id: 'wf-step-4',
    stepNumber: 4,
    stageCode: 'METERED_DISPENSE',
    titleEn: '4. Optical QR Scan & Solenoid Dispensing',
    titleTh: '4. สแกน QR หน้าตู้ ปลดล็อกวาล์วและจ่ายน้ำมันอัตโนมัติ',
    subEn: 'Explosion-Proof Hardware Interlock & Precise Metering',
    subTh: 'สแกน QR ผ่านหัวอ่านหน้าตู้ ปลดล็อกโซลินอยด์วาล์ว จ่ายตามลิตรที่อนุมัติ',
    detailEn: 'At Dispenser Bay 01, the driver presents the QR token to the rugged optical scanner. The explosion-proof solenoid valve opens, dispensing high-flow diesel into the truck. The flow meter cuts off precisely at the authorized volume.',
    detailTh: 'หัวอ่านออปติคอลที่หัวจ่ายสแกน QR รหัสตรงกับคำสั่งอนุมัติ วาล์วโซลินอยด์เปิดและจ่ายน้ำมันดีเซลด้วยความเร็วสูง 80 ลิตร/นาที และตัดการทำงานทันทีเมื่อครบจำนวนลิตรอย่างแม่นยำ',
    imageUrl: '/src/assets/images/workflow_dispense_fuel_1789660217288.jpg',
    technicalSpecs: {
      protocol: 'RS-485 Modbus RTU / Intrinsically Safe Pulse',
      hardware: 'High-Flow Dispenser & Flameproof Solenoid',
      securityLevel: 'Hardware Electronic Interlock (No Manual Bypass)',
      metric: 'Meter Accuracy: ±0.15% (Weights & Measures Std)',
    },
  },
  {
    id: 'wf-step-5',
    stepNumber: 5,
    stageCode: 'STOCK_REPORT',
    titleEn: '5. Instant Bulk Stock Sync & Audit Report',
    titleTh: '5. ตัดสต๊อกคลังทันที และสร้างรายงานออดิตตรวจสอบ',
    subEn: 'Zero-Variance Tank Inventory & Shift Reconciliation',
    subTh: 'หักลบยอดน้ำมันในถังใหญ่ (Tank-01) อัตโนมัติ พร้อมสลิปดิจิทัลและวิเคราะห์ กม./ลิตร',
    detailEn: 'Dispense telemetry instantly pushes to cloud servers. Bulk Tank #1 inventory drops in real time, digital fueling slips are archived, and shift audit logs are generated with 0% unexplained variance.',
    detailTh: 'ข้อมูลการเติมถูกบันทึกลงระบบคลาวด์ทันที ยอดสต๊อกคงเหลือในถังเก็บน้ำมันขนาดใหญ่ของโรงงานลดลงตามจริง ตรวจสอบย้อนหลังได้ทุกหยด พร้อมคำนวณประสิทธิภาพการใช้น้ำมัน (กม./ลิตร) รายคัน',
    imageUrl: '/src/assets/images/workflow_data_report_1789660233509.jpg',
    technicalSpecs: {
      protocol: 'Firebase Cloud Firestore / Real-time Ledger',
      hardware: 'Magnetostrictive Level Gauge & IoT Gateway',
      securityLevel: 'Immutable Audit Trail & Digital Slip Signing',
      metric: 'Reconciliation Variance: 0.00% Deficit',
    },
  },
];
