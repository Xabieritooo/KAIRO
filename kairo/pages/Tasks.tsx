
import React, { useState, useMemo } from 'react';
import { Task } from '../types';

interface TasksProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

const Tasks: React.FC<TasksProps> = ({ tasks, setTasks }) => {
  const [filter, setFilter] = useState('Todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMonthCalendarOpen, setIsMonthCalendarOpen] = useState(false);

  const now = new Date();
  const [viewDate, setViewDate] = useState(new Date()); // Para navegar meses en el calendario

  const { calendarDates, todayStr } = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 14; i++) { // Ampliamos a 14 días para el scroll rápido
      const d = new Date();
      d.setDate(now.getDate() + i);
      const dayNum = d.getDate();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      const full = `${year}-${month}-${String(dayNum).padStart(2, '0')}`;
      const labels = ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'];
      dates.push({
        label: labels[d.getDay()],
        day: dayNum,
        full: full
      });
    }
    const today = new Date();
    const tStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    return { calendarDates: dates, todayStr: tStr };
  }, []);

  const [selectedDate, setSelectedDate] = useState(todayStr);

  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Cole');
  const [newPriority, setNewPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [newTime, setNewTime] = useState('');

  // Lógica del calendario mensual
  const monthDays = useMemo(() => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    const days = [];
    // Espacios vacíos para el inicio del mes (ajuste de domingo a lunes si se prefiere, aquí domingo=0)
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }
    for (let i = 1; i <= daysInMonth; i++) {
      const dStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`;
      days.push({ day: i, full: dStr });
    }
    return days;
  }, [viewDate]);

  const monthName = viewDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' });

  const addTask = () => {
    if (!newTitle) return;
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      title: newTitle,
      description: '',
      date: selectedDate,
      category: newCategory,
      time: newTime || undefined,
      completed: false,
      priority: newPriority
    };
    setTasks([newTask, ...tasks]);
    setIsModalOpen(false);
    setNewTitle('');
    setNewTime('');
    setNewCategory('Cole');
    setNewPriority('medium');
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const filteredTasks = tasks.filter(t => {
    const matchesDate = t.date === selectedDate;
    const matchesCategory = filter === 'Todas' || t.category === filter;
    return matchesDate && matchesCategory;
  });

  const categories = ['Todas', 'Cole', 'Personal', 'Salud'];

  return (
    <div className="pb-44 bg-slate-50 min-h-screen">
      <header className="p-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-black tracking-tight mb-1 text-slate-900">Mis Tareas</h1>
          <p className="text-slate-500 font-medium text-sm">
            {filteredTasks.length === 0 
              ? "Día libre de tareas." 
              : `${filteredTasks.filter(t => !t.completed).length} pendientes para hoy.`}
          </p>
        </div>
        <button 
          onClick={() => setIsMonthCalendarOpen(!isMonthCalendarOpen)}
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
            isMonthCalendarOpen ? 'bg-blue-600 text-white shadow-lg' : 'bg-white text-slate-600 border border-slate-100 shadow-sm'
          }`}
        >
          <span className="material-symbols-outlined text-[28px]">{isMonthCalendarOpen ? 'calendar_view_day' : 'calendar_month'}</span>
        </button>
      </header>

      {/* Calendario Mensual Desplegable */}
      {isMonthCalendarOpen && (
        <div className="px-6 mb-8 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[32px] p-6 shadow-xl border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-black text-slate-800 capitalize text-lg">{monthName}</h2>
              <div className="flex gap-2">
                <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() - 1)))} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                   <span className="material-symbols-outlined">chevron_left</span>
                </button>
                <button onClick={() => setViewDate(new Date(viewDate.setMonth(viewDate.getMonth() + 1)))} className="p-2 hover:bg-slate-50 rounded-full text-slate-400">
                   <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['D', 'L', 'M', 'M', 'J', 'V', 'S'].map(d => (
                <div key={d} className="text-center text-[10px] font-black text-slate-300">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-2">
              {monthDays.map((d, i) => {
                if (!d) return <div key={`empty-${i}`} className="h-10"></div>;
                const isSelected = selectedDate === d.full;
                const isToday = d.full === todayStr;
                const hasTasks = tasks.some(t => t.date === d.full);
                return (
                  <button
                    key={d.full}
                    onClick={() => {
                      setSelectedDate(d.full);
                      setIsMonthCalendarOpen(false);
                    }}
                    className={`h-11 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                      isSelected ? 'bg-blue-600 text-white shadow-md' : isToday ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <span className="text-sm font-bold">{d.day}</span>
                    {hasTasks && !isSelected && <div className="absolute bottom-1.5 w-1 h-1 bg-blue-400 rounded-full"></div>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Selector Rápido (Week Strip) */}
      {!isMonthCalendarOpen && (
        <div className="px-6 mb-6 flex gap-3 overflow-x-auto hide-scrollbar scroll-smooth">
          {calendarDates.map((d) => {
            const isSelected = selectedDate === d.full;
            const isToday = d.full === todayStr;
            return (
              <button
                key={d.full}
                onClick={() => setSelectedDate(d.full)}
                className={`min-w-[65px] h-[85px] rounded-2xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-100 scale-105'
                    : 'bg-white border border-slate-100 text-slate-400 hover:border-blue-100'
                }`}
              >
                <span className={`text-[9px] font-black mb-1 uppercase tracking-tighter ${isSelected ? 'text-blue-100' : 'text-slate-300'}`}>
                  {d.label}
                </span>
                <span className="text-xl font-black">{d.day}</span>
                {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1"></div>}
                {!isSelected && isToday && <div className="w-1 h-1 bg-blue-400 rounded-full mt-1"></div>}
              </button>
            );
          })}
        </div>
      )}

      {/* Filtros de Categoría */}
      <div className="px-6 mb-6 flex gap-2 overflow-x-auto hide-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-6 py-2.5 rounded-full text-xs font-black whitespace-nowrap border transition-all ${
              filter === cat
                ? 'bg-slate-900 text-white border-slate-900 shadow-md'
                : 'bg-white text-slate-500 border-slate-100'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Lista de Tareas */}
      <div className="px-6 space-y-3">
        {filteredTasks.map((task) => (
          <div key={task.id} className="group flex items-center p-5 bg-white rounded-[28px] border border-slate-100 shadow-sm transition-all hover:border-blue-200">
             <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-blue-500 shrink-0 mr-4">
                <span className="material-symbols-outlined text-2xl">
                   {task.category === 'Cole' ? 'school' : task.category === 'Salud' ? 'monitor_heart' : 'person'}
                </span>
             </div>
             <div className="flex-1 min-w-0 pr-2">
                <h3 className={`font-black text-slate-800 truncate text-base ${task.completed ? 'line-through text-slate-300 opacity-60' : ''}`}>
                  {task.title}
                </h3>
                <div className="flex items-center gap-3">
                  <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-lg ${
                    task.priority === 'high' ? 'bg-red-50 text-red-500' : 
                    task.priority === 'medium' ? 'bg-blue-50 text-blue-500' : 'bg-slate-50 text-slate-500'
                  }`}>
                    {task.priority === 'high' ? 'Prioridad Alta' : task.priority === 'medium' ? 'Media' : 'Baja'}
                  </span>
                  {task.time && (
                    <span className="text-[10px] font-black text-slate-400 flex items-center gap-1">
                      <span className="material-symbols-outlined text-[14px]">schedule</span> {task.time}
                    </span>
                  )}
                </div>
             </div>
             
             <div className="flex items-center gap-2">
               <button 
                 onClick={() => deleteTask(task.id)}
                 className="w-9 h-9 rounded-xl text-slate-300 hover:text-red-500 hover:bg-red-50 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
               >
                 <span className="material-symbols-outlined text-[20px]">delete</span>
               </button>
               <button 
                 onClick={() => toggleTask(task.id)}
                 className={`w-10 h-10 rounded-2xl border-2 flex items-center justify-center transition-all ${
                 task.completed ? 'bg-green-500 border-green-500 text-white shadow-md scale-105' : 'border-slate-100 text-transparent hover:border-blue-400'
               }`}>
                 <span className="material-symbols-outlined text-sm font-black">check</span>
               </button>
             </div>
          </div>
        ))}
        {filteredTasks.length === 0 && (
          <div className="py-24 text-center">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
               <span className="material-symbols-outlined text-4xl">done_all</span>
            </div>
            <p className="text-slate-400 font-black text-sm uppercase tracking-widest">Día libre, ¡a disfrutar!</p>
          </div>
        )}
      </div>

      {/* Botón Flotante Añadir */}
      <button 
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-28 right-6 w-16 h-16 bg-blue-600 rounded-[24px] shadow-2xl text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-[60]"
      >
        <span className="material-symbols-outlined text-3xl font-black">add</span>
      </button>

      {/* Modal Nueva Tarea */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-end justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-300" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white w-full max-w-md rounded-[40px] p-8 animate-in slide-in-from-bottom duration-500" onClick={e => e.stopPropagation()}>
            <div className="w-12 h-1 bg-slate-100 rounded-full mx-auto mb-6"></div>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-2xl font-black text-slate-800">Nueva Tarea</h2>
              <button onClick={() => setIsModalOpen(false)} className="w-11 h-11 rounded-full bg-slate-50 text-slate-400 flex items-center justify-center hover:bg-slate-100 transition-colors">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Título de la tarea</label>
                <input 
                  type="text" 
                  autoFocus
                  value={newTitle} 
                  onChange={(e) => setNewTitle(e.target.value)} 
                  placeholder="Ej: Estudiar React" 
                  className="w-full bg-slate-50 border-none rounded-[20px] p-5 focus:ring-2 focus:ring-blue-500 text-lg font-bold placeholder:text-slate-300" 
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Categoría</label>
                  <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-slate-50 border-none rounded-[20px] p-5 focus:ring-2 focus:ring-blue-500 font-bold text-sm text-slate-600 appearance-none">
                    <option value="Cole">🎓 Cole</option>
                    <option value="Personal">🏠 Personal</option>
                    <option value="Salud">💪 Salud</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-black text-slate-400 uppercase mb-3 block tracking-widest">Hora</label>
                  <div className="relative group">
                    <input 
                      type="time" 
                      value={newTime} 
                      onChange={(e) => setNewTime(e.target.value)} 
                      className="w-full bg-slate-50 border-none rounded-[20px] p-5 focus:ring-2 focus:ring-blue-500 font-bold text-slate-700 min-h-[64px] cursor-text focus:cursor-auto"
                    />
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-300 group-focus-within:hidden">
                       <span className="material-symbols-outlined text-xl">schedule</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-black text-slate-400 uppercase mb-4 block tracking-widest">Nivel de Importancia</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { val: 'low', label: 'Baja', color: 'text-green-500' },
                    { val: 'medium', label: 'Media', color: 'text-blue-500' },
                    { val: 'high', label: 'Alta', color: 'text-red-500' }
                  ].map((p) => (
                    <button key={p.val} type="button" onClick={() => setNewPriority(p.val as any)} className={`py-4 rounded-[20px] text-[11px] font-black transition-all border-2 uppercase tracking-tighter ${newPriority === p.val ? 'border-slate-800 bg-slate-900 text-white shadow-lg' : 'border-transparent bg-slate-50 text-slate-400'}`}>
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button onClick={addTask} className="w-full py-5 bg-blue-600 text-white rounded-[24px] font-black text-lg shadow-xl shadow-blue-200 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined font-black">task_alt</span>
                  Confirmar Tarea
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tasks;
