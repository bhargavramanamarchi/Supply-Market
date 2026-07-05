import { generateMurfSpeech } from "./murfService";

export interface SpeechRecognitionHook {
  isListening: boolean;
  start: (
    lang: string,
    onResult: (text: string) => void,
    onEnd: () => void,
    onError: (err: string) => void
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
    recognition.interimResults = false;
  }

  const start = (
    lang: string,
    onResult: (text: string) => void,
    onEnd: () => void,
    onError: (err: string) => void
  ) => {
    if (!recognition) {
      onError("Speech Recognition is not supported by your browser.");
      return;
    }

    const langCode = LANG_CODE_MAP[lang] || "en-IN";
    recognition.lang = langCode;
    isListening = true;

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    recognition.onerror = (event: any) => {
      isListening = false;
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

export const speakText = async (options: SpeakOptions) => {
  // Stop any ongoing audio playbacks and clear active intervals
  stopSpeaking();

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
      if (options.onError) options.onError(e);
    });

    await audio.play();

  } catch (err: any) {
    stopSpeaking();
    if (options.onError) {
      options.onError(err.message || "Unable to generate AI voice.");
    }
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
};
