import { 
  Member, Subscription, ProgressLog, ClubService, Booking, ClubOffer,
  AttendanceLog, FitnessChallenge, ChallengeProgress, BarItem, BarOrder 
} from "../types";

export const initialMembers: Member[] = [
  {
    id: "mem-1",
    name: "أحمد الشوبكي",
    phone: "0795551234",
    email: "ahmed@alhuson.com",
    height: 180,
    weight: 85.0,
    fat: 22.0,
    muscle: 40.0,
    goal: "تنشيف",
    createdAt: "2026-06-01",
    points: 150,
    gender: "ذكر",
    password: "1234"
  },
  {
    id: "mem-2",
    name: "سارة المومني",
    phone: "0786665678",
    email: "sara@alhuson.com",
    height: 165,
    weight: 62.0,
    fat: 28.0,
    muscle: 31.0,
    goal: "لياقة",
    createdAt: "2026-06-15",
    points: 320,
    gender: "أنثى",
    password: "1234"
  },
  {
    id: "mem-3",
    name: "محمد البطاينة",
    phone: "0777779876",
    email: "mohammad@alhuson.com",
    height: 175,
    weight: 95.0,
    fat: 31.0,
    muscle: 35.0,
    goal: "تضخيم",
    createdAt: "2026-05-20",
    points: 40,
    gender: "ذكر",
    password: "1234"
  }
];

export const initialSubscriptions = (m1Id: string, m2Id: string, m3Id: string): Subscription[] => {
  const today = new Date();
  
  const s1Start = new Date();
  s1Start.setDate(today.getDate() - 17);
  const s1End = new Date();
  s1End.setDate(today.getDate() + 13);

  const s2Start = new Date();
  s2Start.setDate(today.getDate() - 5);
  const s2End = new Date();
  s2End.setDate(today.getDate() + 45);

  const s3Start = new Date();
  s3Start.setDate(today.getDate() - 27);
  const s3End = new Date();
  s3End.setDate(today.getDate() + 3);

  return [
    {
      id: "sub-1",
      memberId: m1Id,
      type: "شامل",
      startDate: s1Start.toISOString().split('T')[0],
      endDate: s1End.toISOString().split('T')[0],
      status: "فعال",
      price: 499
    },
    {
      id: "sub-2",
      memberId: m2Id,
      type: "جيم",
      startDate: s2Start.toISOString().split('T')[0],
      endDate: s2End.toISOString().split('T')[0],
      status: "فعال",
      price: 299
    },
    {
      id: "sub-3",
      memberId: m3Id,
      type: "ملاكمة",
      startDate: s3Start.toISOString().split('T')[0],
      endDate: s3End.toISOString().split('T')[0],
      status: "فعال",
      price: 350
    }
  ];
};

export const initialProgressLogs = (m1Id: string, m2Id: string, m3Id: string): ProgressLog[] => {
  return [
    { id: "log-1a", memberId: m1Id, weight: 88.0, fat: 25.0, muscle: 38.0, date: "2026-06-01" },
    { id: "log-1b", memberId: m1Id, weight: 86.5, fat: 23.5, muscle: 39.2, date: "2026-06-15" },
    { id: "log-1c", memberId: m1Id, weight: 85.0, fat: 22.0, muscle: 40.0, date: "2026-07-03" },
    
    { id: "log-2a", memberId: m2Id, weight: 65.0, fat: 32.0, muscle: 29.0, date: "2026-06-15" },
    { id: "log-2b", memberId: m2Id, weight: 63.8, fat: 30.2, muscle: 30.0, date: "2026-06-25" },
    { id: "log-2c", memberId: m2Id, weight: 62.0, fat: 28.0, muscle: 31.0, date: "2026-07-03" },

    { id: "log-3a", memberId: m3Id, weight: 92.0, fat: 30.0, muscle: 34.0, date: "2026-05-20" },
    { id: "log-3b", memberId: m3Id, weight: 93.8, fat: 30.6, muscle: 34.8, date: "2026-06-10" },
    { id: "log-3c", memberId: m3Id, weight: 95.0, fat: 31.0, muscle: 35.0, date: "2026-07-03" }
  ];
};

