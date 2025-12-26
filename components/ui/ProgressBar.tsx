import React from 'react';
import { cn } from '@/lib/utils';

export interface ProgressBarProps {
    current: number;
    max: number | null;
    showLabel?: boolean;
    className?: string;
}

export default function ProgressBar({ current, max, showLabel = true, className }: ProgressBarProps) {
    // 무제한인 경우
    if (max === null) {
        return (
            <div className={cn('space-y-2', className)}>
                {showLabel && (
                    <div className="flex justify-between text-sm">
                        <span className="text-gray-600">이번 달 사용량</span>
                        <span className="font-semibold text-gray-900">{current}회 (무제한)</span>
                    </div>
                )}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 w-full"></div>
                </div>
            </div>
        );
    }

    const percentage = Math.min(Math.round((current / max) * 100), 100);

    // 상태에 따른 색상
    let barColor = 'from-green-500 to-green-600';
    if (percentage >= 90) {
        barColor = 'from-red-500 to-red-600';
    } else if (percentage >= 70) {
        barColor = 'from-yellow-500 to-yellow-600';
    } else if (percentage >= 50) {
        barColor = 'from-blue-500 to-blue-600';
    }

    return (
        <div className={cn('space-y-2', className)}>
            {showLabel && (
                <div className="flex justify-between text-sm">
                    <span className="text-gray-600">이번 달 사용량</span>
                    <span className="font-semibold text-gray-900">
                        {current} / {max}회 ({percentage}%)
                    </span>
                </div>
            )}
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                    className={cn('h-full bg-gradient-to-r smooth-transition', barColor)}
                    style={{ width: `${percentage}%` }}
                ></div>
            </div>
            {percentage >= 90 && (
                <p className="text-xs text-red-600 font-medium">
                    ⚠️ 사용량이 거의 다 찼습니다. 프리미엄으로 업그레이드하세요!
                </p>
            )}
            {percentage >= 70 && percentage < 90 && (
                <p className="text-xs text-yellow-600 font-medium">
                    💡 사용량의 {percentage}%를 사용했습니다.
                </p>
            )}
        </div>
    );
}
