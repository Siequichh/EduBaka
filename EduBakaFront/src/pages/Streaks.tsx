import { useEffect, useState } from 'react';
import api from '../api/axiosClient';
import { Flame, ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { wowLabel } from '../lib/wowCopy';

const WEEKDAYS = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const toKey = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

const Streaks = () => {
  const { mode } = useTheme();
  const [currentStreak, setCurrentStreak] = useState(0);
  const [activeDates, setActiveDates] = useState<Set<string>>(new Set());
  const [cursor, setCursor] = useState(new Date());

  useEffect(() => {
    api.get('/activities/streak').then((res) => {
      setCurrentStreak(res.data.currentStreak);
      setActiveDates(new Set<string>(res.data.activeDates));
    });
  }, []);

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstDay = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  // Monday-first offset
  const leadingBlanks = (firstDay.getDay() + 6) % 7;

  const days = Array.from({ length: daysInMonth }, (_, i) => new Date(year, month, i + 1));

  return (
    <div className="space-y-8 max-w-2xl">
      <header>
        <h1 className="text-3xl font-bold font-display">{wowLabel(mode, 'Rachas')}</h1>
        <p className="text-(--color-ink-soft) mt-1">Cada día que estudias suma un día más a tu racha.</p>
      </header>

      <div className="eb-card p-8 flex flex-col items-center gap-2">
        <div className="w-16 h-16 rounded-2xl bg-(--color-accent)/10 text-(--color-accent) flex items-center justify-center">
          <Flame size={32} />
        </div>
        <p className="text-5xl font-bold font-display">{currentStreak}</p>
        <p className="text-(--color-ink-soft) font-medium">{wowLabel(mode, currentStreak === 1 ? 'día seguido' : 'días seguidos')}</p>
      </div>

      <div className="eb-card p-6">
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
            const active = activeDates.has(toKey(day));
            const isToday = toKey(day) === toKey(new Date());
            return (
              <div
                key={day.toISOString()}
                className={`aspect-square rounded-xl flex items-center justify-center text-sm font-medium
                  ${active ? 'bg-(--color-accent)/15 text-(--color-accent)' : 'text-(--color-ink-soft)'}
                  ${isToday ? 'ring-2 ring-(--color-accent)/50' : ''}`}
              >
                {active ? <Flame size={16} /> : day.getDate()}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Streaks;
