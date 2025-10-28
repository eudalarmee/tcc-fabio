# 🚀 DEPLOY RÁPIDO - Backend na Vercel

## ⚡ Passo a Passo Rápido

### 1️⃣ Acesse a Vercel
- Vá para: https://vercel.com/new
- Faça login com GitHub

### 2️⃣ Importe o Repositório
- Clique em **Import Git Repository**
- Selecione: `eudalarmee/tcc-fabio`
- **IMPORTANTE:** Configure **Root Directory** para: `backend`

### 3️⃣ Configure as Variáveis de Ambiente

Clique em **Environment Variables** e adicione:

```
DATABASE_URL
mysql://429465:Lucasrocha77@mysql-lucasrocha.alwaysdata.net/lucasrocha_musclemax

JWT_SECRET
musclemax_super_secret_key_2025_ultra_secure_32chars_minimum

JWT_EXPIRES_IN
7d

NODE_ENV
production
```

### 4️⃣ Deploy
- Clique em **Deploy**
- Aguarde 2-3 minutos

### 5️⃣ Teste
Após o deploy, teste:
```bash
curl https://SEU-PROJETO.vercel.app/health
```

---

## 🔧 Se der erro

### "Module not found" ou "Prisma Client not generated"
1. Vá em Settings → General → Build & Development Settings
2. **Build Command:** `prisma generate`
3. Faça **Redeploy**

### "Database connection failed"
1. Verifique se copiou a `DATABASE_URL` corretamente
2. Não pode ter espaços extras
3. Deve estar em uma linha só

---

## 📝 Atualizar o Frontend

Após o deploy, atualize o `.env` do frontend com a URL da API:

```env
VITE_API_URL=https://SEU-PROJETO.vercel.app
VITE_API_BASE_URL=https://SEU-PROJETO.vercel.app/api
```

---

✅ **Pronto!** O backend estará no ar em produção!
