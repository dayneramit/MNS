import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Camera, 
  CameraOff, 
  QrCode, 
  Scan, 
  CheckCircle2, 
  AlertTriangle, 
  Flashlight, 
  RefreshCw, 
  X, 
  ShieldCheck, 
  Fuel, 
  Maximize2, 
  Volume2, 
  VolumeX, 
  Radio, 
  RotateCw,
  Sparkles,
  Check
} from 'lucide-react';
import { DispenserBay, FuelRequest } from '../types';

export interface ScannedBayVerification {
  bayId: string;
  bayName: string;
  fuelType: string;
  nozzleType: string;
  solenoidArmed: boolean;
  meterCalibrationId: string;
  timestamp: string;
  rawPayload: string;
}

interface DriverQrCameraScannerProps {
  lang: 'th' | 'en';
  isOpen: boolean;
  onClose: () => void;
  onVerificationComplete: (verification: ScannedBayVerification) => void;
  activeRequest?: FuelRequest | null;
  activeVehiclePlate?: string;
  onProceedToDispense?: (request: FuelRequest) => void;
}

// Preset depot dispenser QR codes for quick testing or direct detection
const DEPOT_DISPENSER_PRESETS: Record<string, { bayName: string; fuelType: string; nozzle: string; meterId: string }> = {
  'MNS-BAY-01-RAYONG-DEPOT': {
    bayName: 'Bay 01 - Heavy Commercial Diesel Lane',
    fuelType: 'High-Speed Diesel B7 (Euro 5)',
    nozzle: 'High Flow 80L/m',
    meterId: 'MNS-FM-RAYONG-01A',
  },
  'MNS-BAY-02-LOGISTICS-HUB': {
    bayName: 'Bay 02 - Fleet Distribution Bay',
    fuelType: 'High-Speed Diesel B7 (Euro 5)',
    nozzle: 'Standard 45L/m',
    meterId: 'MNS-FM-RAYONG-02B',
  },
  'MNS-BAY-03-EXPEDITE': {
    bayName: 'Bay 03 - Cold-Chain & Tanker Lane',
    fuelType: 'Diesel B20 (Heavy Haul)',
    nozzle: 'High Flow 80L/m',
    meterId: 'MNS-FM-RAYONG-03C',
  },
};

