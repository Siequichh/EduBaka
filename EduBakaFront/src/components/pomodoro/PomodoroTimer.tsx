import { useEffect, useState } from 'react';
import { Play, Square, Coffee, Settings2, X, Flame } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { usePomodoro } from '../../context/PomodoroContext';
import { wowLabel } from '../../lib/wowCopy';
import api from '../../api/axiosClient';

const PomodoroTimer = ({ taskId }: { taskId?: number }) => {
  const {
    mode, isActive, timeLeft, pomodorosCompleted,
    focusTime, shortBreakTime, longBreakTime, longBreakInterval,
    toggleTimer, resetTimer, changeMode, setConfig, setTaskId,
  } = usePomodoro();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [streak, setStreak] = useState<number | null>(null);
  const { mode: appMode } = useTheme();

  useEffect(() => {
    setTaskId(taskId);
  }, [taskId, setTaskId]);

  useEffect(() => {
    fetchStreak();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pomodorosCompleted]);

  const fetchStreak = async () => {
    const res = await api.get('/activities/streak');
    setStreak(res.data.currentStreak);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className={`relative p-8 rounded-3xl text-center shadow-lg transition-all duration-500
      ${appMode === 'wow'
        ? mode === 'FOCUS' ? 'bg-gradient-to-br from-red-500 to-orange-500 text-white border-none' : 'bg-gradient-to-br from-teal-400 to-blue-500 text-white border-none'
        : 'eb-card'
      }
    `}>
      <button
        onClick={() => setIsConfigOpen(!isConfigOpen)}
        className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
      >
        <Settings2 size={20} />
      </button>

      {streak !== null && (
        <div className={`absolute top-6 left-6 flex items-center gap-1 text-sm font-bold ${appMode === 'wow' ? 'text-white' : 'text-(--color-accent)'}`}>
          <Flame size={18} /> {streak}
        </div>
      )}

      {isConfigOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className={`relative w-full max-w-sm p-8 rounded-3xl shadow-2xl border flex flex-col justify-center ${appMode === 'wow' ? 'bg-[#1E293B] text-slate-200 border-slate-700' : 'eb-card'}`}>
            <button
              onClick={() => setIsConfigOpen(false)}
              className="absolute top-6 right-6 p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="text-xl font-bold mb-6 font-display">Configurar Tiempos</h3>

            <div className="space-y-4 text-left">
              <div>
                <label className="block text-sm font-medium mb-1">Enfoque (min)</label>
                <input type="number" min="1" max="120" value={focusTime} onChange={(e) => setConfig({ focusTime: Number(e.target.value) })} className="eb-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descanso Corto (min)</label>
                <input type="number" min="1" max="30" value={shortBreakTime} onChange={(e) => setConfig({ shortBreakTime: Number(e.target.value) })} className="eb-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Descanso Largo (min)</label>
                <input type="number" min="1" max="60" value={longBreakTime} onChange={(e) => setConfig({ longBreakTime: Number(e.target.value) })} className="eb-input" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Pomodoros antes de descanso largo</label>
                <input type="number" min="1" max="12" value={longBreakInterval} onChange={(e) => setConfig({ longBreakInterval: Number(e.target.value) })} className="eb-input" />
              </div>
            </div>
            <button onClick={() => setIsConfigOpen(false)} className="eb-btn-primary mt-8 py-3">
              Guardar
            </button>
          </div>
        </div>
      ) : null}

      <div className="flex justify-center gap-2 mb-8">
        <button onClick={() => changeMode('FOCUS')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-colors ${mode === 'FOCUS' ? 'bg-black/10 dark:bg-white/10 shadow-inner' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>{wowLabel(appMode, 'Enfoque')}</button>
        <button onClick={() => changeMode('SHORT_BREAK')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-colors ${mode === 'SHORT_BREAK' ? 'bg-black/10 dark:bg-white/10 shadow-inner' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>{wowLabel(appMode, 'Corto')}</button>
        <button onClick={() => changeMode('LONG_BREAK')} className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium text-xs sm:text-sm transition-colors ${mode === 'LONG_BREAK' ? 'bg-black/10 dark:bg-white/10 shadow-inner' : 'hover:bg-black/5 dark:hover:bg-white/5'}`}>{wowLabel(appMode, 'Largo')}</button>
      </div>

      <div className="text-7xl md:text-8xl font-bold mb-8 tabular-nums tracking-tighter drop-shadow-sm">
        {formatTime(timeLeft)}
      </div>

      <div className="flex justify-center gap-6">
        <button
          onClick={toggleTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-lg hover:scale-110 active:scale-95 transition-all
            ${appMode === 'wow' ? 'bg-white text-gray-900 shadow-white/20' : 'bg-(--color-accent) text-white'}
          `}
        >
          {isActive ? <Square size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
        </button>

        <button
          onClick={resetTimer}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-md hover:scale-110 active:scale-95 transition-all
            ${appMode === 'wow' ? 'bg-white/20 text-white hover:bg-white/30 backdrop-blur-sm' : 'bg-black/[0.04] dark:bg-white/10 text-(--color-ink-soft)'}
          `}
        >
          <Coffee size={24} />
        </button>
      </div>

      <div className="mt-8 text-sm opacity-80 font-medium">
        Pomodoros completados: {pomodorosCompleted}
      </div>
    </div>
  );
};

export default PomodoroTimer;
