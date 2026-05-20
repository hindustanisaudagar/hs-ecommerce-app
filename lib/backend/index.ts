import { BackendProvider } from './types'
import { createSupabaseBackend } from './supabase'
import { createWooCommerceBackend } from './woocommerce'
import { createDualBackend } from './both'
import { getAppSettings } from './settings'

export async function createBackend(): Promise<BackendProvider> {
  const settings = await getAppSettings()
  const provider = settings.backend_provider || 'supabase'
  
  console.log('🔧 Backend Factory - Current provider:', provider)
  console.log(' Backend Factory - Settings:', JSON.stringify(settings, null, 2))
  
  switch (provider) {
    case 'supabase':
      console.log('✅ Using Supabase backend')
      return createSupabaseBackend()
    case 'woocommerce':
      console.log('✅ Using WooCommerce backend')
      return createWooCommerceBackend()
    case 'both':
      console.log('✅ Using Dual backend (sync mode)')
      return createDualBackend()
    default:
      console.log('⚠️ Unknown provider, falling back to Supabase')
      return createSupabaseBackend()
  }
}

export { getAppSettings, updateAppSettings } from './settings'
export type { BackendProvider, ProductQuery, ProductResponse, CategoryQuery, OrderInput } from './types'
