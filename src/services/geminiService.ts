import type { Supplier, Product } from "./supplierData";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { supabase } from "./supabase";

export const getSupabaseSuppliers = async (): Promise<Supplier[]> => {
  try {
    let dbSuppliers;
    let supError;

    // Try ordering by created_at first
    const result = await (supabase as any)
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false });

    dbSuppliers = result.data;
    supError = result.error;

    // If sorting by created_at fails (e.g., column does not exist on live DB), fall back to id
    if (supError) {
      console.warn("Sorting by created_at failed, falling back to id ordering. Error details:", supError.message);

      const fallbackResult = await (supabase as any)
        .from('suppliers')
        .select('*')
        .order('id', { ascending: false });

      dbSuppliers = fallbackResult.data;
      supError = fallbackResult.error;
    }

    if (supError) {
      console.error(
        "Supplier fetch failed:",
        supError.code,
        supError.message,
        supError.details
      );
      throw supError;
    }

    let dbProducts = null;
    let prodError = null;

    try {
      const prodResult = await (supabase as any)
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      dbProducts = prodResult.data;
      prodError = prodResult.error;
    } catch (err: any) {
      prodError = err;
    }

    if (prodError) {
      console.error("Products query failed!");
      console.error("error.code:", prodError.code);
      console.error("error.message:", prodError.message);
      console.error("error.details:", prodError.details);
      console.error("error.hint:", prodError.hint);

      // Fallback: If created_at is missing, order by id DESC
      const isCreatedAtMissing = prodError.code === '42703' || prodError.message?.includes('created_at');
      if (isCreatedAtMissing) {
        console.log("created_at column missing on products table, falling back to id sorting...");
        const fallbackResult = await (supabase as any)
          .from('products')
          .select('*')
          .order('id', { ascending: false });

        dbProducts = fallbackResult.data;
        prodError = fallbackResult.error;

        if (prodError) {
          console.error("Fallback products query failed!");
          console.error("error.code:", prodError.code);
          console.error("error.message:", prodError.message);
          console.error("error.details:", prodError.details);
          console.error("error.hint:", prodError.hint);
        }
      }
    }

    if (prodError || !dbProducts) {
      console.error("Failed to load products, using empty list to prevent crash.");
      dbProducts = [];
    }

    const supplierMap = new Map<string, Supplier>();
    const orderedSuppliers: Supplier[] = [];

    // First map all suppliers to their properties for easy lookup
    const allSuppliersMap = new Map<string, any>();
    (dbSuppliers || []).forEach((sup: any) => {
      allSuppliersMap.set(sup.id, sup);
    });

    // Group products by supplier, preserving the product order (which is sorted by created_at DESC or id DESC)
    const supplierProductsMap = new Map<string, any[]>();
    dbProducts.forEach((p: any) => {
      const list = supplierProductsMap.get(p.supplier_id) || [];
      list.push(p);
      supplierProductsMap.set(p.supplier_id, list);
    });

    // Now, iterate through the sorted products to order the suppliers
    dbProducts.forEach((p: any) => {
      const sup = allSuppliersMap.get(p.supplier_id);
      if (sup && !supplierMap.has(sup.id)) {
        const rawProds = supplierProductsMap.get(sup.id) || [];
        const products = rawProds.map((prod: any) => ({
          id: prod.id,
          name: prod.product_name,
          category: prod.category,
          description: prod.description || '',
          price: Number(prod.price),
          unit: prod.unit,
          quantityAvailable: Number(prod.quantity),
          qualityGrade: (prod.product_name.toLowerCase().includes('basmati') ? 'Superfine' :
            prod.product_name.toLowerCase().includes('tmt') ? 'High Grade' :
              prod.product_name.toLowerCase().includes('uno') ? 'High Grade' :
                prod.product_name.toLowerCase().includes('shipping') ? 'Standard' : 'Premium') as any,
          location: sup.location,
          businessName: sup.company_name,
          contactNumber: sup.contact_number || '',
          availability: prod.available ? "Immediate" : "Within 2 days",
          businessHours: sup.business_hours || '09:00 AM - 06:00 PM'
        }));

        const supplierInfo: Supplier = {
          id: sup.id,
          businessName: sup.company_name,
          rating: Number(sup.rating),
          trustScore: sup.trust_score ? Number(sup.trust_score) : 95,
          location: sup.location,
          contactNumber: sup.contact_number || '',
          businessHours: sup.business_hours || '09:00 AM - 06:00 PM',
          products
        };

        supplierMap.set(sup.id, supplierInfo);
        orderedSuppliers.push(supplierInfo);
      }
    });

    // Append any suppliers who don't have any products at the end
    (dbSuppliers || []).forEach((sup: any) => {
      if (!supplierMap.has(sup.id)) {
        const supplierInfo: Supplier = {
          id: sup.id,
          businessName: sup.company_name,
          rating: Number(sup.rating),
          trustScore: sup.trust_score ? Number(sup.trust_score) : 95,
          location: sup.location,
          contactNumber: sup.contact_number || '',
          businessHours: sup.business_hours || '09:00 AM - 06:00 PM',
          products: []
        };
        supplierMap.set(sup.id, supplierInfo);
        orderedSuppliers.push(supplierInfo);
      }
    });

    return orderedSuppliers;
  } catch (err) {
    console.error("Error fetching suppliers from Supabase:", err);
    return [];
  }
};

