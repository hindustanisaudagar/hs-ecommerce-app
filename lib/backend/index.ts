import { BackendProvider } from './types'
import { createSupabaseBackend } from './supabase'
import { createWooCommerceBackend } from './woocommerce'
import { createDualBackend } from './both'
import { getAppSettings } from './settings'

export async function createBackend(): Promise<BackendProvider> {
  const settings = await getAppSettings()
  const provider = settings.backend_provider || 'supabase'
  
  switch (provider) {
    case 'supabase':
      return createSupabaseBackend()
    case 'woocommerce':
      return createWooCommerceBackend()
    case 'both':
      return createDualBackend()
    default:
      return createSupabaseBackend()
  }
}

export { getAppSettings, updateAppSettings } from './settings'
export type { BackendProvider, ProductQuery, ProductResponse, CategoryQuery, OrderInput } from './types'
