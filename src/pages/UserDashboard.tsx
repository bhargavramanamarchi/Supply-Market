import React, { useState } from "react";
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
  UserPlus,
  UserMinus,
  ExternalLink
} from "lucide-react";
import { useTheme } from "../components/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut } from "lucide-react";

export const UserDashboard: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"profile" | "connections" | "activity" | "settings">("profile");

  const handleSignOut = () => {
    signOut();
    navigate("/home");
  };

  // Mock connections data
  const [connections, setConnections] = useState([
    { id: "sup_1", name: "ABC Traders", city: "Vijayawada", product: "Turmeric, Rice", status: "Connected", isFollowing: true },
    { id: "sup_2", name: "Sri Lakshmi Enterprises", city: "Hyderabad", product: "Rice, Cotton", status: "Connected", isFollowing: true },
    { id: "sup_5", name: "Sai Packaging", city: "Bengaluru", product: "Packaging", status: "Pending", isFollowing: false },
    { id: "sup_4", name: "RK Steel Mart", city: "Chennai", product: "Steel", status: "Following", isFollowing: true },
    { id: "sup_6", name: "Warangal Cement Agency", city: "Warangal", product: "Cement", status: "None", isFollowing: false },
  ]);

  const handleFollowToggle = (id: string) => {
    setConnections(prev => prev.map(c => {
      if (c.id === id) {
        const nextFollowing = !c.isFollowing;
        let nextStatus = c.status;
        if (nextFollowing && c.status === "None") nextStatus = "Following";
        else if (!nextFollowing && c.status === "Following") nextStatus = "None";
        return { ...c, isFollowing: nextFollowing, status: nextStatus };
      }
      return c;
    }));
  };

  const handleConnectToggle = (id: string) => {
    setConnections(prev => prev.map(c => {
      if (c.id === id) {
        let nextStatus = c.status;
        if (c.status === "Connected") {
          nextStatus = c.isFollowing ? "Following" : "None";
        } else if (c.status === "Pending") {
          nextStatus = c.isFollowing ? "Following" : "None";
        } else {
          nextStatus = "Pending";
        }
        return { ...c, status: nextStatus };
      }
      return c;
    }));
  };

  // Recent activity subtabs
  const [activityTab, setActivityTab] = useState<"buyer" | "seller">("buyer");

  const buyerActivities = {
    searches: [
      { text: 'Sourced "100kg turmeric in Vijayawada"', time: "Today, 03:00 PM" },
      { text: 'Sourced "premium basmati rice bulk"', time: "Yesterday" }
    ],
    connections: [
      { name: "Sri Lakshmi Enterprises", status: "Connected", date: "04 July 2026" }
    ],
    saved: [
      { name: "ABC Traders", category: "Turmeric" }
    ],
    conversations: [
      { topic: "Turmeric Sourcing Consultation", date: "Today" }
    ]
  };

  const sellerActivities = {
    buyers: [
      { name: "Verma Food Industries", product: "Turmeric Powder", date: "Today" }
    ],
    orders: [
      { id: "ORD-9843", amount: "₹18,000", status: "Pending" }
    ],
    updates: [
      { text: "Updated Superfine Basmati Rice stock to 12,000kg", date: "Yesterday" }
    ]
  };

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
                <div className="text-center sm:text-left space-y-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <h2 className="text-xl font-bold text-app-text">{user ? user.name : "Sai Kumar"}</h2>
                    <span className="inline-flex items-center gap-1 rounded bg-secondary/15 border border-secondary/35 text-[10px] font-bold text-secondary px-2 py-0.5">
                      <ShieldCheck className="h-3 w-3" />
                      {user ? (user.role === "Buyer Account" ? t("buyerAccount") : user.role === "Seller Account" ? t("sellerDashboard") : t("bothBadge")) : t("bothBadge")}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-primary">{user?.company || "IndoCorp Agro Food Products"}</p>
                  <p className="text-xs text-app-text-secondary">{user?.position || t("procurementManager")}</p>
                </div>
              </div>

              {/* Bio Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm pb-6 border-b border-app-border">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="h-4.5 w-4.5 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">{t("corporateEmail")}</span>
                      <span className="font-semibold text-app-text">{user ? user.email : "skumar@indocorp.com"}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="h-4.5 w-4.5 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">{t("mobilePhone")}</span>
                      <span className="font-semibold text-app-text">+91 90008 90009</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4.5 w-4.5 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">{t("headquarters")}</span>
                      <span className="font-semibold text-app-text">Hyderabad, Telangana</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4.5 w-4.5 text-primary" />
                    <div>
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">{t("activeCatalogReg")}</span>
                      <span className="font-semibold text-app-text">Verified IndoCorp Spices</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Professional Sign Out Button */}
              <div className="flex justify-end pt-2">
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
                {connections.map((c) => (
                  <div key={c.id} className="py-4 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:bg-app-bg/25 px-2 rounded-xl transition-colors">
                    <div>
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-bold text-app-text">{c.name}</strong>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold border ${
                          c.status === "Connected" 
                            ? "bg-success/10 border-success/20 text-success" 
                            : c.status === "Pending"
                              ? "bg-amber-100 border-amber-200 text-amber-600 animate-pulse"
                              : c.status === "Following"
                                ? "bg-primary/10 border-primary/20 text-primary"
                                : "bg-slate-100 border-slate-200 text-app-text-secondary"
                        }`}>
                          {c.status}
                        </span>
                      </div>
                      <span className="text-xs text-app-text-secondary block mt-0.5">Sells: {c.product} | City: {c.city}</span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      {/* Follow Button */}
                      <button
                        onClick={() => handleFollowToggle(c.id)}
                        className={`flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-bold border transition-colors cursor-pointer ${
                          c.isFollowing 
                            ? "bg-primary/15 border-primary text-primary" 
                            : "border-app-border bg-app-card text-app-text hover:bg-app-card-hover"
                        }`}
                      >
                        {c.isFollowing ? <UserMinus className="h-3.5 w-3.5" /> : <UserPlus className="h-3.5 w-3.5" />}
                        <span>{c.isFollowing ? t("followingBtn") : t("followBtn")}</span>
                      </button>

                      {/* Connect Button */}
                      <button
                        onClick={() => handleConnectToggle(c.id)}
                        className={`rounded-lg px-2.5 py-1.5 font-bold border transition-colors cursor-pointer ${
                          c.status === "Connected"
                            ? "border-danger bg-danger/10 text-danger hover:bg-danger/15"
                            : "bg-primary text-white border-primary hover:opacity-90"
                        }`}
                      >
                        {c.status === "Connected" ? t("removeConn") : c.status === "Pending" ? "Pending..." : t("connectBtn")}
                      </button>

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
                ))}
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
                        {buyerActivities.searches.map((s, idx) => (
                          <div key={idx} className="bg-app-bg border border-app-border p-2.5 rounded-lg flex justify-between items-center">
                            <span className="text-app-text font-medium">{s.text}</span>
                            <span className="text-[9px] text-app-text-secondary">{s.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("recentConversationalLogs")}</strong>
                      <div className="bg-app-bg border border-app-border p-3 rounded-lg flex justify-between items-center">
                        <span className="font-semibold text-app-text">Turmeric pricing search details</span>
                        <span className="text-[9px] text-app-text-secondary">Today</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Column Saved suppliers/connections */}
                  <div className="space-y-4 sm:border-l sm:border-app-border sm:pl-4">
                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("savedSourcedSuppliers")}</strong>
                      <div className="space-y-2">
                        {buyerActivities.saved.map((s, idx) => (
                          <div key={idx} className="bg-app-bg border border-app-border p-2.5 rounded-lg flex justify-between items-center">
                            <div>
                              <strong className="text-app-text font-bold block">{s.name}</strong>
                              <span className="text-[10px] text-app-text-secondary">{s.category}</span>
                            </div>
                            <ExternalLink className="h-4 w-4 text-primary" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("hotlinePurchaseHistory")}</strong>
                      <div className="bg-app-bg border border-app-border p-3 rounded-lg flex justify-between items-center text-xs">
                        <div>
                          <strong className="text-app-text block">150 kg Turmeric Powder</strong>
                          <span className="text-[10px] text-app-text-secondary">From ABC Traders</span>
                        </div>
                        <span className="font-bold text-primary">₹18,000</span>
                      </div>
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
                        {sellerActivities.buyers.map((s, idx) => (
                          <div key={idx} className="bg-app-bg border border-app-border p-2.5 rounded-lg flex justify-between items-center">
                            <span className="text-app-text font-medium">{s.name} connected</span>
                            <span className="text-[9px] text-app-text-secondary">{s.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <strong className="text-[10px] font-bold text-app-text-secondary uppercase tracking-wider block mb-2">{t("supplierCatalogChanges")}</strong>
                      <div className="space-y-2">
                        {sellerActivities.updates.map((s, idx) => (
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
                        {sellerActivities.orders.map((s, idx) => (
                          <div key={idx} className="bg-app-bg border border-app-border p-2.5 rounded-lg flex justify-between items-center text-xs">
                            <div>
                              <strong className="text-app-text block">{s.id}</strong>
                              <span className="text-[10px] text-app-text-secondary">Value: {s.amount}</span>
                            </div>
                            <span className="px-2 py-0.5 rounded bg-primary/15 text-primary text-[9px] font-bold">{s.status}</span>
                          </div>
                        ))}
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
