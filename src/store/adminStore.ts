import { create } from 'zustand';

interface AdminUser {
  id: string;
  username: string;
  role: 'super_admin' | 'moderator';
}

interface AdminState {
  isAuthenticated: boolean;
  adminUser: AdminUser | null;
  setAuth: (user: AdminUser | null) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminState>((set) => ({
  isAuthenticated: false,
  adminUser: null,
  setAuth: (user) => set({ isAuthenticated: !!user, adminUser: user }),
  logout: () => set({ isAuthenticated: false, adminUser: null }),
}));
