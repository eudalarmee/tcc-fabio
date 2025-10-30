#!/usr/bin/env node

/**
 * MUSCLEMAX - Script de Verificação do Frontend
 * Testa se o servidor Vite está rodando e respondendo corretamente
 */

const FRONTEND_URL = 'http://127.0.0.1:5173';
const TIMEOUT = 5000; // 5 segundos

console.log('🔍 Verificando frontend MUSCLEMAX...\n');

async function checkFrontend() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT);

    console.log(`⏳ Tentando conectar em ${FRONTEND_URL}...`);
    
    const response = await fetch(FRONTEND_URL, {
      signal: controller.signal,
      method: 'GET',
      headers: {
        'User-Agent': 'MUSCLEMAX-Health-Check'
      }
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const html = await response.text();
      
      // Verifica se é uma página HTML válida
      if (html.includes('<!DOCTYPE html>') || html.includes('<html')) {
        console.log('✅ SUCESSO: Frontend está rodando e respondendo!');
        console.log(`   URL: ${FRONTEND_URL}`);
        console.log(`   Status: ${response.status} ${response.statusText}`);
        console.log(`   Content-Type: ${response.headers.get('content-type')}`);
        console.log('\n🚀 Frontend OK - Pronto para uso!\n');
        process.exit(0);
      } else {
        console.error('⚠️ AVISO: Resposta recebida, mas não é HTML válido');
        console.log('Primeiros 200 caracteres:', html.substring(0, 200));
        process.exit(1);
      }
    } else {
      console.error(`❌ ERRO: Status ${response.status} ${response.statusText}`);
      process.exit(1);
    }
  } catch (error) {
    if (error.name === 'AbortError') {
      console.error(`❌ TIMEOUT: Frontend não respondeu em ${TIMEOUT}ms`);
      console.error('   O servidor Vite pode não estar rodando.\n');
    } else if (error.code === 'ECONNREFUSED') {
      console.error('❌ ERR_CONNECTION_REFUSED: Nenhum servidor na porta 5173');
      console.error('   Certifique-se de rodar: npm run dev\n');
    } else {
      console.error('❌ ERRO ao verificar frontend:', error.message);
      if (error.cause) {
        console.error('   Causa:', error.cause.message);
      }
    }

    console.log('\n📋 Diagnóstico:');
    console.log('   1. Verifique se o Vite está rodando: lsof -iTCP:5173 -sTCP:LISTEN');
    console.log('   2. Inicie o servidor: npm run dev');
    console.log('   3. Mate processos presos: npx kill-port 5173\n');
    
    process.exit(1);
  }
}

checkFrontend();
