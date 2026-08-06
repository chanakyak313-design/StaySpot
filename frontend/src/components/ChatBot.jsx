import { useState } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { API_BASE_URL } from "../services/api";

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Welcome to StaySpot AI! Ask me anything about hostels." },
  ]);
  const [loading, setLoading] = useState(false);

  const updateLastMessage = (updater) => {
    setMessages((prev) => {
      const updated = [...prev];
      const lastIndex = updated.length - 1;
      updated[lastIndex] = updater(updated[lastIndex]);
      return updated;
    });
  };

  const sendMessage = async () => {
    if (!question.trim() || loading) return;

    const userQuestion = question;
    setQuestion("");
    setLoading(true);

    // Add the user's message, then an empty bot bubble that fills in as
    // chunks stream back from Gemini - this is what gives the word-by-word
    // typing effect instead of the whole answer popping in at once.
    setMessages((prev) => [
      ...prev,
      { sender: "user", text: userQuestion },
      { sender: "bot", text: "" },
    ]);

    try {
      const response = await fetch(`${API_BASE_URL}/chatbot/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: userQuestion }),
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
        text: "Unable to connect to the AI server. Try again shortly.",
      }));
    }

    setLoading(false);
  };

  const quickQuestions = [
    "Best hostel under ₹6000",
    "Hostels with WiFi",
    "AC rooms",
    "Food included",
  ];

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed right-6 bottom-6 w-16 h-16 rounded-full poster-border hard-shadow bg-marigold text-ink flex items-center justify-center z-50 hover:-rotate-6 transition-transform"
      >
        {open ? <X size={26} /> : <MessageCircle size={26} />}
      </button>

      {open && (
        <div className="fixed right-6 bottom-24 w-[360px] max-w-[90vw] h-[520px] poster-border hard-shadow rounded-2xl bg-paper flex flex-col overflow-hidden z-50">
          <div className="bg-ink text-white px-4 py-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded-full bg-marigold border-2 border-ink flex items-center justify-center">
              <MessageCircle size={16} className="text-ink" />
            </span>
            <span className="font-display text-base">STAYSPOT AI</span>
          </div>

          <div className="p-3 flex flex-wrap gap-2 border-b-2 border-ink/10">
            {quickQuestions.map((item) => (
              <button
                key={item}
                onClick={() => setQuestion(item)}
                disabled={loading}
                className="stamp-badge text-[10px] px-3 py-1.5 bg-skytape hover:bg-marigold transition-colors disabled:opacity-50"
              >
                {item}
              </button>
            ))}
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((msg, index) => {
              const isStreamingPlaceholder =
                loading && msg.sender === "bot" && index === messages.length - 1 && msg.text === "";

              return (
                <div key={index} className={msg.sender === "user" ? "text-right" : "text-left"}>
                  <span
                    className={`inline-block px-4 py-2.5 rounded-2xl max-w-[80%] whitespace-pre-wrap text-sm font-medium border-2 border-ink ${
                      msg.sender === "user" ? "bg-marigold text-ink" : "bg-skytape text-ink"
                    }`}
                  >
                    {isStreamingPlaceholder ? (
                      <span className="inline-flex gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-ink animate-bounce [animation-delay:-0.3s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-ink animate-bounce [animation-delay:-0.15s]" />
                        <span className="w-1.5 h-1.5 rounded-full bg-ink animate-bounce" />
                      </span>
                    ) : (
                      msg.text
                    )}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center gap-2 p-3 border-t-2 border-ink/10">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask about hostels..."
              disabled={loading}
              className="flex-1 poster-border rounded-xl px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-marigold disabled:opacity-60"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="btn-poster bg-ink text-white p-2.5 hard-shadow-sm disabled:opacity-60"
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
