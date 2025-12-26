
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

export const INITIAL_WORKS = [
  {
    id: '1',
    authorId: 'user1',
    authorName: 'Elena V.',
    title: 'Idioteque / Sombras',
    language: WorkLanguage.AUDIOVISUAL,
    contentUrl: 'https://samplelib.com/lib/preview/mp4/sample-5s.mp4',
    intent: 'Everything in its right place. A study of static and the human form.',
    sensitivities: [Sensitivity.PSYCHOLOGICAL],
    status: 'publicado',
    createdAt: Date.now() - 1000000,
    thumbnail: 'https://images.unsplash.com/photo-1514467950401-43b2a9e00406?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '2',
    authorId: 'user2',
    authorName: 'Thom R.',
    title: 'Crystalline Structures',
    language: WorkLanguage.VISUAL,
    contentUrl: 'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=800&auto=format&fit=crop',
    intent: 'The distance between the observer and the observed. Monochromatic decay.',
    sensitivities: [],
    status: 'publicado',
    createdAt: Date.now() - 5000000,
    thumbnail: 'https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?q=80&w=800&auto=format&fit=crop'
  }
];
