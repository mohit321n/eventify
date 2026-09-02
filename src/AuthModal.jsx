import { useState } from 'react';
import { X, Lock, Mail, User, ArrowLeft, KeyRound, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

function AuthModal({ isOpen, onClose, onLogin }) {
  const [view, setView] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const API_URL = 'http://localhost:5000/api/auth';

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setError('');
    setResetSent(false);
  };

  const handleClose = () => {
    resetForm();
    setView('login');
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (view === 'forgot') {
        const res = await fetch(`${API_URL}/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        setResetSent(true);
        toast.success('Reset link sent to your email!');
      } else if (view === 'signup') {
        const res = await fetch(`${API_URL}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        
        toast.success(`Welcome to Eventify, ${data.user.name}! 🎉`);
        localStorage.setItem('eventify_token', data.token);
        onLogin(data.user);
        handleClose();
      } else if (view === 'login') {
        const res = await fetch(`${API_URL}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);

        toast.success(`Welcome back, ${data.user.name}! 👋`);
        localStorage.setItem('eventify_token', data.token);
        onLogin(data.user);
        handleClose();
      }
    } catch (err) {
      setError(err.message || 'Something went wrong');
      toast.error(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm" onClick={handleClose}>
      <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-3xl p-6 shadow-2xl border border-slate-100 dark:border-slate-700 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={handleClose} className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
          <X className="w-5 h-5" />
        </button>

        {view !== 'login' && (
          <button onClick={() => { setView('login'); setError(''); setResetSent(false); }} className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white cursor-pointer">
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}

        <div className="text-center mb-6 mt-2">
          <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
            {view === 'forgot' ? <KeyRound className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white">
            {view === 'login' && 'Welcome Back'}
            {view === 'signup' && 'Create Your Account'}
            {view === 'forgot' && 'Reset Password'}
          </h3>
        </div>

        {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-xl font-semibold">{error}</div>}

        {view === 'forgot' && resetSent ? (
          <div className="space-y-4 text-center py-4">
            <div className="flex items-center justify-center gap-2 text-emerald-600 font-semibold text-sm">
              <CheckCircle className="w-5 h-5" />
              <span>Password reset link sent!</span>
            </div>
            <button onClick={() => setView('login')} className="w-full py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-xs cursor-pointer">
              Return to Sign In
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {view === 'signup' && (
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type="text" required placeholder="Jane Doe" value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none dark:text-white" />
                </div>
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                <input type="email" required placeholder="jane@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none dark:text-white" />
              </div>
            </div>

            {view !== 'forgot' && (
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-xs font-bold text-slate-500 uppercase">Password</label>
                  {view === 'login' && (
                    <button type="button" onClick={() => setView('forgot')} className="text-xs font-semibold text-indigo-600 hover:underline cursor-pointer">
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
                  <input type="password" required placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:outline-none dark:text-white" />
                </div>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all cursor-pointer">
              {loading ? 'Processing...' : view === 'login' ? 'Sign In' : view === 'signup' ? 'Create Account' : 'Send Reset Link'}
            </button>
          </form>
        )}

        <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700 text-center text-xs text-slate-500">
          {view === 'login' ? (
            <p>Don't have an account? <button onClick={() => setView('signup')} className="font-bold text-indigo-600 hover:underline cursor-pointer">Sign Up</button></p>
          ) : view === 'signup' ? (
            <p>Already have an account? <button onClick={() => setView('login')} className="font-bold text-indigo-600 hover:underline cursor-pointer">Sign In</button></p>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default AuthModal;