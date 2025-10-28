# 🚀 Deploy do Backend MuscleMax na Vercel

## 📋 Pré-requisitos

1. Conta na Vercel (https://vercel.com)
2. Banco de dados MySQL já configurado no AlwaysData
3. CLI da Vercel instalada (opcional): `npm i -g vercel`

---

## 🔧 Configuração das Variáveis de Ambiente

Na Vercel, você precisa configurar as seguintes variáveis de ambiente:

### Variáveis Obrigatórias:

```env
DATABASE_URL="mysql://429465:Lucasrocha77@mysql-lucasrocha.alwaysdata.net/lucasrocha_musclemax"
JWT_SECRET="musclemax_super_secret_key_2025_ultra_secure_32chars_minimum"
JWT_EXPIRES_IN="7d"
PORT="3001"
NODE_ENV="production"
```

---

## 🌐 Como fazer o Deploy

### Opção 1: Via Interface Web da Vercel (Recomendado)

1. Acesse https://vercel.com/new
2. Importe o repositório do GitHub: `eudalarmee/tcc-fabio`
3. Configure o **Root Directory** para: `backend`
4. Adicione as variáveis de ambiente na seção **Environment Variables**
5. Clique em **Deploy**

### Opção 2: Via CLI da Vercel

```bash
# 1. Entre na pasta backend
cd /Applications/tcc-fabio/backend

# 2. Login na Vercel (se ainda não fez)
vercel login

# 3. Deploy
vercel --prod

# Siga as instruções:
# - Set up and deploy? Yes
# - Which scope? Selecione sua conta
# - Link to existing project? No
# - Project name? tcc-fabio-backend
# - In which directory is your code located? ./
```

---

## ⚙️ Configurações Importantes

### 1. Build Command
```bash
prisma generate
```

### 2. Output Directory
```
.
```

### 3. Install Command
```bash
npm install
```

### 4. Development Command
```bash
npm run dev
```

---

## 🔐 Variáveis de Ambiente na Vercel

### Como Adicionar:

1. Acesse seu projeto na Vercel
2. Vá em **Settings** → **Environment Variables**
3. Adicione cada variável:
   - **Name:** `DATABASE_URL`
   - **Value:** `mysql://429465:Lucasrocha77@...`
   - **Environments:** Production, Preview, Development (marque todos)

4. Repita para todas as variáveis

---

## 🧪 Testando o Deploy

Após o deploy, teste os endpoints:

```bash
# Health check
curl https://seu-projeto.vercel.app/health

# Listar exercícios
curl https://seu-projeto.vercel.app/api/exercises

# Registrar usuário
curl -X POST https://seu-projeto.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@example.com","password":"senha123"}'
```

---

## 🐛 Troubleshooting

### Erro: "Module not found"
- **Solução:** Execute `vercel --prod` novamente

### Erro: "Database connection failed"
- **Solução:** Verifique se a `DATABASE_URL` está correta nas variáveis de ambiente

### Erro: "Prisma Client not generated"
- **Solução:** Adicione `"build": "prisma generate"` no package.json

### CORS Error no frontend
- **Solução:** Adicione o domínio do frontend nas origens permitidas no `server.js`

---

## 📝 Checklist Pós-Deploy

- [ ] Health check respondendo
- [ ] API de exercícios funcionando
- [ ] Registro de usuários funcionando
- [ ] Login funcionando
- [ ] JWT sendo gerado corretamente
- [ ] CORS configurado para o frontend
- [ ] Banco de dados MySQL conectado

---

## 🔄 Atualizações Futuras

Para atualizar o backend:

```bash
# 1. Faça commit das alterações
git add .
git commit -m "feat: sua alteração"
git push origin main

# 2. A Vercel fará o deploy automático
```

Ou force um novo deploy:

```bash
cd backend
vercel --prod --force
```

---

## 🌐 URLs Importantes

- **Dashboard Vercel:** https://vercel.com/dashboard
- **Logs:** Acesse seu projeto → Deployments → clique no deployment → Logs
- **Domínio:** Será algo como `tcc-fabio-backend.vercel.app`

---

## ⚠️ Importante

1. **Nunca commite o arquivo `.env`** com credenciais reais
2. **Use variáveis de ambiente** na Vercel para dados sensíveis
3. **Configure o CORS** para aceitar o domínio do frontend em produção
4. **Monitore os logs** da Vercel para erros

---

**Status:** ✅ Pronto para Deploy  
**Última atualização:** 28 de Outubro de 2025
