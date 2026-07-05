import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ThemeContext";
import { Navbar } from "./components/Navbar";
import { BuyerPage } from "./pages/BuyerPage";
import { SellerPage } from "./pages/SellerPage";
import { UserDashboard } from "./pages/UserDashboard";
import { HomePage } from "./pages/HomePage";
import { Bot, ShieldCheck } from "lucide-react";
import { useLanguage } from "./context/LanguageContext";

const App: React.FC = () => {
  const { t } = useLanguage();

  return (
    <ThemeProvider>
      <BrowserRouter>
        <div className="flex flex-col min-h-screen bg-app-bg text-app-text transition-colors duration-300">
          
          {/* Top workspace navigation */}
          <Navbar />

          {/* Core Panel Content */}
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<BuyerPage />} />
              <Route path="/seller" element={<SellerPage />} />
              <Route path="/user" element={<UserDashboard />} />
              <Route path="/home" element={<HomePage />} />
            </Routes>
          </main>

          {/* Application Footer */}
          <footer className="border-t border-app-border bg-app-card py-6 transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-app-text-secondary">
                <div className="flex items-center gap-1.5 font-bold">
                  <Bot className="h-4.5 w-4.5 text-primary animate-pulse" />
                  <span className="text-app-text">{t("heroHeading")}</span>
                  <ShieldCheck className="h-3.5 w-3.5 text-secondary" />
                  <span>{t("heroSubtitle")}</span>
                </div>
                <p>© {new Date().getFullYear()} {t("heroHeading")}.</p>
              </div>
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
