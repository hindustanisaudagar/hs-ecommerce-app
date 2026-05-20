import axios from 'axios'
import { createClient } from '@supabase/supabase-js'
import { v2 as cloudinary } from 'cloudinary'
import * as fs from 'fs'
import * as path from 'path'

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

// Configuration
const WOO_URL = process.env.NEXT_PUBLIC_WOOCOMMERCE_URL
const WOO_KEY = process.env.WOOCOMMERCE_CONSUMER_KEY
const WOO_SECRET = process.env.WOOCOMMERCE_CONSUMER_SECRET
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!WOO_URL || !WOO_KEY || !WOO_SECRET) {
  console.error('❌ Missing WooCommerce environment variables')
  console.error('Required: NEXT_PUBLIC_WOOCOMMERCE_URL, WOOCOMMERCE_CONSUMER_KEY, WOOCOMMERCE_CONSUMER_SECRET')
  process.exit(1)
}

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Missing Supabase environment variables')
  console.error('Required: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY')
  process.exit(1)
}

// Initialize clients
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)
const wooClient = axios.create({
  baseURL: `${WOO_URL.replace(/\/$/, '')}/wp-json/wc/v3`,
  auth: { username: WOO_KEY, password: WOO_SECRET },
  timeout: 30000,
})

// Configure Cloudinary
const cloudinaryConfigured = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME && 
                             process.env.CLOUDINARY_API_KEY && 
                             process.env.CLOUDINARY_API_SECRET

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
} else {
  console.log('⚠️ Cloudinary not configured. Images will use original URLs.')
}

// Helper: Decode HTML entities
function decodeHtml(text: string): string {
  if (!text) return ''
  const entities: Record<string, string> = {
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&#39;': "'",
    '&nbsp;': ' ',
  }
  return text.replace(/&[^;]+;/g, (match) => entities[match] || match)
}

// Helper: Upload image to Cloudinary from URL
async function uploadToCloudinary(imageUrl: string, folder: string): Promise<string> {
  if (!cloudinaryConfigured) {
    return imageUrl
  }
  
  try {
    const response = await axios.get(imageUrl, { 
      responseType: 'arraybuffer',
      timeout: 15000,
    })
    const buffer = Buffer.from(response.data)
    
    const result = await new Promise<any>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { 
          folder: `hindustani-saudagar/${folder}`,
          transformation: [
            { quality: 'auto:good' },
            { fetch_format: 'auto' },
          ],
        },
        (error, result) => error ? reject(error) : resolve(result)
      )
      uploadStream.end(buffer)
    })
    
    return result.secure_url
  } catch (error: any) {
    console.warn(`   ⚠️ Failed to upload image: ${imageUrl}`)
    console.warn(`   Reason: ${error.message}`)
    return imageUrl
  }
}

// Helper: Delay for rate limiting
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Step 1: Import Categories
async function importCategories() {
  console.log('\n Step 1: Importing categories...')
  
  const { data: wooCategories } = await wooClient.get('products/categories', {
    params: {
      per_page: 100,
      orderby: 'name',
      order: 'asc',
    },
  })
  
  console.log(`   Found ${wooCategories.length} categories in WooCommerce`)
  
  const wooToSupabaseId = new Map<string, string>()
  
  // First pass: Insert all categories without parent_id
  for (const wooCat of wooCategories) {
    const { data: existing } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', wooCat.slug)
      .single()
    
    if (existing) {
      console.log(`   ⏭️ Skipping existing category: ${decodeHtml(wooCat.name)}`)
      wooToSupabaseId.set(wooCat.id.toString(), existing.id)
      continue
    }
    
    const { data: inserted, error } = await supabase
      .from('categories')
      .insert({
        name: decodeHtml(wooCat.name),
        slug: wooCat.slug,
        description: decodeHtml(wooCat.description || ''),
        image: wooCat.image?.src || null,
      })
      .select()
      .single()
    
    if (error) {
      console.error(`   ❌ Failed to insert category ${wooCat.name}:`, error.message)
      continue
    }
    
    wooToSupabaseId.set(wooCat.id.toString(), inserted.id)
    console.log(`   ✅ Inserted category: ${decodeHtml(wooCat.name)}`)
    
    await delay(100)
  }
  
  // Second pass: Update parent_id relationships
  let parentUpdates = 0
  for (const wooCat of wooCategories) {
    if (wooCat.parent && wooCat.parent !== 0) {
      const supabaseId = wooToSupabaseId.get(wooCat.id.toString())
      const parentSupabaseId = wooToSupabaseId.get(wooCat.parent.toString())
      
      if (supabaseId && parentSupabaseId) {
        await supabase
          .from('categories')
          .update({ parent_id: parentSupabaseId })
          .eq('id', supabaseId)
        
        parentUpdates++
        console.log(`   🔗 Set parent for: ${decodeHtml(wooCat.name)}`)
      }
    }
  }
  
  console.log(`   ✅ Categories import complete! Total: ${wooToSupabaseId.size}, Parent links: ${parentUpdates}`)
  return wooToSupabaseId
}

