
import React from 'react';
import { MOCK_ACHIEVEMENTS } from '../constants';

const Achievements: React.FC = () => {
  return (
    <div className="pb-44">
      <header className="p-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1 transition-colors">Logros</h1>
          <p className="text-slate-500 font-medium">Tu camino a la maestría.</p>
        </div>
        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-500">
          <span className="material-symbols-outlined text-2xl">workspace_premium</span>
        </div>
      </header>

      <section className="px-6 mb-8">
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm flex flex-col items-center transition-colors">
          <div className="relative w-36 h-36 mb-6">
            <svg className="w-full h-full rotate-[-90deg]" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-slate-50" strokeWidth="2.5" />
              <circle
                cx="18"
                cy="18"
                r="16"
                fill="none"
                className="stroke-blue-400"
                strokeWidth="2.5"
                strokeDasharray="80, 100"
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-[6px] rounded-full overflow-hidden bg-slate-100 p-1">
               <img src="https://picsum.photos/seed/profile/150/150" alt="Avatar" className="w-full h-full object-cover rounded-full" />
            </div>
            <div className="absolute -bottom-2 right-1/2 translate-x-1/2 bg-blue-500 text-white text-[10px] font-black px-3 py-1 rounded-full border-2 border-white uppercase">
              Nivel 5
            </div>
          </div>
          <h2 className="text-xl font-bold mb-1">Xabi Productivo</h2>
          <p className="text-xs text-blue-500 font-bold bg-blue-50 px-4 py-1 rounded-full mb-6 transition-colors">12.500 XP Totales</p>
          
          <div className="w-full space-y-2">
            <div className="flex justify-between text-[10px] font-black uppercase text-slate-400">
              <span>Siguiente Nivel</span>
              <span>800 XP Necesarios</span>
            </div>
            <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-blue-400 to-blue-500 w-[80%] rounded-full relative">
                <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="material-symbols-outlined text-orange-400">auto_awesome</span>
          Desbloqueados
        </h3>
        <div className="grid grid-cols-2 gap-4">
          {MOCK_ACHIEVEMENTS.map((award) => (
            <div
              key={award.id}
              className={`p-5 rounded-3xl border text-center transition-all ${
                award.unlocked
                  ? 'bg-white border-slate-100 shadow-sm'
                  : 'bg-slate-50 border-transparent opacity-60 grayscale'
              }`}
            >
              <div className="w-16 h-16 mx-auto mb-4 relative">
                <img src={award.iconUrl} alt={award.title} className="w-full h-full object-contain rounded-2xl" />
                {!award.unlocked && (
                  <div className="absolute inset-0 bg-slate-900/10 rounded-2xl flex items-center justify-center">
                    <span className="material-symbols-outlined text-slate-500">lock</span>
                  </div>
                )}
              </div>
              <h4 className="font-bold text-sm mb-1">{award.title}</h4>
              <p className="text-[10px] text-slate-500 leading-tight mb-3 line-clamp-2">{award.description}</p>
              
              {award.unlocked ? (
                <span className="text-[9px] font-bold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg uppercase transition-colors">
                  {award.unlockedDate}
                </span>
              ) : (
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-400"
                    style={{ width: `${(award.progress / award.total) * 100}%` }}
                  ></div>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Achievements;
