
export interface TranscriptionEntry {
  text: string;
  role: 'user' | 'model';
  timestamp: number;
}

export enum AppState {
  IDLE = 'IDLE',
  CONNECTING = 'CONNECTING',
  ACTIVE = 'ACTIVE',
  ERROR = 'ERROR'
}

export type ViewState = 
  | 'HOME' | 'VOICE' | 'SCAN' | 'APPOINTMENT' | 'COMMUNITY' 
  | 'LOGIN' | 'WEATHER' | 'MARKET' | 'ESHOP' | 'ADMIN' 
  | 'TOOLBOX' | 'LEDGER' | 'SCHEMES' | 'SOIL_AI'
  | 'DISEASES' | 'GALLERY' | 'SPRAY_CALENDAR';

export type Language = 'en' | 'ur' | 'ks' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  isAdmin?: boolean;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  imageUrl: string;
  siteUrl: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface SocialLink {
  platform: 'YouTube' | 'Facebook' | 'Instagram' | 'WhatsApp';
  url: string;
  label: string;
}

export interface MandiConfig {
  name: string;
  varieties: string[];
}

export interface AdminSettings {
  schemes: string[];
  locations: Record<string, string[]>;
  expertName: string;
  expertPhone: string;
  expertWhatsApp: string;
  mandis: MandiConfig[];
  weatherDistricts: string[];
  socialLinks: SocialLink[];
  expertSuggestions: { category: string; text: string }[];
}

export interface DiagnosisResult {
  problem: string;
  severity: 'Low' | 'Medium' | 'High';
  recommendation: string;
  pesticide: string;
  spraySchedule: string;
  weatherAdvisory: string;
  relatedIssues?: { title: string; description: string }[];
}

export interface CommunityMessage {
  id: string;
  author: string;
  location: string;
  text: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  timestamp: number;
  likes: number;
  comments: number;
}

export interface ExpenseRecord {
  id: string;
  category: 'Spray' | 'Fertilizer' | 'Labor' | 'Transport' | 'Other';
  amount: number;
  date: string;
  note: string;
}
