-- Create Personas Table with German demographic data
-- Stores user-generated personas with comprehensive demographic information

CREATE TABLE IF NOT EXISTS personas_pg2024 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Basic Information
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  age INTEGER NOT NULL CHECK (age >= 18 AND age <= 100),
  gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
  avatar TEXT,
  
  -- Demographic Information
  age_group TEXT NOT NULL CHECK (age_group IN ('young_adults', 'adults', 'middle_age', 'senior', 'elderly')),
  age_group_label TEXT NOT NULL,
  
  -- Location
  location TEXT NOT NULL,
  is_urban BOOLEAN NOT NULL DEFAULT false,
  
  -- Professional Information
  job_title TEXT NOT NULL,
  annual_income INTEGER NOT NULL CHECK (annual_income >= 0),
  income_quintile TEXT NOT NULL CHECK (income_quintile IN ('lowest', 'lower_middle', 'middle', 'upper_middle', 'highest')),
  income_quintile_label TEXT NOT NULL,
  
  -- Household Information
  household_type TEXT NOT NULL CHECK (household_type IN ('single', 'couple_no_children', 'adults_no_children', 'single_parent', 'couple_with_children', 'adults_with_children')),
  household_type_label TEXT NOT NULL,
  household_size INTEGER NOT NULL CHECK (household_size >= 1),
  
  -- Housing Information
  housing_type TEXT NOT NULL CHECK (housing_type IN ('owner', 'renter')),
  housing_type_label TEXT NOT NULL,
  
  -- Consumer Behavior (stored as JSONB for flexibility)
  owned_goods JSONB NOT NULL DEFAULT '{}',
  spending_habits JSONB NOT NULL DEFAULT '{}',
  
  -- Psychographic Profile
  goals TEXT[] NOT NULL DEFAULT '{}',
  pain_points TEXT[] NOT NULL DEFAULT '{}',
  motivations TEXT[] NOT NULL DEFAULT '{}',
  
  -- Metadata
  data_source TEXT NOT NULL DEFAULT 'simulated' CHECK (data_source IN ('simulated', 'real')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE personas_pg2024 ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own personas
CREATE POLICY "Users can view own personas" ON personas_pg2024
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own personas
CREATE POLICY "Users can insert own personas" ON personas_pg2024
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own personas
CREATE POLICY "Users can update own personas" ON personas_pg2024
  FOR UPDATE USING (auth.uid() = user_id);

-- Policy: Users can delete their own personas
CREATE POLICY "Users can delete own personas" ON personas_pg2024
  FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_personas_user_id ON personas_pg2024 (user_id);
CREATE INDEX IF NOT EXISTS idx_personas_age_group ON personas_pg2024 (age_group);
CREATE INDEX IF NOT EXISTS idx_personas_income_quintile ON personas_pg2024 (income_quintile);
CREATE INDEX IF NOT EXISTS idx_personas_household_type ON personas_pg2024 (household_type);
CREATE INDEX IF NOT EXISTS idx_personas_created_at ON personas_pg2024 (created_at DESC);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_personas_updated_at 
  BEFORE UPDATE ON personas_pg2024 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create table for demographic statistics cache
CREATE TABLE IF NOT EXISTS demographic_cache_pg2024 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cache_key TEXT NOT NULL UNIQUE,
  data JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL
);

-- Enable RLS for cache table
ALTER TABLE demographic_cache_pg2024 ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all users to read cache (demographic data is public)
CREATE POLICY "Allow all to read demographic cache" ON demographic_cache_pg2024
  FOR SELECT USING (true);

-- Policy: Allow system to manage cache
CREATE POLICY "Allow system to manage cache" ON demographic_cache_pg2024
  FOR ALL USING (true);

-- Create index for cache performance
CREATE INDEX IF NOT EXISTS idx_demographic_cache_key ON demographic_cache_pg2024 (cache_key);
CREATE INDEX IF NOT EXISTS idx_demographic_cache_expires ON demographic_cache_pg2024 (expires_at);

-- Create function to clean expired cache entries
CREATE OR REPLACE FUNCTION clean_expired_cache()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  DELETE FROM demographic_cache_pg2024 WHERE expires_at < NOW();
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Create table for user preferences
CREATE TABLE IF NOT EXISTS user_preferences_pg2024 (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  preferences JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for user preferences
ALTER TABLE user_preferences_pg2024 ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only access their own preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences_pg2024
  FOR ALL USING (auth.uid() = user_id);

-- Create trigger for user preferences updated_at
CREATE TRIGGER update_user_preferences_updated_at 
  BEFORE UPDATE ON user_preferences_pg2024 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();