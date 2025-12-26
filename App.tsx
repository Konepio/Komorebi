
import React, { useState, useMemo } from 'react';
import { AppProvider, useApp } from './store.tsx';
import { WorkCard } from './components/WorkCard';
import { WorkViewer } from './components/WorkViewer';
import { UploadModal } from './components/UploadModal';
import { WorkLanguage, UserRole, WorkStatus, Work, Folder, ProfileTheme, User, ChatThread, FolderAccess, FolderEditMode, GlobalTheme, Sensitivity } from './types';
import { 
  Search, Plus, Archive as ArchiveIcon, MessageCircle, Clover, 
  Play, User as UserIcon, Terminal, Mail, UserPlus, 
  Star, Lock, Globe, Trash2, Send, Info, BookOpen, Music, Film, 
  ImageIcon as LucideImage, Home, Settings, ChevronRight, Palette, Type, Layout, Image as LucideImageIcon,
  Activity, Zap, Compass, ExternalLink, Bookmark, ShieldCheck, Eye, EyeOff, Check, X as CloseIcon, AlertTriangle, ShieldOff, Users, Hash, Filter, Sparkles, Link as LinkIcon, LogIn, Heart
} from 'lucide-react';
import { KomorebiLogo, SENSITIVITY_ICONS, LANGUAGE_ICONS } from './constants.tsx';

type ViewState = 'PORTAL' | 'PROFILE' | 'ARCHIVE' | 'FOLDERS' | 'MESSAGES' | 'MANIFESTO' | 'MODERATION';

