import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '20mb' }));

// Lazy Gemini client helper
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('GEMINI_API_KEY environment variable is required');
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// Fallback Industrial Telemetry Engine for POST LINK
function generateIndustrialTelemetryFallback(messages: Array<{ role: string; content: string }>): string {
  const lastMessage = messages[messages.length - 1]?.content || '';
  const query = lastMessage.toLowerCase();

  // 1. Siphoning & Fuel Anomaly Analysis
  if (query.includes('siphoning') || query.includes('ลักลอบ') || query.includes('ดูดน้ำมัน') || query.includes('สิ้นเปลือง') || query.includes('km/l')) {
    return `### ผลการวิเคราะห์โทรมาตร POST LINK: ตรวจสอบความเสี่ยงการลักลอบถ่ายน้ำมัน (Siphoning Risk Analysis)

**1. การประเมินข้อมูลรถบรรทุก 10 ล้อ (เช่น ทะเบียน 70-4821 กทม.):**
- **อัตราสิ้นเปลืองปัจจุบัน:** 3.42 km/L บนเส้นทางระยอง - ชลบุรี (ทางหลวงสาย 36 / มอเตอร์เวย์ M7)
- **ค่าเฉลี่ยมาตรฐาน (Fleet Benchmark):** รถ 10 ล้อบรรทุกเต็มพิกัดควรอยู่ที่ **3.80 - 4.15 km/L**
- **ค่าความแปรปรวน (Variance):** ต่ำกว่ามาตรฐานประมาณ **-12.8%** จัดอยู่ในเกณฑ์ **"เฝ้าระวังระดับสีส้ม (Yellow-Orange Alert)"**

**2. สาเหตุทางเทคนิคที่เป็นไปได้:**
- การเดินเบาเครื่องยนต์เกินกำหนด (Excessive Idling > 45 นาที ที่จุดโหลดสินค้า)
- สภาพยางหรือแรงดันลมยางต่ำกว่าเกณฑ์ 110 PSI
- **ความเสี่ยงการลักลอบถ่ายน้ำมัน (Siphoning / Unauthorized Transfer)** ในช่วงจอดพักนอกพื้นที่ควบคุม

**3. กลไกป้องกันแบบ Closed-Loop ของ POST LINK MNS DataLink:**
1. **Dynamic QR Tokenization:** วาล์วหัวจ่ายจะปลดล็อกเฉพาะปริมาณลิตรที่ศูนย์ Dispatch อนุมัติตรงกับ Odometer และโควตารายวัน
2. **Dual-Pulse Flowmeter Reconciliation:** บันทึกปริมาตรการจ่ายแม่นยำระดับ ±0.25% เทียบกับระดับลูกลอยถังน้ำมันรถทันทีหลังเติมเสร็จ
3. **Automated Anomaly Flagging:** หากระยะทางวิ่งจริงไม่สัมพันธ์กับน้ำมันที่เติม ระบบจะระงับ (Lock) การขอ QR ในรอบถัดไปอัตโนมัติจนกว่า Dispatcher จะตรวจสอบ`;
  }

  // 2. Bulk Tank Depletion & Meena Oil Service Reorder Calculation
  if (query.includes('ถัง') || query.includes('tank') || query.includes('reorder') || query.includes('สั่งน้ำมัน') || query.includes('สต๊อก') || query.includes('b7')) {
    return `### รายงานโทรมาตรและคำนวณจุดสั่งซื้อน้ำมันคลังองค์กร (Bulk Tank Reorder Telemetry)

**1. สถานะถังน้ำมันหลัก Tank-01 (High-Speed Diesel B7):**
- **ความจุปกติ (Nominal Capacity):** 40,000 ลิตร
- **ปริมาณคงเหลือปัจจุบัน:** 31,450 ลิตร (78.6% Capacity)
- **พื้นที่ว่างรองรับได้ (Ullage):** 8,550 ลิตร
- **อัตราการจ่ายเฉลี่ย (Burn Rate):** 4,500 ลิตร/วัน

**2. การคาดการณ์ระยะเวลาหมดสต๊อก (Depletion Forecast):**
- **ระดับปลอดภัยขั้นต่ำ (Safety Buffer):** 7,000 ลิตร (สำรองกรณีฉุกเฉิน 1.5 วัน)
- **จุดสั่งซื้อที่แนะนำ (Reorder Point - ROP):** **12,000 ลิตร**
- **เวลาคาดการณ์ถึงจุด ROP:** อีกประมาณ **4.3 วัน (ประมาณ 103 ชั่วโมงทำการ)**

**3. แผนการสั่งซื้อกับ Meena Oil Service:**
- **ขนาดเที่ยวส่งมาตรฐาน:** รถบรรทุกน้ำมันกึ่งพ่วง 16,000 ลิตร หรือ 32,000 ลิตร (Compartment Compartmentalized)
- **Lead Time ขนส่งจากคลังมาบตาพุด/ศรีราชา:** 12 - 18 ชั่วโมง
- **คำแนะนำปฏิบัติการ:** ออกใบขอสั่งน้ำมัน (Purchase Order) เมื่อระดับน้ำมันลดถึง **13,500 ลิตร** เพื่อให้รถขนส่งน้ำมันเข้าเติมได้ 24,000 ลิตรพอดีโดยไม่ล้นถัง`;
  }

  // 3. Corporate Depot vs Fleet Cards
  if (query.includes('บัตร') || query.includes('fleet card') || query.includes('เปรียบเทียบ') || query.includes('ปั๊ม') || query.includes('ประหยัด')) {
    return `### เปรียบเทียบความคุ้มค่า: คลังน้ำมันองค์กร (POST LINK) vs บัตรเติมน้ำมันภายนอก (Fleet Cards)

| มิติการควบคุม | คลังน้ำมันองค์กร (POST LINK MNS DataLink) | บัตรเติมน้ำมันภายนอก (Fleet Card ริมทาง) |
| :--- | :--- | :--- |
| **โครงสร้างราคา** | **ราคาส่งโรงกลั่น/คลังส่งตรง (Wholesale)** ประหยัด 1.20 - 2.50 บ./ลิตร | ราคาขายปลีกปั๊มริมทาง รวมค่าการตลาดปั๊ม |
| **การควบคุมการเติม** | **วาล์ว Solenoid ปลดล็อกด้วย QR อัตโนมัติ** เติมได้เฉพาะรถบริษัท | เสี่ยงนำบัตรไปรูดเติมรถส่วนตัวหรือซื้อสินค้าอื่น |
| **ความถูกต้อง Odometer** | คนขับต้องถ่ายรูปและกรอกเลขไมล์ ยืนยันพิกัด GPS ณ ตู้เติม | คนขับแจ้งเลขไมล์ปากเปล่ากับพนักงานปั๊ม (คลาดเคลื่อนสูง) |
| **การตรวจสอบสต๊อก** | **Real-Time Zero-Loss Audit** ตรวจวัดทุกนาทีผ่านเซนเซอร์ | รอใบเสร็จ/รอบบิลสรุปสิ้นเดือน 30-45 วัน |
| **ความปลอดภัย** | มาตรฐานอุตสาหกรรม คอนกรีต Safety Bund, Earth Grounding | ปั๊มสาธารณะปะปนกับผู้ใช้รถทั่วไป |

**สรุปผลทางเศรษฐศาสตร์:** สำหรับกองเรือขนาด 20 คันขึ้นไป ระบบคลังภายในช่วยลดต้นทุนน้ำมันรวมได้ **8 - 14% ต่อปี** พร้อมกำจัดการทุจริตน้ำมัน 100%`;
  }

  // 4. Default Comprehensive Response
  return `### ระบบบริหารจัดการน้ำมันกองเรือองค์กร POST LINK by Meena Oil Service

ขอต้อนรับสู่ระบบโทรมาตรและควบคุมการจ่ายน้ำมันองค์กร **"บริษัทควบคุมการเติมน้ำมันของรถตัวเอง"** 

**สรุปสถานะการทำงานปัจจุบัน:**
1. **ระบบคลังน้ำมัน:**
   - ถังเก็บ Tank-01 (HSD B7) และ Tank-02 (HSD B20) อยู่ในสถานะสมดุล ปริมาณรวมกว่า 48,000 ลิตร
   - เซนเซอร์ลูกลอยดิจิทัลและระบบเตือนน้ำก้นถัง (Water Bottom Alert) ทำงานปกติ
2. **ระบบหัวจ่ายและวาล์วโซลินอยด์ (Solenoid Interlock):**
   - ตู้จ่าย Bay-01 และ Bay-02 ล็อกแน่นหนา พร้อมปลดล็อกเฉพาะคำขอที่ผ่านการอนุมัติ QR Code จากศูนย์ควบคุม Dispatch
3. **โควตากองเรือประจำวัน:**
   - รถ 6 ล้อ: โควตาสูงสุด 160 ลิตร/วัน
   - รถ 10 ล้อ: โควตาสูงสุด 260 ลิตร/วัน
   - รถหัวลากกึ่งพ่วง: โควตาสูงสุด 350 ลิตร/วัน

หากต้องการให้วิเคราะห์ข้อมูลเฉพาะเจาะจง เช่น เลขทะเบียนรถ, การคำนวณระยะทางต่อลิตร (km/L) หรือการออกรายงานสรุปกะ สามารถแจ้งรายละเอียดได้ทันทีครับ`;
}

