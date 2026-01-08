
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const BottomNav: React.FC = () => {
  const location = useLocation();
  const active = location.pathname;

  const navItems = [
    { path: '/', label: 'Inicio', icon: 'home' },
    { path: '/tasks', label: 'Tareas', icon: 'checklist' },
    { path: '/habits', label: 'Habitos', icon: 'check_circle' },
    { path: '/achievements', label: 'Logros', icon: 'emoji_events' },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-slate-100 px-6 py-3 flex justify-between items-center safe-area-bottom lg:max-w-2xl lg:mx-auto lg:rounded-t-3xl lg:shadow-2xl transition-colors">
      {navItems.map((item) => {
        const isActive = active === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center gap-1 transition-all ${
              isActive ? 'text-blue-500' : 'text-slate-400 hover:text-blue-400'
            }`}
          >
            <span className={`material-symbols-outlined text-[26px] ${isActive ? 'filled' : ''}`}>
              {item.icon}
            </span>
            <span className={`text-[10px] font-bold ${isActive ? 'opacity-100' : 'opacity-70'}`}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
};

export default BottomNav;
