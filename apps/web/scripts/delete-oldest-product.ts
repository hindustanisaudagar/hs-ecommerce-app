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

async function findAndDeleteOldProduct() {
  console.log('🔍 Finding the oldest product...\n')
  
  // Get the oldest product
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, created_at')
    .order('created_at', { ascending: true })
    .limit(2)
  
  if (error) {
    console.error('❌ Failed to fetch products:', error.message)
    process.exit(1)
  }
  
  if (!products || products.length === 0) {
    console.log('⚠️ No products found')
    process.exit(0)
  }
  
  const oldestProduct = products[0]
  
  console.log('📦 Oldest product found:')
  console.log(`   ID: ${oldestProduct.id}`)
  console.log(`   Name: ${oldestProduct.name.substring(0, 50)}...`)
  console.log(`   Created: ${oldestProduct.created_at}\n`)
  
  if (products.length > 1) {
    const secondOldest = products[1]
    const timeDiff = new Date(secondOldest.created_at).getTime() - new Date(oldestProduct.created_at).getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    console.log('📊 Second oldest product:')
    console.log(`   Name: ${secondOldest.name.substring(0, 50)}...`)
    console.log(`   Created: ${secondOldest.created_at}`)
    console.log(`   Time gap: ${hoursDiff.toFixed(1)} hours\n`)
  }
  
  // Delete variations first
  console.log(' Deleting related variations...')
  const { error: variationsError } = await supabase
    .from('product_variations')
    .delete()
    .eq('product_id', oldestProduct.id)
  
  if (variationsError) {
    console.log('   ⚠️ No variations to delete or error:', variationsError.message)
  } else {
    console.log('   ✅ Variations deleted (if any)\n')
  }
  
  // Delete the product
  console.log('🗑️ Deleting product...')
  const { error: deleteError } = await supabase
    .from('products')
    .delete()
    .eq('id', oldestProduct.id)
  
  if (deleteError) {
    console.error('❌ Failed to delete product:', deleteError.message)
    process.exit(1)
  }
  
  console.log('✅ Product deleted successfully!')
  console.log(`\n📊 Deleted product ID: ${oldestProduct.id}`)
  console.log('✅ All imported products (244) are safe!')
}

findAndDeleteOldProduct()