const AuthView = () => {
  const { login, register } = useApp();
  const [isRegister, setIsRegister] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', name: '', contact: '' });
  const [error, setError] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    if (isRegister) {
      if (!form.username || !form.password || !form.name) {
        setError('Please complete the required fields.');
        return;
      }
      register({ 
        username: form.username, 
        password: form.password, 
        name: form.name, 
        email: form.contact.includes('@') ? form.contact : undefined, 
        phone: !form.contact.includes('@') ? form.contact : undefined 
      });
    } else {
      const success = login(form.username, form.password);
      if (!success) setError('Invalid credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[#d1d9e6] bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]">
      <div className="w-full max-w-md space-box border-4 border-black shadow-[15px_15px_0px_black] p-10 animate-in zoom-in duration-500">
        <div className="flex flex-col items-center mb-10">
          <KomorebiLogo size={64} className="invert brightness-0 mb-4" />
          <h2 className="text-4xl font-mono font-bold uppercase italic tracking-tighter">KOMOREBI</h2>
          <p className="text-[9px] font-mono text-zinc-400 uppercase tracking-widest mt-2">Work System Access</p>
        </div>
        
        <form onSubmit={handleAuth} className="space-y-6 text-left">
          {error && <div className="bg-red-50 text-red-600 border border-red-200 p-3 text-[10px] font-bold uppercase">{error}</div>}
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase opacity-50">Username / Node ID</label>
            <input className="w-full p-4 border-2 border-black font-mono text-sm outline-none" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          </div>
          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase opacity-50">Password</label>
            <input type="password" className="w-full p-4 border-2 border-black font-mono text-sm outline-none" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
          </div>
          {isRegister && (
            <>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase opacity-50">Full Name</label>
                <input className="w-full p-4 border-2 border-black font-mono text-sm outline-none" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold uppercase opacity-50">Email or Phone</label>
                <input className="w-full p-4 border-2 border-black font-mono text-sm outline-none" value={form.contact} onChange={e => setForm({...form, contact: e.target.value})} />
              </div>
            </>
          )}
          <button type="submit" className="w-full bg-[#1a237e] text-white p-4 font-bold uppercase tracking-widest text-xs shadow-[5px_5px_0px_black]">
            {isRegister ? 'Register Node' : 'Synchronize'}
          </button>
        </form>
        <div className="mt-8 pt-6 border-t border-zinc-100">
          <button onClick={() => setIsRegister(!isRegister)} className="text-[10px] font-bold uppercase underline">
            {isRegister ? 'Already have a node' : 'Create new work node'}
          </button>
        </div>
      </div>
    </div>
  );
};

const TopNav = ({ currentView, setView }: { currentView: ViewState, setView: (v: ViewState) => void }) => {
  const { currentUser, logout, updateLocalTheme, localTheme } = useApp();
  const [showThemePanel, setShowThemePanel] = useState(false);
  const canModerate = currentUser?.role === UserRole.ADMIN || currentUser?.role === UserRole.MODERATOR;

  return (
    <div className="bg-[#1a237e] text-white py-1 px-4 flex justify-between items-center text-[10px] font-bold border-b border-black sticky top-0 z-[110] shadow-md">
      <div className="flex gap-4">
        <button onClick={() => setView('PORTAL')} className={`${currentView === 'PORTAL' ? 'text-orange-400 underline' : ''}`}>Portal</button>
        <button onClick={() => setView('ARCHIVE')} className={`${currentView === 'ARCHIVE' ? 'text-orange-400 underline' : ''}`}>Explore</button>
        {currentUser?.role !== UserRole.GUEST && (
          <><button onClick={() => setView('MESSAGES')} className={`${currentView === 'MESSAGES' ? 'text-orange-400 underline' : ''}`}>Dialogue</button>
          <button onClick={() => setView('FOLDERS')} className={`${currentView === 'FOLDERS' ? 'text-orange-400 underline' : ''}`}>Folders</button></>
        )}
        <button onClick={() => setView('MANIFESTO')} className={`${currentView === 'MANIFESTO' ? 'text-orange-400 underline' : ''}`}>Manifesto</button>
        {canModerate && <button onClick={() => setView('MODERATION')} className="text-emerald-400 font-black">MODERATION</button>}
      </div>
      <div className="flex gap-4 items-center">
        <button onClick={() => setShowThemePanel(!showThemePanel)} className="hover:text-orange-400 flex items-center gap-1"><Palette size={10}/> Aesthetics</button>
        {currentUser && (
          <><button onClick={() => setView('PROFILE')} className="underline">{currentUser.name}</button>
          <button onClick={logout} className="text-zinc-400">Exit</button></>
        )}
      </div>
    </div>
  );
};

const PortalView = ({ setSelectedWork }: { setSelectedWork: (w: Work) => void }) => {
  const { works, currentUser } = useApp();
  const filteredWorks = useMemo(() => works.filter(w => w.status === WorkStatus.PUBLISHED && !currentUser?.blockedUserIds.includes(w.authorId)), [works, currentUser]);

  const categorizedWorks = useMemo(() => ({
    [WorkLanguage.AUDIOVISUAL]: filteredWorks.filter(w => w.language === WorkLanguage.AUDIOVISUAL).slice(0, 4),
    [WorkLanguage.AUDIO]: filteredWorks.filter(w => w.language === WorkLanguage.AUDIO).slice(0, 4),
    [WorkLanguage.VISUAL]: filteredWorks.filter(w => w.language === WorkLanguage.VISUAL).slice(0, 4),
    [WorkLanguage.ESSAY]: filteredWorks.filter(w => w.language === WorkLanguage.ESSAY).slice(0, 4),
  }), [filteredWorks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-700 text-left">
      <div className="md:col-span-4 space-y-6">
        <div className="space-box p-4 border-2">
          <h2 className="text-xl font-bold mb-4 font-mono uppercase italic border-b pb-2 text-[#1a237e]"><Terminal size={18} /> STATUS_REPORT</h2>
          <div className="flex gap-4 mb-4">
            <div className="w-16 h-16 bg-zinc-900 border border-black flex items-center justify-center relative"><Clover className="text-white opacity-20" size={30} /></div>
            <div className="flex-1 text-[10px] font-mono leading-tight">
              <p className="text-zinc-500 uppercase">Connection: <span className="text-emerald-500">Nominal</span></p>
              <p>Active Nodes: {filteredWorks.length}</p>
              <p>Identity: {currentUser?.username}</p>
            </div>
          </div>
          <p className="bg-zinc-50 p-3 border italic font-serif text-[11px] border-l-4 border-orange-600">"Komorebi exists for creators of intent."</p>
        </div>
        <div className="space-box shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
          <div className="space-header text-[10px]">Recent Activity</div>
          <div className="p-4 space-y-2 font-mono text-[9px]">
            {filteredWorks.slice(0, 5).map(w => (
              <div key={w.id} className="flex gap-2 border-b border-zinc-100 pb-1 last:border-none cursor-pointer" onClick={() => setSelectedWork(w)}>
                <span className="font-bold text-[#1a237e]">>></span> <span className="truncate">{w.authorName}: "{w.title}"</span>
              </div>
            ))}
            {filteredWorks.length === 0 && <p className="text-zinc-300">Archive is currently empty.</p>}
          </div>
        </div>
      </div>
      <div className="md:col-span-8 space-y-10">
        <div className="space-box p-10 bg-white border-2 border-black">
          <h2 className="text-4xl font-mono font-bold mb-4 uppercase italic tracking-tighter text-[#1a237e]">Archive of Intent</h2>
          <p className="font-serif text-xl italic text-zinc-600 border-l-2 border-orange-500 pl-6">"Embrace romanticism and hedonism: profound emotion and conscious pleasure."</p>
        </div>
        {(Object.entries(categorizedWorks) as [string, Work[]][]).map(([lang, items]) => (
          items.length > 0 && (
            <div key={lang} className="space-box shadow-[6px_6px_0px_rgba(0,0,0,0.1)] border-2">
              <div className="space-header px-4 py-2 bg-[#1a237e] uppercase font-mono tracking-widest text-xs">{lang} section</div>
              <div className="p-6 grid grid-cols-2 sm:grid-cols-4 gap-6">
                {items.map(work => <WorkCard key={work.id} work={work} onClick={setSelectedWork} />)}
              </div>
            </div>
          )
        ))}
      </div>
    </div>
  );
};

const ProfileView = () => {
  const { currentUser, updateProfile, works, allUsers, folders } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [isThemeEditing, setIsThemeEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: currentUser?.name || '', bio: currentUser?.bio || '', avatar: currentUser?.avatar || '' });
  const [themeData, setThemeData] = useState<ProfileTheme>(currentUser?.theme || { backgroundColor: '#ffffff', headerColor: '#1a237e', textColor: '#000000', borderStyle: 'solid' });

  const handleSave = () => { updateProfile({ ...profileData, theme: themeData }); setIsEditing(false); setIsThemeEditing(false); };
  
  const userWorks = works.filter(w => w.authorId === currentUser?.id);
  const userFolders = folders.filter(f => f.ownerId === currentUser?.id);
  const friends = allUsers.filter(u => currentUser?.followingIds.includes(u.id) || currentUser?.followerIds.includes(u.id));

  if (!currentUser) return null;

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-700 text-left">
      <div className="h-48 bg-zinc-800 border-2 border-black overflow-hidden shadow-[8px_8px_0px_black] relative">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
      </div>
      <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 px-8 relative z-10">
        <div className="w-32 h-32 border-4 border-black bg-white shadow-[4px_4px_0px_black]"><img src={currentUser.avatar} className="w-full h-full object-cover grayscale" /></div>
        <div className="flex-1 flex flex-col md:flex-row justify-between items-end pb-2 gap-4">
          <div>
            <h1 className="text-4xl font-mono font-bold uppercase italic tracking-tighter bg-white border-2 border-black px-4 shadow-[4px_4px_0px_black]">{currentUser.name}</h1>
            <p className="text-[10px] font-mono text-zinc-400 mt-2 uppercase tracking-widest">@{currentUser.username}</p>
          </div>
          <div className="flex gap-8 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_black] text-center">
            <div><div className="text-xl font-bold">{userWorks.length}</div><div className="text-[8px] uppercase">Works</div></div>
            <div><div className="text-xl font-bold">{currentUser.followerIds.length}</div><div className="text-[8px] uppercase">Followers</div></div>
            <div><div className="text-xl font-bold">{currentUser.followingIds.length}</div><div className="text-[8px] uppercase">Following</div></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-8">
          <div className="space-box border-2 p-6 bg-white shadow-[6px_6px_0px_black]">
            <div className="space-header mb-4 text-[10px]">Node Manifesto</div>
            {isEditing ? (
              <div className="space-y-4">
                <input className="w-full p-2 border border-black text-xs" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} placeholder="Public Name" />
                <textarea className="w-full p-2 border border-black text-xs h-24" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} placeholder="Personal Manifesto" />
                <button onClick={handleSave} className="w-full bg-black text-white p-2 text-xs font-bold uppercase">Publish Updates</button>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="font-serif italic text-sm text-zinc-600">{currentUser.bio || "No manifesto recorded for this node."}</p>
                <div className="flex gap-2">
                  <button onClick={() => setIsEditing(true)} className="flex-1 border-2 border-black p-2 text-[9px] font-bold uppercase">Edit Info</button>
                  <button onClick={() => setIsThemeEditing(!isThemeEditing)} className="flex-1 bg-[#1a237e] text-white p-2 text-[9px] font-bold uppercase">Theme</button>
                </div>
              </div>
            )}
            {isThemeEditing && (
              <div className="mt-4 pt-4 border-t border-black space-y-3">
                <div className="flex justify-between items-center text-[9px] font-bold uppercase">Background <input type="color" value={themeData.backgroundColor} onChange={e => setThemeData({...themeData, backgroundColor: e.target.value})} /></div>
                <div className="flex justify-between items-center text-[9px] font-bold uppercase">Header <input type="color" value={themeData.headerColor} onChange={e => setThemeData({...themeData, headerColor: e.target.value})} /></div>
                <button onClick={handleSave} className="w-full bg-orange-600 text-white p-1 text-[8px] uppercase">Sync Aesthetics</button>
              </div>
            )}
          </div>
          <div className="space-box border-2 p-6 bg-white shadow-[6px_6px_0px_black]">
            <div className="space-header mb-4 text-[10px]">Network Connections</div>
            <div className="grid grid-cols-4 gap-2">
              {friends.map(u => (
                <div key={u.id} className="text-center cursor-pointer" title={u.name}>
                  <div className="aspect-square border border-black grayscale overflow-hidden mb-1"><img src={u.avatar} className="w-full h-full object-cover" /></div>
                  <div className="text-[7px] font-bold uppercase truncate">{u.name.split(' ')[0]}</div>
                </div>
              ))}
              {friends.length === 0 && <p className="col-span-4 text-center py-4 text-[8px] uppercase text-zinc-300 italic">No real-time connections.</p>}
            </div>
          </div>
        </div>
        <div className="md:col-span-8 space-y-12">
           <section className="space-y-4">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#1a237e] border-b border-black pb-1 flex items-center gap-2"><Activity size={12}/> Activity Registry</h3>
              <div className="grid grid-cols-4 gap-4">
                {userWorks.map(w => (
                  <div key={w.id} className="space-y-1">
                    <div className="aspect-[3/4] border-2 border-black grayscale"><img src={w.thumbnail} className="w-full h-full object-cover" /></div>
                    <div className="text-[8px] font-bold uppercase truncate">{w.title}</div>
                  </div>
                ))}
                {userWorks.length === 0 && <p className="col-span-4 py-20 text-center text-zinc-300 uppercase text-[10px]">No active publications.</p>}
              </div>
           </section>
        </div>
      </div>
    </div>
  );
};

