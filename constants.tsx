
import React from 'react';
import { 
  Ghost, 
  Zap, 
  Heart, 
  Brain, 
  Wine, 
  Film, 
  Mic2, 
  Image as ImageIcon, 
  FileText,
  Clover,
  Eye,
  Activity
} from 'lucide-react';
import { Sensitivity, WorkLanguage } from './types';

export const KomorebiLogo = ({ size = 32, className = "" }: { size?: number, className?: string }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <Clover size={size} className="text-white fill-none" strokeWidth={1} />
  </div>
);

export const SENSITIVITY_ICONS: Record<Sensitivity, React.ReactNode> = {
  [Sensitivity.FEAR]: <Ghost size={14} className="text-zinc-500" />,
  [Sensitivity.VIOLENCE]: <Activity size={14} className="text-red-600" />,
  [Sensitivity.SEXUALITY]: <Heart size={14} className="text-zinc-600" />,
  [Sensitivity.PSYCHOLOGICAL]: <Brain size={14} className="text-zinc-400" />,
  [Sensitivity.EXCESS]: <Wine size={14} className="text-zinc-500" />,
};

export const LANGUAGE_ICONS: Record<WorkLanguage, React.ReactNode> = {
  [WorkLanguage.AUDIOVISUAL]: <Film size={16} strokeWidth={1} />,
  [WorkLanguage.AUDIO]: <Mic2 size={16} strokeWidth={1} />,
  [WorkLanguage.VISUAL]: <ImageIcon size={16} strokeWidth={1} />,
  [WorkLanguage.ESSAY]: <FileText size={16} strokeWidth={1} />,
};

// Se vacía la lista inicial para eliminar a los "bots" y permitir que solo existan usuarios reales registrados.
export const INITIAL_WORKS: any[] = [];
