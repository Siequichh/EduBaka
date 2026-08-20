import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

interface Course { id: number; name: string; color: string; }
interface Exam {
  id: number; courseId: number; courseName: string; title: string;
  examType: 'PARCIAL' | 'FINAL' | 'PRACTICA' | 'OTRO'; examDate: string; notes: string;
}

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const EXAM_TYPE_LABEL: Record<Exam['examType'], string> = { PARCIAL: 'Parcial', FINAL: 'Final', PRACTICA: 'Práctica', OTRO: 'Otro' };

const dateKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const emptyForm = { title: '', courseId: '', examType: 'PARCIAL' as Exam['examType'], examDate: '', notes: '' };

const Calendar = () => {
  const [cursor, setCursor] = useState(new Date());
  const [exams, setExams] = useState<Exam[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    api.get('/exams').then((res) => setExams(res.data));
    api.get('/courses').then((res) => setCourses(res.data));
  }, []);

  const courseColor = (courseId: number) => courses.find((c) => c.id === courseId)?.color || '#94A3B8';

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = (firstDay.getDay() + 6) % 7;
  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  const examsByDay = (d: Date) => exams.filter((e) => dateKey(new Date(e.examDate)) === dateKey(d));

  const openDay = (d: Date) => {
    setSelectedDay(d);
    setShowForm(false);
    setForm({ ...emptyForm, examDate: `${dateKey(d)}T09:00` });
  };

  const submitExam = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.post('/exams', {
      title: form.title,
      courseId: Number(form.courseId),
      examType: form.examType,
      examDate: new Date(form.examDate).toISOString(),
      notes: form.notes,
    });
    setExams((prev) => [...prev, res.data]);
    setShowForm(false);
  };

  const deleteExam = async (id: number) => {
    await api.delete(`/exams/${id}`);
    setExams((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold font-display">Calendario</h1>
        <p className="text-(--color-ink-soft) mt-1">Tus exámenes del ciclo, organizados por curso.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-6">
        <div className="eb-card p-6 flex-1">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCursor(new Date(year, month - 1, 1))} className="p-2 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/10">
              <ChevronLeft size={18} />
            </button>
            <h2 className="font-bold font-display capitalize">{cursor.toLocaleDateString('es-PE', { month: 'long', year: 'numeric' })}</h2>
            <button onClick={() => setCursor(new Date(year, month + 1, 1))} className="p-2 rounded-lg hover:bg-black/[0.03] dark:hover:bg-white/10">
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-(--color-ink-soft) mb-2">
            {WEEKDAYS.map((d) => <div key={d}>{d}</div>)}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: leadingBlanks }).map((_, i) => <div key={`b${i}`} />)}
            {days.map((day) => {
              const dayExams = examsByDay(day);
              const isToday = dateKey(day) === dateKey(new Date());
              const isSelected = selectedDay && dateKey(day) === dateKey(selectedDay);
              return (
                <button
                  key={day.toISOString()}
                  onClick={() => openDay(day)}
                  className={`aspect-square rounded-xl flex flex-col items-center justify-center gap-1 text-sm font-medium transition-colors
                    ${isSelected ? 'bg-(--color-accent)/15' : 'hover:bg-black/[0.03] dark:hover:bg-white/5'}
                    ${isToday ? 'ring-2 ring-(--color-accent)/50' : ''}`}
                >
                  {day.getDate()}
                  <div className="flex gap-0.5">
                    {dayExams.slice(0, 3).map((e) => (
                      <span key={e.id} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: courseColor(e.courseId) }} />
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0">
          {selectedDay ? (
            <div className="eb-card p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold font-display capitalize">{selectedDay.toLocaleDateString('es-PE', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                <button onClick={() => setShowForm((s) => !s)} className="p-2 rounded-lg bg-(--color-accent)/10 text-(--color-accent)">
                  {showForm ? <X size={16} /> : <Plus size={16} />}
                </button>
              </div>

              {showForm && (
                <form onSubmit={submitExam} className="space-y-3">
                  <input required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Título del examen" className="eb-input" />
                  <select required value={form.courseId} onChange={(e) => setForm({ ...form, courseId: e.target.value })} className="eb-input">
                    <option value="" disabled>Curso</option>
                    {courses.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select value={form.examType} onChange={(e) => setForm({ ...form, examType: e.target.value as Exam['examType'] })} className="eb-input">
                    {Object.entries(EXAM_TYPE_LABEL).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                  <input required type="datetime-local" value={form.examDate} onChange={(e) => setForm({ ...form, examDate: e.target.value })} className="eb-input" />
                  <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Notas (opcional)" className="eb-input" rows={2} />
                  <button type="submit" className="eb-btn-primary w-full py-2.5">Agregar examen</button>
                </form>
              )}

              <div className="space-y-2">
                {examsByDay(selectedDay).length === 0 && !showForm && (
                  <p className="text-sm text-(--color-ink-soft) text-center py-4">Sin exámenes este día.</p>
                )}
                {examsByDay(selectedDay).map((e) => (
                  <div key={e.id} className="p-3 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] flex items-center gap-3">
                    <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: courseColor(e.courseId) }} />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold truncate">{e.title}</p>
                      <p className="text-xs text-(--color-ink-soft)">{e.courseName} · {EXAM_TYPE_LABEL[e.examType]}</p>
                    </div>
                    <button onClick={() => deleteExam(e.id)} className="text-(--color-ink-soft) hover:text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="eb-card p-8 text-center text-(--color-ink-soft)">
              Selecciona un día para ver o agregar exámenes.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Calendar;
