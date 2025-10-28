/**
 * MUSCLEMAX - App Principal
 * 
 * ETAPA 2 IMPLEMENTADA:
 * ✅ Sistema de autenticação (AuthProvider)
 * ✅ Navegação com scroll suave
 * ✅ Assistente de IA flutuante (AIChat)
 * 
 * Estrutura:
 * - AuthProvider: Contexto de login/logout + localStorage
 * - Router: Navegação entre páginas
 * - AIChat: Bot de IA disponível em todas as páginas
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ErrorBoundary } from 'react-error-boundary';
import AIChat from './components/AIChat';
import '@google/model-viewer';
import Landing from './pages/Landing';
import LandingSimple from './pages/LandingSimple';
import Resultados from './pages/Resultados';
import Equipe from './pages/Equipe';
import Acessar from './pages/Acessar';
import PlanilhaDetalhes from './pages/PlanilhaDetalhes';
import ModalidadeDetalhes from './pages/ModalidadeDetalhes';
import Home from './pages/Home';
import Sobre from './pages/Sobre';
import Contato from './pages/Contato';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Dashboard from './pages/Dashboard';
import Exercicios from './pages/Exercicios';
import Termos from './pages/Termos';
import MeusTreinos from './pages/MeusTreinos';
import CriarTreino from './pages/CriarTreino';
import Testimonials from './Testimonials';
import Banners from './Banners';

// Componente de erro caso algo quebre
function ErrorFallback({ error, resetErrorBoundary }) {
  console.error('💥 Erro capturado pelo ErrorBoundary:', error);
  
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: '#fee',
      padding: '40px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: 'white',
        padding: '30px',
        borderRadius: '10px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        maxWidth: '600px'
      }}>
        <h1 style={{ color: '#e53e3e', marginBottom: '20px' }}>⚠️ Erro no MUSCLEMAX</h1>
        <p style={{ marginBottom: '10px' }}><strong>Mensagem:</strong></p>
        <pre style={{ 
          background: '#f7fafc', 
          padding: '15px', 
          borderRadius: '5px',
          overflow: 'auto',
          marginBottom: '20px'
        }}>{error.message}</pre>
        
        <button 
          onClick={resetErrorBoundary}
          style={{
            background: '#667eea',
            color: 'white',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          🔄 Tentar Novamente
        </button>
      </div>
    </div>
  );
}

export default function App() {
  console.log('🎯 App.jsx renderizando...');
  
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onReset={() => window.location.reload()}
      onError={(error, errorInfo) => {
        console.error('❌ Erro React:', error);
        console.error('📋 Info:', errorInfo);
      }}
    >
      <AuthProvider>
        <Router>
          <main className="min-h-screen">
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/home" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/exercicios" element={<Exercicios />} />
              <Route path="/sobre" element={<Sobre />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/termos" element={<Termos />} />
              <Route path="/planilha/:id" element={<PlanilhaDetalhes />} />
              <Route path="/modalidade/:id" element={<ModalidadeDetalhes />} />
              <Route path="/resultados" element={<Resultados />} />
              <Route path="/equipe" element={<Equipe />} />
              <Route path="/acessar" element={<Acessar />} />
              <Route path="/testimonials" element={<Testimonials />} />
              <Route path="/banners" element={<Banners />} />
              
              {/* Rotas de Treinos - Disponíveis no modo visitante */}
              <Route path="/meus-treinos" element={<MeusTreinos />} />
              <Route path="/criar-treino" element={<CriarTreino />} />
            </Routes>
          </main>
          
          {/* Assistente de IA flutuante - disponível em todas as páginas */}
          <ErrorBoundary
            fallback={<div style={{ display: 'none' }} />}
            onError={(error) => console.warn('⚠️ AIChat falhou:', error)}
          >
            <AIChat />
          </ErrorBoundary>
        </Router>
      </AuthProvider>
    </ErrorBoundary>
  );
}

