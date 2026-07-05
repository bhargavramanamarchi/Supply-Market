import type { Supplier, Product } from "./supplierData";
import { getStoredSuppliers } from "./supplierData";

export interface MatchResult {
  bestSupplier: Supplier;
  bestProduct: Product;
  matchingReason: string;
  voiceTranscript: string;
  allMatches: Array<{
    supplier: Supplier;
    product: Product;
    score: number;
    reason: string;
  }>;
  priceComparison: Array<{
    supplierName: string;
    productName: string;
    price: number;
    unit: string;
    quality: string;
  }>;
  aiSummary: {
    requirement: string;
    selectedSupplier: string;
    price: string;
    quantity: string;
    location: string;
    matchingReason: string;
    recommendation: string;
    nextAction: string;
  };
}

export interface SellerInsights {
  mostRequestedProducts: Array<{ name: string; count: number; category: string }>;
  demandTrends: Array<{ month: string; demandIndex: number; product: string }>;
  suggestedPricing: Array<{ product: string; current: number; suggested: number; reason: string }>;
  inventoryRecommendations: Array<{ product: string; currentStock: number; recommendation: string }>;
  weeklyPerformance: Array<{ day: string; views: number; inquiries: number; conversions: number }>;
}

const KEYWORD_MAP: Record<string, string[]> = {
  "Rice": ["rice", "basmati", "grain", "raw rice", "sona masoori", "paddy"],
  "Turmeric": ["turmeric", "haldi", "curcumin", "spice", "organic turmeric", "finger"],
  "Wood": ["wood", "timber", "teak", "plywood", "rosewood", "mahogany", "plank", "lumber", "furniture"],
  "Steel": ["steel", "tmt", "rebar", "pipe", "metal", "reinforcement", "iron", "bar"],
  "Cement": ["cement", "opc", "ppc", "concrete", "bag", "cement bag", "construction", "roofing"],
  "Packaging": ["packaging", "box", "bubble wrap", "roll", "carton", "cling film", "stretch wrap", "kraft"],
  "Cotton": ["cotton", "fiber", "bale", "spinning", "yarn", "fabric", "textile"],
  "Electronics": ["electronics", "mcu", "arduino", "wire", "connector", "jumper", "pcb", "board", "microcontroller"]
};

