-- Seed Data for Supply Market AI Platform (Simplified Sourcing Hackathon Demo)
-- Execute after schema.sql

BEGIN;

-- ----------------------------------------------------
-- SEED USERS & SUPPLIERS (10 Sellers with Staggered Signup Dates)
-- ----------------------------------------------------

-- User & Supplier #1: Aditya Reddy (Ganesh Enterprises) - 10 Days Ago
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'seller1@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '10 days', now() - interval '10 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'Aditya Reddy', 'seller1@supplymarket.com', 'Ganesh Enterprises', '+91 90001 88001', 'seller', 'Vijayawada, Andhra Pradesh', now() - interval '10 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Ganesh Enterprises', 'Vijayawada, Andhra Pradesh', false, 4.10, 86.00, '+91 90001 88001', '09:00 AM - 06:00 PM', now() - interval '10 days') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #2: Amit Joshi (Rahul Traders) - 9 Days Ago
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000002', 'seller2@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '9 days', now() - interval '9 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000002', 'Amit Joshi', 'seller2@supplymarket.com', 'Rahul Traders', '+91 90002 88002', 'seller', 'Visakhapatnam, Andhra Pradesh', now() - interval '9 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000002', 'Rahul Traders', 'Visakhapatnam, Andhra Pradesh', false, 4.20, 87.00, '+91 90002 88002', '09:00 AM - 06:00 PM', now() - interval '9 days') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #3: Anil Kumar (Divya Corporation) - 8 Days Ago
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000003', 'seller3@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '8 days', now() - interval '8 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000003', 'Anil Kumar', 'seller3@supplymarket.com', 'Divya Corporation', '+91 90003 88003', 'seller', 'Chennai, Tamil Nadu', now() - interval '8 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000003', 'Divya Corporation', 'Chennai, Tamil Nadu', true, 4.30, 88.00, '+91 90003 88003', '09:00 AM - 06:00 PM', now() - interval '8 days') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #4: Arjun Sen (Sandhya Steel Mart) - 7 Days Ago
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000004', 'seller4@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '7 days', now() - interval '7 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000004', 'Arjun Sen', 'seller4@supplymarket.com', 'Sandhya Steel Mart', '+91 90004 88004', 'seller', 'Bengaluru, Karnataka', now() - interval '7 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000004', 'Sandhya Steel Mart', 'Bengaluru, Karnataka', false, 4.40, 89.00, '+91 90004 88004', '09:00 AM - 06:00 PM', now() - interval '7 days') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #5: Bhargav Choudhury (Bhargav Packaging Solutions) - 6 Days Ago
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000005', 'seller5@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '6 days', now() - interval '6 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000005', 'Bhargav Choudhury', 'seller5@supplymarket.com', 'Bhargav Packaging Solutions', '+91 90005 88005', 'seller', 'Warangal, Telangana', now() - interval '6 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000005', 'Bhargav Packaging Solutions', 'Warangal, Telangana', false, 4.50, 90.00, '+91 90005 88005', '09:00 AM - 06:00 PM', now() - interval '6 days') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #6: Dev Bhat (Nikhil Agro Products) - 5 Days Ago
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000006', 'seller6@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '5 days', now() - interval '5 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000006', 'Dev Bhat', 'seller6@supplymarket.com', 'Nikhil Agro Products', '+91 90006 88006', 'seller', 'Mumbai, Maharashtra', now() - interval '5 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000006', 'Nikhil Agro Products', 'Mumbai, Maharashtra', true, 4.60, 91.00, '+91 90006 88006', '09:00 AM - 06:00 PM', now() - interval '5 days') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #7: Ganesh Verma (Vikram Logistics) - 4 Days Ago
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000007', 'seller7@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '4 days', now() - interval '4 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000007', 'Ganesh Verma', 'seller7@supplymarket.com', 'Vikram Logistics', '+91 90007 88007', 'seller', 'Pune, Maharashtra', now() - interval '4 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000007', 'Vikram Logistics', 'Pune, Maharashtra', false, 4.70, 92.00, '+91 90007 88007', '09:00 AM - 06:00 PM', now() - interval '4 days') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #8: Hari Rao (Priya Tech Circuits) - 3 Days Ago
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000008', 'seller8@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '3 days', now() - interval '3 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000008', 'Hari Rao', 'seller8@supplymarket.com', 'Priya Tech Circuits', '+91 90008 88008', 'seller', 'Ahmedabad, Gujarat', now() - interval '3 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000008', 'Priya Tech Circuits', 'Ahmedabad, Gujarat', false, 4.80, 93.00, '+91 90008 88008', '09:00 AM - 06:00 PM', now() - interval '3 days') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #9: Ishaan Mehta (Anil Supply Corp) - 2 Days Ago
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000009', 'seller9@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '2 days', now() - interval '2 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000009', 'Ishaan Mehta', 'seller9@supplymarket.com', 'Anil Supply Corp', '+91 90009 88009', 'seller', 'Coimbatore, Tamil Nadu', now() - interval '2 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-000000000009', '00000000-0000-0000-0000-000000000009', 'Anil Supply Corp', 'Coimbatore, Tamil Nadu', true, 4.90, 94.00, '+91 90009 88009', '09:00 AM - 06:00 PM', now() - interval '2 days') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #10: Karan Singh (Karan Industries) - 1 Day Ago (NEWEST SELLER)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000000a', 'seller10@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now() - interval '1 days', now() - interval '1 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000000a', 'Karan Singh', 'seller10@supplymarket.com', 'Karan Industries', '+91 90010 88010', 'seller', 'Hyderabad, Telangana', now() - interval '1 days') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours, created_at)
VALUES ('00000000-0000-0000-0001-00000000000a', '00000000-0000-0000-0000-00000000000a', 'Karan Industries', 'Hyderabad, Telangana', false, 5.00, 95.00, '+91 90010 88010', '09:00 AM - 06:00 PM', now() - interval '1 days') ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------
-- SEED USERS (10 Buyers)
-- ----------------------------------------------------

