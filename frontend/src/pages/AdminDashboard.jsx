import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../lib/api';
import AdminLayout from '../components/AdminLayout';

export default function AdminDashboard() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    
    fetchStats();
  }, [isAuthenticated, user, navigate]);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/stats');
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
        <p className="text-[#8A95A6]">Visão geral do sistema MuscleMax</p>
      </div>

      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total Usuários */}
        <div className="bg-[#151B23] border-2 border-[#1C2330] rounded-lg p-6 hover:border-[#FF6A3D] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8A95A6] text-sm uppercase tracking-wide mb-1">Total Usuários</p>
              <p className="text-3xl font-bold text-white">{stats?.totalUsers || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-2xl">
              👥
            </div>
          </div>
        </div>

        {/* Total Treinos */}
        <div className="bg-[#151B23] border-2 border-[#1C2330] rounded-lg p-6 hover:border-[#FF6A3D] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8A95A6] text-sm uppercase tracking-wide mb-1">Total Treinos</p>
              <p className="text-3xl font-bold text-white">{stats?.totalWorkouts || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-2xl">
              💪
            </div>
          </div>
        </div>

        {/* Novos Usuários Hoje */}
        <div className="bg-[#151B23] border-2 border-[#1C2330] rounded-lg p-6 hover:border-[#FF6A3D] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8A95A6] text-sm uppercase tracking-wide mb-1">Novos Hoje</p>
              <p className="text-3xl font-bold text-white">{stats?.newUsersToday || 0}</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center text-2xl">
              ✨
            </div>
          </div>
        </div>

        {/* Taxa de Crescimento */}
        <div className="bg-[#151B23] border-2 border-[#1C2330] rounded-lg p-6 hover:border-[#FF6A3D] transition-all duration-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#8A95A6] text-sm uppercase tracking-wide mb-1">Status</p>
              <p className="text-xl font-bold text-green-500">🟢 Online</p>
            </div>
            <div className="w-12 h-12 bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] rounded-lg flex items-center justify-center text-2xl">
              📊
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Últimos Usuários */}
        <div className="bg-[#151B23] border-2 border-[#1C2330] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Últimos Usuários</h2>
            <Link
              to="/admin/users"
              className="text-[#FF6A3D] hover:text-[#FF1493] text-sm font-semibold"
            >
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentUsers && stats.recentUsers.length > 0 ? (
              stats.recentUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between p-3 bg-[#1C2330] rounded-lg hover:bg-[#242B37] transition-colors duration-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] flex items-center justify-center font-bold text-white">
                      {user.name?.charAt(0).toUpperCase() || '?'}
                    </div>
                    <div>
                      <p className="text-white font-medium">{user.name || 'Sem nome'}</p>
                      <p className="text-xs text-[#8A95A6]">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-2 py-1 text-xs font-bold rounded ${
                      user.role === 'ADMIN'
                        ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white'
                        : 'bg-[#151B23] text-[#8A95A6]'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-xs text-[#8A95A6] mt-1">
                      {formatDate(user.createdAt)}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#8A95A6] py-8">Nenhum usuário cadastrado</p>
            )}
          </div>
        </div>

        {/* Últimos Treinos */}
        <div className="bg-[#151B23] border-2 border-[#1C2330] rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-white">Últimos Treinos</h2>
            <Link
              to="/admin/workouts"
              className="text-[#FF6A3D] hover:text-[#FF1493] text-sm font-semibold"
            >
              Ver todos →
            </Link>
          </div>
          <div className="space-y-3">
            {stats?.recentWorkouts && stats.recentWorkouts.length > 0 ? (
              stats.recentWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="p-3 bg-[#1C2330] rounded-lg hover:bg-[#242B37] transition-colors duration-200"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-white font-medium">{workout.name}</p>
                    <span className="text-xs px-2 py-1 bg-[#151B23] text-[#8A95A6] rounded">
                      {workout._count?.items || 0} exercícios
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-[#8A95A6]">
                    <span>Por: {workout.user?.name || 'Anônimo'}</span>
                    <span>{formatDate(workout.createdAt)}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-[#8A95A6] py-8">Nenhum treino criado</p>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
