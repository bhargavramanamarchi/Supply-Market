export interface DbUser {
  id: string; // UUID from auth.users
  full_name: string;
  email: string;
  organization: string | null;
  phone: string | null;
  account_type: 'buyer' | 'seller' | 'both';
  city: string | null;
  created_at: string;
}

export interface DbSupplier {
  id: string; // UUID
  user_id: string; // UUID references Users(id)
  company_name: string;
  location: string;
  verified: boolean;
  rating: number;
  trust_score?: number;
  contact_number?: string | null;
  business_hours?: string | null;
  created_at: string;
}

export interface DbProduct {
  id: string; // UUID
  supplier_id: string; // UUID references Suppliers(id)
  product_name: string;
  category: string;
  quantity: number;
  unit: string;
  price: number;
  description: string;
  available: boolean;
  created_at: string;
}

export interface DbBuyerRequest {
  id: string; // UUID
  buyer_id: string; // UUID references Users(id)
  requirement: string;
  language: string;
  status: string;
  created_at: string;
}

export interface DbAIRecommendation {
  id: string; // UUID
  request_id: string; // UUID references BuyerRequests(id)
  supplier_id: string; // UUID references Suppliers(id)
  confidence_score: number;
  created_at: string;
}

export interface DbNotification {
  id: string;
  supplier_id: string;
  buyer_name: string;
  buyer_company: string;
  product: string;
  quantity: string;
  priority: string;
  confidence_score: number;
  status: string;
  read: boolean;
  created_at: string;
}

export interface DbConversationHistory {
  id: string;
  session_id: string;
  user_id?: string | null;
  role: 'user' | 'assistant';
  message: string;
  created_at: string;
}

export interface DbBuyerDecision {
  id: string;
  user_id: string;
  request_id: string | null;
  supplier_id: string | null;
  decision: 'connect' | 'view_more' | 'ask_ai';
  created_at: string;
}

export interface DbConversationIntelligence {
  id: string;
  session_id: string;
  buyer_id?: string | null;
  supplier_id?: string | null;
  buyer_name: string;
  buyer_company: string;
  supplier_name: string;
  product: string;
  quantity: string;
  language: string;
  ai_summary: string;
  decision_report: string;
  transcript: any;
  status: string;
  priority: string;
  closing_probability: number;
  timeline: any;
  sales_coach_report: any;
  whatsapp_status: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: DbUser;
        Insert: Omit<DbUser, 'created_at'> & { created_at?: string };
        Update: Partial<DbUser>;
      };
      suppliers: {
        Row: DbSupplier;
        Insert: Omit<DbSupplier, 'id'> & { id?: string };
        Update: Partial<DbSupplier>;
      };
      products: {
        Row: DbProduct;
        Insert: Omit<DbProduct, 'id'> & { id?: string };
        Update: Partial<DbProduct>;
      };
      buyerrequests: {
        Row: DbBuyerRequest;
        Insert: Omit<DbBuyerRequest, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<DbBuyerRequest>;
      };
      airecommendations: {
        Row: DbAIRecommendation;
        Insert: Omit<DbAIRecommendation, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<DbAIRecommendation>;
      };
      notifications: {
        Row: DbNotification;
        Insert: Omit<DbNotification, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<DbNotification>;
      };
      conversation_history: {
        Row: DbConversationHistory;
        Insert: Omit<DbConversationHistory, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<DbConversationHistory>;
      };
      buyer_decisions: {
        Row: DbBuyerDecision;
        Insert: Omit<DbBuyerDecision, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<DbBuyerDecision>;
      };
      conversation_intelligence: {
        Row: DbConversationIntelligence;
        Insert: Omit<DbConversationIntelligence, 'id' | 'created_at'> & { id?: string; created_at?: string };
        Update: Partial<DbConversationIntelligence>;
      };
    };
  };
}