const ArchiveView = ({ setSelectedWork }: { setSelectedWork: (w: Work) => void }) => {
  const { works, currentUser } = useApp();
  const [filter, setFilter] = useState<WorkLanguage | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => works.filter(w => {
    const matchesLang = filter === 'ALL' || w.language === filter;
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase()) || w.authorName.toLowerCase().includes(search.toLowerCase());
    return w.status === WorkStatus.PUBLISHED && !currentUser?.blockedUserIds.includes(w.authorId) && matchesLang && matchesSearch;
  }), [works, filter, search, currentUser]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="flex flex-wrap gap-4 items-center bg-white border-2 border-black p-4 shadow-[5px_5px_0px_black]">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="w-full pl-10 pr-4 py-2 border-2 border-zinc-100 font-mono text-[11px] uppercase outline-none focus:border-black" placeholder="Search Node..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('ALL')} className={`px-4 py-2 border-2 font-mono text-[10px] uppercase ${filter === 'ALL' ? 'bg-black text-white' : 'bg-white'}`}>All</button>
          {Object.values(WorkLanguage).map(lang => (
            <button key={lang} onClick={() => setFilter(lang)} className={`px-4 py-2 border-2 font-mono text-[10px] uppercase ${filter === lang ? 'bg-black text-white' : 'bg-white'}`}>{lang}</button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-10">
        {filtered.map(w => <WorkCard key={w.id} work={w} onClick={setSelectedWork} />)}
        {filtered.length === 0 && <p className="col-span-full py-40 text-center text-zinc-300 italic uppercase text-xs">No matching nodes in archive.</p>}
      </div>
    </div>
  );
};

const MessagesView = () => {
  const { messages, currentUser, sendMessage, allUsers } = useApp();
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const chatMessages = useMemo(() => {
    if (!selectedRecipientId) return [];
    return messages.filter(m => (m.senderId === currentUser?.id && m.receiverId === selectedRecipientId) || (m.senderId === selectedRecipientId && m.receiverId === currentUser?.id));
  }, [messages, selectedRecipientId, currentUser]);

  const handleSend = () => { if (!input.trim() || !selectedRecipientId) return; sendMessage(selectedRecipientId, input); setInput(''); };

  return (
    <div className="max-w-5xl mx-auto space-box flex h-[600px] border-2 shadow-[15px_15px_0px_black] bg-white text-left">
      <div className="w-72 border-r-2 border-black flex flex-col bg-zinc-50">
        <div className="space-header text-[10px]">Dialogue Channels</div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {allUsers.filter(u => u.id !== currentUser?.id).map(user => (
            <button key={user.id} onClick={() => setSelectedRecipientId(user.id)} className={`w-full p-4 text-left border-b border-zinc-200 flex items-center gap-3 ${selectedRecipientId === user.id ? 'bg-[#1a237e] text-white' : 'hover:bg-zinc-200'}`}>
              <div className="w-8 h-8 rounded-full border border-black overflow-hidden grayscale"><img src={user.avatar} className="w-full h-full object-cover" /></div>
              <div className="text-[10px] font-bold font-mono uppercase truncate">{user.name}</div>
            </button>
          ))}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedRecipientId ? (
          <>
            <div className="bg-zinc-100 p-4 border-b border-black text-[10px] font-bold uppercase">{allUsers.find(u => u.id === selectedRecipientId)?.name}</div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4 font-mono text-[11px]">
               {chatMessages.map(msg => (
                 <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                   <div className={`p-3 border-2 border-black max-w-[80%] ${msg.senderId === currentUser?.id ? 'bg-zinc-900 text-white' : 'bg-white'}`}>{msg.content}</div>
                 </div>
               ))}
            </div>
            <div className="p-4 border-t border-black bg-zinc-50 flex gap-2">
              <input className="flex-1 p-2 border-2 border-black font-mono text-xs uppercase" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSend()} />
              <button onClick={handleSend} className="bg-black text-white px-4 font-bold uppercase text-[10px]">Send</button>
            </div>
          </>
        ) : <div className="flex-1 flex items-center justify-center opacity-20 uppercase font-mono text-xs">Select a Dialogue Channel</div>}
      </div>
    </div>
  );
};

