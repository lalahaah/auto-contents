import React from 'react';
import Link from 'next/link';
import { PLANS } from '@/lib/constants';
import { PlanType } from '@/lib/types';
import Button from '../ui/Button';
import Card from '../ui/Card';

export default function PricingTable() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* 무료 플랜 */}
            <PlanCard plan="FREE" />

            {/* 프리미엄 플랜 */}
            <PlanCard plan="PREMIUM" highlighted />
        </div>
    );
}

function PlanCard({ plan, highlighted = false }: { plan: PlanType; highlighted?: boolean }) {
    const planInfo = PLANS[plan];

    return (
        <Card className={highlighted ? 'border-2 border-blue-500 relative' : ''}>
            {highlighted && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        인기
                    </span>
                </div>
            )}

            <div className="p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">{planInfo.name}</h3>
                <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">
                        {planInfo.price === 0 ? '무료' : `₩${planInfo.price.toLocaleString()}`}
                    </span>
                    {planInfo.price > 0 && <span className="text-gray-600">/월</span>}
                </div>

                <ul className="space-y-3 mb-8">
                    {planInfo.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                            <svg
                                className={`h-6 w-6 ${highlighted ? 'text-blue-600' : 'text-green-500'} flex-shrink-0`}
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span className="ml-3 text-gray-700">{feature}</span>
                        </li>
                    ))}
                </ul>

                <Link href={plan === 'FREE' ? '/auth' : '/pricing'} className="block">
                    <Button
                        variant={highlighted ? 'primary' : 'outline'}
                        className="w-full"
                    >
                        {plan === 'FREE' ? '무료로 시작하기' : '지금 업그레이드'}
                    </Button>
                </Link>
            </div>
        </Card>
    );
}
