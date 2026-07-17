import { generateMurfSpeech } from "./murfService";

export interface SpeechRecognitionHook {
  isListening: boolean;
  start: (
    lang: string,
    onResult: (text: string) => void,
    onEnd: () => void,
    onError: (err: string) => void,
    onInterimResult?: (text: string) => void
  ) => void;
  stop: () => void;
  supported: boolean;
}

const LANG_CODE_MAP: Record<string, string> = {
  "English": "en-IN",
  "Telugu": "te-IN",
  "Hindi": "hi-IN",
  "Tamil": "ta-IN",
  "Kannada": "kn-IN",
  "Malayalam": "ml-IN"
};

export const getSpeechRecognition = (): SpeechRecognitionHook => {
  const SpeechRecognitionClass =
    (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

  let recognition: any = null;
  let isListening = false;

  if (SpeechRecognitionClass) {
    recognition = new SpeechRecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = true;
  }

  const start = (
    lang: string,
    onResult: (text: string) => void,
    onEnd: () => void,
    onError: (err: string) => void,
    onInterimResult?: (text: string) => void
  ) => {
    if (!recognition) {
      onError("Speech Recognition is not supported by your browser.");
      return;
    }

    const langCode = LANG_CODE_MAP[lang] || "en-IN";
    recognition.lang = langCode;
    isListening = true;

    recognition.onresult = (event: any) => {
      let finalTranscript = "";
      let interimTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      if (onInterimResult && interimTranscript) {
        onInterimResult(interimTranscript);
      }
      if (finalTranscript) {
        onResult(finalTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      isListening = false;
      // Ignore abort errors that are triggered when manually stopping speech recognition
      if (event.error === 'aborted') return;
      onError(`Voice error: ${event.error}`);
    };

    recognition.onend = () => {
      isListening = false;
      onEnd();
    };

    try {
      recognition.start();
    } catch (e: any) {
      onError(e.message || "Failed to initiate voice recognition.");
    }
  };

  const stop = () => {
    if (recognition && isListening) {
      recognition.stop();
      isListening = false;
    }
  };

  return {
    isListening,
    start,
    stop,
    supported: !!SpeechRecognitionClass,
  };
};

export interface SpeakOptions {
  text: string;
  lang: string;
  onBoundary?: (charIndex: number, charLength: number) => void;
  onEnd?: () => void;
  onError?: (err: any) => void;
  onVoiceFallback?: (isFallback: boolean) => void;
}

let activeAudio: HTMLAudioElement | null = null;
let activeInterval: any = null;

const speakWithBrowserSynthesis = (text: string, lang: string, options: SpeakOptions) => {
  if (!('speechSynthesis' in window)) {
    if (options.onError) options.onError("Speech synthesis not supported in this browser.");
    return;
  }

  // Cancel any active synthesis
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  const langCode = LANG_CODE_MAP[lang] || "en-IN";
  utterance.lang = langCode;

  // Try to find a voice that matches
  const voices = window.speechSynthesis.getVoices();
  const matchedVoice = voices.find(v => v.lang.toLowerCase().replace('_', '-').startsWith(langCode.toLowerCase()));
  if (matchedVoice) {
    utterance.voice = matchedVoice;
  }

  // Set boundary for word highlight updates
  utterance.onboundary = (event) => {
    if (event.name === 'word' && options.onBoundary) {
      options.onBoundary(event.charIndex, event.charLength || 0);
    }
  };

  utterance.onend = () => {
    if (options.onEnd) options.onEnd();
  };

  utterance.onerror = (e) => {
    if (e.error === 'interrupted' || e.error === 'canceled') return;
    if (options.onError) options.onError(e.error || "Browser speech synthesis failed.");
  };

  window.speechSynthesis.speak(utterance);
};

export const speakText = async (options: SpeakOptions) => {
  // Stop any ongoing audio playbacks and clear active intervals
  stopSpeaking();

  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }

  try {
    // Generate the cloud TTS audio URL using Murf API
    const audioUrl = await generateMurfSpeech(options.text, options.lang);

    const audio = new Audio(audioUrl);
    activeAudio = audio;

    // Distribute word timings based on character lengths once metadata loads
    audio.addEventListener("loadedmetadata", () => {
      const duration = audio.duration;
      if (!duration || isNaN(duration)) return;

      const words = options.text.split(" ");
      let charAccumulator = 0;
      const wordInfos = words.map(w => {
        const index = charAccumulator;
        charAccumulator += w.length + 1; // plus space
        return { index, length: w.length, charEnd: charAccumulator };
      });

      const totalChars = charAccumulator || 1;
      const secPerChar = duration / totalChars;

      const wordBoundaries = wordInfos.map(info => ({
        ...info,
        startTime: info.index * secPerChar,
        endTime: info.charEnd * secPerChar
      }));

      let lastTriggeredIndex = -1;

      activeInterval = setInterval(() => {
        if (!activeAudio || activeAudio.paused) return;
        const currentTime = activeAudio.currentTime;

        const activeWordIndex = wordBoundaries.findIndex(
          (w) => currentTime >= w.startTime && currentTime <= w.endTime
        );

        if (activeWordIndex !== -1 && activeWordIndex !== lastTriggeredIndex) {
          lastTriggeredIndex = activeWordIndex;
          const word = wordBoundaries[activeWordIndex];
          if (options.onBoundary) {
            options.onBoundary(word.index, word.length);
          }
        }
      }, 20);
    });

    audio.addEventListener("ended", () => {
      stopSpeaking();
      if (options.onEnd) options.onEnd();
    });

    audio.addEventListener("error", (e) => {
      stopSpeaking();
      console.warn("Murf audio playback error, falling back to Browser Speech Synthesis", e);
      if (options.onVoiceFallback) options.onVoiceFallback(true);
      speakWithBrowserSynthesis(options.text, options.lang, options);
    });

    await audio.play();

  } catch (err: any) {
    stopSpeaking();
    console.warn("Murf synthesis generation failed, falling back to Browser Speech Synthesis", err);
    if (options.onVoiceFallback) options.onVoiceFallback(true);
    speakWithBrowserSynthesis(options.text, options.lang, options);
  }
};

export const stopSpeaking = () => {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if (activeInterval) {
    clearInterval(activeInterval);
    activeInterval = null;
  }
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
};
