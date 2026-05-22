import { Platform } from './platform'

const supabaseUrl = Platform.isWeb
  ? (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_URL : undefined)
  : (process.env.EXPO_PUBLIC_SUPABASE_URL || '')

const supabaseAnonKey = Platform.isWeb
  ? (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY : undefined)
  : (process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '')

export const SUPABASE_URL = supabaseUrl || ''
export const SUPABASE_ANON_KEY = supabaseAnonKey || ''
