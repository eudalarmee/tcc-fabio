import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import AdminLayout from '../components/AdminLayout';

export default function AdminUsers() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  useEffect(() => {
    if (!isAuthenticated || user?.role !== 'ADMIN') {
      navigate('/');
      return;
    }
    fetchUsers();
  }, [isAuthenticated, user, navigate]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/admin/users`);
      if (!response.ok) throw new Error('Erro ao buscar usuários');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (userId, currentRole) => {
    try {
      const newRole = currentRole === 'ADMIN' ? 'USER' : 'ADMIN';
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/admin/user/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      
      if (!response.ok) throw new Error('Erro ao atualizar role');
      await fetchUsers();
    } catch (error) {
      console.error('Erro ao atualizar role:', error);
      alert('Erro ao atualizar permissões do usuário');
    }
  };

  const deleteUser = async (userId) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/api/admin/user/${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erro ao deletar usuário');
      setShowConfirmDelete(null);
      await fetchUsers();
    } catch (error) {
      console.error('Erro ao deletar usuário:', error);
      alert('Erro ao deletar usuário');
    }
  };

  const filteredUsers = users.filter(u =>
    u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email?.toLowerCase().includes(searchTerm.toLowerCase())
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
        <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Usuários</h1>
        <p className="text-[#8A95A6]">Total de {users.length} usuários cadastrados</p>
      </div>

      {/* Busca */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Buscar por nome ou email..."
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
                  Usuário
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Treinos
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Cadastro
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-[#8A95A6] uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1C2330]">
              {filteredUsers.length > 0 ? (
                filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-[#1C2330] transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF6A3D] to-[#FF1493] flex items-center justify-center font-bold text-white">
                          {u.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="text-white font-medium">{u.name || 'Sem nome'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-[#C7D0DD]">{u.email}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-block px-3 py-1 text-xs font-bold rounded ${
                        u.role === 'ADMIN'
                          ? 'bg-gradient-to-r from-[#FF6A3D] to-[#FF1493] text-white'
                          : 'bg-[#242B37] text-[#8A95A6]'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-[#C7D0DD]">
                      {(u._count?.trainings || 0) + (u._count?.workouts || 0)}
                    </td>
                    <td className="px-6 py-4 text-[#C7D0DD]">{formatDate(u.createdAt)}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => toggleRole(u.id, u.role)}
                          className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded transition-colors duration-200"
                          title={u.role === 'ADMIN' ? 'Rebaixar para USER' : 'Promover para ADMIN'}
                        >
                          {u.role === 'ADMIN' ? '👤 Rebaixar' : '👑 Promover'}
                        </button>
                        <button
                          onClick={() => setShowConfirmDelete(u.id)}
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
                    Nenhum usuário encontrado
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Confirmação de Exclusão */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
          <div className="bg-[#151B23] border-2 border-red-600 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-white mb-3">⚠️ Confirmar Exclusão</h3>
            <p className="text-[#C7D0DD] mb-6">
              Tem certeza que deseja excluir este usuário? Esta ação é <strong>irreversível</strong> e todos os treinos do usuário também serão deletados.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => deleteUser(showConfirmDelete)}
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
