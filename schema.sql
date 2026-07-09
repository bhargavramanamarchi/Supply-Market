-- Database Schema for Supply Market AI Platform
-- Split from monolithic database script, fully compatible with Supabase PostgreSQL.

-- Enable Row Level Security by default.
-- Ensure uuid extension is available.
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables to ensure clean slate (order matters due to foreign keys)
DROP TABLE IF EXISTS public.AIRecommendations CASCADE;
DROP TABLE IF EXISTS public.BuyerRequests CASCADE;
DROP TABLE IF EXISTS public.Products CASCADE;
DROP TABLE IF EXISTS public.Suppliers CASCADE;
DROP TABLE IF EXISTS public.Users CASCADE;

-- 1. Create public.Users table
-- Maps directly to auth.users (Supabase Auth table)
CREATE TABLE public.Users (
    id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name text NOT NULL,
    email text NOT NULL,
    organization text,
    phone text,
    account_type text NOT NULL CHECK (account_type IN ('buyer', 'seller', 'both')),
    city text,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 2. Create public.Suppliers table
-- References Users.id to connect profiles
CREATE TABLE public.Suppliers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES public.Users(id) ON DELETE CASCADE,
    company_name text NOT NULL,
    location text NOT NULL,
    verified boolean DEFAULT false NOT NULL,
    rating numeric(3,2) DEFAULT 5.00 NOT NULL CHECK (rating >= 0.00 AND rating <= 5.00),
    trust_score numeric(5,2) DEFAULT 95.00 NOT NULL CHECK (trust_score >= 0.00 AND trust_score <= 100.00),
    contact_number text,
    business_hours text
);

-- 3. Create public.Products table
-- References Suppliers.id
CREATE TABLE public.Products (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id uuid NOT NULL REFERENCES public.Suppliers(id) ON DELETE CASCADE,
    product_name text NOT NULL,
    category text NOT NULL,
    quantity integer NOT NULL DEFAULT 0 CHECK (quantity >= 0),
    unit text NOT NULL,
    price numeric(12,2) NOT NULL DEFAULT 0.00 CHECK (price >= 0.00),
    description text,
    available boolean DEFAULT true NOT NULL
);

-- 4. Create public.BuyerRequests table
-- References Users.id (who must be a buyer or both)
CREATE TABLE public.BuyerRequests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    buyer_id uuid NOT NULL REFERENCES public.Users(id) ON DELETE CASCADE,
    requirement text NOT NULL,
    language text NOT NULL,
    status text NOT NULL DEFAULT 'active',
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- 5. Create public.AIRecommendations table
-- Connects a BuyerRequest and a Supplier
CREATE TABLE public.AIRecommendations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id uuid NOT NULL REFERENCES public.BuyerRequests(id) ON DELETE CASCADE,
    supplier_id uuid NOT NULL REFERENCES public.Suppliers(id) ON DELETE CASCADE,
    confidence_score numeric(5,2) NOT NULL CHECK (confidence_score >= 0.00 AND confidence_score <= 100.00),
    created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Create Indexes for foreign keys and common search targets to optimize performance
CREATE INDEX IF NOT EXISTS idx_suppliers_user_id ON public.Suppliers(user_id);
CREATE INDEX IF NOT EXISTS idx_products_supplier_id ON public.Products(supplier_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.Products(category);
CREATE INDEX IF NOT EXISTS idx_buyer_requests_buyer_id ON public.BuyerRequests(buyer_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_request_id ON public.AIRecommendations(request_id);
CREATE INDEX IF NOT EXISTS idx_ai_recommendations_supplier_id ON public.AIRecommendations(supplier_id);

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE public.Users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.Products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.BuyerRequests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.AIRecommendations ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------
-- RLS POLICIES
-- ----------------------------------------------------

-- public.Users Policies
CREATE POLICY "Allow public read access to Users profiles" 
    ON public.Users FOR SELECT 
    USING (true);

CREATE POLICY "Allow individual user insert into Users profile" 
    ON public.Users FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Allow individual user update of Users profile" 
    ON public.Users FOR UPDATE 
    USING (auth.uid() = id);

-- public.Suppliers Policies
CREATE POLICY "Allow public read access to Suppliers" 
    ON public.Suppliers FOR SELECT 
    USING (true);

CREATE POLICY "Allow seller to insert their own Supplier profile" 
    ON public.Suppliers FOR INSERT 
    WITH CHECK (
        auth.uid() = user_id 
        AND EXISTS (
            SELECT 1 FROM public.Users 
            WHERE id = auth.uid() 
            AND account_type IN ('seller', 'both')
        )
    );

CREATE POLICY "Allow seller to update their own Supplier profile" 
    ON public.Suppliers FOR UPDATE 
    USING (auth.uid() = user_id);

-- public.Products Policies
CREATE POLICY "Allow public read access to Products" 
    ON public.Products FOR SELECT 
    USING (true);

CREATE POLICY "Allow seller to insert Products" 
    ON public.Products FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.Suppliers 
            WHERE id = supplier_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Allow seller to update/delete Products" 
    ON public.Products FOR ALL 
    USING (
        EXISTS (
            SELECT 1 FROM public.Suppliers 
            WHERE id = supplier_id 
            AND user_id = auth.uid()
        )
    );

-- public.BuyerRequests Policies
CREATE POLICY "Allow buyer to select their own BuyerRequests" 
    ON public.BuyerRequests FOR SELECT 
    USING (auth.uid() = buyer_id);

CREATE POLICY "Allow buyer to insert their own BuyerRequests" 
    ON public.BuyerRequests FOR INSERT 
    WITH CHECK (auth.uid() = buyer_id);

CREATE POLICY "Allow buyer to update/delete their own BuyerRequests" 
    ON public.BuyerRequests FOR ALL 
    USING (auth.uid() = buyer_id);

-- public.AIRecommendations Policies
CREATE POLICY "Allow buyer or seller to read AIRecommendations" 
    ON public.AIRecommendations FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.BuyerRequests 
            WHERE id = request_id 
            AND buyer_id = auth.uid()
        ) 
        OR 
        EXISTS (
            SELECT 1 FROM public.Suppliers 
            WHERE id = supplier_id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Allow authenticated user to insert AIRecommendations" 
    ON public.AIRecommendations FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.BuyerRequests 
            WHERE id = request_id 
            AND buyer_id = auth.uid()
        )
    );
