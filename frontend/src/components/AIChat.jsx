import { useState, useEffect, useRef } from 'react';
import { askAI, WELCOME_MESSAGE, saveConversation, loadConversation, clearConversation } from '../services/aiService';

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Carregar histórico ao abrir
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const saved = loadConversation();
      if (saved.length > 0) {
        setMessages(saved);
      } else {
        // Adicionar mensagem de boas-vindas
        setMessages([
          {
            role: 'assistant',
            content: WELCOME_MESSAGE,
            timestamp: new Date().toISOString()
          }
        ]);
      }
    }
  }, [isOpen]);

  // Auto-scroll para última mensagem
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Focar input ao abrir
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Salvar conversa quando mudar
  useEffect(() => {
    if (messages.length > 0) {
      saveConversation(messages);
    }
  }, [messages]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = {
      role: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toISOString()
    };

    // Adicionar mensagem do usuário
    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Preparar histórico para IA (formato simplificado)
      const conversationHistory = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      // Consultar IA
      const aiResponse = await askAI(inputMessage, conversationHistory);

      // Adicionar resposta da IA
      const assistantMessage = {
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage = {
        role: 'assistant',
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        timestamp: new Date().toISOString()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleClearChat = () => {
    clearConversation();
    setMessages([
      {
        role: 'assistant',
        content: WELCOME_MESSAGE,
        timestamp: new Date().toISOString()
      }
    ]);
  };

  return (
    <>
      {/* Botão flutuante com microinterações */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`
          fixed bottom-6 right-6 z-50
          w-16 h-16 rounded-full
          bg-gradient-to-br from-[#FF6A3D] to-[#FF1493]
          shadow-2xl hover:shadow-[0_0_40px_rgba(255,106,61,0.6)]
          flex items-center justify-center
          transition-all duration-500
          hover:scale-110 hover:rotate-3
          ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}
          group
        `}
        aria-label="Assistente de IA"
      >
        {/* Ícone de chat */}
        <svg 
          className="w-7 h-7 text-white transition-transform duration-300 group-hover:scale-110" 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" 
          />
        </svg>
      </button>

      {/* Modal do chat */}
      <div
        className={`
          fixed bottom-6 right-6 z-50
          w-[400px] h-[600px] max-w-[calc(100vw-3rem)] max-h-[calc(100vh-3rem)]
          bg-[#151B23] rounded-2xl shadow-2xl
          flex flex-col overflow-hidden
          border border-[#1C2330]
          transition-all duration-300 origin-bottom-right
          ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}
        `}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold text-white text-lg">Assistente AI MuscleMax</h3>
              <p className="text-white/80 text-xs">Online agora</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Botão limpar chat */}
            <button
              onClick={handleClearChat}
              className="text-white/80 hover:text-white transition-colors"
              title="Limpar conversa"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </button>
            
            {/* Botão fechar */}
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mensagens */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`
                  max-w-[80%] rounded-2xl px-4 py-3
                  ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] text-white'
                    : 'bg-[#1C2330] text-[#C7D0DD]'
                  }
                `}
              >
                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                <span className="text-xs opacity-60 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString('pt-BR', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          ))}
          
          {/* Loading indicator */}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-[#1C2330] rounded-2xl px-4 py-3">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-[#FF6A3D] rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-[#FF6A3D] rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-[#FF6A3D] rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-[#1C2330]">
          <div className="flex gap-2">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Pergunte qualquer coisa sobre treinos ou estratégia..."
              className="flex-1 bg-[#1C2330] text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[#FF6A3D]"
              disabled={isLoading}
            />
            <button
              onClick={handleSend}
              disabled={!inputMessage.trim() || isLoading}
              className="btn-primary px-6 py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
          
          {/* Hint */}
          <p className="text-xs text-[#8A95A6] mt-2 text-center">
            Assistente inteligente • Respostas em tempo real
          </p>
        </div>
      </div>
    </>
  );
}
