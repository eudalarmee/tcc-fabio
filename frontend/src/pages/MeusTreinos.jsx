import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useWorkoutsAdapter } from '../lib/workoutsAdapter';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function MeusTreinos() {
  const { isGuest, isAuthenticated } = useAuth();
  const workoutsAdapter = useWorkoutsAdapter();
  const navigate = useNavigate();
  
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    fetchTrainings();
  }, [isAuthenticated, isGuest]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const data = await workoutsAdapter.list();
      console.log('🔍 [MeusTreinos] Treinos recebidos:', data);
      console.log('🔍 [MeusTreinos] Primeiro treino:', data[0]);
      console.log('🔍 [MeusTreinos] Exercícios do primeiro treino:', data[0]?.exercises);
      setTrainings(data);
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
      alert('Erro ao carregar treinos');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este treino?')) return;
    
    try {
      await workoutsAdapter.delete(id);
      alert('Treino excluído com sucesso!');
      fetchTrainings();
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      alert('Erro ao excluir treino');
    }
  };

  const startEdit = (training) => {
    setEditingId(training.id);
    setEditingName(training.name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName('');
  };

  const saveEdit = async (id) => {
    try {
      await workoutsAdapter.update(id, { name: editingName });
      alert('Treino atualizado com sucesso!');
      setEditingId(null);
      fetchTrainings();
    } catch (error) {
      console.error('Erro ao editar treino:', error);
      alert('Erro ao editar treino');
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1117] text-white flex items-center justify-center">
        <Header />
        <div className="text-center pt-32">
          <div className="inline-block w-12 h-12 border-4 border-[#FF6A3D] border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-[#C7D0DD]">Carregando treinos...</p>
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
                    Seus treinos estão salvos apenas neste navegador. <br/>
                    <span className="text-white font-medium">Faça login ou cadastre-se</span> para sincronizar automaticamente com a nuvem!
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-5xl font-bold mb-4">
                Meus <span className="bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">Treinos</span>
              </h1>
              <p className="text-[#C7D0DD] text-lg">Gerencie seus treinos personalizados</p>
            </div>
            <button
              onClick={() => navigate('/criar-treino')}
              className="px-6 py-3 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] rounded-xl font-bold hover:shadow-lg hover:shadow-[#FF6A3D]/50 transition-all duration-200"
            >
              + Novo Treino
            </button>
          </div>

          {trainings.length === 0 ? (
            <div className="bg-[#151B23] rounded-2xl p-12 border border-[#1C2330] text-center">
              <div className="text-6xl mb-4">🏋️</div>
              <h3 className="text-2xl font-bold mb-2">Nenhum treino criado ainda</h3>
              <p className="text-[#C7D0DD] mb-6">Comece criando seu primeiro treino personalizado!</p>
              <button
                onClick={() => navigate('/criar-treino')}
                className="px-8 py-4 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] rounded-xl font-bold hover:shadow-lg hover:shadow-[#FF6A3D]/50 transition-all duration-200"
              >
                Criar Primeiro Treino
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {trainings.map((training) => (
                <div key={training.id} className="bg-[#151B23] rounded-2xl border-2 border-[#1C2330] overflow-hidden hover:border-[#FF6A3D]/50 transition-all duration-300 shadow-xl hover:shadow-[#FF6A3D]/20">
                  {/* Header do Card */}
                  <div className="bg-gradient-to-r from-[#FF6A3D]/10 to-[#FF1493]/10 border-b border-[#1C2330] p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        {editingId === training.id ? (
                          <input
                            type="text"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            className="w-full px-4 py-2 bg-[#0D1117] rounded-lg border-2 border-[#FF6A3D] focus:outline-none text-white text-2xl font-bold"
                            placeholder="Nome do treino..."
                            autoFocus
                          />
                        ) : (
                          <h3 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-[#C7D0DD] bg-clip-text text-transparent">
                            {training.name}
                          </h3>
                        )}
                        
                        {/* Info Cards */}
                        <div className="flex flex-wrap gap-3 mt-4">
                          <div className="flex items-center gap-2 bg-[#0D1117] px-3 py-2 rounded-lg border border-[#1C2330]">
                            <span className="text-2xl">💪</span>
                            <div>
                              <p className="text-xs text-[#8A95A6]">Exercícios</p>
                              <p className="text-sm font-bold text-white">{training.exercises?.length || 0}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2 bg-[#0D1117] px-3 py-2 rounded-lg border border-[#1C2330]">
                            <span className="text-2xl">📅</span>
                            <div>
                              <p className="text-xs text-[#8A95A6]">Criado em</p>
                              <p className="text-sm font-bold text-white">
                                {new Date(training.createdAt).toLocaleDateString('pt-BR')}
                              </p>
                            </div>
                          </div>
                          
                          {training.exercises && training.exercises.length > 0 && (
                            <div className="flex items-center gap-2 bg-[#0D1117] px-3 py-2 rounded-lg border border-[#1C2330]">
                              <span className="text-2xl">⏱️</span>
                              <div>
                                <p className="text-xs text-[#8A95A6]">Tempo estimado</p>
                                <p className="text-sm font-bold text-white">
                                  {Math.round(training.exercises.reduce((acc, ex) => {
                                    const execTime = (ex.sets || 3) * (ex.reps || 10) * 3; // ~3s por rep
                                    const restTime = (ex.sets || 3) * (ex.rest || 60);
                                    return acc + execTime + restTime;
                                  }, 0) / 60)} min
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Botões de Ação */}
                      <div className="flex gap-2 ml-4">
                        {editingId === training.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(training.id)}
                              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-all shadow-lg hover:shadow-green-600/50 font-medium flex items-center gap-2"
                            >
                              <span>✓</span> Salvar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-all font-medium"
                            >
                              ✕ Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(training)}
                              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-600/50 font-medium flex items-center gap-2"
                              title="Editar nome do treino"
                            >
                              <span>✏️</span> Editar
                            </button>
                            <button
                              onClick={() => handleDelete(training.id)}
                              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all shadow-lg hover:shadow-red-600/50 font-medium flex items-center gap-2"
                              title="Excluir treino"
                            >
                              <span>�️</span> Excluir
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Card */}
                  <div className="p-6">
                    <button
                      onClick={() => toggleExpand(training.id)}
                      className="w-full py-4 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] rounded-xl hover:shadow-lg hover:shadow-[#FF6A3D]/50 transition-all duration-200 font-bold text-lg flex items-center justify-center gap-2"
                    >
                      <span>{expandedId === training.id ? '👁️ Ocultar Exercícios' : '👁️ Ver Exercícios'}</span>
                      <span>{expandedId === training.id ? '▲' : '▼'}</span>
                    </button>

                    {expandedId === training.id && training.exercises && (
                      <div className="mt-6 space-y-3">
                        {training.exercises.length === 0 ? (
                          <div className="text-center py-8 text-[#8A95A6]">
                            <p>Nenhum exercício neste treino ainda.</p>
                          </div>
                        ) : (
                          training.exercises.map((item, index) => (
                            <div key={item.id} className="bg-[#0D1117] rounded-xl p-5 border-2 border-[#1C2330] hover:border-[#FF6A3D]/30 transition-all duration-200 group">
                              <div className="flex items-start justify-between">
                                <div className="flex gap-4 flex-1">
                                  <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] rounded-lg flex items-center justify-center font-bold text-lg">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1">
                                    <h4 className="font-bold text-xl mb-1 group-hover:text-[#FF6A3D] transition-colors">
                                      {item.exercise.name}
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-[#8A95A6]">
                                      <span className="px-2 py-1 bg-[#1C2330] rounded-md">
                                        🎯 {item.exercise.muscleGroup}
                                      </span>
                                      {item.exercise.equipment && (
                                        <span className="px-2 py-1 bg-[#1C2330] rounded-md">
                                          🏋️ {item.exercise.equipment}
                                        </span>
                                      )}
                                      {item.exercise.difficulty && (
                                        <span className={`px-2 py-1 rounded-md ${
                                          item.exercise.difficulty === 'Iniciante' ? 'bg-green-500/20 text-green-400' :
                                          item.exercise.difficulty === 'Intermediário' ? 'bg-yellow-500/20 text-yellow-400' :
                                          'bg-red-500/20 text-red-400'
                                        }`}>
                                          {item.exercise.difficulty === 'Iniciante' ? '⭐' : 
                                           item.exercise.difficulty === 'Intermediário' ? '⭐⭐' : '⭐⭐⭐'} 
                                          {item.exercise.difficulty}
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                
                                {/* Info do Exercício */}
                                <div className="flex gap-4 text-right">
                                  <div className="bg-[#1C2330] px-4 py-2 rounded-lg">
                                    <p className="text-xs text-[#8A95A6] mb-1">Séries × Reps</p>
                                    <p className="text-lg font-bold text-white">
                                      {item.sets} × {item.reps}
                                    </p>
                                  </div>
                                  <div className="bg-[#1C2330] px-4 py-2 rounded-lg">
                                    <p className="text-xs text-[#8A95A6] mb-1">Descanso</p>
                                    <p className="text-lg font-bold text-white">{item.rest}s</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
