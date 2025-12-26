import React from 'react';
import { cn } from '@/lib/utils';
import { PlanType } from '@/lib/types';

export interface BadgeProps {
    variant: 'premium' | 'free' | 'success' | 'warning' | 'info';
    children: React.ReactNode;
    className?: string;
}

export default function Badge({ variant, children, className }: BadgeProps) {
    const variantStyles = {
        premium: 'premium-badge',
        free: 'free-badge',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        info: 'bg-blue-100 text-blue-800',
    };

    return (
        <span className={cn(variantStyles[variant], 'px-2.5 py-0.5 rounded-full text-xs font-medium', className)}>
            {children}
        </span>
    );
}

export function PlanBadge({ plan }: { plan: PlanType }) {
    return (
        <Badge variant={plan === 'PREMIUM' ? 'premium' : 'free'}>
            {plan === 'PREMIUM' ? '⭐ 프리미엄' : '무료'}
        </Badge>
    );
}
