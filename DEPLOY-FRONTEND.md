# 🚀 Deploy do Frontend - Guia Rápido

## 📋 Configuração Pronta!

O frontend já está configurado para deploy. Agora siga estes passos:

---

## 🌐 Deploy na Vercel

### 1️⃣ Acesse a Vercel
- Vá para: https://vercel.com/new
- Faça login com GitHub

### 2️⃣ Importe o Repositório
- Clique em **Import Git Repository**
- Selecione: `eudalarmee/tcc-fabio`
- **IMPORTANTE:** Configure **Root Directory** para: `frontend`

### 3️⃣ Configure as Variáveis de Ambiente

Clique em **Environment Variables** e adicione:

```
VITE_API_URL
https://musclemaxx.vercel.app

VITE_API_BASE_URL
https://musclemaxx.vercel.app/api

VITE_AI_PROVIDER
gemini

VITE_GEMINI_API_KEY
AIzaSyCEntDSZ-X2__B_67g9tAiMt3S5wDFScR4
```

### 4️⃣ Deploy
- Clique em **Deploy**
- Aguarde 2-3 minutos

### 5️⃣ Atualize o CORS no Backend

Após o deploy, você vai receber uma URL tipo: `https://tcc-fabio-frontend.vercel.app`

Atualize o arquivo `backend/server.js` adicionando essa URL no CORS:

```javascript
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://musclemaxx.vercel.app',
  'https://tcc-fabio-frontend.vercel.app', // ← ADICIONE ESTA LINHA
  /\.vercel\.app$/
];
```

Depois faça:
```bash
git add backend/server.js
git commit -m "fix: Adiciona URL do frontend no CORS"
git push origin main
```

A Vercel vai fazer redeploy automático do backend!

---

## ✅ Pronto!

Ambos estarão funcionando:
- **Backend:** https://musclemaxx.vercel.app
- **Frontend:** https://sua-url-aqui.vercel.app

---

## 🔧 Configurações Automáticas

O `vercel.json` já está configurado com:
- ✅ Framework: Vite
- ✅ Build Command: `npm run build`
- ✅ Output Directory: `dist`
- ✅ Variáveis de ambiente da API

---

**Última atualização:** 28 de Outubro de 2025
