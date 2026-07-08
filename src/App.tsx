import React, { useState, useEffect } from "react";
import { 
  Dumbbell, Smartphone, LayoutDashboard, Sparkles, Activity, ShieldCheck, 
  BookOpen, HelpCircle, ArrowRightLeft, Info, CalendarCheck, PhoneCall,
  Globe, Sun, Moon, Check, X, Laptop
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Member, Subscription, ProgressLog, ClubService, Booking, ClubOffer,
  AttendanceLog, FitnessChallenge, ChallengeProgress, BarItem, BarOrder,
  PushNotification, ClubHours
} from "./types";
import PhoneSimulator from "./components/PhoneSimulator";
import AdminDashboard from "./components/AdminDashboard";
import LandingPage from "./components/LandingPage";
import { translations } from "./utils/translations";
import { supabase } from "./lib/supabase";

// Preseeded database is initialized directly in the startup useEffect if empty.

export default function App() {
  // Database States loaded from LocalStorage
  const [members, setMembers] = useState<Member[]>([]);
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [progressLogs, setProgressLogs] = useState<ProgressLog[]>([]);
  const [services, setServices] = useState<ClubService[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [offers, setOffers] = useState<ClubOffer[]>([]);

  // 🌟 NEW Smart States
  const [attendanceLogs, setAttendanceLogs] = useState<AttendanceLog[]>([]);
  const [fitnessChallenges, setFitnessChallenges] = useState<FitnessChallenge[]>([]);
  const [challengeProgresses, setChallengeProgresses] = useState<ChallengeProgress[]>([]);
  const [barItems, setBarItems] = useState<BarItem[]>([]);
  const [barOrders, setBarOrders] = useState<BarOrder[]>([]);

  // 🕒 Club Shift Hours State (Women: 8:00 AM - 3:00 PM, Men: 3:00 PM - 1:00 AM by default)
  const [clubHours, setClubHours] = useState<ClubHours>(() => {
    const cached = localStorage.getItem("al_huson_club_hours");
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { }
    }
    return {
      womenStart: "08:00",
      womenEnd: "15:00",
      menStart: "15:00",
      menEnd: "01:00"
    };
  });

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem("al_huson_club_hours", JSON.stringify(clubHours));
  }, [clubHours]);

  // 🔔 Push Notifications State
  const [notifications, setNotifications] = useState<PushNotification[]>(() => {
    const cached = localStorage.getItem("al_huson_notifications");
    if (cached) {
      try { return JSON.parse(cached); } catch (e) { }
    }
    return [
      {
        id: "not-1",
        memberId: "all",
        title: "مواعيد الدوام لفترة النساء والرجال 🕒",
        message: "نود تذكيركم بمواعيد النادي: فترة النساء من 8:00 صباحاً حتى 3:00 عصراً، وفترة الرجال من 3:00 عصراً حتى 1:00 بعد منتصف الليل. أهلاً بكم!",
        createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
        type: "announcement",
        read: false
      },
      {
        id: "not-2",
        memberId: "all",
        title: "خصومات الصيف الكبرى بدأت! 🔥",
        message: "احصل على خصم 20% عند تجديد الاشتراك الشامل لمدة 3 شهور. العرض ساري حتى نهاية الأسبوع الحالي فقط!",
        createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
        type: "offer",
        read: false
      }
    ];
  });

  useEffect(() => {
    localStorage.setItem("al_huson_notifications", JSON.stringify(notifications));
  }, [notifications]);

  // Simulator Layout: 'phone' | 'pc' | 'admin'
  const [layoutMode, setLayoutMode] = useState<'phone' | 'pc' | 'admin'>('pc');

  // Currently active member loaded inside Phone simulator
  const [activeMember, setActiveMember] = useState<Member | null>(null);

  // 🌍 Theme and Language States
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [showInstallModal, setShowInstallModal] = useState(false);
  const [installSuccessMessage, setInstallSuccessMessage] = useState("");

  const [clubName, setClubName] = useState<string>(() => {
    return localStorage.getItem("al_huson_club_name") || "نادي الحصن الرياضي";
  });
  const [clubLogo, setClubLogo] = useState<string>(() => {
    return localStorage.getItem("al_huson_club_logo") || "🏰";
  });
  const [loginBgImage, setLoginBgImage] = useState<string>(() => {
    return localStorage.getItem("al_huson_login_bg") || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=400";
  });

  const handleUpdateClubInfo = (name: string, logo: string, bgImage?: string) => {
    setClubName(name);
    localStorage.setItem("al_huson_club_name", name);
    setClubLogo(logo);
    localStorage.setItem("al_huson_club_logo", logo);
    if (bgImage !== undefined) {
      setLoginBgImage(bgImage);
      localStorage.setItem("al_huson_login_bg", bgImage);
    }
  };

  const toggleTheme = () => {
    setTheme('dark');
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'ar' ? 'en' : 'ar');
  };

  // 🔔 Central Admin Notifications & Sound Alert states
  const [adminNotificationBadge, setAdminNotificationBadge] = useState(0);
  const [lastNotificationMessage, setLastNotificationMessage] = useState<string | null>(null);

  const prevMembersCount = React.useRef<number | null>(null);
  const prevBookingsCount = React.useRef<number | null>(null);
  const prevBarOrdersCount = React.useRef<number | null>(null);

  const playNotificationSound = () => {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const now = ctx.currentTime;
      
      // Dual-tone high pitch chime
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.1); // A5
      gain1.gain.setValueAtTime(0.12, now);
      gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
      
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.4);
      
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(880, now + 0.08); // A5
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.2); // D6
      gain2.gain.setValueAtTime(0, now);
      gain2.gain.setValueAtTime(0.12, now + 0.08);
      gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
      
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + 0.08);
      osc2.stop(now + 0.5);
    } catch (e) {
      console.error("Failed to play notification sound:", e);
    }
  };

  useEffect(() => {
    // If lists aren't loaded or seeded yet, skip setup
    if (members.length === 0 && bookings.length === 0 && barOrders.length === 0) {
      return;
    }

    // Set initial counts on first actual load
    if (prevMembersCount.current === null) {
      prevMembersCount.current = members.length;
      prevBookingsCount.current = bookings.length;
      prevBarOrdersCount.current = barOrders.length;
      return;
    }

    let hasNew = false;
    let message = "";

    // 1. Check for newly registered member requests (قيد الانتظار)
    if (members.length > prevMembersCount.current) {
      const latestMember = members[members.length - 1];
      if (latestMember && latestMember.status === 'قيد الانتظار') {
        hasNew = true;
        message = language === 'ar' 
          ? `طلب اشتراك جديد من العضو ${latestMember.name}! 🏋️‍♂️` 
          : `New membership request from ${latestMember.name}! 🏋️‍♂️`;
      }
    }

    // 2. Check for newly added booking requests (قيد الانتظار)
    if (bookings.length > prevBookingsCount.current) {
      const latestBooking = bookings[bookings.length - 1];
      if (latestBooking && latestBooking.status === 'قيد الانتظار') {
        hasNew = true;
        message = language === 'ar' 
          ? `حجز جديد للعبة ${latestBooking.serviceName} من قبل ${latestBooking.memberName}! 📅` 
          : `New booking request for ${latestBooking.serviceName} by ${latestBooking.memberName}! 📅`;
      }
    }

    // 3. Check for newly placed bar orders (newest are placed at first index 0)
    if (barOrders.length > prevBarOrdersCount.current) {
      const latestOrder = barOrders[0];
      if (latestOrder) {
        hasNew = true;
        message = language === 'ar' 
          ? `طلب بوفيه بروتين جديد بقيمة ${latestOrder.totalPointsCost} نقطة! 🥤` 
          : `New protein bar order placed for ${latestOrder.totalPointsCost} points! 🥤`;
      }
    }

    if (hasNew) {
      playNotificationSound();
      setAdminNotificationBadge(prev => prev + 1);
      setLastNotificationMessage(message);
      
      // Auto-clear notification alert popup after 6s
      const timer = setTimeout(() => {
        setLastNotificationMessage(null);
      }, 6000);
      return () => clearTimeout(timer);
    }

    // Keep refs in sync
    prevMembersCount.current = members.length;
    prevBookingsCount.current = bookings.length;
    prevBarOrdersCount.current = barOrders.length;
  }, [members, bookings, barOrders, language]);

  // Dynamically set layout mode based on screen width on load
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setLayoutMode('phone');
      } else {
        setLayoutMode('pc');
      }
    };
    
    // Set initial layout
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Load and seed database from Supabase
  useEffect(() => {
    const loadAllData = async () => {
      try {
        if (!supabase) return;
        const [
          { data: mList, error: mErr },
          { data: sList, error: sErr },
          { data: lList, error: lErr },
          { data: srvList, error: srvErr },
          { data: bList, error: bErr },
          { data: oList, error: oErr },
          { data: attList, error: attErr },
          { data: chalList, error: chalErr },
          { data: chalProgList, error: chalProgErr },
          { data: barIList, error: barIErr },
          { data: barOList, error: barOErr }
        ] = await Promise.all([
          supabase.from("members").select("*"),
          supabase.from("subscriptions").select("*"),
          supabase.from("progress_logs").select("*"),
          supabase.from("club_services").select("*"),
          supabase.from("bookings").select("*"),
          supabase.from("club_offers").select("*"),
          supabase.from("attendance_logs").select("*"),
          supabase.from("fitness_challenges").select("*"),
          supabase.from("challenge_progresses").select("*"),
          supabase.from("bar_items").select("*"),
          supabase.from("bar_orders").select("*")
        ]);

        if (mErr) throw mErr;
        if (sErr) throw sErr;
        if (lErr) throw lErr;
        if (srvErr) throw srvErr;
        if (bErr) throw bErr;
        if (oErr) throw oErr;
        if (attErr) throw attErr;
        if (chalErr) throw chalErr;
        if (chalProgErr) throw chalProgErr;
        if (barIErr) throw barIErr;
        if (barOErr) throw barOErr;

        if (!mList || mList.length === 0) {
          console.log("Supabase database seems empty, seeding initial values...");
          const { 
            initialMembers, 
            initialSubscriptions, 
            initialProgressLogs, 
            initialServices, 
            initialOffers, 
            initialBookings, 
            initialChallenges, 
            initialBarItems, 
            initialChallengeProgresses, 
            initialAttendanceLogs, 
            initialBarOrders 
          } = await import("./utils/seedData");

          const mSeed = initialMembers;
          const sSeed = initialSubscriptions(mSeed[0].id, mSeed[1].id, mSeed[2].id);
          const lSeed = initialProgressLogs(mSeed[0].id, mSeed[1].id, mSeed[2].id);
          const bSeed = initialBookings(mSeed[0].id);
          const attSeed = initialAttendanceLogs(mSeed[0].id, mSeed[1].id);
          const chalProgSeed = initialChallengeProgresses(mSeed[0].id, mSeed[1].id, mSeed[2].id);
          const ordersSeed = initialBarOrders(mSeed[0].id);

          await Promise.all([
            supabase.from("members").insert(mSeed),
            supabase.from("subscriptions").insert(sSeed),
            supabase.from("progress_logs").insert(lSeed),
            supabase.from("club_services").insert(initialServices),
            supabase.from("bookings").insert(bSeed),
            supabase.from("club_offers").insert(initialOffers),
            supabase.from("attendance_logs").insert(attSeed),
            supabase.from("fitness_challenges").insert(initialChallenges),
            supabase.from("challenge_progresses").insert(chalProgSeed),
            supabase.from("bar_items").insert(initialBarItems),
            supabase.from("bar_orders").insert(ordersSeed)
          ]);

          setMembers(mSeed);
          setSubscriptions(sSeed);
          setProgressLogs(lSeed);
          setServices(initialServices);
          setBookings(bSeed);
          setOffers(initialOffers);
          setAttendanceLogs(attSeed);
          setFitnessChallenges(initialChallenges);
          setChallengeProgresses(chalProgSeed);
          setBarItems(initialBarItems);
          setBarOrders(ordersSeed);
        } else {
          setMembers(mList);
          setSubscriptions(sList || []);
          setProgressLogs(lList || []);
          setServices(srvList || []);
          setBookings(bList || []);
          setOffers(oList || []);
          setAttendanceLogs(attList || []);
          setFitnessChallenges(chalList || []);
          setChallengeProgresses(chalProgList || []);
          setBarItems(barIList || []);
          setBarOrders(barOList || []);
        }
      } catch (err) {
        console.error("Failed to load from Supabase, seeding in-memory:", err);
        try {
          const { 
            initialMembers, 
            initialSubscriptions, 
            initialProgressLogs, 
            initialServices, 
            initialOffers, 
            initialBookings, 
            initialChallenges, 
            initialBarItems, 
            initialChallengeProgresses, 
            initialAttendanceLogs, 
            initialBarOrders 
          } = await import("./utils/seedData");

          const mList = initialMembers;
          setMembers(mList);
          setSubscriptions(initialSubscriptions(mList[0].id, mList[1].id, mList[2].id));
          setProgressLogs(initialProgressLogs(mList[0].id, mList[1].id, mList[2].id));
          setServices(initialServices);
          setBookings(initialBookings(mList[0].id));
          setOffers(initialOffers);
          setAttendanceLogs(initialAttendanceLogs(mList[0].id, mList[1].id));
          setFitnessChallenges(initialChallenges);
          setChallengeProgresses(initialChallengeProgresses(mList[0].id, mList[1].id, mList[2].id));
          setBarItems(initialBarItems);
          setBarOrders(initialBarOrders(mList[0].id));
        } catch (innerErr) {
          console.error("Critical fallback failure:", innerErr);
        }
      }
    };

    loadAllData();
  }, []);

  // Helper selectors
  useEffect(() => {
    // Default logged in user to Ahmed الشوبكي for instant split-screen preview fun!
    if (members.length > 0 && !activeMember) {
      setActiveMember(members[0]);
    }
  }, [members]);

  // DB Manipulation Actions
  const handleRegisterMember = async (newMember: Member, subType: 'جيم' | 'شامل' | 'مسبح' | 'ملاكمة') => {
    const memberWithPending = {
      ...newMember,
      status: 'قيد الانتظار' as const,
      pendingSubType: subType
    };
    setMembers(prev => [...prev, memberWithPending]);
    setActiveMember(memberWithPending);

    if (supabase) {
      await supabase.from("members").insert([memberWithPending]);
    }
  };

  const handleApproveMember = async (memberId: string) => {
    const targetMember = members.find(m => m.id === memberId);
    if (!targetMember) return;

    const updatedMembers = members.map(m => {
      if (m.id === memberId) {
        return { ...m, status: 'نشط' as const };
      }
      return m;
    });

    const newLog: ProgressLog = {
      id: "log-" + Math.random().toString(36).substring(2, 11),
      memberId: memberId,
      weight: targetMember.weight,
      fat: targetMember.fat,
      muscle: targetMember.muscle,
      date: new Date().toISOString().split('T')[0]
    };
    const updatedProgressLogs = [...progressLogs, newLog];

    const durationDays = 30;
    const start = new Date();
    const end = new Date();
    end.setDate(start.getDate() + durationDays);

    const subType = targetMember.pendingSubType || 'جيم';
    const subPrice = subType === 'شامل' ? 499 : subType === 'جيم' ? 299 : subType === 'مسبح' ? 250 : 350;

    const newSub: Subscription = {
      id: "sub-" + Math.random().toString(36).substring(2, 11),
      memberId: memberId,
      type: subType,
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0],
      status: 'فعال',
      price: subPrice
    };
    const updatedSubscriptions = [...subscriptions, newSub];

    setMembers(updatedMembers);
    setProgressLogs(updatedProgressLogs);
    setSubscriptions(updatedSubscriptions);

    if (activeMember && activeMember.id === memberId) {
      setActiveMember({ ...targetMember, status: 'نشط' });
    }

    if (supabase) {
      await Promise.all([
        supabase.from("members").update({ status: 'نشط' }).eq("id", memberId),
        supabase.from("progress_logs").insert([newLog]),
        supabase.from("subscriptions").insert([newSub])
      ]);
    }
  };

  const handleAddMember = async (m: Member) => {
    setMembers(prev => [...prev, m]);
    if (supabase) {
      await supabase.from("members").insert([m]);
    }
  };

  const handleUpdateMember = async (m: Member) => {
    setMembers(prev => prev.map(item => item.id === m.id ? m : item));
    if (activeMember && activeMember.id === m.id) {
      setActiveMember(m);
    }
    if (supabase) {
      await supabase.from("members").update(m).eq("id", m.id);
    }
  };

  const handleDeleteMember = async (id: string) => {
    const updatedM = members.filter(item => item.id !== id);
    setMembers(updatedM);
    setSubscriptions(prev => prev.filter(item => item.memberId !== id));
    setProgressLogs(prev => prev.filter(item => item.memberId !== id));
    setBookings(prev => prev.filter(item => item.memberId !== id));
    if (activeMember && activeMember.id === id) {
      setActiveMember(updatedM[0] || null);
    }
    if (supabase) {
      await supabase.from("members").delete().eq("id", id);
    }
  };

  const handleAddSubscription = async (s: Subscription) => {
    setSubscriptions(prev => [...prev, s]);
    if (supabase) {
      await supabase.from("subscriptions").insert([s]);
    }
  };

  const handleUpdateSubscription = async (s: Subscription) => {
    setSubscriptions(prev => prev.map(item => item.id === s.id ? s : item));
    if (supabase) {
      await supabase.from("subscriptions").update(s).eq("id", s.id);
    }
  };

  const handleAddProgressLog = async (l: ProgressLog) => {
    setProgressLogs(prev => [...prev, l]);
    if (supabase) {
      await supabase.from("progress_logs").insert([l]);
    }
  };

  const handleAddService = async (s: ClubService) => {
    setServices(prev => [...prev, s]);
    if (supabase) {
      await supabase.from("club_services").insert([s]);
    }
  };

  const handleUpdateService = async (s: ClubService) => {
    setServices(prev => prev.map(item => item.id === s.id ? s : item));
    if (supabase) {
      await supabase.from("club_services").update(s).eq("id", s.id);
    }
  };

  const handleDeleteService = async (id: string) => {
    setServices(prev => prev.filter(item => item.id !== id));
    if (supabase) {
      await supabase.from("club_services").delete().eq("id", id);
    }
  };

  const handleAddOffer = async (o: ClubOffer) => {
    setOffers(prev => [...prev, o]);
    if (supabase) {
      await supabase.from("club_offers").insert([o]);
    }
  };

  const handleUpdateOffer = async (o: ClubOffer) => {
    setOffers(prev => prev.map(item => item.id === o.id ? o : item));
    if (supabase) {
      await supabase.from("club_offers").update(o).eq("id", o.id);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    setOffers(prev => prev.filter(item => item.id !== id));
    if (supabase) {
      await supabase.from("club_offers").delete().eq("id", id);
    }
  };

  const handleAddBooking = async (b: Booking) => {
    setBookings(prev => [...prev, b]);
    if (supabase) {
      await supabase.from("bookings").insert([b]);
    }
  };

  const handleSendNotification = async (title: string, message: string, type: PushNotification['type'], memberId: string = 'all') => {
    const newNotification: PushNotification = {
      id: "not-" + Math.random().toString(36).substr(2, 9),
      memberId,
      title,
      message,
      createdAt: new Date().toISOString(),
      type,
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Dispatch custom event for real-time simulator banner toast
    if (memberId === 'all' || (activeMember && activeMember.id === memberId)) {
      const event = new CustomEvent('push_notification_received', { detail: newNotification });
      window.dispatchEvent(event);
    }

    if (supabase) {
      try {
        await supabase.from("notifications").insert([newNotification]);
      } catch (err) {
        console.error("Failed to insert notification into Supabase:", err);
      }
    }
  };

  const handleUpdateBookingStatus = async (id: string, status: 'تم القبول' | 'تم الرفض') => {
    setBookings(prev => prev.map(item => item.id === id ? { ...item, status } : item));
    
    // Find booking to trigger notification
    const booking = bookings.find(b => b.id === id);
    if (booking) {
      const title = status === 'تم القبول' ? 'تم قبول حجزك بنجاح! ✅' : 'عذراً، تم الاعتذار عن الحجز ❌';
      const message = status === 'تم القبول' 
        ? `تمت الموافقة على حجزك لحصة (${booking.serviceName}) في موعد ${booking.date} الساعة ${booking.time}. بانتظارك يا بطل!` 
        : `نعتذر منك، لم نتمكن من قبول حجزك لحصة (${booking.serviceName}) في موعد ${booking.date} الساعة ${booking.time}. يرجى اختيار موعد آخر أو مراجعة الكابتن.`;
      
      handleSendNotification(title, message, 'booking_status', booking.memberId);
    }

    if (supabase) {
      await supabase.from("bookings").update({ status }).eq("id", id);
    }
  };

  const handleScanQR = async (memberId: string) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0].substring(0, 5); // HH:MM
    const dateStr = now.toISOString().split('T')[0];

    const newLog: AttendanceLog = {
      id: `att-${Date.now()}`,
      memberId,
      memberName: member.name,
      date: dateStr,
      time: timeStr,
      method: "مسح الرمز QR"
    };

    const originalPoints = member.points || 0;
    const newPoints = originalPoints + 10;
    const updatedMember = { ...member, points: newPoints };

    const updatedProgress: ChallengeProgress[] = [];
    const currentProg = challengeProgresses.map(prog => {
      if (prog.memberId === memberId) {
        const challenge = fitnessChallenges.find(c => c.id === prog.challengeId);
        if (challenge && challenge.category === "حضور" && !prog.isCompleted) {
          const newVal = prog.currentValue + 1;
          const isDone = newVal >= challenge.targetValue;
          const updatedP = {
            ...prog,
            currentValue: Math.min(newVal, challenge.targetValue),
            isCompleted: isDone
          };
          updatedProgress.push(updatedP);
          return updatedP;
        }
      }
      return prog;
    });

    setAttendanceLogs(prev => [newLog, ...prev]);
    setMembers(prev => prev.map(m => m.id === memberId ? updatedMember : m));
    if (updatedProgress.length > 0) {
      setChallengeProgresses(currentProg);
    }

    if (activeMember && activeMember.id === memberId) {
      setActiveMember(updatedMember);
    }

    if (supabase) {
      await supabase.from("attendance_logs").insert([newLog]);
      await supabase.from("members").update({ points: newPoints }).eq("id", memberId);
      for (const p of updatedProgress) {
        await supabase.from("challenge_progresses")
          .update({ currentValue: p.currentValue, isCompleted: p.isCompleted })
          .eq("id", p.id);
      }
    }
  };

  const handleClaimChallengeReward = async (memberId: string, challengeId: string) => {
    const member = members.find(m => m.id === memberId);
    const challenge = fitnessChallenges.find(c => c.id === challengeId);
    if (!member || !challenge) return;

    const progressIndex = challengeProgresses.findIndex(p => p.memberId === memberId && p.challengeId === challengeId);
    if (progressIndex === -1) return;

    const progress = challengeProgresses[progressIndex];
    if (!progress.isCompleted) return;

    const reward = challenge.pointsReward;
    const updatedMember = { ...member, points: (member.points || 0) + reward };

    const resetProg = {
      ...progress,
      currentValue: 0,
      isCompleted: false
    };

    setMembers(prev => prev.map(m => m.id === memberId ? updatedMember : m));
    setChallengeProgresses(prev => prev.map((p, idx) => idx === progressIndex ? resetProg : p));

    if (activeMember && activeMember.id === memberId) {
      setActiveMember(updatedMember);
    }

    if (supabase) {
      await Promise.all([
        supabase.from("members").update({ points: updatedMember.points }).eq("id", memberId),
        supabase.from("challenge_progresses").update({ currentValue: 0, isCompleted: false }).eq("id", progress.id)
      ]);
    }
  };

  const handlePlaceBarOrder = async (order: BarOrder) => {
    const member = members.find(m => m.id === order.memberId);
    if (!member) return;

    const updatedPoints = Math.max(0, (member.points || 0) - order.totalPointsCost);
    const updatedMember = { ...member, points: updatedPoints };

    setMembers(prev => prev.map(m => m.id === order.memberId ? updatedMember : m));
    setBarOrders(prev => [order, ...prev]);

    if (activeMember && activeMember.id === order.memberId) {
      setActiveMember(updatedMember);
    }

    if (supabase) {
      await Promise.all([
        supabase.from("members").update({ points: updatedPoints }).eq("id", order.memberId),
        supabase.from("bar_orders").insert([order])
      ]);
    }
  };

  const handleUpdateBarOrderStatus = async (orderId: string, status: 'قيد التحضير' | 'جاهز للاستلام' | 'تم التسليم') => {
    setBarOrders(prev => prev.map(ord => ord.id === orderId ? { ...ord, status } : ord));
    if (supabase) {
      await supabase.from("bar_orders").update({ status }).eq("id", orderId);
    }
  };

  const handleAddPointsAdmin = async (memberId: string, pointsAmount: number) => {
    const member = members.find(m => m.id === memberId);
    if (!member) return;

    const updatedPoints = (member.points || 0) + pointsAmount;
    const updatedMember = { ...member, points: updatedPoints };

    setMembers(prev => prev.map(m => m.id === memberId ? updatedMember : m));

    if (activeMember && activeMember.id === memberId) {
      setActiveMember(updatedMember);
    }

    if (supabase) {
      await supabase.from("members").update({ points: updatedPoints }).eq("id", memberId);
    }
  };

  const t = translations[language];

  return (
    <div id="applet-root" dir={language === 'ar' ? 'rtl' : 'ltr'} className="min-h-screen font-sans flex flex-col bg-[#070a13] text-slate-100 selection:bg-[#e2b857]/30">
      
      {layoutMode === 'pc' ? (
        <div className="w-full min-h-screen bg-[#070a13]">
          <LandingPage 
            language={language}
            theme={theme}
            clubName={clubName}
            clubLogo={clubLogo}
            onToggleLanguage={toggleLanguage}
            onToggleTheme={toggleTheme}
            layoutMode={layoutMode}
            onChangeLayoutMode={setLayoutMode}
          />
        </div>
      ) : layoutMode === 'phone' ? (
        <div className="min-h-screen bg-[#070a13] flex flex-col items-center justify-start py-8 px-4 font-sans text-white relative overflow-y-auto">
          {/* Glowing starlight background details */}
          <div className="absolute inset-0 bg-[radial-gradient(#151e33_1px,transparent_1px)] [background-size:16px_16px] opacity-35 pointer-events-none"></div>
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#e2b857]/5 rounded-full blur-[130px] pointer-events-none"></div>

          {/* Switcher Pill - EXACTLY matching Screenshot 1 */}
          <div className="flex items-center bg-slate-950/80 border border-[#e2b857]/25 p-1 rounded-2xl shadow-2xl mb-8 relative z-10 select-none">
            <button 
              onClick={() => setLayoutMode('pc')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-slate-300 hover:text-white hover:bg-slate-900/60"
            >
              <Laptop className="w-3.5 h-3.5 text-slate-400" />
              <span>{language === 'ar' ? 'عرض PC' : 'PC View'}</span>
            </button>
            <button 
              onClick={() => setLayoutMode('phone')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer bg-slate-900/40 text-[#e2b857] border border-[#e2b857] font-black shadow-inner"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'عرض هاتف' : 'Phone View'}</span>
            </button>
          </div>

          {/* Centered Phone Simulator mockup */}
          <div className="relative w-full max-w-sm mx-auto drop-shadow-[0_25px_50px_rgba(0,0,0,0.7)] pb-12 relative z-10">
            <PhoneSimulator 
              members={members}
              subscriptions={subscriptions}
              progressLogs={progressLogs}
              services={services}
              bookings={bookings}
              offers={offers}
              activeMember={activeMember}
              setActiveMember={setActiveMember}
              onAddBooking={handleAddBooking}
              onAddProgressLog={handleAddProgressLog}
              attendanceLogs={attendanceLogs}
              fitnessChallenges={fitnessChallenges}
              challengeProgresses={challengeProgresses}
              barItems={barItems}
              barOrders={barOrders}
              onScanQR={handleScanQR}
              onClaimReward={handleClaimChallengeReward}
              onPlaceBarOrder={handlePlaceBarOrder}
              theme={theme}
              language={language}
              clubName={clubName}
              clubLogo={clubLogo}
              loginBgImage={loginBgImage}
              onToggleLanguage={toggleLanguage}
              onToggleTheme={toggleTheme}
              onRegisterMember={handleRegisterMember}
              isStandalone={true}
              notifications={notifications}
              setNotifications={setNotifications}
              clubHours={clubHours}
            />
          </div>
        </div>
      ) : (
        <>
          {/* Top Main Club Portal Header (for isolated Admin viewport) */}
          <header id="main-club-header" className="border-b border-[#e2b857]/15 px-6 py-4 flex flex-col lg:flex-row items-center justify-between gap-4 sticky top-0 z-50 shadow-lg bg-[#04060d] text-white">
            
            {/* Brand & Identity - Clickable to return to PC view */}
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-90 transition-opacity" onClick={() => setLayoutMode('pc')}>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#e2b857] to-[#b38a2e] text-[#070a13] flex items-center justify-center font-black shadow-xl shadow-[#e2b857]/10 shrink-0">
                <Dumbbell className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <h1 className="text-xl font-extrabold text-[#e2b857] tracking-tight flex items-center gap-1.5 flex-wrap">
                  <span>{clubName}</span>
                  <span className="text-[10px] bg-[#e2b857]/10 text-[#e2b857] px-2 py-0.5 rounded-full border border-[#e2b857]/20">{t.subTitle}</span>
                </h1>
                <p className="text-xs mt-0.5 font-light text-slate-400">{t.headerDesc}</p>
              </div>
            </div>

            {/* Viewport controls inside secondary headers */}
            <div className="flex items-center gap-3 flex-wrap">
              <button 
                onClick={() => {
                  setShowInstallModal(true);
                  setInstallSuccessMessage("");
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e2b857]/40 text-[#e2b857] hover:bg-[#e2b857]/5 text-xs font-black transition-colors cursor-pointer"
              >
                <Smartphone className="w-3.5 h-3.5 text-[#e2b857]" />
                <span>{t.installApp}</span>
              </button>



              <button 
                onClick={toggleLanguage}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-[#e2b857]/25 bg-[#070a13] text-slate-200 hover:bg-[#e2b857]/10 transition-colors text-xs font-bold cursor-pointer"
              >
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="font-mono">{language === 'ar' ? 'EN' : 'العربية'}</span>
              </button>
            </div>
          </header>

          {/* Main Interactive Work Area */}
          <main id="main-viewport-content" className="flex-1 max-w-[1500px] w-full mx-auto p-4 md:p-6 flex flex-col justify-start">
            
            <div className="w-full">
              {layoutMode === 'admin' && (
                <div className="w-full">
                  <AdminDashboard 
                    members={members}
                    subscriptions={subscriptions}
                    progressLogs={progressLogs}
                    services={services}
                    bookings={bookings}
                    offers={offers}
                    onAddMember={handleAddMember}
                    onUpdateMember={handleUpdateMember}
                    onDeleteMember={handleDeleteMember}
                    onAddSubscription={handleAddSubscription}
                    onUpdateSubscription={handleUpdateSubscription}
                    onAddProgressLog={handleAddProgressLog}
                    onAddService={handleAddService}
                    onUpdateService={handleUpdateService}
                    onDeleteService={handleDeleteService}
                    onAddOffer={handleAddOffer}
                    onUpdateOffer={handleUpdateOffer}
                    onDeleteOffer={handleDeleteOffer}
                    onUpdateBookingStatus={handleUpdateBookingStatus}
                    attendanceLogs={attendanceLogs}
                    fitnessChallenges={fitnessChallenges}
                    challengeProgresses={challengeProgresses}
                    barItems={barItems}
                    barOrders={barOrders}
                    onUpdateBarOrderStatus={handleUpdateBarOrderStatus}
                    onAddPointsAdmin={handleAddPointsAdmin}
                    onScanQRAdmin={handleScanQR}
                    clubName={clubName}
                    clubLogo={clubLogo}
                    loginBgImage={loginBgImage}
                    onUpdateClubInfo={handleUpdateClubInfo}
                    theme={theme}
                    language={language}
                    onApproveMember={handleApproveMember}
                    clubHours={clubHours}
                    onUpdateClubHours={setClubHours}
                    onSendNotification={handleSendNotification}
                    notifications={notifications}
                    notificationBadge={adminNotificationBadge}
                    onClearNotificationBadge={() => setAdminNotificationBadge(0)}
                  />
                </div>
              )}
            </div>
          </main>

          {/* Footer Info section */}
          <footer id="main-club-footer" className="bg-[#04060d] border-t border-[#e2b857]/10 py-6 text-center text-xs text-slate-500">
            <p className="font-semibold text-slate-400">© {new Date().getFullYear()} {clubName} - Al Huson Sports Club App</p>
          </footer>
        </>
      )}

      {/* 🎛️ Floating Viewport Console Selector - Perfect for Testing and Demonstration */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-[#04060d]/95 border border-[#e2b857]/30 px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-4 backdrop-blur-md">
        <span className="text-[10px] text-[#e2b857] font-extrabold tracking-widest border-r border-[#e2b857]/20 pr-4 font-sans leading-none flex items-center gap-1">
          <span>🎛️</span>
          <span>{language === 'ar' ? 'منصة المحاكاة' : 'SIMULATOR CONSOLE'}</span>
        </span>
        <div className="flex items-center gap-1.5 flex-wrap">
          <button 
            onClick={() => setLayoutMode('pc')} 
            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${layoutMode === 'pc' ? 'bg-[#e2b857] text-slate-950 font-black shadow-lg shadow-[#e2b857]/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            {language === 'ar' ? 'عرض PC فقط' : 'PC View Only'}
          </button>
          <button 
            onClick={() => setLayoutMode('phone')} 
            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${layoutMode === 'phone' ? 'bg-[#e2b857] text-slate-950 font-black shadow-lg shadow-[#e2b857]/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            {language === 'ar' ? 'عرض الهاتف فقط' : 'Mobile Only'}
          </button>
          <button 
            onClick={() => setLayoutMode('admin')} 
            className={`px-3 py-1.5 rounded-full text-[10px] font-black transition-all cursor-pointer ${layoutMode === 'admin' ? 'bg-[#e2b857] text-slate-950 font-black shadow-lg shadow-[#e2b857]/20' : 'text-slate-400 hover:text-white hover:bg-slate-900'}`}
          >
            {language === 'ar' ? 'لوحة الإدارة' : 'Admin Panel'}
          </button>
        </div>
      </div>

      {/* Real-time sound notification toast */}
      <AnimatePresence>
        {lastNotificationMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-20 left-6 z-50 max-w-sm w-full bg-slate-900/95 border border-[#e2b857]/30 shadow-2xl shadow-amber-500/10 p-4 rounded-2xl flex items-center gap-3.5 backdrop-blur-md"
          >
            <div className="w-10 h-10 rounded-xl bg-[#e2b857]/10 text-[#e2b857] border border-[#e2b857]/20 flex items-center justify-center shrink-0 text-xl">
              <motion.div
                animate={{ rotate: [0, 15, -15, 15, -15, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, repeatDelay: 1 }}
              >
                🔔
              </motion.div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-[11px] font-black uppercase text-amber-500 tracking-wider">
                {language === 'ar' ? 'إشعار إداري جديد 🚨' : 'New Admin Alert 🚨'}
              </h4>
              <p className="text-xs text-slate-300 mt-0.5 leading-snug">
                {lastNotificationMessage}
              </p>
            </div>
            <button 
              onClick={() => setLastNotificationMessage(null)}
              className="text-slate-500 hover:text-slate-300 transition-colors p-1"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
