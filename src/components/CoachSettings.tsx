import React, { useState, useEffect } from 'react';
import { 
  supabase, 
  isSupabaseConfigured, 
  type CoachPlan 
} from '../lib/supabase';
import { 
  Dumbbell, 
  Plus, 
  Trash2, 
  Save, 
  Database, 
  Copy, 
  Check, 
  AlertCircle, 
  Info, 
  Search, 
  Filter, 
  RefreshCw, 
  X, 
  Pencil,
  Flame,
  TrendingUp,
  Apple,
  Clock,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoachSettingsProps {
  theme?: 'dark' | 'light';
  language?: 'ar' | 'en';
}

// Preset high-quality stock images based on plan types for easy creation
const IMAGE_PRESETS = [
  { name: 'بناء أجسام / حديد', url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600' },
  { name: 'كارديو / لياقة', url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600' },
  { name: 'ملاكمة / قتال', url: 'https://images.unsplash.com/photo-1517438476312-10d79c07750d?auto=format&fit=crop&q=80&w=600' },
  { name: 'تغذية صحية / كيتو', url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600' },
  { name: 'مكملات غذائية / بروتين', url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?auto=format&fit=crop&q=80&w=600' },
];

export default function CoachSettings({ theme = 'dark', language = 'ar' }: CoachSettingsProps) {
  const isDark = theme === 'dark';
  const isAr = language === 'ar';

  // --- Core State ---
  const [plans, setPlans] = useState<CoachPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showSqlSchema, setShowSqlSchema] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // --- Filtering & Search ---
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('جميع');
  const [filterGoal, setFilterGoal] = useState<string>('جميع');
  const [filterLevel, setFilterLevel] = useState<string>('جميع');

  // --- Modal & Form States ---
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState<CoachPlan | null>(null);
  
  // --- Form Fields ---
  const [title, setTitle] = useState('');
  const [type, setType] = useState<'تدريب' | 'تغذية'>('تدريب');
  const [goal, setGoal] = useState<'تنشيف' | 'تضخيم' | 'لياقة'>('لياقة');
  const [durationWeeks, setDurationWeeks] = useState(4);
  const [level, setLevel] = useState<'مبتدئ' | 'متوسط' | 'متقدم'>('متوسط');
  const [description, setDescription] = useState('');
  const [details, setDetails] = useState('');
  const [imageUrl, setImageUrl] = useState(IMAGE_PRESETS[0].url);

  // --- Dummy Initial Data for local/fallback playground ---
  const fallbackPlans: CoachPlan[] = [
    {
      id: 'plan-1',
      title: 'برنامج حرق الدهون السريع والكارديو القاسي 🏃‍♂️',
      type: 'تدريب',
      goal: 'تنشيف',
      duration_weeks: 6,
      level: 'متوسط',
      description: 'كورس مدمج بين تمارين الكارديو المكثف الـ HIIT وتمارين المقاومة المناسبة لخسارة الدهون مع الحفاظ على الكتلة العضلية.',
      details: 'اليوم الأول: كارديو 30 دقيقة + أرجل وأكتاف\nاليوم الثاني: كارديو مكثف HIIT 20 دقيقة + بطن وصدر\nاليوم الثالث: راحة بدنية تامة\nاليوم الرابع: كارديو 30 دقيقة + ظهر وبايسبس\nاليوم الخامس: تمارين المقاومة الشاملة للجسم دائرياً (Circuit Training)',
      image_url: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?auto=format&fit=crop&q=80&w=600',
      created_at: new Date().toISOString()
    },
    {
      id: 'plan-2',
      title: 'كورس الكيتو دايت وبناء العضلات الصافية 🥑',
      type: 'تغذية',
      goal: 'لياقة',
      duration_weeks: 4,
      level: 'مبتدئ',
      description: 'نظام غذائي متكامل يعتمد على تقليل الكربوهيدرات لزيادة مستويات الطاقة وتحفيز حرق دهون الجسم الداخلية.',
      details: 'وجبة الإفطار: 3 بيضات مقلية بالزبدة البلدية + نصف حبة أفوكادو + ورقيات خضراء\nوجبة الغداء: 200 جرام صدر دجاج مشوي + سلطة خضراء مع زيت الزيتون وليمون\nوجبة العشاء: علبة تونة بالزيت + شرائح خيار وجبن قليل الكربوهيدرات\nالسوائل: شرب ما لا يقل عن 3 لتر ماء يومياً مع إضافة أملاح الكتروليت طبيعية.',
      image_url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&q=80&w=600',
      created_at: new Date().toISOString()
    },
    {
      id: 'plan-3',
      title: 'خطة التضخيم العضلي الخارق والقوة البدنية 🏋️‍♂️',
      type: 'تدريب',
      goal: 'تضخيم',
      duration_weeks: 8,
      level: 'متقدم',
      description: 'برنامج مكثف بنظام التكرارات التنازلية والأوزان الثقيلة لبناء عضلات ضخمة وزيادة القوة القصوى للألياف العضلية.',
      details: 'السبت: صدر وبايسبس (أوزان قصوى 4 جولات - تكرارات 8/8/6/4)\nالأحد: ظهر وترايسبس (تركيز على السحب والرفعة الميتة)\nالاثنين: أكتاف وترابيس (ضغط بار أمامي وجانبي)\nالثلاثاء: راحة واستشفاء\nالأربعاء: أرجل كاملة مع تمرين البطات\nالخميس: كارديو خفيف 15 دقيقة وبطن وسواعد\nالجمعة: راحة تامة وتغذية مرتفعة السعرات.',
      image_url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
      created_at: new Date().toISOString()
    }
  ];

  // --- Load Plans ---
  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    setLoading(true);
    setError(null);
    try {
      if (supabase) {
        // Fetch directly from real Supabase table
        const { data, error: dbError } = await supabase
          .from('coach_plans')
          .select('*')
          .order('created_at', { ascending: false });

        if (dbError) throw dbError;
        setPlans(data || []);
      } else {
        // Fallback to memory dummy data
        setPlans(fallbackPlans);
      }
    } catch (err: any) {
      console.error('Error fetching plans:', err);
      setError(isAr ? `فشل تحميل الخطط الرياضية من قاعدة البيانات: ${err.message}` : `Failed to load plans: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Save / Edit Form Submit ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !details.trim()) {
      setError(isAr ? 'الرجاء ملء جميع الحقول الإلزامية!' : 'Please fill all required fields!');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const planData = {
      title: title.trim(),
      type,
      goal,
      duration_weeks: Number(durationWeeks),
      level,
      description: description.trim(),
      details: details.trim(),
      image_url: imageUrl || 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600',
    };

    try {
      if (supabase) {
        if (editingPlan) {
          // UPDATE
          const { error: dbError } = await supabase
            .from('coach_plans')
            .update(planData)
            .eq('id', editingPlan.id);

          if (dbError) throw dbError;
          setSuccessMsg(isAr ? 'تم تحديث خطة الكابتن بنجاح! ✨' : 'Plan updated successfully!');
        } else {
          // CREATE
          const { error: dbError } = await supabase
            .from('coach_plans')
            .insert([planData]);

          if (dbError) throw dbError;
          setSuccessMsg(isAr ? 'تم إضافة خطة جديدة للكابتن بنجاح! 🎉' : 'New plan added successfully!');
        }
      } else {
        // Memory-only Simulation
        let updatedPlans: CoachPlan[] = [];
        if (editingPlan) {
          updatedPlans = plans.map(p => p.id === editingPlan.id ? { ...p, ...planData, updated_at: new Date().toISOString() } : p);
          setSuccessMsg(isAr ? 'تم تحديث الخطة بنجاح في الذاكرة! 💾' : 'Plan updated in memory!');
        } else {
          const newPlan: CoachPlan = {
            id: 'plan-' + Math.random().toString(36).substring(2, 11),
            ...planData,
            created_at: new Date().toISOString()
          };
          updatedPlans = [newPlan, ...plans];
          setSuccessMsg(isAr ? 'تم إضافة الخطة الجديدة بنجاح في الذاكرة! 💾' : 'New plan added in memory!');
        }
        setPlans(updatedPlans);
      }

      // Reset and Close Form
      closeForm();
      fetchPlans();
    } catch (err: any) {
      console.error('Error saving plan:', err);
      setError(isAr ? `حدث خطأ أثناء الحفظ: ${err.message}` : `Error saving plan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Delete Action ---
  const handleDelete = async (id: string, name: string) => {
    const confirmed = window.confirm(
      isAr 
        ? `هل أنت متأكد من حذف الخطة البدنية "${name}" نهائياً من النظام؟` 
        : `Are you sure you want to permanently delete "${name}"?`
    );
    if (!confirmed) return;

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (supabase) {
        const { error: dbError } = await supabase
          .from('coach_plans')
          .delete()
          .eq('id', id);

        if (dbError) throw dbError;
        setSuccessMsg(isAr ? 'تم حذف الخطة من خادم Supabase بنجاح.' : 'Plan deleted from Supabase.');
      } else {
        const updated = plans.filter(p => p.id !== id);
        setPlans(updated);
        setSuccessMsg(isAr ? 'تم حذف الخطة من الذاكرة.' : 'Plan deleted from memory.');
      }
      fetchPlans();
    } catch (err: any) {
      console.error('Error deleting plan:', err);
      setError(isAr ? `فشل عملية الحذف: ${err.message}` : `Delete failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // --- Helper state actions ---
  const openCreateForm = () => {
    setEditingPlan(null);
    setTitle('');
    setType('تدريب');
    setGoal('لياقة');
    setDurationWeeks(4);
    setLevel('متوسط');
    setDescription('');
    setDetails('');
    setImageUrl(IMAGE_PRESETS[0].url);
    setError(null);
    setIsFormOpen(true);
  };

  const openEditForm = (plan: CoachPlan) => {
    setEditingPlan(plan);
    setTitle(plan.title);
    setType(plan.type);
    setGoal(plan.goal);
    setDurationWeeks(plan.duration_weeks);
    setLevel(plan.level);
    setDescription(plan.description);
    setDetails(plan.details);
    setImageUrl(plan.image_url || IMAGE_PRESETS[0].url);
    setError(null);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingPlan(null);
  };

  // --- Filter Logic ---
  const filteredPlans = plans.filter(plan => {
    const matchesSearch = plan.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          plan.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = filterType === 'جميع' || plan.type === filterType;
    const matchesGoal = filterGoal === 'جميع' || plan.goal === filterGoal;
    const matchesLevel = filterLevel === 'جميع' || plan.level === filterLevel;

    return matchesSearch && matchesType && matchesGoal && matchesLevel;
  });

  // --- Copy SQL Editor script helper ---
  const SQL_SCRIPT = `-- ==========================================
-- SQL SCHEMA FOR AL HUSON SMART COACH PLANS
-- Copy and execute this in your Supabase SQL Editor
-- ==========================================

-- 1. Create the coach_plans table
CREATE TABLE IF NOT EXISTS public.coach_plans (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('تدريب', 'تغذية')),
    goal TEXT NOT NULL CHECK (goal IN ('تنشيف', 'تضخيم', 'لياقة')),
    duration_weeks INTEGER NOT NULL DEFAULT 4 CHECK (duration_weeks > 0),
    level TEXT NOT NULL CHECK (level IN ('مبتدئ', 'متوسط', 'متقدم')),
    description TEXT NOT NULL,
    details TEXT NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Enable Row Level Security (RLS)
ALTER TABLE public.coach_plans ENABLE ROW LEVEL SECURITY;

-- 3. Create permissive policies for standard usage (CRUD by client)
-- policy to allow public/unauthenticated read access (Members can see plans)
CREATE POLICY "Allow public read access to coach_plans" 
ON public.coach_plans 
FOR SELECT 
USING (true);

-- policy to allow full management for development/gym managers
CREATE POLICY "Allow full CRUD operations for development" 
ON public.coach_plans 
FOR ALL 
USING (true) 
WITH CHECK (true);

-- 4. Set up an automatic trigger to update 'updated_at' on updates
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER trigger_coach_plans_updated_at
    BEFORE UPDATE ON public.coach_plans
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(SQL_SCRIPT);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);
  };

  return (
    <div className={`space-y-6 ${isAr ? 'font-sans' : 'font-sans text-left'}`} style={{ direction: isAr ? 'rtl' : 'ltr' }}>
      
      {/* 🌟 Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 text-amber-500 rounded-xl border border-amber-500/20">
              <Dumbbell className="w-5 h-5 animate-pulse" />
            </div>
            <h2 className={`text-lg font-black ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
              {isAr ? 'إدارة خطط التدريب والتغذية الذكية 🏆' : 'Manage Training & Nutrition Plans 🏆'}
            </h2>
          </div>
          <p className={`text-xs mt-1 font-light ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            {isAr 
              ? 'قم بصياغة برامج تدريب احترافية وحميات الكابتن الذكي المخزنة مباشرة في قاعدة بيانات Supabase' 
              : 'Add, update, or remove physical routines and diet courses directly in your Supabase DB'}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Show SQL Database setup schema button */}
          <button
            onClick={() => setShowSqlSchema(!showSqlSchema)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-700 hover:border-amber-500/40 bg-slate-900/60 text-slate-300 transition-all flex items-center gap-1.5"
          >
            <Database className="w-4 h-4 text-amber-500" />
            <span>{isAr ? 'كود SQL الخاص بـ Supabase ⚡' : 'Supabase SQL Code ⚡'}</span>
          </button>

          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/10 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>{isAr ? 'إضافة خطة جديدة الكابتن' : 'Add New Coach Plan'}</span>
          </button>
        </div>
      </div>

      {/* ☁️ Database Status Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 ${
        isSupabaseConfigured 
          ? 'bg-emerald-500/5 border-emerald-500/10' 
          : 'bg-amber-500/5 border-amber-500/10'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl shrink-0 ${
            isSupabaseConfigured ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'
          }`}>
            <Info className="w-5 h-5" />
          </div>
          <div className="space-y-0.5">
            <h4 className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
              {isSupabaseConfigured 
                ? (isAr ? 'قاعدة البيانات متصلة بنجاح سحابياً! ☁️' : 'Database Connected Successfully! ☁️')
                : (isAr ? 'تنبيه: تعمل في بيئة التدريب التجريبية (تخزين محلي) 💾' : 'Training Environment Mode (Local Storage) 💾')}
            </h4>
            <p className="text-[10.5px] leading-relaxed text-slate-400">
              {isSupabaseConfigured
                ? (isAr 
                  ? 'يتم المزامنة الفورية لجميع المدخلات مع جدول `coach_plans` الخاص بك على Supabase.' 
                  : 'All inputs are synced live with your `coach_plans` table on Supabase.')
                : (isAr 
                  ? 'لم يتم إعداد المتغيرات VITE_SUPABASE_URL و VITE_SUPABASE_ANON_KEY بعد. يتم تشغيل محاكي التخزين المحلي. ارفع مفاتيحك باللوحة الجانبية للربط الحقيقي.' 
                  : 'Supabase env variables are not declared. Running local simulation. Declare keys in settings sidebar to sync.')}
            </p>
          </div>
        </div>

        <button 
          onClick={fetchPlans}
          className={`px-3 py-1.5 rounded-xl text-[11px] font-bold border flex items-center gap-1.5 transition-colors shrink-0 ${
            isDark 
              ? 'bg-slate-900 border-slate-800 text-slate-300 hover:text-amber-400' 
              : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
          }`}
          title="إعادة تحميل الخطط"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>{isAr ? 'تحديث البيانات' : 'Sync / Refresh'}</span>
        </button>
      </div>

      {/* ⚡ SQL Editor Guide Accordion */}
      <AnimatePresence>
        {showSqlSchema && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`overflow-hidden border rounded-2xl p-5 ${
              isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
            } space-y-4`}
          >
            <div className="flex justify-between items-center pb-3 border-b border-slate-800">
              <div className="space-y-0.5">
                <h3 className={`text-xs font-black ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                  {isAr ? '📋 كود SQL لإنشاء الجدول وسياسات الأمان في Supabase' : '📋 Supabase Schema & Security Setup Script'}
                </h3>
                <p className="text-[10px] text-slate-400">
                  {isAr 
                    ? 'افتح نافذة "SQL Editor" في لوحة تحكم Supabase الخاصة بك، والصق الكود بالأسفل ثم اضغط Run.' 
                    : 'Paste this in your Supabase SQL Editor and click Run to prepare the database table.'}
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopySql}
                  className="px-3 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-black text-[10px] hover:brightness-110 flex items-center gap-1 transition-all"
                >
                  {copiedSql ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSql ? (isAr ? 'تم النسخ!' : 'Copied!') : (isAr ? 'نسخ الكود' : 'Copy SQL')}</span>
                </button>
                <button 
                  onClick={() => setShowSqlSchema(false)}
                  className="text-slate-400 hover:text-slate-200 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="relative">
              <pre className="p-4 bg-slate-950 rounded-xl text-[10px] text-amber-500/90 font-mono text-left overflow-x-auto max-h-60 leading-relaxed border border-slate-850">
                {SQL_SCRIPT}
              </pre>
            </div>
            <p className="text-[10px] text-slate-500 leading-relaxed">
              * {isAr 
                ? 'ملاحظة: تفعيل سياسات الأمان (Row Level Security) يحمي بياناتك. تتيح السياسة المرفقة القراءة للجميع والكتابة الفورية للتعديل السريع.' 
                : 'Note: RLS policies safeguard your data. This script opens read permissions to public & allows developer writes.'}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🔍 Search and Filters Section */}
      <div className={`p-4 rounded-2xl border ${
        isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
      } grid grid-cols-1 md:grid-cols-4 gap-3 items-end`}>
        
        {/* Search */}
        <div className="space-y-1.5 md:col-span-1">
          <label className="block text-[10px] text-slate-400 font-bold">
            {isAr ? 'ابحث باسم الخطة أو الوصف' : 'Search by Name/Description'}
          </label>
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'مثال: حرق الدهون...' : 'Search...'}
              className={`w-full border rounded-xl pr-9 pl-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
              }`}
            />
          </div>
        </div>

        {/* Filter Type */}
        <div className="space-y-1.5">
          <label className="block text-[10px] text-slate-400 font-bold">{isAr ? 'تصنيف الخطة' : 'Plan Type'}</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="جميع">{isAr ? 'جميع الخطط' : 'All Types'}</option>
            <option value="تدريب">{isAr ? '💪 تدريب وتمارين' : '💪 Workouts'}</option>
            <option value="تغذية">{isAr ? '🥑 حمية وتغذية' : '🥑 Nutrition'}</option>
          </select>
        </div>

        {/* Filter Goal */}
        <div className="space-y-1.5">
          <label className="block text-[10px] text-slate-400 font-bold">{isAr ? 'الهدف البدني' : 'Fitness Goal'}</label>
          <select
            value={filterGoal}
            onChange={(e) => setFilterGoal(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="جميع">{isAr ? 'جميع الأهداف' : 'All Goals'}</option>
            <option value="تنشيف">{isAr ? 'تنشيف وخسارة دهون' : 'Cutting/Fat Loss'}</option>
            <option value="تضخيم">{isAr ? 'تضخيم وبناء عضلات' : 'Bulking/Muscle'}</option>
            <option value="لياقة">{isAr ? 'صحة ولياقة بدنية' : 'General Fitness'}</option>
          </select>
        </div>

        {/* Filter Level */}
        <div className="space-y-1.5">
          <label className="block text-[10px] text-slate-400 font-bold">{isAr ? 'مستوى الصعوبة' : 'Experience Level'}</label>
          <select
            value={filterLevel}
            onChange={(e) => setFilterLevel(e.target.value)}
            className={`w-full border rounded-xl px-3 py-2 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
              isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="جميع">{isAr ? 'جميع المستويات' : 'All Levels'}</option>
            <option value="مبتدئ">{isAr ? 'مبتدئ' : 'Beginner'}</option>
            <option value="متوسط">{isAr ? 'متوسط' : 'Intermediate'}</option>
            <option value="متقدم">{isAr ? 'متقدم جداً' : 'Advanced'}</option>
          </select>
        </div>
      </div>

      {/* ⚠️ Dynamic Alert Toasts */}
      {error && (
        <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 🏋️‍♂️ Plans Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-bold">{isAr ? 'جاري مزامنة وجلب برامج الكابتن من قاعدة البيانات...' : 'Syncing data from Cloud Database...'}</p>
        </div>
      ) : filteredPlans.length === 0 ? (
        <div className={`p-10 text-center rounded-2xl border ${
          isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-slate-50 border-slate-200'
        } space-y-3`}>
          <Info className="w-8 h-8 text-slate-500 mx-auto" />
          <h3 className={`text-sm font-black ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            {isAr ? 'لم يتم العثور على أي خطة بدنية!' : 'No plans found!'}
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {isAr 
              ? 'لا توجد برامج مطابقة لخيارات البحث الحالية، أو أن جدولك فارغ. تفضل بإضافة أول خطة تدريب الآن!' 
              : 'Add some physical routines or nutrition courses to get started.'}
          </p>
          <button
            onClick={openCreateForm}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-850 text-amber-500 border border-slate-750 rounded-xl text-xs font-black transition-colors"
          >
            {isAr ? '+ إضافة خطة بدنية أولى' : 'Create First Plan'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPlans.map((plan) => (
            <div 
              key={plan.id}
              className={`rounded-2xl border overflow-hidden transition-all duration-300 hover:scale-[1.01] flex flex-col justify-between ${
                isDark 
                  ? 'bg-slate-900 border-slate-800 hover:border-amber-500/20' 
                  : 'bg-white border-slate-200 shadow-sm hover:shadow-md hover:border-amber-500/20'
              }`}
            >
              {/* Card Image Header with badges */}
              <div className="relative h-40 bg-slate-950 overflow-hidden">
                <img 
                  src={plan.image_url || IMAGE_PRESETS[0].url} 
                  alt={plan.title}
                  className="w-full h-full object-cover opacity-75 hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = IMAGE_PRESETS[0].url;
                  }}
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>

                {/* Plan Type Badge */}
                <div className="absolute top-3 right-3 flex gap-1.5">
                  <span className={`px-2 py-0.5 rounded-lg text-[9px] font-black tracking-wide border ${
                    plan.type === 'تدريب' 
                      ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' 
                      : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                  }`}>
                    {plan.type === 'تدريب' ? (isAr ? '💪 تدريب' : 'Workout') : (isAr ? '🥑 تغذية' : 'Nutrition')}
                  </span>

                  <span className="px-2 py-0.5 bg-slate-900/90 text-slate-300 border border-slate-800 rounded-lg text-[9px] font-black">
                    ⏱️ {plan.duration_weeks} {isAr ? 'أسابيع' : 'weeks'}
                  </span>
                </div>

                {/* Left Top Badges */}
                <div className="absolute top-3 left-3 flex gap-1">
                  <span className="px-2 py-0.5 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-lg text-[9px] font-black">
                    🎯 {plan.goal}
                  </span>
                </div>

                {/* Title inside image bottom */}
                <div className="absolute bottom-3 inset-x-3 text-right">
                  <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                    plan.level === 'متقدم' ? 'bg-rose-500/20 text-rose-400' :
                    plan.level === 'متوسط' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  } mb-1.5 inline-block`}>
                    المرتبة: {plan.level}
                  </span>
                  <h3 className="text-xs font-black text-slate-100 line-clamp-1">
                    {plan.title}
                  </h3>
                </div>
              </div>

              {/* Card Body content */}
              <div className="p-4 space-y-3.5 flex-1 flex flex-col justify-between">
                <p className="text-[11px] text-slate-400 leading-relaxed line-clamp-3">
                  {plan.description}
                </p>

                {/* Mini details summary block */}
                <div className="p-2.5 bg-slate-950/40 border border-slate-850/60 rounded-xl space-y-1 text-[10px]">
                  <span className="text-amber-500 font-bold block mb-1">📋 روتين ومكونات البرنامج:</span>
                  <p className="text-slate-400 line-clamp-2 leading-relaxed whitespace-pre-line font-mono text-[9px]">
                    {plan.details}
                  </p>
                </div>

                {/* Actions Row */}
                <div className="flex gap-2 border-t border-slate-800/40 pt-3.5 mt-2">
                  <button
                    onClick={() => openEditForm(plan)}
                    className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 hover:border-slate-700 text-slate-300 rounded-lg text-[10.5px] font-bold transition-all flex items-center justify-center gap-1"
                  >
                    <Pencil className="w-3.5 h-3.5 text-amber-500" />
                    <span>{isAr ? 'تعديل الخطة' : 'Edit'}</span>
                  </button>

                  <button
                    onClick={() => handleDelete(plan.id, plan.title)}
                    className="px-2.5 py-1.5 bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/30 text-rose-400 rounded-lg text-[10.5px] transition-all flex items-center justify-center"
                    title={isAr ? 'حذف البرنامج' : 'Delete'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 📝 Add/Edit Modal Form */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4" style={{ direction: "rtl" }}>
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`w-full max-w-2xl rounded-2xl border overflow-hidden shadow-2xl flex flex-col max-h-[90vh] ${
              isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
            }`}
          >
            {/* Modal Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950/40">
              <div className="flex items-center gap-2">
                <Dumbbell className="w-4 h-4 text-amber-500" />
                <h3 className="text-xs font-black">
                  {editingPlan ? `تعديل خطة: ${editingPlan.title}` : 'أضف برنامج رياضي/غذائي جديد للكابتن 🏋️‍♂️'}
                </h3>
              </div>
              <button 
                onClick={closeForm}
                className="text-slate-400 hover:text-slate-100 p-1"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1 text-right">
              
              {/* Title and Duration */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-[10px] text-slate-400 font-bold mb-1.5">عنوان البرنامج البدني / الغذائي *</label>
                  <input 
                    type="text" 
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="مثال: خطة تضخيم الذراعين الفولاذية في 6 أسابيع"
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-amber-500 transition-colors ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1.5">المدة الإجمالية (بالأسابيع) *</label>
                  <input 
                    type="number" 
                    required
                    min={1}
                    max={52}
                    value={durationWeeks}
                    onChange={(e) => setDurationWeeks(Number(e.target.value))}
                    className={`w-full border rounded-xl px-3 py-2 text-xs text-center font-bold font-mono focus:outline-none focus:border-amber-500 transition-colors ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  />
                </div>
              </div>

              {/* Type, Goal, and Level selectors */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1.5">تصنيف البرنامج الرئيسي</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as any)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-amber-500 transition-colors ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="تدريب">💪 تمارين وتدريب في الصالة</option>
                    <option value="تغذية">🥑 نظام غذائي وحمية صحية</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1.5">الهدف البدني المناسب</label>
                  <select
                    value={goal}
                    onChange={(e) => setGoal(e.target.value as any)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-amber-500 transition-colors ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="تنشيف">تنشيف وحرق دهون</option>
                    <option value="تضخيم">تضخيم وبناء عضلات صافية</option>
                    <option value="لياقة">لياقة وصحة بدنية متكاملة</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 font-bold mb-1.5">مستوى الخبرة والشدة</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className={`w-full border rounded-xl px-3 py-2 text-xs font-bold focus:outline-none focus:border-amber-500 transition-colors ${
                      isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                    }`}
                  >
                    <option value="مبتدئ">مبتدئ (سهل التدريج)</option>
                    <option value="متوسط">متوسط الشدة</option>
                    <option value="متقدم">متقدم جداً (أبطال ومحترفين)</option>
                  </select>
                </div>
              </div>

              {/* Cover Image Selector */}
              <div className="space-y-1.5">
                <label className="block text-[10px] text-slate-400 font-bold">صورة خلفية غلاف الكارت (رابط URL أو اختر من النماذج الجاهزة)</label>
                
                {/* Image URL text input */}
                <input 
                  type="text" 
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/fitness-plan.jpg..."
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:border-amber-500 transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />

                {/* Preset presets preview row */}
                <div className="flex flex-wrap gap-2 pt-1.5">
                  {IMAGE_PRESETS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setImageUrl(preset.url)}
                      className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border transition-all ${
                        imageUrl === preset.url 
                          ? 'bg-amber-500/10 text-amber-500 border-amber-500' 
                          : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Description summary */}
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1.5">نبذة مختصرة ووصف الخطة *</label>
                <textarea 
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="اكتب خلاصة البرنامج ومميزاته للطلبة والمشتركين..."
                  className={`w-full border rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {/* Detailed schedule guidelines */}
              <div>
                <label className="block text-[10px] text-slate-400 font-bold mb-1.5">روتين الجدول والتمارين بالتفصيل (يومي أو أسبوعي) *</label>
                <textarea 
                  required
                  rows={5}
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  placeholder="اكتب الخطة بالتفصيل. مثال:
اليوم الأول: تمرين صدر وأكتاف
اليوم الثاني: تمرين ظهر وترايسبس..."
                  className={`w-full border rounded-xl p-3 text-xs font-mono focus:outline-none focus:border-amber-500 transition-colors ${
                    isDark ? 'bg-slate-950 border-slate-800 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                  }`}
                />
              </div>

              {/* Modal footer submit action */}
              <div className="flex gap-2 justify-end border-t border-slate-800 pt-4 mt-2">
                <button 
                  type="button"
                  onClick={closeForm}
                  className="px-4 py-2 bg-slate-950 hover:bg-slate-850 text-slate-400 hover:text-slate-200 rounded-xl text-xs font-bold transition-colors"
                >
                  إلغاء الحفظ
                </button>

                <button 
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:brightness-110 text-slate-950 rounded-xl text-xs font-black shadow-lg shadow-amber-500/10 flex items-center gap-1.5 transition-all"
                >
                  {loading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  <span>{editingPlan ? 'حفظ وتحديث الخطة' : 'تأكيد إضافة الخطة لـ Supabase'}</span>
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
}
