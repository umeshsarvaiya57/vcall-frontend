import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSessionStore } from '../store/sessionStore';

export const ProtectedRoute: React.FC = () => {
  const gender = useSessionStore((state) => state.gender);

  if (!gender) {
    // Redirect to gender selection if no gender has been selected yet
    return <Navigate to="/gender" replace />;
  }

  return <Outlet />;
};
