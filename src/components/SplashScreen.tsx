import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface SplashScreenProps {
  onComplete: () => void;
}

const FLOW_NODES = [
  { id: 'input', label: 'INPUT' },
  { id: 'verify', label: 'VERIFY' },
  { id: 'approve', label: 'APPROVE' },
  { id: 'execute', label: 'EXECUTE' },
  { id: 'record', label: 'RECORD' },
  { id: 'control', label: 'CONTROL' },
];

const CAPABILITY_TEXTS = [
  'INTELLIGENT CONTROL SYSTEM',
  'INTELLIGENT OPERATIONS',
  'REAL-TIME CONTROL',
  'SMART CONTROL SYSTEM',
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [activeNodeIndex, setActiveNodeIndex] = useState<number>(0);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [capabilityIndex, setCapabilityIndex] = useState<number>(0);

  // Capability text cycle
  useEffect(() => {
    const textInterval = setInterval(() => {
      setCapabilityIndex((prev) => (prev + 1) % CAPABILITY_TEXTS.length);
    }, 1800);
    return () => clearInterval(textInterval);
  }, []);

  // Realistic percentage & flow animation
  useEffect(() => {
    // Milestones: 0 -> 15 -> 32 -> 48 -> 67 -> 84 -> 100
    const steps = [
      { pct: 0, node: 0, delay: 100 },
      { pct: 15, node: 0, delay: 400 },
      { pct: 32, node: 1, delay: 850 },
      { pct: 48, node: 2, delay: 1400 },
      { pct: 67, node: 3, delay: 1950 },
      { pct: 84, node: 4, delay: 2500 },
      { pct: 100, node: 5, delay: 3100 },
    ];

    const timeouts: NodeJS.Timeout[] = [];

    steps.forEach(({ pct, node, delay }) => {
      const t = setTimeout(() => {
        setProgress(pct);
        setActiveNodeIndex(node);
        if (pct === 100) {
          setIsReady(true);
          // Transition to Workspace Selection after showing SYSTEM READY
          const finishTimer = setTimeout(() => {
            onComplete();
          }, 950);
          timeouts.push(finishTimer);
        }
      }, delay);
      timeouts.push(t);
    });

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      id="nc-splash-screen"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
      className="fixed inset-0 z-50 flex flex-col justify-between items-center bg-[#070B14] text-slate-100 p-6 select-none overflow-hidden"
    >
      {/* Subtle Background Radial Glow for Enterprise Depth */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute -bottom-40 left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-cyan-600/5 rounded-full blur-[100px]" />
        {/* Subtle Precision Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      {/* Top Header Placeholder for Visual Balance */}
      <div className="w-full pt-4 flex justify-between items-center text-xs tracking-widest font-mono text-slate-500 uppercase z-10">
        <span className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="text-slate-400 font-medium">CORE INITIALIZER</span>
        </span>
        <span className="text-[11px] text-slate-600 tracking-wider">REV 2026.4</span>
      </div>

      {/* CENTER CONTENT */}
      <div className="w-full max-w-xl flex flex-col items-center justify-center my-auto z-10 space-y-9">
        {/* BRAND LOGO & TITLE */}
        <div className="flex flex-col items-center text-center space-y-3">
          {/* Geometric Precision Industrial Control Emblem */}
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-900/90 border border-slate-700/80 shadow-2xl shadow-blue-950/40">
            <svg
              className="w-8 h-8 text-cyan-400"
              viewBox="0 0 32 32"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Outer Hexagon */}
              <polygon points="16,3 28,9.5 28,22.5 16,29 4,22.5 4,9.5" className="stroke-slate-600" />
              {/* Inner Precision Cross / Node Matrix */}
              <circle cx="16" cy="16" r="3.5" className="fill-cyan-400/20 stroke-cyan-400" />
              <line x1="16" y1="7" x2="16" y2="12.5" className="stroke-cyan-400/80" />
              <line x1="16" y1="19.5" x2="16" y2="25" className="stroke-cyan-400/80" />
              <line x1="7" y1="16" x2="12.5" y2="16" className="stroke-cyan-400/80" />
              <line x1="19.5" y1="16" x2="25" y2="16" className="stroke-cyan-400/80" />
            </svg>
            {/* Corner Precision Accents */}
            <span className="absolute -top-0.5 -left-0.5 w-1.5 h-1.5 border-t border-l border-cyan-400" />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 border-t border-r border-cyan-400" />
            <span className="absolute -bottom-0.5 -left-0.5 w-1.5 h-1.5 border-b border-l border-cyan-400" />
            <span className="absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 border-b border-r border-cyan-400" />
          </div>

          {/* BRAND NAME */}
          <div className="space-y-1">
            <h1
              id="brand-title"
              className="text-2xl sm:text-3xl font-black tracking-wider text-white font-mono uppercase"
            >
              NC SMART CONTROL
            </h1>
            <div className="text-[11px] uppercase tracking-[0.25em] text-slate-400 font-mono">
              INDUSTRIAL ENTERPRISE PLATFORM
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPACT ANIMATED SYSTEM FLOW                                              */}
        {/* INPUT → VERIFY → APPROVE → EXECUTE → RECORD → CONTROL                     */}
        {/* ========================================================================= */}
        <div className="w-full px-2 sm:px-4 py-3 bg-slate-900/60 rounded-2xl border border-slate-800/80 backdrop-blur-sm">
          <div className="flex items-center justify-between relative w-full">
            {FLOW_NODES.map((node, index) => {
              const isActive = index <= activeNodeIndex;
              const isCurrent = index === activeNodeIndex;
              const isLast = index === FLOW_NODES.length - 1;

              return (
                <React.Fragment key={node.id}>
                  {/* NODE ITEM */}
                  <div className="flex flex-col items-center relative z-10">
                    <div
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                        isCurrent
                          ? 'bg-cyan-500 text-slate-950 shadow-lg shadow-cyan-500/40 ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#070B14] scale-105'
                          : isActive
                          ? 'bg-slate-800 text-cyan-400 border border-cyan-500/50'
                          : 'bg-slate-900/90 text-slate-600 border border-slate-800'
                      }`}
                    >
                      {index + 1}
                    </div>
                    <span
                      className={`mt-1.5 text-[9px] sm:text-[10px] font-mono tracking-wider font-semibold transition-colors duration-300 ${
                        isCurrent
                          ? 'text-cyan-300'
                          : isActive
                          ? 'text-slate-300'
                          : 'text-slate-600'
                      }`}
                    >
                      {node.label}
                    </span>
                  </div>

                  {/* CONNECTING LINE WITH ANIMATED DATA LIGHT */}
                  {!isLast && (
                    <div className="flex-1 mx-1 sm:mx-1.5 h-[2px] bg-slate-800 relative overflow-hidden self-center mb-4">
                      {/* Active base line */}
                      {isActive && (
                        <div
                          className="absolute inset-y-0 left-0 bg-cyan-500/40 transition-all duration-500"
                          style={{
                            width: index < activeNodeIndex ? '100%' : '50%',
                          }}
                        />
                      )}

                      {/* Moving Data Light Beam */}
                      {index === activeNodeIndex && (
                        <motion.div
                          className="absolute top-0 bottom-0 w-4 bg-gradient-to-r from-transparent via-cyan-300 to-transparent shadow-[0_0_8px_#22d3ee]"
                          animate={{ x: ['-20%', '120%'] }}
                          transition={{
                            repeat: Infinity,
                            duration: 0.85,
                            ease: 'easeInOut',
                          }}
                        />
                      )}
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LOADING: SYSTEM INITIALIZATION & 0% -> 100% REAL PROGRESS                 */}
        {/* ========================================================================= */}
        <div className="w-full space-y-3">
          {/* Status Label & Animated Percentage */}
          <div className="flex justify-between items-baseline text-xs sm:text-sm font-mono">
            <div className="flex items-center gap-2">
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  isReady ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-cyan-400 animate-pulse'
                }`}
              />
              <span className="font-semibold text-slate-300 tracking-wider">
                {isReady ? 'SYSTEM READY' : 'SYSTEM INITIALIZATION'}
              </span>
            </div>

            <span
              id="progress-counter"
              className={`font-bold font-mono text-base sm:text-lg tabular-nums transition-colors duration-200 ${
                isReady ? 'text-emerald-400' : 'text-cyan-400'
              }`}
            >
              {progress}%
            </span>
          </div>

          {/* Smooth Progress Bar */}
          <div className="w-full h-2 bg-slate-900 rounded-full border border-slate-800 overflow-hidden relative">
            <motion.div
              className={`h-full rounded-full transition-all duration-300 ${
                isReady
                  ? 'bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]'
                  : 'bg-gradient-to-r from-blue-600 to-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.4)]'
              }`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* ======================================================================= */}
          {/* CAPABILITY TEXT: SHORT FADE TRANSITION                                  */}
          {/* ======================================================================= */}
          <div className="h-6 flex items-center justify-center overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={capabilityIndex}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="text-[11px] sm:text-xs font-mono tracking-widest text-slate-400 text-center uppercase font-medium"
              >
                {CAPABILITY_TEXTS[capabilityIndex]}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full pb-4 text-center z-10 space-y-1">
        <p className="text-[11px] font-mono text-slate-500">
          © 2026 NC Smart Control
        </p>
        <p className="text-[10px] font-mono text-slate-600 tracking-wider">
          All Rights Reserved.
        </p>
      </footer>
    </motion.div>
  );
};
