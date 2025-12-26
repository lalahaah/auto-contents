import { PlanInfo, ContentType } from './types';

// 플랜별 제한 설정
export const PLAN_LIMITS = {
    FREE: 10, // 무료: 월 10회
    PREMIUM: null, // 프리미엄: 무제한
} as const;

// 히스토리 제한
export const HISTORY_LIMITS = {
    FREE: 10, // 무료: 최근 10개
    PREMIUM: null, // 프리미엄: 전체
} as const;

// 플랜 정보
export const PLANS: Record<'FREE' | 'PREMIUM', PlanInfo> = {
    FREE: {
        name: '무료',
        price: 0,
        limit: PLAN_LIMITS.FREE,
        historyLimit: HISTORY_LIMITS.FREE,
        features: [
            '월 10회 콘텐츠 생성',
            '기본 템플릿 사용',
            '최근 10개 히스토리',
            '일반 생성 속도',
            '커뮤니티 지원',
        ],
    },
    PREMIUM: {
        name: '프리미엄',
        price: 29000,
        limit: PLAN_LIMITS.PREMIUM,
        historyLimit: HISTORY_LIMITS.PREMIUM,
        features: [
            '무제한 콘텐츠 생성',
            '프리미엄 템플릿 전체 이용',
            '전체 히스토리 영구 보관',
            '빠른 생성 속도',
            '고급 AI 모델 사용',
            '우선 고객 지원',
            '팀 협업 기능 (곧 출시)',
            'API 접근 (곧 출시)',
        ],
    },
};

// 콘텐츠 타입 정보
export const CONTENT_TYPES: Record<ContentType, {
    name: string;
    description: string;
    icon: string;
    color: string;
}> = {
    BLOG: {
        name: '블로그 포스트',
        description: 'SEO 최적화된 블로그 글을 작성하세요',
        icon: '✍️',
        color: 'blue',
    },
    SOCIAL: {
        name: '소셜미디어',
        description: '매력적인 소셜미디어 캡션을 만드세요',
        icon: '📱',
        color: 'pink',
    },
    EMAIL: {
        name: '이메일',
        description: '효과적인 이메일 템플릿을 생성하세요',
        icon: '📧',
        color: 'green',
    },
    PRODUCT: {
        name: '상품 설명',
        description: '판매를 촉진하는 상품 설명을 작성하세요',
        icon: '🛍️',
        color: 'orange',
    },
};

// 각 콘텐츠 타입별 템플릿 정보
export const CONTENT_TEMPLATES: Record<ContentType, Array<{
    id: string;
    name: string;
    description: string;
    isPremium: boolean;
}>> = {
    BLOG: [
        { id: 'blog-basic', name: '일반 블로그', description: '기본적인 블로그 포스트 형식', isPremium: false },
        { id: 'blog-info', name: '정보 공유', description: '정보 전달을 위한 교육용 글', isPremium: false },
        { id: 'blog-seo', name: '비즈니스 SEO', description: '검색 엔진 최적화 강화 (프리미엄)', isPremium: true },
        { id: 'blog-story', name: '스토리텔링', description: '독자의 공감을 얻는 이야기 형식 (프리미엄)', isPremium: true },
    ],
    SOCIAL: [
        { id: 'social-insta', name: '인스타그램', description: '감성적인 캡션과 해시태그', isPremium: false },
        { id: 'social-x', name: 'X (트위터)', description: '짧고 강렬한 텍스트 중심', isPremium: false },
        { id: 'social-promotion', name: '이벤트 홍보', description: '참여를 유도하는 홍보 문구 (프리미엄)', isPremium: true },
        { id: 'social-expert', name: '전문가 견해', description: '링크드인 등 전문적 메시지 (프리미엄)', isPremium: true },
    ],
    EMAIL: [
        { id: 'email-greeting', name: '고객 인사', description: '기본적인 환영 및 안내 메일', isPremium: false },
        { id: 'email-notice', name: '공지사항', description: '중요한 업데이트 안내', isPremium: false },
        { id: 'email-sales', name: '세일즈 메세지', description: '구매 전환 유도 개인화 메일 (프리미엄)', isPremium: true },
        { id: 'email-survey', name: '피드백 요청', description: '후기 작성을 유도하는 정중한 요청 (프리미엄)', isPremium: true },
    ],
    PRODUCT: [
        { id: 'product-summary', name: '제품 요약', description: '간략한 특징 중심의 설명', isPremium: false },
        { id: 'product-spec', name: '상세 명세', description: '기술 스펙 강조형 설명', isPremium: false },
        { id: 'product-narrative', name: '감성 마케팅', description: '구매 욕구를 자극하는 이야기 (프리미엄)', isPremium: true },
        { id: 'product-compare', name: '경쟁사 비교', description: '우월함을 강조하는 전략적 설명 (프리미엄)', isPremium: true },
    ],
};

