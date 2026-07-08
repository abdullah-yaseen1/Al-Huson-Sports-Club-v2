import React, { useState, useEffect } from "react";
import { 
  Dumbbell, Smartphone, ShieldCheck, UserPlus, 
  Sparkles, Star, Phone, Mail, MapPin, 
  Facebook, Instagram, Youtube, Globe, Menu, X, Check, Laptop, Users, Award,
  Waves, Coffee, CircleEllipsis, CalendarCheck2, Trophy, ShieldAlert, KeyRound, ChevronDown,
  Download, Monitor, ArrowRight, Clock, Shield, CheckCircle2, RefreshCw
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import AlHusonLogo from "./AlHusonLogo";

// Self-contained localized translations for the premium Al Huson Landing Page
const localTranslations = {
  ar: {
    navHome: "الرئيسية",
    navServices: "خدماتنا",
    navGallery: "معرض الصور",
    navStats: "الأرقام",
    navContact: "اتصل بنا",
    navDownload: "تحميل التطبيق",
    
    welcomeTitle: "مرحباً بك في",
    clubName: "نادي الحصن الرياضي",
    slogan: "اكتشف خدماتنا المميزة وحقق أهدافك الرياضية مع منصتنا الأكثر تطوراً",
    exploreServicesBtn: "استكشف خدماتنا 🏋️",
    downloadAppBtn: "تحميل التطبيق الآن ⚡",
    
    downloadSectionTitle: "تحميل التطبيق الرسمي",
    downloadSectionSub: "جميع اشتراكاتك، حصصك الرياضية، وجداولك في مكان واحد. حمّل النسخة المخصصة لجهازك الآن وابدأ رحلتك الرياضية.",
    
    downloadWindows: "تحميل لنظام ويندوز",
    downloadAndroid: "تحميل لنظام أندرويد",
    downloadIOS: "تحميل لنظام آيفون (iOS)",
    
    servicesTitle: "خدماتنا المميزة",
    servicesSub: "تنوع وجودة تفوق التوقعات",
    
    serviceGym: "صالة رياضية متكاملة",
    serviceGymDesc: "أحدث الأجهزة والمعدات المتكاملة لبناء الأجسام واللياقة البدنية تحت إشراف أفضل المدربين المعتمدين.",
    servicePool: "مسبح أولمبي دافئ",
    servicePoolDesc: "مسبح داخلي دافئ ومرافق معقمة بالكامل طوال العام لمختلف الأعمار ومستويات التدريب.",
    serviceCafe: "كافيتيريا البروتين والصحة",
    serviceCafeDesc: "مشروبات بروتينية صحية، وجبات غذائية متوازنة، وقهوة تعدل مزاجك بعد حصتك التدريبية المكثفة.",
    serviceFields: "حجز الملاعب الذكي",
    serviceFieldsDesc: "احجز ملعبك المفضل لكرة القدم أو الألعاب الجماعية بسهولة عبر التطبيق مع خدمات متكاملة وإضاءة ذكية.",
    serviceClasses: "الأنشطة الجماعية",
    serviceClassesDesc: "حصص رياضية متنوعة تشمل الزومبا، الكارديو، الكيك بوكسينغ، وتمارين الأيروبيكس الحماسية.",
    serviceOffers: "العروض السنوية والشهرية",
    serviceOffersDesc: "عروض واشتراكات حصرية تمنحك قيمة حقيقية لتستمر في تحقيق أهدافك البدنية طوال العام.",
    
    statsTitle: "إنجازات نادي الحصن بالأرقام",
    statMembers: "مشترك نشط",
    statEquipment: "جهاز رياضي حديث",
    statServices: "مرافق وخدمات متكاملة",
    statExperience: "سنوات من التميز الرياضي",
    
    galleryTitle: "معرض النادي الفاخر",
    gallerySub: "جولة بصرية ساحرة داخل أروقة ومرافق النادي الأكثر فخامة",
    galleryGym: "صالة الحديد والأثقال",
    galleryPool: "المسبح الأولمبي المغلق",
    galleryClasses: "صالة الأنشطة الجماعية",
    galleryCafe: "استراحة الكافيه والصحة",
    galleryFields: "ملاعب العشب الطبيعي والإنارة",
    galleryCardio: "منطقة تمارين الكارديو ولياقة القلب",
    
    reviewsTitle: "آراء عملائنا وأبطالنا",
    reviewSub: "ثقة أبطالنا هي سر نجاحنا والدافع وراء تميزنا المستمر",
    reviewYears: "مشترك منذ",
    reviewYearsFemale: "مشتركة منذ",
    
    review1Text: "أفضل نادي في المنطقة على الإطلاق! المدربون محترفون للغاية، والأجهزة حديثة جداً والمرافق نظيفة وراقية بشكل يفوق الوصف.",
    review1Author: "أحمد الشوبكي",
    review1Year: "2022",
    
    review2Text: "المسبح دافئ ومصمم بطريقة ممتازة، والتعقيم يومي. الخدمات المتاحة ممتازة والتطبيق يسهل كل الحجوزات والمتابعة اليومية.",
    review2Author: "سارة المومني",
    review2Year: "2023",
    
    review3Text: "أجواء حماسية وتنافسية رائعة! المدربون يتابعون المتدرب بشكل شخصي وصالة الكارديو واسعة ومطلة بشكل مريح.",
    review3Author: "محمد البطاينة",
    review3Year: "2021",
    
    contactTitle: "تواصل معنا مباشرة",
    contactSub: "تفضل بزيارتنا أو تواصل مع فريق خدمة العملاء على مدار الساعة",
    contactAddress: "الموقع الجغرافي",
    contactPhone: "هاتف التواصل",
    contactEmail: "البريد الإلكتروني",
    contactHours: "ساعات العمل الرسمية",
    contactHoursWeekdays: "السبت - الخميس: 6:00 صباحاً - 11:00 مساءً",
    contactHoursFriday: "الجمعة: 2:00 ظهراً - 10:00 مساءً",
    contactOpenNow: "النادي مفتوح حالياً - أهلاً بك",
    contactClosedNow: "النادي مغلق حالياً - ننتظرك غداً",
    contactFormTitle: "إرسال رسالة سريعة",
    contactFormName: "الاسم الكامل",
    contactFormPhone: "رقم الهاتف",
    contactFormMsg: "نص الرسالة",
    contactFormSubmit: "إرسال الرسالة",
    contactFormSuccess: "تم إرسال رسالتك بنجاح! سيتواصل معك فريق الدعم قريباً.",
    
    footerDesc: "نحن هنا لمساعدتك في تحقيق أهدافك الرياضية والصحية من خلال توفير بيئة رياضية ممتازة وأحدث التقنيات والأجهزة الذكية.",
    footerQuickLinks: "روابط سريعة",
    footerOurServices: "خدماتنا الأساسية",
    footerContactInfo: "معلومات التواصل",
    footerFollowUs: "تابعنا عبر وسائل التواصل",
    footerCopyright: "جميع الحقوق محفوظة © 2026 نادي الحصن الرياضي",
    
    addressText: "إربد - منطقة الحصن، المملكة الأردنية الهاشمية",
    phoneText: "+962 2 710 1234",
    emailText: "contact@alhusonsc.com",
    
    scrollingHint: "اسحب لأسفل لاستكشاف المزيد"
  },
  en: {
    navHome: "Home",
    navServices: "Services",
    navGallery: "Gallery",
    navStats: "Stats",
    navContact: "Contact Us",
    navDownload: "Download App",
    
    welcomeTitle: "Welcome To",
    clubName: "Al Huson Sports Club",
    slogan: "Discover our premium services and achieve your fitness goals with our cutting-edge companion application",
    exploreServicesBtn: "Explore Services 🏋️",
    downloadAppBtn: "Download App Now ⚡",
    
    downloadSectionTitle: "Download the Official Application",
    downloadSectionSub: "Your subscriptions, active class schedules, progress tracking, and bookings all in one unified, high-performance interface. Download the correct app build for your device.",
    
    downloadWindows: "Download for Windows",
    downloadAndroid: "Download for Android",
    downloadIOS: "Download for iPhone (iOS)",
    
    servicesTitle: "Our Premium Services",
    servicesSub: "Diversity and quality that exceeds expectations",
    
    serviceGym: "Fully Equipped Gym",
    serviceGymDesc: "Fully loaded weight room with state-of-the-art bodybuilding and athletic training gear supervised by certified elite coaches.",
    servicePool: "Heated Olympic Pool",
    servicePoolDesc: "Indoor, fully heated swimming pool with strict daily sanitization protocols open year-round for all ages.",
    serviceCafe: "Protein & Health Cafe",
    serviceCafeDesc: "Premium protein shakes, healthy balanced meal plans, and freshly brewed coffees to elevate your recovery phase.",
    serviceFields: "Smart Turf Booking",
    serviceFieldsDesc: "Book soccer and multi-sport fields directly through your app with high-lux night lighting and dynamic access controls.",
    serviceClasses: "Dynamic Group Classes",
    serviceClassesDesc: "High-energy workout classes including Zumba, Cardio, Kickboxing, and instructor-guided Aerobics.",
    serviceOffers: "Flexible Subscription Plans",
    serviceOffersDesc: "Exclusive monthly, semi-annual, and annual membership packages giving you unmatched fitness value.",
    
    statsTitle: "Al Huson Accomplishments in Numbers",
    statMembers: "Active Members",
    statEquipment: "Modern Gym Equipment",
    statServices: "Premium Facilities",
    statExperience: "Years of Excellence",
    
    galleryTitle: "Our Premium Gallery",
    gallerySub: "Take a visual journey inside our high-end training facilities",
    galleryGym: "Professional Iron Zone",
    galleryPool: "Indoor Olympic Swimming Pool",
    galleryClasses: "Aerobics & Group Classes Studio",
    galleryCafe: "Premium Fuel Cafeteria",
    galleryFields: "Night-lit Professional Fields",
    galleryCardio: "Dedicated Advanced Cardio Zone",
    
    reviewsTitle: "Our Champions' Reviews",
    reviewSub: "Our members' trust is our proudest metric and our constant motivation",
    reviewYears: "Member since",
    reviewYearsFemale: "Member since",
    
    review1Text: "Absolutely the best fitness club in Irbid! The coaches are exceptionally professional, the gear is modern, and the facility hygiene is stellar.",
    review1Author: "Ahmad Al-Shobaki",
    review1Year: "2022",
    
    review2Text: "The heated pool is perfectly maintained and extremely hygienic. The dedicated companion application makes class bookings so seamless.",
    review2Author: "Sarah Al-Momani",
    review2Year: "2023",
    
    review3Text: "Superb energetic atmosphere! The trainers are supportive, the cardio deck has an outstanding panoramic view, and the protein shakes are delicious.",
    review3Author: "Mohammad Al-Batayneh",
    review3Year: "2021",
    
    contactTitle: "Contact Us Directly",
    contactSub: "Visit our club or reach our client assistance desk 24/7",
    contactAddress: "Physical Address",
    contactPhone: "Telephone Line",
    contactEmail: "Email Support",
    contactHours: "Working Hours",
    contactHoursWeekdays: "Sat - Thu: 6:00 AM - 11:00 PM",
    contactHoursFriday: "Friday: 2:00 PM - 10:00 PM",
    contactOpenNow: "Club is currently OPEN - Welcome",
    contactClosedNow: "Club is currently CLOSED - See you tomorrow",
    contactFormTitle: "Send Us a Quick Message",
    contactFormName: "Full Name",
    contactFormPhone: "Phone Number",
    contactFormMsg: "Message text",
    contactFormSubmit: "Send Message",
    contactFormSuccess: "Your message has been sent successfully! Our team will contact you shortly.",
    
    footerDesc: "We are here to help you achieve your fitness and health goals by providing a premium training environment with smart tech integration.",
    footerQuickLinks: "Quick Links",
    footerOurServices: "Our Core Services",
    footerContactInfo: "Contact Details",
    footerFollowUs: "Follow Our Journey",
    footerCopyright: "All Rights Rights Reserved © 2026 Al Huson Sports Club",
    
    addressText: "Al Huson, Irbid District, Hashemite Kingdom of Jordan",
    phoneText: "+962 2 710 1234",
    emailText: "contact@alhusonsc.com",
    
    scrollingHint: "Scroll down to discover more"
  }
};

interface LandingPageProps {
  language: 'ar' | 'en';
  theme: 'dark' | 'light';
  clubName: string;
  clubLogo: string;
  onAdminLoginClick?: () => void;
  onMemberLoginClick?: () => void;
  onRegisterClick?: () => void;
  onToggleLanguage: () => void;
  onToggleTheme: () => void;
  phoneSimulatorSlot?: React.ReactNode;
  layoutMode?: 'split' | 'phone' | 'pc' | 'admin';
  onChangeLayoutMode?: (mode: 'split' | 'phone' | 'pc' | 'admin') => void;
}

export default function LandingPage({
  language,
  theme,
  clubName: currentClubName,
  clubLogo: currentClubLogo,
  onAdminLoginClick,
  onMemberLoginClick,
  onRegisterClick,
  onToggleLanguage,
  onToggleTheme,
  phoneSimulatorSlot,
  layoutMode = 'pc',
  onChangeLayoutMode
}: LandingPageProps) {
  const t = localTranslations[language];
  const isRtl = language === 'ar';

  const [activeTab, setActiveTab] = useState("home");
  const [isClubOpen, setIsClubOpen] = useState(true);

  // Message Form State
  const [msgName, setMsgName] = useState("");
  const [msgPhone, setMsgPhone] = useState("");
  const [msgText, setMsgText] = useState("");
  const [msgSuccess, setMsgSuccess] = useState(false);

  // Client-Side Programmatic Download Simulation State
  const [downloadState, setDownloadState] = useState({
    active: false,
    progress: 0,
    platform: '',
    fileName: ''
  });

  // Calculate if the club is currently open (Jordan local time)
  useEffect(() => {
    const checkOpenStatus = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentDay = now.getDay(); // 0 is Sunday, 5 is Friday, 6 is Saturday

      if (currentDay === 5) { // Friday: 2 PM (14) to 10 PM (22)
        setIsClubOpen(currentHour >= 14 && currentHour < 22);
      } else { // Saturday - Thursday: 6 AM to 11 PM (23)
        setIsClubOpen(currentHour >= 6 && currentHour < 23);
      }
    };
    checkOpenStatus();
    const interval = setInterval(checkOpenStatus, 60000);
    return () => clearInterval(interval);
  }, []);
  
  // Smooth scroll handler
  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  // Programmatic client-side binary generator & downloader
  const handleDownloadPlatform = (platform: 'windows' | 'android' | 'ios') => {
    const fileName = platform === 'windows' 
      ? 'AlHuson_Sports_Club_Setup.exe' 
      : platform === 'android' 
        ? 'AlHuson_Sports_Club_v2.4.apk' 
        : 'AlHuson_Sports_Club_iOS.mobileconfig';

    setDownloadState({
      active: true,
      progress: 0,
      platform,
      fileName
    });

    let currentProgress = 0;
    const interval = setInterval(() => {
      // Smooth incremental steps
      currentProgress += Math.floor(Math.random() * 12) + 6;
      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);

        // Generate customized platform stub
        let fileContent = '';
        let fileMime = 'text/plain';

        if (platform === 'windows') {
          // A nice safe batch file stub renamed to .exe
          fileContent = `@echo off\ncls\necho ===================================================\necho       AL HUSON SPORTS CLUB - WINDOWS APP INSTALLED   \necho ===================================================\necho Version: v2.4.0\necho Server Environment: Cloud Container Active\necho Live URL: https://alhusonsc.com\n\necho Loading secure local cryptographic vault...\necho Synchronizing subscription logs and member schedules...\npause\n`;
          fileMime = 'application/octet-stream';
        } else if (platform === 'android') {
          fileContent = 'AlHuson Sports Club Companion Application - Android Build Package (v2.4.0-APK).\nAuthorized distribution channel: Al Huson Sports Club CDN.';
          fileMime = 'application/vnd.android.package-archive';
        } else {
          // iOS dynamic Webclip config profile
          fileContent = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
  <key>PayloadDisplayName</key>
  <string>Al Huson Sports Club</string>
  <key>PayloadIdentifier</key>
  <string>com.alhuson.sportsclub.companion</string>
  <key>PayloadType</key>
  <string>Configuration</string>
  <key>PayloadUUID</key>
  <string>9A9C96E1-8BD4-44A3-BAFE-A9EF53748261</string>
  <key>PayloadVersion</key>
  <integer>1</integer>
</dict>
</plist>`;
          fileMime = 'application/x-apple-aspen-config';
        }

        // Programmatic trigger
        const blob = new Blob([fileContent], { type: fileMime });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);

        // Complete transition
        setTimeout(() => {
          setDownloadState(prev => ({ ...prev, progress: 100 }));
          setTimeout(() => {
            setDownloadState(prev => ({ ...prev, active: false }));
          }, 2500);
        }, 300);

      } else {
        setDownloadState(prev => ({ ...prev, progress: currentProgress }));
      }
    }, 120);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msgName || !msgPhone) return;
    setMsgSuccess(true);
    setMsgName("");
    setMsgPhone("");
    setMsgText("");
    setTimeout(() => setMsgSuccess(false), 5000);
  };

  // Gallery items with pristine high-res sports photos from unsplash (themed dark & gold)
  const galleryItems = [
    {
      url: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=600",
      title: t.galleryGym,
      desc: language === 'ar' ? "معدات ومسافات رحبة لكل التمارين" : "Unrivaled space and professional free weight gear"
    },
    {
      url: "https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&q=80&w=600",
      title: t.galleryPool,
      desc: language === 'ar' ? "درجة حرارة دافئة وتعقيم متطور مستمر" : "Year-round heating and absolute water sanitation"
    },
    {
      url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80&w=600",
      title: t.galleryClasses,
      desc: language === 'ar' ? "أجواء ملهمة ومشاركة اجتماعية حية" : "Inspiring community workouts with top-tier guides"
    },
    {
      url: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?auto=format&fit=crop&q=80&w=600",
      title: t.galleryCafe,
      desc: language === 'ar' ? "تغذية ومكملات متطابقة لنمو بدني سليم" : "Perfect proteins, high-grade snacks, and custom brewing"
    },
    {
      url: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=600",
      title: t.galleryFields,
      desc: language === 'ar' ? "ملاعب عشبية متطورة بنظام حجز فوري" : "Elite night-lit pitches with custom app reservation"
    },
    {
      url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=600",
      title: t.galleryCardio,
      desc: language === 'ar' ? "أجهزة ذكية متصلة لقياس معدلات الحرق والقلب" : "Heart-rate monitoring decks with dynamic view arrays"
    }
  ];

  return (
    <div className="w-full text-slate-100 bg-[#070a13] font-sans antialiased overflow-x-hidden selection:bg-[#e2b857]/30 selection:text-white">
      
      {/* 1. PREMIUM STICKY HEADER */}
      <header id="landing-sticky-header" className="sticky top-0 z-40 bg-[#070a13]/95 backdrop-blur-md border-b border-[#e2b857]/15 px-4 md:px-8 py-3.5 flex items-center justify-between">
        
        {/* Left Side: Simulation mode switcher and brand logo */}
        <div className="flex items-center gap-4 lg:gap-6">
          {/* Switcher Pill for development inspection */}
          <div className="flex items-center bg-slate-950/80 border border-[#e2b857]/20 p-1 rounded-xl shadow-lg">
            <button 
              onClick={() => onChangeLayoutMode?.('pc')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${layoutMode === 'pc' ? 'bg-[#e2b857] text-[#070a13] border border-[#e2b857] font-black' : 'text-slate-300 border border-transparent hover:text-white hover:bg-slate-900/60'}`}
            >
              <Laptop className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'عرض الموقع' : 'Website'}</span>
            </button>
            <button 
              onClick={() => onChangeLayoutMode?.('phone')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${layoutMode === 'phone' ? 'bg-[#e2b857] text-slate-950 border border-[#e2b857] font-black' : 'text-[#e2b857] border border-[#e2b857]/30 hover:bg-[#e2b857]/5'}`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'التطبيق' : 'App (Mobile)'}</span>
            </button>
          </div>

          {/* Brand Identity */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { scrollToSection("hero-sec"); setActiveTab("home"); }}>
            <div className="shrink-0">
              <AlHusonLogo size={42} />
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-xs md:text-sm font-extrabold text-white tracking-tight block leading-tight">
                {language === 'ar' ? 'نادي الحصن الرياضي' : 'AL HUSON SPORTS CLUB'}
              </span>
              <span className="text-[9px] text-[#e2b857] font-bold block tracking-widest font-mono uppercase mt-0.5">
                AL HUSON SPORTS CLUB
              </span>
            </div>
          </div>
        </div>

        {/* Center-Right Navigation Links */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-[13px] font-medium text-slate-300">
          <button 
            onClick={() => { scrollToSection("hero-sec"); setActiveTab("home"); }} 
            className={`hover:text-[#e2b857] transition-all relative py-1.5 font-bold cursor-pointer ${activeTab === "home" ? "text-[#e2b857]" : ""}`}
          >
            <span>{t.navHome}</span>
            {activeTab === "home" && (
              <motion.span layoutId="activeNavUnderline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e2b857] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => { scrollToSection("services-sec"); setActiveTab("services"); }} 
            className={`hover:text-[#e2b857] transition-all relative py-1.5 font-bold cursor-pointer ${activeTab === "services" ? "text-[#e2b857]" : ""}`}
          >
            <span>{t.navServices}</span>
            {activeTab === "services" && (
              <motion.span layoutId="activeNavUnderline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e2b857] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => { scrollToSection("gallery-sec"); setActiveTab("gallery"); }} 
            className={`hover:text-[#e2b857] transition-all relative py-1.5 font-bold cursor-pointer ${activeTab === "gallery" ? "text-[#e2b857]" : ""}`}
          >
            <span>{t.navGallery}</span>
            {activeTab === "gallery" && (
              <motion.span layoutId="activeNavUnderline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e2b857] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => { scrollToSection("stats-sec"); setActiveTab("stats"); }} 
            className={`hover:text-[#e2b857] transition-all relative py-1.5 font-bold cursor-pointer ${activeTab === "stats" ? "text-[#e2b857]" : ""}`}
          >
            <span>{t.navStats}</span>
            {activeTab === "stats" && (
              <motion.span layoutId="activeNavUnderline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e2b857] rounded-full" />
            )}
          </button>
          <button 
            onClick={() => { scrollToSection("contact-sec"); setActiveTab("contact"); }} 
            className={`hover:text-[#e2b857] transition-all relative py-1.5 font-bold cursor-pointer ${activeTab === "contact" ? "text-[#e2b857]" : ""}`}
          >
            <span>{t.navContact}</span>
            {activeTab === "contact" && (
              <motion.span layoutId="activeNavUnderline" className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#e2b857] rounded-full" />
            )}
          </button>
        </nav>

        {/* Far Right Action Buttons (Language & Premium Download trigger) */}
        <div className="flex items-center gap-3">
          <button 
            onClick={onToggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-950/60 border border-[#e2b857]/30 hover:border-[#e2b857] hover:bg-[#e2b857]/5 text-xs text-slate-100 font-bold transition-all cursor-pointer shadow-lg shadow-black/30"
          >
            <Globe className="w-3.5 h-3.5 text-[#e2b857]" />
            <span>{language === 'ar' ? 'العربية' : 'English'}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>

          {/* Smooth scroll down to Download Section */}
          <button
            onClick={() => { scrollToSection("download-sec"); setActiveTab("download"); }}
            className="hidden sm:flex items-center gap-2 px-4 py-1.5 rounded-xl border border-[#e2b857] bg-[#e2b857] hover:bg-[#e2b857]/90 text-slate-950 text-xs font-black transition-all cursor-pointer shadow-lg shadow-black/30 animate-pulse"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تحميل التطبيق' : 'Download App'}</span>
          </button>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section id="hero-sec" className="relative pt-16 pb-24 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center min-h-[600px]">
        
        {/* Ambient background blur elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-[#e2b857]/5 rounded-full blur-[130px] pointer-events-none -z-10 animate-pulse"></div>

        {/* Left Column (Main Intro Text & CTA Buttons) */}
        <div className="lg:col-span-7 flex flex-col justify-center text-center lg:text-right space-y-7">
          <div className="space-y-3">
            <span className="text-[#e2b857] font-black tracking-widest text-sm uppercase block font-sans">
              ✨ {t.welcomeTitle}
            </span>
            <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight font-sans">
              {language === 'ar' ? 'نادي الحصن الرياضي' : 'Al Huson Sports Club'}
            </h1>
            <h2 className="text-[#e2b857] text-lg md:text-2xl font-extrabold tracking-widest font-mono mt-1">
              AL HUSON SPORTS CLUB
            </h2>
          </div>

          <p className="text-slate-400 text-sm md:text-base leading-relaxed max-w-2xl mx-auto lg:mx-0 font-sans">
            {t.slogan}
          </p>

          {/* Clean landing page CTAs - pointing exclusively to download or feature explorations */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4 justify-center lg:justify-start">
            
            {/* Primary Gold Button to Download Section */}
            <button 
              onClick={() => { scrollToSection("download-sec"); setActiveTab("download"); }}
              className="flex items-center gap-3.5 px-7 py-4 rounded-2xl bg-gradient-to-r from-[#e2b857] to-[#f5cb6c] hover:from-[#f5cb6c] hover:to-[#e2b857] text-slate-950 font-black text-sm shadow-2xl shadow-[#e2b857]/15 transition-all transform hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto justify-center"
            >
              <Smartphone className="w-5 h-5" />
              <span>{t.downloadAppBtn}</span>
            </button>

            {/* Secondary Transparent Button to Services */}
            <button 
              onClick={() => { scrollToSection("services-sec"); setActiveTab("services"); }}
              className="flex items-center gap-3.5 px-7 py-4 rounded-2xl bg-slate-950/40 border border-[#e2b857]/30 hover:border-[#e2b857] hover:bg-[#e2b857]/5 text-white font-black text-sm transition-all transform hover:-translate-y-0.5 cursor-pointer w-full sm:w-auto justify-center shadow-xl"
            >
              <Dumbbell className="w-5 h-5 text-[#e2b857]" />
              <span>{t.exploreServicesBtn}</span>
            </button>
          </div>
        </div>

        {/* Right Column (Glistening Gym Hero Image with brand shield) */}
        <div className="lg:col-span-5 relative flex justify-center w-full">
          <div className="relative rounded-[32px] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.85)] border-2 border-[#e2b857]/20 max-w-sm lg:max-w-md w-full aspect-square group">
            {/* High-quality fitness photo */}
            <img 
              src="https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80&w=700" 
              alt="Al Huson Premium Gym" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000 filter brightness-75"
              referrerPolicy="no-referrer"
            />
            {/* Premium Golden Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#070a13] via-[#070a13]/25 to-transparent"></div>
            
            {/* Glowing Brand Badge overlay */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
              <div className="relative p-2 rounded-full">
                <div className="absolute inset-0 bg-[#e2b857] rounded-full blur-xl opacity-25 animate-pulse"></div>
                <div className="relative bg-[#070a13]/90 rounded-full p-1.5 border-2 border-[#e2b857] shadow-2xl transform group-hover:scale-110 transition-transform duration-700">
                  <AlHusonLogo size={75} />
                </div>
              </div>
              <span className="text-white text-xs font-black tracking-widest mt-4 uppercase text-center drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] font-mono">
                AL HUSON CLUB
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DOWNLOAD THE APPLICATION SECTION (The Sole Portal/Call-to-Action) */}
      <section id="download-sec" className="relative py-20 px-4 bg-slate-950/80 border-y border-slate-900 overflow-hidden">
        {/* Glow ambient decoration */}
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-[#e2b857]/5 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-5xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <span className="text-[#e2b857] text-xs font-black uppercase tracking-widest block mb-2 font-mono">🚀 PLATFORM ACCESS</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">{t.downloadSectionTitle}</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-3 leading-relaxed">
              {t.downloadSectionSub}
            </p>
            <div className="w-16 h-1 bg-[#e2b857] mx-auto mt-5 rounded"></div>
          </div>

          {/* Elegant Section containing ONLY the 3 strict download buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            
            {/* Button 1: Download for Windows */}
            <button 
              onClick={() => handleDownloadPlatform('windows')}
              className="group bg-[#04060d]/90 border border-[#e2b857]/15 hover:border-[#e2b857] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:-translate-y-1.5 transition-all cursor-pointer shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#e2b857]/5 rounded-full blur-xl group-hover:bg-[#e2b857]/10 transition-colors"></div>
              <div className="w-14 h-14 rounded-2xl bg-[#e2b857]/5 flex items-center justify-center border border-[#e2b857]/10 group-hover:bg-[#e2b857]/15 group-hover:border-[#e2b857]/40 transition-colors shrink-0">
                <Laptop className="w-7 h-7 text-[#e2b857]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white text-sm font-black font-sans group-hover:text-[#e2b857] transition-colors">{t.downloadWindows}</h4>
                <p className="text-[#e2b857] text-xs font-bold font-mono tracking-wide">Windows Installer (.EXE)</p>
              </div>
              <span className="text-[11px] text-slate-500 font-medium group-hover:text-slate-400">Windows 10 / 11 Supported</span>
            </button>

            {/* Button 2: Download for Android */}
            <button 
              onClick={() => handleDownloadPlatform('android')}
              className="group bg-[#04060d]/90 border border-[#e2b857]/15 hover:border-[#e2b857] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:-translate-y-1.5 transition-all cursor-pointer shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#e2b857]/5 rounded-full blur-xl group-hover:bg-[#e2b857]/10 transition-colors"></div>
              <div className="w-14 h-14 rounded-2xl bg-[#e2b857]/5 flex items-center justify-center border border-[#e2b857]/10 group-hover:bg-[#e2b857]/15 group-hover:border-[#e2b857]/40 transition-colors shrink-0">
                <Smartphone className="w-7 h-7 text-[#e2b857]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white text-sm font-black font-sans group-hover:text-[#e2b857] transition-colors">{t.downloadAndroid}</h4>
                <p className="text-[#e2b857] text-xs font-bold font-mono tracking-wide">Android Package (.APK)</p>
              </div>
              <span className="text-[11px] text-slate-500 font-medium group-hover:text-slate-400">v7.0 Nougat &amp; Above</span>
            </button>

            {/* Button 3: Download for iPhone (iOS) */}
            <button 
              onClick={() => handleDownloadPlatform('ios')}
              className="group bg-[#04060d]/90 border border-[#e2b857]/15 hover:border-[#e2b857] rounded-2xl p-6 flex flex-col items-center justify-center text-center space-y-4 hover:-translate-y-1.5 transition-all cursor-pointer shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-16 h-16 bg-[#e2b857]/5 rounded-full blur-xl group-hover:bg-[#e2b857]/10 transition-colors"></div>
              <div className="w-14 h-14 rounded-2xl bg-[#e2b857]/5 flex items-center justify-center border border-[#e2b857]/10 group-hover:bg-[#e2b857]/15 group-hover:border-[#e2b857]/40 transition-colors shrink-0">
                <Smartphone className="w-7 h-7 text-[#e2b857]" />
              </div>
              <div className="space-y-1">
                <h4 className="text-white text-sm font-black font-sans group-hover:text-[#e2b857] transition-colors">{t.downloadIOS}</h4>
                <p className="text-[#e2b857] text-xs font-bold font-mono tracking-wide">iPhone App (Store Build)</p>
              </div>
              <span className="text-[11px] text-slate-500 font-medium group-hover:text-slate-400">iOS 14 &amp; Above (iPhone / iPad)</span>
            </button>
            
          </div>
        </div>
      </section>

      {/* 4. OUR SERVICES SECTION */}
      <section id="services-sec" className="py-20 px-4 max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="text-[#e2b857] text-xs font-black uppercase tracking-widest block mb-1">🏋️ {t.servicesTitle}</span>
          <h2 className="text-3xl md:text-4xl font-black text-white">{t.servicesSub}</h2>
          <div className="w-16 h-1 bg-[#e2b857] mx-auto mt-4 rounded-full shadow-lg shadow-[#e2b857]/30"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Gym Card */}
          <div className="bg-slate-900/40 border border-[#e2b857]/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e2b857]/40 hover:bg-[#e2b857]/5 transition-all duration-300 group shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-[#e2b857]/10 flex items-center justify-center text-[#e2b857] border border-[#e2b857]/20 group-hover:scale-110 group-hover:bg-[#e2b857]/20 transition-all duration-300 shadow-inner">
              <Dumbbell className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-white text-lg font-black font-sans">{t.serviceGym}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5 font-sans">{t.serviceGymDesc}</p>
            </div>
          </div>

          {/* Swimming Pool Card */}
          <div className="bg-slate-900/40 border border-[#e2b857]/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e2b857]/40 hover:bg-[#e2b857]/5 transition-all duration-300 group shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-[#e2b857]/10 flex items-center justify-center text-[#e2b857] border border-[#e2b857]/20 group-hover:scale-110 group-hover:bg-[#e2b857]/20 transition-all duration-300 shadow-inner">
              <Waves className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-white text-lg font-black font-sans">{t.servicePool}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5 font-sans">{t.servicePoolDesc}</p>
            </div>
          </div>

          {/* Cafeteria Card */}
          <div className="bg-slate-900/40 border border-[#e2b857]/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e2b857]/40 hover:bg-[#e2b857]/5 transition-all duration-300 group shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-[#e2b857]/10 flex items-center justify-center text-[#e2b857] border border-[#e2b857]/20 group-hover:scale-110 group-hover:bg-[#e2b857]/20 transition-all duration-300 shadow-inner">
              <Coffee className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-white text-lg font-black font-sans">{t.serviceCafe}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5 font-sans">{t.serviceCafeDesc}</p>
            </div>
          </div>

          {/* Football Fields Booking Card */}
          <div className="bg-slate-900/40 border border-[#e2b857]/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e2b857]/40 hover:bg-[#e2b857]/5 transition-all duration-300 group shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-[#e2b857]/10 flex items-center justify-center text-[#e2b857] border border-[#e2b857]/20 group-hover:scale-110 group-hover:bg-[#e2b857]/20 transition-all duration-300 shadow-inner">
              <CalendarCheck2 className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-white text-lg font-black font-sans">{t.serviceFields}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5 font-sans">{t.serviceFieldsDesc}</p>
            </div>
          </div>

          {/* Group Classes Card */}
          <div className="bg-slate-900/40 border border-[#e2b857]/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e2b857]/40 hover:bg-[#e2b857]/5 transition-all duration-300 group shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-[#e2b857]/10 flex items-center justify-center text-[#e2b857] border border-[#e2b857]/20 group-hover:scale-110 group-hover:bg-[#e2b857]/20 transition-all duration-300 shadow-inner">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-white text-lg font-black font-sans">{t.serviceClasses}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5 font-sans">{t.serviceClassesDesc}</p>
            </div>
          </div>

          {/* Offers & Discounts Card */}
          <div className="bg-slate-900/40 border border-[#e2b857]/10 rounded-2xl p-8 flex flex-col items-center text-center space-y-4 hover:border-[#e2b857]/40 hover:bg-[#e2b857]/5 transition-all duration-300 group shadow-lg">
            <div className="w-14 h-14 rounded-2xl bg-[#e2b857]/10 flex items-center justify-center text-[#e2b857] border border-[#e2b857]/20 group-hover:scale-110 group-hover:bg-[#e2b857]/20 transition-all duration-300 shadow-inner">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <h3 className="text-white text-lg font-black font-sans">{t.serviceOffers}</h3>
              <p className="text-slate-400 text-xs leading-relaxed mt-2.5 font-sans">{t.serviceOffersDesc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. LUXURY GRID GALLERY SECTION (Satisfies the required landing page components) */}
      <section id="gallery-sec" className="py-20 px-4 bg-slate-950/40 border-t border-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#e2b857] text-xs font-black uppercase tracking-widest block mb-1 font-mono">📸 PHOTO TOUR</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">{t.galleryTitle}</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2.5">{t.gallerySub}</p>
            <div className="w-16 h-1 bg-[#e2b857] mx-auto mt-4 rounded-full"></div>
          </div>

          {/* Bento-style luxury grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryItems.map((item, index) => (
              <div 
                key={index}
                className="group relative rounded-2xl overflow-hidden aspect-[4/3] border border-[#e2b857]/10 shadow-2xl bg-[#04060d]"
              >
                {/* Background image */}
                <img 
                  src={item.url} 
                  alt={item.title} 
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90 group-hover:brightness-50"
                  referrerPolicy="no-referrer"
                />
                {/* Visual hover effect border */}
                <div className="absolute inset-0 border border-transparent group-hover:border-[#e2b857]/40 rounded-2xl transition-all duration-500 m-2.5"></div>
                
                {/* Content Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-6 translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-[#e2b857] text-[10px] font-black tracking-widest uppercase font-mono mb-1 block">AL HUSON CLUB</span>
                  <h4 className="text-white text-base font-black font-sans leading-tight">{item.title}</h4>
                  <p className="text-slate-300 text-xs mt-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 leading-relaxed font-light">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. STATISTICS SECTION */}
      <section id="stats-sec" className="relative py-16 bg-[#070a13] border-t border-slate-900">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-white text-2xl font-black">{t.statsTitle}</h2>
            <div className="w-12 h-1 bg-[#e2b857] mx-auto mt-2 rounded"></div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {/* Stat Item 1 */}
            <div className="bg-slate-950/60 border border-[#e2b857]/15 p-6 rounded-2xl shadow-xl">
              <div className="text-3xl md:text-4xl font-extrabold text-[#e2b857] font-mono">+150</div>
              <p className="text-slate-400 text-xs font-bold mt-2 font-sans">{t.statEquipment}</p>
            </div>

            {/* Stat Item 2 */}
            <div className="bg-slate-950/60 border border-[#e2b857]/15 p-6 rounded-2xl shadow-xl">
              <div className="text-3xl md:text-4xl font-extrabold text-[#e2b857] font-mono">+2500</div>
              <p className="text-slate-400 text-xs font-bold mt-2 font-sans">{t.statMembers}</p>
            </div>

            {/* Stat Item 3 */}
            <div className="bg-slate-950/60 border border-[#e2b857]/15 p-6 rounded-2xl shadow-xl">
              <div className="text-3xl md:text-4xl font-extrabold text-[#e2b857] font-mono">+12</div>
              <p className="text-slate-400 text-xs font-bold mt-2 font-sans">{t.statServices}</p>
            </div>

            {/* Stat Item 4 */}
            <div className="bg-slate-950/60 border border-[#e2b857]/15 p-6 rounded-2xl shadow-xl">
              <div className="text-3xl md:text-4xl font-extrabold text-[#e2b857] font-mono">+8</div>
              <p className="text-slate-400 text-xs font-bold mt-2 font-sans">{t.statExperience}</p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CUSTOMER REVIEWS */}
      <section id="reviews-sec" className="py-16 px-4 bg-slate-950/40 border-t border-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#e2b857] text-xs font-black uppercase tracking-widest block font-mono">🌟 MEMBER TESTIMONIALS</span>
            <h2 className="text-2xl md:text-3xl font-black text-white mt-1">{t.reviewSub}</h2>
            <div className="w-16 h-1 bg-[#e2b857] mx-auto mt-3 rounded"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Review 1 */}
            <div className="bg-[#070a13] border border-slate-800/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#e2b857] text-[#e2b857]" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mt-3 italic font-sans">
                  "{t.review1Text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60 mt-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e2b857]/30 bg-slate-900 flex items-center justify-center font-bold text-xs text-[#e2b857]">
                  أ ش
                </div>
                <div>
                  <h4 className="text-white text-xs font-black font-sans">{t.review1Author}</h4>
                  <span className="text-slate-500 text-[10px] block font-sans">
                    {t.reviewYears} {t.review1Year}
                  </span>
                </div>
              </div>
            </div>

            {/* Review 2 */}
            <div className="bg-[#070a13] border border-slate-800/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#e2b857] text-[#e2b857]" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mt-3 italic font-sans">
                  "{t.review2Text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60 mt-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e2b857]/30 bg-slate-900 flex items-center justify-center font-bold text-xs text-[#e2b857]">
                  س م
                </div>
                <div>
                  <h4 className="text-white text-xs font-black font-sans">{t.review2Author}</h4>
                  <span className="text-slate-500 text-[10px] block font-sans">
                    {t.reviewYearsFemale} {t.review2Year}
                  </span>
                </div>
              </div>
            </div>

            {/* Review 3 */}
            <div className="bg-[#070a13] border border-slate-800/80 rounded-2xl p-6 space-y-4 flex flex-col justify-between shadow-xl">
              <div>
                <div className="flex gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#e2b857] text-[#e2b857]" />
                  ))}
                </div>
                <p className="text-slate-300 text-xs leading-relaxed mt-3 italic font-sans">
                  "{t.review3Text}"
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-800/60 mt-auto">
                <div className="w-10 h-10 rounded-full overflow-hidden border border-[#e2b857]/30 bg-slate-900 flex items-center justify-center font-bold text-xs text-[#e2b857]">
                  م ب
                </div>
                <div>
                  <h4 className="text-white text-xs font-black font-sans">{t.review3Author}</h4>
                  <span className="text-slate-500 text-[10px] block font-sans">
                    {t.reviewYears} {t.review3Year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. COMPLETE CONTACT US & BUSINESS HOURS SECTION */}
      <section id="contact-sec" className="py-20 px-4 bg-[#070a13] border-t border-slate-900 relative">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-[#e2b857] text-xs font-black uppercase tracking-widest block mb-1 font-mono">📍 CONTACT DESK</span>
            <h2 className="text-3xl md:text-4xl font-black text-white">{t.contactTitle}</h2>
            <p className="text-slate-400 text-sm max-w-2xl mx-auto mt-2.5">{t.contactSub}</p>
            <div className="w-16 h-1 bg-[#e2b857] mx-auto mt-4 rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Box (Interactive Contact Details & Hour badges) */}
            <div className="lg:col-span-5 space-y-6 bg-slate-950/50 p-8 rounded-2xl border border-slate-900">
              
              {/* Dynamic open/closed hours badge */}
              <div className={`p-4 rounded-xl border flex items-center gap-3 ${isClubOpen ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-rose-500/10 border-rose-500/20 text-rose-400'}`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isClubOpen ? 'bg-emerald-500 animate-ping' : 'bg-rose-500'}`} />
                <span className="text-xs font-black font-sans">{isClubOpen ? t.contactOpenNow : t.contactClosedNow}</span>
              </div>

              {/* Working Hours Info block */}
              <div className="space-y-3 border-b border-slate-900 pb-5">
                <h4 className="text-[#e2b857] text-xs font-black uppercase tracking-widest flex items-center gap-2">
                  <Clock className="w-4 h-4 text-[#e2b857]" />
                  <span>{t.contactHours}</span>
                </h4>
                <div className="space-y-1.5 text-xs text-slate-300 font-sans leading-relaxed">
                  <p className="font-semibold">{t.contactHoursWeekdays}</p>
                  <p className="font-semibold">{t.contactHoursFriday}</p>
                </div>
              </div>

              {/* Geographical Coordinates Contact lines */}
              <div className="space-y-4">
                <div className="flex items-start gap-3 text-xs leading-relaxed">
                  <MapPin className="w-4 h-4 text-[#e2b857] mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-white text-xs">{t.contactAddress}</h5>
                    <p className="text-slate-400 mt-1">{t.addressText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs leading-relaxed">
                  <Phone className="w-4 h-4 text-[#e2b857] mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-white text-xs">{t.contactPhone}</h5>
                    <p className="text-slate-400 mt-1 font-mono">{t.phoneText}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs leading-relaxed">
                  <Mail className="w-4 h-4 text-[#e2b857] mt-0.5 shrink-0" />
                  <div>
                    <h5 className="font-extrabold text-white text-xs">{t.contactEmail}</h5>
                    <p className="text-slate-400 mt-1 font-mono">{t.emailText}</p>
                  </div>
                </div>
              </div>

              {/* Elegant Simulated Vector Map Representation */}
              <div className="h-28 rounded-xl border border-[#e2b857]/15 overflow-hidden relative group mt-6 select-none shadow-inner bg-slate-950">
                <div className="absolute inset-0 bg-[radial-gradient(#151e33_1px,transparent_1px)] [background-size:12px_12px] opacity-40"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                  <MapPin className="w-7 h-7 text-[#e2b857] animate-bounce" />
                  <span className="text-[10px] text-slate-400 font-black tracking-wider uppercase mt-1 font-mono">MAP VIEW (ACTIVE GPS)</span>
                </div>
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 border border-slate-900 rounded p-1.5 text-[9px] text-slate-400 text-center">
                  Jordan, Irbid - Al Huson Main Street Intersection
                </div>
              </div>
            </div>

            {/* Right Box (Message Contact Form) */}
            <div className="lg:col-span-7 bg-slate-950/50 p-8 rounded-2xl border border-slate-900">
              <h4 className="text-white text-lg font-black font-sans mb-4">{t.contactFormTitle}</h4>
              
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 text-right">
                    <label className="block text-xs font-semibold text-slate-400">{t.contactFormName} *</label>
                    <input 
                      type="text" 
                      required
                      value={msgName}
                      onChange={(e) => setMsgName(e.target.value)}
                      placeholder="e.g. Ahmad Al-Shobaki"
                      className="w-full border border-slate-800 bg-[#04060d]/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#e2b857] transition-all"
                    />
                  </div>
                  <div className="space-y-1.5 text-right">
                    <label className="block text-xs font-semibold text-slate-400">{t.contactFormPhone} *</label>
                    <input 
                      type="tel" 
                      required
                      value={msgPhone}
                      onChange={(e) => setMsgPhone(e.target.value)}
                      placeholder="e.g. 0795551234"
                      className="w-full border border-slate-800 bg-[#04060d]/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#e2b857] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5 text-right">
                  <label className="block text-xs font-semibold text-slate-400">{t.contactFormMsg}</label>
                  <textarea 
                    rows={4}
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    placeholder="Type your question or support request here..."
                    className="w-full border border-slate-800 bg-[#04060d]/80 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-[#e2b857] transition-all resize-none"
                  />
                </div>

                {msgSuccess && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>{t.contactFormSuccess}</span>
                  </div>
                )}

                <button 
                  type="submit"
                  className="w-full bg-[#e2b857] hover:bg-[#e2b857]/90 text-slate-950 font-black py-3 rounded-xl text-xs transition-colors shadow-lg cursor-pointer flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>{t.contactFormSubmit}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* 9. THE FOOTER */}
      <footer id="footer-sec" className="bg-[#04060d] border-t border-slate-900 pt-16 pb-8 px-4 font-sans relative z-10">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2.5">
              <AlHusonLogo size={42} />
              <div>
                <span className="text-sm font-extrabold text-[#e2b857] block">{currentClubName}</span>
                <span className="text-[9px] text-slate-500 font-mono block">AL HUSON SPORTS CLUB</span>
              </div>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              {t.footerDesc}
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-4">
            <h4 className="text-[#e2b857] text-xs font-black tracking-widest uppercase">{t.footerQuickLinks}</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><button onClick={() => scrollToSection("hero-sec")} className="hover:text-[#e2b857] transition-colors">{t.navHome}</button></li>
              <li><button onClick={() => scrollToSection("services-sec")} className="hover:text-[#e2b857] transition-colors">{t.navServices}</button></li>
              <li><button onClick={() => scrollToSection("gallery-sec")} className="hover:text-[#e2b857] transition-colors">{t.navGallery}</button></li>
              <li><button onClick={() => scrollToSection("contact-sec")} className="hover:text-[#e2b857] transition-colors">{t.navContact}</button></li>
            </ul>
          </div>

          {/* Col 3: Our Services */}
          <div className="space-y-4">
            <h4 className="text-[#e2b857] text-xs font-black tracking-widest uppercase">{t.footerOurServices}</h4>
            <ul className="space-y-2 text-xs text-slate-400 font-sans">
              <li>{t.serviceGym}</li>
              <li>{t.servicePool}</li>
              <li>{t.serviceCafe}</li>
              <li>{t.serviceFields}</li>
              <li>{t.serviceClasses}</li>
            </ul>
          </div>

          {/* Col 4: Contact Info */}
          <div className="space-y-4">
            <h4 className="text-[#e2b857] text-xs font-black tracking-widest uppercase">{t.footerContactInfo}</h4>
            <ul className="space-y-3 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#e2b857] shrink-0 mt-0.5" />
                <span>{t.addressText}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e2b857] shrink-0" />
                <span>{t.phoneText}</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e2b857] shrink-0" />
                <span>{t.emailText}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Social and Copyright */}
        <div className="max-w-6xl mx-auto pt-8 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-slate-500 text-[11px] font-sans">
            {t.footerCopyright}
          </div>

          <div className="flex items-center gap-3">
            {/* Facebook */}
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#e2b857] hover:border-[#e2b857] transition-colors">
              <Facebook className="w-4 h-4" />
            </a>
            {/* Instagram */}
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#e2b857] hover:border-[#e2b857] transition-colors">
              <Instagram className="w-4 h-4" />
            </a>
            {/* WhatsApp */}
            <a href="https://wa.me/962791234567" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#e2b857] hover:border-[#e2b857] transition-colors">
              <Phone className="w-4 h-4" />
            </a>
            {/* YouTube */}
            <a href="https://youtube.com" target="_blank" rel="noreferrer" className="w-8 h-8 rounded-full border border-slate-800 flex items-center justify-center text-slate-400 hover:text-[#e2b857] hover:border-[#e2b857] transition-colors">
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* 📦 FLOATING GLOWING DL PROGRESS DIALOG (Luxury Custom Status/Download Toast) */}
      <AnimatePresence>
        {downloadState.active && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed bottom-24 right-6 z-50 max-w-sm w-full bg-slate-950/95 border border-[#e2b857]/40 shadow-[0_25px_60px_-15px_rgba(226,184,87,0.2)] p-5 rounded-2xl backdrop-blur-lg"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#e2b857]/10 text-[#e2b857] border border-[#e2b857]/30 flex items-center justify-center shrink-0">
                {downloadState.progress < 100 ? (
                  <RefreshCw className="w-5 h-5 animate-spin" />
                ) : (
                  <Check className="w-5 h-5" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-[11px] font-black uppercase text-amber-500 tracking-wider">
                  {downloadState.progress < 100 ? 'SECURE DELIVERY ACTIVE' : 'DOWNLOAD INITIATED'}
                </h4>
                <p className="text-xs text-white font-black truncate mt-0.5">
                  {downloadState.fileName}
                </p>
                <p className="text-[10px] text-slate-400 mt-1 leading-snug">
                  {downloadState.progress < 100 
                    ? (language === 'ar' ? 'يتم سحب الملفات الموقعة من خوادم السحابة...' : 'Pulling digitally-signed bundles from secure CDN nodes...') 
                    : (language === 'ar' ? 'تم بدء التحميل بنجاح! يرجى تشغيل برنامج التثبيت.' : 'Delivery initialized successfully! Feel free to launch the setup bundle.')}
                </p>

                {/* Simulated Progress bar */}
                <div className="mt-4 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>{downloadState.progress}%</span>
                    <span>{downloadState.progress < 100 ? 'Installing binaries...' : 'Success'}</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-[#e2b857] transition-all duration-150 rounded-full" 
                      style={{ width: `${downloadState.progress}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