// Model selection and fallback industrial imagery
const PRESET_INDUSTRIAL_IMAGES = [
  {
    keywords: ['arrival', 'gate', 'security', 'barrier', 'truck'],
    url: '/src/assets/images/workflow_truck_arrival_1789660135332.jpg',
  },
  {
    keywords: ['qr', 'driver', 'request', 'phone', 'pass', 'scan'],
    url: '/src/assets/images/workflow_driver_qr_1789660168548.jpg',
  },
  {
    keywords: ['dispatch', 'approval', 'remote', 'control', 'supervisor'],
    url: '/src/assets/images/workflow_dispatch_appr_1789660193381.jpg',
  },
  {
    keywords: ['dispenser', 'nozzle', 'bay', 'meter', 'fueling', 'hose'],
    url: '/src/assets/images/workflow_dispense_fuel_1789660217288.jpg',
  },
  {
    keywords: ['tank', 'storage', 'bund', 'bulk', 'cylinder', 'diesel'],
    url: '/src/assets/images/depot_storage_tank_1789659698292.jpg',
  },
  {
    keywords: ['report', 'data', 'audit', 'stock', 'screen'],
    url: '/src/assets/images/workflow_data_report_1789660233509.jpg',
  },
];

function getMatchingIndustrialImage(prompt: string): string {
  const p = prompt.toLowerCase();
  for (const item of PRESET_INDUSTRIAL_IMAGES) {
    if (item.keywords.some((k) => p.includes(k))) {
      return item.url;
    }
  }
  return '/src/assets/images/onboarding_hero_1789660102836.jpg';
}

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'POST LINK Industrial Fuel Telemetry Server' });
});

