
export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  VERIFIED = 'VERIFIED',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export enum WorkLanguage {
  AUDIOVISUAL = 'audiovisual',
  AUDIO = 'auditivo',
  VISUAL = 'visual',
  ESSAY = 'ensayo'
}

export enum Sensitivity {
  FEAR = 'miedo',
  VIOLENCE = 'violencia',
  SEXUALITY = 'sexualidad',
  PSYCHOLOGICAL = 'perturbación psicológica',
  EXCESS = 'consumo o exceso'
}

export enum WorkStatus {
  PENDING = 'en revisión',
  PUBLISHED = 'publicado',
  REJECTED = 'rechazado',
  ARCHIVED = 'archivado'
}

export interface ProfileTheme {
  backgroundColor?: string;
  headerColor?: string;
  textColor?: string;
  accentColor?: string;
  backgroundImage?: string;
  fontFamily?: 'Verdana' | 'Space Mono' | 'serif' | 'sans-serif';
  borderStyle?: 'solid' | 'dashed' | 'double' | 'none';
}

export interface User {
  id: string;
  username: string; // Required for login
  password?: string; // Required for login
  email?: string;
  phone?: string;
  name: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  theme?: ProfileTheme;
  verifiedProgress: number; 
  blockedUserIds: string[];
  followerIds: string[];
  followingIds: string[];
  reportCount: number;
}

export interface GlobalTheme {
  platformBackground?: string;
  platformOpacity?: number;
}

export interface Work {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  language: WorkLanguage;
  contentUrl: string; 
  intent: string;
  sensitivities: Sensitivity[];
  status: WorkStatus;
  createdAt: number;
  thumbnail?: string;
  reportCount: number;
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string; 
  content: string;
  timestamp: number;
  isThreadMessage?: boolean;
}

export interface ChatThread {
  id: string;
  name: string;
  creatorId: string;
  isPublic: boolean;
  workId?: string;
  participantIds: string[];
  createdAt: number;
}

export type FolderAccess = 'public' | 'private' | 'link';
export type FolderEditMode = 'owner' | 'collaborative';

export interface Folder {
  id: string;
  name: string;
  ownerId: string;
  workIds: string[];
  access: FolderAccess;
  editMode: FolderEditMode;
}
