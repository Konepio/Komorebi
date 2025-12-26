
import React from 'react';
import { Work, WorkStatus } from '../types';
import { LANGUAGE_ICONS, SENSITIVITY_ICONS } from '../constants.tsx';

interface WorkCardProps {
  work: Work;
  onClick: (work: Work) => void;
}

export const WorkCard: React.FC<WorkCardProps> = ({ work, onClick }) => {
  return (
    <div 
      className="text-center group cursor-pointer" 
      onClick={() => onClick(work)}
    >
      <div className="text-[10px] font-bold text-blue-800 hover:underline mb-1 truncate uppercase tracking-tighter">
        {work.authorName}
      </div>
      <div className="aspect-square bg-zinc-100 border border-black mb-2 overflow-hidden relative shadow-[2px_2px_0px_rgba(0,0,0,0.1)] group-hover:shadow-[4px_4px_0px_rgba(0,0,0,0.2)] transition-all">
        <img 
          src={work.thumbnail || `https://picsum.photos/seed/${work.id}/400/400`} 
          className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0 duration-700" 
        />
        <div className="absolute top-1 right-1 flex flex-col gap-1">
           <div className="bg-white p-1 border border-black scale-75 shadow-[1px_1px_0px_black]">
              {LANGUAGE_ICONS[work.language]}
           </div>
           {work.sensitivities.map((s, idx) => (
             <div key={idx} className="bg-white p-1 border border-black scale-75 shadow-[1px_1px_0px_black]" title={s}>
               {SENSITIVITY_ICONS[s]}
             </div>
           ))}
        </div>
        {work.status === WorkStatus.PENDING && (
          <div className="absolute inset-0 bg-red-600/10 flex items-center justify-center">
             <span className="bg-black text-white text-[7px] px-1 py-0.5 uppercase tracking-widest font-mono">UNDER REVIEW</span>
          </div>
        )}
      </div>
      <div className="text-[9px] font-mono leading-tight uppercase tracking-widest line-clamp-2 italic">
        {work.title}
      </div>
    </div>
  );
};
