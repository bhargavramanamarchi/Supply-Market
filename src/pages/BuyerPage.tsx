import React, { useState, useEffect } from "react";
import { 
  Mic, 
  Bot, 
  Sparkles, 
  Star, 
  CheckCircle, 
  MapPin, 
  ShieldCheck, 
  PhoneCall, 
  X, 
  RefreshCw, 
  Bookmark, 
  Search,
  MessageSquare
} from "lucide-react";
import type { MatchResult } from "../services/geminiService";
import { matchSuppliersAI, getSupabaseProducts, getSupabaseSuppliers } from "../services/geminiService";
import { speakText, stopSpeaking, getSpeechRecognition } from "../services/speechService";
import type { Supplier } from "../services/supplierData";
import { getStoredSuppliers } from "../services/supplierData";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";

const AI_STEPS = [
  "Understanding your requirement",
  "Searching suppliers",
  "Comparing prices",
  "Checking stock",
  "Choosing the best supplier",
  "Preparing response"
];

const CHIPS = ["Rice", "Turmeric", "Steel", "Wood", "Cement", "Packaging", "Cotton", "Electronics"];

const SUGGESTED_QUERIES: Record<string, string> = {
  "Rice": "I need 500kg of premium long-grain Basmati rice for my restaurant business.",
  "Turmeric": "I need 100kg premium turmeric for my herbal products business.",
  "Wood": "Looking for 500 cubic feet of seasoned Teak Wood planks for furniture production.",
  "Steel": "Procuring 20 tons of structural Fe 550D steel rebars for building foundation.",
  "Cement": "Order 1000 bags of Portland Pozzolana Cement (PPC) delivered to our Indore site.",
  "Packaging": "Need 5000 pieces of corrugated shipping packaging boxes.",
  "Cotton": "Procuring 2000kg of combed Shankar-6 raw cotton fiber.",
  "Electronics": "Find 5000 units of Arduino compatible microcontroller boards."
};

