# 🚀 COMO ATIVAR A IA 100% FUNCIONAL - GUIA COMPLETO

## ⚡ Opção 1: Google Gemini (GRATUITO) ⭐ RECOMENDADO

### Passo 1: Obter API Key GRATUITA
1. Acesse: **https://makersuite.google.com/app/apikey**
2. Faça login com sua conta Google
3. Clique em **"Create API Key"** ou **"Get API Key"**
4. Copie a chave que aparece (formato: `AIzaSy...`)

### Passo 2: Configurar no Projeto
1. Abra o arquivo: `/Applications/tcc-fabio/frontend/.env`
2. Localize a linha: `# VITE_GEMINI_API_KEY=SUA_CHAVE_AQUI`
3. Remova o `#` e cole sua chave:
   ```bash
   VITE_GEMINI_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXX
   ```
4. Certifique-se que está configurado:
   ```bash
   VITE_AI_PROVIDER=gemini
   ```

### Passo 3: Reiniciar o Servidor
```bash
# Pare o servidor (Ctrl+C no terminal)
# Inicie novamente:
npm run dev
```

### Passo 4: Testar
1. Acesse: http://localhost:5173
2. Clique no botão flutuante laranja/rosa (canto inferior direito)
3. Pergunte algo como: **"Como ganhar massa muscular?"**
4. A IA responderá em 2-3 segundos com resposta personalizada!

---

## 💎 Opção 2: OpenAI GPT-4 (PAGO)

Se preferir usar o GPT-4 da OpenAI (mais avançado, porém pago):

### Passo 1: Obter API Key
1. Acesse: **https://platform.openai.com/api-keys**
2. Crie uma conta e adicione créditos ($5-$20 recomendado)
3. Clique em **"Create new secret key"**
4. Copie a chave (formato: `sk-proj-...`)

### Passo 2: Configurar
Edite o arquivo `.env`:
```bash
VITE_AI_PROVIDER=openai
VITE_OPENAI_API_KEY=sk-proj-XXXXXXXXXXXXXXXXXXXXXXXX
```

### Passo 3: Reiniciar
```bash
npm run dev
```

---

## ✅ Como Saber se Está Funcionando

### Modo Mock (Fallback)
- Respostas instantâneas (< 1 segundo)
- Responde baseado em palavras-chave
- Mensagens pré-programadas inteligentes

### Modo IA Real (Gemini/OpenAI)
- Pequeno delay (1-3 segundos)
- Respostas contextuais e personalizadas
- Entende perguntas complexas
- Lembra do histórico da conversa

---

## 🆘 Troubleshooting

### "IA não responde diferente"
✅ Verifique se a API key está sem o `#` no `.env`
✅ Reinicie o servidor com `Ctrl+C` e `npm run dev`
✅ Limpe o cache do navegador (Cmd+Shift+R)

### "Erro 400/401"
✅ API key inválida ou expirada
✅ Gere uma nova chave

### "Respostas muito genéricas"
✅ Você está no modo Mock (sem API key)
✅ Configure a API key conforme instruções acima

---

## 📊 Comparação

| Feature | Mock | Gemini | OpenAI GPT-4 |
|---------|------|--------|--------------|
| **Custo** | Grátis | Grátis | ~$0.03/1k tokens |
| **Qualidade** | ⭐⭐⭐ | ⭐⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| **Velocidade** | Instantâneo | 1-2s | 2-3s |
| **Contexto** | Limitado | Bom | Excelente |
| **Setup** | Nenhum | 2 minutos | 5 minutos |

---

## 🎯 Recomendação

**Para TCC/Demonstração**: Use **Gemini** (gratuito e funciona muito bem)
**Para Produção Real**: Use **OpenAI GPT-4** (melhor qualidade)
**Sem API Key**: O **Mock** já é inteligente e profissional

---

## 📝 Resumo Rápido

```bash
# 1. Obter chave grátis
https://makersuite.google.com/app/apikey

# 2. Editar .env
nano /Applications/tcc-fabio/frontend/.env

# 3. Adicionar (sem o #):
VITE_GEMINI_API_KEY=sua_chave_aqui

# 4. Reiniciar
npm run dev

# 5. Testar em
http://localhost:5173
```

**Tempo total: 3 minutos** ⚡

---

Desenvolvido para MuscleMax | Assistente 100% funcional
