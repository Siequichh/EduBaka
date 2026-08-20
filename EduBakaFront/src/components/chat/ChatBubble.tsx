import { useState } from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageCircle, X, Send } from 'lucide-react';
import ChatMessageText from './ChatMessageText';

const ChatBubble = () => {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const { messages, send, loading } = useChat();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
    setInput('');
  };

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-3 w-80 h-96 eb-card flex flex-col overflow-hidden shadow-2xl">
          <div className="px-4 py-3 border-b border-black/[0.06] dark:border-white/[0.08] flex items-center justify-between">
            <span className="font-semibold text-sm">Chat · impulsado por Gemini</span>
            <button onClick={() => setOpen(false)}><X size={16} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <p className="text-xs text-(--color-ink-soft) text-center py-6">Preguntas breves sobre tus estudios.</p>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3 py-2 rounded-xl text-xs ${m.role === 'user' ? 'bg-(--color-accent) text-white' : 'bg-black/[0.04] dark:bg-white/10'}`}>
                  <ChatMessageText text={m.text} />
                </div>
              </div>
            ))}
            {loading && <p className="text-xs text-(--color-ink-soft)">Pensando...</p>}
          </div>
          <form onSubmit={onSubmit} className="p-2 border-t border-black/[0.06] dark:border-white/[0.08] flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Pregunta breve..." className="eb-input py-2 text-sm flex-1" />
            <button type="submit" disabled={loading} className="eb-btn-primary px-3"><Send size={14} /></button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-14 h-14 rounded-full bg-(--color-accent) text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-transform"
      >
        {open ? <X size={22} /> : <MessageCircle size={22} />}
      </button>
    </div>
  );
};

export default ChatBubble;
