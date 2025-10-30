// Mock de usuário - será substituído pelo AuthContext real
export const user = {
  id: 'user-demo-001',
  name: 'Aluno MuscleMax',
};

// Função para obter usuário atual do localStorage (se logado)
export function getCurrentUser() {
  try {
    const userData = localStorage.getItem('user');
    if (userData) {
      return JSON.parse(userData);
    }
    return user; // fallback para mock
  } catch {
    return user;
  }
}
