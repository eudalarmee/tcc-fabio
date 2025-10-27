import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import workoutRoutes from "./routes/workout.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

// Rotas de treino
app.use('/api/workouts', workoutRoutes);
// Rotas de exercícios
app.use('/api/exercises', exerciseRoutes);

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Token não fornecido" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido" });
    req.user = user;
    next();
  });
};

// Rota de registro
app.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validação básica
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ error: "Todos os campos são obrigatórios" });
    }

    // Verifica se o usuário já existe
    const userExists = await prisma.user.findUnique({ where: { email } });
    if (userExists) {
      return res.status(400).json({ error: "Usuário já cadastrado" });
    }

    // Hash da senha
    const hashed = await bcrypt.hash(password, 10);

    // Cria o usuário
    const user = await prisma.user.create({
      data: { name, email, password: hashed }
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error("Erro no registro:", error);
    res.status(500).json({ error: "Erro ao criar usuário" });
  }
});

// Rota de login
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: "Email e senha são obrigatórios" });
    }

    // Busca o usuário
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(400).json({ error: "Usuário não encontrado" });
    }

    // Verifica a senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Senha incorreta" });
    }

    // Gera o token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "1d"
    });

    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email, role: user.role }
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ error: "Erro ao fazer login" });
  }
});

// Rota protegida - Perfil do usuário
app.get("/profile", authenticateToken, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, name: true, email: true, role: true, createdAt: true }
    });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.json(user);
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ error: "Erro ao buscar perfil" });
  }
});

// Rota raiz
app.get("/", (req, res) => {
  res.send("API MuscleMax Rodando ✔️");
});

// Inicialização do servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📊 Banco de dados conectado via Prisma`);
});

// Tratamento de encerramento gracioso
process.on("SIGINT", async () => {
  await prisma.$disconnect();
  console.log("� Prisma desconectado");
  process.exit(0);
});
