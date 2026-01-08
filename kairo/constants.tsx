
import { Task, Habit, Achievement } from './types';

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const beforeYesterday = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const COLORS = {
  primary: '#8cc6d9',
  primaryDark: '#7aa0c7',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
};

export const MOCK_TASKS: Task[] = [
  { id: '1', title: 'Repasar conceptos Gemini', description: 'IA Avanzada', date: today, time: '16:00', category: 'Cole', completed: false, priority: 'high' },
  { id: '2', title: 'Gimnasio', description: 'Día de pierna', date: today, time: '10:30', category: 'Salud', completed: true, priority: 'low' },
];

export const MOCK_HABITS: Habit[] = [
  { 
    id: '1', 
    name: 'Beber agua', 
    goal: '2L Diarios', 
    icon: 'water_drop', 
    color: 'text-blue-500', 
    bgColor: 'bg-blue-100', 
    history: { [beforeYesterday]: true, [yesterday]: true, [today]: false },
    streak: 2,
    startDate: beforeYesterday
  },
  { 
    id: '2', 
    name: 'Meditación', 
    goal: '15 mins', 
    icon: 'self_improvement', 
    color: 'text-indigo-500', 
    bgColor: 'bg-indigo-100', 
    history: { [beforeYesterday]: false, [yesterday]: true, [today]: true },
    streak: 2,
    startDate: beforeYesterday
  },
];

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  { id: 'b1', title: 'Imparable', description: '7 días de racha perfecta', unlocked: false, progress: 3, total: 7, iconUrl: 'https://picsum.photos/seed/fire/100/100' },
];
