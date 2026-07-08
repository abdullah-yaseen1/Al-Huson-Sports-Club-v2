import React, { useState, useEffect, useRef } from "react";
import { 
  Dumbbell, Calendar, User, TrendingUp, MessageSquare, Phone, MapPin, 
  Sparkles, CheckCircle2, AlertCircle, Clock, LogOut, ChevronRight, 
  Plus, X, Send, Activity, Bell, Percent, ShieldCheck, Heart, 
  Sparkle, Smartphone, Wifi, Battery, Facebook, Instagram
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Member, Subscription, ProgressLog, ClubService, Booking, ClubOffer, ChatMessage, AttendanceLog, FitnessChallenge, ChallengeProgress, BarItem, BarOrder, PushNotification, ClubHours } from "../types";
import { QrCode, Award, ShoppingBag, Flame, Zap, Coffee, ChevronLeft, Check, ListFilter, MessageCircle, RefreshCw, Globe, Sun, Moon } from "lucide-react";
import { translations } from "../utils/translations";

const exercisesByMuscle = {
  chest: [
    { name: "تمرين تجميع الصدر بالدمبلز (Incline Dumbbell Press)", sets: "4", reps: "10-12", tip: "ركز على النزول البطيء والتمدد الكامل لعضلة الصدر العلوية." },
    { name: "ضغط الصدر المستوي بالبار (Bench Press)", sets: "4", reps: "8", tip: "حافظ على ثبات كتفيك مائلين للخلف لحماية مفاصل الكتف." },
    { name: "تفتيح الصدر كابل كروس (Cable Crossover)", sets: "3", reps: "15", tip: "اعصر العضلة بقوة في المنتصف وثبت لمدة ثانية واحدة." }
  ],
  back: [
    { name: "سحب الظهر عريض (Lat Pulldown)", sets: "4", reps: "12", tip: "اسحب كوعك لأسفل وللخلف وليس بيديك لضمان عزل مجنص الظهر." },
    { name: "تجديف بالبار (Barbell Row)", sets: "4", reps: "8-10", tip: "حافظ على استقامة ظهرك بزاوية 45 درجة لتفادي إصابة أسفل الظهر." },
    { name: "سحب أرضي ضيق (Seated Cable Row)", sets: "3", reps: "12", tip: "افتح صدرك للأمام واعصر لوحي الكتف ببعضهما عند السحب." }
  ],
  legs: [
    { name: "تمرين السكوات بالبار (Barbell Squat)", sets: "4", reps: "8-10", tip: "انزل لعمق مناسب موازٍ للأرض وحافظ على اتجاه الركبتين للخارج." },
    { name: "دفع الأرجل بالآلة (Leg Press)", sets: "4", reps: "12", tip: "لا تقفل مفصل الركبة تماماً عند الدفع للأعلى لحمايته من الإصابة." },
    { name: "تمرين الرفرفة الخلفية (Lying Leg Curl)", sets: "3", reps: "15", tip: "اعصر العضلة الخلفية للأرجل عند أعلى نقطة وانزل ببطء شديد." }
  ],
  shoulders: [
    { name: "ضغط الأكتاف بالدمبلز (Dumbbell Shoulder Press)", sets: "4", reps: "10", tip: "حافظ على اتجاه المرفقين بزاوية 75 درجة للأمام قليلاً." },
    { name: "نشر جانبي بالدمبلز (Lateral Raise)", sets: "4", reps: "15", tip: "ارفع بوعيك أعلى من كف يدك لضمان استهداف الأكتاف الجانبية بالكامل." },
    { name: "سحب خلفي للحبل كابل (Face Pull)", sets: "3", reps: "15", tip: "تمرين ذهبي لتأهيل الأكتاف الخلفية وتعديل استقامة قوام الكتف." }
  ],
  arms: [
    { name: "تبادل البايسبس بالدمبلز (Dumbbell Bicep Curl)", sets: "3", reps: "12", tip: "لف معصمك للخارج عند الصعود لأقصى انقباض للبايسبس." },
    { name: "ترايسبس بوش داون بالحبل (Triceps Pushdown)", sets: "4", reps: "12", tip: "ثبت كوعك بجانب جسمك وافرد الحبل بالكامل بضغط الترايسبس." },
    { name: "تمرين الهمر للباي والساعد (Hammer Curl)", sets: "3", reps: "10", tip: "يقوي عضلات الساعد والعضدية العميقة لتبدو يديك ضخمة." }
  ],
  core: [
    { name: "تمرين المعدة الكلاسيكي (Crunches)", sets: "3", reps: "20", tip: "لا تسحب رقبتك بيدك بل اعتمد على تقليص جدار المعدة بالكامل." },
    { name: "تمرين البلانك الثابت (Plank Hold)", sets: "3", reps: "60 ثانية", tip: "حافظ على خط مستقيم من الكعب إلى الأكتاف واشدد بطنك ومؤخرتك." },
    { name: "رفع الأرجل معلق (Hanging Leg Raise)", sets: "3", reps: "15", tip: "تمرين جبار لعضلات البطن السفلية، انزل ببطء ولا تستعمل العزم." }
  ]
};

interface PhoneSimulatorProps {
  members: Member[];
  subscriptions: Subscription[];
  progressLogs: ProgressLog[];
  services: ClubService[];
  bookings: Booking[];
  offers: ClubOffer[];
  activeMember: Member | null;
  setActiveMember: (member: Member | null) => void;
  onAddBooking: (booking: Booking) => void;
  onAddProgressLog: (log: ProgressLog) => void;
  
  // 🌟 NEW Smart States & Actions
  attendanceLogs: AttendanceLog[];
  fitnessChallenges: FitnessChallenge[];
  challengeProgresses: ChallengeProgress[];
  barItems: BarItem[];
  barOrders: BarOrder[];
  onScanQR: (memberId: string) => void;
  onClaimReward: (memberId: string, challengeId: string) => void;
  onPlaceBarOrder: (order: BarOrder) => void;

  theme?: 'dark' | 'light';
  language?: 'ar' | 'en';
  clubName?: string;
  clubLogo?: string;
  loginBgImage?: string;
  clubFacebook?: string;
  clubInstagram?: string;
  clubTwitter?: string;
  clubTikTok?: string;
  clubWhatsApp?: string;
  onToggleLanguage?: () => void;
  onToggleTheme?: () => void;
  onRegisterMember?: (member: Member, subscriptionType: 'جيم' | 'شامل' | 'مسبح' | 'ملاكمة') => void;
  isStandalone?: boolean;
  notifications?: PushNotification[];
  setNotifications?: React.Dispatch<React.SetStateAction<PushNotification[]>>;
  clubHours?: ClubHours;
}

const renderClubLogo = (logo: string, className: string = "w-8 h-8 rounded-xl object-cover") => {
  const isUrlOrPath = logo.startsWith("http://") || logo.startsWith("https://") || logo.startsWith("/") || logo.startsWith("data:");
  if (isUrlOrPath) {
    return <img src={logo} alt="Club Logo" className={className} referrerPolicy="no-referrer" />;
  }
  return <div className={`${className} bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-lg select-none`}>{logo}</div>;
};

