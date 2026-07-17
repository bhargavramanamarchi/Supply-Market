import React, { useState, useEffect } from "react";
import { 
  Bot, 
  Mic, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Phone, 
  PhoneOff, 
  MessageSquare, 
  Info,
  Sparkles,
  Clock,
  MapPin,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import type { MatchResult } from "../services/geminiService";
import { playPhoneRing, stopPhoneRing, parseRequirement } from "../services/notificationService";

interface AICallExperienceProps {
  searchResult: MatchResult;
  language: string;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  isSpeaking: boolean;
  isAssistantSpeaking: boolean;
  isAssistantThinking: boolean;
  assistantVoiceListening: boolean;
  buyerSpeechLive: string;
  conversationLog: Array<{ role: "user" | "assistant"; text: string }>;
  handleAssistantSend: (text: string) => Promise<void>;
  handleCloseVoice: () => void;
  renderHighlightedTranscript: () => React.ReactNode;
  subtitleContainerRef: React.RefObject<HTMLDivElement | null>;
  startAssistantSpeaking: (text: string) => Promise<void>;
  startAssistantContinuousSpeech: () => void;
}

export const AICallExperience: React.FC<AICallExperienceProps> = ({
  searchResult,
  language,
  isMuted,
  setIsMuted,
  isSpeaking,
  isAssistantSpeaking,
  isAssistantThinking,
  assistantVoiceListening,
  buyerSpeechLive,
  conversationLog,
  handleAssistantSend,
  handleCloseVoice,
  renderHighlightedTranscript,
  subtitleContainerRef,
  startAssistantSpeaking,
  startAssistantContinuousSpeech
}) => {
  const [isAccepted, setIsAccepted] = useState(false);
  const [isSpeakerActive, setIsSpeakerActive] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  // Suppress rendering if the window width is desktop (>= 1024px)
  if (window.innerWidth >= 1024) {
    return null;
  }

  // Handle phone ringing audio state
  useEffect(() => {
    if (!isAccepted) {
      playPhoneRing();
    } else {
      stopPhoneRing();
    }
    return () => {
      stopPhoneRing();
    };
  }, [isAccepted]);

  const handleAccept = () => {
    setIsAccepted(true);
    // Trigger proactive AI call introduction
    startAssistantSpeaking(searchResult.voiceTranscript);
  };

  const handleDecline = () => {
    stopPhoneRing();
    handleCloseVoice();
  };

  const handleMuteToggle = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (nextMute) {
      window.speechSynthesis?.cancel();
    } else {
      startAssistantContinuousSpeech();
    }
  };

  const handleWhatsAppClick = () => {
    const supplier = searchResult.bestSupplier;
    const cleanPhone = supplier.contactNumber.replace(/[^0-9]/g, "");
    const parsed = parseRequirement(searchResult.aiSummary.requirement);
    
    const message = `Hello ${supplier.businessName}, I am contacting you via Supply Market. I am interested in sourcing ${parsed.product}. Specifically, my requirements are:
- Requirement: ${searchResult.aiSummary.requirement}
- Quantity: ${searchResult.aiSummary.quantity}
- Delivery Location: ${searchResult.aiSummary.location || "As discussed"}

Could you please confirm availability and provide a commercial quote? Thank you.`;

    const whatsappUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  const handleCompareClick = () => {
    handleAssistantSend("Compare the top matching suppliers for this requirement.");
  };

  const assistantState: "ready" | "listening" | "processing" | "speaking" = 
    isAssistantThinking 
      ? "processing" 
      : (isSpeaking || isAssistantSpeaking) 
        ? "speaking" 
        : assistantVoiceListening 
          ? "listening" 
          : "ready";

  const bestSupplier = searchResult.bestSupplier;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 text-white overflow-hidden p-6 justify-between select-none">
      
      {/* 1. Incoming Call Screen */}
      {!isAccepted ? (
        <div className="flex flex-col flex-grow items-center justify-between py-12 animate-fade-in">
          {/* Header */}
          <div className="text-center space-y-2 mt-8">
            <span className="inline-flex items-center gap-1.5 bg-primary/20 border border-primary/30 text-secondary text-[10px] font-extrabold uppercase px-3 py-1 rounded-full tracking-wider animate-pulse">
              Incoming AI Sourcing Call
            </span>
            <h1 className="text-2xl font-extrabold tracking-tight mt-3 text-white">Supply Market Assistant</h1>
            <p className="text-xs text-slate-400 font-medium">Connecting match recommendation...</p>
          </div>

          {/* Pulsing visual element */}
          <div className="relative my-auto flex items-center justify-center">
            {/* Outer rings */}
            <div className="absolute h-36 w-36 rounded-full border-2 border-primary/20 scale-125 animate-pulse-ripple" />
            <div className="absolute h-36 w-36 rounded-full border-2 border-secondary/20 scale-100 animate-pulse-ripple" style={{ animationDelay: "0.6s" }} />
            
            {/* Core icon */}
            <div className="relative flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-tr from-primary via-teal-700 to-secondary text-white shadow-2xl border border-white/20 animate-float-slow">
              <Bot className="h-12 w-12 text-white animate-bounce" style={{ animationDuration: "2.5s" }} />
            </div>
          </div>

          {/* Supplier Match preview info box */}
          <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-4 text-center space-y-1">
            <p className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wide">Best Sourced Match</p>
            <h3 className="text-base font-bold text-white">{bestSupplier.businessName}</h3>
            <p className="text-xs text-slate-300">Score: {bestSupplier.trustScore}% Trust Score • Rating: {bestSupplier.rating} ⭐</p>
          </div>

          {/* Actions */}
          <div className="flex gap-12 w-full justify-center items-center mt-6">
            {/* Decline button */}
            <button
              onClick={handleDecline}
              className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-danger text-white shadow-lg hover:bg-danger/90 transition-all border border-danger/30">
                <PhoneOff className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide">Decline</span>
            </button>

            {/* Accept button */}
            <button
              onClick={handleAccept}
              className="flex flex-col items-center gap-2 cursor-pointer focus:outline-none"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-success text-white shadow-lg hover:bg-success/90 transition-all border border-success/30 animate-pulse">
                <Phone className="h-6 w-6" />
              </div>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wide animate-pulse">Accept</span>
            </button>
          </div>
        </div>
      ) : (
        // 2. Active Call Screen
        <div className="flex flex-col flex-grow justify-between animate-fade-in h-full">
          {/* Header */}
          <div className="flex justify-between items-center border-b border-white/10 pb-4">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-success animate-pulse" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Active Procurement Call</span>
            </div>
            <span className="text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded text-slate-300">
              {language.toUpperCase()}
            </span>
          </div>

          {/* Core pulsing/speaking orb */}
          <div className="flex flex-col items-center justify-center my-auto space-y-6 py-6">
            <div className="relative">
              {/* Outer pulsing ring glow */}
              <div 
                className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${
                  assistantState === 'ready'
                    ? 'bg-primary/20 scale-100 opacity-60 animate-pulse'
                    : assistantState === 'listening'
                      ? 'bg-success/40 scale-110 opacity-80 animate-ping'
                      : assistantState === 'processing'
                        ? 'bg-accent/30 scale-105 opacity-70 animate-pulse'
                        : 'bg-primary/40 scale-120 opacity-90 animate-pulse'
                }`}
                style={{ animationDuration: assistantState === 'ready' ? '3s' : '1.5s' }}
              />
              
              {/* Shifting wave ring */}
              <div 
                className={`absolute -inset-2 rounded-full border-2 transition-all duration-700 ${
                  assistantState === 'ready'
                    ? 'border-primary/15 scale-95 opacity-40'
                    : assistantState === 'listening'
                      ? 'border-success/40 scale-105 opacity-80 animate-ping'
                      : assistantState === 'processing'
                        ? 'border-accent/40 scale-100 opacity-60 animate-spin'
                        : 'border-primary/30 scale-110 opacity-70 animate-pulse'
                }`}
              />

              {/* Main core orb body */}
              <div 
                className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-tr transition-all duration-500 z-10 shadow-premium-lg border-2 ${
                  assistantState === 'ready'
                    ? 'from-primary to-secondary border-white/20'
                    : assistantState === 'listening'
                      ? 'from-success/90 via-teal-500 to-primary/80 border-success/30 animate-pulse'
                      : assistantState === 'processing'
                        ? 'from-accent via-orange-400 to-secondary/80 border-accent/30 animate-spin-slow'
                        : 'from-primary via-indigo-500 to-secondary border-primary/40'
                }`}
              >
                {assistantState === 'processing' ? (
                  <RefreshCw className="h-9 w-9 text-white animate-spin" />
                ) : assistantState === 'listening' ? (
                  <Mic className="h-9 w-9 text-white animate-pulse" />
                ) : (
                  <Bot className={`h-11 w-11 text-white ${(assistantState === 'speaking') ? 'animate-bounce' : ''}`} />
                )}
              </div>
            </div>

            {/* Speaking Frequency Waveforms */}
            {assistantState === 'speaking' && (
              <div className="flex items-end gap-1 h-5 mt-2 transition-all duration-300">
                {Array.from({ length: 9 }).map((_, idx) => (
                  <span 
                    key={idx}
                    className={`w-1 rounded-full bg-primary transform origin-bottom transition-all duration-200 ${
                      idx % 3 === 0 ? 'animate-wave-slow' : idx % 3 === 1 ? 'animate-wave-medium' : 'animate-wave-fast'
                    }`}
                    style={{ animationDelay: `${idx * 0.08}s`, height: '100%' }}
                  />
                ))}
              </div>
            )}

            <div className="text-center">
              <h2 className="text-lg font-bold tracking-tight text-white">{bestSupplier.businessName}</h2>
              <p className="text-xs text-slate-400 mt-1 uppercase font-bold tracking-wider">
                {assistantState === 'processing' 
                  ? "Evaluating requirement..." 
                  : assistantState === 'speaking' 
                    ? "AI Sourcing Agent Speaking..." 
                    : assistantState === 'listening' 
                      ? "Listening. Speak now..." 
                      : "Call connected"}
              </p>
            </div>
          </div>

          {/* Subtitles Overlay */}
          <div 
            ref={subtitleContainerRef}
            className="bg-white/5 border border-white/10 rounded-2xl p-4 max-h-[90px] overflow-y-auto mb-3 text-center text-slate-200 text-sm leading-relaxed"
          >
            {assistantState === 'listening' && buyerSpeechLive ? (
              <div className="font-bold text-primary animate-pulse">
                {buyerSpeechLive}...
              </div>
            ) : (assistantState === 'speaking') ? (
              renderHighlightedTranscript()
            ) : (
              <div className="text-xs text-slate-400 italic">
                {assistantState === 'processing' ? "AI is processing..." : "Ready to speak..."}
              </div>
            )}
          </div>

          {/* Conversation Log bubbles under the Orb */}
          <div className="flex-grow overflow-y-auto space-y-3.5 pr-1 max-h-[15vh] mb-3 border-t border-white/5 pt-3">
            {conversationLog.map((msg, idx) => {
              const isUser = msg.role === "user";
              return (
                <div key={idx} className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div 
                    className={`max-w-[80%] rounded-xl px-3 py-2 text-xs font-medium leading-normal ${
                      isUser 
                        ? 'bg-primary text-white rounded-tr-none' 
                        : 'bg-white/5 border border-white/10 text-slate-200 rounded-tl-none'
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Fast Action Buttons Strip */}
          <div className="grid grid-cols-3 gap-2 mb-3.5">
            {/* WhatsApp */}
            <button
              onClick={handleWhatsAppClick}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold border border-white/10 cursor-pointer"
            >
              <MessageSquare className="h-4 w-4 text-emerald-500" />
              <span>WhatsApp</span>
            </button>

            {/* Details Toggle */}
            <button
              onClick={() => setShowDetails(!showDetails)}
              className={`flex items-center justify-center gap-1.5 p-2 rounded-xl text-xs font-bold border cursor-pointer ${
                showDetails 
                  ? 'bg-primary/20 border-primary text-primary' 
                  : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-300'
              }`}
            >
              <Info className="h-4 w-4" />
              <span>Details</span>
              {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {/* Compare Quick Prompt */}
            <button
              onClick={handleCompareClick}
              className="flex items-center justify-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold border border-white/10 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span>Compare</span>
            </button>
          </div>

          {/* Contact Details Panel */}
          {showDetails && (
            <div className="bg-slate-900 border border-white/10 rounded-xl p-3.5 space-y-2 mb-3 text-xs text-left animate-fade-in-up">
              <div className="flex items-center gap-1.5 font-bold text-primary pb-1 border-b border-white/5">
                <ShieldCheck className="h-4 w-4" />
                <span>Supplier Registry Contact Details</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="h-3 w-3" />
                  <span>Business Hours:</span>
                </div>
                <span className="text-right font-medium text-slate-200">{bestSupplier.businessHours || "09:00 AM - 06:00 PM"}</span>

                <div className="flex items-center gap-1 text-slate-400">
                  <MapPin className="h-3 w-3" />
                  <span>Location:</span>
                </div>
                <span className="text-right font-medium text-slate-200 truncate" title={bestSupplier.location}>{bestSupplier.location}</span>

                <div className="flex items-center gap-1 text-slate-400">
                  <Phone className="h-3 w-3" />
                  <span>Sales Hotline:</span>
                </div>
                <span className="text-right font-bold text-white">{bestSupplier.contactNumber}</span>
              </div>
            </div>
          )}

          {/* Active Call Controls */}
          <div className="grid grid-cols-3 gap-4 pb-2">
            {/* Mute Button */}
            <button
              onClick={handleMuteToggle}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                isMuted 
                  ? 'bg-danger/20 border-danger/40 text-danger' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              {isMuted ? <VolumeX className="h-6 w-6" /> : <Volume2 className="h-6 w-6" />}
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                {isMuted ? "Unmute" : "Mute"}
              </span>
            </button>

            {/* End Call Button */}
            <button
              onClick={handleDecline}
              className="flex flex-col items-center justify-center p-3 rounded-2xl bg-danger text-white hover:opacity-90 transition-all cursor-pointer border border-danger/30"
            >
              <PhoneOff className="h-6 w-6" />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">End Call</span>
            </button>

            {/* Connect / Hands-free Speaker toggle */}
            <button
              onClick={() => setIsSpeakerActive(!isSpeakerActive)}
              className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all cursor-pointer ${
                isSpeakerActive 
                  ? 'bg-success/20 border-success/40 text-success' 
                  : 'bg-white/5 border-white/10 text-slate-300 hover:bg-white/10'
              }`}
            >
              <Volume2 className="h-6 w-6" />
              <span className="text-[10px] font-bold mt-1 uppercase tracking-wider">
                {isSpeakerActive ? "Speaker ON" : "Speaker OFF"}
              </span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