const FoldersView = ({ setSelectedWork }: { setSelectedWork: (w: Work) => void }) => {
  const { folders, works, createFolder } = useApp();
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreate = () => { if (!newFolderName.trim()) return; createFolder(newFolderName, 'public', 'owner'); setNewFolderName(''); };

  return (
    <div className="space-y-12 animate-in slide-in-from-bottom-8 duration-700 text-left">
      <div className="space-box p-8 max-w-md mx-auto border-2 shadow-[8px_8px_0px_black] bg-white">
        <h3 className="text-xs font-bold uppercase mb-4">Establish New Collection</h3>
        <input className="w-full p-3 border-2 border-black font-mono text-xs mb-4" placeholder="Collection Name..." value={newFolderName} onChange={e => setNewFolderName(e.target.value)}/>
        <button onClick={handleCreate} className="w-full bg-black text-white p-2 font-bold uppercase text-[10px]">Initiate Node</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-4">
        {folders.map(f => (
          <div key={f.id} className="space-box border-2 flex flex-col bg-white shadow-[6px_6px_0px_black]">
            <div className="space-header px-4 py-2 bg-[#1a237e] uppercase font-mono text-[10px] tracking-widest">{f.name}</div>
            <div className="p-6 grid grid-cols-4 gap-4 min-h-[100px]">
               {f.workIds.map(wid => {
                 const w = works.find(item => item.id === wid);
                 return w ? <div key={wid} className="cursor-pointer group aspect-square border border-black grayscale transition-all" onClick={() => setSelectedWork(w)}><img src={w.thumbnail} className="w-full h-full object-cover" /></div> : null;
               })}
               {f.workIds.length === 0 && <p className="col-span-4 text-center py-8 text-zinc-300 italic text-[10px] uppercase">Node Empty.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ManifestoView = () => (
  <div className="max-w-4xl mx-auto space-box p-12 border-2 bg-white font-serif leading-relaxed shadow-[20px_20px_0px_rgba(0,0,0,0.1)] text-left animate-in zoom-in duration-700">
    <h2 className="text-6xl font-mono font-bold uppercase italic border-b-4 border-black pb-8 mb-12 tracking-tighter text-[#1a237e]">MANIFESTO</h2>
    <div className="space-y-10 text-zinc-800 text-xl">
      <p className="text-4xl font-mono font-bold uppercase border-l-8 border-black pl-8 italic">KOMOREBI is not a social network.</p>
      <p>It is not an industrial catalog nor a trend platform. It is a workspace.</p>
      <p>Original creations in different languages: audiovisual, auditory, visual and essay. Works produced and shared by those who create them.</p>
      <div className="bg-zinc-900 text-white p-12 shadow-[10px_10px_0px_orange] italic text-2xl">
        "Coexistence between romanticism and hedonism: profound emotion and conscious pleasure."
      </div>
      <p>We do not deny desire, fear or discomfort. We name them. Any work exploring sensitive territory is marked.</p>
      <p className="border-t border-black pt-8 text-sm font-mono uppercase">Publication is a creative act. Persistence is a curated act. This space is a niche by choice. Not for everyone. And that is its meaning.</p>
    </div>
  </div>
);

const ModerationView = ({ setSelectedWork }: { setSelectedWork: (w: Work) => void }) => {
  const { works, updateWorkStatus } = useApp();
  const pendingWorks = works.filter(w => w.status === WorkStatus.PENDING);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 text-left">
      <div className="space-box p-8 border-2 bg-emerald-50 border-emerald-500 shadow-[8px_8px_0px_rgba(16,185,129,0.2)]">
        <h3 className="text-xl font-mono font-bold uppercase italic mb-6 text-emerald-900">Moderation Queue</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {pendingWorks.map(w => (
            <div key={w.id} className="space-y-2">
              <WorkCard work={w} onClick={setSelectedWork} />
              <div className="flex gap-1">
                <button onClick={() => updateWorkStatus(w.id, WorkStatus.PUBLISHED)} className="flex-1 bg-emerald-600 text-white text-[8px] font-bold py-1 uppercase">Approve</button>
                <button onClick={() => updateWorkStatus(w.id, WorkStatus.REJECTED)} className="flex-1 bg-red-600 text-white text-[8px] font-bold py-1 uppercase">Reject</button>
              </div>
            </div>
          ))}
          {pendingWorks.length === 0 && <p className="col-span-full py-20 text-center opacity-30 font-mono text-xs uppercase">Queue Nominal. No pending nodes.</p>}
        </div>
      </div>
    </div>
  );
};

const HeaderSection = ({ setView }: { setView: (v: ViewState) => void }) => (
  <header className="max-w-6xl mx-auto py-8 px-4 flex flex-col items-center">
    <div className="flex items-center gap-4 mb-6 cursor-pointer group" onClick={() => setView('PORTAL')}>
      <KomorebiLogo size={48} className="invert brightness-0 group-hover:rotate-12 transition-transform duration-500" />
      <h1 className="text-5xl font-mono font-bold tracking-tighter text-black uppercase italic">KOMOREBI <span className="text-[10px] not-italic tracking-[0.2em] text-zinc-400 ml-2">SYSTEM_ARCHIVE</span></h1>
    </div>
    <div className="w-full max-w-2xl flex justify-center gap-0.5 text-[11px] font-bold uppercase tracking-widest bg-white border border-black p-1 shadow-[4px_4px_0px_black]">
      <button onClick={() => setView('PORTAL')} className="flex-1 py-1.5 hover:bg-zinc-100 border-r border-zinc-200">Home</button>
      <button onClick={() => setView('ARCHIVE')} className="flex-1 py-1.5 hover:bg-zinc-100 border-r border-zinc-200">Explore</button>
      <button onClick={() => setView('PROFILE')} className="flex-1 py-1.5 hover:bg-zinc-100 border-r border-zinc-200">Profile</button>
      <button onClick={() => setView('FOLDERS')} className="flex-1 py-1.5 hover:bg-zinc-100">Folders</button>
    </div>
  </header>
);

const AppContent = () => {
  const { works, currentUser, localTheme } = useApp();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [view, setView] = useState<ViewState>('PORTAL');

  if (!currentUser) return <AuthView />;

  return (
    <div 
      className="min-h-screen pb-32 bg-[#d1d9e6] selection:bg-orange-500 transition-all duration-1000 text-center"
      style={{ 
        backgroundImage: localTheme.platformBackground ? `url(${localTheme.platformBackground})` : undefined,
        backgroundSize: 'cover', backgroundAttachment: 'fixed',
        backgroundColor: localTheme.platformBackground ? 'black' : '#d1d9e6'
      }}
    >
      <div style={{ opacity: localTheme.platformOpacity }}>
        <TopNav currentView={view} setView={setView} />
        <HeaderSection setView={setView} />
        <main className="max-w-6xl mx-auto px-6">
          {view === 'PORTAL' && <PortalView setSelectedWork={setSelectedWork} />}
          {view === 'ARCHIVE' && <ArchiveView setSelectedWork={setSelectedWork} />}
          {view === 'PROFILE' && <ProfileView />}
          {view === 'FOLDERS' && <FoldersView setSelectedWork={setSelectedWork} />}
          {view === 'MESSAGES' && <MessagesView />}
          {view === 'MANIFESTO' && <ManifestoView />}
          {view === 'MODERATION' && <ModerationView setSelectedWork={setSelectedWork} />}
        </main>
        
        {currentUser && (
          <button onClick={() => setIsUploadOpen(true)} className="fixed bottom-12 right-12 w-20 h-20 bg-white text-black border-4 border-black flex items-center justify-center shadow-[10px_10px_0px_black] hover:bg-orange-600 hover:text-white transition-all z-[100] active:translate-x-1 active:translate-y-1 active:shadow-none">
            <Plus size={40} />
          </button>
        )}

        {selectedWork && <WorkViewer work={selectedWork} onClose={() => setSelectedWork(null)} />}
        {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}

        <footer className="fixed bottom-0 w-full bg-zinc-900 text-white p-3 text-[9px] font-mono uppercase tracking-[0.4em] flex justify-between px-12 items-center border-t border-white/20 opacity-90 z-[105]">
          <span>Status: Nominal</span>
          <div className="hidden md:flex gap-12"><span>Nodes: {works.length}</span><span>User: {currentUser.username}</span></div>
          <span>KOMOREBI_ARCHIVE © 2025</span>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => (<AppProvider><AppContent /></AppProvider>);
export default App;
