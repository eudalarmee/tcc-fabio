import { useState } from 'react';

export default function ShapeSimulator() {
  const [progress, setProgress] = useState(50); // Inicia no meio (0 a 100)
  const [isHovering, setIsHovering] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [gender, setGender] = useState('M'); // 'M' ou 'F'

  // Calcular valores baseados no progresso (agora relativo ao centro)
  const bodyFatLoss = (((progress - 50) / 50) * 8).toFixed(1);
  const muscleGain = (((progress - 50) / 50) * 5).toFixed(1);
  
  // Calcular definição e volume muscular (0 a 1)
  const definition = Math.max(0, Math.min(1, (50 - progress) / 50)); // Mais definição = menos progress
  const muscleVolume = Math.max(0, Math.min(1, (progress - 50) / 50)); // Mais volume = mais progress
  
  // Calcular body fat percentage visual (10% a 25%)
  const bodyFat = 25 - (definition * 15);
  
  // Valores dinâmicos para display
  const displayBF = bodyFat.toFixed(1);
  const displayMass = (65 + muscleVolume * 15).toFixed(1);

  return (
    <section className="py-32 px-6 bg-[#0A0E14] relative overflow-hidden">
      {/* Grid ultrafino minimalista */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 0.5px, transparent 0.5px), linear-gradient(90deg, rgba(255,255,255,0.1) 0.5px, transparent 0.5px)',
          backgroundSize: '60px 60px'
        }}></div>
      </div>

      {/* Efeitos de luz ambiente sutis */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, rgba(255, 106, 61, ${0.1 + definition * 0.15}) 0%, transparent 70%)`,
            filter: 'blur(100px)'
          }}
        ></div>
        <div 
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full transition-all duration-1000"
          style={{
            background: `radial-gradient(circle, rgba(255, 20, 147, ${0.08 + muscleVolume * 0.12}) 0%, transparent 70%)`,
            filter: 'blur(80px)'
          }}
        ></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Título Premium Aspiracional */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 mb-4 px-5 py-2 bg-gradient-to-r from-[#FF6A3D]/10 to-[#FF1493]/10 rounded-full border border-white/5">
            <span className="text-xs uppercase tracking-[0.2em] text-gray-400 font-medium">Tecnologia MuscleMax</span>
            <div className="w-px h-4 bg-white/20"></div>
            {/* Seletor de Gênero Premium */}
            <div className="flex items-center gap-2 bg-black/30 rounded-full p-0.5">
              <button
                onClick={() => setGender('M')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  gender === 'M'
                    ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                H
              </button>
              <button
                onClick={() => setGender('F')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all duration-300 ${
                  gender === 'F'
                    ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white shadow-lg'
                    : 'text-gray-500 hover:text-gray-300'
                }`}
              >
                M
              </button>
            </div>
          </div>
          <h2 className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-[1.1]">
            <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent">
              Seu espelho
            </span>
            <br />
            <span className="bg-gradient-to-r from-[#FF6A3D] via-[#FF1493] to-[#FF6A3D] bg-clip-text text-transparent animate-gradient">
              digital do futuro
            </span>
          </h2>
          <p className="text-gray-500 text-lg md:text-xl max-w-2xl mx-auto font-light">
            Visualize sua transformação em tempo real • {gender === 'M' ? 'Homem' : 'Mulher'}
          </p>
        </div>

        {/* Container Principal Ultra Premium */}
        <div className="max-w-5xl mx-auto">
          <div className="relative">
            
            {/* Área de Visualização 3D Body - MAIS PRÓXIMO */}
            <div className="mb-12">
              <div className="relative aspect-[4/5] bg-gradient-to-br from-[#0D1117] via-[#151B23] to-[#0D1117] rounded-3xl overflow-hidden border border-white/5 shadow-2xl backdrop-blur-xl">
                
                {/* Grid de profundidade 3D */}
                <div className="absolute inset-0 opacity-[0.015]">
                  <div className="h-full w-full" style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    transform: 'perspective(800px) rotateX(50deg)',
                    transformOrigin: 'center center'
                  }}></div>
                </div>

                {/* Sistema de iluminação volumétrica 3D */}
                <div className="absolute inset-0 pointer-events-none">
                  <div 
                    className="absolute top-[20%] left-[30%] w-[400px] h-[400px] rounded-full transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle, rgba(255,106,61,${0.2 + definition * 0.3}) 0%, transparent 60%)`,
                      filter: 'blur(80px)',
                      transform: `scale(${1 + muscleVolume * 0.3})`
                    }}
                  ></div>
                  <div 
                    className="absolute top-[40%] right-[30%] w-[300px] h-[300px] rounded-full transition-all duration-700"
                    style={{
                      background: `radial-gradient(circle, rgba(255,20,147,${0.15 + muscleVolume * 0.25}) 0%, transparent 60%)`,
                      filter: 'blur(60px)'
                    }}
                  ></div>
                </div>

                {/* CORPO HUMANOIDE REALISTA - MAIOR E CENTRALIZADO */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full flex items-center justify-center scale-125">
                    
                    {/* CORPO 3D REALISTA */}
                    <div 
                      className="relative transition-all duration-700 ease-out"
                      style={{
                        transform: `scale(${1 + muscleVolume * 0.2})`,
                        filter: `contrast(${1.08 + definition * 0.3}) brightness(${1.05 + definition * 0.2}) saturate(${0.9 + muscleVolume * 0.3})`
                      }}
                    >
                      {/* Cabeça minimalista */}
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-16 h-20 bg-gradient-to-b from-gray-700/80 to-gray-800/80 rounded-full backdrop-blur-sm"
                        style={{
                          boxShadow: `0 0 30px rgba(255,106,61,${0.1 + definition * 0.3})`
                        }}
                      ></div>

                      {/* Pescoço */}
                      <div className="absolute top-[75px] left-1/2 -translate-x-1/2 w-10 h-8 bg-gradient-to-b from-gray-800/80 to-gray-700/80 backdrop-blur-sm"></div>

                      {/* Tronco Superior - Peitoral e Ombros */}
                      <div 
                        className="absolute top-[100px] left-1/2 -translate-x-1/2 bg-gradient-to-b from-gray-700/90 via-gray-600/90 to-gray-700/90 backdrop-blur-sm rounded-t-3xl transition-all duration-700"
                        style={{
                          width: `${140 + muscleVolume * 40}px`,
                          height: `${160 + muscleVolume * 30}px`,
                          clipPath: 'polygon(15% 0%, 85% 0%, 100% 100%, 0% 100%)',
                          boxShadow: `inset 0 0 60px rgba(255,106,61,${0.1 + definition * 0.4}), 0 0 40px rgba(255,20,147,${0.1 + muscleVolume * 0.3})`
                        }}
                      >
                        {/* Definição muscular - linhas de corte */}
                        <div 
                          className="absolute inset-0 transition-opacity duration-700"
                          style={{ opacity: definition }}
                        >
                          {/* Linha central abdominal */}
                          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-0.5 h-3/4 bg-gradient-to-b from-transparent via-black/60 to-transparent"></div>
                          
                          {/* Peitoral split */}
                          <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-full h-0.5 bg-gradient-to-r from-transparent via-black/40 to-transparent"></div>
                          
                          {/* Serrátil suggestions */}
                          <div className="absolute top-[40%] left-[20%] w-8 h-0.5 bg-black/30 rotate-45"></div>
                          <div className="absolute top-[40%] right-[20%] w-8 h-0.5 bg-black/30 -rotate-45"></div>
                        </div>

                        {/* Brilho muscular superior */}
                        <div 
                          className="absolute top-[15%] left-[30%] w-20 h-20 rounded-full transition-opacity duration-700"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.15) 0%, transparent 70%)',
                            opacity: 0.3 + muscleVolume * 0.5
                          }}
                        ></div>
                      </div>

                      {/* Braços com volume muscular */}
                      {/* Braço Esquerdo */}
                      <div 
                        className="absolute top-[110px] bg-gradient-to-b from-gray-700/80 to-gray-800/80 rounded-full backdrop-blur-sm transition-all duration-700"
                        style={{
                          left: `${20 - muscleVolume * 10}px`,
                          width: `${24 + muscleVolume * 12}px`,
                          height: `${120 + muscleVolume * 20}px`,
                          transform: 'rotate(-10deg)',
                          boxShadow: `inset -5px 0 20px rgba(0,0,0,${0.3 + definition * 0.4})`
                        }}
                      >
                        {/* Bíceps highlight */}
                        <div 
                          className="absolute top-[30%] left-[30%] w-8 h-12 rounded-full transition-opacity duration-700"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            opacity: 0.2 + muscleVolume * 0.6
                          }}
                        ></div>
                      </div>

                      {/* Braço Direito */}
                      <div 
                        className="absolute top-[110px] bg-gradient-to-b from-gray-700/80 to-gray-800/80 rounded-full backdrop-blur-sm transition-all duration-700"
                        style={{
                          right: `${20 - muscleVolume * 10}px`,
                          width: `${24 + muscleVolume * 12}px`,
                          height: `${120 + muscleVolume * 20}px`,
                          transform: 'rotate(10deg)',
                          boxShadow: `inset 5px 0 20px rgba(0,0,0,${0.3 + definition * 0.4})`
                        }}
                      >
                        {/* Bíceps highlight */}
                        <div 
                          className="absolute top-[30%] right-[30%] w-8 h-12 rounded-full transition-opacity duration-700"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
                            opacity: 0.2 + muscleVolume * 0.6
                          }}
                        ></div>
                      </div>

                      {/* Core/Abdômen com definição progressiva */}
                      <div 
                        className="absolute left-1/2 -translate-x-1/2 bg-gradient-to-b from-gray-700/90 to-gray-800/90 backdrop-blur-sm transition-all duration-700"
                        style={{
                          top: `${258 - muscleVolume * 5}px`,
                          width: `${120 + muscleVolume * 20}px`,
                          height: `${100 + muscleVolume * 15}px`,
                          clipPath: 'polygon(0% 0%, 100% 0%, 90% 100%, 10% 100%)',
                          boxShadow: `inset 0 0 40px rgba(0,0,0,${0.5 + definition * 0.3})`
                        }}
                      >
                        {/* Six-pack definition */}
                        <div 
                          className="absolute inset-0 grid grid-cols-2 gap-2 p-4 transition-opacity duration-700"
                          style={{ opacity: definition * 0.8 }}
                        >
                          {[...Array(6)].map((_, i) => (
                            <div 
                              key={i}
                              className="bg-black/40 rounded-lg"
                              style={{
                                boxShadow: 'inset 0 2px 8px rgba(0,0,0,0.8)'
                              }}
                            ></div>
                          ))}
                        </div>

                        {/* V-cut suggestions */}
                        <div 
                          className="absolute bottom-0 left-0 w-full h-1/3 transition-opacity duration-700"
                          style={{ opacity: definition }}
                        >
                          <div className="absolute bottom-0 left-[30%] w-16 h-0.5 bg-black/60 rotate-[25deg]"></div>
                          <div className="absolute bottom-0 right-[30%] w-16 h-0.5 bg-black/60 -rotate-[25deg]"></div>
                        </div>
                      </div>

                      {/* Pernas */}
                      {/* Perna Esquerda */}
                      <div 
                        className="absolute bg-gradient-to-b from-gray-800/80 to-gray-900/80 rounded-full backdrop-blur-sm transition-all duration-700"
                        style={{
                          top: `${350 - muscleVolume * 5}px`,
                          left: `${55 - muscleVolume * 5}px`,
                          width: `${32 + muscleVolume * 10}px`,
                          height: `${130 + muscleVolume * 15}px`,
                          boxShadow: `inset -3px 0 15px rgba(0,0,0,${0.5 + definition * 0.3})`
                        }}
                      >
                        {/* Quadríceps highlight */}
                        <div 
                          className="absolute top-[25%] left-[40%] w-6 h-16 rounded-full transition-opacity duration-700"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                            opacity: 0.3 + muscleVolume * 0.5
                          }}
                        ></div>
                      </div>

                      {/* Perna Direita */}
                      <div 
                        className="absolute bg-gradient-to-b from-gray-800/80 to-gray-900/80 rounded-full backdrop-blur-sm transition-all duration-700"
                        style={{
                          top: `${350 - muscleVolume * 5}px`,
                          right: `${55 - muscleVolume * 5}px`,
                          width: `${32 + muscleVolume * 10}px`,
                          height: `${130 + muscleVolume * 15}px`,
                          boxShadow: `inset 3px 0 15px rgba(0,0,0,${0.5 + definition * 0.3})`
                        }}
                      >
                        {/* Quadríceps highlight */}
                        <div 
                          className="absolute top-[25%] right-[40%] w-6 h-16 rounded-full transition-opacity duration-700"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
                            opacity: 0.3 + muscleVolume * 0.5
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Partículas de energia ao redor do corpo */}
                    <div 
                      className="absolute inset-0 pointer-events-none transition-opacity duration-700"
                      style={{ opacity: isDragging ? 1 : 0 }}
                    >
                      {[...Array(12)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-1 h-1 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] rounded-full animate-pulse"
                          style={{
                            top: `${20 + Math.random() * 60}%`,
                            left: `${20 + Math.random() * 60}%`,
                            animationDelay: `${i * 0.1}s`,
                            animationDuration: '2s'
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Indicadores Dinâmicos Premium - DESTAQUE */}
                <div className="absolute top-6 left-1/2 -translate-x-1/2 flex items-center gap-4">
                  {/* BF% Atual */}
                  <div className="bg-black/60 backdrop-blur-2xl rounded-2xl px-5 py-3 border border-white/10 shadow-2xl">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Body Fat</div>
                      <div className="text-2xl font-black bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
                        {displayBF}%
                      </div>
                    </div>
                  </div>

                  {/* Massa Muscular Atual */}
                  <div className="bg-black/60 backdrop-blur-2xl rounded-2xl px-5 py-3 border border-white/10 shadow-2xl">
                    <div className="text-center">
                      <div className="text-xs text-gray-500 uppercase tracking-wider mb-1">Massa</div>
                      <div className="text-2xl font-black bg-gradient-to-r from-[#FF1493] to-[#FF6A3D] bg-clip-text text-transparent">
                        {displayMass}kg
                      </div>
                    </div>
                  </div>
                </div>

                {/* Indicadores de Status Premium */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/40 backdrop-blur-xl rounded-full px-6 py-3 border border-white/10">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-[#00ff88] animate-pulse"></div>
                    <span className="text-xs text-gray-400 font-medium">ESPELHO DIGITAL ATIVO</span>
                  </div>
                  <div className="w-px h-4 bg-white/10"></div>
                  <span className="text-xs font-bold bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
                    {progress >= 50 ? `+${(progress - 50) * 2}% VOLUME` : `+${(50 - progress) * 2}% DEFINIÇÃO`}
                  </span>
                </div>
              </div>
            </div>

            {/* Indicador de Variação em Tempo Real */}
            <div className="mb-8 text-center">
              <div className="inline-flex items-center gap-4 bg-gradient-to-r from-[#0D1117] to-[#151B23] rounded-2xl px-8 py-4 border border-white/5">
                <div className="text-center">
                  <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Variação BF</div>
                  <div className={`text-xl font-bold ${bodyFatLoss >= 0 ? 'text-[#FF6A3D]' : 'text-[#FF1493]'}`}>
                    {bodyFatLoss > 0 ? '-' : '+'}{Math.abs(bodyFatLoss)}%
                  </div>
                </div>
                <div className="w-px h-10 bg-white/10"></div>
                <div className="text-center">
                  <div className="text-xs text-gray-600 uppercase tracking-wider mb-1">Ganho Massa</div>
                  <div className={`text-xl font-bold ${muscleGain >= 0 ? 'text-[#FF1493]' : 'text-[#FF6A3D]'}`}>
                    {muscleGain > 0 ? '+' : ''}{muscleGain}kg
                  </div>
                </div>
              </div>
            </div>

            {/* Métricas Emocionais Premium */}
            <div className="grid md:grid-cols-2 gap-6 mb-12">
              {/* BF Loss */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF6A3D]/10 to-[#FF1493]/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">Definição</span>
                      <div className="text-5xl font-black mt-2 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
                        {bodyFatLoss > 0 ? '-' : ''}{Math.abs(bodyFatLoss)}%
                      </div>
                      <span className="text-xs text-gray-600 mt-1 block">Gordura corporal</span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF6A3D]/20 to-[#FF1493]/20 flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-7 h-7 text-[#FF6A3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] rounded-full transition-all duration-700"
                      style={{ width: `${Math.abs(parseFloat(bodyFatLoss)) * 12.5}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Muscle Gain */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-[#FF1493]/10 to-[#FF6A3D]/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
                <div className="relative bg-[#0D1117]/80 backdrop-blur-xl rounded-2xl p-8 border border-white/5 hover:border-white/10 transition-all duration-300">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className="text-xs uppercase tracking-[0.2em] text-gray-500 font-medium">Hipertrofia</span>
                      <div className="text-5xl font-black mt-2 bg-gradient-to-r from-[#FF1493] to-[#FF6A3D] bg-clip-text text-transparent">
                        {muscleGain > 0 ? '+' : ''}{muscleGain}kg
                      </div>
                      <span className="text-xs text-gray-600 mt-1 block">Massa muscular</span>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#FF1493]/20 to-[#FF6A3D]/20 flex items-center justify-center backdrop-blur-sm">
                      <svg className="w-7 h-7 text-[#FF1493]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </div>
                  </div>
                  <div className="w-full h-1.5 bg-black/50 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-[#FF1493] to-[#FF6A3D] rounded-full transition-all duration-700"
                      style={{ width: `${Math.abs(parseFloat(muscleGain)) * 20}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slider Ultra Premium */}
            <div className="relative mb-12">
              {/* Labels minimalistas */}
              <div className="flex justify-between mb-6 px-1">
                <span className="text-sm text-gray-600 font-light">Definição Máxima</span>
                <span className="text-sm text-gray-600 font-light">Volume Máximo</span>
              </div>

              {/* Track do Slider */}
              <div 
                className="relative h-2 bg-gradient-to-r from-[#0D1117] via-[#151B23] to-[#0D1117] rounded-full shadow-inner overflow-hidden"
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Borda sutil */}
                <div className="absolute inset-0 rounded-full border border-white/5"></div>

                {/* Progresso visual */}
                <div 
                  className="absolute left-0 h-full transition-all duration-500"
                  style={{ 
                    width: `${progress}%`,
                    background: 'linear-gradient(90deg, rgba(255,106,61,0.3) 0%, rgba(255,20,147,0.5) 100%)'
                  }}
                >
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer-slow"></div>
                </div>

                {/* Input Range */}
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={progress}
                  onChange={(e) => setProgress(Number(e.target.value))}
                  onMouseDown={() => setIsDragging(true)}
                  onMouseUp={() => setIsDragging(false)}
                  onTouchStart={() => setIsDragging(true)}
                  onTouchEnd={() => setIsDragging(false)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                />

                {/* Thumb Premium */}
                <div 
                  className="absolute top-1/2 -translate-y-1/2 pointer-events-none transition-all duration-300 z-10"
                  style={{ 
                    left: `calc(${progress}% - 18px)`,
                  }}
                >
                  <div className="relative">
                    {/* Glow externo */}
                    <div 
                      className={`absolute inset-0 w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] blur-md transition-all duration-300 ${
                        isHovering || isDragging ? 'opacity-60 scale-150' : 'opacity-30 scale-100'
                      }`}
                    ></div>
                    
                    {/* Thumb principal */}
                    <div 
                      className={`relative w-9 h-9 rounded-full bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] shadow-2xl transition-all duration-300 flex items-center justify-center ${
                        isHovering || isDragging ? 'scale-125' : 'scale-100'
                      }`}
                      style={{
                        boxShadow: '0 0 30px rgba(255,106,61,0.5), 0 0 60px rgba(255,20,147,0.3)'
                      }}
                    >
                      {/* Inner ring */}
                      <div className="w-5 h-5 rounded-full border-2 border-white/50 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    </div>

                    {/* Linha de conexão */}
                    {(isHovering || isDragging) && (
                      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-white/30 to-transparent"></div>
                    )}
                  </div>
                </div>
              </div>

              {/* Milestone markers sutis */}
              <div className="flex justify-between mt-3 px-1">
                {[0, 25, 50, 75, 100].map((mark) => (
                  <div
                    key={mark}
                    className="relative group/mark"
                  >
                    <div 
                      className={`text-xs transition-all duration-500 ${
                        progress >= mark
                          ? 'text-white font-bold scale-110'
                          : 'text-gray-700 font-light'
                      }`}
                    >
                      {mark}
                    </div>
                    {progress >= mark && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-0.5 h-1.5 bg-gradient-to-t from-[#FF6A3D] to-transparent"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CTA Emocional Ultra-Premium */}
            <div className="text-center">
              <p className="text-gray-400 mb-8 text-lg font-light max-w-3xl mx-auto leading-relaxed">
                Esta é a <span className="text-transparent bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text font-semibold">simulação digital do seu futuro físico</span>. 
                Transforme dados em resultados reais com metodologia científica.
              </p>
              <button className="group relative px-12 py-5 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] rounded-full font-bold text-white text-base shadow-2xl hover:shadow-[0_0_80px_rgba(255,106,61,0.6)] transition-all duration-500 hover:scale-105 overflow-hidden">
                <span className="relative z-10 flex items-center gap-3 justify-center">
                  Acessar Plataforma Completa
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
              </button>
              <p className="text-gray-600 text-xs mt-6 uppercase tracking-wider">
                Usado por atletas de alto rendimento
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Estilos para animações */}
      <style>{`
        @keyframes shimmer-slow {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-shimmer-slow {
          animation: shimmer-slow 4s infinite;
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% auto;
          animation: gradient 3s ease infinite;
        }
      `}</style>
    </section>
  );
}
