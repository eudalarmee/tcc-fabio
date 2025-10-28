import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWorkoutsAdapter } from '../lib/workoutsAdapter';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

const MUSCLE_GROUPS = [
  { name: 'Costas', icon: '💪', color: 'from-blue-500 to-cyan-500' },
  { name: 'Peito', icon: '🦾', color: 'from-red-500 to-orange-500' },
  { name: 'Pernas', icon: '🦵', color: 'from-green-500 to-emerald-500' },
  { name: 'Ombros', icon: '🏋️', color: 'from-yellow-500 to-amber-500' },
  { name: 'Bíceps', icon: '💪', color: 'from-purple-500 to-pink-500' },
  { name: 'Tríceps', icon: '💪', color: 'from-indigo-500 to-blue-500' },
  { name: 'Core', icon: '⚡', color: 'from-orange-500 to-red-500' },
  { name: 'Cardio', icon: '❤️', color: 'from-pink-500 to-rose-500' }
];

export default function CriarTreino() {
  const { isGuest, isAuthenticated } = useAuth();
  const workoutsAdapter = useWorkoutsAdapter();
  const navigate = useNavigate();
  
  const [allExercises, setAllExercises] = useState([]);
  const [selectedExercises, setSelectedExercises] = useState({});
  const [trainingName, setTrainingName] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/exercises`);
      const data = await response.json();
      setAllExercises(data);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
      alert('Erro ao carregar exercícios');
    } finally {
      setLoading(false);
    }
  };

  const toggleExercise = (exerciseId) => {
    setSelectedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }));
  };

  const getExercisesByGroup = (groupName) => {
    return allExercises.filter(ex => ex.muscleGroup === groupName);
  };

  const getSelectedCount = () => {
    return Object.values(selectedExercises).filter(Boolean).length;
  };

  const handleSave = async () => {
    if (!trainingName.trim()) {
      alert('Por favor, digite um nome para o treino');
      return;
    }

    const selectedIds = Object.keys(selectedExercises).filter(id => selectedExercises[id]);
    
    if (selectedIds.length === 0) {
      alert('Selecione pelo menos um exercício');
      return;
    }

    try {
      setSaving(true);
      
      // Formato para API (quando autenticado)
      const exercises = selectedIds.map((exerciseId, index) => {
        const exercise = allExercises.find(ex => ex.id === exerciseId);
        return {
          exerciseId: exerciseId,  // API espera 'exerciseId'
          orderIndex: index,
          sets: 3,
          reps: '8-12',
          restSec: 90,
        };
      });

      // Usa o adapter que decide se salva local ou na API
      await workoutsAdapter.create({
        title: trainingName,  // API espera 'title' não 'name'
        exercises
      });

      alert(isGuest ? 'Treino salvo localmente!' : 'Treino salvo com sucesso!');
      navigate('/meus-treinos');
      
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      alert('Erro ao salvar treino. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center">
        <Header />
        <div className="text-center pt-32">
          <div className="inline-block w-12 h-12 border-4 border-[#FF6A3D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#C7D0DD]">Carregando exercícios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <Header />
      
      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Banner Modo Visitante */}
          {isGuest && (
            <div className="mb-6 rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">👤</span>
                <div>
                  <h3 className="font-bold text-yellow-500 mb-1">Modo Visitante</h3>
                  <p className="text-sm text-[#C7D0DD]">
                    Este treino será salvo apenas neste navegador. <br/>
                    <span className="text-white font-medium">Faça login ou cadastre-se</span> para sincronizar automaticamente com a nuvem!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h1 className="text-5xl font-bold mb-4">
              Criar <span className="bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">Novo Treino</span>
            </h1>
            <p className="text-[#C7D0DD] text-lg">Monte seu treino personalizado selecionando os exercícios por grupo muscular</p>
          </div>

          <div className="mb-8 bg-[#151B23] rounded-2xl p-6 border border-[#1C2330]">
            <label className="block text-sm font-medium text-[#C7D0DD] mb-2">
              Nome do Treino *
            </label>
            <input
              type="text"
              value={trainingName}
              onChange={(e) => setTrainingName(e.target.value)}
              placeholder="Ex: TREINO A - COSTAS + BÍCEPS"
              className="w-full px-4 py-3 bg-[#0D1117] rounded-lg border border-[#1C2330] focus:border-[#FF6A3D] focus:outline-none text-white text-lg"
            />
          </div>

          <div className="mb-6 flex items-center justify-between bg-gradient-to-r from-[#FF6A3D]/10 to-[#FF1493]/10 rounded-xl p-4 border border-[#FF6A3D]/20">
            <span className="text-[#C7D0DD]">Exercícios selecionados:</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">
              {getSelectedCount()}
            </span>
          </div>

          <div className="space-y-6">
            {MUSCLE_GROUPS.map((group) => {
              const exercises = getExercisesByGroup(group.name);
              if (exercises.length === 0) return null;

              return (
                <div key={group.name} className="bg-[#151B23] rounded-2xl p-6 border border-[#1C2330]">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`text-3xl bg-gradient-to-r ${group.color} p-3 rounded-xl`}>
                      {group.icon}
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold">{group.name}</h3>
                      <p className="text-[#C7D0DD] text-sm">{exercises.length} exercícios disponíveis</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {exercises.map((exercise) => (
                      <label
                        key={exercise.id}
                        className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all duration-200 border ${
                          selectedExercises[exercise.id]
                            ? 'bg-gradient-to-r from-[#FF6A3D]/20 to-[#FF1493]/20 border-[#FF6A3D]'
                            : 'bg-[#0D1117] border-[#1C2330] hover:border-[#FF6A3D]/50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedExercises[exercise.id] || false}
                          onChange={() => toggleExercise(exercise.id)}
                          className="w-5 h-5 rounded border-2 border-[#1C2330] bg-[#0D1117] cursor-pointer"
                        />
                        <div className="flex-1">
                          <p className="font-medium">{exercise.name}</p>
                          {exercise.equipment && (
                            <p className="text-sm text-[#C7D0DD]">{exercise.equipment}</p>
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-8 flex gap-4">
            <button
              onClick={handleSave}
              disabled={saving || getSelectedCount() === 0 || !trainingName.trim()}
              className={`flex-1 py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
                saving || getSelectedCount() === 0 || !trainingName.trim()
                  ? 'bg-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] hover:shadow-lg hover:shadow-[#FF6A3D]/50'
              }`}
            >
              {saving ? 'Salvando...' : 'Salvar Treino'}
            </button>
            
            <button
              onClick={() => navigate('/dashboard')}
              className="px-8 py-4 rounded-xl font-bold text-lg border border-[#1C2330] hover:border-[#FF6A3D] transition-all duration-200"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
