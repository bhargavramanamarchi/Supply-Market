import React, { useState, useEffect } from "react";
import { 
  Building, 
  Bot,
  Plus, 
  Edit3, 
  Trash2, 
  AlertCircle, 
  Clock, 
  MapPin, 
  Phone, 
  Sparkles, 
  X,
  DollarSign,
  Users,
  ShoppingBag,
  UserCheck,
  Mic,
  Send
} from "lucide-react";
import type { Supplier, Product } from "../services/supplierData";
import { getStoredSuppliers, saveSuppliers } from "../services/supplierData";
import { getSpeechRecognition } from "../services/speechService";
import { useLanguage } from "../context/LanguageContext";

export const SellerPage: React.FC = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [currentSeller, setCurrentSeller] = useState<Supplier | null>(null);
  const { language, t } = useLanguage();
  
  // Floating Sales Assistant Chatbot state
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ sender: "ai" | "user"; text: string }>>([
    {
      sender: "ai",
      text: t("salesAiWelcome")
    }
  ]);

  const [customInput, setCustomInput] = useState("");
  const [isThinking, setIsThinking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");

  const chatBottomRef = React.useRef<HTMLDivElement>(null);

  // Restart chat with welcome message in the new language when user switches language
  useEffect(() => {
    setChatMessages([
      {
        sender: "ai",
        text: t("salesAiWelcome")
      }
    ]);
  }, [language]);

  useEffect(() => {
    if (isChatOpen && chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages, isChatOpen, isThinking]);

  const speechHook = getSpeechRecognition();

  const handleVoiceInput = () => {
    setSpeechError("");
    setIsListening(true);
    speechHook.start(
      language, // Uses the selected application language dynamically!
      (result) => {
        setCustomInput(result);
      },
      () => {
        setIsListening(false);
      },
      (err) => {
        setIsListening(false);
        setSpeechError(err);
      }
    );
  };

  const handleStopVoiceInput = () => {
    speechHook.stop();
    setIsListening(false);
  };

  const chatbotChips = [
    { key: "chipSoldToday", text: t("chipSoldToday") },
    { key: "chipSellsMost", text: t("chipSellsMost") },
    { key: "chipRestock", text: t("chipRestock") },
    { key: "chipDecreasing", text: t("chipDecreasing") },
    { key: "chipPricing", text: t("chipPricing") },
    { key: "chipTrends", text: t("chipTrends") },
    { key: "chipInventory", text: t("chipInventory") },
    { key: "chipWeekly", text: t("chipWeekly") },
    { key: "chipMonthly", text: t("chipMonthly") },
    { key: "chipDemand", text: t("chipDemand") },
    { key: "chipBestSelling", text: t("chipBestSelling") }
  ];

  const handleQuerySelect = (queryText: string, key?: string) => {
    if (!queryText.trim()) return;

    // Add user query message
    const userMsg = { sender: "user" as const, text: queryText };
    setChatMessages(prev => [...prev, userMsg]);
    setCustomInput("");
    setIsThinking(true);

    // Heuristics mapping answers to the current supplier inventory dynamically!
    let replyText = "";
    const lowerQuery = queryText.toLowerCase();

    // 1. How many products sold today?
    if (key === "chipSoldToday" || lowerQuery.includes("sold today") || lowerQuery.includes("sales today") || lowerQuery.includes("అమ్మకాలు") || lowerQuery.includes("बेचे") || lowerQuery.includes("விற்பனை") || lowerQuery.includes("ಮಾರಾಟ") || lowerQuery.includes("വിൽപ്പന")) {
      replyText = t("replySoldToday");
    }
    // 2. Which product sells the most?
    else if (key === "chipSellsMost" || lowerQuery.includes("sells the most") || lowerQuery.includes("best selling") || lowerQuery.includes("top product") || lowerQuery.includes("most sold") || lowerQuery.includes("ಎక్కువ") || lowerQuery.includes("ज्यादा") || lowerQuery.includes("அதிகம்") || lowerQuery.includes("ഏറ്റവും")) {
      replyText = t("replySellsMost");
    }
    // 3. Which product should I restock?
    else if (key === "chipRestock" || lowerQuery.includes("restock") || lowerQuery.includes("replenish") || lowerQuery.includes("stock levels") || lowerQuery.includes("ಸ್ಟಾಕ್") || lowerQuery.includes("भंडार") || lowerQuery.includes("இருப்பு") || lowerQuery.includes("ശേഖരം")) {
      replyText = t("replyRestock");
    }
    // 4. Why are sales decreasing?
    else if (key === "chipDecreasing" || lowerQuery.includes("decreasing") || lowerQuery.includes("drop") || lowerQuery.includes("low sales") || lowerQuery.includes("decline") || lowerQuery.includes("తగ్గి") || lowerQuery.includes("குறைவு") || lowerQuery.includes("कम")) {
      replyText = t("replyDecreasing");
    }
    // 5. Suggest better pricing
    else if (key === "chipPricing" || lowerQuery.includes("pricing") || lowerQuery.includes("price") || lowerQuery.includes("margin") || lowerQuery.includes("ధర") || lowerQuery.includes("कीमत") || lowerQuery.includes("விலை") || lowerQuery.includes("ಬೆಲೆ")) {
      replyText = t("replyPricing");
    }
    // 6. Show customer buying trends
    else if (key === "chipTrends" || lowerQuery.includes("buying trends") || lowerQuery.includes("customer trends") || lowerQuery.includes("buyer trend") || lowerQuery.includes("ప్రవృత్తి") || lowerQuery.includes("चलन") || lowerQuery.includes("போக்கு")) {
      replyText = t("replyTrends");
    }
    // 7. Recommend inventory improvements
    else if (key === "chipInventory" || lowerQuery.includes("inventory") || lowerQuery.includes("warehouse") || lowerQuery.includes("improvements") || lowerQuery.includes("ದಾಸ್ತಾನು") || lowerQuery.includes("సంభరణం")) {
      replyText = t("replyInventory");
    }
    // 8. Generate weekly summary
    else if (key === "chipWeekly" || lowerQuery.includes("weekly summary") || lowerQuery.includes("weekly report") || lowerQuery.includes("weekly") || lowerQuery.includes("వారం") || lowerQuery.includes("साप्ताहिक") || lowerQuery.includes("வாராந்திர")) {
      replyText = t("replyWeekly");
    }
    // 9. Generate monthly report
    else if (key === "chipMonthly" || lowerQuery.includes("monthly report") || lowerQuery.includes("monthly summary") || lowerQuery.includes("monthly") || lowerQuery.includes("నెల") || lowerQuery.includes("मासिक") || lowerQuery.includes("மாதாந்திர")) {
      replyText = t("replyMonthly");
    }
    // 10. Predict demand
    else if (key === "chipDemand" || lowerQuery.includes("predict demand") || lowerQuery.includes("demand prediction") || lowerQuery.includes("demand") || lowerQuery.includes("డిమాండ్") || lowerQuery.includes("मांग") || lowerQuery.includes("தேவை")) {
      replyText = t("replyDemand");
    }
    // 11. Suggest best selling products
    else if (key === "chipBestSelling" || lowerQuery.includes("best selling products") || lowerQuery.includes("suggest best") || lowerQuery.includes("అత్యధిక") || lowerQuery.includes("प्रसिद्ध") || lowerQuery.includes("பிரபலமான")) {
      replyText = t("replyBestSelling");
    }
    // Generic
    else {
      replyText = t("replyGeneric");
    }

    setTimeout(() => {
      setIsThinking(false);
      setChatMessages(prev => [...prev, { sender: "ai" as const, text: replyText }]);
    }, 850);
  };
  // Product CRUD states
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState<"add" | "edit">("add");
  const [activeProdId, setActiveProdId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Turmeric",
    price: 0,
    quantityAvailable: 0,
    qualityGrade: "Premium" as any,
    location: "",
    businessName: "",
    contactNumber: "",
    available: true
  });

  // Recent buyer table data
  const [buyers] = useState([
    { name: "Verma Food Industries", product: "Premium Turmeric Powder", qty: "150 kg", price: "₹18,000", date: "05 July 2026", status: "Completed" },
    { name: "Kalyan Catering Services", product: "Superfine Basmati Rice", qty: "200 kg", price: "₹19,000", date: "04 July 2026", status: "Active" },
    { name: "Reddy Foods Hyderabad", product: "Nellore Sona Masoori Rice", qty: "500 kg", price: "₹27,500", date: "02 July 2026", status: "Completed" },
  ]);

  // Load seller database
  useEffect(() => {
    const database = getStoredSuppliers();
    setSuppliers(database);
    const seller = database.find(s => s.id === "sup_1") || database[0];
    setCurrentSeller(seller);
  }, []);

  const handleSync = (updated: Supplier) => {
    const list = suppliers.map(s => s.id === updated.id ? updated : s);
    setSuppliers(list);
    setCurrentSeller(updated);
    saveSuppliers(list);
  };

  // Open Form triggers
  const handleOpenAdd = () => {
    if (!currentSeller) return;
    setFormMode("add");
    setActiveProdId(null);
    setFormData({
      name: "",
      category: "Turmeric",
      price: 0,
      quantityAvailable: 0,
      qualityGrade: "Premium",
      location: currentSeller.location,
      businessName: currentSeller.businessName,
      contactNumber: currentSeller.contactNumber,
      available: true
    });
    setShowForm(true);
  };

  const handleOpenEdit = (p: Product) => {
    setFormMode("edit");
    setActiveProdId(p.id);
    setFormData({
      name: p.name,
      category: p.category,
      price: p.price,
      quantityAvailable: p.quantityAvailable,
      qualityGrade: p.qualityGrade,
      location: p.location,
      businessName: p.businessName,
      contactNumber: p.contactNumber,
      available: p.availability === "Immediate"
    });
    setShowForm(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeller) return;

    const unitType = formData.category === "Steel" 
      ? "ton" 
      : formData.category === "Wood" 
        ? "cubic-foot" 
        : formData.category === "Cement" 
          ? "bag" 
          : "kg";

    if (formMode === "add") {
      const newProd: Product = {
        id: `prod_${Date.now()}`,
        name: formData.name,
        category: formData.category,
        description: `Premium grade bulk wholesale sourcing of ${formData.name}.`,
        price: Number(formData.price),
        quantityAvailable: Number(formData.quantityAvailable),
        unit: unitType,
        qualityGrade: formData.qualityGrade,
        location: formData.location,
        businessName: formData.businessName,
        contactNumber: formData.contactNumber,
        availability: formData.available ? "Immediate" : "Within 2 days",
        businessHours: currentSeller.businessHours
      };

      const updated = {
        ...currentSeller,
        products: [...currentSeller.products, newProd]
      };
      handleSync(updated);

    } else if (formMode === "edit" && activeProdId) {
      const updatedProds = currentSeller.products.map(p => 
        p.id === activeProdId 
          ? {
              ...p,
              name: formData.name,
              category: formData.category,
              price: Number(formData.price),
              quantityAvailable: Number(formData.quantityAvailable),
              unit: unitType,
              qualityGrade: formData.qualityGrade,
              location: formData.location,
              businessName: formData.businessName,
              contactNumber: formData.contactNumber,
              availability: formData.available ? "Immediate" : "Within 2 days"
            }
          : p
      );

      const updated = {
        ...currentSeller,
        products: updatedProds
      };
      handleSync(updated);
    }

    setShowForm(false);
  };

  const handleDeleteProduct = (prodId: string) => {
    if (!currentSeller) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    const updated = {
      ...currentSeller,
      products: currentSeller.products.filter(p => p.id !== prodId)
    };
    handleSync(updated);
  };

  const aiInsights = React.useMemo(() => {
    if (!currentSeller || currentSeller.products.length === 0) {
      return [
        {
          title: t("insight1TitleDemo"),
          desc: t("insight1DescDemo")
        },
        {
          title: t("insight2TitleDemo"),
          desc: t("insight2DescDemo")
        },
        {
          title: t("insight3TitleDemo"),
          desc: t("insight3DescDemo")
        }
      ];
    }

    const list = [];

    // Insight 1: Best Selling Product
    const bestProd = currentSeller.products.reduce((prev, curr) => 
      (prev.price * prev.quantityAvailable > curr.price * curr.quantityAvailable) ? prev : curr
    , currentSeller.products[0]);
    list.push({
      title: `⭐ ${t("bestSellingProduct")}`,
      desc: t("bestSellingProductDesc").replace("{Product}", bestProd.name)
    });

    // Insight 2: Low Stock Alert
    const lowStockProd = currentSeller.products.reduce((prev, curr) => 
      (prev.quantityAvailable < curr.quantityAvailable) ? prev : curr
    , currentSeller.products[0]);
    
    if (lowStockProd.quantityAvailable < 15000) {
      list.push({
        title: `📦 ${t("lowStockAlert")}`,
        desc: t("lowStockAlertDesc")
          .replace("{Product}", lowStockProd.name)
          .replace("{Qty}", lowStockProd.quantityAvailable.toLocaleString())
          .replace("{Unit}", lowStockProd.unit)
      });
    } else {
      list.push({
        title: `📦 ${t("lowStockAlert")}`,
        desc: t("insight2DescDemo")
      });
    }

    // Insight 3: Pricing Recommendation
    const pricingProd = currentSeller.products[0];
    list.push({
      title: `💰 ${t("pricingRecommendation")}`,
      desc: t("pricingRecommendationDesc")
        .replace("{Product}", pricingProd.name)
        .replace("{Unit}", pricingProd.unit)
    });

    return list;
  }, [currentSeller, language]);

  if (!currentSeller) return null;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-app-bg min-h-[calc(100vh-4rem)] transition-colors duration-300">
      
      {/* Header Profile Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 border-b border-app-border pb-6">
        <div>
          <div className="flex items-center gap-1.5 rounded bg-primary/10 border border-primary/20 text-xs font-bold text-primary px-2.5 py-0.5 inline-block">
            <Building className="h-3.5 w-3.5" />
            <span>{t("sellerDashboard")}</span>
          </div>
          <h1 className="text-3xl font-extrabold text-app-text mt-2">{currentSeller.businessName}</h1>
          <p className="text-xs text-app-text-secondary mt-1 flex flex-wrap gap-4">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5 text-primary" /> {currentSeller.location}</span>
            <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5 text-primary" /> {currentSeller.contactNumber}</span>
            <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5 text-primary" /> {currentSeller.businessHours}</span>
          </p>
        </div>

        <div className="flex gap-4">
          <div className="text-right">
            <span className="text-[10px] font-bold text-app-text-secondary uppercase">{t("ratingLabel")}</span>
            <p className="text-lg font-bold text-app-text flex items-center justify-end gap-0.5 mt-0.5">
              <span>{currentSeller.rating}</span>
              <span className="text-amber-400">★</span>
            </p>
          </div>
          <div className="text-right border-l border-app-border pl-4">
            <span className="text-[10px] font-bold text-app-text-secondary uppercase">Trust Score</span>
            <p className="text-lg font-bold text-primary mt-0.5">{currentSeller.trustScore}%</p>
          </div>
        </div>
      </div>

      {/* Main grids */}
      <div className="space-y-8">
        
        {/* Core Metrics Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="rounded-xl border border-app-border bg-app-card p-5 shadow-sm">
            <div className="flex justify-between items-start text-app-text-secondary">
              <span className="text-[10px] font-bold uppercase">{t("products")}</span>
              <ShoppingBag className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-app-text mt-2">{currentSeller.products.length}</p>
            <span className="text-[10px] text-app-text-secondary mt-1 block">{t("activeListings")}</span>
          </div>

          <div className="rounded-xl border border-app-border bg-app-card p-5 shadow-sm">
            <div className="flex justify-between items-start text-app-text-secondary">
              <span className="text-[10px] font-bold uppercase">{t("orders")}</span>
              <UserCheck className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-app-text mt-2">42</p>
            <span className="text-[10px] text-success font-bold mt-1 block">↑ 12% this week</span>
          </div>

          <div className="rounded-xl border border-app-border bg-app-card p-5 shadow-sm">
            <div className="flex justify-between items-start text-app-text-secondary">
              <span className="text-[10px] font-bold uppercase">{t("customers")}</span>
              <Users className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-app-text mt-2">128</p>
            <span className="text-[10px] text-app-text-secondary mt-1 block font-medium">{t("connectedBuyers")}</span>
          </div>

          <div className="rounded-xl border border-app-border bg-app-card p-5 shadow-sm">
            <div className="flex justify-between items-start text-app-text-secondary">
              <span className="text-[10px] font-bold uppercase">{t("revenueLabel")}</span>
              <DollarSign className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-primary mt-2">₹1.85 L</p>
            <span className="text-[10px] text-app-text-secondary mt-1 block">{t("salesValue")}</span>
          </div>

        </div>

        {/* AI Suggestions Banner */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-5 shadow-premium">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            <h3 className="font-bold text-app-text text-sm">{t("aiSourcingSug")}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            {aiInsights.map((insight, idx) => (
              <div key={idx} className="bg-app-card border border-app-border/40 rounded-xl p-3.5 shadow-sm flex items-start gap-2.5">
                <AlertCircle className="h-4.5 w-4.5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-app-text font-bold block">{insight.title}</strong>
                  <p className="text-app-text-secondary mt-0.5 leading-normal">{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory list Table */}
        <div className="rounded-xl border border-app-border bg-app-card p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h3 className="font-bold text-app-text text-base">{t("inventorySourcingCat")}</h3>
              <p className="text-xs text-app-text-secondary mt-0.5">{t("inventorySourcingDesc")}</p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 rounded-lg bg-primary text-white py-2 px-3 text-xs font-bold shadow hover:opacity-90 cursor-pointer animate-fade-in"
            >
              <Plus className="h-4 w-4" />
              <span>{t("addProduct")}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-app-border text-xs sm:text-sm text-left font-medium">
              <thead>
                <tr className="text-[10px] font-bold text-app-text-secondary uppercase bg-app-bg border-b border-app-border">
                  <th className="px-4 py-3">Available</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {currentSeller.products.map(p => (
                  <tr key={p.id} className="hover:bg-app-bg/40 transition-colors">
                    <td className="px-4 py-3.5">
                      <div>
                        <strong className="text-app-text font-bold block">{p.name}</strong>
                        <span className="text-[11px] text-app-text-secondary">{p.businessName}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3.5 text-app-text-secondary">{p.category}</td>
                    <td className="px-4 py-3.5 font-bold text-primary">₹{p.price} / {p.unit}</td>
                    <td className="px-4 py-3.5 text-app-text font-semibold">{p.quantityAvailable.toLocaleString()} {p.unit}</td>
                    <td className="px-4 py-3.5">
                      <span className="rounded bg-primary/5 text-primary border border-primary/20 px-2 py-0.5 text-[10px] font-bold">{p.qualityGrade}</span>
                    </td>
                    <td className="px-4 py-3.5 text-app-text-secondary">{p.location}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        p.availability === "Immediate" 
                          ? "bg-success/10 text-success border border-success/20" 
                          : "bg-slate-100 text-app-text-secondary border border-slate-200"
                      }`}>
                        {p.availability === "Immediate" ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1 hover:bg-app-bg rounded text-primary cursor-pointer"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-1 hover:bg-app-bg rounded text-danger cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Buyers Table */}
        <div className="rounded-xl border border-app-border bg-app-card p-5 sm:p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="font-bold text-app-text text-base">{t("recentConnectedBuyers")}</h3>
            <p className="text-xs text-app-text-secondary mt-0.5">{t("recentConnectedDesc")}</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-app-border text-xs sm:text-sm text-left">
              <thead>
                <tr className="text-[10px] font-bold text-app-text-secondary uppercase bg-app-bg border-b border-app-border">
                  <th className="px-4 py-3">{t("busNameField")}</th>
                  <th className="px-4 py-3">{t("catField")} Sourced</th>
                  <th className="px-4 py-3">{t("qtyField")}</th>
                  <th className="px-4 py-3">{t("priceField")}</th>
                  <th className="px-4 py-3">Purchase Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">{t("actionsField")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-app-border">
                {buyers.map((buyer, idx) => (
                  <tr key={idx} className="hover:bg-app-bg/40 transition-colors">
                    <td className="px-4 py-3.5 font-bold text-app-text">{buyer.name}</td>
                    <td className="px-4 py-3.5 text-app-text-secondary">{buyer.product}</td>
                    <td className="px-4 py-3.5 text-app-text font-semibold">{buyer.qty}</td>
                    <td className="px-4 py-3.5 font-bold text-primary">{buyer.price}</td>
                    <td className="px-4 py-3.5 text-app-text-secondary">{buyer.date}</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                        buyer.status === "Completed"
                          ? "bg-success/15 border-success/35 text-success"
                          : "bg-primary/10 border-primary/25 text-primary"
                      }`}>
                        {buyer.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          onClick={() => alert(`Details: Buyer is interested in recurrent monthly volume order.`)}
                          className="px-2.5 py-1.5 rounded bg-app-bg hover:bg-app-card-hover border border-app-border font-semibold text-app-text cursor-pointer"
                        >
                          {t("viewBuyer")}
                        </button>
                        <button
                          onClick={() => alert(`Connecting securely to client representative dialer...`)}
                          className="px-2.5 py-1.5 rounded bg-primary text-white font-semibold hover:opacity-90 cursor-pointer"
                        >
                          {t("contactBuyer")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* CRUD Product Modal Dialog Form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-app-border bg-app-card p-6 shadow-premium-lg animate-fade-in-up m-4">
            
            <div className="flex justify-between items-center border-b border-app-border pb-3 mb-4">
              <h3 className="font-bold text-app-text text-base">
                {formMode === "add" ? t("addProduct") : t("editProduct")}
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="p-1 hover:bg-app-bg rounded text-app-text-secondary cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-4">
                
                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-app-text-secondary uppercase">{t("prodNameField")}</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-lg border border-app-border bg-app-bg px-3 py-2.5 text-app-text focus:border-primary outline-none"
                    placeholder="e.g. Organic Turmeric Powder"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-app-text-secondary uppercase">{t("catField")}</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-lg border border-app-border bg-app-bg px-2.5 py-2.5 text-app-text focus:border-primary outline-none"
                  >
                    <option>Turmeric</option>
                    <option>Rice</option>
                    <option>Wood</option>
                    <option>Steel</option>
                    <option>Cement</option>
                    <option>Packaging</option>
                    <option>Cotton</option>
                    <option>Electronics</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-app-text-secondary uppercase">{t("qualityField")}</label>
                  <select
                    value={formData.qualityGrade}
                    onChange={(e) => setFormData({ ...formData, qualityGrade: e.target.value as any })}
                    className="w-full rounded-lg border border-app-border bg-app-bg px-2.5 py-2.5 text-app-text focus:border-primary outline-none"
                  >
                    <option>Premium</option>
                    <option>Superfine</option>
                    <option>High Grade</option>
                    <option>Grade A</option>
                    <option>Standard</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-app-text-secondary uppercase">{t("priceField")} (₹)</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full rounded-lg border border-app-border bg-app-bg px-3 py-2.5 text-app-text focus:border-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-app-text-secondary uppercase">{t("qtyField")}</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.quantityAvailable}
                    onChange={(e) => setFormData({ ...formData, quantityAvailable: Number(e.target.value) })}
                    className="w-full rounded-lg border border-app-border bg-app-bg px-3 py-2.5 text-app-text focus:border-primary outline-none"
                  />
                </div>

                <div className="col-span-2 space-y-1">
                  <label className="text-[10px] font-bold text-app-text-secondary uppercase">{t("locField")}</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full rounded-lg border border-app-border bg-app-bg px-3 py-2.5 text-app-text focus:border-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-app-text-secondary uppercase">{t("busNameField")}</label>
                  <input
                    type="text"
                    required
                    value={formData.businessName}
                    onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    className="w-full rounded-lg border border-app-border bg-app-bg px-3 py-2.5 text-app-text focus:border-primary outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-app-text-secondary uppercase">{t("phoneField")}</label>
                  <input
                    type="text"
                    required
                    value={formData.contactNumber}
                    onChange={(e) => setFormData({ ...formData, contactNumber: e.target.value })}
                    className="w-full rounded-lg border border-app-border bg-app-bg px-3 py-2.5 text-app-text focus:border-primary outline-none"
                  />
                </div>

                <div className="col-span-2 flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="modalAvailable"
                    checked={formData.available}
                    onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                    className="rounded border-app-border text-primary focus:ring-primary h-3.5 w-3.5"
                  />
                  <label htmlFor="modalAvailable" className="text-xs font-bold text-app-text cursor-pointer select-none">
                    {t("availableTodayModal")}
                  </label>
                </div>

              </div>

              <div className="flex justify-end gap-2 border-t border-app-border pt-4 mt-2">
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="rounded-lg border border-app-border bg-app-card hover:bg-app-card-hover px-4 py-2.5 text-xs font-bold cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-primary text-white px-4 py-2.5 text-xs font-bold hover:opacity-90 cursor-pointer"
                >
                  {t("saveChanges")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Floating circular Seller AI Assistant Button */}
      <button
        onClick={() => setIsChatOpen(!isChatOpen)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary hover:opacity-90 text-white flex items-center justify-center shadow-premium-lg hover:scale-105 transition-all duration-200 cursor-pointer z-40"
        title="Sales AI Assistant"
      >
        <Bot className="h-6 w-6 animate-pulse" />
      </button>

      {/* Chatbot Window */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-6 w-96 max-w-[calc(100vw-2rem)] bg-app-card border border-app-border rounded-2xl shadow-premium-lg flex flex-col h-[480px] z-50 overflow-hidden animate-fade-in-up">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-primary to-secondary text-white py-3 px-4 flex justify-between items-center flex-shrink-0">
            <div>
              <h4 className="font-bold text-sm tracking-tight flex items-center gap-1.5">
                <Bot className="h-4.5 w-4.5" />
                <span>{t("salesAiAssistant")}</span>
              </h4>
              <span className="text-[9px] font-semibold opacity-85 block leading-none mt-0.5">{t("aiBusinessAdvisor")}</span>
            </div>
            <button
              onClick={() => setIsChatOpen(false)}
              className="p-1 hover:bg-white/10 rounded text-white transition-colors cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>

          {/* Messages Feed */}
          <div className="flex-grow p-4 overflow-y-auto space-y-3 bg-app-bg/30">
            {chatMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed whitespace-pre-line ${
                    msg.sender === "user"
                      ? "bg-primary text-white rounded-tr-none font-medium shadow-sm"
                      : "bg-app-card border border-app-border text-app-text rounded-tl-none shadow-sm"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            
            {/* Thinking / Analyzing indicator */}
            {isThinking && (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed bg-app-card border border-app-border text-app-text rounded-tl-none shadow-sm flex items-center gap-2">
                  <span className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                    <span className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                  </span>
                  <span className="text-app-text-secondary italic">{t("analyzingSales")}</span>
                </div>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Chat Panel Controls */}
          <div className="border-t border-app-border bg-app-card p-3 flex-shrink-0">
            
            {/* Clickable query chips panel */}
            <span className="text-[9px] font-bold text-app-text-secondary uppercase block mb-1 px-1">{t("askSourcingAdvisor")}</span>
            <div className="flex gap-1.5 overflow-x-auto pb-1.5 scrollbar-none select-none max-h-12 flex-wrap mb-2.5">
              {chatbotChips.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleQuerySelect(chip.text, chip.key)}
                  className="rounded-lg bg-app-bg hover:bg-app-card-hover border border-app-border px-2 py-0.5 text-[9px] text-app-text font-bold whitespace-nowrap cursor-pointer transition-colors"
                >
                  {chip.text}
                </button>
              ))}
            </div>

            {/* Input Bar */}
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                handleQuerySelect(customInput);
              }}
              className="flex items-center gap-1.5 border border-app-border bg-app-bg rounded-xl px-2 py-1.5"
            >
              {/* Mic Input */}
              <button
                type="button"
                onClick={isListening ? handleStopVoiceInput : handleVoiceInput}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  isListening 
                    ? "bg-danger/10 text-danger animate-pulse" 
                    : "hover:bg-app-card-hover text-app-text-secondary"
                }`}
                title="Speak question"
              >
                <Mic className="h-4 w-4" />
              </button>

              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder={isListening ? "Listening..." : t("typeCustomQuestion")}
                disabled={isThinking}
                className="flex-grow bg-transparent text-xs text-app-text placeholder-app-text-secondary border-0 focus:ring-0 outline-none pr-2"
              />

              <button
                type="submit"
                disabled={!customInput.trim() || isThinking}
                className="p-1.5 rounded-lg bg-primary hover:opacity-90 text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
                title="Send"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
            </form>

            {speechError && (
              <p className="text-[9px] text-danger font-medium leading-normal mt-1.5 px-1">{speechError}</p>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
