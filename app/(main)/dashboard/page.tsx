'use client';

import React from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ProgressBar from '@/components/ui/ProgressBar';
import { PlanBadge } from '@/components/ui/Badge';
import ContentCard from '@/components/features/ContentCard';
import { useAuth } from '@/contexts/AuthContext';
import { useUserContent } from '@/contexts/UserContext';
import { CONTENT_TYPES } from '@/lib/constants';
import { ContentType } from '@/lib/types';
import { useNotification } from '@/hooks/useNotification';
import { AlertModal } from '@/components/ui/Modal';
import ContentDetailModal from '@/components/features/ContentDetailModal';
import { Content } from '@/lib/types';

export default function DashboardPage() {
    const { user } = useAuth();
    const { contents } = useUserContent();
    const { isOpen, message, showComingSoon, closeNotification } = useNotification();
    const [selectedContent, setSelectedContent] = React.useState<Content | null>(null);
    const [isDetailOpen, setIsDetailOpen] = React.useState(false);

    const handleViewContent = (content: Content) => {
        setSelectedContent(content);
        setIsDetailOpen(true);
    };

    // Mock 데이터 (실제로는 user가 null이면 리다이렉트해야 함)
    const userName = user?.name || '사용자';
    const userPlan = user?.plan || 'FREE';
    const usage = user?.usage || { current: 5, limit: 10 };

    // 최근 콘텐츠 3개
    const recentContents = contents.slice(0, 3);

    // 빠른 생성 타입
    const quickCreateTypes: ContentType[] = ['BLOG', 'SOCIAL', 'EMAIL', 'PRODUCT'];

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* 헤더 */}
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            안녕하세요, {userName}님! 👋
                        </h1>
                        <p className="text-gray-600">
                            오늘도 멋진 콘텐츠를 만들어보세요.
                        </p>
                    </div>
                    <PlanBadge plan={userPlan} />
                </div>
            </div>

            {/* 사용량 섹션 */}
            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>이번 달 사용 현황</CardTitle>
                    <CardDescription>
                        {userPlan === 'FREE'
                            ? '무료 플랜의 월간 사용량입니다. 프리미엄으로 업그레이드하면 무제한으로 사용하실 수 있습니다.'
                            : '프리미엄 플랜으로 무제한 사용하실 수 있습니다!'}
                    </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                    <ProgressBar current={usage.current} max={usage.limit} />

                    {userPlan === 'FREE' && usage.current >= (usage.limit || 0) * 0.7 && (
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                            <p className="text-sm text-blue-900 mb-2">
                                🚀 더 많은 콘텐츠가 필요하신가요?
                            </p>
                            <Link href="/pricing">
                                <Button variant="primary" size="sm">
                                    프리미엄으로 업그레이드 →
                                </Button>
                            </Link>
                        </div>
                    )}
                </div>
            </Card>

            {/* 빠른 생성 */}
            <div className="mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                    빠른 콘텐츠 생성
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickCreateTypes.map((type) => {
                        const contentType = CONTENT_TYPES[type];
                        return (
                            <Link key={type} href={`/create/${type.toLowerCase()}`}>
                                <Card hover className="h-full cursor-pointer">
                                    <div className="text-center">
                                        <span className="text-4xl mb-3 block">{contentType.icon}</span>
                                        <h3 className="font-semibold text-gray-900 mb-1">
                                            {contentType.name}
                                        </h3>
                                        <p className="text-xs text-gray-600">
                                            {contentType.description}
                                        </p>
                                    </div>
                                </Card>
                            </Link>
                        );
                    })}
                </div>
            </div>

            {/* 최근 생성 콘텐츠 */}
            <div>
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">
                        최근 생성 콘텐츠
                    </h2>
                    <Link href="/history">
                        <Button variant="ghost" size="sm">
                            전체 보기 →
                        </Button>
                    </Link>
                </div>

                {recentContents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {recentContents.map((content) => (
                            <ContentCard
                                key={content.id}
                                content={content}
                                onView={() => handleViewContent(content)}
                                onEdit={showComingSoon}
                                onDelete={showComingSoon}
                            />
                        ))}
                    </div>
                ) : (
                    <Card>
                        <div className="text-center py-12">
                            <span className="text-6xl mb-4 block">📝</span>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                아직 생성된 콘텐츠가 없습니다
                            </h3>
                            <p className="text-gray-600 mb-4">
                                위의 빠른 생성 버튼을 클릭하여 첫 콘텐츠를 만들어보세요!
                            </p>
                            <Link href="/create/blog">
                                <Button variant="primary">
                                    첫 콘텐츠 만들기 →
                                </Button>
                            </Link>
                        </div>
                    </Card>
                )}
            </div>

            <AlertModal
                isOpen={isOpen}
                onClose={closeNotification}
                message={message}
            />

            <ContentDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                content={selectedContent}
            />
        </div>
    );
}
