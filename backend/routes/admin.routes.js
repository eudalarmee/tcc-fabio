import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { requireAuth } from '../middleware/requireAuth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Middleware para verificar se é admin
const checkAdmin = async (req, res, next) => {
  try {
    // Primeiro verifica autenticação
    if (!req.user || !req.user.id) {
      return res.status(401).json({ error: 'Não autenticado' });
    }

    // Busca usuário completo no banco
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { role: true }
    });

    if (!user || user.role !== 'ADMIN') {
      return res.status(403).json({ error: 'Acesso negado: apenas administradores' });
    }

    next();
  } catch (error) {
    console.error('Erro no checkAdmin:', error);
    return res.status(500).json({ error: 'Erro ao verificar permissões' });
  }
};

// Estatísticas gerais do sistema
router.get('/stats', requireAuth, checkAdmin, async (req, res) => {
  try {
    const totalUsers = await prisma.user.count();
    const totalWorkouts = await prisma.workout.count();
    const totalTrainings = await prisma.training.count();
    
    // Usuários criados hoje
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await prisma.user.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });
    
    // Últimos 10 usuários
    const recentUsers = await prisma.user.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    });
    
    // Últimos 10 treinos
    const recentWorkouts = await prisma.workout.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        createdAt: true,
        user: {
          select: {
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      }
    });
    
    res.json({
      totalUsers,
      totalWorkouts: totalWorkouts + totalTrainings,
      newUsersToday,
      recentUsers,
      recentWorkouts
    });
  } catch (error) {
    console.error('Erro ao buscar estatísticas:', error);
    res.status(500).json({ error: 'Erro ao buscar estatísticas' });
  }
});

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

// Deleta usuário
router.delete('/user/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deleta workouts e trainings do usuário primeiro
    await prisma.workoutItem.deleteMany({
      where: { workout: { userId: id } }
    });
    await prisma.workout.deleteMany({
      where: { userId: id }
    });
    await prisma.trainingItem.deleteMany({
      where: { training: { userId: id } }
    });
    await prisma.training.deleteMany({
      where: { userId: id }
    });
    
    // Deleta o usuário
    await prisma.user.delete({
      where: { id }
    });
    
    res.json({ ok: true, message: 'Usuário deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
});

// Lista todos os treinos (workouts + trainings)
router.get('/workouts', checkAdmin, async (req, res) => {
  try {
    const workouts = await prisma.workout.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            exercise: {
              select: {
                name: true,
                muscleGroup: true
              }
            }
          }
        }
      }
    });
    
    const trainings = await prisma.training.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        items: {
          include: {
            exercise: {
              select: {
                name: true,
                muscleGroup: true
              }
            }
          }
        }
      }
    });
    
    // Combinar e formatar
    const allWorkouts = [
      ...workouts.map(w => ({ ...w, type: 'workout' })),
      ...trainings.map(t => ({ ...t, type: 'training' }))
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    res.json(allWorkouts);
  } catch (error) {
    console.error('Erro ao listar treinos:', error);
    res.status(500).json({ error: 'Erro ao listar treinos' });
  }
});

// Deleta workout
router.delete('/workout/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deleta items primeiro
    await prisma.workoutItem.deleteMany({
      where: { workoutId: id }
    });
    
    // Deleta o workout
    await prisma.workout.delete({
      where: { id }
    });
    
    res.json({ ok: true, message: 'Treino deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar workout:', error);
    res.status(500).json({ error: 'Erro ao deletar workout' });
  }
});

// Deleta training
router.delete('/training/:id', checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Deleta items primeiro
    await prisma.trainingItem.deleteMany({
      where: { trainingId: id }
    });
    
    // Deleta o training
    await prisma.training.delete({
      where: { id }
    });
    
    res.json({ ok: true, message: 'Treino deletado com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar training:', error);
    res.status(500).json({ error: 'Erro ao deletar training' });
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
