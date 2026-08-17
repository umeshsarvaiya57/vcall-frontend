import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { HomePage } from '../pages/Home/HomePage';
import { GenderPage } from '../pages/Gender/GenderPage';
import { WaitingPage } from '../pages/Waiting/WaitingPage';
import { ChatPage } from '../pages/Chat/ChatPage';
import { SafetyPage } from '../pages/Safety/SafetyPage';

import { AdminLoginPage } from '../pages/Admin/AdminLoginPage';
import { AdminLayout } from '../pages/Admin/AdminLayout';
import { DashboardPage } from '../pages/Admin/DashboardPage';
import { ReportsPage } from '../pages/Admin/ReportsPage';
import { BansPage } from '../pages/Admin/BansPage';
import { AnalyticsPage } from '../pages/Admin/AnalyticsPage';
import { SettingsPage } from '../pages/Admin/SettingsPage';

import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/gender" element={<GenderPage />} />
      <Route path="/safety" element={<SafetyPage />} />

      {/* User Protected Pages (Requires gender setting) */}
      <Route element={<ProtectedRoute />}>
        <Route path="/waiting" element={<WaitingPage />} />
        <Route path="/chat" element={<ChatPage />} />
      </Route>

      {/* Admin Login portal */}
      <Route path="/admin" element={<AdminLoginPage />} />

      {/* Admin Control Dashboard Paths */}
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<DashboardPage />} />
          <Route path="/admin/reports" element={<ReportsPage />} />
          <Route path="/admin/bans" element={<BansPage />} />
          <Route path="/admin/analytics" element={<AnalyticsPage />} />
          <Route path="/admin/settings" element={<SettingsPage />} />
          <Route path="/admin/*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>

      {/* Catch-all General redirects */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};
