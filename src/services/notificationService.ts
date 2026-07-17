// Sourcing Match Notification & Audio Synthesizer Service

export interface MatchNotification {
  id: number;
  text: string;
  time: string;
  unread: boolean;
  supplierId?: string;
}

// Simple helper to extract details from requirement query for the prototype notification
export const parseRequirement = (reqText: string) => {
  // Extract number (Volume) and product
  const numberRegex = /(\d+(?:\.\d+)?)\s*([a-zA-Z]+)?/;
  const match = reqText.match(numberRegex);
  
  let volume = "500"; // default fallback
  let unit = "units"; // default fallback
  if (match) {
    volume = match[1];
    if (match[2]) {
      const u = match[2].toLowerCase();
      // Only set unit if it looks like a real unit, otherwise default to units
      if (["kg", "kgs", "tons", "ton", "bags", "bag", "pieces", "pcs", "units", "unit", "liters", "ltr", "cubic", "cf", "meters", "m"].includes(u)) {
        unit = match[2];
      }
    }
  }

  // Find product category keyword
  let product = "supplies";
  const knownProducts = ["rice", "turmeric", "steel", "wood", "cement", "packaging", "cotton", "electronics"];
  for (const kp of knownProducts) {
    if (reqText.toLowerCase().includes(kp)) {
      product = kp.charAt(0).toUpperCase() + kp.slice(1);
      break;
    }
  }
  
  return { volume, unit, product };
};

// Seeding default notifications
const DEFAULT_NOTIFICATIONS: MatchNotification[] = [
  { id: 1, text: "New connection request from Sai Packaging", time: "5 mins ago", unread: true },
  { id: 2, text: "Sri Lakshmi Enterprises accepted your connection request", time: "1 hour ago", unread: true },
  { id: 3, text: "Structural TMT Rebars back in stock at RK Steel Mart", time: "Today, 10:00 AM", unread: false },
  { id: 4, text: "New buyer Verma Food Industries contacted you", time: "Yesterday", unread: false }
];

export const getStoredNotifications = (): MatchNotification[] => {
  const stored = localStorage.getItem("supply_market_notifications");
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (e) {
      console.error("Error parsing notifications from localStorage", e);
    }
  }
  // If not present, seed with defaults
  localStorage.setItem("supply_market_notifications", JSON.stringify(DEFAULT_NOTIFICATIONS));
  return DEFAULT_NOTIFICATIONS;
};

export const saveNotifications = (notifications: MatchNotification[]) => {
  localStorage.setItem("supply_market_notifications", JSON.stringify(notifications));
  // Dispatch both storage event (for other tabs) and custom event (for the current tab)
  window.dispatchEvent(new CustomEvent("new-notification"));
};

export const sendSupplierNotification = (supplierId: string, requirement: string) => {
  const parsed = parseRequirement(requirement);
  const text = `Supply Market AI has matched you with a buyer requiring ${parsed.volume} ${parsed.unit} of ${parsed.product}.`;
  
  const newNotif: MatchNotification = {
    id: Date.now(),
    text,
    time: "Just now",
    unread: true,
    supplierId
  };

  const current = getStoredNotifications();
  const updated = [newNotif, ...current];
  saveNotifications(updated);
};

// Web Audio API double chime synthesizer ("beep-BEEP")
export const playNotificationChime = () => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();

    // Beep 1 (lower pitch, shorter)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
    gain1.gain.setValueAtTime(0.0, ctx.currentTime);
    gain1.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    osc1.start(ctx.currentTime);
    osc1.stop(ctx.currentTime + 0.12);

    // Beep 2 (higher pitch, longer)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.14); // A5
    gain2.gain.setValueAtTime(0.0, ctx.currentTime + 0.14);
    gain2.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.16);
    gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
    osc2.start(ctx.currentTime + 0.14);
    osc2.stop(ctx.currentTime + 0.35);
  } catch (err) {
    console.warn("Failed to synthesize notification chime:", err);
  }
};

// Module-level variables to hold active ringing audio nodes and intervals
let activeRingInterval: any = null;
let ringCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];
let activeGains: GainNode[] = [];

// Synthesizes a telephone ring cadence for the incoming mobile AI call
export const playPhoneRing = () => {
  // Terminate any active ringing sessions first
  stopPhoneRing();

  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    ringCtx = new AudioContextClass();

    const triggerDoubleRing = () => {
      if (!ringCtx) return;
      const now = ringCtx.currentTime;

      // Telephone ring tones standardly mix 440Hz + 480Hz
      // Ring 1 (starts at now, lasts 450ms)
      const osc1a = ringCtx.createOscillator();
      const osc1b = ringCtx.createOscillator();
      const gain1 = ringCtx.createGain();
      osc1a.type = "sine";
      osc1b.type = "sine";
      osc1a.frequency.setValueAtTime(440, now);
      osc1b.frequency.setValueAtTime(480, now);
      
      osc1a.connect(gain1);
      osc1b.connect(gain1);
      gain1.connect(ringCtx.destination);
      
      gain1.gain.setValueAtTime(0.0, now);
      gain1.gain.linearRampToValueAtTime(0.04, now + 0.05);
      gain1.gain.setValueAtTime(0.04, now + 0.4);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      
      osc1a.start(now);
      osc1b.start(now);
      osc1a.stop(now + 0.45);
      osc1b.stop(now + 0.45);

      // Ring 2 (starts at now + 650ms, lasts 450ms)
      const osc2a = ringCtx.createOscillator();
      const osc2b = ringCtx.createOscillator();
      const gain2 = ringCtx.createGain();
      osc2a.type = "sine";
      osc2b.type = "sine";
      osc2a.frequency.setValueAtTime(440, now + 0.65);
      osc2b.frequency.setValueAtTime(480, now + 0.65);
      
      osc2a.connect(gain2);
      osc2b.connect(gain2);
      gain2.connect(ringCtx.destination);
      
      gain2.gain.setValueAtTime(0.0, now + 0.65);
      gain2.gain.linearRampToValueAtTime(0.04, now + 0.7);
      gain2.gain.setValueAtTime(0.04, now + 1.05);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 1.1);
      
      osc2a.start(now + 0.65);
      osc2b.start(now + 0.65);
      osc2a.stop(now + 1.1);
      osc2b.stop(now + 1.1);

      // Save references for cancellation
      activeOscillators.push(osc1a, osc1b, osc2a, osc2b);
      activeGains.push(gain1, gain2);
    };

    // First ring
    triggerDoubleRing();

    // Loop cadence: 1.1s of sound/pause sequence, followed by 1.9s silence (total 3s cycle)
    activeRingInterval = setInterval(() => {
      activeOscillators = [];
      activeGains = [];
      triggerDoubleRing();
    }, 3000);
  } catch (err) {
    console.warn("Failed to synthesize telephone ring:", err);
  }
};

// Stops the telephone ring cadence and disposes of AudioContext
export const stopPhoneRing = () => {
  if (activeRingInterval) {
    clearInterval(activeRingInterval);
    activeRingInterval = null;
  }

  activeOscillators.forEach(osc => {
    try {
      osc.stop();
    } catch (e) {}
    try {
      osc.disconnect();
    } catch (e) {}
  });
  activeOscillators = [];

  activeGains.forEach(gain => {
    try {
      gain.disconnect();
    } catch (e) {}
  });
  activeGains = [];

  if (ringCtx) {
    try {
      if (ringCtx.state !== "closed") {
        ringCtx.close();
      }
    } catch (e) {}
    ringCtx = null;
  }
};
