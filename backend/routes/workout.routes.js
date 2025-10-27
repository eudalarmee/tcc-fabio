import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ✅ Criar treino customizado
router.post('/create', async (req, res) => {
  try {
    const { userId, title, exercises } = req.body;
    // exercises = [{ exerciseId: "...", orderIndex: 1, sets: 4, reps: "10-12" }]

    if (!userId || !title || !exercises || exercises.length === 0) {
      return res.status(400).json({ error: 'Dados insuficientes.' });
    }

    const workout = await prisma.workout.create({
      data: {
        title,
        ownerId: userId,
        items: {
          create: exercises.map((ex) => ({
            exerciseId: ex.exerciseId,
            orderIndex: ex.orderIndex,
            sets: ex.sets ?? 3,
            reps: ex.reps ?? '8-12',
            restSec: ex.restSec ?? null,
          })),
        },
      },
      include: { items: true },
    });

    return res.status(201).json(workout);
  } catch (err) {
    console.error('Erro ao criar treino:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Buscar TODOS os treinos criados pelo usuário
router.get('/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const workouts = await prisma.workout.findMany({
      where: { ownerId: userId },
      include: { items: { include: { exercise: true } } },
      orderBy: { createdAt: 'desc' },
    });
    return res.status(200).json(workouts);
  } catch (err) {
    console.error('Erro ao buscar treinos:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Buscar um treino específico por ID
router.get('/:workoutId', async (req, res) => {
  try {
    const { workoutId } = req.params;
    const workout = await prisma.workout.findUnique({
      where: { id: workoutId },
      include: { 
        items: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
    });
    
    if (!workout) {
      return res.status(404).json({ error: 'Treino não encontrado.' });
    }
    
    return res.status(200).json(workout);
  } catch (err) {
    console.error('Erro ao buscar treino:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Deletar treino
router.delete('/:workoutId', async (req, res) => {
  try {
    const { workoutId } = req.params;
    await prisma.workout.delete({
      where: { id: workoutId },
    });
    return res.status(200).json({ message: 'Treino deletado com sucesso.' });
  } catch (err) {
    console.error('Erro ao deletar treino:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
