import { create } from 'zustand';

export interface ChatMessageItem {
  id: string;
  sender: 'me' | 'stranger';
  text: string;
  timestamp: Date;
}

interface ChatState {
  messages: ChatMessageItem[];
  addMessage: (sender: 'me' | 'stranger', text: string) => void;
  clearMessages: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  addMessage: (sender, text) => {
    const message: ChatMessageItem = {
      id: Math.random().toString(36).substring(2, 9),
      sender,
      text,
      timestamp: new Date(),
    };
    set((state) => ({
      messages: [...state.messages, message],
    }));
  },
  clearMessages: () => set({ messages: [] }),
}));
