-- Migration: Enhanced Product Details and Variations
-- Date: 2026-05-20

-- 1. Create product_variations table
CREATE TABLE IF NOT EXISTS product_variations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  
  -- Variation attributes (only color for now)
  color_name TEXT,
  color_hex TEXT,
  
  -- Pricing & Inventory (override base product)
  price DECIMAL(10, 2),
  stock INTEGER DEFAULT 0,
  
  -- Variation-specific image (only ONE image per variation)
  image_url TEXT,
  
  -- Status
  is_active BOOLEAN DEFAULT true,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(product_id, sku)
);

-- 2. Add new columns to products table
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS sku TEXT,
ADD COLUMN IF NOT EXISTS brand TEXT,
ADD COLUMN IF NOT EXISTS short_description TEXT,
ADD COLUMN IF NOT EXISTS specifications JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS safety_features TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]',
ADD COLUMN IF NOT EXISTS product_story TEXT,
ADD COLUMN IF NOT EXISTS tradition_section TEXT,
ADD COLUMN IF NOT EXISTS made_in_india_section TEXT,
ADD COLUMN IF NOT EXISTS handmade_disclaimer TEXT,
ADD COLUMN IF NOT EXISTS feature_icons TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS section_images TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS banner_image TEXT,
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS category_ids UUID[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS is_comparable BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS has_variations BOOLEAN DEFAULT false;

-- 3. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_variations_product ON product_variations(product_id);
CREATE INDEX IF NOT EXISTS idx_variations_sku ON product_variations(sku);
CREATE INDEX IF NOT EXISTS idx_variations_color ON product_variations(color_name);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);

-- 4. Update RLS policies for product_variations
ALTER TABLE product_variations ENABLE ROW LEVEL SECURITY;

-- Everyone can view active variations
CREATE POLICY "Variations are viewable by everyone" ON product_variations
  FOR SELECT USING (is_active = true);

-- Admins can manage variations (will be handled via API auth check)
CREATE POLICY "Admins can manage variations" ON product_variations
  FOR ALL USING (true);

-- 5. Add comment for documentation
COMMENT ON TABLE product_variations IS 'Stores product variations (color variants) with separate pricing and inventory';
COMMENT ON COLUMN product_variations.color_name IS 'Display name for the color variant';
COMMENT ON COLUMN product_variations.color_hex IS 'Hex color code for UI swatch display';
COMMENT ON COLUMN product_variations.image_url IS 'Single image URL for this variation (Cloudinary)';