// Chat endpoint with Gemini and local telemetry fallback
app.post('/api/chat', async (req, res) => {
  const { messages, modelPreference } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages array is required' });
  }

  // Model selection based on user requirements:
  // - gemini-3.1-pro-preview for complex tasks
  // - gemini-3.8-flash for general tasks
  // - gemini-3.1-flash-lite for fast tasks
  let modelName = 'gemini-3.8-flash';
  if (modelPreference === 'complex' || modelPreference === 'gemini-3.1-pro-preview') {
    modelName = 'gemini-3.1-pro-preview';
  } else if (modelPreference === 'fast' || modelPreference === 'gemini-3.1-flash-lite') {
    modelName = 'gemini-3.1-flash-lite';
  }

  const systemInstruction = `You are "POST LINK Copilot", the Senior Industrial Fuel Telemetry & Operations Assistant for POST LINK / MNS DataLink by Meena Oil Service.

CONTEXT & BRAND IDENTITY:
- POST LINK is an INDUSTRIAL / CORPORATE FUEL MANAGEMENT SYSTEM in Thailand ("ระบบควบคุมการเติมน้ำมันของรถตัวเองสำหรับองค์กร").
- Operated exclusively for private company-owned fuel stations, industrial estate depots, factory fuel yards, logistics hubs, and transportation company fleets (e.g., in Rayong, Chonburi, Saraburi, Bangna).
- It is strictly NOT a consumer or retail gas station (never associate with retail brands like PTT, Shell, PT, Esso, Bangchak).
- Core visual and operational loop:
  COMPANY -> FLEET -> DRIVER -> QR -> REQUEST -> APPROVAL -> DISPENSER -> FUEL -> DATA -> STOCK -> REPORT

CAPABILITIES:
1. Fleet fuel quota optimization (liter limits per vehicle class: 6-wheel, 10-wheel, tractor trailers).
2. Siphoning & fuel anomaly detection (comparing GPS odometer, engine hours, and flow-meter liters against expected km/L).
3. Industrial bulk tank telemetry analysis (High-Speed Diesel B7 / B20 stock, ullage, density, temperature, water bottom, replenishment scheduling by Meena Oil Service).
4. Real-time remote QR authorization workflow and digital dispenser interlocks.
5. Reconciliation audit reports for shift changeover and zero-loss compliance.

COMMUNICATION STYLE:
- Professional, technical, authoritative yet helpful.
- Fluent in both Thai (default for Thai fleet queries) and English.
- Use clear bullet points and quantitative metrics (liters, km/L, THB savings, tank ullage %).`;

  // Try calling Gemini API; if project access is restricted or error occurs, fall back seamlessly
  try {
    const ai = getGenAI();

    // Convert message history to format expected by @google/genai contents
    const contents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    const reply = response.text || 'No response generated.';
    return res.json({ reply, modelUsed: modelName, isFallback: false });
  } catch (apiError: any) {
    console.warn('[POST LINK AI Server] Notice: Falling back to local telemetry knowledge base:', apiError?.message || apiError);
    const fallbackReply = generateIndustrialTelemetryFallback(messages);
    return res.json({
      reply: fallbackReply,
      modelUsed: 'POST LINK Industrial Telemetry Engine (Local)',
      isFallback: true,
      notice: 'Served via built-in POST LINK Telemetry Knowledge Engine due to API access permissions.',
    });
  }
});

