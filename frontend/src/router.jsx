import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import Dashboard from "./pages/Dashboard";
import Exercicios from "./pages/Exercicios";
import Sobre from "./pages/Sobre";
import Contato from "./pages/Contato";
import Termos from "./pages/Termos";
import Equipe from "./pages/Equipe";
import Resultados from "./pages/Resultados";
import ModalidadeDetalhes from "./pages/ModalidadeDetalhes";
import PlanilhaDetalhes from "./pages/PlanilhaDetalhes";
import Treinos from "./pages/Treinos";
import MeusTreinos from "./pages/MeusTreinos";

export default function Router() {
  return (
    <BrowserRouter>
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
        <Route path="/equipe" element={<Equipe />} />
        <Route path="/resultados" element={<Resultados />} />
        <Route path="/treinos" element={<Treinos />} />
        <Route path="/meus-treinos" element={<MeusTreinos />} />
        <Route path="/modalidade/:id" element={<ModalidadeDetalhes />} />
        <Route path="/planilha/:id" element={<PlanilhaDetalhes />} />
      </Routes>
    </BrowserRouter>
  );
}
