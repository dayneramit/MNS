import React, { useState } from 'react';
import { WORKFLOW_SERIES, WorkflowGalleryItem } from '../data/workflowSeries';
import { 
  Play, 
  ChevronRight, 
  ShieldCheck, 
  Cpu, 
  Zap, 
  Layers, 
  CheckCircle2, 
  ExternalLink,
  Fuel,
  QrCode,
  Truck,
  Building2,
  FileSpreadsheet
} from 'lucide-react';

interface WorkflowSeriesShowcaseProps {
  lang: 'th' | 'en';
  onSimulate: () => void;
}

export const WorkflowSeriesShowcase: React.FC<WorkflowSeriesShowcaseProps> = ({ lang, onSimulate }) => {
  const [activeItemIndex, setActiveItemIndex] = useState<number>(1); // Default to QR step (step 2)
  const activeItem = WORKFLOW_SERIES[activeItemIndex];

  return (
    <div id="workflow-series-showcase" className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 sm:p-6 shadow-2xl relative overflow-hidden space-y-6">
      {/* Background grid accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b08_1px,transparent_1px),linear-gradient(to_bottom,#1e293b08_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800 relative z-10">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>POST LINK OPERATIONAL WORKFLOW SERIES</span>
            </span>
            <span className="text-xs text-slate-400 font-mono">
              5-STAGE VISUAL EXPLANATION
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{lang === 'th' ? 'ซีรีส์ภาพจำลองกระบวนการควบคุม' : 'Visual Illustration Series:'}</span>
            <span className="text-amber-400 font-mono">
              {lang === 'th' ? 'ระบบจ่ายน้ำมันรถกองเรือด้วย QR Code' : 'QR Fuel Management Lifecycle'}
            </span>
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            {lang === 'th'
              ? 'ถ่ายทอดบริบทคลังน้ำมันในโรงงานและนิคมอุตสาหกรรมจริง (ไม่ใช่ปั๊มน้ำมันสาธารณะ): บริษัทควบคุมการเติมน้ำมันของรถตัวเอง ตั้งแต่รถเข้าเกต จนถึงการตัดสต๊อกและรายงานออดิต 0%'
              : 'Photorealistic industrial illustrations depicting the closed-loop corporate fleet fueling workflow in a private logistics depot. Strict corporate control, zero public retail elements.'}
          </p>
        </div>

        <button
          id="btn-simulate-series-flow"
          onClick={onSimulate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm transition shadow-lg shadow-emerald-900/40 whitespace-nowrap self-start md:self-center ring-1 ring-emerald-400/40"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{lang === 'th' ? 'ทดสอบจำลองขั้นตอนจริง' : 'Simulate Fueling Now'}</span>
        </button>
      </div>

      {/* Main Focus: Spotlight Stage Hero Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch relative z-10">
        {/* Left: Rich Industrial Photographic Visual */}
        <div className="lg:col-span-7 rounded-xl overflow-hidden border border-slate-800 bg-slate-950 relative group shadow-xl flex flex-col justify-end min-h-[340px] sm:min-h-[420px]">
          <img
            src={activeItem.imageUrl}
            alt={activeItem.titleEn}
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover object-center transition duration-700 group-hover:scale-105 brightness-95 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top Overlays */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
            <span className="px-3 py-1 rounded-md bg-slate-900/90 text-amber-400 font-mono text-xs font-bold border border-amber-500/40 backdrop-blur shadow-md">
              STAGE 0{activeItem.stepNumber} • {activeItem.stageCode}
            </span>
            <span className="px-2.5 py-1 rounded-md bg-slate-900/90 text-emerald-400 font-mono text-[11px] font-semibold border border-emerald-500/30 backdrop-blur">
              {activeItem.technicalSpecs.metric}
            </span>
          </div>

          {/* Bottom Card Caption */}
          <div className="relative p-5 sm:p-6 space-y-2">
            <span className="text-xs font-bold text-amber-400 tracking-wider uppercase font-mono">
              {lang === 'th' ? activeItem.subTh : activeItem.subEn}
            </span>
            <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
              {lang === 'th' ? activeItem.titleTh : activeItem.titleEn}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              {lang === 'th' ? activeItem.detailTh : activeItem.detailEn}
            </p>
          </div>
        </div>

        {/* Right: Technical Specs & Workflow Narrative */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4 bg-slate-950/70 p-5 rounded-xl border border-slate-800">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider font-mono mb-3">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>{lang === 'th' ? 'สถาปัตยกรรมเทคนิค & ความปลอดภัย' : 'Technical & Security Architecture'}</span>
            </div>

            <div className="space-y-3">
              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
                  {lang === 'th' ? 'โปรโตคอล / การสื่อสาร' : 'Data Protocol / Communication'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white font-mono mt-0.5 block">
                  {activeItem.technicalSpecs.protocol}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block font-mono">
                  {lang === 'th' ? 'อุปกรณ์ฮาร์ดแวร์ประจำจุด' : 'Depot Hardware & Sensors'}
                </span>
                <span className="text-xs sm:text-sm font-semibold text-white mt-0.5 block">
                  {activeItem.technicalSpecs.hardware}
                </span>
              </div>

              <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider block font-mono flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{lang === 'th' ? 'ระดับการควบคุมความปลอดภัย' : 'Security Level & Anti-Tamper'}</span>
                </span>
                <span className="text-xs sm:text-sm font-semibold text-slate-200 mt-0.5 block">
                  {activeItem.technicalSpecs.securityLevel}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Navigation Steps Controls */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
            <span className="text-xs text-slate-400 font-mono">
              {activeItemIndex + 1} / {WORKFLOW_SERIES.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setActiveItemIndex((prev) => (prev > 0 ? prev - 1 : WORKFLOW_SERIES.length - 1))}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-medium transition"
              >
                {lang === 'th' ? 'ก่อนหน้า' : 'Previous'}
              </button>
              <button
                onClick={() => setActiveItemIndex((prev) => (prev < WORKFLOW_SERIES.length - 1 ? prev + 1 : 0))}
                className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-xs text-slate-950 font-bold transition shadow-sm"
              >
                {lang === 'th' ? 'ขั้นตอนถัดไป' : 'Next Stage'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Card Stage Gallery Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2 relative z-10">
        {WORKFLOW_SERIES.map((item, idx) => {
          const isSelected = activeItemIndex === idx;
          return (
            <button
              key={item.id}
              id={`wf-card-${item.id}`}
              onClick={() => setActiveItemIndex(idx)}
              className={`rounded-xl p-2.5 text-left transition border group relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'bg-amber-500/10 border-amber-400 ring-2 ring-amber-400/40 shadow-lg'
                  : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              {/* Thumbnail image */}
              <div className="w-full h-24 rounded-lg overflow-hidden relative mb-2.5">
                <img
                  src={item.imageUrl}
                  alt={item.titleEn}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-slate-950/80 text-[10px] font-mono font-bold text-amber-400 border border-slate-800">
                  #{item.stepNumber}
                </div>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase text-slate-400 block font-bold">
                  {item.stageCode}
                </span>
                <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-amber-300 transition">
                  {lang === 'th' ? item.titleTh : item.titleEn}
                </p>
                <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">
                  {lang === 'th' ? item.subTh : item.subEn}
                </p>
              </div>

              <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>{isSelected ? (lang === 'th' ? 'กำลังดู' : 'Viewing') : (lang === 'th' ? 'คลิกดู' : 'Select')}</span>
                <ChevronRight className={`w-3 h-3 ${isSelected ? 'text-amber-400' : 'text-slate-600'}`} />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
