-- =====================================================================
-- 🏋️‍♂️ SUPABASE DATABASE SCHEMA FOR AL HUSON SPORTS CLUB (نادي الحصن الرياضي)
-- =====================================================================
-- This file contains the complete database structure, foreign keys, 
-- indexes, Row Level Security (RLS) policies, and seed data.
--
-- 💡 DESIGN CHOICE: CamelCase column names are enclosed in double quotes 
-- to match your React TypeScript interfaces exactly. This means your 
-- frontend code will work immediately without any modification or key mapping!
-- =====================================================================

-- Clean up existing tables if they exist (safe to run multiple times)
DROP TABLE IF EXISTS "bar_orders" CASCADE;
DROP TABLE IF EXISTS "bar_items" CASCADE;
DROP TABLE IF EXISTS "challenge_progresses" CASCADE;
DROP TABLE IF EXISTS "fitness_challenges" CASCADE;
DROP TABLE IF EXISTS "attendance_logs" CASCADE;
DROP TABLE IF EXISTS "chat_messages" CASCADE;
DROP TABLE IF EXISTS "club_offers" CASCADE;
DROP TABLE IF EXISTS "bookings" CASCADE;
DROP TABLE IF EXISTS "club_services" CASCADE;
DROP TABLE IF EXISTS "progress_logs" CASCADE;
DROP TABLE IF EXISTS "subscriptions" CASCADE;
DROP TABLE IF EXISTS "members" CASCADE;
DROP TABLE IF EXISTS "coach_plans" CASCADE;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. Table: coach_plans (خطة الكابتن الرياضية والغذائية)
-- ==========================================
CREATE TABLE "coach_plans" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "title" TEXT NOT NULL,
  "type" TEXT NOT NULL CHECK ("type" IN ('تدريب', 'تغذية')),
  "goal" TEXT NOT NULL CHECK ("goal" IN ('تنشيف', 'تضخيم', 'لياقة')),
  "duration_weeks" INTEGER NOT NULL,
  "level" TEXT NOT NULL CHECK ("level" IN ('مبتدئ', 'متوسط', 'متقدم')),
  "description" TEXT NOT NULL,
  "details" TEXT NOT NULL,
  "image_url" TEXT DEFAULT 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
  "created_at" TIMESTAMPTZ DEFAULT now(),
  "updated_at" TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 2. Table: members (الأعضاء)
-- ==========================================
CREATE TABLE "members" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "phone" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "password" TEXT DEFAULT '1234',
  "height" NUMERIC NOT NULL,
  "weight" NUMERIC NOT NULL,
  "fat" NUMERIC NOT NULL,
  "muscle" NUMERIC NOT NULL,
  "goal" TEXT NOT NULL CHECK ("goal" IN ('تنشيف', 'تضخيم', 'لياقة')),
  "createdAt" TIMESTAMPTZ DEFAULT now(),
  "points" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT CHECK ("status" IN ('نشط', 'قيد الانتظار')) DEFAULT 'نشط',
  "pendingSubType" TEXT CHECK ("pendingSubType" IN ('جيم', 'شامل', 'مسبح', 'ملاكمة'))
);

-- ==========================================
-- 3. Table: subscriptions (الاشتراكات)
-- ==========================================
CREATE TABLE "subscriptions" (
  "id" TEXT PRIMARY KEY,
  "memberId" TEXT NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "type" TEXT NOT NULL CHECK ("type" IN ('جيم', 'شامل', 'مسبح', 'ملاكمة')),
  "startDate" TIMESTAMPTZ NOT NULL,
  "endDate" TIMESTAMPTZ NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN ('فعال', 'قريب الانتهاء', 'منتهي')),
  "price" NUMERIC NOT NULL
);

-- ==========================================
-- 4. Table: progress_logs (سجل التطور البدني)
-- ==========================================
CREATE TABLE "progress_logs" (
  "id" TEXT PRIMARY KEY,
  "memberId" TEXT NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "weight" NUMERIC NOT NULL,
  "fat" NUMERIC NOT NULL,
  "muscle" NUMERIC NOT NULL,
  "date" TIMESTAMPTZ NOT NULL
);

