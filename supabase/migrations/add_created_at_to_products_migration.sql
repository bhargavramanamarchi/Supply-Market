-- Safe Database Migration: Add created_at column to public.Products table
-- This script adds the column if it doesn't exist, backfills existing records, and marks it NOT NULL.

BEGIN;

-- 1. Add created_at column if not exists
ALTER TABLE public.Products 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- 2. Populate any existing rows where created_at might be NULL (pre-existing data)
UPDATE public.Products 
SET created_at = NOW() 
WHERE created_at IS NULL;

-- 3. Set NOT NULL constraint on the column
ALTER TABLE public.Products 
ALTER COLUMN created_at SET NOT NULL;

COMMIT;
