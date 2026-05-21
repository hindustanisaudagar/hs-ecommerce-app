-- Migration: Add local hands banner field
-- Date: 2026-05-21

ALTER TABLE products 
ADD COLUMN IF NOT EXISTS local_hands_banner TEXT;

COMMENT ON COLUMN products.local_hands_banner IS 'Banner image for "Local Hands, Global Elegance" section';