-- ==========================================
-- 5. Table: club_services (خدمات النادي والكباتن)
-- ==========================================
CREATE TABLE "club_services" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "image" TEXT NOT NULL,
  "price" NUMERIC NOT NULL
);

-- ==========================================
-- 6. Table: bookings (الحجوزات والطلبات)
-- ==========================================
CREATE TABLE "bookings" (
  "id" TEXT PRIMARY KEY,
  "memberId" TEXT NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "memberName" TEXT NOT NULL,
  "memberPhone" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL REFERENCES "club_services"("id") ON DELETE CASCADE,
  "serviceTitle" TEXT NOT NULL,
  "date" TIMESTAMPTZ NOT NULL,
  "timeSlot" TEXT NOT NULL,
  "status" TEXT NOT NULL CHECK ("status" IN ('قيد الانتظار', 'تم القبول', 'تم الرفض')) DEFAULT 'قيد الانتظار',
  "createdAt" TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 7. Table: club_offers (عروض النادي)
-- ==========================================
CREATE TABLE "club_offers" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "discount" TEXT NOT NULL,
  "active" BOOLEAN NOT NULL DEFAULT true,
  "image" TEXT NOT NULL
);

-- ==========================================
-- 8. Table: chat_messages (محادثات الدعم الفني والذكاء الاصطناعي)
-- ==========================================
CREATE TABLE "chat_messages" (
  "id" TEXT PRIMARY KEY,
  "sender" TEXT NOT NULL CHECK ("sender" IN ('user', 'assistant')),
  "text" TEXT NOT NULL,
  "timestamp" TIMESTAMPTZ DEFAULT now()
);

-- ==========================================
-- 9. Table: attendance_logs (سجل حضور البوابات الذكية)
-- ==========================================
CREATE TABLE "attendance_logs" (
  "id" TEXT PRIMARY KEY,
  "memberId" TEXT NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "memberName" TEXT NOT NULL,
  "date" TEXT NOT NULL,
  "time" TEXT NOT NULL,
  "method" TEXT NOT NULL CHECK ("method" IN ('مسح الرمز QR', 'دخول يدوي'))
);

-- ==========================================
-- 10. Table: fitness_challenges (تحديات النادي والجوائز)
-- ==========================================
CREATE TABLE "fitness_challenges" (
  "id" TEXT PRIMARY KEY,
  "title" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "targetValue" NUMERIC NOT NULL,
  "unit" TEXT NOT NULL,
  "pointsReward" INTEGER NOT NULL,
  "category" TEXT NOT NULL CHECK ("category" IN ('خطوات', 'وزن', 'حضور', 'تمارين')),
  "icon" TEXT NOT NULL
);

-- ==========================================
-- 11. Table: challenge_progresses (تقدم الأعضاء في التحديات)
-- ==========================================
CREATE TABLE "challenge_progresses" (
  "id" TEXT PRIMARY KEY,
  "memberId" TEXT NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "challengeId" TEXT NOT NULL REFERENCES "fitness_challenges"("id") ON DELETE CASCADE,
  "currentValue" NUMERIC NOT NULL DEFAULT 0,
  "isCompleted" BOOLEAN NOT NULL DEFAULT false,
  UNIQUE("memberId", "challengeId")
);

-- ==========================================
-- 12. Table: bar_items (منتجات البار الصحي والبروتين)
-- ==========================================
CREATE TABLE "bar_items" (
  "id" TEXT PRIMARY KEY,
  "name" TEXT NOT NULL,
  "category" TEXT NOT NULL CHECK ("category" IN ('بروتين', 'عصائر', 'مكملات', 'سناك صحي')),
  "pricePoints" INTEGER NOT NULL DEFAULT 0,
  "priceCash" NUMERIC NOT NULL DEFAULT 0,
  "image" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "stock" INTEGER NOT NULL DEFAULT 0
);

-- ==========================================
-- 13. Table: bar_orders (طلبات البار الصحي)
-- ==========================================
CREATE TABLE "bar_orders" (
  "id" TEXT PRIMARY KEY,
  "memberId" TEXT NOT NULL REFERENCES "members"("id") ON DELETE CASCADE,
  "memberName" TEXT NOT NULL,
  "itemId" TEXT NOT NULL REFERENCES "bar_items"("id") ON DELETE CASCADE,
  "itemName" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL DEFAULT 1,
  "totalPointsCost" INTEGER NOT NULL DEFAULT 0,
  "status" TEXT NOT NULL CHECK ("status" IN ('قيد التحضير', 'جاهز للاستلام', 'تم التسليم')) DEFAULT 'قيد التحضير',
  "createdAt" TIMESTAMPTZ DEFAULT now()
);


