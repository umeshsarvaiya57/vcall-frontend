import React, { useState, useEffect, useRef } from 'react';
import { useChat } from '../../hooks/useChat';
import { ChatMessage } from './ChatMessage';
import { Button } from '../ui/Button';
import { Send } from 'lucide-react';
import { MAX_CHAT_MESSAGE_LENGTH } from '../../constants/app.constants';

interface ChatBoxProps {
  dataChannel: RTCDataChannel | null;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ dataChannel }) => {
  const { messages, sendMessage } = useChat(dataChannel);
  const [text, setText] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message append
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      const success = sendMessage(text);
      if (success) {
        setText('');
      }
    }
  };

  const isConnected = dataChannel && dataChannel.readyState === 'open';

  return (
    <div className="flex flex-col h-full bg-bgSurface border border-borderDark/40 rounded-2xl overflow-hidden">
      {/* Chat Titlebar */}
      <div className="px-4 py-3 border-b border-borderDark/60 bg-bgSurface/60 flex items-center justify-between">
        <span className="text-sm font-semibold text-textLight">Text Chat</span>
        <span className={`h-2 w-2 rounded-full ${isConnected ? 'bg-success animate-pulse' : 'bg-textMuted'}`} />
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar min-h-0 bg-slate-950/20">
        {messages.length === 0 ? (
          <div className="h-full flex items-center justify-center text-center p-6">
            <p className="text-xs text-textMuted max-w-[200px] leading-relaxed select-none">
              {isConnected
                ? "Connected! Say hello. Chat messages exist only during this call session."
                : "Waiting for chat stream connection..."}
            </p>
          </div>
        ) : (
          messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Message Row */}
      <form
        onSubmit={handleSend}
        className="p-3 border-t border-borderDark/60 bg-bgSurface/40 flex items-center space-x-2"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value.substring(0, MAX_CHAT_MESSAGE_LENGTH))}
          placeholder={isConnected ? "Type a message..." : "Chat offline"}
          disabled={!isConnected}
          className="flex-1 min-w-0 bg-bgDark border border-borderDark rounded-xl px-3 py-2 text-sm text-textLight placeholder-textMuted focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all disabled:opacity-50"
        />
        <Button
          type="submit"
          variant="primary"
          size="sm"
          disabled={!isConnected || !text.trim()}
          className="rounded-xl px-3 py-2 shrink-0"
          aria-label="Send message"
        >
          <Send className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
};
