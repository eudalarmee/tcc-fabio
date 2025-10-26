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
import Testimonials from './Testimonials';
import Banners from './Banners';

export default function App() {
  return (
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
          </Routes>
        </main>
        
        {/* Assistente de IA flutuante - disponível em todas as páginas */}
        <AIChat />
      </Router>
    </AuthProvider>
  );
}

