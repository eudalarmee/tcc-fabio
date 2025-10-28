#!/bin/bash

# ==========================================
# 🧪 TESTE COMPLETO DE AUTENTICAÇÃO JWT
# MuscleMax - Sistema de Gestão de Treinos
# ==========================================

echo ""
echo "🔐 INICIANDO TESTES DE AUTENTICAÇÃO JWT"
echo "========================================"
echo ""

# Cores para output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Contador de testes
PASSED=0
FAILED=0

# Função para testar
test_endpoint() {
    local name="$1"
    local command="$2"
    local expected_status="$3"
    
    echo -e "${BLUE}🧪 Testando: $name${NC}"
    
    RESPONSE=$(eval "$command")
    STATUS=$?
    
    if [ $STATUS -eq 0 ] && [[ "$RESPONSE" == *"$expected_status"* ]]; then
        echo -e "${GREEN}   ✅ PASSOU${NC}"
        PASSED=$((PASSED + 1))
    else
        echo -e "${RED}   ❌ FALHOU${NC}"
        echo "   Resposta: $RESPONSE"
        FAILED=$((FAILED + 1))
    fi
    echo ""
}

# ==========================================
# TESTE 1: Health Check
# ==========================================
test_endpoint \
    "Health Check do Backend" \
    "curl -s http://localhost:3001/health" \
    "Backend está funcionando"

# ==========================================
# TESTE 2: Registro de Usuário
# ==========================================
EMAIL="teste_$(date +%s)@musclemax.com"

echo -e "${BLUE}🧪 Testando: Registro de Novo Usuário${NC}"
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"Usuario Teste Automatizado\",
    \"email\": \"$EMAIL\",
    \"password\": \"senha123456\"
  }")

if [[ "$REGISTER_RESPONSE" == *"token"* ]] && [[ "$REGISTER_RESPONSE" == *"success"* ]]; then
    echo -e "${GREEN}   ✅ PASSOU - Usuário registrado com sucesso${NC}"
    PASSED=$((PASSED + 1))
    
    # Extrai o token
    TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    echo -e "${YELLOW}   Token obtido: ${TOKEN:0:30}...${NC}"
else
    echo -e "${RED}   ❌ FALHOU - Registro não retornou token${NC}"
    echo "   Resposta: $REGISTER_RESPONSE"
    FAILED=$((FAILED + 1))
    exit 1
fi
echo ""

# ==========================================
# TESTE 3: Login com Email Inexistente (deve falhar)
# ==========================================
echo -e "${BLUE}🧪 Testando: Login com Email Inexistente${NC}"
LOGIN_FAIL=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "naoexiste@musclemax.com",
    "password": "senha123"
  }')

if [[ "$LOGIN_FAIL" == *"Credenciais inválidas"* ]] || [[ "$LOGIN_FAIL" == *"401"* ]]; then
    echo -e "${GREEN}   ✅ PASSOU - Bloqueou login inválido corretamente${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}   ❌ FALHOU - Deveria bloquear login inválido${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# ==========================================
# TESTE 4: Login Válido
# ==========================================
echo -e "${BLUE}🧪 Testando: Login com Credenciais Válidas${NC}"
LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{
    \"email\": \"$EMAIL\",
    \"password\": \"senha123456\"
  }")

if [[ "$LOGIN_RESPONSE" == *"token"* ]] && [[ "$LOGIN_RESPONSE" == *"success"* ]]; then
    echo -e "${GREEN}   ✅ PASSOU - Login bem-sucedido${NC}"
    PASSED=$((PASSED + 1))
    
    # Atualiza o token
    NEW_TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
    if [ ! -z "$NEW_TOKEN" ]; then
        TOKEN=$NEW_TOKEN
        echo -e "${YELLOW}   Novo token obtido${NC}"
    fi
else
    echo -e "${RED}   ❌ FALHOU - Login não retornou token${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# ==========================================
# TESTE 5: Rota Protegida COM Token
# ==========================================
echo -e "${BLUE}🧪 Testando: Acesso à Rota Protegida COM Token${NC}"
ME_RESPONSE=$(curl -s http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN")

if [[ "$ME_RESPONSE" == *"$EMAIL"* ]] && [[ "$ME_RESPONSE" == *"id"* ]]; then
    echo -e "${GREEN}   ✅ PASSOU - Token validado com sucesso${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}   ❌ FALHOU - Token não foi aceito${NC}"
    echo "   Resposta: $ME_RESPONSE"
    FAILED=$((FAILED + 1))
fi
echo ""

# ==========================================
# TESTE 6: Rota Protegida SEM Token (deve falhar)
# ==========================================
echo -e "${BLUE}🧪 Testando: Acesso à Rota Protegida SEM Token${NC}"
NO_TOKEN_RESPONSE=$(curl -s http://localhost:3001/api/workouts)

if [[ "$NO_TOKEN_RESPONSE" == *"Token não fornecido"* ]] || [[ "$NO_TOKEN_RESPONSE" == *"401"* ]]; then
    echo -e "${GREEN}   ✅ PASSOU - Bloqueou acesso sem token${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}   ❌ FALHOU - Deveria bloquear acesso sem token${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# ==========================================
# TESTE 7: Listagem de Treinos Autenticado
# ==========================================
echo -e "${BLUE}🧪 Testando: Listagem de Treinos Autenticado${NC}"
WORKOUTS_RESPONSE=$(curl -s http://localhost:3001/api/workouts \
  -H "Authorization: Bearer $TOKEN")

if [[ "$WORKOUTS_RESPONSE" == "[]"* ]] || [[ "$WORKOUTS_RESPONSE" == *"id"* ]]; then
    echo -e "${GREEN}   ✅ PASSOU - Acesso autorizado à listagem${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}   ❌ FALHOU - Não conseguiu listar treinos${NC}"
    echo "   Resposta: $WORKOUTS_RESPONSE"
    FAILED=$((FAILED + 1))
fi
echo ""

# ==========================================
# TESTE 8: Token Inválido (deve falhar)
# ==========================================
echo -e "${BLUE}🧪 Testando: Token Inválido${NC}"
INVALID_TOKEN_RESPONSE=$(curl -s http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer token_invalido_123456")

if [[ "$INVALID_TOKEN_RESPONSE" == *"Token inválido"* ]] || [[ "$INVALID_TOKEN_RESPONSE" == *"401"* ]]; then
    echo -e "${GREEN}   ✅ PASSOU - Bloqueou token inválido${NC}"
    PASSED=$((PASSED + 1))
else
    echo -e "${RED}   ❌ FALHOU - Deveria bloquear token inválido${NC}"
    FAILED=$((FAILED + 1))
fi
echo ""

# ==========================================
# RESULTADO FINAL
# ==========================================
echo "========================================"
echo -e "${BLUE}📊 RESULTADOS DOS TESTES${NC}"
echo "========================================"
echo ""
echo -e "${GREEN}✅ Testes Passaram: $PASSED${NC}"
echo -e "${RED}❌ Testes Falharam: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 TODOS OS TESTES PASSARAM!${NC}"
    echo -e "${GREEN}✅ A autenticação JWT está funcionando 100%${NC}"
    echo ""
    echo "📝 Resumo:"
    echo "   • Registro de usuários: OK"
    echo "   • Login com credenciais: OK"
    echo "   • Validação de token: OK"
    echo "   • Rotas protegidas: OK"
    echo "   • Bloqueio de acesso não autorizado: OK"
    echo ""
    exit 0
else
    echo -e "${RED}❌ ALGUNS TESTES FALHARAM${NC}"
    echo "Por favor, verifique os logs acima."
    echo ""
    exit 1
fi
