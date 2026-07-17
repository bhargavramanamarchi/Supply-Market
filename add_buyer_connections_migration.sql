-- Safe Database Migration: Create buyer_connections table
-- This script creates the buyer_connections table, configures RLS, and sets access policies.

BEGIN;

CREATE TABLE IF NOT EXISTS public.buyer_connections (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id uuid NOT NULL REFERENCES public.Users(id) ON DELETE CASCADE,
    supplier_id uuid NOT NULL REFERENCES public.Suppliers(id) ON DELETE CASCADE,
    product_id uuid REFERENCES public.Products(id) ON DELETE SET NULL,
    status text NOT NULL DEFAULT 'Active',
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT unique_buyer_supplier_connection UNIQUE (buyer_id, supplier_id)
);

-- Create Indexes for buyer_connections
CREATE INDEX IF NOT EXISTS idx_buyer_connections_buyer_id ON public.buyer_connections(buyer_id);
CREATE INDEX IF NOT EXISTS idx_buyer_connections_supplier_id ON public.buyer_connections(supplier_id);
CREATE INDEX IF NOT EXISTS idx_buyer_connections_product_id ON public.buyer_connections(product_id);

-- Enable Row Level Security (RLS)
ALTER TABLE public.buyer_connections ENABLE ROW LEVEL SECURITY;

-- public.buyer_connections RLS Policies
-- Allow select for buyers (their own connections) and suppliers (connections they received)
CREATE POLICY "Allow select for buyers and suppliers" 
    ON public.buyer_connections FOR SELECT 
    USING (
        auth.uid() = buyer_id 
        OR EXISTS (
            SELECT 1 FROM public.Suppliers 
            WHERE id = supplier_id 
            AND user_id = auth.uid()
        )
    );

-- Allow insert for buyers
CREATE POLICY "Allow insert for buyers" 
    ON public.buyer_connections FOR INSERT 
    WITH CHECK (auth.uid() = buyer_id);

-- Allow update/delete for buyers and suppliers
CREATE POLICY "Allow update/delete for buyers and suppliers" 
    ON public.buyer_connections FOR ALL 
    USING (
        auth.uid() = buyer_id 
        OR EXISTS (
            SELECT 1 FROM public.Suppliers 
            WHERE id = supplier_id 
            AND user_id = auth.uid()
        )
    );

COMMIT;
