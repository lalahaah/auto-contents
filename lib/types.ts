// 사용자 플랜 타입
export type PlanType = 'FREE' | 'PREMIUM';

// 콘텐츠 타입
export type ContentType = 'BLOG' | 'SOCIAL' | 'EMAIL' | 'PRODUCT';

// 사용자 인터페이스
export interface User {
  id: string;
  email: string;
  name: string;
  plan: PlanType;
  createdAt: Date;
  usage: {
    current: number; // 이번 달 사용 횟수
    limit: number; // 플랜별 제한
  };
}

// 콘텐츠 인터페이스
export interface Content {
  id: string;
  userId: string;
  type: ContentType;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: {
    templateId?: string;
    keywords?: string[];
    tone?: string;
    platform?: string;
    purpose?: string;
    mood?: string;
    targetAudience?: string;
    features?: string[];
  };
}

// 콘텐츠 생성 폼 데이터
export interface BlogFormData {
  templateId: string;
  title: string;
  keywords: string[];
  tone: 'professional' | 'friendly' | 'formal';
  length: 'short' | 'medium' | 'long';
}

export interface SocialFormData {
  templateId: string;
  topic: string;
  platform: 'instagram' | 'twitter' | 'facebook';
  mood: 'fun' | 'inspiring' | 'promotional';
  includeHashtags: boolean;
}

export interface EmailFormData {
  templateId: string;
  purpose: 'newsletter' | 'promotion' | 'announcement';
  targetAudience: string;
  mainMessage: string;
  ctaText: string;
}

export interface ProductFormData {
  templateId: string;
  productName: string;
  features: string[];
  targetAudience: string;
  usp: string;
}

// 플랜 정보
export interface PlanInfo {
  name: string;
  price: number;
  features: string[];
  limit: number | null; // null = 무제한
  historyLimit: number | null; // null = 전체
}

// 알림 타입
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  message: string;
  duration?: number;
}