// Step 2: Import Products
async function importProducts(categoryMap: Map<string, string>) {
  console.log('\n📦 Step 2: Importing products...')
  
  let page = 1
  let totalImported = 0
  let totalSkipped = 0
  const wooToSupabaseId = new Map<string, string>()
  
  while (true) {
    console.log(`   Fetching page ${page}...`)
    
    const { data: wooProducts, headers } = await wooClient.get('products', {
      params: {
        per_page: 50,
        page,
        status: 'publish',
      },
    })
    
    if (wooProducts.length === 0) {
      console.log('   No more products to fetch')
      break
    }
    
    console.log(`   Processing ${wooProducts.length} products...`)
    
    for (const wooProduct of wooProducts) {
      const productName = decodeHtml(wooProduct.name)
      
      // Check if product already exists
      const { data: existing } = await supabase
        .from('products')
        .select('id')
        .eq('slug', wooProduct.slug)
        .single()
      
      if (existing) {
        console.log(`   ⏭️ Skipping existing product: ${productName}`)
        wooToSupabaseId.set(wooProduct.id.toString(), existing.id)
        totalSkipped++
        continue
      }
      
      // Upload images to Cloudinary
      const cloudinaryImages: string[] = []
      for (const img of (wooProduct.images || [])) {
        console.log(`    Uploading image for ${productName}...`)
        const cloudinaryUrl = await uploadToCloudinary(img.src, 'products')
        cloudinaryImages.push(cloudinaryUrl)
      }
      
      // Map categories
      const metaData = wooProduct.meta_data || []
      const getMeta = (key: string) => metaData.find((m: any) => m.key === key)?.value || ''
      
      const categoryIds = (wooProduct.categories || [])
        .map((cat: any) => categoryMap.get(cat.id.toString()))
        .filter(Boolean)
      
      // Parse JSON fields safely
      let safetyFeatures: string[] = []
      try {
        safetyFeatures = JSON.parse(getMeta('safety_features') || '[]')
      } catch {
        safetyFeatures = []
      }
      
      let features: any[] = []
      try {
        features = JSON.parse(getMeta('features') || '[]')
      } catch {
        features = []
      }
      
      // Insert product
      const { data: inserted, error } = await supabase
        .from('products')
        .insert({
          name: productName,
          slug: wooProduct.slug,
          description: decodeHtml(wooProduct.description || ''),
          short_description: decodeHtml(wooProduct.short_description || ''),
          price: parseFloat(wooProduct.price) || 0,
          original_price: wooProduct.regular_price ? parseFloat(wooProduct.regular_price) : null,
          sku: wooProduct.sku || null,
          brand: getMeta('brand') || null,
          stock: wooProduct.stock_quantity || 0,
          is_active: wooProduct.status === 'publish',
          images: cloudinaryImages,
          category_id: categoryIds[0] || null,
          category_ids: categoryIds,
          tags: wooProduct.tags || [],
          specifications: {
            material: getMeta('material') || null,
            contents: getMeta('contents') || null,
            capacity: getMeta('capacity') || null,
            dimensions: getMeta('dimensions') || null,
            weight: wooProduct.weight || null,
            color: getMeta('color') || null,
            package_includes: getMeta('package_includes') || null,
          },
          safety_features: safetyFeatures,
          features: features,
          product_story: getMeta('product_story') || null,
          tradition_section: getMeta('tradition_section') || null,
          made_in_india_section: getMeta('made_in_india_section') || null,
          handmade_disclaimer: getMeta('handmade_disclaimer') || null,
          meta_title: getMeta('meta_title') || null,
          meta_description: getMeta('meta_description') || null,
          is_comparable: getMeta('is_comparable') === 'true',
          has_variations: wooProduct.type === 'variable',
        })
        .select()
        .single()
      
      if (error) {
        console.error(`   ❌ Failed to insert product ${productName}:`, error.message)
        continue
      }
      
      wooToSupabaseId.set(wooProduct.id.toString(), inserted.id)
      totalImported++
      console.log(`   ✅ Imported: ${productName}`)
      
      await delay(200)
    }
    
    const total = parseInt(headers['x-wp-total'] || '0')
    console.log(`   Progress: ${page * 50}/${total} products processed`)
    
    if (page * 50 >= total) {
      console.log('   All products fetched')
      break
    }
    
    page++
  }
  
  console.log(`   ✅ Products import complete! Imported: ${totalImported}, Skipped: ${totalSkipped}`)
  return wooToSupabaseId
}

