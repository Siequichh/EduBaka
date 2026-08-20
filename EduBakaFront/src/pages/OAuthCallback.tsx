import { useEffect, useRef, useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const OAuthCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [error, setError] = useState<string | null>(null);
  // Guards against this effect re-running (StrictMode double-invoke, or a
  // stale-closure re-fire) after we've already handled the redirect once -
  // without it, a second pass could re-navigate or the fallback timer below
  // could show a false failure after a real success.
  const handledRef = useRef(false);

  useEffect(() => {
    if (handledRef.current) return;

    const oauthError = searchParams.get('error');
    if (oauthError) {
      handledRef.current = true;
      setError(oauthError);
      return;
    }

    const token = searchParams.get('token');
    if (!token) {
      handledRef.current = true;
      navigate('/login?error=NoToken');
      return;
    }

    const email = searchParams.get('email');
    const fullName = searchParams.get('fullName');
    const role = searchParams.get('role');

    try {
      if (email && fullName && role) {
        login(token, { email, fullName, role });
      } else {
        // Fallback for older backend responses that only send the token.
        const decoded: any = jwtDecode(token);
        login(token, {
          email: decoded.sub,
          fullName: decoded.fullName || decoded.sub,
          role: decoded.role || 'USER'
        });
      }
      handledRef.current = true;
      navigate('/dashboard');
    } catch (err) {
      console.error('Token decoding failed', err);
      handledRef.current = true;
      navigate('/login?error=InvalidToken');
    }
  }, [searchParams, navigate, login]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!handledRef.current) {
        setError('No se pudo completar el inicio de sesión.');
      }
    }, 8000);
    return () => clearTimeout(timeout);
  }, []);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-(--color-paper) dark:bg-(--color-paper-dark) px-4">
        <div className="eb-card p-8 max-w-sm text-center space-y-4">
          <p className="text-(--color-ink) dark:text-(--color-ink-light) font-medium">{error}</p>
          <Link to="/login" className="eb-btn-primary inline-flex px-6 py-2.5">Volver a iniciar sesión</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-(--color-accent)"></div>
    </div>
  );
};

export default OAuthCallback;
