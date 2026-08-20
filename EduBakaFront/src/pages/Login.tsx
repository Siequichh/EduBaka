import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { API_ORIGIN } from '../api/config';
import api from '../api/axiosClient';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [searchParams] = useSearchParams();
  const [error, setError] = useState(searchParams.get('error') || '');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { mode } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await api.post('/auth/login', { email, password });
      const user = {
        email: res.data.email,
        fullName: res.data.fullName,
        role: res.data.role
      };
      login(res.data.accessToken, user);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Credenciales inválidas');
    } finally {
      setIsLoading(false);
    }
  };

  if (mode === 'wow') {
    return (
      <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="relative z-10 w-full max-w-md p-10 rounded-[2rem] shadow-2xl backdrop-blur-xl border bg-white/10 border-white/20 text-white">
          <LoginForm
            email={email} setEmail={setEmail}
            password={password} setPassword={setPassword}
            error={error} isLoading={isLoading}
            onSubmit={handleSubmit}
            onGoogle={() => { setIsLoading(true); window.location.href = `${API_ORIGIN}/oauth2/authorization/google`; }}
            wow
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden bg-(--color-paper) dark:bg-(--color-paper-dark)">
      {/* Graph-paper texture + warm accent glow, replacing the generic blurred blobs */}
      <div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.12]"
        style={{
          backgroundImage: 'radial-gradient(circle, rgba(34,30,26,0.35) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />
      <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] rounded-full bg-(--color-accent)/25 blur-3xl" />
      <div className="absolute -bottom-32 -right-24 w-[28rem] h-[28rem] rounded-full bg-(--color-violet)/20 blur-3xl" />

      <div className="relative z-10 w-full max-w-md mx-4 p-10 eb-card">
        <LoginForm
          email={email} setEmail={setEmail}
          password={password} setPassword={setPassword}
          error={error} isLoading={isLoading}
          onSubmit={handleSubmit}
          onGoogle={() => { setIsLoading(true); window.location.href = `${API_ORIGIN}/oauth2/authorization/google`; }}
        />
      </div>
    </div>
  );
};

interface LoginFormProps {
  email: string; setEmail: (v: string) => void;
  password: string; setPassword: (v: string) => void;
  error: string; isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onGoogle: () => void;
  wow?: boolean;
}

const LoginForm = ({ email, setEmail, password, setPassword, error, isLoading, onSubmit, onGoogle, wow }: LoginFormProps) => (
  <>
    <div className="text-center mb-8">
      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 shadow-lg ${wow ? 'bg-white/20 text-white' : 'bg-(--color-accent) text-white rotate-3'}`}>
        <GraduationCap size={30} />
      </div>
      <h2 className={`text-3xl font-bold tracking-tight mb-2 ${wow ? '' : 'font-display'}`}>Bienvenido a EduBaka</h2>
      {!wow && (
        <svg className="mx-auto -mt-1 mb-2" width="120" height="8" viewBox="0 0 120 8" fill="none">
          <path d="M2 5.5C20 2 40 2 60 4.5C80 7 100 3 118 2.5" stroke="var(--color-accent)" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      <p className={wow ? 'text-white/70' : 'text-(--color-ink-soft)'}>
        Inicia sesión para gestionar tus estudios
      </p>
    </div>

    {error && (
      <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/40 text-red-500 dark:text-red-300 text-sm text-center">
        {error}
      </div>
    )}

    <form onSubmit={onSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Correo electrónico"
        className={wow ? 'premium-input' : 'eb-input'}
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
        className={wow ? 'premium-input' : 'eb-input'}
        required
      />

      <button
        type="submit"
        disabled={isLoading}
        className={wow
          ? 'w-full py-4 rounded-xl font-bold text-lg tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-lg bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-blue-500/25'
          : 'eb-btn-primary w-full py-3.5 text-lg mt-2'}
      >
        {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
      </button>
    </form>

    <div className="my-8 flex items-center">
      <div className={`flex-1 h-px ${wow ? 'bg-white/20' : 'bg-black/10 dark:bg-white/10'}`}></div>
      <span className={`px-4 text-sm font-medium ${wow ? 'text-white/50' : 'text-(--color-ink-soft)'}`}>O continuar con</span>
      <div className={`flex-1 h-px ${wow ? 'bg-white/20' : 'bg-black/10 dark:bg-white/10'}`}></div>
    </div>

    <button
      onClick={onGoogle}
      disabled={isLoading}
      type="button"
      className={wow
        ? 'w-full flex items-center justify-center gap-3 py-4 rounded-xl font-medium transition-all hover:scale-[1.02] active:scale-95 shadow-md bg-white/10 hover:bg-white/20 text-white border border-white/20'
        : `eb-btn-secondary w-full py-3.5 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <GoogleIcon />
      Google
    </button>

    <p className={`mt-8 text-center text-sm ${wow ? 'text-white/70' : 'text-(--color-ink-soft)'}`}>
      ¿No tienes una cuenta?{' '}
      <Link to="/register" className={`font-semibold hover:underline ${wow ? 'text-white' : 'text-(--color-accent)'}`}>
        Regístrate aquí
      </Link>
    </p>
  </>
);

const GoogleIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
  </svg>
);

export default Login;
