import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Limpa erro ao digitar
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validações
    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return;
    }

    if (!formData.password) {
      setError('Senha é obrigatória');
      return;
    }

    try {
      setLoading(true);
      await login(formData.email, formData.password);
      
      // Redireciona para a página de destino ou home
      const redirectTo = searchParams.get('redirect') || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Entrar no <span className="bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">MuscleMax</span>
            </h1>
            <p className="text-[#C7D0DD]">Acesse sua conta e continue treinando</p>
          </div>

          <div className="bg-[#151B23] rounded-2xl p-8 border border-[#1C2330]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#C7D0DD] mb-2">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-[#0D1117] rounded-lg border border-[#1C2330] focus:border-[#FF6A3D] focus:outline-none text-white disabled:opacity-50"
                  placeholder="seu@email.com"
                  required
                />
              </div>

              {/* Senha */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#C7D0DD] mb-2">
                  Senha
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-[#0D1117] rounded-lg border border-[#1C2330] focus:border-[#FF6A3D] focus:outline-none text-white disabled:opacity-50"
                  placeholder="Sua senha"
                  required
                />
              </div>

              {/* Erro */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Botão Entrar */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] hover:shadow-lg hover:shadow-[#FF6A3D]/50'
                }`}
              >
                {loading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* Link para Cadastro */}
            <div className="mt-6 text-center">
              <p className="text-[#C7D0DD]">
                Não tem conta?{' '}
                <Link
                  to="/cadastro"
                  className="text-[#FF6A3D] font-bold hover:text-[#FF1493] transition-colors"
                >
                  Cadastre-se
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