export const BuyerPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchResult, setSearchResult] = useState<MatchResult | null>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const prods = await getSupabaseProducts();
        setAllProducts(prods);
      } catch (err) {
        console.error("Error loading products for browse list:", err);
      }
    };
    loadProducts();
  }, [searchResult]);

  // Voice Assistant state (Centered modal)
  const [isVoiceOpen, setIsVoiceOpen] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenCharIndex, setSpokenCharIndex] = useState(0);

  // Speech Recognition state
  const [isListening, setIsListening] = useState(false);
  const [speechError, setSpeechError] = useState("");

  // Connect Overlay states
  const [connectState, setConnectState] = useState<"idle" | "connecting" | "connected">("idle");
  const [connectedSupplier, setConnectedSupplier] = useState<Supplier | null>(null);

  // Saved suppliers IDs list
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [followedIds, setFollowedIds] = useState<string[]>([]);

  // Manual browse / database search states
  const [manualSearch, setManualSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const subtitleContainerRef = React.useRef<HTMLDivElement>(null);

  const speechHook = getSpeechRecognition();

  // Scroll lock effect on center assistant modal
  useEffect(() => {
    if (isVoiceOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isVoiceOpen]);

  // Subtitle auto-scroll effect
  useEffect(() => {
    if (isVoiceOpen && subtitleContainerRef.current) {
      const highlighted = subtitleContainerRef.current.querySelector(".highlighted-word");
      if (highlighted) {
        highlighted.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }
  }, [spokenCharIndex, isVoiceOpen]);

  // Clean voices on exit
  useEffect(() => {
    return () => {
      stopSpeaking();
      speechHook.stop();
    };
  }, []);

  const handleChipClick = (categoryName: string) => {
    const defaultQuery = SUGGESTED_QUERIES[categoryName] || `I need ${categoryName} supplies.`;
    setQuery(defaultQuery);
  };

  const handleVoiceInput = () => {
    setSpeechError("");
    setIsListening(true);
    speechHook.start(
      language,
      (result) => {
        setQuery(result);
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

  // Find Suppliers action
  const handleFindSuppliers = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setIsSearching(true);
    setCurrentStep(0);
    setSearchResult(null);
    setConnectState("idle");
    stopSpeaking();
    setIsVoiceOpen(false);

    // Sequential 6-step progress stepper updates every 400ms
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) => {
        if (prev >= AI_STEPS.length - 1) {
          clearInterval(stepInterval);
          return prev;
        }
        return prev + 1;
      });
    }, 400);

    try {
      // 1. Insert search query into BuyerRequests table in Supabase
      let requestId: string | null = null;
      if (user) {
        const { data: requestData, error: requestError } = await (supabase as any)
          .from('buyerrequests')
          .insert({
            buyer_id: user.id,
            requirement: query,
            language: language,
            status: 'active'
          })
          .select('id')
          .single();

        if (requestError) {
          console.error("Error inserting buyer request:", requestError);
        } else if (requestData) {
          requestId = requestData.id;
        }
      }

      // 2. Perform Gemini AI matching (fetching active products from Supabase)
      const results = await matchSuppliersAI(query, language);
      clearInterval(stepInterval);
      
      // 3. Save AI recommendation in Supabase if a valid supplier is matched
      if (requestId && results.bestSupplier && results.bestSupplier.id !== 'mock_assistant' && results.bestSupplier.id !== 'mock_no_match') {
        const bestMatchScore = results.allMatches.find(m => m.supplier.id === results.bestSupplier.id)?.score || 95;
        const { error: recomError } = await (supabase as any)
          .from('airecommendations')
          .insert({
            request_id: requestId,
            supplier_id: results.bestSupplier.id,
            confidence_score: Number((bestMatchScore > 100 ? 100 : bestMatchScore < 0 ? 0 : bestMatchScore).toFixed(2))
          });

        if (recomError) {
          console.error("Error inserting AI recommendation:", recomError);
        }
      }

      setCurrentStep(AI_STEPS.length - 1);
      setTimeout(() => {
        setIsSearching(false);
        setSearchResult(results);
        // Fire floating ChatGPT assistant
        triggerVoiceAssistant(results);
      }, 450);

    } catch (err) {
      clearInterval(stepInterval);
      setIsSearching(false);
      alert("Sourcing search failed. Please try again.");
    }
  };

  // Trigger Center assistant dialog
  const triggerVoiceAssistant = (results: MatchResult) => {
    setIsVoiceOpen(true);
    setIsSpeaking(true);
    setSpokenCharIndex(0);
    setVoiceError("");

    speakText({
      text: results.voiceTranscript,
      lang: language,
      onBoundary: (charIndex) => {
        setSpokenCharIndex(charIndex);
      },
      onEnd: () => {
        setIsSpeaking(false);
      },
      onError: (err: any) => {
        setIsSpeaking(false);
        setVoiceError(typeof err === "string" ? err : "Unable to generate AI voice.");
      }
    });
  };

  const handleCloseVoice = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setIsVoiceOpen(false);
  };

  // Hotline Handshake connecting overlay
  const handleConnectSupplier = (supplier: Supplier) => {
    setConnectedSupplier(supplier);
    setConnectState("connecting");

    setTimeout(() => {
      setConnectState("connected");
      // Add to connected list inside connection array
      const stored = getStoredSuppliers();
      const updated = stored.map(s => {
        if (s.businessName === supplier.businessName) {
          return { ...s, status: "Connected" };
        }
        return s;
      });
      localStorage.setItem("supply_market_suppliers", JSON.stringify(updated));
    }, 2000);
  };

  // Follow suppliers helper
  const handleFollowSupplier = (supplierName: string) => {
    setFollowedIds(prev => {
      const exists = prev.includes(supplierName);
      if (exists) {
        return prev.filter(name => name !== supplierName);
      }
      return [...prev, supplierName];
    });
  };

  // manual browse table loaded dynamically from state
  
  const filteredProducts = allProducts.filter(prod => {
    const matchesSearch = 
      prod.name.toLowerCase().includes(manualSearch.toLowerCase()) || 
      prod.description.toLowerCase().includes(manualSearch.toLowerCase()) ||
      prod.businessName.toLowerCase().includes(manualSearch.toLowerCase());
    
    const matchesCategory = selectedCategory === "" || prod.category === selectedCategory;
    const matchesLocation = selectedLocation === "" || prod.location.toLowerCase().includes(selectedLocation.toLowerCase());
    const matchesMinPrice = minPrice === "" || prod.price >= Number(minPrice);
    const matchesMaxPrice = maxPrice === "" || prod.price <= Number(maxPrice);
    const matchesRating = minRating === "0" || (prod as any).rating >= Number(minRating);
    const matchesAvailability = !onlyAvailableToday || prod.availability === "Immediate";

    return matchesSearch && matchesCategory && matchesLocation && matchesMinPrice && matchesMaxPrice && matchesRating && matchesAvailability;
  });

  // Render ChatGPT styled Word Highlights
  const renderHighlightedTranscript = () => {
    if (!searchResult) return null;
    const text = searchResult.voiceTranscript;
    const words = text.split(" ");
    let charAccumulator = 0;

    return (
      <div className="text-sm sm:text-base leading-relaxed text-app-text-secondary">
        {words.map((word, idx) => {
          const startIdx = charAccumulator;
          const endIdx = startIdx + word.length;
          charAccumulator += word.length + 1; // plus spaces

          const isHighlighted = spokenCharIndex >= startIdx && spokenCharIndex < endIdx;

          // Render words gradually - hide future words
          if (startIdx > spokenCharIndex && !isHighlighted) {
            return null;
          }

          return (
            <span 
              key={idx}
              className={`mr-1 transition-all duration-150 ${
                isHighlighted
                  ? "highlighted-word text-primary font-bold underline decoration-secondary decoration-2 underline-offset-4 bg-primary/10 px-1.5 rounded"
                  : "text-app-text font-medium"
              }`}
            >
              {word}
            </span>
          );
        })}
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 bg-app-bg min-h-[calc(100vh-4rem)] transition-colors duration-300">
      
      {/* Search Console title */}
      <div className="text-center max-w-xl mx-auto mb-8 animate-fade-in-up">
        <h1 className="text-3xl font-extrabold text-app-text tracking-tight sm:text-4xl">{t("findRightSupplier")}</h1>
        <p className="text-sm sm:text-base text-app-text-secondary mt-2">
          {t("tellUsNeed")}
        </p>
      </div>

      {/* Main Console Box */}
      <div className="space-y-8 max-w-4xl mx-auto">
        
        {/* Large Sourcing Search Container */}
        <div className="rounded-2xl border border-app-border bg-app-card p-5 sm:p-6 shadow-premium transition-all duration-300">
          <form onSubmit={handleFindSuppliers} className="space-y-4">
            <div className="relative rounded-xl border border-app-border bg-app-bg focus-within:border-primary transition-all duration-200">
              <textarea
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchPlaceholder")}
                rows={3}
                className="w-full bg-transparent px-4 py-3.5 pr-12 text-sm sm:text-base text-app-text placeholder-app-text-secondary border-0 focus:ring-0 outline-none resize-none"
              />

              {/* Dictating Screen */}
              {isListening && (
                <div className="absolute inset-0 bg-primary/5 rounded-xl backdrop-blur-[2px] flex items-center justify-center gap-3.5">
                  <div className="flex gap-1 h-6 items-end">
                    <span className="w-1.5 h-6 bg-primary rounded-full animate-wave-fast" />
                    <span className="w-1.5 h-6 bg-primary rounded-full animate-wave-medium" style={{ animationDelay: '0.1s' }} />
                    <span className="w-1.5 h-6 bg-primary rounded-full animate-wave-slow" style={{ animationDelay: '0.2s' }} />
                  </div>
                  <span className="text-sm font-bold text-primary animate-pulse">Listening ({language}). Speak requirement...</span>
                  <button
                    type="button"
                    onClick={handleStopVoiceInput}
                    className="p-1 rounded-lg bg-primary/10 hover:bg-primary/20 text-primary transition-all ml-4 cursor-pointer"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            {speechError && (
              <p className="text-xs text-danger font-medium leading-normal">{speechError}</p>
            )}

            {/* Category selection chips */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold text-app-text-secondary uppercase tracking-wide">Popular Searches:</span>
              {CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => handleChipClick(chip)}
                  className="rounded-lg bg-app-bg hover:bg-app-card-hover border border-app-border text-xs px-2.5 py-1 text-app-text font-semibold transition-colors cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Actions panel */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              
              {/* Voice action button */}
              <button
                type="button"
                onClick={handleVoiceInput}
                className="flex items-center gap-2 rounded-xl border border-app-border bg-app-card shadow-sm px-5 py-3 text-sm font-bold hover:bg-app-card-hover text-app-text transition-colors cursor-pointer"
              >
                <Mic className="h-4 w-4 text-primary" />
                <span>🎤 {t("speakBtn")}</span>
              </button>

              <button
                type="submit"
                disabled={!query.trim() || isSearching}
                className="flex-grow flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white px-6 py-3 text-sm font-bold shadow-premium transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSearching ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    <span>Matching Suppliers...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" />
                    <span>Find Suppliers</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => { setQuery(""); setSearchResult(null); stopSpeaking(); setIsVoiceOpen(false); }}
                className="rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text px-4 py-3 text-sm font-bold transition-all w-full sm:w-auto cursor-pointer"
              >
                Clear
              </button>

            </div>
          </form>
        </div>

        {/* Workflow Stepper Panel */}
        {isSearching && (
          <div className="rounded-2xl border border-app-border bg-app-card p-5 sm:p-6 shadow-premium animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <RefreshCw className="h-5 w-5 text-primary animate-spin" />
              <div>
                <h3 className="font-bold text-app-text text-base">Processing Match Heuristics</h3>
                <p className="text-xs text-app-text-secondary mt-0.5">Evaluating inventory databases and freight corridors.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {AI_STEPS.map((step, idx) => {
                const completed = idx < currentStep;
                const active = idx === currentStep;

                return (
                  <div
                    key={idx}
                    className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                      completed
                        ? "border-success/30 bg-success/5 text-success"
                        : active
                        ? "border-primary bg-primary/5 text-primary shadow-sm"
                        : "border-app-border bg-app-bg/50 text-app-text-secondary opacity-60"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {completed ? (
                        <CheckCircle className="h-5 w-5 text-success" />
                      ) : active ? (
                        <div className="h-4.5 w-4.5 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                      ) : (
                        <span className="flex h-5 w-5 items-center justify-center rounded-full border border-app-border text-[10px] font-bold">
                          {idx + 1}
                        </span>
                      )}
                    </div>
                    <span className="text-xs sm:text-sm font-semibold">{step}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* AI Recommendations Best Match Cards */}
        {searchResult && !isSearching && (
          <div className="space-y-8 animate-fade-in-up">
            
            {/* Top Match Hero Block */}
            <div>
              <h2 className="text-lg font-bold text-app-text mb-4 flex items-center gap-2">
                <Sparkles className="h-4.5 w-4.5 text-primary" />
                <span>AI Recommendation Selection</span>
              </h2>

              <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 to-secondary/5 p-6 shadow-premium relative overflow-hidden">
                <div className="absolute right-0 top-0 translate-x-12 -translate-y-12 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
                
                <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
                  <div className="space-y-4 max-w-2xl">
                    <div className="inline-flex items-center gap-1.5 rounded bg-success text-white px-2.5 py-0.5 text-xs font-bold shadow-sm">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      <span>Best Match</span>
                    </div>

                    <h3 className="text-2xl font-extrabold text-app-text">
                      {searchResult.bestSupplier.businessName}
                    </h3>

                    <div className="flex flex-wrap gap-4 text-xs font-semibold text-app-text-secondary">
                      <span className="flex items-center gap-0.5">
                        <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                        <strong className="text-app-text">{searchResult.bestSupplier.rating}</strong> / 5.0 Rating
                      </span>
                      <span>•</span>
                      <span>Location: {searchResult.bestSupplier.location}</span>
                      <span>•</span>
                      <span className="text-success font-bold">Available Today</span>
                    </div>

                    <div className="text-xs font-bold text-primary bg-primary/5 border border-primary/25 rounded px-2.5 py-1 inline-block">
                      Match Confidence Score: {searchResult.bestSupplier.trustScore}%
                    </div>

                    <p className="text-sm text-app-text leading-relaxed bg-app-card/75 p-4 rounded-xl border border-app-border shadow-sm">
                      <strong className="text-primary font-bold">Reason for recommendation: </strong>
                      {searchResult.matchingReason}
                    </p>
                  </div>

                  <div className="flex flex-col justify-between items-end border-t md:border-t-0 md:border-l border-app-border pt-4 md:pt-0 md:pl-6 min-w-[190px]">
                    <div className="text-right w-full md:w-auto">
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase">Product Offer Price</span>
                      <p className="text-2xl font-extrabold text-primary mt-1">
                        ₹{searchResult.bestProduct.price} <span className="text-xs font-semibold text-app-text-secondary">/ {searchResult.bestProduct.unit}</span>
                      </p>
                      <span className="inline-block mt-2 rounded bg-secondary/15 text-secondary border border-secondary/35 px-2 py-0.5 text-[10px] font-bold">
                        Grade: {searchResult.bestProduct.qualityGrade}
                      </span>
                    </div>

                    <div className="mt-6 flex flex-col gap-2 w-full">
                      <button
                        onClick={() => handleConnectSupplier(searchResult.bestSupplier)}
                        className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white py-2.5 px-4 text-xs font-bold shadow hover:opacity-95 cursor-pointer"
                      >
                        <PhoneCall className="h-3.5 w-3.5" />
                        <span>Connect</span>
                      </button>
                      <button
                        onClick={() => alert(`Product details: \n${searchResult.bestProduct.description}`)}
                        className="rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text py-2 px-4 text-xs font-bold cursor-pointer"
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => {
                          const supId = searchResult.bestSupplier.id;
                          setSavedIds(prev => prev.includes(supId) ? prev.filter(id => id !== supId) : [...prev, supId]);
                        }}
                        className={`rounded-xl border py-2 px-4 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                          savedIds.includes(searchResult.bestSupplier.id)
                            ? "bg-primary/10 border-primary text-primary"
                            : "border-app-border bg-app-card hover:bg-app-card-hover text-app-text"
                        }`}
                      >
                        <Bookmark className="h-3.5 w-3.5" />
                        <span>{savedIds.includes(searchResult.bestSupplier.id) ? "Saved" : "Save"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* AI Summary report */}
            <div className="rounded-2xl border border-app-border bg-app-card p-5 sm:p-6 shadow-sm space-y-4">
              <div className="flex items-center gap-2 border-b border-app-border pb-3">
                <Bot className="h-5 w-5 text-primary" />
                <h3 className="font-bold text-app-text text-base">AI Matching Summary</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="text-[10px] font-bold text-app-text-secondary uppercase block">Your Requirement</span>
                    <p className="text-app-text font-semibold mt-0.5">"{searchResult.aiSummary.requirement}"</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-app-text-secondary uppercase block">Selected Supplier</span>
                    <p className="text-primary font-extrabold mt-0.5 text-base">{searchResult.aiSummary.selectedSupplier}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">Price</span>
                      <p className="text-app-text font-semibold mt-0.5">{searchResult.aiSummary.price}</p>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-app-text-secondary uppercase block">Location</span>
                      <p className="text-app-text font-semibold mt-0.5">{searchResult.aiSummary.location}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 sm:border-l sm:border-app-border sm:pl-4">
                  <div>
                    <span className="text-[10px] font-bold text-app-text-secondary uppercase block">Reason for Selection</span>
                    <p className="text-app-text leading-normal mt-0.5">{searchResult.aiSummary.matchingReason}</p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase block font-bold">Next Step Recommendation</span>
                    <p className="text-app-text-secondary leading-normal mt-0.5">{searchResult.aiSummary.recommendation}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alternative matches */}
            {searchResult.allMatches.length > 1 && (
              <div>
                <h4 className="text-sm font-bold text-app-text-secondary uppercase tracking-wider mb-3">Other Sourced Options</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {searchResult.allMatches.slice(1, 3).map((match, idx) => (
                    <div key={idx} className="border border-app-border rounded-xl p-4 bg-app-card flex justify-between items-center gap-4">
                      <div>
                        <strong className="text-sm font-bold text-app-text block">{match.supplier.businessName}</strong>
                        <span className="text-xs text-app-text-secondary block mt-0.5">{match.product.name}</span>
                        <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                          <span className="text-primary font-bold">₹{match.product.price} / {match.product.unit}</span>
                          <span className="text-app-text-secondary flex items-center gap-0.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {match.supplier.rating}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleConnectSupplier(match.supplier)}
                        className="rounded-lg bg-primary text-white py-1.5 px-3 text-xs font-bold hover:opacity-90 cursor-pointer"
                      >
                        Connect
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        )}

        {/* Manual Browse suppliers directory */}
        <div className="border-t border-app-border pt-12 space-y-6">
          <div>
            <h2 className="text-xl font-extrabold text-app-text tracking-tight">Browse Suppliers Manually</h2>
            <p className="text-xs text-app-text-secondary mt-1">Search and filter through the complete verified registry database.</p>
          </div>

          {/* Filters cards */}
          <div className="rounded-xl border border-app-border bg-app-card p-4 sm:p-5 shadow-sm space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-app-text-secondary uppercase">Product search</label>
                <div className="relative rounded-lg border border-app-border bg-app-bg focus-within:border-primary transition-all">
                  <Search className="h-4 w-4 text-app-text-secondary absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={manualSearch}
                    onChange={(e) => setManualSearch(e.target.value)}
                    placeholder="Search product, seller..."
                    className="w-full bg-transparent pl-9 pr-3 py-2 text-xs text-app-text outline-none border-0"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-app-text-secondary uppercase">Location City</label>
                <input
                  type="text"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  placeholder="e.g. Hyderabad, Vijayawada"
                  className="w-full rounded-lg border border-app-border bg-app-bg px-2.5 py-2 text-xs text-app-text outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-app-text-secondary uppercase">Product Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full rounded-lg border border-app-border bg-app-bg px-2.5 py-2 text-xs text-app-text outline-none focus:border-primary"
                >
                  <option value="">All Categories</option>
                  {CHIPS.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 border-t border-app-border/40">
              
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-app-text-secondary uppercase">Min Price (₹)</label>
                <input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="Min price"
                  className="w-full rounded-lg border border-app-border bg-app-bg px-2.5 py-2 text-xs text-app-text outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-app-text-secondary uppercase">Max Price (₹)</label>
                <input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="Max price"
                  className="w-full rounded-lg border border-app-border bg-app-bg px-2.5 py-2 text-xs text-app-text outline-none focus:border-primary"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-app-text-secondary uppercase">Min Rating</label>
                <select
                  value={minRating}
                  onChange={(e) => setMinRating(e.target.value)}
                  className="w-full rounded-lg border border-app-border bg-app-bg px-2.5 py-2 text-xs text-app-text outline-none focus:border-primary"
                >
                  <option value="0">All Ratings</option>
                  <option value="4.8">4.8+ Stars</option>
                  <option value="4.6">4.6+ Stars</option>
                  <option value="4.4">4.4+ Stars</option>
                </select>
              </div>

              <div className="flex items-center gap-2 pt-5">
                <input
                  type="checkbox"
                  id="availToday"
                  checked={onlyAvailableToday}
                  onChange={(e) => setOnlyAvailableToday(e.target.checked)}
                  className="rounded border-app-border text-primary focus:ring-primary h-4 w-4"
                />
                <label htmlFor="availToday" className="text-xs font-bold text-app-text-secondary cursor-pointer selection:bg-transparent">
                  Available Today
                </label>
              </div>

            </div>
          </div>

          {/* Directory listings result grids */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {filteredProducts.map((prod, idx) => (
              <div 
                key={idx}
                className="rounded-xl border border-app-border bg-app-card p-4.5 shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <strong className="text-sm font-bold text-app-text block">{prod.businessName}</strong>
                      <span className="text-xs text-app-text-secondary font-medium block mt-0.5">{prod.name}</span>
                    </div>
                    <span className="flex items-center gap-0.5 text-xs font-semibold text-app-text bg-app-bg px-2 py-0.5 border border-app-border rounded">
                      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                      {(prod as any).rating || 4.5}
                    </span>
                  </div>

                  <div className="border-t border-app-border/40 my-3 pt-3 space-y-1.5 text-xs text-app-text-secondary">
                    <div className="flex justify-between">
                      <span>Pricing:</span>
                      <strong className="text-primary font-bold">₹{prod.price} / {prod.unit}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Available Stock:</span>
                      <span className="font-semibold text-app-text">{prod.quantityAvailable} {prod.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span className="font-medium text-app-text flex items-center gap-0.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {prod.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Availability:</span>
                      <span className={`font-semibold ${prod.availability === "Immediate" ? 'text-success' : 'text-app-text-secondary'}`}>
                        {prod.availability}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-2 mt-2 border-t border-app-border/40">
                  <button
                    onClick={() => alert(`Supplier specifications:\n${prod.description}`)}
                    className="rounded-lg border border-app-border bg-app-card hover:bg-app-card-hover text-app-text py-1.5 text-xs font-semibold cursor-pointer"
                  >
                    View
                  </button>
                  <button
                    onClick={() => handleConnectSupplier({
                      id: `sup_dyn_${idx}`,
                      businessName: prod.businessName,
                      rating: (prod as any).rating || 4.5,
                      trustScore: (prod as any).trustScore || 92,
                      location: prod.location,
                      contactNumber: prod.contactNumber,
                      businessHours: prod.businessHours,
                      products: []
                    })}
                    className="rounded-lg bg-primary text-white py-1.5 text-xs font-semibold hover:opacity-90 cursor-pointer"
                  >
                    Connect
                  </button>
                  <button
                    onClick={() => handleFollowSupplier(prod.businessName)}
                    className={`rounded-lg py-1.5 text-xs font-semibold border transition-colors cursor-pointer ${
                      followedIds.includes(prod.businessName)
                        ? "bg-primary/10 border-primary text-primary"
                        : "border-app-border bg-app-card text-app-text hover:bg-app-card-hover"
                    }`}
                  >
                    {followedIds.includes(prod.businessName) ? "Following" : "Follow"}
                  </button>
                </div>
              </div>
            ))}

            {filteredProducts.length === 0 && (
              <p className="col-span-2 text-center text-sm text-app-text-secondary py-12 italic border border-dashed border-app-border rounded-xl">
                No matching suppliers found in manual directory search.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Floating Center AI Assistant (ChatGPT Voice Style Overlay) */}
      {isVoiceOpen && searchResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md transition-all duration-300">
          <div className="w-full max-w-sm rounded-2xl border border-primary/20 bg-app-card p-6 shadow-premium-lg animate-fade-in-up m-4 overflow-hidden relative">
            
            {/* Header close trigger */}
            <div className="flex justify-between items-center border-b border-app-border pb-3 mb-4">
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-app-text-secondary uppercase">
                <span className="h-2.5 w-2.5 rounded-full bg-success animate-pulse" />
                <span>AI Speaking ({language})</span>
              </div>
              <button 
                onClick={handleCloseVoice}
                className="p-1 hover:bg-app-bg rounded-lg text-app-text-secondary cursor-pointer"
              >
                <X className="h-4.5 w-4.5" />
              </button>
            </div>

            {/* Speaking / listening avatar ripple waveform */}
            <div className="flex flex-col items-center justify-center py-6 space-y-4">
              
              {/* Circular Avatar */}
              <div className="relative">
                {/* Visual pulse rings */}
                {isSpeaking && (
                  <>
                    <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                    <div className="absolute inset-2 rounded-full bg-secondary/30 animate-pulse" />
                  </>
                )}
                <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr from-primary to-secondary text-white shadow-premium z-10">
                  <Bot className={`h-10 w-10 ${isSpeaking ? 'animate-bounce' : ''}`} />
                </div>
              </div>

              {/* Sound waves graphics */}
              <div className="flex items-end gap-1 h-6">
                {Array.from({ length: 15 }).map((_, idx) => {
                  const animationClass = isSpeaking 
                    ? idx % 3 === 0 
                      ? 'animate-wave-slow' 
                      : idx % 3 === 1 
                        ? 'animate-wave-medium' 
                        : 'animate-wave-fast'
                    : '';
                  return (
                    <span
                      key={idx}
                      className={`w-1 bg-primary/45 rounded-full h-full transform origin-bottom transition-all duration-300 ${animationClass}`}
                      style={{ 
                        animationDelay: `${idx * 0.04}s`,
                        height: isSpeaking ? '100%' : '15%'
                      }}
                    />
                  );
                })}
              </div>
            </div>

            {/* Live synchronized transcript box */}
            <div 
              ref={subtitleContainerRef}
              className="bg-app-bg border border-app-border rounded-xl p-4 max-h-[140px] overflow-y-auto mb-6 scroll-smooth"
            >
              {renderHighlightedTranscript()}
            </div>

            {/* CSS Animation style and flowing line */}
            <style>{`
              @keyframes flow-wave {
                0% { background-position: 0% 50%; }
                50% { background-position: 100% 50%; }
                100% { background-position: 0% 50%; }
              }
              .flowing-line-animation {
                background: linear-gradient(90deg, #0F766E, #14B8A6, #F59E0B, #14B8A6, #0F766E);
                background-size: 200% 200%;
                animation: flow-wave 2s linear infinite;
              }
            `}</style>
            
            <div className="h-1.5 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden mb-6">
              {isSpeaking ? (
                <div className="h-full w-full flowing-line-animation" />
              ) : (
                <div className="h-full w-0 bg-slate-300 dark:bg-slate-700" />
              )}
            </div>

            {voiceError && (
              <div className="mb-6 text-center text-[10px] font-bold text-danger bg-danger/5 border border-danger/25 rounded-xl py-2 px-3 animate-pulse">
                {voiceError}
              </div>
            )}

            {/* Three rounded quick actions */}
            <div className="space-y-2.5">
              
              <button
                onClick={() => {
                  handleConnectSupplier(searchResult.bestSupplier);
                  handleCloseVoice();
                }}
                className="w-full flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white py-3 text-xs font-bold shadow hover:opacity-95 cursor-pointer"
              >
                <PhoneCall className="h-4 w-4" />
                <span>📞 Connect Supplier</span>
              </button>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    setQuery("");
                    handleCloseVoice();
                  }}
                  className="flex items-center justify-center gap-1 rounded-full border border-app-border bg-app-card hover:bg-app-card-hover text-app-text py-2.5 text-[11px] font-bold cursor-pointer"
                >
                  <MessageSquare className="h-3.5 w-3.5 text-primary" />
                  <span>💬 Ask AI</span>
                </button>

                <button
                  onClick={async () => {
                    const stored = await getSupabaseSuppliers();
                    const alternative = stored.find((s: any) => s.id !== searchResult.bestSupplier.id && s.products.some((p: any) => p.category === searchResult.bestProduct.category));
                    if (alternative) {
                      const altProd = alternative.products.find((p: any) => p.category === searchResult.bestProduct.category)!;
                      const altResult: MatchResult = {
                        ...searchResult,
                        bestSupplier: alternative,
                        bestProduct: altProd,
                        matchingReason: `${alternative.businessName} has stock of ${altProd.name} at ₹${altProd.price}/${altProd.unit}.`,
                        voiceTranscript: `Hello. I found another option. ${alternative.businessName} has Premium ${altProd.category} available for ₹${altProd.price} per ${altProd.unit}. Would you like to connect?`
                      };
                      setSearchResult(altResult);
                      triggerVoiceAssistant(altResult);
                    } else {
                      alert("No other matching suppliers found for this category.");
                    }
                  }}
                  className="flex items-center justify-center gap-1 rounded-full border border-app-border bg-app-card hover:bg-app-card-hover text-app-text py-2.5 text-[11px] font-bold cursor-pointer"
                >
                  <RefreshCw className="h-3.5 w-3.5 text-primary" />
                  <span>🔄 Find More</span>
                </button>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* Connect Screen Overlay */}
      {connectState !== "idle" && connectedSupplier && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md">
          <div className="w-full max-w-md rounded-2xl border border-app-border bg-app-card p-6 shadow-premium-lg animate-fade-in-up m-4">
            
            {connectState === "connecting" ? (
              <div className="text-center py-10 space-y-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary mx-auto">
                  <RefreshCw className="h-7 w-7 animate-spin" />
                </div>
                <h3 className="text-lg font-bold text-app-text animate-pulse">Connecting...</h3>
                <p className="text-xs text-app-text-secondary max-w-xs mx-auto">Bridging secure call routing lines and syncing profile identity.</p>
              </div>
            ) : (
              <div className="space-y-5 text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-success/15 text-success border border-success/35 mb-2">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-extrabold text-app-text">Connection Successful</h3>
                
                <div className="bg-app-bg border border-app-border rounded-xl p-4 space-y-2 text-left">
                  <div className="flex items-center justify-between text-xs border-b border-app-border/40 pb-2">
                    <span className="text-app-text-secondary font-semibold">Your Identity</span>
                    <span className="font-bold text-primary">Connected</span>
                  </div>
                  <div className="flex items-center justify-between text-xs pt-1">
                    <span className="text-app-text-secondary font-semibold">Supplier Sourced</span>
                    <span className="font-bold text-app-text">{connectedSupplier.businessName}</span>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-app-text leading-normal">
                  Buyer and Supplier are now connected. You can continue your discussion directly.
                </p>

                <div className="pt-2 grid grid-cols-2 gap-2.5">
                  <a
                    href={`tel:${connectedSupplier.contactNumber}`}
                    className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary text-white py-3 text-xs font-bold hover:opacity-95"
                  >
                    <PhoneCall className="h-4.5 w-4.5" />
                    <span>Call Sales Rep</span>
                  </a>
                  <button
                    onClick={() => setConnectState("idle")}
                    className="rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text py-3 text-xs font-bold cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
};