// 고객 후기 (Mock 데이터)
export const TESTIMONIALS = [
    {
        id: '1',
        name: '김민지',
        role: '마케팅 매니저',
        company: '스타트업 A',
        content: '콘텐츠 제작 시간이 80% 단축되었어요. 이제 전략에 더 집중할 수 있습니다!',
        rating: 5,
        avatar: '👩‍💼',
    },
    {
        id: '2',
        name: '이준호',
        role: '블로거',
        company: '개인 블로그',
        content: 'AI가 만든 초안을 기반으로 편집하니 훨씬 효율적입니다. 강력 추천해요!',
        rating: 5,
        avatar: '👨‍💻',
    },
    {
        id: '3',
        name: '박서연',
        role: 'SNS 마케터',
        company: '에이전시 B',
        content: '다양한 플랫폼용 콘텐츠를 한 번에 만들 수 있어서 정말 편리합니다.',
        rating: 5,
        avatar: '👩‍🎨',
    },
];

// 메인 기능 (홈페이지용)
export const MAIN_FEATURES = [
    {
        id: 'blog',
        type: 'BLOG' as ContentType,
        title: '블로그 포스트',
        description: 'SEO 최적화된 블로그 글을 몇 초 만에 작성하세요. 키워드와 톤을 선택하면 AI가 완벽한 초안을 만들어드립니다.',
        icon: '✍️',
        color: 'from-blue-500 to-blue-600',
    },
    {
        id: 'social',
        type: 'SOCIAL' as ContentType,
        title: '소셜미디어 캡션',
        description: 'Instagram, Twitter, Facebook용 매력적인 캡션을 생성하세요. 해시태그까지 자동으로 추천해드립니다.',
        icon: '📱',
        color: 'from-pink-500 to-pink-600',
    },
    {
        id: 'email',
        type: 'EMAIL' as ContentType,
        title: '이메일 템플릿',
        description: '뉴스레터, 프로모션, 공지사항 등 목적에 맞는 이메일을 빠르게 작성하세요.',
        icon: '📧',
        color: 'from-green-500 to-green-600',
    },
    {
        id: 'product',
        type: 'PRODUCT' as ContentType,
        title: '상품 설명',
        description: '판매를 촉진하는 매력적인 상품 설명을 작성하세요. USP를 강조한 설득력 있는 카피를 만듭니다.',
        icon: '🛍️',
        color: 'from-orange-500 to-orange-600',
    },
];

// 네비게이션 메뉴
export const NAV_MENU = {
    main: [
        { name: '홈', href: '/' },
        { name: '기능', href: '/#features' },
        { name: '요금제', href: '/pricing' },
    ],
    dashboard: [
        { name: '대시보드', href: '/dashboard', icon: '🏠' },
        { name: '콘텐츠 생성', href: '/create/blog', icon: '✨' },
        { name: '히스토리', href: '/history', icon: '📚' },
        { name: '업그레이드', href: '/pricing', icon: '⭐' },
    ],
};
