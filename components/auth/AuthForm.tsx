'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useNotification } from '@/hooks/useNotification';
import { AlertModal } from '../ui/Modal';

export default function AuthForm() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();
    const { login, signup } = useAuth();
    const { isOpen, message, showNotification, showComingSoon, closeNotification } = useNotification();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Submitting form...', { isLogin, email, password, name });

        if (!email || !password) {
            showNotification('이메일과 비밀번호를 모두 입력해 주세요.');
            return;
        }

        setIsLoading(true);

        try {
            if (isLogin) {
                await login(email, password);
                console.log('Login success - redirecting to dashboard');
                window.location.href = '/dashboard';
            } else {
                await signup(email, password, name);
                console.log('Signup success - showing confirmation');
                showNotification('회원 가입을 해주셔서 감사합니다! 이메일 주소로 발송된 인증 메일을 확인해 주세요. 인증이 완료된 후 로그인이 가능합니다.');
                setIsLogin(true);
            }
        } catch (error: any) {
            console.error('Auth handler error:', error);
            // 사용자에게 익숙한 에러 메시지로 변환
            let errorMessage = '인증 중 오류가 발생했습니다.';

            if (error.message === 'User already registered') {
                errorMessage = '이미 가입한 이메일입니다. 로그인 해주시기 바랍니다.';
                setIsLogin(true);
            } else if (error.message === 'Email not confirmed') {
                errorMessage = '이메일 인증이 완료되지 않았습니다. 메일함을 확인하거나 잠시 후 다시 시도해 주세요.';
            } else if (error.message === 'Invalid login credentials' || error.status === 400) {
                errorMessage = '이메일 또는 비밀번호가 올바르지 않습니다.';
            } else {
                errorMessage = error.message || errorMessage;
            }

            showNotification(errorMessage);
            console.warn('Authentication issue:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSocialLogin = (provider: string) => {
        showComingSoon();
    };

    return (
        <>
            <div className="w-full max-w-md">
                {/* 탭 전환 */}
                <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                    <button
                        onClick={() => setIsLogin(true)}
                        className={`flex-1 py-2 px-4 rounded-md font-medium smooth-transition ${isLogin
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        로그인
                    </button>
                    <button
                        onClick={() => setIsLogin(false)}
                        className={`flex-1 py-2 px-4 rounded-md font-medium smooth-transition ${!isLogin
                            ? 'bg-white text-gray-900 shadow-sm'
                            : 'text-gray-600 hover:text-gray-900'
                            }`}
                    >
                        회원가입
                    </button>
                </div>

                {/* 폼 */}
                <form onSubmit={handleSubmit} className="space-y-4">
                    {!isLogin && (
                        <Input
                            label="이름"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="홍길동"
                            required
                        />
                    )}

                    <Input
                        label="이메일"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="example@email.com"
                        required
                    />

                    <Input
                        label="비밀번호"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        className="w-full"
                        isLoading={isLoading}
                    >
                        {isLogin ? '로그인' : '회원가입'}
                    </Button>
                </form>

                {/* 구분선 */}
                <div className="relative my-6">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-300"></div>
                    </div>
                    <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">또는</span>
                    </div>
                </div>

                {/* 소셜 로그인 */}
                <div className="space-y-3">
                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => handleSocialLogin('google')}
                    >
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google로 계속하기
                    </Button>
                </div>

                {/* 추가 링크 */}
                <p className="mt-6 text-center text-sm text-gray-600">
                    {isLogin ? (
                        <>
                            계정이 없으신가요?{' '}
                            <button
                                onClick={() => setIsLogin(false)}
                                className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                                회원가입
                            </button>
                        </>
                    ) : (
                        <>
                            이미 계정이 있으신가요?{' '}
                            <button
                                onClick={() => setIsLogin(true)}
                                className="text-blue-600 hover:text-blue-500 font-medium"
                            >
                                로그인
                            </button>
                        </>
                    )}
                </p>
            </div>

            <AlertModal
                isOpen={isOpen}
                onClose={closeNotification}
                message={message}
            />
        </>
    );
}