export const getSupabaseProducts = async (): Promise<Product[]> => {
  const sups = await getSupabaseSuppliers();
  const allProds: Product[] = [];
  sups.forEach(sup => {
    sup.products.forEach(p => {
      allProds.push({
        ...p,
        businessName: sup.businessName,
        rating: sup.rating,
        trustScore: sup.trustScore,
        contactNumber: sup.contactNumber,
        businessHours: sup.businessHours
      } as any);
    });
  });
  return allProds;
};

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
      voice: "നമസ്കാരം. మీ అవసరానికి సరిపోయే ఉత్తమ సరఫരാదారుని నేను కనుగొన్నాను. {Supplier} వద్ద కిలో ₹{Price} ధరకే ప్రీమియం {Product} అందుబాటులో ఉంది. ప్రస్తుతం వారి వద్ద తగినంత స్టാక్ ఉంది. మీరు ఈ సరఫరాదారుని సంപ്രదించాలనుకుంటున్నారా?",
      reason: "{Supplier} వద్ద తగినంత స్టാక్ ({Stock} {Unit} అందుబాటులో ఉంది) మరియు కిలో ₹{Price} చొപ്പുన చాలా తక్కువ ధరకే లభిస్తోంది. వీరు వేగంగా పంపడానికి {Location} లోనే ఉన్నారు.",
      recom: "మీరు వెంటనే {Supplier} వారిని సంപ്രదించాలని మేము సూచిస్తున్నాము. వారి ధరలు చాలా అనుకూలంగా ఉన్నాయి.",
      next: "నేరుగా ఫోన్ సంപ്രദിంపులను ప్రారంభించడానికి కింద ఉన్న 'Connect Supplier' బటన్ పై క్ലിക്ക് చేయండి."
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
      voice: "வணக்கம். உங்கள் தேவைக்கேற்ற சிறந்த சப்ளையரை நான் கண்டுபிடித்துள்ளேன். {Supplier} நிறுவனத்திடம் ஒரு {Unit} ₹{Price} விலையில் பிரீமியம் {Product} கிடைக்கிறது. தற்போது அவர்களிடம் தேவையான அளவு இருപ്പ് உள்ளது. ഈ சப்ளையரை நீங்கள் தொடர்பு கொள்ள விரும்புகிறீர்களா?",
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

/**
 * Initialize Gemini client helper
 */
const getGeminiAIClient = (): GoogleGenerativeAI => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY is not defined in environment.");
  }
  return new GoogleGenerativeAI(apiKey);
};

