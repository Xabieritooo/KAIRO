
export interface Task {
  id: string;
  title: string;
  description: string;
  date: string; // Formato YYYY-MM-DD
  time?: string;
  reminderTime?: string;
  category: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
}

export interface Habit {
  id: string;
  name: string;
  goal: string;
  icon: string;
  color: string;
  bgColor: string;
  // Historial: clave es fecha YYYY-MM-DD, valor es completado
  history: Record<string, boolean>;
  streak: number;
  startDate: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  total: number;
  iconUrl: string;
  unlockedDate?: string;
}

export interface UserStats {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalTasksCompleted: number;
  totalHabitsMaintained: number;
  dailyProgress: number;
}