export default function PhoneSimulator({
  members,
  subscriptions,
  progressLogs,
  services,
  bookings,
  offers,
  activeMember,
  setActiveMember,
  onAddBooking,
  onAddProgressLog,
  
  // 🌟 NEW Smart Props Destructuring
  attendanceLogs,
  fitnessChallenges,
  challengeProgresses,
  barItems,
  barOrders,
  onScanQR,
  onClaimReward,
  onPlaceBarOrder,
  theme = 'dark',
  language = 'ar',
  clubName = "نادي الحصن الرياضي",
  clubLogo = "🏰",
  loginBgImage = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
  clubFacebook = "https://facebook.com/alhusongym",
  clubInstagram = "https://instagram.com/alhusongym",
  clubTwitter = "https://twitter.com/alhusongym",
  clubTikTok = "https://tiktok.com/@alhusongym",
  clubWhatsApp = "https://wa.me/962795551234",
  onToggleLanguage,
  onToggleTheme,
  onRegisterMember,
  isStandalone = false,
  notifications = [],
  setNotifications = () => {},
  clubHours = { womenStart: "08:00", womenEnd: "15:00", menStart: "15:00", menEnd: "01:00" },
}: PhoneSimulatorProps) {
  const t = translations[language];
  const isDark = theme === 'dark';

  // Theme Helper Variables (Custom unified premium black and gold scheme)
  const cardBg = 'bg-[#04060d]/90 border border-[#e2b857]/15';
  const cardBorder = 'border-[#e2b857]/20 shadow-xl shadow-black/60';
  const cardMutedBg = 'bg-slate-950/70 border border-[#e2b857]/10';
  const cardMutedBorder = 'border-slate-900';
  const cardSubBg = 'bg-[#04060d]/95 border border-slate-900';
  const cardSubBorder = 'border-slate-850';

  const textPrimary = 'text-slate-100';
  const textSecondary = 'text-slate-200';
  const textMuted = 'text-slate-400';
  const textSuperMuted = 'text-slate-500';

  // Dynamic shift status based on clubHours from props
  const getDynamicShiftStatus = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const totalMinutes = currentHour * 60 + currentMinute;

    const parseTimeToMinutes = (timeStr: string) => {
      if (!timeStr) return 0;
      const [h, m] = timeStr.split(':').map(Number);
      return h * 60 + (m || 0);
    };

    const womenStartMin = parseTimeToMinutes(clubHours?.womenStart || "08:00");
    const womenEndMin = parseTimeToMinutes(clubHours?.womenEnd || "15:00");
    const menStartMin = parseTimeToMinutes(clubHours?.menStart || "15:00");
    const menEndMin = parseTimeToMinutes(clubHours?.menEnd || "01:00");

    // If men's shift ends past midnight (e.g. 01:00 AM)
    if (menEndMin < menStartMin) {
      if (totalMinutes >= menStartMin || totalMinutes < menEndMin) {
        return { 
          type: 'men', 
          label: language === 'ar' ? 'فترة الرجال ♂️' : "Men's Shift ♂️", 
          time: `${clubHours?.menStart || "15:00"} - ${clubHours?.menEnd || "01:00"}`, 
          desc: language === 'ar' ? 'مخصص للرجال والشباب حالياً' : 'Currently for men & youth' 
        };
      }
    } else {
      if (totalMinutes >= menStartMin && totalMinutes < menEndMin) {
        return { 
          type: 'men', 
          label: language === 'ar' ? 'فترة الرجال ♂️' : "Men's Shift ♂️", 
          time: `${clubHours?.menStart || "15:00"} - ${clubHours?.menEnd || "01:00"}`, 
          desc: language === 'ar' ? 'مخصص للرجال والشباب حالياً' : 'Currently for men & youth' 
        };
      }
    }

    if (totalMinutes >= womenStartMin && totalMinutes < womenEndMin) {
      return { 
        type: 'women', 
        label: language === 'ar' ? 'فترة النساء ♀️' : "Women's Shift ♀️", 
        time: `${clubHours?.womenStart || "08:00"} - ${clubHours?.womenEnd || "15:00"}`, 
        desc: language === 'ar' ? 'مخصص للسيدات والنساء فقط حالياً' : 'Currently for ladies only' 
      };
    }

    return { 
      type: 'closed', 
      label: language === 'ar' ? 'الصالة مغلقة حالياً 🚫' : 'Gym Currently Closed 🚫', 
      time: `${clubHours?.menEnd || "01:00"} - ${clubHours?.womenStart || "08:00"}`, 
      desc: language === 'ar' ? 'نستقبلكم في الفترات المخصصة أعلاه' : 'We welcome you during the shifts above' 
    };
  };

  // Mobile UI Tabs: 'home' | 'progress' | 'services' | 'coach'
  const [activeTab, setActiveTab] = useState<'home' | 'progress' | 'services' | 'coach'>('home');
  const [loginInput, setLoginInput] = useState("");
  const [loginPasswordInput, setLoginPasswordInput] = useState("");
  const [loginError, setLoginError] = useState("");

  // 🔔 Real-Time Push Notification banner & modal states
  const [activeBannerNotification, setActiveBannerNotification] = useState<any>(null);
  const [showNotificationsModal, setShowNotificationsModal] = useState(false);
  const [smsNotification, setSmsNotification] = useState<{ sender: string; text: string } | null>(null);

  // Sound generator or custom trigger for notification banner arrival
  useEffect(() => {
    const handlePushEvent = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail) {
        setActiveBannerNotification(customEvent.detail);
        // Clear banner after 6 seconds
        setTimeout(() => {
          setActiveBannerNotification(null);
        }, 6000);
      }
    };
    window.addEventListener('push_notification_received', handlePushEvent);
    return () => window.removeEventListener('push_notification_received', handlePushEvent);
  }, []);

  // Listen for registration state switch event from Landing Page
  useEffect(() => {
    const handleSetRegisterState = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail !== undefined) {
        setIsRegistering(customEvent.detail.isRegistering);
      }
    };
    window.addEventListener('set_phone_register_state', handleSetRegisterState);
    return () => window.removeEventListener('set_phone_register_state', handleSetRegisterState);
  }, []);

  // Registration States
  const [isRegistering, setIsRegistering] = useState(false);
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regHeight, setRegHeight] = useState("175");
  const [regWeight, setRegWeight] = useState("75");
  const [regGoal, setRegGoal] = useState<'تنشيف' | 'تضخيم' | 'لياقة'>("لياقة");
  const [regSubType, setRegSubType] = useState<'جيم' | 'شامل' | 'مسبح' | 'ملاكمة'>("جيم");
  const [regGender, setRegGender] = useState<'ذكر' | 'أنثى'>("ذكر");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regError, setRegError] = useState("");
  const [regSuccess, setRegSuccess] = useState(false);
  
  // 🌟 NEW Sub-Views State for the Ultimate Features
  const [homeSubView, setHomeSubView] = useState<null | 'qr' | 'challenges' | 'protein' | 'muscle'>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanCompleted, setScanCompleted] = useState(false);
  const [selectedMuscle, setSelectedMuscle] = useState<'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core'>('chest');
  const [selectedBarCategory, setSelectedBarCategory] = useState<string>('all');
  const [barTab, setBarTab] = useState<'shop' | 'orders'>('shop');
  const [orderDeliveryLocation, setOrderDeliveryLocation] = useState<'الـ Gym' | 'الـ Pool' | 'الـ Outdoor'>('الـ Gym');
  
  // Service Booking Modal
  const [selectedService, setSelectedService] = useState<ClubService | null>(null);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("17:00");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingPlayersCount, setBookingPlayersCount] = useState<number>(10);
  const [bookingNotes, setBookingNotes] = useState<string>("");

  // Set correct default time slot based on gender when service is opened
  useEffect(() => {
    if (selectedService && activeMember) {
      if (activeMember.gender === 'أنثى') {
        setBookingTime("08:00");
      } else {
        setBookingTime("15:00");
      }
      setBookingSuccess(false);
    }
  }, [selectedService, activeMember]);

  // New Progress measurement from App
  const [newWeight, setNewWeight] = useState("");
  const [newFat, setNewFat] = useState("");
  const [newMuscle, setNewMuscle] = useState("");
  const [showProgressForm, setShowProgressForm] = useState(false);

  // AI Coach Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState("");
  const [isAiTyping, setIsAiTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Active sub details
  const activeSub = activeMember 
    ? subscriptions.find(s => s.memberId === activeMember.id && s.status === 'فعال') 
      || subscriptions.find(s => s.memberId === activeMember.id)
    : null;

  const memberLogs = activeMember 
    ? progressLogs.filter(log => log.memberId === activeMember.id).sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    : [];

  // Active log metrics
  const latestLog = memberLogs[memberLogs.length - 1] || null;
  const initialLog = memberLogs[0] || null;

  // Calculate days remaining dynamically
  const getDaysRemaining = (endDateStr: string) => {
    const end = new Date(endDateStr);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  const daysRemaining = activeSub ? getDaysRemaining(activeSub.endDate) : 0;

  // Initialize AI Welcome Message and fetch chat history from Supabase
  useEffect(() => {
    if (!activeMember) return;

    const fetchChatHistory = async () => {
      const welcomeMsg: ChatMessage = {
        id: "welcome",
        sender: "assistant",
        text: `يا هلا والله بالبطل ${activeMember.name}! 🏋️🔥\nأنا مدربك الشخصي الذكي "الكابتن حُصين" من نادي الحصن.\n\nشفت بياناتك وهدفك الرائع وهو: **(${activeMember.goal})**.\nكيف تبيني أساعدك اليوم؟ تقدر تسألني عن جدول التمارين المناسب لوزنك (${latestLog?.weight || activeMember.weight} كجم) أو تطلب نصائح تغذية ودايت تناسبك! 🥦🥩`,
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };

      try {
        const { supabase } = await import("../lib/supabase");
        if (supabase) {
          const { data, error } = await supabase
            .from("chat_messages")
            .select("*")
            .order("timestamp", { ascending: true });

          if (!error && data && data.length > 0) {
            setChatMessages([welcomeMsg, ...data]);
            return;
          }
        }
      } catch (err) {
        console.error("Error loading chat history from Supabase:", err);
      }

      setChatMessages([welcomeMsg]);
    };

    fetchChatHistory();
  }, [activeMember]);

  // Scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const handleRegistrationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError("");
    setRegSuccess(false);

    if (!regName.trim() || !regPhone.trim() || !regPassword.trim() || !regConfirmPassword.trim()) {
      setRegError(language === 'ar' ? "الرجاء ملء جميع الحقول الإلزامية" : "Please fill all required fields");
      return;
    }

    // Jordanian phone number validation: start with 079, 078, 077 or +96277, +96278, +96279
    const cleanPhone = regPhone.trim().replace(/\s+/g, '');
    const jordanPhoneRegex = /^(077|078|079|\+96277|\+96278|\+96279)\d{7}$/;
    if (!jordanPhoneRegex.test(cleanPhone)) {
      setRegError(t.loginErrorJordanPhone || "رقم الهاتف يجب أن يكون هاتفاً أردنياً صحيحاً يبدأ بـ 079 أو 078 أو 077 ويتكون من 10 أرقام");
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setRegError(t.regErrorMatch || "كلمتا المرور غير متطابقتين!");
      return;
    }

    // Check for duplicate phone or email
    const duplicate = members.find(m => 
      m.phone.replace(/\s+/g, '') === cleanPhone || 
      (regEmail.trim() && m.email.toLowerCase() === regEmail.trim().toLowerCase())
    );
    if (duplicate) {
      setRegError(t.regErrorExist || "رقم الهاتف أو البريد الإلكتروني مسجل مسبقاً!");
      return;
    }

    const finalEmail = regEmail.trim() ? regEmail.trim().toLowerCase() : `${cleanPhone}@alhuson.com`;
    const newMemberId = "mem-" + Math.random().toString(36).substr(2, 9);

    const newMember: Member = {
      id: newMemberId,
      name: regName.trim(),
      phone: cleanPhone,
      email: finalEmail,
      height: parseFloat(regHeight) || 175,
      weight: parseFloat(regWeight) || 75,
      fat: 18,
      muscle: 38,
      goal: regGoal,
      gender: regGender,
      password: regPassword.trim(),
      createdAt: new Date().toISOString().split('T')[0],
      points: 0,
      status: 'قيد الانتظار',
    };

    // Use Supabase auth if connected
    const { supabase } = await import("../lib/supabase");
    if (supabase) {
      try {
        // Sign up with Supabase Authentication using email and password
        const { data: authData, error: authErr } = await supabase.auth.signUp({
          email: finalEmail,
          password: regPassword.trim(),
          options: {
            data: {
              full_name: regName.trim(),
              phone: cleanPhone,
            }
          }
        });
        
        if (authErr) {
          console.error("Supabase Auth SignUp error (continuing with database insert):", authErr.message);
        }
      } catch (err) {
        console.error("Supabase Auth sign up exception:", err);
      }
    }

    if (onRegisterMember) {
      onRegisterMember(newMember, regSubType);
      setRegSuccess(true);
      
      // Clear inputs
      setRegName("");
      setRegPhone("");
      setRegEmail("");
      setRegPassword("");
      setRegConfirmPassword("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");

    const inputVal = loginInput.trim();
    const passwordVal = loginPasswordInput.trim();

    if (!inputVal || !passwordVal) {
      setLoginError(t.loginErrorEmpty || "الرجاء إدخال البريد الإلكتروني أو الهاتف مع كلمة المرور");
      return;
    }

    // Resolve user by email or phone
    const cleanInput = inputVal.replace(/\s+/g, '');
    const foundUser = members.find(
      m => m.email.toLowerCase() === inputVal.toLowerCase() || 
           m.phone.replace(/\s+/g, '') === cleanInput
    );

    if (!foundUser) {
      setLoginError(t.loginErrorUser || "عذراً، هذا المشترك غير مسجل في نظام النادي. الرجاء تواصل مع الإدارة أو تسجيل حساب جديد!");
      return;
    }

    // Verify password locally
    const expectedPassword = foundUser.password || foundUser.phone.slice(-4) || '1234';
    if (passwordVal !== expectedPassword) {
      setLoginError(t.loginErrorPassword || "كلمة المرور غير صحيحة! يرجى الاستفسار من الكابتن أو المحاولة مجدداً.");
      return;
    }

    // Use Supabase authentication if available
    const { supabase } = await import("../lib/supabase");
    if (supabase) {
      try {
        // Sign in with Supabase Authentication using email and password
        const { error: authErr } = await supabase.auth.signInWithPassword({
          email: foundUser.email,
          password: passwordVal,
        });
        if (authErr) {
          console.warn("Supabase Auth SignIn warning (continuing with database user):", authErr.message);
        }
      } catch (err) {
        console.error("Supabase Auth sign in exception:", err);
      }
    }

    // Complete login successfully
    setActiveMember(foundUser);
    setLoginInput("");
    setLoginPasswordInput("");
    setActiveTab('home');
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || !activeMember) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: userInput,
      timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
    };

    setChatMessages(prev => [...prev, userMsg]);
    setUserInput("");
    setIsAiTyping(true);

    try {
      const { supabase } = await import("../lib/supabase");
      if (supabase) {
        await supabase.from("chat_messages").insert([{
          id: userMsg.id,
          sender: userMsg.sender,
          text: userMsg.text,
          timestamp: new Date().toISOString()
        }]);
      }
    } catch (err) {
      console.error("Error saving user message to Supabase:", err);
    }

    try {
      const response = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          memberStats: {
            name: activeMember.name,
            height: activeMember.height,
            weight: latestLog?.weight || activeMember.weight,
            fat: latestLog?.fat || activeMember.fat,
            muscle: latestLog?.muscle || activeMember.muscle,
            goal: activeMember.goal
          },
          messages: [...chatMessages, userMsg].map(m => ({
            sender: m.sender,
            text: m.text
          }))
        })
      });

      const data = await response.json();
      
      const coachMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.reply || "أهلاً بك يا بطل! واجهت مشكلة بسيطة، اسألني مجدداً 💪",
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => [...prev, coachMsg]);

      try {
        const { supabase } = await import("../lib/supabase");
        if (supabase) {
          await supabase.from("chat_messages").insert([{
            id: coachMsg.id,
            sender: coachMsg.sender,
            text: coachMsg.text,
            timestamp: new Date().toISOString()
          }]);
        }
      } catch (err) {
        console.error("Error saving assistant message to Supabase:", err);
      }
    } catch (error) {
      console.error(error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: "عذراً يا بطل، يبدو أن هناك مشكلة في الاتصال بالخادم الرئيسي للمدرب الافتراضي. تأكد من أنك قمت بتفعيل مفتاح Gemini API في لوحة Secrets الخاص بالمنصة! 🔌💻",
        timestamp: new Date().toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })
      };
      setChatMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsAiTyping(false);
    }
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMember || !selectedService) return;

    if (!bookingDate) {
      alert("الرجاء تحديد تاريخ الحجز");
      return;
    }

    const newBooking: Booking = {
      id: "book-" + Math.random().toString(36).substr(2, 9),
      memberId: activeMember.id,
      memberName: activeMember.name,
      memberPhone: activeMember.phone,
      serviceId: selectedService.id,
      serviceTitle: selectedService.title,
      date: bookingDate,
      timeSlot: bookingTime,
      status: 'قيد الانتظار',
      createdAt: new Date().toISOString(),
      playersCount: selectedService.id === 'srv-4' ? bookingPlayersCount : undefined,
      notes: selectedService.id === 'srv-4' ? bookingNotes : undefined,
    };

    onAddBooking(newBooking);
    setBookingSuccess(true);
    setTimeout(() => {
      setBookingSuccess(false);
      setSelectedService(null);
      setBookingDate("");
    }, 2000);
  };

  const handleAddMeasurement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeMember) return;

    const w = parseFloat(newWeight);
    const f = parseFloat(newFat);
    const m = parseFloat(newMuscle);

    if (isNaN(w) || isNaN(f) || isNaN(m)) {
      alert("الرجاء إدخال أرقام صحيحة للقياسات البدنية");
      return;
    }

    const newLog: ProgressLog = {
      id: "log-" + Math.random().toString(36).substr(2, 9),
      memberId: activeMember.id,
      weight: w,
      fat: f,
      muscle: m,
      date: new Date().toISOString().split('T')[0]
    };

    onAddProgressLog(newLog);
    setNewWeight("");
    setNewFat("");
    setNewMuscle("");
    setShowProgressForm(false);
  };

  // Modern SVG Progress Chart
  const renderSVGChart = (metric: 'weight' | 'fat' | 'muscle') => {
    if (memberLogs.length === 0) return null;

    const values = memberLogs.map(log => log[metric]);
    const minVal = Math.min(...values) * 0.95;
    const maxVal = Math.max(...values) * 1.05;
    const valRange = maxVal - minVal || 1;

    const width = 280;
    const height = 120;
    const padding = 15;

    // Generate points
    const points = memberLogs.map((log, index) => {
      const x = padding + (index / (memberLogs.length - 1 || 1)) * (width - padding * 2);
      const y = height - padding - ((log[metric] - minVal) / valRange) * (height - padding * 2);
      return { x, y, value: log[metric], date: log.date };
    });

    const pathData = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
    
    // Gradient fill path
    const areaPathData = points.length > 0
      ? `${pathData} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`
      : '';

    return (
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
        <defs>
          <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#F59E0B" stopOpacity="0.0" />
          </linearGradient>
        </defs>
        {/* Horizontal grid lines */}
        <line x1={padding} y1={height/2} x2={width-padding} y2={height/2} stroke="rgba(255, 255, 255, 0.1)" strokeDasharray="3,3" />
        <line x1={padding} y1={height-padding} x2={width-padding} y2={height-padding} stroke="rgba(255, 255, 255, 0.1)" />

        {/* Shaded Area */}
        {points.length > 1 && <path d={areaPathData} fill="url(#chart-grad)" />}

        {/* Main Line */}
        {points.length > 1 && (
          <path d={pathData} fill="none" stroke="#F59E0B" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Data Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4" fill="#0F172A" stroke="#F59E0B" strokeWidth="2" />
            <text x={p.x} y={p.y - 8} fontSize="9" fill="#F59E0B" fontWeight="bold" textAnchor="middle" className="font-mono">
              {p.value}
            </text>
            <text x={p.x} y={height - 2} fontSize="7" fill="#64748B" textAnchor="middle">
              {p.date.split('-')[2]} / {p.date.split('-')[1]}
            </text>
          </g>
        ))}
      </svg>
    );
  };

  return (
    <div 
      id="phone-simulation-container" 
      className={isStandalone ? "w-full min-h-screen flex flex-col" : "flex flex-col items-center"}
    >
      {/* Phone Case Frame */}
      <div 
        id="iphone-chassis" 
        className={isStandalone 
          ? "relative w-full min-h-screen flex flex-col transition-colors duration-300 bg-[#070a13] text-white"
          : "relative w-[320px] h-[615px] rounded-[44px] border-[8px] border-[#e2b857]/45 shadow-[0_0_50px_rgba(226,184,87,0.2)] bg-[#070a13] text-white overflow-hidden flex flex-col transition-colors duration-300"
        }
      >
        

        {!isStandalone && (
          <>
            {/* Dynamic Island / Notch */}
            <div id="dynamic-island" className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-6 bg-slate-950 border border-[#e2b857]/15 rounded-full z-50 flex items-center justify-between px-3">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-900"></div>
              <div className="w-8 h-1 rounded-full bg-slate-900"></div>
            </div>

            {/* Status Bar */}
            <div 
              id="phone-status-bar" 
              className="h-10 flex items-center justify-between px-6 pt-1 text-[11px] font-bold z-40 bg-[#070a13] text-[#e2b857]/90"
            >
              <div className="font-mono">18:00</div>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3.5 h-3.5" />
                <span className="text-[9px]">5G</span>
                <Battery className="w-4 h-4 text-emerald-500 fill-emerald-500" />
              </div>
            </div>
          </>
        )}

        {/* Main Phone Content Screen */}
        <div 
          id="phone-screen" 
          style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }} 
          className="flex-1 flex flex-col relative select-none overflow-hidden bg-[#070a13] text-white"
        >
          {/* Real-time SMS Notification Toast Simulation */}
          <AnimatePresence>
            {smsNotification && (
              <motion.div
                initial={{ opacity: 0, y: -100, scale: 0.9 }}
                animate={{ opacity: 1, y: 12, scale: 1 }}
                exit={{ opacity: 0, y: -100, scale: 0.9 }}
                className="absolute left-3 right-3 bg-slate-950/95 backdrop-blur border border-amber-500/30 text-white rounded-2xl p-3.5 shadow-2xl z-[100] text-right space-y-1.5"
                style={{ direction: "rtl" }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
                    <span className="text-[10px] font-bold text-slate-400 font-mono">الآن (SMS)</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs font-black text-amber-500">
                    <span>💬 رسالة قصيرة واردة</span>
                  </div>
                </div>
                <div className="text-[11px] font-bold text-slate-300">
                  {smsNotification.sender}
                </div>
                <div className="text-[11px] text-slate-100 leading-relaxed font-mono select-text">
                  {smsNotification.text}
                </div>
                <div className="flex justify-between items-center pt-1.5 border-t border-slate-800/60">
                  <span className="text-[9px] text-amber-500/70 font-mono">بوابة تحقق الحصن الذكية</span>
                  <button 
                    onClick={() => setSmsNotification(null)}
                    className="text-[10px] font-bold text-slate-400 hover:text-white px-2 py-0.5 rounded-lg bg-slate-800"
                  >
                    تم
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          <AnimatePresence mode="wait">
            {!activeMember ? (
              // LOGIN STATE
              <motion.div 
                key="login"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col justify-start px-6 py-8 overflow-y-auto relative scrollbar-thin scrollbar-thumb-amber-500/20"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(7, 10, 19, 0.82), rgba(7, 10, 19, 0.96)), url(${loginBgImage})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center"
                }}
              >
                <div className="my-auto w-full flex flex-col py-4 shrink-0">
                  <div className="text-center mb-8 flex flex-col items-center">
                    <div className="mb-3">
                      {renderClubLogo(clubLogo, "w-16 h-16 rounded-3xl object-cover shadow-lg border border-[#e2b857]/30")}
                    </div>
                    <h2 id="phone-club-title" className="text-2xl font-black text-[#e2b857] tracking-tight">{clubName}</h2>
                    <p className="text-xs mt-1 font-light text-slate-400">{t.userAppPortal}</p>
                  </div>

                 {isRegistering ? (
                  regSuccess ? (
                    <div className="space-y-6 text-center py-4">
                      <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto">
                        <Check className="w-8 h-8" />
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-black text-slate-100">
                          {language === 'ar' ? 'تم تقديم طلب الاشتراك بنجاح! 🎉' : 'Subscription requested successfully! 🎉'}
                        </h3>
                        <p className="text-xs text-[#e2b857] font-bold">
                          {language === 'ar' ? 'حالة حسابك: 🟡 قيد الانتظار بانتظار الدفع والتفعيل' : 'Account status: 🟡 Pending payment and activation'}
                        </p>
                      </div>
                      <div className={`p-4 rounded-xl border border-[#e2b857]/15 bg-[#04060d]/80 space-y-2 text-xs leading-relaxed text-slate-200 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <p>• {language === 'ar' ? 'الاسم:' : 'Name:'} <span className="font-bold">{regName}</span></p>
                        <p>• {language === 'ar' ? 'الهاتف:' : 'Phone:'} <span className="font-bold font-mono">{regPhone}</span></p>
                        <p>• {language === 'ar' ? 'الباقة المطلوبة:' : 'Requested Package:'} <span className="font-bold">
                          {regSubType === 'شامل' ? (language === 'ar' ? 'الاشتراك الشامل + مسبح - 499 د.أ' : 'All-Inclusive + Pool - 499 JOD') :
                           regSubType === 'جيم' ? (language === 'ar' ? 'حديد ولياقة (جيم) - 299 د.أ' : 'Gym & Fitness (Gym) - 299 JOD') :
                           regSubType === 'مسبح' ? (language === 'ar' ? 'المسبح الأولمبي فقط - 250 د.أ' : 'Olympic Pool Only - 250 JOD') :
                           (language === 'ar' ? 'ملاكمة وكيك بوكسينغ - 350 د.أ' : 'Boxing & Kickboxing - 350 JOD')}
                        </span></p>
                        <p className="border-t border-[#e2b857]/10 pt-2 text-slate-400">
                          {language === 'ar'
                            ? 'الرجاء التوجه لمكتب استقبال صالة **نادي الحصن الرياضي** في إربد لدفع قيمة الاشتراك وتفعيل حسابك والبدء فوراً بالتمرين!'
                            : 'Please proceed to the reception desk of **Al Huson Sports Club** in Irbid to pay the subscription fee, activate your account, and start training immediately!'}
                        </p>
                      </div>
                      <button
                        onClick={() => {
                          setRegSuccess(false);
                          setIsRegistering(false);
                          setLoginInput(regPhone); // Prefill phone for login!
                        }}
                        className="w-full bg-[#e2b857] hover:bg-[#e2b857]/90 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-all cursor-pointer"
                      >
                        {language === 'ar' ? 'الذهاب لشاشة تسجيل الدخول' : 'Go to Login Screen'}
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleRegistrationSubmit} className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-[#e2b857]/15">
                        <h3 className="text-sm font-black text-[#e2b857]">
                          {language === 'ar' ? 'عضو جديد؟ سجل اشتراكك الآن 🏆' : 'New Member? Register Now 🏆'}
                        </h3>
                        <button 
                          type="button" 
                          onClick={() => { setIsRegistering(false); setRegError(""); }} 
                          className="text-slate-400 hover:text-[#e2b857] text-xs font-bold cursor-pointer"
                        >
                          {language === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                      </div>

                      <div className={`space-y-3 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'الاسم الكامل للمشترك *' : 'Full Name *'}</label>
                          <input 
                            type="text" 
                            required
                            value={regName}
                            onChange={(e) => setRegName(e.target.value)}
                            placeholder={language === 'ar' ? 'مثال: يزن البطاينة' : 'e.g., Yazan Al-Batayneh'}
                            className="w-full border border-[#e2b857]/15 bg-[#04060d]/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] transition-colors"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'رقم الهاتف الجوال الأردني *' : 'Jordan Mobile Phone *'}</label>
                            <input 
                              type="text" 
                              required
                              value={regPhone}
                              onChange={(e) => setRegPhone(e.target.value)}
                              placeholder="07XXXXXXXX"
                              className="w-full border border-[#e2b857]/15 bg-[#04060d]/80 rounded-xl px-3 py-2 text-xs font-mono text-left text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'البريد الإلكتروني (اختياري)' : 'Email Address (Optional)'}</label>
                            <input 
                              type="email" 
                              value={regEmail}
                              onChange={(e) => setRegEmail(e.target.value)}
                              placeholder="name@example.com"
                              className="w-full border border-[#e2b857]/15 bg-[#04060d]/80 rounded-xl px-3 py-2 text-xs font-mono text-left text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'الطول الحالي (سم)' : 'Current Height (cm)'}</label>
                            <input 
                              type="number" 
                              value={regHeight}
                              onChange={(e) => setRegHeight(e.target.value)}
                              className="w-full border border-[#e2b857]/15 bg-[#04060d]/80 rounded-xl px-3 py-2 text-xs font-mono text-center text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] transition-colors"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'الوزن الحالي (كجم)' : 'Current Weight (kg)'}</label>
                            <input 
                              type="number" 
                              value={regWeight}
                              onChange={(e) => setRegWeight(e.target.value)}
                              className="w-full border border-[#e2b857]/15 bg-[#04060d]/80 rounded-xl px-3 py-2 text-xs font-mono text-center text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] transition-colors"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'الهدف البدني الرئيسي' : 'Main Fitness Goal'}</label>
                            <select 
                              value={regGoal}
                              onChange={(e) => setRegGoal(e.target.value as any)}
                              className="w-full border border-[#e2b857]/15 bg-[#04060d]/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e2b857] transition-colors font-semibold"
                            >
                              <option value="لياقة">{language === 'ar' ? 'لياقة بدنية وصحة' : 'Fitness & Health'}</option>
                              <option value="تنشيف">{language === 'ar' ? 'تنشيف وخسارة دهون' : 'Shredding & Fat Loss'}</option>
                              <option value="تضخيم">{language === 'ar' ? 'تضخيم وبناء عضلات' : 'Bulking & Muscle Gain'}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'باقة الاشتراك المفضلة' : 'Preferred Subscription Package'}</label>
                            <select 
                              value={regSubType}
                              onChange={(e) => setRegSubType(e.target.value as any)}
                              className="w-full border border-[#e2b857]/15 bg-[#04060d]/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e2b857] transition-colors font-semibold"
                            >
                              <option value="جيم">{language === 'ar' ? 'حديد ولياقة (جيم) - 299 د.أ' : 'Gym & Fitness (Gym) - 299 JOD'}</option>
                              <option value="شامل">{language === 'ar' ? 'الاشتراك الشامل + مسبح - 499 د.أ' : 'All-Inclusive + Pool - 499 JOD'}</option>
                              <option value="مسبح">{language === 'ar' ? 'المسبح الأولمبي فقط - 250 د.أ' : 'Olympic Pool Only - 250 JOD'}</option>
                              <option value="ملاكمة">{language === 'ar' ? 'ملاكمة وكيك بوكسينغ - 350 د.أ' : 'Boxing & Kickboxing - 350 JOD'}</option>
                            </select>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'الجنس *' : 'Gender *'}</label>
                            <select 
                              value={regGender}
                              onChange={(e) => setRegGender(e.target.value as 'ذكر' | 'أنثى')}
                              className="w-full border border-[#e2b857]/15 bg-[#04060d]/90 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#e2b857] transition-colors font-bold"
                            >
                              <option value="ذكر">{language === 'ar' ? 'ذكر ♂' : 'Male ♂'}</option>
                              <option value="أنثى">{language === 'ar' ? 'أنثى ♀' : 'Female ♀'}</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'كلمة المرور *' : 'Password *'}</label>
                            <input 
                              type="password" 
                              required
                              value={regPassword}
                              onChange={(e) => setRegPassword(e.target.value)}
                              placeholder={language === 'ar' ? 'أدخل كلمة مرور قوية' : 'Enter strong password'}
                              className="w-full border border-[#e2b857]/15 bg-[#04060d]/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'تأكيد كلمة المرور *' : 'Confirm Password *'}</label>
                          <input 
                            type="password" 
                            required
                            value={regConfirmPassword}
                            onChange={(e) => setRegConfirmPassword(e.target.value)}
                            placeholder={language === 'ar' ? 'أعد إدخال كلمة المرور' : 'Re-enter password'}
                            className="w-full border border-[#e2b857]/15 bg-[#04060d]/80 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] transition-colors"
                          />
                        </div>

                        {regError && (
                          <div className="text-rose-500 text-xs flex items-center gap-1 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                            <AlertCircle className="w-4 h-4 shrink-0" />
                            <span>{regError}</span>
                          </div>
                        )}

                        <button 
                          type="submit"
                          className="w-full bg-[#e2b857] hover:bg-[#e2b857]/90 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-[#e2b857]/15 cursor-pointer"
                        >
                          {language === 'ar' ? 'تأكيد التسجيل وتقديم الطلب ⚡' : 'Confirm Registration & Submit Request ⚡'}
                        </button>

                        <button 
                          type="button" 
                          onClick={() => { setIsRegistering(false); setRegError(""); }}
                          className="w-full text-center text-slate-400 hover:text-[#e2b857] text-[11px] font-semibold mt-1 cursor-pointer"
                        >
                          {language === 'ar' ? 'لديك حساب بالفعل؟ سجل دخولك' : 'Already have an account? Log in'}
                        </button>
                      </div>
                    </form>
                  )
                ) : (
                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                      <label className="block text-xs mb-1.5 font-medium text-slate-400">{t.phoneOrEmail}</label>
                      <input 
                        type="text" 
                        value={loginInput}
                        onChange={(e) => setLoginInput(e.target.value)}
                        placeholder={t.loginPlaceholder}
                        className="w-full border border-[#e2b857]/15 bg-[#04060d]/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] transition-colors"
                      />
                    </div>

                    <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                      <label className="block text-xs mb-1.5 font-medium text-slate-400">{language === 'ar' ? 'كلمة المرور للدخول *' : 'Password *'}</label>
                      <input 
                        type="password" 
                        value={loginPasswordInput}
                        onChange={(e) => setLoginPasswordInput(e.target.value)}
                        placeholder={language === 'ar' ? 'أدخل كلمة السر الخاصة بك' : 'Enter your password'}
                        className="w-full border border-[#e2b857]/15 bg-[#04060d]/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] transition-colors"
                      />
                    </div>

                    {loginError && (
                      <div className="text-rose-500 text-xs flex items-center gap-1 bg-rose-500/10 p-2.5 rounded-lg border border-rose-500/20">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{loginError}</span>
                      </div>
                    )}

                    <button 
                      type="submit"
                      className="w-full bg-[#e2b857] hover:bg-[#e2b857]/90 text-slate-950 font-black py-3 px-4 rounded-xl text-sm transition-colors shadow-lg shadow-[#e2b857]/15 cursor-pointer"
                    >
                      {t.secureLogin}
                    </button>

                    <div className="relative flex py-1 items-center">
                      <div className="flex-grow border-t border-[#e2b857]/15"></div>
                      <span className="flex-shrink mx-4 text-slate-400 text-[10px]">{language === 'ar' ? 'أو سجل كعضو جديد' : 'Or register as a new member'}</span>
                      <div className="flex-grow border-t border-[#e2b857]/15"></div>
                    </div>

                    <button 
                      type="button"
                      onClick={() => {
                        setIsRegistering(true);
                        setLoginError("");
                      }}
                      className="w-full bg-[#04060d]/80 hover:bg-[#04060d]/95 border border-[#e2b857]/30 text-[#e2b857] font-bold py-2.5 px-4 rounded-xl text-xs transition-colors cursor-pointer"
                    >
                      {language === 'ar' ? '✨ إنشاء حساب مشترك جديد (تسجيل)' : '✨ Register New Member Account'}
                    </button>

                    <div className={`border border-[#e2b857]/15 bg-[#04060d]/60 rounded-xl p-3 text-[11px] mt-4 leading-relaxed text-slate-400 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                      💡 <span className="font-semibold text-[#e2b857]">{t.quickDemoAccountTip}:</span>
                      <ul className={`list-disc mt-1 space-y-0.5 font-mono ${language === 'ar' ? 'mr-4' : 'ml-4'}`}>
                        <li>0795551234 {language === 'ar' ? '(أحمد الشوبكي - الباسورد: 1234)' : '(Ahmad Al-Shobaki - Password: 1234)'}</li>
                        <li>0786665678 {language === 'ar' ? '(سارة المومني - الباسورد: 1234)' : '(Sarah Al-Momani - Password: 1234)'}</li>
                        <li>0777779876 {language === 'ar' ? '(محمد البطاينة - الباسورد: 1234)' : '(Mohammad Al-Batayneh - Password: 1234)'}</li>
                      </ul>
                    </div>
                  </form>
                )}
                </div>
              </motion.div>
            ) : (
              // ACTIVE LOGGED IN USER VIEWS
              <motion.div 
                key="app"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 flex flex-col min-h-0 h-full overflow-hidden"
              >
                {/* Header App Bar */}
                <div className="h-14 border-b border-[#e2b857]/15 px-4 flex items-center justify-between sticky top-0 bg-[#070a13]/95 backdrop-blur-md z-30 text-white">
                  <div className="flex items-center gap-2">
                    {renderClubLogo(clubLogo, "w-8 h-8 rounded-xl object-cover")}
                    <div>
                      <h1 className={`text-xs font-black leading-none ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{clubName}</h1>
                      <span className="text-[9px] text-amber-500 font-bold">{t.championPortal}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* 🔔 Notifications Bell with active badge */}
                    {activeMember && activeMember.status !== 'قيد الانتظار' && (
                      <button 
                        onClick={() => setShowNotificationsModal(true)}
                        className="p-1.5 rounded-lg transition-colors relative bg-slate-900 hover:bg-slate-800 text-[#e2b857] border border-[#e2b857]/15 cursor-pointer"
                        title="الإشعارات"
                      >
                        <Bell className="w-3.5 h-3.5" />
                        {notifications.filter(n => n.memberId === 'all' || n.memberId === activeMember.id).filter(n => !n.read).length > 0 && (
                          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-rose-500 text-[8px] text-white flex items-center justify-center font-bold font-mono border border-slate-900">
                            {notifications.filter(n => n.memberId === 'all' || n.memberId === activeMember.id).filter(n => !n.read).length}
                          </span>
                        )}
                      </button>
                    )}

                    {/* Inner app language toggle */}
                    {onToggleLanguage && (
                      <button 
                        onClick={onToggleLanguage}
                        className="p-1.5 rounded-lg transition-colors text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-[#e2b857] border border-[#e2b857]/15 cursor-pointer"
                        title="العربية / English"
                      >
                        <Globe className="w-3.5 h-3.5" />
                      </button>
                    )}



                    <button 
                      onClick={() => setActiveMember(null)}
                      className="p-1.5 rounded-lg transition-colors bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-rose-400 border border-[#e2b857]/10 cursor-pointer"
                      title={t.logout}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Sub Tab Screen content */}
                <div className="flex-1 min-h-0 p-4 pb-28 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-amber-500/20">
                  
                  {activeMember.status === 'قيد الانتظار' ? (
                    <motion.div
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-6 text-center py-8 px-4 font-sans"
                    >
                      <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center mx-auto animate-pulse">
                        <Clock className="w-8 h-8" />
                      </div>

                      <div className="space-y-2">
                        <h3 className={`text-sm font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                          {language === 'ar' ? `أهلاً بك يا بطل، ${activeMember.name} 👋` : `Welcome, champion, ${activeMember.name} 👋`}
                        </h3>
                        <p className="text-[11px] text-amber-500 font-bold leading-relaxed">
                          {language === 'ar' ? 'حالة الحساب: 🟡 قيد الانتظار بانتظار الدفع والتفعيل في الصالة' : 'Account Status: 🟡 Pending payment and activation at the gym'}
                        </p>
                      </div>

                      <div className={`p-4 rounded-2xl border space-y-3 ${
                        theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                      } ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                        <h4 className={`text-xs font-black ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                          {language === 'ar' ? '📋 تفاصيل طلب الاشتراك الخاص بك:' : '📋 Your Subscription Details:'}
                        </h4>
                        
                        <div className="grid grid-cols-2 gap-2.5 text-xs">
                          <div className={`p-2 rounded-xl bg-slate-900/40 border border-slate-800 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            <span className="text-[9px] text-slate-400 block mb-0.5">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</span>
                            <span className={`font-mono font-bold text-[10px] ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{activeMember.phone}</span>
                          </div>
                          <div className={`p-2 rounded-xl bg-slate-900/40 border border-slate-800 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            <span className="text-[9px] text-slate-400 block mb-0.5">{language === 'ar' ? 'الباقة المطلوبة' : 'Requested Package'}</span>
                            <span className={`font-bold text-[10px] ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                              {activeMember.pendingSubType === 'شامل' ? (language === 'ar' ? 'الاشتراك الشامل' : 'All-Inclusive') :
                               activeMember.pendingSubType === 'مسبح' ? (language === 'ar' ? 'المسبح فقط' : 'Pool Only') :
                               activeMember.pendingSubType === 'ملاكمة' ? (language === 'ar' ? 'ملاكمة' : 'Boxing') :
                               (language === 'ar' ? 'حديد ولياقة' : 'Gym & Fitness')}
                            </span>
                          </div>
                          <div className={`p-2 rounded-xl bg-slate-900/40 border border-slate-800 col-span-2 flex justify-between items-center ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                              <span className="text-[9px] text-slate-400 block">{language === 'ar' ? 'المبلغ المطلوب دفعه عند الوصول' : 'Required amount to pay on arrival'}</span>
                              <span className="text-xs font-black text-amber-500">
                                {activeMember.pendingSubType === 'شامل' ? '499 JOD' :
                                 activeMember.pendingSubType === 'مسبح' ? '250 JOD' :
                                 activeMember.pendingSubType === 'ملاكمة' ? '350 JOD' :
                                 '299 JOD'}
                              </span>
                            </div>
                            <div className="bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded-lg text-[9px] font-black border border-amber-500/20">
                              {language === 'ar' ? 'نقداً أو بطاقة' : 'Cash or Card'}
                            </div>
                          </div>
                        </div>

                        <div className={`p-3 rounded-xl border leading-relaxed text-[10px] text-slate-400 space-y-1.5 ${
                          theme === 'dark' ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-slate-200'
                        } ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                          <p className="font-bold text-amber-500">{language === 'ar' ? '💡 ماذا تفعل الآن؟' : '💡 What to do now?'}</p>
                          <p>{language === 'ar' ? '1. تفضل بزيارة صالة **نادي الحصن الرياضي** في إربد، الحصن.' : '1. Visit Al Huson Sports Club in Irbid, Al Huson.'}</p>
                          <p>{language === 'ar' ? '2. أبلغ موظف الاستقبال أو الكابتن باسمك لتأكيد دفع الرسوم.' : '2. Inform the receptionist or coach of your name to confirm payment.'}</p>
                          <p>{language === 'ar' ? '3. سيقوم الكابتن بقبول حسابك فوراً من لوحة تحكم الإدارة (الظاهرة على يمينك!).' : '3. The coach will approve your account instantly from the Admin Dashboard (visible on your right!).'}</p>
                          <p>{language === 'ar' ? '4. بمجرد تفعيل حسابك، ستفتح لك جميع مميزات التطبيق تلقائياً!' : '4. Once activated, all application features will unlock automatically!'}</p>
                        </div>
                      </div>

                      <button 
                        onClick={() => setActiveMember(null)}
                        className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                          theme === 'dark' ? 'bg-slate-800 hover:bg-slate-750 text-slate-300' : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        {language === 'ar' ? 'تسجيل الخروج والعودة لشاشة الدخول' : 'Logout & Return to Login'}
                      </button>
                    </motion.div>
                  ) : (
                    <>
                      {/* HOME TAB */}
                      {activeTab === 'home' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {/* SUB-VIEW 1: QR ATTENDANCE SCANNER */}
                      {homeSubView === 'qr' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`flex items-center gap-2 pb-2 border-b border-slate-800 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                            <button 
                              onClick={() => setHomeSubView(null)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              <ChevronLeft className={`w-4 h-4 transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                            <div>
                              <h3 className="text-xs font-black text-slate-100">
                                {language === 'ar' ? 'بطاقة العضوية الرقمية (الدخول الذكي)' : 'Digital Membership Card (Smart Access)'}
                              </h3>
                              <p className="text-[9px] text-slate-400">
                                {language === 'ar' ? 'بوابة الحصن الإلكترونية السريعة' : 'Al Huson Fast Electronic Gate'}
                              </p>
                            </div>
                          </div>

                          {/* Glowing Membership Card */}
                          <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 rounded-2xl border border-amber-500/30 p-5 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl"></div>
                            <div className={`flex justify-between items-start ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                <span className="text-[9px] text-amber-500 font-bold tracking-widest block font-sans">AL HUSON SPORTS CLUB</span>
                                <h4 className="text-sm font-black text-slate-200 mt-1">{activeMember.name}</h4>
                                <p className="text-[10px] text-slate-400 font-mono mt-0.5">{activeMember.phone}</p>
                              </div>
                              <div className="text-left">
                                <span className="text-[8px] bg-emerald-500/10 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-bold">
                                  {language === 'ar' ? 'عضو نشط' : 'Active Member'}
                                </span>
                              </div>
                            </div>

                            {/* Simulated QR Code Area */}
                            <div className="my-6 flex flex-col items-center justify-center relative">
                              <div className="bg-white p-3.5 rounded-2xl shadow-xl border-2 border-amber-500/20 relative overflow-hidden">
                                <div className="w-32 h-32 flex flex-col items-center justify-center text-slate-900 border border-slate-200 p-1 bg-slate-50 rounded-lg">
                                  <QrCode className="w-28 h-28 stroke-[1.5]" />
                                </div>
                                {isScanning && (
                                  <motion.div 
                                    initial={{ top: "0%" }}
                                    animate={{ top: "100%" }}
                                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                                    className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_8px_2px_rgba(239,68,68,0.8)] z-10"
                                  ></motion.div>
                                )}
                              </div>
                              <span className="text-[9px] text-slate-500 mt-3 font-mono">ID: {activeMember.id.toUpperCase()}</span>
                            </div>

                            <div className={`border-t border-slate-800 pt-3 flex justify-between items-center text-[10px] text-slate-400 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                              <div>{language === 'ar' ? 'رصيد نقاطك:' : 'Your Points Balance:'} <span className="text-amber-500 font-bold font-mono">{activeMember.points || 0} {language === 'ar' ? 'ن' : 'pts'}</span></div>
                              <div>{language === 'ar' ? 'عضوية رقم:' : 'Membership No:'} <span className="font-mono text-slate-300">#9302-A</span></div>
                            </div>
                          </div>

                          {/* Scan Trigger buttons */}
                          <div className="space-y-2">
                            {!scanCompleted ? (
                              <button 
                                disabled={isScanning}
                                onClick={() => {
                                  setIsScanning(true);
                                  setTimeout(() => {
                                    setIsScanning(false);
                                    setScanCompleted(true);
                                    onScanQR(activeMember.id);
                                  }, 2000);
                                }}
                                className={`w-full py-3 px-4 rounded-xl text-xs font-black transition-all shadow-lg flex items-center justify-center gap-1.5 ${isScanning ? 'bg-slate-800 text-slate-500 border border-slate-750' : 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 hover:shadow-amber-500/10 hover:scale-[1.01]'}`}
                              >
                                <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
                                <span>{isScanning ? (language === 'ar' ? 'جاري مسح البوابة الرقمية...' : 'Scanning electronic gate...') : (language === 'ar' ? 'اضغط لمحاكاة تمرير الرمز عند البوابة' : 'Tap to simulate passing gate code')}</span>
                              </button>
                            ) : (
                              <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-emerald-950/40 border border-emerald-500/20 text-emerald-400 p-4 rounded-xl text-center space-y-2"
                              >
                                <div className="w-8 h-8 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto border border-emerald-500/20">
                                  <Check className="w-4 h-4" />
                                </div>
                                <p className="text-xs font-bold">{language === 'ar' ? 'تم تسجيل الدخول بنجاح عبر بوابة الحصن! 🎉' : 'Logged in successfully via Al Huson gate! 🎉'}</p>
                                <p className="text-[10px] text-emerald-400/80">
                                  {language === 'ar' 
                                    ? <>تأكد كابتن بوابة الصالة من هويتك وتمت إضافة <span className="font-bold underline text-white">+10 نقاط</span> لرصيدك كمكافأة حضور يومية!</>
                                    : <>The receptionist verified your identity and added <span className="font-bold underline text-white">+10 points</span> to your balance as a daily attendance reward!</>}
                                </p>
                                <button 
                                  onClick={() => { setScanCompleted(false); }}
                                  className="text-[10px] text-slate-300 underline font-semibold mt-1 hover:text-white"
                                >
                                  {language === 'ar' ? 'محاكاة مسح دخول جديد مرة أخرى' : 'Simulate scan gate entry again'}
                                </button>
                              </motion.div>
                            )}
                          </div>
                        </motion.div>
                      )}

                      {/* SUB-VIEW 2: FITNESS CHALLENGES CENTER */}
                      {homeSubView === 'challenges' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`flex items-center gap-2 pb-2 border-b border-slate-800 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                            <button 
                              onClick={() => setHomeSubView(null)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              <ChevronLeft className={`w-4 h-4 transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                            <div>
                              <h3 className="text-xs font-black text-slate-100">
                                {language === 'ar' ? 'تحديات وجوائز صالة الحصن 🏆' : 'Al Huson Gym Challenges 🏆'}
                              </h3>
                              <p className="text-[9px] text-slate-400">
                                {language === 'ar' ? 'انجز المهام الرياضية واستبدل نقاطك بمنتجات صحية' : 'Complete workouts and exchange points for healthy products'}
                              </p>
                            </div>
                          </div>

                          {/* Points Widget */}
                          <div className={`bg-gradient-to-r from-amber-500/15 via-amber-500/5 to-slate-900 p-4 rounded-2xl border border-amber-500/25 flex items-center justify-between ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                              <div className="w-10 h-10 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center font-black text-lg shadow-lg shadow-amber-500/15 select-none">
                                🪙
                              </div>
                              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                <span className="text-[9px] text-slate-400 block font-medium">
                                  {language === 'ar' ? 'رصيد نقاطك الرياضي' : 'Your Fitness Points'}
                                </span>
                                <span className="text-base font-black text-amber-500 font-mono">
                                  {activeMember.points || 0} <span className="text-[10px] text-slate-300">{language === 'ar' ? 'نقطة حصن' : 'Huson Pts'}</span>
                                </span>
                              </div>
                            </div>
                            <span className="text-[9px] bg-amber-500/10 text-amber-500 px-2.5 py-1 rounded-full border border-amber-500/20 font-bold">
                              {language === 'ar' ? 'برنامج الولاء والتحفيز' : 'Loyalty & Rewards'}
                            </span>
                          </div>

                          {/* Challenges List */}
                          <div className="space-y-3">
                            {fitnessChallenges.map((challenge) => {
                              const progress = challengeProgresses.find(p => p.memberId === activeMember.id && p.challengeId === challenge.id) || {
                                currentValue: 0,
                                isCompleted: false
                              };

                              const pct = Math.round((progress.currentValue / challenge.targetValue) * 100);

                              const displayTitle = challenge.id === 'ch-1' 
                                ? (language === 'ar' ? challenge.title : 'Gym Warrior 🏋️')
                                : challenge.id === 'ch-2'
                                ? (language === 'ar' ? challenge.title : 'Daily Steps Streak 👣')
                                : challenge.id === 'ch-3'
                                ? (language === 'ar' ? challenge.title : 'Ideal Weight Goal ⚖️')
                                : (language === 'ar' ? challenge.title : 'Consistent Champ 💪');

                              const displayDesc = challenge.id === 'ch-1'
                                ? (language === 'ar' ? challenge.description : 'Complete 15 workouts at the gym to gain extra loyalty points!')
                                : challenge.id === 'ch-2'
                                ? (language === 'ar' ? challenge.description : 'Walk 10,000 steps daily for 5 consecutive days.')
                                : challenge.id === 'ch-3'
                                ? (language === 'ar' ? challenge.description : 'Log your weight 4 times this month to track your fitness progression.')
                                : (language === 'ar' ? challenge.description : 'Achieve consistency in your fitness plan.');

                              const displayUnit = challenge.unit === 'تمرين' || challenge.unit === 'تمارين'
                                ? (language === 'ar' ? 'تمارين' : 'workouts')
                                : challenge.unit === 'خطوة' || challenge.unit === 'خطوات'
                                ? (language === 'ar' ? 'خطوة' : 'steps')
                                : challenge.unit === 'تسجيل'
                                ? (language === 'ar' ? 'تسجيل' : 'check-ins')
                                : challenge.unit;

                              return (
                                <div key={challenge.id} className={`bg-slate-900 border border-slate-800 rounded-xl p-3.5 space-y-3 relative overflow-hidden group ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                  <div className="absolute left-0 top-0 w-24 h-24 bg-amber-500/[0.01] rounded-full blur-xl"></div>
                                  
                                  <div className={`flex justify-between items-start gap-2 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <div className={`flex items-start gap-2.5 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                      <span className="text-2xl mt-0.5 select-none">{challenge.id === 'ch-1' ? '🏋️' : challenge.id === 'ch-2' ? '👣' : challenge.id === 'ch-3' ? '⚖️' : '💪'}</span>
                                      <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                        <h4 className="text-xs font-bold text-slate-100">{displayTitle}</h4>
                                        <p className="text-[10px] text-slate-400 mt-1 leading-relaxed">{displayDesc}</p>
                                      </div>
                                    </div>
                                    <span className="text-[9px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 shrink-0 font-mono">
                                      +{challenge.pointsReward} {language === 'ar' ? 'ن' : 'pts'}
                                    </span>
                                  </div>

                                  {/* Progress Bar */}
                                  <div className="space-y-1.5 pt-1">
                                    <div className={`flex justify-between items-center text-[10px] ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                      <span className="text-slate-400">
                                        {language === 'ar' ? 'التقدم:' : 'Progress:'} <span className="font-mono text-slate-200">{progress.currentValue} / {challenge.targetValue} {displayUnit}</span>
                                      </span>
                                      <span className="font-mono text-amber-500 font-bold">{pct}%</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-750/30">
                                      <div 
                                        className={`h-full rounded-full transition-all duration-500 bg-amber-500`} 
                                        style={{ width: `${Math.min(pct, 100)}%` }}
                                      ></div>
                                    </div>
                                  </div>

                                  {/* Claim Reward */}
                                  {progress.isCompleted && (
                                    <button 
                                      onClick={() => onClaimReward(activeMember.id, challenge.id)}
                                      className="w-full mt-2 bg-gradient-to-r from-yellow-500 to-amber-500 hover:from-yellow-600 hover:to-amber-600 text-slate-950 py-2 rounded-xl text-xs font-black transition-all shadow-md flex items-center justify-center gap-1 hover:scale-[1.01]"
                                    >
                                      <span>
                                        {language === 'ar' 
                                          ? `استلم الجائزة الموعودة 🎁 (+${challenge.pointsReward} نقطة)` 
                                          : `Claim Reward 🎁 (+${challenge.pointsReward} pts)`}
                                      </span>
                                    </button>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* SUB-VIEW 3: PROTEIN BAR SHOP */}
                      {homeSubView === 'protein' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`flex items-center gap-2 pb-2 border-b border-slate-800 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                            <button 
                              onClick={() => setHomeSubView(null)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              <ChevronLeft className={`w-4 h-4 transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                            <div>
                              <h3 className="text-xs font-black text-slate-100">
                                {language === 'ar' ? 'صالة البروتين والمكملات الذكية 🥛' : 'Smart Protein & Supplements Bar 🥛'}
                              </h3>
                              <p className="text-[9px] text-slate-400">
                                {language === 'ar' ? 'اطلب المشروبات والسناكات العضلية بالنقاط' : 'Order muscle drinks and healthy snacks with loyalty points'}
                              </p>
                            </div>
                          </div>

                          {/* Double Tab switcher */}
                          <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850 gap-1">
                            <button 
                              onClick={() => setBarTab('shop')}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all ${barTab === 'shop' ? 'bg-slate-800 text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                              {language === 'ar' ? 'قائمة المأكولات والمشروبات' : 'Food & Drinks Menu'}
                            </button>
                            <button 
                              onClick={() => setBarTab('orders')}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-black transition-all flex items-center justify-center gap-1 ${barTab === 'orders' ? 'bg-slate-800 text-amber-500' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                              <span>{language === 'ar' ? 'طلباتي السابقة' : 'My Orders'}</span>
                              {barOrders.filter(o => o.memberId === activeMember.id && o.status !== 'تم التسليم').length > 0 && (
                                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                              )}
                            </button>
                          </div>

                          {barTab === 'shop' && (
                            <div className="space-y-4">
                              {/* Points display */}
                              <div className={`p-3 rounded-xl flex justify-between items-center text-xs border ${
                                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200 shadow-sm'
                              } ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                <span className={`${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'} font-bold`}>
                                  {language === 'ar' ? 'نقاطك المتاحة للشراء:' : 'Your available points:'}
                                </span>
                                <span className="font-mono font-black text-amber-500 text-sm">{activeMember.points || 0} {language === 'ar' ? 'ن' : 'pts'}</span>
                              </div>

                              {/* Delivery Location Selector */}
                              <div className={`p-3 rounded-xl border space-y-2 ${
                                theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200/80 shadow-sm'
                              } ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                <label className={`block text-[10px] font-bold ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                  📍 {language === 'ar' ? 'أين تريد استلام طلبك؟ (توصيل فوري)' : 'Where do you want to receive your order? (Instant Delivery)'}
                                </label>
                                <div className={`grid grid-cols-3 gap-1 p-1 rounded-lg border ${
                                  theme === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-100 border-slate-200'
                                }`}>
                                  {(['الـ Gym', 'الـ Pool', 'الـ Outdoor'] as const).map((loc) => (
                                    <button
                                      type="button"
                                      key={loc}
                                      onClick={() => setOrderDeliveryLocation(loc)}
                                      className={`py-1 rounded-md text-[10px] font-black transition-all ${
                                        orderDeliveryLocation === loc
                                          ? 'bg-amber-500 text-slate-950 shadow-sm font-black'
                                          : `${theme === 'dark' ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-800'}`
                                      }`}
                                    >
                                      {loc === 'الـ Gym' ? (language === 'ar' ? 'الـ Gym 🏋️' : 'Gym 🏋️') :
                                       loc === 'الـ Pool' ? (language === 'ar' ? 'الـ Pool 🏊' : 'Pool 🏊') :
                                       (language === 'ar' ? 'الـ Outdoor 🌴' : 'Outdoor 🌴')}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              {/* Category switcher */}
                              <div className="flex gap-1.5 overflow-x-auto pb-1 select-none">
                                {(['all', 'مشروبات ساخنة وباردة', 'بروتين', 'وجبات خفيفة وسناكس', 'وجبات رئيسية صحية', 'حلويات صحية'] as const).map((cat) => (
                                  <button 
                                    key={cat}
                                    onClick={() => setSelectedBarCategory(cat)}
                                    className={`px-3 py-1 rounded-full text-[10px] font-black shrink-0 transition-all border ${
                                      selectedBarCategory === cat 
                                        ? 'bg-amber-500 text-slate-950 border-amber-500' 
                                        : `${theme === 'dark' ? 'bg-slate-800/40 text-slate-400 border-slate-800 hover:text-slate-200' : 'bg-white text-slate-600 border-slate-200 hover:text-slate-800 shadow-sm'}`
                                    }`}
                                  >
                                    {cat === 'all' ? (language === 'ar' ? 'الكل' : 'All') : cat}
                                  </button>
                                ))}
                              </div>

                              {/* Items Grid */}
                              <div className="space-y-3">
                                {barItems
                                  .filter(item => selectedBarCategory === 'all' || item.category === selectedBarCategory)
                                  .map((item) => {
                                    const canAfford = (activeMember.points || 0) >= item.pricePoints;

                                    const getLocalizedItem = (name: string, desc: string) => {
                                      if (language === 'ar') return { name, desc };
                                      const dict: Record<string, { name: string, desc: string }> = {
                                        'مخفوق بروتين التوت البري المنعش': { name: 'Triple Berry Protein Shake', desc: 'Whey protein isolate with cold low-fat milk, high protein' },
                                        'شوكولاتة دبل بروتين كوكيز': { name: 'Double Chocolate Protein Cookies', desc: 'Delicious healthy cookie with 22g protein' },
                                        'قهوة إسبريسو مزدوجة دافئة': { name: 'Double Warm Espresso Shot', desc: 'Double espresso shot of premium roasted beans' },
                                        'عصير البرتقال الطبيعي البارد': { name: 'Fresh Cold Orange Juice', desc: '100% natural orange juice for fast hydration' },
                                        'صدر دجاج مشوي مع أرز بسمتي': { name: 'Grilled Chicken Breast with Basmati Rice', desc: 'With steamed mixed vegetables and herbs' },
                                        'براونيز بروتين خالي من السكر': { name: 'Sugar-Free Protein Brownies', desc: 'Baked with almond flour and stevia with 15g protein' }
                                      };
                                      return dict[name] || { name, desc };
                                    };

                                    const localized = getLocalizedItem(item.name, item.description);

                                    return (
                                      <div key={item.id} className={`p-3.5 rounded-xl space-y-2.5 border relative overflow-hidden ${
                                        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                                      } ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        <div className={`flex justify-between items-start gap-2 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                            <span className="text-[8px] bg-amber-500/10 text-amber-500 px-1.5 py-0.5 rounded-md border border-amber-500/10 font-black">
                                              {language === 'ar' ? item.category : item.category}
                                            </span>
                                            <h4 className={`text-xs font-black mt-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>{localized.name}</h4>
                                            <p className={`text-[10px] mt-1 leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>{localized.desc}</p>
                                          </div>
                                          <div className={`${language === 'ar' ? 'text-left' : 'text-right'} shrink-0 font-mono`}>
                                            <span className="text-xs font-black text-amber-500 block">{item.pricePoints} {language === 'ar' ? 'ن' : 'pts'}</span>
                                            <span className={`text-[9px] block mt-0.5 ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>{item.priceCash} {language === 'ar' ? 'د.أ' : 'JOD'}</span>
                                          </div>
                                        </div>

                                        <div className={`border-t pt-2 flex justify-between items-center ${
                                          theme === 'dark' ? 'border-slate-800/80' : 'border-slate-100'
                                        } ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                          <span className={`text-[9px] ${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}`}>
                                            {language === 'ar' ? 'متوفر بالبوفيه:' : 'In Stock:'} <span className="font-mono text-slate-400 font-bold">{item.stock} {language === 'ar' ? 'حبة' : 'pcs'}</span>
                                          </span>
                                          
                                          <button 
                                            disabled={!canAfford}
                                            onClick={() => {
                                              const newOrder: BarOrder = {
                                                id: `ord-${Date.now()}`,
                                                memberId: activeMember.id,
                                                memberName: activeMember.name,
                                                itemId: item.id,
                                                itemName: item.name,
                                                quantity: 1,
                                                totalPointsCost: item.pricePoints,
                                                status: "قيد التحضير",
                                                createdAt: new Date().toISOString(),
                                                deliveryLocation: orderDeliveryLocation
                                              };
                                              onPlaceBarOrder(newOrder);
                                            }}
                                            className={`px-3 py-1.5 rounded-lg text-[10px] font-black transition-all ${
                                              canAfford 
                                                ? 'bg-amber-500 text-slate-950 hover:bg-amber-600 hover:scale-[1.01]' 
                                                : `${theme === 'dark' ? 'bg-slate-800 text-slate-500 border border-slate-700/50' : 'bg-slate-100 text-slate-400 border border-slate-200'} cursor-not-allowed`
                                            }`}
                                          >
                                            {canAfford ? (language === 'ar' ? 'طلب بالنقاط ⚡' : 'Order with points ⚡') : (language === 'ar' ? 'النقاط غير كافية ❌' : 'Insufficient points ❌')}
                                          </button>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          )}

                          {barTab === 'orders' && (
                            <div className="space-y-3">
                              {barOrders.filter(o => o.memberId === activeMember.id).length === 0 ? (
                                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center text-xs text-slate-500">
                                  {language === 'ar' ? 'لا توجد طلبات سابقة بعد. اطلب مشروبك الرياضي الأول الآن!' : 'No previous orders yet. Order your first sports drink now!'}
                                </div>
                              ) : (
                                barOrders
                                  .filter(o => o.memberId === activeMember.id)
                                  .map((order) => {
                                    const displayStatus = order.status === 'قيد التحضير' 
                                      ? (language === 'ar' ? 'قيد التحضير' : 'Preparing ⏳') 
                                      : order.status === 'جاهز للاستلام' 
                                      ? (language === 'ar' ? 'جاهز للاستلام' : 'Ready 🥛') 
                                      : (language === 'ar' ? 'تم التسليم' : 'Delivered ✅');

                                    return (
                                      <div key={order.id} className={`bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2.5 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                        <div className={`flex justify-between items-start ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                            <h4 className="text-xs font-bold text-slate-200">{order.itemName}</h4>
                                            <p className="text-[9px] text-slate-500 mt-1 font-mono">
                                              {language === 'ar' ? 'الطلب:' : 'Order:'} #{order.id.substring(4, 9)} | {new Date(order.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                          </div>
                                          <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border ${order.status === 'قيد التحضير' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20 animate-pulse' : order.status === 'جاهز للاستلام' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 animate-bounce' : 'bg-slate-800 text-slate-500 border-slate-700'}`}>
                                            {displayStatus}
                                          </span>
                                        </div>

                                        {order.status === 'جاهز للاستلام' && (
                                          <div className="bg-emerald-950/30 border border-emerald-500/10 p-2 rounded-lg text-[9.5px] text-emerald-400 leading-relaxed text-center font-bold">
                                            {language === 'ar' 
                                              ? '🥛 توجه للبوفيه وصالة المأكولات الآن وأظهر الشاشة للكابتن للاستلام! بصحتك يا بطل!' 
                                              : '🥛 Go to the buffet bar now and show this screen to the coach to collect! Cheers champ!'}
                                          </div>
                                        )}

                                        <div className={`border-t border-slate-850 pt-2 flex justify-between items-center text-[9px] text-slate-500 font-sans ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                          <span>{language === 'ar' ? 'الكمية: 1 حبة' : 'Qty: 1 pc'}</span>
                                          <span>{language === 'ar' ? 'الخصم:' : 'Discount:'} <span className="font-mono text-amber-500">-{order.totalPointsCost} {language === 'ar' ? 'ن' : 'pts'}</span></span>
                                        </div>
                                      </div>
                                    );
                                  })
                              )}
                            </div>
                          )}
                        </motion.div>
                      )}

                      {/* SUB-VIEW 4: EXERCISE MUSCLE MAP */}
                      {homeSubView === 'muscle' && (
                        <motion.div 
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className={`space-y-4 ${language === 'ar' ? 'text-right' : 'text-left'}`}
                        >
                          <div className={`flex items-center gap-2 pb-2 border-b border-slate-800 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                            <button 
                              onClick={() => setHomeSubView(null)}
                              className="p-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 transition-colors"
                            >
                              <ChevronLeft className={`w-4 h-4 transform ${language === 'ar' ? 'rotate-180' : ''}`} />
                            </button>
                            <div>
                              <h3 className="text-xs font-black text-slate-100">
                                {language === 'ar' ? 'دليل العضلات والتمارين التفاعلي 🗺️' : 'Interactive Muscle Guide 🗺️'}
                              </h3>
                              <p className="text-[9px] text-slate-400">
                                {language === 'ar' ? 'اختر العضلة المستهدفة لعرض نصائح الكابتن وبرامجه الخاصة' : 'Select a muscle group to view the coach special workout tips'}
                              </p>
                            </div>
                          </div>

                          {/* Muscle selector buttons */}
                          <div className="grid grid-cols-3 gap-1.5">
                            {[
                              { id: 'chest', label: language === 'ar' ? 'الصدر 🏛️' : 'Chest 🏛️' },
                              { id: 'back', label: language === 'ar' ? 'الظهر 🌲' : 'Back 🌲' },
                              { id: 'legs', label: language === 'ar' ? 'الأرجل 🦵' : 'Legs 🦵' },
                              { id: 'shoulders', label: language === 'ar' ? 'الأكتاف 🛡️' : 'Shoulders 🛡️' },
                              { id: 'arms', label: language === 'ar' ? 'الذراعين 💪' : 'Arms 💪' },
                              { id: 'core', label: language === 'ar' ? 'البطن 🎯' : 'Core/Abs 🎯' }
                            ].map((m) => (
                              <button 
                                key={m.id}
                                onClick={() => setSelectedMuscle(m.id as any)}
                                className={`py-2 px-1 rounded-xl text-[10px] font-bold text-center border transition-all ${selectedMuscle === m.id ? 'bg-amber-500 text-slate-950 border-amber-500 font-black shadow-md shadow-amber-500/10' : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'}`}
                              >
                                {m.label}
                              </button>
                            ))}
                          </div>

                          {/* Display exercises for selected muscle */}
                          <div className="space-y-3 pt-1">
                            <div className={`bg-slate-800/60 p-3 rounded-xl border border-slate-700/30 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                              <span className="text-[8.5px] bg-amber-500/15 text-amber-500 border border-amber-500/20 px-2.5 py-0.5 rounded-full font-bold">
                                {language === 'ar' ? 'دليل تمرين عضلات:' : 'Exercise Guide:'} {
                                  selectedMuscle === 'chest' ? (language === 'ar' ? 'الصدر' : 'Chest') : 
                                  selectedMuscle === 'back' ? (language === 'ar' ? 'الظهر واللاتس' : 'Back & Lats') : 
                                  selectedMuscle === 'legs' ? (language === 'ar' ? 'الفخذ والأرجل' : 'Thighs & Legs') : 
                                  selectedMuscle === 'shoulders' ? (language === 'ar' ? 'الأكتاف والمجسم ثلاثي الأبعاد' : 'Shoulders') : 
                                  selectedMuscle === 'arms' ? (language === 'ar' ? 'الباي والتراي والساعد' : 'Biceps & Triceps') : 
                                  (language === 'ar' ? 'البطن وجدار الجذع' : 'Abdominals & Core')
                                }
                              </span>
                              <p className="text-[9.5px] text-slate-400 mt-2 leading-relaxed">
                                {language === 'ar' 
                                  ? 'يحرص الطاقم الفني وصناع اللياقة في نادي الحصن على تعظيم نتائجك. إليك التمارين الأهم لعزل العضلة اليوم:' 
                                  : 'Our training specialists at Al Huson Sports Club ensure to maximize your results. Here are the elite movements to isolate this muscle today:'}
                              </p>
                            </div>

                            {exercisesByMuscle[selectedMuscle].map((ex, idx) => {
                              const getLocalizedExercise = (exName: string, exTip: string) => {
                                if (language === 'ar') return { name: exName, tip: exTip };
                                const dict: Record<string, { name: string, tip: string }> = {
                                  "تمرين تجميع الصدر بالدمبلز (Incline Dumbbell Press)": { name: "Incline Dumbbell Press", tip: "Focus on a slow eccentric phase and full stretch of the upper clavicular chest muscle fibers." },
                                  "ضغط الصدر المستوي بالبار (Bench Press)": { name: "Flat Barbell Bench Press", tip: "Keep your scapula retracted and shoulders pinned flat back to safeguard the rotator cuff." },
                                  "تفتيح الصدر كابل كروس (Cable Crossover)": { name: "High-to-Low Cable Flyes", tip: "Squeeze intense contractions at the center line and hold statically for 1 full second." },
                                  "سحب الظهر عريض (Lat Pulldown)": { name: "Wide-Grip Lat Pulldown", tip: "Drive downward and backward leading with your elbows, not pulling with forearms, to isolate the lats." },
                                  "تجديف بالبار (Barbell Row)": { name: "Bent-Over Barbell Rows", tip: "Maintain a stable flat spine at a 45-degree hinge to bypass strain on the lower back." },
                                  "سحب أرضي ضيق (Seated Cable Row)": { name: "Close-Grip Seated Cable Row", tip: "Keep your chest high and drive your scapulae together firmly as you finish the pull." },
                                  "تمرين السكوات بالبار (Barbell Squat)": { name: "Barbell Back Squats", tip: "Squat down parallel to the floor, pushing your knees outward in alignment with your toes." },
                                  "دفع الأرجل بالآلة (Leg Press)": { name: "45-Degree Leg Press", tip: "Avoid locking out your knees at the top of the extension to preserve join integrity." },
                                  "تمرين الرفرفة الخلفية (Lying Leg Curl)": { name: "Lying Hamstring Curls", tip: "Squeeze the hamstrings fully at the top and maintain a very slow, controlled eccentric path down." },
                                  "ضغط الأكتاف بالدمبلز (Dumbbell Shoulder Press)": { name: "Seated Dumbbell Shoulder Press", tip: "Keep elbows tucked slightly at 75-degrees forward to decrease stress on anterior deltoids." },
                                  "نشر جانبي بالدمبلز (Lateral Raise)": { name: "Dumbbell Lateral Raises", tip: "Lead with the elbows, keeping elbows higher than hands, to recruit the lateral head completely." },
                                  "سحب خلفي للحبل كابل (Face Pull)": { name: "High Pulley Rope Face Pulls", tip: "An elite movement to restore posture, pull apart the rope and squeeze the rear deltoids." },
                                  "تبادل البايسبس بالدمبلز (Dumbbell Bicep Curl)": { name: "Alternating Dumbbell Bicep Curls", tip: "Supinate your wrists outward at the peak contraction for maximum biceps peak loading." },
                                  "ترايسبس بوش داون بالحبل (Triceps Pushdown)": { name: "Rope Triceps Pushdowns", tip: "Lock your elbows to your sides and separate the rope ends at full extension for absolute lateral triceps head activation." },
                                  "تمرين الهمر للباي والساعد (Hammer Curl)": { name: "Dumbbell Hammer Curls", tip: "Builds brachioradialis and brachialis thickness to give you powerful-looking forearms." },
                                  "تمرين المعدة الكلاسيكي (Crunches)": { name: "Abdominal Crunches", tip: "Do not pull on your neck with your hands; initiate and lift solely through abdominal wall contraction." },
                                  "تمرين البلانك الثابت (Plank Hold)": { name: "Standard Static Forearm Plank", tip: "Maintain a perfectly straight line from heels to shoulders; brace glutes and core hard." },
                                  "رفع الأرجل معلق (Hanging Leg Raise)": { name: "Hanging Leg Raises", tip: "A premier lower ab movements. Do not use momentum; lower legs with strict control." }
                                };
                                return dict[exName] || { name: exName, tip: exTip };
                              };

                              const localizedEx = getLocalizedExercise(ex.name, ex.tip);

                              return (
                                <div key={idx} className={`bg-slate-900 border border-slate-800 p-3.5 rounded-xl space-y-2 relative overflow-hidden ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                  <div className={`absolute h-full w-1 bg-amber-500 ${language === 'ar' ? 'right-0 top-0' : 'left-0 top-0'}`}></div>
                                  <div className={`flex justify-between items-start gap-1 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`} style={{ direction: "rtl" }}>
                                    <h4 className="text-xs font-bold text-slate-200">{idx + 1}. {localizedEx.name}</h4>
                                    <span className="text-[9px] font-mono font-black text-amber-500 bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10 shrink-0">{ex.sets} × {ex.reps}</span>
                                  </div>
                                  <p className="text-[9.5px] text-slate-400 leading-relaxed font-light">
                                    <span className="font-bold text-amber-500">{language === 'ar' ? '💡 سر الكابتن:' : '💡 Coach Tip:'}</span> {localizedEx.tip}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}

                      {/* STANDARD HOME DASHBOARD VIEW (Shown when homeSubView is null) */}
                      {!homeSubView && (
                        <>
                          {/* Welcome Card */}
                          <div className={`${cardBg} rounded-2xl p-4 border ${cardBorder}`}>
                            <div className="flex items-start justify-between">
                              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                                  {language === 'ar' ? 'يا هلا بك' : 'Welcome back'}
                                </span>
                                <h3 className={`text-base font-bold ${textPrimary} mt-0.5`}>{activeMember.name}</h3>
                              </div>
                              <div className="p-2 rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/20">
                                <Activity className="w-4 h-4" />
                              </div>
                            </div>

                            {/* Subscription Status block */}
                            {activeSub ? (
                              <div className={`mt-4 pt-3 border-t ${cardBorder} flex items-center justify-between ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                  <div className={`text-[10px] ${textMuted}`}>
                                    {language === 'ar' ? `حالة الاشتراك (${activeSub.type})` : `Subscription Status (${activeSub.type})`}
                                  </div>
                                  <div className={`flex items-center gap-1.5 mt-1 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
                                    {daysRemaining > 7 ? (
                                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    ) : daysRemaining > 0 ? (
                                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                                    ) : (
                                      <span className="inline-block w-2.5 h-2.5 rounded-full bg-rose-500"></span>
                                    )}
                                    <span className={`text-xs font-semibold ${textPrimary}`}>
                                      {daysRemaining > 7 
                                        ? (language === 'ar' ? "فعال" : "Active") 
                                        : daysRemaining > 0 
                                        ? (language === 'ar' ? "قريب الانتهاء" : "Expiring soon") 
                                        : (language === 'ar' ? "منتهي" : "Expired")}
                                    </span>
                                  </div>
                                </div>
                                <div className={`text-center ${cardSubBg} px-3 py-1.5 rounded-xl border ${cardSubBorder}`}>
                                  <span className={`text-xs ${textMuted}`}>{language === 'ar' ? 'متبقي لك' : 'Remaining'}</span>
                                  <div className="text-sm font-black text-amber-500 font-mono">
                                    {language === 'ar' ? `باقي ${daysRemaining} يوم` : `${daysRemaining} days`}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className={`mt-4 pt-3 border-t ${cardBorder} text-center text-xs text-rose-400`}>
                                {language === 'ar' 
                                  ? 'لا يوجد اشتراك فعال حالياً. تواصل مع الإدارة للتفعيل!' 
                                  : 'No active subscription currently. Please contact management to activate!'}
                              </div>
                            )}
                          </div>

                          {/* Fitness Target Banner */}
                          <div className={`bg-gradient-to-r from-amber-500/10 to-amber-600/5 rounded-2xl p-3 border border-amber-500/20 flex items-center justify-between ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                            <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                              <Sparkle className="w-4 h-4 text-amber-500" />
                              <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                <div className={`text-[9px] ${textMuted}`}>{language === 'ar' ? 'هدفك الرياضي الحالي' : 'Current Goal'}</div>
                                <div className="text-xs font-bold text-amber-500">
                                  {activeMember.goal === 'تنشيف' 
                                    ? (language === 'ar' ? 'تنشيف وخسارة دهون' : 'Fat Loss / Cutting') 
                                    : activeMember.goal === 'تضخيم' 
                                    ? (language === 'ar' ? 'تضخيم وبناء عضلات' : 'Muscle Gain / Bulking') 
                                    : activeMember.goal === 'لياقة' 
                                    ? (language === 'ar' ? 'لياقة بدنية وصحة' : 'Fitness & Health') 
                                    : activeMember.goal}
                                </div>
                              </div>
                            </div>
                            <div className="font-mono text-[10px] text-slate-400">
                              {activeMember.height} {language === 'ar' ? 'سم' : 'cm'} | {latestLog?.weight || activeMember.weight} {language === 'ar' ? 'كجم' : 'kg'}
                            </div>
                          </div>

                          {/* Club Operating Hours Status widget */}
                          {(() => {
                            const shift = getDynamicShiftStatus();
                            return (
                              <div className={`p-3.5 rounded-2xl border text-right space-y-2.5 transition-colors relative overflow-hidden ${
                                shift.type === 'women' 
                                  ? 'bg-purple-950/25 border-purple-500/30' 
                                  : shift.type === 'men'
                                  ? 'bg-amber-500/10 border-amber-500/20'
                                  : 'bg-slate-900 border-slate-800'
                              } ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                                {shift.type === 'women' && (
                                  <div className="absolute top-0 left-0 w-20 h-20 bg-purple-500/5 rounded-full blur-xl pointer-events-none"></div>
                                )}
                                {shift.type === 'men' && (
                                  <div className="absolute top-0 left-0 w-20 h-20 bg-amber-500/5 rounded-full blur-xl pointer-events-none"></div>
                                )}
                                <div className={`flex justify-between items-center relative z-10 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                  <div className={`flex items-center gap-1.5 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <span className={`w-2 h-2 rounded-full ${shift.type === 'closed' ? 'bg-rose-500' : 'bg-emerald-500 animate-ping'}`}></span>
                                    <span className={`w-2 h-2 rounded-full absolute ${shift.type === 'closed' ? 'bg-rose-500' : 'bg-emerald-500'}`}></span>
                                    <span className={`text-[10px] font-black ${language === 'ar' ? 'mr-3' : 'ml-3'} ${shift.type === 'women' ? 'text-purple-400' : shift.type === 'men' ? 'text-amber-500' : 'text-slate-400'}`}>
                                      {shift.label}
                                    </span>
                                  </div>
                                  <span className="text-[9px] text-slate-400 font-mono font-bold bg-slate-950/40 px-2 py-0.5 rounded-md border border-slate-800">{shift.time}</span>
                                </div>
                                <div className={`flex justify-between items-center text-[10px] relative z-10 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                  <span className="text-slate-300 font-medium">{shift.desc}</span>
                                  <span className="text-[8.5px] text-slate-500 underline font-semibold">
                                    {language === 'ar' ? 'ساعات العمل الرسمية' : 'Official Operating Hours'}
                                  </span>
                                </div>
                              </div>
                            );
                          })()}

                          {/* 🌟 GROUNDBREAKING ADDITIONS: 4 BENTO CARD ACTIONS */}
                          <div className={`grid grid-cols-2 gap-3 my-1 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            <button 
                              onClick={() => { setHomeSubView('qr'); setScanCompleted(false); setIsScanning(false); }}
                              className={`${isDark ? 'bg-slate-800/60 border-slate-750 hover:bg-slate-800/80' : 'bg-slate-100/75 border-slate-200 hover:bg-slate-100 shadow-sm'} col-span-2 hover:border-amber-500/40 p-3 rounded-xl flex flex-col justify-between h-24 transition-all group relative overflow-hidden ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            >
                              <div className="absolute left-0 top-0 w-12 h-12 bg-amber-500/[0.02] rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
                              <div className="p-1.5 w-7.5 h-7.5 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20 flex items-center justify-center shrink-0">
                                <QrCode className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className={`text-[11px] font-black ${textSecondary} group-hover:text-amber-500 transition-colors`}>
                                  {language === 'ar' ? 'الدخول بالـ QR 📲' : 'QR Entry Scanner 📲'}
                                </h4>
                                <p className={`text-[8.5px] ${textMuted} mt-0.5`}>
                                  {language === 'ar' ? 'تسجيل الحضور التلقائي' : 'Auto attendance check-in'}
                                </p>
                              </div>
                            </button>

                            <button 
                              onClick={() => { setHomeSubView('protein'); setBarTab('shop'); }}
                              className={`${isDark ? 'bg-slate-800/60 border-slate-750 hover:bg-slate-800/80' : 'bg-slate-100/75 border-slate-200 hover:bg-slate-100 shadow-sm'} hover:border-amber-500/40 p-3 rounded-xl flex flex-col justify-between h-24 transition-all group relative overflow-hidden ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            >
                              <div className="absolute left-0 top-0 w-12 h-12 bg-amber-500/[0.02] rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
                              <div className="p-1.5 w-7.5 h-7.5 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/20 flex items-center justify-center shrink-0">
                                <ShoppingBag className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className={`text-[11px] font-black ${textSecondary} group-hover:text-amber-500 transition-colors`}>
                                  {language === 'ar' ? 'صالة البروتين 🥛' : 'Protein Bar 🥛'}
                                </h4>
                                <p className={`text-[8.5px] ${textMuted} mt-0.5`}>
                                  {language === 'ar' ? 'اطلب شيك وسناك بالنقاط' : 'Order shakes & snacks with points'}
                                </p>
                              </div>
                            </button>

                            <button 
                              onClick={() => { setHomeSubView('muscle'); }}
                              className={`${isDark ? 'bg-slate-800/60 border-slate-750 hover:bg-slate-800/80' : 'bg-slate-100/75 border-slate-200 hover:bg-slate-100 shadow-sm'} hover:border-amber-500/40 p-3 rounded-xl flex flex-col justify-between h-24 transition-all group relative overflow-hidden ${language === 'ar' ? 'text-right' : 'text-left'}`}
                            >
                              <div className="absolute left-0 top-0 w-12 h-12 bg-amber-500/[0.02] rounded-full blur-xl group-hover:bg-amber-500/10 transition-all"></div>
                              <div className="p-1.5 w-7.5 h-7.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0">
                                <Flame className="w-4 h-4" />
                              </div>
                              <div>
                                <h4 className={`text-[11px] font-black ${textSecondary} group-hover:text-amber-500 transition-colors`}>
                                  {language === 'ar' ? 'دليل التمارين 🗺️' : 'Exercise Guide 🗺️'}
                                </h4>
                                <p className={`text-[8.5px] ${textMuted} mt-0.5`}>
                                  {language === 'ar' ? 'خريطة العضلات التفاعلية' : 'Interactive Muscle Map'}
                                </p>
                              </div>
                            </button>
                          </div>

                          {/* Virtual Coach Teaser Card */}
                          <div 
                            onClick={() => setActiveTab('coach')}
                            className={`${cardMutedBg} border ${cardMutedBorder} rounded-2xl p-4 cursor-pointer hover:border-amber-500/40 hover:bg-amber-50/10 transition-all group`}
                          >
                            <div className={`flex items-center justify-between ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                              <div className={`flex items-center gap-3 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-bold shrink-0">
                                  <Sparkles className="w-5 h-5" />
                                </div>
                                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                                  <h4 className={`text-xs font-black ${textSecondary} group-hover:text-amber-500 transition-colors`}>
                                    {language === 'ar' ? 'كابتن حُصين (المدرب الذكي)' : 'Coach Hussein (Smart AI Trainer)'}
                                  </h4>
                                  <p className={`text-[10px] ${textMuted} mt-0.5`}>
                                    {language === 'ar' ? 'جاهز لتحليل قياساتك وتقديم جدول تمرين مخصص!' : 'Ready to analyze your metrics & provide a custom workout plan!'}
                                  </p>
                                </div>
                              </div>
                              <ChevronRight className={`w-4 h-4 text-slate-500 group-hover:text-amber-500 transition-all transform ${language === 'ar' ? 'group-hover:translate-x-1' : 'rotate-180 group-hover:-translate-x-1'}`} />
                            </div>
                          </div>

                          {/* Active Offers Section */}
                          <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                            <h4 className={`text-xs font-black ${textSecondary} mb-2 flex items-center gap-1.5 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                              <Percent className="w-3.5 h-3.5 text-amber-500" />
                              <span>{language === 'ar' ? 'أقوى عروض النادي الحصرية' : 'Exclusive Club Offers'}</span>
                            </h4>
                            <div className="space-y-2">
                              {offers.filter(o => o.active).slice(0, 2).map((offer) => (
                                <div key={offer.id} className={`${cardMutedBg} border ${cardMutedBorder} rounded-xl p-3 flex gap-2.5 items-center ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                                  <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 font-bold text-xs border border-amber-500/20 font-mono">
                                    {offer.discount}
                                  </div>
                                  <div className={`min-w-0 ${language === 'ar' ? 'text-right' : 'text-left'} flex-1`}>
                                    <h5 className={`text-xs font-bold ${textPrimary} truncate`}>{offer.title}</h5>
                                    <p className={`text-[9px] ${textMuted} truncate mt-0.5`}>{offer.description}</p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Contact Info Widget */}
                          <div className={`${cardMutedBg} border ${cardMutedBorder} rounded-2xl p-3 space-y-3.5 ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                            <div className={`text-[10px] font-bold ${textMuted}`}>
                              {language === 'ar' ? '📍 موقع النادي والتواصل وحساباتنا' : '📍 Club Location & Contact Us'}
                            </div>
                            <div className={`flex items-center justify-between text-xs ${textSecondary} ${cardSubBg} p-2 rounded-xl ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                              <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5 text-amber-500" /> {language === 'ar' ? 'الحصن، إربد' : 'Al Huson, Irbid'}</span>
                              <span className={`text-[10px] ${textSuperMuted}`}>{language === 'ar' ? 'مفتوح: 6 ص - 11 م' : 'Open: 6 AM - 11 PM'}</span>
                            </div>

                            {/* Row of Dynamic Social Media Links */}
                            <div className="flex flex-wrap gap-2 justify-center py-1.5 border-t border-slate-800/40">
                              {clubFacebook && (
                                <a 
                                  href={clubFacebook} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 flex items-center justify-center border border-blue-500/20 transition-all hover:scale-105"
                                  title="Facebook"
                                >
                                  <Facebook className="w-4 h-4" />
                                </a>
                              )}
                              {clubInstagram && (
                                <a 
                                  href={clubInstagram} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-pink-600/10 hover:bg-pink-600/20 text-pink-400 flex items-center justify-center border border-pink-500/20 transition-all hover:scale-105"
                                  title="Instagram"
                                >
                                  <Instagram className="w-4 h-4" />
                                </a>
                              )}
                              {clubTwitter && (
                                <a 
                                  href={clubTwitter} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-sky-600/10 hover:bg-sky-600/20 text-sky-400 flex items-center justify-center border border-sky-500/20 transition-all hover:scale-105"
                                  title="Twitter"
                                >
                                  <Globe className="w-4 h-4" />
                                </a>
                              )}
                              {clubTikTok && (
                                <a 
                                  href={clubTikTok} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="w-8 h-8 rounded-full bg-slate-100/10 hover:bg-slate-100/20 text-slate-100 flex items-center justify-center border border-slate-100/20 transition-all hover:scale-105"
                                  title="TikTok"
                                >
                                  <Flame className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            <div className="flex gap-2">
                              <a 
                                href={clubWhatsApp.startsWith('http') ? clubWhatsApp : `https://wa.me/${clubWhatsApp.replace(/\+/g, '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(language === 'ar' ? `مرحباً إدارة ${clubName}، أنا البطل المشترك ${activeMember.name} وأود الاستفسار.` : `Hello ${clubName} management, I am member ${activeMember.name} and would like to ask some questions.`)}`}
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex-1 bg-emerald-600/15 hover:bg-emerald-600/20 border border-emerald-500/20 text-emerald-400 rounded-xl py-2 text-center text-[11px] font-bold transition-colors flex items-center justify-center gap-1"
                              >
                                <Phone className="w-3 h-3" />
                                <span>{language === 'ar' ? 'واتساب الإدارة المباشر' : 'Direct Management WhatsApp'}</span>
                              </a>
                            </div>
                          </div>
                        </>
                      )}

                    </motion.div>
                  )}

                  {/* FITNESS & PROGRESS LOG TAB */}
                  {activeTab === 'progress' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      {/* Metric Grid cards */}
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-2.5 text-center">
                          <span className="text-[8px] text-slate-400 uppercase font-bold">
                            {language === 'ar' ? 'الوزن الحالي' : 'Current Weight'}
                          </span>
                          <div className="text-sm font-black text-amber-500 font-mono mt-0.5">
                            {latestLog?.weight || activeMember.weight} <span className="text-[9px] font-light">{language === 'ar' ? 'كجم' : 'kg'}</span>
                          </div>
                          {initialLog && latestLog && (
                            <div className="text-[8px] text-slate-400 mt-1">
                              {language === 'ar' ? `البداية: ${initialLog.weight} كجم` : `Start: ${initialLog.weight} kg`}
                            </div>
                          )}
                        </div>
                        <div className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-2.5 text-center">
                          <span className="text-[8px] text-slate-400 uppercase font-bold">
                            {language === 'ar' ? 'نسبة الدهون' : 'Body Fat'}
                          </span>
                          <div className="text-sm font-black text-amber-500 font-mono mt-0.5">{latestLog?.fat || activeMember.fat}%</div>
                          {initialLog && latestLog && (
                            <div className="text-[8px] text-slate-400 mt-1">
                              {language === 'ar' ? `البداية: ${initialLog.fat}%` : `Start: ${initialLog.fat}%`}
                            </div>
                          )}
                        </div>
                        <div className="bg-slate-800/60 border border-slate-700/30 rounded-xl p-2.5 text-center">
                          <span className="text-[8px] text-slate-400 uppercase font-bold">
                            {language === 'ar' ? 'الكتلة العضلية' : 'Muscle Mass'}
                          </span>
                          <div className="text-sm font-black text-amber-500 font-mono mt-0.5">{latestLog?.muscle || activeMember.muscle}%</div>
                          {initialLog && latestLog && (
                            <div className="text-[8px] text-slate-400 mt-1">
                              {language === 'ar' ? `البداية: ${initialLog.muscle}%` : `Start: ${initialLog.muscle}%`}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Chart container */}
                      <div className="bg-slate-800/80 rounded-2xl p-4 border border-slate-700/50 space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-xs font-black text-slate-200">
                            {language === 'ar' ? 'تتبع تقدم الوزن والدهون العضلي' : 'Weight, Fat & Muscle Progress'}
                          </h4>
                          <span className="text-[9px] text-amber-500 font-mono">
                            {language === 'ar' ? 'سجل القياسات' : 'Measurements'}
                          </span>
                        </div>
                        
                        <div className="pt-2">
                          {renderSVGChart('weight')}
                        </div>

                        <div className="text-[10px] text-slate-400 text-center leading-relaxed">
                          {language === 'ar' 
                            ? '📌 يوضح المخطط البياني تطور وزنك خلال الفترات الماضية.' 
                            : '📌 Chart shows weight evolution over past sessions.'}
                        </div>
                      </div>

                      {/* Weight Progress Stats message */}
                      {initialLog && latestLog && (
                        <div className="bg-slate-800/40 border border-slate-800 rounded-2xl p-3 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <TrendingUp className="w-4 h-4 text-emerald-500" />
                            <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                              <div className="text-[9px] text-slate-400">{language === 'ar' ? 'إجمالي تغير الوزن' : 'Total Weight Change'}</div>
                              <div className="text-xs font-bold text-slate-200">
                                {latestLog.weight - initialLog.weight < 0 
                                  ? (language === 'ar' 
                                      ? `خسرت ${Math.abs(latestLog.weight - initialLog.weight).toFixed(1)} كجم دهون/وزن بطل! 👏`
                                      : `Lost ${Math.abs(latestLog.weight - initialLog.weight).toFixed(1)} kg fat/weight champ! 👏`)
                                  : (language === 'ar'
                                      ? `اكتسبت ${(latestLog.weight - initialLog.weight).toFixed(1)} كجم كتلة بدنية! 💪`
                                      : `Gained ${(latestLog.weight - initialLog.weight).toFixed(1)} kg body mass! 💪`)}
                              </div>
                            </div>
                          </div>
                          <span className="text-[8px] text-slate-500 font-mono">
                            {language === 'ar' ? 'تتبع ذاتي' : 'Self Log'}
                          </span>
                        </div>
                      )}

                      {/* Action to log progress */}
                      {!showProgressForm ? (
                        <button 
                          onClick={() => setShowProgressForm(true)}
                          className="w-full bg-slate-800 hover:bg-slate-700 text-amber-500 border border-amber-500/20 font-bold py-2 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1"
                        >
                          <Plus className="w-4 h-4" />
                          <span>{language === 'ar' ? 'تسجيل قياسات بدنية جديدة اليوم' : 'Log New Physical Metrics Today'}</span>
                        </button>
                      ) : (
                        <form onSubmit={handleAddMeasurement} className="bg-slate-800/80 border border-slate-700/50 rounded-2xl p-4 space-y-3">
                          <div className="flex items-center justify-between pb-1 border-b border-slate-700/60">
                            <span className="text-xs font-bold text-slate-200">{language === 'ar' ? 'أدخل قياسات اليوم' : 'Enter Metrics'}</span>
                            <button type="button" onClick={() => setShowProgressForm(false)} className="text-slate-400 hover:text-slate-200">
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-3 gap-2">
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'الوزن (كجم)' : 'Weight (kg)'}</label>
                              <input 
                                type="number" 
                                step="0.1" 
                                required
                                value={newWeight}
                                onChange={(e) => setNewWeight(e.target.value)}
                                placeholder="80"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'الدهون (%)' : 'Fat (%)'}</label>
                              <input 
                                type="number" 
                                step="0.1" 
                                required
                                value={newFat}
                                onChange={(e) => setNewFat(e.target.value)}
                                placeholder="18"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono text-center"
                              />
                            </div>
                            <div>
                              <label className="block text-[10px] text-slate-400 mb-1">{language === 'ar' ? 'العضلات (%)' : 'Muscle (%)'}</label>
                              <input 
                                type="number" 
                                step="0.1" 
                                required
                                value={newMuscle}
                                onChange={(e) => setNewMuscle(e.target.value)}
                                placeholder="42"
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-mono text-center"
                              />
                            </div>
                          </div>

                          <button 
                            type="submit"
                            className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2 rounded-xl text-xs transition-colors"
                          >
                            {language === 'ar' ? 'حفظ وتحديث المخطط البياني' : 'Save & Update Graph'}
                          </button>
                        </form>
                      )}

                    </motion.div>
                  )}

                  {/* CLUB SERVICES TAB */}
                  {activeTab === 'services' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="space-y-4"
                    >
                      <div className="text-center pb-2">
                        <span className="text-[10px] text-amber-500 font-bold uppercase tracking-wider">
                          {language === 'ar' ? 'احجز و تدرّب' : 'Book & Train'}
                        </span>
                        <h3 className="text-sm font-black text-slate-200 mt-0.5">
                          {language === 'ar' ? 'خدمات ومرافق النادي المتاحة' : 'Available Gym Services & Facilities'}
                        </h3>
                      </div>

                      {/* Services Grid list */}
                      <div className="space-y-3">
                        {services.map((service) => (
                          <div 
                            key={service.id}
                            className="bg-slate-800/50 border border-slate-800 rounded-2xl p-3 flex gap-3 items-center hover:border-amber-500/30 transition-colors"
                          >
                            <div className="w-16 h-16 rounded-xl bg-slate-900 text-amber-500 border border-slate-800 flex flex-col items-center justify-center shrink-0">
                              <Dumbbell className="w-6 h-6 mb-1" />
                              <span className="text-[9px] font-bold font-mono">{service.price} {language === 'ar' ? 'د.أ' : 'JOD'}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-100">{service.title}</h4>
                              <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{service.description}</p>
                              
                              <div className="mt-2 flex gap-2">
                                <button 
                                  onClick={() => setSelectedService(service)}
                                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-[9px] px-2.5 py-1 rounded-lg transition-colors"
                                >
                                  {language === 'ar' ? 'طلب حجز موعد' : 'Book Session'}
                                </button>
                                <a 
                                  href={`https://wa.me/962700000000?text=${encodeURIComponent(language === 'ar' ? `أهلاً نادي الحصن، أود الاستفسار عن حجز خدمة: ${service.title}` : `Hello Al Huson Gym, I would like to ask about booking: ${service.title}`)}`}
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-[9px] px-2.5 py-1 rounded-lg transition-colors border border-slate-700/50"
                                >
                                  {language === 'ar' ? 'واتساب سريع' : 'Quick WhatsApp'}
                                </a>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Booking History Widget */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 mb-2">
                          {language === 'ar' ? 'طلب حجوزاتي الحالية' : 'My Active Bookings'}
                        </h4>
                        <div className="space-y-2">
                          {bookings.filter(b => b.memberId === activeMember.id).length === 0 ? (
                            <div className="text-[10px] text-slate-500 text-center py-4 bg-slate-800/10 rounded-xl border border-dashed border-slate-800">
                              {language === 'ar' ? 'لا يوجد طلبات حجز مسجلة حالياً' : 'No booked appointments registered yet'}
                            </div>
                          ) : (
                            bookings.filter(b => b.memberId === activeMember.id).map((book) => (
                              <div key={book.id} className="bg-slate-800/30 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs">
                                <div>
                                  <div className="font-bold text-slate-200">{book.serviceTitle}</div>
                                  <div className="text-[9px] text-slate-500 mt-0.5 font-mono">{book.date} | {book.timeSlot}</div>
                                </div>
                                <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold ${
                                  book.status === 'تم القبول' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                                  book.status === 'تم الرفض' ? 'bg-rose-500/15 text-rose-400 border border-rose-500/20' :
                                  'bg-amber-500/15 text-amber-400 border border-amber-500/20'
                                }`}>
                                  {book.status === 'تم القبول' ? (language === 'ar' ? 'تم القبول' : 'Accepted') :
                                   book.status === 'تم الرفض' ? (language === 'ar' ? 'تم الرفض' : 'Rejected') :
                                   (language === 'ar' ? 'قيد الانتظار' : 'Pending')}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>

                    </motion.div>
                  )}

                  {/* VIRTUAL AI COACH TAB */}
                  {activeTab === 'coach' && (
                    <motion.div 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="flex-1 flex flex-col h-[460px] bg-[#04060d] -m-4 overflow-hidden border border-[#e2b857]/10"
                    >
                      {/* Coach Profile header */}
                      <div className="bg-[#0b0e17] p-3.5 border-b border-[#e2b857]/15 flex items-center gap-3 shrink-0">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e2b857] to-[#b38a2e] text-[#070a13] flex items-center justify-center font-black shadow-lg shadow-[#e2b857]/15">
                          <Sparkles className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1.5">
                            <span className="text-[#e2b857]">{language === 'ar' ? 'الكابتن حُصين' : 'Coach Hussein'}</span>
                            <span className="bg-[#e2b857]/10 text-[#e2b857] text-[8px] px-2 py-0.5 rounded border border-[#e2b857]/25 font-bold uppercase tracking-wider">
                              {language === 'ar' ? 'ذكاء اصطناعي' : 'AI Coach'}
                            </span>
                          </div>
                          <span className="text-[8.5px] text-slate-400">
                            {language === 'ar' ? 'المدرب الافتراضي المساعد لنادي الحصن 🏆' : 'Al Huson Sports Club Personal AI Coach 🏆'}
                          </span>
                        </div>
                      </div>

                      {/* Chat Messages scroll area */}
                      <div className="flex-1 p-3.5 space-y-3.5 overflow-y-auto bg-[#04060d]/90 scrollbar-thin scrollbar-thumb-[#e2b857]/20">
                        {chatMessages.map((msg) => (
                          <div 
                            key={msg.id}
                            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-lg ${
                                msg.sender === 'user' 
                                  ? 'bg-gradient-to-r from-[#e2b857] to-[#b38a2e] text-[#070a13] rounded-br-none font-bold shadow-[#e2b857]/10' 
                                  : 'bg-[#0c0e17] text-slate-100 rounded-bl-none border border-[#e2b857]/15 shadow-[#000]/50'
                            }`}>
                              <p className="whitespace-pre-line font-medium leading-relaxed">{msg.text}</p>
                              <span className={`block text-[8px] mt-1.5 text-left ${msg.sender === 'user' ? 'text-slate-900/70 font-semibold' : 'text-slate-500 font-mono'}`}>
                                {msg.timestamp}
                              </span>
                            </div>
                          </div>
                        ))}

                        {/* AI typing indicator */}
                        {isAiTyping && (
                          <div className="flex justify-start">
                            <div className="bg-[#0c0e17] text-slate-100 rounded-2xl rounded-bl-none border border-[#e2b857]/15 px-4 py-3 flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#e2b857] animate-bounce" style={{ animationDelay: '0ms' }}></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#e2b857] animate-bounce" style={{ animationDelay: '150ms' }}></span>
                              <span className="w-1.5 h-1.5 rounded-full bg-[#e2b857] animate-bounce" style={{ animationDelay: '300ms' }}></span>
                            </div>
                          </div>
                        )}
                        <div ref={chatEndRef} />
                      </div>

                      {/* Message Input controls */}
                      <form onSubmit={handleSendMessage} className="p-3 border-t border-[#e2b857]/15 bg-[#0b0e17] flex gap-2 shrink-0">
                        <input 
                          type="text"
                          value={userInput}
                          onChange={(e) => setUserInput(e.target.value)}
                          placeholder={language === 'ar' ? 'اسأل الكابتن (جدول تمارين، وجبات)...' : 'Ask Coach (workouts, diets)...'}
                          className="flex-1 bg-[#04060d] border border-amber-500/20 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#e2b857] focus:ring-1 focus:ring-[#e2b857]/20 transition-all font-medium"
                        />
                        <button 
                          type="submit"
                          disabled={!userInput.trim() || isAiTyping}
                          className="p-2.5 bg-[#e2b857] hover:bg-[#b38a2e] disabled:opacity-40 text-slate-950 rounded-xl transition-all shrink-0 hover:scale-[1.03] shadow-md shadow-[#e2b857]/15"
                        >
                          <Send className="w-4 h-4 transform rotate-180" />
                        </button>
                      </form>
                    </motion.div>
                  )}
                  </>)}

                </div>

                {/* Bottom Navigation tab-bar */}
                {activeMember.status !== 'قيد الانتظار' && (
                  <div id="phone-nav-bar" className="absolute bottom-0 inset-x-0 h-14 border-t border-[#e2b857]/15 flex items-center justify-around px-2 z-40 bg-[#070a13] text-white">
                    <button 
                      onClick={() => { setActiveTab('home'); setShowProgressForm(false); }}
                      className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-colors ${activeTab === 'home' ? 'text-[#e2b857]' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <User className="w-4 h-4" />
                      <span>{t.navHome}</span>
                    </button>
                    
                    <button 
                      onClick={() => { setActiveTab('progress'); setShowProgressForm(false); }}
                      className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-colors ${activeTab === 'progress' ? 'text-[#e2b857]' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <TrendingUp className="w-4 h-4" />
                      <span>{language === 'ar' ? 'تطوري البدني' : 'My Body'}</span>
                    </button>
                    
                    <button 
                      onClick={() => { setActiveTab('services'); setShowProgressForm(false); }}
                      className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-colors ${activeTab === 'services' ? 'text-[#e2b857]' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <Dumbbell className="w-4 h-4" />
                      <span>{language === 'ar' ? 'الخدمات' : 'Services'}</span>
                    </button>

                    <button 
                      onClick={() => { setActiveTab('coach'); setShowProgressForm(false); }}
                      className={`flex flex-col items-center gap-0.5 text-xs font-bold transition-colors ${activeTab === 'coach' ? 'text-[#e2b857]' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{language === 'ar' ? 'الكابتن الذكي' : 'AI Coach'}</span>
                    </button>
                  </div>
                )}

              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Home Screen indicator bar */}
        <div id="home-indicator" className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-700 rounded-full z-50"></div>
      </div>

      {/* Outer simulation controls */}
      {activeMember && (
        <div className={`mt-3 bg-slate-800/40 border border-slate-800 rounded-2xl px-3 py-2 text-[10px] text-slate-400 flex items-center gap-1 font-sans ${language === 'ar' ? 'flex-row' : 'flex-row-reverse justify-end'}`}>
          <span>{language === 'ar' ? '🔄 تصفح كـ:' : '🔄 Logged in as:'}</span>
          {members.map(m => (
            <button 
              key={m.id}
              onClick={() => setActiveMember(m)}
              className={`px-2 py-0.5 rounded-lg border font-bold transition-all ${activeMember.id === m.id ? 'bg-amber-500/15 text-amber-500 border-amber-500/30' : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'}`}
            >
              {m.name.split(' ')[0]}
            </button>
          ))}
        </div>
      )}

      {/* Service booking request Modal (Renders inside absolute phone view container) */}
      <AnimatePresence>
        {selectedService && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end" style={{ direction: language === 'ar' ? "rtl" : "ltr" }}>
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full bg-slate-900 rounded-t-[30px] border-t border-slate-800 p-5 space-y-4 max-h-[85%] overflow-y-auto"
            >
              <div className="flex items-center justify-between">
                <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                  <span className="text-[10px] text-amber-500 font-bold">{language === 'ar' ? 'طلب حجز مرافق' : 'Gym Booking Request'}</span>
                  <h3 className="text-sm font-black text-slate-100">{selectedService.title}</h3>
                </div>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {bookingSuccess ? (
                <div className="text-center py-8 space-y-2">
                  <div className="inline-flex p-3 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 mb-2">
                    <CheckCircle2 className="w-8 h-8" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-200">{language === 'ar' ? 'تم إرسال طلب الحجز بنجاح' : 'Booking request sent successfully'}</h4>
                  <p className="text-[10px] text-slate-400">{language === 'ar' ? 'سيقوم كابتن الصالة بمراجعة طلبك والموافقة عليه فوراً.' : 'The club coach will review and approve your request shortly.'}</p>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="space-y-4">
                  <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                    <label className={`block text-[10px] mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{language === 'ar' ? 'اختر تاريخ التمرين' : 'Select Workout Date'}</label>
                    <input 
                      type="date" 
                      required
                      value={bookingDate}
                      onChange={(e) => setBookingDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 border ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    />
                  </div>

                   <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                    <label className={`block text-[10px] mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                      {language === 'ar' 
                        ? `الفترة الزمنية المتاحة لجنسك (${activeMember.gender === 'أنثى' ? 'فترة النساء ♀️' : 'فترة الرجال ♂️'})` 
                        : `Time slot available for you (${activeMember.gender === 'أنثى' ? 'Ladies Session ♀️' : 'Men Session ♂️'})`}
                    </label>
                    <select 
                      value={bookingTime}
                      onChange={(e) => setBookingTime(e.target.value)}
                      className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 border ${
                        theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                      }`}
                    >
                      {activeMember.gender === 'أنثى' ? (
                        <>
                          <option value="08:00">{language === 'ar' ? "08:00 ص - 09:00 ص" : "08:00 AM - 09:00 AM"}</option>
                          <option value="10:00">{language === 'ar' ? "10:00 ص - 11:00 ص" : "10:00 AM - 11:00 AM"}</option>
                          <option value="12:00">{language === 'ar' ? "12:00 م - 01:00 م" : "12:00 PM - 01:00 PM"}</option>
                          <option value="14:00">{language === 'ar' ? "02:00 م - 03:00 م" : "02:00 PM - 03:00 PM"}</option>
                        </>
                      ) : (
                        <>
                          <option value="15:00">{language === 'ar' ? "03:00 م - 04:00 م" : "03:00 PM - 04:00 PM"}</option>
                          <option value="17:00">{language === 'ar' ? "05:00 م - 06:00 م" : "05:00 PM - 06:00 PM"}</option>
                          <option value="19:00">{language === 'ar' ? "07:00 م - 08:00 م" : "07:00 PM - 08:00 PM"}</option>
                          <option value="21:00">{language === 'ar' ? "09:00 م - 10:00 م" : "09:00 PM - 10:00 PM"}</option>
                          <option value="23:00">{language === 'ar' ? "11:00 م - 12:00 ص" : "11:00 PM - 12:00 AM"}</option>
                        </>
                      )}
                    </select>
                  </div>

                  {selectedService.id === 'srv-4' && (
                    <>
                      <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                        <label className={`block text-[10px] mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          ⚽ {language === 'ar' ? 'عدد اللاعبين المتوقع' : 'Expected Players Count'}
                        </label>
                        <input 
                          type="number" 
                          required
                          min={1}
                          max={30}
                          value={bookingPlayersCount}
                          onChange={(e) => setBookingPlayersCount(parseInt(e.target.value) || 10)}
                          className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 border ${
                            theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                      <div className={language === 'ar' ? 'text-right' : 'text-left'}>
                        <label className={`block text-[10px] mb-1.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                          📝 {language === 'ar' ? 'ملاحظات وتفضيلات إضافية' : 'Extra Notes & Preferences'}
                        </label>
                        <textarea 
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                          placeholder={language === 'ar' ? 'مثال: نحتاج كرات ملونة وصافرة حكم...' : 'e.g., We need colored bibs and footballs...'}
                          className={`w-full rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 border h-16 ${
                            theme === 'dark' ? 'bg-slate-850 border-slate-700 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                    </>
                  )}

                  <div className={`text-[10px] rounded-xl border leading-relaxed p-2.5 ${
                    theme === 'dark' ? 'text-slate-400 bg-slate-950/40 border-slate-800' : 'text-slate-600 bg-slate-50 border-slate-200'
                  } ${language === 'ar' ? 'text-right' : 'text-left'}`}>
                    📝 <span className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>{language === 'ar' ? 'ملاحظة:' : 'Note:'}</span> {language === 'ar' ? 'سيظهر هذا الحجز فوراً في لوحة تحكم الإدارة لتمكين قبول الطلب أو رفضه.' : 'This booking will instantly appear on the admin dashboard for instant approval/rejection.'}
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold py-2.5 rounded-xl text-xs transition-colors"
                  >
                    {language === 'ar' ? 'تأكيد وإرسال الطلب للرئيسية' : 'Confirm & Send Request'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 🔔 Real-Time Push Notification Banner Popup */}
      <AnimatePresence>
        {activeBannerNotification && (
          <motion.div 
            initial={{ opacity: 0, y: -80, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -80, scale: 0.95 }}
            className={`absolute top-4 inset-x-4 bg-slate-900/95 border border-amber-500/30 p-3.5 rounded-2xl shadow-2xl z-50 backdrop-blur-md flex gap-3 items-start select-none cursor-pointer ${language === 'ar' ? 'text-right' : 'text-left'}`}
            style={{ direction: language === 'ar' ? "rtl" : "ltr" }}
            onClick={() => {
              setShowNotificationsModal(true);
              setActiveBannerNotification(null);
            }}
          >
            <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1 min-w-0">
              <div className={`flex justify-between items-center ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                <span className="text-[10px] text-amber-500 font-black">{language === 'ar' ? 'إشعار عاجل من الكابتن 📣' : 'Alert from Coach 📣'}</span>
                <span className="text-[8px] text-slate-500 font-mono">{language === 'ar' ? 'الآن' : 'Now'}</span>
              </div>
              <h4 className="text-xs font-black text-slate-100 mt-0.5 truncate">{activeBannerNotification.title}</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-relaxed font-medium line-clamp-2">{activeBannerNotification.message}</p>
            </div>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setActiveBannerNotification(null);
              }}
              className="p-1 rounded-lg bg-slate-800 text-slate-400 hover:text-slate-100 shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 📂 Full Notifications Center Modal */}
      <AnimatePresence>
        {showNotificationsModal && activeMember && (
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-end" style={{ direction: language === 'ar' ? "rtl" : "ltr" }}>
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              className="w-full bg-slate-900 rounded-t-[30px] border-t border-slate-800 p-5 space-y-4 max-h-[85%] flex flex-col"
            >
              <div className="flex items-center justify-between shrink-0">
                <div className={`flex items-center gap-2 ${language === 'ar' ? 'flex-row' : 'flex-row-reverse text-left'}`}>
                  <div className="p-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                    <Bell className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-100">{language === 'ar' ? 'مركز الإشعارات والتنبيهات 🔔' : 'Notifications Center 🔔'}</h3>
                    <p className="text-[9px] text-slate-400">{language === 'ar' ? 'آخر تحديثات صالة نادي الحصن ومواعيدك' : 'Latest updates from Al Huson Gym & bookings'}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowNotificationsModal(false)}
                  className="p-1 rounded-full bg-slate-800 text-slate-400 hover:text-slate-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* List scroll area */}
              <div className="flex-1 overflow-y-auto space-y-2.5 py-2">
                {notifications.filter(n => n.memberId === 'all' || n.memberId === activeMember.id).length === 0 ? (
                  <div className="text-center py-12 text-slate-500 space-y-2">
                    <Bell className="w-10 h-10 mx-auto stroke-[1] text-slate-600" />
                    <p className="text-xs">{language === 'ar' ? 'لا توجد إشعارات مسجلة لك في الوقت الحالي.' : 'No notifications registered for you at this time.'}</p>
                  </div>
                ) : (
                  [...notifications]
                    .filter(n => n.memberId === 'all' || n.memberId === activeMember.id)
                    .sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime())
                    .map((item) => {
                      // Automatically mark as read if not read yet on render
                      if (!item.read) {
                        setTimeout(() => {
                          const updated = notifications.map(n => n.id === item.id ? { ...n, read: true } : n);
                          setNotifications(updated);
                        }, 1500);
                      }

                      return (
                        <div 
                          key={item.id} 
                          className={`p-3.5 rounded-2xl border transition-all relative overflow-hidden group ${language === 'ar' ? 'text-right' : 'text-left'} ${
                            item.read 
                              ? 'bg-slate-900/40 border-slate-800/60 text-slate-400' 
                              : 'bg-amber-500/[0.03] border-amber-500/25 text-slate-100 shadow-md shadow-amber-500/[0.02]'
                          }`}
                        >
                          {!item.read && (
                            <div className={`absolute top-3.5 w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse ${language === 'ar' ? 'right-3.5' : 'left-3.5'}`}></div>
                          )}
                          <div className={`flex justify-between items-start gap-1 ${!item.read ? (language === 'ar' ? 'pr-3.5' : 'pl-3.5') : ''} ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                            <h4 className="text-[11px] font-black text-slate-200">{item.title}</h4>
                            <span className="text-[8px] text-slate-500 font-mono shrink-0">
                              {item.createdAt ? new Date(item.createdAt).toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', { month: 'short', day: 'numeric' }) : (language === 'ar' ? 'الآن' : 'Now')}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed font-light">{item.message}</p>
                          
                          <div className={`flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800/40 text-[9px] text-slate-500 font-mono ${language === 'ar' ? 'flex-row' : 'flex-row-reverse'}`}>
                            <span>{language === 'ar' ? 'المرسل: الطاقم الإداري' : 'Sender: Admin Team'}</span>
                            {!item.read && <span className="text-amber-500 font-black">{language === 'ar' ? 'جديد ✨' : 'New ✨'}</span>}
                          </div>
                        </div>
                      );
                    })
                )}
              </div>

              <button 
                onClick={() => setShowNotificationsModal(false)}
                className="w-full bg-slate-800 hover:bg-slate-750 border border-slate-700/50 text-slate-200 font-bold py-2.5 rounded-xl text-xs transition-colors shrink-0"
              >
                {language === 'ar' ? 'إغلاق مركز الإشعارات' : 'Close Notifications'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
