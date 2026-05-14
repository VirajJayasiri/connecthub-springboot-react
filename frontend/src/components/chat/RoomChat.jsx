import React, { useState, useRef, useEffect } from "react";
import { Send, Mic, CheckCircle2, MessageSquare } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

const cn = (...inputs) => twMerge(clsx(inputs));

export default function RoomChat({ 
  messages, 
  onSendMessage, 
  onRequestStage, 
  isRequestPending,
  isOnStage,
  currentUserAvatar,
  roomName
}) {
  const [text, setText] = useState("");
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    onSendMessage(text);
    setText("");
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-[#050505] border-t border-gray-100 dark:border-neutral-800">
      {/* Messages List */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-6 py-4 space-y-4"
      >
        {messages.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center opacity-30">
            <MessageSquare size={40} className="mb-2" />
            <p className="text-sm">Be the first to say something!</p>
          </div>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex gap-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-neutral-800 overflow-hidden flex-shrink-0">
                {m.avatar ? (
                  <img src={m.avatar} alt={m.sender} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-500">
                    {m.sender[0]}
                  </div>
                )}
              </div>
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{m.sender}</span>
                  <span className="text-[10px] text-gray-400">{m.time}</span>
                </div>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed break-words">
                  {m.text}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-gray-50/50 dark:bg-neutral-900/30">
        <div className="flex items-center gap-3">
          {/* Request Stage Button */}
          {!isOnStage && (
            <button
              onClick={onRequestStage}
              disabled={isRequestPending}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 whitespace-nowrap",
                isRequestPending
                  ? "bg-green-100 dark:bg-green-950/30 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-900"
                  : "bg-gray-900 dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-sm"
              )}
            >
              {isRequestPending ? (
                <>
                  <CheckCircle2 size={16} />
                  <span>Request Sent</span>
                </>
              ) : (
                <>
                  <Mic size={16} />
                  <span>Request Stage</span>
                </>
              )}
            </button>
          )}

          {/* Chat Input */}
          <div className="flex-1 flex items-center gap-2 bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl px-4 py-2.5 focus-within:ring-2 ring-gray-900/5 dark:ring-white/5 transition-all">
            <input
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder={`Message in #${roomName}...`}
              className="flex-1 bg-transparent text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none"
            />
            <button
              onClick={handleSend}
              disabled={!text.trim()}
              className="text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors disabled:opacity-30"
            >
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