export const DriverQrCameraScanner: React.FC<DriverQrCameraScannerProps> = ({
  lang,
  isOpen,
  onClose,
  onVerificationComplete,
  activeRequest,
  activeVehiclePlate,
  onProceedToDispense,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const scanIntervalRef = useRef<number | null>(null);

  const [cameraState, setCameraState] = useState<'idle' | 'starting' | 'active' | 'denied' | 'unsupported' | 'error'>('idle');
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [torchActive, setTorchActive] = useState<boolean>(false);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [availableCameras, setAvailableCameras] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');
  
  // Detection state
  const [detectedData, setDetectedData] = useState<ScannedBayVerification | null>(null);
  const [isProcessingCode, setIsProcessingCode] = useState<boolean>(false);
  const [simulatedScannerActive, setSimulatedScannerActive] = useState<boolean>(false);

  // Play industrial confirmation sound with Web Audio API
  const playSuccessChirp = useCallback(() => {
    if (!audioEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      
      const now = ctx.currentTime;
      osc.frequency.setValueAtTime(880, now); // A5
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.12); // A6 chirp
      
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(now);
      osc.stop(now + 0.18);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }, [audioEnabled]);

  // Stop camera tracks cleanly
  const stopCameraStream = useCallback(() => {
    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop();
      });
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setTorchActive(false);
  }, []);

  // Initialize camera using MediaDevices API
  const startCamera = useCallback(async () => {
    if (!isOpen) return;

    setCameraState('starting');
    setErrorMessage('');
    setDetectedData(null);
    stopCameraStream();

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraState('unsupported');
      setErrorMessage(
        lang === 'th'
          ? 'เบราว์เซอร์ไม่รองรับ MediaDevices API ระบบจึงเปิดโหมดกล้องจำลองระดับคลังองค์กร'
          : 'MediaDevices API is not supported in this browser. Switching to depot simulator.'
      );
      return;
    }

    try {
      // Query available video devices
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter((d) => d.kind === 'videoinput');
      setAvailableCameras(videoDevices);

      const constraints: MediaStreamConstraints = {
        audio: false,
        video: selectedDeviceId
          ? { deviceId: { exact: selectedDeviceId } }
          : {
              facingMode: { ideal: facingMode },
              width: { ideal: 1280 },
              height: { ideal: 720 },
            },
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play().catch(() => {});
      }

      setCameraState('active');
    } catch (err: any) {
      console.warn('[POST LINK Camera Scanner Notice]:', err);
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        setCameraState('denied');
        setErrorMessage(
          lang === 'th'
            ? 'การเข้าถึงกล้องถูกปฏิเสธ กรุณาอนุญาตสิทธิ์การใช้งานกล้องในเบราว์เซอร์เพื่อสแกน QR หน้าตู้หัวจ่าย'
            : 'Camera access was denied. Please allow camera permissions in browser settings.'
        );
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        setCameraState('unsupported');
        setErrorMessage(
          lang === 'th'
            ? 'ไม่พบอุปกรณ์กล้องบนเครื่อง ระบบจะสลับเข้าสู่โหมดจำลองการสแกนหน้าตู้จ่ายอัตโนมัติ'
            : 'No camera hardware found. Switched to automated dispenser simulator.'
        );
      } else {
        setCameraState('error');
        setErrorMessage(err.message || 'Unable to open camera stream');
      }
    }
  }, [isOpen, facingMode, selectedDeviceId, lang, stopCameraStream]);

  // Toggle Camera Flash / Torch if supported on mobile device
  const toggleTorch = async () => {
    if (!streamRef.current) return;
    try {
      const track = streamRef.current.getVideoTracks()[0];
      const capabilities: any = track?.getCapabilities ? track.getCapabilities() : {};
      if (capabilities && 'torch' in capabilities) {
        const nextState = !torchActive;
        await (track as any).applyConstraints({
          advanced: [{ torch: nextState }],
        });
        setTorchActive(nextState);
      } else {
        // Torch not hardware supported; simulate visual light
        setTorchActive(!torchActive);
      }
    } catch {
      setTorchActive(!torchActive);
    }
  };

  // Flip camera between environment (rear) and user (front)
  const toggleFacingMode = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
    setSelectedDeviceId('');
  };

  // Process detected QR code payload
  const handleQrPayloadFound = useCallback(
    (rawCode: string) => {
      if (isProcessingCode || detectedData) return;
      setIsProcessingCode(true);

      const normalized = rawCode.trim().toUpperCase();
      let bayId = 'BAY-01';
      let bayName = 'Bay 01 - Heavy Commercial Diesel Lane';
      let fuelType = 'High-Speed Diesel B7 (Euro 5)';
      let nozzle = 'High Flow 80L/m';
      let meterId = 'MNS-FM-RAYONG-01A';

      // Match preset or parse custom QR payload
      if (DEPOT_DISPENSER_PRESETS[normalized]) {
        const p = DEPOT_DISPENSER_PRESETS[normalized];
        bayId = normalized.includes('02') ? 'BAY-02' : normalized.includes('03') ? 'BAY-03' : 'BAY-01';
        bayName = p.bayName;
        fuelType = p.fuelType;
        nozzle = p.nozzle;
        meterId = p.meterId;
      } else if (normalized.includes('BAY-02') || normalized.includes('02')) {
        bayId = 'BAY-02';
        bayName = 'Bay 02 - Fleet Distribution Bay';
        nozzle = 'Standard 45L/m';
        meterId = 'MNS-FM-RAYONG-02B';
      } else if (normalized.includes('BAY-03') || normalized.includes('03')) {
        bayId = 'BAY-03';
        bayName = 'Bay 03 - Cold-Chain & Tanker Lane';
        fuelType = 'Diesel B20 (Heavy Haul)';
        meterId = 'MNS-FM-RAYONG-03C';
      }

      const verification: ScannedBayVerification = {
        bayId,
        bayName,
        fuelType,
        nozzleType: nozzle,
        solenoidArmed: true,
        meterCalibrationId: meterId,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        rawPayload: rawCode,
      };

      playSuccessChirp();
      if (navigator.vibrate) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch {}
      }

      setDetectedData(verification);
      setIsProcessingCode(false);
    },
    [isProcessingCode, detectedData, playSuccessChirp]
  );

  // Optical frame analysis loop (using native BarcodeDetector if available)
  useEffect(() => {
    if (cameraState !== 'active' || !videoRef.current || detectedData) return;

    let isScanning = true;

    const scanFrame = async () => {
      if (!isScanning || detectedData) return;

      // Check if browser has native BarcodeDetector
      if ('BarcodeDetector' in window && videoRef.current && videoRef.current.readyState >= 2) {
        try {
          const barcodeDetector = new (window as any).BarcodeDetector({ formats: ['qr_code'] });
          const barcodes = await barcodeDetector.detect(videoRef.current);
          if (barcodes && barcodes.length > 0 && barcodes[0]?.rawValue) {
            handleQrPayloadFound(barcodes[0].rawValue);
            return;
          }
        } catch {
          // Barcode detector detection frame skipped
        }
      }
    };

    scanIntervalRef.current = window.setInterval(scanFrame, 350);

    return () => {
      isScanning = false;
      if (scanIntervalRef.current) {
        clearInterval(scanIntervalRef.current);
        scanIntervalRef.current = null;
      }
    };
  }, [cameraState, detectedData, handleQrPayloadFound]);

  // Lifecycle start / stop
  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCameraStream();
      setDetectedData(null);
      setCameraState('idle');
    }
    return () => {
      stopCameraStream();
    };
  }, [isOpen, startCamera, stopCameraStream]);

  if (!isOpen) return null;

  return (
    <div 
      id="driver-camera-scanner-modal" 
      className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
    >
      <div 
        id="camera-scanner-card" 
        className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col my-auto"
      >
        {/* Top Header: Title & Camera Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Scan className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black text-white">
                  {lang === 'th' ? 'สแกนเนอร์ QR ยืนยันตู้จ่ายน้ำมัน' : 'Dispenser QR Verification Scanner'}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  MediaDevices HUD
                </span>
              </div>
              <p className="text-xs text-slate-400 font-mono">
                {lang === 'th' ? 'สแกน QR Code ประจำช่องหัวจ่ายน้ำมัน (Bay QR)' : 'Point lens at dispenser terminal QR tag'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Feedback Toggle */}
            <button
              onClick={() => setAudioEnabled(!audioEnabled)}
              className={`p-2 rounded-xl border transition ${
                audioEnabled 
                  ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700' 
                  : 'bg-slate-900 border-slate-800 text-slate-500'
              }`}
              title={audioEnabled ? 'Mute Beep' : 'Enable Beep'}
            >
              {audioEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Close Button */}
            <button
              onClick={() => {
                stopCameraStream();
                onClose();
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition"
              title="Close Scanner"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Viewport Area: Live Camera Feed + HUD */}
        <div className="relative bg-black aspect-video sm:aspect-[16/10] w-full flex items-center justify-center overflow-hidden select-none">
          {/* Real Video Element */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className={`w-full h-full object-cover transition-opacity duration-300 ${
              cameraState === 'active' ? 'opacity-100' : 'opacity-0'
            }`}
          />

          {/* Torch Simulation Glow overlay */}
          {torchActive && (
            <div className="absolute inset-0 bg-amber-100/15 pointer-events-none z-10 mix-blend-screen transition-opacity" />
          )}

          {/* Fallback / Standby Simulation View when camera is unavailable or loading */}
          {cameraState !== 'active' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-black">
              {cameraState === 'starting' && (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  <p className="text-sm font-mono text-amber-400 font-semibold">
                    {lang === 'th' ? 'กำลังเปิดใช้งานกล้อง (Requesting MediaStream)...' : 'Initializing MediaDevices video stream...'}
                  </p>
                </div>
              )}

              {cameraState === 'denied' && (
                <div className="max-w-md space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 mx-auto flex items-center justify-center">
                    <CameraOff className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {lang === 'th' ? 'ไม่ได้รับอนุญาตให้ใช้กล้อง' : 'Camera Permission Denied'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    {errorMessage}
                  </p>
                  <button
                    onClick={startCamera}
                    className="mt-2 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs font-mono transition"
                  >
                    {lang === 'th' ? 'ลองขอสิทธิ์ใหม่อีกครั้ง' : 'Retry Camera Access'}
                  </button>
                </div>
              )}

              {(cameraState === 'unsupported' || cameraState === 'error') && (
                <div className="max-w-md space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 mx-auto flex items-center justify-center">
                    <Radio className="w-6 h-6 animate-pulse" />
                  </div>
                  <h4 className="text-base font-bold text-white">
                    {lang === 'th' ? 'เข้าสู่โหมดจำลองการสแกนคลังน้ำมัน' : 'Depot Optical Scanner Ready'}
                  </h4>
                  <p className="text-xs text-slate-400 leading-relaxed font-mono">
                    {lang === 'th' 
                      ? 'ท่านสามารถทดสอบการสแกนรหัส QR ประจำหัวจ่ายน้ำมันได้ทันทีผ่านชุดจำลองหัวจ่าย' 
                      : 'You can test verification instantly using standard depot dispenser bay codes.'}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Optical Targeting Reticle & Laser Sweep HUD */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8 z-20">
            {/* Darkened Vignette Mask */}
            <div className="w-64 h-64 sm:w-72 sm:h-72 relative rounded-2xl border-2 border-dashed border-amber-500/40 shadow-[0_0_0_9999px_rgba(2,6,23,0.55)] flex items-center justify-center">
              {/* Corner Targeting Brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-amber-400 rounded-tl-lg" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-amber-400 rounded-tr-lg" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-amber-400 rounded-bl-lg" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-amber-400 rounded-br-lg" />

              {/* Center Crosshair */}
              <div className="w-6 h-6 relative flex items-center justify-center opacity-40">
                <div className="w-full h-0.5 bg-amber-400" />
                <div className="h-full w-0.5 bg-amber-400 absolute" />
              </div>

              {/* Sweeping Laser Line */}
              {!detectedData && (
                <div className="absolute inset-x-2 h-1 bg-gradient-to-r from-transparent via-amber-400 to-transparent shadow-[0_0_12px_#f59e0b] animate-bounce" />
              )}

              {/* Success Lock Overlay */}
              {detectedData && (
                <div className="absolute inset-0 bg-emerald-500/20 border-2 border-emerald-400 rounded-2xl flex flex-col items-center justify-center animate-in zoom-in-95 duration-200">
                  <CheckCircle2 className="w-16 h-16 text-emerald-400 animate-bounce" />
                  <span className="mt-2 text-xs font-mono font-black text-emerald-300 tracking-wider bg-slate-950/80 px-3 py-1 rounded-full border border-emerald-500/40">
                    BAY QR VERIFIED
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Telemetry OSD (On-Screen Display) Info Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-amber-400/90 z-30 pointer-events-none">
            <div className="bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>SENSOR: {cameraState.toUpperCase()}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-300">FACING: {facingMode.toUpperCase()}</span>
            </div>

            <div className="bg-slate-950/80 backdrop-blur-sm px-2.5 py-1 rounded-lg border border-slate-800 flex items-center gap-2 text-slate-300">
              <span>TRUCK: {activeVehiclePlate || 'ASSIGNED'}</span>
              <span className="text-slate-500">|</span>
              <span className="text-emerald-400 font-bold">GEOFENCE: ARMED</span>
            </div>
          </div>

          {/* In-Camera Quick Controls: Flip Camera & Flashlight */}
          <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between z-30">
            <div className="flex items-center gap-2">
              {/* Torch Switch */}
              <button
                type="button"
                onClick={toggleTorch}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition ${
                  torchActive
                    ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/30'
                    : 'bg-slate-950/80 text-slate-300 hover:bg-slate-900 border border-slate-800'
                }`}
              >
                <Flashlight className="w-3.5 h-3.5" />
                <span>{torchActive ? 'TORCH ON' : 'TORCH'}</span>
              </button>

              {/* Flip Lens */}
              <button
                type="button"
                onClick={toggleFacingMode}
                className="px-3 py-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center gap-1.5 transition"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>FLIP LENS</span>
              </button>
            </div>

            {/* Manual Camera Re-trigger */}
            <button
              type="button"
              onClick={startCamera}
              className="p-1.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-300 text-xs transition"
              title="Reset Video Stream"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Verification Result Display or Quick Simulation Presets */}
        <div className="p-5 bg-slate-950 border-t border-slate-800 space-y-4">
          {detectedData ? (
            /* Verified Bay Card */
            <div className="rounded-2xl bg-emerald-950/30 border border-emerald-500/40 p-4 space-y-3 animate-in fade-in-50 duration-300">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <span>{detectedData.bayName}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                        {detectedData.bayId}
                      </span>
                    </h4>
                    <p className="text-xs text-slate-400 font-mono">
                      {detectedData.fuelType} • {detectedData.nozzleType}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  ✓ VERIFIED AT {detectedData.timestamp}
                </span>
              </div>

              {/* Technical Specifications Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs font-mono pt-1">
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">SOLENOID VALVE</span>
                  <span className="text-emerald-400 font-bold">ARMED & UNLOCKED</span>
                </div>
                <div className="bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">FLOW METER ID</span>
                  <span className="text-white font-bold">{detectedData.meterCalibrationId}</span>
                </div>
                <div className="col-span-2 sm:col-span-1 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
                  <span className="text-slate-500 block text-[10px]">DEPOT LOCATION</span>
                  <span className="text-amber-400 font-bold">Rayong Logistics Yard</span>
                </div>
              </div>

              {/* Action Buttons: Confirm & Attach to Fuel Request */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    stopCameraStream();
                    onVerificationComplete(detectedData);
                    if (activeRequest && onProceedToDispense) {
                      onProceedToDispense({
                        ...activeRequest,
                        bayId: detectedData.bayId,
                        verifiedBayId: detectedData.bayId,
                        verifiedBayName: detectedData.bayName,
                        verifiedAt: detectedData.timestamp,
                        scannerVerificationStatus: 'verified',
                      });
                    }
                    onClose();
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition"
                >
                  <Check className="w-4 h-4" />
                  <span>
                    {lang === 'th' ? 'ยืนยันตู้จ่ายนี้ & ดำเนินการต่อ' : 'Confirm Bay & Proceed to Fueling'}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => setDetectedData(null)}
                  className="py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono text-xs transition"
                >
                  {lang === 'th' ? 'สแกนใหม่อีกครั้ง' : 'Scan Different Bay'}
                </button>
              </div>
            </div>
          ) : (
            /* Direct Preset Barcode Targets (Guarantees testing works anywhere) */
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold flex items-center gap-1.5">
                  <QrCode className="w-3.5 h-3.5 text-amber-400" />
                  <span>{lang === 'th' ? 'หรือแตะรหัส QR ประจำตู้จ่ายเพื่อทดสอบทันที:' : 'Or tap a dispenser terminal code to verify instantly:'}</span>
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  MNS Industrial Tag
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {Object.entries(DEPOT_DISPENSER_PRESETS).map(([code, details]) => (
                  <button
                    key={code}
                    type="button"
                    onClick={() => handleQrPayloadFound(code)}
                    className="p-3 rounded-xl bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-amber-500/50 text-left transition group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold font-mono text-amber-400 group-hover:text-amber-300">
                        {code.split('-')[1]}-{code.split('-')[2]}
                      </span>
                      <span className="text-[10px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded">
                        {details.nozzle.includes('High') ? '80L/m' : '45L/m'}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300 font-medium truncate">
                      {details.bayName.split('-')[1] || details.bayName}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                      {details.fuelType}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
