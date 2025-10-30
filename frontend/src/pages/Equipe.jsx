import { useEffect, useState, useRef } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';

// Imports das fotos - mapeamento fixo por nome
import lucasImg from '../assets/team/lucas.jpg';
import daviImg from '../assets/team/davi.jpg';
import eduardoImg from '../assets/team/eduardo.jpg';
import victorImg from '../assets/team/victor.jpg';

export default function Equipe() {
  const [tiltStyle, setTiltStyle] = useState({});
  const cardRefs = useRef({});

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Validação de integridade (dev only)
    if (process.env.NODE_ENV === 'development') {
      setTimeout(() => {
        team.forEach(m => {
          const el = document.querySelector(`[data-person="${m.id}"] img`);
          if (!el) {
            console.warn("Card não encontrado:", m.id);
          } else if (!el.src.includes(m.id)) {
            console.warn("⚠️ Foto/nome trocado:", m.id, "- Verifique o mapeamento");
          }
        });
      }, 500);
    }
  }, []);

  const team = [
    { 
      id: 'lucas', 
      name: 'Lucas', 
      role: 'Manager & Host', 
      photo: lucasImg,
      frase: 'Presença entrega resultado.'
    },
    { 
      id: 'eduardo', 
      name: 'Eduardo', 
      role: 'Fundador & Estrategista de Treino', 
      photo: eduardoImg,
      frase: 'Estratégia vence força bruta.'
    },
    { 
      id: 'victor', 
      name: 'Victor', 
      role: 'Fundador & Especialista em Resultados', 
      photo: victorImg,
      frase: 'Resultado é ciência aplicada.'
    },
    { 
      id: 'davi', 
      name: 'Davi', 
      role: 'Desenvolvimento Técnico', 
      photo: daviImg,
      frase: 'Consistência constrói lendas.'
    }
  ];

  const handleTilt = (e, cardId) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const card = cardRefs.current[cardId];
    if (!card) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    const rotateX = ((y - centerY) / centerY) * -2;
    const rotateY = ((x - centerX) / centerX) * 2;

    setTiltStyle(prev => ({
      ...prev,
      [cardId]: {
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`
      }
    }));
  };

  const resetTilt = (cardId) => {
    setTiltStyle(prev => ({
      ...prev,
      [cardId]: {
        transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)'
      }
    }));
  };

  return (
    <div className="bg-[#0D1117] text-white min-h-screen">
      <Header />

      <section className="pt-32 pb-12 px-6 md:px-6 lg:px-8" id="equipe">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 uppercase tracking-tight">
            EQUIPE
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-[#C7D0DD] max-w-2xl mx-auto px-4">
            Time focado em performance, estética e resultado.
          </p>
        </div>
      </section>

      <section className="py-8 md:py-12 px-6 md:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          
          {/* LUCAS - Destaque sutil (primeira posição, centralizado) */}
          <div className="flex justify-center mb-12 md:mb-16">
            <article
              ref={el => cardRefs.current[team[0].id] = el}
              data-person={team[0].id}
              className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#161b22] to-[#1d2430] border border-white/10 hover:border-[#FFD700]/30 transition-all duration-300 w-full max-w-md shadow-lg hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] ring-1 ring-[#FFD700]/10"
              style={{
                transformStyle: 'preserve-3d',
                ...(tiltStyle[team[0].id] || {})
              }}
              onMouseMove={(e) => handleTilt(e, team[0].id)}
              onMouseLeave={() => resetTilt(team[0].id)}
            >
              <div className="relative h-[380px] sm:h-[420px] overflow-hidden">
                <img 
                  src={team[0].photo} 
                  alt={`${team[0].name} - ${team[0].role} — MuscleMax`}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
                
                {/* Overlay + Frase no hover */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200"></div>
                <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center px-6 transition-all duration-200">
                  <p className="text-white text-center text-base sm:text-lg md:text-xl font-bold tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-all duration-200" style={{textShadow: '0 2px 12px rgba(0,0,0,0.9)'}}>
                    {team[0].frase}
                  </p>
                </div>
              </div>

              {/* Footer com nome e cargo */}
              <footer className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                <h3 className="text-white text-xl sm:text-2xl font-bold uppercase tracking-tight mb-1">{team[0].name}</h3>
                <p className="text-gray-300 text-xs sm:text-sm font-medium">{team[0].role}</p>
              </footer>
            </article>
          </div>

          {/* EDUARDO, VICTOR, DAVI - Trio lado a lado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 md:gap-8">
            {team.slice(1).map((member) => (
              <article
                key={member.id}
                ref={el => cardRefs.current[member.id] = el}
                data-person={member.id}
                className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-[#161b22] to-[#1d2430] border border-white/10 hover:border-[#FF6A3D]/50 transition-all duration-300 shadow-lg hover:shadow-[0_10px_40px_-10px_rgba(255,106,61,0.3)]"
                style={{
                  transformStyle: 'preserve-3d',
                  ...(tiltStyle[member.id] || {})
                }}
                onMouseMove={(e) => handleTilt(e, member.id)}
                onMouseLeave={() => resetTilt(member.id)}
              >
                <div className="relative h-[380px] sm:h-[420px] overflow-hidden">
                  <img 
                    src={member.photo} 
                    alt={`${member.name} - ${member.role} — MuscleMax`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    loading="lazy"
                  />
                  
                  {/* Overlay + Frase no hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200"></div>
                  <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 flex items-center justify-center px-6 transition-all duration-200">
                    <p className="text-white text-center text-base sm:text-lg md:text-xl font-bold tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-all duration-200" style={{textShadow: '0 2px 12px rgba(0,0,0,0.9)'}}>
                      {member.frase}
                    </p>
                  </div>
                </div>

                {/* Footer com nome e cargo */}
                <footer className="absolute bottom-0 left-0 right-0 p-4 md:p-5 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
                  <h3 className="text-white text-xl sm:text-2xl font-bold uppercase tracking-tight mb-1">{member.name}</h3>
                  <p className="text-gray-300 text-xs sm:text-sm font-medium">{member.role}</p>
                </footer>
              </article>
            ))}
          </div>

        </div>
      </section>

      <style jsx>{`
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      <Footer />
    </div>
  );
}
