import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import Footer from '../components/Footer';

export default function Admin() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('exercises');
  const [exercises, setExercises] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  
  // Form states
  const [showExerciseForm, setShowExerciseForm] = useState(false);
  const [exerciseForm, setExerciseForm] = useState({
    name: '',
    muscleGroup: '',
    equipment: '',
    difficulty: '',
    mediaUrl: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    
    fetchData();
  }, [isAuthenticated, user, navigate, activeTab]);

  const fetchData = async () => {
    try {
      setLoading(true);
      
      if (activeTab === 'exercises') {
        const response = await fetch('http://localhost:5000/api/admin/exercises');
        const data = await response.json();
        setExercises(data);
      } else if (activeTab === 'users') {
        const response = await fetch('http://localhost:5000/api/admin/users');
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    
    if (!exerciseForm.name || !exerciseForm.muscleGroup) {
      showToast('Nome e grupo muscular são obrigatórios', 'error');
      return;
    }
    
    try {
      const response = await fetch('http://localhost:5000/api/admin/exercise/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(exerciseForm)
      });
      
      if (!response.ok) throw new Error('Erro ao criar exercício');
      
      showToast('Exercício criado com sucesso', 'success');
      setShowExerciseForm(false);
      setExerciseForm({ name: '', muscleGroup: '', equipment: '', difficulty: '', mediaUrl: '' });
      fetchData();
    } catch (error) {
      console.error('Erro ao criar exercício:', error);
      showToast('Erro ao criar exercício', 'error');
    }
  };

  const handleDeleteExercise = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este exercício?')) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/exercise/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erro ao deletar');
      
      showToast('Exercício excluído com sucesso', 'success');
      fetchData();
    } catch (error) {
      console.error('Erro ao deletar exercício:', error);
      showToast('Erro ao excluir exercício', 'error');
    }
  };

  const handleToggleUserRole = async (userId, currentRole) => {
    const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
    
    if (!confirm(`Deseja ${newRole === 'ADMIN' ? 'promover' : 'remover'} este usuário ${newRole === 'ADMIN' ? 'para' : 'de'} ADMIN?`)) return;
    
    try {
      const response = await fetch(`http://localhost:5000/api/admin/user/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar role');
      
      showToast(`Usuário ${newRole === 'ADMIN' ? 'promovido' : 'removido'} com sucesso`, 'success');
      fetchData();
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      showToast('Erro ao atualizar permissões', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-[#0D1117] text-white">
      <Header />
      
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-6 z-[9999] px-6 py-3 rounded-lg shadow-lg animate-fade-in ${
          toast.type === 'error' ? 'bg-red-500' :
          toast.type === 'warning' ? 'bg-yellow-500' :
          'bg-green-500'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">
              Painel do <span className="bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] bg-clip-text text-transparent">Administrador</span>
            </h1>
            <p className="text-[#C7D0DD]">Gerencie exercícios e usuários do sistema</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-4 mb-8 border-b border-[#1C2330]">
            <button
              onClick={() => setActiveTab('exercises')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'exercises'
                  ? 'text-white'
                  : 'text-[#8A95A6] hover:text-white'
              }`}
            >
              Exercícios
              {activeTab === 'exercises' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493]"></div>
              )}
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`px-6 py-3 font-semibold transition-colors relative ${
                activeTab === 'users'
                  ? 'text-white'
                  : 'text-[#8A95A6] hover:text-white'
              }`}
            >
              Usuários
              {activeTab === 'users' && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF6A3D] to-[#FF1493]"></div>
              )}
            </button>
          </div>

          {/* Conteúdo */}
          {loading ? (
            <div className="text-center py-12">
              <p className="text-[#C7D0DD]">Carregando...</p>
            </div>
          ) : (
            <>
              {/* Aba de Exercícios */}
              {activeTab === 'exercises' && (
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Exercícios Cadastrados</h2>
                    <button
                      onClick={() => setShowExerciseForm(!showExerciseForm)}
                      className="btn-primary px-6 py-2"
                    >
                      {showExerciseForm ? 'Cancelar' : '+ Novo Exercício'}
                    </button>
                  </div>

                  {/* Formulário de criação */}
                  {showExerciseForm && (
                    <form onSubmit={handleCreateExercise} className="bg-[#151B23] rounded-lg p-6 mb-6 border border-[#1C2330]">
                      <h3 className="text-lg font-semibold mb-4">Criar Novo Exercício</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm text-[#8A95A6] mb-2">Nome *</label>
                          <input
                            type="text"
                            value={exerciseForm.name}
                            onChange={(e) => setExerciseForm({ ...exerciseForm, name: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0D1117] rounded-lg border border-[#1C2330] focus:border-[#FF6A3D] focus:outline-none text-white"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#8A95A6] mb-2">Grupo Muscular *</label>
                          <select
                            value={exerciseForm.muscleGroup}
                            onChange={(e) => setExerciseForm({ ...exerciseForm, muscleGroup: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0D1117] rounded-lg border border-[#1C2330] focus:border-[#FF6A3D] focus:outline-none text-white"
                            required
                          >
                            <option value="">Selecione...</option>
                            <option value="Costas">Costas</option>
                            <option value="Peito">Peito</option>
                            <option value="Pernas">Pernas</option>
                            <option value="Ombros">Ombros</option>
                            <option value="Bíceps">Bíceps</option>
                            <option value="Tríceps">Tríceps</option>
                            <option value="Core">Core</option>
                            <option value="Cardio">Cardio</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-sm text-[#8A95A6] mb-2">Equipamento</label>
                          <input
                            type="text"
                            value={exerciseForm.equipment}
                            onChange={(e) => setExerciseForm({ ...exerciseForm, equipment: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0D1117] rounded-lg border border-[#1C2330] focus:border-[#FF6A3D] focus:outline-none text-white"
                            placeholder="Ex: Barra, Halteres, Máquina..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm text-[#8A95A6] mb-2">Dificuldade</label>
                          <select
                            value={exerciseForm.difficulty}
                            onChange={(e) => setExerciseForm({ ...exerciseForm, difficulty: e.target.value })}
                            className="w-full px-3 py-2 bg-[#0D1117] rounded-lg border border-[#1C2330] focus:border-[#FF6A3D] focus:outline-none text-white"
                          >
                            <option value="">Selecione...</option>
                            <option value="Iniciante">Iniciante</option>
                            <option value="Intermediário">Intermediário</option>
                            <option value="Avançado">Avançado</option>
                          </select>
                        </div>
                      </div>
                      <button type="submit" className="btn-primary px-6 py-2">
                        Criar Exercício
                      </button>
                    </form>
                  )}

                  {/* Lista de exercícios */}
                  <div className="grid gap-4">
                    {exercises.length === 0 ? (
                      <p className="text-center text-[#8A95A6] py-8">Nenhum exercício cadastrado</p>
                    ) : (
                      exercises.map((exercise) => (
                        <div
                          key={exercise.id}
                          className="bg-[#151B23] rounded-lg p-4 border border-[#1C2330] hover:border-[#FF6A3D] transition-colors"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <h3 className="font-semibold text-white mb-2">{exercise.name}</h3>
                              <div className="flex flex-wrap gap-2 text-sm">
                                <span className="px-2 py-1 bg-[#1C2330] rounded text-[#C7D0DD]">{exercise.muscleGroup}</span>
                                {exercise.equipment && (
                                  <span className="px-2 py-1 bg-[#1C2330] rounded text-[#8A95A6]">{exercise.equipment}</span>
                                )}
                                {exercise.difficulty && (
                                  <span className="px-2 py-1 bg-[#1C2330] rounded text-[#8A95A6]">{exercise.difficulty}</span>
                                )}
                                {exercise._count && (
                                  <span className="px-2 py-1 bg-[#1C2330] rounded text-[#8A95A6]">
                                    Usado em {exercise._count.items + exercise._count.trainingItems} treinos
                                  </span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteExercise(exercise.id)}
                              className="ml-4 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 rounded text-sm text-red-400 transition-colors"
                            >
                              Excluir
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Aba de Usuários */}
              {activeTab === 'users' && (
                <div>
                  <h2 className="text-2xl font-bold mb-6">Usuários do Sistema</h2>
                  
                  <div className="grid gap-4">
                    {users.length === 0 ? (
                      <p className="text-center text-[#8A95A6] py-8">Nenhum usuário encontrado</p>
                    ) : (
                      users.map((usr) => (
                        <div
                          key={usr.id}
                          className="bg-[#151B23] rounded-lg p-4 border border-[#1C2330]"
                        >
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="font-semibold text-white">{usr.name}</h3>
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  usr.role === 'ADMIN'
                                    ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white'
                                    : 'bg-[#1C2330] text-[#8A95A6]'
                                }`}>
                                  {usr.role}
                                </span>
                              </div>
                              <p className="text-[#8A95A6] text-sm mb-2">{usr.email}</p>
                              <div className="flex gap-4 text-sm text-[#8A95A6]">
                                <span>{usr._count?.trainings || 0} treinos</span>
                                <span>•</span>
                                <span>Desde {new Date(usr.createdAt).toLocaleDateString('pt-BR')}</span>
                              </div>
                            </div>
                            
                            {usr.id !== user?.id && (
                              <button
                                onClick={() => handleToggleUserRole(usr.id, usr.role)}
                                className={`ml-4 px-4 py-2 rounded text-sm font-medium transition-colors ${
                                  usr.role === 'ADMIN'
                                    ? 'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400'
                                    : 'bg-green-500/10 hover:bg-green-500/20 text-green-400'
                                }`}
                              >
                                {usr.role === 'ADMIN' ? 'Remover Admin' : 'Promover a Admin'}
                              </button>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
