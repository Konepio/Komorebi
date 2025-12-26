
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
      const isEmail = form.contact.includes('@');
      register({ 
        username: form.username, 
        password: form.password, 
        name: form.name, 
        email: isEmail ? form.contact : undefined, 
        phone: !isEmail ? form.contact : undefined 
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
            <input className="w-full p-4 border-2 border-black font-mono text-sm outline-none focus:bg-white" value={form.username} onChange={e => setForm({...form, username: e.target.value})} />
          </div>

          <div className="space-y-1">
            <label className="text-[9px] font-bold uppercase opacity-50">Password</label>
            <input type="password" className="w-full p-4 border-2 border-black font-mono text-sm outline-none focus:bg-white" value={form.password} onChange={e => setForm({...form, password: e.target.value})} />
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

          <button type="submit" className="w-full bg-[#1a237e] text-white p-4 font-bold uppercase tracking-widest text-xs shadow-[5px_5px_0px_black] active:shadow-none active:translate-x-1 active:translate-y-1 transition-all">
            {isRegister ? 'Register Node' : 'Synchronize'}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-zinc-100">
          <button onClick={() => { setIsRegister(!isRegister); setError(''); }} className="text-[10px] font-bold uppercase underline hover:text-orange-600">
            {isRegister ? 'I already have a node' : 'Create new work node'}
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
        <button onClick={() => setView('PORTAL')} className={`hover:text-orange-400 ${currentView === 'PORTAL' ? 'text-orange-400 underline' : ''}`}>Portal</button>
        <button onClick={() => setView('ARCHIVE')} className={`hover:text-orange-400 ${currentView === 'ARCHIVE' ? 'text-orange-400 underline' : ''}`}>Explore</button>
        {currentUser?.role !== UserRole.GUEST && (
          <><button onClick={() => setView('MESSAGES')} className={`hover:text-orange-400 ${currentView === 'MESSAGES' ? 'text-orange-400 underline' : ''}`}>Dialogue</button>
          <button onClick={() => setView('FOLDERS')} className={`hover:text-orange-400 ${currentView === 'FOLDERS' ? 'text-orange-400 underline' : ''}`}>Folders</button></>
        )}
        <button onClick={() => setView('MANIFESTO')} className={`hover:text-orange-400 ${currentView === 'MANIFESTO' ? 'text-orange-400 underline' : ''}`}>Manifesto</button>
        {canModerate && <button onClick={() => setView('MODERATION')} className={`hover:text-emerald-400 ${currentView === 'MODERATION' ? 'text-emerald-400 underline font-black' : ''}`}>[MODERATION]</button>}
      </div>
      <div className="flex gap-4 items-center">
        <div className="relative">
          <button onClick={() => setShowThemePanel(!showThemePanel)} className="hover:text-orange-400 flex items-center gap-1"><Palette size={10}/> [Personal Aesthetics]</button>
          {showThemePanel && (
            <div className="absolute top-full right-0 mt-1 bg-white border-2 border-black shadow-[4px_4px_0px_black] p-4 min-w-[200px] z-[200] text-black text-left">
              <p className="text-[9px] font-bold uppercase border-b border-black pb-1 mb-2">Individual Freedom of Visualization</p>
              <div className="space-y-3">
                <input 
                  className="w-full text-[8px] border p-1" 
                  placeholder="Background URL (Personal)..." 
                  value={localTheme.platformBackground}
                  onChange={e => updateLocalTheme({...localTheme, platformBackground: e.target.value})}
                />
                <div className="flex justify-between items-center">
                  <span className="text-[8px] uppercase">Opacity</span>
                  <input 
                    type="range" min="0" max="1" step="0.1" 
                    value={localTheme.platformOpacity}
                    onChange={e => updateLocalTheme({...localTheme, platformOpacity: parseFloat(e.target.value)})}
                  />
                </div>
                <button onClick={() => updateLocalTheme({ platformBackground: '', platformOpacity: 1 })} className="text-[8px] underline uppercase">Reset Original</button>
              </div>
            </div>
          )}
        </div>
        {currentUser && (
          <><button onClick={() => setView('PROFILE')} className="hover:text-orange-400 underline flex items-center gap-1"><UserIcon size={10} /> {currentUser.name}</button>
          <button onClick={logout} className="hover:text-orange-400 text-zinc-400 flex items-center gap-1"><LogIn size={10}/> [Exit]</button></>
        )}
      </div>
    </div>
  );
};

