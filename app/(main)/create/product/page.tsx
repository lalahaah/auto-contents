'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Card, { CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import Input, { Textarea } from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { ProductFormData, ContentType } from '@/lib/types';
import { useNotification } from '@/hooks/useNotification';
import { AlertModal } from '@/components/ui/Modal';
import { useUserContent } from '@/contexts/UserContext';
import { useAuth } from '@/contexts/AuthContext';
import { CONTENT_TEMPLATES } from '@/lib/constants';
import TemplateSelector from '@/components/create/TemplateSelector';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';

export default function CreateProductPage() {
    const router = useRouter();
    const { isOpen, message, showNotification, closeNotification } = useNotification();
    const { addContent } = useUserContent();
    const { user } = useAuth();

    const [isGenerating, setIsGenerating] = useState(false);
    const [result, setResult] = useState<string | null>(null);

    const [formData, setFormData] = useState<ProductFormData>({
        templateId: CONTENT_TEMPLATES.PRODUCT[0].id,
        productName: '',
        features: [],
        targetAudience: '',
        usp: '',
    });

    const handleTemplateSelect = (id: string, isPremium: boolean) => {
        if (isPremium && user?.plan !== 'PREMIUM') {
            showNotification('이 템플릿은 프리미엄 플랜 전용입니다. 플랜을 업그레이드 해주세요!');
            return;
        }
        setFormData({ ...formData, templateId: id });
    };
    const [featureInput, setFeatureInput] = useState('');

    const handleAddFeature = () => {
        if (featureInput.trim() && formData.features.length < 5) {
            setFormData({
                ...formData,
                features: [...formData.features, featureInput.trim()],
            });
            setFeatureInput('');
        }
    };

    const handleRemoveFeature = (index: number) => {
        setFormData({
            ...formData,
            features: formData.features.filter((_, i) => i !== index),
        });
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
                    type: 'PRODUCT',
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
                type: 'PRODUCT' as ContentType,
                title: `${formData.productName} 상품 설명`,
                content: generatedContent,
                metadata: {
                    templateId: formData.templateId,
                    targetAudience: formData.targetAudience
                }
            });

            showNotification('상품 설명이 생성되어 자동으로 저장되었습니다!');
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
                    🛍️ 상품 설명 생성
                </h1>
                <p className="text-gray-600">
                    판매를 촉진하는 매력적인 상품 설명을 작성합니다.
                </p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>1. 템플릿 선택</CardTitle>
                    <CardDescription>
                        상품의 특성과 강조하고 싶은 포인트를 잘 살려줄 템플릿을 선택하세요.
                    </CardDescription>
                </CardHeader>
                <div className="px-6 pb-6">
                    <TemplateSelector
                        templates={CONTENT_TEMPLATES.PRODUCT}
                        selectedId={formData.templateId}
                        onSelect={handleTemplateSelect}
                        disabled={isGenerating}
                    />
                </div>
            </Card>

            <Card>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <CardHeader>
                        <CardTitle>2. 상품 정보 입력</CardTitle>
                        <CardDescription>
                            상품의 가치를 효과적으로 전달하는 설명을 AI가 생성합니다.
                        </CardDescription>
                    </CardHeader>

                    <div className="px-6 space-y-4">
                        <Input
                            label="상품명"
                            placeholder="예: 프리미엄 무선 이어폰"
                            value={formData.productName}
                            onChange={(e) => setFormData({ ...formData, productName: e.target.value })}
                            required
                            disabled={isGenerating}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                주요 특징 (최대 5개)
                            </label>
                            <div className="flex gap-2 mb-2">
                                <Input
                                    placeholder="특징 입력 후 추가 버튼 클릭"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            e.preventDefault();
                                            handleAddFeature();
                                        }
                                    }}
                                    disabled={isGenerating || formData.features.length >= 5}
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={handleAddFeature}
                                    disabled={isGenerating || formData.features.length >= 5}
                                >
                                    추가
                                </Button>
                            </div>
                            <div className="space-y-2">
                                {formData.features.map((feature, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-2 bg-gray-50 rounded"
                                    >
                                        <span className="text-sm">{feature}</span>
                                        <button
                                            type="button"
                                            disabled={isGenerating}
                                            onClick={() => handleRemoveFeature(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            삭제
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <Input
                            label="대상 고객"
                            placeholder="예: 운동을 즐기는 20-30대"
                            value={formData.targetAudience}
                            onChange={(e) => setFormData({ ...formData, targetAudience: e.target.value })}
                            required
                            disabled={isGenerating}
                        />

                        <Textarea
                            label="USP (Unique Selling Point)"
                            placeholder="이 상품만의 독특한 장점을 입력하세요"
                            value={formData.usp}
                            onChange={(e) => setFormData({ ...formData, usp: e.target.value })}
                            rows={3}
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
                            {isGenerating ? 'AI가 특징을 분석하는 중...' : '상품 설명 생성하기 ✨'}
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
                            <CardTitle>생성된 상품 설명</CardTitle>
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

            <AlertModal isOpen={isOpen} onClose={closeNotification} message={message} />
        </div>
    );
}
