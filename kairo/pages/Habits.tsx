
import React, { useState, useMemo } from 'react';
import { Habit } from '../types';

interface HabitsProps {
  habits: Habit[];
  setHabits: React.Dispatch<React.SetStateAction<Habit[]>>;
}

const MOTIVATIONAL_PHRASES = [
  "Seria decepcionante si fallas",
  "Recuerda por que empezaste este habito",
  "Tu puedes va!"
];

const Habits: React.FC<HabitsProps> = ({ habits, setHabits }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState<Habit | null>(null);

  const [newName, setNewName] = useState('');
  const [newGoal, setNewGoal] = useState('');
  const [newCategory, setNewCategory] = useState('Salud');

  const todayDate = new Date();
  const todayStr = todayDate.toISOString().split('T')[0];

  const last7Days = useMemo(() => {
    const dates = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dates.push({
        full: d.toISOString().split('T')[0],
        dayNum: d.getDate()
      });
    }
    return dates;
  }, []);

  const randomPhrase = useMemo(() => {
    return MOTIVATIONAL_PHRASES[Math.floor(Math.random() * MOTIVATIONAL_PHRASES.length)];
  }, [selectedHabit]);

  const calculateStrictStreak = (history: Record<string, boolean>) => {
    let streak = 0;
    let checkDate = new Date();
    if (!history[todayStr]) {
      checkDate.setDate(checkDate.getDate() - 1);
    }
    while (true) {
      const dateKey = checkDate.toISOString().split('T')[0];
      if (history[dateKey]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
    return streak;
  };

  const toggleTodayHabit = (habitId: string) => {
    setHabits(prev => prev.map(h => {
      if (h.id === habitId) {
        const currentlyDone = !!h.history[todayStr];
        const newHistory = { ...h.history, [todayStr]: !currentlyDone };
        return { 
          ...h, 
          history: newHistory, 
          streak: calculateStrictStreak(newHistory) 
        };
      }
      return h;
    }));
  };

  const deleteHabit = (habitId: string) => {
    if (window.confirm('¿Seguro que quieres borrar este hábito? Perderás todo el progreso.')) {
      setHabits(prev => prev.filter(h => h.id !== habitId));
    }
  };

  const addHabit = () => {
    if (!newName || !newGoal) return;
    const newHabit: Habit = {
      id: Math.random().toString(36).substr(2, 9),
      name: newName,
      goal: newGoal,
      icon: newCategory === 'Salud' ? 'favorite' : newCategory === 'Mental' ? 'psychology' : 'bolt',
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
      history: {},
      streak: 0,
      startDate: todayStr
    };
    setHabits([newHabit, ...habits]);
    setIsModalOpen(false);
    setNewName('');
    setNewGoal('');
  };

  return (
    <div className="pb-44">
      <header className="p-6">
        <h1 className="text-3xl font-black tracking-tight mb-1 text-slate-900">Habitos</h1>
        <p className="text-slate-500 font-medium">No rompas la cadena, Xabi.</p>
      </header>

      <div className="px-6 space-y-4">
        {habits.map((habit) => (
          <div 
            key={habit.id} 
            className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-sm active:scale-[0.98] transition-all cursor-pointer group relative" 
            onClick={() => setSelectedHabit(habit)}
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className={`w-14 h-14 rounded-2xl ${habit.bgColor} ${habit.color} flex items-center justify-center`}>
                  <span className="material-symbols-outlined text-2xl filled">{habit.icon}</span>
                </div>
                <div>
                  <h3 className="font-black text-slate-800">{habit.name}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{habit.goal}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHabit(habit.id);
                  }}
                  className="w-10 h-10 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all lg:opacity-0 group-hover:opacity-100"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
                <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-2xl ${habit.streak > 0 ? 'bg-orange-50 text-orange-500 border border-orange-100' : 'bg-slate-50 text-slate-300 border border-slate-100'}`}>
                  <span className={`material-symbols-outlined text-xl ${habit.streak > 0 ? 'filled animate-pulse' : ''}`}>local_fire_department</span>
                  <span className="text-sm font-black">{habit.streak}</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between gap-2">
              {last7Days.map((dateObj) => {
                const isToday = dateObj.full === todayStr;
                const completed = !!habit.history[dateObj.full];
                return (
                  <button 
                    key={dateObj.full} 
                    disabled={!isToday} 
                    onClick={(e) => { 
                      e.stopPropagation(); 
                      if (isToday) toggleTodayHabit(habit.id); 
                    }} 
                    className={`flex-1 h-12 rounded-xl flex flex-col items-center justify-center transition-all ${
                      completed 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : isToday 
                          ? 'bg-blue-50 text-blue-500 border-2 border-blue-200' 
                          : 'bg-slate-50 text-slate-300 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <span className="text-[9px] font-black mb-1">{dateObj.dayNum}</span>
                    <span className="material-symbols-outlined text-[14px]">{completed ? 'check_circle' : isToday ? 'radio_button_checked' : 'lock'}</span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        {habits.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <span className="material-symbols-outlined text-4xl">emoji_flags</span>
            </div>
            <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Añade tu primer hábito</p>
          </div>
        )}
      </div>

      <button onClick={() => setIsModalOpen(true)} className="fixed bottom-28 right-6 w-16 h-16 bg-slate-900 rounded-[24px] shadow-2xl text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40">
        <span className="material-symbols-outlined text-3xl font-bold">add</span>
      </button>

      {selectedHabit && (
        <div className="fixed inset-0 z-[100] bg-white animate-in slide-in-from-right duration-300 flex flex-col">
          <header className="p-6 flex items-center justify-between border-b border-slate-100">
            <button onClick={() => setSelectedHabit(null)} className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors text-slate-600">
              <span className="material-symbols-outlined">arrow_back</span>
            </button>
            <h2 className="font-black text-xl text-slate-900">{selectedHabit.name}</h2>
            <button onClick={() => setSelectedHabit(null)} className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400"><span className="material-symbols-outlined text-sm">close</span></button>
          </header>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 p-6 rounded-[32px] text-center border border-blue-100">
                <p className="text-[10px] font-black text-blue-400 uppercase mb-1 tracking-widest">Racha Actual</p>
                <p className="text-3xl font-black text-blue-600">{selectedHabit.streak} días</p>
              </div>
              <div className="bg-slate-900 p-6 rounded-[32px] text-center shadow-xl">
                <p className="text-[10px] font-black text-slate-400 uppercase mb-1 tracking-widest">Total Días</p>
                <p className="text-3xl font-black text-white">{Object.values(selectedHabit.history).filter(v => v).length}</p>
              </div>
            </div>
            
            <div>
              <h3 className="font-black text-slate-800 mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-blue-500">grid_view</span>
                Gráfico de Constancia
              </h3>
              <div className="bg-slate-50 p-8 rounded-[40px] border border-slate-100">
                <div className="grid grid-cols-7 gap-3">
                  {Array.from({ length: 28 }).map((_, i) => {
                    const dayOffset = 27 - i;
                    const d = new Date(); d.setDate(d.getDate() - dayOffset);
                    const dStr = d.toISOString().split('T')[0];
                    const isDone = selectedHabit.history[dStr];
                    return (
                      <div 
                        key={i} 
                        className={`aspect-square rounded-lg transition-all ${isDone ? 'bg-blue-500 scale-110 shadow-sm shadow-blue-200' : 'bg-slate-200'}`} 
                        title={dStr}
                      ></div>
                    );
                  })}
                </div>
              </div>
            </div>
            
            <div className="bg-white p-8 rounded-[32px] border border-slate-100 flex items-start gap-4 shadow-sm">
              <span className="material-symbols-outlined text-amber-400 filled text-3xl">lightbulb</span>
              <p className="text-slate-600 text-lg font-bold italic leading-relaxed">
                "{randomPhrase}"
              </p>
            </div>
          </div>
          
          <footer className="p-6 border-t border-slate-100 bg-white">
            <button onClick={() => setSelectedHabit(null)} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-xl active:scale-95 transition-all">Cerrar Panel</button>
          </footer>
        </div>
      )}

      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-t-[40px] p-8 animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Nuevo Hábito</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-11 h-11 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">¿Qué quieres mejorar?</label>
                <input 
                  type="text" 
                  value={newName} 
                  onChange={(e) => setNewName(e.target.value)} 
                  placeholder="Ej: Beber agua" 
                  className="w-full bg-slate-50 border-none rounded-[20px] p-5 focus:ring-2 focus:ring-slate-900 font-bold placeholder:text-slate-300" 
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Meta diaria</label>
                <input 
                  type="text" 
                  value={newGoal} 
                  onChange={(e) => setNewGoal(e.target.value)} 
                  placeholder="Ej: 2 litros" 
                  className="w-full bg-slate-50 border-none rounded-[20px] p-5 focus:ring-2 focus:ring-slate-900 font-bold placeholder:text-slate-300" 
                />
              </div>
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Categoría</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'Salud', label: 'Salud', icon: 'favorite' },
                    { val: 'Mental', label: 'Mental', icon: 'psychology' },
                    { val: 'Productividad', label: 'Prod.', icon: 'bolt' }
                  ].map(cat => (
                    <button 
                      key={cat.val} 
                      type="button"
                      onClick={() => setNewCategory(cat.val)} 
                      className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${newCategory === cat.val ? 'border-slate-800 bg-slate-900 text-white shadow-lg' : 'border-transparent bg-slate-50 text-slate-400'}`}
                    >
                      <span className="material-symbols-outlined text-xl">{cat.icon}</span>
                      <span className="text-[9px] font-black uppercase">{cat.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <button onClick={addHabit} className="w-full py-5 bg-slate-900 text-white rounded-[24px] font-black shadow-xl active:scale-95 transition-all text-lg flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">rocket_launch</span>
                Empezar Racha
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Habits;
