import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../app/store';
import { loginUser, clearError } from '../features/auth/authSlice';
import { Sparkles, Mail, Lock, AlertCircle, Loader } from 'lucide-react';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('admin@crm.com');
  const [password, setPassword] = useState('admin123');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { isAuthenticated, status, error } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    dispatch(loginUser({ email, password }));
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-slate-950 px-4 overflow-hidden">
      
      {/* Full-Screen Visual Background Image & Overlays */}
      <div className="absolute inset-0 z-0 select-none pointer-events-none">
        <img 
          src="/crm_login_bg.png" 
          alt="Vibrant CRM Dashboard Background" 
          className="w-full h-full object-cover opacity-55 filter blur-[2px]"
        />
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[1px]" />
        
        {/* Ambient glow spots */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/15 rounded-full blur-[140px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-indigo-500/15 rounded-full blur-[140px]" />
      </div>

      {/* Main Container (Centered login card) */}
      <div className="w-full max-w-md z-10 animate-slide-up">
        {/* Logo / Brand Name */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-purple-600/10 text-purple-400 mb-4 border border-purple-600/20">
            <Sparkles size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight mb-2">Antigravity CRM</h2>
          <p className="text-slate-400 text-sm">Giriş yapmak için e-posta ve şifrenizi girin</p>
        </div>

        {/* Glassmorphic Form Card */}
        <div className="glassmorphism rounded-2xl p-8 border border-white/10 shadow-2xl relative">
          <form id="login-form" onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div id="login-error-alert" className="flex items-center gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-sm animate-fade-in">
                <AlertCircle size={18} className="shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="email-input" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">E-Posta Adresi</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Mail size={18} />
                </span>
                <input
                  id="email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="isim@sirket.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <label htmlFor="password-input" className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Şifre</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-500">
                  <Lock size={18} />
                </span>
                <input
                  id="password-input"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-900/50 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-purple-600 transition-colors text-sm"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              id="submit-button"
              type="submit"
              disabled={status === 'loading'}
              className="w-full mt-4 flex items-center justify-center gap-2 py-3 rounded-xl bg-purple-600 text-white font-semibold hover:bg-purple-500 focus:outline-none active:scale-[0.98] transition-all cursor-pointer shadow-lg shadow-purple-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <Loader size={18} className="animate-spin" />
                  Giriş Yapılıyor...
                </>
              ) : (
                'Giriş Yap'
              )}
            </button>
          </form>
          
          <div className="mt-6 pt-6 border-t border-white/5 text-center">
            <span className="text-[11px] text-slate-500 block">
              Test Hesabı: <code className="bg-slate-900 text-purple-400 px-1.5 py-0.5 rounded text-[11px]">admin@crm.com</code> / <code className="bg-slate-900 text-purple-400 px-1.5 py-0.5 rounded text-[11px]">admin123</code>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
