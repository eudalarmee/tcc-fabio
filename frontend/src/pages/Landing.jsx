import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AIChat from '../components/AIChat';
import ImpactStats from '../components/ImpactStats';
import { useDynamicPhrase } from '../hooks/useDynamicPhrase';
import { useParallaxMouse } from '../hooks/useParallaxMouse';

export default function Landing() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('TODOS')
  const [filteredPlanilhas, setFilteredPlanilhas] = useState([])
  const [selectedGoal, setSelectedGoal] = useState(null)
  const [showRecommendation, setShowRecommendation] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  
  // Hook para frase dinâmica por horário
  const dynamicPhrase = useDynamicPhrase();
  
  // Hook para parallax do mouse (efeito cinematográfico)
  const mousePosition = useParallaxMouse(5);
  
  // Estado para controlar idle (sem interação)
  const [isIdle, setIsIdle] = useState(false);

  // Detectar idle do usuário (2-3 segundos sem interação)
  useEffect(() => {
    let idleTimer;
    
    const resetIdleTimer = () => {
      setIsIdle(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsIdle(true);
      }, 2500); // 2.5 segundos
    };

    // Eventos que resetam o idle
    window.addEventListener('mousemove', resetIdleTimer);
    window.addEventListener('keydown', resetIdleTimer);
    window.addEventListener('scroll', resetIdleTimer);
    window.addEventListener('click', resetIdleTimer);

    // Iniciar timer
    resetIdleTimer();

    return () => {
      clearTimeout(idleTimer);
      window.removeEventListener('mousemove', resetIdleTimer);
      window.removeEventListener('keydown', resetIdleTimer);
      window.removeEventListener('scroll', resetIdleTimer);
      window.removeEventListener('click', resetIdleTimer);
    };
  }, []);

  // Dados mockados de planilhas
  const mockPlanilhas = [
    { id: 1, nome: 'Hipertrofia Avançada', categoria: 'HIPERTROFIA', equipamento: 'MÁQUINAS', descricao: 'Treino focado em ganho de massa muscular', nivel: 'Avançado' },
    { id: 2, nome: 'Perna Intensa', categoria: 'HIPERTROFIA', equipamento: 'PESO LIVRE', descricao: 'Treino específico para membros inferiores', nivel: 'Intermediário' },
    { id: 3, nome: 'Push Pull Legs', categoria: 'HIPERTROFIA', equipamento: 'HALTERES', descricao: 'Divisão clássica de treino', nivel: 'Intermediário' },
    { id: 4, nome: 'Cardio HIIT', categoria: 'CARDIO', equipamento: 'FUNCIONAL', descricao: 'Treino intervalado de alta intensidade', nivel: 'Todos' },
    { id: 5, nome: 'Full Body', categoria: 'HIPERTROFIA', equipamento: 'MÁQUINAS', descricao: 'Treino de corpo inteiro 3x por semana', nivel: 'Iniciante' },
    { id: 6, nome: 'Upper Lower', categoria: 'HIPERTROFIA', equipamento: 'PESO LIVRE', descricao: 'Divisão superior e inferior', nivel: 'Intermediário' },
    { id: 7, nome: 'Funcional Completo', categoria: 'FUNCIONAL', equipamento: 'FUNCIONAL', descricao: 'Treino funcional para performance', nivel: 'Todos' },
    { id: 8, nome: 'Peito e Tríceps', categoria: 'HIPERTROFIA', equipamento: 'HALTERES', descricao: 'Treino focado em peitoral e tríceps', nivel: 'Intermediário' },
    { id: 9, nome: 'Costas e Bíceps', categoria: 'HIPERTROFIA', equipamento: 'MÁQUINAS', descricao: 'Treino focado em costas e bíceps', nivel: 'Intermediário' },
    { id: 10, nome: 'Cardio Leve', categoria: 'CARDIO', equipamento: 'CARDIO', descricao: 'Treino cardiovascular moderado', nivel: 'Iniciante' },
  ]

  useEffect(() => {
    // Inicializa com todas as planilhas
    setFilteredPlanilhas(mockPlanilhas)
    
    // Inicializa feather icons se disponível
    if (window.feather) {
      window.feather.replace()
    }
  }, [])

  // Função para filtrar planilhas
  useEffect(() => {
    let resultado = mockPlanilhas

    // Filtro por categoria/equipamento
    if (selectedFilter !== 'TODOS') {
      resultado = resultado.filter(p => 
        p.categoria === selectedFilter || p.equipamento === selectedFilter
      )
    }

    // Filtro por busca textual
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase()
      resultado = resultado.filter(p =>
        p.nome.toLowerCase().includes(query) ||
        p.descricao.toLowerCase().includes(query) ||
        p.categoria.toLowerCase().includes(query) ||
        p.equipamento.toLowerCase().includes(query)
      )
    }

    setFilteredPlanilhas(resultado)
  }, [searchQuery, selectedFilter])

  // Função para scroll suave
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Função para buscar ao pressionar Enter
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      // A filtragem já acontece automaticamente via useEffect
      console.log('Buscando por:', searchQuery)
    }
  }

  // Função para clicar no filtro
  const handleFilterClick = (filter) => {
    setSelectedFilter(filter)
  }

  // Recomendações por objetivo
  const recommendations = {
    hipertrofia: {
      title: 'HIPERTROFIA MÁXIMA',
      plan: 'Push/Pull/Legs 6x semana',
      description: 'Volume otimizado para ganho muscular acelerado. 12-16 séries por grupo, 8-12 reps, progressão semanal de carga.',
      features: ['Alta frequência', 'Volume controlado', 'Sobrecarga progressiva', 'Ênfase em compostos'],
      color: 'from-[#FF6A3D] to-[#FF1493]'
    },
    definicao: {
      title: 'DEFINIÇÃO MUSCULAR',
      plan: 'Upper/Lower 4x semana + HIIT',
      description: 'Preservação máxima de massa com déficit calórico. Volume reduzido, intensidade mantida, cardio estratégico.',
      features: ['Alta intensidade', 'Cardio HIIT 3x', 'Manutenção de força', 'Densidade alta'],
      color: 'from-[#00D4FF] to-[#0066FF]'
    },
    performance: {
      title: 'PERFORMANCE ATLÉTICA',
      plan: 'Full Body 3x + Funcional 2x',
      description: 'Treino para explosão, potência e condicionamento real. Movimentos funcionais, força aplicada.',
      features: ['Explosão muscular', 'Mobilidade ativa', 'Condicionamento', 'Força funcional'],
      color: 'from-[#FFD700] to-[#FF8C00]'
    },
    emagrecimento: {
      title: 'EMAGRECIMENTO ESTRATÉGICO',
      plan: 'Circuito Metabólico 5x',
      description: 'Máximo gasto calórico com preservação muscular. Circuitos inteligentes, HIIT, força mantida.',
      features: ['Alto gasto calórico', 'Preserva músculo', 'HIIT + Força', 'Metabolismo acelerado'],
      color: 'from-[#10B981] to-[#059669]'
    }
  }

  const handleGoalClick = (goal) => {
    setSelectedGoal(goal)
    setShowRecommendation(true)
    
    // Scroll suave até a recomendação
    setTimeout(() => {
      document.getElementById('recommendation-result')?.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      })
    }, 100)
  }

  // Função para upload de imagem
  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result)
        setAnalysisResult(null) // Reset análise anterior
      }
      reader.readAsDataURL(file)
    }
  }

  // Função para analisar físico (mockado)
  const analyzePhysique = () => {
    if (!uploadedImage) return

    setIsAnalyzing(true)
    
    // Simula análise IA com delay realista
    setTimeout(() => {
      // Análise mockada mas realista
      const mockAnalysis = {
        score: Math.floor(Math.random() * 15) + 75, // 75-90
        pontosFracos: [
          { grupo: 'Posterior de Coxa', nivel: 'Defasado', prioridade: 'Alta' },
          { grupo: 'Deltoides Posterior', nivel: 'Moderado', prioridade: 'Média' },
          { grupo: 'Panturrilhas', nivel: 'Leve', prioridade: 'Baixa' }
        ],
        pontosFortes: [
          { grupo: 'Peitoral', nivel: 'Excelente' },
          { grupo: 'Bíceps', nivel: 'Muito Bom' },
          { grupo: 'Abdômen', nivel: 'Bom' }
        ],
        simetria: {
          score: Math.floor(Math.random() * 10) + 85, // 85-95
          observacao: 'Boa simetria geral, leve desbalanço no trapézio esquerdo'
        },
        recomendacao: {
          divisao: 'Push/Pull/Legs com ênfase em posterior',
          frequencia: '5-6x semana',
          volume: 'Aumentar 30% em posteriores e deltoides',
          exercicios: [
            'Stiff 3x12 (prioritário)',
            'Mesa Flexora 4x15',
            'Crucifixo Inverso 3x12',
            'Remada Alta Pegada Larga 3x10'
          ]
        },
        percentualGordura: `${Math.floor(Math.random() * 5) + 12}%`,
        observacoes: 'Físico estético com boa base muscular. Foco em simetria e detalhamento posterior elevará o nível significativamente.'
      }

      setAnalysisResult(mockAnalysis)
      setIsAnalyzing(false)

      // Scroll suave até o resultado
      setTimeout(() => {
        document.getElementById('analysis-result')?.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        })
      }, 100)
    }, 2500) // 2.5s de análise
  }

  // Função para resetar análise
  const resetAnalysis = () => {
    setUploadedImage(null)
    setAnalysisResult(null)
    setIsAnalyzing(false)
  }

  // Dados dos exercícios
  const exercicios = [
    { 
      id: 1, 
      title: 'MUSCULAÇÃO', 
      image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1200&h=800&fit=crop',
      alt: 'Atleta treinando musculação com intensidade'
    },
    { 
      id: 2, 
      title: 'PESO LIVRE', 
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=800&fit=crop',
      alt: 'Atleta executando exercício com peso livre'
    },
    { 
      id: 3, 
      title: 'CORRIDA', 
      image: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=800&fit=crop',
      alt: 'Atleta correndo em alta performance'
    },
    { 
      id: 4, 
      title: 'SUPINO', 
      image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=1200&h=800&fit=crop',
      alt: 'Atleta fazendo supino reto'
    },
    { 
      id: 5, 
      title: 'AGACHAMENTO', 
      image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=1200&h=800&fit=crop',
      alt: 'Atleta executando agachamento livre'
    },
    { 
      id: 6, 
      title: 'LEVANTAMENTO TERRA', 
      image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=1200&h=800&fit=crop',
      alt: 'Atleta fazendo levantamento terra com barra'
    }
  ]

  // Dados das planilhas
  const planilhas = [
    {
      id: 1,
      title: 'TREINO A - INFERIORES',
      description: 'Foco em quadríceps e posterior com progressão de carga.',
      image: 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=1600&h=900&fit=crop',
      alt: 'Atleta executando agachamento livre — Treino de Pernas',
      frase: 'Intensidade gera estética'
    },
    {
      id: 2,
      title: 'TREINO B - SUPERIORES',
      description: 'Peito, ombros e tríceps com ênfase em força e estética.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&h=900&fit=crop',
      alt: 'Atleta fazendo supino reto — Treino de Superiores',
      frase: 'Treino não é passeio'
    },
    {
      id: 3,
      title: 'TREINO FUNCIONAL',
      description: 'Condicionamento completo e alta densidade.',
      image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1600&h=900&fit=crop',
      alt: 'Atleta fazendo burpee — Treino Funcional',
      frase: 'Performance é ciência'
    }
  ]

  return (
    <div className="bg-[#0D1117] text-white font-sans antialiased">
      <Header />

      {/* ====================================
          HERO SECTION - Iniciar Jornada
          ==================================== */}
      <section className="group/hero relative min-h-screen flex items-center justify-center overflow-hidden transition-all duration-700 py-20 md:py-0">
        {/* Overlay escuro para legibilidade - intensifica no hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/70 group-hover/hero:from-black/85 group-hover/hero:via-black/70 group-hover/hero:to-black/85 z-10 transition-all duration-700"></div>
        
        {/* Brilho sutil performance mode */}
        <div className="absolute inset-0 opacity-0 group-hover/hero:opacity-100 transition-opacity duration-700 z-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#FF6A3D] rounded-full blur-[150px] opacity-20"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#FF1493] rounded-full blur-[150px] opacity-20"></div>
        </div>
        
        {/* Imagem de fundo fitness com parallax sutil (mouse) e zoom */}
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&h=1080&fit=crop" 
          alt="Atleta profissional em treino intenso na pista" 
          className="absolute inset-0 w-full h-full object-cover group-hover/hero:scale-105 transition-transform duration-700"
          style={{
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px) scale(1.05)`
          }}
        />

        {/* Conteúdo centralizado com animações */}
        <div className="relative z-20 text-center px-6 md:px-4 max-w-5xl mx-auto">
          <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-[0.2em] text-[#C7D0DD] mb-4 md:mb-4 animate-fade-in transition-all duration-500" style={{ animationDelay: '0.1s' }}>
            {dynamicPhrase}
          </p>
          
          {/* Título principal com efeito de glow sutil na palavra ESTÉTICA */}
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold mb-6 md:mb-6 leading-[1.2] md:leading-[1.1] tracking-[-0.02em] animate-fade-in px-2" style={{ animationDelay: '0.3s', fontWeight: '600', letterSpacing: '-0.02em' }}>
            <span 
              className={`inline-block transition-all duration-[2000ms] ${
                isIdle ? 'cinematic-glow' : ''
              }`}
            >
              Estética
            </span> de competição.<br />
            Performance sem limites.<br />
            Metodologia científica.
          </h1>
          
          {/* Botões de CTA com micro respiração */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center mb-6 md:mb-8 animate-fade-in px-4 sm:px-0" style={{ animationDelay: '0.5s' }}>
            <button 
              onClick={() => scrollToSection('planilhas')}
              className={`btn-primary px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto transition-all duration-[4000ms] ${
                isIdle ? 'cinematic-breathe' : ''
              }`}
            >
              INICIAR JORNADA
            </button>
            <button 
              onClick={() => scrollToSection('metodologia')}
              className="btn-secondary px-8 sm:px-10 py-3 sm:py-4 text-sm sm:text-base w-full sm:w-auto"
            >
              VER METODOLOGIA →
            </button>
          </div>

          <p className="text-[10px] sm:text-xs uppercase tracking-wider text-[#8A95A6] animate-fade-in" style={{ animationDelay: '0.7s' }}>
            Feito para quem não falta.
          </p>
        </div>
      </section>

      {/* Estilos CSS para efeitos cinematográficos */}
      <style>{`
        .cinematic-glow {
          animation: subtleGlow 2s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(255, 106, 61, 0.4)) drop-shadow(0 0 40px rgba(255, 20, 147, 0.3));
        }
        
        .cinematic-breathe {
          animation: subtleBreathe 4s ease-in-out infinite;
        }
        
        @keyframes subtleGlow {
          0%, 100% {
            filter: drop-shadow(0 0 15px rgba(255, 106, 61, 0.3)) drop-shadow(0 0 30px rgba(255, 20, 147, 0.2));
            opacity: 1;
          }
          50% {
            filter: drop-shadow(0 0 25px rgba(255, 106, 61, 0.5)) drop-shadow(0 0 50px rgba(255, 20, 147, 0.4));
            opacity: 0.95;
          }
        }
        
        @keyframes subtleBreathe {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.02);
          }
        }
      `}</style>

      {/* ====================================
          CONTADORES DE IMPACTO
          ==================================== */}
      <ImpactStats />

      {/* ====================================
          SEÇÃO EXERCÍCIOS - Grid 3x2
          ==================================== */}
      <section className="group/exercises py-20 px-4 md:px-6 lg:px-8 transition-all duration-700" id="exercicios">
        {/* Brilho sutil performance mode */}
        <div className="absolute inset-0 opacity-0 group-hover/exercises:opacity-100 transition-opacity duration-700 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#FF6A3D] rounded-full blur-[200px] opacity-10"></div>
        </div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center uppercase tracking-tight">
            EXERCÍCIOS
          </h2>
          
          {/* Grid responsivo de exercícios */}
                    {/* Grid responsivo de exercícios */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {exercicios.map((exercicio) => (
              <Link
                key={exercicio.id}
                to={`/modalidade/${exercicio.id}`}
                className="relative group overflow-hidden rounded-xl cursor-pointer hover-elevate"
              >
                {/* Imagem com zoom no hover */}
                <img 
                  src={exercicio.image} 
                  alt={exercicio.alt}
                  className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-105"
                />
                
                {/* Overlay com gradiente */}
                <div className="overlay-gradient"></div>
                
                {/* Título do card */}
                <div className="absolute inset-0 flex items-end p-6">
                  <h3 className="text-xl font-bold uppercase tracking-wide text-white drop-shadow-lg">
                    {exercicio.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================
          SEÇÃO PLANILHAS EM DESTAQUE
          ==================================== */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#0D1117]" id="planilhas">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-12 text-center uppercase tracking-tight">
            PLANILHAS EM DESTAQUE
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {planilhas.map((planilha) => (
              <div 
                key={planilha.id}
                className="bg-[#151B23] rounded-xl overflow-hidden transition-all duration-300 hover:-translate-y-2 group"
                style={{ boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}
              >
                {/* Imagem do card */}
                <div className="relative h-64 overflow-hidden">
                  <img 
                    src={planilha.image} 
                    alt={planilha.alt}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="overlay-dark group-hover:bg-black/70 transition-all duration-300"></div>
                  
                  {/* Frase motivacional - aparece no hover */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 px-6">
                    <p className="text-white text-xl md:text-2xl font-bold text-center uppercase tracking-wide transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" style={{textShadow: '0 2px 20px rgba(0,0,0,0.9)'}}>
                      {planilha.frase}
                    </p>
                  </div>
                  
                  {/* Badge de documento */}
                  <div className="absolute top-4 right-4 bg-[#0D1117]/90 p-2.5 rounded-full backdrop-blur-sm">
                    <svg className="w-5 h-5 text-[#FF6A3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                </div>

                {/* Conteúdo do card */}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2 uppercase tracking-wide">
                    {planilha.title}
                  </h3>
                  <p className="text-[#8A95A6] mb-6 text-sm leading-relaxed">
                    {planilha.description}
                  </p>
                  
                  {/* Botões de ação */}
                  <div className="flex justify-between items-center">
                    <Link 
                      to={`/planilha/${planilha.id}`}
                      className="bg-[#FF6A3D] hover:bg-[#FF7A00] text-white font-semibold py-2.5 px-5 rounded-lg text-sm transition-all duration-200 hover:scale-105"
                    >
                      VISUALIZAR
                    </Link>
                    <button 
                      onClick={() => alert('Recurso de download disponível em breve!')}
                      className="text-[#8A95A6] hover:text-[#FF6A3D] transition-colors duration-200"
                      aria-label="Baixar planilha"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Glow effect no hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-xl"
                     style={{ boxShadow: '0 0 30px rgba(255, 106, 61, 0.4)' }}></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====================================
          SEÇÃO BUSCAR PLANILHAS
          ==================================== */}
      <section className="py-16 px-4 md:px-6 lg:px-8 bg-[#151B23]">
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#1C2330] rounded-2xl p-8 md:p-10 shadow-lg">
            <h2 className="text-2xl md:text-3xl font-bold mb-6 uppercase tracking-wide">
              BUSCAR PLANILHAS
            </h2>
            
            {/* Search bar */}
            <div className="relative mb-8">
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                placeholder="Procure por planilhas, exercícios ou equipamentos"
                className="input pr-12"
              />
              <svg 
                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#8A95A6] cursor-pointer hover:text-[#FF6A3D] transition-colors" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
                onClick={() => console.log('Buscando:', searchQuery)}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            {/* Chips de filtro */}
            <div className="flex flex-wrap gap-3 mb-8">
              {['TODOS', 'MÁQUINAS', 'HALTERES', 'PESO LIVRE', 'FUNCIONAL', 'CARDIO', 'HIPERTROFIA'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => handleFilterClick(filter)}
                  className={`border px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 hover:scale-105 ${
                    selectedFilter === filter 
                      ? 'bg-[#FF6A3D] border-[#FF6A3D] text-white' 
                      : 'bg-[#151B23] hover:bg-[#2D3748] border-[#2D3748] hover:border-[#FF6A3D] text-[#C7D0DD] hover:text-[#FF6A3D]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>

            {/* Resultados da busca */}
            <div className="mt-8">
              {filteredPlanilhas.length > 0 ? (
                <>
                  <p className="text-[#8A95A6] text-sm mb-4">
                    {filteredPlanilhas.length} planilha{filteredPlanilhas.length !== 1 ? 's' : ''} encontrada{filteredPlanilhas.length !== 1 ? 's' : ''}
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredPlanilhas.map((planilha) => (
                      <div 
                        key={planilha.id}
                        className="bg-[#151B23] border border-[#2D3748] rounded-xl p-5 hover:border-[#FF6A3D] transition-all duration-300 hover:shadow-lg hover:shadow-[#FF6A3D]/10 cursor-pointer group"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <h3 className="text-lg font-bold text-white group-hover:text-[#FF6A3D] transition-colors">
                            {planilha.nome}
                          </h3>
                          <span className="text-xs px-2 py-1 rounded-full bg-[#2D3748] text-[#8A95A6]">
                            {planilha.nivel}
                          </span>
                        </div>
                        <p className="text-[#8A95A6] text-sm mb-3">
                          {planilha.descricao}
                        </p>
                        <div className="flex gap-2 flex-wrap">
                          <span className="text-xs px-3 py-1 rounded-full bg-[#FF6A3D]/10 text-[#FF6A3D] border border-[#FF6A3D]/20">
                            {planilha.categoria}
                          </span>
                          <span className="text-xs px-3 py-1 rounded-full bg-[#2D3748] text-[#8A95A6]">
                            {planilha.equipamento}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-12">
                  <svg className="w-16 h-16 text-[#2D3748] mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-[#8A95A6] text-lg">Nenhuma planilha encontrada</p>
                  <p className="text-[#8A95A6] text-sm mt-2">Tente ajustar os filtros ou termo de busca</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================
          SISTEMA DE RECOMENDAÇÃO INTELIGENTE
          ==================================== */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#0D1117]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 uppercase tracking-tight">
              ESCOLHA SEU OBJETIVO
            </h2>
            <p className="text-[#C7D0DD] text-lg">
              Sistema inteligente gera a planilha ideal para você
            </p>
          </div>

          {/* Grid de objetivos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              { id: 'hipertrofia', icon: '💪', label: 'Hipertrofia Máxima' },
              { id: 'definicao', icon: '⚡', label: 'Definição' },
              { id: 'performance', icon: '🔥', label: 'Performance Atlética' },
              { id: 'emagrecimento', icon: '🎯', label: 'Emagrecimento Estratégico' }
            ].map((goal) => (
              <button
                key={goal.id}
                onClick={() => handleGoalClick(goal.id)}
                className={`group relative overflow-hidden bg-gradient-to-br from-[#161b22] to-[#1d2430] border-2 rounded-2xl p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl ${
                  selectedGoal === goal.id 
                    ? 'border-[#FF6A3D] shadow-[0_0_30px_rgba(255,106,61,0.4)]' 
                    : 'border-[#2D3748] hover:border-[#FF6A3D]'
                }`}
              >
                <div className="text-4xl mb-3">{goal.icon}</div>
                <h3 className="text-white font-bold text-sm uppercase tracking-wide">
                  {goal.label}
                </h3>
                
                {/* Efeito de brilho no hover */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-[#FF6A3D]/5 to-transparent"></div>
              </button>
            ))}
          </div>

          {/* Resultado da recomendação */}
          {showRecommendation && selectedGoal && (
            <div 
              id="recommendation-result"
              className="bg-[#161b22] rounded-2xl border border-[#2D3748] p-8 animate-fadeIn"
            >
              <div className={`inline-block px-4 py-2 rounded-full bg-gradient-to-r ${recommendations[selectedGoal].color} text-white font-bold text-sm mb-6`}>
                RECOMENDAÇÃO PERSONALIZADA
              </div>
              
              <h3 className="text-3xl font-bold mb-3 uppercase">
                {recommendations[selectedGoal].title}
              </h3>
              
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-6 h-6 text-[#FF6A3D]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xl font-semibold text-[#FF6A3D]">
                  {recommendations[selectedGoal].plan}
                </p>
              </div>
              
              <p className="text-[#C7D0DD] text-lg leading-relaxed mb-8">
                {recommendations[selectedGoal].description}
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {recommendations[selectedGoal].features.map((feature, index) => (
                  <div key={index} className="bg-[#0D1117] rounded-xl p-4 border border-[#2D3748]">
                    <p className="text-[#C7D0DD] text-sm font-medium text-center">{feature}</p>
                  </div>
                ))}
              </div>
              
              <div className="flex flex-wrap gap-4">
                <button className="btn-primary">
                  BAIXAR PLANILHA
                </button>
                <button 
                  onClick={() => setShowRecommendation(false)}
                  className="btn-tertiary"
                >
                  VER OUTRAS OPÇÕES
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ====================================
          SEÇÃO FEATURE + IMAGEM (2 colunas)
          ==================================== */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#151B23]" id="metodologia">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Coluna de texto */}
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 leading-tight uppercase">
              TREINO SÉRIO.<br/>
              ESTÉTICA DE PALCO.
            </h2>
            
            <p className="text-[#C7D0DD] mb-8 text-lg leading-relaxed">
              Na MuscleMax você encontra planilhas diretas, objetivas e testadas. 
              Baixo volume, alta intensidade e progresso de verdade.
            </p>

            {/* Lista com check icons */}
            <ul className="space-y-4 mb-8">
              {[
                'Metodologia comprovada',
                'Planilhas em PDF',
                'Atualização constante',
                'Suporte no WhatsApp'
              ].map((item, index) => (
                <li key={index} className="flex items-start gap-3">
                  <svg className="w-6 h-6 text-[#FF6A3D] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="text-[#C7D0DD] text-base">{item}</span>
                </li>
              ))}
            </ul>

            {/* CTA WhatsApp */}
            <a 
              href="https://wa.me/5519999999999" 
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tertiary inline-block"
            >
              FALAR NO WHATSAPP
            </a>
          </div>

          {/* Coluna de imagem */}
          <div className="rounded-xl overflow-hidden shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=2400&h=1800&fit=crop" 
              alt="Atleta executando levantamento terra com perfeita técnica e intensidade" 
              className="w-full h-auto object-cover rounded-xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </section>

      {/* ====================================
          AVALIAÇÃO IA DE FÍSICO (FUNCIONAL)
          ==================================== */}
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-[#0D1117]">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-br from-[#161b22] to-[#1d2430] rounded-3xl border-2 border-[#2D3748] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              
              {/* Lado esquerdo - Texto */}
              <div className="p-10 lg:p-12 flex flex-col justify-center">
                <div className="inline-block px-4 py-2 rounded-full bg-gradient-to-r from-[#FFD700] to-[#FF8C00] text-black font-bold text-xs mb-6 w-fit">
                  🔥 AGORA DISPONÍVEL • TECNOLOGIA IA
                </div>
                
                <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight uppercase">
                  ANÁLISE IA DE<br/>PONTOS FRACOS
                </h2>
                
                <p className="text-[#C7D0DD] text-lg leading-relaxed mb-8">
                  Envie uma foto do seu físico e receba análise automática completa em segundos:
                </p>
                
                <ul className="space-y-4 mb-8">
                  {[
                    'Identificação de grupos musculares defasados',
                    'Simetria e proporções avaliadas',
                    'Recomendação de treino personalizado',
                    'Análise de percentual de gordura'
                  ].map((item, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-[#FFD700] flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-[#C7D0DD]">{item}</span>
                    </li>
                  ))}
                </ul>
                
                {!uploadedImage ? (
                  <label className="btn-secondary w-fit cursor-pointer">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    📸 FAZER UPLOAD DA FOTO
                  </label>
                ) : (
                  <div className="flex gap-4">
                    <button 
                      onClick={analyzePhysique}
                      disabled={isAnalyzing}
                      className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAnalyzing ? '⚡ ANALISANDO...' : '🔍 ANALISAR AGORA'}
                    </button>
                    <button 
                      onClick={resetAnalysis}
                      className="btn-tertiary"
                    >
                      🔄 NOVA FOTO
                    </button>
                  </div>
                )}
                
                <p className="text-[#8A95A6] text-xs mt-4">
                  {uploadedImage ? '✅ Foto carregada com sucesso' : '🔒 Seus dados são privados e não são armazenados'}
                </p>
              </div>

              {/* Lado direito - Upload/Preview */}
              <div className="relative bg-[#0D1117] p-10 flex items-center justify-center">
                <div className="relative w-full max-w-xs">
                  
                  {!uploadedImage ? (
                    /* Área de upload */
                    <label className="cursor-pointer">
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <div className="aspect-[3/4] rounded-2xl border-2 border-dashed border-[#2D3748] bg-[#161b22] flex flex-col items-center justify-center p-8 text-center group hover:border-[#FF6A3D] transition-all duration-300">
                        <svg className="w-16 h-16 text-[#2D3748] group-hover:text-[#FF6A3D] transition-colors mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p className="text-[#8A95A6] text-sm font-medium group-hover:text-[#FF6A3D] transition-colors">
                          Clique para fazer upload<br/>da sua foto
                        </p>
                        <p className="text-[#8A95A6] text-xs mt-2">
                          JPG, PNG ou HEIC
                        </p>
                      </div>
                    </label>
                  ) : (
                    /* Preview da imagem */
                    <div className="aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#FF6A3D] shadow-lg shadow-[#FF6A3D]/30 relative">
                      <img 
                        src={uploadedImage} 
                        alt="Físico para análise" 
                        className="w-full h-full object-cover"
                      />
                      {isAnalyzing && (
                        <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                          <div className="text-center">
                            <div className="w-16 h-16 border-4 border-[#FF6A3D] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                            <p className="text-white font-bold text-lg">Analisando...</p>
                            <p className="text-[#8A95A6] text-sm mt-2">IA processando imagem</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                  
                  {/* Elementos decorativos */}
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] rounded-full blur-3xl opacity-20"></div>
                  <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-gradient-to-br from-[#FFD700] to-[#FF8C00] rounded-full blur-3xl opacity-20"></div>
                </div>
              </div>

            </div>
          </div>

          {/* Resultado da Análise */}
          {analysisResult && (
            <div 
              id="analysis-result"
              className="mt-8 bg-[#161b22] rounded-3xl border-2 border-[#2D3748] p-8 animate-fadeIn"
            >
              {/* Header do Resultado */}
              <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#2D3748]">
                <div>
                  <h3 className="text-3xl font-bold mb-2 uppercase">ANÁLISE COMPLETA</h3>
                  <p className="text-[#8A95A6]">Gerado por IA • MuscleMax Performance System</p>
                </div>
                <div className="text-right">
                  <div className="text-5xl font-bold text-[#FF6A3D] mb-1">{analysisResult.score}</div>
                  <p className="text-[#8A95A6] text-sm">Score Geral</p>
                </div>
              </div>

              {/* Grid de Informações */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                
                {/* Pontos Fracos */}
                <div className="bg-[#0D1117] rounded-2xl p-6 border border-[#2D3748]">
                  <h4 className="text-xl font-bold mb-4 text-[#FF6A3D] uppercase flex items-center gap-2">
                    <span>⚠️</span> Pontos Fracos
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.pontosFracos.map((ponto, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#161b22] rounded-lg">
                        <div>
                          <p className="text-white font-semibold">{ponto.grupo}</p>
                          <p className="text-[#8A95A6] text-sm">{ponto.nivel}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          ponto.prioridade === 'Alta' ? 'bg-red-500/20 text-red-400' :
                          ponto.prioridade === 'Média' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-blue-500/20 text-blue-400'
                        }`}>
                          {ponto.prioridade}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Pontos Fortes */}
                <div className="bg-[#0D1117] rounded-2xl p-6 border border-[#2D3748]">
                  <h4 className="text-xl font-bold mb-4 text-[#10B981] uppercase flex items-center gap-2">
                    <span>✅</span> Pontos Fortes
                  </h4>
                  <div className="space-y-3">
                    {analysisResult.pontosFortes.map((ponto, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-[#161b22] rounded-lg">
                        <p className="text-white font-semibold">{ponto.grupo}</p>
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-500/20 text-green-400">
                          {ponto.nivel}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Simetria e Percentual */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-[#0D1117] rounded-2xl p-6 border border-[#2D3748]">
                  <h4 className="text-lg font-bold mb-3 uppercase">Simetria</h4>
                  <div className="flex items-center gap-4 mb-3">
                    <div className="text-3xl font-bold text-[#FFD700]">{analysisResult.simetria.score}%</div>
                    <div className="flex-1 bg-[#161b22] rounded-full h-3 overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-[#FFD700] to-[#FF8C00] h-full rounded-full transition-all duration-1000"
                        style={{ width: `${analysisResult.simetria.score}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-[#8A95A6] text-sm">{analysisResult.simetria.observacao}</p>
                </div>

                <div className="bg-[#0D1117] rounded-2xl p-6 border border-[#2D3748]">
                  <h4 className="text-lg font-bold mb-3 uppercase">Percentual de Gordura</h4>
                  <div className="text-4xl font-bold text-[#FF6A3D] mb-2">{analysisResult.percentualGordura}</div>
                  <p className="text-[#8A95A6] text-sm">Estimativa baseada em análise visual</p>
                </div>
              </div>

              {/* Recomendações */}
              <div className="bg-gradient-to-br from-[#FF6A3D]/10 to-[#FF1493]/10 rounded-2xl p-6 border border-[#FF6A3D]/30">
                <h4 className="text-2xl font-bold mb-6 uppercase text-[#FF6A3D]">📋 Recomendações</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <p className="text-[#8A95A6] text-sm mb-2">Divisão Recomendada</p>
                    <p className="text-white font-bold text-lg">{analysisResult.recomendacao.divisao}</p>
                  </div>
                  <div>
                    <p className="text-[#8A95A6] text-sm mb-2">Frequência</p>
                    <p className="text-white font-bold text-lg">{analysisResult.recomendacao.frequencia}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <p className="text-[#8A95A6] text-sm mb-2">Ajuste de Volume</p>
                  <p className="text-white font-semibold">{analysisResult.recomendacao.volume}</p>
                </div>

                <div className="mb-6">
                  <p className="text-[#8A95A6] text-sm mb-3">Exercícios Prioritários</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {analysisResult.recomendacao.exercicios.map((exercicio, index) => (
                      <div key={index} className="flex items-center gap-2 bg-[#0D1117]/50 rounded-lg p-3">
                        <span className="text-[#FF6A3D] font-bold">{index + 1}.</span>
                        <span className="text-white text-sm">{exercicio}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[#0D1117]/50 rounded-xl p-4 border border-[#2D3748]">
                  <p className="text-[#C7D0DD] text-sm leading-relaxed">
                    <span className="font-bold text-[#FFD700]">Observação:</span> {analysisResult.observacoes}
                  </p>
                </div>
              </div>

              {/* CTAs finais */}
              <div className="mt-8 flex flex-wrap gap-4 justify-center">
                <button className="btn-primary">
                  💾 SALVAR ANÁLISE
                </button>
                <button className="btn-secondary">
                  📱 COMPARTILHAR COM COACH
                </button>
                <button onClick={resetAnalysis} className="btn-tertiary">
                  🔄 NOVA ANÁLISE
                </button>
              </div>
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <Footer />

      {/* Chat AI flutuante */}
      <AIChat />

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  )
}

