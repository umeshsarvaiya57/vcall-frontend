import { useToastStore } from '../store/toastStore';

/**
 * Custom hook to trigger toast notifications across the UI.
 */
export function useToast() {
  const addToast = useToastStore((state) => state.addToast);

  return {
    success: (msg: string) => addToast(msg, 'success'),
    error: (msg: string) => addToast(msg, 'error'),
    info: (msg: string) => addToast(msg, 'info'),
  };
}
