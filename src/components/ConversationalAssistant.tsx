import React, { useState } from "react";
import { 
  Bot, 
  Mic, 
  RefreshCw, 
  Volume2, 
  VolumeX, 
  Minus, 
  X, 
  Send,
  Sparkles,
  Phone,
  Clock,
  MapPin,
  MessageSquare,
  ChevronDown,
  ChevronUp,
  Info
} from "lucide-react";
import type { MatchResult } from "../services/geminiService";
import type { Supplier } from "../services/supplierData";
import { parseRequirement } from "../services/notificationService";

interface ConversationalAssistantProps {
  searchResult: MatchResult;
  language: string;
  isMuted: boolean;
  setIsMuted: (val: boolean) => void;
  isMinimised: boolean;
  setIsMinimised: (val: boolean) => void;
  isSpeaking: boolean;
  isAssistantSpeaking: boolean;
  isAssistantThinking: boolean;
  assistantVoiceListening: boolean;
  assistantSpeechText: string;
  buyerSpeechLive: string;
  conversationLog: Array<{ role: "user" | "assistant"; text: string }>;
  assistantInputText: string;
  setAssistantInputText: (val: string) => void;
  handleAssistantSend: (text: string) => Promise<void>;
  handleCloseVoice: () => void;
  handleConnectSupplier: (supplier: Supplier) => void;
  renderHighlightedTranscript: () => React.ReactNode;
  subtitleContainerRef: React.RefObject<HTMLDivElement | null>;
  startAssistantContinuousSpeech: () => void;
}

