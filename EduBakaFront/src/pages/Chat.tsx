import { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { Send, Bot, Sparkles } from 'lucide-react';
import ChatMessageText from '../components/chat/ChatMessageText';

const Chat = () => {
  const { messages, send, loading } = useChat();
  const [input, setInput] = useState('');

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    send(input);
    setInput('');
  };

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-8rem)]">
      <header className="mb-4">
        <h1 className="text-3xl font-bold font-display flex items-center gap-2">
          <Bot className="text-(--color-accent)" /> Chat
        </h1>
        <p className="text-(--color-ink-soft) mt-1 flex items-center gap-1 text-sm">
          <Sparkles size={14} /> Impulsado por Gemini, solo para preguntas breves.
        </p>
      </header>

      <div className="eb-card flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 && (
          <p className="text-center text-(--color-ink-soft) py-8">Pregúntame algo breve sobre tus estudios.</p>
        )}
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-wrap ${m.role === 'user' ? 'bg-(--color-accent) text-white' : 'bg-black/[0.04] dark:bg-white/10'}`}>
              <ChatMessageText text={m.text} />
            </div>
          </div>
        ))}
        {loading && <p className="text-sm text-(--color-ink-soft)">Pensando...</p>}
      </div>

      <form onSubmit={onSubmit} className="flex gap-2 mt-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu pregunta..."
          className="eb-input flex-1"
        />
        <button type="submit" disabled={loading} className="eb-btn-primary px-5">
          <Send size={18} />
        </button>
      </form>
    </div>
  );
};

export default Chat;
