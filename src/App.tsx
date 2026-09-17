import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EnterpriseFunctionCenter } from './components/EnterpriseFunctionCenter';
import { DriverPortalView } from './components/DriverPortalView';
import { AdminPortalView } from './components/AdminPortalView';
import { HistoryView } from './components/HistoryView';
import { ProfileView } from './components/ProfileView';
import { BottomNav, BottomNavTab } from './components/BottomNav';
import { LiveFuelingModal } from './components/LiveFuelingModal';
import { 
  CompanyInfoModal, 
  DriversModal, 
  ApproversModal, 
  PermissionsModal, 
  ReportSummaryModal,
  MyVehicleModal,
  VehiclesListModal 
} from './components/FunctionModals';
import { db } from './lib/firebase';
import { doc, setDoc, onSnapshot, collection } from 'firebase/firestore';

import { 
  INITIAL_TANKS, 
  INITIAL_DISPENSERS, 
  INITIAL_VEHICLES, 
  INITIAL_TRANSACTIONS, 
} from './data/mockData';
import { 
  INITIAL_REQUESTS, 
  INITIAL_TIMELINE_EVENTS, 
  INITIAL_AUTO_LOGS 
} from './data/autoLogData';
import { 
  TankTelemetry, 
  DispenserBay, 
  FleetVehicle, 
  FuelTransaction, 
  UserRole, 
  FuelRequest, 
  AutoTimelineEvent, 
  AutoLogEntry 
} from './types';
import { ArrowLeft, Home, QrCode, ShieldCheck, Truck, Clock, User, Layers } from 'lucide-react';
import { SplashScreen } from './components/SplashScreen';
import { WorkspaceSelectionView } from './components/WorkspaceSelectionView';

