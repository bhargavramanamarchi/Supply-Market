-- Seed Data for Supply Market AI Platform
-- Split from monolithic script, execute after schema.sql

BEGIN;

-- ----------------------------------------------------
-- SEED USERS & SUPPLIERS (50 Sellers)
-- ----------------------------------------------------
-- User & Supplier #1: Aditya Reddy (Ganesh Enterprises)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'seller1@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000001', 'Aditya Reddy', 'seller1@supplymarket.com', 'Ganesh Enterprises', '+91 90001 88001', 'seller', 'Vijayawada, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000001', '00000000-0000-0000-0000-000000000001', 'Ganesh Enterprises', 'Vijayawada, Andhra Pradesh', false, 4.10, 86.00, '+91 90001 88001', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #2: Amit Joshi (Rahul Traders)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000002', 'seller2@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000002', 'Amit Joshi', 'seller2@supplymarket.com', 'Rahul Traders', '+91 90002 88002', 'seller', 'Visakhapatnam, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000002', '00000000-0000-0000-0000-000000000002', 'Rahul Traders', 'Visakhapatnam, Andhra Pradesh', false, 4.20, 87.00, '+91 90002 88002', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #3: Anil Kumar (Divya Corporation)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000003', 'seller3@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000003', 'Anil Kumar', 'seller3@supplymarket.com', 'Divya Corporation', '+91 90003 88003', 'seller', 'Chennai, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000003', '00000000-0000-0000-0000-000000000003', 'Divya Corporation', 'Chennai, Tamil Nadu', true, 4.30, 88.00, '+91 90003 88003', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #4: Arjun Sen (Sandhya Steel Mart)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000004', 'seller4@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000004', 'Arjun Sen', 'seller4@supplymarket.com', 'Sandhya Steel Mart', '+91 90004 88004', 'seller', 'Bengaluru, Karnataka', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000004', '00000000-0000-0000-0000-000000000004', 'Sandhya Steel Mart', 'Bengaluru, Karnataka', false, 4.40, 89.00, '+91 90004 88004', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #5: Bhargav Choudhury (Bhargav Packaging Solutions)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000005', 'seller5@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000005', 'Bhargav Choudhury', 'seller5@supplymarket.com', 'Bhargav Packaging Solutions', '+91 90005 88005', 'seller', 'Warangal, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000005', '00000000-0000-0000-0000-000000000005', 'Bhargav Packaging Solutions', 'Warangal, Telangana', false, 4.50, 90.00, '+91 90005 88005', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #6: Dev Bhat (Nikhil Agro Products)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000006', 'seller6@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000006', 'Dev Bhat', 'seller6@supplymarket.com', 'Nikhil Agro Products', '+91 90006 88006', 'seller', 'Mumbai, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000006', '00000000-0000-0000-0000-000000000006', 'Nikhil Agro Products', 'Mumbai, Maharashtra', true, 4.60, 91.00, '+91 90006 88006', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #7: Ganesh Verma (Vikram Logistics)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000007', 'seller7@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000007', 'Ganesh Verma', 'seller7@supplymarket.com', 'Vikram Logistics', '+91 90007 88007', 'seller', 'Pune, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000007', '00000000-0000-0000-0000-000000000007', 'Vikram Logistics', 'Pune, Maharashtra', false, 4.70, 92.00, '+91 90007 88007', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #8: Hari Rao (Priya Tech Circuits)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000008', 'seller8@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000008', 'Hari Rao', 'seller8@supplymarket.com', 'Priya Tech Circuits', '+91 90008 88008', 'seller', 'Ahmedabad, Gujarat', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000008', '00000000-0000-0000-0000-000000000008', 'Priya Tech Circuits', 'Ahmedabad, Gujarat', false, 4.80, 93.00, '+91 90008 88008', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #9: Ishaan Mehta (Anil Supply Corp)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000009', 'seller9@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000009', 'Ishaan Mehta', 'seller9@supplymarket.com', 'Anil Supply Corp', '+91 90009 88009', 'seller', 'Coimbatore, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000009', '00000000-0000-0000-0000-000000000009', 'Anil Supply Corp', 'Coimbatore, Tamil Nadu', true, 4.90, 94.00, '+91 90009 88009', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #10: Karan Singh (Karan Industries)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000000a', 'seller10@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000000a', 'Karan Singh', 'seller10@supplymarket.com', 'Karan Industries', '+91 90010 88010', 'seller', 'Hyderabad, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000000a', '00000000-0000-0000-0000-00000000000a', 'Karan Industries', 'Hyderabad, Telangana', false, 5.00, 95.00, '+91 90010 88010', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #11: Madhav Das (Suresh Enterprises)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000000b', 'seller11@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000000b', 'Madhav Das', 'seller11@supplymarket.com', 'Suresh Enterprises', '+91 90011 88011', 'seller', 'Vijayawada, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000000b', '00000000-0000-0000-0000-00000000000b', 'Suresh Enterprises', 'Vijayawada, Andhra Pradesh', false, 4.00, 96.00, '+91 90011 88011', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #12: Nikhil Prasad (Neha Traders)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000000c', 'seller12@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000000c', 'Nikhil Prasad', 'seller12@supplymarket.com', 'Neha Traders', '+91 90012 88012', 'seller', 'Visakhapatnam, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000000c', '00000000-0000-0000-0000-00000000000c', 'Neha Traders', 'Visakhapatnam, Andhra Pradesh', true, 4.10, 97.00, '+91 90012 88012', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #13: Pranav Shetty (Aditya Corporation)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000000d', 'seller13@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000000d', 'Pranav Shetty', 'seller13@supplymarket.com', 'Aditya Corporation', '+91 90013 88013', 'seller', 'Chennai, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000000d', '00000000-0000-0000-0000-00000000000d', 'Aditya Corporation', 'Chennai, Tamil Nadu', false, 4.20, 98.00, '+91 90013 88013', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #14: Rahul Patel (Hari Steel Mart)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000000e', 'seller14@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000000e', 'Rahul Patel', 'seller14@supplymarket.com', 'Hari Steel Mart', '+91 90014 88014', 'seller', 'Bengaluru, Karnataka', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000000e', '00000000-0000-0000-0000-00000000000e', 'Hari Steel Mart', 'Bengaluru, Karnataka', false, 4.30, 99.00, '+91 90014 88014', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #15: Rajesh Marchi (Rajesh Packaging Solutions)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000000f', 'seller15@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000000f', 'Rajesh Marchi', 'seller15@supplymarket.com', 'Rajesh Packaging Solutions', '+91 90015 88015', 'seller', 'Warangal, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000000f', '00000000-0000-0000-0000-00000000000f', 'Rajesh Packaging Solutions', 'Warangal, Telangana', true, 4.40, 100.00, '+91 90015 88015', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #16: Sanjay Nair (Kavitha Agro Products)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000010', 'seller16@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000010', 'Sanjay Nair', 'seller16@supplymarket.com', 'Kavitha Agro Products', '+91 90016 88016', 'seller', 'Mumbai, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000010', '00000000-0000-0000-0000-000000000010', 'Kavitha Agro Products', 'Mumbai, Maharashtra', false, 4.50, 85.00, '+91 90016 88016', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #17: Suresh Gupta (Sunitha Logistics)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000011', 'seller17@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000011', 'Suresh Gupta', 'seller17@supplymarket.com', 'Sunitha Logistics', '+91 90017 88017', 'seller', 'Pune, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000011', '00000000-0000-0000-0000-000000000011', 'Sunitha Logistics', 'Pune, Maharashtra', false, 4.60, 86.00, '+91 90017 88017', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #18: Vijay Pillai (Dev Tech Circuits)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000012', 'seller18@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000012', 'Vijay Pillai', 'seller18@supplymarket.com', 'Dev Tech Circuits', '+91 90018 88018', 'seller', 'Ahmedabad, Gujarat', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000012', '00000000-0000-0000-0000-000000000012', 'Dev Tech Circuits', 'Ahmedabad, Gujarat', true, 4.70, 87.00, '+91 90018 88018', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #19: Vikram Naidu (Pranav Supply Corp)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000013', 'seller19@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000013', 'Vikram Naidu', 'seller19@supplymarket.com', 'Pranav Supply Corp', '+91 90019 88019', 'seller', 'Coimbatore, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000013', '00000000-0000-0000-0000-000000000013', 'Pranav Supply Corp', 'Coimbatore, Tamil Nadu', false, 4.80, 88.00, '+91 90019 88019', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #20: Ananya Sharma (Ananya Industries)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000014', 'seller20@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000014', 'Ananya Sharma', 'seller20@supplymarket.com', 'Ananya Industries', '+91 90020 88020', 'seller', 'Hyderabad, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000014', '00000000-0000-0000-0000-000000000014', 'Ananya Industries', 'Hyderabad, Telangana', false, 4.90, 89.00, '+91 90020 88020', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #21: Divya Reddy (Sai Enterprises)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000015', 'seller21@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000015', 'Divya Reddy', 'seller21@supplymarket.com', 'Sai Enterprises', '+91 90021 88021', 'seller', 'Vijayawada, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000015', '00000000-0000-0000-0000-000000000015', 'Sai Enterprises', 'Vijayawada, Andhra Pradesh', true, 5.00, 90.00, '+91 90021 88021', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #22: Kavitha Joshi (Arjun Traders)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000016', 'seller22@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000016', 'Kavitha Joshi', 'seller22@supplymarket.com', 'Arjun Traders', '+91 90022 88022', 'seller', 'Visakhapatnam, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000016', '00000000-0000-0000-0000-000000000016', 'Arjun Traders', 'Visakhapatnam, Andhra Pradesh', false, 4.00, 91.00, '+91 90022 88022', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #23: Lakshmi Kumar (Madhav Corporation)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000017', 'seller23@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000017', 'Lakshmi Kumar', 'seller23@supplymarket.com', 'Madhav Corporation', '+91 90023 88023', 'seller', 'Chennai, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000017', '00000000-0000-0000-0000-000000000017', 'Madhav Corporation', 'Chennai, Tamil Nadu', false, 4.10, 92.00, '+91 90023 88023', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #24: Neha Sen (Vijay Steel Mart)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000018', 'seller24@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000018', 'Neha Sen', 'seller24@supplymarket.com', 'Vijay Steel Mart', '+91 90024 88024', 'seller', 'Bengaluru, Karnataka', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000018', '00000000-0000-0000-0000-000000000018', 'Vijay Steel Mart', 'Bengaluru, Karnataka', true, 4.20, 93.00, '+91 90024 88024', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #25: Pooja Choudhury (Pooja Packaging Solutions)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000019', 'seller25@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000019', 'Pooja Choudhury', 'seller25@supplymarket.com', 'Pooja Packaging Solutions', '+91 90025 88025', 'seller', 'Warangal, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000019', '00000000-0000-0000-0000-000000000019', 'Pooja Packaging Solutions', 'Warangal, Telangana', false, 4.30, 94.00, '+91 90025 88025', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #26: Priya Bhat (Amit Agro Products)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000001a', 'seller26@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000001a', 'Priya Bhat', 'seller26@supplymarket.com', 'Amit Agro Products', '+91 90026 88026', 'seller', 'Mumbai, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000001a', '00000000-0000-0000-0000-00000000001a', 'Amit Agro Products', 'Mumbai, Maharashtra', false, 4.40, 95.00, '+91 90026 88026', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #27: Sai Verma (Ishaan Logistics)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000001b', 'seller27@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000001b', 'Sai Verma', 'seller27@supplymarket.com', 'Ishaan Logistics', '+91 90027 88027', 'seller', 'Pune, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000001b', '00000000-0000-0000-0000-00000000001b', 'Ishaan Logistics', 'Pune, Maharashtra', true, 4.50, 96.00, '+91 90027 88027', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #28: Sandhya Rao (Sanjay Tech Circuits)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000001c', 'seller28@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000001c', 'Sandhya Rao', 'seller28@supplymarket.com', 'Sanjay Tech Circuits', '+91 90028 88028', 'seller', 'Ahmedabad, Gujarat', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000001c', '00000000-0000-0000-0000-00000000001c', 'Sanjay Tech Circuits', 'Ahmedabad, Gujarat', false, 4.60, 97.00, '+91 90028 88028', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #29: Sunitha Mehta (Lakshmi Supply Corp)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000001d', 'seller29@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000001d', 'Sunitha Mehta', 'seller29@supplymarket.com', 'Lakshmi Supply Corp', '+91 90029 88029', 'seller', 'Coimbatore, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000001d', '00000000-0000-0000-0000-00000000001d', 'Lakshmi Supply Corp', 'Coimbatore, Tamil Nadu', false, 4.70, 98.00, '+91 90029 88029', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #30: Aarav Singh (Aarav Industries)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000001e', 'seller30@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000001e', 'Aarav Singh', 'seller30@supplymarket.com', 'Aarav Industries', '+91 90030 88030', 'seller', 'Hyderabad, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000001e', '00000000-0000-0000-0000-00000000001e', 'Aarav Industries', 'Hyderabad, Telangana', true, 4.80, 99.00, '+91 90030 88030', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #31: Aditya Das (Ganesh Enterprises)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000001f', 'seller31@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000001f', 'Aditya Das', 'seller31@supplymarket.com', 'Ganesh Enterprises', '+91 90031 88031', 'seller', 'Vijayawada, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000001f', '00000000-0000-0000-0000-00000000001f', 'Ganesh Enterprises', 'Vijayawada, Andhra Pradesh', false, 4.90, 100.00, '+91 90031 88031', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #32: Amit Prasad (Rahul Traders)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000020', 'seller32@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000020', 'Amit Prasad', 'seller32@supplymarket.com', 'Rahul Traders', '+91 90032 88032', 'seller', 'Visakhapatnam, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000020', '00000000-0000-0000-0000-000000000020', 'Rahul Traders', 'Visakhapatnam, Andhra Pradesh', false, 5.00, 85.00, '+91 90032 88032', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #33: Anil Shetty (Divya Corporation)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000021', 'seller33@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000021', 'Anil Shetty', 'seller33@supplymarket.com', 'Divya Corporation', '+91 90033 88033', 'seller', 'Chennai, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000021', '00000000-0000-0000-0000-000000000021', 'Divya Corporation', 'Chennai, Tamil Nadu', true, 4.00, 86.00, '+91 90033 88033', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #34: Arjun Patel (Sandhya Steel Mart)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000022', 'seller34@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000022', 'Arjun Patel', 'seller34@supplymarket.com', 'Sandhya Steel Mart', '+91 90034 88034', 'seller', 'Bengaluru, Karnataka', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000022', '00000000-0000-0000-0000-000000000022', 'Sandhya Steel Mart', 'Bengaluru, Karnataka', false, 4.10, 87.00, '+91 90034 88034', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #35: Bhargav Marchi (Bhargav Packaging Solutions)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000023', 'seller35@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000023', 'Bhargav Marchi', 'seller35@supplymarket.com', 'Bhargav Packaging Solutions', '+91 90035 88035', 'seller', 'Warangal, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000023', '00000000-0000-0000-0000-000000000023', 'Bhargav Packaging Solutions', 'Warangal, Telangana', false, 4.20, 88.00, '+91 90035 88035', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #36: Dev Nair (Nikhil Agro Products)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000024', 'seller36@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000024', 'Dev Nair', 'seller36@supplymarket.com', 'Nikhil Agro Products', '+91 90036 88036', 'seller', 'Mumbai, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000024', '00000000-0000-0000-0000-000000000024', 'Nikhil Agro Products', 'Mumbai, Maharashtra', true, 4.30, 89.00, '+91 90036 88036', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #37: Ganesh Gupta (Vikram Logistics)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000025', 'seller37@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000025', 'Ganesh Gupta', 'seller37@supplymarket.com', 'Vikram Logistics', '+91 90037 88037', 'seller', 'Pune, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000025', '00000000-0000-0000-0000-000000000025', 'Vikram Logistics', 'Pune, Maharashtra', false, 4.40, 90.00, '+91 90037 88037', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #38: Hari Pillai (Priya Tech Circuits)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000026', 'seller38@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000026', 'Hari Pillai', 'seller38@supplymarket.com', 'Priya Tech Circuits', '+91 90038 88038', 'seller', 'Ahmedabad, Gujarat', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000026', '00000000-0000-0000-0000-000000000026', 'Priya Tech Circuits', 'Ahmedabad, Gujarat', false, 4.50, 91.00, '+91 90038 88038', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #39: Ishaan Naidu (Anil Supply Corp)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000027', 'seller39@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000027', 'Ishaan Naidu', 'seller39@supplymarket.com', 'Anil Supply Corp', '+91 90039 88039', 'seller', 'Coimbatore, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000027', '00000000-0000-0000-0000-000000000027', 'Anil Supply Corp', 'Coimbatore, Tamil Nadu', true, 4.60, 92.00, '+91 90039 88039', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #40: Karan Sharma (Karan Industries)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000028', 'seller40@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000028', 'Karan Sharma', 'seller40@supplymarket.com', 'Karan Industries', '+91 90040 88040', 'seller', 'Hyderabad, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000028', '00000000-0000-0000-0000-000000000028', 'Karan Industries', 'Hyderabad, Telangana', false, 4.70, 93.00, '+91 90040 88040', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #41: Madhav Reddy (Suresh Enterprises)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000029', 'seller41@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000029', 'Madhav Reddy', 'seller41@supplymarket.com', 'Suresh Enterprises', '+91 90041 88041', 'seller', 'Vijayawada, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000029', '00000000-0000-0000-0000-000000000029', 'Suresh Enterprises', 'Vijayawada, Andhra Pradesh', false, 4.80, 94.00, '+91 90041 88041', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #42: Nikhil Joshi (Neha Traders)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000002a', 'seller42@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000002a', 'Nikhil Joshi', 'seller42@supplymarket.com', 'Neha Traders', '+91 90042 88042', 'seller', 'Visakhapatnam, Andhra Pradesh', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000002a', '00000000-0000-0000-0000-00000000002a', 'Neha Traders', 'Visakhapatnam, Andhra Pradesh', true, 4.90, 95.00, '+91 90042 88042', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #43: Pranav Kumar (Aditya Corporation)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000002b', 'seller43@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000002b', 'Pranav Kumar', 'seller43@supplymarket.com', 'Aditya Corporation', '+91 90043 88043', 'seller', 'Chennai, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000002b', '00000000-0000-0000-0000-00000000002b', 'Aditya Corporation', 'Chennai, Tamil Nadu', false, 5.00, 96.00, '+91 90043 88043', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #44: Rahul Sen (Hari Steel Mart)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000002c', 'seller44@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000002c', 'Rahul Sen', 'seller44@supplymarket.com', 'Hari Steel Mart', '+91 90044 88044', 'seller', 'Bengaluru, Karnataka', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000002c', '00000000-0000-0000-0000-00000000002c', 'Hari Steel Mart', 'Bengaluru, Karnataka', false, 4.00, 97.00, '+91 90044 88044', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #45: Rajesh Choudhury (Rajesh Packaging Solutions)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000002d', 'seller45@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000002d', 'Rajesh Choudhury', 'seller45@supplymarket.com', 'Rajesh Packaging Solutions', '+91 90045 88045', 'seller', 'Warangal, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000002d', '00000000-0000-0000-0000-00000000002d', 'Rajesh Packaging Solutions', 'Warangal, Telangana', true, 4.10, 98.00, '+91 90045 88045', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #46: Sanjay Bhat (Kavitha Agro Products)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000002e', 'seller46@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000002e', 'Sanjay Bhat', 'seller46@supplymarket.com', 'Kavitha Agro Products', '+91 90046 88046', 'seller', 'Mumbai, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000002e', '00000000-0000-0000-0000-00000000002e', 'Kavitha Agro Products', 'Mumbai, Maharashtra', false, 4.20, 99.00, '+91 90046 88046', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #47: Suresh Verma (Sunitha Logistics)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-00000000002f', 'seller47@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-00000000002f', 'Suresh Verma', 'seller47@supplymarket.com', 'Sunitha Logistics', '+91 90047 88047', 'seller', 'Pune, Maharashtra', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-00000000002f', '00000000-0000-0000-0000-00000000002f', 'Sunitha Logistics', 'Pune, Maharashtra', false, 4.30, 100.00, '+91 90047 88047', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #48: Vijay Rao (Dev Tech Circuits)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000030', 'seller48@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000030', 'Vijay Rao', 'seller48@supplymarket.com', 'Dev Tech Circuits', '+91 90048 88048', 'seller', 'Ahmedabad, Gujarat', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000030', '00000000-0000-0000-0000-000000000030', 'Dev Tech Circuits', 'Ahmedabad, Gujarat', true, 4.40, 85.00, '+91 90048 88048', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #49: Vikram Mehta (Pranav Supply Corp)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000031', 'seller49@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000031', 'Vikram Mehta', 'seller49@supplymarket.com', 'Pranav Supply Corp', '+91 90049 88049', 'seller', 'Coimbatore, Tamil Nadu', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000031', '00000000-0000-0000-0000-000000000031', 'Pranav Supply Corp', 'Coimbatore, Tamil Nadu', false, 4.50, 86.00, '+91 90049 88049', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

