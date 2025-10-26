import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useShapeSimStore } from '../stores/shapeSimStore';
import Scene3D from './Scene3D';

export default function ShapeSimulator() {
  const navigate = useNavigate();
  const location = useLocation();
  const { gender, bf, muscle, setGender, setBf, setMuscle, reset } = useShapeSimStore();

  // Converter valores para exibição
  const bfPercentage = (bf * 8).toFixed(1);
  const muscleKg = (muscle * 5).toFixed(1);

  // Navegar para seção Treinos
  const handleAccessPlatform = () => {
    // Navegar para a página de Exercícios (Treinos)
    if (location.pathname === '/exercicios') {
      // Já está na página, fazer scroll ao topo
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Navegar para a página de exercícios
      navigate('/exercicios');
    }
  };

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyboard = (e) => {
      const bfSlider = document.getElementById('bf-slider');
      const muscleSlider = document.getElementById('muscle-slider');
      
      if (document.activeElement === bfSlider || document.activeElement === muscleSlider) {
        if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
          e.preventDefault();
          const current = parseFloat(document.activeElement.value);
          document.activeElement.value = Math.min(1, current + 0.05).toFixed(2);
          const event = new Event('input', { bubbles: true });
          document.activeElement.dispatchEvent(event);
        } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
          e.preventDefault();
          const current = parseFloat(document.activeElement.value);
          document.activeElement.value = Math.max(0, current - 0.05).toFixed(2);
          const event = new Event('input', { bubbles: true });
          document.activeElement.dispatchEvent(event);
        }
      }
      
      // Atalhos H/M para gênero
      if (e.key === 'h' || e.key === 'H') {
        setGender('male');
      } else if (e.key === 'm' || e.key === 'M') {
        setGender('female');
      }
    };

    window.addEventListener('keydown', handleKeyboard);
    return () => window.removeEventListener('keydown', handleKeyboard);
  }, [setGender]);

  return (
    <section className="py-32 px-6 bg-[#0A0E14] relative overflow-hidden">
      {/* Grid ultrafino */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div 
          className="h-full w-full" 
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(255,255,255,0.1) 0.5px, transparent 0.5px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Efeitos de luz ambiente */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, rgba(255, 106, 61, ${0.1 + bf * 0.15}) 0%, transparent 70%)`,
            filter: 'blur(100px)'
          }}
        />
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, rgba(255, 20, 147, ${0.08 + muscle * 0.12}) 0%, transparent 70%)`,
            filter: 'blur(80px)'
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-sm uppercase tracking-[0.2em] text-gray-500 font-medium mb-3">
            Espelho Digital
          </p>
          <h2 className="text-4xl md:text-6xl font-black tracking-tight mb-4">
            <span className="bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Ajuste e visualize
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
              seu futuro físico
            </span>
          </h2>
        </div>

        {/* Container Principal */}
        <div className="max-w-5xl mx-auto">
          {/* Canvas 3D */}
          <div className="relative aspect-[4/3] mb-8 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">
            <Scene3D />
            
            {/* Chips de status */}
            <div className="absolute top-4 left-4 flex gap-2 z-10">
              <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <span className="text-xs font-medium text-white">Espelho Digital: ATIVO</span>
              </div>
              <div className="px-3 py-1.5 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                <span className="text-xs font-medium text-white">Qualidade: Alta</span>
              </div>
            </div>

            {/* Botão Reset */}
            <button
              onClick={reset}
              className="absolute top-4 right-4 z-10 p-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 hover:bg-black/60 transition-colors group"
              aria-label="Resetar valores"
            >
              <svg className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>

          {/* Controles UI */}
          <div className="space-y-6 bg-gradient-to-br from-[#0D1117] to-[#151B23] p-8 rounded-2xl border border-white/5">
            
            {/* Toggle Gênero */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <span className="text-sm text-gray-400">Gênero:</span>
              <div className="flex gap-2 bg-black/30 p-1 rounded-full">
                <button
                  onClick={() => setGender('male')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    gender === 'male'
                      ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white shadow-lg shadow-[#FF6A3D]/20'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Homem
                </button>
                <button
                  onClick={() => setGender('female')}
                  className={`px-6 py-2 rounded-full text-sm font-bold transition-all duration-300 ${
                    gender === 'female'
                      ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white shadow-lg shadow-[#FF1493]/20'
                      : 'text-gray-500 hover:text-gray-300'
                  }`}
                >
                  Mulher
                </button>
              </div>
            </div>

            {/* Slider Redução de BF */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="bf-slider" className="text-sm font-medium text-gray-300">
                  Redução de Gordura Corporal
                </label>
                <span className="text-lg font-bold bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
                  -{bfPercentage}%
                </span>
              </div>
              <input
                id="bf-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={bf}
                onChange={(e) => setBf(parseFloat(e.target.value))}
                aria-valuetext={`Redução de BF: -${bfPercentage}%`}
                className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer slider-gradient"
                style={{
                  background: `linear-gradient(to right, #FF6A3D 0%, #FF1493 ${bf * 100}%, #1a1a2e ${bf * 100}%, #1a1a2e 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0%</span>
                <span>-8%</span>
              </div>
            </div>

            {/* Slider Ganho de Massa */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label htmlFor="muscle-slider" className="text-sm font-medium text-gray-300">
                  Ganho de Massa Muscular
                </label>
                <span className="text-lg font-bold bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
                  +{muscleKg} kg
                </span>
              </div>
              <input
                id="muscle-slider"
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={muscle}
                onChange={(e) => setMuscle(parseFloat(e.target.value))}
                aria-valuetext={`Ganho de massa: +${muscleKg} kg`}
                className="w-full h-2 bg-gray-800 rounded-full appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #FF1493 0%, #FF6A3D ${muscle * 100}%, #1a1a2e ${muscle * 100}%, #1a1a2e 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>0 kg</span>
                <span>+5.0 kg</span>
              </div>
            </div>

            {/* CTA Principal */}
            <button
              onClick={handleAccessPlatform}
              className="w-full mt-8 px-8 py-4 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white font-bold rounded-xl hover:shadow-2xl hover:shadow-[#FF6A3D]/30 transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center gap-3 group"
            >
              <span>Acessar Plataforma Completa</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            {/* Dica de interação */}
            <p className="text-center text-xs text-gray-500 mt-4">
              💡 Arraste para rotacionar • Scroll para zoom • Teclas H/M para alternar gênero
            </p>
          </div>
        </div>
      </div>

      <style>{`
        .slider-gradient::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6A3D, #FF1493);
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 106, 61, 0.5);
          transition: transform 0.2s;
        }
        
        .slider-gradient::-webkit-slider-thumb:hover {
          transform: scale(1.2);
        }
        
        .slider-gradient::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #FF6A3D, #FF1493);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px rgba(255, 106, 61, 0.5);
          transition: transform 0.2s;
        }
        
        .slider-gradient::-moz-range-thumb:hover {
          transform: scale(1.2);
        }
      `}</style>
    </section>
  );
}
