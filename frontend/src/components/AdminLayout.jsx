import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#0D1117] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#151B23] border-r-2 border-[#1C2330] flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b-2 border-[#FF6A3D]">
          <Link to="/" className="flex items-center gap-0 group">
            <span className="text-xl font-extrabold tracking-tight text-white">
              MUSCLE
            </span>
            <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
              MAX
            </span>
          </Link>
          <p className="text-xs text-[#8A95A6] mt-2 uppercase tracking-wide">Painel Admin</p>
        </div>

        {/* Navegação */}
        <nav className="flex-1 p-4 space-y-2">
          <Link
            to="/admin"
            className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive('/admin')
                ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white font-semibold'
                : 'text-[#C7D0DD] hover:bg-[#1C2330] hover:text-white'
            }`}
          >
            📊 Dashboard
          </Link>
          <Link
            to="/admin/users"
            className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive('/admin/users')
                ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white font-semibold'
                : 'text-[#C7D0DD] hover:bg-[#1C2330] hover:text-white'
            }`}
          >
            👥 Usuários
          </Link>
          <Link
            to="/admin/workouts"
            className={`block px-4 py-3 rounded-lg transition-all duration-200 ${
              isActive('/admin/workouts')
                ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white font-semibold'
                : 'text-[#C7D0DD] hover:bg-[#1C2330] hover:text-white'
            }`}
          >
            💪 Treinos
          </Link>

          <div className="my-4 border-t border-[#1C2330]"></div>

          <Link
            to="/"
            className="block px-4 py-3 rounded-lg text-[#C7D0DD] hover:bg-[#1C2330] hover:text-white transition-all duration-200"
          >
            🏠 Voltar ao Site
          </Link>
        </nav>

        {/* Usuário */}
        <div className="p-4 border-t-2 border-[#1C2330]">
          <div className="px-4 py-3 bg-[#1C2330] rounded-lg mb-3">
            <p className="text-xs text-[#8A95A6] uppercase tracking-wide">Logado como</p>
            <p className="text-sm text-white font-medium truncate">{user?.email}</p>
            <span className="inline-block mt-1 px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white rounded">
              ADMIN
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Sair
          </button>
        </div>
      </aside>

      {/* Conteúdo Principal */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
