import { useState } from 'react';
import api from '../api/axiosClient';

export interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
}

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const send = async (text: string) => {
    if (!text.trim()) return;
    const history = messages.map((m) => ({ role: m.role === 'assistant' ? 'model' : 'user', text: m.text }));
    setMessages((prev) => [...prev, { role: 'user', text }]);
    setLoading(true);
    try {
      const res = await api.post('/chat', { message: text, history });
      setMessages((prev) => [...prev, { role: 'assistant', text: res.data.reply }]);
    } catch (err: any) {
      const reply = err.response?.data?.message || 'No se pudo obtener respuesta, intenta de nuevo.';
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } finally {
      setLoading(false);
    }
  };

  return { messages, send, loading };
};