export const ConversationalAssistant: React.FC<ConversationalAssistantProps> = ({
  searchResult,
  language,
  isMuted,
  setIsMuted,
  setIsMinimised,
  isSpeaking,
  isAssistantSpeaking,
  isAssistantThinking,
  assistantVoiceListening,
  buyerSpeechLive,
  conversationLog,
  assistantInputText,
  setAssistantInputText,
  handleAssistantSend,
  handleCloseVoice,
  handleConnectSupplier,
  renderHighlightedTranscript,
  subtitleContainerRef,
  startAssistantContinuousSpeech
}) => {
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [textInputOpen, setTextInputOpen] = useState(false);

  // Suppress rendering if the window width is mobile (< 1024px)
  if (window.innerWidth < 1024) {
    return null;
  }

  const assistantState: "ready" | "listening" | "processing" | "speaking" = 
    isAssistantThinking 
      ? "processing" 
      : (isSpeaking || isAssistantSpeaking) 
        ? "speaking" 
        : assistantVoiceListening 
          ? "listening" 
          : "ready";

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

  const handleActionClick = (text: string) => {
    handleAssistantSend(text);
  };

  const handleTextSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (assistantInputText.trim()) {
      handleAssistantSend(assistantInputText);
      setAssistantInputText("");
    }
  };

  const bestSupplier = searchResult.bestSupplier;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      <div className="w-full max-w-lg rounded-3xl border border-white/20 dark:border-slate-800/80 bg-white/80 dark:bg-slate-900/85 p-5 sm:p-6 shadow-premium-lg backdrop-blur-xl animate-fade-in-up m-4 flex flex-col max-h-[88vh] relative overflow-hidden text-app-text transition-all duration-300">
        
        {/* Header controls */}
        <div className="flex justify-between items-center border-b border-app-border/40 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-xs font-bold text-primary uppercase tracking-wide">
              <span className={`h-2 w-2 rounded-full bg-primary ${assistantState === 'listening' ? 'animate-pulse bg-success' : ''}`} />
              <span>AI Procurement Assistant (Desktop)</span>
            </span>
            <span className="text-[10px] font-semibold text-app-text-secondary opacity-60">({language})</span>
          </div>

          {/* Window Controls */}
          <div className="flex items-center gap-1">
            {/* Mute Control */}
            <button
              onClick={() => {
                const nextMute = !isMuted;
                setIsMuted(nextMute);
                if (nextMute) {
                  // Mute actions
                  window.speechSynthesis?.cancel();
                } else {
                  startAssistantContinuousSpeech();
                }
              }}
              title={isMuted ? "Unmute Voice" : "Mute Voice"}
              className={`p-2 rounded-xl transition-all cursor-pointer ${isMuted ? 'bg-danger/10 text-danger hover:bg-danger/20' : 'hover:bg-app-bg text-app-text-secondary'}`}
            >
              {isMuted ? <VolumeX className="h-4.5 w-4.5" /> : <Volume2 className="h-4.5 w-4.5" />}
            </button>

            {/* Minimise Control */}
            <button
              onClick={() => {
                setIsMinimised(true);
                window.speechSynthesis?.cancel();
              }}
              title="Minimise"
              className="p-2 hover:bg-app-bg rounded-xl text-app-text-secondary transition-all cursor-pointer"
            >
              <Minus className="h-4.5 w-4.5" />
            </button>

            {/* Close Control */}
            <button 
              onClick={handleCloseVoice}
              title="Close"
              className="p-2 hover:bg-danger/10 hover:text-danger rounded-xl text-app-text-secondary transition-all cursor-pointer"
            >
              <X className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        {/* Center Orb & Animated waveforms */}
        <div className="flex flex-col items-center justify-center py-5 space-y-4">
          <div className="relative">
            {/* Ripple glow effect */}
            <div 
              className={`absolute inset-0 rounded-full blur-xl transition-all duration-1000 ${
                assistantState === 'ready'
                  ? 'bg-primary/10 scale-100 opacity-50'
                  : assistantState === 'listening'
                    ? 'bg-success/20 scale-110 opacity-70 animate-pulse'
                    : assistantState === 'processing'
                      ? 'bg-accent/20 scale-105 opacity-60 animate-pulse'
                      : 'bg-primary/30 scale-115 opacity-80'
              }`}
            />
            
            {/* intermediate shifting ring */}
            <div 
              className={`absolute -inset-1.5 rounded-full border-2 transition-all duration-700 ${
                assistantState === 'ready'
                  ? 'border-primary/10 scale-95 opacity-30'
                  : assistantState === 'listening'
                    ? 'border-success/30 scale-105 opacity-70 animate-ping'
                    : assistantState === 'processing'
                      ? 'border-accent/30 scale-100 opacity-50 animate-spin-slow'
                      : 'border-primary/20 scale-110 opacity-60 animate-pulse'
              }`}
            />

            {/* Core Orb */}
            <div 
              className={`relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-tr transition-all duration-500 shadow-premium-lg border border-white/20 dark:border-slate-800/80 ${
                assistantState === 'ready'
                  ? 'from-primary to-secondary text-white'
                  : assistantState === 'listening'
                    ? 'from-success/90 via-emerald-500 to-primary/80 text-white animate-pulse'
                    : assistantState === 'processing'
                      ? 'from-accent via-orange-400 to-secondary text-white'
                      : 'from-primary via-indigo-600 to-secondary text-white'
              }`}
            >
              {assistantState === 'processing' ? (
                <RefreshCw className="h-8 w-8 text-white animate-spin" />
              ) : assistantState === 'listening' ? (
                <Mic className="h-8 w-8 text-white animate-pulse" />
              ) : (
                <Bot className="h-9 w-9 text-white" />
              )}
            </div>
          </div>

          {/* Sound waves frequency visualizer for speaking mode */}
          {assistantState === 'speaking' && (
            <div className="flex items-end gap-0.5 h-4.5 mt-2 transition-all duration-300">
              {Array.from({ length: 9 }).map((_, idx) => (
                <span 
                  key={idx}
                  className={`w-0.5 rounded-full bg-primary transform origin-bottom transition-all duration-200 ${
                    idx % 3 === 0 ? 'animate-wave-slow' : idx % 3 === 1 ? 'animate-wave-medium' : 'animate-wave-fast'
                  }`}
                  style={{ animationDelay: `${idx * 0.08}s`, height: '100%' }}
                />
              ))}
            </div>
          )}

          <div className="text-center">
            <h2 className="text-base font-bold text-app-text">{bestSupplier.businessName}</h2>
            <p className="text-[10px] text-app-text-secondary uppercase tracking-wider font-bold mt-0.5">
              {assistantState === 'processing' 
                ? "Evaluating requirement..." 
                : assistantState === 'speaking' 
                  ? "AI Assistant Speaking..." 
                  : assistantState === 'listening' 
                    ? "Listening for voice command..." 
                    : "Ready to assist"}
            </p>
          </div>
        </div>

        {/* Live Subtitles / Highlights */}
        <div 
          ref={subtitleContainerRef}
          className="bg-app-bg border border-app-border rounded-2xl p-3.5 max-h-[90px] overflow-y-auto mb-3.5 text-center text-xs text-app-text leading-relaxed select-none"
        >
          {assistantState === 'listening' && buyerSpeechLive ? (
            <div className="text-primary font-bold animate-pulse">
              {buyerSpeechLive}...
            </div>
          ) : (assistantState === 'speaking') ? (
            renderHighlightedTranscript()
          ) : (
            <div className="text-app-text-secondary italic">
              {assistantState === 'processing' ? "Procuring recommendation..." : "Discuss pricing, certifications, or ask for comparisons."}
            </div>
          )}
        </div>

        {/* Conversation Log Bubble stream */}
        <div className="flex-grow overflow-y-auto space-y-3 pr-1 max-h-[16vh] mb-4 border-t border-app-border/40 pt-3">
          {conversationLog.map((msg, idx) => {
            const isUser = msg.role === "user";
            return (
              <div key={idx} className={`flex gap-2 ${isUser ? 'justify-end' : 'justify-start'}`}>
                <div 
                  className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-normal font-medium ${
                    isUser 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-app-bg border border-app-border text-app-text rounded-tl-none'
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Conversation Action Chips */}
        <div className="flex flex-wrap gap-1.5 justify-center mb-3">
          <button 
            onClick={() => handleActionClick("Explain your recommendation for this supplier.")}
            className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-app-border bg-app-card hover:bg-app-card-hover text-app-text transition-colors cursor-pointer"
          >
            💡 Explain Match
          </button>
          <button 
            onClick={() => handleActionClick("Compare the top matching suppliers for this requirement.")}
            className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-app-border bg-app-card hover:bg-app-card-hover text-app-text transition-colors cursor-pointer"
          >
            ⚖️ Compare Matches
          </button>
          <button 
            onClick={() => handleActionClick("Can you suggest another supplier?")}
            className="text-[10px] font-bold px-2.5 py-1.5 rounded-lg border border-app-border bg-app-card hover:bg-app-card-hover text-app-text transition-colors cursor-pointer"
          >
            🔍 Find Another
          </button>
        </div>

        {/* Action Button Strip */}
        <div className="grid grid-cols-3 gap-2 border-t border-app-border/40 pt-3.5 mb-2">
          {/* WhatsApp Direct */}
          <button
            onClick={handleWhatsAppClick}
            className="flex items-center justify-center gap-1.5 rounded-xl border border-app-border bg-app-card hover:bg-app-card-hover py-2.5 text-xs font-bold text-app-text transition-colors cursor-pointer"
          >
            <MessageSquare className="h-4 w-4 text-emerald-500" />
            <span>WhatsApp</span>
          </button>

          {/* View Details Toggle */}
          <button
            onClick={() => setShowContactDetails(!showContactDetails)}
            className={`flex items-center justify-center gap-1.5 rounded-xl border py-2.5 text-xs font-bold transition-all cursor-pointer ${
              showContactDetails 
                ? 'bg-primary/10 border-primary text-primary' 
                : 'border-app-border bg-app-card hover:bg-app-card-hover text-app-text'
            }`}
          >
            <Info className="h-4 w-4" />
            <span>Contact Details</span>
            {showContactDetails ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
          </button>

          {/* Hotline Connection Dispatcher */}
          <button
            onClick={() => handleConnectSupplier(bestSupplier)}
            className="flex items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 py-2.5 text-xs font-bold text-white shadow-premium cursor-pointer"
          >
            <Phone className="h-3.5 w-3.5" />
            <span>Connect Rep</span>
          </button>
        </div>

        {/* Contact Details Expandable Panel */}
        {showContactDetails && (
          <div className="bg-app-bg border border-app-border rounded-xl p-3 space-y-2 mt-2 text-xs text-left animate-fade-in-up">
            <div className="flex items-center gap-2 border-b border-app-border/40 pb-1.5 font-bold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Supplier Contact Registry</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 text-app-text-secondary">
                <Clock className="h-3 w-3 text-primary" />
                <span className="font-semibold text-[10px]">Hours:</span>
              </div>
              <span className="font-medium text-app-text text-right">{bestSupplier.businessHours || "09:00 AM - 06:00 PM"}</span>

              <div className="flex items-center gap-1.5 text-app-text-secondary">
                <MapPin className="h-3 w-3 text-primary" />
                <span className="font-semibold text-[10px]">Location:</span>
              </div>
              <span className="font-medium text-app-text text-right truncate" title={bestSupplier.location}>{bestSupplier.location}</span>

              <div className="flex items-center gap-1.5 text-app-text-secondary">
                <Phone className="h-3 w-3 text-primary" />
                <span className="font-semibold text-[10px]">Hotline:</span>
              </div>
              <span className="font-bold text-app-text text-right">{bestSupplier.contactNumber}</span>
            </div>
          </div>
        )}

        {/* Manual query keyboard input */}
        <div className="mt-3">
          {textInputOpen ? (
            <form onSubmit={handleTextSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                value={assistantInputText}
                onChange={(e) => setAssistantInputText(e.target.value)}
                placeholder="Ask assistant anything..."
                className="flex-grow rounded-xl border border-app-border bg-app-bg px-3 py-1.5 text-xs text-app-text outline-none focus:border-primary"
              />
              <button 
                type="submit"
                className="p-2 rounded-xl bg-primary text-white hover:opacity-90 cursor-pointer"
              >
                <Send className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setTextInputOpen(false)}
                className="p-2 rounded-xl border border-app-border text-app-text-secondary hover:bg-app-bg cursor-pointer"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <button
              onClick={() => setTextInputOpen(true)}
              className="w-full text-center text-[10px] text-app-text-secondary hover:underline cursor-pointer"
            >
              ⌨️ Toggle Text Input
            </button>
          )}
        </div>

      </div>
    </div>
  );
};
