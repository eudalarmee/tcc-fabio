#!/bin/bash

echo "=========================================="
echo "  TESTE DE AUTENTICAÇÃO JWT - MUSCLEMAX"
echo "=========================================="
echo ""

# 1. Testar Health Check
echo "1️⃣ Testando Health Check..."
HEALTH=$(curl -s http://localhost:3001/health)
echo "Resposta: $HEALTH"
echo ""

# 2. Registrar novo usuário
echo "2️⃣ Registrando novo usuário..."
REGISTER_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Teste JWT User",
    "email": "testejwt'$(date +%s)'@musclemax.com",
    "password": "senha123456"
  }')
echo "Resposta: $REGISTER_RESPONSE"
echo ""

# Extrair token do registro
TOKEN=$(echo $REGISTER_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ Falha ao obter token do registro!"
  echo "Tentando login com usuário existente..."
  
  # 3. Fazer login
  echo "3️⃣ Fazendo login..."
  LOGIN_RESPONSE=$(curl -s -X POST http://localhost:3001/api/auth/login \
    -H "Content-Type: application/json" \
    -d '{
      "email": "admin@musclemax.com",
      "password": "admin123"
    }')
  echo "Resposta: $LOGIN_RESPONSE"
  echo ""
  
  TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)
fi

if [ -z "$TOKEN" ]; then
  echo "❌ Nenhum token obtido. Abortando testes."
  exit 1
fi

echo "✅ Token obtido: ${TOKEN:0:20}..."
echo ""

# 4. Testar rota /auth/me
echo "4️⃣ Testando rota protegida /api/auth/me..."
ME_RESPONSE=$(curl -s http://localhost:3001/api/auth/me \
  -H "Authorization: Bearer $TOKEN")
echo "Resposta: $ME_RESPONSE"
echo ""

# 5. Testar listagem de workouts
echo "5️⃣ Testando rota protegida /api/workouts..."
WORKOUTS_RESPONSE=$(curl -s http://localhost:3001/api/workouts \
  -H "Authorization: Bearer $TOKEN")
echo "Resposta: $WORKOUTS_RESPONSE"
echo ""

# 6. Testar sem token (deve falhar)
echo "6️⃣ Testando acesso SEM token (deve falhar)..."
NO_TOKEN_RESPONSE=$(curl -s http://localhost:3001/api/workouts)
echo "Resposta: $NO_TOKEN_RESPONSE"
echo ""

echo "=========================================="
echo "  ✅ TESTES CONCLUÍDOS"
echo "=========================================="
