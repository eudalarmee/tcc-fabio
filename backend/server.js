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
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'https://tcc-fabio.vercel.app',
  'https://tcc-fabio-git-main-eudalarmee.vercel.app',
  'https://musclemaxxx.vercel.app',
  /\.vercel\.app$/ // Aceita todos os subdomínios do Vercel
];

app.use(cors({
  origin: (origin, callback) => {
    // Permite requisições sem origin (como Postman)
    if (!origin) return callback(null, true);
    
    // Verifica se a origin está na lista ou match com regex
    const isAllowed = allowedOrigins.some(allowed => {
      if (typeof allowed === 'string') return allowed === origin;
      if (allowed instanceof RegExp) return allowed.test(origin);
      return false;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
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
