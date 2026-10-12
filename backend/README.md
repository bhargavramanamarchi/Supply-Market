# Backend Boundary Documentation — Supply Market

## Current Backend Architecture

Supply Market operates on a **BaaS (Backend-as-a-Service)** architecture:

- **Primary Backend & Database**: **Supabase** (PostgreSQL, Row Level Security, Realtime, and Authentication).
- **Client Integration**: The application in `frontend/` connects directly to Supabase via `@supabase/supabase-js` using standard environment variables (`VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`).
- **AI Services**:
  - **Google Gemini AI**: Direct client-side SDK integration (`@google/generative-ai`) for natural language procurement analysis, recommendation explanation, and intelligent supplier matching.
  - **Murf AI**: Direct REST integration for multilingual text-to-speech audio synthesis.
  - **Web Speech API**: Client-side speech recognition and synthesis fallback.

## Architectural Boundary Note

1. **No Custom Express / Node.js Server**:
   - There is deliberately **no custom Express or HTTP server application** in this directory.
   - All authorization and database security are enforced by Supabase Row Level Security (RLS) policies configured in `supabase/schema.sql` and `supabase/migrations/`.
2. **Future Server-Side Extensions**:
   - If genuine server-side requirements emerge (such as webhook verification, backend job schedulers, or secret-holding proxy endpoints), they will be placed here with dedicated controllers, routes, and middleware.
   - Any such addition will require explicit architectural design and approval.