-- Buyer #1: Divya Das
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003e9', 'buyer1@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003e9', 'Divya Das', 'buyer1@supplymarket.com', 'Aditya Reddy Enterprises', '+91 80001 77001', 'buyer', 'Mumbai, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;

-- Buyer #2: Kavitha Prasad
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003ea', 'buyer2@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003ea', 'Kavitha Prasad', 'buyer2@supplymarket.com', 'Amit Joshi Enterprises', '+91 80002 77002', 'buyer', 'Pune, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;

-- Buyer #3: Lakshmi Shetty
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003eb', 'buyer3@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003eb', 'Lakshmi Shetty', 'buyer3@supplymarket.com', 'Anil Kumar Enterprises', '+91 80003 77003', 'buyer', 'Ahmedabad, Gujarat', now()) ON CONFLICT (id) DO NOTHING;

-- Buyer #4: Neha Patel
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003ec', 'buyer4@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003ec', 'Neha Patel', 'buyer4@supplymarket.com', 'Arjun Sen Enterprises', '+91 80004 77004', 'buyer', 'Coimbatore, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;

-- Buyer #5: Pooja Marchi
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003ed', 'buyer5@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003ed', 'Pooja Marchi', 'buyer5@supplymarket.com', 'Bhargav Choudhury Enterprises', '+91 80005 77005', 'buyer', 'Hyderabad, Telangana', now()) ON CONFLICT (id) DO NOTHING;

-- Buyer #6: Priya Nair
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003ee', 'buyer6@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003ee', 'Priya Nair', 'buyer6@supplymarket.com', 'Dev Bhat Enterprises', '+91 80006 77006', 'buyer', 'Vijayawada, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;

-- Buyer #7: Sai Gupta
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003ef', 'buyer7@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003ef', 'Sai Gupta', 'buyer7@supplymarket.com', 'Ganesh Verma Enterprises', '+91 80007 77007', 'buyer', 'Visakhapatnam, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;

-- Buyer #8: Sandhya Pillai
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003f0', 'buyer8@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003f0', 'Sandhya Pillai', 'buyer8@supplymarket.com', 'Hari Rao Enterprises', '+91 80008 77008', 'buyer', 'Chennai, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;

-- Buyer #9: Sunitha Naidu
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003f1', 'buyer9@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003f1', 'Sunitha Naidu', 'buyer9@supplymarket.com', 'Ishaan Mehta Enterprises', '+91 80009 77009', 'buyer', 'Bengaluru, Karnataka', now()) ON CONFLICT (id) DO NOTHING;

-- Buyer #10: Aarav Sharma
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-0000000003f2', 'buyer10@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-0000000003f2', 'Aarav Sharma', 'buyer10@supplymarket.com', 'Karan Singh Enterprises', '+91 80010 77010', 'buyer', 'Warangal, Telangana', now()) ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------
-- SEED PRODUCTS (Exactly 2 representative products per Supplier)
-- ----------------------------------------------------

