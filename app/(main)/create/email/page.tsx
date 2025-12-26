'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { EmailFormData, ContentType } from '@/lib/types';
import { useNotification } from '@/hooks/useNotification';
import { AlertModal } from '@/components/ui/Modal';
import { useUserContent } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { CONTENT_TEMPLATES } from '@/lib/constants';
import TemplateSelector from '@/components/create/TemplateSelector';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function CreateEmailPage() {
    const router = useRouter();
    const { isOpen, message, showNotification, closeNotification } = useNotification();
    const { addContent } = useUserContent();
    const { user } = useAuth();

    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const [formData, setFormData] = useState<EmailFormData>({
        templateId: CONTENT_TEMPLATES.EMAIL[0].id,
        purpose: 'newsletter',
        targetAudience: '',
        mainMessage: '',
        ctaText: '',
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
                    type: 'EMAIL',
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
                type: 'EMAIL' as ContentType,
                title: `${formData.purpose} - ${formData.targetAudience}`,
                content: generatedContent,
                metadata: {
                    templateId: formData.templateId,
                    purpose: formData.purpose
                }
            });

            showNotification('이메일 템플릿이 생성되어 자동으로 저장되었습니다!');
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
                    ✉️ 이메일 템플릿 생성
                </h1>
                <p className="text-gray-600">
                    목적에 맞는 효과적인 이메일 템플릿을 생성합니다.
                </p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>1. 템플릿 선택</CardTitle>
                    <CardDescription>
                        이메일의 목적에 가장 적합한 템플릿을 선택하세요.
                    </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                    <TemplateSelector
                        templates={CONTENT_TEMPLATES.EMAIL}
                        selectedId={formData.templateId}
                        onSelect={handleTemplateSelect}
                        disabled={isGenerating}
                    />
                </div>
            </Card>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <CardHeader>
                        <CardTitle>2. 이메일 정보 입력</CardTitle>
                        <CardDescription>
                            수신자의 마음을 사로잡는 이메일을 AI가 작성합니다.
                        </CardDescription>
                    </CardHeader>

                    <div className="px-6 space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                이메일 목적
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['newsletter', 'promotion', 'announcement'] as const).map((purpose) => (
                                    <button
                                        key={purpose}
                                        type="button"
                                        disabled={isGenerating}
                                        onClick={() => setFormData({ ...formData, purpose })}
                                        className={`p-3 rounded-lg border-2 smooth-transition ${formData.purpose === purpose
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-300 hover:border-gray-400 disabled:opacity-50'
                                            }`}
                                    >
                                        <span className="text-sm font-medium">
                                            {purpose === 'newsletter' && '뉴스레터'}
                                            {purpose === 'promotion' && '프로모션'}
                                            {purpose === 'announcement' && '공지사항'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="대상 고객"
                            placeholder="예: 기존 고객, 신규 가입자"
                            value={formData.targetAudience}
                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                            required
                            disabled={isGenerating}
                        />

                        <Textarea
                            label="주요 메시지"
                            placeholder="전달하고 싶은 주요 내용을 입력하세요"
                            value={formData.mainMessage}
                            onChange={(e) => setFormData({ ...formData, mainMessage: e.target.value })}
                            rows={4}
                            required
                            disabled={isGenerating}
                        />

                        <Input
                            label="CTA 텍스트 (버튼 또는 링크)"
                            placeholder="예: 지금 확인하기, 무료로 시작하기"
                            value={formData.ctaText}
                            onChange={(e) => setFormData({ ...formData, ctaText: e.target.value })}
                            required
                            disabled={isGenerating}
                        />
                    </div>

                    <div className="px-6 pb-6 flex gap-3">
                        <Button
                            type="submit"
                            variant="primary"
                            className="flex-1"
                            disabled={isGenerating}
                        >
                            {isGenerating ? 'AI가 작성하는 중...' : '이메일 생성하기 ✨'}
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
                            <CardTitle>생성된 이메일 템플릿</CardTitle>
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
