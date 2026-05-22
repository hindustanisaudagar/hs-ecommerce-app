-- Migration for Wholesale Settings
CREATE TABLE IF NOT EXISTS public.wholesale_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    banner_url TEXT,
    title TEXT,
    content JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Insert initial record
INSERT INTO public.wholesale_settings (title, content)
VALUES (
    'Hindustani Saudagar – Bulk & Wholesale Program',
    '{
        "hero_title": "Partner with us for Wholesale",
        "hero_description": "Expand your business with our unique, handcrafted ceramic collections.",
        "policy_highlights": [
            "Minimum Order: ₹25,000",
            "Competitive wholesale discounts",
            "Safe, export-grade packaging",
            "Proper GST tax invoices provided"
        ]
    }'
);
