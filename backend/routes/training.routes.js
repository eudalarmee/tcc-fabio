import express from 'express';
import { PrismaClient } from '@prisma/client';
import { requireAuth } from '../middleware/requireAuth.js';

const prisma = new PrismaClient();
const router = express.Router();

// Lista exercícios com filtros opcionais (pública)
router.get('/exercises', async (req, res) => {
  try {
    const { q, muscle } = req.query;
    const where = {};
    
    if (q) {
      where.name = { contains: q, mode: 'insensitive' };
    }
    
    if (muscle) {
      where.muscleGroup = { equals: muscle, mode: 'insensitive' };
    }
    
    const items = await prisma.exercise.findMany({ 
      where, 
      orderBy: { name: 'asc' } 
    });
    
    res.json(items);
  } catch (error) {
    console.error('Erro ao buscar exercícios:', error);
    res.status(500).json({ error: 'Erro ao buscar exercícios' });
  }
});

// Cria treino com lista de exercises (protegida)
router.post('/trainings', requireAuth, async (req, res) => {
  try {
    const { name, notes, items } = req.body;
    const userId = req.user.id; // Pega do token JWT
    
    if (!name || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Dados insuficientes' });
    }
    
    const training = await prisma.training.create({
      data: {
        userId,
        name,
        notes: notes || null,
        exercises: {
          create: items.map((it, i) => ({
            exerciseId: it.exerciseId,
            orderIndex: it.orderIndex !== undefined ? it.orderIndex : i,
            sets: it.sets || 3,
            reps: it.reps || '8-12',
            rest: it.rest || 90
          })),
        },
      },
      include: { 
        exercises: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
    });
    
    res.json(training);
  } catch (error) {
    console.error('Erro ao criar treino:', error);
    res.status(500).json({ error: 'Erro ao criar treino' });
  }
});

// Importação em massa (bulk) - Usado na migração do modo visitante
router.post('/trainings/bulk', requireAuth, async (req, res) => {
  try {
    const { items } = req.body;
    const userId = req.user.id;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Lista de treinos vazia' });
    }
    
    console.log(`🔄 Migrando ${items.length} treinos para usuário ${userId}`);
    
    const created = [];
    
    for (const workout of items) {
      try {
        // Cria o treino
        const training = await prisma.training.create({
          data: {
            userId,
            name: workout.name + ' (importado)',
            notes: 'Migrado do modo visitante',
            exercises: {
              create: (workout.exercises || []).map((ex, idx) => ({
                exerciseId: ex.id,
                orderIndex: ex.orderIndex !== undefined ? ex.orderIndex : idx,
                sets: ex.sets || 3,
                reps: ex.reps || '8-12',
                rest: ex.rest || 90
              }))
            }
          },
          include: {
            exercises: {
              include: { exercise: true },
              orderBy: { orderIndex: 'asc' }
            }
          }
        });
        
        created.push(training);
        console.log(`✅ Treino "${training.name}" migrado com sucesso`);
      } catch (err) {
        console.error(`❌ Erro ao migrar treino "${workout.name}":`, err);
        // Continua com os próximos mesmo se um falhar
      }
    }
    
    res.json({ 
      success: true, 
      migrated: created.length,
      total: items.length,
      trainings: created 
    });
  } catch (error) {
    console.error('❌ Erro ao fazer bulk import:', error);
    res.status(500).json({ error: 'Erro ao importar treinos' });
  }
});

// Meus treinos (protegida)
router.get('/trainings/mine', requireAuth, async (req, res) => {
  try {
    const userId = req.user.id; // Pega do token JWT
    
    const list = await prisma.training.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: { 
        exercises: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
    });
    
    res.json(list);
  } catch (error) {
    console.error('Erro ao buscar treinos:', error);
    res.status(500).json({ error: 'Erro ao buscar treinos' });
  }
});

// Busca um treino específico
router.get('/trainings/:id', async (req, res) => {
  try {
    const training = await prisma.training.findUnique({
      where: { id: req.params.id },
      include: { 
        exercises: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
    });
    
    if (!training) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }
    
    res.json(training);
  } catch (error) {
    console.error('Erro ao buscar treino:', error);
    res.status(500).json({ error: 'Erro ao buscar treino' });
  }
});