/**
 * Main AI matching function powered by Google Gemini
 */
export const matchSuppliersAI = async (query: string, lang: string = "English"): Promise<MatchResult> => {
  try {
    const genAI = getGeminiAIClient();

    // 1. Structured JSON extraction prompt
    const extractionPrompt = `You are a professional buyer sourcing agent. Analyze the following buyer request and extract the parameters:
Request: "${query}"

You must return a valid JSON object matching the following structure:
{
  "product": string | null (name of the product specified, e.g. "turmeric", "cement"),
  "quantity": number | null (amount requested as a number),
  "unit": string | null (unit of measurement, e.g. "kg", "ton", "bag", "piece"),
  "city": string | null (city requested for supply, e.g. "Vijayawada", "Hyderabad"),
  "state": string | null (state requested for supply),
  "quality": string | null (quality grade preferred, e.g. "Premium", "Grade A"),
  "category": string | null (Choose strictly from: "Turmeric", "Rice", "Wood", "Steel", "Cement", "Packaging", "Cotton", "Electronics"),
  "budget": number | null (maximum budget number specified, e.g. 18000),
  "notes": string | null (extra remarks),
  "unclear": boolean (set to true ONLY if the input is empty, nonsensical, contains no product words, or lacks clear business meaning so that matching is impossible),
  "followup": string | null (if unclear is true, write a polite clarify message in ${lang} language, e.g. "I couldn't understand the product you need. Could you please tell me the product name and quantity?")
}

Return ONLY valid JSON. Do not include markdown formatting or extra dialogue.`;

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const extractionResult = await model.generateContent(extractionPrompt);
    const text = extractionResult.response.text();
    const extracted = JSON.parse(text);

    // 2. Handle unclear / non-business requests
    if (extracted.unclear) {
      const mockSupplier: Supplier = {
        id: "mock_assistant",
        businessName: "AI Sourcing Assistant",
        rating: 5.0,
        trustScore: 100,
        location: "System Nodes",
        contactNumber: "+91 00000 00000",
        businessHours: "24/7",
        products: []
      };
      const mockProduct: Product = {
        id: "mock_assistant_prod",
        name: "Sourcing Support",
        category: "Support",
        description: "Clarification request.",
        price: 0,
        unit: "unit",
        quantityAvailable: 0,
        qualityGrade: "Premium",
        location: "System Nodes",
        businessName: "AI Sourcing Assistant",
        contactNumber: "+91 00000 00000",
        availability: "Immediate",
        businessHours: "24/7"
      };

      const followupMsg = extracted.followup || "I couldn't understand the product you need. Could you please tell me the product name and quantity?";

      return {
        bestSupplier: mockSupplier,
        bestProduct: mockProduct,
        matchingReason: followupMsg,
        voiceTranscript: followupMsg,
        allMatches: [],
        priceComparison: [],
        aiSummary: {
          requirement: query,
          selectedSupplier: "AI Assistant",
          price: "N/A",
          quantity: "N/A",
          location: "N/A",
          matchingReason: followupMsg,
          recommendation: "Please specify product name and volume.",
          nextAction: "Clarify Sourcing Needs"
        }
      };
    }

    // 3. Search storage database
    const suppliers = await getSupabaseSuppliers();
    const matches: Array<{
      supplier: Supplier;
      product: Product;
      score: number;
      reasons: string[];
    }> = [];

    suppliers.forEach(supplier => {
      supplier.products.forEach(product => {
        let score = 0;
        const reasons: string[] = [];

        // Category matching (Strong weight)
        if (extracted.category && product.category.toLowerCase() === extracted.category.toLowerCase()) {
          score += 50;
          reasons.push("Category matches");
        } else if (extracted.product && product.category.toLowerCase().includes(extracted.product.toLowerCase())) {
          score += 30;
          reasons.push("Category matching filter");
        }

        // Product name match
        if (extracted.product) {
          const prodName = product.name.toLowerCase();
          const extProd = extracted.product.toLowerCase();
          if (prodName.includes(extProd) || extProd.includes(prodName)) {
            score += 25;
            reasons.push("Exact item matches name");
          }
        }

        // Quality grade matching
        if (extracted.quality && product.qualityGrade.toLowerCase().includes(extracted.quality.toLowerCase())) {
          score += 20;
          reasons.push("Preferred quality grade");
        }

        // Location city matching
        if (extracted.city && supplier.location.toLowerCase().includes(extracted.city.toLowerCase())) {
          score += 20;
          reasons.push("Location matching city");
        }

        // Quantity availability
        const targetQty = extracted.quantity || 1;
        if (product.quantityAvailable >= targetQty) {
          score += 20;
          reasons.push("Sufficient stock");
        } else {
          score -= 40;
          reasons.push("Stock buffers low");
        }

        // Rating & Trust Score weights
        score += supplier.rating * 5; // e.g. 24 points
        score += (supplier.trustScore - 90) * 0.5; // e.g. 3 points

        // Price & Budget limits
        if (extracted.budget) {
          if (product.price <= extracted.budget) {
            score += 20;
            reasons.push("Fits budget limits");
          } else {
            score -= 35;
            reasons.push("Price above budget limit");
          }
        }

        // Filter out completely non-matching categories to keep matches accurate
        const isCatMatch = extracted.category && product.category.toLowerCase() === extracted.category.toLowerCase();
        const isNameMatch = extracted.product && product.name.toLowerCase().includes(extracted.product.toLowerCase());

        if (isCatMatch || isNameMatch) {
          matches.push({
            supplier,
            product,
            score,
            reasons
          });
        }
      });
    });

    // 4. Handle no matching suppliers found
    if (matches.length === 0) {
      const noMatchMsg = "No matching suppliers found in our database for your request. Please try searching for different products or adjusting your quality and quantity specifications.";
      const mockSupplier: Supplier = {
        id: "mock_no_match",
        businessName: "Sourcing Notification",
        rating: 5.0,
        trustScore: 100,
        location: "System Nodes",
        contactNumber: "+91 00000 00000",
        businessHours: "24/7",
        products: []
      };
      const mockProduct: Product = {
        id: "mock_no_match_prod",
        name: "N/A",
        category: "N/A",
        description: "No direct supplier matches.",
        price: 0,
        unit: "unit",
        quantityAvailable: 0,
        qualityGrade: "Standard",
        location: "System Nodes",
        businessName: "Sourcing Notification",
        contactNumber: "+91 00000 00000",
        availability: "Immediate",
        businessHours: "24/7"
      };

      return {
        bestSupplier: mockSupplier,
        bestProduct: mockProduct,
        matchingReason: noMatchMsg,
        voiceTranscript: noMatchMsg,
        allMatches: [],
        priceComparison: [],
        aiSummary: {
          requirement: query,
          selectedSupplier: "No Matches",
          price: "N/A",
          quantity: extracted.quantity ? `${extracted.quantity} ${extracted.unit || ""}` : "N/A",
          location: "N/A",
          matchingReason: noMatchMsg,
          recommendation: "Consider updating specifications.",
          nextAction: "Search Alternate Options"
        }
      };
    }

    // 5. Rank and retrieve best matched items
    matches.sort((a, b) => b.score - a.score);
    const bestMatch = matches[0];
    const bestSupplier = bestMatch.supplier;
    const bestProduct = bestMatch.product;

    // Price comparison list
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

    // 6. Generate natural language selection explanation & next action recommendation using Gemini
    const justificationPrompt = `You are an AI Sourcing Agent for "Supply Market".
You matched a buyer's request with a supplier.

Buyer's Request: "${query}"
Selected Supplier: "${bestSupplier.businessName}" (Rating: ${bestSupplier.rating}, Location: ${bestSupplier.location}, Trust Score: ${bestSupplier.trustScore}%)
Selected Product: "${bestProduct.name}" (Price: ₹${bestProduct.price}/${bestProduct.unit}, Quality: ${bestProduct.qualityGrade}, Stock: ${bestProduct.quantityAvailable} ${bestProduct.unit}, Availability: ${bestProduct.availability})

Write a simple, polite, human-friendly explanation of why this supplier was selected for the buyer. 
Write only 1 or 2 sentences. 
Do not use markdown formatting (like asterisks or bold text).
You MUST write the explanation in ${lang} language.`;

    const nextActionPrompt = `You are an AI Sourcing Agent for "Supply Market".
The buyer is matched with the supplier "${bestSupplier.businessName}".
Generate a very short direct recommendation for the buyer's next step.
Write only 5 to 8 words. Do not use markdown.
You MUST write the recommendation in ${lang} language.`;

    const justificationResult = await model.generateContent(justificationPrompt);
    const matchingReason = justificationResult.response.text().trim();
    const voiceTranscript = matchingReason;

    const nextActionResult = await model.generateContent(nextActionPrompt);
    const recommendation = nextActionResult.response.text().trim();
    const nextAction = `Click 'Connect' to call ${bestSupplier.businessName}`;

    return {
      bestSupplier,
      bestProduct,
      matchingReason,
      voiceTranscript,
      allMatches: matches.map(m => ({
        supplier: m.supplier,
        product: m.product,
        score: m.score,
        reason: m.reasons.slice(0, 3).join(", ")
      })),
      priceComparison,
      aiSummary: {
        requirement: query,
        selectedSupplier: bestSupplier.businessName,
        price: `₹${bestProduct.price} / ${bestProduct.unit}`,
        quantity: extracted.quantity ? `${extracted.quantity} ${extracted.unit || bestProduct.unit}` : `1 ${bestProduct.unit}`,
        location: bestSupplier.location,
        matchingReason: matchingReason,
        recommendation: recommendation,
        nextAction: nextAction
      }
    };

  } catch (error) {
    console.error("Gemini Sourcing Match failed, falling back to keywords:", error);
    return fallbackKeywordMatch(query, lang);
  }
};

