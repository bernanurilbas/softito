import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';
import { Compass, LogOut, UserPlus, LogIn, Sun, Moon } from 'lucide-react';

export default function Header() {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [theme, setTheme] = useState(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) return savedTheme;
    } catch {}
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    return prefersDark ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    try {
      localStorage.setItem('theme', theme);
    } catch {}
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition">
            <Compass className="h-8 w-8 animate-pulse" />
            <span className="font-extrabold text-2xl tracking-tight bg-gradient-to-r from-indigo-600 to-violet-600 dark:from-indigo-400 dark:to-violet-400 bg-clip-text text-transparent">
              SeyahatBilet
            </span>
          </Link>

          {/* Navigation and Auth status */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition">
              Anasayfa
            </Link>
            <Link to="/admin" className="text-sm font-medium text-slate-700 hover:text-indigo-600 dark:text-slate-300 dark:hover:text-indigo-400 transition">
              Bilet Yönetimi
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4 pl-4 border-l border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2 text-slate-800 dark:text-slate-200">
                  <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold uppercase">
                    {user?.name?.[0] || 'U'}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {user?.name} {user?.surname}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-1 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 px-3 h-9 rounded-lg transition"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Çıkış Yap</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2 pl-4 border-l border-slate-200 dark:border-slate-800">
                <Link
                  to="/login"
                  className="flex items-center space-x-1 text-sm font-medium text-slate-700 hover:text-indigo-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:text-indigo-400 dark:hover:bg-slate-800 px-3 h-9 rounded-lg transition"
                >
                  <LogIn className="h-4 w-4" />
                  <span>Giriş Yap</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 text-sm font-medium bg-indigo-600 dark:bg-indigo-500 text-white hover:bg-indigo-700 dark:hover:bg-indigo-600 px-4 h-9 rounded-lg shadow-sm hover:shadow transition"
                >
                  <UserPlus className="h-4 w-4" />
                  <span>Kayıt Ol</span>
                </Link>
              </div>
            )}

            {/* Dark Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-indigo-400 dark:hover:bg-slate-800 active:scale-90 transition-all cursor-pointer"
              title={theme === 'dark' ? 'Açık Tema' : 'Koyu Tema'}
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5 text-amber-500" />
              ) : (
                <Moon className="h-5 w-5 text-slate-600" />
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
