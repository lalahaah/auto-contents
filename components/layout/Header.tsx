'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_MENU } from '@/lib/constants';
import { PlanBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
    const pathname = usePathname();
    const { user, isAuthenticated, logout } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // 실제 AuthContext의 상태를 사용하여 로그인 여부 판단
    const isLoggedIn = isAuthenticated;
    const userPlan = user?.plan || 'FREE';

    return (
        <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    {/* 로고 */}
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <span className="text-2xl">✨</span>
                            <span className="text-xl font-bold gradient-text">오토콘텐츠</span>
                        </Link>
                    </div>

                    {/* 데스크탑 메뉴 */}
                    <div className="hidden md:flex md:items-center md:space-x-6">
                        {NAV_MENU.main.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'text-sm font-medium transition-colors hover:text-blue-600',
                                    pathname === item.href ? 'text-blue-600' : 'text-gray-700'
                                )}
                            >
                                {item.name}
                            </Link>
                        ))}
                    </div>

                    {/* 우측 버튼들 */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {isLoggedIn ? (
                            <>
                                <PlanBadge plan={userPlan} />
                                <Link href="/dashboard">
                                    <Button variant="outline" size="sm">
                                        대시보드
                                    </Button>
                                </Link>
                                <Button variant="ghost" size="sm" onClick={logout}>
                                    로그아웃
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/auth">
                                    <Button variant="ghost" size="sm">
                                        로그인
                                    </Button>
                                </Link>
                                <Link href="/auth">
                                    <Button variant="primary" size="sm">
                                        무료 시작하기
                                    </Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* 모바일 햄버거 메뉴 */}
                    <button
                        className="md:hidden rounded-md p-2 text-gray-700 hover:bg-gray-100"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {mobileMenuOpen ? (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                />
                            ) : (
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 6h16M4 12h16M4 18h16"
                                />
                            )}
                        </svg>
                    </button>
                </div>

                {/* 모바일 메뉴 */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-200">
                        <div className="space-y-2">
                            {NAV_MENU.main.map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        'block px-3 py-2 rounded-md text-base font-medium',
                                        pathname === item.href
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-700 hover:bg-gray-50'
                                    )}
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            ))}
                            <div className="pt-4 space-y-2">
                                {isLoggedIn ? (
                                    <>
                                        <Link href="/dashboard">
                                            <Button variant="primary" className="w-full">
                                                대시보드
                                            </Button>
                                        </Link>
                                        <Button variant="outline" className="w-full" onClick={logout}>
                                            로그아웃
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/auth">
                                            <Button variant="outline" className="w-full">
                                                로그인
                                            </Button>
                                        </Link>
                                        <Link href="/auth">
                                            <Button variant="primary" className="w-full">
                                                무료 시작하기
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                )}
            </nav>
        </header>
    );
}
