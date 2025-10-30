#!/bin/bash

echo "🧪 Testando endpoints do backend..."
echo ""

echo "1️⃣ Testando /health"
curl -i http://localhost:3001/health
echo ""
echo ""

echo "2️⃣ Testando CORS Preflight (OPTIONS)"
curl -i -X OPTIONS http://localhost:3001/api/auth/register \
  -H "Origin: http://localhost:5173" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type"
echo ""
echo ""

echo "3️⃣ Testando POST /api/auth/register"
curl -i -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{"name":"Teste Usuario","email":"teste@example.com","password":"123456"}'
echo ""
