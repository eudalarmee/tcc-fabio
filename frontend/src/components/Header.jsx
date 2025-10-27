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
  const { user, logout, getInitial, isAuthenticated } = useAuth();
  const { scrollToSection } = useSmartScroll();

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

          {/* Navegação desktop - esconder em mobile */}
          <nav className="hidden lg:flex items-center space-x-4 md:space-x-8 text-xs md:text-sm font-semibold uppercase tracking-wide">
            <button
              onClick={() => handleNavClick('planilhas')}
              className="text-[#C7D0DD] hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#FF6A3D] after:to-[#FF1493] hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
              Treinos
            </button>
            <button
              onClick={() => handleNavClick('metodologia')}
              className="text-[#C7D0DD] hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#FF6A3D] after:to-[#FF1493] hover:after:w-full after:transition-all after:duration-300 cursor-pointer"
            >
              Metodologia
            </button>
            <Link
              to="/resultados"
              className="text-[#C7D0DD] hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#FF6A3D] after:to-[#FF1493] hover:after:w-full after:transition-all after:duration-300"
            >
              Resultados
            </Link>
            <Link
              to="/criar-treino"
              className="text-[#C7D0DD] hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#FF6A3D] after:to-[#FF1493] hover:after:w-full after:transition-all after:duration-300"
            >
              Criar Treino
            </Link>
            <Link
              to="/meus-treinos"
              className="text-[#C7D0DD] hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#FF6A3D] after:to-[#FF1493] hover:after:w-full after:transition-all after:duration-300"
            >
              Meus Treinos
            </Link>
            <Link
              to="/equipe"
              className="text-[#C7D0DD] hover:text-white transition-colors duration-200 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-gradient-to-r after:from-[#FF6A3D] after:to-[#FF1493] hover:after:w-full after:transition-all after:duration-300"
            >
              Equipe
            </Link>

            {/* Botão ACESSAR ou Chip de usuário logado */}
            {isAuthenticated ? (
              <div className="relative group">
                {/* Chip com inicial do usuário */}
                <button
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] flex items-center justify-center font-bold text-white text-lg shadow-lg hover:scale-110 transition-transform duration-200"
                >
                  {getInitial()}
                </button>
                
                {/* Dropdown menu */}
                <div className="absolute right-0 mt-2 w-48 bg-[#151B23] rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-[#1C2330]">
                  <div className="p-3 border-b border-[#1C2330]">
                    <p className="text-xs text-[#8A95A6] uppercase tracking-wide">Logado como</p>
                    <p className="text-sm text-white font-medium truncate">{user?.email}</p>
                  </div>
                  {user?.role === 'ADMIN' && (
                    <Link
                      to="/admin"
                      className="block w-full text-left px-4 py-3 text-sm text-[#C7D0DD] hover:bg-[#1C2330] hover:text-white transition-colors duration-150"
                    >
                      Painel Admin
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                    className="w-full text-left px-4 py-3 text-sm text-[#C7D0DD] hover:bg-[#1C2330] hover:text-white transition-colors duration-150"
                  >
                    Sair
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary px-6 py-2.5 text-sm"
              >
                Acessar
              </Link>
            )}
          </nav>

          {/* Botão hambúrguer - visível apenas em mobile */}
          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="lg:hidden flex flex-col justify-center items-center w-10 h-10 space-y-1.5 z-[10001]"
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
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9998] lg:hidden"
          onClick={() => setDrawerOpen(false)}
        />
      )}

      {/* Drawer Mobile */}
      <div 
        className={`fixed top-0 right-0 h-full w-[84vw] max-w-[380px] bg-[#0D1117] shadow-2xl z-[10000] lg:hidden transform transition-transform duration-300 ease-out ${
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