export const initialServices: ClubService[] = [
  {
    id: "srv-1",
    title: "حديد ولياقة (جيم صالة)",
    description: "صالة كمال الأجسام واللياقة البدنية المجهزة بأحدث الأجهزة الرياضية والأثقال الحرة مع مدربين معتمدين لمساعدتك في بناء العضلات والتنشيف.",
    image: "",
    price: 299
  },
  {
    id: "srv-2",
    title: "المسبح الأولمبي الدافئ",
    description: "مسبح أولمبي دافئ مغلق بالكامل مجهز بأنظمة تنقية وتحكم بالحرارة، مع كباتن سباحة ومنقذين مختصين للتدريب الحر وحصص اللياقة المائية.",
    image: "",
    price: 250
  },
  {
    id: "srv-3",
    title: "ملاكمة وكيك بوكسينغ",
    description: "حصص قتالية عالية الحماس تدمج مهارات الدفاع عن النفس وحرق الدهون في حلبة مخصصة وتحت إشراف كباتن أبطال في رياضات الدفاع عن النفس.",
    image: "",
    price: 350
  },
  {
    id: "srv-4",
    title: "حجز ملعب الكرة الخماسي",
    description: "ملعب كرة قدم خماسي مكسو بالعشب الاصطناعي مجهز بالكامل للمباريات الخماسية مع الأصدقاء. مدة الحجز: ساعة ونصف (1.5h).",
    image: "",
    price: 15
  }
];

export const initialOffers: ClubOffer[] = [
  {
    id: "off-1",
    title: "خصم باقة الصيف الكبرى",
    description: "خصم 35% كامل على تفعيل أو تجديد الاشتراك الشامل لمدة 90 يوم! يشمل الجيم والمسبح وحصص اللياقة مجاناً.",
    discount: "35% خصم",
    active: true,
    image: ""
  },
  {
    id: "off-2",
    title: "عرض تمرين الأصدقاء الثنائي",
    description: "سجل مع صديقك اليوم في أي باقة تختارونها واحصلوا على 15 يوماً إضافية تضاف مجاناً لاشتراك كلاكما معاً!",
    discount: "15 يوم مجاناً",
    active: true,
    image: ""
  },
  {
    id: "off-3",
    title: "كوبون خصم التجديد المبكر",
    description: "جدد اشتراكك قبل انتهائه بأسبوع كامل واحصل على خصم 20% مباشر على أي باقة تختارها من لوحة التحكم.",
    discount: "20% خصم",
    active: false,
    image: ""
  }
];

export const initialBookings = (m1Id: string): Booking[] => {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return [
    {
      id: "book-1",
      memberId: m1Id,
      memberName: "أحمد الشوبكي",
      memberPhone: "0795551234",
      serviceId: "srv-2",
      serviceTitle: "المسبح الأولمبي الدافئ",
      date: tomorrow.toISOString().split('T')[0],
      timeSlot: "17:00",
      status: "قيد الانتظار",
      createdAt: new Date().toISOString()
    }
  ];
};

export const initialChallenges: FitnessChallenge[] = [
  {
    id: "ch-1",
    title: "تحدي الحضور الحديدي 🏋️",
    description: "احضر وسجل دخولك للصالة 5 مرات خلال أسبوعين لتحصل على نقاط تشتري بها مكملات!",
    targetValue: 5,
    unit: "زيارات",
    pointsReward: 80,
    category: "حضور",
    icon: "CalendarCheck"
  },
  {
    id: "ch-2",
    title: "تحدي 10k خطوات الكارديو 👣",
    description: "اقطع 10,000 خطوة على أجهزة الجري لزيادة اللياقة وتسريع حرق الدهون.",
    targetValue: 10000,
    unit: "خطوة",
    pointsReward: 50,
    category: "خطوات",
    icon: "TrendingUp"
  },
  {
    id: "ch-3",
    title: "تحدي خسارة الوزن الصحي ⚖️",
    description: "اخسر 3 كجم من الوزن بطريقة صحية مبرمجة لميزان الـ InBody المطور بالصالة.",
    targetValue: 3,
    unit: "كجم",
    pointsReward: 120,
    category: "وزن",
    icon: "TrendingDown"
  },
  {
    id: "ch-4",
    title: "تحدي تكرارات الضغط القوي 💪",
    description: "قم بأداء 50 تكرار تمرين ضغط لإثبات قوتك الجسدية أمام المشتركين والكباتن.",
    targetValue: 50,
    unit: "تكرار",
    pointsReward: 65,
    category: "تمارين",
    icon: "Dumbbell"
  }
];

