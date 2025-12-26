
import React, { useState } from 'react';
import { Work, WorkLanguage, Sensitivity } from '../types';
import { X, Clover, Bookmark, UserPlus, Mail, ChevronDown, Check, Plus, Info, Music, BookOpen, Star, MessageCircle, AlertTriangle, ShieldOff, Hash } from 'lucide-react';
import { SENSITIVITY_ICONS, LANGUAGE_ICONS, KomorebiLogo } from '../constants.tsx';
import { useApp } from '../store.tsx';

interface WorkViewerProps { work: Work; onClose: () => void; }

export const WorkViewer: React.FC<WorkViewerProps> = ({ work, onClose }) => {
  const { folders, toggleWorkInFolder, currentUser, reportWork, blockUser, createThread, threads, toggleFollow } = useApp();
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [reported, setReported] = useState(false);
  
  const handleAddToFolder = (folderId: string) => toggleWorkInFolder(folderId, work.id);
  const userFolders = folders.filter(f => f.ownerId === currentUser?.id);
  const existingThread = threads.find(t => t.workId === work.id);

  const isFollowing = currentUser?.followingIds?.includes(work.authorId);

  const handleReport = () => {
    if (window.confirm("Report node? Ethical violations lead to archiving.")) {
      reportWork(work.id);
      setReported(true);
    }
  };

  const handleBlock = () => {
    if (window.confirm(`Block ${work.authorName}? Their nodes will be hidden.`)) {
      blockUser(work.authorId);
      onClose();
    }
  };

  const handleStartDiscussion = () => {
    if (existingThread) {
      alert("Discussion already exists in the Dialogue network.");
      return;
    }
    createThread(`Discussion: ${work.title}`, true, work.id);
    alert("Thread established in Dialogue.");
  };

  const sensitivityLabels: Record<string, string> = { 'miedo': 'Fear', 'violencia': 'Violence', 'sexualidad': 'Sexuality', 'perturbación psicológica': 'Psychological', 'consumo o exceso': 'Excess' };

  return (
    <div className="fixed inset-0 z-[150] bg-zinc-900/80 backdrop-blur-md overflow-y-auto flex items-start justify-center p-4 lg:p-12 animate-in fade-in duration-500 text-left">
      <div className="max-w-6xl w-full bg-white border-2 border-black shadow-[20px_20px_0px_rgba(0,0,0,0.3)] flex flex-col md:flex-row min-h-[85vh] overflow-hidden">
        <div className="w-full md:w-80 bg-zinc-100 border-r-2 border-black p-8 space-y-8 flex flex-col">
          <div className="flex justify-between items-center mb-4 md:hidden">
            <h1 className="text-xl font-bold uppercase italic font-mono truncate">{work.title}</h1>
            <button onClick={onClose} className="p-2 border border-black bg-white"><X size={16}/></button>
          </div>
          <div className="space-y-6">
             <div className="aspect-square border-2 border-black bg-zinc-200 overflow-hidden shadow-[4px_4px_0px_black] relative grayscale group-hover:grayscale-0">
                <img src={work.thumbnail} className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  {work.sensitivities.map((s, idx) => (<div key={idx} className="bg-white p-1 border border-black scale-75 shadow-[2px_2px_0px_black]" title={sensitivityLabels[s]}>{SENSITIVITY_ICONS[s]}</div>))}
                </div>
             </div>
             <div className="grid grid-cols-2 gap-3 text-[10px] font-bold font-mono">
                <button 
                  onClick={() => toggleFollow(work.authorId)} 
                  className={`flex items-center justify-center gap-1 border-2 p-2 shadow-[2px_2px_0px_black] active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ${isFollowing ? 'bg-orange-600 text-white border-black' : 'text-blue-800 border-zinc-200 hover:border-black bg-white'}`}
                >
                  <UserPlus size={10}/> {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="flex items-center justify-center gap-1 text-blue-800 border-2 border-zinc-200 p-2 hover:bg-white hover:border-black bg-white"><Mail size={10}/> Chat</button>
                <button onClick={handleStartDiscussion} className="w-full col-span-2 flex items-center justify-center gap-2 bg-[#1a237e] text-white p-2 hover:bg-orange-600 shadow-[4px_4px_0px_black] active:translate-x-1 uppercase text-[9px]"><Hash size={12}/> {existingThread ? 'Discussion Active' : 'Start Discussion'}</button>
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
                <button onClick={handleReport} disabled={reported} className="text-red-800 border-2 p-2 hover:border-red-800 flex items-center justify-center gap-1"><AlertTriangle size={10}/> Report</button>
                <button onClick={handleBlock} className="text-zinc-600 border-2 p-2 hover:border-black flex items-center justify-center gap-1 uppercase"><ShieldOff size={10}/> Block</button>
             </div>
          </div>
          <div className="space-box border-2 shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
             <div className="space-header flex items-center gap-2 uppercase text-[10px]"><Info size={12}/> Metadata</div>
             <div className="p-4 space-y-3 text-[10px] font-mono leading-tight uppercase">
                <p><span className="font-bold opacity-50">AUTHOR:</span> <span className="underline">{work.authorName}</span></p>
                <p><span className="font-bold opacity-50">LANGUAGE:</span> {work.language.toUpperCase()}</p>
                <p><span className="font-bold opacity-50">STATUS:</span> <span className="text-orange-600">{work.status}</span></p>
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
            <div className="bg-zinc-900 flex items-center justify-center min-h-[400px] grayscale hover:grayscale-0 transition-all duration-[2s]">
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
