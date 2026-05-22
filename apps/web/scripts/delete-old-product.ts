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

async function deleteOldProduct() {
  console.log('🔍 Finding the old product (before import)...')
  
  // Get all products ordered by created_at ascending
  const { data: products, error } = await supabase
    .from('products')
    .select('id, name, slug, created_at')
    .order('created_at', { ascending: true })
  
  if (error) {
    console.error('❌ Failed to fetch products:', error.message)
    process.exit(1)
  }
  
  if (!products || products.length === 0) {
    console.log('⚠️ No products found in database')
    process.exit(0)
  }
  
  // The oldest product is likely the one added before import
  const oldestProduct = products[0]
  const secondOldest = products[1]
  
  console.log(`\n📦 Found ${products.length} total products`)
  console.log(`\n🔍 Oldest product (likely the pre-import one):`)
  console.log(`   ID: ${oldestProduct.id}`)
  console.log(`   Name: ${oldestProduct.name}`)
  console.log(`   Slug: ${oldestProduct.slug}`)
  console.log(`   Created: ${oldestProduct.created_at}`)
  
  if (secondOldest) {
    console.log(`\n📊 Second oldest product (for comparison):`)
    console.log(`   Name: ${secondOldest.name}`)
    console.log(`   Created: ${secondOldest.created_at}`)
    
    // Calculate time difference
    const timeDiff = new Date(secondOldest.created_at).getTime() - new Date(oldestProduct.created_at).getTime()
    const hoursDiff = timeDiff / (1000 * 60 * 60)
    
    if (hoursDiff > 1) {
      console.log(`\n⏰ Time gap: ${hoursDiff.toFixed(1)} hours (likely the old product)`)
    } else {
      console.log(`\n⏰ Time gap: ${hoursDiff.toFixed(1)} hours (might be part of import)`)
    }
  }
  
  // Ask for confirmation
  console.log(`\n❓ Do you want to delete this product?`)
  console.log(`   Type 'yes' to confirm, or press Enter to cancel:`)
  
  // For non-interactive mode, we'll just show the info
  // User can manually delete from Supabase dashboard if needed
  console.log(`\n💡 To delete manually:`)
  console.log(`   1. Go to Supabase Dashboard → Table Editor → products`)
  console.log(`   2. Find product with ID: ${oldestProduct.id}`)
  console.log(`   3. Click delete`)
  
  console.log(`\n✅ Script complete!`)
}

deleteOldProduct()
