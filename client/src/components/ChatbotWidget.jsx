import { useState, useRef, useEffect } from "react";
import { X, MessageCircle, Send, Video, Minimize2, Maximize2 } from "lucide-react";
import { Button } from "./ui/button";

function renderBotMessage(text) {
  const parts = String(text).split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return <strong key={`bold-${index}`}>{part.slice(2, -2)}</strong>;
    }
    return <span key={`text-${index}`}>{part}</span>;
  });
}

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Hello! I am your Gynecare AI Assistant. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setMessages(prev => [...prev, { role: "user", text: userMessage }]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await fetch("/api/chatbot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) {
        let errData = {};
        try { errData = await response.json(); } catch(e) {}
        throw new Error(errData.details || errData.error || "Network error");
      }

      const data = await response.json();
      setMessages(prev => [...prev, { role: "bot", text: data.reply }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: "bot", text: `Error: ${error.message}` }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Chat Icon */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 h-14 w-14 rounded-full bg-primary text-white shadow-hospital-lg hover:shadow-hospital-xl transition-all duration-300 flex items-center justify-center z-50 animate-in slide-in-from-bottom"
        >
          <MessageCircle className="h-6 w-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] bg-card border border-border rounded-2xl shadow-hospital-xl flex flex-col overflow-hidden z-50 animate-in slide-in-from-bottom-5">
          {/* Header */}
          <div className="bg-primary px-4 py-3 text-primary-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="h-4 w-4" />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Gynecare Assistant</h3>
                <p className="text-[10px] opacity-80">AI Health Guide</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => setShowVideo(!showVideo)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <Video className="h-4 w-4" />
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/20 rounded-lg transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Video Section (Toggleable) */}
          {showVideo && (
            <div className="bg-muted p-2 border-b border-border text-center relative aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/V6g0F8hQy8E"
                title="Understanding Women's Health & Gynecology Basics"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded-lg"
              ></iframe>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground rounded-tr-none" : "bg-card text-foreground border border-border shadow-sm rounded-tl-none"}`}>
                  {msg.role === "bot" ? (
                    <div className="whitespace-pre-wrap leading-relaxed">{renderBotMessage(msg.text)}</div>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            
            {/* Typing Animation */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-card text-foreground border border-border shadow-sm rounded-2xl rounded-tl-none px-4 py-3 flex gap-1 items-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 border-t border-border bg-card flex items-center gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Type your symptoms..."
              className="flex-1 bg-muted border-none rounded-xl px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-primary/50 text-foreground"
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={isTyping}
              className="h-10 w-10 rounded-xl flex-shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