// Atualiza treino (protegida)
router.put('/trainings/:id', requireAuth, async (req, res) => {
  try {
    const { name, notes, items } = req.body;
    const { id } = req.params;
    
    // Deleta exercícios antigos
    await prisma.trainingExercise.deleteMany({
      where: { trainingId: id }
    });
    
    // Atualiza treino com novos exercícios
    const training = await prisma.training.update({
      where: { id },
      data: {
        name: name || undefined,
        notes: notes !== undefined ? notes : undefined,
        exercises: items ? {
          create: items.map((it, i) => ({
            exerciseId: it.exerciseId,
            orderIndex: it.orderIndex !== undefined ? it.orderIndex : i,
            sets: it.sets || 3,
            reps: it.reps || '8-12',
            rest: it.rest || 90
          })),
        } : undefined,
      },
      include: { 
        exercises: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
    });
    
    res.json(training);
  } catch (error) {
    console.error('Erro ao atualizar treino:', error);
    res.status(500).json({ error: 'Erro ao atualizar treino' });
  }
});

// Duplica treino
router.post('/trainings/:id/duplicate', async (req, res) => {
  try {
    const original = await prisma.training.findUnique({
      where: { id: req.params.id },
      include: { exercises: true },
    });
    
    if (!original) {
      return res.status(404).json({ error: 'Treino não encontrado' });
    }
    
    const training = await prisma.training.create({
      data: {
        userId: original.userId,
        name: `${original.name} (cópia)`,
        notes: original.notes,
        exercises: {
          create: original.exercises.map(ex => ({
            exerciseId: ex.exerciseId,
            orderIndex: ex.orderIndex,
            sets: ex.sets,
            reps: ex.reps,
            rest: ex.rest
          })),
        },
      },
      include: { 
        exercises: { 
          include: { exercise: true },
          orderBy: { orderIndex: 'asc' }
        } 
      },
    });
    
    res.json(training);
  } catch (error) {
    console.error('Erro ao duplicar treino:', error);
    res.status(500).json({ error: 'Erro ao duplicar treino' });
  }
});

// Deleta treino (protegida)
router.delete('/trainings/:id', requireAuth, async (req, res) => {
  try {
    await prisma.training.delete({ 
      where: { id: req.params.id }
    });
    
    res.json({ ok: true });
  } catch (error) {
    console.error('Erro ao deletar treino:', error);
    res.status(500).json({ error: 'Erro ao deletar treino' });
  }
});

// Migração em lote de treinos do modo visitante (protegida)
router.post('/trainings/bulk', requireAuth, async (req, res) => {
  try {
    console.log('📦 Iniciando migração em lote de treinos...');
    
    const { items } = req.body;
    const userId = req.user.id;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Nenhum treino para migrar' });
    }

    console.log(`📦 Migrando ${items.length} treinos para usuário ${userId}`);

    const migratedTrainings = [];

    for (const workout of items) {
      try {
        // Verifica se já existe treino com mesmo nome
        const existing = await prisma.training.findFirst({
          where: {
            userId,
            name: workout.name
          }
        });

        const trainingName = existing 
          ? `${workout.name} (importado ${new Date().toLocaleDateString()})` 
          : workout.name;

        // Cria o treino
        const training = await prisma.training.create({
          data: {
            userId,
            name: trainingName,
            notes: workout.notes || null,
            exercises: {
              create: workout.exercises.map((ex, index) => ({
                exerciseId: ex.id,
                orderIndex: ex.orderIndex ?? index,
                sets: ex.sets ?? 3,
                reps: ex.reps ?? '8-12',
                rest: ex.rest ?? 90,
                notes: ex.notes || null
              }))
            }
          },
          include: {
            exercises: {
              include: { exercise: true },
              orderBy: { orderIndex: 'asc' }
            }
          }
        });

        migratedTrainings.push(training);
        console.log(`✅ Treino migrado: ${trainingName}`);
      } catch (error) {
        console.error(`❌ Erro ao migrar treino "${workout.name}":`, error);
        // Continua mesmo se um treino falhar
      }
    }

    console.log(`✅ Migração concluída: ${migratedTrainings.length}/${items.length} treinos`);

    res.status(201).json({ 
      success: true,
      migrated: migratedTrainings.length,
      total: items.length,
      trainings: migratedTrainings
    });
  } catch (error) {
    console.error('❌ Erro na migração em lote:', error);
    res.status(500).json({ error: 'Erro ao migrar treinos' });
  }
});

export default router;