-- =====================================================================
-- ⚡ PERFORMANCE INDEXES (تحسين سرعة الاستعلامات)
-- =====================================================================
CREATE INDEX idx_subscriptions_memberId ON "subscriptions"("memberId");
CREATE INDEX idx_progress_logs_memberId ON "progress_logs"("memberId");
CREATE INDEX idx_bookings_memberId ON "bookings"("memberId");
CREATE INDEX idx_attendance_logs_memberId ON "attendance_logs"("memberId");
CREATE INDEX idx_challenge_progresses_memberId ON "challenge_progresses"("memberId");
CREATE INDEX idx_bar_orders_memberId ON "bar_orders"("memberId");


-- =====================================================================
-- 🔒 ROW LEVEL SECURITY (RLS) & POLICIES (سياسات الأمان والحماية)
-- =====================================================================

-- Enable RLS for all tables
ALTER TABLE "coach_plans" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "members" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "subscriptions" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "progress_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "club_services" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bookings" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "club_offers" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "chat_messages" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "attendance_logs" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "fitness_challenges" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "challenge_progresses" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bar_items" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "bar_orders" ENABLE ROW LEVEL SECURITY;

-- 💡 Policies: For seamless operation of the client-side app, we allow 
-- full read/write access (using the anon/authenticated key). In a strict 
-- production system, we would lock these down using user-specific auth checks.

-- 1. coach_plans Policies
CREATE POLICY "Allow public read of coach_plans" ON "coach_plans" FOR SELECT USING (true);
CREATE POLICY "Allow public write of coach_plans" ON "coach_plans" FOR ALL USING (true) WITH CHECK (true);

-- 2. members Policies
CREATE POLICY "Allow public read of members" ON "members" FOR SELECT USING (true);
CREATE POLICY "Allow public write of members" ON "members" FOR ALL USING (true) WITH CHECK (true);

-- 3. subscriptions Policies
CREATE POLICY "Allow public read of subscriptions" ON "subscriptions" FOR SELECT USING (true);
CREATE POLICY "Allow public write of subscriptions" ON "subscriptions" FOR ALL USING (true) WITH CHECK (true);

-- 4. progress_logs Policies
CREATE POLICY "Allow public read of progress_logs" ON "progress_logs" FOR SELECT USING (true);
CREATE POLICY "Allow public write of progress_logs" ON "progress_logs" FOR ALL USING (true) WITH CHECK (true);

-- 5. club_services Policies
CREATE POLICY "Allow public read of club_services" ON "club_services" FOR SELECT USING (true);
CREATE POLICY "Allow public write of club_services" ON "club_services" FOR ALL USING (true) WITH CHECK (true);

-- 6. bookings Policies
CREATE POLICY "Allow public read of bookings" ON "bookings" FOR SELECT USING (true);
CREATE POLICY "Allow public write of bookings" ON "bookings" FOR ALL USING (true) WITH CHECK (true);

-- 7. club_offers Policies
CREATE POLICY "Allow public read of club_offers" ON "club_offers" FOR SELECT USING (true);
CREATE POLICY "Allow public write of club_offers" ON "club_offers" FOR ALL USING (true) WITH CHECK (true);

-- 8. chat_messages Policies
CREATE POLICY "Allow public read of chat_messages" ON "chat_messages" FOR SELECT USING (true);
CREATE POLICY "Allow public write of chat_messages" ON "chat_messages" FOR ALL USING (true) WITH CHECK (true);

-- 9. attendance_logs Policies
CREATE POLICY "Allow public read of attendance_logs" ON "attendance_logs" FOR SELECT USING (true);
CREATE POLICY "Allow public write of attendance_logs" ON "attendance_logs" FOR ALL USING (true) WITH CHECK (true);

-- 10. fitness_challenges Policies
CREATE POLICY "Allow public read of fitness_challenges" ON "fitness_challenges" FOR SELECT USING (true);
CREATE POLICY "Allow public write of fitness_challenges" ON "fitness_challenges" FOR ALL USING (true) WITH CHECK (true);

