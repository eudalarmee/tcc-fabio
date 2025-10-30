/**
 * Serviço de IA - Integração REAL com Google Gemini
 * 
 * Configuração via .env:
 * VITE_AI_PROVIDER = gemini
 * VITE_GEMINI_API_KEY = ...
 */

import { GoogleGenerativeAI } from "@google/generative-ai";

const AI_PROVIDER = import.meta.env.VITE_AI_PROVIDER;
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// Inicializar o cliente Gemini
let genAI = null;
let model = null;

if (GEMINI_API_KEY) {
  try {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    console.log('✅ [Gemini] Cliente inicializado com sucesso');
  } catch (error) {
    console.error('❌ [Gemini] Erro ao inicializar cliente:', error);
  }
}


// Mensagem de boas-vindas padrão
export const WELCOME_MESSAGE = "Olá! Sou a assistente inteligente da MuscleMax. Posso te ajudar com estratégias de treino, dúvidas sobre metodologia e orientação personalizada. Pergunte qualquer coisa!";

/**
 * Função principal para enviar mensagem à IA
 * @param {string} message - Mensagem do usuário
 * @param {Array} conversationHistory - Histórico da conversa
 * @returns {Promise<string>} Resposta da IA
 */
export async function askAI(message, conversationHistory = []) {
  console.log('🤖 [AI Service] Provider:', AI_PROVIDER);
  console.log('🔑 [AI Service] Gemini Key:', GEMINI_API_KEY ? 'Configurada ✅' : 'NÃO configurada ❌');
  
  try {
    if (AI_PROVIDER === 'gemini') {
      return await askGemini(message, conversationHistory);
    } else {
      throw new Error(`Provider '${AI_PROVIDER}' não suportado. Use 'gemini'.`);
    }
  } catch (error) {
    console.error('❌ [AI Service] Erro ao consultar IA:', error);
    return `Desculpe, ocorreu um erro ao consultar a IA: ${error.message}. Verifique suas configurações.`;
  }
}

/**
 * GEMINI - Integração REAL com Google Gemini usando SDK oficial
 */
async function askGemini(message, conversationHistory) {
  console.log('🔵 [Gemini] Iniciando chamada à API...');
  
  if (!GEMINI_API_KEY) {
    const errorMsg = '⚠️ VITE_GEMINI_API_KEY não configurada no .env';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  if (!model) {
    throw new Error('Modelo Gemini não inicializado. Verifique a API Key.');
  }

  try {
    // Construir o prompt do sistema
    const systemPrompt = `Você é a assistente inteligente da MuscleMax, uma plataforma premium de treinos e performance.

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
`;

    // Construir histórico de conversa no formato do Gemini
    let fullPrompt = systemPrompt + '\n\n';
    
    if (conversationHistory.length > 0) {
      fullPrompt += 'HISTÓRICO DA CONVERSA:\n';
      conversationHistory.slice(-4).forEach(msg => {
        fullPrompt += `${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content}\n`;
      });
      fullPrompt += '\n';
    }

    fullPrompt += `Usuário: ${message}\n\nAssistente:`;

    console.log('🔵 [Gemini] Gerando conteúdo...');
    
    // Gerar resposta usando o SDK
    const result = await model.generateContent(fullPrompt);

    const response = result.response;
    const reply = response.text().trim();
    
    console.log('✅ [Gemini] Resposta processada:', reply);
    return reply;
    
  } catch (error) {
    console.error('❌ [Gemini] Erro fatal:', error);
    
    // Tratamento específico de erros
    if (error.message?.includes('429') || error.message?.includes('exhausted')) {
      throw new Error('Limite de requisições excedido. Aguarde alguns minutos e tente novamente.');
    }
    
    if (error.message?.includes('API key')) {
      throw new Error('Chave de API inválida. Verifique sua configuração.');
    }
    
    throw new Error(error.message || 'Erro ao se comunicar com a IA. Tente novamente.');
  }
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
