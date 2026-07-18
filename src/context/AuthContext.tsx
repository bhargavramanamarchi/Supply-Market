import React, { createContext, useContext, useState, useEffect } from "react";
import { User, Lock, Mail, Eye, EyeOff, ShieldCheck, X, Building, LayoutGrid, Phone, MapPin } from "lucide-react";
import { useLanguage } from "./LanguageContext";
import { supabase } from "../services/supabase";

export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: string;
  company?: string;
  position?: string;
  phone?: string;
  city?: string;
  state?: string;
  account_type: 'buyer' | 'seller' | 'both';
  supplierId?: string;
  supplierRating?: number;
  supplierTrustScore?: number;
}

interface AuthContextProps {
  user: UserSession | null;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  signIn: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    name: string,
    email: string,
    password: string,
    confirmPass: string,
    company: string,
    role: string,
    phone: string,
    city: string,
    state: string
  ) => Promise<boolean>;
  signOut: () => void;
  showToast: (msg: string) => void;
  loading: boolean;
  updateProfile: (updatedData: { full_name: string; organization?: string; phone?: string; city?: string; state?: string }) => Promise<boolean>;
  followedSupplierIds: string[];
  followSupplier: (supplierId: string) => Promise<void>;
  unfollowSupplier: (supplierId: string) => Promise<void>;
  refreshFollows: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

