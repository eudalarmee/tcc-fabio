/**
 * Serviço de IA - Integração REAL com OpenAI GPT-4
 * 
 * Configuração via .env:
 * VITE_AI_PROVIDER = openai | gemini | azure | mock
 * VITE_OPENAI_API_KEY = sk-...
 * VITE_GEMINI_API_KEY = ...
 * VITE_AZURE_ENDPOINT = ...
 */

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER || 'openai';
const OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const AZURE_ENDPOINT = import.meta.env.VITE_AZURE_ENDPOINT;

// Mensagem de boas-vindas padrão
export const WELCOME_MESSAGE = "Olá! Sou a assistente inteligente da MuscleMax. Posso te ajudar com estratégias de treino, dúvidas sobre metodologia e orientação personalizada. Pergunte qualquer coisa!";

/**
 * Função principal para enviar mensagem à IA
 * @param {string} message - Mensagem do usuário
 * @param {Array} conversationHistory - Histórico da conversa
 * @returns {Promise<string>} Resposta da IA
 */
export async function askAI(message, conversationHistory = []) {
  try {
    switch (AI_PROVIDER) {
      case 'openai':
        return await askOpenAI(message, conversationHistory);
      
      case 'gemini':
        return await askGemini(message, conversationHistory);
      
      case 'azure':
        return await askAzure(message, conversationHistory);
      
      case 'mock':
      default:
        return await askMock(message, conversationHistory);
    }
  } catch (error) {
    console.error('Erro ao consultar IA:', error);
    return 'Desculpe, ocorreu um erro. Tente novamente em alguns instantes.';
  }
}

/**
 * MOCK - Respostas simuladas inteligentes (fallback)
 */
async function askMock(message, conversationHistory) {
  // Simula delay de API
  await new Promise(resolve => setTimeout(resolve, 800));

  const msgLower = message.toLowerCase();

  // Respostas contextuais profissionais
  if (msgLower.includes('hipertrofia') || msgLower.includes('ganhar massa') || msgLower.includes('musculo')) {
    return "Para sua fase atual de hipertrofia, eu recomendo uma divisão ABC ou ABCD com foco em volume moderado-alto (8-12 reps). Priorize exercícios compostos (agachamento, supino, levantamento terra) e mantenha a progressão de carga semanal. A MuscleMax oferece planilhas personalizadas com periodização científica para maximizar seus ganhos.";
  }

  if (msgLower.includes('definição') || msgLower.includes('secar') || msgLower.includes('perder gordura')) {
    return "Para sua fase de definição, combine treinos de força (manter massa) com déficit calórico controlado. Mantenha alta frequência proteica (2g/kg) e considere HIIT 2-3x/semana. Nossa metodologia integra nutrição e treino para resultados visíveis em 8-12 semanas.";
  }

  if (msgLower.includes('treino') || msgLower.includes('exercicio') || msgLower.includes('rotina')) {
    return "Para sua fase atual, eu recomendo começar com uma avaliação do seu nível. Iniciantes: divisão AB (superior/inferior). Intermediários: ABC ou ABCD. Avançados: especialização por grupo muscular. Explore nossas planilhas na página inicial — cada uma com progressão inteligente e biomecânica otimizada.";
  }

  if (msgLower.includes('metodologia') || msgLower.includes('como funciona') || msgLower.includes('ciência')) {
    return "Nossa metodologia se baseia em três pilares científicos: 1) Periodização (progressão de volume e intensidade), 2) Biomecânica (execução perfeita para evitar lesões), 3) Nutrição Integrada (timing e suplementação estratégica). Tudo validado por estudos peer-reviewed.";
  }

  if (msgLower.includes('começar') || msgLower.includes('iniciar') || msgLower.includes('cadastro') || msgLower.includes('entrar')) {
    return "Para começar, clique em 'ACESSAR' no topo da página e crie sua conta. Você terá acesso imediato às planilhas, acompanhamento profissional e comunidade exclusiva. A jornada começa hoje — sem desculpas.";
  }

  if (msgLower.includes('preço') || msgLower.includes('valor') || msgLower.includes('custo') || msgLower.includes('plano')) {
    return "Trabalhamos com planos flexíveis adaptados ao seu objetivo. Entre em contato via WhatsApp (ícone no rodapé) para conhecer condições especiais e escolher o melhor investimento para sua transformação.";
  }

  if (msgLower.includes('resultado') || msgLower.includes('quanto tempo') || msgLower.includes('prazo')) {
    return "Resultados consistentes aparecem entre 8-12 semanas com dedicação total. Variações dependem de genética, nutrição e consistência. Confira depoimentos reais na seção 'Resultados' — transformações verificadas de alunos que não faltam.";
  }

  if (msgLower.includes('dieta') || msgLower.includes('alimentação') || msgLower.includes('nutrição')) {
    return "Para sua fase atual, priorize proteína (2-2.5g/kg), carboidratos no pré/pós-treino e gorduras saudáveis. Evite déficits extremos. Nossa metodologia integra nutrição às planilhas — com timing estratégico de refeições para máxima performance.";
  }

  if (msgLower.includes('suplemento') || msgLower.includes('whey') || msgLower.includes('creatina')) {
    return "Suplementação básica eficaz: Whey Protein (pós-treino), Creatina 5g/dia, Multivitamínico. Evite produtos 'milagrosos'. Foco em dieta sólida primeiro. Nossos planos incluem protocolos de suplementação baseados em evidências.";
  }

  // Resposta genérica consultiva
  return "Entendo sua dúvida. Para te orientar melhor, você pode explorar nossas planilhas especializadas (hipertrofia, definição, performance), conferir a metodologia completa na página ou me fazer perguntas específicas sobre treino, nutrição ou estratégia. Como posso te ajudar agora?";
}

