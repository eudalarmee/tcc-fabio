/**
 * Guest Store - Armazenamento local de treinos para usuários não autenticados
 * Usa IndexedDB via biblioteca 'idb' para persistência no navegador
 */

import { openDB } from 'idb';
import { v4 as uuid } from 'uuid';

const DB_NAME = 'musclemax_guest_db';
const DB_VERSION = 1;
const STORE_NAME = 'workouts';

/**
 * Abre ou cria o banco de dados IndexedDB
 */
async function getDB() {
  try {
    return await openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Cria a object store se não existir
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          store.createIndex('updatedAt', 'updatedAt');
          store.createIndex('createdAt', 'createdAt');
          console.log('✅ IndexedDB store criada:', STORE_NAME);
        }
      },
    });
  } catch (error) {
    console.error('❌ Erro ao abrir IndexedDB:', error);
    throw error;
  }
}

/**
 * Retorna todos os treinos salvos localmente
 */
export async function getAllWorkouts() {
  try {
    const db = await getDB();
    const workouts = await db.getAll(STORE_NAME);
    console.log(`📦 Guest: ${workouts.length} treinos carregados`);
    return workouts;
  } catch (error) {
    console.error('❌ Erro ao buscar treinos:', error);
    return [];
  }
}

/**
 * Retorna um treino específico por ID
 */
export async function getWorkout(id) {
  try {
    const db = await getDB();
    const workout = await db.get(STORE_NAME, id);
    console.log(`📦 Guest: Treino ${id} ${workout ? 'encontrado' : 'não encontrado'}`);
    return workout || null;
  } catch (error) {
    console.error('❌ Erro ao buscar treino:', error);
    return null;
  }
}

/**
 * Cria um novo treino
 */
export async function createWorkout(input) {
  try {
    const now = new Date().toISOString();
    const workout = {
      id: uuid(),
      createdAt: now,
      updatedAt: now,
      ...input,
    };
    
    const db = await getDB();
    await db.put(STORE_NAME, workout);
    
    console.log('✅ Guest: Treino criado:', workout.id, workout.name);
    return workout;
  } catch (error) {
    console.error('❌ Erro ao criar treino:', error);
    throw error;
  }
}

/**
 * Atualiza um treino existente
 */
export async function updateWorkout(id, patch) {
  try {
    const current = await getWorkout(id);
    
    if (!current) {
      throw new Error(`Treino ${id} não encontrado`);
    }
    
    const updated = {
      ...current,
      ...patch,
      id, // Garante que o ID não muda
      updatedAt: new Date().toISOString(),
    };
    
    const db = await getDB();
    await db.put(STORE_NAME, updated);
    
    console.log('✅ Guest: Treino atualizado:', id);
    return updated;
  } catch (error) {
    console.error('❌ Erro ao atualizar treino:', error);
    throw error;
  }
}

/**
 * Deleta um treino
 */
export async function deleteWorkout(id) {
  try {
    const db = await getDB();
    await db.delete(STORE_NAME, id);
    console.log('✅ Guest: Treino deletado:', id);
  } catch (error) {
    console.error('❌ Erro ao deletar treino:', error);
    throw error;
  }
}

/**
 * Limpa todos os treinos (usado após migração para conta)
 */
export async function clearAll() {
  try {
    const db = await getDB();
    await db.clear(STORE_NAME);
    console.log('🧹 Guest: Todos os treinos foram limpos');
  } catch (error) {
    console.error('❌ Erro ao limpar treinos:', error);
    throw error;
  }
}

/**
 * Verifica se há treinos salvos localmente
 */
export async function hasLocalWorkouts() {
  try {
    const workouts = await getAllWorkouts();
    return workouts.length > 0;
  } catch (error) {
    return false;
  }
}

/**
 * Exporta estatísticas dos treinos locais
 */
export async function getStats() {
  try {
    const workouts = await getAllWorkouts();
    const totalExercises = workouts.reduce((acc, w) => acc + (w.exercises?.length || 0), 0);
    
    return {
      totalWorkouts: workouts.length,
      totalExercises,
      lastUpdated: workouts.length > 0 
        ? new Date(Math.max(...workouts.map(w => new Date(w.updatedAt).getTime())))
        : null,
    };
  } catch (error) {
    return { totalWorkouts: 0, totalExercises: 0, lastUpdated: null };
  }
}
