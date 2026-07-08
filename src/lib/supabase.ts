import { createClient } from '@supabase/supabase-js';

// Retrieve credentials from Vite environment variables
const supabaseUrl = (import.meta as any).env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env.VITE_SUPABASE_ANON_KEY || '';

// Verify if credentials are valid and present
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey && supabaseUrl !== 'YOUR_SUPABASE_URL');

// Initialize the client safely
export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

/**
 * Interface representing a Coach Training/Nutrition Plan
 */
export interface CoachPlan {
  id: string; // uuid or local string id
  title: string; // plan title (e.g., "تنشيف أسطوري للكابتن حصن")
  type: 'تدريب' | 'تغذية'; // Training or Nutrition
  goal: 'تنشيف' | 'تضخيم' | 'لياقة'; // Cutting, Bulking, Fitness
  duration_weeks: number; // e.g., 4, 8, 12 weeks
  level: 'مبتدئ' | 'متوسط' | 'متقدم'; // Level
  description: string; // brief summary
  details: string; // daily program or detailed markdown description
  image_url?: string; // sleek plan card image
  created_at?: string;
  updated_at?: string;
}
