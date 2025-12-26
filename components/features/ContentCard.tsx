import React from 'react';
import Link from 'next/link';
import { Content } from '@/lib/types';
import { CONTENT_TYPES } from '@/lib/constants';
import { formatDate, truncateText } from '@/lib/utils';
import Card from '../ui/Card';
import Button from '../ui/Button';

export interface ContentCardProps {
    content: Content;
    onView?: () => void;
    onEdit?: () => void;
    onDelete?: () => void;
}

export default function ContentCard({ content, onView, onEdit, onDelete }: ContentCardProps) {
    const contentType = CONTENT_TYPES[content.type];

    return (
        <Card hover>
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl">{contentType.icon}</span>
                    <div>
                        <h4 className="text-base font-semibold text-gray-900">{content.title}</h4>
                        <p className="text-xs text-gray-500">{contentType.name}</p>
                    </div>
                </div>
                <span className="text-xs text-gray-500">{formatDate(content.createdAt)}</span>
            </div>

            <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                {truncateText(content.content, 150)}
            </p>

            <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={onView} className="flex-1">
                    보기
                </Button>
                <Button variant="ghost" size="sm" onClick={onEdit}>
                    편집
                </Button>
                <Button variant="ghost" size="sm" onClick={onDelete}>
                    삭제
                </Button>
            </div>
        </Card>
    );
}
