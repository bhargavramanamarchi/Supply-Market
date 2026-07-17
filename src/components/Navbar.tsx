import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Sun, Moon, Menu, X, Bot, ShieldCheck, User, Bell, Languages } from "lucide-react";
import { useTheme } from "./ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { getStoredNotifications, saveNotifications, playNotificationChime } from "../services/notificationService";

export const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const { user, openAuthModal } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangDropdown, setShowLangDropdown] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navLinks = [
    { name: t("buyerDashboard"), path: "/" },
    { name: t("sellerDashboard"), path: "/seller" }
  ].filter(link => {
    if (!user) return false;
    if (link.path === "/" && user.account_type === "seller") return false;
    if (link.path === "/seller" && user.account_type === "buyer") return false;
    return true;
  });

  const languagesList: Array<"English" | "Telugu" | "Hindi" | "Tamil" | "Kannada" | "Malayalam"> = [
    "English", "Telugu", "Hindi", "Tamil", "Kannada", "Malayalam"
  ];

  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    // Initialize from local storage
    setNotifications(getStoredNotifications());

    // Observer/handler for storage changes (cross-view sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "supply_market_notifications") {
        setNotifications(getStoredNotifications());
      }
    };

    // Observer/handler for custom events (chime trigger + immediate sync in same tab)
    const handleCustomNotification = () => {
      playNotificationChime();
      setNotifications(getStoredNotifications());
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("new-notification", handleCustomNotification);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("new-notification", handleCustomNotification);
    };
  }, [user]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    return location.pathname.startsWith(path) && location.pathname !== "/";
  };

  const handleMarkAllRead = () => {
    const updated = notifications.map(n => ({ ...n, unread: false }));
    saveNotifications(updated);
  };

  return (
    <nav className="sticky top-0 z-40 w-full glass-panel border-b border-app-border transition-all duration-300">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/home" className="flex items-center gap-2 group">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-secondary text-white shadow-premium">
                <Bot className="h-5 w-5 transition-transform duration-300 group-hover:rotate-6" />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-bold tracking-tight text-app-text flex items-center gap-1">
                  {t("heroHeading")}
                  <ShieldCheck className="h-4 w-4 text-secondary fill-secondary/10" />
                </span>
                <span className="text-[10px] font-medium tracking-wider text-app-text-secondary uppercase -mt-1">
                  {t("heroSubtitle")}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-semibold transition-all duration-200 hover:text-primary ${
                  isActive(link.path)
                    ? "text-primary border-b-2 border-primary py-1"
                    : "text-app-text-secondary"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Side Controls */}
          <div className="hidden md:flex items-center space-x-4">
            
            {/* Language Selector Dropdown */}
            <div className="relative">
              <button
                onClick={() => { setShowLangDropdown(!showLangDropdown); setShowNotifications(false); }}
                className="flex items-center gap-1.5 h-10 px-3 rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text text-xs font-bold transition-colors cursor-pointer select-none"
              >
                <Languages className="h-4 w-4 text-primary" />
                <span>{language}</span>
              </button>

              {showLangDropdown && (
                <div className="absolute right-0 mt-2 w-40 rounded-xl border border-app-border bg-app-card shadow-premium py-1 animate-fade-in-up">
                  {languagesList.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setLanguage(lang);
                        setShowLangDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs hover:bg-app-bg transition-colors font-medium ${
                        language === lang ? "text-primary font-bold" : "text-app-text"
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Center Trigger */}
            <div className="relative">
              <button
                onClick={() => { setShowNotifications(!showNotifications); setShowLangDropdown(false); }}
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text transition-colors duration-200 cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="h-4.5 w-4.5" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-white leading-none">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-app-border bg-app-card shadow-premium-lg overflow-hidden animate-fade-in-up">
                  <div className="bg-app-bg px-4 py-2.5 border-b border-app-border flex justify-between items-center text-xs font-bold">
                    <span className="text-app-text">{t("notifCenter")}</span>
                    <button 
                      onClick={handleMarkAllRead} 
                      className="text-primary hover:underline font-bold"
                    >
                      {t("allRead")}
                    </button>
                  </div>
                  <div className="divide-y divide-app-border max-h-64 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-xs text-app-text-secondary">
                        No notifications yet.
                      </div>
                    ) : (
                      notifications.map((notif) => (
                        <div key={notif.id} className={`p-3 text-xs space-y-1 hover:bg-app-bg transition-colors ${notif.unread ? 'bg-primary/5' : ''}`}>
                          <p className="text-app-text leading-normal">{notif.text}</p>
                          <span className="text-[10px] text-app-text-secondary block text-right">{notif.time}</span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text transition-colors duration-200 cursor-pointer"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-4.5 w-4.5 text-primary" />
              ) : (
                <Sun className="h-4.5 w-4.5 text-accent" />
              )}
            </button>

            {/* User Profile Badge or Sign In */}
            {user ? (
              <button
                onClick={() => navigate("/user")}
                className="flex items-center gap-2 border-l border-app-border pl-4 hover:opacity-90 transition-opacity cursor-pointer text-left animate-fade-in"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
                  <span>{user.name ? user.name.split(" ").map(n => n[0]).join("").toUpperCase() : "U"}</span>
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-xs font-bold text-app-text leading-tight">{user.name}</span>
                  <span className="text-[9px] text-app-text-secondary font-medium uppercase leading-none">
                    {user.role === "Buyer Account" ? t("buyerAccount") : user.role === "Seller Account" ? t("sellerDashboard") : t("bothBadge")}
                  </span>
                </div>
              </button>
            ) : (
              <button
                onClick={openAuthModal}
                className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white px-4.5 py-2 text-xs font-bold shadow-premium cursor-pointer transition-all duration-200"
              >
                <User className="h-3.5 w-3.5" />
                <span>{language === "Telugu" ? "లాగ్ ఇన్" : language === "Hindi" ? "साइन इन" : language === "Tamil" ? "உள்நுழை" : language === "Kannada" ? "ಸೈನ್ ಇನ್" : language === "Malayalam" ? "സൈൻ ഇൻ" : "Sign In"}</span>
              </button>
            )}

          </div>

          {/* Mobile menu controls */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-app-border bg-app-card text-app-text cursor-pointer"
            >
              {theme === "light" ? <Moon className="h-4 w-4 text-primary" /> : <Sun className="h-4 w-4 text-accent" />}
            </button>
            
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center rounded-lg p-2 text-app-text hover:bg-app-card-hover cursor-pointer"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer menu */}
      {isOpen && (
        <div className="md:hidden animate-fade-in-up border-t border-app-border bg-app-card/95 backdrop-blur-lg">
          <div className="space-y-1.5 px-4 py-3 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block rounded-lg px-3 py-2 text-base font-semibold ${
                  isActive(link.path)
                    ? "bg-primary/10 text-primary"
                    : "text-app-text-secondary hover:bg-app-card-hover"
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Language Selection */}
            <div className="border-t border-app-border pt-3 mt-3">
              <span className="text-xs font-bold text-app-text-secondary uppercase px-3">{t("speechLanguageInterface")}:</span>
              <div className="grid grid-cols-3 gap-1.5 mt-2 px-3">
                {languagesList.map(lang => (
                  <button
                    key={lang}
                    onClick={() => {
                      setLanguage(lang);
                      setIsOpen(false);
                    }}
                    className={`py-1.5 text-xs rounded border text-center font-semibold cursor-pointer ${
                      language === lang 
                        ? "bg-primary text-white border-primary" 
                        : "border-app-border text-app-text bg-app-bg"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>
            </div>

            {/* Mobile User Profile details or Sign In */}
            {user ? (
              <div 
                onClick={() => { setIsOpen(false); navigate("/user"); }}
                className="border-t border-app-border mt-4 pt-4 flex items-center gap-3 px-3 cursor-pointer animate-fade-in"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 border border-primary/20 text-primary font-bold">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col text-left">
                  <span className="text-sm font-bold text-app-text">{user.name}</span>
                  <span className="text-xs text-app-text-secondary">
                    {user.role === "Buyer Account" ? t("buyerAccount") : user.role === "Seller Account" ? t("sellerDashboard") : t("bothBadge")} • {t("profile")}
                  </span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => { setIsOpen(false); openAuthModal(); }}
                className="w-full mt-4 pt-4 border-t border-app-border flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white py-2.5 text-sm font-bold shadow-premium cursor-pointer"
              >
                <User className="h-4 w-4" />
                <span>{language === "Telugu" ? "లాగ్ ఇన్" : language === "Hindi" ? "साइन इन" : language === "Tamil" ? "உள்நுழை" : language === "Kannada" ? "ಸೈನ್ ಇನ್" : language === "Malayalam" ? "സൈൻ ഇൻ" : "Sign In"}</span>
              </button>
            )}

          </div>
        </div>
      )}
    </nav>
  );
};
