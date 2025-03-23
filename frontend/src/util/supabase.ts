import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface UserProfile {
  id: string;
  email: string;
  age?: number;
  riskTolerance?: number;
  investmentGoal?: string;
  investmentHorizon?: string;
  initialInvestment?: number;
  created_at: string;
  updated_at: string;
}

export interface InvestmentAnalysis {
  id: string;
  user_id: string;
  symbol: string;
  analysis: {
    technical: {
      indicators: Record<string, number>;
      signals: string[];
    };
    fundamental: {
      metrics: Record<string, number>;
      insights: string[];
    };
    sentiment: {
      score: number;
      articles: Array<{
        title: string;
        source: string;
        url: string;
        sentiment: 'positive' | 'negative' | 'neutral';
        impact: 'high' | 'medium' | 'low';
      }>;
    };
  };
  created_at: string;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
}

export async function updateUserProfile(userId: string, profile: Partial<UserProfile>): Promise<UserProfile> {
  const { data, error } = await supabase
    .from('profiles')
    .update(profile)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function saveAnalysis(userId: string, analysis: Omit<InvestmentAnalysis, 'id' | 'user_id' | 'created_at'>): Promise<InvestmentAnalysis> {
  const { data, error } = await supabase
    .from('analyses')
    .insert([
      {
        user_id: userId,
        ...analysis,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getAnalyses(userId: string): Promise<InvestmentAnalysis[]> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function getSharedAnalysis(analysisId: string): Promise<InvestmentAnalysis | null> {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('id', analysisId)
    .single();

  if (error) throw error;
  return data;
} 