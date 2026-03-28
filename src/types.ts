// src/types.ts
import type { Database } from './lib/database.types';

// ============================================================================
// 📦 SUPABASE DATABASE TYPES (The Core Truth)
// ============================================================================
// We extract the Row types directly from the generated database schema.
// If the database changes, these automatically update.

export type CaptainsLog = Database['public']['Tables']['captains_logs']['Row'];
export type CaptainsLogInsert = Database['public']['Tables']['captains_logs']['Insert'];

// (Add other tables here as we discover them, e.g., Profiles, FurryNodes, etc.)
// export type Profile = Database['public']['Tables']['profiles']['Row'];

// ============================================================================
// 🎨 UI & COMPONENT TYPES (The Frontend Matrix)
// ============================================================================

// Example: Standardized props for any major layout container
export interface BaseContainerProps {
  children: React.ReactNode;
  className?: string;
}

// Example: Generic API Response wrapper if we need it
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// ============================================================================
// 🤖 AI UPLINK TYPES
// ============================================================================
export interface AIRequest {
  prompt: string;
  context_partition: 'HUMAN_OS' | 'WORK_OS' | 'SYSTEM';
}

export interface AIResponse {
  id: string;
  output: string;
  latency_ms: number;
  tokens_consumed: number;
}
