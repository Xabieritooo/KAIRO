
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Tasks from './pages/Tasks';
import Habits from './pages/Habits';
import Achievements from './pages/Achievements';
import BottomNav from './components/BottomNav';
import { MOCK_TASKS, MOCK_HABITS } from './constants';
import { Task, Habit } from './types';

const App: React.FC = () => {
  // Estado global de tareas
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('kairo_tasks');
    return saved ? JSON.parse(saved) : MOCK_TASKS;
  });

  // Estado global de hábitos
  const [habits, setHabits] = useState<Habit[]>(() => {
    const saved = localStorage.getItem('kairo_habits');
    return saved ? JSON.parse(saved) : MOCK_HABITS;
  });

  // Guardado persistente único
  useEffect(() => {
    localStorage.setItem('kairo_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('kairo_habits', JSON.stringify(habits));
  }, [habits]);

  return (
    <HashRouter>
      <div className="max-w-2xl mx-auto min-h-screen relative shadow-sm bg-slate-50 font-sans">
        <main className="w-full">
          <Routes>
            <Route path="/" element={<Home tasks={tasks} />} />
            <Route path="/tasks" element={<Tasks tasks={tasks} setTasks={setTasks} />} />
            <Route path="/habits" element={<Habits habits={habits} setHabits={setHabits} />} />
            <Route path="/achievements" element={<Achievements />} />
          </Routes>
        </main>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;
