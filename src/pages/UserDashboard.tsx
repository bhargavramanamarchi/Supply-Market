import React, { useState, useEffect } from "react";
import { 
  User, 
  Settings, 
  Users, 
  Activity, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin, 
  CheckCircle, 
  Bell, 
  Volume2, 
  Mic,
  Moon,
  Sun,
  MessageSquare,
  UserMinus,
  ExternalLink
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { LogOut, Edit2, Save, XCircle } from "lucide-react";
import { supabase } from "../services/supabase";

export const UserDashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { user, signOut, updateProfile, unfollowSupplier } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "connections" | "activity" | "settings">("profile");

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editCompany, setEditCompany] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditCompany(user.company || "");
      setEditPhone(user.phone || "");
      setEditCity(user.city || "");
      setEditState(user.state || "");
    }
  }, [user, isEditing]);

  const handleSaveProfile = async () => {
    if (!editName.trim()) {
      alert("Name cannot be empty");
      return;
    }
    setIsSaving(true);
    const success = await updateProfile({
      full_name: editName,
      organization: editCompany,
      phone: editPhone,
      city: editCity,
      state: editState
    });
    setIsSaving(false);
    if (success) {
      setIsEditing(false);
    }
  };

  const handleSignOut = () => {
    signOut();
    navigate("/home");
  };

  // Real dashboard connections, searches and activity data
  const [buyerSearches, setBuyerSearches] = useState<any[]>([]);
  const [buyerSaved, setBuyerSaved] = useState<any[]>([]);
  const [sellerBuyers, setSellerBuyers] = useState<any[]>([]);
  const [sellerOrders, setSellerOrders] = useState<any[]>([]);
  const [supplierProfile, setSupplierProfile] = useState<any>(null);
  const [followedSuppliers, setFollowedSuppliers] = useState<any[]>([]);

  // Recent activity subtabs
  const [activityTab, setActivityTab] = useState<"buyer" | "seller">("buyer");

  const loadFollowedSuppliers = async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('buyer_follows')
        .select(`
          id,
          supplier_id,
          suppliers (
            id,
            company_name,
            location,
            rating,
            trust_score,
            contact_number,
            business_hours,
            products (
              category
            )
          )
        `)
        .eq('buyer_id', user.id);

      if (error) {
        console.error("Error loading followed suppliers:", error);
        return;
      }

      const formatted = (data || []).map((row: any) => {
        const sup = row.suppliers;
        if (!sup) return null;
        
        const categories = sup.products && sup.products.length > 0
          ? Array.from(new Set(sup.products.map((p: any) => p.category))).join(', ') 
          : 'General Supplies';

        return {
          id: sup.id,
          name: sup.company_name,
          city: sup.location?.split(',')[0]?.trim() || sup.location,
          product: categories,
          status: 'Following',
          isFollowing: true,
          contactNumber: sup.contact_number
        };
      }).filter(Boolean);

      setFollowedSuppliers(formatted);
    } catch (err) {
      console.error("Error in loadFollowedSuppliers:", err);
    }
  };

  const handleUnfollow = async (supplierId: string) => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('buyer_follows')
        .delete()
        .eq('buyer_id', user.id)
        .eq('supplier_id', supplierId);

      if (error) {
        console.error("Error unfollowing supplier:", error);
        return;
      }
      
      setFollowedSuppliers(prev => prev.filter(c => c.id !== supplierId));
      if (unfollowSupplier) {
        await unfollowSupplier(supplierId);
      }
    } catch (err) {
      console.error("Error in handleUnfollow:", err);
    }
  };

  useEffect(() => {
    if (activeTab === "connections") {
      loadFollowedSuppliers();
    }
  }, [activeTab, user?.id]);

  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      try {
        // Query buyerrequests with their recommendations and suppliers
        const { data: requests, error } = await (supabase as any)
          .from('buyerrequests')
          .select('*, airecommendations(id, confidence_score, suppliers(*))')
          .eq('buyer_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Map searches for activity tab
        const searches = (requests || []).map((r: any) => ({
          text: `Sourced "${r.requirement}"`,
          time: new Date(r.created_at).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })
        }));
        setBuyerSearches(searches);

        // Map connections (from recommendations)
        const matchedSuppliersMap = new Map();
        (requests || []).forEach((r: any) => {
          (r.airecommendations || []).forEach((rec: any) => {
            if (rec.suppliers) {
              matchedSuppliersMap.set(rec.suppliers.id, {
                id: rec.suppliers.id,
                name: rec.suppliers.company_name,
                city: rec.suppliers.location.split(',')[0]?.trim() || rec.suppliers.location,
                product: r.requirement.split('for')[0]?.trim() || r.requirement,
                status: 'Connected',
                isFollowing: true
              });
            }
          });
        });

        const activeConnections = Array.from(matchedSuppliersMap.values());

        // For saved: just take the distinct suppliers from activeConnections
        const saved = activeConnections.map(c => ({
          name: c.name,
          category: c.product
        }));
        setBuyerSaved(saved);

        // If user is a seller or both, load supplier details & seller activities
        if (user.account_type === 'seller' || user.account_type === 'both') {
          const { data: supData } = await (supabase as any)
            .from('suppliers')
            .eq('user_id', user.id)
            .maybeSingle();

          if (supData) {
            setSupplierProfile(supData);

            const { data: recs, error: recsError } = await (supabase as any)
              .from('airecommendations')
              .select('*, request:buyerrequests(*, users(*))')
              .eq('supplier_id', supData.id)
              .order('created_at', { ascending: false });

            if (recsError) throw recsError;

            const buyers = (recs || []).map((r: any) => ({
              name: r.request?.users?.full_name || 'Anonymous Buyer',
              product: r.request?.requirement || 'Product Sourcing',
              date: new Date(r.created_at).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short'
              })
            }));
            setSellerBuyers(buyers);

            // Map mock orders based on recommendations (since there is no orders table)
            const orders = (recs || []).map((_r: any, idx: number) => ({
              id: `ORD-${9800 + idx}`,
              amount: `₹${(20000 + idx * 5000).toLocaleString('en-IN')}`,
              status: idx % 2 === 0 ? 'Completed' : 'Pending'
            }));
            setSellerOrders(orders);
          }
        }

      } catch (err) {
        console.error("Error loading dashboard data:", err);
      }
    };

    loadData();
  }, [user]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-app-bg min-h-[calc(100vh-4rem)] transition-colors duration-300">
      
      {/* Page Title */}
      <div className="mb-8 border-b border-app-border pb-6">
        <h1 className="text-3xl font-extrabold text-app-text tracking-tight">{t("userConsole")}</h1>
        <p className="text-xs sm:text-sm text-app-text-secondary mt-1">{t("userConsoleDesc")}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Navigation Sidebar */}
        <div className="lg:col-span-1 rounded-2xl border border-app-border bg-app-card p-4.5 shadow-sm space-y-2 h-fit">
          <button
            onClick={() => setActiveTab("profile")}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "profile" 
                ? "bg-primary text-white" 
                : "text-app-text-secondary hover:bg-app-bg hover:text-app-text"
            }`}
          >
            <User className="h-4.5 w-4.5" />
            <span>{t("profileIdentity")}</span>
          </button>
          
          <button
            onClick={() => setActiveTab("connections")}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "connections" 
                ? "bg-primary text-white" 
                : "text-app-text-secondary hover:bg-app-bg hover:text-app-text"
            }`}
          >
            <Users className="h-4.5 w-4.5" />
            <span>{t("hotlineConnections")}</span>
          </button>

          <button
            onClick={() => setActiveTab("activity")}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "activity" 
                ? "bg-primary text-white" 
                : "text-app-text-secondary hover:bg-app-bg hover:text-app-text"
            }`}
          >
            <Activity className="h-4.5 w-4.5" />
            <span>{t("recentActivity")}</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-2.5 px-4 py-3 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
              activeTab === "settings" 
                ? "bg-primary text-white" 
                : "text-app-text-secondary hover:bg-app-bg hover:text-app-text"
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            <span>{t("consoleSettings")}</span>
          </button>
        </div>

        {/* Dynamic Panels */}
        <div className="lg:col-span-3">
          
          {/* PROFILE VIEW */}
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-app-border bg-app-card p-6 shadow-sm space-y-6 animate-fade-in-up">
              <div className="flex flex-col sm:flex-row items-center gap-6 border-b border-app-border pb-6">
                {/* Photo initials */}
                <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white text-3xl font-extrabold shadow">
                  {user ? user.name.split(" ").map(n => n[0]).join("") : "SK"}
                </div>
                <div className="text-center sm:text-left space-y-1.5 flex-grow">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="rounded-xl border border-app-border bg-app-bg px-3 py-1.5 text-app-text text-sm font-semibold focus:border-primary outline-none"
                        placeholder="Full Name"
                      />
                    ) : (
                      <h2 className="text-xl font-bold text-app-text">{user ? user.name : "Sai Kumar"}</h2>
                    )}
                    <span className="inline-flex items-center gap-1 rounded bg-secondary/15 border border-secondary/35 text-[10px] font-bold text-secondary px-2 py-0.5">
                      <ShieldCheck className="h-3 w-3" />
                      {user ? (user.role === "Buyer Account" ? t("buyerAccount") : user.role === "Seller Account" ? t("sellerDashboard") : t("bothBadge")) : t("bothBadge")}
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={editCompany}
                        onChange={(e) => setEditCompany(e.target.value)}
                        className="rounded-xl border border-app-border bg-app-bg px-3 py-1 text-primary text-xs font-semibold focus:border-primary outline-none w-full max-w-xs"
                        placeholder="Organization Name"
                      />
                    ) : (
                      <p className="text-sm font-semibold text-primary">{user?.company || ""}</p>
                    )}
                    <p className="text-xs text-app-text-secondary">{user?.position || ""}</p>
                  </div>
                </div>
              </div>

              {/* Bio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm pb-6 border-b border-app-border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4.5 w-4.5 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">{t("corporateEmail")}</span>
                      <span className="font-semibold text-app-text">{user ? user.email : ""}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4.5 w-4.5 text-primary" />
                    <div className="flex-grow">
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">{t("mobilePhone")}</span>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editPhone}
                          onChange={(e) => setEditPhone(e.target.value)}
                          className="rounded-lg border border-app-border bg-app-bg px-2 py-0.5 text-xs text-app-text focus:border-primary outline-none mt-0.5"
                          placeholder="Phone number"
                        />
                      ) : (
                        <span className="font-semibold text-app-text">{user?.phone || ""}</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4.5 w-4.5 text-primary" />
                    <div className="flex-grow">
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">{t("headquarters")}</span>
                      {isEditing ? (
                        <div className="flex gap-2 mt-1">
                          <input
                            type="text"
                            value={editCity}
                            onChange={(e) => setEditCity(e.target.value)}
                            className="rounded-lg border border-app-border bg-app-bg px-2 py-0.5 text-xs text-app-text focus:border-primary outline-none w-1/2"
                            placeholder="City"
                          />
                          <input
                            type="text"
                            value={editState}
                            onChange={(e) => setEditState(e.target.value)}
                            className="rounded-lg border border-app-border bg-app-bg px-2 py-0.5 text-xs text-app-text focus:border-primary outline-none w-1/2"
                            placeholder="State"
                          />
                        </div>
                      ) : (
                        <span className="font-semibold text-app-text">
                          {user?.city ? (user.state ? `${user.city}, ${user.state}` : user.city) : ""}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4.5 w-4.5 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">{t("activeCatalogReg")}</span>
                      <span className="font-semibold text-app-text">
                        {user?.account_type === 'buyer' 
                          ? 'Buyer Account Registered' 
                          : supplierProfile 
                            ? `${supplierProfile.company_name} (${supplierProfile.verified ? 'Verified' : 'Pending Verification'})`
                            : 'Seller Account Registered'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between items-center pt-2">
                {isEditing ? (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white px-4 py-2 text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer disabled:opacity-50"
                    >
                      <Save className="h-4 w-4" />
                      <span>{isSaving ? "Saving..." : "Save"}</span>
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="flex items-center gap-1.5 rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text px-4 py-2 text-xs sm:text-sm font-bold shadow-sm transition-colors cursor-pointer"
                    >
                      <XCircle className="h-4 w-4" />
                      <span>Cancel</span>
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-1.5 rounded-xl border border-primary text-primary hover:bg-primary/5 px-4 py-2 text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                  >
                    <Edit2 className="h-4 w-4" />
                    <span>Edit Profile</span>
                  </button>
                )}
                
                <button
                  onClick={handleSignOut}
                  className="flex items-center gap-2 rounded-xl border border-danger/35 hover:border-danger bg-danger/5 hover:bg-danger/10 text-danger px-5 py-2.5 text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
                >
                  <LogOut className="h-4.5 w-4.5" />
                  <span>{t("logout")}</span>
                </button>
              </div>
            </div>
          )}

          {/* CONNECTIONS VIEW */}
          {activeTab === "connections" && (
            <div className="rounded-2xl border border-app-border bg-app-card p-6 shadow-sm space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-lg font-bold text-app-text">{t("connHotlineTitle")}</h2>
                <p className="text-xs text-app-text-secondary mt-0.5">{t("connHotlineDesc")}</p>
              </div>

              <div className="divide-y divide-app-border">
                {followedSuppliers.length === 0 ? (
                  <div className="py-8 text-center text-app-text-secondary text-sm">
                    No followed suppliers yet. Add suppliers to your Hotline Connections using the Sourcing Assistant or Directory.
                  </div>
                ) : (
                  followedSuppliers.map((c) => (
                    <div key={c.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-app-bg/25 px-2 rounded-xl transition-colors">
                      <div>
                        <div className="flex items-center gap-2">
                          <strong className="text-sm font-bold text-app-text">{c.name}</strong>
                          <span className="px-2 py-0.5 rounded text-[9px] font-extrabold border bg-success/10 border-success/20 text-success">
                            {c.status}
                          </span>
                        </div>
                        <span className="text-xs text-app-text-secondary block mt-0.5">Sells: {c.product} | City: {c.city}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 text-xs">
                        {/* Remove / Unfollow Button */}
                        <button
                          onClick={() => handleUnfollow(c.id)}
                          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-bold border border-danger bg-danger/10 text-danger hover:bg-danger/15 cursor-pointer transition-colors"
                        >
                          <UserMinus className="h-3.5 w-3.5" />
                          <span>Remove</span>
                        </button>

                        {/* Call Representative Button */}
                        <a
                          href={`tel:${c.contactNumber || "+91 90008 90009"}`}
                          className="rounded-lg bg-primary text-white border-primary hover:opacity-90 px-2.5 py-1.5 font-bold border flex items-center gap-1.5"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          <span>Call Sales</span>
                        </a>

                        {/* Message/External Details */}
                        <button
                          onClick={() => alert(`Direct dialogue window initiated with ${c.name}`)}
                          className="rounded-lg border border-app-border bg-app-card hover:bg-app-card-hover text-app-text p-1.5 cursor-pointer"
                          title={t("sendMessage")}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* RECENT ACTIVITY VIEW */}
          {activeTab === "activity" && (
            <div className="rounded-2xl border border-app-border bg-app-card p-6 shadow-sm space-y-6 animate-fade-in-up">
              
              {/* Tab toggles */}
              <div className="flex border-b border-app-border">
                <button
                  onClick={() => setActivityTab("buyer")}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                    activityTab === "buyer" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-app-text-secondary"
                  }`}
                >
                  {t("buyerActivity")}
                </button>
                <button
                  onClick={() => setActivityTab("seller")}
                  className={`px-4 py-2 text-xs sm:text-sm font-bold border-b-2 transition-colors cursor-pointer ${
                    activityTab === "seller" 
                      ? "border-primary text-primary" 
                      : "border-transparent text-app-text-secondary"
                  }`}
                >
                  {t("sellerActivity")}
                </button>
              </div>

              {/* Buyer Feed */}
              {activityTab === "buyer" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                  
                  {/* Left Column Searches/AI summary */}
                  <div className="space-y-4">
                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("recentSearches")}</strong>
                      <div className="space-y-2">
                        {buyerSearches.length === 0 ? (
                          <div className="bg-app-bg border border-app-border p-3 rounded-lg text-app-text-secondary text-xs">
                            No searches logged yet.
                          </div>
                        ) : (
                          buyerSearches.map((s, idx) => (
                            <div key={idx} className="bg-app-bg border border-app-border p-2.5 rounded-lg flex justify-between items-center">
                              <span className="text-app-text font-medium">{s.text}</span>
                              <span className="text-[9px] text-app-text-secondary">{s.time}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("recentConversationalLogs")}</strong>
                      {buyerSearches.length === 0 ? (
                        <div className="bg-app-bg border border-app-border p-3 rounded-lg text-app-text-secondary text-xs">
                          No conversational logs.
                        </div>
                      ) : (
                        <div className="bg-app-bg border border-app-border p-3 rounded-lg flex justify-between items-center">
                          <span className="font-semibold text-app-text">Sourcing Assistant matched query</span>
                          <span className="text-[9px] text-app-text-secondary">Recent</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right Column Saved suppliers/connections */}
                  <div className="space-y-4 sm:border-l sm:border-app-border sm:pl-4">
                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("savedSourcedSuppliers")}</strong>
                      <div className="space-y-2">
                        {buyerSaved.length === 0 ? (
                          <div className="bg-app-bg border border-app-border p-3 rounded-lg text-app-text-secondary text-xs">
                            No saved suppliers.
                          </div>
                        ) : (
                          buyerSaved.map((s, idx) => (
                            <div key={idx} className="bg-app-bg border border-app-border p-2.5 rounded-lg flex justify-between items-center">
                              <div>
                                <strong className="text-app-text font-bold block">{s.name}</strong>
                                <span className="text-[10px] text-app-text-secondary">{s.category}</span>
                              </div>
                              <ExternalLink className="h-4 w-4 text-primary" />
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("hotlinePurchaseHistory")}</strong>
                      {buyerSaved.length === 0 ? (
                        <div className="bg-app-bg border border-app-border p-3 rounded-lg text-app-text-secondary text-xs">
                          No transaction history.
                        </div>
                      ) : (
                        <div className="bg-app-bg border border-app-border p-3 rounded-lg flex justify-between items-center text-xs">
                          <div>
                            <strong className="text-app-text block">Matched Supplier Contact Bridge</strong>
                            <span className="text-[10px] text-app-text-secondary">Hotline Bridge Connected</span>
                          </div>
                          <span className="font-bold text-primary">Connected</span>
                        </div>
                      )}
                    </div>
                  </div>

                </div>
              )}

              {/* Seller Feed */}
              {activityTab === "seller" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs sm:text-sm">
                  
                  <div className="space-y-4">
                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("connectedBuyerActions")}</strong>
                      <div className="space-y-2">
                        {sellerBuyers.length === 0 ? (
                          <div className="bg-app-bg border border-app-border p-3 rounded-lg text-app-text-secondary text-xs">
                            No buyer connections.
                          </div>
                        ) : (
                          sellerBuyers.map((s, idx) => (
                            <div key={idx} className="bg-app-bg border border-app-border p-2.5 rounded-lg flex justify-between items-center">
                              <span className="text-app-text font-medium">{s.name} connected for {s.product}</span>
                              <span className="text-[9px] text-app-text-secondary">{s.date}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("supplierCatalogChanges")}</strong>
                      <div className="space-y-2">
                        {[
                          { text: "Catalog sync complete with cloud registry", date: "Just now" }
                        ].map((s, idx) => (
                          <div key={idx} className="bg-app-bg border border-app-border p-2.5 rounded-lg text-xs">
                            <p className="text-app-text">{s.text}</p>
                            <span className="text-[9px] text-app-text-secondary block text-right mt-1">{s.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 sm:border-l sm:border-app-border sm:pl-4">
                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("catalogOrders")}</strong>
                      <div className="space-y-2">
                        {sellerOrders.length === 0 ? (
                          <div className="bg-app-bg border border-app-border p-3 rounded-lg text-app-text-secondary text-xs">
                            No catalog orders.
                          </div>
                        ) : (
                          sellerOrders.map((s, idx) => (
                            <div key={idx} className="bg-app-bg border border-app-border p-2.5 rounded-lg flex justify-between items-center text-xs">
                              <div>
                                <strong className="text-app-text block">{s.id}</strong>
                                <span className="text-[10px] text-app-text-secondary">Value: {s.amount}</span>
                              </div>
                              <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-[9px] font-bold">{s.status}</span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 space-y-2">
                      <strong className="text-[10px] font-bold text-primary uppercase block">{t("hotRestockSug")}</strong>
                      <p className="text-xs text-app-text-secondary leading-normal">
                        Turmeric catalog queries rose by 22% this week. We suggest keeping inventory levels high.
                      </p>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

          {/* SETTINGS VIEW */}
          {activeTab === "settings" && (
            <div className="rounded-2xl border border-app-border bg-app-card p-6 shadow-sm space-y-6 animate-fade-in-up">
              <div>
                <h2 className="text-lg font-bold text-app-text">{t("systemPref")}</h2>
                <p className="text-xs text-app-text-secondary mt-0.5">{t("systemPrefDesc")}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                
                {/* Left Side: Language & Theme */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <LanguagesIcon className="h-4 w-4 text-primary" />
                      <span>{t("speechLanguageInterface")}</span>
                    </label>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value as any)}
                      className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-xs sm:text-sm text-app-text focus:border-primary outline-none cursor-pointer"
                    >
                      <option>English</option>
                      <option>Telugu</option>
                      <option>Hindi</option>
                      <option>Tamil</option>
                      <option>Kannada</option>
                      <option>Malayalam</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      {theme === "light" ? <Sun className="h-4 w-4 text-primary" /> : <Moon className="h-4 w-4 text-primary" />}
                      <span>{t("themeMode")}</span>
                    </label>
                    <button
                      onClick={toggleTheme}
                      className="w-full flex justify-between items-center rounded-xl border border-app-border bg-app-bg px-4 py-2.5 text-xs sm:text-sm text-app-text hover:bg-app-card-hover font-semibold transition-colors cursor-pointer"
                    >
                      <span>{t("toggleModeTheme")}</span>
                      <span className="text-xs text-primary uppercase font-bold">{theme} Mode</span>
                    </button>
                  </div>
                </div>

                {/* Right Side: Voice Synthesizer & Microphone choices */}
                <div className="space-y-4 sm:border-l sm:border-app-border sm:pl-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Volume2 className="h-4 w-4 text-primary" />
                      <span>{t("voiceOutputEngine")}</span>
                    </label>
                    <select
                      className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-xs sm:text-sm text-app-text focus:border-primary outline-none"
                    >
                      <option>Murf AI Cloud Synthesizer (Active)</option>
                      <option disabled>Browser SpeechSynthesis (Fallback)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Mic className="h-4 w-4 text-primary" />
                      <span>{t("speechMicInput")}</span>
                    </label>
                    <select
                      className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-xs sm:text-sm text-app-text focus:border-primary outline-none"
                    >
                      <option>System Default Input Device</option>
                      <option disabled>Wireless Audio Input Hub</option>
                    </select>
                  </div>

                  <div className="space-y-2 pt-2">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Bell className="h-4 w-4 text-primary" />
                      <span>{t("notificationsCenter")}</span>
                    </label>
                    <div className="space-y-1.5 text-xs">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-3.5 w-3.5" />
                        <span>{t("notifConnAlerts")}</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked className="rounded text-primary focus:ring-primary h-3.5 w-3.5" />
                        <span>{t("notifStockAlerts")}</span>
                      </label>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};

// Internal mini language icon to prevent imports crashes
const LanguagesIcon = (props: any) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 8 6 6" />
    <path d="m4 14 6-6 2-3" />
    <path d="M2 5h12" />
    <path d="M7 2h1" />
    <path d="m22 22-5-10-5 10" />
    <path d="M14 18h6" />
  </svg>
);
