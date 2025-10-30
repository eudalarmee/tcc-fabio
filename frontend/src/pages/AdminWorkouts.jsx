import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';

export default function AdminWorkouts() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchWorkouts();
  }, [isAuthenticated, user, navigate]);

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/admin/workouts`);
      if (!response.ok) throw new Error('Erro ao buscar treinos');
      const data = await response.json();
      setWorkouts(data);
    } catch (error) {
      console.error('Erro ao carregar treinos:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteWorkout = async (workoutId, type) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const endpoint = type === 'workout' ? 'workout' : 'training';
      const response = await fetch(`${API_URL}/api/admin/${endpoint}/${workoutId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erro ao deletar treino');
      setShowConfirmDelete(null);
      setSelectedWorkout(null);
      await fetchWorkouts();
    } catch (error) {
      console.error('Erro ao deletar treino:', error);
      alert('Erro ao deletar treino');
    }
  };

  const filteredWorkouts = workouts.filter(w =>
    w.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.user?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#FF6A3D]"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Treinos</h1>
        <p className="text-[#8A95A6]">Total de {workouts.length} treinos cadastrados</p>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome do treino ou criador..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 bg-[#151B23] border-2 border-[#1C2330] rounded-lg text-white focus:border-[#FF6A3D] focus:outline-none"
        />
      </div>

      {/* Tabela */}
      <div className="bg-[#151B23] border-2 border-[#1C2330] rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#1C2330]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Nome do Treino
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Criado Por
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Exercícios
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Data
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2330]">
              {filteredWorkouts.length > 0 ? (
                filteredWorkouts.map((w) => (
                  <tr key={w.id} className="hover:bg-[#1C2330] transition-colors duration-150">
                    <td className="px-6 py-4">
                      <span className="text-white font-medium">{w.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] flex items-center justify-center font-bold text-white text-sm">
                          {w.user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="text-[#C7D0DD] text-sm">{w.user?.name || 'Anônimo'}</p>
                          <p className="text-[#8A95A6] text-xs">{w.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[#C7D0DD]">{w.items?.length || 0}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded ${
                        w.type === 'workout'
                          ? 'bg-purple-600 text-white'
                          : 'bg-blue-600 text-white'
                      }`}>
                        {w.type === 'workout' ? 'Workout' : 'Training'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#C7D0DD]">{formatDate(w.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setSelectedWorkout(w)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors duration-200"
                        >
                          👁️ Ver
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(w)}
                          className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded transition-colors duration-200"
                        >
                          🗑️ Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center text-[#8A95A6]">
                    Nenhum treino encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes do Treino */}
      {selectedWorkout && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-[#151B23] border-2 border-[#1C2330] rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold text-white">{selectedWorkout.name}</h3>
              <button
                onClick={() => setSelectedWorkout(null)}
                className="text-[#8A95A6] hover:text-white text-2xl"
              >
                ✕
              </button>
            </div>
            
            <div className="mb-4 p-4 bg-[#1C2330] rounded-lg">
              <p className="text-sm text-[#8A95A6] mb-1">Criado por</p>
              <p className="text-white font-medium">{selectedWorkout.user?.name} ({selectedWorkout.user?.email})</p>
              <p className="text-xs text-[#8A95A6] mt-2">Data: {formatDate(selectedWorkout.createdAt)}</p>
            </div>

            <h4 className="text-lg font-bold text-white mb-3">Exercícios ({selectedWorkout.items?.length || 0})</h4>
            <div className="space-y-2">
              {selectedWorkout.items && selectedWorkout.items.length > 0 ? (
                selectedWorkout.items.map((item, index) => (
                  <div key={item.id} className="p-3 bg-[#1C2330] rounded-lg">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-white font-medium">
                          {index + 1}. {item.exercise?.name || 'Exercício não encontrado'}
                        </p>
                        <p className="text-sm text-[#8A95A6]">
                          {item.exercise?.muscleGroup || 'Grupo muscular não definido'}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[#C7D0DD] text-sm">
                          {item.sets || '-'} x {item.reps || '-'}
                        </p>
                        {item.weight && (
                          <p className="text-xs text-[#8A95A6]">{item.weight}kg</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-[#8A95A6] py-4">Nenhum exercício cadastrado</p>
              )}
            </div>

            <button
              onClick={() => setSelectedWorkout(null)}
              className="mt-6 w-full px-4 py-3 bg-[#1C2330] hover:bg-[#242B37] text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Fechar
            </button>
          </div>
        </div>
      )}

      {/* Modal de Confirmação de Exclusão */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10001] flex items-center justify-center p-4">
          <div className="bg-[#151B23] border-2 border-red-600 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-3">⚠️ Confirmar Exclusão</h3>
            <p className="text-[#C7D0DD] mb-6">
              Tem certeza que deseja excluir o treino "<strong>{showConfirmDelete.name}</strong>"? Esta ação é <strong>irreversível</strong>.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteWorkout(showConfirmDelete.id, showConfirmDelete.type)}
                className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Sim, Excluir
              </button>
              <button
                onClick={() => setShowConfirmDelete(null)}
                className="flex-1 px-4 py-2.5 bg-[#1C2330] hover:bg-[#242B37] text-white font-semibold rounded-lg transition-colors duration-200"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
