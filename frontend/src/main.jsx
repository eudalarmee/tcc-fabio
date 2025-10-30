import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

console.log('🚀 MUSCLEMAX - Iniciando aplicação...');

try {
  const rootElement = document.getElementById('root');
  
  if (!rootElement) {
    console.error('❌ ERRO CRÍTICO: Elemento #root não encontrado!');
    document.body.innerHTML = '<div style="padding: 20px; font-family: sans-serif;"><h1>❌ Erro ao carregar MUSCLEMAX</h1><p>Elemento root não encontrado. Verifique o console.</p></div>';
  } else {
    console.log('✅ Elemento root encontrado, criando aplicação...');
    
    ReactDOM.createRoot(rootElement).render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    
    console.log('✅ App renderizado com sucesso!');
  }
} catch (error) {
  console.error('❌ ERRO FATAL ao renderizar:', error);
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: sans-serif; background: #fee; border: 2px solid red;">
      <h1>❌ Erro Fatal - MUSCLEMAX</h1>
      <pre>${error.message}</pre>
      <pre>${error.stack}</pre>
    </div>
  `;
}
