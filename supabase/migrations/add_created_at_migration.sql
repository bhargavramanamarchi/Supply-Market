-- Safe Database Migration: Add created_at column to public.Suppliers table
-- This script adds the column if it doesn't exist, backfills existing records, and marks it NOT NULL.

BEGIN;

-- 1. Add created_at column if not exists
ALTER TABLE public.Suppliers 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Populate any existing rows where created_at might be NULL (pre-existing data)
UPDATE public.Suppliers 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- 3. Set NOT NULL constraint on the column
ALTER TABLE public.Suppliers 
ALTER COLUMN created_at SET NOT NULL;

COMMIT;
