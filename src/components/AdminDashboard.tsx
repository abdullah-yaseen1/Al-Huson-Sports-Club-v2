import React, { useState } from "react";
import { 
  Users, Calendar, Dumbbell, Percent, Clock, Plus, Edit, Trash, 
  Check, X, AlertCircle, Phone, ArrowUpRight, Search, Activity, 
  Lock, LayoutDashboard, ShieldAlert, HeartPulse, UserPlus, Sparkles,
  ShoppingBag, QrCode
} from "lucide-react";
import { Member, Subscription, ProgressLog, ClubService, Booking, ClubOffer, AttendanceLog, FitnessChallenge, ChallengeProgress, BarItem, BarOrder } from "../types";
import { translations } from "../utils/translations";
import CoachSettings from "./CoachSettings";

interface AdminDashboardProps {
  members: Member[];
  subscriptions: Subscription[];
  progressLogs: ProgressLog[];
  services: ClubService[];
  bookings: Booking[];
  offers: ClubOffer[];
  
  // 🌟 Gamification & POS Admin additions
  attendanceLogs: AttendanceLog[];
  fitnessChallenges: FitnessChallenge[];
  challengeProgresses: ChallengeProgress[];
  barItems: BarItem[];
  barOrders: BarOrder[];

  onAddMember: (member: Member) => void;
  onUpdateMember: (member: Member) => void;
  onDeleteMember: (id: string) => void;
  onAddSubscription: (sub: Subscription) => void;
  onUpdateSubscription: (sub: Subscription) => void;
  onAddProgressLog: (log: ProgressLog) => void;
  onAddService: (service: ClubService) => void;
  onUpdateService: (service: ClubService) => void;
  onDeleteService: (id: string) => void;
  onAddOffer: (offer: ClubOffer) => void;
  onUpdateOffer: (offer: ClubOffer) => void;
  onDeleteOffer: (id: string) => void;
  onUpdateBookingStatus: (id: string, status: 'تم القبول' | 'تم الرفض') => void;
  
  // 🌟 Callback triggers
  onScanQRAdmin: (memberId: string) => void;
  onAddPointsAdmin: (memberId: string, points: number) => void;
  onUpdateBarOrderStatus: (orderId: string, status: 'قيد التحضير' | 'جاهز للاستلام' | 'تم التسليم') => void;

  clubName: string;
  clubLogo: string;
  loginBgImage?: string;
  onUpdateClubInfo: (name: string, logo: string, bgImage?: string) => void;
  clubFacebook?: string;
  clubInstagram?: string;
  clubTwitter?: string;
  clubTikTok?: string;
  clubWhatsApp?: string;
  onUpdateClubSocials?: (fb: string, ig: string, tw: string, tt: string, wa: string) => void;

  theme?: 'dark' | 'light';
  language?: 'ar' | 'en';
  onApproveMember?: (memberId: string) => void;

  clubHours?: {
    womenStart: string;
    womenEnd: string;
    menStart: string;
    menEnd: string;
  };
  notifications?: {
    id: string;
    title: string;
    message: string;
    memberId: string;
    read: boolean;
    createdAt?: string;
  }[];
  onUpdateClubHours?: (hours: { womenStart: string; womenEnd: string; menStart: string; menEnd: string; }) => void;
  onSendNotification?: (title: string, message: string, memberId: string) => void;
  notificationBadge?: number;
  onClearNotificationBadge?: () => void;
}

