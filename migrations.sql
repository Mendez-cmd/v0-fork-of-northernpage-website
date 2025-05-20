-- Add profile_picture column to users table if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_schema = 'public' 
    AND table_name = 'users' 
    AND column_name = 'profile_picture'
  ) THEN
    ALTER TABLE users ADD COLUMN profile_picture TEXT;
  END IF;
END $$;

-- Create storage bucket for profile pictures if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-pictures', 'profile-pictures', true)
ON CONFLICT (id) DO NOTHING;

-- Add storage policy to allow authenticated users to upload profile pictures
INSERT INTO storage.policies (name, definition, bucket_id)
SELECT 
  'Allow authenticated users to upload profile pictures',
  '(auth.role() = ''authenticated'')',
  id
FROM storage.buckets
WHERE name = 'profile-pictures'
ON CONFLICT (name, bucket_id) DO NOTHING;

-- Add storage policy to allow public access to profile pictures
INSERT INTO storage.policies (name, definition, bucket_id)
SELECT 
  'Allow public access to profile pictures',
  'true',
  id
FROM storage.buckets
WHERE name = 'profile-pictures'
ON CONFLICT (name, bucket_id) DO NOTHING;
