-- Safe Database Migration: Create buyer_follows table
-- This script creates the buyer_follows table, configures RLS, and sets access policies.

BEGIN;

CREATE TABLE IF NOT EXISTS public.buyer_follows (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id uuid NOT NULL REFERENCES public.Users(id) ON DELETE CASCADE,
    supplier_id uuid NOT NULL REFERENCES public.Suppliers(id) ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_buyer_supplier UNIQUE (buyer_id, supplier_id)
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.buyer_follows ENABLE ROW LEVEL SECURITY;

-- public.buyer_follows RLS Policies
-- Allow buyers to select their own follows
CREATE POLICY "Allow buyers to select their own follows" 
    ON public.buyer_follows FOR SELECT 
    USING (auth.uid() = buyer_id);

-- Allow buyers to insert their own follows
CREATE POLICY "Allow buyers to insert their own follows" 
    ON public.buyer_follows FOR INSERT 
    WITH CHECK (auth.uid() = buyer_id);

-- Allow buyers to delete their own follows
CREATE POLICY "Allow buyers to delete their own follows" 
    ON public.buyer_follows FOR DELETE 
    USING (auth.uid() = buyer_id);

COMMIT;
