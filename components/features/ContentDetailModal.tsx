'use client';

import React from 'react';
import { Content } from '@/lib/types';
import { CONTENT_TYPES } from '@/lib/constants';
import { formatDate } from '@/lib/utils';
import Button from '../ui/Button';

interface ContentDetailModalProps {
    isOpen: boolean;
    onClose: () => void;
    content: Content | null;
}

export default function ContentDetailModal({ isOpen, onClose, content }: ContentDetailModalProps) {
    if (!isOpen || !content) return null;

    const contentType = CONTENT_TYPES[content.type];

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(content.content);
            alert('클립보드에 복사되었습니다!');
        } catch (err) {
            console.error('Failed to copy code: ', err);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div
                className="bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <span className="text-3xl bg-blue-50 p-2 rounded-lg">{contentType.icon}</span>
                        <div>
                            <h3 className="text-xl font-bold text-gray-900">{content.title}</h3>
                            <div className="flex items-center space-x-2 text-sm text-gray-500 mt-1">
                                <span className="font-medium text-blue-600">{contentType.name}</span>
                                <span>•</span>
                                <span>{formatDate(content.createdAt)}</span>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 hover:bg-gray-100 p-2 rounded-full transition-colors"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Body (Scrollable) */}
                <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
                    {/* Metadata Section */}
                    {content.metadata && Object.keys(content.metadata).length > 0 && (
                        <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-100">
                            <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
                                <span className="mr-2">📝</span> 요청 상세 정보
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                {Object.entries(content.metadata).map(([key, value]) => {
                                    if (key === 'templateId') return null; // 템플릿 ID는 굳이 보여줄 필요 없음
                                    // 키 이름을 한글로 매핑 (필요 시 더 추가 가능)
                                    const labelMap: Record<string, string> = {
                                        tone: '어조(Tone)',
                                        keywords: '키워드',
                                        targetAudience: '타겟 독자',
                                        purpose: '목적',
                                        platform: '플랫폼',
                                        mood: '분위기'
                                    };

                                    let displayValue = value;
                                    if (Array.isArray(value)) displayValue = value.join(', ');

                                    return (
                                        <div key={key} className="flex flex-col">
                                            <span className="text-gray-500 text-xs mb-1 uppercase tracking-wider">{labelMap[key] || key}</span>
                                            <span className="font-medium text-gray-800 bg-white px-2 py-1 rounded border border-gray-200 inline-block">{String(displayValue)}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="prose prose-blue max-w-none">
                        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm min-h-[300px] whitespace-pre-wrap leading-relaxed text-gray-800">
                            {content.content}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end space-x-3">
                    <Button variant="outline" onClick={onClose}>
                        닫기
                    </Button>
                    <Button variant="primary" onClick={handleCopy} className="flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        복사하기
                    </Button>
                </div>
            </div>
        </div>
    );
}
