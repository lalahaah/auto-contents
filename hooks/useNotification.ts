'use client';

import { useState, useCallback } from 'react';

export function useNotification() {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState('');

    const showNotification = useCallback((msg: string) => {
        setMessage(msg);
        setIsOpen(true);
    }, []);

    const closeNotification = useCallback(() => {
        setIsOpen(false);
    }, []);

    // "준비중입니다" 알림을 표시하는 헬퍼 함수
    const showComingSoon = useCallback(() => {
        showNotification('이 기능은 준비 중입니다. 곧 만나보실 수 있습니다! 🚀');
    }, [showNotification]);

    return {
        isOpen,
        message,
        showNotification,
        closeNotification,
        showComingSoon,
    };
}
