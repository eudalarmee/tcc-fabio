# 🔧 Correção do Erro "Failed to Fetch" - MuscleMax

## ✅ Problema Resolvido

O erro **"Failed to fetch"** no cadastro foi causado por:

1. **Conflito de Porta**: A porta 5000 estava sendo usada pelo **AirPlay Receiver da Apple** (macOS)
2. **Configuração de CORS**: Faltava configuração adequada para `credentials` e headers
3. **URLs inconsistentes**: Frontend e backend com URLs diferentes
4. **Falta de logs**: Difícil identificar onde estava o problema

## 🚀 Mudanças Implementadas

### Backend (porta 3001)

#### 1. CORS Configurado Corretamente
```javascript
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

#### 2. Endpoint de Health Check
```javascript
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Backend está funcionando!' });
});
```

#### 3. Logs Detalhados na Rota de Registro
- ✅ Log de tentativa de registro
- ✅ Log de validações
- ✅ Log de sucesso/erro
- ✅ Mensagens de erro padronizadas com campo `error`

### Frontend

#### 1. Arquivo `.env` Atualizado
```env
VITE_API_URL=http://localhost:3001
VITE_API_BASE_URL=http://localhost:3001/api
```

#### 2. Axios Configurado com:
- ✅ `withCredentials: true` (para cookies/sessão)
- ✅ `timeout: 10000` (10 segundos)
- ✅ Headers padrão `Content-Type: application/json`
- ✅ Interceptor com logs detalhados de erros

#### 3. AuthContext Refatorado
- ✅ Usa `api.post()` ao invés de `fetch`
- ✅ Logs detalhados em cada operação
- ✅ Tratamento de erros com mensagens do servidor
- ✅ Log da URL da API no mount

## 📋 Como Usar

### 1. Iniciar Backend
```bash
cd backend
npm run dev
```
**Porta:** `http://localhost:3001`

### 2. Iniciar Frontend
```bash
cd frontend
npm run dev
```
**Porta:** `http://localhost:5173`

### 3. Testar a API (opcional)
```bash
./test-api.sh
```

## 🧪 Testes Realizados

### ✅ Health Check
```bash
curl http://localhost:3001/health
# Resposta: {"ok":true,"message":"Backend está funcionando!"}
```

### ✅ Registro de Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste","email":"teste@example.com","password":"123456"}'
  
# Resposta: {"token":"...","user":{...}}
```

### ✅ CORS Preflight
```bash
curl -i -X OPTIONS http://localhost:3001/api/auth/register \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST"
  
# Status: 204 No Content
# Headers incluem: Access-Control-Allow-Origin, Access-Control-Allow-Credentials
```

## 🔍 Logs no Console

### Frontend (Browser Console)
```
API Base URL: http://localhost:3001/api
Tentando registrar usuário: {name: "...", email: "..."}
Registro bem-sucedido: {token: "...", user: {...}}
```

### Backend (Terminal)
```
📝 Tentativa de registro: { body: { name: '...', email: '...', password: '...' } }
✅ Usuário criado com sucesso: { id: '...', email: '...' }
```

## 🎯 Próximos Passos

1. ✅ Cadastro funcionando 100%
2. ✅ Login funcionando
3. ✅ CORS configurado
4. ✅ Logs para debug
5. 🔄 Testar em produção (ajustar URLs para domínio real)

## 📝 Notas Importantes

### Porta 5000 no macOS
A porta 5000 é usada pelo **AirPlay Receiver** no macOS. Para desabilitar:
- System Settings → General → AirDrop & Handoff → Desmarcar "AirPlay Receiver"

Ou use outra porta (no nosso caso, **3001**).

### Variáveis de Ambiente
Sempre **reinicie o Vite** após alterar o `.env`:
```bash
# Parar o servidor (Ctrl+C)
npm run dev # Reiniciar
```

### Credenciais e Cookies
Se você usar autenticação baseada em cookies (HttpOnly), mantenha:
- Frontend: `withCredentials: true`
- Backend: `credentials: true` no CORS

## 🎉 Status Final

- ✅ Backend rodando na porta **3001**
- ✅ Frontend rodando na porta **5173**
- ✅ CORS configurado corretamente
- ✅ Cadastro funcionando 100%
- ✅ Logs detalhados para debug
- ✅ Tratamento de erros apropriado

**Link do site:** [http://localhost:5173](http://localhost:5173)

---

**Desenvolvido por:** GitHub Copilot
**Data:** 27 de Outubro de 2025