export const initialBarItems: BarItem[] = [
  {
    id: "bar-1",
    name: "مخفوق بروتين التوت البري المنعش",
    category: "بروتين",
    pricePoints: 60,
    priceCash: 4.5,
    image: "",
    description: "مشروب واي بروتين معزول بنكهة التوت والأناناس المنعش، مثالي للاستشفاء العضلي الفوري بعد التمرين الصعب.",
    stock: 25
  },
  {
    id: "bar-2",
    name: "شوكولاتة دبل بروتين كوكيز",
    category: "وجبات خفيفة وسناكس",
    pricePoints: 30,
    priceCash: 2.5,
    image: "",
    description: "كوكيز طرية ممتلئة بقطع الشوكولاتة الداكنة الفاخرة وخالية تماماً من السكر، تحتوي على 22 جرام بروتين.",
    stock: 40
  },
  {
    id: "bar-3",
    name: "قهوة إسبريسو مزدوجة دافئة",
    category: "مشروبات ساخنة وباردة",
    pricePoints: 25,
    priceCash: 2.0,
    image: "",
    description: "جرعة مزدوجة من القهوة المركزة من حبوب البن الفاخرة لزيادة التركيز ومستويات الطاقة.",
    stock: 100
  },
  {
    id: "bar-4",
    name: "عصير البرتقال الطبيعي البارد",
    category: "مشروبات ساخنة وباردة",
    pricePoints: 35,
    priceCash: 2.5,
    image: "",
    description: "عصير برتقال طبيعي 100% طازج غني بفيتامين سي لترطيب وإنعاش الجسم بعد التمرين.",
    stock: 30
  },
  {
    id: "bar-5",
    name: "صدر دجاج مشوي مع أرز بسمتي",
    category: "وجبات رئيسية صحية",
    pricePoints: 120,
    priceCash: 6.5,
    image: "",
    description: "صدر دجاج مشوي متبل بالأعشاب الطازجة يقدم مع أرز بسمتي غني بالألياف والخضار السوتيه.",
    stock: 15
  },
  {
    id: "bar-6",
    name: "براونيز بروتين خالي من السكر",
    category: "حلويات صحية",
    pricePoints: 40,
    priceCash: 3.0,
    image: "",
    description: "حلوى البراونيز الغنية بالشوكولاتة الداكنة، مخبوزة بدقيق اللوز ومحلاة بالستيفيا الطبيعية مع 15 جرام بروتين.",
    stock: 20
  }
];

export const initialChallengeProgresses = (m1Id: string, m2Id: string, m3Id: string): ChallengeProgress[] => {
  return [
    {
      id: "prog-1",
      memberId: m1Id,
      challengeId: "ch-1",
      currentValue: 4,
      isCompleted: false
    },
    {
      id: "prog-2",
      memberId: m1Id,
      challengeId: "ch-2",
      currentValue: 8200,
      isCompleted: false
    },
    {
      id: "prog-3",
      memberId: m2Id,
      challengeId: "ch-1",
      currentValue: 5,
      isCompleted: true
    },
    {
      id: "prog-4",
      memberId: m3Id,
      challengeId: "ch-4",
      currentValue: 20,
      isCompleted: false
    }
  ];
};

export const initialAttendanceLogs = (m1Id: string, m2Id: string): AttendanceLog[] => {
  return [
    {
      id: "att-1",
      memberId: m1Id,
      memberName: "أحمد الشوبكي",
      date: new Date().toISOString().split('T')[0],
      time: "16:45",
      method: "مسح الرمز QR"
    },
    {
      id: "att-2",
      memberId: m2Id,
      memberName: "سارة المومني",
      date: new Date().toISOString().split('T')[0],
      time: "15:30",
      method: "دخول يدوي"
    }
  ];
};

export const initialBarOrders = (m1Id: string): BarOrder[] => {
  return [
    {
      id: "ord-1",
      memberId: m1Id,
      memberName: "أحمد الشوبكي",
      itemId: "bar-2",
      itemName: "شوكولاتة دبل بروتين كوكيز",
      quantity: 1,
      totalPointsCost: 30,
      status: "جاهز للاستلام",
      createdAt: new Date().toISOString()
    }
  ];
};
