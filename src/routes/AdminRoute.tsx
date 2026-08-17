import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAdminStore } from '../store/adminStore';

export const AdminRoute: React.FC = () => {
  const isAuthenticated = useAdminStore((state) => state.isAuthenticated);

  if (!isAuthenticated) {
    // Redirect unauthenticated admin queries to the admin login portal
    return <Navigate to="/admin" replace />;
  }

  // Allow navigation to nested admin routes
  return <Outlet />;
};
