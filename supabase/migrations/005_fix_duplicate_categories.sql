-- Fix duplicate categories
-- Remove 'DINNNG' (typo) and keep 'DINING'

-- First, move any products from 'DINNNG' to 'DINING'
UPDATE products 
SET category_id = (SELECT id FROM categories WHERE slug = 'dining' LIMIT 1)
WHERE category_id = (SELECT id FROM categories WHERE slug = 'dinnng' LIMIT 1);

-- Delete the duplicate 'DINNNG' category
DELETE FROM categories WHERE slug = 'dinnng';
