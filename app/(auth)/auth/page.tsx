import Link from 'next/link';
import AuthForm from '@/components/auth/AuthForm';

export default function AuthPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 px-4">
            {/* 로고 */}
            <Link href="/" className="flex items-center space-x-2 mb-8">
                <span className="text-3xl">🤖</span>
                <span className="text-2xl font-bold gradient-text">Auto Content Manager</span>
            </Link>

            {/* 인증 폼 */}
            <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
                <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
                    환영합니다!
                </h2>
                <p className="text-gray-600 text-center mb-8">
                    AI로 콘텐츠를 빠르게 생성하세요
                </p>

                <AuthForm />
            </div>

            {/* 돌아가기 링크 */}
            <Link
                href="/"
                className="mt-6 text-sm text-gray-600 hover:text-gray-900 smooth-transition"
            >
                ← 홈으로 돌아가기
            </Link>
        </div>
    );
}
