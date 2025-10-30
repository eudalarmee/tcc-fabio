import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-12 h-12 border-4 border-[#FF6A3D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#C7D0DD]">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redireciona para login com a URL atual como redirect
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  return children;
}