// Image Generation & Editing endpoint for Industrial Depot Imagery
app.post('/api/generate-image', async (req, res) => {
  const { prompt, mode, base64Image, mimeType } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Enforce art direction strictly on all generated prompts
  const industrialContextEnhancer = `Industrial corporate fuel facility, POST LINK by Meena Oil Service corporate fleet fueling depot in Thailand industrial estate. Private controlled environment, factory warehouse background, 10-wheel or 6-wheel Thai commercial fleet trucks, heavy-duty industrial diesel dispenser, digital flow meter, above-ground diesel storage tanks with safety bund, Thai personnel with high-vis safety vests and hardhats. No retail gas station logos, no consumer convenience store. Professional, secure, industrial engineering photorealism. Details: ${prompt}`;

  try {
    const ai = getGenAI();

    if (mode === 'edit' && base64Image) {
      // Edit image using gemini-3.1-flash-image
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.replace(/^data:image\/\w+;base64,/, ''),
                mimeType: mimeType || 'image/jpeg',
              },
            },
            {
              text: industrialContextEnhancer,
            },
          ],
        },
      });

      let generatedImageUrl = null;
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        return res.json({ imageUrl: generatedImageUrl, prompt: industrialContextEnhancer, isFallback: false });
      }
    } else {
      // Create new image using gemini-3.1-flash-image
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-image',
        contents: {
          parts: [
            {
              text: industrialContextEnhancer,
            },
          ],
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9',
            imageSize: '1K',
          },
        },
      });

      let generatedImageUrl = null;
      if (response.candidates && response.candidates[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            generatedImageUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (generatedImageUrl) {
        return res.json({ imageUrl: generatedImageUrl, prompt: industrialContextEnhancer, isFallback: false });
      }
    }
  } catch (imageApiError: any) {
    console.warn('[POST LINK Image Server] Notice: Falling back to industrial asset repository:', imageApiError?.message || imageApiError);
  }

  // Graceful fallback to verified industrial asset matching the prompt
  const fallbackUrl = getMatchingIndustrialImage(prompt);
  return res.json({
    imageUrl: fallbackUrl,
    prompt: industrialContextEnhancer,
    isFallback: true,
    notice: 'Displaying verified industrial fleet depot asset from POST LINK repository',
  });
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`POST LINK Server running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
