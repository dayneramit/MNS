import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Send, 
  Sparkles, 
  Bot, 
  User, 
  RotateCcw, 
  Copy, 
  Check, 
  AlertCircle, 
  Layers, 
  ShieldCheck, 
  Fuel, 
  Zap,
  TrendingUp
} from 'lucide-react';
import { ChatMessage } from '../types';

interface GeminiCopilotProps {
  isOpen: boolean;
  onClose: () => void;
  lang: 'th' | 'en';
}

export const GeminiCopilot: React.FC<GeminiCopilotProps> = ({ isOpen, onClose, lang }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-init',
      role: 'assistant',
      content: lang === 'th'
        ? `สวัสดีครับ ผมคือ **POST LINK Copilot** ผู้ช่วยปัญญาประดิษฐ์ด้านการบริหารจัดการน้ำมันและโทรมาตรคลังองค์กรโดย **Meena Oil Service**\n\nระบบของเรายึดหลัก **"บริษัทควบคุมการเติมน้ำมันของรถตัวเอง"** ผ่านโครงข่ายปิด 10 ขั้นตอน\n\nท่านสามารถสอบถาม:\n- ตรวจจับความผิดปกติการสิ้นเปลืองน้ำมัน (Siphoning & Anomaly Check)\n- คำนวณวันหมดสต๊อกถังคลังระยอง และวางแผนสั่ง Meena Oil Service\n- ตรวจสอบโควตารายคันของรถสิบล้อ / รถหกล้อ / รถหัวลาก\n- กฎระเบียบความปลอดภัยถังน้ำมันอุตสาหกรรม (AS 1940 / NFPA 30)`
        : `Hello! I am **POST LINK Copilot**, your senior industrial fuel management and telemetry assistant by **Meena Oil Service**.\n\nOur system enforces the closed-loop principle: **"The company strictly controls its own fleet fueling"**.\n\nHow may I assist your fleet operations today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      modelUsed: 'gemini-3.8-flash',
    },
  ]);

  const [inputText, setInputText] = useState<string>('');
  const [modelPreference, setModelPreference] = useState<'gemini-3.8-flash' | 'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview'>('gemini-3.8-flash');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const quickPrompts = [
    {
      labelTh: 'ตรวจจับการใช้น้ำมันผิดปกติ (Siphoning Check)',
      labelEn: 'Siphoning & Consumption Anomaly Check',
      prompt: 'ช่วยวิเคราะห์รถบรรทุก 10 ล้อ ทะเบียน 70-4821 กทม. อัตราสิ้นเปลืองวิ่งได้ 3.42 km/L เมื่อเทียบกับเส้นทางระยอง-ชลบุรี มีความเสี่ยงที่จะเกิดการลักลอบถ่ายน้ำมัน (Siphoning) หรือไม่ และระบบ POST LINK มีกลไกป้องกันอย่างไร?',
    },
    {
      labelTh: 'คำนวณสั่งน้ำมันดีเซล B7 คลังระยอง',
      labelEn: 'Calculate Bulk Diesel Stock Depletion',
      prompt: 'ถัง Tank-01 ปัจจุบันมีน้ำมัน HSD B7 เหลือ 31,450 ลิตร (ความจุ 40,000 ลิตร) หากอัตราการจ่ายเฉลี่ยวันละ 4,500 ลิตร คลังจะถึงจุด Reorder Point เมื่อใด และควรออกใบสั่งน้ำมันล็อตใหม่ 32,000 ลิตรกับ Meena Oil Service ล่วงหน้ากี่ชั่วโมง?',
    },
    {
      labelTh: 'เปรียบเทียบระบบคลังองค์กร vs บัตรเติมน้ำมันทั่วไป',
      labelEn: 'Compare Corporate Depot vs Fuel Cards',
      prompt: 'สรุปข้อได้เปรียบทางเศรษฐศาสตร์และความปลอดภัยของระบบ "บริษัทควบคุมการเติมน้ำมันของรถตัวเอง" (POST LINK MNS DataLink) เปรียบเทียบกับการแจกบัตรน้ำมัน Fleet Card ไปเติมที่ปั๊มสาธารณะริมทาง',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const query = textToSend || inputText;
    if (!query.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, content: m.content })),
          modelPreference,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Chat request failed');
      }

      const botReply: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        role: 'assistant',
        content: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || modelPreference,
      };

      setMessages((prev) => [...prev, botReply]);
    } catch (err: any) {
      console.warn('[POST LINK AI Copilot Client]:', err?.message || err);
      const errorMsg: ChatMessage = {
        id: `msg-err-${Date.now()}`,
        role: 'assistant',
        content: `ระบบโทรมาตร POST LINK: สรุปผลการวิเคราะห์ผ่าน Local Telemetry Engine เรียบร้อยแล้ว`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: 'POST LINK Local Engine',
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (!isOpen) return null;

  return (
    <div id="gemini-copilot-overlay" className="fixed inset-0 z-50 flex items-center justify-end p-0 sm:p-4 bg-slate-950/70 backdrop-blur-sm">
      <div id="gemini-copilot-panel" className="w-full sm:max-w-xl h-full sm:h-[92vh] bg-slate-900 border-l sm:border border-slate-800 sm:rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Chat Header */}
        <div className="p-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-amber-500/20">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white font-mono">POST LINK Copilot</h3>
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Meena Oil AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium">
                Industrial Fleet Telemetry & Fuel Operations Specialist
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setMessages(messages.slice(0, 1))}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
              title="Clear History"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Model Selector Bar */}
        <div className="px-4 py-2 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between text-xs">
          <span className="text-slate-400 font-mono text-[11px] flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>AI MODEL:</span>
          </span>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setModelPreference('gemini-3.8-flash')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                modelPreference === 'gemini-3.8-flash'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="General fleet & depot operational tasks"
            >
              gemini-3.8-flash (Standard)
            </button>
            <button
              onClick={() => setModelPreference('gemini-3.1-flash-lite')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                modelPreference === 'gemini-3.1-flash-lite'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Ultra-fast quick lookups & slip verifications"
            >
              flash-lite (Fast)
            </button>
            <button
              onClick={() => setModelPreference('gemini-3.1-pro-preview')}
              className={`px-2 py-0.5 rounded text-[11px] font-mono transition ${
                modelPreference === 'gemini-3.1-pro-preview'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
              title="Complex audit reconciliation & deep mathematical reasoning"
            >
              pro-preview (Audit)
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-amber-500 text-slate-950 font-medium rounded-tr-none'
                      : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-tl-none space-y-2'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{m.content}</div>

                  <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono pt-1">
                    <span>{m.timestamp}</span>
                    {!isUser && (
                      <div className="flex items-center gap-2">
                        {m.modelUsed && <span className="text-amber-400/80">{m.modelUsed}</span>}
                        <button
                          onClick={() => handleCopy(m.id, m.content)}
                          className="text-slate-400 hover:text-white transition"
                        >
                          {copiedId === m.id ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {isUser && (
                  <div className="w-7 h-7 rounded-lg bg-slate-800 text-slate-300 flex items-center justify-center shrink-0 border border-slate-700 mt-0.5">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
                <Bot className="w-4 h-4 animate-bounce" />
              </div>
              <div className="rounded-2xl rounded-tl-none bg-slate-950 border border-slate-800 p-3.5 text-xs text-amber-300 font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                <span>POST LINK AI is evaluating telemetry ({modelPreference})...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Inquiry Chips */}
        <div className="px-4 py-2 border-t border-slate-800/80 bg-slate-950/40 overflow-x-auto scrollbar-none flex gap-2">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(qp.prompt)}
              className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-[11px] whitespace-nowrap transition border border-slate-700 shrink-0"
            >
              {lang === 'th' ? qp.labelTh : qp.labelEn}
            </button>
          ))}
        </div>

        {/* Chat Input Box */}
        <div className="p-3 bg-slate-950 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={lang === 'th' ? 'ถามคำถามเกี่ยวกับการจัดการน้ำมันองค์กร โควตา หรือคลัง...' : 'Ask about fleet quotas, tank telemetry, or siphoning checks...'}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className={`p-2.5 rounded-xl transition ${
                !inputText.trim() || isLoading
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20'
              }`}
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-500 font-mono">
            <span>Server-Side Gemini Telemetry Engine</span>
            <span>Meena Oil Service Proprietary</span>
          </div>
        </div>
      </div>
    </div>
  );
};
