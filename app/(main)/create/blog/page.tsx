'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { BlogFormData, ContentType } from '@/lib/types';
import { useNotification } from '@/hooks/useNotification';
import { AlertModal } from '@/components/ui/Modal';
import { useUserContent } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { CONTENT_TEMPLATES } from '@/lib/constants';
import TemplateSelector from '@/components/create/TemplateSelector';
import { supabase } from '@/lib/supabaseClient';

export default function CreateBlogPage() {
    const router = useRouter();
    const { isOpen, message, showNotification, closeNotification } = useNotification();
    const { addContent } = useUserContent();
    const { user } = useAuth();

    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const [formData, setFormData] = useState<BlogFormData>({
        templateId: CONTENT_TEMPLATES.BLOG[0].id,
        title: '',
        keywords: [],
        tone: 'professional',
        length: 'medium',
    });
    const [keywordInput, setKeywordInput] = useState('');

    const handleAddKeyword = () => {
        if (keywordInput.trim() && formData.keywords.length < 5) {
            setFormData({
                ...formData,
                keywords: [...formData.keywords, keywordInput.trim()],
            });
            setKeywordInput('');
        }
    };

    const handleRemoveKeyword = (index: number) => {
        setFormData({
            ...formData,
            keywords: formData.keywords.filter((_, i) => i !== index),
        });
    };

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

        // 실제 AI 생성 요청 (Supabase Edge Function 호출)
        try {
            const { data, error } = await supabase.functions.invoke('generate-content', {
                body: {
                    type: 'BLOG',
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

            // DB에 저장
            await addContent({
                type: 'BLOG' as ContentType,
                title: formData.title,
                content: generatedContent,
                metadata: {
                    templateId: formData.templateId,
                    keywords: formData.keywords,
                    tone: formData.tone
                }
            });

            showNotification('블로그 포스트가 생성되어 자동으로 저장되었습니다!');
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
                    📝 블로그 포스트 생성
                </h1>
                <p className="text-gray-600">
                    SEO 최적화된 블로그 글을 AI가 자동으로 작성해드립니다.
                </p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>1. 템플릿 선택</CardTitle>
                    <CardDescription>
                        작성하시려는 블로그의 목적에 맞는 템플릿을 선택하세요.
                    </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                    <TemplateSelector
                        templates={CONTENT_TEMPLATES.BLOG}
                        selectedId={formData.templateId}
                        onSelect={handleTemplateSelect}
                        disabled={isGenerating}
                    />
                </div>
            </Card>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <CardHeader>
                        <CardTitle>2. 블로그 정보 입력</CardTitle>
                        <CardDescription>
                            아래 정보를 입력하면 AI가 완성된 블로그 포스트를 생성합니다.
                        </CardDescription>
                    </CardHeader>

                    <div className="px-6 space-y-4">
                        {/* 제목 */}
                        <Input
                            label="블로그 주제 또는 제목"
                            placeholder="예: 디지털 마케팅 트렌드 2024"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            required
                            disabled={isGenerating}
                        />

                        {/* 키워드 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                키워드 (최대 5개)
                            </label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="키워드 입력 후 추가 버튼 클릭"
                                    value={keywordInput}
                                    onChange={(e) => setKeywordInput(e.target.value)}
                                    disabled={isGenerating || formData.keywords.length >= 5}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddKeyword();
                                        }
                                    }}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddKeyword}
                                    disabled={isGenerating || formData.keywords.length >= 5}
                                >
                                    추가
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.keywords.map((keyword, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                                    >
                                        {keyword}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveKeyword(index)}
                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                            disabled={isGenerating}
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* 톤 선택 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                작성 톤
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['professional', 'friendly', 'formal'] as const).map((tone) => (
                                    <button
                                        key={tone}
                                        type="button"
                                        disabled={isGenerating}
                                        onClick={() => setFormData({ ...formData, tone })}
                                        className={`p-3 rounded-lg border-2 smooth-transition ${formData.tone === tone
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400 disabled:opacity-50'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">
                                            {tone === 'professional' && '전문적'}
                                            {tone === 'friendly' && '친근함'}
                                            {tone === 'formal' && '공식적'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* 길이 선택 */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                글 길이
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['short', 'medium', 'long'] as const).map((length) => (
                                    <button
                                        key={length}
                                        type="button"
                                        disabled={isGenerating}
                                        onClick={() => setFormData({ ...formData, length })}
                                        className={`p-3 rounded-lg border-2 smooth-transition ${formData.length === length
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400 disabled:opacity-50'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">
                                            {length === 'short' && '짧음 (300자)'}
                                            {length === 'medium' && '중간 (600자)'}
                                            {length === 'long' && '길음 (1000자+)'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="px-6 pb-6 flex gap-3">
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'AI가 글을 쓰는 중...' : '블로그 포스트 생성하기 ✨'}
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
                            <CardTitle>생성된 블로그 포스트</CardTitle>
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
                        <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-800 border min-h-[200px]">
                            {result}
                        </div>
                    </div>
                </Card>
            )}

            <AlertModal
                isOpen={isOpen}
                onClose={closeNotification}
                message={message}
            />
        </div>
    );
}
