import React, { createContext, useContext, useState, useEffect } from "react";
import { LOCALIZATION_DICTIONARY } from "../services/localization";
import type { Language } from "../services/localization";

interface LanguageContextProps {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem("supply_market_language");
    return (saved as Language) || "English";
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const setLanguage = (newLang: Language) => {
    setLanguageState(newLang);
    localStorage.setItem("supply_market_language", newLang);

    // Fetch translated toast message matching the newly selected language
    const msg = LOCALIZATION_DICTIONARY[newLang]?.langChangedToast || `Language changed to ${newLang}.`;
    setToastMessage(msg);
  };

  // Clear toast message after delay
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const t = (key: string): string => {
    const langDict = LOCALIZATION_DICTIONARY[language];
    if (langDict && langDict[key]) {
      return langDict[key];
    }
    // Fallback to English dictionary if key is missing in target language
    const engDict = LOCALIZATION_DICTIONARY["English"];
    if (engDict && engDict[key]) {
      return engDict[key];
    }
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}

      {/* Global Language Changing Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-[9999] animate-fade-in-up">
          <div className="flex items-center gap-2.5 rounded-xl border border-app-border bg-white dark:bg-slate-900 px-4 py-3 shadow-premium-lg">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-xs font-bold text-app-text">{toastMessage}</span>
          </div>
        </div>
      )}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextProps => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
