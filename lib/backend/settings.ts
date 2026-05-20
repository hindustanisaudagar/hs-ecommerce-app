import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'

export interface AppSettings {
  backend_provider: 'supabase' | 'woocommerce' | 'both'
  woocommerce_url: string
  woocommerce_consumer_key: string
  woocommerce_consumer_secret: string
}

// Cache settings for 5 minutes to improve performance
let cachedSettings: AppSettings | null = null
let cacheExpiry = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function getAppSettings(): Promise<AppSettings> {
  const now = Date.now()
  
  // Return cached settings if still valid
  if (cachedSettings && now < cacheExpiry) {
    console.log('📋 Using cached settings')
    return cachedSettings
  }
  
  console.log('🔄 Fetching fresh settings from database')
  
  // Use admin client to bypass RLS (works without authentication)
  const supabase = createAdminClient()
  
  const { data, error } = await supabase
    .from('app_settings')
    .select('key, value')
  
  if (error) {
    console.error('❌ Failed to fetch app settings:', error)
    return getDefaultSettings()
  }
  
  console.log('📊 Raw settings from DB:', JSON.stringify(data, null, 2))
  
  const settings: any = {}
  data?.forEach((row: any) => {
    try {
      settings[row.key] = JSON.parse(row.value)
    } catch {
      settings[row.key] = row.value
    }
  })
  
  console.log('📊 Parsed settings:', JSON.stringify(settings, null, 2))
  
  const result: AppSettings = {
    backend_provider: settings.backend_provider || 'supabase',
    woocommerce_url: settings.woocommerce_url || process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || '',
    woocommerce_consumer_key: settings.woocommerce_consumer_key || process.env.WOOCOMMERCE_CONSUMER_KEY || '',
    woocommerce_consumer_secret: settings.woocommerce_consumer_secret || process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  }
  
  // Cache the result
  cachedSettings = result
  cacheExpiry = now + CACHE_DURATION
  
  console.log('✅ Settings cached for 5 minutes')
  
  return result
}

export async function updateAppSettings(settings: Partial<AppSettings>): Promise<void> {
  const supabase = await createClient()
  
  for (const [key, value] of Object.entries(settings)) {
    const { error } = await supabase
      .from('app_settings')
      .upsert(
        {
          key,
          value: JSON.stringify(value),
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'key' }
      )
    
    if (error) {
      console.error(`❌ Failed to update setting ${key}:`, error)
      throw new Error(`Failed to save ${key}: ${error.message}`)
    }
  }
  
  // Clear cache after update so next read gets fresh data
  cachedSettings = null
  cacheExpiry = 0
  console.log('🗑️ Cache cleared after settings update')
}

function getDefaultSettings(): AppSettings {
  return {
    backend_provider: 'supabase',
    woocommerce_url: process.env.NEXT_PUBLIC_WOOCOMMERCE_URL || '',
    woocommerce_consumer_key: process.env.WOOCOMMERCE_CONSUMER_KEY || '',
    woocommerce_consumer_secret: process.env.WOOCOMMERCE_CONSUMER_SECRET || '',
  }
}
