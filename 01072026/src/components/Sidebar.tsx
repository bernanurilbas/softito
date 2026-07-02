import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { logout } from '../features/auth/authSlice';
import { toggleLocalDarkMode } from '../features/settings/settingsSlice';
import { 
  LayoutDashboard, 
  Users, 
  KanbanSquare, 
  CheckSquare, 
  Settings, 
  LogOut, 
  Sun, 
  Moon,
  Menu,
  X,
  Sparkles
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { config } = useSelector((state: RootState) => state.settings);
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const navItems = [
    { to: '/', label: 'Panel', icon: LayoutDashboard },
    { to: '/customers', label: 'Müşteriler', icon: Users },
    { to: '/deals', label: 'Satış Süreçleri', icon: KanbanSquare },
    { to: '/tasks', label: 'Görevler', icon: CheckSquare },
    { to: '/settings', label: 'Ayarlar', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Burger Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md text-slate-700 dark:text-slate-200 cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-slate-950 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand / Logo */}
        <div className="h-20 flex items-center px-6 border-b border-slate-900 gap-3">
          <div className="p-2 rounded-lg bg-purple-600 text-white flex items-center justify-center">
            <Sparkles size={20} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight text-white m-0 leading-none">Antigravity CRM</h1>
            <span className="text-[10px] text-purple-400 font-semibold tracking-wider uppercase">Mini CRM v1.0</span>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900'
                }`
              }
            >
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-900 space-y-4 bg-slate-950">
          {/* Theme Toggler & User Info */}
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-2">
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={user?.name}
                className="w-10 h-10 rounded-full border border-slate-800 object-cover"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-white truncate max-w-[120px] m-0">{user?.name}</p>
                <p className="text-[10px] text-slate-500 m-0">{user?.role}</p>
              </div>
            </div>
            
            <button
              onClick={() => dispatch(toggleLocalDarkMode())}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
              title={config.darkMode ? 'Açık Tema' : 'Koyu Tema'}
            >
              {config.darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-rose-500/30 text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 text-sm font-medium transition-colors cursor-pointer"
          >
            <LogOut size={16} />
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-xs lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