const AUTH_TRANSLATIONS: Record<string, Record<string, string>> = {
  English: {
    signIn: "Sign In",
    register: "Register",
    email: "Corporate Email Address",
    password: "Password",
    rememberMe: "Remember Me",
    forgotPassword: "Forgot Password?",
    createAccount: "Create Account",
    alreadyHaveAccount: "Already have an account? Sign In",
    nationalPortal: "National Supply Market Portal",
    secureGateway: "Secure Enterprise Gateway",
    pleaseSignIn: "Please sign in to continue.",
    welcomeBack: "Welcome back, {name}!",
    welcomeNewUser: "Welcome to Supply Market, {name}!",
    signOutSuccess: "You have signed out successfully.",
    fullName: "Full Name",
    orgName: "Organization Name",
    accountType: "Account Type",
    buyer: "Buyer",
    seller: "Seller",
    both: "Buyer & Seller",
    invalidCredentials: "Please enter a valid email and password.",
    forgotPasswordSent: "Password reset link sent to your registered email.",
    close: "Close"
  },
  Telugu: {
    signIn: "లాగ్ ఇన్",
    register: "నమోదు చేసుకోండి",
    email: "కార్పొరేట్ ఈమెయిల్ చిరునామా",
    password: "పాస్‌వర్డ్",
    rememberMe: "నన్ను గుర్తుంచుకో",
    forgotPassword: "పాస్‌వర్డ్ మర్చిపోయారా?",
    createAccount: "ఖాతాను సృష్టించండి",
    alreadyHaveAccount: "ఇప్పటికే ఖాతా ఉందా? లాగ్ ఇన్ చేయండి",
    nationalPortal: "జాతీయ సప్లై మార్కెట్ పోర్టల్",
    secureGateway: "సురక్షితమైన ఎంటర్‌ప్రైజ్ గేట్‌వే",
    pleaseSignIn: "దయచేసి కొనసాగడానికి సైన్ ఇన్ చేయండి.",
    welcomeBack: "మరలా స్వాగతం, {name}!",
    welcomeNewUser: "సప్లై మార్కెట్‌కు స్వాగతం, {name}!",
    signOutSuccess: "మీరు విజయవంతంగా లాగ్ అవుట్ అయ్యారు.",
    fullName: "పూర్తి పేరు",
    orgName: "సంస్థ పేరు",
    accountType: "ఖాతా రకం",
    buyer: "కొనుగోలుదారు (Buyer)",
    seller: "విక్రేత (Seller)",
    both: "రెండు (Buyer & Seller)",
    invalidCredentials: "దయచేసి చెల్లుబాటు అయ్యే ఈమెయిల్ మరియు పాస్‌వర్డ్ నమోదు చేయండి.",
    forgotPasswordSent: "పాస్‌వర్డ్ రీసెట్ లింక్ మీ రిజిస్టర్డ్ ఈమెయిల్‌కు పంపబడింది.",
    close: "మూసివేయి"
  },
  Hindi: {
    signIn: "साइन इन",
    register: "पंजीकरण करें",
    email: "कॉर्पोरेट ईमेल पता",
    password: "पासवर्ड",
    rememberMe: "मुझे याद रखें",
    forgotPassword: "पासवर्ड भूल गए?",
    createAccount: "खाता बनाएं",
    alreadyHaveAccount: "पहले से ही एक खाता है? साइन इन करें",
    nationalPortal: "राष्ट्रीय आपूर्ति बाजार पोर्टल",
    secureGateway: "सुरक्षित एंटरप्राइज गेटवे",
    pleaseSignIn: "जारी रखने के लिए कृपया साइन इन करें।",
    welcomeBack: "वापसी पर आपका स्वागत है, {name}!",
    welcomeNewUser: "सप्लाई मार्केट में आपका स्वागत है, {name}!",
    signOutSuccess: "आपने सफलतापूर्वक लॉग आउट कर लिया है।",
    fullName: "पूरा नाम",
    orgName: "संगठन का नाम",
    accountType: "खाते का प्रकार",
    buyer: "क्रेता (Buyer)",
    seller: "विक्रेता (Seller)",
    both: "दोनों (Buyer & Seller)",
    invalidCredentials: "कृपया एक वैध ईमेल और पासवर्ड दर्ज करें।",
    forgotPasswordSent: "पासवर्ड रीसेट लिंक आपके पंजीकृत ईमेल पर भेज दिया गया है।",
    close: "बंद करें"
  },
  Tamil: {
    signIn: "உள்நுழை",
    register: "பதிவு செய்",
    email: "கார்ப்பரேட் மின்னஞ்சல் முகவரி",
    password: "கடவுச்சொல்",
    rememberMe: "என்னை நினைவில் கொள்",
    forgotPassword: "கடவுச்சொல் மறந்துவிட்டதா?",
    createAccount: "கணக்கை உருவாக்கு",
    alreadyHaveAccount: "ஏற்கனவே கணக்கு உள்ளதா? உள்நுழைக",
    nationalPortal: "தேசிய விநியோக சந்தை போர்டல்",
    secureGateway: "பாதுகாப்பான நிறுவன நுழைவாயில்",
    pleaseSignIn: "தொடர தயவுசெய்து உள்நுழையவும்.",
    welcomeBack: "மீண்டும் வருக, {name}!",
    welcomeNewUser: "விநியோக சந்தைக்கு உங்களை வரவேற்கிறோம், {name}!",
    signOutSuccess: "நீங்கள் வெற்றிகரமாக வெளியேறிவிட்டீர்கள்.",
    fullName: "முழு பெயர்",
    orgName: "நிறுவனத்தின் பெயர்",
    accountType: "கணக்கு வகை",
    buyer: "வாங்குபவர்",
    seller: "விற்பனையாளர்",
    both: "வாங்குபவர் & விற்பனையாளர்",
    invalidCredentials: "முறையான மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.",
    forgotPasswordSent: "கடவுச்சொல் மீட்டமைப்பு இணைப்பு உங்கள் பதிவுசெய்யப்பட்ட மின்னஞ்சலுக்கு அனுப்பப்பட்டது.",
    close: "மூடு"
  },
  Kannada: {
    signIn: "ಸೈನ್ ಇನ್",
    register: "ನೋಂದಾಯಿಸಿ",
    email: "ಕಾರ್ಪೊರೇಟ್ ಇಮೇಲ್ ವಿಳಾಸ",
    password: "ಪಾಸ್ವರ್ಡ್",
    rememberMe: "ನನ್ನನ್ನು ನೆನಪಿಟ್ಟುಕೊಳ್ಳಿ",
    forgotPassword: "ಪಾಸ್ವರ್ಡ್ ಮರೆತಿರಾ?",
    createAccount: "ಖಾತೆಯನ್ನು ರಚಿಸಿ",
    alreadyHaveAccount: "ಈಗಾಗಲೇ ಖಾತೆ ಇದೆಯೇ? ಸೈನ್ ಇನ್ ಮಾಡಿ",
    nationalPortal: "ರಾಷ್ಟ್ರೀಯ ಪೂರೈಕೆ ಮಾರುಕಟ್ಟೆ ಪೋರ್ಟಲ್",
    secureGateway: "ಸುರಕ್ಷಿತ ಎಂಟರ್‌ಪ್ರైಸ್ ಗೇಟ್‌ವೇ",
    pleaseSignIn: "ದಯವಿಟ್ಟು ಮುಂದುವರಿಯಲು ಸೈನ್ ಇನ್ ಮಾಡಿ.",
    welcomeBack: "ಮರಳಿ ಸ್ವಗತ, {name}!",
    welcomeNewUser: "ಪೂರೈಕೆ ಮಾರುಕಟ್ಟೆಗೆ ಸುಸ್ವಾಗತ, {name}!",
    signOutSuccess: "ನೀವು ಯಶಸ್ವಿಯಾಗಿ ಸೈನ್ ಔಟ್ ಆಗಿದ್ದೀರಿ.",
    fullName: "ಪೂರ್ಣ ಹೆಸರು",
    orgName: "ಸಂಸ್ಥೆಯ ಹೆಸರು",
    accountType: "ಖಾತೆಯ ಪ್ರಕಾರ",
    buyer: "ಖರೀದಿದಾರ",
    seller: "ಮಾರಾಟಗಾರ",
    both: "ಖರೀದಿದಾರ ಮತ್ತು ಮಾರಾಟಗಾರ",
    invalidCredentials: "ದಯವಿಟ್ಟು ಮಾನ್ಯ ಇಮೇಲ್ ಮತ್ತು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ.",
    forgotPasswordSent: "ಪಾಸ್‌ವರ್ಡ್ ಮರುಹೊಂದಿಸುವ ಲಿಂಕ್ ಅನ್ನು ನಿಮ್ಮ ನೋಂದಾಯಿತ ಇಮೇಲ್‌ಗೆ ಕಳುಹಿಸಲಾಗಿದೆ.",
    close: "ಮುಚ್ಚಿ"
  },
  Malayalam: {
    signIn: "സൈൻ ഇൻ",
    register: "രജിസ്റ്റർ ചെയ്യുക",
    email: "കോർപ്പറേറ്റ് ഇമെയിൽ വിലാസം",
    password: "പാസ്‌വേഡ്",
    rememberMe: "എന്നെ ഓർക്കുക",
    forgotPassword: "പാസ്‌വേഡ് മറന്നോ?",
    createAccount: "അക്കൗണ്ട് സൃഷ്ടിക്കുക",
    alreadyHaveAccount: "അക്കൗണ്ട് ഉണ്ടോ? സൈൻ ഇൻ ചെയ്യുക",
    nationalPortal: "ദേശീയ വിതരണ വിപണി പോർട്ടൽ",
    secureGateway: "സുരക്ഷിത എൻ്റർപ്രൈസ് ഗേറ്റ്‌വേ",
    pleaseSignIn: "തുടരാൻ ദയവായി സൈൻ ഇൻ ചെയ്യുക.",
    welcomeBack: "വീണ്ടും സ്വാഗതം, {name}!",
    welcomeNewUser: "സപ്ലൈ മാർക്കറ്റിലേക്ക് സ്വാഗതം, {name}!",
    signOutSuccess: "നിങ്ങൾ വിജയകരമായി ലോഗ് ഔട്ട് ചെയ്തു.",
    fullName: "പൂർണ്ണമായ പേര്",
    orgName: "സ്ഥാപനത്തിന്റെ പേര്",
    accountType: "അക്കൗണ്ട് തരം",
    buyer: "വാങ്ങുന്നയാൾ",
    seller: "വിൽപ്പനക്കാരൻ",
    both: "രണ്ടും (വാങ്ങുന്നയാളും വിൽപ്പനക്കാരനും)",
    invalidCredentials: "ദയവായി സാധുവായ ഇമെയിലും പാസ്‌വേഡും നൽകുക.",
    forgotPasswordSent: "പാസ്‌വേഡ് റീസെറ്റ് ലിങ്ക് നിങ്ങളുടെ രജിസ്റ്റർ ചെയ്ത ഇമെയിലിലേക്ക് അയച്ചു.",
    close: "അടയ്ക്കുക"
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { language } = useLanguage();
  const [user, setUser] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [followedSupplierIds, setFollowedSupplierIds] = useState<string[]>([]);
  
  // Modal states
  const [isRegisterMode, setIsRegisterMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  
  // Registration states
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [regOrg, setRegOrg] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regState, setRegState] = useState("");
  const [regType, setRegType] = useState("both");

  const [formError, setFormError] = useState<string | null>(null);

  const at = (key: string): string => {
    const langDict = AUTH_TRANSLATIONS[language] || AUTH_TRANSLATIONS["English"];
    return langDict[key] || AUTH_TRANSLATIONS["English"][key] || key;
  };

  const repairProfile = async (
    userId: string,
    name: string,
    email: string,
    company: string,
    role: string,
    phone: string,
    city: string,
    state: string
  ): Promise<any> => {
    // 1. Fetch current user from DB to see if it exists
    const { data: dbUser, error: fetchError } = await (supabase as any)
      .from('users')
      .select('*')
      .eq('id', userId)
      .maybeSingle();

    if (fetchError) {
      console.error("Error checking db user profile during repair:", fetchError);
    }

    const cityState = city && state ? `${city}, ${state}` : (city || 'Hyderabad, Telangana');

    let userProfile = dbUser;
    if (!userProfile) {
      // Insert profile
      const { data: insertedUser, error: insertError } = await (supabase as any)
        .from('users')
        .insert({
          id: userId,
          full_name: name,
          email: email,
          organization: company || null,
          phone: phone || '',
          account_type: role as 'buyer' | 'seller' | 'both',
          city: cityState,
        })
        .select()
        .maybeSingle();

      if (insertError) {
        // Handle race conditions where profile is created concurrently
        const { data: retryUser } = await (supabase as any)
          .from('users')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        if (retryUser) {
          userProfile = retryUser;
        } else {
          console.error("Error creating user profile during repair:", insertError);
          throw insertError;
        }
      } else {
        userProfile = insertedUser;
      }
    }

    // 2. Insert suppliers if role is seller or both
    if (userProfile && (userProfile.account_type === 'seller' || userProfile.account_type === 'both')) {
      const { data: supplier, error: supplierFetchError } = await (supabase as any)
        .from('suppliers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (supplierFetchError) {
        console.error("Error checking supplier profile during repair:", supplierFetchError);
      }

      if (!supplier) {
        const insertPayload: any = {
          user_id: userId,
          company_name: company || `${userProfile.full_name}'s Company`,
          location: cityState,
          verified: false,
          rating: 5.0,
          trust_score: 95.0,
          contact_number: phone || '+91 90008 90009',
          business_hours: '09:00 AM - 06:00 PM',
          created_at: new Date().toISOString()
        };

        let { error: supplierError } = await (supabase as any)
          .from('suppliers')
          .insert(insertPayload);

        // If insert fails due to missing created_at column (i.e. migration not run yet), retry without it
        if (supplierError && (supplierError.message?.includes('created_at') || supplierError.code === '42703')) {
          console.warn("Inserting supplier with created_at failed during repair, retrying without created_at column:", supplierError.message);
          delete insertPayload.created_at;
          
          const retryResult = await (supabase as any)
            .from('suppliers')
            .insert(insertPayload);
            
          supplierError = retryResult.error;
        }

        if (supplierError) {
          const { data: retrySupplier } = await (supabase as any)
            .from('suppliers')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (!retrySupplier) {
            console.error("Error creating supplier profile during repair:", supplierError);
            throw supplierError;
          }
        }
      }
    }

    return userProfile;
  };

  const fetchAndCacheUser = async (userId: string) => {
    try {
      const { data: dbUser, error } = await (supabase as any)
        .from('users')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error("Error fetching db user profile:", error);
        return;
      }

      let userProfile = dbUser;
      if (!userProfile) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const email = authUser.email || "";
          const metadata = authUser.user_metadata || {};
          const fullName = metadata.full_name || email.split('@')[0] || 'User';
          const organization = metadata.organization || null;
          const accountType = metadata.account_type || 'both';
          const phone = metadata.phone || '';
          const city = metadata.city || '';
          const state = metadata.state || '';

          userProfile = await repairProfile(userId, fullName, email, organization, accountType, phone, city, state);
        }
      }

      if (userProfile) {
        let supplierId: string | undefined = undefined;
        let rating = 5.0;
        let trustScore = 95;

        if (userProfile.account_type === 'seller' || userProfile.account_type === 'both') {
          const { data: supplier } = await (supabase as any)
            .from('suppliers')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

          if (supplier) {
            supplierId = supplier.id;
            rating = Number(supplier.rating);
            trustScore = Number(supplier.trust_score);
          } else {
            await repairProfile(
              userId,
              userProfile.full_name,
              userProfile.email,
              userProfile.organization || '',
              userProfile.account_type,
              userProfile.phone || '',
              userProfile.city?.split(',')[0]?.trim() || '',
              userProfile.city?.split(',')[1]?.trim() || ''
            );

            const { data: refetchedSupplier } = await (supabase as any)
              .from('suppliers')
              .select('*')
              .eq('user_id', userId)
              .maybeSingle();

            if (refetchedSupplier) {
              supplierId = refetchedSupplier.id;
              rating = Number(refetchedSupplier.rating);
              trustScore = Number(refetchedSupplier.trust_score);
            }
          }
        }

        let city = userProfile.city || "";
        let parsedCity = city;
        let parsedState = "";
        if (city.includes(",")) {
          const parts = city.split(",");
          parsedCity = parts[0].trim();
          parsedState = parts[1].trim();
        }

        let displayRole = "Buyer & Seller";
        if (userProfile.account_type === "buyer") displayRole = "Buyer Account";
        else if (userProfile.account_type === "seller") displayRole = "Seller Account";

        const mappedSession: UserSession = {
          id: userProfile.id,
          name: userProfile.full_name,
          email: userProfile.email,
          role: displayRole,
          company: userProfile.organization || undefined,
          position: userProfile.account_type === "buyer" ? "Procurement Specialist" : "Sales Representative",
          phone: userProfile.phone || undefined,
          city: parsedCity || undefined,
          state: parsedState || undefined,
          account_type: userProfile.account_type,
          supplierId,
          supplierRating: rating,
          supplierTrustScore: trustScore
        };

        setUser(mappedSession);
        localStorage.setItem("supply_market_session", JSON.stringify(mappedSession));
      }
    } catch (err) {
      console.error("Error caching user profile:", err);
    }
  };

  // Load session from localStorage on startup & listen to auth state
  useEffect(() => {
    const savedSession = localStorage.getItem("supply_market_session");
    if (savedSession) {
      try {
        setUser(JSON.parse(savedSession));
      } catch (e) {
        localStorage.removeItem("supply_market_session");
      }
    }

    let isHandled = false;

    // Timeout safety fallback: never let loading spinner run indefinitely
    const timeoutId = setTimeout(() => {
      if (!isHandled) {
        console.warn("Auth initialization timed out. Clearing loading state to prevent infinite spinner.");
        setLoading(false);
        isHandled = true;
      }
    }, 3000); // 3 seconds timeout

    // Purely rely on onAuthStateChange to get the initial session and subsequent changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("onAuthStateChange fired event:", event, "has session:", !!session);
      
      try {
        if (session && session.user) {
          await fetchAndCacheUser(session.user.id);
        } else {
          setUser(null);
          localStorage.removeItem("supply_market_session");
        }
      } catch (err) {
        console.error("Error in auth state change handler:", err);
      } finally {
        if (!isHandled) {
          setLoading(false);
          isHandled = true;
          clearTimeout(timeoutId);
        }
      }
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

  // Clear toast message after delay
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => {
        setToastMessage(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  const openAuthModal = () => {
    setFormError(null);
    setEmail("");
    setPassword("");
    setRegName("");
    setRegEmail("");
    setRegPassword("");
    setRegConfirmPassword("");
    setRegOrg("");
    setRegPhone("");
    setRegCity("");
    setRegState("");
    setIsRegisterMode(false);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const showToast = (msg: string) => {
    const translated = at(msg) || msg;
    setToastMessage(translated);
  };

  const signIn = async (inputEmail: string, inputPassword: string): Promise<boolean> => {
    if (!inputEmail || !inputPassword) {
      setFormError(at("invalidCredentials"));
      return false;
    }
    setFormError(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: inputEmail,
        password: inputPassword,
      });

      if (error) throw error;

      if (data.user) {
        await fetchAndCacheUser(data.user.id);
        window.location.href = "/";
      }

      setIsAuthModalOpen(false);
      const welcomeMsg = at("welcomeBack").replace("{name}", data.user?.email || "User");
      setToastMessage(welcomeMsg);
      return true;
    } catch (err: any) {
      console.error("Sign in error:", err);
      setFormError(err.message || at("invalidCredentials"));
      return false;
    }
  };

  const registerUser = async (
    name: string,
    inputEmail: string,
    inputPass: string,
    confirmPass: string,
    company: string,
    role: string,
    phone: string,
    city: string,
    state: string
  ): Promise<boolean> => {
    if (!name || !inputEmail || !inputPass || !confirmPass || !company || !role || !phone || !city || !state) {
      setFormError("All fields are required.");
      return false;
    }
    if (inputPass !== confirmPass) {
      setFormError("Passwords do not match.");
      return false;
    }
    setFormError(null);

    try {
      // 1. Check if user already exists in public.users (fully registered)
      const { data: existingUser, error: checkError } = await (supabase as any)
        .from('users')
        .select('id')
        .eq('email', inputEmail)
        .maybeSingle();

      if (checkError) {
        console.error("Error checking for existing user profile:", checkError);
      }

      if (existingUser) {
        setFormError("This email is already registered. Please Sign In.");
        return false;
      }

      let userId: string;

      // 2. Try to signUp with metadata options
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email: inputEmail,
        password: inputPass,
        options: {
          data: {
            full_name: name,
            organization: company,
            phone: phone,
            city: city,
            state: state,
            account_type: role,
          }
        }
      });

      if (signUpError) {
        // Check if error is because they already exist in auth.users (but not in public.users)
        const isAlreadyRegistered = signUpError.message && (
          signUpError.message.toLowerCase().includes("already registered") ||
          signUpError.message.toLowerCase().includes("already exists") ||
          signUpError.status === 400
        );

        if (isAlreadyRegistered) {
          // Attempt sign in to complete and repair registration
          const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
            email: inputEmail,
            password: inputPass,
          });

          if (signInError) {
            if (signInError.message.toLowerCase().includes("invalid login credentials")) {
              setFormError("This email is already registered. Please Sign In.");
            } else {
              setFormError(signInError.message || "Authentication failed.");
            }
            return false;
          }

          if (!signInData.user) {
            setFormError("Registration failed. Please check credentials.");
            return false;
          }

          userId = signInData.user.id;

          // Update user metadata to match new inputs
          await supabase.auth.updateUser({
            data: {
              full_name: name,
              organization: company,
              phone: phone,
              city: city,
              state: state,
              account_type: role,
            }
          });
        } else {
          setFormError(signUpError.message || "Registration failed.");
          return false;
        }
      } else {
        if (!signUpData.user) {
          setFormError("Registration failed. Please check credentials.");
          return false;
        }
        userId = signUpData.user.id;
      }

      // 3. Re-create or verify database profiles
      await repairProfile(userId, name, inputEmail, company, role, phone, city, state);

      // 4. Update local session state and redirect
      await fetchAndCacheUser(userId);
      setIsAuthModalOpen(false);
      
      const welcomeMsg = at("welcomeNewUser").replace("{name}", name);
      setToastMessage(welcomeMsg);
      window.location.href = "/home";
      return true;
    } catch (err: any) {
      console.error("Registration error:", err);
      setFormError(err.message || "Registration failed.");
      return false;
    }
  };

  const updateProfile = async (updatedData: { full_name: string; organization?: string; phone?: string; city?: string; state?: string }): Promise<boolean> => {
    if (!user) return false;
    try {
      const cityState = updatedData.city && updatedData.state ? `${updatedData.city}, ${updatedData.state}` : (updatedData.city || "");
      // Update public.users table
      const { error: userError } = await (supabase as any)
        .from('users')
        .update({
          full_name: updatedData.full_name,
          organization: updatedData.organization || null,
          phone: updatedData.phone || null,
          city: cityState || null
        })
        .eq('id', user.id);

      if (userError) throw userError;

      // Update public.suppliers table if applicable
      if (user.supplierId) {
        const { error: supplierError } = await (supabase as any)
          .from('suppliers')
          .update({
            company_name: updatedData.organization || 'Enterprise Partner',
            location: cityState || 'Hyderabad, Telangana'
          })
          .eq('id', user.supplierId);

        if (supplierError) throw supplierError;
      }

      // Re-fetch and update state cache
      await fetchAndCacheUser(user.id);
      showToast("Profile updated successfully.");
      return true;
    } catch (err: any) {
      console.error("Profile update failed:", err);
      showToast(err.message || "Profile update failed.");
      return false;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Sign out error:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("supply_market_session");
      setToastMessage(at("signOutSuccess"));
      window.location.href = "/home";
    }
  };

  const refreshFollows = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const currentUserId = session?.user?.id;
      if (!currentUserId) {
        setFollowedSupplierIds([]);
        return;
      }
      const { data, error } = await (supabase as any)
        .from('buyer_follows')
        .select('supplier_id')
        .eq('buyer_id', currentUserId);
      
      if (error) {
        console.error("Error loading follows from Supabase:", error);
        return;
      }
      const ids = (data || []).map((row: any) => row.supplier_id);
      setFollowedSupplierIds(ids);
    } catch (err) {
      console.error("Error refreshing follows:", err);
    }
  };

  const followSupplier = async (supplierId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;
    if (!currentUserId) {
      showToast("Please sign in to follow suppliers.");
      openAuthModal();
      return;
    }

    console.log("Follow clicked", supplierId);

    // Prevent duplicate clicks/inserts
    if (followedSupplierIds.includes(supplierId)) {
      console.log("Supplier already followed, ignoring duplicate follow click:", supplierId);
      return;
    }

    try {
      const { error } = await (supabase as any)
        .from('buyer_follows')
        .insert({
          buyer_id: currentUserId,
          supplier_id: supplierId,
          created_at: new Date().toISOString()
        });

      if (error) {
        console.error("Supabase insert follow failed:", error.code, error.message, error.details);
        showToast(`Error following supplier: ${error.message}`);
        return;
      }

      setFollowedSupplierIds(prev => {
        if (prev.includes(supplierId)) return prev;
        return [...prev, supplierId];
      });
      showToast("Supplier added to Hotline Connections.");
    } catch (err) {
      console.error("Error in followSupplier:", err);
    }
  };

  const unfollowSupplier = async (supplierId: string) => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUserId = session?.user?.id;
    if (!currentUserId) return;

    console.log("Unfollow clicked", supplierId);

    try {
      const { error } = await (supabase as any)
        .from('buyer_follows')
        .delete()
        .eq('buyer_id', currentUserId)
        .eq('supplier_id', supplierId);

      if (error) {
        console.error("Supabase delete follow failed:", error.code, error.message, error.details);
        showToast(`Error removing follow: ${error.message}`);
        return;
      }

      setFollowedSupplierIds(prev => prev.filter(id => id !== supplierId));
      showToast("Supplier removed from Hotline Connections.");
    } catch (err) {
      console.error("Error in unfollowSupplier:", err);
    }
  };

  useEffect(() => {
    refreshFollows();
  }, [user?.id]);

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (isRegisterMode) {
      await registerUser(regName, regEmail, regPassword, regConfirmPassword, regOrg, regType, regPhone, regCity, regState);
    } else {
      await signIn(email, password);
    }
  };

  const handleForgotPassword = (e: React.MouseEvent) => {
    e.preventDefault();
    alert(at("forgotPasswordSent"));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthModalOpen,
        openAuthModal,
        closeAuthModal,
        signIn,
        registerUser,
        signOut,
        showToast,
        loading,
        updateProfile,
        followedSupplierIds,
        followSupplier,
        unfollowSupplier,
        refreshFollows
      }}
    >
      {children}

      {/* Global Auth Notifications */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-[9999] animate-fade-in-up">
          <div className="flex items-center gap-2.5 rounded-xl border border-app-border bg-white dark:bg-slate-900 px-4 py-3 shadow-premium-lg">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span className="text-xs font-bold text-app-text">{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Sign In & Register Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 dark:bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          {/* Main Card Container */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-app-border bg-app-card shadow-premium-lg transition-colors duration-300 animate-fade-in-up">
            
            {/* Top Premium Color Bar */}
            <div className="h-2 bg-gradient-to-r from-primary via-secondary to-accent" />

            {/* Header Content */}
            <div className="p-6 pb-4 flex flex-col items-center border-b border-app-border text-center">
              {/* Close Button */}
              <button 
                type="button"
                onClick={closeAuthModal}
                className="absolute top-4 right-4 p-1.5 rounded-lg border border-app-border hover:bg-app-card-hover text-app-text-secondary hover:text-app-text cursor-pointer transition-colors"
                aria-label={at("close")}
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20 mb-3">
                <ShieldCheck className="h-6 w-6" />
              </div>

              <h2 className="text-base font-bold tracking-tight text-app-text uppercase leading-tight">
                {at("nationalPortal")}
              </h2>
              <span className="text-[10px] font-bold text-app-text-secondary uppercase tracking-widest mt-0.5">
                {at("secureGateway")}
              </span>
            </div>

            {/* Form Content */}
            <form onSubmit={handleFormSubmit} className="p-6 space-y-4 text-xs sm:text-sm">
              {formError && (
                <div className="p-2.5 rounded-lg border border-danger/35 bg-danger/10 text-danger font-semibold text-xs leading-normal">
                  {formError}
                </div>
              )}

              {isRegisterMode ? (
                /* Registration View */
                <div className="space-y-3.5 max-h-[360px] overflow-y-auto pr-1">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" />
                      <span>{at("fullName")}</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Sai Kumar"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-app-text focus:border-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>{at("email")}</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="skumar@indocorp.com"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-app-text focus:border-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary" />
                      <span>Mobile Number</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="+91 90008 90009"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-app-text focus:border-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Building className="h-3.5 w-3.5 text-primary" />
                      <span>{at("orgName")}</span>
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="IndoCorp Agro Food Products"
                      value={regOrg}
                      onChange={(e) => setRegOrg(e.target.value)}
                      className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-app-text focus:border-primary outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>City</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Vijayawada"
                        value={regCity}
                        onChange={(e) => setRegCity(e.target.value)}
                        className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-app-text focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                        <MapPin className="h-3.5 w-3.5 text-primary" />
                        <span>State</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="Andhra Pradesh"
                        value={regState}
                        onChange={(e) => setRegState(e.target.value)}
                        className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-app-text focus:border-primary outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <LayoutGrid className="h-3.5 w-3.5 text-primary" />
                      <span>{at("accountType")}</span>
                    </label>
                    <select
                      value={regType}
                      onChange={(e) => setRegType(e.target.value)}
                      className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-app-text focus:border-primary outline-none cursor-pointer"
                    >
                      <option value="both">{at("both")}</option>
                      <option value="buyer">{at("buyer")}</option>
                      <option value="seller">{at("seller")}</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span>{at("password")}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        className="w-full rounded-xl border border-app-border bg-app-bg pl-3.5 pr-10 py-2.5 text-app-text focus:border-primary outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-app-text-secondary hover:text-app-text cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span>Confirm Password</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        className="w-full rounded-xl border border-app-border bg-app-bg pl-3.5 pr-10 py-2.5 text-app-text focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                /* Login View */
                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Mail className="h-3.5 w-3.5 text-primary" />
                      <span>{at("email")}</span>
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="skumar@indocorp.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full rounded-xl border border-app-border bg-app-bg px-3.5 py-2.5 text-app-text focus:border-primary outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-app-text-secondary uppercase flex items-center gap-1.5">
                      <Lock className="h-3.5 w-3.5 text-primary" />
                      <span>{at("password")}</span>
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full rounded-xl border border-app-border bg-app-bg pl-3.5 pr-10 py-2.5 text-app-text focus:border-primary outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-3 flex items-center text-app-text-secondary hover:text-app-text cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <div className="flex items-center justify-between text-xs pt-1">
                    <label className="flex items-center gap-2 cursor-pointer text-app-text-secondary hover:text-app-text select-none">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded text-primary border-app-border focus:ring-primary h-3.5 w-3.5 bg-app-bg cursor-pointer"
                      />
                      <span className="font-semibold">{at("rememberMe")}</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleForgotPassword}
                      className="font-bold text-primary hover:underline cursor-pointer font-sans"
                    >
                      {at("forgotPassword")}
                    </button>
                  </div>
                </div>
              )}

              {/* Submit Buttons */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white py-3 text-sm font-bold shadow-premium cursor-pointer transition-all duration-200"
                >
                  <ShieldCheck className="h-4.5 w-4.5" />
                  <span>{isRegisterMode ? at("register") : at("signIn")}</span>
                </button>
              </div>

              {/* Toggle Mode Link */}
              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setIsRegisterMode(!isRegisterMode);
                    setFormError(null);
                  }}
                  className="font-semibold text-app-text-secondary hover:text-primary transition-colors cursor-pointer text-xs"
                >
                  {isRegisterMode ? at("alreadyHaveAccount") : at("createAccount")}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