-- Products for Supplier #1 (Ganesh Enterprises) - Rice
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', 'Bulk Superfine Basmati Rice', 'Rice', 613, 'kg', 90.00, '1121 long grain aged basmati rice, perfect for biryanis and fine dining.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', 'Sona Masoori Rice', 'Rice', 726, 'kg', 55.00, 'Aged Sona Masoori raw rice, low moisture, direct from mills.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #2 (Rahul Traders) - Cotton
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000002', 'Bulk Premium Shankar-6 Cotton', 'Cotton', 1065, 'kg', 170.00, 'High staple length combed cotton fiber, suitable for fine spinning.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000002', 'Bulk Combed Cotton Bales', 'Cotton', 1178, 'bale', 31900.00, 'Standard 170kg compressed cotton bales, organic certified.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #3 (Divya Corporation) - Steel
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0001-000000000003', 'Premium Structural Fe 550D TMT Rebars', 'Steel', 1517, 'ton', 49700.00, 'High ductile steel bars for structural reinforcement, seismic-resistant.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000000a', '00000000-0000-0000-0001-000000000003', 'Bulk Mild Steel Structural Pipes', 'Steel', 1630, 'kg', 55.00, 'Galvanized hollow circular pipes for structural frameworks.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #4 (Sandhya Steel Mart) - Packaging
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000000d', '00000000-0000-0000-0001-000000000004', 'Premium Corrugated Shipping Cartons', 'Packaging', 1969, 'piece', 20.00, '3-ply heavy-duty cardboard boxes, ideal for bulk shipping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000000e', '00000000-0000-0000-0001-000000000004', 'Premium Cushion Bubble Wrap Rolls', 'Packaging', 2082, 'roll', 660.00, 'Industrial strength bubble wrap rolls for safety wrapping.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #5 (Bhargav Packaging Solutions) - Cement
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000011', '00000000-0000-0000-0001-000000000005', 'Ordinary Portland Cement OPC-53', 'Cement', 2421, 'bag', 380.00, 'Roofing and foundation grade high-strength OPC cement bag (50kg).', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000012', '00000000-0000-0000-0001-000000000005', 'Premium Portland Pozzolana Cement PPC', 'Cement', 2534, 'bag', 365.00, 'Fly-ash based PPC cement, excellent durability and crack resistance.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #6 (Nikhil Agro Products) - Wood
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000015', '00000000-0000-0000-0001-000000000006', 'Bulk Teak Wood Planks', 'Wood', 2873, 'cubic-foot', 3100.00, 'Seasoned Indian teak timber planks, moisture-treated for high quality furniture.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000016', '00000000-0000-0000-0001-000000000006', 'Rosewood Lumber', 'Wood', 2986, 'cubic-foot', 4500.00, 'Premium Indian Rosewood (Sisu) lumber, dark grain, kiln dried.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #7 (Vikram Logistics) - Electronics
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000019', '00000000-0000-0000-0001-000000000007', 'Bulk Microcontroller Boards Uno', 'Electronics', 3325, 'piece', 370.00, 'ATmega328P compatible prototyping boards for custom electronics.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000001a', '00000000-0000-0000-0001-000000000007', 'Bulk Connector Jumper Cables Pack', 'Electronics', 3438, 'pack', 80.00, 'Breadboard hookup ribbon cable wires, male to female, 40 pins.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #8 (Priya Tech Circuits) - Turmeric
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000001d', '00000000-0000-0000-0001-000000000008', 'Premium Premium Turmeric Powder', 'Turmeric', 3777, 'kg', 130.00, 'Pure organic turmeric powder with high curcumin content, direct from local farms.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000001e', '00000000-0000-0000-0001-000000000008', 'Bulk Organic Turmeric Fingers', 'Turmeric', 3890, 'kg', 100.00, 'Sun-dried organic finger turmeric bulbs, high curcumin, unpolished.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #9 (Anil Supply Corp) - Rice
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000021', '00000000-0000-0000-0001-000000000009', 'Premium Superfine Basmati Rice', 'Rice', 4229, 'kg', 100.00, '1121 long grain aged basmati rice, perfect for biryanis and fine dining.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000022', '00000000-0000-0000-0001-000000000009', 'Premium Sona Masoori Rice', 'Rice', 4342, 'kg', 65.00, 'Aged Sona Masoori raw rice, low moisture, direct from mills.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #10 (Karan Industries) - Cotton
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000025', '00000000-0000-0000-0001-00000000000a', 'Premium Shankar-6 Cotton', 'Cotton', 4681, 'kg', 180.00, 'High staple length combed cotton fiber, suitable for fine spinning.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000026', '00000000-0000-0000-0001-00000000000a', 'Premium Combed Cotton Bales', 'Cotton', 4794, 'bale', 32100.00, 'Standard 170kg compressed cotton bales, organic certified.', true) ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------
-- SEED BUYER REQUESTS (20 Requests)
-- ----------------------------------------------------

