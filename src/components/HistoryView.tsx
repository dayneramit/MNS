import React, { useState } from 'react';
import { FuelTransaction, FuelRequest } from '../types';
import { Clock, Search, CheckCircle2, AlertCircle, FileText, Filter, Calendar, Fuel, Truck } from 'lucide-react';

interface HistoryViewProps {
  lang: 'th' | 'en';
  transactions: FuelTransaction[];
  requests: FuelRequest[];
}

export const HistoryView: React.FC<HistoryViewProps> = ({
  lang,
  transactions,
  requests,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [historyTab, setHistoryTab] = useState<'transactions' | 'requests'>('transactions');

  // Filter transactions
  const filteredTx = transactions.filter((tx) => {
    const term = searchTerm.toLowerCase();
    return (
      tx.plateNumber.toLowerCase().includes(term) ||
      tx.driverName.toLowerCase().includes(term) ||
      tx.approvalCode.toLowerCase().includes(term) ||
      tx.bayId.toLowerCase().includes(term)
    );
  });

  // Filter requests
  const filteredReqs = requests.filter((r) => {
    const term = searchTerm.toLowerCase();
    return (
      r.plateNumber.toLowerCase().includes(term) ||
      r.driverName.toLowerCase().includes(term) ||
      r.id.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900 border border-slate-800 rounded-xl p-4">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-500" />
            <span>{lang === 'th' ? 'ประวัติการเติมน้ำมัน & คำขอ' : 'Fueling & Request History'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {lang === 'th'
              ? 'บันทึกรายการจ่ายน้ำมันและคำขออนุมัติทั้งหมดในระบบ'
              : 'All completed dispenses and fuel allocation requests'}
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            id="input-history-search"
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={lang === 'th' ? 'ค้นหาทะเบียน, คนขับ...' : 'Search plate, driver...'}
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Sub-Tabs: รายการเติมสำเร็จ (Transactions) vs คำขออนุมัติ (Requests) */}
      <div className="flex gap-2 border-b border-slate-800 pb-2">
        <button
          id="btn-tab-history-tx"
          onClick={() => setHistoryTab('transactions')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
            historyTab === 'transactions'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Fuel className="w-3.5 h-3.5" />
          <span>{lang === 'th' ? `ประวัติการเติม (${filteredTx.length})` : `Dispensed Logs (${filteredTx.length})`}</span>
        </button>

        <button
          id="btn-tab-history-req"
          onClick={() => setHistoryTab('requests')}
          className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition flex items-center gap-2 ${
            historyTab === 'requests'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{lang === 'th' ? `คำขออนุมัติทั้งหมด (${filteredReqs.length})` : `All Requests (${filteredReqs.length})`}</span>
        </button>
      </div>

      {/* Transactions List */}
      {historyTab === 'transactions' && (
        <div className="space-y-2.5">
          {filteredTx.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs font-mono">
              {lang === 'th' ? 'ไม่พบข้อมูลประวัติการเติมน้ำมัน' : 'No fuel transactions found'}
            </div>
          ) : (
            filteredTx.map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-950 border border-slate-800 text-amber-400 flex items-center justify-center shrink-0 font-bold font-mono text-xs">
                    <Fuel className="w-5 h-5 text-amber-500" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold font-mono text-white">{tx.plateNumber}</span>
                      <span className="text-xs text-slate-400 font-mono">({tx.driverName})</span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {tx.bayId}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1 flex-wrap">
                      <span>{lang === 'th' ? 'เวลา:' : 'Time:'} {tx.timestamp}</span>
                      <span>•</span>
                      <span>{lang === 'th' ? 'ไมล์:' : 'Odo:'} {tx.odometerKm.toLocaleString()} km</span>
                      <span>•</span>
                      <span>{lang === 'th' ? 'รหัสอนุมัติ:' : 'Code:'} <strong className="text-slate-300">{tx.approvalCode}</strong></span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                  <div className="text-base sm:text-lg font-black font-mono text-amber-400">
                    +{tx.litersDispensed.toLocaleString()} <span className="text-xs text-slate-400 font-normal">L</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    {lang === 'th' ? '✓ เติมสำเร็จ / ตัดสต๊อกแล้ว' : '✓ Completed'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Requests List */}
      {historyTab === 'requests' && (
        <div className="space-y-2.5">
          {filteredReqs.length === 0 ? (
            <div className="p-8 text-center bg-slate-900/50 rounded-xl border border-slate-800 text-slate-400 text-xs font-mono">
              {lang === 'th' ? 'ไม่พบข้อมูลคำขอ' : 'No fuel requests found'}
            </div>
          ) : (
            filteredReqs.map((req) => (
              <div
                key={req.id}
                className="p-3.5 sm:p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start sm:items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold font-mono text-xs border ${
                    req.status === 'approved' || req.status === 'completed'
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                      : req.status === 'pending_approval'
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      : 'bg-red-500/10 text-red-400 border-red-500/30'
                  }`}>
                    <Truck className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold font-mono text-white">{req.plateNumber}</span>
                      <span className="text-xs text-slate-400 font-mono">({req.driverName})</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                        req.status === 'approved' || req.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : req.status === 'pending_approval'
                          ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          : 'bg-red-500/20 text-red-400 border border-red-500/30'
                      }`}>
                        {req.status === 'pending_approval'
                          ? (lang === 'th' ? 'รออนุมัติ' : 'Pending')
                          : req.status === 'approved'
                          ? (lang === 'th' ? 'อนุมัติแล้ว' : 'Approved')
                          : req.status === 'completed'
                          ? (lang === 'th' ? 'เสร็จสิ้น' : 'Completed')
                          : (lang === 'th' ? 'ปฏิเสธ' : 'Rejected')}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-1 flex-wrap">
                      <span>{lang === 'th' ? 'เวลาขอ:' : 'Requested:'} {req.timestamp}</span>
                      <span>•</span>
                      <span>{lang === 'th' ? 'เลขไมล์:' : 'Odo:'} {req.odometerKm.toLocaleString()} km</span>
                      {req.approvedBy && (
                        <>
                          <span>•</span>
                          <span>{lang === 'th' ? 'ผู้อนุมัติ:' : 'By:'} {req.approvedBy}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-800/80">
                  <div className="text-base sm:text-lg font-black font-mono text-amber-400">
                    {req.approvedLiters || req.requestedLiters} <span className="text-xs text-slate-400 font-normal">L</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {req.id}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};
