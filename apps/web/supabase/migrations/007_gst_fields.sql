-- Migration: Add GST fields to products and orders
-- Date: 2026-05-21
-- Business State: Haryana

-- Add GST rate to products (default 5% for handicrafts)
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS gst_rate DECIMAL(5,2) DEFAULT 5.00;

COMMENT ON COLUMN products.gst_rate IS 'GST rate percentage (e.g., 5.00 for 5%)';

-- Add tax fields to orders
ALTER TABLE orders 
ADD COLUMN IF NOT EXISTS cgst DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS sgst DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS igst DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS tax_amount DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10,2) DEFAULT 0;

COMMENT ON COLUMN orders.cgst IS 'Central GST amount';
COMMENT ON COLUMN orders.sgst IS 'State GST amount';
COMMENT ON COLUMN orders.igst IS 'Integrated GST amount';
COMMENT ON COLUMN orders.tax_amount IS 'Total tax amount (CGST+SGST or IGST)';
COMMENT ON COLUMN orders.subtotal IS 'Order subtotal before tax and shipping';
COMMENT ON COLUMN orders.shipping_cost IS 'Shipping cost';
