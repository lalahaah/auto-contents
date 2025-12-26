import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_MENU } from '@/lib/constants';
import { useAuth } from '@/contexts/AuthContext';

export default function Sidebar() {
    const pathname = usePathname();
    const { logout } = useAuth();

    return (
        <aside className="hidden lg:block w-64 border-r border-gray-200 bg-white">
            <nav className="sticky top-20 p-6 space-y-2">
                {NAV_MENU.dashboard.map((item) => {
                    const isActive = pathname === item.href || pathname?.startsWith(item.href);

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                'flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium smooth-transition',
                                isActive
                                    ? 'bg-blue-50 text-blue-600'
                                    : 'text-gray-700 hover:bg-gray-50'
                            )}
                        >
                            <span className="text-lg">{item.icon}</span>
                            <span>{item.name}</span>
                        </Link>
                    );
                })}
                <button
                    onClick={logout}
                    className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 smooth-transition mt-4"
                >
                    <span className="text-lg">🚪</span>
                    <span>로그아웃</span>
                </button>
            </nav>
        </aside>
    );
}
