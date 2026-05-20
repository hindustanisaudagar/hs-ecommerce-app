-- Create app_settings table
CREATE TABLE IF NOT EXISTS app_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL DEFAULT '{}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default settings
INSERT INTO app_settings (key, value) VALUES 
  ('backend_provider', '"supabase"'),
  ('woocommerce_url', 'null'),
  ('woocommerce_consumer_key', 'null'),
  ('woocommerce_consumer_secret', 'null')
ON CONFLICT (key) DO NOTHING;

-- Enable RLS
ALTER TABLE app_settings ENABLE ROW LEVEL SECURITY;

-- Allow admins to read settings
CREATE POLICY "Admins can read settings"
  ON app_settings
  FOR SELECT
  USING (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Allow admins to insert/update/delete settings
CREATE POLICY "Admins can write settings"
  ON app_settings
  FOR ALL
  WITH CHECK (
    auth.uid() IN (
      SELECT id FROM users WHERE role = 'admin'
    )
  );

-- Allow public read access to settings (needed for backend factory)
CREATE POLICY "Public can read settings"
  ON app_settings
  FOR SELECT
  USING (true);
