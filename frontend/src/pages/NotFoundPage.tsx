import React from 'react';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center items-center p-4 text-center">
      <div className="w-16 h-16 rounded-full bg-[#800020]/10 text-[#800020] flex items-center justify-center font-black text-2xl mb-4">
        404
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Page Not Found</h1>
      <p className="text-slate-500 text-sm mt-1 max-w-sm">
        The requested resource or portal route does not exist or has been moved.
      </p>
      <Link
        to="/login"
        className="mt-6 inline-flex items-center px-4 py-2 bg-[#800020] text-white text-xs font-semibold rounded-xl hover:bg-[#66001a] transition"
      >
        <Home className="w-4 h-4 mr-1.5" /> Return to Login
      </Link>
    </div>
  );
};