-- Request #1 (Turmeric) by Buyer #1
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0000-0000000003e9', 'Need 5000 kg of pure organic turmeric powder for export, high curcumin content preferred.', 'English', 'active', now() - interval '1 days') ON CONFLICT (id) DO NOTHING;

-- Request #2 (Rice) by Buyer #2
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0000-0000000003ea', 'Sourcing aged Sona Masoori rice for distribution, looking for 20 tons delivery in Hyderabad.', 'English', 'active', now() - interval '2 days') ON CONFLICT (id) DO NOTHING;

-- Request #3 (Steel) by Buyer #3
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0000-0000000003eb', 'Urgent requirement for 500 TMT steel rebars (Fe 550D) for high-rise project in Visakhapatnam.', 'English', 'active', now() - interval '3 days') ON CONFLICT (id) DO NOTHING;

-- Request #4 (Cotton) by Buyer #4
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0000-0000000003ec', 'Looking for sustainable organic cotton fiber bales, minimum staple length 32mm, 50 bales.', 'Telugu', 'active', now() - interval '4 days') ON CONFLICT (id) DO NOTHING;

-- Request #5 (Packaging) by Buyer #5
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0000-0000000003ed', 'Need 10000 pieces of 3-ply heavy duty corrugated cardboard cartons for shipping.', 'Hindi', 'active', now() - interval '5 days') ON CONFLICT (id) DO NOTHING;

-- Request #6 (Cement) by Buyer #6
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0000-0000000003ee', 'Sourcing 500 bags of OPC-53 cement for foundation work, immediate delivery needed.', 'English', 'active', now() - interval '6 days') ON CONFLICT (id) DO NOTHING;

-- Request #7 (Wood) by Buyer #7
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0000-0000000003ef', 'Need premium teak wood planks seasoned for residential doors, approximately 200 cubic feet.', 'English', 'active', now() - interval '7 days') ON CONFLICT (id) DO NOTHING;

-- Request #8 (Electronics) by Buyer #8
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0000-0000000003f0', 'Looking for microcontroller boards compatible with Arduino Uno for education kit, 1000 units.', 'Telugu', 'active', now() - interval '8 days') ON CONFLICT (id) DO NOTHING;

-- Request #9 (Turmeric) by Buyer #9
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000009', '00000000-0000-0000-0000-0000000003f1', 'High grade turmeric finger dried bulbs needed for extraction facility, 10 tons raw material.', 'English', 'active', now() - interval '9 days') ON CONFLICT (id) DO NOTHING;

-- Request #10 (Rice) by Buyer #10
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-00000000000a', '00000000-0000-0000-0000-0000000003f2', 'Need 10 tons of 1121 Basmati Rice long grain aged 2 years, packaging in 25kg bags.', 'Hindi', 'active', now() - interval '10 days') ON CONFLICT (id) DO NOTHING;

-- Request #11 (Steel) by Buyer #1
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-00000000000b', '00000000-0000-0000-0000-0000000003e9', 'Sourcing Mild Steel structural pipes for warehouse structural frames, 5 tons.', 'English', 'active', now() - interval '11 days') ON CONFLICT (id) DO NOTHING;

-- Request #12 (Cotton) by Buyer #2
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-00000000000c', '00000000-0000-0000-0000-0000000003ea', 'Looking for combed cotton yarn spinners, count 40s combed, need 1000 kg.', 'Telugu', 'active', now() - interval '12 days') ON CONFLICT (id) DO NOTHING;

-- Request #13 (Packaging) by Buyer #3
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-00000000000d', '00000000-0000-0000-0000-0000000003eb', 'Need bubble wrap rolls for safety wrapping, 200 rolls with immediate delivery to Bengaluru.', 'English', 'active', now() - interval '13 days') ON CONFLICT (id) DO NOTHING;

-- Request #14 (Cement) by Buyer #4
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-00000000000e', '00000000-0000-0000-0000-0000000003ec', 'Looking for Portland Pozzolana Cement PPC for plastering work, need 300 bags in Chennai.', 'English', 'active', now() - interval '14 days') ON CONFLICT (id) DO NOTHING;

