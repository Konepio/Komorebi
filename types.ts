
export enum UserRole {
  GUEST = 'GUEST',
  USER = 'USER',
  VERIFIED = 'VERIFIED',
  MODERATOR = 'MODERATOR',
  ADMIN = 'ADMIN'
}

export enum WorkLanguage {
  AUDIOVISUAL = 'audiovisual',
  AUDIO = 'auditory',
  VISUAL = 'visual',
  ESSAY = 'essay'
}

export enum Sensitivity {
  FEAR = 'fear',
  VIOLENCE = 'violence',
  SEXUALITY = 'sexuality',
  PSYCHOLOGICAL = 'psychological',
  EXCESS = 'excess'
}

export enum WorkStatus {
  PENDING = 'pending',
  PUBLISHED = 'published',
  REJECTED = 'rejected',
  ARCHIVED = 'archived'
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
  username: string; 
  password?: string; 
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
