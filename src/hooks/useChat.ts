import { useCallback, useEffect } from 'react';
import { useChatStore } from '../store/chatStore';
import { useToast } from './useToast';
import { MAX_CHAT_MESSAGE_LENGTH } from '../constants/app.constants';

/**
 * Hook interface mapping message sends and listeners to the active WebRTC DataChannel.
 */
export function useChat(dataChannel: RTCDataChannel | null) {
  const messages = useChatStore((state) => state.messages);
  const addMessage = useChatStore((state) => state.addMessage);
  const clearMessages = useChatStore((state) => state.clearMessages);
  const toast = useToast();

  useEffect(() => {
    if (!dataChannel) return;

    const handleMessage = (event: MessageEvent) => {
      try {
        const text = event.data;
        if (typeof text === 'string' && text.trim().length > 0) {
          addMessage('stranger', text.substring(0, MAX_CHAT_MESSAGE_LENGTH));
        }
      } catch (err) {
        console.error('Error parsing incoming DataChannel message:', err);
      }
    };

    dataChannel.addEventListener('message', handleMessage);
    return () => {
      dataChannel.removeEventListener('message', handleMessage);
    };
  }, [dataChannel, addMessage]);

  const sendMessage = useCallback((text: string) => {
    if (!dataChannel || dataChannel.readyState !== 'open') {
      toast.error('Chat connection is not active.');
      return false;
    }

    const trimmed = text.trim();
    if (trimmed.length === 0) return false;
    if (trimmed.length > MAX_CHAT_MESSAGE_LENGTH) {
      toast.error(`Message cannot exceed ${MAX_CHAT_MESSAGE_LENGTH} characters.`);
      return false;
    }

    try {
      dataChannel.send(trimmed);
      addMessage('me', trimmed);
      return true;
    } catch (err) {
      console.error('Failed to dispatch DataChannel message:', err);
      toast.error('Message delivery failed.');
      return false;
    }
  }, [dataChannel, addMessage, toast]);

  return {
    messages,
    sendMessage,
    clearMessages,
  };
}
