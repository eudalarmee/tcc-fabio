/**
 * Workouts Adapter - Camada de abstração para acesso a treinos
 * Usa guestStore (IndexedDB) quando o usuário não está autenticado
 * Usa API quando o usuário está autenticado
 */

import { api } from './api';
import * as guestStore from './guestStore';
import { useAuth } from '../contexts/AuthContext';

/**
 * Hook que retorna o adapter correto baseado no estado de autenticação
 */
export function useWorkoutsAdapter() {
  const { isGuest, isAuthenticated } = useAuth();

  if (isGuest) {
    return createGuestAdapter();
  }

  if (isAuthenticated) {
    return createApiAdapter();
  }

  // Estado de loading ou erro
  return createGuestAdapter(); // Fallback para guest
}

/**
 * Adapter para modo visitante (IndexedDB)
 */
function createGuestAdapter() {
  return {
    async list() {
      console.log('📦 [Guest Adapter] Listando treinos locais');
      return await guestStore.getAllWorkouts();
    },

    async get(id) {
      console.log('📦 [Guest Adapter] Buscando treino:', id);
      return await guestStore.getWorkout(id);
    },

    async create(input) {
      console.log('📦 [Guest Adapter] Criando treino local');
      // Converte formato da API para formato local
      const guestFormat = {
        name: input.title || input.name,
        exercises: input.exercises.map(ex => ({
          id: ex.exerciseId || ex.id,
          name: ex.name || 'Exercício',
          muscleGroup: ex.muscleGroup || '',
          sets: ex.sets || 3,
          reps: ex.reps || '8-12',
          rest: ex.restSec || ex.rest || 90,
          orderIndex: ex.orderIndex
        }))
      };
      return await guestStore.createWorkout(guestFormat);
    },

    async update(id, patch) {
      console.log('📦 [Guest Adapter] Atualizando treino local:', id);
      return await guestStore.updateWorkout(id, patch);
    },

    async delete(id) {
      console.log('📦 [Guest Adapter] Deletando treino local:', id);
      await guestStore.deleteWorkout(id);
    },

    isLocal: true,
  };
}

/**
 * Adapter para usuário autenticado (API)
 */
function createApiAdapter() {
  return {
    async list() {
      console.log('☁️ [API Adapter] Listando treinos da API');
      const response = await api.get('/workouts');
      // Normaliza formato da API para o esperado pelo frontend
      return response.data.map(workout => ({
        ...workout,
        name: workout.title, // API usa 'title', frontend espera 'name'
        exercises: workout.items?.map(item => ({
          id: item.id,
          exercise: item.exercise,
          sets: item.sets,
          reps: item.reps,
          rest: item.restSec || 90, // API usa 'restSec', frontend espera 'rest'
          orderIndex: item.orderIndex
        })) || []
      }));
    },

    async get(id) {
      console.log('☁️ [API Adapter] Buscando treino da API:', id);
      const response = await api.get(`/workouts/${id}`);
      const workout = response.data;
      // Normaliza formato
      return {
        ...workout,
        name: workout.title,
        exercises: workout.items?.map(item => ({
          id: item.id,
          exercise: item.exercise,
          sets: item.sets,
          reps: item.reps,
          rest: item.restSec || 90,
          orderIndex: item.orderIndex
        })) || []
      };
    },

    async create(input) {
      console.log('☁️ [API Adapter] Criando treino na API');
      const response = await api.post('/workouts', input);
      return response.data;
    },

    async update(id, patch) {
      console.log('☁️ [API Adapter] Atualizando treino na API:', id);
      const response = await api.patch(`/workouts/${id}`, patch);
      return response.data;
    },

    async delete(id) {
      console.log('☁️ [API Adapter] Deletando treino da API:', id);
      await api.delete(`/workouts/${id}`);
    },

    isLocal: false,
  };
}

/**
 * Função auxiliar para obter stats independente do adapter
 */
export async function getWorkoutStats(isGuest) {
  if (isGuest) {
    return await guestStore.getStats();
  }

  try {
    const response = await api.get('/trainings/stats');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar stats:', error);
    return { totalWorkouts: 0, totalExercises: 0 };
  }
}
