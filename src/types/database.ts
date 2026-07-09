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
    };
  };
}
