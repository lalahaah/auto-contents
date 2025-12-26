'use client';

import React, { useState } from 'react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import ContentCard from '@/components/features/ContentCard';
import { PlanBadge } from '@/components/ui/Badge';
import { useAuth } from '@/contexts/AuthContext';
import { useUserContent } from '@/contexts/UserContext';
import { ContentType } from '@/lib/types';
import { useNotification } from '@/hooks/useNotification';
import { AlertModal } from '@/components/ui/Modal';
import { CONTENT_TYPES } from '@/lib/constants';
import ContentDetailModal from '@/components/features/ContentDetailModal';
import { Content } from '@/lib/types';

export default function HistoryPage() {
    const { user } = useAuth();
    const { contents } = useUserContent();
    const { isOpen, message, showComingSoon, closeNotification } = useNotification();
    const [selectedContent, setSelectedContent] = useState<Content | null>(null);
    const [isDetailOpen, setIsDetailOpen] = useState(false);

    const handleViewContent = (content: Content) => {
        setSelectedContent(content);
        setIsDetailOpen(true);
    };

    const [filterType, setFilterType] = useState<ContentType | 'ALL'>('ALL');
    const [searchQuery, setSearchQuery] = useState('');

    const userPlan = user?.plan || 'FREE';
    const isFreePlan = userPlan === 'FREE';

    // 필터링된 콘텐츠
    let filteredContents = contents;

    if (filterType !== 'ALL') {
        filteredContents = filteredContents.filter(c => c.type === filterType);
    }

    if (searchQuery) {
        filteredContents = filteredContents.filter(c =>
            c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.content.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }

    // 무료 플랜은 최근 10개만
    const displayedContents = isFreePlan ? filteredContents.slice(0, 10) : filteredContents;
    const hasMore = isFreePlan && filteredContents.length > 10;

    return (
        <div className="p-6 max-w-7xl mx-auto">
            <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            📚 콘텐츠 히스토리
                        </h1>
                        <p className="text-gray-600">
                            지금까지 생성한 모든 콘텐츠를 확인하고 관리하세요.
                        </p>
                    </div>
                    <PlanBadge plan={userPlan} />
                </div>
            </div>

            {/* 검색 및 필터 */}
            <Card className="mb-6">
                <div className="p-6 space-y-4">
                    <div>
                        <input
                            type="text"
                            placeholder="콘텐츠 검색..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setFilterType('ALL')}
                            className={`px-4 py-2 rounded-lg smooth-transition ${filterType === 'ALL'
                                ? 'bg-blue-600 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            전체
                        </button>
                        {(Object.keys(CONTENT_TYPES) as ContentType[]).map((type) => (
                            <button
                                key={type}
                                onClick={() => setFilterType(type)}
                                className={`px-4 py-2 rounded-lg smooth-transition ${filterType === type
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {CONTENT_TYPES[type].icon} {CONTENT_TYPES[type].name}
                            </button>
                        ))}
                    </div>
                </div>
            </Card>

            {/* 콘텐츠 목록 */}
            {displayedContents.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
                        {displayedContents.map((content) => (
                            <ContentCard
                                key={content.id}
                                content={content}
                                onView={() => handleViewContent(content)}
                                onEdit={showComingSoon}
                                onDelete={showComingSoon}
                            />
                        ))}
                    </div>

                    {hasMore && (
                        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    ⭐ 더 많은 히스토리를 확인하고 싶으신가요?
                                </h3>
                                <p className="text-gray-700 mb-4">
                                    프리미엄 플랜으로 업그레이드하면 모든 히스토리를 영구 보관하고 확인할 수 있습니다.
                                </p>
                                <Button variant="primary" onClick={() => window.location.href = '/pricing'}>
                                    프리미엄으로 업그레이드 →
                                </Button>
                            </div>
                        </Card>
                    )}
                </>
            ) : (
                <Card>
                    <div className="text-center py-12">
                        <span className="text-6xl mb-4 block">🔍</span>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            검색 결과가 없습니다
                        </h3>
                        <p className="text-gray-600">
                            다른 검색어나 필터를 시도해보세요.
                        </p>
                    </div>
                </Card>
            )}

            <AlertModal isOpen={isOpen} onClose={closeNotification} message={message} />
            <ContentDetailModal
                isOpen={isDetailOpen}
                onClose={() => setIsDetailOpen(false)}
                content={selectedContent}
            />
        </div>
    );
}
