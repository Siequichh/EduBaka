import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from 'react';
import api from '../api/axiosClient';

type Mode = 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK';

interface PersistedState {
  mode: Mode;
  isActive: boolean;
  endTimestamp: number | null; // epoch ms, meaningful only while isActive
  secondsLeft: number; // meaningful only while !isActive
  pomodorosCompleted: number;
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number;
  taskId?: number;
}

const STORAGE_KEY = 'edubaka_pomodoro_state';

const defaultState: PersistedState = {
  mode: 'FOCUS',
  isActive: false,
  endTimestamp: null,
  secondsLeft: 25 * 60,
  pomodorosCompleted: 0,
  focusTime: 25,
  shortBreakTime: 5,
  longBreakTime: 15,
  longBreakInterval: 4,
};

const loadState = (): PersistedState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultState;
    return { ...defaultState, ...JSON.parse(raw) };
  } catch {
    return defaultState;
  }
};

const secondsFor = (s: PersistedState, m: Mode = s.mode) => {
  switch (m) {
    case 'FOCUS': return s.focusTime * 60;
    case 'SHORT_BREAK': return s.shortBreakTime * 60;
    case 'LONG_BREAK': return s.longBreakTime * 60;
  }
};

interface PomodoroContextType {
  mode: Mode;
  isActive: boolean;
  timeLeft: number;
  pomodorosCompleted: number;
  focusTime: number;
  shortBreakTime: number;
  longBreakTime: number;
  longBreakInterval: number;
  toggleTimer: () => void;
  resetTimer: () => void;
  changeMode: (m: Mode) => void;
  setConfig: (cfg: Partial<Pick<PersistedState, 'focusTime' | 'shortBreakTime' | 'longBreakTime' | 'longBreakInterval'>>) => void;
  setTaskId: (id: number | undefined) => void;
}

const PomodoroContext = createContext<PomodoroContextType | undefined>(undefined);

export const PomodoroProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<PersistedState>(loadState);
  const [timeLeft, setTimeLeft] = useState(() => {
    const s = loadState();
    return s.isActive && s.endTimestamp ? Math.max(0, Math.round((s.endTimestamp - Date.now()) / 1000)) : s.secondsLeft;
  });
  const stateRef = useRef(state);
  stateRef.current = state;

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const logSession = async (finishedMode: Mode) => {
    const s = stateRef.current;
    const durationMinutes = secondsFor(s, finishedMode) / 60;
    try {
      await api.post('/pomodoros', {
        taskId: s.taskId,
        startTime: new Date(Date.now() - durationMinutes * 60000).toISOString(),
        endTime: new Date().toISOString(),
        durationMinutes,
        status: finishedMode,
      });
    } catch (err) {
      console.error('Error logging pomodoro', err);
    }
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(finishedMode === 'FOCUS' ? '¡Sesión de enfoque completada!' : 'Descanso terminado', {
        body: finishedMode === 'FOCUS' ? 'Hora de un descanso.' : 'Hora de volver a enfocarte.',
      });
    }
  };

  const complete = useCallback(() => {
    setState((prev) => {
      const finishedMode = prev.mode;
      logSession(finishedMode);
      if (finishedMode === 'FOCUS') {
        const newCount = prev.pomodorosCompleted + 1;
        const nextMode: Mode = newCount % prev.longBreakInterval === 0 ? 'LONG_BREAK' : 'SHORT_BREAK';
        return { ...prev, isActive: false, endTimestamp: null, pomodorosCompleted: newCount, mode: nextMode, secondsLeft: secondsFor(prev, nextMode) };
      }
      return { ...prev, isActive: false, endTimestamp: null, mode: 'FOCUS', secondsLeft: secondsFor(prev, 'FOCUS') };
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Tick every second while active; also handles catching up after a full page reload.
  useEffect(() => {
    if (!state.isActive || !state.endTimestamp) return;
    const tick = () => {
      const remaining = Math.max(0, Math.round((stateRef.current.endTimestamp! - Date.now()) / 1000));
      setTimeLeft(remaining);
      if (remaining <= 0) {
        complete();
      }
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [state.isActive, state.endTimestamp, complete]);

  useEffect(() => {
    if (!state.isActive) setTimeLeft(state.secondsLeft);
  }, [state.isActive, state.secondsLeft, state.mode]);

  const toggleTimer = useCallback(() => {
    setState((prev) => {
      if (prev.isActive) {
        const remaining = prev.endTimestamp ? Math.max(0, Math.round((prev.endTimestamp - Date.now()) / 1000)) : 0;
        return { ...prev, isActive: false, endTimestamp: null, secondsLeft: remaining };
      }
      const seconds = prev.secondsLeft > 0 ? prev.secondsLeft : secondsFor(prev);
      return { ...prev, isActive: true, endTimestamp: Date.now() + seconds * 1000 };
    });
  }, []);

  const resetTimer = useCallback(() => {
    setState((prev) => ({ ...prev, isActive: false, endTimestamp: null, secondsLeft: secondsFor(prev) }));
  }, []);

  const changeMode = useCallback((m: Mode) => {
    setState((prev) => ({ ...prev, isActive: false, endTimestamp: null, mode: m, secondsLeft: secondsFor(prev, m) }));
  }, []);

  const setConfig = useCallback((cfg: Partial<Pick<PersistedState, 'focusTime' | 'shortBreakTime' | 'longBreakTime' | 'longBreakInterval'>>) => {
    setState((prev) => {
      const next = { ...prev, ...cfg };
      return prev.isActive ? next : { ...next, secondsLeft: secondsFor(next) };
    });
  }, []);

  const setTaskId = useCallback((id: number | undefined) => {
    setState((prev) => (prev.taskId === id ? prev : { ...prev, taskId: id }));
  }, []);

  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <PomodoroContext.Provider value={{
      mode: state.mode,
      isActive: state.isActive,
      timeLeft,
      pomodorosCompleted: state.pomodorosCompleted,
      focusTime: state.focusTime,
      shortBreakTime: state.shortBreakTime,
      longBreakTime: state.longBreakTime,
      longBreakInterval: state.longBreakInterval,
      toggleTimer,
      resetTimer,
      changeMode,
      setConfig,
      setTaskId,
    }}>
      {children}
    </PomodoroContext.Provider>
  );
};

export const usePomodoro = () => {
  const ctx = useContext(PomodoroContext);
  if (!ctx) throw new Error('usePomodoro must be used within a PomodoroProvider');
  return ctx;
};
