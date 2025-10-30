import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../lib/api';
import * as guestStore from '../lib/guestStore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  console.log('🔐 AuthProvider iniciando...');
  
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('loading'); // 'loading' | 'guest' | 'authenticated'

  // Log da URL da API para debug
  useEffect(() => {
    console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api');
  }, []);

  // Bootstrap: carregar sessão ao montar
  useEffect(() => {
    console.log('🔄 Executando bootstrap...');
    bootstrap().catch(err => {
      console.error('❌ Erro no bootstrap:', err);
      setLoading(false);
      setStatus('guest');
    });
  }, []);

  const bootstrap = async () => {
    console.log('🚀 Bootstrap: iniciando validação de sessão...');
    
    try {
      const savedToken = localStorage.getItem('musclemax_token');
      
      if (!savedToken) {
        console.log('👤 Sem token salvo - Modo Visitante ativado');
        setStatus('guest');
        setLoading(false);
        return;
      }

      console.log('🔑 Token encontrado, validando com backend...');

      // Timeout de 5 segundos para evitar travamento
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        // Valida token chamando /api/auth/me
        const response = await api.get('/auth/me', {
          headers: {
            'Authorization': `Bearer ${savedToken}`
          },
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        console.log('✅ Token válido, usuário autenticado:', response.data);
        setUser(response.data);
        setToken(savedToken);
        setStatus('authenticated');
        
        // Após autenticar, migrar treinos locais se houver
        await migrateGuestWorkouts();
      } catch (fetchError) {
        clearTimeout(timeoutId);
        
        if (fetchError.name === 'AbortError') {
          console.warn('⚠️ Timeout na validação do token (backend offline?)');
        } else {
          console.warn('⚠️ Token inválido ou erro no backend:', fetchError.message);
        }
        
        localStorage.removeItem('musclemax_token');
        setStatus('guest');
      }
    } catch (error) {
      console.error('❌ Erro crítico no bootstrap:', error);
      localStorage.removeItem('musclemax_token');
      setStatus('guest');
    } finally {
      console.log('✅ Bootstrap concluído');
      setLoading(false);
    }
  };

  /**
   * Migra treinos salvos localmente para a conta do usuário
   */
  const migrateGuestWorkouts = async () => {
    try {
      const hasLocal = await guestStore.hasLocalWorkouts();
      
      if (!hasLocal) {
        console.log('📦 Nenhum treino local para migrar');
        return;
      }

      const localWorkouts = await guestStore.getAllWorkouts();
      console.log(`🔄 Migrando ${localWorkouts.length} treinos locais...`);

      // Chama endpoint bulk no backend
      await api.post('/workouts/bulk', { 
        items: localWorkouts.map(w => ({
          name: w.name,
          title: w.title || w.name,
          exercises: w.exercises,
          createdAt: w.createdAt,
          updatedAt: w.updatedAt,
        }))
      });

      // Limpa armazenamento local após migração bem-sucedida
      await guestStore.clearAll();
      
      console.log('✅ Treinos migrados com sucesso!');
      
      // Notifica o usuário (você pode adicionar um toast aqui)
      return { migrated: localWorkouts.length };
    } catch (error) {
      console.error('❌ Erro ao migrar treinos:', error);
      // Não falhar o login se a migração falhar
      return { error: true };
    }
  };

  const register = async (name, email, password) => {
    try {
      console.log('Tentando registrar usuário:', { name, email });
      
      const response = await api.post('/auth/register', { 
        name, 
        email, 
        password 
      });

      console.log('Registro bem-sucedido:', response.data);

      // Salva token e user
      if (response.data.token) {
        localStorage.setItem('musclemax_token', response.data.token);
        setToken(response.data.token);
      }
      
      if (response.data.user) {
        setUser(response.data.user);
      }
      
      setStatus('authenticated');

      // Migrar treinos após registro
      await migrateGuestWorkouts();

      return response.data;
    } catch (error) {
      console.error('Register error:', {
        message: error?.message,
        code: error?.code,
        responseStatus: error?.response?.status,
        responseData: error?.response?.data,
      });
      
      const serverMsg = error?.response?.data?.error || error?.response?.data?.message;
      throw new Error(serverMsg || error.message || 'Erro ao cadastrar');
    }
  };

  const login = async (email, password) => {
    try {
      console.log('Tentando fazer login:', { email });
      
      const response = await api.post('/auth/login', { 
        email, 
        password 
      });

      console.log('Login bem-sucedido:', response.data);

      // Salva token e user
      if (response.data.token) {
        localStorage.setItem('musclemax_token', response.data.token);
        setToken(response.data.token);
      }
      
      if (response.data.user) {
        setUser(response.data.user);
      }
      
      setStatus('authenticated');

      // Migrar treinos após login
      await migrateGuestWorkouts();

      return response.data;
    } catch (error) {
      console.error('Login error:', {
        message: error?.message,
        code: error?.code,
        responseStatus: error?.response?.status,
        responseData: error?.response?.data,
      });
      
      const serverMsg = error?.response?.data?.error || error?.response?.data?.message;
      throw new Error(serverMsg || error.message || 'Erro ao fazer login');
    }
  };

  const logout = () => {
    localStorage.removeItem('musclemax_token');
    setToken(null);
    setUser(null);
    setStatus('guest');
    console.log('👋 Logout: voltando ao modo visitante');
  };

  const value = {
    user,
    token,
    loading,
    status,
    register,
    login,
    logout,
    isAuthenticated: status === 'authenticated',
    isGuest: status === 'guest',
    isLoading: status === 'loading',
  };

  // Mostrar fallback de carregamento enquanto inicializa
  if (loading) {
    console.log('⏳ AuthProvider ainda carregando...');
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontFamily: 'system-ui, sans-serif',
        flexDirection: 'column',
        gap: '20px'
      }}>
        <div style={{
          width: '60px',
          height: '60px',
          border: '6px solid rgba(255,255,255,0.3)',
          borderTop: '6px solid white',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <h2 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>MUSCLEMAX</h2>
        <p style={{ margin: 0, opacity: 0.9 }}>Carregando interface...</p>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  console.log('✅ AuthProvider pronto, renderizando children...');

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