export default function AdminDashboard({
  members,
  subscriptions,
  progressLogs,
  services,
  bookings,
  offers,
  
  // 🌟 Gamification & POS Props
  attendanceLogs,
  fitnessChallenges,
  challengeProgresses,
  barItems,
  barOrders,
  
  onAddMember,
  onUpdateMember,
  onDeleteMember,
  onAddSubscription,
  onUpdateSubscription,
  onAddProgressLog,
  onAddService,
  onUpdateService,
  onDeleteService,
  onAddOffer,
  onUpdateOffer,
  onDeleteOffer,
  onUpdateBookingStatus,
  
  // 🌟 Callbacks
  onScanQRAdmin,
  onAddPointsAdmin,
  onUpdateBarOrderStatus,
  clubName,
  clubLogo,
  onUpdateClubInfo,
  loginBgImage = "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400",
  clubFacebook = "https://facebook.com",
  clubInstagram = "https://instagram.com",
  clubTwitter = "https://twitter.com",
  clubTikTok = "https://tiktok.com",
  clubWhatsApp = "https://wa.me/962795551234",
  onUpdateClubSocials,
  theme = 'dark',
  language = 'ar',
  onApproveMember,

  clubHours = { womenStart: "08:00", womenEnd: "15:00", menStart: "15:00", menEnd: "01:00" },
  notifications = [],
  onUpdateClubHours = () => {},
  onSendNotification = () => {},
  notificationBadge = 0,
  onClearNotificationBadge = () => {},
}: AdminDashboardProps) {
  const t = translations[language];
  // Admin Credentials and Profile State
  const [adminName, setAdminName] = useState("الكابتن حصن البدر");
  const [adminPic, setAdminPic] = useState("https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200");
  const [adminPass, setAdminPass] = useState("1234");

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState("");
  const [loginError, setLoginError] = useState("");

  // Navigation: 'stats' | 'members' | 'subscriptions' | 'services' | 'offers' | 'bookings' | 'bar' | 'attendance' | 'settings' | 'coach'
  const [activePanel, setActivePanel] = useState<'stats' | 'members' | 'services' | 'offers' | 'bookings' | 'bar' | 'attendance' | 'settings' | 'coach'>('stats');

  // Search Filters
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>("all");

  // Modals / Forms States
  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState<ClubService | null>(null);

  const [showOfferModal, setShowOfferModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState<ClubOffer | null>(null);

  const [showLogModal, setShowLogModal] = useState(false);
  const [selectedLogMember, setSelectedLogMember] = useState<Member | null>(null);

  const [showRenewModal, setShowRenewModal] = useState(false);
  const [selectedRenewMember, setSelectedRenewMember] = useState<Member | null>(null);

  // 🗑️ Custom Confirm Modal States
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmTitle, setConfirmTitle] = useState("");
  const [confirmMessage, setConfirmMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState<(() => void) | null>(null);

  const triggerConfirm = (title: string, message: string, action: () => void) => {
    setConfirmTitle(title);
    setConfirmMessage(message);
    setOnConfirm(() => action);
    setShowConfirmModal(true);
  };

  // New Record Form Fields (Temporary local states)
  // Member Form
  const [memName, setMemName] = useState("");
  const [memPhone, setMemPhone] = useState("");
  const [memEmail, setMemEmail] = useState("");
  const [memHeight, setMemHeight] = useState("175");
  const [memWeight, setMemWeight] = useState("75");
  const [memFat, setMemFat] = useState("18");
  const [memMuscle, setMemMuscle] = useState("38");
  const [memGoal, setMemGoal] = useState<'تنشيف' | 'تضخيم' | 'لياقة'>("لياقة");
  const [memSubDuration, setMemSubDuration] = useState("30");
  const [memSubType, setMemSubType] = useState<'جيم' | 'شامل' | 'مسبح' | 'ملاكمة'>("جيم");
  const [memGender, setMemGender] = useState<'ذكر' | 'أنثى'>("ذكر");
  const [memPassword, setMemPassword] = useState("");

  // Service Form
  const [srvTitle, setSrvTitle] = useState("");
  const [srvDesc, setSrvDesc] = useState("");
  const [srvPrice, setSrvPrice] = useState("30");
  const [srvImage, setSrvImage] = useState("");

  // Offer Form
  const [offTitle, setOffTitle] = useState("");
  const [offDesc, setOffDesc] = useState("");
  const [offDiscount, setOffDiscount] = useState("20%");
  const [offActive, setOffActive] = useState(true);
  const [offImage, setOffImage] = useState("");

  // Progress Log Form
  const [logWeight, setLogWeight] = useState("");
  const [logFat, setLogFat] = useState("");
  const [logMuscle, setLogMuscle] = useState("");

  // Renewal Form
  const [renewDuration, setRenewDuration] = useState("30");
  const [renewType, setRenewType] = useState<'جيم' | 'شامل' | 'مسبح' | 'ملاكمة'>("جيم");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === adminPass || passcode === "admin" || (adminPass === "1234" && passcode === "")) {
      setIsAuthenticated(true);
      setLoginError("");
    } else {
      setLoginError(
        language === "ar"
          ? "كلمة المرور غير صحيحة! جرب كلمة المرور المخصصة أو الافتراضية '1234'"
          : "Incorrect passcode! Try your custom passcode or the default '1234'"
      );
    }
  };

  // Compute stats helper
  const totalUsers = members.length;
  const activeSubs = subscriptions.filter(s => s.status === 'فعال').length;
  const pendingBookings = bookings.filter(b => b.status === 'قيد الانتظار').length;
  const activePromoOffers = offers.filter(o => o.active).length;
  
  const estimatedRevenue = subscriptions.reduce((sum, s) => {
    if (s.status === 'فعال') return sum + s.price;
    return sum;
  }, 0);

  // Handlers for Member Submit (Add/Edit)
  const handleMemberSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalPassword = memPassword.trim() || memPhone.slice(-4) || "1234";

    if (editingMember) {
      // Edit mode
      const updated: Member = {
        ...editingMember,
        name: memName,
        phone: memPhone,
        email: memEmail,
        height: parseFloat(memHeight),
        weight: parseFloat(memWeight),
        fat: parseFloat(memFat),
        muscle: parseFloat(memMuscle),
        goal: memGoal,
        gender: memGender,
        password: finalPassword,
      };
      onUpdateMember(updated);
    } else {
      // Add mode
      const newMemberId = "mem-" + Math.random().toString(36).substr(2, 9);
      const newMember: Member = {
        id: newMemberId,
        name: memName,
        phone: memPhone,
        email: memEmail,
        height: parseFloat(memHeight),
        weight: parseFloat(memWeight),
        fat: parseFloat(memFat),
        muscle: parseFloat(memMuscle),
        goal: memGoal,
        gender: memGender,
        password: finalPassword,
        points: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      
      onAddMember(newMember);

      // Automatically add initial progress log
      const newLog: ProgressLog = {
        id: "log-" + Math.random().toString(36).substr(2, 9),
        memberId: newMemberId,
        weight: parseFloat(memWeight),
        fat: parseFloat(memFat),
        muscle: parseFloat(memMuscle),
        date: new Date().toISOString().split('T')[0]
      };
      onAddProgressLog(newLog);

      // Automatically add initial subscription
      const durationDays = parseInt(memSubDuration);
      const start = new Date();
      const end = new Date();
      end.setDate(start.getDate() + durationDays);

      const subPrice = memSubType === 'شامل' ? 499 : memSubType === 'جيم' ? 299 : memSubType === 'مسبح' ? 250 : 350;

      const newSub: Subscription = {
        id: "sub-" + Math.random().toString(36).substr(2, 9),
        memberId: newMemberId,
        type: memSubType,
        startDate: start.toISOString().split('T')[0],
        endDate: end.toISOString().split('T')[0],
        status: 'فعال',
        price: subPrice
      };
      onAddSubscription(newSub);
    }

    // Reset and close
    resetMemberForm();
  };

  const resetMemberForm = () => {
    setMemName("");
    setMemPhone("");
    setMemEmail("");
    setMemHeight("175");
    setMemWeight("75");
    setMemFat("18");
    setMemMuscle("38");
    setMemGoal("لياقة");
    setMemSubDuration("30");
    setMemSubType("جيم");
    setMemGender("ذكر");
    setMemPassword("");
    setEditingMember(null);
    setShowMemberModal(false);
  };

  const openEditMember = (m: Member) => {
    setEditingMember(m);
    setMemName(m.name);
    setMemPhone(m.phone);
    setMemEmail(m.email);
    setMemHeight(m.height.toString());
    setMemWeight(m.weight.toString());
    setMemFat(m.fat.toString());
    setMemMuscle(m.muscle.toString());
    setMemGoal(m.goal);
    setMemGender(m.gender || "ذكر");
    setMemPassword(m.password || "");
    setShowMemberModal(true);
  };

  // Handlers for Services CRUD
  const handleServiceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingService) {
      const updated: ClubService = {
        ...editingService,
        title: srvTitle,
        description: srvDesc,
        price: parseFloat(srvPrice),
        image: srvImage
      };
      onUpdateService(updated);
    } else {
      const newSrv: ClubService = {
        id: "srv-" + Math.random().toString(36).substr(2, 9),
        title: srvTitle,
        description: srvDesc,
        image: srvImage || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80&w=400",
        price: parseFloat(srvPrice)
      };
      onAddService(newSrv);
    }
    setSrvTitle("");
    setSrvDesc("");
    setSrvPrice("30");
    setSrvImage("");
    setEditingService(null);
    setShowServiceModal(false);
  };

  const openEditService = (s: ClubService) => {
    setEditingService(s);
    setSrvTitle(s.title);
    setSrvDesc(s.description);
    setSrvPrice(s.price.toString());
    setSrvImage(s.image || "");
    setShowServiceModal(true);
  };

  // Handlers for Offers CRUD
  const handleOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingOffer) {
      const updated: ClubOffer = {
        ...editingOffer,
        title: offTitle,
        description: offDesc,
        discount: offDiscount,
        active: offActive,
        image: offImage
      };
      onUpdateOffer(updated);
    } else {
      const newOff: ClubOffer = {
        id: "off-" + Math.random().toString(36).substr(2, 9),
        title: offTitle,
        description: offDesc,
        discount: offDiscount,
        active: offActive,
        image: offImage || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400"
      };
      onAddOffer(newOff);
    }
    setOffTitle("");
    setOffDesc("");
    setOffDiscount("20%");
    setOffActive(true);
    setOffImage("");
    setEditingOffer(null);
    setShowOfferModal(false);
  };

  const openEditOffer = (o: ClubOffer) => {
    setEditingOffer(o);
    setOffTitle(o.title);
    setOffDesc(o.description);
    setOffDiscount(o.discount);
    setOffActive(o.active);
    setOffImage(o.image || "");
    setShowOfferModal(true);
  };

  // Handler for Log Progress submit
  const handleLogSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLogMember) return;

    const newLog: ProgressLog = {
      id: "log-" + Math.random().toString(36).substr(2, 9),
      memberId: selectedLogMember.id,
      weight: parseFloat(logWeight),
      fat: parseFloat(logFat),
      muscle: parseFloat(logMuscle),
      date: new Date().toISOString().split('T')[0]
    };

    onAddProgressLog(newLog);

    // Update member's baseline values too for current view
    const updatedMember: Member = {
      ...selectedLogMember,
      weight: parseFloat(logWeight),
      fat: parseFloat(logFat),
      muscle: parseFloat(logMuscle),
    };
    onUpdateMember(updatedMember);

    setLogWeight("");
    setLogFat("");
    setLogMuscle("");
    setSelectedLogMember(null);
    setShowLogModal(false);
  };

  // Handler for renewal submit
  const handleRenewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRenewMember) return;

    const durationDays = parseInt(renewDuration);
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + durationDays);

    const price = renewType === 'شامل' ? 499 : renewType === 'جيم' ? 299 : renewType === 'مسبح' ? 250 : 350;

    // Set any existing subscriptions of this type for this member to 'expired'
    const existingSubs = subscriptions.filter(s => s.memberId === selectedRenewMember.id);
    existingSubs.forEach(s => {
      onUpdateSubscription({ ...s, status: 'منتهي' });
    });

    const newSub: Subscription = {
      id: "sub-" + Math.random().toString(36).substr(2, 9),
      memberId: selectedRenewMember.id,
      type: renewType,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      status: 'فعال',
      price: price
    };

    onAddSubscription(newSub);
    setSelectedRenewMember(null);
    setShowRenewModal(false);
  };

  // Filtered members list
  const filteredMembers = members.filter(m => {
    const matchesSearch = m.name.toLowerCase().includes(memberSearch.toLowerCase()) || m.phone.includes(memberSearch);
    if (selectedMemberFilter === "all") return matchesSearch;
    const sub = subscriptions.find(s => s.memberId === m.id && s.status === 'فعال');
    if (selectedMemberFilter === "active") return matchesSearch && !!sub;
    if (selectedMemberFilter === "inactive") return matchesSearch && !sub;
    return matchesSearch;
  });

  return (
    <div 
      id="admin-panel-viewport" 
      style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}
      className="border border-[#e2b857]/20 rounded-3xl overflow-hidden min-h-[650px] flex flex-col bg-[#070a13] text-white"
    >
      
      {/* Admin Login Gate */}
      {!isAuthenticated ? (
        <div id="admin-login-screen" className="flex-1 flex flex-col items-center justify-center p-8 max-w-md mx-auto w-full">
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-full bg-[#e2b857]/10 text-[#e2b857] border border-[#e2b857]/20 mb-3 animate-pulse">
              <Lock className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-black text-[#e2b857] tracking-tight">{t.clubName}</h2>
            <p className="text-xs mt-1.5 font-light text-slate-400">{t.adminAuthTitle}</p>
          </div>

          <form 
            onSubmit={handleAdminLogin} 
            className="w-full space-y-4 p-6 rounded-2xl border border-[#e2b857]/15 bg-[#04060d]/80"
          >
            <div>
              <label className="block text-xs mb-1.5 font-medium text-slate-400">{t.adminAuthDesc}</label>
              <input 
                type="password" 
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                placeholder={t.adminPasscodePlaceholder}
                className="w-full border rounded-xl px-4 py-3 text-sm text-center tracking-widest font-mono focus:outline-none focus:border-[#e2b857] bg-[#070a13] border-[#e2b857]/15 text-white placeholder-slate-500"
              />
            </div>

            {loginError && (
              <div className="text-rose-500 text-xs flex items-center gap-1.5 bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button 
              type="submit"
              className="w-full bg-[#e2b857] hover:bg-[#e2b857]/90 text-slate-950 font-black py-3 rounded-xl text-sm transition-colors shadow-lg shadow-[#e2b857]/15 cursor-pointer"
            >
              {t.adminLoginBtn}
            </button>
          </form>
        </div>
      ) : (
        // MAIN ADMIN LAYOUT
        <div className="flex-1 flex flex-col md:flex-row">
          
          {/* Admin Sidebar */}
          <div className="w-full md:w-56 border-l border-[#e2b857]/15 p-4 flex flex-col shrink-0 gap-6 bg-[#04060d] text-white">
            <div className="flex items-center gap-2.5 pb-4 border-b border-[#e2b857]/10">
              <img 
                src={adminPic} 
                alt="Admin Avatar" 
                className="w-10 h-10 rounded-xl object-cover border border-[#e2b857]/20 shadow-md shrink-0"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200";
                }}
              />
              <div className="overflow-hidden">
                <h3 className="text-[11px] font-black leading-tight truncate text-slate-250">
                  {adminName}
                </h3>
                <span className="text-[9px] text-[#e2b857] font-bold mt-0.5 block">
                  {language === 'ar' ? 'مدير الصالة الذكي 👑' : 'Gym Administrator 👑'}
                </span>
              </div>
            </div>

            {/* Glowing Unread Badge */}
            {notificationBadge > 0 && (
              <div className="flex items-center justify-between p-2 rounded-xl bg-rose-500/15 border border-rose-500/25 animate-pulse shrink-0">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-ping shrink-0" />
                  <span className="text-[10px] font-black text-rose-500 truncate">
                    {language === 'ar' ? `+${notificationBadge} طلبات جديدة!` : `+${notificationBadge} new requests!`}
                  </span>
                </div>
                <button 
                  onClick={onClearNotificationBadge}
                  className="px-2 py-0.5 text-[9px] font-bold bg-rose-500 hover:bg-rose-600 text-white rounded-lg transition-colors shrink-0"
                >
                  {language === 'ar' ? 'تصفير' : 'Clear'}
                </button>
              </div>
            )}

            {/* Sidebar Navigation */}
            <nav className="flex-1 space-y-1">
              <button 
                onClick={() => setActivePanel('stats')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  activePanel === 'stats' 
                    ? 'bg-[#e2b857] text-[#070a13] shadow-md shadow-[#e2b857]/20' 
                    : 'text-slate-400 hover:bg-[#e2b857]/10 hover:text-[#e2b857]'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? 'التقارير والإحصائيات' : 'Dashboard Stats'}</span>
              </button>

              <button 
                onClick={() => setActivePanel('members')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  activePanel === 'members' 
                    ? 'bg-[#e2b857] text-[#070a13] shadow-md shadow-[#e2b857]/20' 
                    : 'text-slate-400 hover:bg-[#e2b857]/10 hover:text-[#e2b857]'
                }`}
              >
                <Users className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? 'الأعضاء والاشتراكات' : 'Members & Subs'}</span>
              </button>

              <button 
                onClick={() => setActivePanel('services')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  activePanel === 'services' 
                    ? 'bg-[#e2b857] text-[#070a13] shadow-md shadow-[#e2b857]/20' 
                    : 'text-slate-400 hover:bg-[#e2b857]/10 hover:text-[#e2b857]'
                }`}
              >
                <Dumbbell className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? 'الخدمات والمرافق' : 'Services & Facilities'}</span>
              </button>

              <button 
                onClick={() => setActivePanel('offers')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  activePanel === 'offers' 
                    ? 'bg-[#e2b857] text-[#070a13] shadow-md shadow-[#e2b857]/20' 
                    : 'text-slate-400 hover:bg-[#e2b857]/10 hover:text-[#e2b857]'
                }`}
              >
                <Percent className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? 'العروض الترويجية' : 'Promo Offers'}</span>
              </button>

              <button 
                onClick={() => setActivePanel('bookings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  activePanel === 'bookings' 
                    ? 'bg-[#e2b857] text-[#070a13] shadow-md shadow-[#e2b857]/20' 
                    : 'text-slate-400 hover:bg-[#e2b857]/10 hover:text-[#e2b857]'
                }`}
              >
                <Calendar className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? 'طلبات الحجز' : 'Booking Requests'}</span>
                {pendingBookings > 0 && (
                  <span className="mr-auto bg-rose-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center animate-bounce font-bold">
                    {pendingBookings}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActivePanel('bar')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  activePanel === 'bar' 
                    ? 'bg-[#e2b857] text-[#070a13] shadow-md shadow-[#e2b857]/20' 
                    : 'text-slate-400 hover:bg-[#e2b857]/10 hover:text-[#e2b857]'
                }`}
              >
                <ShoppingBag className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? 'طلبات البوفيه' : 'Protein Bar Orders'}</span>
                {barOrders.filter(o => o.status === 'قيد التحضير').length > 0 && (
                  <span className="mr-auto bg-[#e2b857] text-[#070a13] text-[10px] px-1.5 py-0.5 rounded-full font-mono font-bold animate-pulse">
                    {barOrders.filter(o => o.status === 'قيد التحضير').length}
                  </span>
                )}
              </button>

              <button 
                onClick={() => setActivePanel('attendance')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  activePanel === 'attendance' 
                    ? 'bg-[#e2b857] text-[#070a13] shadow-md shadow-[#e2b857]/20' 
                    : 'text-slate-400 hover:bg-[#e2b857]/10 hover:text-[#e2b857]'
                }`}
              >
                <QrCode className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? 'سجل الحضور' : 'Attendance Log'}</span>
              </button>

              <button 
                onClick={() => setActivePanel('coach')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  activePanel === 'coach' 
                    ? 'bg-[#e2b857] text-[#070a13] shadow-md shadow-[#e2b857]/20' 
                    : 'text-slate-400 hover:bg-[#e2b857]/10 hover:text-[#e2b857]'
                }`}
              >
                <Dumbbell className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? 'خطط الكابتن الذكي' : 'Smart Coach Plans'}</span>
              </button>

              <button 
                onClick={() => setActivePanel('settings')}
                className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-xs font-black transition-colors ${
                  activePanel === 'settings' 
                    ? 'bg-[#e2b857] text-[#070a13] shadow-md shadow-[#e2b857]/20' 
                    : 'text-slate-400 hover:bg-[#e2b857]/10 hover:text-[#e2b857]'
                }`}
              >
                <Lock className="w-4 h-4 shrink-0" />
                <span>{language === 'ar' ? 'إعدادات النادي' : 'Club Settings'}</span>
              </button>
            </nav>

            <button 
              onClick={() => setIsAuthenticated(false)}
              className="mt-auto w-full border border-[#e2b857]/20 py-2.5 rounded-xl text-xs font-black transition-all text-rose-450 hover:bg-rose-500/5 hover:border-rose-500/20 cursor-pointer"
            >
              {language === 'ar' ? 'خروج الإدارة' : 'Admin Logout'}
            </button>
          </div>

          {/* Admin Content Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-6 bg-[#070a13] text-white">

            {/* PANEL: STATS & OVERVIEW */}
            {activePanel === 'stats' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-lg font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      {language === 'ar' ? 'نظرة إدارية عامة' : 'Admin Overview'}
                    </h2>
                    <p className={`text-xs mt-0.5 font-light ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'ar' ? 'الإحصاءات والتدفق المالي لنادي الحصن' : 'Al Huson statistics & financial flow'}
                    </p>
                  </div>
                  <span className={`text-[10px] border font-mono px-3 py-1 rounded-full ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    {language === 'ar' ? 'تحديث فوري' : 'Live Sync'}
                  </span>
                </div>

                {/* KPI Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-2xl border transition-colors ${
                    theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } flex items-center justify-between`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'ar' ? 'إجمالي الأعضاء' : 'Total Members'}
                      </span>
                      <div className={`text-xl font-black font-mono mt-1 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                        {totalUsers} {language === 'ar' ? 'عضو' : 'Members'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                      <Users className="w-5 h-5" />
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-colors ${
                    theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } flex items-center justify-between`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'ar' ? 'الاشتراكات الفعالة' : 'Active Subs'}
                      </span>
                      <div className="text-xl font-black text-emerald-500 font-mono mt-1">
                        {activeSubs} {language === 'ar' ? 'نشط' : 'Active'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500">
                      <Activity className="w-5 h-5" />
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-colors ${
                    theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } flex items-center justify-between`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'ar' ? 'حجوزات قيد الانتظار' : 'Pending Bookings'}
                      </span>
                      <div className="text-xl font-black text-amber-500 font-mono mt-1">
                        {pendingBookings} {language === 'ar' ? 'طلب' : 'Pending'}
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                      <Clock className="w-5 h-5" />
                    </div>
                  </div>

                  <div className={`p-4 rounded-2xl border transition-colors ${
                    theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  } flex items-center justify-between`}>
                    <div>
                      <span className={`text-[10px] font-bold uppercase ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                        {language === 'ar' ? 'الدخل النشط المقدر' : 'Estimated Revenue'}
                      </span>
                      <div className="text-xl font-black text-amber-500 font-mono mt-1">
                        {estimatedRevenue} <span className="text-[10px] font-light">{language === 'ar' ? 'د.أ' : 'JOD'}</span>
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/10 text-amber-500">
                      <ArrowUpRight className="w-5 h-5" />
                    </div>
                  </div>
                </div>

                {/* Mid Section Info Banner */}
                <div className={`rounded-2xl p-4 border transition-colors grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                }`}>
                  <div className="space-y-2">
                    <h4 className={`text-xs font-black flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                      <ShieldAlert className="w-4 h-4 text-amber-500" />
                      <span>{language === 'ar' ? 'مهام إدارية عاجلة اليوم' : 'Urgent Admin Tasks Today'}</span>
                    </h4>
                    <ul className={`space-y-1.5 text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>
                          {language === 'ar' 
                            ? `مراجعة والموافقة على (${pendingBookings}) طلبات حجز مرافق معلقة.`
                            : `Review and approve (${pendingBookings}) pending booking requests.`}
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>
                          {language === 'ar'
                            ? 'إضافة قياسات بدنية أسبوعية للمشتركين لتعزيز تتبع اللياقة.'
                            : 'Add weekly fitness records for active members to keep tracking logs fresh.'}
                        </span>
                      </li>
                      <li className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"></span>
                        <span>
                          {language === 'ar'
                            ? 'تأكد من تفعيل أحدث العروض الصيفية لإتاحتها على تطبيق الأعضاء.'
                            : 'Ensure latest promotional campaigns are active for user visibility.'}
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className={`p-4 rounded-xl border transition-colors flex items-center justify-between ${
                    theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="space-y-1">
                      <h5 className="text-xs font-black text-amber-500">{language === 'ar' ? 'ميزة المدرب الافتراضي نشطة' : 'AI Coach Feature Active'}</h5>
                      <p className={`text-[10px] leading-relaxed ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                        {language === 'ar'
                          ? 'يستطيع الأعضاء التحدث مع المدرب الافتراضي ذكاء اصطناعي "الكابتن حُصين" من خلال هواتفهم، معتمدين على آخر قياسات بدنية قمت بإدخالها لهم هنا!'
                          : 'Members can chat with AI Coach Coach Husain on their mobile devices based on the body metric measurements you log for them here!'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: MEMBER MANAGEMENT */}
            {activePanel === 'members' && (
              <div className="space-y-6">
                
                {/* Header list controls */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h2 className={`text-lg font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{t.membersHeader}</h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {language === 'ar' ? 'سجل الأعضاء والوزن والدهون ونسبة العضلات' : 'Gym members log, weight, body fat & muscle ratio'}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => { setEditingMember(null); setShowMemberModal(true); }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1.5 self-start"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{t.membersAddNew}</span>
                  </button>
                </div>

                {/* Filters Row */}
                <div className={`flex flex-col sm:flex-row gap-3 p-3 rounded-2xl border ${theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="flex-1 relative">
                    <input 
                      type="text"
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      placeholder={t.membersSearchPlaceholder}
                      className={`w-full border rounded-xl pr-10 pl-4 py-2 text-xs focus:outline-none focus:border-amber-500 transition-colors ${theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'}`}
                    />
                    <Search className="w-4 h-4 text-slate-500 absolute right-3.5 top-1/2 -translate-y-1/2" />
                  </div>

                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => setSelectedMemberFilter("all")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${selectedMemberFilter === 'all' ? 'bg-amber-500 text-slate-950' : 'bg-slate-900 text-slate-400 hover:text-slate-200'}`}
                    >
                      {language === 'ar' ? `الكل (${members.length})` : `All (${members.length})`}
                    </button>
                    <button 
                      onClick={() => setSelectedMemberFilter("active")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${selectedMemberFilter === "active" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-slate-200"}`}
                    >
                      {language === "ar" ? "النشطين" : "Active"}
                    </button>
                    <button 
                      onClick={() => setSelectedMemberFilter("inactive")}
                      className={`px-3 py-1.5 rounded-xl text-xs font-black transition-colors ${selectedMemberFilter === "inactive" ? "bg-amber-500 text-slate-950" : "bg-slate-900 text-slate-400 hover:text-slate-200"}`}
                    >
                      {language === "ar" ? "غير المشتركين" : "Inactive"}
                    </button>
                  </div>
                </div>

                {/* Members Data Table */}
                <div className={`border rounded-2xl overflow-hidden ${theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}>
                          <th className="p-4">{language === 'ar' ? "اسم العضو والهدف" : "Member Name & Goal"}</th>
                          <th className="p-4">{language === 'ar' ? "رقم الجوال" : "Phone Number"}</th>
                          <th className="p-4 text-center">{language === 'ar' ? "القياسات البدنية (وزن/دهون/عضل)" : "Physical Metrics (Wt/Fat/Mus)"}</th>
                          <th className="p-4 text-center">{language === 'ar' ? "الاشتراك الحالي" : "Current Subscription"}</th>
                          <th className="p-4 text-left">{language === 'ar' ? "العمليات" : "Actions"}</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y text-xs ${theme === 'dark' ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                        {filteredMembers.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-slate-500 font-light">
                              {language === 'ar' ? "لا يوجد أعضاء يطابقون خيارات البحث الحالية." : "No members match the current search filters."}
                            </td>
                          </tr>
                        ) : (
                          filteredMembers.map((member) => {
                            const sub = subscriptions.find(s => s.memberId === member.id && s.status === 'فعال');
                            const log = progressLogs.filter(l => l.memberId === member.id).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
                            const goalStr = member.goal === 'تنشيف' 
                              ? (language === 'ar' ? 'تنشيف وخسارة دهون' : 'Fat Loss / Cutting') 
                              : member.goal === 'تضخيم' 
                              ? (language === 'ar' ? 'تضخيم وبناء عضلات' : 'Muscle Gain / Bulking') 
                              : (language === 'ar' ? 'لياقة بدنية وصحة' : 'Fitness & Health');
                            const genderStr = member.gender === 'أنثى' 
                              ? (language === 'ar' ? 'أنثى' : 'Female') 
                              : (language === 'ar' ? 'ذكر' : 'Male');
                            const subTypeStr = sub 
                              ? (sub.type === 'شامل' 
                                ? (language === 'ar' ? 'الاشتراك الشامل + مسبح' : 'All-Inclusive + Pool') 
                                : sub.type === 'جيم' 
                                ? (language === 'ar' ? 'حديد ولياقة (جيم)' : 'Gym & Fitness') 
                                : sub.type === 'مسبح' 
                                ? (language === 'ar' ? 'المسبح الأولمبي' : 'Olympic Pool') 
                                : (language === 'ar' ? 'ملاكمة وكيك بوكسينغ' : 'Boxing / Kickboxing')) 
                              : '';

                            return (
                              <tr key={member.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-slate-800/35' : 'hover:bg-slate-100'}`}>
                                <td className="p-4">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm" title={genderStr}>
                                      {member.gender === 'أنثى' ? '👩' : '👨'}
                                    </span>
                                    <div>
                                      <div className={`font-bold ${theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}`}>{member.name}</div>
                                      <div className="flex gap-1.5 items-center mt-0.5">
                                        <span className="text-[10px] text-amber-500 font-medium">
                                          {language === 'ar' ? `الهدف: ${goalStr}` : `Goal: ${goalStr}`}
                                        </span>
                                        <span className="text-slate-600/50">•</span>
                                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded-md ${
                                          member.gender === 'أنثى' 
                                            ? 'text-rose-400 bg-rose-500/10 border border-rose-500/20' 
                                            : 'text-sky-400 bg-sky-500/10 border border-sky-500/20'
                                        }`}>
                                          {genderStr}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className={`p-4 font-mono ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                                  <div>{member.phone}</div>
                                  <div className="text-[10px] text-slate-400/80 mt-0.5">
                                    {language === 'ar' ? 'كلمة السر: ' : 'Passcode: '} <span className="font-mono bg-slate-900 px-1 py-0.5 rounded border border-slate-800 text-amber-400 font-bold select-all">{member.password || member.phone.slice(-4) || '1234'}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  <div className="inline-flex gap-2 text-[11px]">
                                    <span className={`px-2 py-0.5 rounded-lg border font-mono ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`} title={language === 'ar' ? 'الوزن' : 'Weight'}>
                                      ⚖️ {log ? log.weight : member.weight} {language === 'ar' ? 'كجم' : 'kg'}
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-lg border font-mono ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`} title={language === 'ar' ? 'الدهون' : 'Fat'}>
                                      💧 {log ? log.fat : member.fat}%
                                    </span>
                                    <span className={`px-2 py-0.5 rounded-lg border font-mono ${theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-700'}`} title={language === 'ar' ? 'العضلات' : 'Muscle'}>
                                      💪 {log ? log.muscle : member.muscle}%
                                    </span>
                                  </div>
                                </td>
                                <td className="p-4 text-center">
                                  {member.status === 'قيد الانتظار' ? (
                                    <div className="inline-flex flex-col items-center">
                                      <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full animate-pulse">
                                        {language === 'ar' ? 'قيد الانتظار 🟡' : 'Pending 🟡'}
                                      </span>
                                      <span className="text-[9px] text-amber-600 mt-1 font-sans font-bold">
                                        {language === 'ar' ? 'بانتظار دفع الرسوم' : 'Awaiting payment'}
                                      </span>
                                    </div>
                                  ) : sub ? (
                                    <div className="inline-flex flex-col items-center">
                                      <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                                        {subTypeStr} ({language === 'ar' ? 'نشط' : 'Active'})
                                      </span>
                                      <span className="text-[9px] text-slate-500 mt-1 font-mono">
                                        {language === 'ar' ? `ينتهي ${sub.endDate}` : `Expires ${sub.endDate}`}
                                      </span>
                                    </div>
                                  ) : (
                                    <span className="text-[10px] font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                                      {language === 'ar' ? 'غير مشترك' : 'Inactive'}
                                    </span>
                                  )}
                                </td>
                                <td className="p-4 text-left">
                                  <div className="flex justify-end gap-1.5 items-center">
                                    {member.status === 'قيد الانتظار' ? (
                                      <button 
                                        onClick={() => {
                                          if (onApproveMember) {
                                            onApproveMember(member.id);
                                          }
                                        }}
                                        className="px-3 py-1.5 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 rounded-xl text-[10px] font-black hover:brightness-110 shadow-lg shadow-amber-500/10 transition-all"
                                        title={language === 'ar' ? 'قبول طلب الاشتراك وتفعيل الحساب' : 'Accept subscription and activate account'}
                                      >
                                        {language === 'ar' ? '⚡ قبول وتفعيل الاشتراك' : '⚡ Approve & Activate'}
                                      </button>
                                    ) : (
                                      <>
                                        <button 
                                          onClick={() => { setSelectedLogMember(member); setShowLogModal(true); }}
                                          className="px-2 py-1 bg-slate-900 border border-slate-700/50 hover:bg-slate-800 text-amber-500 rounded-lg text-[10px] font-bold transition-all"
                                          title={language === 'ar' ? 'تحديث القياسات البدنية' : 'Update body metrics'}
                                        >
                                          {language === 'ar' ? '+ قياس بدني' : '+ Metrics'}
                                        </button>

                                        <button 
                                          onClick={() => { setSelectedRenewMember(member); setShowRenewModal(true); }}
                                          className="px-2 py-1 bg-slate-900 border border-slate-700/50 hover:bg-slate-800 text-emerald-400 rounded-lg text-[10px] font-bold transition-all"
                                          title={language === 'ar' ? 'تجديد الاشتراك' : 'Renew membership'}
                                        >
                                          {language === 'ar' ? '🔄 تجديد' : '🔄 Renew'}
                                        </button>
                                      </>
                                    )}

                                    <button 
                                      onClick={() => openEditMember(member)}
                                      className="p-1 text-slate-400 hover:text-amber-500 hover:bg-slate-900 rounded-lg transition-colors"
                                      title={language === 'ar' ? 'تعديل بيانات العضو' : 'Edit member info'}
                                    >
                                      <Edit className="w-4 h-4" />
                                    </button>

                                    <button 
                                      onClick={() => {
                                        triggerConfirm(
                                          language === 'ar' ? 'تأكيد حذف المشترك 🚨' : 'Confirm Member Deletion 🚨',
                                          language === 'ar' 
                                            ? `هل أنت متأكد تماماً من رغبتك في حذف المشترك (${member.name})؟ سيؤدي ذلك لإزالة اشتراكاته وقياساته بالكامل.`
                                            : `Are you sure you want to completely delete member (${member.name})? This will delete all their subscriptions and progress.`,
                                          () => onDeleteMember(member.id)
                                        );
                                      }}
                                      className="p-1 text-slate-400 hover:text-rose-500 hover:bg-slate-900 rounded-lg transition-colors"
                                      title={language === 'ar' ? 'حذف العضو' : 'Delete member'}
                                    >
                                      <Trash className="w-4 h-4" />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* PANEL: SERVICES CRUD */}
            {activePanel === 'services' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-lg font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      {language === 'ar' ? 'إدارة خدمات وصالات النادي' : 'Manage Club Services & Facilities'}
                    </h2>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {language === 'ar' ? 'تعديل وإضافة باقات الجيم، المسبح، الملاكمة والمرافق' : 'Edit and add gym packages, pools, boxing spaces, and fitness facilities'}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setEditingService(null); setSrvTitle(""); setSrvDesc(""); setSrvPrice("30"); setShowServiceModal(true); }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service'}</span>
                  </button>
                </div>

                {/* Services grid view */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {services.map((service) => (
                    <div key={service.id} className={`p-4 rounded-2xl border flex flex-col justify-between space-y-4 transition-colors ${
                      theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <h4 className={`text-sm font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{service.title}</h4>
                          <span className="bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded-lg text-[10px] font-bold font-mono">
                            {service.price} {language === 'ar' ? 'د.أ' : 'JOD'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed min-h-[50px]">{service.description}</p>
                      </div>

                      <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                        <button 
                          onClick={() => openEditService(service)}
                          className="flex-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-amber-500 rounded-xl py-2 text-center text-xs font-bold transition-colors flex items-center justify-center gap-1"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>{language === 'ar' ? 'تعديل' : 'Edit'}</span>
                        </button>
                        <button 
                          onClick={() => {
                            triggerConfirm(
                              language === 'ar' ? 'تأكيد حذف الخدمة 🚨' : 'Confirm Service Deletion 🚨',
                              language === 'ar' 
                                ? `هل أنت متأكد من رغبتك في حذف خدمة (${service.title})؟`
                                : `Are you sure you want to delete service (${service.title})?`,
                              () => onDeleteService(service.id)
                            );
                          }}
                          className="p-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-xl transition-all"
                          title={language === 'ar' ? 'حذف الخدمة' : 'Delete service'}
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PANEL: OFFERS CRUD */}
            {activePanel === 'offers' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-lg font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      {language === 'ar' ? 'إدارة العروض والخصومات الترويجية' : 'Manage Promotional Offers'}
                    </h2>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'ar' ? 'عروض باقات تجديد الاشتراك الفعالة على تطبيق المشتركين' : 'Promotional renewal packages shown on user app'}
                    </p>
                  </div>
                  <button 
                    onClick={() => { setEditingOffer(null); setOffTitle(""); setOffDesc(""); setOffDiscount("25%"); setOffActive(true); setShowOfferModal(true); }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 px-4 rounded-xl text-xs transition-colors flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>{language === 'ar' ? 'إضافة عرض جديد' : 'Add New Offer'}</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {offers.map((offer) => (
                    <div key={offer.id} className={`p-4 rounded-2xl border flex flex-col justify-between space-y-4 transition-colors ${
                      theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                    }`}>
                      <div className="space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[9px] text-amber-500 font-bold uppercase tracking-wider">
                              {language === 'ar' ? 'خصم مذهل' : 'Amazing Discount'}
                            </span>
                            <h4 className={`text-sm font-black mt-0.5 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{offer.title}</h4>
                          </div>
                          <span className="bg-amber-500 text-slate-950 px-2 py-0.5 rounded-lg text-[11px] font-black font-mono">
                            {offer.discount}
                          </span>
                        </div>
                        <p className={`text-xs leading-relaxed min-h-[50px] ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>{offer.description}</p>
                      </div>

                      <div className={`flex items-center justify-between pt-3 border-t ${theme === 'dark' ? 'border-slate-800/80' : 'border-slate-200'}`}>
                        <button 
                          onClick={() => onUpdateOffer({ ...offer, active: !offer.active })}
                          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-all ${
                            offer.active 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-slate-900 border-slate-800 text-slate-400'
                          }`}
                        >
                          {offer.active 
                            ? (language === 'ar' ? "● معروض بالتطبيق" : "● Live on App") 
                            : (language === 'ar' ? "○ معطل مؤقتاً" : "○ Draft / Paused")}
                        </button>

                        <div className="flex items-center gap-1.5">
                          <button 
                            onClick={() => openEditOffer(offer)}
                            className="p-1.5 text-slate-400 hover:text-amber-500 rounded-lg transition-colors"
                            title={language === 'ar' ? 'تعديل' : 'Edit'}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => {
                              triggerConfirm(
                                language === 'ar' ? 'تأكيد حذف العرض 🚨' : 'Confirm Offer Deletion 🚨',
                                language === 'ar' 
                                  ? `هل أنت متأكد من رغبتك في حذف عرض (${offer.title})؟`
                                  : `Are you sure you want to delete offer (${offer.title})?`,
                                () => onDeleteOffer(offer.id)
                              );
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-colors"
                            title={language === 'ar' ? 'حذف' : 'Delete'}
                          >
                            <Trash className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* PANEL: BOOKINGS MANAGEMENT */}
            {activePanel === "bookings" && (
              <div className="space-y-6">
                <div>
                  <h2 className={`text-lg font-black ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    {language === "ar" ? "طلبات حجز المشتركين للمرافق" : "Member Facility Booking Requests"}
                  </h2>
                  <p className={`text-xs mt-0.5 ${theme === "dark" ? "text-slate-400" : "text-slate-500"}`}>
                    {language === "ar" ? "قبول أو رفض حجوزات صالات الجيم، المسبح والملاعب" : "Approve or reject bookings for gym zones, pools, or courts"}
                  </p>
                </div>

                <div className={`border rounded-2xl overflow-hidden ${theme === "dark" ? "bg-slate-850 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                  <div className="overflow-x-auto">
                    <table className="w-full text-right border-collapse">
                      <thead>
                        <tr className={`border-b text-[10px] font-black uppercase tracking-wider ${theme === "dark" ? "bg-slate-900 border-slate-800 text-slate-400" : "bg-slate-100 border-slate-200 text-slate-600"}`}>
                          <th className="p-4">{language === "ar" ? "اسم المشترك وجواله" : "Member Name & Phone"}</th>
                          <th className="p-4">{language === "ar" ? "المرفق المطلوب" : "Requested Facility"}</th>
                          <th className="p-4">{language === "ar" ? "تاريخ ووقت الحجز" : "Date & Time"}</th>
                          <th className="p-4 text-center">{language === "ar" ? "حالة الطلب" : "Status"}</th>
                          <th className="p-4 text-left">{language === "ar" ? "قرارات الإدارة" : "Admin Decisions"}</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y text-xs ${theme === "dark" ? "divide-slate-800/60" : "divide-slate-200"}`}>
                        {bookings.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="text-center py-8 text-slate-500 font-light">
                              {language === "ar" ? "لا يوجد طلبات حجز مرافق مسجلة حالياً." : "No facility booking requests registered at the moment."}
                            </td>
                          </tr>
                        ) : (
                          [...bookings].sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((booking) => (
                            <tr key={booking.id} className={`transition-colors ${theme === "dark" ? "hover:bg-slate-800/35" : "hover:bg-slate-100"}`}>
                              <td className="p-4">
                                <div className={`font-bold ${theme === "dark" ? "text-slate-100" : "text-slate-800"}`}>{booking.memberName}</div>
                                <div className="text-[10px] text-slate-400 font-mono mt-0.5">{booking.memberPhone}</div>
                              </td>
                              <td className="p-4">
                                <span className={`px-2.5 py-1 rounded-xl border font-bold text-amber-500 ${theme === "dark" ? "bg-slate-900 border-slate-800/80" : "bg-slate-100 border-slate-200"}`}>
                                  {booking.serviceTitle}
                                </span>
                                {booking.playersCount && (
                                  <div className="text-[10px] text-amber-500 font-extrabold mt-1.5 flex items-center gap-1">
                                    ⚽ {language === "ar" ? `عدد اللاعبين المتوقع: ${booking.playersCount}` : `Expected Players: ${booking.playersCount}`}
                                  </div>
                                )}
                                {booking.notes && (
                                  <div className={`text-[10px] italic mt-1.5 max-w-[220px] leading-relaxed p-1.5 rounded-lg border ${
                                    theme === "dark" ? "text-slate-400 bg-slate-950/30 border-slate-800" : "text-slate-600 bg-slate-50 border-slate-200"
                                  }`} title={booking.notes}>
                                    📝 {booking.notes}
                                  </div>
                                )}
                              </td>
                              <td className={`p-4 font-mono ${theme === "dark" ? "text-slate-300" : "text-slate-700"}`}>
                                {booking.date} | {booking.timeSlot}
                              </td>
                              <td className="p-4 text-center">
                                <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold ${
                                  booking.status === "تم القبول" ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" :
                                  booking.status === "تم الرفض" ? "bg-rose-500/15 text-rose-400 border border-rose-500/20" :
                                  "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                                }`}>
                                  {booking.status === "تم القبول" ? (language === "ar" ? "تم القبول" : "Approved") :
                                   booking.status === "تم الرفض" ? (language === "ar" ? "تم الرفض" : "Rejected") :
                                   (language === "ar" ? "قيد الانتظار" : "Pending")}
                                </span>
                              </td>
                              <td className="p-4 text-left">
                                <div className="flex justify-end gap-1.5">
                                  {booking.status === "قيد الانتظار" && (
                                    <>
                                      <button 
                                        onClick={() => onUpdateBookingStatus(booking.id, "تم القبول")}
                                        className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-slate-950 font-black rounded-lg text-[10px] transition-colors"
                                      >
                                        {language === "ar" ? "قبول الحجز" : "Approve"}
                                      </button>
                                      <button 
                                        onClick={() => onUpdateBookingStatus(booking.id, "تم الرفض")}
                                        className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg text-[10px] transition-colors"
                                      >
                                        {language === "ar" ? "رفض" : "Reject"}
                                      </button>
                                    </>
                                  )}

                                  <a 
                                    href={`https://wa.me/${booking.memberPhone.replace("0", "962")}?text=${encodeURIComponent(
                                      language === "ar"
                                        ? `أهلاً بك كابتن ${booking.memberName}، بخصوص حجزك لخدمة ${booking.serviceTitle} بتاريخ ${booking.date}...`
                                        : `Hello Captain ${booking.memberName}, regarding your booking for ${booking.serviceTitle} on ${booking.date}...`
                                    )}`}
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="p-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-850 text-emerald-400 rounded-lg transition-colors flex items-center justify-center"
                                    title={language === "ar" ? "اتصال واتساب للمشترك" : "WhatsApp member"}
                                  >
                                    <Phone className="w-3.5 h-3.5" />
                                  </a>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* PANEL: SMART BAR ORDER POS */}
            {activePanel === 'bar' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className={`text-lg font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>بوفيه صالة الحصن والطلبات 🥛</h2>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>تتبع طلبات البروتين والوجبات الخفيفة والتحكم بحالة تجهيز الطلبات</p>
                  </div>
                  <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
                    theme === 'dark' ? 'bg-slate-800 border-slate-700/50 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-600'
                  }`}>
                    شاشات تحضير المأكولات والمشروبات
                  </span>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className={`p-4 rounded-2xl border flex justify-between items-center transition-colors ${
                    theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div>
                      <span className={`text-[10px] font-bold block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>إجمالي المبيعات بالنقاط</span>
                      <span className="text-xl font-mono font-black text-amber-500 mt-1 block">
                        {barOrders.reduce((sum, o) => sum + o.totalPointsCost, 0)} ن
                      </span>
                    </div>
                    <span className="text-lg">🪙</span>
                  </div>
                  <div className={`p-4 rounded-2xl border flex justify-between items-center transition-colors ${
                    theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div>
                      <span className={`text-[10px] font-bold block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>الطلبات قيد التحضير</span>
                      <span className="text-xl font-mono font-black text-amber-500 mt-1 block">
                        {barOrders.filter(o => o.status === 'قيد التحضير').length} طلبات
                      </span>
                    </div>
                    <span className="text-lg text-amber-500 animate-pulse">⏳</span>
                  </div>
                  <div className={`p-4 rounded-2xl border flex justify-between items-center transition-colors ${
                    theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                  }`}>
                    <div>
                      <span className={`text-[10px] font-bold block ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>تم تسليمها بنجاح</span>
                      <span className="text-xl font-mono font-black text-emerald-400 mt-1 block">
                        {barOrders.filter(o => o.status === 'تم التسليم').length} منتجات
                      </span>
                    </div>
                    <span className="text-lg text-emerald-400">✅</span>
                  </div>
                </div>

                {/* Order queues */}
                <div className={`rounded-2xl border overflow-hidden transition-colors ${theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'}`}>
                  <div className={`p-4 border-b flex justify-between items-center ${theme === 'dark' ? 'border-slate-800' : 'border-slate-200'}`}>
                    <h3 className={`text-xs font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      {language === 'ar' ? 'قائمة الطلبات المستلمة من تطبيق المشتركين' : 'Buffet Orders Received from Members'}
                    </h3>
                    <span className="text-[10px] text-slate-500">
                      {language === 'ar' ? 'حدث قبل ثوانٍ' : 'Updated just now'}
                    </span>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className={`text-[10px] uppercase font-bold border-b ${theme === 'dark' ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>
                        <tr>
                          <th className="p-4">{language === 'ar' ? 'اسم العضو (البطل)' : 'Member Name'}</th>
                          <th className="p-4">{language === 'ar' ? 'المنتج المطلوب' : 'Item Ordered'}</th>
                          <th className="p-4">{language === 'ar' ? 'سعر الخصم' : 'Points Cost'}</th>
                          <th className="p-4">{language === 'ar' ? 'وقت الطلب' : 'Order Time'}</th>
                          <th className="p-4">{language === 'ar' ? 'الحالة الحالية' : 'Current Status'}</th>
                          <th className="p-4 text-center">{language === 'ar' ? 'أكشن تحديث المطبخ' : 'Kitchen Status Update'}</th>
                        </tr>
                      </thead>
                      <tbody className={`divide-y ${theme === 'dark' ? 'divide-slate-800/60' : 'divide-slate-200'}`}>
                        {barOrders.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">
                              {language === 'ar' ? 'لا توجد أي طلبات بوفيه مضافة حالياً.' : 'No snack bar orders added currently.'}
                            </td>
                          </tr>
                        ) : (
                          [...barOrders].reverse().map((order) => (
                            <tr key={order.id} className={`transition-colors ${theme === 'dark' ? 'hover:bg-slate-850/35' : 'hover:bg-slate-100'}`}>
                              <td className="p-4 font-bold">
                                <div className={theme === 'dark' ? 'text-slate-100' : 'text-slate-800'}>{order.memberName}</div>
                                {order.deliveryLocation && (
                                  <div className="text-[10px] text-purple-600 dark:text-purple-400 font-extrabold mt-1.5 flex items-center gap-1">
                                    📍 {language === 'ar' ? `توصيل لـ: ${order.deliveryLocation === 'Gym' ? 'الصالة الرياضية 🏋️' : order.deliveryLocation === 'Pool' ? 'المسبح 🏊' : 'الجلسة الخارجية 🌴'}` : `Deliver to: ${order.deliveryLocation === 'Gym' ? 'Gym 🏋️' : order.deliveryLocation === 'Pool' ? 'Pool 🏊' : 'Outdoor Lounge 🌴'}`}
                                  </div>
                                )}
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-1 rounded border font-bold ${
                                  theme === 'dark' ? 'bg-slate-800 border-slate-750 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                                }`}>{order.itemName}</span>
                              </td>
                              <td className="p-4 text-amber-500 font-mono font-bold">-{order.totalPointsCost} {language === 'ar' ? 'ن' : 'pts'}</td>
                              <td className={`p-4 font-mono ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>
                                {new Date(order.createdAt).toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                              </td>
                              <td className="p-4">
                                <span className={`px-2 py-0.5 rounded-full border text-[10px] font-black ${
                                  order.status === "قيد التحضير" 
                                    ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                                    : order.status === "جاهز للاستلام"
                                      ? "bg-cyan-500/10 text-cyan-500 border-cyan-500/20 animate-pulse"
                                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                }`}>
                                  {order.status === "قيد التحضير" ? (language === "ar" ? "قيد التحضير" : "In Prep") :
                                   order.status === "جاهز للاستلام" ? (language === "ar" ? "جاهز للاستلام" : "Ready for Pickup") :
                                   (language === "ar" ? "تم التسليم" : "Delivered")}
                                </span>
                              </td>
                              <td className="p-4 text-center">
                                <div className="flex items-center justify-center gap-2">
                                  {order.status === "قيد التحضير" && (
                                    <button 
                                      onClick={() => onUpdateBarOrderStatus(order.id, "جاهز للاستلام")}
                                      className="px-2.5 py-1 rounded-lg bg-cyan-600 text-slate-950 hover:bg-cyan-500 font-black text-[10px] transition-colors"
                                    >
                                      {language === "ar" ? "جاهز للاستلام 🍳" : "Ready 🍳"}
                                    </button>
                                  )}
                                  {order.status === "جاهز للاستلام" && (
                                    <button 
                                      onClick={() => onUpdateBarOrderStatus(order.id, "تم التسليم")}
                                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-slate-950 hover:bg-emerald-500 font-black text-[10px] transition-colors"
                                    >
                                      {language === "ar" ? "تسليم للعميل ✅" : "Deliver ✅"}
                                    </button>
                                  )}
                                  {order.status === "تم التسليم" && (
                                    <span className="text-[10px] text-slate-500 italic">
                                      {language === "ar" ? "تم الاستلام بنجاح" : "Delivered successfully"}
                                    </span>
                                  )}
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Available items directory */}
                <div className={`rounded-2xl border p-4 transition-colors ${theme === "dark" ? "bg-slate-850 border-slate-800" : "bg-white border-slate-200 shadow-sm"}`}>
                  <h3 className={`text-xs font-black mb-3 ${theme === "dark" ? "text-slate-100" : "text-slate-900"}`}>
                    {language === "ar" ? "دليل بضاعة البوفيه الحالية ومعدل المخزون" : "Current Snack Bar Inventory & Stock Levels"}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {barItems.map((item) => (
                      <div key={item.id} className={`border p-3 rounded-xl flex justify-between items-center text-xs transition-colors ${
                        theme === "dark" ? "bg-slate-900 border-slate-800" : "bg-slate-50 border-slate-200"
                      }`}>
                        <div>
                          <div className={`font-bold ${theme === "dark" ? "text-slate-200" : "text-slate-800"}`}>{item.name}</div>
                          <div className="text-[10px] text-slate-400 mt-1">
                            {item.category} | {language === "ar" ? "مخزون:" : "Stock:"} <span className="font-mono text-slate-300 font-bold">{item.stock} {language === "ar" ? "حبة" : "pcs"}</span>
                          </div>
                        </div>
                        <div className="text-left font-mono">
                          <span className="text-amber-500 font-black block">{item.pricePoints} {language === "ar" ? "ن" : "pts"}</span>
                          <span className="text-[10px] text-slate-500 block">{item.priceCash} {language === "ar" ? "د.أ" : "JOD"}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: GATE ATTENDANCE CONTROLLER LOGS */}
            {activePanel === 'attendance' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black text-slate-100">سجل بوابة الدخول الذكية (QR Attendance Logs) 📲</h2>
                    <p className="text-xs text-slate-400 mt-0.5">مراقبة تصفح ودخول الأعضاء عبر مسح رمز الباركود من هواتفهم</p>
                  </div>
                  <div className="flex gap-2">
                    {/* Simulator Action to check in an arbitrary member */}
                    <select 
                      onChange={(e) => {
                        if (e.target.value) {
                          onScanQRAdmin(e.target.value);
                          e.target.value = "";
                        }
                      }}
                      className="bg-slate-800 border border-slate-700 text-slate-300 rounded-xl px-3 py-1.5 text-xs focus:outline-none"
                    >
                      <option value="">-- محاكاة دخول عضو يدوي --</option>
                      {members.map(m => (
                        <option key={m.id} value={m.id}>{m.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* KPI block */}
                <div className="bg-slate-850 p-4 rounded-2xl border border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold block">حضور بوابة اليوم</span>
                    <span className="text-2xl font-mono font-black text-amber-500 mt-1 block">
                      {attendanceLogs.length} تمرير رمز
                    </span>
                  </div>
                  <div className="text-right text-[10px] text-slate-400">
                    <p>بوابة صالة الحديد: <span className="text-emerald-400 font-bold">نشطة 🟢</span></p>
                    <p className="mt-1">آخر تمرير: {attendanceLogs[0] ? `${attendanceLogs[0].date} | ${attendanceLogs[0].time}` : 'لا يوجد اليوم'}</p>
                  </div>
                </div>

                {/* Entry Log table */}
                <div className="bg-slate-850 rounded-2xl border border-slate-800 overflow-hidden">
                  <div className="p-4 border-b border-slate-800">
                    <h3 className="text-xs font-black text-slate-100">سجل الدخول اللحظي عبر الباركود الذكي</h3>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-right text-xs">
                      <thead className="bg-slate-900 text-slate-400 text-[10px] uppercase font-bold border-b border-slate-800">
                        <tr>
                          <th className="p-4">رقم الحركة</th>
                          <th className="p-4">اسم العضو المشترك</th>
                          <th className="p-4">الهاتف والتحقق</th>
                          <th className="p-4">وقت وتاريخ العبور</th>
                          <th className="p-4">التحقق الإداري</th>
                          <th className="p-4 text-center">أكشن تحفيزي</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-800/60">
                        {attendanceLogs.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="p-8 text-center text-slate-500">لم يسجل دخول أي بطل اليوم بعد عبر الـ QR.</td>
                          </tr>
                        ) : (
                          [...attendanceLogs].reverse().map((log, idx) => {
                            const m = members.find(member => member.id === log.memberId);
                            return (
                              <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                                <td className="p-4 font-mono text-slate-500">#{attendanceLogs.length - idx}</td>
                                <td className="p-4">
                                  <div>
                                    <div className="font-bold text-slate-200">{log.memberName}</div>
                                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {log.memberId}</div>
                                  </div>
                                </td>
                                <td className="p-4 text-slate-300 font-mono">
                                  <div>{m?.phone || "07XXXXXXXX"}</div>
                                  <div className="text-[9px] text-emerald-400 flex items-center gap-0.5 mt-0.5">
                                    <Check className="w-3 h-3" /> تم التحقق التلقائي
                                  </div>
                                </td>
                                <td className="p-4 text-slate-300 font-mono">
                                  {log.date} | {log.time}
                                </td>
                                <td className="p-4">
                                  <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full text-[10px] font-bold">
                                    مصادق عليه بوابة 1
                                  </span>
                                </td>
                                <td className="p-4">
                                  <div className="flex justify-center">
                                    <button 
                                      onClick={() => {
                                        onAddPointsAdmin(log.memberId, 15);
                                        alert(language === 'ar' 
                                          ? `تم إرسال +15 نقطة تشجيعية بنجاح إلى البطل ${log.memberName}!` 
                                          : `+15 promotional points sent successfully to ${log.memberName}!`
                                        );
                                      }}
                                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-750 text-amber-500 hover:bg-slate-800 hover:text-amber-400 transition-colors font-black text-[10px]"
                                    >
                                      مكافأة +15 ن 🎁
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* PANEL: SMART COACH PLANS */}
            {activePanel === 'coach' && (
              <CoachSettings theme={theme} language={language} />
            )}

            {/* PANEL: CLUB INFO & SETTINGS */}
            {activePanel === 'settings' && (
              <div className="space-y-6" style={{ direction: "rtl" }}>
                <div>
                  <h2 className={`text-lg font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                    {language === 'ar' ? 'إعدادات هوية النادي الرياضي ⚙️' : 'Club Identity Settings ⚙️'}
                  </h2>
                  <p className={`text-xs mt-0.5 font-light ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {language === 'ar' ? 'تخصيص اسم نادي الحصن وصورة الشعار المعروضة في التطبيق واللوحات' : 'Customize Al Huson name and logo image displayed inside members app'}
                  </p>
                </div>

                <div className={`p-6 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } space-y-6`}>
                  
                  {/* Live Preview block */}
                  <div className="flex flex-col items-center justify-center p-4 rounded-xl border-2 border-dashed border-slate-700/35 bg-slate-950/20 text-center">
                    <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest block mb-3">معاينة الشعار والاسم الحاليين</span>
                    
                    {clubLogo ? (
                      <div className="relative group">
                        <img 
                          src={clubLogo} 
                          alt="Club Logo" 
                          className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-500/20 shadow-md transition-transform group-hover:scale-105" 
                        />
                        <button 
                          onClick={() => onUpdateClubInfo(clubName, "")}
                          className="absolute -top-1.5 -right-1.5 p-1 bg-rose-500 hover:bg-rose-600 text-white rounded-full transition-transform hover:scale-110"
                          title="إزالة الشعار"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <div className="w-20 h-20 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-extrabold text-3xl border border-amber-500/20 shadow-inner">
                        ح
                      </div>
                    )}
                    
                    <h3 className={`text-base font-black mt-3 ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>{clubName}</h3>
                    <p className="text-[9px] text-slate-500 mt-0.5">{language === 'ar' ? 'شعار وهوية صالة نادي الحصن الذكي' : 'Al Huson smart gym branding'}</p>
                  </div>

                  {/* Form fields */}
                  <div className="space-y-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'اسم النادي الرياضي الجديد' : 'New Sports Club Name'}
                      </label>
                      <input 
                        type="text" 
                        value={clubName}
                        onChange={(e) => onUpdateClubInfo(e.target.value, clubLogo, loginBgImage)}
                        placeholder="نادي الحصن الرياضي..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'صورة شعار النادي (رابط خارجي مباشر)' : 'Club Logo Image (Direct External URL)'}
                      </label>
                      <input 
                        type="text" 
                        value={clubLogo.startsWith('data:image') ? '' : clubLogo}
                        onChange={(e) => onUpdateClubInfo(clubName, e.target.value, loginBgImage)}
                        placeholder="https://example.com/logo.png..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'صورة خلفية صفحة تسجيل الدخول (رابط مباشر)' : 'Login Page Background Image (Direct URL)'}
                      </label>
                      <input 
                        type="text" 
                        value={loginBgImage.startsWith('data:image') ? '' : loginBgImage}
                        onChange={(e) => onUpdateClubInfo(clubName, clubLogo, e.target.value)}
                        placeholder="https://example.com/login_bg.png..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <div className="pt-2 grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          {language === 'ar' ? 'أو ارفع ملف الشعار مباشرة' : 'Or upload logo image file'}
                        </label>
                        <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                          theme === 'dark' ? 'border-slate-700/60 hover:border-amber-500/40 bg-slate-900/30' : 'border-slate-200 hover:border-amber-500/40 bg-slate-50/50'
                        }`}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    onUpdateClubInfo(clubName, reader.result, loginBgImage);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-1">
                            <Plus className="w-5 h-5 text-slate-400 mx-auto" />
                            <p className="text-xs font-bold text-slate-400">{language === 'ar' ? 'تحميل شعار جديد' : 'Upload new logo'}</p>
                            <p className="text-[9px] text-slate-500">{language === 'ar' ? 'PNG, JPG, JPEG, SVG' : 'PNG, JPG, JPEG, SVG'}</p>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          {language === 'ar' ? 'أو ارفع ملف خلفية تسجيل الدخول مباشرة' : 'Or upload login background file'}
                        </label>
                        <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                          theme === 'dark' ? 'border-slate-700/60 hover:border-amber-500/40 bg-slate-900/30' : 'border-slate-200 hover:border-amber-500/40 bg-slate-50/50'
                        }`}>
                          <input 
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                  if (typeof reader.result === 'string') {
                                    onUpdateClubInfo(clubName, clubLogo, reader.result);
                                  }
                                };
                                reader.readAsDataURL(file);
                              }
                            }}
                            className="absolute inset-0 opacity-0 cursor-pointer z-10"
                          />
                          <div className="space-y-1">
                            <Plus className="w-5 h-5 text-slate-400 mx-auto" />
                            <p className="text-xs font-bold text-slate-400">{language === 'ar' ? 'تحميل خلفية تسجيل دخول' : 'Upload login background'}</p>
                            <p className="text-[9px] text-slate-500">{language === 'ar' ? 'PNG, JPG, JPEG, SVG' : 'PNG, JPG, JPEG, SVG'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/10 leading-relaxed text-[10px] text-slate-400">
                    💡 <span className="font-bold text-slate-300">{language === 'ar' ? 'ملاحظة:' : 'Note:'}</span> {language === 'ar' ? 'سيتم حفظ التغييرات فوراً في التخزين المحلي (LocalStorage) وتحديث الشعار واسم النادي الرياضي في شاشتي المدير وتطبيق الأعضاء الافتراضي بدون الحاجة لعمل تحديث يدوي للصفحة!' : 'Changes will persist instantly in LocalStorage and sync in both admin and user screens.'}
                  </div>

                </div>

                {/* ⏰ CUSTOM SETTING CARD: CLUB OPERATING HOURS & SHIFTS */}
                <div className={`p-6 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } space-y-6`}>
                  <div>
                    <div className="flex justify-between items-center">
                      <div>
                        <h3 className={`text-sm font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                          {language === 'ar' ? 'أوقات العمل وفترات الورديات المخصصة للجنسين ⏰' : 'Operating Hours & Gender Shifts ⏰'}
                        </h3>
                        <p className={`text-[11px] mt-0.5 font-light ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          {language === 'ar' ? 'حدد أوقات فترات النساء والرجال لتفادي حجز المواعيد في أوقات غير مطابقة' : 'Define women & men shift hours to strictly align members scheduling slots'}
                        </p>
                      </div>
                      <span className="bg-amber-500/15 text-amber-500 border border-amber-500/20 text-[10px] px-2 py-0.5 rounded-full font-bold">بث حي ونشط</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Women Shift */}
                    <div className={`${
                      theme === 'dark' ? 'bg-purple-950/10 border-purple-500/20' : 'bg-purple-50/50 border-purple-200'
                    } border rounded-xl p-4 space-y-3 text-right`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
                        <h4 className="text-xs font-black text-purple-600 dark:text-purple-400">وردية النساء (السيدات) ♀️</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`block text-[10px] mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>بداية الوردية</label>
                          <input 
                            type="time" 
                            value={clubHours.womenStart}
                            onChange={(e) => onUpdateClubHours({ ...clubHours, womenStart: e.target.value })}
                            className={`w-full rounded-lg px-2 py-1 text-xs font-mono border ${
                              theme === 'dark' ? 'bg-slate-900 border-slate-700/60 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-[10px] mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>نهاية الوردية</label>
                          <input 
                            type="time" 
                            value={clubHours.womenEnd}
                            onChange={(e) => onUpdateClubHours({ ...clubHours, womenEnd: e.target.value })}
                            className={`w-full rounded-lg px-2 py-1 text-xs font-mono border ${
                              theme === 'dark' ? 'bg-slate-900 border-slate-700/60 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Men Shift */}
                    <div className={`${
                      theme === 'dark' ? 'bg-amber-500/[0.03] border-amber-500/20' : 'bg-amber-50/50 border-amber-200'
                    } border rounded-xl p-4 space-y-3 text-right`}>
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
                        <h4 className="text-xs font-black text-amber-600 dark:text-amber-500">وردية الرجال (الشباب) ♂️</h4>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className={`block text-[10px] mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>بداية الوردية</label>
                          <input 
                            type="time" 
                            value={clubHours.menStart}
                            onChange={(e) => onUpdateClubHours({ ...clubHours, menStart: e.target.value })}
                            className={`w-full rounded-lg px-2 py-1 text-xs font-mono border ${
                              theme === 'dark' ? 'bg-slate-900 border-slate-700/60 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                        <div>
                          <label className={`block text-[10px] mb-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-600'}`}>نهاية الوردية</label>
                          <input 
                            type="time" 
                            value={clubHours.menEnd}
                            onChange={(e) => onUpdateClubHours({ ...clubHours, menEnd: e.target.value })}
                            className={`w-full rounded-lg px-2 py-1 text-xs font-mono border ${
                              theme === 'dark' ? 'bg-slate-900 border-slate-700/60 text-slate-100' : 'bg-white border-slate-200 text-slate-800'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className={`border p-3 rounded-xl text-[10px] leading-relaxed text-right ${
                    theme === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
                  }`}>
                    ⚙️ <span className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-750'}`}>ميزة الحظر والتقييد التلقائي:</span> بمجرد تغيير هذه الأوقات، سيقوم تطبيق الهاتف في simulator بتغيير الفترات الزمنية المتاحة تلقائياً للمشتركات الإناث والمشتركين الذكور لضمان التنسيق التام!
                  </div>
                </div>

                {/* 📣 CUSTOM SETTING CARD: LIVE PUSH NOTIFICATION DISPATCHER */}
                <div className={`p-6 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } space-y-6`}>
                  <div>
                    <h3 className={`text-sm font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      {language === 'ar' ? 'إرسال إشعار فوري (Push Alerts Dispatcher) 📣' : 'Live Push Alerts Dispatcher 📣'}
                    </h3>
                    <p className={`text-[11px] mt-0.5 font-light ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'ar' ? 'بث تنبيهات حية ومباشرة لتظهر كـ Pop-up عاجل على شاشة الهاتف' : 'Broadcast immediate alerts to pop-up on members simulated phone screen'}
                    </p>
                  </div>

                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      const target = e.target as HTMLFormElement;
                      const titleInput = target.elements.namedItem('notifTitle') as HTMLInputElement;
                      const messageInput = target.elements.namedItem('notifMsg') as HTMLTextAreaElement;
                      const memberSelect = target.elements.namedItem('notifMember') as HTMLSelectElement;

                      if (titleInput.value.trim() && messageInput.value.trim()) {
                        onSendNotification(titleInput.value, messageInput.value, memberSelect.value);
                        alert(language === 'ar'
                          ? "🎉 تم إرسال وتوجيه الإشعار الفوري بنجاح! سيظهر الإشعار فوراً في شاشة الهاتف بالأسفل."
                          : "🎉 Push notification broadcasted successfully! It will appear immediately in the virtual phone screen."
                        );
                        titleInput.value = "";
                        messageInput.value = "";
                      }
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="text-right">
                        <label className="block text-xs font-bold mb-1.5 text-slate-300">عنوان الإشعار العاجل</label>
                        <input 
                          type="text" 
                          name="notifTitle"
                          required
                          placeholder="مثال: إغلاق مؤقت لأعمال الصيانة..."
                          className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 text-right"
                        />
                      </div>
                      <div className="text-right">
                        <label className="block text-xs font-bold mb-1.5 text-slate-300 font-sans">توجيه التنبيه إلى (المستهدف)</label>
                        <select 
                          name="notifMember"
                          className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 text-right"
                        >
                          <option value="all">الجميع (جميع الأعضاء والمشتركين)</option>
                          {members.map(m => (
                            <option key={m.id} value={m.id}>{m.name} ({m.phone})</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="text-right">
                      <label className="block text-xs font-bold mb-1.5 text-slate-300">مضمون ونص الرسالة بالتفصيل</label>
                      <textarea 
                        name="notifMsg"
                        required
                        rows={3}
                        placeholder="اكتب مضمون الإشعار هنا..."
                        className="w-full bg-slate-900 border border-slate-700/60 rounded-xl px-3 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 text-right"
                      />
                    </div>

                    <div className="flex">
                      <button 
                        type="submit"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-black px-5 py-2.5 rounded-xl text-xs transition-colors flex items-center gap-1.5 mr-auto"
                      >
                        بث وإرسال إشعار فوري 🚀
                      </button>
                    </div>
                  </form>
                </div>

                {/* CARD: SOCIAL MEDIA LINKS */}
                <div className={`p-6 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } space-y-6`}>
                  <div>
                    <h3 className={`text-sm font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      {language === 'ar' ? 'حسابات التواصل الاجتماعي للنادي 📱' : 'Club Social Media Accounts 📱'}
                    </h3>
                    <p className={`text-[11px] mt-0.5 font-light ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'ar' ? 'قم بتوصيل حسابات النادي ليتم عرضها داخل تطبيق المشتركين' : 'Configure social accounts to be displayed inside members app'}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'رابط حساب فيسبوك (Facebook URL)' : 'Facebook URL'}
                      </label>
                      <input 
                        type="text" 
                        value={clubFacebook}
                        onChange={(e) => onUpdateClubSocials?.(e.target.value, clubInstagram, clubTwitter, clubTikTok, clubWhatsApp)}
                        placeholder="https://facebook.com/yourclub..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'رابط حساب انستغرام (Instagram URL)' : 'Instagram URL'}
                      </label>
                      <input 
                        type="text" 
                        value={clubInstagram}
                        onChange={(e) => onUpdateClubSocials?.(clubFacebook, e.target.value, clubTwitter, clubTikTok, clubWhatsApp)}
                        placeholder="https://instagram.com/yourclub..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'رابط حساب تويتر / إكس (Twitter/X URL)' : 'Twitter/X URL'}
                      </label>
                      <input 
                        type="text" 
                        value={clubTwitter}
                        onChange={(e) => onUpdateClubSocials?.(clubFacebook, clubInstagram, e.target.value, clubTikTok, clubWhatsApp)}
                        placeholder="https://twitter.com/yourclub..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'رابط حساب تيك توك (TikTok URL)' : 'TikTok URL'}
                      </label>
                      <input 
                        type="text" 
                        value={clubTikTok}
                        onChange={(e) => onUpdateClubSocials?.(clubFacebook, clubInstagram, clubTwitter, e.target.value, clubWhatsApp)}
                        placeholder="https://tiktok.com/@yourclub..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'رابط واتساب المباشر (WhatsApp Link / Number)' : 'WhatsApp Link'}
                      </label>
                      <input 
                        type="text" 
                        value={clubWhatsApp}
                        onChange={(e) => onUpdateClubSocials?.(clubFacebook, clubInstagram, clubTwitter, clubTikTok, e.target.value)}
                        placeholder="https://wa.me/962795551234..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* SECOND CARD: ADMIN ACCOUNT SETTINGS */}
                <div className={`p-6 rounded-2xl border ${
                  theme === 'dark' ? 'bg-slate-850 border-slate-800' : 'bg-white border-slate-200 shadow-sm'
                } space-y-6`}>
                  <div>
                    <h3 className={`text-sm font-black ${theme === 'dark' ? 'text-slate-100' : 'text-slate-900'}`}>
                      {language === 'ar' ? 'إعدادات حساب المدير المسؤول 👤' : 'Admin Credentials Settings 👤'}
                    </h3>
                    <p className={`text-[11px] mt-0.5 font-light ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {language === 'ar' ? 'تعديل اسم المدير، وصورة الملف الشخصي، وكلمة سر الدخول للوحة التحكم' : 'Modify admin name, profile avatar, and admin access passcode'}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'اسم المدير المسؤول' : 'Admin Name'}
                      </label>
                      <input 
                        type="text" 
                        value={adminName}
                        onChange={(e) => {
                          setAdminName(e.target.value);
                        }}
                        placeholder="مثال: الكابتن حصن البدر..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <div>
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'كلمة سر الدخول الجديدة للوحة التحكم' : 'New Admin Passcode'}
                      </label>
                      <input 
                        type="text" 
                        value={adminPass}
                        onChange={(e) => {
                          setAdminPass(e.target.value);
                        }}
                        placeholder="كلمة مرور الدخول..."
                        className={`w-full border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                        }`}
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className={`block text-xs font-bold mb-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                        {language === 'ar' ? 'صورة الملف الشخصي للمدير (رابط الصورة أو ارفع بالأسفل)' : 'Admin Profile Picture (Image URL or direct upload)'}
                      </label>
                      <div className="flex gap-3 items-center">
                        <img 
                          src={adminPic} 
                          alt="Admin Profile" 
                          className="w-12 h-12 rounded-xl object-cover border border-amber-500/20"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200";
                          }}
                        />
                        <input 
                          type="text" 
                          value={adminPic.startsWith('data:image') ? '' : adminPic}
                          onChange={(e) => {
                            setAdminPic(e.target.value);
                          }}
                          placeholder="https://example.com/avatar.png..."
                          className={`flex-1 border rounded-xl px-4 py-2.5 text-xs font-semibold focus:outline-none focus:border-amber-500 transition-colors ${
                            theme === 'dark' ? 'bg-slate-900 border-slate-700 text-slate-100' : 'bg-slate-50 border-slate-200 text-slate-800'
                          }`}
                        />
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <div className={`relative border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
                        theme === 'dark' ? 'border-slate-700/60 hover:border-amber-500/40 bg-slate-900/30' : 'border-slate-200 hover:border-amber-500/40 bg-slate-50/50'
                      }`}>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                if (typeof reader.result === 'string') {
                                  setAdminPic(reader.result);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="absolute inset-0 opacity-0 cursor-pointer z-10"
                        />
                        <div className="space-y-1">
                          <Plus className="w-5 h-5 text-slate-400 mx-auto" />
                          <p className="text-xs font-bold text-slate-400">{language === 'ar' ? 'رفع صورة شخصية جديدة للمدير' : 'Upload new direct admin avatar image'}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-amber-500/5 p-3.5 rounded-xl border border-amber-500/10 leading-relaxed text-[10px] text-slate-400">
                    👥 <span className="font-bold text-slate-300">{language === 'ar' ? 'التحقق:' : 'Validation:'}</span> {language === 'ar' ? 'سيتم استخدام كلمة سر الدخول الجديدة فور تسجيل الخروج، وتحديث الهوية المكتوبة لاسم كابتن الصالة في كل الأقسام فوراً!' : 'New password and admin name are active immediately.'}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT MEMBER */}
      {showMemberModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 space-y-4 max-h-[90%] overflow-y-auto" style={{ direction: "rtl" }}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-slate-100">
                {editingMember ? `تعديل بيانات المشترك: ${editingMember.name}` : "تسجيل مشترك جديد بالنادي"}
              </h3>
              <button onClick={resetMemberForm} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleMemberSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1.5">الاسم الكامل للمشترك</label>
                  <input 
                    type="text" 
                    required
                    value={memName}
                    onChange={(e) => setMemName(e.target.value)}
                    placeholder="أحمد علي..."
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1.5">رقم الهاتف (جوال)</label>
                  <input 
                    type="text" 
                    required
                    value={memPhone}
                    onChange={(e) => setMemPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono text-right focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1.5">البريد الإلكتروني</label>
                  <input 
                    type="email" 
                    required
                    value={memEmail}
                    onChange={(e) => setMemEmail(e.target.value)}
                    placeholder="ahmed@example.com"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1.5">هدف اللياقة البدنية</label>
                  <select 
                    value={memGoal}
                    onChange={(e) => setMemGoal(e.target.value as any)}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="لياقة">لياقة بدنية وصحة</option>
                    <option value="تنشيف">تنشيف وخسارة دهون</option>
                    <option value="تضخيم">تضخيم وبناء عضلات</option>
                  </select>
                </div>
              </div>

              {/* Gender & Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1.5">الجنس (لتخصيص الطابع والتمييز)</label>
                  <select 
                    value={memGender}
                    onChange={(e) => setMemGender(e.target.value as 'ذكر' | 'أنثى')}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500 font-bold"
                  >
                    <option value="ذكر">ذكر ♂</option>
                    <option value="أنثى">أنثى ♀</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1.5">تعيين كلمة مرور المشترك</label>
                  <input 
                    type="text" 
                    value={memPassword}
                    onChange={(e) => setMemPassword(e.target.value)}
                    placeholder="فارغة لتعيين آخر 4 أرقام من هاتفه تلقائياً"
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Physical measurements */}
              <div className="bg-slate-950/40 p-3 rounded-xl border border-slate-800 grid grid-cols-4 gap-2">
                <div className="col-span-4 text-[9px] font-bold text-slate-400 mb-1">📐 القياسات البدنية الأولية للعضو:</div>
                <div>
                  <label className="block text-[9px] text-slate-400 mb-1 text-center">الطول (سم)</label>
                  <input 
                    type="number" 
                    required
                    value={memHeight}
                    onChange={(e) => setMemHeight(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-750 rounded-lg p-1.5 text-xs text-slate-100 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 mb-1 text-center">الوزن (كجم)</label>
                  <input 
                    type="number" 
                    required
                    value={memWeight}
                    onChange={(e) => setMemWeight(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-750 rounded-lg p-1.5 text-xs text-slate-100 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 mb-1 text-center">الدهون (%)</label>
                  <input 
                    type="number" 
                    required
                    value={memFat}
                    onChange={(e) => setMemFat(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-750 rounded-lg p-1.5 text-xs text-slate-100 font-mono text-center"
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-slate-400 mb-1 text-center">العضلات (%)</label>
                  <input 
                    type="number" 
                    required
                    value={memMuscle}
                    onChange={(e) => setMemMuscle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-750 rounded-lg p-1.5 text-xs text-slate-100 font-mono text-center"
                  />
                </div>
              </div>

              {/* Subscription setup (only when creating) */}
              {!editingMember && (
                <div className="bg-amber-500/5 p-3 rounded-xl border border-amber-500/10 grid grid-cols-2 gap-2">
                  <div className="col-span-2 text-[9px] font-bold text-amber-500 mb-1">⏳ إعداد الاشتراك الأول التلقائي:</div>
                  <div>
                    <label className="block text-[9px] text-slate-400 mb-1">نوع باقة الاشتراك</label>
                    <select 
                      value={memSubType}
                      onChange={(e) => setMemSubType(e.target.value as any)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg p-1.5 text-xs text-slate-100"
                    >
                      <option value="جيم">حديد ولياقة (جيم) - 299 د.أ</option>
                      <option value="شامل">الاشتراك الشامل + مسبح - 499 د.أ</option>
                      <option value="مسبح">المسبح الأولمبي فقط - 250 د.أ</option>
                      <option value="ملاكمة">ملاكمة وكيك بوكسينغ - 350 د.أ</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[9px] text-slate-400 mb-1">فترة تفعيل الاشتراك</label>
                    <select 
                      value={memSubDuration}
                      onChange={(e) => setMemSubDuration(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-750 rounded-lg p-1.5 text-xs text-slate-100"
                    >
                      <option value="7">7 أيام (تجريبي)</option>
                      <option value="30">30 يوم (شهر كامل)</option>
                      <option value="90">90 يوم (3 أشهر)</option>
                    </select>
                  </div>
                </div>
              )}

              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-colors"
              >
                {editingMember ? "تحديث بيانات المشترك" : "تأكيد تسجيل العضو وافتتاح الاشتراك"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD SERVICE */}
      {showServiceModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4" style={{ direction: "rtl" }}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-slate-100">
                {editingService ? "تعديل تفاصيل الخدمة" : "إضافة مرفق/خدمة جديدة للنادي"}
              </h3>
              <button onClick={() => setShowServiceModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleServiceSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">عنوان الخدمة أو المرفق</label>
                <input 
                  type="text" 
                  required
                  value={srvTitle}
                  onChange={(e) => setSrvTitle(e.target.value)}
                  placeholder="مثال: حلبة الملاكمة والقتال"
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">شرح ووصف الخدمة بالتفصيل</label>
                <textarea 
                  required
                  value={srvDesc}
                  onChange={(e) => setSrvDesc(e.target.value)}
                  placeholder="اكتب وصفاً جذاباً للأعضاء لكي يظهر في تطبيقهم..."
                  rows={3}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">السعر الفردي أو رسوم الحجز ({language === 'ar' ? 'د.أ' : 'JOD'})</label>
                <input 
                  type="number" 
                  required
                  value={srvPrice}
                  onChange={(e) => setSrvPrice(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 font-mono text-right focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">صورة توضيحية للخدمة</label>
                <input 
                  type="text" 
                  value={srvImage.startsWith('data:image') ? '' : srvImage}
                  onChange={(e) => setSrvImage(e.target.value)}
                  placeholder="https://example.com/image.png..."
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 mb-2 focus:outline-none focus:border-amber-500"
                />
                <div className={`relative border border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
                  theme === 'dark' ? 'border-slate-700 bg-slate-900/30 hover:border-amber-500/40' : 'border-slate-300 bg-slate-50/50 hover:border-amber-500/40'
                }`}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            setSrvImage(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px] text-slate-400 font-bold">
                    {srvImage ? "🟢 تم اختيار ملف الصورة بنجاح" : "📁 أو اختر ملف صورة لرفعه مباشرة"}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-colors"
              >
                {editingService ? "تحديث الخدمة" : "حفظ ونشر الخدمة للأعضاء"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD/EDIT OFFER */}
      {showOfferModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 space-y-4" style={{ direction: "rtl" }}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <h3 className="text-sm font-black text-slate-100">
                {editingOffer ? "تعديل بيانات العرض الترويجي" : "إنشاء عرض خصم ترويجي جديد"}
              </h3>
              <button onClick={() => setShowOfferModal(false)} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleOfferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">عنوان العرض</label>
                <input 
                  type="text" 
                  required
                  value={offTitle}
                  onChange={(e) => setOffTitle(e.target.value)}
                  placeholder="مثال: خصم الصيف المذهل المشتركين"
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">تفاصيل العرض ووصفه</label>
                <textarea 
                  required
                  value={offDesc}
                  onChange={(e) => setOffDesc(e.target.value)}
                  placeholder="تفاصيل العرض وقوانينه..."
                  rows={3}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">نسبة/قيمة الخصم</label>
                  <input 
                    type="text" 
                    required
                    value={offDiscount}
                    onChange={(e) => setOffDiscount(e.target.value)}
                    placeholder={language === 'ar' ? 'مثال: 25% أو 10 د.أ' : 'e.g. 25% or 10 JOD'}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs text-slate-400 mb-1.5">حالة العرض فور النشر</label>
                  <select 
                    value={offActive ? "true" : "false"}
                    onChange={(e) => setOffActive(e.target.value === "true")}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="true">نشط (يعرض حالياً بالتطبيق)</option>
                    <option value="false">مسودة (غير معروض)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">صورة جذابة للعرض الترويجي</label>
                <input 
                  type="text" 
                  value={offImage.startsWith('data:image') ? '' : offImage}
                  onChange={(e) => setOffImage(e.target.value)}
                  placeholder="https://example.com/offer.png..."
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 mb-2 focus:outline-none focus:border-amber-500"
                />
                <div className={`relative border border-dashed rounded-xl p-3 text-center cursor-pointer transition-colors ${
                  theme === 'dark' ? 'border-slate-700 bg-slate-900/30 hover:border-amber-500/40' : 'border-slate-300 bg-slate-50/50 hover:border-amber-500/40'
                }`}>
                  <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          if (typeof reader.result === 'string') {
                            setOffImage(reader.result);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <span className="text-[10px] text-slate-400 font-bold">
                    {offImage ? "🟢 تم اختيار ملف الصورة بنجاح" : "📁 أو اختر ملف صورة لرفعه مباشرة"}
                  </span>
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-colors"
              >
                {editingOffer ? "تحديث العرض" : "تأكيد ونشر العرض للأعضاء"}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: ADD PROGRESS LOG */}
      {showLogModal && selectedLogMember && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ direction: "rtl" }}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-amber-500 font-bold">تسجيل قياسات اللياقة</span>
                <h3 className="text-sm font-black text-slate-100">{selectedLogMember.name}</h3>
              </div>
              <button onClick={() => { setSelectedLogMember(null); setShowLogModal(false); }} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleLogSubmit} className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 text-center">الوزن الحالي</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    required
                    value={logWeight}
                    onChange={(e) => setLogWeight(e.target.value)}
                    placeholder={selectedLogMember.weight.toString()}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2 text-xs text-slate-100 text-center font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 text-center">الدهون (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    required
                    value={logFat}
                    onChange={(e) => setLogFat(e.target.value)}
                    placeholder={selectedLogMember.fat.toString()}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2 text-xs text-slate-100 text-center font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-1 text-center">العضلات (%)</label>
                  <input 
                    type="number" 
                    step="0.1" 
                    required
                    value={logMuscle}
                    onChange={(e) => setLogMuscle(e.target.value)}
                    placeholder={selectedLogMember.muscle.toString()}
                    className="w-full bg-slate-850 border border-slate-700 rounded-xl p-2 text-xs text-slate-100 text-center font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/30 p-2.5 rounded-xl border border-slate-800">
                💡 <span className="font-bold text-slate-300">ملاحظة:</span> هذا سيحدث ملف تتبع التقدم الرياضي والرسوم البيانية وتأثيرات كابتن حُصين الذكي فوراً للمشترك!
              </div>

              <button 
                type="submit"
                className="w-full bg-amber-500 hover:bg-amber-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-colors"
              >
                تحديث القياسات البدنية وحفظ التقدم
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: RENEW MEMBERSHIP */}
      {showRenewModal && selectedRenewMember && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 space-y-4" style={{ direction: "rtl" }}>
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div>
                <span className="text-[10px] text-emerald-400 font-bold">تجديد اشتراك العضو</span>
                <h3 className="text-sm font-black text-slate-100">{selectedRenewMember.name}</h3>
              </div>
              <button onClick={() => { setSelectedRenewMember(null); setShowRenewModal(false); }} className="text-slate-400 hover:text-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleRenewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-400 mb-1.5">باقة تجديد الاشتراك</label>
                <select 
                  value={renewType}
                  onChange={(e) => setRenewType(e.target.value as any)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="جيم">حديد ولياقة (جيم) - 299 د.أ</option>
                  <option value="شامل">الاشتراك الشامل + مسبح - 499 د.أ</option>
                  <option value="مسبح">المسبح الأولمبي فقط - 250 د.أ</option>
                  <option value="ملاكمة">ملاكمة وكيك بوكسينغ - 350 د.أ</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-slate-400 mb-1.5">مدة التجديد والامتداد</label>
                <select 
                  value={renewDuration}
                  onChange={(e) => setRenewDuration(e.target.value)}
                  className="w-full bg-slate-850 border border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                >
                  <option value="7">7 أيام (تنشيط سريع)</option>
                  <option value="30">30 يوم (شهر كامل)</option>
                  <option value="90">90 يوم (3 أشهر ممتدة)</option>
                </select>
              </div>

              <div className="text-[10px] text-slate-400 leading-relaxed bg-slate-950/30 p-2.5 rounded-xl border border-slate-800">
                ⚠️ ستجعل هذه العملية جميع الاشتراكات القديمة منتهية وتنشئ اشتراكاً فعالاً يبدأ من تاريخ اليوم لسهولة الحساب التلقائي للأيام المتبقية!
              </div>

              <button 
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-black py-2.5 rounded-xl text-xs transition-colors"
              >
                تأكيد تجديد باقة الاشتراك وتنشيط الأيام
              </button>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM CONFIRMATION MODAL */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-md z-[100] flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-sm rounded-2xl p-6 space-y-4 shadow-2xl shadow-rose-500/5 animate-in fade-in zoom-in duration-200" style={{ direction: language === 'ar' ? 'rtl' : 'ltr' }}>
            <div className="flex items-center gap-3 text-rose-500 pb-2 border-b border-slate-800">
              <span className="text-2xl">⚠️</span>
              <h3 className="text-sm font-black text-slate-100">{confirmTitle}</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">{confirmMessage}</p>
            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => {
                  if (onConfirm) onConfirm();
                  setShowConfirmModal(false);
                  setOnConfirm(null);
                }}
                className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-black py-2.5 rounded-xl text-xs transition-colors shadow-lg shadow-rose-500/10"
              >
                {language === 'ar' ? 'نعم، تأكيد الحذف' : 'Yes, Delete'}
              </button>
              <button
                onClick={() => {
                  setShowConfirmModal(false);
                  setOnConfirm(null);
                }}
                className="flex-1 bg-slate-800 hover:bg-slate-750 text-slate-300 font-bold py-2.5 rounded-xl text-xs border border-slate-700/50 transition-colors"
              >
                {language === 'ar' ? 'تراجع' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
