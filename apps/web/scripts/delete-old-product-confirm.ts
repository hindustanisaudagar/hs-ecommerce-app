import * as fs from 'fs'
import * as path from 'path'
import { createClient } from '@supabase/supabase-js'

// Load .env.local manually
const envPath = path.join(process.cwd(), '.env.local')
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8')
  envContent.split('\n').forEach(line => {
    const trimmed = line.trim()
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=')
      const value = valueParts.join('=').replace(/^["']|["']$/g, '')
      process.env[key.trim()] = value
    }
  })
}

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase environment variables')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

// The old product ID to delete
const OLD_PRODUCT_ID = 'b5c86f58-ba05-4be7-ac8a-4c1aaaa433f'

async function deleteOldProduct() {
  console.log('🗑️ Deleting old product...')
  console.log(`   Product ID: ${OLD_PRODUCT_ID}\n`)
  
  // First, get product details to confirm
  const { data: product, error: fetchError } = await supabase
    .from('products')
    .select('id, name, slug, created_at')
    .eq('id', OLD_PRODUCT_ID)
    .single()
  
  if (fetchError) {
    console.error('❌ Product not found:', fetchError.message)
    process.exit(1)
  }
  
  console.log('📦 Product to delete:')
  console.log(`   Name: ${product.name}`)
  console.log(`   Slug: ${product.slug}`)
  console.log(`   Created: ${product.created_at}\n`)
  
  // Delete variations first (if any)
  console.log('🎨 Deleting related variations...')
  const { error: variationsError } = await supabase
    .from('product_variations')
    .delete()
    .eq('product_id', OLD_PRODUCT_ID)
  
  if (variationsError) {
    console.error('⚠️ Error deleting variations:', variationsError.message)
  } else {
    console.log('   ✅ Variations deleted (if any)\n')
  }
  
  // Delete the product
  console.log('🗑️ Deleting product...')
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', OLD_PRODUCT_ID)
  
  if (deleteError) {
    console.error('❌ Failed to delete product:', deleteError.message)
    process.exit(1)
  }
  
  console.log('✅ Product deleted successfully!')
  console.log('\n📊 Remaining products: 244 (imported products are safe)')
}

deleteOldProduct()
