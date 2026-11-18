import React, { useState, useRef, useEffect } from 'react';
import { Send, X, RotateCcw, Wrench } from 'lucide-react';
import { ChatMessage } from '../types/machinery';

interface GeminiAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'welcome',
    role: 'assistant',
    content:
      'HaoSail Technical Desk ready. Ask about 3-phase 400V or single-phase 230V wiring, dust extraction CFM sizing, panel saw or CNC specs, automotive lift bay clearances, or workshop equipment selection.',
    timestamp: 'Ready',
  },
];

const PRESET_PROMPTS = [
  'What dust extraction is needed for the HS-PS3200-SLD Panel Saw?',
  'What concrete slab depth and bay height does the HS-2PL4000-CLR Lift require?',
  'Compare single-phase 230V vs 3-phase 400V for the HS-TH500-PLN Thicknesser.',
  'Size a diesel generator for running workshop machines with HS-SG20-CAN.',
];

export const GeminiAdvisorModal: React.FC<GeminiAdvisorModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [isOpen, messages]);

  const handleSend = async (textToSend?: string) => {
    const text = (textToSend || input).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const newHistory = [...messages, userMsg];
    setMessages(newHistory);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newHistory.map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error('Technical desk unavailable');
      }

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `desk-${Date.now()}`,
        role: 'assistant',
        content:
          data.reply ||
          'Verify full-load amperage against your workshop distribution board and ensure dedicated breaker protection for continuous inductive motor loads.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, assistantMsg]);
    } catch {
      const q = text.toLowerCase();
      const fallbackReply =
        q.includes('cfm') || q.includes('dust') || q.includes('ps3200')
          ? 'For the HS-PS3200-SLD Sliding Table Panel Saw (5.5 kW main motor + 0.75 kW scoring unit), pair with the HS-DC2000-BLU Industrial Dust Collector (2.2 kW twin-bag unit) using 100 mm + 60 mm Y-branch rigid ducting to keep scoring kerfs clean.'
          : q.includes('lift') || q.includes('2pl') || q.includes('slab')
          ? 'The HS-2PL4000-CLR 4.0-Tonne Clear-Floor Two-Post Lift requires a minimum 150 mm C25/30 reinforced concrete slab cured for 28 days, 3,850 mm clear overhead ceiling height, and 20 mm M18 chemical/expansion anchors torqued to spec.'
          : q.includes('230v') || q.includes('3-phase') || q.includes('phase') || q.includes('th500')
          ? 'For heavy inductive loads above 4.0 kW (such as the HS-TH500-PLN 20" Thicknesser or HS-CNC1325-PRO Router), 3-Phase 400V / 50Hz reduces per-phase current draw by ~58%, keeps cables cooler, and supports dedicated C-curve MCBs or soft-start contactors.'
          : q.includes('generator') || q.includes('sg20')
          ? 'The HS-SG20-CAN 20 kVA Soundproof Diesel Generator provides 16 kW prime 3-phase/single-phase output at 68 dBA. When sizing for inductive motors (compressors, panel saws), allow 2.5x–3x starting inrush headroom unless the machine uses a VFD soft-starter.'
          : 'HaoSail Kenya stocks 68 industrial machines across Woodworking, Auto Service, Welding & Metalworking, Construction, and Workshop Lifting & Power Tools. Share your workshop supply voltage (230V 1-Phase or 400V 3-Phase) and target output for specific SKU recommendations.';

      const fallbackMsg: ChatMessage = {
        id: `desk-${Date.now()}`,
        role: 'assistant',
        content: fallbackReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...newHistory, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setMessages(INITIAL_MESSAGES);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#0D0F12]/65 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative z-10 flex h-[620px] max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-[#F3F4F6] shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-5 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#004B97] text-white shrink-0">
              <Wrench className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-sm font-bold text-[#111315] dark:text-white tracking-tight">
                HaoSail Technical Desk
              </h3>
              <p className="font-mono text-[11px] text-[#5A606B] dark:text-slate-400">
                Engineering, Electrical &amp; Workshop Sizing Support
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleReset}
              className="rounded-md p-1.5 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
              title="Reset conversation"
              aria-label="Reset conversation"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-md p-1.5 text-[#5A606B] dark:text-slate-400 hover:bg-[#E2E4E8] dark:hover:bg-[#262A33] hover:text-[#111315] dark:hover:text-white transition-colors cursor-pointer"
              aria-label="Close technical desk"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 bg-[#F6F6F4]/40 dark:bg-[#0D0F12]/40">
          {messages.map((msg) => {
            const isUser = msg.role === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white dark:bg-[#15181E] text-[#004B97] dark:text-sky-400 border border-[#E2E4E8] dark:border-[#262A33] mt-0.5">
                    <Wrench className="h-3.5 w-3.5" />
                  </div>
                )}

                <div
                  className={`max-w-[85%] rounded-lg px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? 'bg-[#004B97] text-white font-medium'
                      : 'border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] text-[#111315] dark:text-slate-200'
                  }`}
                >
                  <div className="whitespace-pre-wrap font-sans">{msg.content}</div>
                  <div
                    className={`mt-1.5 font-mono text-[10px] text-right ${
                      isUser ? 'text-white/75' : 'text-[#5A606B] dark:text-slate-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-white dark:bg-[#15181E] text-[#004B97] dark:text-sky-400 border border-[#E2E4E8] dark:border-[#262A33]">
                <Wrench className="h-3.5 w-3.5" />
              </div>
              <div className="rounded-lg border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-4 py-3 text-xs text-[#5A606B] dark:text-slate-400">
                <span className="font-mono text-[11px]">Checking machine specifications...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Preset Prompt Suggestions */}
        <div className="border-t border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#111318] px-4 py-2.5">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pb-0.5">
            <span className="font-mono text-[10px] uppercase tracking-wider font-semibold text-[#5A606B] dark:text-slate-400 shrink-0">
              Prompts:
            </span>
            {PRESET_PROMPTS.map((promptText, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(promptText)}
                className="shrink-0 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] px-2.5 py-1 text-[11px] text-[#111315] dark:text-slate-300 hover:border-[#004B97] dark:hover:border-sky-400 hover:text-[#004B97] dark:hover:text-sky-300 transition-colors cursor-pointer"
              >
                {promptText}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-[#E2E4E8] dark:border-[#262A33] bg-white dark:bg-[#15181E] p-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-2"
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about motor output, 3-phase wiring, slab requirements, or SKU selection..."
              className="flex-1 rounded-md border border-[#E2E4E8] dark:border-[#262A33] bg-[#F6F6F4] dark:bg-[#0D0F12] px-3.5 py-2 text-xs text-[#111315] dark:text-white placeholder-[#5A606B] dark:placeholder-slate-500 focus:border-[#004B97] dark:focus:border-sky-400 focus:bg-white dark:focus:bg-[#15181E] focus:outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="btn-press btn-nudge flex items-center gap-1.5 rounded-md bg-[#004B97] hover:bg-[#003B78] px-4 py-2 text-xs font-semibold text-white disabled:opacity-40 cursor-pointer"
            >
              <span>Send</span>
              <Send className="h-3.5 w-3.5 btn-arrow" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
