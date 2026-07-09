# 🤖 Supply Market AI

### AI-Powered Supplier Matching & Business Networking Platform for Indian Manufacturing

<p align="center">

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript)
![Vite](https://img.shields.io/badge/Vite-646CFF?logo=vite)
![Gemini AI](https://img.shields.io/badge/Google-Gemini_AI-4285F4?logo=google)
![Supabase](https://img.shields.io/badge/Supabase-Database_&_Auth-3ECF8E?logo=supabase)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?logo=postgresql)
![Murf AI](https://img.shields.io/badge/Murf-AI_Voice-8A2BE2)
![License](https://img.shields.io/badge/License-MIT-green)

</p>

---

# 🚀 Live Demo

🔗 **Deployment**

https://supply-market.vercel.app/

---

# 📌 Overview

Supply Market AI is an AI-powered supplier discovery and business networking platform designed for Indian manufacturers, MSMEs, wholesalers, and procurement teams.

Instead of manually searching hundreds of suppliers, buyers simply describe their requirement using natural language or voice.

The platform uses Google Gemini AI to understand the requirement, searches a live supplier database, ranks the best suppliers, and recommends the most suitable match with an explanation.

With Supabase Authentication and PostgreSQL Database, users can securely register, log in, manage products, store buyer requests, and access real-time supplier information.

---

# ✨ Key Features

## 🛒 Buyer Dashboard

- AI-powered supplier recommendations
- Natural language search
- Voice search
- Multi-language support
- AI-generated recommendation summary
- Manual supplier browsing
- Supplier comparison
- Save favourite suppliers
- Direct supplier connection

---

## 🏪 Seller Dashboard

- Product management
- Inventory management
- Business analytics
- Customer insights
- AI business recommendations
- Revenue overview
- Sales assistant
- Buyer activity tracking

---

## 👤 User Management

- Secure Sign Up
- Secure Login
- Authentication using Supabase Auth
- User Profile Management
- Buyer & Seller roles
- Persistent user sessions

---

## 🤖 AI Assistant

- Understands natural language
- Google Gemini AI
- Voice input
- AI Voice output
- Smart supplier matching
- Recommendation explanation
- Alternative supplier suggestions

---

# 🔐 Authentication & Database

Supply Market AI now uses **Supabase** to provide production-ready backend services.

### Authentication

- Email & Password Login
- Secure User Sessions
- Role-based Users
- Persistent Authentication

### Database

- PostgreSQL Database
- Real-time Supplier Storage
- Product Inventory Storage
- Buyer Requests Storage
- AI Recommendation History

### Security

- Row Level Security (RLS)
- Authenticated User Access
- Secure Database Policies

---

# 🌍 Multi-language Support

Supported Languages

- 🇮🇳 English
- 🇮🇳 Hindi
- 🇮🇳 Telugu
- 🇮🇳 Tamil
- 🇮🇳 Kannada
- 🇮🇳 Malayalam

---

# 🧠 AI Workflow

```text
Buyer Requirement
        │
        ▼
Google Gemini AI
        │
Extract Product Details
        │
        ▼
Supabase PostgreSQL Database
        │
Retrieve Matching Suppliers
        │
        ▼
Supplier Ranking Engine
        │
        ▼
AI Recommendation
        │
        ▼
Translation Engine
        │
        ▼
Murf AI Voice Response
```

---

# 🏗️ Project Architecture

```text
Buyer
   │
   ▼
React + TypeScript Frontend
   │
   ▼
Supabase Authentication
   │
   ▼
Google Gemini AI
   │
   ▼
Supabase PostgreSQL Database
   │
   ▼
Supplier Matching Engine
   │
   ▼
Recommendation Engine
   │
   ▼
Murf AI Voice Output
```

---

# 🛠️ Tech Stack

## Frontend

- React 19
- TypeScript
- Vite
- CSS

---

## Backend

- Supabase
- PostgreSQL
- Supabase Authentication
- Row Level Security (RLS)

---

## Artificial Intelligence

- Google Gemini API

---

## Voice AI

- Browser Speech Recognition
- Murf AI Text-to-Speech

---

## Deployment

- Vercel

---

# 📂 Project Structure

```text
Supply-Market/
│
├── public/
├── src/
│
├── assets/
├── components/
├── context/
├── hooks/
├── pages/
│   ├── HomePage
│   ├── BuyerDashboard
│   ├── SellerDashboard
│   └── UserDashboard
│
├── services/
│   ├── geminiService
│   ├── murfService
│   ├── speechService
│   ├── localization
│   ├── supabase
│   └── supplierData
│
├── types/
├── schema.sql
├── seed.sql
├── App.tsx
├── main.tsx
├── .env.example
└── README.md
```

---

# ⚙️ Installation

Clone Repository

```bash
git clone https://github.com/YOUR_USERNAME/Supply-Market.git
```

Move into Project

```bash
cd Supply-Market
```

Install Dependencies

```bash
npm install
```

Create `.env`

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_MURF_API_KEY=your_murf_api_key

VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

Run Project

```bash
npm run dev
```

---

# 🔑 Environment Variables

| Variable | Description |
|-----------|-------------|
| VITE_GEMINI_API_KEY | Google Gemini API |
| VITE_MURF_API_KEY | Murf AI API |
| VITE_SUPABASE_URL | Supabase Project URL |
| VITE_SUPABASE_ANON_KEY | Supabase Anonymous Key |

---

# 🗄️ Database Schema

The application uses PostgreSQL tables:

- users
- suppliers
- products
- buyerrequests
- airecommendations

The repository also includes

- schema.sql
- seed.sql

to initialize the complete database with demo data.

---

# 🎯 Use Cases

- Manufacturing Procurement
- Supplier Discovery
- MSMEs
- Wholesale Businesses
- Agriculture Supply Chain
- Textile Industry
- Construction Industry
- Packaging Industry

---

# 📸 Screenshots

Include screenshots of

- Home Page
- Buyer Dashboard
- Seller Dashboard
- AI Search
- Authentication
- User Dashboard
- Supplier Search Results

---

# 🔮 Future Enhancements

- Live Supplier Verification
- Order Tracking
- Payment Gateway
- AI Price Prediction
- AI Demand Forecasting
- GST Invoice Generation
- ERP Integration
- WhatsApp Notifications
- AI Negotiation Assistant

---

# 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Open a Pull Request

---

# 📄 License

Licensed under the MIT License.

---

# 👨‍💻 Developer

**Bhargav Ramana Marchi**

GitHub

https://github.com/bhargavramanamarchi

---

# ⭐ Support

If you found this project useful,

⭐ Star the repository

Share your feedback

Contribute improvements

Thank you for visiting Supply Market AI.