import { useEffect, useState } from 'react';
import { X, ArrowLeft, ArrowRight, SkipForward } from 'lucide-react';
import { useTour } from '../../context/TourContext';
import { useTheme } from '../../context/ThemeContext';
import { TOUR_STEPS } from '../../lib/tourSteps';

interface Rect { top: number; left: number; width: number; height: number; }

const PAD = 8;

const TourGuide = () => {
  const { isActive, stepIndex, totalSteps, next, prev, close, getNavRef } = useTour();
  const { mode } = useTheme();
  const wow = mode === 'wow';
  const [rect, setRect] = useState<Rect | null>(null);

  const step = TOUR_STEPS[stepIndex];

  useEffect(() => {
    if (!isActive) return;

    const measure = () => {
      // Spotlight is desktop-only — the sidebar is a hidden overlay on mobile, so
      // pointing at it shows the user nothing. Mobile uses a centered card instead.
      if (!window.matchMedia('(min-width: 768px)').matches) { setRect(null); return; }
      const el = getNavRef(step.path);
      if (!el) { setRect(null); return; }
      const r = el.getBoundingClientRect();
      setRect({ top: r.top, left: r.left, width: r.width, height: r.height });
    };

    measure();
    // Re-measure after the sidebar's slide-in transition (300ms) settles.
    const t = setTimeout(measure, 320);
    window.addEventListener('resize', measure);
    window.addEventListener('scroll', measure, true);
    return () => {
      clearTimeout(t);
      window.removeEventListener('resize', measure);
      window.removeEventListener('scroll', measure, true);
    };
  }, [isActive, step.path, getNavRef]);

  if (!isActive) return null;

  const Icon = step.icon;
  const title = wow ? step.wowTitle : step.title;
  const body = wow ? step.wowBody : step.body;
  const isLast = stepIndex === totalSteps - 1;

  const cardTone = wow
    ? 'bg-[#1E293B] text-slate-200 border-slate-700'
    : 'eb-card';

  const spotlightStyle = rect
    ? {
        top: rect.top - PAD,
        left: rect.left - PAD,
        width: rect.width + PAD * 2,
        height: rect.height + PAD * 2,
      }
    : null;

  return (
    <div className="fixed inset-0 z-[70]">
      {/* Mobile: plain dim + centered card (no sidebar spotlight — it's hidden on phones) */}
      <div className="md:hidden absolute inset-0 flex items-center justify-center p-5" style={{ background: 'rgba(0,0,0,0.7)' }}>
        <div className={`w-full max-w-sm p-6 rounded-3xl border shadow-2xl ${cardTone}`}>
          <TourCardContent
            Icon={Icon} title={title} body={body} wow={wow}
            stepIndex={stepIndex} totalSteps={totalSteps} isLast={isLast}
            onPrev={prev} onNext={next} onClose={close}
          />
        </div>
      </div>

      {/* Desktop: dimmed backdrop with a cutout around the highlighted nav item */}
      <div
        className="hidden md:block absolute inset-0 transition-all duration-300"
        style={spotlightStyle ? {
          top: spotlightStyle.top,
          left: spotlightStyle.left,
          width: spotlightStyle.width,
          height: spotlightStyle.height,
          borderRadius: 16,
          boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
          position: 'absolute',
        } : { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)' }}
      />
      {spotlightStyle && (
        <div
          className={`hidden md:block absolute rounded-2xl pointer-events-none ring-2 ${wow ? 'ring-[#F8B700]' : 'ring-(--color-accent)'} animate-pulse`}
          style={{ top: spotlightStyle.top, left: spotlightStyle.left, width: spotlightStyle.width, height: spotlightStyle.height }}
        />
      )}

      {/* Desktop: floating card near the highlighted item */}
      <div
        className={`hidden md:block fixed w-80 p-5 rounded-3xl border shadow-2xl ${cardTone}`}
        style={{
          top: rect ? Math.min(rect.top, window.innerHeight - 340) : window.innerHeight / 2 - 160,
          left: rect ? rect.left + rect.width + 20 : window.innerWidth / 2 - 160,
        }}
      >
        <TourCardContent
          Icon={Icon} title={title} body={body} wow={wow}
          stepIndex={stepIndex} totalSteps={totalSteps} isLast={isLast}
          onPrev={prev} onNext={next} onClose={close}
        />
      </div>
    </div>
  );
};

interface CardContentProps {
  Icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  body: string;
  wow: boolean;
  stepIndex: number;
  totalSteps: number;
  isLast: boolean;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
}

const TourCardContent = ({ Icon, title, body, wow, stepIndex, totalSteps, isLast, onPrev, onNext, onClose }: CardContentProps) => (
  <>
    <div className="flex items-start justify-between gap-3 mb-3">
      <div className={`p-2.5 rounded-xl shrink-0 ${wow ? 'bg-white/10 text-[#F8B700]' : 'bg-(--color-accent)/10 text-(--color-accent)'}`}>
        <Icon size={22} />
      </div>
      <button onClick={onClose} className="p-1.5 -mt-1 -mr-1 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors shrink-0" aria-label="Cerrar tour">
        <X size={18} />
      </button>
    </div>

    <h3 className={`text-lg font-bold mb-1.5 ${wow ? '' : 'font-display'}`}>{title}</h3>
    <p className={`text-sm leading-relaxed mb-5 ${wow ? 'text-slate-300' : 'text-(--color-ink-soft)'}`}>{body}</p>

    <div className="flex items-center justify-between gap-2">
      <div className="flex gap-1.5">
        {Array.from({ length: totalSteps }).map((_, i) => (
          <span
            key={i}
            className={`h-1.5 rounded-full transition-all ${i === stepIndex ? (wow ? 'w-5 bg-[#F8B700]' : 'w-5 bg-(--color-accent)') : 'w-1.5 bg-black/15 dark:bg-white/15'}`}
          />
        ))}
      </div>

      <div className="flex items-center gap-1.5">
        {stepIndex > 0 && (
          <button onClick={onPrev} className={`p-2 rounded-lg transition-colors ${wow ? 'hover:bg-white/10' : 'hover:bg-black/5 dark:hover:bg-white/10'}`} aria-label="Anterior">
            <ArrowLeft size={16} />
          </button>
        )}
        {!isLast ? (
          <button onClick={onNext} className="eb-btn-primary px-4 py-2 text-sm">
            Siguiente <ArrowRight size={14} />
          </button>
        ) : (
          <button onClick={onClose} className="eb-btn-primary px-4 py-2 text-sm">
            Listo
          </button>
        )}
      </div>
    </div>

    {!isLast && (
      <button onClick={onClose} className={`flex items-center gap-1 mt-3 text-xs font-medium mx-auto ${wow ? 'text-slate-400 hover:text-slate-200' : 'text-(--color-ink-soft) hover:text-(--color-ink)'}`}>
        <SkipForward size={12} /> Saltar tour
      </button>
    )}
  </>
);

export default TourGuide;
