import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { LogOut, Plus, Trash2, Pencil, Check, Sparkles } from 'lucide-react';

const WOW_AVATARS = Array.from({ length: 6 }, (_, i) => `/avatars/wow/${i + 1}.svg`);
const ANIME_AVATARS = Array.from({ length: 6 }, (_, i) => `/avatars/anime/${i + 1}.svg`);

interface Cycle { id: number; name: string; }
interface Course {
  id: number; name: string; color: string;
  cycleId: number; cycleName: string; cycleStart: string; cycleEnd: string;
}

const emptyCourseForm = { name: '', color: '#ff5a36', cycleId: '', cycleStart: '', cycleEnd: '' };

const Settings = () => {
  const { user, logout, updateUser } = useAuth();
  const { theme, mode, toggleTheme, toggleMode } = useTheme();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [university, setUniversity] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [profileSaved, setProfileSaved] = useState(false);

  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [courseForm, setCourseForm] = useState(emptyCourseForm);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);

  useEffect(() => {
    api.get('/user/profile').then((res) => {
      setFullName(res.data.fullName || '');
      setUniversity(res.data.university || '');
      setAvatarUrl(res.data.avatarUrl || null);
    });
    api.get('/cycles').then((res) => setCycles(res.data));
    api.get('/courses').then((res) => setCourses(res.data));
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    await api.put('/user/profile', { fullName, avatarUrl, university });
    updateUser({ fullName, avatarUrl });
    setProfileSaved(true);
    setTimeout(() => setProfileSaved(false), 2000);
  };

  const submitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name: courseForm.name,
      color: courseForm.color,
      cycleId: Number(courseForm.cycleId),
      cycleStart: courseForm.cycleStart,
      cycleEnd: courseForm.cycleEnd,
    };
    if (editingCourseId) {
      const res = await api.put(`/courses/${editingCourseId}`, payload);
      setCourses((prev) => prev.map((c) => (c.id === editingCourseId ? res.data : c)));
    } else {
      const res = await api.post('/courses', payload);
      setCourses((prev) => [...prev, res.data]);
    }
    setCourseForm(emptyCourseForm);
    setEditingCourseId(null);
  };

  const editCourse = (course: Course) => {
    setEditingCourseId(course.id);
    setCourseForm({
      name: course.name,
      color: course.color,
      cycleId: String(course.cycleId),
      cycleStart: course.cycleStart,
      cycleEnd: course.cycleEnd,
    });
  };

  const deleteCourse = async (id: number) => {
    await api.delete(`/courses/${id}`);
    setCourses((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <header>
        <h1 className="text-3xl font-bold font-display">Configuración</h1>
        <p className="text-(--color-ink-soft) mt-1">Tu perfil, ciclo académico y cursos.</p>
      </header>

      {/* Profile */}
      <section className="eb-card p-6 space-y-5">
        <h2 className="text-xl font-bold font-display">Perfil</h2>

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden shrink-0 bg-(--color-accent) flex items-center justify-center text-white font-bold text-xl">
            {avatarUrl
              ? <img
                  src={avatarUrl}
                  alt={fullName || 'Tu avatar'}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarUrl(null)}
                />
              : (fullName.substring(0, 2).toUpperCase() || 'U')}
          </div>
          <button type="button" onClick={() => setAvatarUrl(null)} className="text-sm font-medium text-(--color-ink-soft) hover:text-(--color-accent)">
            Usar iniciales
          </button>
        </div>

        <AvatarGrid label="Avatares WoW" avatars={WOW_AVATARS} selected={avatarUrl} onSelect={setAvatarUrl} />
        <AvatarGrid label="Avatares Anime" avatars={ANIME_AVATARS} selected={avatarUrl} onSelect={setAvatarUrl} />

        <form onSubmit={saveProfile} className="space-y-3 pt-2">
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Nombre completo" className="eb-input" required />
          <input value={university} onChange={(e) => setUniversity(e.target.value)} placeholder="Universidad" className="eb-input" />
          <button type="submit" className="eb-btn-primary px-6 py-2.5">
            {profileSaved ? <><Check size={18} /> Guardado</> : 'Guardar perfil'}
          </button>
        </form>
      </section>

      {/* Courses / Cycle */}
      <section className="eb-card p-6 space-y-5">
        <h2 className="text-xl font-bold font-display">Ciclo académico y cursos</h2>

        <form onSubmit={submitCourse} className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <input
            value={courseForm.name}
            onChange={(e) => setCourseForm({ ...courseForm, name: e.target.value })}
            placeholder="Nombre del curso"
            className="eb-input sm:col-span-2"
            required
          />
          <select
            value={courseForm.cycleId}
            onChange={(e) => setCourseForm({ ...courseForm, cycleId: e.target.value })}
            className="eb-input"
            required
          >
            <option value="" disabled>Ciclo</option>
            {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={courseForm.color}
              onChange={(e) => setCourseForm({ ...courseForm, color: e.target.value })}
              className="h-[52px] w-16 rounded-2xl border border-black/10 dark:border-white/10 bg-transparent"
            />
            <span className="text-sm text-(--color-ink-soft)">Color del curso</span>
          </div>
          <label className="flex flex-col gap-1 text-sm text-(--color-ink-soft)">
            Inicio del ciclo
            <input type="date" value={courseForm.cycleStart} onChange={(e) => setCourseForm({ ...courseForm, cycleStart: e.target.value })} className="eb-input" required />
          </label>
          <label className="flex flex-col gap-1 text-sm text-(--color-ink-soft)">
            Fin del ciclo
            <input type="date" value={courseForm.cycleEnd} onChange={(e) => setCourseForm({ ...courseForm, cycleEnd: e.target.value })} className="eb-input" required />
          </label>
          <div className="sm:col-span-2 flex gap-2">
            <button type="submit" className="eb-btn-primary px-6 py-2.5">
              <Plus size={18} /> {editingCourseId ? 'Actualizar curso' : 'Agregar curso'}
            </button>
            {editingCourseId && (
              <button type="button" onClick={() => { setEditingCourseId(null); setCourseForm(emptyCourseForm); }} className="eb-btn-secondary px-6 py-2.5">
                Cancelar
              </button>
            )}
          </div>
        </form>

        <ul className="space-y-2">
          {courses.map((course) => (
            <li key={course.id} className="flex items-center justify-between p-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08]">
              <div className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full shrink-0" style={{ backgroundColor: course.color }} />
                <div>
                  <p className="font-semibold">{course.name}</p>
                  <p className="text-xs text-(--color-ink-soft)">{course.cycleName} · {course.cycleStart} a {course.cycleEnd}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => editCourse(course)} className="p-2 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/10 text-(--color-ink-soft)"><Pencil size={16} /></button>
                <button onClick={() => deleteCourse(course.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-red-500"><Trash2 size={16} /></button>
              </div>
            </li>
          ))}
          {courses.length === 0 && <p className="text-sm text-(--color-ink-soft) text-center py-4">Aún no tienes cursos registrados.</p>}
        </ul>
      </section>

      {/* Preferences */}
      <section className="eb-card p-6 space-y-3">
        <h2 className="text-xl font-bold font-display">Preferencias</h2>
        <button onClick={toggleTheme} className="w-full text-left eb-input flex items-center justify-between">
          <span>Tema</span>
          <span className="font-semibold">{theme === 'light' ? 'Claro' : 'Oscuro'}</span>
        </button>
        <button onClick={toggleMode} className="w-full text-left eb-input flex items-center justify-between">
          <span>Modo WoW</span>
          {mode === 'wow' ? <Sparkles size={18} className="text-(--color-accent)" /> : <span className="text-(--color-ink-soft)">Desactivado</span>}
        </button>
        <button onClick={logout} className="eb-btn-secondary w-full py-3 text-red-500">
          <LogOut size={18} /> Cerrar sesión
        </button>
      </section>
    </div>
  );
};

const AvatarGrid = ({ label, avatars, selected, onSelect }: { label: string; avatars: string[]; selected: string | null; onSelect: (url: string) => void }) => (
  <div>
    <p className="text-sm font-medium text-(--color-ink-soft) mb-2">{label}</p>
    <div className="flex flex-wrap gap-2">
      {avatars.map((url) => (
        <button
          key={url}
          type="button"
          onClick={() => onSelect(url)}
          className={`w-12 h-12 rounded-full overflow-hidden border-2 transition-all ${selected === url ? 'border-(--color-accent) scale-110' : 'border-transparent hover:border-black/10 dark:hover:border-white/20'}`}
        >
          <img src={url} alt={`Avatar ${label} ${url.split('/').pop()?.replace(/\.\w+$/, '')}`} className="w-full h-full object-cover" />
        </button>
      ))}
    </div>
  </div>
);

export default Settings;
