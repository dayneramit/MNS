import React, { useState } from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  RefreshCw, 
  Download, 
  Layers, 
  Sliders, 
  Check, 
  AlertCircle,
  Eye,
  Camera,
  ShieldCheck,
  Send
} from 'lucide-react';
import { DepotAsset } from '../types';

interface IndustrialImageStudioProps {
  lang: 'th' | 'en';
  assets: DepotAsset[];
  onAddAsset: (newAsset: DepotAsset) => void;
}

export const IndustrialImageStudio: React.FC<IndustrialImageStudioProps> = ({
  lang,
  assets,
  onAddAsset,
}) => {
  const [promptInput, setPromptInput] = useState<string>(
    'A private company fuel depot in an industrial estate in Thailand with a Thai 10-wheel logistics truck parked under an industrial steel canopy, professional Thai driver scanning a QR authorization pass.'
  );
  const [selectedAssetForEdit, setSelectedAssetForEdit] = useState<DepotAsset | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const promptPresets = [
    {
      titleEn: '10-Wheel Fleet Truck Fueling Bay',
      titleTh: 'จุดเติมน้ำมันรถสิบล้อกองเรือโรงงาน',
      prompt: 'Photorealistic industrial corporate fuel depot in an industrial estate in Thailand. A white 10-wheel fleet truck is parked under a rugged industrial steel canopy receiving diesel fuel. A Thai driver in yellow-green safety vest and hardhat holds a mobile QR tablet. Factory warehouse and industrial storage tanks in the background. Strictly private corporate facility, no consumer retail gas station.',
    },
    {
      titleEn: 'Industrial Bulk Tanks & Safety Bund',
      titleTh: 'ถังเก็บน้ำมันขนาดใหญ่และเขื่อนกั้นนิรภัย',
      prompt: 'Photorealistic industrial facility photo of above-ground cylindrical diesel bulk storage tanks with secondary concrete containment bund, digital level transmitters, yellow safety railings, and MNS DataLink telemetry cabinet at a factory depot in Rayong. Professional, secure corporate facility.',
    },
    {
      titleEn: 'Optical QR Dispenser Terminal',
      titleTh: 'หัวจ่ายน้ำมันอุตสาหกรรมพร้อมเครื่องสแกน QR',
      prompt: 'Close-up photorealistic shot of an industrial heavy-duty fuel dispenser terminal at a private corporate fleet depot in Thailand. Dual digital flow rate screens, glowing optical QR authorization scanner, heavy-duty black fuel hose, and industrial emergency stop button.',
    },
    {
      titleEn: 'Depot Night Operations & Safety Lighting',
      titleTh: 'คลังน้ำมันองค์กรช่วงกะกลางคืนพร้อมไฟส่องสว่าง',
      prompt: 'Private corporate fleet fuel station inside a logistics industrial estate in Thailand at dusk. Industrial floodlights illuminate a 10-wheel logistics truck at the dispenser bay. Thai technician in reflective safety gear inspecting the control cabinet.',
    },
  ];

  const handleGenerate = async () => {
    if (!promptInput.trim()) return;
    setIsGenerating(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptInput,
          mode: selectedAssetForEdit ? 'edit' : 'create',
          base64Image: selectedAssetForEdit ? selectedAssetForEdit.imageUrl : undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate image');
      }

      if (data.imageUrl) {
        const newDepotAsset: DepotAsset = {
          id: `ASSET-${Date.now().toString().slice(-6)}`,
          title: selectedAssetForEdit ? `Edited: ${selectedAssetForEdit.title}` : 'AI Generated Industrial Depot Scene',
          category: 'generated',
          imageUrl: data.imageUrl,
          description: promptInput,
          timestamp: new Date().toISOString().replace('T', ' ').slice(0, 16),
          location: 'Rayong / Eastern Industrial Fleet Yard',
        };
        onAddAsset(newDepotAsset);
        setPreviewImage(data.imageUrl);
        setSelectedAssetForEdit(null);
      }
    } catch (err: any) {
      console.warn('[POST LINK Image Studio]:', err?.message || err);
      setErrorMsg(err.message || 'Image generation notice');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="industrial-image-studio" className="space-y-6">
      {/* Studio Header */}
      <div className="bg-slate-900/90 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded text-xs font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>GEMINI IMAGE STUDIO</span>
            </span>
            <span className="text-xs font-mono text-slate-400">
              INDUSTRIAL DEPOT ART DIRECTION ENFORCED
            </span>
          </div>
          <h3 className="text-xl font-black text-white font-mono">
            {lang === 'th' ? 'สตูดิโอสร้างและปรับแต่งภาพคลังน้ำมันอุตสาหกรรม' : 'Industrial Depot Image Creation & Editing Studio'}
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {lang === 'th'
              ? 'ระบบสร้างภาพด้วย AI โดยยึดทัศนศิลป์คลังน้ำมันองค์กรในนิคมอุตสาหกรรมไทย (ห้ามใช้ภาพปั๊มน้ำมันริมทางสาธารณะหรือร้านสะดวกซื้อ) เพื่อใช้เป็นหลักฐานตรวจสอบจุดเติมน้ำมัน'
              : 'Create and edit corporate fleet depot imagery using text prompts with Gemini. Strictly renders industrial estate fuel yards, Thai commercial trucks, and safety equipment.'}
          </p>
        </div>

        <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300">
          Model: <strong className="text-amber-400">gemini-3.1-flash-image</strong>
        </div>
      </div>

      {/* Generation & Edit Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Prompt Controls Column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                <Camera className="w-4 h-4 text-amber-400" />
                <span>{lang === 'th' ? 'คำสั่งข้อความ (Text Prompt):' : 'Industrial Prompt Input:'}</span>
              </label>

              {selectedAssetForEdit && (
                <button
                  onClick={() => setSelectedAssetForEdit(null)}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1"
                >
                  <span>{lang === 'th' ? 'ยกเลิกโหมดแก้ไขรูป' : 'Clear Edit Reference'}</span>
                </button>
              )}
            </div>

            {selectedAssetForEdit && (
              <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
                <img
                  src={selectedAssetForEdit.imageUrl}
                  alt="Reference"
                  referrerPolicy="no-referrer"
                  className="w-16 h-12 rounded object-cover border border-amber-500/40"
                />
                <div className="text-xs">
                  <span className="font-bold text-amber-300 block">
                    {lang === 'th' ? 'โหมดแก้ไขรูปอ้างอิง:' : 'Editing Reference Image:'}
                  </span>
                  <span className="text-slate-300 text-[11px]">{selectedAssetForEdit.title}</span>
                </div>
              </div>
            )}

            <textarea
              rows={4}
              value={promptInput}
              onChange={(e) => setPromptInput(e.target.value)}
              placeholder={lang === 'th' ? 'ระบุรายละเอียดคลังน้ำมันในโรงงาน, รถบรรทุก 10 ล้อ, ถังเก็บน้ำมัน...' : 'Describe the industrial corporate depot scene...'}
              className="w-full p-3 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs sm:text-sm placeholder-slate-500 focus:border-amber-500 focus:outline-none"
            />

            {/* Industrial Prompt Presets */}
            <div>
              <span className="text-[11px] font-mono text-slate-400 block mb-2 uppercase">
                {lang === 'th' ? 'คำสั่งสำเร็จรูปตามข้อกำหนดทัศนศิลป์อุตสาหกรรม:' : 'Standard Industrial Art Presets:'}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {promptPresets.map((preset, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPromptInput(preset.prompt)}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 text-left transition text-xs group"
                  >
                    <span className="font-bold text-slate-300 group-hover:text-amber-400 block">
                      {lang === 'th' ? preset.titleTh : preset.titleEn}
                    </span>
                    <span className="text-[10px] text-slate-500 line-clamp-1 mt-0.5">
                      {preset.prompt}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-rose-500/15 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className={`w-full py-3 rounded-xl font-black text-xs sm:text-sm tracking-wide transition shadow-xl flex items-center justify-center gap-2 ${
                isGenerating
                  ? 'bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 shadow-amber-500/20'
              }`}
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{lang === 'th' ? 'กำลังเรนเดอร์ภาพคลังน้ำมันด้วย Gemini...' : 'Rendering Industrial Depot Asset...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {selectedAssetForEdit
                      ? (lang === 'th' ? 'ปรับแต่งภาพตามคำสั่ง' : 'Edit Selected Depot Image')
                      : (lang === 'th' ? 'สร้างภาพคลังอุตสาหกรรมด้วย AI' : 'Generate Industrial Scene')}
                  </span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Real-time Result / Preview Column */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-mono flex items-center justify-between">
              <span>{lang === 'th' ? 'ภาพพรีวิวผลลัพธ์' : 'Studio Preview Canvas'}</span>
              <span className="text-[10px] text-amber-400 font-normal">16:9 • 1K RESOLUTION</span>
            </h4>

            <div className="relative aspect-video rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center">
              {previewImage || assets[0]?.imageUrl ? (
                <img
                  src={previewImage || assets[0]?.imageUrl}
                  alt="Industrial Asset Preview"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-6 space-y-2">
                  <ImageIcon className="w-10 h-10 text-slate-700 mx-auto" />
                  <p className="text-xs text-slate-500">
                    No image generated yet. Click generate above.
                  </p>
                </div>
              )}

              {isGenerating && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
                  <p className="text-xs font-mono text-amber-300 font-bold">
                    GEMINI-3.1-FLASH-IMAGE PROCESSING
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Applying industrial estate context, Thai commercial vehicles, and safety equipment rules...
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
              <span>POST LINK Visual Standard</span>
              <span className="text-emerald-400 font-mono">100% PRIVATE INDUSTRIAL</span>
            </div>
          </div>
        </div>
      </div>

      {/* Depot Imagery Asset Gallery */}
      <div className="rounded-xl bg-slate-900/90 border border-slate-800 p-5 shadow-lg space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-base font-bold text-white font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>{lang === 'th' ? 'คลังภาพถ่ายและแบบจำลองคลังน้ำมันองค์กร' : 'Corporate Depot Verified Asset Library'}</span>
            </h4>
            <p className="text-xs text-slate-400 mt-0.5">
              {lang === 'th' ? 'ภาพคลังจริงและภาพจำลองผ่านข้อกำหนดทัศนศิลป์' : 'All assets strictly comply with mandatory corporate fuel facility art direction.'}
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {assets.length} ASSETS LOGGED
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {assets.map((asset) => (
            <div
              key={asset.id}
              className="rounded-xl bg-slate-950 border border-slate-800 overflow-hidden group hover:border-amber-500/50 transition flex flex-col justify-between"
            >
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={asset.imageUrl}
                  alt={asset.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-500 brightness-95"
                />
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-900/90 text-[10px] font-mono text-amber-400 border border-slate-700 backdrop-blur">
                  {asset.location}
                </div>
              </div>

              <div className="p-4 space-y-2 flex-1 flex flex-col justify-between">
                <div>
                  <h5 className="text-xs font-bold text-white line-clamp-1">{asset.title}</h5>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{asset.description}</p>
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-slate-500">{asset.timestamp}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewImage(asset.imageUrl)}
                      className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition"
                      title="View Full Preview"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedAssetForEdit(asset);
                        setPromptInput(`Add technical inspection overlay and safety barrier around ${asset.title}`);
                        window.scrollTo({ top: 100, behavior: 'smooth' });
                      }}
                      className="px-2 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 text-xs font-medium border border-amber-500/30 transition flex items-center gap-1"
                    >
                      <Sliders className="w-3 h-3" />
                      <span>{lang === 'th' ? 'แก้ไขรูปนี้' : 'Edit'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