-- 11. challenge_progresses Policies
CREATE POLICY "Allow public read of challenge_progresses" ON "challenge_progresses" FOR SELECT USING (true);
CREATE POLICY "Allow public write of challenge_progresses" ON "challenge_progresses" FOR ALL USING (true) WITH CHECK (true);

-- 12. bar_items Policies
CREATE POLICY "Allow public read of bar_items" ON "bar_items" FOR SELECT USING (true);
CREATE POLICY "Allow public write of bar_items" ON "bar_items" FOR ALL USING (true) WITH CHECK (true);

-- 13. bar_orders Policies
CREATE POLICY "Allow public read of bar_orders" ON "bar_orders" FOR SELECT USING (true);
CREATE POLICY "Allow public write of bar_orders" ON "bar_orders" FOR ALL USING (true) WITH CHECK (true);


-- =====================================================================
-- 🌱 SEED INITIAL DATA (إدخال البيانات الترحيبية والافتراضية لتجربة فورية)
-- =====================================================================

-- Seed Members
INSERT INTO "members" ("id", "name", "phone", "email", "height", "weight", "fat", "muscle", "goal", "points", "status", "pendingSubType")
VALUES 
('member-1', 'بشار الخصاونة', '0799988771', 'bashar@alhuson.com', 178, 82.5, 18.4, 42.1, 'لياقة', 150, 'نشط', NULL),
('member-2', 'عمر الرزاز', '0788877662', 'omar@alhuson.com', 182, 95.0, 26.2, 38.5, 'تنشيف', 20, 'نشط', NULL),
('member-3', 'سمير الرفاعي', '0777766553', 'samir@alhuson.com', 170, 64.0, 12.1, 45.3, 'تضخيم', 450, 'نشط', NULL)
ON CONFLICT ("id") DO NOTHING;

-- Seed Subscriptions
INSERT INTO "subscriptions" ("id", "memberId", "type", "startDate", "endDate", "status", "price")
VALUES 
('sub-1', 'member-1', 'جيم', now() - interval '10 days', now() + interval '20 days', 'فعال', 45),
('sub-2', 'member-2', 'شامل', now() - interval '25 days', now() + interval '5 days', 'فعال', 80),
('sub-3', 'member-3', 'ملاكمة', now() - interval '45 days', now() - interval '15 days', 'منتهي', 60)
ON CONFLICT ("id") DO NOTHING;

-- Seed Progress Logs
INSERT INTO "progress_logs" ("id", "memberId", "weight", "fat", "muscle", "date")
VALUES 
('log-1', 'member-1', 84.0, 19.5, 41.0, now() - interval '30 days'),
('log-2', 'member-1', 82.5, 18.4, 42.1, now()),
('log-3', 'member-2', 98.2, 28.5, 37.0, now() - interval '30 days'),
('log-4', 'member-2', 95.0, 26.2, 38.5, now()),
('log-5', 'member-3', 62.0, 13.5, 44.0, now() - interval '30 days'),
('log-6', 'member-3', 64.0, 12.1, 45.3, now())
ON CONFLICT ("id") DO NOTHING;

