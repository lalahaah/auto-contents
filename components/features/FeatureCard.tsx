import React from 'react';
import Link from 'next/link';
import Card, { CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import Button from '../ui/Button';
import { MAIN_FEATURES, CONTENT_TYPES } from '@/lib/constants';
import { ContentType } from '@/lib/types';

export interface FeatureCardProps {
    type: ContentType;
    onClick?: () => void;
}

export default function FeatureCard({ type, onClick }: FeatureCardProps) {
    const feature = MAIN_FEATURES.find(f => f.type === type);
    const contentType = CONTENT_TYPES[type];

    if (!feature) return null;

    return (
        <Card hover className="h-full">
            <CardHeader>
                <div className={`inline-flex p-3 rounded-lg bg-gradient-to-r ${feature.color} mb-4`}>
                    <span className="text-3xl">{feature.icon}</span>
                </div>
                <CardTitle>{feature.title}</CardTitle>
                <CardDescription>{feature.description}</CardDescription>
            </CardHeader>
            <CardFooter>
                <Link href={`/create/${type.toLowerCase()}`} className="w-full">
                    <Button variant="outline" className="w-full">
                        시작하기 →
                    </Button>
                </Link>
            </CardFooter>
        </Card>
    );
}
