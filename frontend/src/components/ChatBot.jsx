import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, RotateCcw, Sparkles, Bot } from "lucide-react";
import { API_BASE_URL } from "../services/api";

const STORAGE_KEY = "stayspot_chat_history";

const WELCOME_MESSAGE = {
  sender: "bot",
  text: "Hey! I'm StaySpot AI 👋 Ask me anything about student hostels, PGs, prices, or amenities across India.",
};

function loadStoredMessages() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : null;
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : [WELCOME_MESSAGE];
  } catch {
    return [WELCOME_MESSAGE];
  }
}

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState(loadStoredMessages);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const updateLastMessage = (updater) => {
    setMessages((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = updater(updated[lastIndex]);
      return updated;
    });
  };

  const clearChat = () => {
    setMessages([WELCOME_MESSAGE]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const sendMessage = async (overrideText) => {
    const textToSend = overrideText || question;
    if (!textToSend.trim() || loading) return;

    const userQuestion = textToSend;
    const historyForRequest = messages;

    setQuestion("");
    setLoading(true);

    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userQuestion },
      { sender: "bot", text: "" },
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: userQuestion,
          history: historyForRequest,
        }),
      });

      if (!response.ok || !response.body) {
        throw new Error("Stream failed");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        updateLastMessage((msg) => ({ ...msg, text: msg.text + chunkText }));
      }
    } catch (error) {
      console.error(error);
      updateLastMessage((msg) => ({
        ...msg,
        text: "I'm having a brief connection hitch. Please explore our listings directly or try again in a second!",
      }));
    }

    setLoading(false);
  };

  const quickQuestions = [
    "PG under ₹6000",
    "Hostels with WiFi & Food",
    "Private AC room in Bangalore",
    "Gachibowli Hyderabad",
  ];

  return (
    <>
      {/* Floating Trigger Button */}
      <button
        onClick={() => setOpen(!open)}
        aria-label="Open AI Hostel Assistant"
        className="fixed right-6 bottom-6 w-16 h-16 rounded-full poster-border hard-shadow-coral bg-marigold text-ink flex items-center justify-center z-50 hover:scale-105 transition-transform group"
      >
        {open ? (
          <X size={26} strokeWidth={2.5} />
        ) : (
          <div className="relative">
            <Sparkles size={24} className="text-ink group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-coral rounded-full border-2 border-ink animate-ping" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-coral rounded-full border-2 border-ink" />
          </div>
        )}
      </button>

      {/* Floating Chat Modal */}
      {open && (
        <div className="fixed right-4 md:right-6 bottom-24 w-[380px] max-w-[92vw] h-[550px] poster-border hard-shadow rounded-2xl bg-paper flex flex-col overflow-hidden z-50 animate-in fade-in slide-in-from-bottom-4 duration-200">
          {/* Header */}
          <div className="bg-ink text-white px-5 py-4 flex items-center justify-between gap-2 border-b-2 border-ink">
            <div className="flex items-center gap-2.5">
              <span className="w-8 h-8 rounded-full bg-marigold border-2 border-ink flex items-center justify-center">
                <Bot size={18} className="text-ink" />
              </span>
              <div>
                <p className="font-display text-sm tracking-wide">STAYSPOT AI ASSISTANT</p>
                <div className="flex items-center gap-1.5 text-[10px] text-mint">
                  <span className="w-1.5 h-1.5 rounded-full bg-mint animate-pulse" /> Live & Ready
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={clearChat}
                disabled={loading}
                title="Restart conversation"
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <RotateCcw size={15} />
              </button>
              <button
                onClick={() => setOpen(false)}
                className="text-white/60 hover:text-white transition-colors p-1"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Prompt Quick Chips */}
          <div className="p-2.5 bg-skytape/60 flex flex-wrap gap-1.5 border-b-2 border-ink/10">
            {quickQuestions.map((item) => (
              <button
                key={item}
                onClick={() => sendMessage(item)}
                disabled={loading}
                className="stamp-badge text-[10px] px-2.5 py-1 bg-paper hover:bg-marigold transition-colors disabled:opacity-50 font-bold"
              >
                {item}
              </button>
            ))}
          </div>

          {/* Messages Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-paper">
            {messages.map((msg, index) => {
              const isStreamingPlaceholder =
                loading && msg.sender === "bot" && index === messages.length - 1 && msg.text === "";

              return (
                <div
                  key={index}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`px-4 py-2.5 rounded-2xl max-w-[85%] text-xs md:text-sm font-medium border-2 border-ink ${
                      msg.sender === "user"
                        ? "bg-marigold text-ink rounded-br-none"
                        : "bg-skytape text-ink rounded-bl-none whitespace-pre-wrap leading-relaxed"
                    }`}
                  >
                    {isStreamingPlaceholder ? (
                      <span className="inline-flex items-center gap-1 py-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-ink animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-ink animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-ink animate-bounce" />
                      </span>
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Footer */}
          <div className="p-3 bg-paper border-t-2 border-ink/15 flex items-center gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about rooms, rent, WiFi..."
              disabled={loading}
              className="flex-1 poster-border rounded-xl px-3.5 py-2.5 text-xs md:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-marigold disabled:opacity-60 bg-paper"
            />
            <button
              onClick={() => sendMessage()}
              disabled={loading || !question.trim()}
              className="btn-poster bg-marigold text-ink p-2.5 hard-shadow-sm disabled:opacity-50"
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ChatBot;
