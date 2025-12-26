'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useNotification } from '@/hooks/useNotification';
import { AlertModal } from '@/components/ui/Modal';

export default function ResultPage() {
    const router = useRouter();
    const { isOpen, message, showComingSoon, closeNotification } = useNotification();

    // Mock 생성 결과 데이터
    const generatedContent = {
        title: '디지털 마케팅 트렌드 2024',
        content: `2024년 디지털 마케팅은 AI 기술의 혁신적인 발전과 함께 새로운 전환점을 맞이하고 있습니다.

**1. AI 기반 개인화 마케팅**
인공지능을 활용한 개인화된 콘텐츠 제공이 더욱 정교해지고 있습니다. 고객의 행동 패턴을 분석하여 최적의 시점에 가장 적합한 메시지를 전달하는 것이 가능해졌습니다.

**2. 음성 검색 최적화**
스마트 스피커와 음성 비서의 보급이 확대되면서 음성 검색을 위한 SEO 전략이 필수가 되었습니다.

**3. 숏폼 비디오 콘텐츠**
TikTok, Instagram Reels, YouTube Shorts 등 숏폼 비디오 플랫폼의 인기가 지속되며, 짧지만 강렬한 메시지 전달이 중요해졌습니다.

마케터들은 이러한 트렌드를 적극 활용하여 더욱 효과적인 캠페인을 전개할 수 있습니다. 변화하는 디지털 환경에 빠르게 적응하는 것이 성공의 열쇠입니다.`,
        type: 'BLOG',
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(generatedContent.content);
        alert('클립보드에 복사되었습니다!');
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    ✨ 생성 완료!
                </h1>
                <p className="text-gray-600">
                    AI가 생성한 콘텐츠를 확인하고 활용하세요.
                </p>
            </div>

            <Card className="mb-6">
                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold text-gray-900">
                            {generatedContent.title}
                        </h2>
                        <span className="text-sm text-gray-500">
                            📝 {generatedContent.type}
                        </span>
                    </div>

                    <div className="prose max-w-none">
                        <div className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                            {generatedContent.content}
                        </div>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Button variant="primary" onClick={handleCopy} className="flex items-center justify-center">
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    복사하기
                </Button>

                <Button variant="outline" onClick={showComingSoon}>
                    다시 생성
                </Button>

                <Button variant="outline" onClick={showComingSoon}>
                    편집하기
                </Button>

                <Button variant="outline" onClick={() => router.push('/dashboard')}>
                    대시보드로
                </Button>
            </div>

            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                    💡 <strong>팁:</strong> 생성된 콘텐츠는 자동으로 히스토리에 저장됩니다. 나중에 다시 확인하거나 편집할 수 있습니다.
                </p>
            </div>

            <AlertModal isOpen={isOpen} onClose={closeNotification} message={message} />
        </div>
    );
}
