import { useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import { getCurrentUser } from '../stores/user';

export default function Treinos() {
  const user = getCurrentUser();
  
  // Explorar
  const [loading, setLoading] = useState(false);
  const [exercises, setExercises] = useState([]);
  const [query, setQuery] = useState('');
  const [group, setGroup] = useState('');
  const [page, setPage] = useState(1);

  // Builder
  const [title, setTitle] = useState('Meu Treino');
  const [items, setItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const groups = ['Costas', 'Pernas', 'Peito', 'Ombros', 'Bíceps', 'Tríceps', 'Core'];

  async function fetchExercises() {
    setLoading(true);
    try {
      const params = { page, pageSize: 20 };
      if (group) params.muscleGroup = group;
      if (query) params.search = query;
      
      const res = await api.get('/exercises', { params });
      setExercises(res.data?.data ?? res.data ?? []);
    } catch (error) {
      console.error('Erro ao buscar exercícios:', error);
      setExercises([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchExercises();
    // eslint-disable-next-line
  }, [group, page]);

  // Busca com debounce
  useEffect(() => {
    const timer = setTimeout(fetchExercises, 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line
  }, [query]);

  function addToBuilder(ex) {
    if (items.some(i => i.exerciseId === ex.id)) return;
    setItems(prev => [
      ...prev,
      { 
        exerciseId: ex.id, 
        name: ex.name, 
        orderIndex: prev.length + 1, 
        sets: 3, 
        reps: '8-12',
        restSec: 90
      }
    ]);
  }

  function removeFromBuilder(orderIndex) {
    const filtered = items
      .filter(i => i.orderIndex !== orderIndex)
      .map((i, idx) => ({ ...i, orderIndex: idx + 1 }));
    setItems(filtered);
  }

  function moveItem(oldIndex, newIndex) {
    if (newIndex < 1 || newIndex > items.length) return;
    const copy = [...items].sort((a, b) => a.orderIndex - b.orderIndex);
    const [moved] = copy.splice(oldIndex - 1, 1);
    copy.splice(newIndex - 1, 0, moved);
    const reindexed = copy.map((i, idx) => ({ ...i, orderIndex: idx + 1 }));
    setItems(reindexed);
  }

  const canSave = useMemo(() => title.trim().length >= 3 && items.length >= 2, [title, items]);

  async function saveWorkout() {
    if (!canSave) return;
    setSaving(true);
    try {
      const payload = {
        userId: user.id,
        title,
        exercises: items.map(i => ({
          exerciseId: i.exerciseId,
          orderIndex: i.orderIndex,
          sets: i.sets,
          reps: i.reps,
          restSec: i.restSec ?? 90
        }))
      };
      
      await api.post('/workouts/create', payload);
      alert('Treino salvo com sucesso! ✅');
      setTitle('Meu Treino');
      setItems([]);
    } catch (error) {
      console.error('Erro ao salvar treino:', error);
      alert('Erro ao salvar treino. Verifique se o backend está rodando.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-neutral-950 to-black text-white">
      <div className="mx-auto max-w-7xl px-4 py-8 md:py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-white to-neutral-400 bg-clip-text text-transparent">
          Criar Treino Personalizado
        </h1>

        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* EXPLORAR EXERCÍCIOS */}
          <section className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">📚 Explorar Exercícios</h2>

            <div className="space-y-4">
              <input
                placeholder="Buscar exercício (ex: remada, agachamento...)"
                value={query}
                onChange={e => setQuery(e.target.value)}
                className="w-full rounded-lg bg-neutral-900 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
              />

              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setGroup('')}
                  className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                    group === '' 
                      ? 'bg-white text-black border-white' 
                      : 'border-white/20 hover:border-white/40'
                  }`}
                >
                  Todos
                </button>
                {groups.map(g => (
                  <button
                    key={g}
                    onClick={() => { setGroup(g); setPage(1); }}
                    className={`px-4 py-2 rounded-full border text-sm font-medium transition ${
                      group === g 
                        ? 'bg-white text-black border-white' 
                        : 'border-white/20 hover:border-white/40'
                    }`}
                  >
                    {g}
                  </button>
                ))}
              </div>

              <div className="min-h-[400px]">
                {loading ? (
                  <div className="flex items-center justify-center h-40">
                    <p className="opacity-70">Carregando exercícios...</p>
                  </div>
                ) : (
                  <ul className="space-y-2">
                    {exercises.length === 0 ? (
                      <li className="text-center opacity-70 py-8">
                        Nenhum exercício encontrado
                      </li>
                    ) : (
                      exercises.map(ex => (
                        <li 
                          key={ex.id} 
                          className="flex items-center justify-between rounded-lg border border-white/10 bg-black/40 px-4 py-3 hover:border-white/20 transition"
                        >
                          <div>
                            <p className="font-semibold">{ex.name}</p>
                            <p className="text-xs opacity-70">
                              {ex.muscleGroup} • {ex.equipment ?? '—'} • {ex.difficulty ?? '—'}
                            </p>
                          </div>
                          <button 
                            onClick={() => addToBuilder(ex)} 
                            className="text-sm rounded-md border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black transition font-medium"
                          >
                            Adicionar
                          </button>
                        </li>
                      ))
                    )}
                  </ul>
                )}
              </div>

              <div className="flex gap-2 pt-4">
                <button 
                  disabled={page <= 1} 
                  onClick={() => setPage(p => p - 1)} 
                  className="rounded-md border border-white/20 px-4 py-2 disabled:opacity-40 hover:bg-white/10 transition"
                >
                  ← Anterior
                </button>
                <button 
                  onClick={() => setPage(p => p + 1)} 
                  className="rounded-md border border-white/20 px-4 py-2 hover:bg-white/10 transition"
                >
                  Próxima →
                </button>
              </div>
            </div>
          </section>

          {/* BUILDER */}
          <section className="rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm p-6">
            <h2 className="text-xl font-bold mb-4">🏋️ Meu Treino</h2>

            <div className="space-y-4">
              <div>
                <label className="text-sm opacity-80 mb-2 block">Nome do Treino</label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full rounded-lg bg-neutral-900 border border-white/10 px-4 py-3 outline-none focus:border-white/30 transition"
                  placeholder="Ex.: Treino A - Costas + Bíceps"
                />
              </div>

              <div className="space-y-2 min-h-[400px]">
                {items.length === 0 && (
                  <div className="text-sm opacity-70 border border-dashed border-white/15 rounded-lg p-6 text-center">
                    <p className="mb-2">💡 Dica</p>
                    <p>Adicione ao menos <strong>2 exercícios</strong> da lista ao lado para montar seu treino.</p>
                  </div>
                )}
                
                {items.sort((a, b) => a.orderIndex - b.orderIndex).map(it => (
                  <div key={it.orderIndex} className="rounded-lg border border-white/10 bg-black/40 p-4">
                    <div className="flex items-center justify-between mb-3">
                      <p className="font-semibold">#{it.orderIndex} • {it.name}</p>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => moveItem(it.orderIndex, it.orderIndex - 1)} 
                          className="text-xs border border-white/20 rounded px-2 py-1 hover:bg-white/10 transition"
                        >
                          ↑
                        </button>
                        <button 
                          onClick={() => moveItem(it.orderIndex, it.orderIndex + 1)} 
                          className="text-xs border border-white/20 rounded px-2 py-1 hover:bg-white/10 transition"
                        >
                          ↓
                        </button>
                        <button 
                          onClick={() => removeFromBuilder(it.orderIndex)} 
                          className="text-xs border border-red-500/30 text-red-400 rounded px-2 py-1 hover:bg-red-500/20 transition"
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="text-xs opacity-70 mb-1 block">Séries</label>
                        <input 
                          type="number" 
                          min={1} 
                          max={10} 
                          value={it.sets}
                          onChange={e => {
                            const v = Number(e.target.value || 1);
                            setItems(prev => prev.map(p => p.orderIndex === it.orderIndex ? { ...p, sets: v } : p));
                          }}
                          className="w-full rounded bg-neutral-900 border border-white/10 px-2 py-1.5 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs opacity-70 mb-1 block">Reps</label>
                        <input 
                          value={it.reps}
                          onChange={e => {
                            const v = e.target.value;
                            setItems(prev => prev.map(p => p.orderIndex === it.orderIndex ? { ...p, reps: v } : p));
                          }}
                          className="w-full rounded bg-neutral-900 border border-white/10 px-2 py-1.5 text-sm"
                          placeholder="8-12"
                        />
                      </div>
                      <div>
                        <label className="text-xs opacity-70 mb-1 block">Descanso (s)</label>
                        <input 
                          type="number" 
                          min={30} 
                          max={240} 
                          value={it.restSec ?? 90}
                          onChange={e => {
                            const v = Number(e.target.value || 90);
                            setItems(prev => prev.map(p => p.orderIndex === it.orderIndex ? { ...p, restSec: v } : p));
                          }}
                          className="w-full rounded bg-neutral-900 border border-white/10 px-2 py-1.5 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={saveWorkout}
                  disabled={!canSave || saving}
                  className="rounded-lg bg-white text-black px-6 py-3 font-semibold disabled:opacity-40 hover:bg-neutral-200 transition"
                >
                  {saving ? 'Salvando...' : '💾 Salvar Treino'}
                </button>
                <span className="text-xs opacity-70">
                  {items.length} exercício(s) • {canSave ? 'Pronto para salvar!' : 'Mínimo 2 exercícios'}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