// 6-Language Sourcing Templates Matrix
const TRANSLATION_MATRIX: Record<string, Record<string, {
  voice: string;
  reason: string;
  recom: string;
  next: string;
}>> = {
  "English": {
    "default": {
      voice: "Hello. I found the best supplier for your requirement. {Supplier} has Premium {Product} available for ₹{Price} per {Unit}. They currently have enough stock to fulfill your request. Would you like to connect with this supplier?",
      reason: "{Supplier} has enough stock ({Stock} {Unit} available), offers a competitive price of ₹{Price}/{Unit}, and is located in {Location} for fast logistics.",
      recom: "We suggest connecting with {Supplier} immediately. Their pricing is competitive and they have verified stock.",
      next: "Click the 'Connect Supplier' hotkey below to establish a direct phone bridge."
    }
  },
  "Telugu": {
    "default": {
      voice: "నమస్కారం. మీ అవసరానికి సరిపోయే ఉత్తమ సరఫరాదారుని నేను కనుగొన్నాను. {Supplier} వద్ద కిలో ₹{Price} ధరకే ప్రీమియం {Product} అందుబాటులో ఉంది. ప్రస్తుతం వారి వద్ద తగినంత స్టాక్ ఉంది. మీరు ఈ సరఫరాదారుని సంప్రదించాలనుకుంటున్నారా?",
      reason: "{Supplier} వద్ద తగినంత స్టాక్ ({Stock} {Unit} అందుబాటులో ఉంది) మరియు కిలో ₹{Price} చొప్పున చాలా తక్కువ ధరకే లభిస్తోంది. వీరు వేగంగా పంపడానికి {Location} లోనే ఉన్నారు.",
      recom: "మీరు వెంటనే {Supplier} వారిని సంప్రదించాలని మేము సూచిస్తున్నాము. వారి ధరలు చాలా అనుకూలంగా ఉన్నాయి.",
      next: "నేరుగా ఫోన్ సంప్రదింపులను ప్రారంభించడానికి కింద ఉన్న 'Connect Supplier' బటన్ పై క్లిక్ చేయండి."
    }
  },
  "Hindi": {
    "default": {
      voice: "नमस्ते। मुझे आपकी आवश्यकता के लिए सबसे अच्छा आपूर्तिकर्ता मिला है। {Supplier} के पास ₹{Price} प्रति {Unit} पर प्रीमियम {Product} उपलब्ध है। वर्तमान में उनके पास पर्याप्त स्टॉक है। क्या आप इस आपूर्तिकर्ता से संपर्क करना चाहेंगे?",
      reason: "{Supplier} के पास पर्याप्त स्टॉक ({Stock} {Unit}) उपलब्ध है, ₹{Price} की प्रतिस्पर्धी दर है और वे त्वरित शिपिंग के लिए {Location} में स्थित हैं।",
      recom: "हमारा सुझाव है कि आप तुरंत {Supplier} से संपर्क करें। उनके दाम काफी प्रतिस्पर्धी हैं और वे सीधे डिलीवरी दे सकते हैं।",
      next: "सीधा फोन कनेक्शन शुरू करने के लिए नीचे दिए गए 'Connect Supplier' बटन पर क्लिक करें।"
    }
  },
  "Tamil": {
    "default": {
      voice: "வணக்கம். உங்கள் தேவைக்கேற்ற சிறந்த சப்ளையரை நான் கண்டுபிடித்துள்ளேன். {Supplier} நிறுவனத்திடம் ஒரு {Unit} ₹{Price} விலையில் பிரீமியம் {Product} கிடைக்கிறது. தற்போது அவர்களிடம் தேவையான அளவு இருப்பு உள்ளது. இந்த சப்ளையரை நீங்கள் தொடர்பு கொள்ள விரும்புகிறீர்களா?",
      reason: "{Supplier} நிறுவனத்திடம் போதுமான இருப்பு ({Stock} {Unit}) உள்ளது, ₹{Price} என்ற சிறந்த போட்டி விலையில் தருகிறார்கள், மேலும் விரைவாக அனுப்ப {Location} பகுதியிலேயே உள்ளனர்.",
      recom: "நீங்கள் உடனடியாக {Supplier} நிறுவனத்தை தொடர்பு கொள்ளுமாறு பரிந்துரைக்கிறோம். அவர்களின் விலை மிகவும் மலிவானது.",
      next: "நேரடி தொலைபேசி தொடர்பை ஏற்படுத்த கீழே உள்ள 'Connect Supplier' பொத்தானை கிளிக் செய்யவும்."
    }
  },
  "Kannada": {
    "default": {
      voice: "ನಮಸ್ಕಾರ. ನಿಮ್ಮ ಅವಶ್ಯಕತೆಗೆ ಸೂಕ್ತವಾದ ಉತ್ತಮ ಸರಬರಾಜುದಾರರನ್ನು ನಾನು ಕಂಡುಕೊಂಡಿದ್ದೇನೆ. {Supplier} ಬಳಿ ಪ್ರತಿ {Unit} ಗೆ ₹{Price} ದರದಲ್ಲಿ ಪ್ರೀಮಿಯಂ {Product} ಲಭ್ಯವಿದೆ. ಅವರ ಬಳಿ ಸದ್ಯಕ್ಕೆ ಸಾಕಷ್ಟು ಸ್ಟಾಕ್ ಇದೆ. ನೀವು ಈ ಸರಬರಾಜುದಾರರೊಂದಿಗೆ ಸಂಪರ್ಕ ಹೊಂದಲು ಬಯಸುವಿರಾ?",
      reason: "{Supplier} ಬಳಿ ಸಾಕಷ್ಟು ಸ್ಟಾಕ್ ({Stock} {Unit} ಲಭ್ಯವಿದೆ), ₹{Price} ನ ಉತ್ತಮ ದರವಿದೆ ಮತ್ತು ಶೀಘ್ರವಾಗಿ ತಲುಪಿಸಲು ಅವರು {Location} ನಲ್ಲೇ ಇದ್ದಾರೆ.",
      recom: "ನೀವು ತಕ್ಷಣ {Supplier} ಸರಬರಾಜುದಾರರನ್ನು ಸಂಪರ್ಕಿಸಲು ನಾವು ಶಿಫಾರಸು ಮಾಡುತ್ತೇವೆ. ಅವರ ಬೆಲೆಗಳು ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಅತ್ಯುತ್ತಮವಾಗಿವೆ.",
      next: "ನೇರ ಫೋನ್ ಸಂಪರ್ಕವನ್ನು ಪ್ರಾರಂಭಿಸಲು ಕೆಳಗಿನ 'Connect Supplier' ಬಟನ್ ಕ್ಲಿಕ್ ಮಾಡಿ."
    }
  },
  "Malayalam": {
    "default": {
      voice: "നമസ്കാരം. നിങ്ങളുടെ ആവശ്യത്തിന് ഏറ്റവും അനുയോജ്യമായ വിതരണക്കാരനെ ഞാൻ കണ്ടെത്തിയിട്ടുണ്ട്. {Supplier} പക്കൽ {Unit} ന് ₹{Price} നിരക്കിൽ പ്രീമിയം {Product} ലഭ്യമാണ്. നിലവിൽ അവരുടെ പക്കൽ ആവശ്യത്തിന് സ്റ്റോക്കുണ്ട്. ഈ വിതരണക്കാരനുമായി ബന്ധപ്പെടാൻ നിങ്ങൾക്ക് താല്പര്യമുണ്ടോ?",
      reason: "{Supplier} പക്കൽ ആവശ്യത്തിന് സ്റ്റോക്കുണ്ട് ({Stock} {Unit} ലഭ്യമാണ്), ₹{Price} എന്ന മികച്ച നിരക്കാണ് നൽകുന്നത്, കൂടാതെ വേഗത്തിൽ അയക്കാൻ അവർ {Location} ലാണ് സ്ഥിതി ചെയ്യുന്നത്.",
      recom: "നിങ്ങൾ ഉടൻ തന്നെ {Supplier} മായി ബന്ധപ്പെടാൻ ഞങ്ങൾ നിർദ്ദേശിക്കുന്നു. അവരുടെ നിരക്കുകൾ വിപണിയിൽ വളരെ മത്സരക്ഷമതയുള്ളതാണ്.",
      next: "നേരിട്ടുള്ള ഫോൺ കോൾ ആരംഭിക്കുന്നതിന് താഴെയുള്ള 'Connect Supplier' ബട്ടണിൽ ക്ലിക്ക് ചെയ്യുക."
    }
  }
};

