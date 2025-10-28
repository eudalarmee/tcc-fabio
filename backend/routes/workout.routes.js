import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();
const prisma = new PrismaClient();

// Todas as rotas de workout requerem autenticação
router.use(requireAuth);

// GET /api/workouts - Listar todos os treinos do usuário logado
router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    
    const workouts = await prisma.workout.findMany({
      where: { ownerId: userId },
      include: { 
        items: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
      orderBy: { createdAt: 'desc' },
    });
    
    console.log(`✅ Listados ${workouts.length} treinos do usuário ${userId}`);
    return res.status(200).json(workouts);
  } catch (err) {
    console.error('❌ Erro ao buscar treinos:', err);
    return res.status(500).json({ error: err.message });
  }
});

// GET /api/workouts/:id - Buscar um treino específico
router.get('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutId = req.params.id;
    
    const workout = await prisma.workout.findFirst({
      where: { 
        id: workoutId,
        ownerId: userId // Garante que o treino pertence ao usuário
      },
      include: { 
        items: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
    });
    
    if (!workout) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }
    
    console.log(`✅ Treino ${workoutId} encontrado`);
    return res.status(200).json(workout);
  } catch (err) {
    console.error('❌ Erro ao buscar treino:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/workouts - Criar novo treino
router.post('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, exercises } = req.body;

    if (!title || !exercises || exercises.length === 0) {
      return res.status(400).json({ error: 'Título e exercícios são obrigatórios' });
    }

    const workout = await prisma.workout.create({
      data: {
        title,
        ownerId: userId,
        items: {
          create: exercises.map((ex, index) => ({
            exerciseId: ex.exerciseId,
            orderIndex: ex.orderIndex ?? index,
            sets: ex.sets ?? 3,
            reps: ex.reps ?? '8-12',
            restSec: ex.restSec ?? null,
          })),
        },
      },
      include: { 
        items: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
    });

    console.log(`✅ Treino criado: ${workout.id}`);
    return res.status(201).json(workout);
  } catch (err) {
    console.error('❌ Erro ao criar treino:', err);
    return res.status(500).json({ error: err.message });
  }
});

// PATCH /api/workouts/:id - Atualizar treino existente
router.patch('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutId = req.params.id;
    const { title, exercises } = req.body;

    // Verifica se o treino existe e pertence ao usuário
    const existing = await prisma.workout.findFirst({
      where: { id: workoutId, ownerId: userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    // Atualiza o treino
    const updateData = {};
    if (title !== undefined) updateData.title = title;

    // Se exercises foram fornecidos, recria os items
    if (exercises) {
      // Remove items antigos
      await prisma.workoutItem.deleteMany({
        where: { workoutId }
      });

      // Cria novos items
      updateData.items = {
        create: exercises.map((ex, index) => ({
          exerciseId: ex.exerciseId,
          orderIndex: ex.orderIndex ?? index,
          sets: ex.sets ?? 3,
          reps: ex.reps ?? '8-12',
          restSec: ex.restSec ?? null,
        }))
      };
    }

    const workout = await prisma.workout.update({
      where: { id: workoutId },
      data: updateData,
      include: { 
        items: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
    });

    console.log(`✅ Treino atualizado: ${workoutId}`);
    return res.status(200).json(workout);
  } catch (err) {
    console.error('❌ Erro ao atualizar treino:', err);
    return res.status(500).json({ error: err.message });
  }
});

// DELETE /api/workouts/:id - Deletar treino
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.user.id;
    const workoutId = req.params.id;

    // Verifica se o treino existe e pertence ao usuário
    const existing = await prisma.workout.findFirst({
      where: { id: workoutId, ownerId: userId }
    });

    if (!existing) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }

    await prisma.workout.delete({
      where: { id: workoutId },
    });

    console.log(`✅ Treino deletado: ${workoutId}`);
    return res.status(200).json({ message: 'Treino deletado com sucesso' });
  } catch (err) {
    console.error('❌ Erro ao deletar treino:', err);
    return res.status(500).json({ error: err.message });
  }
});

// POST /api/workouts/bulk - Migração em massa de treinos locais
router.post('/bulk', async (req, res) => {
  try {
    const userId = req.user.id;
    const { items } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Array de treinos é obrigatório' });
    }

    console.log(`🔄 Migrando ${items.length} treinos para o usuário ${userId}`);

    const created = [];

    for (const item of items) {
      try {
        const workout = await prisma.workout.create({
          data: {
            title: item.name || item.title || 'Treino sem nome',
            ownerId: userId,
            items: {
              create: (item.exercises || []).map((ex, index) => ({
                exerciseId: ex.exerciseId,
                orderIndex: ex.orderIndex ?? index,
                sets: ex.sets ?? 3,
                reps: ex.reps ?? '8-12',
                restSec: ex.restSec ?? null,
              })),
            },
          },
          include: { 
            items: { 
              include: { exercise: true } 
            } 
          },
        });

        created.push(workout);
      } catch (itemErr) {
        console.error('❌ Erro ao migrar treino individual:', itemErr);
        // Continua com os próximos treinos mesmo se um falhar
      }
    }

    console.log(`✅ ${created.length} treinos migrados com sucesso`);
    return res.status(201).json({ 
      message: `${created.length} treinos migrados com sucesso`,
      created 
    });
  } catch (err) {
    console.error('❌ Erro ao migrar treinos em massa:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
