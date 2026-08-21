import { useState, useEffect } from 'react';
import api from '../api/axiosClient';
import PomodoroTimer from '../components/pomodoro/PomodoroTimer';
import { useTheme } from '../context/ThemeContext';
import { Plus, CheckCircle, Circle, Clock, X, Trash2, RotateCcw, ChevronDown, ChevronRight, AlertTriangle } from 'lucide-react';
import { wowLabel } from '../lib/wowCopy';

interface Subtask {
  id: number;
  title: string;
  done: boolean;
  position: number;
}

interface Task {
  id: number;
  title: string;
  description: string;
  dueDate: string | null;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
  estimatedPomodoros: number;
  completedPomodoros: number;
  subtasks: Subtask[];
}

const NOTIFIED_KEY = 'edubaka_notified_tasks';

const dueUrgency = (task: Task): 'overdue' | 'soon' | null => {
  if (!task.dueDate || task.status === 'COMPLETED') return null;
  const diffMs = new Date(task.dueDate).getTime() - Date.now();
  if (diffMs < 0) return 'overdue';
  if (diffMs < 24 * 60 * 60 * 1000) return 'soon';
  return null;
};

const formatDue = (dueDate: string) =>
  new Date(dueDate).toLocaleString('es-PE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const Tasks = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [deletedTasks, setDeletedTasks] = useState<Task[]>([]);
  const [showTrash, setShowTrash] = useState(false);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [subtaskDraft, setSubtaskDraft] = useState('');
  const { mode } = useTheme();
  const wow = mode === 'wow';

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<'LOW' | 'MEDIUM' | 'HIGH'>('MEDIUM');
  const [newTaskPomodoros, setNewTaskPomodoros] = useState(1);

  useEffect(() => {
    fetchTasks();
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => checkDueReminders(tasks), 60000);
    checkDueReminders(tasks);
    return () => clearInterval(interval);
  }, [tasks]);

  // On Android/mobile `new Notification()` throws ("Illegal constructor") — notifications
  // must go through the service worker there. Prefer it, fall back to the constructor,
  // and never let a failure bubble up (an uncaught throw here would unmount the whole app).
  const notify = async (title: string, body: string) => {
    try {
      const reg = await navigator.serviceWorker?.ready;
      if (reg) await reg.showNotification(title, { body });
      else new Notification(title, { body });
    } catch { /* notifications are best-effort */ }
  };

  const checkDueReminders = (list: Task[]) => {
    if (!('Notification' in window) || Notification.permission !== 'granted') return;
    const notified: number[] = JSON.parse(localStorage.getItem(NOTIFIED_KEY) || '[]');
    const toNotify = list.filter((t) => dueUrgency(t) === 'soon' && !notified.includes(t.id));
    toNotify.forEach((t) => notify('Tarea por vencer', `${t.title} vence pronto`));
    if (toNotify.length > 0) {
      localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...notified, ...toNotify.map((t) => t.id)]));
    }
  };

  const fetchTasks = async () => {
    const res = await api.get('/tasks');
    setTasks(res.data);
  };

  const fetchDeleted = async () => {
    const res = await api.get('/tasks/deleted');
    setDeletedTasks(res.data);
  };

  const toggleTrash = () => {
    const next = !showTrash;
    setShowTrash(next);
    if (next) fetchDeleted();
  };

  const toggleStatus = async (task: Task) => {
    const newStatus = task.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
    await api.patch(`/tasks/${task.id}/status`, null, { params: { status: newStatus } });
    fetchTasks();
  };

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    await api.post('/tasks', {
      title: newTaskTitle,
      description: '',
      dueDate: newTaskDueDate ? new Date(newTaskDueDate).toISOString() : null,
      priority: newTaskPriority,
      estimatedPomodoros: newTaskPomodoros,
      status: 'PENDING'
    });
    setIsTaskModalOpen(false);
    setNewTaskTitle('');
    setNewTaskDueDate('');
    setNewTaskPomodoros(1);
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    await api.delete(`/tasks/${id}`);
    if (activeTask?.id === id) setActiveTask(null);
    fetchTasks();
  };

  const restoreTask = async (id: number) => {
    await api.patch(`/tasks/${id}/restore`);
    fetchDeleted();
    fetchTasks();
  };

  const addSubtask = async (taskId: number) => {
    if (!subtaskDraft.trim()) return;
    await api.post(`/tasks/${taskId}/subtasks`, { title: subtaskDraft });
    setSubtaskDraft('');
    fetchTasks();
  };

  const toggleSubtask = async (taskId: number, subtaskId: number) => {
    await api.patch(`/tasks/${taskId}/subtasks/${subtaskId}/toggle`);
    fetchTasks();
  };

  const deleteSubtask = async (taskId: number, subtaskId: number) => {
    await api.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
    fetchTasks();
  };

  const pendingTasks = tasks
    .filter((t) => t.status !== 'COMPLETED')
    .sort((a, b) => {
      if (!a.dueDate) return 1;
      if (!b.dueDate) return -1;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    });
  const completedTasks = tasks.filter((t) => t.status === 'COMPLETED');

  const cardClass = wow
    ? 'bg-white/10 backdrop-blur-md text-white border-white/20'
    : 'bg-white dark:bg-(--color-surface-dark) border-black/[0.06] dark:border-white/[0.08]';

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[calc(100vh-4rem)]">
      {isTaskModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`relative w-full max-w-md p-8 rounded-3xl shadow-2xl border ${wow ? 'bg-[#1E293B] text-slate-200 border-slate-700' : 'eb-card'}`}>
            <button onClick={() => setIsTaskModalOpen(false)} className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors">
              <X size={20} />
            </button>
            <h3 className="text-2xl font-bold mb-6 font-display">Nueva Tarea</h3>

            <form onSubmit={handleAddTask} className="space-y-4 text-left">
              <input required type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="Ej: Estudiar Cálculo..." className="eb-input" />
              <label className="block text-sm font-medium text-(--color-ink-soft)">
                Fecha límite
                <input type="datetime-local" value={newTaskDueDate} onChange={(e) => setNewTaskDueDate(e.target.value)} className="eb-input mt-1" />
              </label>
              <div className="flex gap-4">
                <label className="block text-sm font-medium text-(--color-ink-soft) flex-1">
                  Prioridad
                  <select value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value as any)} className="eb-input mt-1">
                    <option value="LOW">Baja</option>
                    <option value="MEDIUM">Media</option>
                    <option value="HIGH">Alta</option>
                  </select>
                </label>
                <label className="block text-sm font-medium text-(--color-ink-soft) flex-1">
                  Pomodoros estimados
                  <input type="number" min="1" max="20" value={newTaskPomodoros} onChange={(e) => setNewTaskPomodoros(Number(e.target.value))} className="eb-input mt-1" />
                </label>
              </div>
              <button type="submit" className="eb-btn-primary w-full py-3">Añadir Tarea</button>
            </form>
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto pr-2 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold font-display">{wowLabel(mode, 'Tareas')}</h1>
          <div className="flex gap-2">
            <button onClick={toggleTrash} className={`p-3 rounded-full transition-colors ${showTrash ? 'bg-(--color-accent) text-white' : 'eb-btn-secondary'}`}>
              <Trash2 size={20} />
            </button>
            <button onClick={() => setIsTaskModalOpen(true)} className={`p-3 rounded-full shadow-sm hover:scale-105 transition-transform ${wow ? 'bg-gradient-to-r from-red-600 to-orange-500 text-white' : 'eb-btn-primary'}`}>
              <Plus size={24} />
            </button>
          </div>
        </div>

        {showTrash ? (
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-(--color-ink-soft)">{wowLabel(mode, 'Papelera')} ({deletedTasks.length})</h2>
            {deletedTasks.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl text-(--color-ink-soft)">
                No hay tareas eliminadas.
              </div>
            ) : (
              deletedTasks.map((task) => (
                <div key={task.id} className={`p-4 rounded-2xl border flex items-center gap-4 ${cardClass}`}>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">{task.title}</h3>
                  </div>
                  <button onClick={() => restoreTask(task.id)} className="eb-btn-secondary px-4 py-2 text-sm">
                    <RotateCcw size={16} /> Restaurar
                  </button>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-(--color-ink-soft)">{wowLabel(mode, 'Pendientes')} ({pendingTasks.length})</h2>

            {pendingTasks.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-black/10 dark:border-white/10 rounded-2xl text-(--color-ink-soft)">
                No tienes tareas pendientes. ¡Añade una nueva!
              </div>
            ) : (
              pendingTasks.map((task) => {
                const urgency = dueUrgency(task);
                const expanded = expandedId === task.id;
                return (
                  <div
                    key={task.id}
                    className={`rounded-2xl border transition-all ${cardClass}
                      ${activeTask?.id === task.id ? 'ring-2 ring-(--color-accent)/40' : ''}`}
                  >
                    <div className="p-4 flex items-center gap-4 cursor-pointer" onClick={() => setActiveTask(task)}>
                      <button onClick={(e) => { e.stopPropagation(); toggleStatus(task); }} className="text-(--color-ink-soft) hover:text-(--color-mint) transition-colors shrink-0">
                        <Circle size={28} strokeWidth={1.5} />
                      </button>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-lg truncate">{task.title}</h3>
                        <div className="flex items-center gap-3 text-sm mt-1 flex-wrap">
                          <span className={`eb-badge ${
                            task.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                            task.priority === 'MEDIUM' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400' :
                            'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'}
                            ${wow ? 'bg-black/20 text-white' : ''}`}>
                            {task.priority === 'HIGH' ? 'ALTA' : task.priority === 'MEDIUM' ? 'MEDIA' : 'BAJA'}
                          </span>
                          {task.dueDate && (
                            <span className={`eb-badge ${
                              urgency === 'overdue' ? 'bg-red-500/15 text-red-500' :
                              urgency === 'soon' ? 'bg-amber-500/15 text-amber-500' :
                              'bg-black/[0.04] dark:bg-white/10 text-(--color-ink-soft)'}`}>
                              {urgency && <AlertTriangle size={12} />} {formatDue(task.dueDate)}
                            </span>
                          )}
                          <span className={`flex items-center gap-1 font-medium ${wow ? 'text-white/80' : 'text-(--color-ink-soft)'}`}>
                            <Clock size={14} /> {task.completedPomodoros}/{task.estimatedPomodoros || '-'}
                          </span>
                        </div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); setExpandedId(expanded ? null : task.id); }} className="p-2 text-(--color-ink-soft)">
                        {expanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteTask(task.id); }} className="p-2 text-(--color-ink-soft) hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    </div>

                    {expanded && (
                      <div className="px-4 pb-4 pl-14 space-y-2" onClick={(e) => e.stopPropagation()}>
                        {task.subtasks?.map((st) => (
                          <div key={st.id} className="flex items-center gap-2 text-sm">
                            <button onClick={() => toggleSubtask(task.id, st.id)} className={st.done ? 'text-(--color-mint)' : 'text-(--color-ink-soft)'}>
                              {st.done ? <CheckCircle size={16} /> : <Circle size={16} />}
                            </button>
                            <span className={`flex-1 ${st.done ? 'line-through text-(--color-ink-soft)' : ''}`}>{st.title}</span>
                            <button onClick={() => deleteSubtask(task.id, st.id)} className="text-(--color-ink-soft) hover:text-red-500">
                              <X size={14} />
                            </button>
                          </div>
                        ))}
                        <form onSubmit={(e) => { e.preventDefault(); addSubtask(task.id); }} className="flex gap-2 pt-1">
                          <input
                            value={subtaskDraft}
                            onChange={(e) => setSubtaskDraft(e.target.value)}
                            placeholder="+ Subtarea"
                            className="eb-input py-2 text-sm flex-1"
                          />
                        </form>
                      </div>
                    )}
                  </div>
                );
              })
            )}

            {completedTasks.length > 0 && (
              <>
                <h2 className="text-lg font-semibold text-(--color-ink-soft) mt-8">{wowLabel(mode, 'Completadas')} ({completedTasks.length})</h2>
                {completedTasks.map((task) => (
                  <div key={task.id} className="p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-black/[0.02] dark:bg-white/[0.03] flex items-center gap-4 opacity-60 hover:opacity-100 transition-opacity">
                    <button onClick={() => toggleStatus(task)} className="text-(--color-mint) shrink-0">
                      <CheckCircle size={28} strokeWidth={1.5} />
                    </button>
                    <div className="flex-1 line-through text-(--color-ink-soft) min-w-0">
                      <h3 className="font-medium truncate">{task.title}</h3>
                    </div>
                    <button onClick={() => deleteTask(task.id)} className="p-2 text-(--color-ink-soft) hover:text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>

      <div className="w-full lg:w-[450px] flex flex-col gap-6 shrink-0">
        <div className="lg:sticky lg:top-0 pt-2 lg:pt-6">
          <h2 className="text-xl font-bold mb-4 line-clamp-2 leading-tight font-display">
            {activeTask ? `Enfocado en: ${activeTask.title}` : wowLabel(mode, 'Temporizador Pomodoro')}
          </h2>
          <PomodoroTimer taskId={activeTask?.id} />
        </div>
      </div>
    </div>
  );
};

export default Tasks;