/**
 * Robust fallback matching algorithm based on local keywords configuration
 */
const fallbackKeywordMatch = async (query: string, lang: string): Promise<MatchResult> => {
  // Simulate network/API delay for a premium matching progress feel
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const suppliers = await getSupabaseSuppliers();
  const normalizedQuery = query.toLowerCase();

  // 1. Identify category based on keywords
  let detectedCategory = "";
  let maxKeywordHits = 0;

  Object.entries(KEYWORD_MAP).forEach(([category, keywords]) => {
    let hits = 0;
    keywords.forEach(kw => {
      if (normalizedQuery.includes(kw)) {
        hits += 1.5;
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

export interface SalesCoachReport {
  buyerBehaviour: string;
  buyerIntent: string;
  mainConcern: string;
  recommendedDiscount: string;
  recommendedFollowupTime: string;
  suggestedReply: string;
  recommendedSalesStrategy: string;
  chanceOfClosing: number;
}

/**
 * Uses Gemini to analyze a completed sourcing conversation and generate B2B sales insights
 */
export const generateSalesCoachReport = async (
  buyerName: string,
  buyerCompany: string,
  product: string,
  quantity: string,
  transcript: Array<{ role: string; text: string }>
): Promise<SalesCoachReport> => {
  try {
    const genAI = getGeminiAIClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const dialogueStr = transcript
      .map((m) => `${m.role === "user" ? "Buyer" : "AI Call Agent"}: ${m.text}`)
      .join("\n");

    const prompt = `You are an elite B2B enterprise sales coach. Analyze this completed AI buyer sourcing call:
Buyer Name: "${buyerName}"
Buyer Company: "${buyerCompany}"
Sourcing Parameter: Product category "${product}", quantity "${quantity}"
Dialogue Logs:
"""
${dialogueStr}
"""

You must return a valid JSON object matching this structure EXACTLY:
{
  "buyerBehaviour": "Short summary of buyer demeanor, tone, responsiveness, or price/time sensitivity.",
  "buyerIntent": "B2B buyer intent depth (e.g., immediate buyer, comparing prices, testing parameters).",
  "mainConcern": "The single primary bottleneck or concern (e.g., trust, routing, catalog options).",
  "recommendedDiscount": "Discount guideline recommendation based on scale (e.g. '5% volume credit', 'None recommended').",
  "recommendedFollowupTime": "Target response window (e.g. 'Immediate WhatsApp callback', 'Next business day').",
  "suggestedReply": "A short corporate reply draft that addresses their interest professionally.",
  "recommendedSalesStrategy": "Specific action to seal this deal (e.g. emphasize rating, pitch standard shipping, provide samples).",
  "chanceOfClosing": number (An integer from 0 to 100 representing conversion likelihood)
}

Return ONLY valid JSON. Do not write markdown tags like \`\`\`json or extra conversational explanations.`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    let cleaned = responseText;
    if (cleaned.startsWith("```json")) {
      cleaned = cleaned.substring(7);
    }
    if (cleaned.endsWith("```")) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    cleaned = cleaned.trim();

    const report: SalesCoachReport = JSON.parse(cleaned);

    // Validate fields
    if (typeof report.chanceOfClosing !== "number") {
      report.chanceOfClosing = Number(report.chanceOfClosing) || 75;
    }
    return report;
  } catch (err) {
    console.warn("Gemini Sales Coach analysis failed, using fallback metrics:", err);
    // Provide intelligent generic fallbacks based on parameters
    const discountVal = quantity.toLowerCase().includes("kg") || Number(quantity.replace(/[^0-9]/g, "")) > 100
      ? "5% bulk discount"
      : "Standard pricing, no immediate discount needed";

    return {
      buyerBehaviour: "Professional and focused on category parameters.",
      buyerIntent: "Active searcher comparing catalog matching results.",
      mainConcern: "Sourcing specifications validation.",
      recommendedDiscount: discountVal,
      recommendedFollowupTime: "Within 4 hours",
      suggestedReply: `Hi ${buyerName}, we noticed your interest in ${product} (${quantity}). Our premium logistics are ready to execute your delivery details. Let us know when we can finalize.`,
      recommendedSalesStrategy: "Proactively send product specification sheets and quality grading standards.",
      chanceOfClosing: 80
    };
  }
};

/**
 * Ask Gemini questions about the matched suppliers context in the current sourcing session
 */
export const discussSourcingSession = async (
  query: string,
  lang: string = "English",
  buyerRequirement: string,
  matchedSuppliers: Supplier[],
  allMatches: any[],
  conversationHistory: Array<{ role: 'user' | 'assistant'; text: string }>
): Promise<string> => {
  try {
    const genAI = getGeminiAIClient();
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Construct suppliers list for context
    const suppliersContext = matchedSuppliers.map((s, idx) => {
      const prodsStr = s.products.map(p =>
        `- Product: "${p.name}" (Price: ₹${p.price}/${p.unit}, Stock: ${p.quantityAvailable} ${p.unit}, Quality: ${p.qualityGrade}, Availability: ${p.availability})`
      ).join("\n");
      const matchScore = allMatches.find(m => m.supplier.id === s.id)?.score || 80;

      return `Supplier #${idx + 1}: "${s.businessName}"
Rating: ${s.rating} Stars
Trust Score: ${s.trustScore}%
Location: "${s.location}"
Match Score: ${matchScore}%
Matched Products:
${prodsStr}`;
    }).join("\n\n");

    const historyStr = conversationHistory.map(m =>
      `${m.role === 'user' ? 'Buyer' : 'Procurement Assistant'}: ${m.text}`
    ).join("\n");

    const prompt = `You are the "AI Procurement Assistant" for "Supply Market AI", an advanced autonomous B2B sourcing platform.
Your ONLY responsibility is helping the buyer understand supplier recommendations and answering questions about the matched suppliers to assist them in selecting the best option.

Buyer's Original Requirement: "${buyerRequirement}"

Context of Matched Suppliers:
"""
${suppliersContext}
"""

Active Conversation History (Current Session Memory):
"""
${historyStr}
"""

Buyer's New Question/Action: "${query}"

Guidelines for your response:
1. Explain recommendations naturally. Compare pricing, stock, locations, quality, and trust scores based strictly on the provided Context.
2. If the buyer asks for a comparison or cheaper/closer/faster option, run the comparison on the provided matched suppliers list and state the numbers directly.
3. Be professional, direct, and human-friendly. Keep responses concise (usually 2 to 4 sentences).
4. Never mention database terms, keys, JSON models, or mock assistant logs. Speak naturally like a human advisor.
5. Do not use markdown tags like bold (**), italics, or asterisks. Return clean plain text.
6. You MUST write your response in "${lang}" language.

Your response:`;

    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (err) {
    console.error("discussSourcingSession failed:", err);
    // Generic local heuristics fallback based on query
    const lower = query.toLowerCase();
    if (lower.includes("cheap") || lower.includes("price") || lower.includes("cost") || lower.includes("ధర") || lower.includes("कीमत")) {
      const sorted = [...matchedSuppliers].sort((a, b) => {
        const p1 = a.products[0]?.price || 999999;
        const p2 = b.products[0]?.price || 999999;
        return p1 - p2;
      });
      if (sorted.length > 0) {
        return `Based on pricing, ${sorted[0].businessName} is the cheapest option offering ₹${sorted[0].products[0]?.price || "N/A"} per ${sorted[0].products[0]?.unit || "unit"}.`;
      }
    }
    if (lower.includes("fast") || lower.includes("delivery") || lower.includes("time") || lower.includes("delivery tomorrow")) {
      const immediate = matchedSuppliers.find(s => s.products.some(p => p.availability === "Immediate"));
      if (immediate) {
        return `${immediate.businessName} supports immediate dispatch and fast logistics directly from ${immediate.location.split(",")[0]}.`;
      }
    }
    if (lower.includes("close") || lower.includes("near") || lower.includes("location")) {
      return `I recommend checking the location parameters of the matched suppliers. Many are located in close freight regions for fast transit.`;
    }

    return `I can help you review the matched suppliers list. Please ask me about price comparison, fast logistics, or closing negotiations with ${matchedSuppliers[0]?.businessName || "the recommended supplier"}.`;
  }
};

export interface ExtractedRequirement {
  product: string | null;
  quantity: string | null;
  location: string | null;
  budget: string | null;
  quality: string | null;
  deliveryTime: string | null;
}

const localAnalyzeSourcingRequirement = (query: string): ExtractedRequirement => {
  const normalized = query.toLowerCase();
  
  // 1. Detect product
  let product: string | null = null;
  if (normalized.includes("teak wood") || normalized.includes("teakwood")) {
    product = "Teak Wood";
  } else if (normalized.includes("wood") || normalized.includes("timber")) {
    product = "Wood";
  } else if (normalized.includes("turmeric") || normalized.includes("haldi")) {
    product = "Turmeric";
  } else if (normalized.includes("basmati rice") || normalized.includes("basmati")) {
    product = "Basmati Rice";
  } else if (normalized.includes("rice")) {
    product = "Rice";
  } else if (normalized.includes("steel") || normalized.includes("rebar")) {
    product = "Steel";
  } else if (normalized.includes("cement")) {
    product = "Cement";
  } else if (normalized.includes("packaging") || normalized.includes("box") || normalized.includes("carton")) {
    product = "Packaging";
  } else if (normalized.includes("cotton")) {
    product = "Cotton";
  } else if (normalized.includes("electronics") || normalized.includes("arduino") || normalized.includes("sensor")) {
    product = "Electronics";
  }

  // 2. Detect location
  let location: string | null = null;
  const cities = ["hyderabad", "vijayawada", "chennai", "bangalore", "visakhapatnam", "mumbai", "indore", "delhi", "kolkata"];
  for (const city of cities) {
    if (normalized.includes(city)) {
      location = city.charAt(0).toUpperCase() + city.slice(1);
      break;
    }
  }

  // 3. Detect quantity
  let quantity: string | null = null;
  const qtyRegex = /(\d+(?:\.\d+)?)\s*(?:cubic feet|cubic ft|cu ft|kg|ton|tons|bag|bags|pieces|pcs|units)/i;
  const qtyMatch = query.match(qtyRegex);
  if (qtyMatch) {
    quantity = qtyMatch[0];
  } else {
    // Check for a raw number
    const numRegex = /(\d+(?:\.\d+)?)/;
    const numMatch = query.match(numRegex);
    if (numMatch) {
      quantity = numMatch[0];
    }
  }

  // 4. Detect budget
  let budget: string | null = null;
  const budgetRegex = /(?:rs\.?|₹)\s*(\d+(?:\s*-\s*\d+)?(?:\/\w+)?)/i;
  const budgetMatch = query.match(budgetRegex);
  if (budgetMatch) {
    budget = budgetMatch[0];
  }

  // 5. Detect quality
  let quality: string | null = null;
  if (normalized.includes("a grade") || normalized.includes("grade a")) {
    quality = "A Grade";
  } else if (normalized.includes("b grade") || normalized.includes("grade b")) {
    quality = "B Grade";
  } else if (normalized.includes("premium")) {
    quality = "Premium";
  } else if (normalized.includes("standard")) {
    quality = "Standard";
  }

  // 6. Detect delivery time
  let deliveryTime: string | null = null;
  if (normalized.includes("immediate") || normalized.includes("instantly") || normalized.includes("today")) {
    deliveryTime = "Immediate";
  } else if (normalized.includes("within 2 days") || normalized.includes("2 days")) {
    deliveryTime = "Within 2 days";
  } else if (normalized.includes("within a week") || normalized.includes("week")) {
    deliveryTime = "Within a week";
  }

  return { product, quantity, location, budget, quality, deliveryTime };
};

export const analyzeSourcingRequirement = async (
  query: string,
  lang: string = "English"
): Promise<ExtractedRequirement> => {
  const local = localAnalyzeSourcingRequirement(query);
  try {
    const genAI = getGeminiAIClient();
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash-lite",
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const prompt = `You are a professional B2B sourcing agent assistant. Analyze the following buyer sourcing query and extract the parameters:
Query: "${query}" (User's locale / language: ${lang})

You must return a valid JSON object matching this structure:
{
  "product": string | null (the product or raw material name, e.g. "turmeric", "rice", "steel", null if missing),
  "quantity": string | null (the quantity and unit if specified, e.g. "500 kg", "20 tons", "1000 bags", null if missing. Combine number and unit if both exist, e.g. "500kg"),
  "location": string | null (delivery city, e.g. "Hyderabad", "Vijayawada", null if missing),
  "budget": string | null (budget, price range or target price, e.g. "₹25-35/kg", "₹10,000", null if missing),
  "quality": string | null (quality grade, quality standard or type, e.g. "A Grade", "Premium", null if missing),
  "deliveryTime": string | null (preferred delivery time, e.g. "Immediate", "Within a week", "10 days", null if missing)
}

Do not include markdown or explanations. Return only JSON.`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    const extracted = JSON.parse(text);
    return {
      product: extracted.product || local.product,
      quantity: extracted.quantity || local.quantity,
      location: extracted.location || local.location,
      budget: extracted.budget || local.budget,
      quality: extracted.quality || local.quality,
      deliveryTime: extracted.deliveryTime || local.deliveryTime
    };
  } catch (err) {
    console.error("analyzeSourcingRequirement failed, using fallbacks:", err);
    return local;
  }
};


