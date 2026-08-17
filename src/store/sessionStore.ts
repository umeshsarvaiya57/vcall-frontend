import { create } from 'zustand';
import { generateSessionId } from '../lib/utils';

interface SessionState {
  sessionId: string;
  gender: 'male' | 'female' | null;
  setGender: (gender: 'male' | 'female') => void;
  clearSession: () => void;
}

export const useSessionStore = create<SessionState>((set) => {
  // Retrieve or generate anonymous sessionId
  let storedSessionId = sessionStorage.getItem('sessionId');
  if (!storedSessionId) {
    storedSessionId = generateSessionId();
    sessionStorage.setItem('sessionId', storedSessionId);
  }

  const storedGender = sessionStorage.getItem('gender') as 'male' | 'female' | null;

  return {
    sessionId: storedSessionId,
    gender: storedGender,
    setGender: (gender) => {
      sessionStorage.setItem('gender', gender);
      set({ gender });
    },
    clearSession: () => {
      const newSessionId = generateSessionId();
      sessionStorage.setItem('sessionId', newSessionId);
      sessionStorage.removeItem('gender');
      set({ sessionId: newSessionId, gender: null });
    },
  };
});
