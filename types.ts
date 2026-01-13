
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

export type ViewState = 'HOME' | 'VOICE' | 'SCAN' | 'APPOINTMENT' | 'COMMUNITY' | 'LOGIN' | 'WEATHER' | 'MARKET' | 'ESHOP';
export type Language = 'en' | 'ur' | 'ks' | 'hi';

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
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

export interface DiagnosisResult {
  problem: string;
  severity: 'Low' | 'Medium' | 'High';
  recommendation: string;
  pesticide: string;
  spraySchedule: string;
  weatherAdvisory: string;
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
