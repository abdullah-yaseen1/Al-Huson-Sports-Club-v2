export interface Member {
  id: string;
  name: string;
  phone: string;
  email: string;
  height: number; // in cm
  weight: number; // in kg
  fat: number; // percentage %
  muscle: number; // percentage %
  goal: 'تنشيف' | 'تضخيم' | 'لياقة';
  createdAt: string;
  points: number; // Earned Huson rewards points
  status?: 'نشط' | 'قيد الانتظار'; // Pending registration approval
  pendingSubType?: 'جيم' | 'شامل' | 'مسبح' | 'ملاكمة';
  gender?: 'ذكر' | 'أنثى';
  password?: string;
}

export interface Subscription {
  id: string;
  memberId: string;
  type: 'جيم' | 'شامل' | 'مسبح' | 'ملاكمة';
  startDate: string;
  endDate: string;
  status: 'فعال' | 'قريب الانتهاء' | 'منتهي';
  price: number;
}

export interface ProgressLog {
  id: string;
  memberId: string;
  weight: number;
  fat: number;
  muscle: number;
  date: string;
}

export interface ClubService {
  id: string;
  title: string;
  description: string;
  image: string;
  price: number;
}

export interface Booking {
  id: string;
  memberId: string;
  memberName: string;
  memberPhone: string;
  serviceId: string;
  serviceTitle: string;
  date: string;
  timeSlot: string;
  status: 'قيد الانتظار' | 'تم القبول' | 'تم الرفض';
  createdAt: string;
  playersCount?: number;
  notes?: string;
}

export interface ClubOffer {
  id: string;
  title: string;
  description: string;
  discount: string;
  active: boolean;
  image: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

// 🌐 NEW: Smart Gym Expansion Interfaces
export interface AttendanceLog {
  id: string;
  memberId: string;
  memberName: string;
  date: string;
  time: string;
  method: 'مسح الرمز QR' | 'دخول يدوي';
}

export interface FitnessChallenge {
  id: string;
  title: string;
  description: string;
  targetValue: number;
  unit: string;
  pointsReward: number;
  category: 'خطوات' | 'وزن' | 'حضور' | 'تمارين';
  icon: string;
}

export interface ChallengeProgress {
  id: string;
  memberId: string;
  challengeId: string;
  currentValue: number;
  isCompleted: boolean;
}

export interface BarItem {
  id: string;
  name: string;
  category: 'مشروبات ساخنة وباردة' | 'بروتين' | 'وجبات خفيفة وسناكس' | 'وجبات رئيسية صحية' | 'حلويات صحية' | string;
  pricePoints: number; // cost in points
  priceCash: number;  // cost in SAR
  image: string;
  description: string;
  stock: number;
}

export interface BarOrder {
  id: string;
  memberId: string;
  memberName: string;
  itemId: string;
  itemName: string;
  quantity: number;
  totalPointsCost: number;
  status: 'قيد التحضير' | 'جاهز للاستلام' | 'تم التسليم';
  createdAt: string;
  deliveryLocation?: 'الـ Gym' | 'الـ Pool' | 'الـ Outdoor' | string;
}

export interface PushNotification {
  id: string;
  memberId: string;
  title: string;
  message: string;
  createdAt: string;
  type: 'workout' | 'subscription' | 'offer' | 'announcement' | 'pool' | 'booking_status' | 'challenge';
  read: boolean;
}

export interface ClubHours {
  womenStart: string;
  womenEnd: string;
  menStart: string;
  menEnd: string;
}
