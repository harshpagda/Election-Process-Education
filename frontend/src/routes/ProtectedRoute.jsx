import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../store';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;
