import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware para verificar se é admin (simplificado - adicionar autenticação real depois)
const checkAdmin = async (req, res, next) => {
  // TODO: Implementar verificação de token JWT
  // Por enquanto, apenas passa
  next();
};

// Lista todos os usuários
router.get('/users', checkAdmin, async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        _count: {
          select: {
            trainings: true,
            workouts: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    res.json(users);
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    res.status(500).json({ error: 'Erro ao listar usuários' });
  }
});

// Atualiza role do usuário
router.patch('/user/:id/role', checkAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const { id } = req.params;
    
    if (!['USER', 'ADMIN'].includes(role)) {
      return res.status(400).json({ error: 'Role inválida' });
    }
    
    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    res.json(user);
  } catch (error) {
    console.error('Erro ao atualizar role:', error);
    res.status(500).json({ error: 'Erro ao atualizar role' });
  }
});

// Lista todos os exercícios (admin)
router.get('/exercises', checkAdmin, async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: {
            items: true,
            trainingItems: true
          }
        }
      }
    });
    
    res.json(exercises);
  } catch (error) {
    console.error('Erro ao listar exercícios:', error);
    res.status(500).json({ error: 'Erro ao listar exercícios' });
  }
});

// Cria novo exercício
router.post('/exercise/create', checkAdmin, async (req, res) => {
  try {
    const { name, muscleGroup, equipment, difficulty, mediaUrl } = req.body;
    
    if (!name || !muscleGroup) {
      return res.status(400).json({ error: 'Nome e grupo muscular são obrigatórios' });
    }
    
    const exercise = await prisma.exercise.create({
      data: {
        name,
        muscleGroup,
        equipment: equipment || null,
        difficulty: difficulty || null,
        mediaUrl: mediaUrl || null
      }
    });
    
    res.json(exercise);
  } catch (error) {
    console.error('Erro ao criar exercício:', error);
    res.status(500).json({ error: 'Erro ao criar exercício' });
  }
});

// Atualiza exercício
router.put('/exercise/:id', checkAdmin, async (req, res) => {
  try {
    const { name, muscleGroup, equipment, difficulty, mediaUrl } = req.body;
    const { id } = req.params;
    
    const exercise = await prisma.exercise.update({
      where: { id },
      data: {
        name: name || undefined,
        muscleGroup: muscleGroup || undefined,
        equipment: equipment !== undefined ? equipment : undefined,
        difficulty: difficulty !== undefined ? difficulty : undefined,
        mediaUrl: mediaUrl !== undefined ? mediaUrl : undefined
      }
    });
    
    res.json(exercise);
  } catch (error) {
    console.error('Erro ao atualizar exercício:', error);
    res.status(500).json({ error: 'Erro ao atualizar exercício' });
  }
});

// Deleta exercício
router.delete('/exercise/:id', checkAdmin, async (req, res) => {
  try {
    await prisma.exercise.delete({
      where: { id: req.params.id }
    });
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Erro ao deletar exercício:', error);
    res.status(500).json({ error: 'Erro ao deletar exercício' });
  }
});

export default router;
