import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { TOUR_STEPS } from '../lib/tourSteps';

const SEEN_KEY = 'edubaka_tour_seen';

interface TourContextType {
  isActive: boolean;
  stepIndex: number;
  totalSteps: number;
  start: () => void;
  next: () => void;
  prev: () => void;
  close: () => void;
  startIfFirstVisit: () => void;
  registerNavRef: (path: string, el: HTMLElement | null) => void;
  getNavRef: (path: string) => HTMLElement | null;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export const TourProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const navRefs = useRef(new Map<string, HTMLElement>());
  const navigate = useNavigate();
  const location = useLocation();

  const goToStep = useCallback((index: number) => {
    setStepIndex(index);
    const step = TOUR_STEPS[index];
    if (step && location.pathname !== step.path) {
      navigate(step.path);
    }
  }, [navigate, location.pathname]);

  const start = useCallback(() => {
    setIsActive(true);
    goToStep(0);
  }, [goToStep]);

  const startIfFirstVisit = useCallback(() => {
    if (!localStorage.getItem(SEEN_KEY)) {
      start();
    }
  }, [start]);

  const close = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(SEEN_KEY, '1');
  }, []);

  const next = useCallback(() => {
    setStepIndex((prev) => {
      const nextIndex = prev + 1;
      if (nextIndex >= TOUR_STEPS.length) {
        setIsActive(false);
        localStorage.setItem(SEEN_KEY, '1');
        return prev;
      }
      goToStep(nextIndex);
      return nextIndex;
    });
  }, [goToStep]);

  const prev = useCallback(() => {
    setStepIndex((current) => {
      const prevIndex = Math.max(0, current - 1);
      goToStep(prevIndex);
      return prevIndex;
    });
  }, [goToStep]);

  const registerNavRef = useCallback((path: string, el: HTMLElement | null) => {
    if (el) navRefs.current.set(path, el);
    else navRefs.current.delete(path);
  }, []);

  const getNavRef = useCallback((path: string) => navRefs.current.get(path) ?? null, []);

  return (
    <TourContext.Provider value={{
      isActive, stepIndex, totalSteps: TOUR_STEPS.length,
      start, next, prev, close, startIfFirstVisit,
      registerNavRef, getNavRef,
    }}>
      {children}
    </TourContext.Provider>
  );
};

export const useTour = () => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error('useTour must be used within a TourProvider');
  return ctx;
};