-- Request #15 (Wood) by Buyer #5
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-00000000000f', '00000000-0000-0000-0000-0000000003ed', 'Seasoned rosewood lumber required for high end luxury cabinets, 100 cubic feet.', 'Hindi', 'active', now() - interval '15 days') ON CONFLICT (id) DO NOTHING;

-- Request #16 (Electronics) by Buyer #6
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000010', '00000000-0000-0000-0000-0000000003ee', 'Need jumper wire connector cables, breadboards, and LCD displays for DIY kits, 500 packs each.', 'Telugu', 'completed', now() - interval '16 days') ON CONFLICT (id) DO NOTHING;

-- Request #17 (Turmeric) by Buyer #7
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000011', '00000000-0000-0000-0000-0000000003ef', 'Bulk turmeric double polished fingers, Nizamabad variety, 5 tons.', 'English', 'completed', now() - interval '17 days') ON CONFLICT (id) DO NOTHING;

-- Request #18 (Rice) by Buyer #8
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000012', '00000000-0000-0000-0000-0000000003f0', 'Sourcing Ponni boiled rice for supermarket chain in Tamil Nadu, 500 bags of 25kg.', 'English', 'completed', now() - interval '18 days') ON CONFLICT (id) DO NOTHING;

-- Request #19 (Steel) by Buyer #9
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000013', '00000000-0000-0000-0000-0000000003f1', 'Galvanized iron wire rolls for agricultural fencing, need 150 rolls.', 'English', 'completed', now() - interval '19 days') ON CONFLICT (id) DO NOTHING;

-- Request #20 (Packaging) by Buyer #10
INSERT INTO public.BuyerRequests (id, buyer_id, requirement, language, status, created_at)
VALUES ('00000000-0000-0000-0003-000000000014', '00000000-0000-0000-0000-0000000003f2', 'Stretch wrap packing film rolls for pallet wrapping, 300 rolls required.', 'Telugu', 'completed', now() - interval '20 days') ON CONFLICT (id) DO NOTHING;


-- ----------------------------------------------------
-- SEED AI RECOMMENDATIONS (10 Recommendations)
-- ----------------------------------------------------

-- AI Match for Request #1 (Turmeric) -> Supplier #8
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-000000000001', '00000000-0000-0000-0003-000000000001', '00000000-0000-0000-0001-000000000008', 91.72, now() - interval '1 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

-- AI Match for Request #2 (Rice) -> Supplier #1
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-000000000002', '00000000-0000-0000-0003-000000000002', '00000000-0000-0000-0001-000000000001', 92.96, now() - interval '2 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

-- AI Match for Request #3 (Steel) -> Supplier #3
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-000000000003', '00000000-0000-0000-0003-000000000003', '00000000-0000-0000-0001-000000000003', 93.64, now() - interval '3 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

-- AI Match for Request #4 (Cotton) -> Supplier #2
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-000000000004', '00000000-0000-0000-0003-000000000004', '00000000-0000-0000-0001-000000000002', 94.90, now() - interval '4 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

-- AI Match for Request #5 (Packaging) -> Supplier #4
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-000000000005', '00000000-0000-0000-0003-000000000005', '00000000-0000-0000-0001-000000000004', 95.90, now() - interval '5 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

-- AI Match for Request #6 (Cement) -> Supplier #5
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-000000000006', '00000000-0000-0000-0003-000000000006', '00000000-0000-0000-0001-000000000005', 96.73, now() - interval '6 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

-- AI Match for Request #7 (Wood) -> Supplier #6
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-000000000007', '00000000-0000-0000-0003-000000000007', '00000000-0000-0000-0001-000000000006', 98.00, now() - interval '7 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

-- AI Match for Request #8 (Electronics) -> Supplier #7
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-000000000008', '00000000-0000-0000-0003-000000000008', '00000000-0000-0000-0001-000000000007', 98.55, now() - interval '8 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

-- AI Match for Request #9 (Turmeric) -> Supplier #8
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-000000000009', '00000000-0000-0000-0003-000000000009', '00000000-0000-0000-0001-000000000008', 99.79, now() - interval '9 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

-- AI Match for Request #10 (Rice) -> Supplier #1
INSERT INTO public.AIRecommendations (id, request_id, supplier_id, confidence_score, created_at)
VALUES ('00000000-0000-0000-0004-00000000000a', '00000000-0000-0000-0003-00000000000a', '00000000-0000-0000-0001-000000000001', 90.15, now() - interval '10 days' + interval '2 hours') ON CONFLICT (id) DO NOTHING;

COMMIT;