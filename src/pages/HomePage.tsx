import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  Search, 
  Bot, 
  Layers, 
  PhoneCall, 
  ShieldCheck, 
  Zap, 
  Languages, 
  UserCheck, 
  CheckCircle,
  Volume2
} from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  const steps = [
    {
      step: "1",
      title: t("step1Title"),
      desc: t("step1Desc"),
      icon: <Search className="h-6 w-6 text-primary" />
    },
    {
      step: "2",
      title: t("step2Title"),
      desc: t("step2Desc"),
      icon: <Bot className="h-6 w-6 text-primary animate-pulse" />
    },
    {
      step: "3",
      title: t("step3Title"),
      desc: t("step3Desc"),
      icon: <Layers className="h-6 w-6 text-primary" />
    },
    {
      step: "4",
      title: t("step4Title"),
      desc: t("step4Desc"),
      icon: <PhoneCall className="h-6 w-6 text-primary" />
    }
  ];

  const features = [
    {
      title: t("feat1Title"),
      desc: t("feat1Desc"),
      icon: <Zap className="h-5 w-5 text-primary" />
    },
    {
      title: t("feat2Title"),
      desc: t("feat2Desc"),
      icon: <ShieldCheck className="h-5 w-5 text-primary" />
    },
    {
      title: t("feat3Title"),
      desc: t("feat3Desc"),
      icon: <Volume2 className="h-5 w-5 text-primary" />
    },
    {
      title: t("feat4Title"),
      desc: t("feat4Desc"),
      icon: <Languages className="h-5 w-5 text-primary" />
    },
    {
      title: t("feat5Title"),
      desc: t("feat5Desc"),
      icon: <CheckCircle className="h-5 w-5 text-primary" />
    },
    {
      title: t("feat6Title"),
      desc: t("feat6Desc"),
      icon: <UserCheck className="h-5 w-5 text-primary" />
    }
  ];

  return (
    <div className="bg-app-bg text-app-text min-h-[calc(100vh-4rem)] transition-colors duration-300">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-app-border">
        {/* Decorative subtle gradient background circle */}
        <div className="absolute top-0 right-0 -translate-y-16 translate-x-16 w-[350px] h-[350px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 translate-y-16 -translate-x-16 w-[350px] h-[350px] bg-secondary/5 rounded-full blur-[100px] pointer-events-none" />

        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8 relative z-10 space-y-6">
          <div className="inline-flex items-center gap-1 rounded bg-primary/10 border border-primary/20 text-xs font-bold text-primary px-3 py-1 animate-pulse">
            <Bot className="h-4 w-4" />
            <span>AI Sourcing Ecosystem</span>
          </div>

          <h1 className="text-4xl font-extrabold tracking-tight text-app-text sm:text-6xl">
            {t("heroHeading")}
          </h1>
          <p className="text-lg sm:text-xl font-bold text-primary uppercase tracking-wider -mt-2">
            {t("heroSubtitle")}
          </p>

          <p className="text-sm sm:text-base text-app-text-secondary max-w-2xl mx-auto leading-relaxed">
            {t("heroDesc")}
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-3.5 pt-4">
            {(!user || user.account_type === "buyer" || user.account_type === "both") && (
              <button
                onClick={() => navigate("/")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white px-6 py-3.5 text-sm font-bold shadow-premium cursor-pointer"
              >
                <span>{t("goToBuyer")}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
            {(!user || user.account_type === "seller" || user.account_type === "both") && (
              <button
                onClick={() => navigate("/seller")}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text px-6 py-3.5 text-sm font-bold shadow-sm transition-colors cursor-pointer"
              >
                <span>{t("goToSeller")}</span>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section className="py-16 sm:py-20 border-b border-app-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-app-text tracking-tight sm:text-3xl">
              {t("howItWorks")}
            </h2>
            <p className="text-xs sm:text-sm text-app-text-secondary">
              {t("howDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {steps.map((s, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-app-border bg-app-card p-6 shadow-sm flex flex-col justify-between hover:shadow transition-all duration-200"
              >
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded">
                      Step {s.step}
                    </span>
                    <div className="h-10 w-10 rounded-xl bg-primary/5 text-primary flex items-center justify-center">
                      {s.icon}
                    </div>
                  </div>
                  <h3 className="font-bold text-app-text text-sm sm:text-base leading-tight">
                    {s.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-app-text-secondary leading-normal">
                    {s.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-16 sm:py-20 bg-app-bg/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-12">
          
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-extrabold text-app-text tracking-tight sm:text-3xl">
              {t("whyChoose")}
            </h2>
            <p className="text-xs sm:text-sm text-app-text-secondary">
              {t("whyDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, idx) => (
              <div 
                key={idx}
                className="rounded-2xl border border-app-border bg-app-card p-5.5 shadow-sm hover:shadow transition-all duration-200 flex items-start gap-4"
              >
                <div className="h-9 w-9 rounded-lg bg-primary/5 text-primary flex items-center justify-center flex-shrink-0">
                  {f.icon}
                </div>
                <div className="space-y-1">
                  <h3 className="font-bold text-app-text text-sm sm:text-base leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-app-text-secondary leading-normal">
                    {f.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