export const matchSuppliersAI = async (query: string, lang: string = "English"): Promise<MatchResult> => {
  // Simulate network/API delay for a premium matching progress feel
  await new Promise((resolve) => setTimeout(resolve, 2200));

  const suppliers = getStoredSuppliers();
  const normalizedQuery = query.toLowerCase();

  // 1. Identify category based on keywords
  let detectedCategory = "";
  let maxKeywordHits = 0;

  Object.entries(KEYWORD_MAP).forEach(([category, keywords]) => {
    let hits = 0;
    keywords.forEach(kw => {
      if (normalizedQuery.includes(kw)) {
        hits += 1.5;
        // extra points for direct matches of specific product words
        if (kw === "turmeric" && normalizedQuery.includes("turmeric")) hits += 3;
        if (kw === "rice" && normalizedQuery.includes("rice")) hits += 3;
        if (kw === "steel" && normalizedQuery.includes("steel")) hits += 3;
        if (kw === "cement" && normalizedQuery.includes("cement")) hits += 3;
      }
    });
    if (hits > maxKeywordHits) {
      maxKeywordHits = hits;
      detectedCategory = category;
    }
  });

  // Default fallback if no category matches
  if (!detectedCategory) {
    throw new Error(
      "Sorry, I couldn't understand which product you are looking for."
    );
  }

  // 2. Parse quantity from text
  let targetQuantity = 1;
  const qtyMatch = normalizedQuery.match(/(\d+)\s*(kg|bags?|tons?|pieces?|litres?|boxes?|packs?|bales?|rolls?)?/);
  if (qtyMatch) {
    targetQuantity = parseInt(qtyMatch[1], 10);
  }

  const matches: Array<{
    supplier: Supplier;
    product: Product;
    score: number;
    reason: string;
  }> = [];

  // 3. Score each product
  suppliers.forEach(supplier => {
    supplier.products.forEach(product => {

      if (product.category !== detectedCategory) {
        return;
      }
      let score = 0;
      let matchReasons: string[] = [];

      const prodName = product.name.toLowerCase();

      // Check direct product name match
      let directHit = false;
      const queryWords = normalizedQuery.split(/\s+/);
      queryWords.forEach(word => {
        if (word.length > 2 && prodName.includes(word)) {
          score += 25;
          directHit = true;
        }
      });

      if (product.category === detectedCategory) {
        score += 25;
        matchReasons.push("Matches requested product type");
      }

      if (directHit) {
        matchReasons.push("Matches exact items");
      }

      // Quantity check
      if (product.quantityAvailable >= targetQuantity) {
        score += 15;
        matchReasons.push("Has plenty of stock");
      } else {
        score -= 20;
        matchReasons.push("Low on stock for requested quantity");
      }

      // Quality grade
      if (product.qualityGrade.includes("Premium") || product.qualityGrade.includes("Superfine")) {
        score += 10;
        matchReasons.push("Certified premium quality");
      }

      // Supplier trust
      score += (supplier.trustScore - 90) * 0.5;
      if (supplier.trustScore >= 95) {
        matchReasons.push("Highly rated supplier");
      }

      matches.push({
        supplier,
        product,
        score,
        reason: matchReasons.slice(0, 3).join(", ")
      });
    });
  });

  // Sort matches by score descending
  matches.sort((a, b) => b.score - a.score);

  const bestMatch = matches[0] || {
    supplier: suppliers[0],
    product: suppliers[0].products[0],
    score: 100,
    reason: "Direct inventory match and verified high trust supplier status."
  };

  const bestSupplier = bestMatch.supplier;
  const bestProduct = bestMatch.product;

  // Build price comparison details
  const categoryProducts = suppliers
    .flatMap(s => s.products.map(p => ({ supplierName: s.businessName, ...p })))
    .filter(p => p.category === bestProduct.category && p.id !== bestProduct.id)
    .slice(0, 2);

  const priceComparison = [
    {
      supplierName: bestSupplier.businessName,
      productName: bestProduct.name,
      price: bestProduct.price,
      unit: bestProduct.unit,
      quality: bestProduct.qualityGrade
    },
    ...categoryProducts.map(p => ({
      supplierName: p.supplierName,
      productName: p.name,
      price: p.price,
      unit: p.unit,
      quality: p.qualityGrade
    }))
  ];

  // Resolve translation templates based on selected language
  const activeLang = TRANSLATION_MATRIX[lang] ? lang : "English";
  const templates = TRANSLATION_MATRIX[activeLang]["default"];

  // Utility to replace placeholders
  const formatTemplate = (template: string) => {
    return template
      .replace(/{Supplier}/g, bestSupplier.businessName)
      .replace(/{Product}/g, bestProduct.category)
      .replace(/{Price}/g, bestProduct.price.toString())
      .replace(/{Unit}/g, bestProduct.unit)
      .replace(/{Stock}/g, bestProduct.quantityAvailable.toString())
      .replace(/{Location}/g, bestSupplier.location.split(",")[0]);
  };

  const voiceTranscript = formatTemplate(templates.voice);
  const matchingReason = formatTemplate(templates.reason);
  const recommendation = formatTemplate(templates.recom);
  const nextAction = formatTemplate(templates.next);

  const aiSummary = {
    requirement: query,
    selectedSupplier: bestSupplier.businessName,
    price: `₹${bestProduct.price} / ${bestProduct.unit}`,
    quantity: `${targetQuantity} ${bestProduct.unit}`,
    location: bestSupplier.location,
    matchingReason: matchingReason,
    recommendation: recommendation,
    nextAction: nextAction
  };

  return {
    bestSupplier,
    bestProduct,
    matchingReason,
    voiceTranscript,
    allMatches: matches.slice(0, 5),
    priceComparison,
    aiSummary
  };
};

