
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Work, UserRole, WorkStatus, Message, Folder, ChatThread, FolderAccess, FolderEditMode, GlobalTheme } from './types';
import { INITIAL_WORKS } from './constants';

interface AppContextType {
  currentUser: User | null;
  works: Work[];
  messages: Message[];
  folders: Folder[];
  threads: ChatThread[];
  allUsers: User[];
  localTheme: GlobalTheme;
  login: (username: string, password?: string) => boolean;
  register: (userData: Partial<User>) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  updateLocalTheme: (theme: GlobalTheme) => void;
  addWork: (work: Omit<Work, 'id' | 'createdAt' | 'status' | 'reportCount'>) => void;
  updateWorkStatus: (workId: string, status: WorkStatus) => void;
  reportWork: (workId: string) => void;
  blockUser: (userId: string) => void;
  sendMessage: (receiverId: string, content: string, isThread?: boolean) => void;
  createThread: (name: string, isPublic: boolean, workId?: string) => void;
  joinThread: (threadId: string) => void;
  createFolder: (name: string, access: FolderAccess, editMode: FolderEditMode) => void;
  updateFolderSettings: (folderId: string, access: FolderAccess, editMode: FolderEditMode) => void;
  toggleWorkInFolder: (folderId: string, workId: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const INITIAL_USERS: User[] = [
  { id: 'admin1', username: 'thom', password: '123', name: 'Thom Yorke', role: UserRole.ADMIN, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thom', bio: 'Archive Guardian.', verifiedProgress: 10, blockedUserIds: [], reportCount: 0 },
  { id: 'verif1', username: 'elena', password: '123', name: 'Elena Valera', role: UserRole.VERIFIED, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena', bio: 'Editorial trustworthy node.', verifiedProgress: 5, blockedUserIds: [], reportCount: 0 },
  { id: 'user1', username: 'creator', password: '123', name: 'Regular Creator', role: UserRole.USER, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Regular', bio: 'Subject to pre-moderation.', verifiedProgress: 0, blockedUserIds: [], reportCount: 0 }
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('komorebi_all_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('komorebi_current_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [localTheme, setLocalTheme] = useState<GlobalTheme>(() => {
    const saved = localStorage.getItem('komorebi_local_theme');
    return saved ? JSON.parse(saved) : { platformBackground: '', platformOpacity: 1 };
  });

  const [works, setWorks] = useState<Work[]>(() => {
    const saved = localStorage.getItem('komorebi_works');
    return saved ? JSON.parse(saved) : (INITIAL_WORKS.map(w => ({ ...w, reportCount: 0 })) as Work[]);
  });

  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('komorebi_messages');
    return saved ? JSON.parse(saved) : [];
  });

  const [threads, setThreads] = useState<ChatThread[]>(() => {
    const saved = localStorage.getItem('komorebi_threads');
    return saved ? JSON.parse(saved) : [
      { id: 't1', name: 'Global Aesthetics', creatorId: 'admin1', isPublic: true, participantIds: ['admin1', 'verif1'], createdAt: Date.now() }
    ];
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem('komorebi_folders');
    return saved ? JSON.parse(saved) : [
      { id: 'f1', name: 'Core Archive', ownerId: 'admin1', workIds: ['1', '2'], access: 'public', editMode: 'owner' }
    ];
  });

  useEffect(() => {
    localStorage.setItem('komorebi_all_users', JSON.stringify(allUsers));
    localStorage.setItem('komorebi_works', JSON.stringify(works));
    localStorage.setItem('komorebi_messages', JSON.stringify(messages));
    localStorage.setItem('komorebi_folders', JSON.stringify(folders));
    localStorage.setItem('komorebi_threads', JSON.stringify(threads));
    localStorage.setItem('komorebi_local_theme', JSON.stringify(localTheme));
  }, [allUsers, works, messages, folders, threads, localTheme]);

  useEffect(() => {
    if (currentUser) localStorage.setItem('komorebi_current_user', JSON.stringify(currentUser));
    else localStorage.removeItem('komorebi_current_user');
  }, [currentUser]);

  const login = (username: string, password?: string) => {
    const user = allUsers.find(u => u.username === username && u.password === password);
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const register = (userData: Partial<User>) => {
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      username: userData.username || '',
      password: userData.password || '',
      name: userData.name || '',
      email: userData.email,
      phone: userData.phone,
      role: UserRole.USER,
      avatar: userData.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${userData.username}`,
      bio: '',
      verifiedProgress: 0,
      blockedUserIds: [],
      reportCount: 0,
      theme: { backgroundColor: '#ffffff', headerColor: '#1a237e' }
    };
    setAllUsers(prev => [...prev, newUser]);
    setCurrentUser(newUser);
  };

  const logout = () => setCurrentUser(null);
  
  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);
    setAllUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
  };

  const updateLocalTheme = (theme: GlobalTheme) => setLocalTheme(theme);

  const addWork = (workData: Omit<Work, 'id' | 'createdAt' | 'status' | 'reportCount'>) => {
    if (!currentUser) return;
    const newWork: Work = {
      ...workData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      status: currentUser.role === UserRole.VERIFIED || currentUser.role === UserRole.ADMIN ? WorkStatus.PUBLISHED : WorkStatus.PENDING,
      reportCount: 0
    };
    setWorks(prev => [newWork, ...prev]);
  };

  const updateWorkStatus = (workId: string, status: WorkStatus) => {
    setWorks(prev => prev.map(w => {
      if (w.id === workId) {
        if (status === WorkStatus.PUBLISHED && w.status !== WorkStatus.PUBLISHED) {
           if (currentUser?.id === w.authorId) {
             const newProgress = currentUser.verifiedProgress + 1;
             const newRole = newProgress >= 3 && currentUser.role === UserRole.USER ? UserRole.VERIFIED : currentUser.role;
             updateProfile({ verifiedProgress: newProgress, role: newRole });
           }
        }
        return { ...w, status };
      }
      return w;
    }));
  };

  const reportWork = (workId: string) => {
    setWorks(prev => prev.map(w => {
      if (w.id === workId) {
        const newCount = w.reportCount + 1;
        if (newCount >= 5) return { ...w, status: WorkStatus.ARCHIVED, reportCount: newCount };
        return { ...w, reportCount: newCount };
      }
      return w;
    }));
  };

  const blockUser = (userId: string) => {
    if (!currentUser) return;
    updateProfile({ blockedUserIds: [...currentUser.blockedUserIds, userId] });
  };

  const sendMessage = (receiverId: string, content: string, isThread: boolean = false) => {
    if (!currentUser) return;
    const msg: Message = { id: Math.random().toString(36).substr(2, 9), senderId: currentUser.id, receiverId, content, timestamp: Date.now(), isThreadMessage: isThread };
    setMessages(prev => [...prev, msg]);
  };

  const createThread = (name: string, isPublic: boolean, workId?: string) => {
    if (!currentUser) return;
    const newThread: ChatThread = { id: Math.random().toString(36).substr(2, 9), name, creatorId: currentUser.id, isPublic, workId, participantIds: [currentUser.id], createdAt: Date.now() };
    setThreads(prev => [...prev, newThread]);
  };

  const joinThread = (threadId: string) => {
    if (!currentUser) return;
    setThreads(prev => prev.map(t => (t.id === threadId && !t.participantIds.includes(currentUser.id)) ? { ...t, participantIds: [...t.participantIds, currentUser.id] } : t));
  };

  const createFolder = (name: string, access: FolderAccess, editMode: FolderEditMode) => {
    if (!currentUser) return;
    const folder: Folder = { id: Math.random().toString(36).substr(2, 9), name, ownerId: currentUser.id, workIds: [], access, editMode };
    setFolders(prev => [...prev, folder]);
  };

  const updateFolderSettings = (folderId: string, access: FolderAccess, editMode: FolderEditMode) => {
    setFolders(prev => prev.map(f => f.id === folderId ? { ...f, access, editMode } : f));
  };

  const toggleWorkInFolder = (folderId: string, workId: string) => {
    setFolders(prev => prev.map(f => {
      if (f.id !== folderId) return f;
      const exists = f.workIds.includes(workId);
      return { ...f, workIds: exists ? f.workIds.filter(id => id !== workId) : [...f.workIds, workId] };
    }));
  };

  return (
    <AppContext.Provider value={{
      currentUser, works, messages, folders, threads, allUsers, localTheme,
      login, register, logout, updateProfile, updateLocalTheme, addWork, updateWorkStatus, reportWork, blockUser, sendMessage, createThread, joinThread, createFolder, updateFolderSettings, toggleWorkInFolder
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used within AppProvider");
  return context;
};
