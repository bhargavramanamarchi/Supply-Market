// Reusable Murf AI Text-to-Speech API Sourcing Service

const LANG_PREFIX_MAP: Record<string, string> = {
  "English": "en",
  "Telugu": "te",
  "Hindi": "hi",
  "Tamil": "ta",
  "Kannada": "kn",
  "Malayalam": "ml"
};

// Global cache for the retrieved voices list to avoid repeated HTTP calls
let cachedVoices: any[] = [];

const fetchVoicesList = async (apiKey: string): Promise<any[]> => {
  if (cachedVoices.length > 0) {
    return cachedVoices;
  }

  const response = await fetch("https://api.murf.ai/v1/speech/voices", {
    method: "GET",
    headers: {
      "api-key": apiKey
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch voices list from Murf API: ${response.statusText}`);
  }

  const data = await response.json();

  // Robust parsing to handle various response formats (e.g., direct array or voices nested array)
  if (Array.isArray(data)) {
    cachedVoices = data;
  } else if (data && Array.isArray(data.voices)) {
    cachedVoices = data.voices;
  } else if (data && typeof data === "object") {
    const foundArray = Object.values(data).find(val => Array.isArray(val));
    if (foundArray) {
      cachedVoices = foundArray;
    }
  }

  return cachedVoices;
};

export const getVoiceIdForLanguage = async (lang: string, apiKey: string): Promise<string> => {
  const voices = await fetchVoicesList(apiKey);
  if (!voices || voices.length === 0) {
    throw new Error("Murf AI returned an empty voices registry.");
  }

  const prefix = LANG_PREFIX_MAP[lang] || "en";

  // Match voice by locale or voiceId prefix matching (e.g., starts with 'te', 'hi', 'en')
  const matchedVoice = voices.find(voice => {
    const locale = (voice.locale || voice.language || "").toLowerCase();
    const voiceIdLower = (voice.voiceId || "").toLowerCase();
    return locale.startsWith(prefix) || voiceIdLower.startsWith(prefix);
  });

  if (matchedVoice && matchedVoice.voiceId) {
    return matchedVoice.voiceId;
  }

  // Gracefully fall back to English if target language is missing
  const englishFallback = voices.find(voice => {
    const locale = (voice.locale || voice.language || "").toLowerCase();
    const voiceIdLower = (voice.voiceId || "").toLowerCase();
    return locale.startsWith("en") || voiceIdLower.startsWith("en");
  });

  if (englishFallback && englishFallback.voiceId) {
    return englishFallback.voiceId;
  }

  // Last resort: return the first available voice
  if (voices[0] && voices[0].voiceId) {
    return voices[0].voiceId;
  }

  throw new Error("No valid voiceId found in the Murf AI library.");
};

export const generateMurfSpeech = async (text: string, lang: string): Promise<string> => {
  const apiKey = import.meta.env.VITE_MURF_API_KEY;
  if (!apiKey) {
    throw new Error("Murf API Key is missing. Configure VITE_MURF_API_KEY in .env");
  }

  // Resolve voice ID dynamically from the API rather than using hardcoded values
  const voiceId = await getVoiceIdForLanguage(lang, apiKey);

  const response = await fetch("https://api.murf.ai/v1/speech/generate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify({
      voiceId,
      text,
      format: "MP3",
      sampleRate: 44100
    })
  });

  if (!response.ok) {
    const errorDetails = await response.text().catch(() => "");
    throw new Error(`Murf AI synthesis failed (${response.status}): ${errorDetails || response.statusText}`);
  }

  const data = await response.json();
  if (!data.audioFile) {
    throw new Error("Invalid response from Murf AI: audioFile URL is missing.");
  }

  return data.audioFile;
};