export const getSellerInsights = (businessName: string): SellerInsights => {
  const hash = businessName.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const weeklyPerformance = [
    { day: "Mon", views: 98 + (hash % 15), inquiries: 8 + (hash % 3), conversions: 2 + (hash % 2) },
    { day: "Tue", views: 110 + (hash % 12), inquiries: 11 + (hash % 2), conversions: 3 + (hash % 1) },
    { day: "Wed", views: 125 + (hash % 18), inquiries: 14 + (hash % 4), conversions: 5 + (hash % 2) },
    { day: "Thu", views: 105 + (hash % 10), inquiries: 9 + (hash % 2), conversions: 2 + (hash % 1) },
    { day: "Fri", views: 140 + (hash % 20), inquiries: 19 + (hash % 5), conversions: 7 + (hash % 3) },
    { day: "Sat", views: 70 + (hash % 8), inquiries: 5 + (hash % 2), conversions: 1 + (hash % 1) },
    { day: "Sun", views: 40 + (hash % 5), inquiries: 2 + (hash % 1), conversions: 0 + (hash % 1) }
  ];

  const mostRequestedProducts = [
    { name: "Premium Turmeric Powder", count: 720, category: "Turmeric" },
    { name: "Sona Masoori Rice", count: 680, category: "Rice" },
    { name: "Shankar-6 Cotton Fibers", count: 480, category: "Cotton" }
  ];

  const demandTrends = [
    { month: "Jan", demandIndex: 70, product: "Turmeric" },
    { month: "Feb", demandIndex: 75, product: "Turmeric" },
    { month: "Mar", demandIndex: 90, product: "Turmeric" },
    { month: "Apr", demandIndex: 115, product: "Turmeric" },
    { month: "May", demandIndex: 130, product: "Turmeric" },
    { month: "Jun", demandIndex: 140, product: "Turmeric" }
  ];

  const suggestedPricing = [
    { product: "Premium Turmeric Powder", current: 120, suggested: 125, reason: "Your turmeric is searched frequently. Consider increasing stock or price slightly." },
    { product: "Superfine Basmati Rice", current: 95, suggested: 98, reason: "Demand has grown in South India sectors. Competitive buffer is supported." }
  ];

  const inventoryRecommendations = [
    { product: "Premium Turmeric Powder", currentStock: 8500, recommendation: "Turmeric searches are very high this week. We recommend adding 2,000kg to maintain buffer." },
    { product: "Superfine Basmati Rice", currentStock: 12000, recommendation: "Optimal stock levels. Keep sales velocities as is." }
  ];

  return {
    mostRequestedProducts,
    demandTrends,
    suggestedPricing,
    inventoryRecommendations,
    weeklyPerformance
  };
};
