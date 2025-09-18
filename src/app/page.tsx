'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '@/lib/localStorage';
import { Trees, Heart, Brain, Users, ArrowRight, Play, Star, Sparkles, Leaf, Camera } from 'lucide-react';

export default function HomePage() {
  const [isClient, setIsClient] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const router = useRouter();

  const testimonials = [
    { name: "김미영", age: "45세", content: "스트레스가 많았는데 AI 추천 덕분에 마음이 정말 편해졌어요", rating: 5 },
    { name: "박준호", age: "52세", content: "AR 체험이 신기해요! 집에서도 숲에 있는 기분이 들어요", rating: 5 },
    { name: "이소영", age: "38세", content: "커뮤니티에서 다른 분들과 소통하니 더 재미있어요", rating: 5 }
  ];

  useEffect(() => {
    setIsClient(true);

    // Check if onboarding is completed
    if (LocalStorage.isOnboardingCompleted()) {
      router.push('/dashboard');
    }

    // Testimonial rotation
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [router]);

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-forest-50 via-white to-forest-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-earth-600">숲의 마음을 준비하고 있어요...</p>
        </div>
      </div>
    );
  }

  const handleStart = () => {
    router.push('/onboarding');
  };

  const handleVideoPlay = () => {
    setIsVideoPlaying(true);
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-forest-50 via-white to-forest-100">
        <div className="absolute top-20 left-10 w-32 h-32 bg-forest-200 rounded-full opacity-30 animate-float"></div>
        <div className="absolute top-40 right-20 w-20 h-20 bg-forest-300 rounded-full opacity-40 animate-float" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-forest-100 rounded-full opacity-50 animate-float" style={{animationDelay: '4s'}}></div>
      </div>

      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Hero Section */}
        <header className="text-center py-16 px-4">
          <div className="max-w-6xl mx-auto">
            {/* Logo & Title */}
            <div className="mb-8">
              <div className="inline-flex items-center justify-center mb-6 p-4 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg">
                <Trees className="h-20 w-20 text-forest-600 mr-4 animate-pulse" />
                <div className="text-left">
                  <h1 className="text-6xl md:text-7xl font-bold text-forest-800 leading-tight">
                    숲심
                  </h1>
                  <p className="text-xl text-forest-600 font-medium">(森心)</p>
                </div>
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-forest-800 mb-4">
                AI 기반 개인 맞춤형 산림치료 서비스
              </h2>
              <p className="text-lg md:text-xl text-earth-600 max-w-3xl mx-auto leading-relaxed">
                스트레스 해소와 마음의 평화를 위한 당신만의 <br />
                <span className="text-forest-600 font-semibold">디지털 산림 동반자</span>
              </p>
            </div>

            {/* CTA Button */}
            <div className="mb-12">
              <button
                onClick={handleStart}
                className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-white rounded-3xl forest-gradient hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 overflow-hidden"
              >
                <span className="absolute inset-0 bg-white/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                <Sparkles className="w-6 h-6 mr-3 animate-pulse" />
                3분만에 시작하기
                <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform duration-300" />
              </button>

              <p className="text-sm text-earth-500 mt-4 flex items-center justify-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                지금 <span className="font-semibold mx-1">2,847명</span>이 힐링 여정 중
              </p>
            </div>

            {/* Demo Video Section */}
            <div className="max-w-4xl mx-auto">
              <div className="relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl">
                {!isVideoPlaying ? (
                  // Video Preview (Before Click)
                  <div
                    className="relative bg-gradient-to-br from-forest-100 to-forest-200 rounded-2xl h-64 md:h-80 flex items-center justify-center group cursor-pointer hover:scale-105 transition-transform duration-300"
                    onClick={() => handleVideoPlay()}
                  >
                    <div className="absolute inset-0 bg-black/10 rounded-2xl"></div>
                    <div className="relative z-10 text-center">
                      <div className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300 shadow-lg">
                        <Play className="w-8 h-8 text-forest-600 ml-1" />
                      </div>
                      <p className="text-forest-800 font-semibold text-lg">데모 영상 보기</p>
                    </div>
                  </div>
                ) : (
                  // Embedded Video (After Click)
                  <div className="relative">
                    <div className="relative rounded-2xl overflow-hidden" style={{ paddingBottom: '56.25%' /* 16:9 aspect ratio */ }}>
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/GXDciJLAg-k?autoplay=1&rel=0"
                        title="숲심 데모 영상"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>

                    {/* Video Info */}
                    <div className="mt-4 text-center">
                      <h3 className="text-xl font-bold text-forest-800 mb-2">
                        숲심(森心) 데모 영상
                      </h3>
                      <p className="text-earth-600 mb-4">
                        AI 기반 개인 맞춤형 산림치료 서비스의 실제 사용 모습
                      </p>

                      {/* Back to Preview Button */}
                      <button
                        onClick={() => setIsVideoPlaying(false)}
                        className="px-6 py-2 bg-earth-100 text-earth-600 rounded-xl hover:bg-earth-200 transition-all text-sm"
                      >
                        미리보기로 돌아가기
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Features Section */}
        <section className="py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-forest-800 mb-4">
                왜 <span className="text-forest-600">숲심</span>을 선택해야 할까요?
              </h2>
              <p className="text-earth-600 text-lg max-w-2xl mx-auto">
                과학적 근거와 최신 AI 기술을 바탕으로 한 개인 맞춤형 힐링 솔루션
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <div className="group forest-card rounded-3xl p-8 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-10 w-10 text-purple-600" />
                </div>
                <h3 className="text-2xl font-bold text-forest-800 mb-4">AI 맞춤 추천</h3>
                <p className="text-earth-600 leading-relaxed">
                  개인의 스트레스 수준과 선호도를 분석하여
                  <span className="font-semibold text-forest-600"> 최적의 산림치료 프로그램</span>을 추천합니다
                </p>
                <div className="mt-6 flex justify-center">
                  <span className="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                    실시간 개인화
                  </span>
                </div>
              </div>

              <div className="group forest-card rounded-3xl p-8 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="h-10 w-10 text-blue-600" />
                </div>
                <h3 className="text-2xl font-bold text-forest-800 mb-4">가상 AR 체험</h3>
                <p className="text-earth-600 leading-relaxed">
                  집에서도 산림욕을 경험할 수 있는
                  <span className="font-semibold text-forest-600"> 몰입형 AR 기술</span>로 자연과 하나가 되어보세요
                </p>
                <div className="mt-6 flex justify-center">
                  <span className="px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                    웹캠 기반 AR
                  </span>
                </div>
              </div>

              <div className="group forest-card rounded-3xl p-8 text-center hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-10 w-10 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-forest-800 mb-4">힐링 커뮤니티</h3>
                <p className="text-earth-600 leading-relaxed">
                  같은 목표를 가진 사람들과 경험을 공유하고
                  <span className="font-semibold text-forest-600"> 함께 성장하는 커뮤니티</span>
                </p>
                <div className="mt-6 flex justify-center">
                  <span className="px-4 py-2 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                    실시간 소통
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* User Testimonials */}
        <section className="py-16 px-4 bg-white/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-forest-800 mb-4">
              이미 많은 분들이 경험하고 있어요
            </h2>
            <p className="text-earth-600 mb-12">실제 사용자들의 생생한 후기</p>

            <div className="relative">
              <div className="forest-card rounded-3xl p-8 max-w-2xl mx-auto">
                <div className="flex justify-center mb-4">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl text-earth-700 leading-relaxed mb-6">
                  &ldquo;{testimonials[currentTestimonial].content}&rdquo;
                </blockquote>
                <div className="text-forest-600 font-semibold">
                  {testimonials[currentTestimonial].name} ({testimonials[currentTestimonial].age})
                </div>
              </div>

              <div className="flex justify-center mt-6 space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      index === currentTestimonial ? 'bg-forest-600' : 'bg-earth-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-forest-600 mb-2">2,847</div>
                <div className="text-earth-600">활성 사용자</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-forest-600 mb-2">98%</div>
                <div className="text-earth-600">만족도</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-forest-600 mb-2">15,230</div>
                <div className="text-earth-600">완료된 힐링세션</div>
              </div>
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-forest-600 mb-2">-3.2</div>
                <div className="text-earth-600">평균 스트레스 감소</div>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <div className="forest-card rounded-3xl p-12 bg-gradient-to-br from-forest-50 to-forest-100 border-2 border-forest-200">
              <Leaf className="w-16 h-16 text-forest-600 mx-auto mb-6 animate-pulse" />
              <h2 className="text-3xl md:text-4xl font-bold text-forest-800 mb-6">
                지금 바로 시작하세요
              </h2>
              <p className="text-xl text-earth-600 mb-8 leading-relaxed">
                3분의 간단한 설정으로 당신만의 맞춤형 산림치료 여정이 시작됩니다
              </p>

              <div className="space-y-4">
                <button
                  onClick={handleStart}
                  className="w-full md:w-auto forest-gradient text-white font-bold py-5 px-12 rounded-2xl text-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300"
                >
                  🌿 무료로 시작하기
                </button>

                <div className="flex items-center justify-center text-sm text-earth-500">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  무료 체험 • 설치 불필요 • 즉시 사용 가능
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center py-8 px-4 border-t border-earth-200 bg-white/80 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-4">
              <Trees className="h-8 w-8 text-forest-600 mr-2" />
              <span className="text-forest-800 font-bold text-lg">숲심(森心)</span>
            </div>
            <p className="text-earth-500 text-sm">
              &copy; 2025 한국산림복지진흥원. 건강한 산림복지 문화 조성을 위하여.
            </p>
            <p className="text-earth-400 text-xs mt-2">
              AI 기반 개인 맞춤형 산림치료 서비스 • 웹 접근성 AA 등급 준수
            </p>
          </div>
        </footer>
      </div>

    </div>
  );
}