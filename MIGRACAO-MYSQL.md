# 🔄 Migração SQLite → MySQL - MuscleMax

## ✅ Migração Concluída com Sucesso!

**Data:** 28 de Outubro de 2025

---

## 📊 O que foi feito

### 1. **Alteração do Banco de Dados**
- ❌ **Antes:** SQLite (arquivo local `dev.db`)
- ✅ **Agora:** MySQL hospedado no AlwaysData

### 2. **Configuração do Prisma**
```prisma
// prisma/schema.prisma
datasource db {
  provider = "mysql"  // Alterado de "sqlite"
  url      = env("DATABASE_URL")
}
```

### 3. **URL de Conexão**
```env
# .env
DATABASE_URL="mysql://usuario:senha@mysql-usuario.alwaysdata.net/nome_do_banco"
```

### 4. **Migrations**
- ✅ Migrations antigas do SQLite foram removidas
- ✅ Schema sincronizado via `prisma db push` (AlwaysData não permite shadow database)
- ✅ Banco populado com 43 exercícios via seed

---

## 🚀 Como foi feito

### Passo 1: Atualizar schema.prisma
```bash
# Alterar provider de "sqlite" para "mysql"
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

### Passo 2: Configurar .env
```bash
DATABASE_URL="mysql://429465:Lucasrocha77@mysql-lucasrocha.alwaysdata.net/lucasrocha_musclemax"
```

### Passo 3: Remover migrations antigas
```bash
cd backend/prisma
rm -rf migrations
```

### Passo 4: Sincronizar schema
```bash
npx prisma db push
```

### Passo 5: Popular banco de dados
```bash
npx ts-node prisma/seed.ts
```

### Passo 6: Testar
```bash
node server.js
curl http://localhost:3001/health
curl http://localhost:3001/api/exercises
```

---

## ✅ Testes Realizados

### 1. Health Check
```bash
curl http://localhost:3001/health
# ✅ {"ok":true,"message":"Backend está funcionando!"}
```

### 2. Listagem de Exercícios
```bash
curl http://localhost:3001/api/exercises
# ✅ Retornou 43 exercícios
```

### 3. Registro de Usuário
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Teste MySQL","email":"teste.mysql@example.com","password":"senha123"}'
# ✅ Usuário criado com sucesso, token JWT gerado
```

---

## 🔧 Diferenças entre SQLite e MySQL

| Aspecto | SQLite | MySQL |
|---------|--------|-------|
| **Tipo** | Arquivo local | Servidor remoto |
| **Conexão** | `file:./dev.db` | `mysql://user:pass@host/db` |
| **Migrations** | `migrate dev` | `db push` (AlwaysData) |
| **Shadow DB** | Automático | Não disponível no AlwaysData |
| **Produção** | ❌ Não recomendado | ✅ Recomendado |
| **Escalabilidade** | Limitada | Alta |
| **Backup** | Manual (arquivo) | Automático (AlwaysData) |

---

## 📝 Alterações nos Arquivos

### Arquivos Modificados
```
backend/.env                              - URL do MySQL
backend/.env.example                      - Exemplo atualizado
backend/prisma/schema.prisma              - Provider: mysql
backend/prisma/migrations/migration_lock.toml - Provider: mysql
```

### Arquivos Removidos
```
backend/prisma/dev.db                     - Banco SQLite local
backend/prisma/migrations/* (antigas)      - Migrations SQLite
```

---

## 🎯 Próximos Passos

### Em Desenvolvimento
```bash
# Sempre use db push para sincronizar
npm run prisma:push
```

### Para Popular o Banco
```bash
npm run prisma:seed
# ou
npx ts-node prisma/seed.ts
```

### Para Ver os Dados (Prisma Studio)
```bash
npx prisma studio
# Abre em http://localhost:5555
```

---

## ⚠️ Avisos Importantes

### 1. Shadow Database
O AlwaysData **não permite criar bancos temporários** (shadow database), por isso:
- ❌ **NÃO use:** `prisma migrate dev`
- ✅ **USE:** `prisma db push`

### 2. Backup
- Os dados agora estão no MySQL remoto
- Configure backups regulares no painel do AlwaysData
- Exporte dados importantes periodicamente

### 3. Credenciais
```bash
# NUNCA commite o .env com credenciais reais!
# Sempre use .env.example como template
```

### 4. Conexão Remota
```bash
# O banco está na internet, então:
# - Pode haver latência maior que SQLite local
# - Depende de conexão com internet
# - É mais seguro e escalável
```

---

## 🐛 Troubleshooting

### Erro: "Shadow database"
**Solução:** Use `npx prisma db push` em vez de `migrate dev`

### Erro: "Access denied"
**Solução:** Verifique usuário e senha no `.env`

### Erro: "Can't connect to MySQL server"
**Solução:** 
1. Verifique conexão com internet
2. Confirme que o banco está ativo no AlwaysData
3. Teste a URL de conexão

### Dados não aparecem
**Solução:** Execute o seed novamente
```bash
npx ts-node prisma/seed.ts
```

---

## 📊 Status Final

✅ **Schema sincronizado** com MySQL  
✅ **43 exercícios** cadastrados  
✅ **Autenticação JWT** funcionando  
✅ **Backend rodando** na porta 3001  
✅ **Testes passando** 100%  

**Banco de Dados:**
- **Provedor:** AlwaysData
- **Engine:** MySQL/MariaDB
- **URL:** `mysql-lucasrocha.alwaysdata.net`
- **Banco:** `lucasrocha_musclemax`

---

## 🎉 Conclusão

A migração de SQLite para MySQL foi **concluída com sucesso!**

**Benefícios:**
- ✅ Banco de dados profissional
- ✅ Hospedagem na nuvem
- ✅ Backup automático
- ✅ Escalabilidade
- ✅ Pronto para produção

**Comandos úteis:**
```bash
# Ver estrutura do banco
npx prisma studio

# Sincronizar mudanças no schema
npx prisma db push

# Popular/re-popular dados
npx ts-node prisma/seed.ts

# Gerar Prisma Client
npx prisma generate
```

---

**Desenvolvido por:** Equipe MuscleMax  
**Data:** 28 de Outubro de 2025  
**Status:** ✅ Produção Ready
