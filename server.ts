import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini SDK with safety checks and custom User-Agent
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    console.log("Gemini Client initialized successfully with API key.");
  } catch (error) {
    console.error("Failed to initialize Gemini Client:", error);
  }
} else {
  console.log("No valid GEMINI_API_KEY provided. Server will run in simulation/fallback mode for the AI coach.");
}

// AI Trainer Coach Endpoint
app.post("/api/coach", async (req, res) => {
  const { memberStats, messages } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: "Messages array is required" });
  }

  // Generate system prompt
  const systemInstruction = `
أنت "الكابتن حُصين" (Captain Husain)، المدرب الشخصي الافتراضي الذكي والمحترف لنادي الحصن الرياضي (Al Huson Sports Club).
مهمتك هي تقديم الدعم، والتحفيز، والنصائح الرياضية والغذائية للمشتركين بناءً على بياناتهم البدنية وأهدافهم.

تفاصيل المشترك الحالي:
- الاسم: ${memberStats?.name || "بطل نادي الحصن"}
- الطول: ${memberStats?.height || "غير محدد"} سم
- الوزن: ${memberStats?.weight || "غير محدد"} كجم
- نسبة الدهون: ${memberStats?.fat || "غير محدد"}%
- الكتلة العضلية: ${memberStats?.muscle || "غير محدد"}%
- الهدف الحالي: ${memberStats?.goal || "اللياقة البدنية"}

أسلوبك:
1. شجع المشترك باسمه ودائماً كن متحمساً وإيجابياً جداً!
2. تحدث باللغة العربية بأسلوب ودود وقريب من القلب ومحفز (استخدم لهجة سعودية/خليجية بيضاء خفيفة ومفهومة مع الكلمات الرياضية الشائعة).
3. قدم نصائح رياضية عملية (مثال: جدول تكرارات، تكتيكات في التمرين) ونصائح غذائية تناسب هدفه (مثال: زيادة البروتين للتضخيم، عجز السعرات للتنشيف).
4. استخدم الرموز التعبيرية (مثل 💪🏋️🔥🥦🥗🏆) بشكل مناسب وجذاب لإشعال الحماس.
5. حافظ على إيجابات مركزة وسهلة القراءة ومقسمة لنقاط واضحة.
  `;

  // Fallback simulator for AI coach
  if (!ai) {
    const lastMessage = messages[messages.length - 1]?.text || "";
    let mockReply = `يا هلا بك يا بطل! أنا كابتن حُصين مدربك الشخصي في نادي الحصن. 🌟
تطبيقك يعمل حالياً في وضع "المحاكاة الافتراضية" (دون مفتاح API مفعل) لمساعدتك في صالة الحصن الرياضية وتتبع تمارينك.

يسعدني جداً تحليل بياناتك الحالية:
💪 هدفك هو: **${memberStats?.goal || "اللياقة البدنية"}**
🏋️ وزنك الحالي: **${memberStats?.weight || 75} كجم** بنسبة دهون **${memberStats?.fat || 20}%** وعضلات **${memberStats?.muscle || 35}%**.

نصيحتي السريعة لك اليوم:
1. **التغذية:** ركز على شرب 3 لتر ماء يومياً وتناول مصادر بروتين نظيفة كالدجاج والبيض والأسماك.
2. **التمرين:** لا تهمل تمارين المقاومة 4 أيام في الأسبوع مع زيادة الأوزان تدريجياً (Progressive Overload).
3. **الاستشفاء:** نم ما لا يقل عن 7-8 ساعات ليلاً للسماح لعضلاتك بالنمو والتعافي.

اسألني أي سؤال عن التمارين أو الأكلات وسأجيبك فوراً! 🔥🏋️`;

    // Try to tailor fallback to keyword inputs
    if (lastMessage.includes("تمرين") || lastMessage.includes("جدول")) {
      mockReply = `يا هلا بك يا بطل! بخصوص تساؤلك عن جدول التمارين 💪:
أقترح عليك كبداية لبرنامج **${memberStats?.goal}** اتباع جدول تقسيم عضلات Push-Pull-Legs (دفع، سحب، أرجل) على مدار 3 إلى 5 أيام في الأسبوع:
- **يوم الدفع:** الصدر، الأكتاف الأمامية والجانبية، والترايسبس.
- **يوم السحب:** الظهر كامل، البايسبس، والأكتاف الخلفية.
- **يوم الأرجل:** عضلات الفخذ الأمامية والخلفية، الساقين، والبطات.

رتب تمارينك لتكون 3-4 جولات، والتكرارات بين 8-12 للضخامة والقوة. التزم بالاستمرارية وبتشوف نتيجة جبارة! 🔥`;
    } else if (lastMessage.includes("أكل") || lastMessage.includes("بروتين") || lastMessage.includes("دايت") || lastMessage.includes("تغذية")) {
      mockReply = `أهلاً بك يا بطل! بخصوص التغذية لهدفك الحالي **(${memberStats?.goal})** 🥦:
- لـ **التنشيف**: ركز على عجز سعرات حرارية خفيف (بين 300 لـ 500 سعرة أقل من سعرات الثبات) مع المحافظة على نسبة بروتين عالية جداً (حوالي 2 جرام لكل كيلو من وزن جسمك) لحماية عضلاتك.
- لـ **التضخيم**: تحتاج فائض سعرات حرارية نظيفة (مصادر كارب معقد كالشوفان والأرز البني) لتدعم البناء العضلي.
- لـ **اللياقة**: ركز على التوازن التام والابتعاد عن السكريات المصنعة والزيوت المهدرجة.

هل تحتاج لوصفة وجبة ما قبل التمرين؟ خبرني! 🥗`;
    }

    return res.json({ reply: mockReply });
  }

  try {
    // Format conversation history for the virtual coach
    const contents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    // Generate response
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: contents,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
        maxOutputTokens: 1000,
      }
    });

    const replyText = response.text || "عذراً يا بطل، واجهت مشكلة صغيرة في استيعاب طلبك. أعد المحاولة وسأكون معك!";
    return res.json({ reply: replyText });
  } catch (error) {
    console.error("Gemini Coach API Error:", error);
    return res.status(500).json({ 
      error: "حدث خطأ أثناء الاتصال بـ Gemini AI", 
      details: error instanceof Error ? error.message : String(error) 
    });
  }
});

// Serve frontend build and handle SPA routes
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("Vite development middleware loaded.");
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log("Serving static production files from dist.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