const Header = ({ setView }: { setView: (v: ViewState) => void }) => (
  <header className="max-w-6xl mx-auto py-8 px-4 flex flex-col items-center">
    <div className="flex items-center gap-4 mb-6 cursor-pointer group" onClick={() => setView('PORTAL')}>
      <KomorebiLogo size={48} className="invert brightness-0 group-hover:rotate-12 transition-transform duration-500" />
      <h1 className="text-5xl font-mono font-bold tracking-tighter text-black uppercase italic">KOMOREBI <span className="text-[10px] not-italic tracking-[0.2em] text-zinc-400 ml-2">ARCHIVE_V_FINAL</span></h1>
    </div>
    <div className="w-full max-w-2xl flex justify-center gap-0.5 text-[11px] font-bold uppercase tracking-widest bg-white border border-black p-1 shadow-[4px_4px_0px_black]">
      <button onClick={() => setView('PORTAL')} className="flex-1 py-1.5 hover:bg-zinc-100 border-r border-zinc-200 flex items-center justify-center gap-2"><Home size={12}/> Home</button>
      <button onClick={() => setView('ARCHIVE')} className="flex-1 py-1.5 hover:bg-zinc-100 border-r border-zinc-200 flex items-center justify-center gap-2"><ArchiveIcon size={12}/> Explore</button>
      <button onClick={() => setView('PROFILE')} className="flex-1 py-1.5 hover:bg-zinc-100 border-r border-zinc-200 flex items-center justify-center gap-2"><UserIcon size={12}/> Profile</button>
      <button onClick={() => setView('FOLDERS')} className="flex-1 py-1.5 hover:bg-zinc-100 flex items-center justify-center gap-2"><Star size={12}/> Folders</button>
    </div>
  </header>
);

interface PortalViewProps {
  setSelectedWork: (w: Work) => void;
  onSensitivitySelect: (s: Sensitivity) => void;
}

