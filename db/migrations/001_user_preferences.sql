-- Migration: Add user_preferences table
-- This table stores user theme and locale preferences
-- Arabic (ar) is the default locale
-- Dark theme is the default theme

-- Create user_preferences table
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'dark' CHECK (theme IN ('dark', 'light')),
  locale TEXT NOT NULL DEFAULT 'ar' CHECK (locale IN ('ar', 'en')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_preferences_user_id ON user_preferences(user_id);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read their own preferences
CREATE POLICY "Users can read own preferences" 
ON user_preferences FOR SELECT 
USING (auth.uid() = user_id);

-- Policy: Users can update their own preferences
CREATE POLICY "Users can update own preferences" 
ON user_preferences FOR UPDATE 
USING (auth.uid() = user_id);

-- Policy: Users can insert their own preferences
CREATE POLICY "Users can insert own preferences" 
ON user_preferences FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Policy: Service role can do anything
CREATE POLICY "Service role full access"
ON user_preferences FOR ALL
USING (auth.jwt()->>'role' = 'service_role');

-- Create function to handle preference upsert
CREATE OR REPLACE FUNCTION upsert_user_preference(
  p_user_id UUID,
  p_theme TEXT DEFAULT 'dark',
  p_locale TEXT DEFAULT 'ar'
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO user_preferences (user_id, theme, locale, updated_at)
  VALUES (p_user_id, p_theme, p_locale, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    theme = EXCLUDED.theme,
    locale = EXCLUDED.locale,
    updated_at = NOW();
END;
$$;

-- Create function to get user preferences
CREATE OR REPLACE FUNCTION get_user_preference(p_user_id UUID)
RETURNS TABLE(theme TEXT, locale TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  RETURN QUERY
  SELECT COALESCE(up.theme, 'dark'::TEXT) AS theme, 
         COALESCE(up.locale, 'ar'::TEXT) AS locale
  FROM user_preferences up
  WHERE up.user_id = p_user_id;
END;
$$;