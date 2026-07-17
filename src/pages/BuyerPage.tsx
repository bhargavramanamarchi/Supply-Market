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
import { matchSuppliersAI, discussSourcingSession, getSupabaseSuppliers } from "../services/geminiService";
import { speakText, stopSpeaking, getSpeechRecognition } from "../services/speechService";
import type { Supplier } from "../services/supplierData";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../services/supabase";
import { sendSupplierNotification } from "../services/notificationService";
import { ConversationalAssistant } from "../components/ConversationalAssistant";
import { AICallExperience } from "../components/AICallExperience";


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
  const { user, followedSupplierIds, followSupplier } = useAuth();
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [searchResult, setSearchResult] = useState<MatchResult | null>(null);
  const [allSuppliers, setAllSuppliers] = useState<Supplier[]>([]);
  const [selectedSupplierForModal, setSelectedSupplierForModal] = useState<Supplier | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const sups = await getSupabaseSuppliers();
        setAllSuppliers(sups);
      } catch (err) {
        console.error("Error loading suppliers for browse list:", err);
      }
    };
    loadData();
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
  const [showSupplierCards, setShowSupplierCards] = useState(false);

  // Device detection
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkDevice();
    window.addEventListener("resize", checkDevice);
    return () => window.removeEventListener("resize", checkDevice);
  }, []);

  // Saved suppliers IDs list
  const [savedIds, setSavedIds] = useState<string[]>([]);

  // Manual browse / database search states
  const [manualSearch, setManualSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("0");
  const [onlyAvailableToday, setOnlyAvailableToday] = useState(false);
  const [, setVoiceError] = useState("");
  const subtitleContainerRef = React.useRef<HTMLDivElement>(null);

  const speechHook = getSpeechRecognition();

  const [sessionId, setSessionId] = useState<string>("");
  const [conversationLog, setConversationLog] = useState<Array<{ role: "user" | "assistant"; text: string }>>([]);

  // Procurement Assistant states
  const [isMuted, setIsMuted] = useState(false);
  const [isMinimised, setIsMinimised] = useState(false);
  const [isAssistantThinking, setIsAssistantThinking] = useState(false);
  const [isAssistantSpeaking, setIsAssistantSpeaking] = useState(false);
  const [assistantSpeechText, setAssistantSpeechText] = useState("");
  const [assistantVoiceListening, setAssistantVoiceListening] = useState(false);
  const [assistantInputText, setAssistantInputText] = useState("");
  const [buyerSpeechLive, setBuyerSpeechLive] = useState("");


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
    setShowSupplierCards(false);

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
      if (results.bestSupplier && results.bestSupplier.id !== 'mock_assistant' && results.bestSupplier.id !== 'mock_no_match') {
        const bestMatchScore = results.allMatches.find(m => m.supplier.id === results.bestSupplier.id)?.score || 95;
        const cappedScore = bestMatchScore > 100 ? 100 : (bestMatchScore < 0 ? 0 : bestMatchScore);

        if (requestId) {
          const { error: recomError } = await (supabase as any)
            .from('airecommendations')
            .insert({
              request_id: requestId,
              supplier_id: results.bestSupplier.id,
              confidence_score: Number(cappedScore.toFixed(2))
            });

          if (recomError) {
            console.error("Error inserting AI recommendation:", recomError);
          }
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
    // Trigger match notification for the seller
    if (results.bestSupplier) {
      sendSupplierNotification(results.bestSupplier.id, results.aiSummary.requirement);
    }

    setIsVoiceOpen(true);
    setSpokenCharIndex(0);
    setVoiceError("");
    setIsMinimised(false);
    setAssistantSpeechText(results.voiceTranscript);

    // Initialize conversation history and broadcast current call status to Seller Workspace
    const activeSessionId = sessionId || `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
    if (!sessionId) {
      setSessionId(activeSessionId);
    }

    const initialMsg = { role: "assistant" as const, text: results.voiceTranscript };
    const initialHistory = [initialMsg];
    setConversationLog(initialHistory);

    // If mobile, we do NOT run text-to-speech synthesis immediately (incoming call ring state triggers first)
    if (window.innerWidth < 1024) {
      setIsSpeaking(false);
      setIsAssistantSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    setIsAssistantSpeaking(true);

    speakText({
      text: results.voiceTranscript,
      lang: language,
      onBoundary: (charIndex) => {
        setSpokenCharIndex(charIndex);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsAssistantSpeaking(false);

        // Start desktop continuous conversation if unmuted
        if (!isMuted && !isMinimised) {
          startAssistantContinuousSpeech();
        }
      },
      onError: (err: any) => {
        setIsSpeaking(false);
        setIsAssistantSpeaking(false);
        setVoiceError(typeof err === "string" ? err : "Unable to generate AI voice.");
        if (!isMuted && !isMinimised) {
          startAssistantContinuousSpeech();
        }
      }
    });
  };

  const startAssistantContinuousSpeech = () => {
    if (!isVoiceOpen || isMuted || isSpeaking || isAssistantThinking || isAssistantSpeaking || isMinimised) return;

    setAssistantVoiceListening(true);
    setVoiceError("");
    setBuyerSpeechLive("");

    speechHook.start(
      language,
      (result) => {
        setBuyerSpeechLive("");
        handleAssistantSend(result);
      },
      () => {
        setAssistantVoiceListening(false);
        setBuyerSpeechLive("");
        // Automatically cycle back to listen continuously
        setTimeout(() => {
          if (isVoiceOpen && !isMuted && !isSpeaking && !isAssistantThinking && !isAssistantSpeaking && !isMinimised) {
            startAssistantContinuousSpeech();
          }
        }, 600);
      },
      (err) => {
        setAssistantVoiceListening(false);
        setBuyerSpeechLive("");
        console.warn("Continuous browser speech recognition error:", err);
      },
      (interimResult) => {
        setBuyerSpeechLive(interimResult);
      }
    );
  };

  const startAssistantSpeaking = async (text: string) => {
    if (isMuted) return;

    setIsSpeaking(true);
    setIsAssistantSpeaking(true);
    setSpokenCharIndex(0);
    setAssistantSpeechText(text);

    // Turn off listening during speaking
    speechHook.stop();
    setAssistantVoiceListening(false);

    speakText({
      text,
      lang: language,
      onBoundary: (charIndex) => {
        setSpokenCharIndex(charIndex);
      },
      onEnd: () => {
        setIsSpeaking(false);
        setIsAssistantSpeaking(false);
        if (!isMuted && isVoiceOpen && !isMinimised) {
          startAssistantContinuousSpeech();
        }
      },
      onError: (err: any) => {
        setIsSpeaking(false);
        setIsAssistantSpeaking(false);
        setVoiceError(typeof err === "string" ? err : "Unable to play audio.");
        if (!isMuted && isVoiceOpen && !isMinimised) {
          startAssistantContinuousSpeech();
        }
      }
    });
  };

  const handleAssistantSend = async (inputText: string) => {
    if (!inputText.trim() || !searchResult) return;

    // Halt speech synthesizer and listener
    stopSpeaking();
    setIsSpeaking(false);
    setIsAssistantSpeaking(false);
    speechHook.stop();
    setAssistantVoiceListening(false);

    const userMessage = { role: "user" as const, text: inputText };
    const updatedHistory = [...conversationLog, userMessage];
    setConversationLog(updatedHistory);
    setAssistantInputText("");

    // Intercept transitions
    const textLower = inputText.toLowerCase().trim();
    const isConnectIntent = textLower.includes("connect") || textLower.includes("let's go") || textLower.includes("lets go");
    const isShowIntent = 
      textLower.includes("show suppliers") || 
      textLower.includes("show supplier") || 
      textLower.includes("i'm ready") || 
      textLower.includes("im ready") || 
      textLower.includes("i am ready") || 
      textLower.includes("let's proceed") || 
      textLower.includes("lets proceed") || 
      textLower.includes("continue") ||
      textLower.includes("show matching suppliers") ||
      textLower.includes("view suppliers") ||
      textLower.includes("proceed");

    if (isConnectIntent || isShowIntent) {
      const gracefulFinishText = `Great. Based on everything we've discussed, I recommend ${searchResult.bestSupplier.businessName}. I'll now ${isConnectIntent ? 'connect you' : 'show the matching suppliers'}.`;
      
      const assistantMessage = { role: "assistant" as const, text: gracefulFinishText };
      const nextHistory = [...updatedHistory, assistantMessage];
      setConversationLog(nextHistory);

      const performTransition = () => {
        setIsVoiceOpen(false);
        setShowSupplierCards(true);
        if (isConnectIntent) {
          handleConnectSupplier(searchResult.bestSupplier);
        }
      };

      if (isMuted) {
        performTransition();
      } else {
        setIsSpeaking(true);
        setIsAssistantSpeaking(true);
        setSpokenCharIndex(0);
        setAssistantSpeechText(gracefulFinishText);

        speakText({
          text: gracefulFinishText,
          lang: language,
          onBoundary: (charIndex) => {
            setSpokenCharIndex(charIndex);
          },
          onEnd: () => {
            setIsSpeaking(false);
            setIsAssistantSpeaking(false);
            performTransition();
          },
          onError: () => {
            setIsSpeaking(false);
            setIsAssistantSpeaking(false);
            performTransition();
          }
        });
      }
      return;
    }

    setIsAssistantThinking(true);



    try {
      const matchedSuppliersList = searchResult.allMatches.map(m => m.supplier);

      const reply = await discussSourcingSession(
        inputText,
        language,
        searchResult.aiSummary.requirement,
        matchedSuppliersList,
        searchResult.allMatches,
        updatedHistory
      );

      const assistantMessage = { role: "assistant" as const, text: reply };
      const nextHistory = [...updatedHistory, assistantMessage];
      setConversationLog(nextHistory);
      setIsAssistantThinking(false);

      startAssistantSpeaking(reply);
    } catch (err) {
      setIsAssistantThinking(false);
      console.error("Gemini discussion error:", err);
      
      const professionalMsg = "I apologize, but my conversational system is currently experiencing high load. You can proceed directly to view the matching suppliers by clicking 'Show Supplier Cards' below.";
      const errHistory = [...updatedHistory, { role: "assistant" as const, text: professionalMsg }];
      setConversationLog(errHistory);

      startAssistantSpeaking(professionalMsg);
    }
  };


  const handleCloseVoice = () => {
    stopSpeaking();
    setIsSpeaking(false);
    setIsAssistantSpeaking(false);
    setIsAssistantThinking(false);
    setAssistantVoiceListening(false);
    speechHook.stop();
    setIsVoiceOpen(false);
    setConversationLog([]);
    setSessionId("");
  };

  // Hotline Handshake connecting overlay
  const handleConnectSupplier = async (supplier: Supplier) => {
    // 1. Get authenticated buyer
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;
    if (!currentUserId) {
      alert("Please sign in to connect with suppliers.");
      return;
    }

    setConnectedSupplier(supplier);
    setConnectState("connecting");

    const buyerMsg = { role: "user" as const, text: "I want to connect with this supplier." };
    const assistMsg = { role: "assistant" as const, text: `Connecting you now with ${supplier.businessName}.` };
    const updatedHistory = [...conversationLog, buyerMsg, assistMsg];
    setConversationLog(updatedHistory);

    const activeSessionId = sessionId || `sess_${Date.now()}`;
    if (!sessionId) {
      setSessionId(activeSessionId);
    }

    // Determine product ID
    let prodId: string | null = null;
    if (searchResult && searchResult.bestSupplier.id === supplier.id && searchResult.bestProduct) {
      prodId = searchResult.bestProduct.id;
    } else if (supplier.products && supplier.products.length > 0) {
      prodId = supplier.products[0].id;
    }

    try {
      // 2. Insert into buyer_connections
      const { error } = await (supabase as any)
        .from('buyer_connections')
        .insert({
          buyer_id: currentUserId,
          supplier_id: supplier.id,
          product_id: prodId,
          status: 'Active',
          created_at: new Date().toISOString()
        });

      if (error) {
        // If unique constraint violation, ignore (already connected)
        if (error.code === '23505') {
          console.log("Connection already exists between buyer and supplier:", supplier.id);
        } else {
          console.error("Supabase insert connection failed:", error.code, error.message, error.details);
          alert(`Error establishing connection: ${error.message}`);
          setConnectState("idle");
          return;
        }
      }

      setTimeout(() => {
        setConnectState("connected");
      }, 2000);
    } catch (err) {
      console.error("Error establishing connection:", err);
      setConnectState("idle");
    }
  };


  // Follow suppliers helper removed, using context instead

  // manual browse table loaded dynamically from state
  
  const alternativeMatchesGrouped = React.useMemo(() => {
    if (!searchResult || !searchResult.allMatches) return [];
    
    const bestSupplierId = searchResult.bestSupplier.id;
    const groups: Record<string, typeof searchResult.allMatches[0]> = {};
    
    searchResult.allMatches.forEach(match => {
      const supplierId = match.supplier.id;
      if (supplierId === bestSupplierId) return; // skip best match
      
      if (!groups[supplierId] || match.score > groups[supplierId].score) {
        groups[supplierId] = match;
      }
    });
    
    return Object.values(groups).sort((a, b) => b.score - a.score);
  }, [searchResult]);

  const filteredSuppliers = React.useMemo(() => {
    return allSuppliers.filter(sup => {
      const matchesSearch = 
        sup.businessName.toLowerCase().includes(manualSearch.toLowerCase()) ||
        sup.products.some(p => 
          p.name.toLowerCase().includes(manualSearch.toLowerCase()) || 
          p.description.toLowerCase().includes(manualSearch.toLowerCase())
        );
      
      const matchesCategory = selectedCategory === "" || sup.products.some(p => p.category === selectedCategory);
      const matchesLocation = selectedLocation === "" || sup.location.toLowerCase().includes(selectedLocation.toLowerCase());
      const matchesRating = minRating === "0" || sup.rating >= Number(minRating);
      
      const matchesPrice = sup.products.some(p => {
        const matchesMinPrice = minPrice === "" || p.price >= Number(minPrice);
        const matchesMaxPrice = maxPrice === "" || p.price <= Number(maxPrice);
        const matchesCategorySpecific = selectedCategory === "" || p.category === selectedCategory;
        return matchesMinPrice && matchesMaxPrice && matchesCategorySpecific;
      });
      
      const matchesAvailability = !onlyAvailableToday || sup.products.some(p => p.availability === "Immediate");

      return matchesSearch && matchesCategory && matchesLocation && matchesRating && matchesPrice && matchesAvailability;
    }).map(sup => {
      const matchedProds = sup.products.filter(p => {
        const matchesSearch = 
          p.name.toLowerCase().includes(manualSearch.toLowerCase()) || 
          p.description.toLowerCase().includes(manualSearch.toLowerCase()) ||
          sup.businessName.toLowerCase().includes(manualSearch.toLowerCase());
        const matchesCategory = selectedCategory === "" || p.category === selectedCategory;
        const matchesMinPrice = minPrice === "" || p.price >= Number(minPrice);
        const matchesMaxPrice = maxPrice === "" || p.price <= Number(maxPrice);
        const matchesAvailability = !onlyAvailableToday || p.availability === "Immediate";
        
        return matchesSearch && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesAvailability;
      });
      
      return {
        ...sup,
        matchedProducts: matchedProds.length > 0 ? matchedProds : sup.products
      };
    });
  }, [allSuppliers, manualSearch, selectedCategory, selectedLocation, minPrice, maxPrice, minRating, onlyAvailableToday]);

  // Render ChatGPT styled Word Highlights
  const renderHighlightedTranscript = () => {
    if (!searchResult) return null;
    const text = assistantSpeechText || searchResult.voiceTranscript;
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
          showSupplierCards ? (
            <div className="space-y-8 animate-fade-in-up">
              
              {/* AI Assistant Reopen Banner */}
              <div className="rounded-2xl border border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5 p-4.5 flex flex-col sm:flex-row justify-between items-center gap-4.5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary flex-shrink-0 animate-pulse">
                    <Bot className="h-5 w-5" />
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-sm text-app-text">Need help evaluating these suppliers?</h4>
                    <p className="text-xs text-app-text-secondary">Ask the AI Procurement Assistant to compare pricing, check stock levels, or draft negotiations.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsVoiceOpen(true);
                    setIsMinimised(false);
                    if (!isMuted) {
                      startAssistantContinuousSpeech();
                    }
                  }}
                  className="flex items-center gap-2 rounded-xl bg-primary hover:opacity-90 text-white px-4 py-2.5 text-xs font-bold shadow cursor-pointer transition-all shrink-0"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Discuss Sourcing Session</span>
                </button>
              </div>
            
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
                        onClick={() => setSelectedSupplierForModal(searchResult.bestSupplier)}
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
            {alternativeMatchesGrouped.length > 0 && (
              <div>
                <h4 className="text-sm font-bold text-app-text-secondary uppercase tracking-wider mb-3">Other Sourced Options (Grouped by Supplier)</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {alternativeMatchesGrouped.slice(0, 2).map((match, idx) => (
                    <div key={idx} className="border border-app-border rounded-xl p-4 bg-app-card flex justify-between items-center gap-4">
                      <div>
                        <strong className="text-sm font-bold text-app-text block">{match.supplier.businessName}</strong>
                        <span className="text-xs text-app-text-secondary block mt-0.5">{match.product.name}</span>
                        <div className="flex items-center gap-3 mt-2 text-xs font-semibold">
                          <span className="text-primary font-bold">₹{match.product.price} / {match.product.unit}</span>
                          <span className="text-app-text-secondary flex items-center gap-0.5"><Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" /> {match.supplier.rating}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedSupplierForModal(match.supplier)}
                          className="rounded-lg border border-app-border bg-app-card hover:bg-app-card-hover text-app-text py-1.5 px-3 text-xs font-semibold cursor-pointer"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleConnectSupplier(match.supplier)}
                          className="rounded-lg bg-primary text-white py-1.5 px-3 text-xs font-bold hover:opacity-90 cursor-pointer"
                        >
                          Connect
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            </div>
          ) : (
            /* Glassmorphic Placeholder while AI is explaining */
            <div className="rounded-2xl border border-white/20 dark:border-slate-800/80 bg-white/50 dark:bg-slate-900/50 p-8 shadow-premium text-center space-y-5 backdrop-blur-md animate-fade-in-up">
              <div className="h-14 w-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto animate-pulse">
                <Bot className="h-7 w-7" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-lg font-bold text-app-text">Evaluating Sourcing Recommendations</h3>
                <p className="text-xs text-app-text-secondary">
                  The Conversational AI Procurement Assistant is explaining the best supplier matching results. You can discuss pricing, proximity, and delivery constraints.
                </p>
              </div>
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowSupplierCards(true);
                    setIsVoiceOpen(false);
                  }}
                  className="rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text px-5 py-2.5 text-xs font-bold transition-all shadow-sm cursor-pointer"
                >
                  Show Supplier Cards
                </button>
              </div>
            </div>
          )
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
            {filteredSuppliers.map((sup, idx) => {
              const mainProd = sup.matchedProducts[0] || sup.products[0];
              const hasMoreProducts = sup.products.length > 1;
              return (
                <div 
                  key={idx}
                  className="rounded-xl border border-app-border bg-app-card p-4.5 shadow-sm hover:shadow transition-all duration-200 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <strong className="text-sm font-bold text-app-text block">{sup.businessName}</strong>
                        {mainProd && (
                          <span className="text-xs text-app-text-secondary font-medium block mt-0.5">{mainProd.name}</span>
                        )}
                        {hasMoreProducts && (
                          <span className="inline-block mt-1 text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded font-bold">
                            + {sup.products.length - 1} other product{sup.products.length > 2 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <span className="flex items-center gap-0.5 text-xs font-semibold text-app-text bg-app-bg px-2 py-0.5 border border-app-border rounded">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {sup.rating || 4.5}
                      </span>
                    </div>

                    {mainProd && (
                      <div className="border-t border-app-border/40 my-3 pt-3 space-y-1.5 text-xs text-app-text-secondary">
                        <div className="flex justify-between">
                          <span>Pricing:</span>
                          <strong className="text-primary font-bold">₹{mainProd.price} / {mainProd.unit}</strong>
                        </div>
                        <div className="flex justify-between">
                          <span>Available Stock:</span>
                          <span className="font-semibold text-app-text">{mainProd.quantityAvailable} {mainProd.unit}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Location:</span>
                          <span className="font-medium text-app-text flex items-center gap-0.5"><MapPin className="h-3.5 w-3.5 text-primary" /> {sup.location}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Availability:</span>
                          <span className={`font-semibold ${mainProd.availability === "Immediate" ? 'text-success' : 'text-app-text-secondary'}`}>
                            {mainProd.availability}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-2 mt-2 border-t border-app-border/40">
                    <button
                      onClick={() => setSelectedSupplierForModal(sup)}
                      className="rounded-lg border border-app-border bg-app-card hover:bg-app-card-hover text-app-text py-1.5 text-xs font-semibold cursor-pointer"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleConnectSupplier(sup)}
                      className="rounded-lg bg-primary text-white py-1.5 text-xs font-semibold hover:opacity-90 cursor-pointer"
                    >
                      Connect
                    </button>
                    <button
                      onClick={() => {
                        console.log("Follow clicked", sup.id);
                        followSupplier(sup.id);
                      }}
                      disabled={followedSupplierIds.includes(sup.id)}
                      className={`rounded-lg py-1.5 text-xs font-semibold border transition-colors ${
                        followedSupplierIds.includes(sup.id)
                          ? "bg-primary/10 border-primary text-primary opacity-80 cursor-not-allowed"
                          : "border-app-border bg-app-card text-app-text hover:bg-app-card-hover cursor-pointer"
                      }`}
                    >
                      {followedSupplierIds.includes(sup.id) ? "Following" : "Follow"}
                    </button>
                  </div>
                </div>
              );
            })}

            {filteredSuppliers.length === 0 && (
              <p className="col-span-2 text-center text-sm text-app-text-secondary py-12 italic border border-dashed border-app-border rounded-xl">
                No matching suppliers found in manual directory search.
              </p>
            )}
          </div>
        </div>

      </div>

      {/* Floating Center AI Assistant (ChatGPT Voice Style Overlay) */}
      {/* Minimised Assistant Pill Trigger */}
      {isVoiceOpen && searchResult && isMinimised && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in-up">
          <button
            onClick={() => {
              setIsMinimised(false);
              // Restart continuous voice interaction if unmuted
              if (!isMuted) {
                startAssistantContinuousSpeech();
              }
            }}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary text-white px-5 py-3 shadow-premium-lg hover:opacity-95 cursor-pointer font-bold text-xs border border-white/20"
          >
            <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
            <span>🤖 Resume AI Assistant</span>
          </button>
        </div>
      )}

      {/* Floating Center AI Assistant (ChatGPT Voice Style Immersive Overlay) */}
      {/* Floating Center AI Assistant (Immersive Overlay) */}
      {isVoiceOpen && searchResult && !isMinimised && (
        isMobile ? (
          <AICallExperience
            searchResult={searchResult}
            language={language}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            isSpeaking={isSpeaking}
            isAssistantSpeaking={isAssistantSpeaking}
            isAssistantThinking={isAssistantThinking}
            assistantVoiceListening={assistantVoiceListening}
            buyerSpeechLive={buyerSpeechLive}
            conversationLog={conversationLog}
            handleAssistantSend={handleAssistantSend}
            handleCloseVoice={handleCloseVoice}
            renderHighlightedTranscript={renderHighlightedTranscript}
            subtitleContainerRef={subtitleContainerRef}
            startAssistantSpeaking={startAssistantSpeaking}
            startAssistantContinuousSpeech={startAssistantContinuousSpeech}
          />
        ) : (
          <ConversationalAssistant
            searchResult={searchResult}
            language={language}
            isMuted={isMuted}
            setIsMuted={setIsMuted}
            isMinimised={isMinimised}
            setIsMinimised={setIsMinimised}
            isSpeaking={isSpeaking}
            isAssistantSpeaking={isAssistantSpeaking}
            isAssistantThinking={isAssistantThinking}
            assistantVoiceListening={assistantVoiceListening}
            assistantSpeechText={assistantSpeechText}
            buyerSpeechLive={buyerSpeechLive}
            conversationLog={conversationLog}
            assistantInputText={assistantInputText}
            setAssistantInputText={setAssistantInputText}
            handleAssistantSend={handleAssistantSend}
            handleCloseVoice={handleCloseVoice}
            handleConnectSupplier={handleConnectSupplier}
            renderHighlightedTranscript={renderHighlightedTranscript}
            subtitleContainerRef={subtitleContainerRef}
            startAssistantContinuousSpeech={startAssistantContinuousSpeech}
          />
        )
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

      {/* Supplier Details Modal */}
      {selectedSupplierForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-2xl rounded-2xl border border-app-border bg-app-card shadow-premium-lg animate-fade-in-up m-4 overflow-hidden">
            
            {/* Modal Header */}
            <div className="border-b border-app-border p-5 flex justify-between items-center bg-gradient-to-r from-primary/5 to-secondary/5">
              <div>
                <h3 className="text-xl font-extrabold text-app-text">{selectedSupplierForModal.businessName}</h3>
                <p className="text-xs text-app-text-secondary mt-1 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{selectedSupplierForModal.location}</span>
                </p>
              </div>
              <button 
                onClick={() => setSelectedSupplierForModal(null)}
                className="p-1 rounded-lg hover:bg-app-bg text-app-text-secondary hover:text-app-text cursor-pointer transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              
              {/* Trust & Rating Badges */}
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl border border-app-border bg-app-bg/50 p-3.5 text-center">
                  <span className="text-[10px] font-bold text-app-text-secondary uppercase block">Supplier Rating</span>
                  <div className="flex items-center justify-center gap-1 mt-1 text-base font-extrabold text-app-text">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span>{selectedSupplierForModal.rating} / 5.0</span>
                  </div>
                </div>
                <div className="rounded-xl border border-app-border bg-app-bg/50 p-3.5 text-center">
                  <span className="text-[10px] font-bold text-app-text-secondary uppercase block">Trust Confidence Score</span>
                  <span className="text-lg font-extrabold text-success mt-1 block">{selectedSupplierForModal.trustScore}%</span>
                </div>
              </div>

              {/* Business Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <span className="font-bold text-app-text-secondary uppercase">Contact Representative</span>
                  <p className="text-app-text font-semibold">{selectedSupplierForModal.contactNumber || "+91 90001 88001"}</p>
                </div>
                <div className="space-y-1">
                  <span className="font-bold text-app-text-secondary uppercase">Business Operating Hours</span>
                  <p className="text-app-text font-semibold">{selectedSupplierForModal.businessHours || "09:00 AM - 06:00 PM"}</p>
                </div>
              </div>

              {/* Products Catalog List */}
              <div className="space-y-3.5">
                <h4 className="text-xs font-bold text-app-text-secondary uppercase tracking-wider">Catalog of Products</h4>
                
                <div className="space-y-3">
                  {selectedSupplierForModal.products && selectedSupplierForModal.products.length > 0 ? (
                    selectedSupplierForModal.products.map((p, idx) => (
                      <div key={idx} className="border border-app-border rounded-xl p-4 bg-app-bg/30 hover:bg-app-bg/50 transition-colors flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div className="space-y-1.5 max-w-md">
                          <strong className="text-sm font-bold text-app-text block">{p.name}</strong>
                          <p className="text-xs text-app-text-secondary leading-normal">{p.description}</p>
                          <div className="flex flex-wrap gap-3 text-[10px] font-semibold text-app-text-secondary">
                            <span className="rounded bg-secondary/10 text-secondary border border-secondary/20 px-2 py-0.5">Grade: {p.qualityGrade}</span>
                            <span>•</span>
                            <span>Stock: {p.quantityAvailable} {p.unit}</span>
                            <span>•</span>
                            <span className={p.availability === "Immediate" ? "text-success" : ""}>{p.availability}</span>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-[10px] font-bold text-app-text-secondary block">Price Offer</span>
                          <strong className="text-base font-extrabold text-primary block mt-0.5">₹{p.price} / {p.unit}</strong>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-xs text-app-text-secondary italic py-6">No products registered under this supplier.</p>
                  )}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="border-t border-app-border p-4 bg-app-bg/40 flex justify-end gap-3.5">
              <button
                onClick={() => setSelectedSupplierForModal(null)}
                className="rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover text-app-text py-2.5 px-5 text-xs font-bold cursor-pointer"
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleConnectSupplier(selectedSupplierForModal);
                  setSelectedSupplierForModal(null);
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white py-2.5 px-5 text-xs font-bold shadow hover:opacity-95 cursor-pointer"
              >
                <PhoneCall className="h-4 w-4" />
                <span>Connect Supplier</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
