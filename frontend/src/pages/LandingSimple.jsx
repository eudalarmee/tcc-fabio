import { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function LandingSimple() {
  return (
    <div className="min-h-screen bg-[#0D1117]">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-6xl md:text-8xl font-extrabold mb-6">
            <span className="text-white">MUSCLE</span>
            <span className="bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">MAX</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Transforme seu corpo com treinos inteligentes, tecnologia 3D e resultados comprovados
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link 
              to="/exercicios" 
              className="bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white px-8 py-4 rounded-lg font-bold text-lg hover:scale-105 transition-transform"
            >
              Começar Agora
            </Link>
            <Link 
              to="/equipe" 
              className="bg-[#151B23] text-white px-8 py-4 rounded-lg font-bold text-lg hover:bg-[#1C2330] transition-colors border border-[#FF6A3D]"
            >
              Conheça a Equipe
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-[#151B23]">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-12 text-white">
            Por que escolher a <span className="text-[#FF6A3D]">MUSCLEMAX</span>?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-[#1C2330] p-8 rounded-xl border border-[#FF6A3D]/20 hover:border-[#FF6A3D] transition-all">
              <div className="text-5xl mb-4">💪</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Treinos Personalizados</h3>
              <p className="text-gray-400">Planos adaptados aos seus objetivos: hipertrofia, emagrecimento ou performance</p>
            </div>
            <div className="bg-[#1C2330] p-8 rounded-xl border border-[#FF6A3D]/20 hover:border-[#FF6A3D] transition-all">
              <div className="text-5xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Tecnologia 3D</h3>
              <p className="text-gray-400">Visualize exercícios em 3D e entenda cada movimento perfeitamente</p>
            </div>
            <div className="bg-[#1C2330] p-8 rounded-xl border border-[#FF6A3D]/20 hover:border-[#FF6A3D] transition-all">
              <div className="text-5xl mb-4">📊</div>
              <h3 className="text-2xl font-bold mb-3 text-white">Resultados Reais</h3>
              <p className="text-gray-400">Acompanhe sua evolução com métricas precisas e relatórios detalhados</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Pronto para transformar seu corpo?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Junte-se a milhares de pessoas que já alcançaram seus objetivos
          </p>
          <Link 
            to="/acessar" 
            className="inline-block bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white px-12 py-5 rounded-lg font-bold text-xl hover:scale-105 transition-transform"
          >
            Acessar Plataforma
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
