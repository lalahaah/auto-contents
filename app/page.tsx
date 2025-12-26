import { useState } from 'react';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import FeatureCard from '@/components/features/FeatureCard';
import PricingTable from '@/components/features/PricingTable';
import TestimonialCard from '@/components/features/TestimonialCard';
import Button from '@/components/ui/Button';
import { TESTIMONIALS } from '@/lib/constants';
import Modal from '@/components/ui/Modal';

export default function Home() {
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* 히어로 섹션 */}
        <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-16 md:py-24 lg:py-32 overflow-hidden">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 lg:items-center">
              {/* 왼쪽: 텍스트 영역 */}
              <div className="text-center lg:text-left mb-12 lg:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                  <span className="gradient-text">AI로 콘텐츠를</span>
                  <br />
                  <span className="relative z-10">자동 생성하세요!</span>
                  <span className="absolute -z-10 bottom-2 left-0 w-full h-3 bg-blue-200/50 transform -rotate-1 hidden lg:block"></span>
                </h1>
                <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-2xl mx-auto lg:mx-0">
                  블로그, 소셜미디어, 이메일, 상품 설명을 몇 초 만에 생성하세요.
                  마케팅 콘텐츠 제작이 이렇게 쉬웠던 적이 없습니다.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/auth">
                    <Button variant="primary" size="lg" className="text-lg px-8 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all">
                      무료로 시작하기 →
                    </Button>
                  </Link>
                  <Button
                    variant="outline"
                    size="lg"
                    className="text-lg px-8"
                    onClick={() => setIsDemoOpen(true)}
                  >
                    데모 보기
                  </Button>
                </div>
                <p className="mt-6 text-sm text-gray-500 flex items-center justify-center lg:justify-start gap-2">
                  <span className="flex items-center"><span className="text-green-500 mr-1">✓</span> 신용카드 불필요</span>
                  <span className="flex items-center"><span className="text-green-500 mr-1">✓</span> 즉시 이용 가능</span>
                </p>
              </div>

              {/* 오른쪽: 이미지 영역 */}
              <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
                <div className="relative rounded-2xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:-m-4 lg:rounded-3xl lg:p-4 shadow-2xl animate-in slide-in-from-right duration-700">
                  <div className="relative rounded-xl bg-white shadow-xl ring-1 ring-gray-900/10 overflow-hidden aspect-[4/3] lg:aspect-[3/2] group">
                    {/* Background Image: Abstract Tech Theme */}
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=1920&auto=format&fit=crop"
                      alt="Future Technology Abstract"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />

                    {/* Dark Overlay for text readability */}
                    <div className="absolute inset-0 bg-black/40"></div>

                    {/* UI Overlay: Typing Animation */}
                    <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12 text-white">
                      <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-2xl transform transition-transform hover:scale-[1.02]">
                        <div className="flex items-center space-x-2 mb-4 border-b border-white/10 pb-2">
                          <div className="flex space-x-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                          </div>
                          <span className="text-xs text-gray-300 ml-2">Ai_Writer.app</span>
                        </div>

                        <div className="space-y-3 font-mono">
                          <div className="text-sm text-blue-300">User: 블로그 포스트 써줘</div>
                          <div className="text-sm">
                            <span className="text-purple-300">AI:</span>
                            <span className="typing-effect ml-2 text-gray-100">
                              디지털 시대의 마케팅 전략은 더 이상 선택이 아닌 필수입니다.
                              AI 기술을 활용하여...
                            </span>
                            <span className="animate-pulse inline-block w-2 h-4 bg-white align-middle ml-1"></span>
                          </div>
                        </div>

                        {/* Progress Bar Animation */}
                        <div className="mt-4">
                          <div className="flex justify-between text-xs text-gray-400 mb-1">
                            <span>Generating...</span>
                            <span>87%</span>
                          </div>
                          <div className="h-1.5 w-full bg-gray-600 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 animate-[width_2s_ease-out_infinite]" style={{ width: '87%' }}></div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {/* Decorative Elements */}
                <div className="absolute -top-12 -right-12 -z-10 w-64 h-64 bg-purple-400/30 rounded-full blur-3xl opacity-60 animate-pulse"></div>
                <div className="absolute -bottom-12 -left-12 -z-10 w-64 h-64 bg-blue-400/30 rounded-full blur-3xl opacity-60 animate-pulse delay-1000"></div>
              </div>
            </div>
          </div>
        </section>

        {/* 기능 소개 섹션 */}
        <section id="features" className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                모든 콘텐츠를 한 곳에서
              </h2>
              <p className="text-lg text-gray-600">
                다양한 플랫폼과 목적에 맞는 콘텐츠를 AI가 자동으로 생성합니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FeatureCard type="BLOG" />
              <FeatureCard type="SOCIAL" />
              <FeatureCard type="EMAIL" />
              <FeatureCard type="PRODUCT" />
            </div>
          </div>
        </section>

        {/* 요금제 섹션 */}
        <section className="py-20 bg-gray-50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                간단하고 명확한 요금제
              </h2>
              <p className="text-lg text-gray-600">
                무료로 시작하고, 필요할 때 프리미엄으로 업그레이드하세요.
              </p>
            </div>

            <PricingTable />
          </div>
        </section>

        {/* 고객 후기 섹션 */}
        <section className="py-20 bg-white">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                사용자들의 이야기
              </h2>
              <p className="text-lg text-gray-600">
                이미 많은 분들이 Auto Content Manager로 더 효율적으로 일하고 있습니다.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial) => (
                <TestimonialCard key={testimonial.id} {...testimonial} />
              ))}
            </div>
          </div>
        </section>

        {/* CTA 섹션 */}
        <section className="relative py-24 overflow-hidden">
          {/* Background Image with Overlay */}
          <div className="absolute inset-0 z-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=1920&auto=format&fit=crop"
              alt="Team Collaboration"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-blue-900/80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
          </div>

          <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 tracking-tight">
              지금 바로 시작하세요
            </h2>
            <p className="text-xl text-gray-100 mb-10 max-w-2xl mx-auto leading-relaxed">
              몇 초 만에 가입하고, 바로 콘텐츠를 생성해보세요.
              <br />
              신용카드 없이도 <span className="text-yellow-300 font-semibold">100% 무료</span>로 시작할 수 있습니다.
            </p>
            <Link href="/auth">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-blue-600 hover:bg-blue-50 hover:text-blue-700 border-none px-10 py-4 text-xl shadow-2xl transition-all hover:scale-105"
              >
                무료로 시작하기 🚀
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />

      {/* Demo Modal */}
      <Modal isOpen={isDemoOpen} onClose={() => setIsDemoOpen(false)} title="AI 콘텐츠 생성 데모">
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center space-x-2 mb-2 text-sm text-gray-500">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              <span>AI Writing Assistant</span>
            </div>
            <div className="space-y-2">
              <p className="text-gray-800 typing-effect">
                AI가 입력하신 주제를 바탕으로 고품질 블로그 포스트를 작성하고 있습니다.
                <br />
                <span className="text-blue-600 font-medium">Auto Content Manager</span>는 마케팅 효율을 10배 높여줍니다.
              </p>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden w-full mt-4">
                <div className="h-full bg-blue-500 animate-[width_2s_ease-out_infinite]" style={{ width: '60%' }}></div>
              </div>
            </div>
          </div>
          <p className="text-center text-sm text-gray-500">
            실제 서비스에서는 4가지 유형의 템플릿을 제공합니다.
          </p>
          <div className="flex justify-center mt-4">
            <Link href="/auth" onClick={() => setIsDemoOpen(false)}>
              <Button variant="primary" className="w-full">
                무료로 체험해보기
              </Button>
            </Link>
          </div>
        </div>
      </Modal>
    </div >
  );
}

