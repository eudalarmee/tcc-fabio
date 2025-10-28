import express from "express";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cors from "cors";
import dotenv from "dotenv";
import workoutRoutes from "./routes/workout.routes.js";
import exerciseRoutes from "./routes/exercise.routes.js";
import trainingRoutes from "./routes/training.routes.js";
import adminRoutes from "./routes/admin.routes.js";
import authRoutes from "./routes/auth.routes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

// Configuração de CORS ANTES de qualquer rota
app.use(cors({
  origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Parse de JSON
app.use(express.json());

// Healthcheck
app.get('/health', (req, res) => {
  res.status(200).json({ ok: true, message: 'Backend está funcionando!' });
});

// Rotas de autenticação
app.use('/api/auth', authRoutes);
// Rotas de treino
app.use('/api/workouts', workoutRoutes);
// Rotas de exercícios
app.use('/api/exercises', exerciseRoutes);
// Rotas de training (novo modelo)
app.use('/api', trainingRoutes);
// Rotas de admin
app.use('/api/admin', adminRoutes);

const JWT_SECRET = process.env.JWT_SECRET;
const PORT = process.env.PORT || 5000;

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