-- Seed Club Services
INSERT INTO "club_services" ("id", "title", "description", "image", "price")
VALUES 
('srv-1', 'تدريب شخصي مع كابتن (1-on-1 VIP)', 'متابعة خاصة لتصميم وتعديل جدول التمارين والدايت اليومي مع الكابتن وجه لوجه مع فحص InBody أسبوعي لتسريع تحقيق هدفك.', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=400', 120),
('srv-2', 'جلسة فحص Inbody دقيقة ومعمقة 📊', 'فحص كامل لنسب الدهون، العضلات، المياه والسوائل، وتوزيعها في الجسم مع شرح مفصل وتوصيات للتغذية والتمارين من قبل كابتن معتمد.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400', 10),
('srv-3', 'استشارة غذائية وتصميم دايت مخصص 🥦', 'دراسة كاملة لنمط حياتك وتصميم نظام غذائي وحساب السعرات والماكروز والوجبات المفضلة لديك لتحقيق التوازن والاستدامة.', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=400', 30),
('srv-4', 'جلسة مساج استشفائي وعلاج طبيعي 💆‍♂️', 'جلسة استرخاء واستشفاء عضلي مخصصة للرياضيين لفك العقد وتحسين مرونة المفاصل لتسريع الشفاء بعد التمارين الشاقة.', 'https://images.unsplash.com/photo-1600334089648-b0d9d3028eb2?auto=format&fit=crop&q=80&w=400', 25)
ON CONFLICT ("id") DO NOTHING;

-- Seed Club Offers
INSERT INTO "club_offers" ("id", "title", "description", "discount", "active", "image")
VALUES 
('off-1', 'عرض الصيف الأسطوري (اشتراك 3 شهور شامل)', 'احصل على دخول كامل للجيم والمسبح مع حصص ملاكمة مجانية وتقييم بدني مجاني كلياً!', 'خصم 35%', true, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=500'),
('off-2', 'اشتراك الطلاب والجامعات الخاص 🎓', 'لكل طلاب الجامعات والمدارس، حافظ على لياقتك بأقل تكلفة ممكنة مع مرونة تامة في أوقات الدخول.', 'خصم 20% ثابت', true, 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=500')
ON CONFLICT ("id") DO NOTHING;

-- Seed Attendance Logs
INSERT INTO "attendance_logs" ("id", "memberId", "memberName", "date", "time", "method")
VALUES 
('att-1', 'member-1', 'بشار الخصاونة', '2026-07-05', '18:12:44', 'مسح الرمز QR'),
('att-2', 'member-3', 'سمير الرفاعي', '2026-07-05', '19:45:02', 'دخول يدوي')
ON CONFLICT ("id") DO NOTHING;

-- Seed Fitness Challenges
INSERT INTO "fitness_challenges" ("id", "title", "description", "targetValue", "unit", "pointsReward", "category", "icon")
VALUES 
('chal-1', 'تحدي بطل الخطوات اليومي 🏃‍♂️', 'امشِ 10,000 خطوة أو أكثر في اليوم وحافظ على صحة قلبك وشرايينك.', 10000, 'خطوة', 15, 'خطوات', 'Footprints'),
('chal-2', 'تحدي وحش الحديد والاستمرارية 🏋️‍♂️', 'سجل حضورك في صالة الحديد لـ 5 أيام على الأقل خلال الأسبوع الحالي لتثبيت العادة.', 5, 'أيام حضور', 30, 'حضور', 'CalendarCheck'),
('chal-3', 'تحدي اللياقة وحرق السعرات 🔥', 'احرق كمية مستهدفة من السعرات الحرارية في حصة الكارديو المفضلة لديك.', 600, 'سعرة', 20, 'تمارين', 'Flame'),
('chal-4', 'تحدي الرشاقة والوزن المثالي 📉', 'حقق نسبة الدهون المستهدفة أو تخلص من الكيلوجرامات الزائدة بطريقة صحية.', 2, 'كجم دهون', 50, 'وزن', 'TrendingDown')
ON CONFLICT ("id") DO NOTHING;

-- Seed Challenge Progresses
INSERT INTO "challenge_progresses" ("id", "memberId", "challengeId", "currentValue", "isCompleted")
VALUES 
('prog-c1', 'member-1', 'chal-1', 7500, false),
('prog-c2', 'member-1', 'chal-2', 4, false),
('prog-c3', 'member-3', 'chal-1', 11000, true),
('prog-c4', 'member-3', 'chal-2', 5, true)
ON CONFLICT ("id") DO NOTHING;

-- Seed Bar Items
INSERT INTO "bar_items" ("id", "name", "category", "pricePoints", "priceCash", "image", "description", "stock")
VALUES 
('bar-1', 'مخفوق بروتين الكراميل المملح الخارق 🥤', 'بروتين', 120, 22.00, 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&q=80&w=400', '30g واي بروتين نقي مع حليب اللوز خالي الدسم نكهة غنية جداً لبناء واستشفاء العضلات.', 15),
('bar-2', 'عصير التوت البري والليمون الطازج 🍹', 'عصائر', 60, 12.00, 'https://images.unsplash.com/photo-1536882240095-0379873feb4e?auto=format&fit=crop&q=80&w=400', 'مشروب غني بمضادات الأكسدة ومنعش للترطيب أثناء التمرين بدون سكر مضاف.', 25),
('bar-3', 'ألواح الشوفان الصحية بزبدة الفول السوداني 🍪', 'سناك صحي', 45, 8.50, 'https://images.unsplash.com/photo-1568254183919-78a4f43a2877?auto=format&fit=crop&q=80&w=400', 'سناك صحي غني بالألياف الطبيعية الكربوهيدرات المعقدة لإعطاء طاقة مستدامة.', 40),
('bar-4', 'كبسولات كرياتين مونوهيدرات النقي 💊', 'مكملات', 250, 45.00, 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400', 'مكمل غذائي نقي لزيادة التحمل العضلي ومخازن الـ ATP والقوة البدنية.', 10)
ON CONFLICT ("id") DO NOTHING;

-- Seed Bar Orders
INSERT INTO "bar_orders" ("id", "memberId", "memberName", "itemId", "itemName", "quantity", "totalPointsCost", "status", "createdAt")
VALUES 
('ord-1', 'member-1', 'بشار الخصاونة', 'bar-1', 'مخفوق بروتين الكراميل المملح الخارق 🥤', 1, 120, 'تم التسليم', now() - interval '2 hours'),
('ord-2', 'member-3', 'سمير الرفاعي', 'bar-3', 'ألواح الشوفان الصحية بزبدة الفول السوداني 🍪', 2, 90, 'جاهز للاستلام', now() - interval '10 minutes')
ON CONFLICT ("id") DO NOTHING;

-- Seed Initial Coach Plans
INSERT INTO "coach_plans" ("id", "title", "type", "goal", "duration_weeks", "level", "description", "details", "image_url")
VALUES 
('377f0a66-db28-4bc6-8d62-d2784ee0ca91', 'تحدي تنشيف الكابتن حصن الأسطوري ⚡', 'تغذية', 'تنشيف', 4, 'متوسط', 'خطة غذائية متكاملة لتقليل نسبة الدهون لأقل من 10% مع الحفاظ التام على الكتلة العضلية والقوة البدنية باستخدام نظام الكربوهيدرات الدوري.', 'الوجبة 1: 5 بياض بيض + بيضة كاملة مسلوقة + 50g شوفان بالماء والقرفة.\nالوجبة 2 (بعد التمرين): سكوب واي بروتين مع موزة واحدة متوسطة.\nالوجبة 3: 200g صدر دجاج مشوي + 100g أرز بسمتي مسلوق + صحن سلطة خضراء كبيرة.\nالوجبة 4: علبة تونة مصفاة من الزيت + ملعقة زيت زيتون صغيرة + خيار.\nالوجبة 5 (قبل النوم): 150g جبنة قريش أو زبادي يوناني خالي الدسم مع حفصة لوز نيء (10 حبات).\n\n💡 ملاحظة: شرب 4 لتر ماء يومياً وقطع السكريات والدهون المهدرجة تماماً لنتائج مثالية.', 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&q=80&w=600'),
('50ee2b70-179f-4f65-8b27-5d22f0dc3275', 'برنامج تضخيم وحوش الحصن الخارق 🏋️‍♂️', 'تدريب', 'تضخيم', 8, 'متقدم', 'برنامج مكثف بنظام التكرارات التنازلية والأوزان الثقيلة لبناء عضلات ضخمة وزيادة القوة القصوى للألياف العضلية.', 'السبت: صدر وبايسبس (أوزان قصوى 4 جولات - تكرارات 8/8/6/4)\nالأحد: ظهر وترايسبس (تركيز على السحب والرفعة الميتة)\nالاثنين: أكتاف وترابيس (ضغط بار أمامي وجانبي)\nالثلاثاء: راحة واستشفاء\nالأربعاء: أرجل كاملة مع تمرين البطات\nالخميس: كارديو خفيف 15 دقيقة وبطن وسواعد\nالجمعة: راحة تامة وتغذية مرتفعة السعرات.', 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600')
ON CONFLICT ("id") DO NOTHING;

-- =====================================================================
-- 🎉 SQL SCRIPT COMPLETED!
-- Copy and paste this directly into your Supabase SQL Editor to run it.
-- =====================================================================
