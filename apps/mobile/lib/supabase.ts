import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://yetqthumnxkxlujudrbd.supabase.co'
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlldHF0aHVtbnhreGx1anVkcmJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkxNzYzMDcsImV4cCI6MjA5NDc1MjMwN30.I3WlUeJTgmXE3gGeW_Iqwce2up4y_8f7GBlPJ5sEooM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
