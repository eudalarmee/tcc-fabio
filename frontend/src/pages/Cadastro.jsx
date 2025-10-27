import { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Cadastro() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { register } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
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
    if (!formData.name.trim()) {
      setError('Nome é obrigatório');
      return;
    }

    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return;
    }

    if (formData.password.length < 6) {
      setError('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    try {
      setLoading(true);
      await register(formData.name, formData.email, formData.password);
      
      // Redireciona para a página de destino ou criar-treino
      const redirect = searchParams.get('redirect') || '/criar-treino';
      navigate(redirect);
    } catch (err) {
      setError(err.message || 'Erro ao cadastrar');
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
              Criar <span className="bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">Conta</span>
            </h1>
            <p className="text-[#C7D0DD]">Comece sua jornada no MuscleMax</p>
          </div>

          <div className="bg-[#151B23] rounded-2xl p-8 border border-[#1C2330]">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Nome */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-[#C7D0DD] mb-2">
                  Nome Completo
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={loading}
                  className="w-full px-4 py-3 bg-[#0D1117] rounded-lg border border-[#1C2330] focus:border-[#FF6A3D] focus:outline-none text-white disabled:opacity-50"
                  placeholder="Seu nome"
                  required
                />
              </div>

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
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>

              {/* Erro */}
              {error && (
                <div className="bg-red-500/10 border border-red-500 rounded-lg p-3 text-red-500 text-sm">
                  {error}
                </div>
              )}

              {/* Botão Cadastrar */}
              <button
                type="submit"
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                  loading
                    ? 'bg-gray-600 cursor-not-allowed'
                    : 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] hover:shadow-lg hover:shadow-[#FF6A3D]/50'
                }`}
              >
                {loading ? 'Cadastrando...' : 'Cadastrar'}
              </button>
            </form>

            {/* Link para Login */}
            <div className="mt-6 text-center">
              <p className="text-[#C7D0DD]">
                Já tem conta?{' '}
                <Link
                  to="/login"
                  className="text-[#FF6A3D] font-bold hover:text-[#FF1493] transition-colors"
                >
                  Entrar
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
