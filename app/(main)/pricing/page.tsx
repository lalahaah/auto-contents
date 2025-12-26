'use client';

import React from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PricingTable from '@/components/features/PricingTable';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { PlanBadge } from '@/components/ui/Badge';
import { useNotification } from '@/hooks/useNotification';
import { AlertModal } from '@/components/ui/Modal';

export default function PricingPage() {
    const { user } = useAuth();
    const { isOpen, message, showComingSoon, closeNotification } = useNotification();

    const currentPlan = user?.plan || 'FREE';

    const faqs = [
        {
            question: '플랜을 언제든지 변경할 수 있나요?',
            answer: '네, 언제든지 플랜을 변경하실 수 있습니다. 프리미엄으로 업그레이드하면 즉시 모든 기능을 사용하실 수 있습니다.',
        },
        {
            question: '무료 플랜과 프리미엄 플랜의 주요 차이점은 무엇인가요?',
            answer: '무료 플랜은 월 10회 생성 제한이 있으며, 최근 10개 히스토리만 확인 가능합니다. 프리미엄은 무제한 생성, 전체 히스토리, 고급 템플릿, 빠른 속도를 제공합니다.',
        },
        {
            question: '환불 정책은 어떻게 되나요?',
            answer: '프리미엄 플랜 결제 후 7일 이내 전액 환불이 가능합니다. 단, 생성 횟수를 사용하지 않았을 경우에 한합니다.',
        },
        {
            question: 'API 접근은 언제 제공되나요?',
            answer: 'API 기능은 현재 개발 중이며, 2024년 상반기에 프리미엄 사용자에게 먼저 제공될 예정입니다.',
        },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <Header />

            <main className="flex-1 py-20">
                {/* 헤더 섹션 */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16">
                    <div className="text-center">
                        {user && (
                            <div className="flex justify-center mb-6">
                                <div className="flex items-center space-x-3 px-6 py-3 bg-gray-100 rounded-full">
                                    <span className="text-sm text-gray-600">현재 플랜:</span>
                                    <PlanBadge plan={currentPlan} />
                                </div>
                            </div>
                        )}
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                            간단하고 명확한 요금제
                        </h1>
                        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                            무료로 시작하고, 필요할 때 프리미엄으로 업그레이드하세요.
                            <br />
                            언제든지 플랜을 변경할 수 있습니다.
                        </p>
                    </div>
                </div>

                {/* 요금제 비교 */}
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-20">
                    <PricingTable />
                </div>

                {/* 프리미엄 기능 상세 */}
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 py-16 mb-20">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                            프리미엄으로 더 많은 가능성을
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <Card className="text-center">
                                <span className="text-4xl mb-4 block">🚀</span>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    무제한 생성
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    월 사용량 제한 없이 필요한 만큼 콘텐츠를 생성하세요.
                                </p>
                            </Card>

                            <Card className="text-center">
                                <span className="text-4xl mb-4 block">⚡</span>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    빠른 생성 속도
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    우선 처리로 더 빠르게 콘텐츠를 받아보세요.
                                </p>
                            </Card>

                            <Card className="text-center">
                                <span className="text-4xl mb-4 block">🎨</span>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    프리미엄 템플릿
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    더 다양하고 전문적인 템플릿을 사용하세요.
                                </p>
                            </Card>

                            <Card className="text-center">
                                <span className="text-4xl mb-4 block">📚</span>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    전체 히스토리
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    모든 콘텐츠를 영구 보관하고 언제든 확인하세요.
                                </p>
                            </Card>

                            <Card className="text-center">
                                <span className="text-4xl mb-4 block">🤖</span>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    고급 AI 모델
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    더 정교하고 창의적인 콘텐츠를 생성하세요.
                                </p>
                            </Card>

                            <Card className="text-center">
                                <span className="text-4xl mb-4 block">💎</span>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    우선 고객 지원
                                </h3>
                                <p className="text-gray-600 text-sm">
                                    문제가 있을 때 빠르게 도움을 받으세요.
                                </p>
                            </Card>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">
                        자주 묻는 질문
                    </h2>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <Card key={index}>
                                <div className="p-6">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                        {faq.question}
                                    </h3>
                                    <p className="text-gray-600">
                                        {faq.answer}
                                    </p>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* CTA */}
                <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 mt-16 text-center">
                    <Card className="p-8 bg-gradient-to-r from-blue-600 to-purple-600 border-0">
                        <h2 className="text-2xl font-bold text-white mb-4">
                            아직 고민 중이신가요?
                        </h2>
                        <p className="text-white/90 mb-6">
                            무료 플랜으로 먼저 시작해보세요. 언제든지 프리미엄으로 업그레이드할 수 있습니다.
                        </p>
                        <Link href={user ? '/dashboard' : '/auth'}>
                            <Button variant="primary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                                {user ? '대시보드로 가기' : '무료로 시작하기'} →
                            </Button>
                        </Link>
                    </Card>
                </div>
            </main>

            <Footer />

            <AlertModal isOpen={isOpen} onClose={closeNotification} message={message} />
        </div>
    );
}
