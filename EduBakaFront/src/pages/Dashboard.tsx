import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useTour } from '../context/TourContext';
import api from '../api/axiosClient';
import { Calendar, Book, CheckSquare, Activity, Sparkles } from 'lucide-react';
import { wowLabel } from '../lib/wowCopy';

const Dashboard = () => {
  const { user } = useAuth();
  const { mode } = useTheme();
  const { startIfFirstVisit } = useTour();

  useEffect(() => {
    startIfFirstVisit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [stats, setStats] = useState({
    upcomingExams: 0,
    activeCourses: 0,
    pendingTasks: 0
  });
  const [activities, setActivities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, coursesRes, tasksRes, activitiesRes] = await Promise.all([
          api.get('/exams/upcoming'),
          api.get('/courses'),
          api.get('/tasks'),
          api.get('/activities')
        ]);

        setStats({
          upcomingExams: examsRes.data.length,
          activeCourses: coursesRes.data.length,
          pendingTasks: tasksRes.data.filter((t: any) => t.status !== 'COMPLETED').length
        });
        
        setActivities(activitiesRes.data.slice(0, 5));
      } catch (error) {
        console.error("Error fetching dashboard data", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end">
        <div>
          <h1 className={`text-3xl font-bold ${mode === 'wow' ? '' : 'font-display'}`}>Hola, {user?.fullName?.split(' ')[0] || 'Estudiante'}! 👋</h1>
          <p className={mode === 'wow' ? 'text-gray-500 dark:text-gray-400 mt-1' : 'text-(--color-ink-soft) mt-1'}>
            Aquí tienes un resumen de tu ciclo académico.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className={`p-6 rounded-3xl transition-all hover:-translate-y-1 ${mode === 'wow' ? 'shadow-sm border bg-gradient-to-br from-red-500 to-orange-500 text-white border-transparent' : 'eb-card'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-semibold text-lg mb-1 ${mode === 'wow' ? 'opacity-90' : 'text-(--color-ink-soft)'}`}>{wowLabel(mode, 'Próximos Exámenes')}</h3>
              <p className="text-4xl font-bold">{stats.upcomingExams}</p>
            </div>
            <div className={`p-3 rounded-2xl ${mode === 'wow' ? 'bg-white/20' : 'bg-(--color-accent)/10 text-(--color-accent)'}`}>
              <Calendar size={24} />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-3xl transition-all hover:-translate-y-1 ${mode === 'wow' ? 'shadow-sm border bg-gradient-to-br from-blue-500 to-indigo-600 text-white border-transparent' : 'eb-card'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-semibold text-lg mb-1 ${mode === 'wow' ? 'opacity-90' : 'text-(--color-ink-soft)'}`}>{wowLabel(mode, 'Cursos Activos')}</h3>
              <p className="text-4xl font-bold">{stats.activeCourses}</p>
            </div>
            <div className={`p-3 rounded-2xl ${mode === 'wow' ? 'bg-white/20' : 'bg-(--color-violet)/10 text-(--color-violet)'}`}>
              <Book size={24} />
            </div>
          </div>
        </div>

        <div className={`p-6 rounded-3xl transition-all hover:-translate-y-1 ${mode === 'wow' ? 'shadow-sm border bg-gradient-to-br from-emerald-400 to-teal-500 text-white border-transparent' : 'eb-card'}`}>
          <div className="flex justify-between items-start">
            <div>
              <h3 className={`font-semibold text-lg mb-1 ${mode === 'wow' ? 'opacity-90' : 'text-(--color-ink-soft)'}`}>{wowLabel(mode, 'Tareas Pendientes')}</h3>
              <p className="text-4xl font-bold">{stats.pendingTasks}</p>
            </div>
            <div className={`p-3 rounded-2xl ${mode === 'wow' ? 'bg-white/20' : 'bg-(--color-mint)/10 text-(--color-mint)'}`}>
              <CheckSquare size={24} />
            </div>
          </div>
        </div>
      </div>

      <div className={`p-6 rounded-3xl ${mode === 'wow' ? 'shadow-sm border bg-white/60 dark:bg-gray-800/60 backdrop-blur-md border-transparent' : 'eb-card'}`}>
        <h2 className={`text-xl font-bold mb-6 flex items-center gap-2 ${mode === 'wow' ? '' : 'font-display'}`}>
          <Activity className={mode === 'wow' ? 'text-blue-500' : 'text-(--color-accent)'} />
          {wowLabel(mode, 'Actividad Reciente')}
        </h2>

        {activities.length === 0 ? (
          <div className="flex flex-col items-center text-center py-10 gap-3">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${mode === 'wow' ? 'bg-blue-500/10 text-blue-400' : 'bg-(--color-accent)/10 text-(--color-accent)'}`}>
              <Sparkles size={26} />
            </div>
            <p className={mode === 'wow' ? 'text-gray-500 font-medium' : 'text-(--color-ink-soft) font-medium'}>
              Aún no hay actividad registrada
            </p>
            <p className={`text-sm max-w-xs ${mode === 'wow' ? 'text-gray-500' : 'text-(--color-ink-soft)'}`}>
              Crea una tarea o completa una sesión de Pomodoro para empezar a construir tu racha de estudio.
            </p>
          </div>
        ) : (
          <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
            {activities.map((activity) => (
              <div key={activity.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-blue-500 text-slate-500 group-[.is-active]:text-blue-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  <CheckSquare size={16} />
                </div>
                
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
                  <div className="flex items-center justify-between space-x-2 mb-1">
                    <div className="font-bold text-slate-900 dark:text-slate-100">{activity.activityTypeLabel || activity.activityType}</div>
                    <time className="font-caveat font-medium text-indigo-500">{new Date(activity.createdAt).toLocaleDateString()}</time>
                  </div>
                  <div className="text-slate-500">{activity.description || 'Sin descripción'}</div>
                  {activity.pointsEarned > 0 && (
                    <div className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-amber-500 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                      +{activity.pointsEarned} pts
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Dashboard;
