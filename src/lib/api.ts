import { apiInstance } from './axios';

/**
 * REST API client containing typed endpoints for admin operations and moderation actions.
 */
export const adminApi = {
  health: async () => {
    const res = await apiInstance.get('/health');
    return res.data;
  },

  login: async (credentials: any) => {
    const res = await apiInstance.post('/admin/login', credentials);
    return res.data.data;
  },

  logout: async () => {
    const res = await apiInstance.post('/admin/logout');
    return res.data;
  },

  getReports: async () => {
    const res = await apiInstance.get('/admin/reports');
    return res.data.data;
  },

  dismissReport: async (id: string) => {
    const res = await apiInstance.put(`/admin/reports/${id}`, { status: 'dismissed' });
    return res.data;
  },

  getBans: async () => {
    const res = await apiInstance.get('/admin/bans');
    return res.data.data;
  },

  createBan: async (banData: { sessionId: string; reason: string; durationDays?: number }) => {
    const res = await apiInstance.post('/admin/bans', banData);
    return res.data;
  },

  deleteBan: async (id: string) => {
    const res = await apiInstance.delete(`/admin/bans/${id}`);
    return res.data;
  },

  getAnalytics: async () => {
    const res = await apiInstance.get('/admin/analytics');
    return res.data.data;
  },

  getSettings: async () => {
    const res = await apiInstance.get('/admin/settings');
    return res.data.data;
  },

  updateSettings: async (settings: any) => {
    const res = await apiInstance.put('/admin/settings', settings);
    return res.data.data;
  },
};
