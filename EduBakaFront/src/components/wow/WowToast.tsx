import { useEffect, useState } from 'react';
import { Scroll } from 'lucide-react';
import { WOW_QUOTES } from '../../lib/wowQuotes';

interface ToastItem { id: number; text: string; }

const FIRE_INTERVAL_MS = 4 * 60 * 1000;
const FIRST_DELAY_MS = 15 * 1000;
const VISIBLE_MS = 8 * 1000;

const WowToast = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  useEffect(() => {
    const fire = () => {
      const text = WOW_QUOTES[Math.floor(Math.random() * WOW_QUOTES.length)];
      const id = Date.now();
      setToasts((prev) => [...prev.slice(-1), { id, text }]);
      setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), VISIBLE_MS);
    };
    const first = setTimeout(fire, FIRST_DELAY_MS);
    const interval = setInterval(fire, FIRE_INTERVAL_MS);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 left-6 z-50 space-y-2 max-w-xs">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="wow-toast flex items-start gap-2 p-4 rounded-xl bg-[#1a1310] border border-[#F8B700]/40 text-[#F3E5D8] shadow-2xl"
        >
          <Scroll size={18} className="shrink-0 text-[#F8B700] mt-0.5" />
          <p className="text-sm italic">{t.text}</p>
        </div>
      ))}
    </div>
  );
};

export default WowToast;
