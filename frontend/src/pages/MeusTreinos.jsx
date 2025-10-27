import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5001/api';

export default function MeusTreinos() {
  const { user, token, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState('');

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    fetchTrainings();
  }, [isAuthenticated, navigate]);

  const fetchTrainings = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/trainings/mine`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
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
      const response = await fetch(`${API_URL}/trainings/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) throw new Error('Erro ao excluir treino');
      
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
      const response = await fetch(`${API_URL}/trainings/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: editingName })
      });
      
      if (!response.ok) throw new Error('Erro ao editar treino');
      
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
            <div className="space-y-4">
              {trainings.map((training) => (
                <div key={training.id} className="bg-[#151B23] rounded-2xl border border-[#1C2330] overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      {editingId === training.id ? (
                        <input
                          type="text"
                          value={editingName}
                          onChange={(e) => setEditingName(e.target.value)}
                          className="flex-1 px-4 py-2 bg-[#0D1117] rounded-lg border border-[#FF6A3D] focus:outline-none text-white text-xl font-bold"
                        />
                      ) : (
                        <h3 className="text-2xl font-bold">{training.name}</h3>
                      )}
                      
                      <div className="flex gap-2 ml-4">
                        {editingId === training.id ? (
                          <>
                            <button
                              onClick={() => saveEdit(training.id)}
                              className="px-4 py-2 bg-green-600 rounded-lg hover:bg-green-700 transition-all"
                            >
                              Salvar
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="px-4 py-2 bg-gray-600 rounded-lg hover:bg-gray-700 transition-all"
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              onClick={() => startEdit(training)}
                              className="px-4 py-2 bg-blue-600 rounded-lg hover:bg-blue-700 transition-all"
                            >
                              Editar
                            </button>
                            <button
                              onClick={() => handleDelete(training.id)}
                              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-all"
                            >
                              Excluir
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-[#C7D0DD] mb-4">
                      <span className="flex items-center gap-2">
                        <span className="text-2xl">💪</span>
                        {training.exercises?.length || 0} exercícios
                      </span>
                      <span>•</span>
                      <span>Criado em {new Date(training.createdAt).toLocaleDateString('pt-BR')}</span>
                    </div>

                    <button
                      onClick={() => toggleExpand(training.id)}
                      className="w-full py-3 bg-[#0D1117] rounded-lg border border-[#1C2330] hover:border-[#FF6A3D] transition-all duration-200 font-medium"
                    >
                      {expandedId === training.id ? 'Ocultar Exercícios ▲' : 'Ver Exercícios ▼'}
                    </button>

                    {expandedId === training.id && training.exercises && (
                      <div className="mt-4 space-y-3">
                        {training.exercises.map((item, index) => (
                          <div key={item.id} className="bg-[#0D1117] rounded-lg p-4 border border-[#1C2330]">
                            <div className="flex items-start justify-between">
                              <div className="flex gap-3">
                                <span className="text-[#FF6A3D] font-bold text-lg">{index + 1}.</span>
                                <div>
                                  <h4 className="font-bold text-lg">{item.exercise.name}</h4>
                                  <p className="text-[#C7D0DD] text-sm">{item.exercise.muscleGroup}</p>
                                </div>
                              </div>
                              <div className="text-right text-sm text-[#C7D0DD]">
                                <p>{item.sets} séries x {item.reps} reps</p>
                                <p>Descanso: {item.rest}s</p>
                              </div>
                            </div>
                          </div>
                        ))}
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
