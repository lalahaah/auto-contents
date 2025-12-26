import { type ClassValue, clsx } from 'clsx';

// 클래스명 병합 유틸리티 (clsx 설치 필요)
export function cn(...inputs: ClassValue[]) {
    return clsx(inputs);
}

// 날짜 포맷팅
export function formatDate(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        if (hours === 0) {
            const minutes = Math.floor(diff / (1000 * 60));
            return `${minutes}분 전`;
        }
        return `${hours}시간 전`;
    } else if (days === 1) {
        return '어제';
    } else if (days < 7) {
        return `${days}일 전`;
    } else {
        return date.toLocaleDateString('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    }
}

// 텍스트 자르기
export function truncateText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
}

// 사용량 퍼센티지 계산
export function calculateUsagePercentage(current: number, limit: number | null): number {
    if (limit === null) return 0; // 무제한
    return Math.min(Math.round((current / limit) * 100), 100);
}

// 사용량 상태 확인
export function getUsageStatus(current: number, limit: number | null): 'safe' | 'warning' | 'critical' {
    if (limit === null) return 'safe';
    const percentage = calculateUsagePercentage(current, limit);

    if (percentage >= 90) return 'critical';
    if (percentage >= 70) return 'warning';
    return 'safe';
}

// Mock ID 생성
export function generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
