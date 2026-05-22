ALTER TABLE products ADD COLUMN IF NOT EXISTS parent_sku TEXT;

CREATE INDEX IF NOT EXISTS idx_products_parent_sku ON products(parent_sku);
