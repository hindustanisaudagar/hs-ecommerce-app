-- Migration: Add section-specific banner images
-- Date: 2026-05-21

-- Add banner images for each rich content section
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_story_banner TEXT,
ADD COLUMN IF NOT EXISTS tradition_banner TEXT,
ADD COLUMN IF NOT EXISTS made_in_india_banner TEXT;

COMMENT ON COLUMN products.product_story_banner IS 'Banner image for Product Story section';
COMMENT ON COLUMN products.tradition_banner IS 'Banner image for Tradition section';
COMMENT ON COLUMN products.made_in_india_banner IS 'Banner image for Made in India section';