// Step 3: Import Variations
async function importVariations(productMap: Map<string, string>) {
  console.log('\n Step 3: Importing product variations...')
  
  let totalImported = 0
  let totalSkipped = 0
  
  for (const [wooProductId, supabaseProductId] of productMap) {
    const { data: wooProduct } = await wooClient.get(`products/${wooProductId}`)
    
    if (wooProduct.type !== 'variable') continue
    
    const { data: variations } = await wooClient.get(`products/${wooProductId}/variations`, {
      params: { per_page: 100 },
    })
    
    if (variations.length === 0) continue
    
    const productName = decodeHtml(wooProduct.name)
    console.log(`   Processing variations for: ${productName}`)
    
    for (const variation of variations) {
      // Check if variation already exists
      const variationSku = variation.sku || `${wooProduct.sku}-${variation.id}`
      const { data: existing } = await supabase
        .from('product_variations')
        .select('id')
        .eq('product_id', supabaseProductId)
        .eq('sku', variationSku)
        .single()
      
      if (existing) {
        console.log(`   ️ Skipping existing variation: ${variationSku}`)
        totalSkipped++
        continue
      }
      
      // Upload variation image if exists
      let imageUrl = variation.image?.src || null
      if (imageUrl) {
        console.log(`   📤 Uploading variation image...`)
        imageUrl = await uploadToCloudinary(imageUrl, 'variations')
      }
      
      // Extract color from attributes
      const colorAttr = variation.attributes?.find((a: any) => 
        a.name.toLowerCase() === 'color' || a.name.toLowerCase() === 'colour'
      )
      
      const { error } = await supabase
        .from('product_variations')
        .insert({
          product_id: supabaseProductId,
          sku: variationSku,
          color_name: colorAttr?.option || '',
          color_hex: '#000000',
          price: parseFloat(variation.price) || 0,
          stock: variation.stock_quantity || 0,
          image_url: imageUrl,
          is_active: true,
        })
      
      if (error) {
        console.error(`   ❌ Failed to insert variation for ${productName}:`, error.message)
        continue
      }
      
      totalImported++
      console.log(`   ✅ Imported variation: ${variationSku}`)
      
      await delay(200)
    }
  }
  
  console.log(`   ✅ Variations import complete! Imported: ${totalImported}, Skipped: ${totalSkipped}`)
}

// Main execution
async function main() {
  console.log('🚀 Starting WooCommerce to Supabase import...')
  console.log(`   WooCommerce: ${WOO_URL}`)
  console.log(`   Supabase: ${SUPABASE_URL}`)
  console.log(`   Cloudinary: ${cloudinaryConfigured ? 'Configured' : 'Not configured'}`)
  
  try {
    // Step 1: Import categories first
    const categoryMap = await importCategories()
    
    // Step 2: Import products
    const productMap = await importProducts(categoryMap)
    
    // Step 3: Import variations
    await importVariations(productMap)
    
    console.log('\n🎉 Import completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`   Categories: ${categoryMap.size}`)
    console.log(`   Products: ${productMap.size}`)
    console.log('\n✅ Next steps:')
    console.log('   1. Verify data in Supabase dashboard')
    console.log('   2. Enable "both" mode in admin settings')
    console.log('   3. Test website and admin panel')
    
  } catch (error: any) {
    console.error('\n❌ Import failed:', error.message)
    if (error.response) {
      console.error('   Response:', error.response.data)
    }
    process.exit(1)
  }
}

main()