-- User & Supplier #50: Ananya Singh (Ananya Industries)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, aud, role, created_at, updated_at)
VALUES ('00000000-0000-0000-0000-000000000032', 'seller50@supplymarket.com', '$2a$10$wE99q.3Yq7qA8F53fJt2X.Y2oT8K/dKk6bK6H1m5G.vC5uFhZ8y/C', now(), '{"provider":"email","providers":["email"]}'::jsonb, '{}'::jsonb, 'authenticated', 'authenticated', now(), now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Users (id, full_name, email, organization, phone, account_type, city, created_at)
VALUES ('00000000-0000-0000-0000-000000000032', 'Ananya Singh', 'seller50@supplymarket.com', 'Ananya Industries', '+91 90050 88050', 'seller', 'Hyderabad, Telangana', now()) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Suppliers (id, user_id, company_name, location, verified, rating, trust_score, contact_number, business_hours)
VALUES ('00000000-0000-0000-0001-000000000032', '00000000-0000-0000-0000-000000000032', 'Ananya Industries', 'Hyderabad, Telangana', false, 4.60, 87.00, '+91 90050 88050', '09:00 AM - 06:00 PM') ON CONFLICT (id) DO NOTHING;

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
-- SEED PRODUCTS (200 Products - exactly 4 per Supplier)
-- ----------------------------------------------------
-- Products for Supplier #1 (Rice)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000001', '00000000-0000-0000-0001-000000000001', 'Bulk Superfine Basmati Rice', 'Rice', 613, 'kg', 90.00, '1121 long grain aged basmati rice, perfect for biryanis and fine dining.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000002', '00000000-0000-0000-0001-000000000001', 'Sona Masoori Rice', 'Rice', 726, 'kg', 55.00, 'Aged Sona Masoori raw rice, low moisture, direct from mills.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000003', '00000000-0000-0000-0001-000000000001', 'Premium HMT Kolam Rice', 'Rice', 839, 'kg', 67.00, 'Superfine grain Kolam rice, aged 12 months, ideal for daily household consumption.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000004', '00000000-0000-0000-0001-000000000001', 'Premium Premium Ponni Rice', 'Rice', 952, 'kg', 68.00, 'Boiled Ponni rice sourced from Tanjore riverbeds, light and fluffy.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #2 (Cotton)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000005', '00000000-0000-0000-0001-000000000002', 'Bulk Premium Shankar-6 Cotton', 'Cotton', 1065, 'kg', 170.00, 'High staple length combed cotton fiber, suitable for fine spinning.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000006', '00000000-0000-0000-0001-000000000002', 'Bulk Combed Cotton Bales', 'Cotton', 1178, 'bale', 31900.00, 'Standard 170kg compressed cotton bales, organic certified.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000007', '00000000-0000-0000-0001-000000000002', 'Organic Raw Cotton Fiber', 'Cotton', 1291, 'kg', 160.00, 'Ginned raw cotton fiber, free from trash, certified organic.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000008', '00000000-0000-0000-0001-000000000002', 'Premium DCH-32 Extra Long Staple Cotton', 'Cotton', 1404, 'kg', 215.00, 'Premium extra long staple cotton fiber for luxury counts (80s-120s).', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #3 (Steel)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000009', '00000000-0000-0000-0001-000000000003', 'Premium Structural Fe 550D TMT Rebars', 'Steel', 1517, 'ton', 49700.00, 'High ductile steel bars for structural reinforcement, seismic-resistant.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000000a', '00000000-0000-0000-0001-000000000003', 'Bulk Mild Steel Structural Pipes', 'Steel', 1630, 'kg', 55.00, 'Galvanized hollow circular pipes for structural frameworks.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000000b', '00000000-0000-0000-0001-000000000003', 'Bulk Hot Rolled Steel Sheet', 'Steel', 1743, 'ton', 51900.00, 'Industrial grade hot rolled mild steel sheets, thickness 2mm - 5mm.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000000c', '00000000-0000-0000-0001-000000000003', 'Galvanized Iron Wire Roll', 'Steel', 1856, 'roll', 1450.00, 'High tensile GI wire roll, rust resistant, 12 gauge.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #4 (Packaging)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000000d', '00000000-0000-0000-0001-000000000004', 'Premium Corrugated Shipping Cartons', 'Packaging', 1969, 'piece', 20.00, '3-ply heavy-duty cardboard boxes, ideal for bulk shipping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000000e', '00000000-0000-0000-0001-000000000004', 'Premium Cushion Bubble Wrap Rolls', 'Packaging', 2082, 'roll', 660.00, 'Industrial strength bubble wrap rolls for safety wrapping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000000f', '00000000-0000-0000-0001-000000000004', 'Bulk Kraft Paper Rolls 120 GSM', 'Packaging', 2195, 'roll', 4000.00, 'High strength Kraft paper rolls for wrapping and box manufacturing.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000010', '00000000-0000-0000-0001-000000000004', 'Bulk BOPP Packaging Tape Pack', 'Packaging', 2308, 'pack', 275.00, 'Pack of 6 brown adhesive tapes, 2-inch width, strong adhesion.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #5 (Cement)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000011', '00000000-0000-0000-0001-000000000005', 'Ordinary Portland Cement OPC-53', 'Cement', 2421, 'bag', 380.00, 'Roofing and foundation grade high-strength OPC cement bag (50kg).', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000012', '00000000-0000-0000-0001-000000000005', 'Premium Portland Pozzolana Cement PPC', 'Cement', 2534, 'bag', 365.00, 'Fly-ash based PPC cement, excellent durability and crack resistance.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000013', '00000000-0000-0000-0001-000000000005', 'Premium White Portland Cement', 'Cement', 2647, 'bag', 760.00, 'Superfine white cement for decorative applications, tile grouting, and plastering.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000014', '00000000-0000-0000-0001-000000000005', 'Bulk Rapid Hardening Cement', 'Cement', 2760, 'bag', 410.00, 'High early strength development cement, ideal for precast elements.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #6 (Wood)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000015', '00000000-0000-0000-0001-000000000006', 'Bulk Teak Wood Planks', 'Wood', 2873, 'cubic-foot', 3100.00, 'Seasoned Indian teak timber planks, moisture-treated for high quality furniture.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000016', '00000000-0000-0000-0001-000000000006', 'Rosewood Lumber', 'Wood', 2986, 'cubic-foot', 4500.00, 'Premium Indian Rosewood (Sisu) lumber, dark grain, kiln dried.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000017', '00000000-0000-0000-0001-000000000006', 'Premium Neem Wood Logs', 'Wood', 3099, 'cubic-foot', 855.00, 'Durable termite-resistant Neem wood logs for carpentry and construction.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000018', '00000000-0000-0000-0001-000000000006', 'Premium Hardwood Plywood Sheets', 'Wood', 3212, 'piece', 1400.00, 'Boiling water resistant (BWR) marine plywood sheet, 18mm thickness.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #7 (Electronics)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000019', '00000000-0000-0000-0001-000000000007', 'Bulk Microcontroller Boards Uno', 'Electronics', 3325, 'piece', 370.00, 'ATmega328P compatible prototyping boards for custom electronics.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000001a', '00000000-0000-0000-0001-000000000007', 'Bulk Connector Jumper Cables Pack', 'Electronics', 3438, 'pack', 80.00, 'Breadboard hookup ribbon cable wires, male to female, 40 pins.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000001b', '00000000-0000-0000-0001-000000000007', 'Prototype Solderless Breadboards', 'Electronics', 3551, 'piece', 120.00, '830 tie-point solderless breadboard with double power rails.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000001c', '00000000-0000-0000-0001-000000000007', 'Premium 16x2 LCD Display Modules', 'Electronics', 3664, 'piece', 185.00, 'Character LCD display with blue backlight, I2C interface adapter included.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #8 (Turmeric)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000001d', '00000000-0000-0000-0001-000000000008', 'Premium Premium Turmeric Powder', 'Turmeric', 3777, 'kg', 130.00, 'Pure organic turmeric powder with high curcumin content, direct from local farms.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000001e', '00000000-0000-0000-0001-000000000008', 'Bulk Organic Turmeric Fingers', 'Turmeric', 3890, 'kg', 100.00, 'Sun-dried organic finger turmeric bulbs, high curcumin, unpolished.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000001f', '00000000-0000-0000-0001-000000000008', 'Bulk Erode Turmeric Bulbs', 'Turmeric', 4003, 'kg', 125.00, 'Highly sought-after Erode variety turmeric bulbs, optimal curcumin content.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000020', '00000000-0000-0000-0001-000000000008', 'Nizamabad Double Polished Turmeric', 'Turmeric', 4116, 'kg', 115.00, 'Premium double-polished turmeric fingers from Nizamabad market.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #9 (Rice)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000021', '00000000-0000-0000-0001-000000000009', 'Premium Superfine Basmati Rice', 'Rice', 4229, 'kg', 100.00, '1121 long grain aged basmati rice, perfect for biryanis and fine dining.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000022', '00000000-0000-0000-0001-000000000009', 'Premium Sona Masoori Rice', 'Rice', 4342, 'kg', 65.00, 'Aged Sona Masoori raw rice, low moisture, direct from mills.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000023', '00000000-0000-0000-0001-000000000009', 'Bulk HMT Kolam Rice', 'Rice', 4455, 'kg', 52.00, 'Superfine grain Kolam rice, aged 12 months, ideal for daily household consumption.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000024', '00000000-0000-0000-0001-000000000009', 'Bulk Premium Ponni Rice', 'Rice', 4568, 'kg', 53.00, 'Boiled Ponni rice sourced from Tanjore riverbeds, light and fluffy.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #10 (Cotton)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000025', '00000000-0000-0000-0001-00000000000a', 'Premium Shankar-6 Cotton', 'Cotton', 4681, 'kg', 180.00, 'High staple length combed cotton fiber, suitable for fine spinning.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000026', '00000000-0000-0000-0001-00000000000a', 'Premium Combed Cotton Bales', 'Cotton', 4794, 'bale', 32100.00, 'Standard 170kg compressed cotton bales, organic certified.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000027', '00000000-0000-0000-0001-00000000000a', 'Premium Organic Raw Cotton Fiber', 'Cotton', 4907, 'kg', 170.00, 'Ginned raw cotton fiber, free from trash, certified organic.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000028', '00000000-0000-0000-0001-00000000000a', 'Bulk DCH-32 Extra Long Staple Cotton', 'Cotton', 5020, 'kg', 200.00, 'Premium extra long staple cotton fiber for luxury counts (80s-120s).', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #11 (Steel)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000029', '00000000-0000-0000-0001-00000000000b', 'Bulk Structural Fe 550D TMT Rebars', 'Steel', 5133, 'ton', 49400.00, 'High ductile steel bars for structural reinforcement, seismic-resistant.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000002a', '00000000-0000-0000-0001-00000000000b', 'Mild Steel Structural Pipes', 'Steel', 5246, 'kg', 65.00, 'Galvanized hollow circular pipes for structural frameworks.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000002b', '00000000-0000-0000-0001-00000000000b', 'Premium Hot Rolled Steel Sheet', 'Steel', 5359, 'ton', 52100.00, 'Industrial grade hot rolled mild steel sheets, thickness 2mm - 5mm.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000002c', '00000000-0000-0000-0001-00000000000b', 'Premium Galvanized Iron Wire Roll', 'Steel', 5472, 'roll', 1650.00, 'High tensile GI wire roll, rust resistant, 12 gauge.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #12 (Packaging)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000002d', '00000000-0000-0000-0001-00000000000c', 'Bulk Corrugated Shipping Cartons', 'Packaging', 5585, 'piece', 15.00, '3-ply heavy-duty cardboard boxes, ideal for bulk shipping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000002e', '00000000-0000-0000-0001-00000000000c', 'Bulk Cushion Bubble Wrap Rolls', 'Packaging', 5698, 'roll', 645.00, 'Industrial strength bubble wrap rolls for safety wrapping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000002f', '00000000-0000-0000-0001-00000000000c', 'Kraft Paper Rolls 120 GSM', 'Packaging', 5811, 'roll', 4200.00, 'High strength Kraft paper rolls for wrapping and box manufacturing.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000030', '00000000-0000-0000-0001-00000000000c', 'Premium BOPP Packaging Tape Pack', 'Packaging', 5924, 'pack', 285.00, 'Pack of 6 brown adhesive tapes, 2-inch width, strong adhesion.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #13 (Cement)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000031', '00000000-0000-0000-0001-00000000000d', 'Premium Ordinary Portland Cement OPC-53', 'Cement', 6037, 'bag', 390.00, 'Roofing and foundation grade high-strength OPC cement bag (50kg).', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000032', '00000000-0000-0000-0001-00000000000d', 'Bulk Portland Pozzolana Cement PPC', 'Cement', 6150, 'bag', 350.00, 'Fly-ash based PPC cement, excellent durability and crack resistance.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000033', '00000000-0000-0000-0001-00000000000d', 'Bulk White Portland Cement', 'Cement', 6263, 'bag', 745.00, 'Superfine white cement for decorative applications, tile grouting, and plastering.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000034', '00000000-0000-0000-0001-00000000000d', 'Rapid Hardening Cement', 'Cement', 6376, 'bag', 420.00, 'High early strength development cement, ideal for precast elements.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #14 (Wood)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000035', '00000000-0000-0000-0001-00000000000e', 'Premium Teak Wood Planks', 'Wood', 6489, 'cubic-foot', 3300.00, 'Seasoned Indian teak timber planks, moisture-treated for high quality furniture.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000036', '00000000-0000-0000-0001-00000000000e', 'Premium Rosewood Lumber', 'Wood', 6602, 'cubic-foot', 4700.00, 'Premium Indian Rosewood (Sisu) lumber, dark grain, kiln dried.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000037', '00000000-0000-0000-0001-00000000000e', 'Bulk Neem Wood Logs', 'Wood', 6715, 'cubic-foot', 840.00, 'Durable termite-resistant Neem wood logs for carpentry and construction.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000038', '00000000-0000-0000-0001-00000000000e', 'Bulk Hardwood Plywood Sheets', 'Wood', 6828, 'piece', 1100.00, 'Boiling water resistant (BWR) marine plywood sheet, 18mm thickness.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #15 (Electronics)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000039', '00000000-0000-0000-0001-00000000000f', 'Microcontroller Boards Uno', 'Electronics', 6941, 'piece', 380.00, 'ATmega328P compatible prototyping boards for custom electronics.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000003a', '00000000-0000-0000-0001-00000000000f', 'Premium Connector Jumper Cables Pack', 'Electronics', 7054, 'pack', 90.00, 'Breadboard hookup ribbon cable wires, male to female, 40 pins.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000003b', '00000000-0000-0000-0001-00000000000f', 'Premium Prototype Solderless Breadboards', 'Electronics', 7167, 'piece', 130.00, '830 tie-point solderless breadboard with double power rails.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000003c', '00000000-0000-0000-0001-00000000000f', 'Bulk 16x2 LCD Display Modules', 'Electronics', 7280, 'piece', 170.00, 'Character LCD display with blue backlight, I2C interface adapter included.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #16 (Turmeric)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000003d', '00000000-0000-0000-0001-000000000010', 'Bulk Premium Turmeric Powder', 'Turmeric', 7393, 'kg', 115.00, 'Pure organic turmeric powder with high curcumin content, direct from local farms.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000003e', '00000000-0000-0000-0001-000000000010', 'Organic Turmeric Fingers', 'Turmeric', 7506, 'kg', 110.00, 'Sun-dried organic finger turmeric bulbs, high curcumin, unpolished.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000003f', '00000000-0000-0000-0001-000000000010', 'Premium Erode Turmeric Bulbs', 'Turmeric', 7619, 'kg', 135.00, 'Highly sought-after Erode variety turmeric bulbs, optimal curcumin content.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000040', '00000000-0000-0000-0001-000000000010', 'Premium Nizamabad Double Polished Turmeric', 'Turmeric', 7732, 'kg', 125.00, 'Premium double-polished turmeric fingers from Nizamabad market.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #17 (Rice)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000041', '00000000-0000-0000-0001-000000000011', 'Bulk Superfine Basmati Rice', 'Rice', 7845, 'kg', 85.00, '1121 long grain aged basmati rice, perfect for biryanis and fine dining.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000042', '00000000-0000-0000-0001-000000000011', 'Bulk Sona Masoori Rice', 'Rice', 7958, 'kg', 50.00, 'Aged Sona Masoori raw rice, low moisture, direct from mills.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000043', '00000000-0000-0000-0001-000000000011', 'HMT Kolam Rice', 'Rice', 8071, 'kg', 62.00, 'Superfine grain Kolam rice, aged 12 months, ideal for daily household consumption.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000044', '00000000-0000-0000-0001-000000000011', 'Premium Premium Ponni Rice', 'Rice', 8184, 'kg', 63.00, 'Boiled Ponni rice sourced from Tanjore riverbeds, light and fluffy.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #18 (Cotton)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000045', '00000000-0000-0000-0001-000000000012', 'Premium Premium Shankar-6 Cotton', 'Cotton', 8297, 'kg', 190.00, 'High staple length combed cotton fiber, suitable for fine spinning.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000046', '00000000-0000-0000-0001-000000000012', 'Bulk Combed Cotton Bales', 'Cotton', 8410, 'bale', 31800.00, 'Standard 170kg compressed cotton bales, organic certified.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000047', '00000000-0000-0000-0001-000000000012', 'Bulk Organic Raw Cotton Fiber', 'Cotton', 8523, 'kg', 155.00, 'Ginned raw cotton fiber, free from trash, certified organic.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000048', '00000000-0000-0000-0001-000000000012', 'DCH-32 Extra Long Staple Cotton', 'Cotton', 8636, 'kg', 210.00, 'Premium extra long staple cotton fiber for luxury counts (80s-120s).', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #19 (Steel)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000049', '00000000-0000-0000-0001-000000000013', 'Premium Structural Fe 550D TMT Rebars', 'Steel', 8749, 'ton', 49600.00, 'High ductile steel bars for structural reinforcement, seismic-resistant.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000004a', '00000000-0000-0000-0001-000000000013', 'Premium Mild Steel Structural Pipes', 'Steel', 8862, 'kg', 75.00, 'Galvanized hollow circular pipes for structural frameworks.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000004b', '00000000-0000-0000-0001-000000000013', 'Bulk Hot Rolled Steel Sheet', 'Steel', 8975, 'ton', 51800.00, 'Industrial grade hot rolled mild steel sheets, thickness 2mm - 5mm.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000004c', '00000000-0000-0000-0001-000000000013', 'Bulk Galvanized Iron Wire Roll', 'Steel', 9088, 'roll', 1350.00, 'High tensile GI wire roll, rust resistant, 12 gauge.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #20 (Packaging)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000004d', '00000000-0000-0000-0001-000000000014', 'Corrugated Shipping Cartons', 'Packaging', 9201, 'piece', 15.00, '3-ply heavy-duty cardboard boxes, ideal for bulk shipping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000004e', '00000000-0000-0000-0001-000000000014', 'Premium Cushion Bubble Wrap Rolls', 'Packaging', 9314, 'roll', 655.00, 'Industrial strength bubble wrap rolls for safety wrapping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000004f', '00000000-0000-0000-0001-000000000014', 'Premium Kraft Paper Rolls 120 GSM', 'Packaging', 9427, 'roll', 4400.00, 'High strength Kraft paper rolls for wrapping and box manufacturing.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000050', '00000000-0000-0000-0001-000000000014', 'Bulk BOPP Packaging Tape Pack', 'Packaging', 9540, 'pack', 270.00, 'Pack of 6 brown adhesive tapes, 2-inch width, strong adhesion.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #21 (Cement)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000051', '00000000-0000-0000-0001-000000000015', 'Bulk Ordinary Portland Cement OPC-53', 'Cement', 9653, 'bag', 375.00, 'Roofing and foundation grade high-strength OPC cement bag (50kg).', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000052', '00000000-0000-0000-0001-000000000015', 'Portland Pozzolana Cement PPC', 'Cement', 9766, 'bag', 360.00, 'Fly-ash based PPC cement, excellent durability and crack resistance.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000053', '00000000-0000-0000-0001-000000000015', 'Premium White Portland Cement', 'Cement', 9879, 'bag', 755.00, 'Superfine white cement for decorative applications, tile grouting, and plastering.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000054', '00000000-0000-0000-0001-000000000015', 'Premium Rapid Hardening Cement', 'Cement', 9992, 'bag', 430.00, 'High early strength development cement, ideal for precast elements.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #22 (Wood)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000055', '00000000-0000-0000-0001-000000000016', 'Bulk Teak Wood Planks', 'Wood', 10105, 'cubic-foot', 3000.00, 'Seasoned Indian teak timber planks, moisture-treated for high quality furniture.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000056', '00000000-0000-0000-0001-000000000016', 'Bulk Rosewood Lumber', 'Wood', 10218, 'cubic-foot', 4400.00, 'Premium Indian Rosewood (Sisu) lumber, dark grain, kiln dried.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000057', '00000000-0000-0000-0001-000000000016', 'Neem Wood Logs', 'Wood', 10331, 'cubic-foot', 850.00, 'Durable termite-resistant Neem wood logs for carpentry and construction.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000058', '00000000-0000-0000-0001-000000000016', 'Premium Hardwood Plywood Sheets', 'Wood', 10444, 'piece', 1300.00, 'Boiling water resistant (BWR) marine plywood sheet, 18mm thickness.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #23 (Electronics)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000059', '00000000-0000-0000-0001-000000000017', 'Premium Microcontroller Boards Uno', 'Electronics', 10557, 'piece', 390.00, 'ATmega328P compatible prototyping boards for custom electronics.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000005a', '00000000-0000-0000-0001-000000000017', 'Bulk Connector Jumper Cables Pack', 'Electronics', 10670, 'pack', 75.00, 'Breadboard hookup ribbon cable wires, male to female, 40 pins.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000005b', '00000000-0000-0000-0001-000000000017', 'Bulk Prototype Solderless Breadboards', 'Electronics', 10783, 'piece', 115.00, '830 tie-point solderless breadboard with double power rails.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000005c', '00000000-0000-0000-0001-000000000017', '16x2 LCD Display Modules', 'Electronics', 10896, 'piece', 180.00, 'Character LCD display with blue backlight, I2C interface adapter included.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #24 (Turmeric)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000005d', '00000000-0000-0000-0001-000000000018', 'Premium Premium Turmeric Powder', 'Turmeric', 11009, 'kg', 125.00, 'Pure organic turmeric powder with high curcumin content, direct from local farms.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000005e', '00000000-0000-0000-0001-000000000018', 'Premium Organic Turmeric Fingers', 'Turmeric', 11122, 'kg', 120.00, 'Sun-dried organic finger turmeric bulbs, high curcumin, unpolished.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000005f', '00000000-0000-0000-0001-000000000018', 'Bulk Erode Turmeric Bulbs', 'Turmeric', 11235, 'kg', 120.00, 'Highly sought-after Erode variety turmeric bulbs, optimal curcumin content.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000060', '00000000-0000-0000-0001-000000000018', 'Bulk Nizamabad Double Polished Turmeric', 'Turmeric', 11348, 'kg', 110.00, 'Premium double-polished turmeric fingers from Nizamabad market.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #25 (Rice)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000061', '00000000-0000-0000-0001-000000000019', 'Superfine Basmati Rice', 'Rice', 11461, 'kg', 95.00, '1121 long grain aged basmati rice, perfect for biryanis and fine dining.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000062', '00000000-0000-0000-0001-000000000019', 'Premium Sona Masoori Rice', 'Rice', 11574, 'kg', 60.00, 'Aged Sona Masoori raw rice, low moisture, direct from mills.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000063', '00000000-0000-0000-0001-000000000019', 'Premium HMT Kolam Rice', 'Rice', 11687, 'kg', 72.00, 'Superfine grain Kolam rice, aged 12 months, ideal for daily household consumption.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000064', '00000000-0000-0000-0001-000000000019', 'Bulk Premium Ponni Rice', 'Rice', 11800, 'kg', 48.00, 'Boiled Ponni rice sourced from Tanjore riverbeds, light and fluffy.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #26 (Cotton)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000065', '00000000-0000-0000-0001-00000000001a', 'Bulk Premium Shankar-6 Cotton', 'Cotton', 11913, 'kg', 175.00, 'High staple length combed cotton fiber, suitable for fine spinning.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000066', '00000000-0000-0000-0001-00000000001a', 'Combed Cotton Bales', 'Cotton', 12026, 'bale', 32000.00, 'Standard 170kg compressed cotton bales, organic certified.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000067', '00000000-0000-0000-0001-00000000001a', 'Premium Organic Raw Cotton Fiber', 'Cotton', 12139, 'kg', 165.00, 'Ginned raw cotton fiber, free from trash, certified organic.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000068', '00000000-0000-0000-0001-00000000001a', 'Premium DCH-32 Extra Long Staple Cotton', 'Cotton', 12252, 'kg', 220.00, 'Premium extra long staple cotton fiber for luxury counts (80s-120s).', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #27 (Steel)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000069', '00000000-0000-0000-0001-00000000001b', 'Bulk Structural Fe 550D TMT Rebars', 'Steel', 12365, 'ton', 49300.00, 'High ductile steel bars for structural reinforcement, seismic-resistant.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000006a', '00000000-0000-0000-0001-00000000001b', 'Bulk Mild Steel Structural Pipes', 'Steel', 12478, 'kg', 60.00, 'Galvanized hollow circular pipes for structural frameworks.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000006b', '00000000-0000-0000-0001-00000000001b', 'Hot Rolled Steel Sheet', 'Steel', 12591, 'ton', 52000.00, 'Industrial grade hot rolled mild steel sheets, thickness 2mm - 5mm.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000006c', '00000000-0000-0000-0001-00000000001b', 'Premium Galvanized Iron Wire Roll', 'Steel', 12704, 'roll', 1550.00, 'High tensile GI wire roll, rust resistant, 12 gauge.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #28 (Packaging)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000006d', '00000000-0000-0000-0001-00000000001c', 'Premium Corrugated Shipping Cartons', 'Packaging', 12817, 'piece', 25.00, '3-ply heavy-duty cardboard boxes, ideal for bulk shipping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000006e', '00000000-0000-0000-0001-00000000001c', 'Bulk Cushion Bubble Wrap Rolls', 'Packaging', 12930, 'roll', 640.00, 'Industrial strength bubble wrap rolls for safety wrapping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000006f', '00000000-0000-0000-0001-00000000001c', 'Bulk Kraft Paper Rolls 120 GSM', 'Packaging', 13043, 'roll', 4100.00, 'High strength Kraft paper rolls for wrapping and box manufacturing.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000070', '00000000-0000-0000-0001-00000000001c', 'BOPP Packaging Tape Pack', 'Packaging', 13156, 'pack', 280.00, 'Pack of 6 brown adhesive tapes, 2-inch width, strong adhesion.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #29 (Cement)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000071', '00000000-0000-0000-0001-00000000001d', 'Premium Ordinary Portland Cement OPC-53', 'Cement', 13269, 'bag', 385.00, 'Roofing and foundation grade high-strength OPC cement bag (50kg).', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000072', '00000000-0000-0000-0001-00000000001d', 'Premium Portland Pozzolana Cement PPC', 'Cement', 13382, 'bag', 370.00, 'Fly-ash based PPC cement, excellent durability and crack resistance.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000073', '00000000-0000-0000-0001-00000000001d', 'Bulk White Portland Cement', 'Cement', 13495, 'bag', 740.00, 'Superfine white cement for decorative applications, tile grouting, and plastering.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000074', '00000000-0000-0000-0001-00000000001d', 'Bulk Rapid Hardening Cement', 'Cement', 13608, 'bag', 415.00, 'High early strength development cement, ideal for precast elements.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #30 (Wood)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000075', '00000000-0000-0000-0001-00000000001e', 'Teak Wood Planks', 'Wood', 13721, 'cubic-foot', 3200.00, 'Seasoned Indian teak timber planks, moisture-treated for high quality furniture.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000076', '00000000-0000-0000-0001-00000000001e', 'Premium Rosewood Lumber', 'Wood', 13834, 'cubic-foot', 4600.00, 'Premium Indian Rosewood (Sisu) lumber, dark grain, kiln dried.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000077', '00000000-0000-0000-0001-00000000001e', 'Premium Neem Wood Logs', 'Wood', 13947, 'cubic-foot', 860.00, 'Durable termite-resistant Neem wood logs for carpentry and construction.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000078', '00000000-0000-0000-0001-00000000001e', 'Bulk Hardwood Plywood Sheets', 'Wood', 14060, 'piece', 1000.00, 'Boiling water resistant (BWR) marine plywood sheet, 18mm thickness.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #31 (Electronics)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000079', '00000000-0000-0000-0001-00000000001f', 'Bulk Microcontroller Boards Uno', 'Electronics', 14173, 'piece', 375.00, 'ATmega328P compatible prototyping boards for custom electronics.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000007a', '00000000-0000-0000-0001-00000000001f', 'Connector Jumper Cables Pack', 'Electronics', 14286, 'pack', 85.00, 'Breadboard hookup ribbon cable wires, male to female, 40 pins.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000007b', '00000000-0000-0000-0001-00000000001f', 'Premium Prototype Solderless Breadboards', 'Electronics', 14399, 'piece', 125.00, '830 tie-point solderless breadboard with double power rails.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000007c', '00000000-0000-0000-0001-00000000001f', 'Premium 16x2 LCD Display Modules', 'Electronics', 14512, 'piece', 190.00, 'Character LCD display with blue backlight, I2C interface adapter included.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #32 (Turmeric)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000007d', '00000000-0000-0000-0001-000000000020', 'Bulk Premium Turmeric Powder', 'Turmeric', 14625, 'kg', 110.00, 'Pure organic turmeric powder with high curcumin content, direct from local farms.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000007e', '00000000-0000-0000-0001-000000000020', 'Bulk Organic Turmeric Fingers', 'Turmeric', 14738, 'kg', 105.00, 'Sun-dried organic finger turmeric bulbs, high curcumin, unpolished.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000007f', '00000000-0000-0000-0001-000000000020', 'Erode Turmeric Bulbs', 'Turmeric', 14851, 'kg', 130.00, 'Highly sought-after Erode variety turmeric bulbs, optimal curcumin content.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000080', '00000000-0000-0000-0001-000000000020', 'Premium Nizamabad Double Polished Turmeric', 'Turmeric', 14964, 'kg', 120.00, 'Premium double-polished turmeric fingers from Nizamabad market.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #33 (Rice)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000081', '00000000-0000-0000-0001-000000000021', 'Premium Superfine Basmati Rice', 'Rice', 15077, 'kg', 105.00, '1121 long grain aged basmati rice, perfect for biryanis and fine dining.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000082', '00000000-0000-0000-0001-000000000021', 'Bulk Sona Masoori Rice', 'Rice', 15190, 'kg', 45.00, 'Aged Sona Masoori raw rice, low moisture, direct from mills.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000083', '00000000-0000-0000-0001-000000000021', 'Bulk HMT Kolam Rice', 'Rice', 15303, 'kg', 57.00, 'Superfine grain Kolam rice, aged 12 months, ideal for daily household consumption.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000084', '00000000-0000-0000-0001-000000000021', 'Premium Ponni Rice', 'Rice', 15416, 'kg', 58.00, 'Boiled Ponni rice sourced from Tanjore riverbeds, light and fluffy.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #34 (Cotton)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000085', '00000000-0000-0000-0001-000000000022', 'Premium Premium Shankar-6 Cotton', 'Cotton', 15529, 'kg', 185.00, 'High staple length combed cotton fiber, suitable for fine spinning.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000086', '00000000-0000-0000-0001-000000000022', 'Premium Combed Cotton Bales', 'Cotton', 15642, 'bale', 32200.00, 'Standard 170kg compressed cotton bales, organic certified.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000087', '00000000-0000-0000-0001-000000000022', 'Bulk Organic Raw Cotton Fiber', 'Cotton', 15755, 'kg', 150.00, 'Ginned raw cotton fiber, free from trash, certified organic.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000088', '00000000-0000-0000-0001-000000000022', 'Bulk DCH-32 Extra Long Staple Cotton', 'Cotton', 15868, 'kg', 205.00, 'Premium extra long staple cotton fiber for luxury counts (80s-120s).', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #35 (Steel)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000089', '00000000-0000-0000-0001-000000000023', 'Structural Fe 550D TMT Rebars', 'Steel', 15981, 'ton', 49500.00, 'High ductile steel bars for structural reinforcement, seismic-resistant.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000008a', '00000000-0000-0000-0001-000000000023', 'Premium Mild Steel Structural Pipes', 'Steel', 16094, 'kg', 70.00, 'Galvanized hollow circular pipes for structural frameworks.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000008b', '00000000-0000-0000-0001-000000000023', 'Premium Hot Rolled Steel Sheet', 'Steel', 16207, 'ton', 52200.00, 'Industrial grade hot rolled mild steel sheets, thickness 2mm - 5mm.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000008c', '00000000-0000-0000-0001-000000000023', 'Bulk Galvanized Iron Wire Roll', 'Steel', 16320, 'roll', 1250.00, 'High tensile GI wire roll, rust resistant, 12 gauge.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #36 (Packaging)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000008d', '00000000-0000-0000-0001-000000000024', 'Bulk Corrugated Shipping Cartons', 'Packaging', 16433, 'piece', 10.00, '3-ply heavy-duty cardboard boxes, ideal for bulk shipping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000008e', '00000000-0000-0000-0001-000000000024', 'Cushion Bubble Wrap Rolls', 'Packaging', 16546, 'roll', 650.00, 'Industrial strength bubble wrap rolls for safety wrapping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000008f', '00000000-0000-0000-0001-000000000024', 'Premium Kraft Paper Rolls 120 GSM', 'Packaging', 16659, 'roll', 4300.00, 'High strength Kraft paper rolls for wrapping and box manufacturing.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000090', '00000000-0000-0000-0001-000000000024', 'Premium BOPP Packaging Tape Pack', 'Packaging', 16772, 'pack', 290.00, 'Pack of 6 brown adhesive tapes, 2-inch width, strong adhesion.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #37 (Cement)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000091', '00000000-0000-0000-0001-000000000025', 'Bulk Ordinary Portland Cement OPC-53', 'Cement', 16885, 'bag', 370.00, 'Roofing and foundation grade high-strength OPC cement bag (50kg).', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000092', '00000000-0000-0000-0001-000000000025', 'Bulk Portland Pozzolana Cement PPC', 'Cement', 16998, 'bag', 355.00, 'Fly-ash based PPC cement, excellent durability and crack resistance.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000093', '00000000-0000-0000-0001-000000000025', 'White Portland Cement', 'Cement', 17111, 'bag', 750.00, 'Superfine white cement for decorative applications, tile grouting, and plastering.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000094', '00000000-0000-0000-0001-000000000025', 'Premium Rapid Hardening Cement', 'Cement', 17224, 'bag', 425.00, 'High early strength development cement, ideal for precast elements.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #38 (Wood)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000095', '00000000-0000-0000-0001-000000000026', 'Premium Teak Wood Planks', 'Wood', 17337, 'cubic-foot', 3400.00, 'Seasoned Indian teak timber planks, moisture-treated for high quality furniture.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000096', '00000000-0000-0000-0001-000000000026', 'Bulk Rosewood Lumber', 'Wood', 17450, 'cubic-foot', 4300.00, 'Premium Indian Rosewood (Sisu) lumber, dark grain, kiln dried.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000097', '00000000-0000-0000-0001-000000000026', 'Bulk Neem Wood Logs', 'Wood', 17563, 'cubic-foot', 845.00, 'Durable termite-resistant Neem wood logs for carpentry and construction.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000098', '00000000-0000-0000-0001-000000000026', 'Hardwood Plywood Sheets', 'Wood', 17676, 'piece', 1200.00, 'Boiling water resistant (BWR) marine plywood sheet, 18mm thickness.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #39 (Electronics)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-000000000099', '00000000-0000-0000-0001-000000000027', 'Premium Microcontroller Boards Uno', 'Electronics', 17789, 'piece', 385.00, 'ATmega328P compatible prototyping boards for custom electronics.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000009a', '00000000-0000-0000-0001-000000000027', 'Premium Connector Jumper Cables Pack', 'Electronics', 17902, 'pack', 95.00, 'Breadboard hookup ribbon cable wires, male to female, 40 pins.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000009b', '00000000-0000-0000-0001-000000000027', 'Bulk Prototype Solderless Breadboards', 'Electronics', 18015, 'piece', 110.00, '830 tie-point solderless breadboard with double power rails.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000009c', '00000000-0000-0000-0001-000000000027', 'Bulk 16x2 LCD Display Modules', 'Electronics', 18128, 'piece', 175.00, 'Character LCD display with blue backlight, I2C interface adapter included.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #40 (Turmeric)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000009d', '00000000-0000-0000-0001-000000000028', 'Premium Turmeric Powder', 'Turmeric', 18241, 'kg', 120.00, 'Pure organic turmeric powder with high curcumin content, direct from local farms.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000009e', '00000000-0000-0000-0001-000000000028', 'Premium Organic Turmeric Fingers', 'Turmeric', 18354, 'kg', 115.00, 'Sun-dried organic finger turmeric bulbs, high curcumin, unpolished.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-00000000009f', '00000000-0000-0000-0001-000000000028', 'Premium Erode Turmeric Bulbs', 'Turmeric', 18467, 'kg', 140.00, 'Highly sought-after Erode variety turmeric bulbs, optimal curcumin content.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a0', '00000000-0000-0000-0001-000000000028', 'Bulk Nizamabad Double Polished Turmeric', 'Turmeric', 18580, 'kg', 105.00, 'Premium double-polished turmeric fingers from Nizamabad market.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #41 (Rice)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a1', '00000000-0000-0000-0001-000000000029', 'Bulk Superfine Basmati Rice', 'Rice', 18693, 'kg', 90.00, '1121 long grain aged basmati rice, perfect for biryanis and fine dining.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a2', '00000000-0000-0000-0001-000000000029', 'Sona Masoori Rice', 'Rice', 18806, 'kg', 55.00, 'Aged Sona Masoori raw rice, low moisture, direct from mills.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a3', '00000000-0000-0000-0001-000000000029', 'Premium HMT Kolam Rice', 'Rice', 18919, 'kg', 67.00, 'Superfine grain Kolam rice, aged 12 months, ideal for daily household consumption.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a4', '00000000-0000-0000-0001-000000000029', 'Premium Premium Ponni Rice', 'Rice', 19032, 'kg', 68.00, 'Boiled Ponni rice sourced from Tanjore riverbeds, light and fluffy.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #42 (Cotton)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a5', '00000000-0000-0000-0001-00000000002a', 'Bulk Premium Shankar-6 Cotton', 'Cotton', 19145, 'kg', 170.00, 'High staple length combed cotton fiber, suitable for fine spinning.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a6', '00000000-0000-0000-0001-00000000002a', 'Bulk Combed Cotton Bales', 'Cotton', 19258, 'bale', 31900.00, 'Standard 170kg compressed cotton bales, organic certified.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a7', '00000000-0000-0000-0001-00000000002a', 'Organic Raw Cotton Fiber', 'Cotton', 19371, 'kg', 160.00, 'Ginned raw cotton fiber, free from trash, certified organic.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a8', '00000000-0000-0000-0001-00000000002a', 'Premium DCH-32 Extra Long Staple Cotton', 'Cotton', 19484, 'kg', 215.00, 'Premium extra long staple cotton fiber for luxury counts (80s-120s).', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #43 (Steel)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000a9', '00000000-0000-0000-0001-00000000002b', 'Premium Structural Fe 550D TMT Rebars', 'Steel', 19597, 'ton', 49700.00, 'High ductile steel bars for structural reinforcement, seismic-resistant.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000aa', '00000000-0000-0000-0001-00000000002b', 'Bulk Mild Steel Structural Pipes', 'Steel', 19710, 'kg', 55.00, 'Galvanized hollow circular pipes for structural frameworks.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000ab', '00000000-0000-0000-0001-00000000002b', 'Bulk Hot Rolled Steel Sheet', 'Steel', 19823, 'ton', 51900.00, 'Industrial grade hot rolled mild steel sheets, thickness 2mm - 5mm.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000ac', '00000000-0000-0000-0001-00000000002b', 'Galvanized Iron Wire Roll', 'Steel', 19936, 'roll', 1450.00, 'High tensile GI wire roll, rust resistant, 12 gauge.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #44 (Packaging)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000ad', '00000000-0000-0000-0001-00000000002c', 'Premium Corrugated Shipping Cartons', 'Packaging', 20049, 'piece', 20.00, '3-ply heavy-duty cardboard boxes, ideal for bulk shipping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000ae', '00000000-0000-0000-0001-00000000002c', 'Premium Cushion Bubble Wrap Rolls', 'Packaging', 20162, 'roll', 660.00, 'Industrial strength bubble wrap rolls for safety wrapping.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000af', '00000000-0000-0000-0001-00000000002c', 'Bulk Kraft Paper Rolls 120 GSM', 'Packaging', 20275, 'roll', 4000.00, 'High strength Kraft paper rolls for wrapping and box manufacturing.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b0', '00000000-0000-0000-0001-00000000002c', 'Bulk BOPP Packaging Tape Pack', 'Packaging', 20388, 'pack', 275.00, 'Pack of 6 brown adhesive tapes, 2-inch width, strong adhesion.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #45 (Cement)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b1', '00000000-0000-0000-0001-00000000002d', 'Ordinary Portland Cement OPC-53', 'Cement', 20501, 'bag', 380.00, 'Roofing and foundation grade high-strength OPC cement bag (50kg).', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b2', '00000000-0000-0000-0001-00000000002d', 'Premium Portland Pozzolana Cement PPC', 'Cement', 20614, 'bag', 365.00, 'Fly-ash based PPC cement, excellent durability and crack resistance.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b3', '00000000-0000-0000-0001-00000000002d', 'Premium White Portland Cement', 'Cement', 20727, 'bag', 760.00, 'Superfine white cement for decorative applications, tile grouting, and plastering.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b4', '00000000-0000-0000-0001-00000000002d', 'Bulk Rapid Hardening Cement', 'Cement', 20840, 'bag', 410.00, 'High early strength development cement, ideal for precast elements.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #46 (Wood)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b5', '00000000-0000-0000-0001-00000000002e', 'Bulk Teak Wood Planks', 'Wood', 20953, 'cubic-foot', 3100.00, 'Seasoned Indian teak timber planks, moisture-treated for high quality furniture.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b6', '00000000-0000-0000-0001-00000000002e', 'Rosewood Lumber', 'Wood', 21066, 'cubic-foot', 4500.00, 'Premium Indian Rosewood (Sisu) lumber, dark grain, kiln dried.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b7', '00000000-0000-0000-0001-00000000002e', 'Premium Neem Wood Logs', 'Wood', 21179, 'cubic-foot', 855.00, 'Durable termite-resistant Neem wood logs for carpentry and construction.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b8', '00000000-0000-0000-0001-00000000002e', 'Premium Hardwood Plywood Sheets', 'Wood', 21292, 'piece', 1400.00, 'Boiling water resistant (BWR) marine plywood sheet, 18mm thickness.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #47 (Electronics)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000b9', '00000000-0000-0000-0001-00000000002f', 'Bulk Microcontroller Boards Uno', 'Electronics', 21405, 'piece', 370.00, 'ATmega328P compatible prototyping boards for custom electronics.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000ba', '00000000-0000-0000-0001-00000000002f', 'Bulk Connector Jumper Cables Pack', 'Electronics', 21518, 'pack', 80.00, 'Breadboard hookup ribbon cable wires, male to female, 40 pins.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000bb', '00000000-0000-0000-0001-00000000002f', 'Prototype Solderless Breadboards', 'Electronics', 21631, 'piece', 120.00, '830 tie-point solderless breadboard with double power rails.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000bc', '00000000-0000-0000-0001-00000000002f', 'Premium 16x2 LCD Display Modules', 'Electronics', 21744, 'piece', 185.00, 'Character LCD display with blue backlight, I2C interface adapter included.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #48 (Turmeric)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000bd', '00000000-0000-0000-0001-000000000030', 'Premium Premium Turmeric Powder', 'Turmeric', 21857, 'kg', 130.00, 'Pure organic turmeric powder with high curcumin content, direct from local farms.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000be', '00000000-0000-0000-0001-000000000030', 'Bulk Organic Turmeric Fingers', 'Turmeric', 21970, 'kg', 100.00, 'Sun-dried organic finger turmeric bulbs, high curcumin, unpolished.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000bf', '00000000-0000-0000-0001-000000000030', 'Bulk Erode Turmeric Bulbs', 'Turmeric', 22083, 'kg', 125.00, 'Highly sought-after Erode variety turmeric bulbs, optimal curcumin content.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000c0', '00000000-0000-0000-0001-000000000030', 'Nizamabad Double Polished Turmeric', 'Turmeric', 22196, 'kg', 115.00, 'Premium double-polished turmeric fingers from Nizamabad market.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #49 (Rice)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000c1', '00000000-0000-0000-0001-000000000031', 'Premium Superfine Basmati Rice', 'Rice', 22309, 'kg', 100.00, '1121 long grain aged basmati rice, perfect for biryanis and fine dining.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000c2', '00000000-0000-0000-0001-000000000031', 'Premium Sona Masoori Rice', 'Rice', 22422, 'kg', 65.00, 'Aged Sona Masoori raw rice, low moisture, direct from mills.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000c3', '00000000-0000-0000-0001-000000000031', 'Bulk HMT Kolam Rice', 'Rice', 22535, 'kg', 52.00, 'Superfine grain Kolam rice, aged 12 months, ideal for daily household consumption.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000c4', '00000000-0000-0000-0001-000000000031', 'Bulk Premium Ponni Rice', 'Rice', 22648, 'kg', 53.00, 'Boiled Ponni rice sourced from Tanjore riverbeds, light and fluffy.', true) ON CONFLICT (id) DO NOTHING;

-- Products for Supplier #50 (Cotton)
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000c5', '00000000-0000-0000-0001-000000000032', 'Premium Shankar-6 Cotton', 'Cotton', 22761, 'kg', 180.00, 'High staple length combed cotton fiber, suitable for fine spinning.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000c6', '00000000-0000-0000-0001-000000000032', 'Premium Combed Cotton Bales', 'Cotton', 22874, 'bale', 32100.00, 'Standard 170kg compressed cotton bales, organic certified.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000c7', '00000000-0000-0000-0001-000000000032', 'Premium Organic Raw Cotton Fiber', 'Cotton', 22987, 'kg', 170.00, 'Ginned raw cotton fiber, free from trash, certified organic.', true) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.Products (id, supplier_id, product_name, category, quantity, unit, price, description, available)
VALUES ('00000000-0000-0000-0002-0000000000c8', '00000000-0000-0000-0001-000000000032', 'Bulk DCH-32 Extra Long Staple Cotton', 'Cotton', 23100, 'kg', 200.00, 'Premium extra long staple cotton fiber for luxury counts (80s-120s).', true) ON CONFLICT (id) DO NOTHING;

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