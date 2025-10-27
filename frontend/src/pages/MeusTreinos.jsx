import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../lib/api';
import { getCurrentUser } from '../stores/user';

export default function MeusTreinos() {
  const user = getCurrentUser();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);

  async function fetchData() {
    setLoading(true);
    try {
      const res = await api.get(`/workouts/user/${user.id}`);
      setData(res.data ?? []);
    } catch (error) {
      console.error('Erro ao buscar treinos:', error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }

  async function deleteWorkout(id) {
    if (!confirm('Tem certeza que deseja excluir este treino?')) return;
    
    try {
      await api.delete(`/workouts/${id}`);
      alert('Treino excluído com sucesso!');
      fetchData(); // Recarregar lista
    } catch (error) {
      console.error('Erro ao excluir treino:', error);
      alert('Erro ao excluir treino.');
    }
  }

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white">
      <div className="mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
            Meus Treinos
          </h1>
          <Link 
            to="/treinos"
            className="rounded-lg bg-white text-black px-4 py-2 font-semibold hover:bg-neutral-200 transition text-sm"
          >
            ➕ Criar Novo Treino
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-64">
            <p className="opacity-70">Carregando treinos...</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.length === 0 ? (
              <div className="col-span-full">
                <div className="rounded-xl border border-dashed border-white/20 bg-black/20 p-12 text-center">
                  <p className="text-lg opacity-70 mb-4">📋 Você ainda não salvou nenhum treino</p>
                  <Link 
                    to="/treinos"
                    className="inline-block rounded-lg bg-white text-black px-6 py-3 font-semibold hover:bg-neutral-200 transition"
                  >
                    Criar Primeiro Treino
                  </Link>
                </div>
              </div>
            ) : (
              data.map(w => (
                <div 
                  key={w.id} 
                  className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-5 hover:border-white/20 transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold line-clamp-2">{w.title}</h3>
                    <span className="text-xs opacity-60 whitespace-nowrap ml-2">
                      {new Date(w.createdAt).toLocaleDateString('pt-BR')}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs opacity-70 mb-2">Exercícios:</p>
                    <ul className="text-sm opacity-90 space-y-1">
                      {w.items
                        ?.sort((a, b) => a.orderIndex - b.orderIndex)
                        .slice(0, 5)
                        .map(it => (
                          <li key={it.orderIndex} className="flex items-start">
                            <span className="text-white/50 mr-2">#{it.orderIndex}</span>
                            <span className="line-clamp-1">{it.exercise?.name || 'Exercício'}</span>
                          </li>
                        ))
                      }
                      {w.items?.length > 5 && (
                        <li className="text-xs opacity-60">
                          +{w.items.length - 5} exercício(s)
                        </li>
                      )}
                    </ul>
                  </div>

                  <div className="flex gap-2 pt-3 border-t border-white/10">
                    <Link 
                      to={`/treinos?open=${w.id}`}
                      className="flex-1 text-center text-xs rounded-lg border border-white/20 px-3 py-2 hover:bg-white/10 transition font-medium"
                    >
                      📖 Ver Detalhes
                    </Link>
                    <button 
                      onClick={() => deleteWorkout(w.id)}
                      className="text-xs rounded-lg border border-red-500/30 text-red-400 px-3 py-2 hover:bg-red-500/20 transition font-medium"
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
