
import React, { useState } from 'react';
import { Work, WorkLanguage, Sensitivity } from '../types';
import { X, Clover, Bookmark, UserPlus, Mail, ChevronDown, Check, Plus, Info, Music, BookOpen, Star, MessageCircle, AlertTriangle, ShieldOff, Hash } from 'lucide-react';
import { SENSITIVITY_ICONS, LANGUAGE_ICONS, KomorebiLogo } from '../constants.tsx';
import { useApp } from '../store.tsx';

interface WorkViewerProps { work: Work; onClose: () => void; }

export const WorkViewer: React.FC<WorkViewerProps> = ({ work, onClose }) => {
  const { folders, toggleWorkInFolder, currentUser, reportWork, blockUser, toggleFollow, threads } = useApp();
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  
  const handleAddToFolder = (folderId: string) => toggleWorkInFolder(folderId, work.id);
  const userFolders = folders.filter(f => f.ownerId === currentUser?.id);
  
  const isFollowing = currentUser?.followingIds.includes(work.authorId);

  return (
    <div className="fixed inset-0 z-[150] bg-zinc-900/80 backdrop-blur-md overflow-y-auto flex items-start justify-center p-4 lg:p-12 animate-in fade-in duration-500 text-left">
      <div className="max-w-6xl w-full bg-white border-2 border-black shadow-[20px_20px_0px_rgba(0,0,0,0.3)] flex flex-col md:flex-row min-h-[85vh] overflow-hidden">
        <div className="w-full md:w-80 bg-zinc-100 border-r-2 border-black p-8 space-y-8 flex flex-col">
          <div className="space-y-6">
             <div className="aspect-square border-2 border-black bg-zinc-200 overflow-hidden shadow-[4px_4px_0px_black] relative grayscale group-hover:grayscale-0">
                <img src={work.thumbnail} className="w-full h-full object-cover" />
             </div>
             <div className="grid grid-cols-2 gap-3 text-[10px] font-bold font-mono">
                <button 
                  onClick={() => toggleFollow(work.authorId)}
                  className={`flex items-center justify-center gap-1 border-2 p-2 transition-all ${isFollowing ? 'bg-black text-white border-black' : 'bg-white text-blue-800 border-zinc-200 hover:border-black'}`}
                >
                  <UserPlus size={10}/> {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="flex items-center justify-center gap-1 text-blue-800 border-2 border-zinc-200 p-2 hover:bg-white hover:border-black bg-white"><Mail size={10}/> Chat</button>
                
                <div className="relative col-span-2">
                  <button onClick={() => setShowFolderPicker(!showFolderPicker)} className="w-full flex items-center justify-center gap-2 text-zinc-900 border-2 border-zinc-200 p-2 hover:bg-white hover:border-black bg-white"><Bookmark size={12}/> Collect <ChevronDown size={10} /></button>
                  {showFolderPicker && (
                    <div className="absolute bottom-full mb-2 left-0 w-full bg-white border-2 border-black shadow-[4px_4px_0px_black] z-50">
                      <div className="max-h-40 overflow-y-auto">
                        {userFolders.map(f => (
                          <button key={f.id} onClick={() => handleAddToFolder(f.id)} className="w-full text-left p-2 border-b text-[9px] uppercase hover:bg-zinc-100 flex justify-between">
                            <span>{f.name}</span>{f.workIds.includes(work.id) ? <Check size={10}/> : <Plus size={10}/>}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
             </div>
          </div>
          <button onClick={onClose} className="w-full p-4 border-2 border-black bg-white font-mono font-bold text-[12px] uppercase shadow-[4px_4px_0px_black]">Return</button>
        </div>
        <div className="flex-1 p-8 lg:p-12 space-y-10 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]">
          <div className="flex justify-between border-b-2 border-black pb-6">
             <div className="flex items-center gap-4"><KomorebiLogo size={32} className="invert grayscale" /><h1 className="text-4xl font-mono font-bold uppercase italic text-[#1a237e]">{work.title}</h1></div>
             <button onClick={onClose} className="p-2 border-2 border-black shadow-[4px_4px_0px_black]"><X size={24} /></button>
          </div>
          <div className="bg-black p-1 border-4 border-zinc-300 shadow-[10px_10px_0px_rgba(0,0,0,0.1)]">
            <div className="bg-zinc-900 flex items-center justify-center min-h-[400px] grayscale hover:grayscale-0 transition-all">
               {work.language === WorkLanguage.AUDIOVISUAL && <video src={work.contentUrl} controls className="max-w-full max-h-[600px]" />}
               {work.language === WorkLanguage.VISUAL && <img src={work.contentUrl} className="max-w-full max-h-[700px]" />}
               {work.language === WorkLanguage.AUDIO && <div className="p-20"><audio src={work.contentUrl} controls className="invert" /></div>}
               {work.language === WorkLanguage.ESSAY && <div className="bg-white p-12 text-left font-serif text-2xl leading-relaxed whitespace-pre-wrap max-w-prose">{work.contentUrl}</div>}
            </div>
          </div>
          <div className="space-box border-2 shadow-[6px_6px_0px_rgba(0,0,0,0.1)] p-8 italic font-serif text-2xl border-l-4 border-orange-500">"{work.intent}"</div>
        </div>
      </div>
    </div>
  );
};
