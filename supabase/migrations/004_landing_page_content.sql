-- Create landing_page_content table for managing all landing page sections
CREATE TABLE IF NOT EXISTS landing_page_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section TEXT UNIQUE NOT NULL,
  content JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE landing_page_content ENABLE ROW LEVEL SECURITY;

-- Policy: Everyone can read
CREATE POLICY "Anyone can view landing page content"
  ON landing_page_content
  FOR SELECT
  USING (true);

-- Policy: Only admins can update
CREATE POLICY "Only admins can update landing page content"
  ON landing_page_content
  FOR ALL
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Insert default content for all sections
INSERT INTO landing_page_content (section, content) VALUES
  ('hero', '{
    "image": "/images/hero-product.jpg",
    "title_hindi": "बिताइए कुछ पल",
    "title_hindi_highlight": "देश की मिट्टी",
    "title_hindi_suffix": "के नाम।",
    "subtitle": "Earth, fire & the quiet hands of India.",
    "description": "Each piece in our collection is hand-thrown, kiln-fired, and studio-finished by skilled artisans across India. No two pieces are identical — that'\''s the beauty of handmade.",
    "cta_text": "Shop Collection",
    "cta_link": "#shop",
    "secondary_text": "Our Story",
    "secondary_link": "#story",
    "stats": [
      {"value": "180+", "label": "Artisan partners"},
      {"value": "12", "label": "Indian states"},
      {"value": "1-of-1", "label": "Hand-finished"}
    ]
  }'),
  ('marquee', '{
    "items": [
      "Hand-thrown",
      "Kiln-fired",
      "Studio-finished",
      "Made in India",
      "Artisan Crafted",
      "Sustainable",
      "One-of-a-kind",
      "Heritage Techniques"
    ]
  }'),
  ('trust_bar', '{
    "enabled": true,
    "items": [
      {"icon": "Truck", "title": "Free Shipping", "description": "On orders above ₹999"},
      {"icon": "Shield", "title": "Secure Payment", "description": "100% secure checkout"},
      {"icon": "RefreshCw", "title": "Easy Returns", "description": "7-day return policy"},
      {"icon": "Award", "title": "Premium Quality", "description": "Handcrafted with care"}
    ]
  }'),
  ('categories', '{
    "title": "Shop Your Favorite",
    "subtitle": "Collections",
    "view_all_link": "/products",
    "view_all_text": "View all"
  }'),
  ('studio_banner', '{
    "image": "/images/studio-banner.jpg",
    "label": "The Studio Edition",
    "title": "Where earth meets intention",
    "title_highlights": ["earth", "intention"],
    "description": "Discover our curated selection of studio pieces, each crafted with intention and finished with care.",
    "cta_text": "Explore Studio",
    "cta_link": "#studio"
  }'),
  ('bestsellers', '{
    "title": "Bestsellers",
    "subtitle": "Most Loved",
    "view_all_link": "/products",
    "view_all_text": "View all products",
    "limit": 8
  }'),
  ('brand_story', '{
    "image": "/images/artisan-story.jpg",
    "label": "Our Story",
    "title": "Preserving the art of Indian craft, one piece at a time",
    "title_highlights": ["art", "one piece"],
    "description_1": "Hindustani Saudagar was born from a simple belief: that the hands which shape clay also shape culture. We partner with over 180 artisans across 12 Indian states, bringing their centuries-old techniques to contemporary homes.",
    "description_2": "Every piece in our collection tells a story of patience, skill, and the quiet dedication of makers who have inherited their craft through generations. From the red earth of Rajasthan to the terracotta traditions of Bengal, each region brings its own unique aesthetic.",
    "hindi_quote": "हर टुकड़े में एक कहानी है",
    "hindi_quote_translation": "Every piece has a story",
    "stat_value": "30+",
    "stat_label": "Years of craft",
    "cta_text": "Read our story",
    "cta_link": "#about"
  }'),
  ('artisan_process', '{
    "label": "The Process",
    "title": "From earth to your home",
    "title_highlights": ["earth", "home"],
    "steps": [
      {"number": "01", "title": "Source the clay", "description": "We work with local clay sources across India, each region lending its unique texture and color to the final piece."},
      {"number": "02", "title": "Throw the form", "description": "Master potters shape each piece on traditional wheels, using techniques passed down through generations."},
      {"number": "03", "title": "Glaze & fire", "description": "Natural glazes and carefully controlled kiln temperatures transform raw clay into durable ceramics."},
      {"number": "04", "title": "Hand-finish", "description": "Every piece is inspected, refined, and finished by hand before earning the HS mark of quality."}
    ]
  }'),
  ('reviews', '{
    "label": "Testimonials",
    "title": "What our community says",
    "title_highlight": "community"
  }'),
  ('instagram', '{
    "label": "@hindustanisaudagar",
    "title": "Follow the studio",
    "title_highlight": "studio",
    "follow_link": "https://instagram.com",
    "follow_text": "Follow us",
    "images": [
      {"src": "/images/instagram-1.jpg", "alt": "Ceramic vase with dried flowers"},
      {"src": "/images/instagram-2.jpg", "alt": "Handmade mugs on shelf"},
      {"src": "/images/instagram-3.jpg", "alt": "Ceramic bowl with food"},
      {"src": "/images/instagram-4.jpg", "alt": "Mosaic lamp glowing"},
      {"src": "/images/instagram-5.jpg", "alt": "Pottery workshop"},
      {"src": "/images/instagram-6.jpg", "alt": "Finished ceramic pieces"}
    ]
  }'),
  ('newsletter', '{
    "label": "Exclusive Access",
    "title": "Join the studio",
    "title_highlight": "studio",
    "description": "Be the first to know about new collections, artisan stories, and exclusive offers. No spam, just beautiful things.",
    "placeholder": "Enter your email",
    "button_text": "Subscribe",
    "success_message": "Welcome to the studio family!",
    "disclaimer": "By subscribing, you agree to receive marketing communications. Unsubscribe anytime."
  }'),
  ('marketplaces', '{
    "label": "Available On",
    "title": "Find Us On",
    "items": [
      {"name": "Pepperfry", "logo": "/images/marketplaces/pepperfry.svg", "url": "https://www.pepperfry.com"},
      {"name": "JioMart", "logo": "/images/marketplaces/jiomart.svg", "url": "https://www.jiomart.com"},
      {"name": "Myntra", "logo": "/images/marketplaces/myntra.svg", "url": "https://www.myntra.com"},
      {"name": "Amazon", "logo": "/images/marketplaces/amazon.svg", "url": "https://www.amazon.in"},
      {"name": "Flipkart", "logo": "/images/marketplaces/flipkart.svg", "url": "https://www.flipkart.com"},
      {"name": "Wooden Street", "logo": "/images/marketplaces/wooden-street.svg", "url": "https://www.woodenstreet.com"}
    ]
  }'),
  ('footer', '{
    "brand_name": "Hindustani Saudagar",
    "brand_initials": "HS",
    "description": "Handcrafted ceramics from the heart of India. Each piece tells a story of tradition and artistry.",
    "hindi_tagline": "हस्तनिर्मित · देश की मिट्टी",
    "email": "hindustanisaudagar@gmail.com",
    "phone": "+91 8882667424",
    "address": "Plot no 13 First floor back side Ashoka Enclave sector 35 Kanishka Residency Faridabad, 121003 Haryana",
    "copyright": "2025 Hindustani Saudagar. All rights reserved.",
    "instagram_url": "https://instagram.com",
    "facebook_url": "https://facebook.com",
    "twitter_url": "https://twitter.com"
  }')
ON CONFLICT (section) DO NOTHING;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_landing_page_content_section ON landing_page_content(section);