const PortalView: React.FC<PortalViewProps> = ({ setSelectedWork, onSensitivitySelect }) => {
  const { works, currentUser } = useApp();
  const filteredWorks = useMemo(() => works.filter(w => w.status === WorkStatus.PUBLISHED && !currentUser?.blockedUserIds.includes(w.authorId)), [works, currentUser]);

  const categorizedWorks = useMemo<Record<string, Work[]>>(() => ({
    [WorkLanguage.AUDIOVISUAL]: filteredWorks.filter(w => w.language === WorkLanguage.AUDIOVISUAL).slice(0, 4),
    [WorkLanguage.AUDIO]: filteredWorks.filter(w => w.language === WorkLanguage.AUDIO).slice(0, 4),
    [WorkLanguage.VISUAL]: filteredWorks.filter(w => w.language === WorkLanguage.VISUAL).slice(0, 4),
    [WorkLanguage.ESSAY]: filteredWorks.filter(w => w.language === WorkLanguage.ESSAY).slice(0, 4),
  }), [filteredWorks]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 animate-in fade-in duration-700 text-left">
      <div className="md:col-span-4 space-y-6">
        <div className="space-box p-4 border-2">
          <h2 className="text-xl font-bold mb-4 font-mono uppercase italic border-b border-zinc-100 pb-2 flex items-center gap-2 text-[#1a237e]"><Terminal size={18} /> STATUS_REPORT</h2>
          <div className="flex gap-4 mb-6">
            <div className="w-24 h-24 bg-zinc-900 border border-black flex items-center justify-center relative overflow-hidden group">
               <Clover className="absolute text-white opacity-20 animate-spin-slow group-hover:opacity-60 transition-opacity" size={40} />
               <div className="text-white font-mono text-[8px] z-10 text-center px-1 uppercase">ENCRYPTION_SYNC</div>
            </div>
            <div className="flex-1 text-[10px] font-mono leading-tight space-y-2">
              <p className="text-zinc-500 uppercase tracking-tighter">Connection: <span className="text-emerald-500">Nominal</span></p>
              <p>Buffer_Nodes: {filteredWorks.length}</p>
              <p>Role: <span className="text-orange-500 uppercase">{currentUser?.role || 'Guest'}</span></p>
              {currentUser?.role === UserRole.USER && <div className="mt-1 text-[8px] font-bold text-[#1a237e] uppercase italic">Progress: {currentUser.verifiedProgress}/3 verification nodes</div>}
            </div>
          </div>
          <p className="bg-zinc-50 p-3 border italic font-serif text-[11px] text-zinc-600 leading-relaxed border-l-4 border-orange-600">"Komorebi exists for those who create with intention and conscious pleasure."</p>
        </div>

        <div className="space-box shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
          <div className="space-header flex items-center gap-2 uppercase tracking-widest text-[10px]"><Activity size={14}/> Recent Sync</div>
          <div className="p-4 space-y-3 font-mono text-[10px]">
            {filteredWorks.slice(0, 4).map(w => (
              <div key={w.id} className="flex gap-2 border-b border-zinc-100 pb-2 last:border-none group cursor-pointer" onClick={() => setSelectedWork(w)}>
                <span className="font-bold text-[#1a237e] uppercase">>></span>
                <span className="truncate">{w.authorName}: "{w.title}"</span>
              </div>
            ))}
          </div>
        </div>

        <div className="space-box shadow-[4px_4px_0px_rgba(0,0,0,0.05)]">
          <div className="space-header flex items-center gap-2 uppercase tracking-widest text-[10px] bg-zinc-800"><AlertTriangle size={14}/> Sensitivity Index</div>
          <div className="p-4 grid grid-cols-2 gap-2">
            {Object.entries(SENSITIVITY_ICONS).map(([name, icon]) => (
              <button 
                key={name} 
                onClick={() => onSensitivitySelect(name as Sensitivity)}
                className="flex items-center gap-2 text-[8px] font-mono uppercase text-zinc-500 border border-zinc-100 p-1.5 hover:bg-zinc-50 hover:border-black transition-all"
              >
                {icon} <span className="truncate">{name.toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="md:col-span-8 space-y-10">
        <div className="space-box p-10 bg-white border-2 border-black relative overflow-hidden">
          <h2 className="text-4xl font-mono font-bold mb-6 uppercase italic tracking-tighter text-[#1a237e]">Archive of Intent</h2>
          <p className="font-serif text-xl italic text-zinc-600 leading-relaxed border-l-2 border-orange-500 pl-6">"Embrace romanticism and hedonism: profound emotion and conscious pleasure."</p>
        </div>

        {(Object.entries(categorizedWorks) as [string, Work[]][]).map(([lang, items]) => (
          items.length > 0 && (
            <div key={lang} className="space-box shadow-[6px_6px_0px_rgba(0,0,0,0.1)] border-2">
              <div className="space-header flex justify-between items-center px-4 py-3 bg-[#1a237e]">
                <span className="flex items-center gap-3 uppercase font-mono tracking-widest text-sm">{LANGUAGE_ICONS[lang as WorkLanguage]} {lang.toUpperCase()} SECTION</span>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
                  {items.map(work => <WorkCard key={work.id} work={work} onClick={setSelectedWork} />)}
                </div>
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
  const [themeData, setThemeData] = useState<ProfileTheme>(currentUser?.theme || { backgroundColor: '#ffffff', headerColor: '#1a237e', textColor: '#000000', accentColor: '#ff4d00', fontFamily: 'Verdana', borderStyle: 'solid' });

  const handleSave = () => { updateProfile({ ...profileData, theme: themeData }); setIsEditing(false); setIsThemeEditing(false); };
  
  const userWorks = works.filter(w => w.authorId === currentUser?.id);
  const favoriteWorks = userWorks.slice(0, 4); 
  const userFolders = folders.filter(f => f.ownerId === currentUser?.id);

  // Amigos funcionales: gente que sigues o te sigue
  const friends = allUsers.filter(u => currentUser?.followingIds.includes(u.id) || currentUser?.followerIds.includes(u.id));

  if (!currentUser) return null;

  const stats = [
    { label: 'Works', value: userWorks.length },
    { label: 'Folders', value: userFolders.length },
    { label: 'Followers', value: currentUser.followerIds.length }, 
    { label: 'Following', value: currentUser.followingIds.length }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in slide-in-from-bottom-6 duration-700 text-left">
      <div className="relative">
        <div className="h-48 bg-zinc-800 border-2 border-black overflow-hidden shadow-[8px_8px_0px_black] relative">
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]"></div>
        </div>
        
        <div className="flex flex-col md:flex-row items-end gap-6 -mt-16 px-8 relative z-10">
          <div className="w-40 h-40 border-4 border-black bg-white overflow-hidden shadow-[6px_6px_0px_black] group relative">
            <img src={currentUser.avatar} className="w-full h-full object-cover grayscale transition-all group-hover:grayscale-0" />
            <div className="absolute top-1 right-1 bg-black text-white px-1 py-0.5 text-[8px] font-mono uppercase">{currentUser.role}</div>
          </div>
          
          <div className="flex-1 flex flex-col md:flex-row justify-between items-end pb-2 gap-4">
            <div>
              <h1 className="text-4xl font-mono font-bold uppercase italic tracking-tighter text-black bg-white px-2 border-2 border-black shadow-[4px_4px_0px_black]">{currentUser.name}</h1>
              <p className="text-xs font-mono font-bold text-zinc-400 mt-2 uppercase tracking-[0.2em]">@{currentUser.username}</p>
            </div>
            
            <div className="flex gap-10 bg-white border-2 border-black p-4 shadow-[4px_4px_0px_black]">
              {stats.map(s => (
                <div key={s.label} className="text-center">
                  <div className="text-lg font-mono font-bold leading-none">{s.value}</div>
                  <div className="text-[8px] font-mono font-bold uppercase text-zinc-400 tracking-widest">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        <div className="md:col-span-4 space-y-8">
          <div className="space-box border-2 shadow-[6px_6px_0px_black] p-6" style={{ backgroundColor: themeData.backgroundColor, color: themeData.textColor, fontFamily: themeData.fontFamily, borderStyle: themeData.borderStyle }}>
            <div className="space-header mb-4 text-[10px]" style={{ backgroundColor: themeData.headerColor }}>{currentUser.name.toUpperCase()}'S BLING_INFO</div>
            
            {isEditing ? (
              <div className="space-y-4 bg-zinc-50 p-4 border border-black text-black font-mono text-[10px]">
                <div className="space-y-1">
                  <label className="uppercase opacity-50">Public Name</label>
                  <input className="w-full p-2 border border-black" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} />
                </div>
                <div className="space-y-1">
                  <label className="uppercase opacity-50">Avatar URL</label>
                  <input className="w-full p-2 border border-black" value={profileData.avatar} onChange={e => setProfileData({...profileData, avatar: e.target.value})} placeholder="https://..." />
                </div>
                <div className="space-y-1">
                  <label className="uppercase opacity-50">Custom Manifesto / Bio</label>
                  <textarea className="w-full p-2 border border-black h-32" value={profileData.bio} onChange={e => setProfileData({...profileData, bio: e.target.value})} />
                </div>
                <button onClick={handleSave} className="w-full bg-black text-white p-2 uppercase font-bold">Sync Profile</button>
              </div>
            ) : isThemeEditing ? (
              <div className="space-y-4 bg-zinc-50 p-4 border border-black text-black font-mono text-[10px]">
                 <div className="grid grid-cols-2 gap-2">
                   <div className="space-y-1">
                     <label className="uppercase opacity-50">Background</label>
                     <input type="color" className="w-full h-8" value={themeData.backgroundColor} onChange={e => setThemeData({...themeData, backgroundColor: e.target.value})} />
                   </div>
                   <div className="space-y-1">
                     <label className="uppercase opacity-50">Header Color</label>
                     <input type="color" className="w-full h-8" value={themeData.headerColor} onChange={e => setThemeData({...themeData, headerColor: e.target.value})} />
                   </div>
                 </div>
                 <div className="space-y-1">
                   <label className="uppercase opacity-50">Typeface</label>
                   <select className="w-full border border-black p-2" value={themeData.fontFamily} onChange={e => setThemeData({...themeData, fontFamily: e.target.value as any})}>
                      <option value="Verdana">Verdana</option>
                      <option value="Space Mono">Space Mono</option>
                      <option value="serif">Classic Serif</option>
                      <option value="sans-serif">Modern Sans</option>
                   </select>
                 </div>
                 <button onClick={handleSave} className="w-full bg-[#1a237e] text-white p-2 uppercase font-bold">Publish Theme</button>
                 <button onClick={() => setIsThemeEditing(false)} className="w-full border border-black p-1">Cancel</button>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="prose prose-sm leading-relaxed whitespace-pre-wrap italic">
                  {currentUser.bio || "This node has chosen silence as its primary aesthetic expression."}
                </div>
                
                <div className="flex flex-col gap-2 pt-4 border-t border-black/10">
                  <button onClick={() => setIsEditing(true)} className="w-full border-2 border-black bg-white p-2 text-[9px] font-bold uppercase hover:bg-zinc-100 flex items-center justify-center gap-2 shadow-[2px_2px_0px_black]"><Settings size={12}/> Edit Profile</button>
                  <button onClick={() => setIsThemeEditing(true)} className="w-full bg-[#1a237e] text-white p-2 text-[9px] font-bold uppercase hover:bg-orange-600 flex items-center justify-center gap-2 shadow-[2px_2px_0px_black]"><Palette size={12}/> Customize Space</button>
                </div>
              </div>
            )}
          </div>

          <div className="space-box border-2 shadow-[6px_6px_0px_black] p-6 bg-white">
            <div className="space-header mb-4 text-[10px] bg-zinc-800 flex items-center gap-2"><Users size={12}/> NODE_NETWORK (CONNECTIONS)</div>
            <div className="grid grid-cols-4 gap-2">
              {friends.length > 0 ? friends.map(u => (
                <div key={u.id} className="text-center group cursor-pointer" title={u.name}>
                  <div className="aspect-square border border-black grayscale group-hover:grayscale-0 overflow-hidden mb-1">
                    <img src={u.avatar} className="w-full h-full object-cover" />
                  </div>
                  <div className="text-[7px] font-bold uppercase truncate">{u.name.split(' ')[0]}</div>
                </div>
              )) : (
                <div className="col-span-4 text-center py-4 text-[8px] font-mono text-zinc-300 uppercase italic">No connections yet.</div>
              )}
            </div>
          </div>
        </div>

        <div className="md:col-span-8 space-y-12">
          <section className="space-y-4">
            <div className="flex justify-between items-end border-b-2 border-black pb-2">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[#1a237e]"><Heart size={14} className="fill-[#1a237e]"/> PINNED_ARCHIVE</h3>
            </div>
            <div className="grid grid-cols-4 gap-4">
              {favoriteWorks.length > 0 ? favoriteWorks.map(w => (
                <div key={w.id} className="group cursor-pointer">
                  <div className="aspect-[2/3] border-2 border-black bg-zinc-100 shadow-[4px_4px_0px_black] group-hover:shadow-[6px_6px_0px_#1a237e] transition-all overflow-hidden relative">
                    <img src={w.thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 duration-500" />
                  </div>
                  <div className="text-[8px] font-bold uppercase mt-2 line-clamp-1 italic">{w.title}</div>
                </div>
              )) : (
                <div className="col-span-4 py-12 text-center border-2 border-dashed border-zinc-200 text-zinc-300 font-mono text-[10px] uppercase">No works published.</div>
              )}
            </div>
          </section>

          <section className="space-y-4">
            <div className="flex justify-between items-end border-b-2 border-black pb-2">
              <h3 className="text-[10px] font-mono font-bold uppercase tracking-widest flex items-center gap-2 text-[#1a237e]"><Activity size={14}/> RECENT_SYNC_ACTIVITY</h3>
            </div>
            <div className="space-y-2">
              {userWorks.slice(0, 10).map(w => (
                <div key={w.id} className="flex items-center gap-4 bg-white border border-zinc-100 p-3 hover:border-black group cursor-pointer transition-colors shadow-sm">
                  <div className="w-10 h-10 border border-black grayscale group-hover:grayscale-0">
                    <img src={w.thumbnail} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[11px] font-bold uppercase italic leading-tight">{w.title}</div>
                    <div className="text-[8px] font-mono text-zinc-400 mt-0.5">{new Date(w.createdAt).toLocaleDateString()} — {w.language.toUpperCase()}</div>
                  </div>
                </div>
              ))}
              {userWorks.length === 0 && (
                <div className="py-20 text-center text-zinc-200 font-mono text-[10px] uppercase italic">No activity recorded in this node.</div>
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const ArchiveView = ({ 
  setSelectedWork, 
  activeSensitivities, 
  setActiveSensitivities 
}: { 
  setSelectedWork: (w: Work) => void;
  activeSensitivities: Sensitivity[];
  setActiveSensitivities: React.Dispatch<React.SetStateAction<Sensitivity[]>>;
}) => {
  const { works, currentUser } = useApp();
  const [filter, setFilter] = useState<WorkLanguage | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const publishedWorks = useMemo(() => works.filter(w => w.status === WorkStatus.PUBLISHED && !currentUser?.blockedUserIds.includes(w.authorId)), [works, currentUser]);
  const forYou = useMemo(() => [...publishedWorks].sort(() => 0.5 - Math.random()).slice(0, 3), [publishedWorks]);

  const filtered = publishedWorks.filter(w => {
    const matchesLang = filter === 'ALL' || w.language === filter;
    const matchesSearch = w.title.toLowerCase().includes(search.toLowerCase()) || w.authorName.toLowerCase().includes(search.toLowerCase());
    const matchesSensitivity = activeSensitivities.length === 0 || activeSensitivities.every(s => w.sensitivities.includes(s));
    return matchesLang && matchesSearch && matchesSensitivity;
  });

  return (
    <div className="space-y-12 animate-in fade-in duration-1000 text-left">
      {forYou.length > 0 && (
        <section className="space-box p-8 border-2 bg-gradient-to-br from-zinc-50 to-white shadow-[10px_10px_0px_rgba(0,0,0,0.05)]">
          <h3 className="text-xl font-mono font-bold uppercase italic mb-6 flex items-center gap-2 text-[#1a237e]"><Sparkles size={18} /> For Your Contemplation</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {forYou.map(w => (
              <div key={w.id} className="flex gap-4 border-l-2 border-orange-500 pl-4 group cursor-pointer" onClick={() => setSelectedWork(w)}>
                <div className="w-20 h-20 border border-black bg-zinc-200 overflow-hidden flex-shrink-0 grayscale group-hover:grayscale-0 transition-all"><img src={w.thumbnail} className="w-full h-full object-cover" /></div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-blue-800 uppercase truncate">{w.authorName}</div>
                  <div className="text-[13px] font-bold uppercase leading-tight italic line-clamp-2">{w.title}</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap gap-4 items-center bg-white border-2 border-black p-4 shadow-[5px_5px_0px_black]">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input className="w-full pl-10 pr-4 py-2 border-2 border-zinc-100 font-mono text-[11px] uppercase focus:border-black outline-none" placeholder="Search Node..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="flex gap-2">
          <button onClick={() => setFilter('ALL')} className={`px-4 py-2 border-2 font-mono text-[10px] uppercase ${filter === 'ALL' ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}>All</button>
          {Object.values(WorkLanguage).map(lang => (
            <button key={lang} onClick={() => setFilter(lang)} className={`px-4 py-2 border-2 font-mono text-[10px] uppercase ${filter === lang ? 'bg-black text-white' : 'hover:bg-zinc-100'}`}>{lang}</button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-10">
        {filtered.map(w => <WorkCard key={w.id} work={w} onClick={setSelectedWork} />)}
        {filtered.length === 0 && (
          <div className="col-span-full py-20 text-center opacity-30 font-mono text-xs uppercase tracking-widest">Archive is empty.</div>
        )}
      </div>
    </div>
  );
};

// ... Rest of the components stay the same as in previous turn ...
const ManifestoView = () => (
  <div className="max-w-4xl mx-auto space-box p-12 lg:p-20 border-2 bg-white font-serif leading-relaxed shadow-[20px_20px_0px_rgba(0,0,0,0.1)] relative overflow-hidden animate-in zoom-in duration-700 text-left max-h-[85vh] overflow-y-auto no-scrollbar">
    <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Clover size={400} strokeWidth={0.5} /></div>
    <div className="relative z-10 space-y-16">
      <div className="text-center">
        <h2 className="text-6xl font-mono font-bold uppercase italic border-b-4 border-black pb-8 mb-4 tracking-tighter text-[#1a237e]">MANIFESTO</h2>
        <p className="text-xs font-mono uppercase tracking-[0.6em] text-zinc-400">KOMOREBI SYSTEM // V2.5_FINAL</p>
      </div>

      <div className="space-y-12 text-zinc-800">
        <section className="space-y-4">
          <p className="text-4xl font-mono font-bold uppercase tracking-tighter border-l-8 border-black pl-8 italic">KOMOREBI is not a social network.</p>
          <p className="text-xl italic">It is not an industrial catalog nor a trend platform. It is a workspace.</p>
          <p className="text-lg">Original creations in different languages: audiovisual, auditory, visual and essay. Works produced and shared by those who create them.</p>
        </section>
      </div>
    </div>
  </div>
);

const MessagesView = () => {
  const { messages, currentUser, sendMessage, allUsers, threads, joinThread, createThread } = useApp();
  const [selectedRecipientId, setSelectedRecipientId] = useState<string | null>(null);
  const [isThreadView, setIsThreadView] = useState(false);
  const [tab, setTab] = useState<'DM' | 'GROUPS'>('DM');
  const [input, setInput] = useState('');

  const chatMessages = useMemo(() => {
    if (!selectedRecipientId) return [];
    if (isThreadView) return messages.filter(m => m.receiverId === selectedRecipientId && m.isThreadMessage);
    return messages.filter(m => (m.senderId === currentUser?.id && m.receiverId === selectedRecipientId && !m.isThreadMessage) || (m.senderId === selectedRecipientId && m.receiverId === currentUser?.id && !m.isThreadMessage));
  }, [messages, selectedRecipientId, isThreadView, currentUser]);

  const handleSend = () => { if (!input.trim() || !selectedRecipientId) return; sendMessage(selectedRecipientId, input, isThreadView); setInput(''); };

  return (
    <div className="max-w-5xl mx-auto space-box flex h-[700px] border-2 shadow-[15px_15px_0px_black] bg-white overflow-hidden text-left">
      <div className="w-80 border-r-2 border-black flex flex-col bg-zinc-100">
        <div className="space-header flex items-center gap-2 uppercase tracking-widest text-[10px]"><Terminal size={14}/> DIALOGUE_NETWORK</div>
        <div className="flex border-b border-black">
          <button onClick={() => setTab('DM')} className={`flex-1 p-3 text-[10px] font-bold uppercase ${tab === 'DM' ? 'bg-black text-white' : 'hover:bg-zinc-200'}`}>Direct</button>
          <button onClick={() => setTab('GROUPS')} className={`flex-1 p-3 text-[10px] font-bold uppercase ${tab === 'GROUPS' ? 'bg-black text-white' : 'hover:bg-zinc-200'}`}>Discussions</button>
        </div>
        <div className="flex-1 overflow-y-auto no-scrollbar">
          {tab === 'DM' ? (
            allUsers.filter(u => u.id !== currentUser?.id).map(user => (
              <button key={user.id} onClick={() => { setSelectedRecipientId(user.id); setIsThreadView(false); }} className={`w-full p-4 text-left flex items-center gap-4 border-b border-zinc-200 ${selectedRecipientId === user.id && !isThreadView ? 'bg-[#1a237e] text-white' : 'hover:bg-zinc-200'}`}>
                <div className="w-8 h-8 rounded-full border border-black overflow-hidden"><img src={user.avatar} className="w-full h-full object-cover grayscale" /></div>
                <div className="text-[11px] font-bold font-mono uppercase truncate">{user.name}</div>
              </button>
            ))
          ) : (
            threads.map(t => (
              <button key={t.id} onClick={() => { setSelectedRecipientId(t.id); setIsThreadView(true); joinThread(t.id); }} className={`w-full p-4 text-left border-b border-zinc-200 ${selectedRecipientId === t.id && isThreadView ? 'bg-[#1a237e] text-white' : 'hover:bg-zinc-200'}`}>
                 <div className="font-bold text-[11px] uppercase truncate flex items-center gap-2"><Hash size={12}/> {t.name}</div>
              </button>
            ))
          )}
        </div>
      </div>
      <div className="flex-1 flex flex-col">
        {selectedRecipientId ? (
          <><div className="bg-zinc-100 p-4 border-b border-black flex justify-between items-center"><span className="text-[11px] font-bold uppercase tracking-widest">{isThreadView ? <Hash size={14}/> : <UserIcon size={14}/>} {isThreadView ? threads.find(t => t.id === selectedRecipientId)?.name : allUsers.find(u => u.id === selectedRecipientId)?.name}</span></div>
          <div className="flex-1 overflow-y-auto p-10 space-y-6 font-mono text-xs">
            {chatMessages.map(msg => (
              <div key={msg.id} className={`flex flex-col ${msg.senderId === currentUser?.id ? 'items-end' : 'items-start'}`}>
                <div className={`p-4 border-2 border-black shadow-[3px_3px_0px_black] ${msg.senderId === currentUser?.id ? 'bg-zinc-900 text-white' : 'bg-white'}`}>{msg.content}</div>
              </div>
            ))}
          </div>
          <div className="p-6 border-t border-black bg-zinc-50 flex gap-4">
            <input className="flex-1 p-3 border-2 border-black font-mono text-xs uppercase" value={input} onChange={e => setInput(e.target.value)} />
            <button onClick={handleSend} className="bg-black text-white px-8 font-bold uppercase text-[10px]">Send</button>
          </div></>
        ) : <div className="flex-1 flex items-center justify-center opacity-20 uppercase font-mono text-xs">Select a channel</div>}
      </div>
    </div>
  );
};

const FoldersView = ({ setSelectedWork }: { setSelectedWork: (w: Work) => void }) => {
  const { folders, works, createFolder, currentUser } = useApp();
  const [newFolderName, setNewFolderName] = useState('');

  const handleCreate = () => { if (!newFolderName.trim()) return; createFolder(newFolderName, 'public', 'owner'); setNewFolderName(''); };

  return (
    <div className="space-y-16 animate-in slide-in-from-bottom-8 duration-700 text-left">
      <div className="space-box p-10 max-w-2xl mx-auto border-2 shadow-[12px_12px_0px_black] bg-zinc-50">
        <h3 className="text-xs font-bold uppercase tracking-widest mb-6 flex items-center gap-2"><Plus size={16}/> Establish Collection</h3>
        <input className="w-full p-4 border-2 border-black font-mono text-sm shadow-inner outline-none mb-4" placeholder="Collection Name..." value={newFolderName} onChange={e => setNewFolderName(e.target.value)}/>
        <button onClick={handleCreate} className="w-full bg-black text-white p-4 font-bold uppercase text-[11px]">Create Node</button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
        {folders.map(f => (
          <div key={f.id} className="space-box border-2 flex flex-col bg-white">
            <div className="space-header px-6 py-4 bg-[#1a237e] uppercase font-mono tracking-widest">{f.name}</div>
            <div className="p-8 grid grid-cols-4 gap-6">
               {f.workIds.map(wid => {
                 const w = works.find(item => item.id === wid);
                 return w ? <div key={wid} className="cursor-pointer group aspect-square border border-black grayscale group-hover:grayscale-0" onClick={() => setSelectedWork(w)}><img src={w.thumbnail} className="w-full h-full object-cover" /></div> : null;
               })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const ModerationView = ({ setSelectedWork }: { setSelectedWork: (w: Work) => void }) => {
  const { works, updateWorkStatus } = useApp();
  const pendingWorks = works.filter(w => w.status === WorkStatus.PENDING);

  return (
    <div className="space-y-12 animate-in fade-in duration-500 text-left">
      <div className="space-box p-8 border-2 bg-emerald-50 border-emerald-500">
        <h3 className="text-xl font-mono font-bold uppercase italic mb-6">Moderation Queue</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8">
          {pendingWorks.map(w => (
            <div key={w.id} className="space-y-2">
              <WorkCard work={w} onClick={setSelectedWork} />
              <button onClick={() => updateWorkStatus(w.id, WorkStatus.PUBLISHED)} className="w-full bg-emerald-600 text-white text-[8px] font-bold py-1 uppercase">Approve</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AppContent = () => {
  const { works, currentUser, localTheme } = useApp();
  const [selectedWork, setSelectedWork] = useState<Work | null>(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [view, setView] = useState<ViewState>('PORTAL');
  const [activeSensitivities, setActiveSensitivities] = useState<Sensitivity[]>([]);

  if (!currentUser) return <AuthView />;

  const handleSensitivitySelectFromPortal = (s: Sensitivity) => {
    setActiveSensitivities([s]);
    setView('ARCHIVE');
  };

  return (
    <div 
      className="min-h-screen pb-48 bg-[#d1d9e6] selection:bg-orange-500 transition-all duration-1000 text-center"
      style={{ 
        backgroundImage: localTheme.platformBackground ? `url(${localTheme.platformBackground})` : undefined,
        backgroundSize: 'cover', backgroundAttachment: 'fixed',
        backgroundColor: localTheme.platformBackground ? 'black' : '#d1d9e6'
      }}
    >
      <div style={{ opacity: localTheme.platformOpacity }}>
        <TopNav currentView={view} setView={setView} />
        <Header setView={setView} />
        <main className="max-w-6xl mx-auto px-6">
          {view === 'PORTAL' && <PortalView setSelectedWork={setSelectedWork} onSensitivitySelect={handleSensitivitySelectFromPortal} />}
          {view === 'ARCHIVE' && <ArchiveView setSelectedWork={setSelectedWork} activeSensitivities={activeSensitivities} setActiveSensitivities={setActiveSensitivities} />}
          {view === 'PROFILE' && <ProfileView />}
          {view === 'FOLDERS' && <FoldersView setSelectedWork={setSelectedWork} />}
          {view === 'MESSAGES' && <MessagesView />}
          {view === 'MANIFESTO' && <ManifestoView />}
          {view === 'MODERATION' && <ModerationView setSelectedWork={setSelectedWork} />}
        </main>
        {currentUser && currentUser.role !== UserRole.GUEST && <button onClick={() => setIsUploadOpen(true)} className="fixed bottom-14 right-14 w-24 h-24 bg-white text-black border-4 border-black flex items-center justify-center shadow-[10px_10px_0px_black] hover:bg-orange-600 hover:text-white transition-all z-[100] active:translate-x-2 active:translate-y-2 active:shadow-none"><Plus size={48} /></button>}
        {selectedWork && <WorkViewer work={selectedWork} onClose={() => setSelectedWork(null)} />}
        {isUploadOpen && <UploadModal onClose={() => setIsUploadOpen(false)} />}
        <footer className="fixed bottom-0 w-full bg-zinc-900 text-white p-3 text-[9px] font-mono uppercase tracking-[0.6em] flex justify-between px-12 items-center border-t border-white/20 opacity-95 z-[105]">
          <span>System Nominal</span>
          <div className="hidden md:flex gap-12"><span>Archive_Nodes: {works.length}</span><span>User: {currentUser.username}</span></div>
          <span>(C) 2025 KOMOREBI</span>
        </footer>
      </div>
    </div>
  );
};

const App: React.FC = () => (<AppProvider><AppContent /></AppProvider>);
export default App;