export default function App() {
  const [lang, setLang] = useState<'th' | 'en'>('th');
  const [userRole, setUserRole] = useState<UserRole>('driver');

  // NC SMART CONTROL: Splash Screen & Workspace selection state
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentWorkspace, setCurrentWorkspace] = useState<'workspace_select' | 'fuel_fleet' | 'depot_telemetry' | 'security_audit'>('workspace_select');
  
  // Navigation tabs: 'home' | 'functions' | 'history' | 'profile' | 'driver_action' | 'admin_action'
  const [activeTab, setActiveTab] = useState<BottomNavTab | 'driver_action' | 'admin_action'>('home');

  const [tanks, setTanks] = useState<TankTelemetry[]>(INITIAL_TANKS);
  const [dispensers, setDispensers] = useState<DispenserBay[]>(INITIAL_DISPENSERS);
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(INITIAL_VEHICLES);
  const [transactions, setTransactions] = useState<FuelTransaction[]>(INITIAL_TRANSACTIONS);

  // Requests, Auto-Timeline, and AutoLogs
  const [requests, setRequests] = useState<FuelRequest[]>(INITIAL_REQUESTS);
  const [timelineEvents, setTimelineEvents] = useState<AutoTimelineEvent[]>(INITIAL_TIMELINE_EVENTS);
  const [autoLogs, setAutoLogs] = useState<AutoLogEntry[]>(INITIAL_AUTO_LOGS);
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string | null>('14:32:00');

  const [activeDriverVehicle, setActiveDriverVehicle] = useState<FleetVehicle>(INITIAL_VEHICLES[0]);
  const [isFuelingModalOpen, setIsFuelingModalOpen] = useState<boolean>(false);

  // Enterprise Modals State
  const [isCompanyModalOpen, setIsCompanyModalOpen] = useState<boolean>(false);
  const [isDriversModalOpen, setIsDriversModalOpen] = useState<boolean>(false);
  const [isApproversModalOpen, setIsApproversModalOpen] = useState<boolean>(false);
  const [isPermissionsModalOpen, setIsPermissionsModalOpen] = useState<boolean>(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState<boolean>(false);
  const [isMyVehicleModalOpen, setIsMyVehicleModalOpen] = useState<boolean>(false);
  const [isVehiclesListModalOpen, setIsVehiclesListModalOpen] = useState<boolean>(false);

  // Auto-Log recorder with immediate state update & Firestore persistence
  const recordAutoLog = async (
    category: AutoLogEntry['category'],
    level: AutoLogEntry['level'],
    action: string,
    actor: string,
    role: UserRole,
    details: string,
    cloudDocId?: string
  ) => {
    const now = new Date();
    const timeFormatted = now.toTimeString().split(' ')[0];
    const logId = `LOG-${Date.now().toString().slice(-6)}`;

    const newLog: AutoLogEntry = {
      id: logId,
      timestamp: timeFormatted,
      category,
      level,
      action,
      actor,
      role,
      details,
      cloudDocId: cloudDocId || logId,
      savedToCloud: true,
    };

    setAutoLogs((prev) => [newLog, ...prev]);
    setLastAutoSavedTime(timeFormatted);

    try {
      const logDocRef = doc(db, 'logs', logId);
      await setDoc(logDocRef, newLog);
    } catch (err) {
      console.warn('AutoLog firestore note:', err);
    }
  };

  // Auto-Timeline recorder with immediate state update & Firestore persistence
  const recordTimelineEvent = async (
    stage: AutoTimelineEvent['stage'],
    titleEn: string,
    titleTh: string,
    descriptionEn: string,
    descriptionTh: string,
    plateNumber?: string,
    driverName?: string,
    actor: string = 'POST LINK System',
    status: AutoTimelineEvent['status'] = 'completed'
  ) => {
    const now = new Date();
    const timeFormatted = now.toTimeString().split(' ')[0];
    const eventId = `EVT-${Date.now().toString().slice(-6)}`;

    const newEvent: AutoTimelineEvent = {
      id: eventId,
      timestamp: now.toISOString(),
      timeFormatted,
      stage,
      status,
      titleEn,
      titleTh,
      descriptionEn,
      descriptionTh,
      plateNumber,
      driverName,
      actor,
      savedToCloud: true,
    };

    setTimelineEvents((prev) => [newEvent, ...prev]);
    setLastAutoSavedTime(timeFormatted);

    try {
      const evtDocRef = doc(db, 'timeline_events', eventId);
      await setDoc(evtDocRef, newEvent);
    } catch (err) {
      console.warn('Timeline firestore note:', err);
    }
  };

  // Real-time Cloud listeners (Firestore synchronization)
  useEffect(() => {
    try {
      const reqColRef = collection(db, 'requests');
      const unsubReq = onSnapshot(reqColRef, (snapshot) => {
        if (!snapshot.empty) {
          const cloudRequests: FuelRequest[] = [];
          snapshot.forEach((d) => {
            cloudRequests.push(d.data() as FuelRequest);
          });
          setRequests((prev) => {
            const merged = [...cloudRequests];
            prev.forEach((p) => {
              if (!merged.find((m) => m.id === p.id)) {
                merged.push(p);
              }
            });
            return merged.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
          });
        }
      }, (err) => {
        console.warn('Requests snapshot listener note:', err?.message || err);
      });

      const tanksColRef = collection(db, 'tanks');
      const unsubTanks = onSnapshot(tanksColRef, (snapshot) => {
        if (!snapshot.empty) {
          const cloudTanks: TankTelemetry[] = [];
          snapshot.forEach((d) => {
            cloudTanks.push(d.data() as TankTelemetry);
          });
          if (cloudTanks.length > 0) {
            setTanks(cloudTanks);
          }
        }
      }, (err) => {
        console.warn('Tanks snapshot listener note:', err?.message || err);
      });

      return () => {
        unsubReq();
        unsubTanks();
      };
    } catch (e) {
      console.warn('Firestore initial subscribe note:', e);
    }
  }, []);

  // Driver creates fuel request
  const handleRequestFuel = async (newReq: FuelRequest) => {
    setRequests((prev) => [newReq, ...prev]);

    await recordTimelineEvent(
      'QR_REQUEST',
      `Fuel Request Created (${newReq.requestedLiters} L)`,
      `สร้างคำขอเติมน้ำมัน (${newReq.requestedLiters} ลิตร)`,
      `Driver ${newReq.driverName} requested ${newReq.requestedLiters} L for ${newReq.plateNumber} (Odo: ${newReq.odometerKm} km)`,
      `พนักงานขับรถ ${newReq.driverName} ขอเติมน้ำมัน ${newReq.requestedLiters} ลิตร ทะเบียน ${newReq.plateNumber} (เลขไมล์: ${newReq.odometerKm} กม.)`,
      newReq.plateNumber,
      newReq.driverName,
      `Driver (${newReq.driverName})`,
      'completed'
    );

    await recordAutoLog(
      'REQUEST',
      'INFO',
      `Fuel Request Generated [${newReq.id}]`,
      newReq.driverName,
      'driver',
      `Vehicle: ${newReq.plateNumber}, Odometer: ${newReq.odometerKm} km, Requested: ${newReq.requestedLiters} L, QR: ${newReq.qrToken}`,
      newReq.id
    );

    try {
      const reqDocRef = doc(db, 'requests', newReq.id);
      await setDoc(reqDocRef, newReq);
    } catch (err) {
      console.warn('Request firestore note:', err);
    }
  };

  // Admin approves fuel request
  const handleApproveRequest = async (reqId: string, approvedLiters: number) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;

    const now = new Date();
    const timeFormatted = now.toTimeString().split(' ')[0];

    const updatedReq: FuelRequest = {
      ...req,
      status: 'approved',
      approvedLiters,
      approvedBy: 'สมชาย ทองดี (Admin Lead)',
      approvedAt: timeFormatted,
    };

    setRequests((prev) => prev.map((r) => (r.id === reqId ? updatedReq : r)));

    await recordTimelineEvent(
      'DISPATCH_APPROVAL',
      `Central Dispatch Approved (${approvedLiters} L)`,
      `ศูนย์ควบคุมอนุมัติการเติม (${approvedLiters} ลิตร)`,
      `Dispatcher verified vehicle quota for ${req.plateNumber} and approved nozzle interlock release.`,
      `ศูนย์ควบคุมส่วนกลางตรวจสอบเลขไมล์และโควตารถ ${req.plateNumber} พร้อมกดอนุมัติปลดล็อกหัวจ่าย`,
      req.plateNumber,
      req.driverName,
      'Central Dispatcher (Somchai)',
      'completed'
    );

    await recordAutoLog(
      'APPROVAL',
      'SUCCESS',
      `Dispatch Remote Approval [${req.id}]`,
      'Admin Somchai',
      'admin',
      `Approved ${approvedLiters} L for vehicle ${req.plateNumber} (${req.driverName}). Hardware interlock authorized.`,
      req.id
    );

    try {
      const reqDocRef = doc(db, 'requests', req.id);
      await setDoc(reqDocRef, updatedReq, { merge: true });
    } catch (err) {
      console.warn('Approve firestore note:', err);
    }
  };

  // Admin rejects fuel request
  const handleRejectRequest = async (reqId: string, reason: string) => {
    const req = requests.find((r) => r.id === reqId);
    if (!req) return;

    const updatedReq: FuelRequest = {
      ...req,
      status: 'rejected',
      rejectionReason: reason,
    };

    setRequests((prev) => prev.map((r) => (r.id === reqId ? updatedReq : r)));

    await recordTimelineEvent(
      'DISPATCH_APPROVAL',
      `Fuel Request Rejected`,
      `ศูนย์ควบคุมปฏิเสธคำขอ`,
      `Request for ${req.plateNumber} was rejected: ${reason}`,
      `คำขอของรถ ${req.plateNumber} ถูกปฏิเสธ: ${reason}`,
      req.plateNumber,
      req.driverName,
      'Central Dispatcher',
      'alert'
    );

    await recordAutoLog(
      'APPROVAL',
      'WARN',
      `Fuel Request Rejected [${req.id}]`,
      'Admin Dispatcher',
      'admin',
      `Rejected request for ${req.plateNumber}. Reason: ${reason}`,
      req.id
    );

    try {
      const reqDocRef = doc(db, 'requests', req.id);
      await setDoc(reqDocRef, updatedReq, { merge: true });
    } catch (err) {
      console.warn('Reject firestore note:', err);
    }
  };

  // Auto-save trigger
  const handleTriggerAutoSave = async () => {
    const now = new Date();
    const timeFormatted = now.toTimeString().split(' ')[0];
    setLastAutoSavedTime(timeFormatted);

    await recordAutoLog(
      'AUTO_SAVE',
      'SUCCESS',
      'Depot Cloud State Synchronized',
      userRole === 'admin' ? 'Admin Portal Engine' : 'Driver Terminal Engine',
      userRole,
      `Auto-saved state to Cloud Firestore (Tanks: ${tanks.length}, Requests: ${requests.length}, Transactions: ${transactions.length})`
    );
  };

  // Dispense complete handler
  const handleCompleteFueling = async (newTx: FuelTransaction) => {
    setTransactions((prev) => [newTx, ...prev]);

    setTanks((prev) =>
      prev.map((tank) => {
        if (tank.id === newTx.tankId) {
          const updatedLiters = Math.max(0, tank.currentLiters - newTx.litersDispensed);
          return {
            ...tank,
            currentLiters: updatedLiters,
          };
        }
        return tank;
      })
    );

    setVehicles((prev) =>
      prev.map((v) => {
        if (v.plateNumber === newTx.plateNumber) {
          return {
            ...v,
            todayDispensedLiters: v.todayDispensedLiters + newTx.litersDispensed,
            lastOdometerKm: newTx.odometerKm,
            status: 'ready',
          };
        }
        return v;
      })
    );

    setRequests((prev) =>
      prev.map((r) => {
        if (r.id === newTx.requestId) {
          return {
            ...r,
            status: 'completed',
          };
        }
        return r;
      })
    );

    await recordTimelineEvent(
      'SOLENOID_DISPENSE',
      `Fuel Dispensed (${newTx.litersDispensed} L)`,
      `จ่ายน้ำมันเรียบร้อย (${newTx.litersDispensed} ลิตร)`,
      `Dispensed ${newTx.litersDispensed} L into ${newTx.plateNumber} at ${newTx.bayName || newTx.bayId}. Totalizer updated.`,
      `จ่ายน้ำมันสำเร็จ ${newTx.litersDispensed} ลิตร ใส่รถ ${newTx.plateNumber} ที่ตู้ ${newTx.bayName || newTx.bayId} ปิดวาล์วโซลินอยด์เรียบร้อย`,
      newTx.plateNumber,
      newTx.driverName,
      'Dispenser Hardware Interlock',
      'completed'
    );

    await recordAutoLog(
      'DISPENSE',
      'SUCCESS',
      `Fueling Completed [${newTx.id}]`,
      newTx.driverName,
      'driver',
      `Dispensed: ${newTx.litersDispensed} L, Bay: ${newTx.bayName}, Meter Start: ${newTx.startMeter} L, End: ${newTx.endMeter} L`,
      newTx.id
    );

    try {
      const txDocRef = doc(db, 'transactions', newTx.id);
      await setDoc(txDocRef, newTx);

      const updatedTank = tanks.find((t) => t.id === newTx.tankId);
      if (updatedTank) {
        const remainingLiters = Math.max(0, updatedTank.currentLiters - newTx.litersDispensed);
        const tankDocRef = doc(db, 'tanks', updatedTank.id);
        await setDoc(tankDocRef, {
          ...updatedTank,
          currentLiters: remainingLiters,
        }, { merge: true });
      }
    } catch (err: any) {
      console.warn('Firestore write note:', err?.message || err);
    }
  };

  // Navigation action dispatcher from the Function Center Cards
  const handleNavigateAction = (action: string) => {
    switch (action) {
      case 'request_qr':
      case 'my_qr':
      case 'fuel_status':
      case 'qr_status':
        setActiveTab('driver_action');
        break;
      case 'history':
        setActiveTab('history');
        break;
      case 'my_vehicle':
        setIsMyVehicleModalOpen(true);
        break;
      case 'vehicle_info':
        setIsVehiclesListModalOpen(true);
        break;
      case 'profile':
        setActiveTab('profile');
        break;
      case 'company':
        setIsCompanyModalOpen(true);
        break;
      case 'fleet':
        setIsVehiclesListModalOpen(true);
        break;
      case 'drivers':
        setIsDriversModalOpen(true);
        break;
      case 'approvers':
        setIsApproversModalOpen(true);
        break;
      case 'depot_telemetry':
      case 'dispensers':
      case 'admin_approvals':
        setActiveTab('admin_action');
        break;
      case 'permissions':
        setIsPermissionsModalOpen(true);
        break;
      case 'audit_logs':
        setActiveTab('history');
        break;
      case 'reports':
        setIsReportModalOpen(true);
        break;
      default:
        setActiveTab('home');
    }
  };

  const pendingApprovalsCount = requests.filter((r) => r.status === 'pending_approval').length;
  const activeDriverRequest = requests.find((r) => r.vehicleId === activeDriverVehicle.id && r.status !== 'completed' && r.status !== 'rejected') || null;

  // 01 — APPLICATION START / SPLASH SCREEN
  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => {
          setShowSplash(false);
        }}
      />
    );
  }

  // WORKSPACE SELECTION SCREEN
  if (currentWorkspace === 'workspace_select') {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans relative">
        <header className="border-b border-slate-800 bg-[#070B14] px-4 sm:px-6 py-4 shadow-lg sticky top-0 z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-slate-900 border border-slate-700/80 text-cyan-400 flex items-center justify-center font-black shadow-md">
                <ShieldCheck className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h1 className="text-base sm:text-lg font-black tracking-wider text-white font-mono uppercase">
                  NC SMART CONTROL
                </h1>
                <div className="text-[10px] uppercase tracking-widest text-slate-400 font-mono">
                  ENTERPRISE OPERATIONS
                </div>
              </div>
            </div>

            <button
              id="btn-splash-restart"
              type="button"
              onClick={() => setShowSplash(true)}
              className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-mono border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            >
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span className="hidden sm:inline">REPLAY SPLASH</span>
            </button>
          </div>
        </header>

        <main className="flex-1 max-w-xl sm:max-w-2xl lg:max-w-3xl w-full mx-auto p-4 sm:p-6 py-8">
          <WorkspaceSelectionView
            onSelectWorkspace={(ws) => {
              setCurrentWorkspace(ws);
              if (ws === 'fuel_fleet') {
                setActiveTab('home');
              } else if (ws === 'depot_telemetry') {
                setActiveTab('admin_action');
              } else if (ws === 'security_audit') {
                setActiveTab('history');
              }
            }}
            onReplaySplash={() => setShowSplash(true)}
          />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans relative">
      {/* 1. Header: NC SMART CONTROL / POST LINK with Role Switch [ DRIVER ] [ ADMIN ] */}
      <Header
        lang={lang}
        setLang={setLang}
        userRole={userRole}
        setUserRole={(role) => {
          setUserRole(role);
          // When switching role from header, reset to home view to see that role's functions
          setActiveTab('home');
        }}
        onSelectWorkspace={() => setCurrentWorkspace('workspace_select')}
        onReplaySplash={() => setShowSplash(true)}
      />

      {/* 2. Main Scrollable Container */}
      <main className="flex-1 max-w-xl sm:max-w-2xl lg:max-w-4xl w-full mx-auto p-4 sm:p-6 pb-28 sm:pb-32 space-y-4">
        {/* ========================================================================= */}
        {/* SUBVIEW HEADER BAR WITH "BACK TO WORKSPACES" & "BACK TO HOME"             */}
        {/* ========================================================================= */}
        <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2">
            <button
              id="btn-back-to-workspaces"
              type="button"
              onClick={() => setCurrentWorkspace('workspace_select')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-mono font-bold transition cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-cyan-400" />
              <span>WORKSPACES</span>
            </button>

            {activeTab !== 'home' && activeTab !== 'functions' && (
              <button
                id="btn-back-to-home"
                type="button"
                onClick={() => setActiveTab('home')}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold font-mono transition cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>{lang === 'th' ? 'หน้าแรก' : 'Home'}</span>
              </button>
            )}
          </div>

          <div className="text-right">
            <span className="text-[11px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              {activeTab === 'driver_action'
                ? 'DRIVER PORTAL'
                : activeTab === 'admin_action'
                ? 'ADMIN DISPATCH'
                : activeTab === 'history'
                ? 'LOGS & HISTORY'
                : activeTab === 'profile'
                ? 'USER PROFILE'
                : currentWorkspace === 'depot_telemetry'
                ? 'DEPOT TELEMETRY'
                : currentWorkspace === 'security_audit'
                ? 'SECURITY AUDIT'
                : 'FUNCTION CENTER'}
            </span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* A. ENTERPRISE FUNCTION CENTER (HOME & FUNCTIONS)                          */}
        {/* ========================================================================= */}
        {(activeTab === 'home' || activeTab === 'functions') && (
          <EnterpriseFunctionCenter
            lang={lang}
            userRole={userRole}
            setUserRole={setUserRole}
            activeVehicle={activeDriverVehicle}
            pendingRequestsCount={pendingApprovalsCount}
            activeRequest={activeDriverRequest}
            onNavigateAction={handleNavigateAction}
          />
        )}

        {/* ========================================================================= */}
        {/* B. DRIVER WORKFLOW VIEW (When tapping fuel operations)                     */}
        {/* ========================================================================= */}
        {activeTab === 'driver_action' && (
          <DriverPortalView
            lang={lang}
            vehicles={vehicles}
            activeVehicle={activeDriverVehicle}
            onSelectVehicle={(v) => setActiveDriverVehicle(v)}
            onRequestFuel={handleRequestFuel}
            onSimulateDispense={(_req) => {
              setIsFuelingModalOpen(true);
            }}
            timelineEvents={timelineEvents}
            myRequests={requests.filter((r) => r.vehicleId === activeDriverVehicle.id)}
            lastAutoSavedTime={lastAutoSavedTime}
          />
        )}

        {/* ========================================================================= */}
        {/* C. ADMIN DISPATCH VIEW (When tapping approval or telemetry)               */}
        {/* ========================================================================= */}
        {activeTab === 'admin_action' && (
          <AdminPortalView
            lang={lang}
            requests={requests}
            timelineEvents={timelineEvents}
            autoLogs={autoLogs}
            tanks={tanks}
            dispensers={dispensers}
            vehicles={vehicles}
            transactions={transactions}
            onApproveRequest={handleApproveRequest}
            onRejectRequest={handleRejectRequest}
            onTriggerAutoSave={handleTriggerAutoSave}
            lastAutoSavedTime={lastAutoSavedTime}
            onOpenFuelingModal={() => setIsFuelingModalOpen(true)}
          />
        )}

        {/* ========================================================================= */}
        {/* D. HISTORY VIEW                                                           */}
        {/* ========================================================================= */}
        {activeTab === 'history' && (
          <HistoryView
            lang={lang}
            transactions={transactions}
            requests={requests}
          />
        )}

        {/* ========================================================================= */}
        {/* E. PROFILE VIEW                                                           */}
        {/* ========================================================================= */}
        {activeTab === 'profile' && (
          <ProfileView
            lang={lang}
            setLang={setLang}
            userRole={userRole}
            setUserRole={(role) => {
              setUserRole(role);
              setActiveTab('home');
            }}
            activeVehicle={activeDriverVehicle}
            lastAutoSavedTime={lastAutoSavedTime}
          />
        )}
      </main>

      {/* ========================================================================= */}
      {/* 3. FIXED BOTTOM NAVIGATION                                                */}
      {/* ========================================================================= */}
      <BottomNav
        activeTab={
          activeTab === 'driver_action' || activeTab === 'admin_action'
            ? 'functions'
            : (activeTab as BottomNavTab)
        }
        setActiveTab={(tab) => {
          setActiveTab(tab);
        }}
        lang={lang}
        pendingApprovalsCount={pendingApprovalsCount}
      />

      {/* Modals */}
      <CompanyInfoModal
        isOpen={isCompanyModalOpen}
        onClose={() => setIsCompanyModalOpen(false)}
        lang={lang}
      />

      <DriversModal
        isOpen={isDriversModalOpen}
        onClose={() => setIsDriversModalOpen(false)}
        lang={lang}
        vehicles={vehicles}
      />

      <ApproversModal
        isOpen={isApproversModalOpen}
        onClose={() => setIsApproversModalOpen(false)}
        lang={lang}
      />

      <PermissionsModal
        isOpen={isPermissionsModalOpen}
        onClose={() => setIsPermissionsModalOpen(false)}
        lang={lang}
      />

      <ReportSummaryModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        lang={lang}
        transactions={transactions}
        tanks={tanks}
      />

      <MyVehicleModal
        isOpen={isMyVehicleModalOpen}
        onClose={() => setIsMyVehicleModalOpen(false)}
        lang={lang}
        vehicle={activeDriverVehicle}
      />

      <VehiclesListModal
        isOpen={isVehiclesListModalOpen}
        onClose={() => setIsVehiclesListModalOpen(false)}
        lang={lang}
        vehicles={vehicles}
        activeVehicle={activeDriverVehicle}
        onSelectVehicle={(v) => setActiveDriverVehicle(v)}
      />

      {/* Fueling Modal for active dispense simulation */}
      {isFuelingModalOpen && (
        <LiveFuelingModal
          isOpen={isFuelingModalOpen}
          onClose={() => setIsFuelingModalOpen(false)}
          lang={lang}
          vehicles={vehicles}
          onCompleteFueling={handleCompleteFueling}
        />
      )}
    </div>
  );
}
