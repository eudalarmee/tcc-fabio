import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

// ✅ Listar todos os exercícios
router.get('/', async (req, res) => {
  try {
    const exercises = await prisma.exercise.findMany({
      orderBy: { name: 'asc' },
    });
    return res.status(200).json(exercises);
  } catch (err) {
    console.error('Erro ao buscar exercícios:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Buscar exercícios por grupo muscular
router.get('/muscle/:muscleGroup', async (req, res) => {
  try {
    const { muscleGroup } = req.params;
    const exercises = await prisma.exercise.findMany({
      where: { muscleGroup },
      orderBy: { name: 'asc' },
    });
    return res.status(200).json(exercises);
  } catch (err) {
    console.error('Erro ao buscar exercícios:', err);
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Buscar um exercício específico
router.get('/:exerciseId', async (req, res) => {
  try {
    const { exerciseId } = req.params;
    const exercise = await prisma.exercise.findUnique({
      where: { id: exerciseId },
    });
    
    if (!exercise) {
      return res.status(404).json({ error: 'Exercício não encontrado.' });
    }
    
    return res.status(200).json(exercise);
  } catch (err) {
    console.error('Erro ao buscar exercício:', err);
    return res.status(500).json({ error: err.message });
  }
});

export default router;
