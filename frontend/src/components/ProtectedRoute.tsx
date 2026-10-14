import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth, UserRole } from '../context/AuthContext';
import { AdminLoginPage } from '../pages/admin/AdminLoginPage';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e40af]"></div>
      </div>
    );
  }

  // If accessing Admin portal and not logged in as ADMIN, render dedicated AdminLoginPage directly
  if (allowedRoles?.includes('ADMIN') && (!user || user.role !== 'ADMIN')) {
    return <AdminLoginPage />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If logged in but accessing another role's area, redirect to their home
    const roleRoutes: Record<UserRole, string> = {
      STUDENT: '/student',
      FACULTY: '/faculty',
      ADMIN: '/admin',
    };
    return <Navigate to={roleRoutes[user.role] || '/login'} replace />;
  }

  return <Outlet />;
};
