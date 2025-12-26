'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { SocialFormData, ContentType } from '@/lib/types';
import { useNotification } from '@/hooks/useNotification';
import { AlertModal } from '@/components/ui/Modal';
import { useUserContent } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { CONTENT_TEMPLATES } from '@/lib/constants';
import TemplateSelector from '@/components/create/TemplateSelector';
import { supabase } from '@/lib/supabaseClient';

export default function CreateSocialPage() {
    const router = useRouter();
    const { isOpen, message, showNotification, closeNotification } = useNotification();
    const { addContent } = useUserContent();
    const { user } = useAuth();

    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const [formData, setFormData] = useState<SocialFormData>({
        templateId: CONTENT_TEMPLATES.SOCIAL[0].id,
        topic: '',
        platform: 'instagram',
        mood: 'fun',
        includeHashtags: true,
    });

    const handleTemplateSelect = (id: string, isPremium: boolean) => {
        if (isPremium && user?.plan !== 'PREMIUM') {
            showNotification('이 템플릿은 프리미엄 플랜 전용입니다. 플랜을 업그레이드 해주세요!');
            return;
        }
        setFormData({ ...formData, templateId: id });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!user) {
            showNotification('로그인이 필요합니다.');
            return;
        }

        setIsGenerating(true);
        setResult(null);

        try {
            const { data, error } = await supabase.functions.invoke('generate-content', {
                body: {
                    type: 'SOCIAL',
                    templateId: formData.templateId,
                    formData: formData
                }
            });

            if (error) {
                showNotification(`콘텐츠 생성 중 오류가 발생했습니다: ${error.message}`);
                return;
            }
            if (data?.error) {
                showNotification(`AI 오류: ${data.error}`);
                return;
            }
            if (!data?.content) throw new Error('콘텐츠가 생성되지 않았습니다.');

            const generatedContent = data.content;
            setResult(generatedContent);

            await addContent({
                type: 'SOCIAL' as ContentType,
                title: `${formData.platform} - ${formData.topic}`,
                content: generatedContent,
                metadata: {
                    templateId: formData.templateId,
                    platform: formData.platform,
                    mood: formData.mood
                }
            });

            showNotification('캡션이 생성되어 자동으로 저장되었습니다!');
        } catch (error) {
            console.error('Generation error:', error);
            showNotification('콘텐츠 생성 중 오류가 발생했습니다. (API 키 설정을 확인해주세요)');
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    📱 소셜미디어 캡션 생성
                </h1>
                <p className="text-gray-600">
                    Instagram, Twitter, Facebook용 매력적인 캡션을 만들어드립니다.
                </p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>1. 템플릿 선택</CardTitle>
                    <CardDescription>
                        소셜 미디어 포스트의 분위기와 목적에 맞는 템플릿을 선택하세요.
                    </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                    <TemplateSelector
                        templates={CONTENT_TEMPLATES.SOCIAL}
                        selectedId={formData.templateId}
                        onSelect={handleTemplateSelect}
                        disabled={isGenerating}
                    />
                </div>
            </Card>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <CardHeader>
                        <CardTitle>2. 소셜미디어 정보 입력</CardTitle>
                        <CardDescription>
                            플랫폼에 맞는 완벽한 캡션을 AI가 생성합니다.
                        </CardDescription>
                    </CardHeader>

                    <div className="px-6 space-y-4">
                        <Input
                            label="주제"
                            placeholder="예: 신제품 출시 공지"
                            value={formData.topic}
                            onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                            required
                            disabled={isGenerating}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                플랫폼 선택
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['instagram', 'twitter', 'facebook'] as const).map((platform) => (
                                    <button
                                        key={platform}
                                        type="button"
                                        disabled={isGenerating}
                                        onClick={() => setFormData({ ...formData, platform })}
                                        className={`p-3 rounded-lg border-2 smooth-transition ${formData.platform === platform
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400 disabled:opacity-50'
                                            }`}
                                    >
                                        <span className="text-sm font-medium capitalize">{platform}</span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                분위기
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['fun', 'inspiring', 'promotional'] as const).map((mood) => (
                                    <button
                                        key={mood}
                                        type="button"
                                        disabled={isGenerating}
                                        onClick={() => setFormData({ ...formData, mood })}
                                        className={`p-3 rounded-lg border-2 smooth-transition ${formData.mood === mood
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400 disabled:opacity-50'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">
                                            {mood === 'fun' && '재미있는'}
                                            {mood === 'inspiring' && '영감을 주는'}
                                            {mood === 'promotional' && '홍보용'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="hashtags"
                                checked={formData.includeHashtags}
                                onChange={(e) => setFormData({ ...formData, includeHashtags: e.target.checked })}
                                className="h-4 w-4 text-blue-600 rounded disabled:opacity-50"
                                disabled={isGenerating}
                            />
                            <label htmlFor="hashtags" className="ml-2 text-sm text-gray-700">
                                해시태그 포함
                            </label>
                        </div>
                    </div>

                    <div className="px-6 pb-6 flex gap-3">
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'AI가 작업 중...' : '캡션 생성하기 ✨'}
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.back()}
                            disabled={isGenerating}
                        >
                            취소
                        </Button>
                    </div>
                </form>
            </Card>

            {/* 결과 표시 섹션 */}
            {result && (
                <Card className="mt-8 border-green-200">
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>생성된 캡션</CardTitle>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    navigator.clipboard.writeText(result);
                                    showNotification('클립보드에 복사되었습니다!');
                                }}
                            >
                                📋 복사하기
                            </Button>
                        </div>
                    </CardHeader>
                    <div className="px-6 pb-6">
                        <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-800 border min-h-[150px]">
                            {result}
                        </div>
                    </div>
                </Card>
            )}

            <AlertModal isOpen={isOpen} onClose={closeNotification} message={message} />
        </div>
    );
}
