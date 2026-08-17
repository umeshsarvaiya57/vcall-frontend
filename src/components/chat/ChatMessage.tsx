import React from 'react';
import type { ChatMessageItem } from '../../store/chatStore';
import { cn } from '../../lib/utils';

interface ChatMessageProps {
  message: ChatMessageItem;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isMe = message.sender === 'me';

  return (
    <div
      className={cn(
        "flex flex-col mb-3 max-w-[80%] animate-in fade-in duration-150",
        isMe ? "ml-auto items-end" : "mr-auto items-start"
      )}
    >
      <div className="text-[10px] text-textMuted mb-0.5 px-1 select-none">
        {isMe ? 'You' : 'Stranger'}
      </div>
      <div
        className={cn(
          "px-3 py-2 rounded-2xl text-sm break-words leading-relaxed",
          isMe
            ? "bg-primary text-textLight rounded-tr-none shadow-md shadow-indigo-500/5"
            : "bg-bgSurfaceHover text-textLight border border-borderDark/60 rounded-tl-none"
        )}
      >
        {message.text}
      </div>
    </div>
  );
};
