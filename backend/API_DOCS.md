# 📚 Documentação das APIs - MuscleMax Backend

## 🔐 Autenticação

### POST /register
Registrar novo usuário
```json
{
  "name": "João Silva",
  "email": "joao@email.com",
  "password": "senha123"
}
```

### POST /login
Login de usuário
```json
{
  "email": "joao@email.com",
  "password": "senha123"
}
```
**Resposta:**
```json
{
  "token": "jwt_token_aqui",
  "user": { "id": "...", "name": "João", "email": "...", "role": "USER" }
}
```

### GET /profile
Buscar perfil do usuário autenticado
**Headers:** `Authorization: Bearer {token}`

---

## 💪 Exercícios

### GET /api/exercises
Listar todos os exercícios disponíveis

### GET /api/exercises/muscle/:muscleGroup
Listar exercícios por grupo muscular
- Exemplos: `Costas`, `Pernas`, `Peito`, `Ombros`, `Bíceps`, `Tríceps`, `Core`

### GET /api/exercises/:exerciseId
Buscar um exercício específico por ID

---

## 🏋️ Treinos (Workouts)

### POST /api/workouts/create
Criar novo treino personalizado
```json
{
  "userId": "user_id_aqui",
  "title": "Treino de Peito e Tríceps",
  "exercises": [
    {
      "exerciseId": "exercise_id_1",
      "orderIndex": 1,
      "sets": 4,
      "reps": "10-12",
      "restSec": 60
    },
    {
      "exerciseId": "exercise_id_2",
      "orderIndex": 2,
      "sets": 3,
      "reps": "12-15",
      "restSec": 45
    }
  ]
}
```

### GET /api/workouts/user/:userId
Buscar todos os treinos de um usuário
**Resposta:** Array de treinos com exercícios incluídos

### GET /api/workouts/:workoutId
Buscar um treino específico por ID

### DELETE /api/workouts/:workoutId
Deletar um treino

---

## 🧪 Testando as APIs

### Via cURL:

**Listar exercícios:**
```bash
curl http://localhost:5000/api/exercises
```

**Criar treino:**
```bash
curl -X POST http://localhost:5000/api/workouts/create \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "seu_user_id",
    "title": "Meu Treino",
    "exercises": [...]
  }'
```

**Buscar treinos do usuário:**
```bash
curl http://localhost:5000/api/workouts/user/seu_user_id
```

---

## 📊 Estrutura do Banco de Dados

### User
- id (String/cuid)
- name (String)
- email (String, unique)
- password (String, hashed)
- role (USER | ADMIN)

### Exercise
- id (String/cuid)
- name (String)
- muscleGroup (String)
- equipment (String?)
- difficulty (String?)
- mediaUrl (String?)

### Workout
- id (String/cuid)
- title (String)
- ownerId (String → User)

### WorkoutExercise
- id (String/cuid)
- workoutId (String → Workout)
- exerciseId (String → Exercise)
- orderIndex (Int)
- sets (Int, default: 3)
- reps (String, default: "8-12")
- restSec (Int?)
