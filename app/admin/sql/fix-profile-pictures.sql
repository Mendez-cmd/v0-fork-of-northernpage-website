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
    RAISE NOTICE 'Added profile_picture column to users table';
  ELSE
    RAISE NOTICE 'profile_picture column already exists in users table';
  END IF;
END $$;

-- Create storage bucket for profile pictures if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM storage.buckets
    WHERE name = 'profile-pictures'
  ) THEN
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('profile-pictures', 'profile-pictures', true);
    RAISE NOTICE 'Created profile-pictures storage bucket';
  ELSE
    RAISE NOTICE 'profile-pictures storage bucket already exists';
  END IF;
END $$;

-- Add storage policy to allow authenticated users to upload profile pictures
DO $$
DECLARE
  bucket_id UUID;
BEGIN
  SELECT id INTO bucket_id FROM storage.buckets WHERE name = 'profile-pictures';
  
  IF NOT EXISTS (
    SELECT FROM storage.policies
    WHERE bucket_id = bucket_id
    AND name = 'Allow authenticated users to upload profile pictures'
  ) THEN
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES (
      'Allow authenticated users to upload profile pictures',
      '(auth.role() = ''authenticated'')',
      bucket_id
    );
    RAISE NOTICE 'Added upload policy for profile pictures';
  ELSE
    RAISE NOTICE 'Upload policy for profile pictures already exists';
  END IF;
END $$;

-- Add storage policy to allow public access to profile pictures
DO $$
DECLARE
  bucket_id UUID;
BEGIN
  SELECT id INTO bucket_id FROM storage.buckets WHERE name = 'profile-pictures';
  
  IF NOT EXISTS (
    SELECT FROM storage.policies
    WHERE bucket_id = bucket_id
    AND name = 'Allow public access to profile pictures'
  ) THEN
    INSERT INTO storage.policies (name, definition, bucket_id)
    VALUES (
      'Allow public access to profile pictures',
      'true',
      bucket_id
    );
    RAISE NOTICE 'Added public access policy for profile pictures';
  ELSE
    RAISE NOTICE 'Public access policy for profile pictures already exists';
  END IF;
END $$;

-- Verify the profile_picture column exists
SELECT column_name 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name = 'users' 
AND column_name = 'profile_picture';

-- Verify the storage bucket exists
SELECT * FROM storage.buckets WHERE name = 'profile-pictures';

-- Verify the storage policies exist
SELECT * FROM storage.policies 
WHERE bucket_id = (SELECT id FROM storage.buckets WHERE name = 'profile-pictures');
