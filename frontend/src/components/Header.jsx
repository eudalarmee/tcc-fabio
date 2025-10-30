import { Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useSmartScroll } from "../hooks/useSmartScroll";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { scrollToSection } = useSmartScroll();

  // Função para pegar inicial do nome do usuário
  const getInitial = () => {
    if (!user?.name) return '?';
    return user.name.charAt(0).toUpperCase();
  };

  // Detecta scroll para adicionar efeito de condensação + blur
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fecha drawer ao trocar de página
  useEffect(() => {
    setDrawerOpen(false);
  }, [location]);

  // Previne scroll quando drawer está aberto
  useEffect(() => {
    if (drawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [drawerOpen]);

  const handleNavClick = (section) => {
    if (location.pathname === '/') {
      scrollToSection(section);
    } else {
      navigate('/');
      setTimeout(() => scrollToSection(section), 100);
    }
    setDrawerOpen(false);
  };

  return (
    <>
      <header 
        className="fixed top-0 left-0 right-0 z-[9999] transition-all duration-300 bg-[#0D1117] py-5 shadow-lg border-b-2 border-[#FF6A3D]"
        style={{ minHeight: '80px' }}
      >
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {/* Logo MUSCLEMAX com gradiente no MAX */}
          <Link to="/" className="flex items-center gap-0 group">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
              MUSCLE
            </span>
            <span 
              className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-300"
            >
              MAX
            </span>
          </Link>

          {/* Botão hambúrguer - visível em todas as telas */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="flex flex-col justify-center items-center w-10 h-10 space-y-1.5 z-[10001]"
            aria-label="Abrir menu"
          >
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${drawerOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${drawerOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${drawerOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
          </button>
        </div>
      </header>

      {/* Backdrop */}
      {drawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998]"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer - visível em todas as telas */}
      <div 
        className={`fixed top-0 right-0 h-full w-[84vw] max-w-[380px] bg-[#0D1117] shadow-2xl z-[10000] transform transition-transform duration-300 ease-out ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
      >
        <div className="flex flex-col h-full">
          {/* Header do Drawer */}
          <div className="flex items-center justify-between p-6 border-b-2 border-[#FF6A3D]">
            <Link to="/" className="flex items-center gap-0" onClick={() => setDrawerOpen(false)}>
              <span className="text-xl font-extrabold tracking-tight text-white">
                MUSCLE
              </span>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
                MAX
              </span>
            </Link>
          </div>

          {/* Links de navegação */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-1">
              <button
                onClick={() => handleNavClick('planilhas')}
                className="block w-full text-left px-4 py-3 text-[#C7D0DD] hover:text-white hover:bg-[#1C2330] rounded-lg transition-all duration-200 text-sm font-semibold uppercase tracking-wide"
              >
                Treinos
              </button>
              <button
                onClick={() => handleNavClick('metodologia')}
                className="block w-full text-left px-4 py-3 text-[#C7D0DD] hover:text-white hover:bg-[#1C2330] rounded-lg transition-all duration-200 text-sm font-semibold uppercase tracking-wide"
              >
                Metodologia
              </button>
              <Link
                to="/resultados"
                className="block px-4 py-3 text-[#C7D0DD] hover:text-white hover:bg-[#1C2330] rounded-lg transition-all duration-200 text-sm font-semibold uppercase tracking-wide"
              >
                Resultados
              </Link>
              
              <div className="my-4 border-t border-[#1C2330]"></div>
              
              <Link
                to="/criar-treino"
                className="block px-4 py-3 text-[#C7D0DD] hover:text-white hover:bg-[#1C2330] rounded-lg transition-all duration-200 text-sm font-semibold uppercase tracking-wide"
              >
                Criar Treino
              </Link>
              <Link
                to="/meus-treinos"
                className="block px-4 py-3 text-[#C7D0DD] hover:text-white hover:bg-[#1C2330] rounded-lg transition-all duration-200 text-sm font-semibold uppercase tracking-wide"
              >
                Meus Treinos
              </Link>
              
              <div className="my-4 border-t border-[#1C2330]"></div>
              
              <Link
                to="/equipe"
                className="block px-4 py-3 text-[#C7D0DD] hover:text-white hover:bg-[#1C2330] rounded-lg transition-all duration-200 text-sm font-semibold uppercase tracking-wide"
              >
                Equipe
              </Link>

              {isAuthenticated && user?.role === 'ADMIN' && (
                <>
                  <div className="my-4 border-t border-[#1C2330]"></div>
                  <Link
                    to="/admin"
                    className="block px-4 py-3 text-[#FF6A3D] hover:text-white hover:bg-[#1C2330] rounded-lg transition-all duration-200 text-sm font-semibold uppercase tracking-wide"
                  >
                    Painel Admin
                  </Link>
                </>
              )}
            </div>
          </nav>

          {/* Footer do Drawer - CTA */}
          <div className="p-6 border-t-2 border-[#1C2330]">
            {isAuthenticated ? (
              <div className="space-y-3">
                <div className="px-4 py-2 bg-[#1C2330] rounded-lg">
                  <p className="text-xs text-[#8A95A6] uppercase tracking-wide">Logado como</p>
                  <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                </div>
                <button
                  onClick={() => {
                    logout();
                    navigate('/');
                    setDrawerOpen(false);
                  }}
                  className="w-full btn-primary py-3"
                >
                  Sair
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="block w-full btn-primary py-3 text-center"
                onClick={() => setDrawerOpen(false)}
              >
                Acessar
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

