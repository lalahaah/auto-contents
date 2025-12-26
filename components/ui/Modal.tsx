import React, { useEffect } from 'react';
import { cn } from '@/lib/utils';
import Button from './Button';

export interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    showCloseButton?: boolean;
}

export default function Modal({ isOpen, onClose, title, children, showCloseButton = true }: ModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* 오버레이 */}
            <div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                onClick={onClose}
            ></div>

            {/* 모달 콘텐츠 */}
            <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4 fade-in">
                {title && (
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
                    </div>
                )}

                <div className="px-6 py-4">{children}</div>

                {showCloseButton && (
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
                        <Button variant="outline" onClick={onClose}>
                            닫기
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

// 알림용 간단한 모달
export function AlertModal({
    isOpen,
    onClose,
    title = '알림',
    message,
}: {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    message: string;
}) {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <p className="text-gray-700">{message}</p>
        </Modal>
    );
}
