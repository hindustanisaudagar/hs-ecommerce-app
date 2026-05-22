-- Add variation_id column to order_items table
ALTER TABLE order_items ADD COLUMN IF NOT EXISTS variation_id UUID REFERENCES product_variations(id);
