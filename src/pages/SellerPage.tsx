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
import { getSpeechRecognition } from "../services/speechService";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";
// Reverted workspace imports


export const SellerPage: React.FC = () => {
  const [currentSeller, setCurrentSeller] = useState<Supplier | null>(null);
  const { language, t } = useLanguage();
  const { user } = useAuth();

  const [metrics, setMetrics] = useState({
    products: 0,
    orders: 42,
    customers: 128,
    revenue: "₹1.85 L"
  });

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

  // Recent buyer table data loaded from Supabase
  const [buyers, setBuyers] = useState<any[]>([]);

  // Load seller database
  const loadSellerData = async () => {
    try {
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser();
      console.log("Authenticated user:", authUser);

      if (authError || !authUser) {
        console.error("No authenticated user found:", authError);
        return;
      }

      // Fetch supplier for the current user
      const { data: supplierData, error: supplierError } = await (supabase as any)
        .from('suppliers')
        .select('*')
        .eq('user_id', authUser.id)
        .maybeSingle();

      console.log("Supplier record:", supplierData);

      if (supplierError) {
        console.error("Supplier record fetch error:", supplierError);
      }
      if (!supplierData) {
        console.log("No supplier record found for user_id:", authUser.id);
      }

      let currentSupplierData = supplierData;

      // If missing and user is seller or both, automatically create it
      if (!currentSupplierData && user && (user.account_type === 'seller' || user.account_type === 'both')) {
        const cityState = user.city ? (user.state ? `${user.city}, ${user.state}` : user.city) : 'Hyderabad, Telangana';
        
        const insertPayload: any = {
          user_id: authUser.id,
          company_name: user.company || `${user.name}'s Company`,
          location: cityState,
          verified: false,
          rating: 5.0,
          trust_score: 95.0,
          contact_number: user.phone || '+91 90008 90009',
          business_hours: '09:00 AM - 06:00 PM',
          created_at: new Date().toISOString()
        };

        let { data: newSupplier, error: createError } = await (supabase as any)
          .from('suppliers')
          .insert(insertPayload)
          .select()
          .maybeSingle();

        // If insert fails due to missing created_at column (i.e. migration not run yet), retry without it
        if (createError && (createError.message?.includes('created_at') || createError.code === '42703')) {
          console.warn("Inserting supplier with created_at failed, retrying without created_at column:", createError.message);
          delete insertPayload.created_at;
          
          const retryResult = await (supabase as any)
            .from('suppliers')
            .insert(insertPayload)
            .select()
            .maybeSingle();
            
          newSupplier = retryResult.data;
          createError = retryResult.error;
        }

        if (createError) throw createError;
        currentSupplierData = newSupplier;
      }

      if (currentSupplierData) {
        console.log("Supplier ID:", currentSupplierData.id);

        // Fetch products for this supplier
        const { data: productsData, error: productsError } = await (supabase as any)
          .from('products')
          .select('*')
          .eq('supplier_id', currentSupplierData.id);

        if (productsError) throw productsError;

        const products: Product[] = (productsData || []).map((p: any) => ({
          id: p.id,
          name: p.product_name,
          category: p.category,
          description: p.description || '',
          price: Number(p.price),
          unit: p.unit,
          quantityAvailable: Number(p.quantity),
          qualityGrade: (p.product_name.toLowerCase().includes('basmati') ? 'Superfine' :
                        p.product_name.toLowerCase().includes('tmt') ? 'High Grade' :
                        p.product_name.toLowerCase().includes('uno') ? 'High Grade' :
                        p.product_name.toLowerCase().includes('shipping') ? 'Standard' : 'Premium') as any,
          location: currentSupplierData.location,
          businessName: currentSupplierData.company_name,
          contactNumber: currentSupplierData.contact_number || '',
          availability: p.available ? 'Immediate' : 'Within 2 days',
          businessHours: currentSupplierData.business_hours || '09:00 AM - 06:00 PM'
        }));

        const supplierInfo: Supplier = {
          id: currentSupplierData.id,
          businessName: currentSupplierData.company_name,
          rating: Number(currentSupplierData.rating),
          trustScore: Number(currentSupplierData.trust_score),
          location: currentSupplierData.location,
          contactNumber: currentSupplierData.contact_number || '',
          businessHours: currentSupplierData.business_hours || '09:00 AM - 06:00 PM',
          products: products
        };

        setCurrentSeller(supplierInfo);

        // Fetch live buyer_connections for this supplier
        const { data: connData, error: connError } = await (supabase as any)
          .from('buyer_connections')
          .select(`
            id,
            status,
            created_at,
            buyer_id,
            buyer:users (
              id,
              full_name,
              email
            ),
            product:products (
              id,
              product_name,
              price,
              unit
            )
          `)
          .eq('supplier_id', currentSupplierData.id);

        if (connError) {
          console.error("Error loading connections for seller:", connError);
        } else {
          console.log("Number of buyer_connections returned:", connData?.length || 0);
          if (!connData || connData.length === 0) {
            console.log("No buyer_connections found. Query result:", connData);
          }

          // Fetch buyer requests in parallel to parse quantity demands
          const buyerIds = (connData || []).map((c: any) => c.buyer_id).filter(Boolean);
          let requestsData: any[] = [];
          if (buyerIds.length > 0) {
            const { data: reqs } = await (supabase as any)
              .from('buyerrequests')
              .select('*')
              .in('buyer_id', buyerIds);
            requestsData = reqs || [];
          }

          // Format buyer connections
          const formattedBuyers = (connData || []).map((c: any) => {
            const buyerUser = c.buyer;
            const prod = c.product;
            if (!buyerUser) return null;

            // Find latest matching buyer request for this buyer
            const latestReq = requestsData
              .filter((r: any) => r.buyer_id === buyerUser.id)
              .sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())[0];

            let qtyStr = '100 units';
            let priceStr = 'Contact for pricing';

            if (latestReq) {
              const requirementText = latestReq.requirement || '';
              const match = requirementText.match(/(\d+)\s*(kg|tons|bags|cubic feet|pieces|units|bags|pkgs|ton)/i);
              if (match) {
                qtyStr = `${match[1]} ${match[2]}`;
                if (prod) {
                  const qtyVal = parseFloat(match[1]);
                  priceStr = `₹${(prod.price * qtyVal).toLocaleString('en-IN')}`;
                }
              } else {
                qtyStr = prod ? `100 ${prod.unit}` : '100 units';
                if (prod) {
                  priceStr = `₹${(prod.price * 100).toLocaleString('en-IN')}`;
                }
              }
            } else if (prod) {
              qtyStr = `100 ${prod.unit}`;
              priceStr = `₹${(prod.price * 100).toLocaleString('en-IN')}`;
            }

            return {
              id: c.id,
              name: buyerUser.full_name || buyerUser.email,
              product: prod ? prod.product_name : 'General Sourcing Connection',
              qty: qtyStr,
              price: priceStr,
              date: new Date(c.created_at).toLocaleDateString('en-IN', {
                day: '2-digit',
                month: 'long',
                year: 'numeric'
              }),
              status: c.status || 'Active'
            };
          }).filter(Boolean);

          setBuyers(formattedBuyers);
        }
      } else {
        setCurrentSeller(null);
        setBuyers([]);
      }
    } catch (err) {
      console.error("Error loading seller details:", err);
    }
  };

  useEffect(() => {
    loadSellerData();
  }, [user]);

  // Reverted workspace effects


  // Load metrics dynamically
  useEffect(() => {
    if (!currentSeller) return;
    const fetchMetrics = async () => {
      try {
        const isDemoAccount = user && (
          user.email.endsWith('@supplymarket.com') ||
          user.id.startsWith('00000000-0000-0000-0000-')
        );

        if (currentSeller.products.length === 0) {
          setMetrics({
            products: 0,
            orders: 0,
            customers: 0,
            revenue: "₹0"
          });
        } else if (isDemoAccount) {
          const { data: supplierRecs } = await (supabase as any)
            .from('airecommendations')
            .select('id')
            .eq('supplier_id', currentSeller.id);

          const recCount = supplierRecs?.length || 0;
          const distinctBuyers = 5 + recCount;
          const avgPrice = currentSeller.products.reduce((acc, p) => acc + p.price, 0) / (currentSeller.products.length || 1);
          const computedRev = Math.round(recCount * avgPrice * 10 + 25000);
          const revenueStr = computedRev >= 100000 
            ? `₹${(computedRev / 100000).toFixed(2)} L` 
            : `₹${computedRev.toLocaleString('en-IN')}`;

          setMetrics({
            products: currentSeller.products.length,
            orders: 12 + recCount,
            customers: distinctBuyers,
            revenue: revenueStr
          });
        } else {
          const { data: supplierRecs } = await (supabase as any)
            .from('airecommendations')
            .select('id')
            .eq('supplier_id', currentSeller.id);

          const leadCount = supplierRecs?.length || 0;
          const orders = leadCount;
          const customers = leadCount;
          const totalRev = leadCount * 12500;
          const revenueStr = totalRev >= 100000 
            ? `₹${(totalRev / 100000).toFixed(2)} L` 
            : `₹${totalRev.toLocaleString('en-IN')}`;

          setMetrics({
            products: currentSeller.products.length,
            orders: orders,
            customers: customers,
            revenue: revenueStr
          });
        }
      } catch (err) {
        console.error("Error fetching supplier metrics:", err);
      }
    };
    fetchMetrics();
  }, [currentSeller, user]);

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

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSeller) return;

    const unitType = formData.category === "Steel" 
      ? "ton" 
      : formData.category === "Wood" 
        ? "cubic-foot" 
        : formData.category === "Cement" 
          ? "bag" 
          : "kg";

    try {
      if (formMode === "add") {
        const { error } = await (supabase as any)
          .from('products')
          .insert({
            supplier_id: currentSeller.id,
            product_name: formData.name,
            category: formData.category,
            quantity: Number(formData.quantityAvailable),
            unit: unitType,
            price: Number(formData.price),
            description: `Premium grade bulk wholesale sourcing of ${formData.name}.`,
            available: formData.available
          });

        if (error) throw error;
      } else if (formMode === "edit" && activeProdId) {
        const { error } = await (supabase as any)
          .from('products')
          .update({
            product_name: formData.name,
            category: formData.category,
            quantity: Number(formData.quantityAvailable),
            unit: unitType,
            price: Number(formData.price),
            available: formData.available
          })
          .eq('id', activeProdId);

        if (error) throw error;
      }
      
      await loadSellerData();
    } catch (err) {
      console.error("Product submit failed:", err);
      alert("Database error: Unable to save product.");
    }

    setShowForm(false);
  };

  const handleDeleteProduct = async (prodId: string) => {
    if (!currentSeller) return;
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const { error } = await (supabase as any)
        .from('products')
        .delete()
        .eq('id', prodId);

      if (error) throw error;
      await loadSellerData();
    } catch (err) {
      console.error("Product deletion failed:", err);
      alert("Database error: Unable to delete product.");
    }
  };

  if (!currentSeller) return null;

  const dynamicInsights = (() => {
    const prods = currentSeller.products;
    if (prods.length === 0) {
      return [
        {
          title: t("highDemandTitle"),
          desc: t("highDemandDesc")
            .replace(/{Product}/g, "Premium Basmati Rice")
            .replace(/{Unit}/g, "kg")
        },
        {
          title: t("lowStockTitle"),
          desc: t("lowStockDesc")
            .replace(/{Product}/g, "Steel Rods")
            .replace(/{Unit}/g, "piece")
        },
        {
          title: t("pricingTitle"),
          desc: t("pricingDesc")
            .replace(/{Product}/g, "Premium Turmeric Powder")
            .replace(/{Unit}/g, "kg")
        }
      ];
    }

    const insights: Array<{ title: string; desc: string }> = [];

    // Card 1: Low Stock or High Demand
    const lowStockProd = prods.find(p => p.quantityAvailable < 10000);
    if (lowStockProd) {
      insights.push({
        title: t("lowStockTitle"),
        desc: t("lowStockDesc")
          .replace(/{Product}/g, lowStockProd.name)
          .replace(/{Unit}/g, lowStockProd.unit)
      });
    } else {
      const topProd = prods[0];
      insights.push({
        title: t("highDemandTitle"),
        desc: t("highDemandDesc")
          .replace(/{Product}/g, topProd.name)
          .replace(/{Unit}/g, topProd.unit)
      });
    }

    // Card 2: Pricing Recommendation
    const firstProd = prods[0];
    insights.push({
      title: t("pricingTitle"),
      desc: t("pricingDesc")
        .replace(/{Product}/g, firstProd.name)
        .replace(/{Unit}/g, firstProd.unit)
    });

    // Card 3: Demand Forecast or Regional Trend
    if (prods.length > 1) {
      const secondProd = prods[1];
      insights.push({
        title: t("demandForecastTitle"),
        desc: t("demandForecastDesc")
          .replace(/{Product}/g, secondProd.name)
          .replace(/{Unit}/g, secondProd.unit)
      });
    } else {
      const targetProd = prods[0];
      if (targetProd.category === "Steel" || targetProd.category === "Cement") {
        insights.push({
          title: t("regionalTrendTitle"),
          desc: t("regionalTrendDesc")
        });
      } else {
        insights.push({
          title: t("demandForecastTitle"),
          desc: t("demandForecastDesc")
            .replace(/{Product}/g, targetProd.name)
            .replace(/{Unit}/g, targetProd.unit)
        });
      }
    }

    return insights;
  })();

  // Reverted workspace helpers



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
            <p className="text-2xl font-extrabold text-app-text mt-2">{metrics.orders}</p>
            <span className="text-[10px] text-success font-bold mt-1 block">↑ 12% this week</span>
          </div>

          <div className="rounded-xl border border-app-border bg-app-card p-5 shadow-sm">
            <div className="flex justify-between items-start text-app-text-secondary">
              <span className="text-[10px] font-bold uppercase">{t("customers")}</span>
              <Users className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-app-text mt-2">{metrics.customers}</p>
            <span className="text-[10px] text-app-text-secondary mt-1 block font-medium">{t("connectedBuyers")}</span>
          </div>

          <div className="rounded-xl border border-app-border bg-app-card p-5 shadow-sm">
            <div className="flex justify-between items-start text-app-text-secondary">
              <span className="text-[10px] font-bold uppercase">{t("revenueLabel")}</span>
              <DollarSign className="h-4.5 w-4.5 text-primary" />
            </div>
            <p className="text-2xl font-extrabold text-primary mt-2">{metrics.revenue}</p>
            <span className="text-[10px] text-app-text-secondary mt-1 block">{t("salesValue")}</span>
          </div>

        </div>

        {/* AI Suggestions Banner */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-5 shadow-premium animate-fade-in">
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="h-4.5 w-4.5 text-primary" />
            <h3 className="font-bold text-app-text text-sm">{t("aiBusinessInsights")}</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm">
            {dynamicInsights.map((insight, idx) => (
              <div key={idx} className="bg-app-card border border-app-border/40 rounded-xl p-3.5 shadow-sm flex items-start gap-2.5 hover:shadow-md transition-shadow">
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
                {currentSeller.products.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-4 py-12 text-center text-app-text-secondary">
                      <ShoppingBag className="h-8 w-8 text-primary mx-auto mb-2 opacity-50 animate-pulse" />
                      <p className="font-bold">No products found in your inventory.</p>
                      <button 
                        onClick={handleOpenAdd}
                        className="mt-2 text-xs font-bold text-primary hover:underline cursor-pointer"
                      >
                        Add your first product
                      </button>
                    </td>
                  </tr>
                ) : (
                  currentSeller.products.map(p => (
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
                  ))
                )}
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
