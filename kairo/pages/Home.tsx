
import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Task } from '../types';

interface HomeProps {
  tasks: Task[];
}

const Home: React.FC<HomeProps> = ({ tasks }) => {
  const navigate = useNavigate();
  const today = new Date();
  
  const todayStr = useMemo(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const weekDays = useMemo(() => {
    const days = [];
    const labels = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    for (let i = -3; i <= 3; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);
      days.push({
        num: d.getDate(),
        label: labels[d.getDay()],
        isToday: i === 0
      });
    }
    return days;
  }, []);

  // Filtrar tareas que NO están completadas Y son para HOY
  const activeTasks = tasks.filter(task => !task.completed && task.date === todayStr).slice(0, 3);

  return (
    <div className="pb-40">
      <header className="p-6 flex justify-between items-center sticky top-0 bg-white/80 backdrop-blur-md z-10 transition-colors">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full border-2 border-blue-200 overflow-hidden">
            <img src="https://picsum.photos/seed/xabi/100/100" alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">En racha</p>
            <h1 className="text-xl font-black">¡Vamos, Xabi!</h1>
          </div>
        </div>
        <button className="w-11 h-11 rounded-full bg-white shadow-sm flex items-center justify-center text-slate-600 border border-slate-100">
          <span className="material-symbols-outlined text-slate-600">notifications</span>
        </button>
      </header>

      <section className="px-6 mb-8 overflow-x-auto hide-scrollbar flex gap-3">
        {weekDays.map((day, i) => (
          <div
            key={i}
            className={`min-w-[4.8rem] h-24 rounded-3xl flex flex-col items-center justify-center transition-all ${
              day.isToday
                ? 'bg-blue-500 text-white shadow-xl shadow-blue-100 scale-105'
                : 'bg-white border border-slate-100 text-slate-400'
            }`}
          >
            <span className="text-[9px] font-black uppercase mb-1 tracking-tighter">{day.label}</span>
            <span className="text-2xl font-black">{day.num}</span>
            {day.isToday && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
          </div>
        ))}
      </section>

      <section className="px-6 mb-8">
        <div className="bg-slate-900 rounded-[32px] p-8 text-white flex items-center gap-6 relative overflow-hidden">
          <div className="absolute -right-4 -bottom-4 opacity-10">
             <span className="material-symbols-outlined text-[120px]">bolt</span>
          </div>
          <div className="relative z-10">
            <h3 className="text-lg font-black mb-1">Nivel 5</h3>
            <p className="text-xs text-slate-400 mb-4">80% para el siguiente nivel</p>
            <div className="w-48 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-400 w-[80%]"></div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-black text-slate-800">Cositas de hoy</h3>
          <button 
            onClick={() => navigate('/tasks')}
            className="text-xs font-black text-blue-500 uppercase tracking-widest hover:text-blue-600 active:scale-95 transition-all"
          >
            Ver todo
          </button>
        </div>
        <div className="space-y-4">
          {activeTasks.length > 0 ? (
            activeTasks.map((task) => (
              <div key={task.id} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 transition-all">
                <div className={`w-1.5 h-10 rounded-full ${task.priority === 'high' ? 'bg-red-400' : 'bg-blue-300'}`}></div>
                <div className="flex-1">
                  <h4 className="font-bold text-slate-800">{task.title}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase">{task.time}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="py-12 text-center bg-white border border-dashed border-slate-200 rounded-[32px]">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-blue-500 text-3xl filled">weekend</span>
              </div>
              <p className="text-slate-800 font-black text-lg">Descansa guapo</p>
              <p className="text-slate-400 text-xs mt-1">Has completado todo por hoy.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