/**
 * OPENAI - Integração REAL com GPT-4
 */
async function askOpenAI(message, conversationHistory) {
  if (!OPENAI_API_KEY) {
    console.warn('⚠️ VITE_OPENAI_API_KEY não configurada - usando fallback inteligente');
    return await askMock(message, conversationHistory);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `Você é a assistente inteligente da MuscleMax, uma plataforma premium de treinos e performance.

PERSONALIDADE:
- Tom consultivo e profissional (como um treinador sério e experiente)
- Respostas objetivas, precisas e diretas
- Português natural, sem robótico
- Evite emojis excessivos ou linguagem infantil

CONTEXTO DA MUSCLEMAX:
- Metodologia baseada em: Periodização Científica, Análise Biomecânica e Nutrição Integrada
- Focamos em: hipertrofia, definição muscular, performance e estética de competição
- Oferecemos planilhas personalizadas, acompanhamento profissional e tecnologia de ponta
- Público-alvo: atletas sérios, pessoas comprometidas com resultados reais

DIRETRIZES DE RESPOSTA:
1. Inicie com "Para sua fase atual, eu recomendo..." quando der dicas
2. Seja específico: cite exercícios, divisões de treino (ABC, ABCDE), periodização
3. Se perguntarem sobre a plataforma, mencione os benefícios da MuscleMax
4. Respostas curtas (2-4 frases), exceto quando pedirem detalhes
5. Incentive, mas com seriedade — não seja "motivacional demais"

Responda sempre em português do Brasil.`
          },
          ...conversationHistory.slice(-6), // Últimas 6 mensagens para contexto
          {
            role: 'user',
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 300,
        top_p: 1,
        frequency_penalty: 0.3,
        presence_penalty: 0.3
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('Erro OpenAI:', errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('Erro ao consultar OpenAI:', error);
    return await askMock(message, conversationHistory);
  }
}

/**
 * GEMINI - Integração com Google Gemini
 */
async function askGemini(message, conversationHistory) {
  if (!GEMINI_API_KEY) {
    console.warn('VITE_GEMINI_API_KEY não configurada');
    return await askMock(message, conversationHistory);
  }

  // TODO: Descomentar quando tiver a API key
  /*
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Você é a IA assistente da MuscleMax. Contexto: ${JSON.stringify(conversationHistory)}\n\nUsuário: ${message}`
              }
            ]
          }
        ]
      })
    }
  );

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
  */

  return await askMock(message, conversationHistory);
}

/**
 * AZURE - Integração com Azure OpenAI
 */
async function askAzure(message, conversationHistory) {
  if (!AZURE_ENDPOINT) {
    console.warn('VITE_AZURE_ENDPOINT não configurado');
    return await askMock(message, conversationHistory);
  }

  // TODO: Descomentar quando tiver o endpoint configurado
  /*
  const response = await fetch(AZURE_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'api-key': import.meta.env.VITE_AZURE_API_KEY
    },
    body: JSON.stringify({
      messages: [
        {
          role: 'system',
          content: 'Você é a IA assistente da MuscleMax.'
        },
        ...conversationHistory,
        {
          role: 'user',
          content: message
        }
      ]
    })
  });

  const data = await response.json();
  return data.choices[0].message.content;
  */

  return await askMock(message, conversationHistory);
}

/**
 * Salvar conversa no sessionStorage
 */
export function saveConversation(messages) {
  try {
    sessionStorage.setItem('musclemax_chat', JSON.stringify(messages));
  } catch (error) {
    console.error('Erro ao salvar conversa:', error);
  }
}

/**
 * Carregar conversa do sessionStorage
 */
export function loadConversation() {
  try {
    const saved = sessionStorage.getItem('musclemax_chat');
    return saved ? JSON.parse(saved) : [];
  } catch (error) {
    console.error('Erro ao carregar conversa:', error);
    return [];
  }
}

/**
 * Limpar conversa
 */
export function clearConversation() {
  sessionStorage.removeItem('musclemax_chat');
}
