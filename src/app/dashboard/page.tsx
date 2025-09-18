'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '@/lib/localStorage';
import { UserProfile, AIRecommendation, ActivityRecord } from '@/lib/types';
import { getForestRecommendation } from '@/lib/claudeApi';
import Navigation from '@/components/Navigation';
import AIRecommendationCard from '@/components/AIRecommendationCard';
import {
  Calendar,
  MapPin,
  Heart,
  Activity,
  Camera,
  TrendingUp,
  Users,
  Sun,
  Cloud,
  Brain
} from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [currentRecommendation, setCurrentRecommendation] = useState<AIRecommendation | null>(null);
  const [recentActivities, setRecentActivities] = useState<ActivityRecord[]>([]);
  const [currentStress, setCurrentStress] = useState(5);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    if (!LocalStorage.isOnboardingCompleted()) {
      router.push('/');
      return;
    }

    const profile = LocalStorage.getUserProfile();
    if (!profile) {
      router.push('/onboarding');
      return;
    }

    setUserProfile(profile);
    setCurrentStress(profile.stressLevel);

    // Load existing recommendation or generate new one
    const recommendations = LocalStorage.getRecommendations();
    const todayRecommendations = recommendations.filter(rec => {
      const today = new Date().toDateString();
      const recDate = new Date(rec.createdAt).toDateString();
      return today === recDate;
    });

    if (todayRecommendations.length > 0) {
      setCurrentRecommendation(todayRecommendations[todayRecommendations.length - 1]);
      setIsLoading(false);
    } else {
      generateInitialRecommendation(profile);
    }

    // Load recent activities
    const activities = LocalStorage.getActivities();
    setRecentActivities(activities.slice(-5).reverse());
  }, [router]);

  const generateInitialRecommendation = async (profile: UserProfile) => {
    try {
      const recommendation = await getForestRecommendation(profile);
      LocalStorage.saveRecommendation(recommendation);
      setCurrentRecommendation(recommendation);
    } catch (error) {
      console.error('Error generating initial recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStressUpdate = (newLevel: number) => {
    setCurrentStress(newLevel);
    if (userProfile) {
      const updatedProfile = { ...userProfile, stressLevel: newLevel };
      LocalStorage.saveUserProfile(updatedProfile);
      setUserProfile(updatedProfile);
    }
  };

  const handleRecommendationUpdate = (recommendation: AIRecommendation) => {
    setCurrentRecommendation(recommendation);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-earth-600">숲의 지혜를 준비하고 있어요...</p>
        </div>
      </div>
    );
  }

  if (!userProfile) {
    return null;
  }

  const getGreeting = () => {
    const hour = new Date().getHours();
    const name = userProfile.name;

    if (hour < 12) return `🌅 좋은 아침이에요, ${name}님!`;
    if (hour < 18) return `☀️ 안녕하세요, ${name}님!`;
    return `🌙 좋은 저녁이에요, ${name}님!`;
  };

  const getWeatherIcon = () => {
    // In a real app, this would be from a weather API
    const random = Math.random();
    if (random < 0.6) return <Sun className="w-5 h-5 text-yellow-500" />;
    return <Cloud className="w-5 h-5 text-gray-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-forest-100">
      <Navigation />

      <main className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 mt-16 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold text-forest-800 mb-2">
            {getGreeting()}
          </h1>
          <div className="flex items-center text-earth-600">
            <Calendar className="w-4 h-4 mr-2" />
            <span className="mr-4">{new Date().toLocaleDateString('ko-KR')}</span>
            {getWeatherIcon()}
            <span className="ml-2">오늘도 좋은 하루가 될 거예요</span>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="forest-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-600">현재 스트레스</p>
                <p className="text-2xl font-bold text-forest-800">{currentStress}/10</p>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="forest-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-600">이번 주 활동</p>
                <p className="text-2xl font-bold text-forest-800">{recentActivities.length}</p>
              </div>
              <Activity className="w-8 h-8 text-forest-500" />
            </div>
          </div>

          <div className="forest-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-600">연속 사용일</p>
                <p className="text-2xl font-bold text-forest-800">
                  {Math.floor((Date.now() - userProfile.createdAt.getTime()) / (1000 * 60 * 60 * 24)) + 1}
                </p>
              </div>
              <Calendar className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="forest-card rounded-2xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-600">거주지</p>
                <p className="text-lg font-semibold text-forest-800">{userProfile.location}</p>
              </div>
              <MapPin className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </div>

        {/* Stress Level Update */}
        <div className="forest-card rounded-2xl p-6 mb-8">
          <h3 className="text-lg font-semibold text-forest-800 mb-4 flex items-center">
            <Brain className="w-5 h-5 mr-2" />
            현재 기분이 어떠신가요?
          </h3>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min="1"
              max="10"
              value={currentStress}
              onChange={(e) => handleStressUpdate(parseInt(e.target.value))}
              className="flex-1 h-3 bg-earth-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-lg font-semibold text-forest-800 min-w-[3rem]">
              {currentStress}/10
            </span>
          </div>
          <div className="flex justify-between text-sm text-earth-500 mt-2">
            <span>😌 평온</span>
            <span>😐 보통</span>
            <span>😰 스트레스</span>
          </div>
        </div>

        {/* AI Recommendation */}
        <div className="mb-8">
          <AIRecommendationCard
            userProfile={userProfile}
            recommendation={currentRecommendation}
            onRecommendationUpdate={handleRecommendationUpdate}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <button
            onClick={() => router.push('/ar-experience')}
            className="forest-card rounded-2xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <Camera className="w-12 h-12 text-forest-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-forest-800 mb-2">AR 산림욕</h3>
              <p className="text-earth-600 text-sm">가상현실로 숲 속 힐링 체험</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/progress')}
            className="forest-card rounded-2xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <TrendingUp className="w-12 h-12 text-blue-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-forest-800 mb-2">진행상황</h3>
              <p className="text-earth-600 text-sm">나의 힐링 여정 돌아보기</p>
            </div>
          </button>

          <button
            onClick={() => router.push('/community')}
            className="forest-card rounded-2xl p-6 hover:shadow-lg transition-all group"
          >
            <div className="text-center">
              <Users className="w-12 h-12 text-purple-600 mx-auto mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-forest-800 mb-2">커뮤니티</h3>
              <p className="text-earth-600 text-sm">다른 사람들과 경험 공유</p>
            </div>
          </button>
        </div>

        {/* Recent Activities */}
        {recentActivities.length > 0 && (
          <div className="forest-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-forest-800 mb-4">최근 활동</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 bg-forest-50 rounded-xl">
                  <div>
                    <p className="font-medium text-forest-800">
                      {activity.type === 'forest_visit' && '🌲 산림 방문'}
                      {activity.type === 'meditation' && '🧘‍♀️ 명상'}
                      {activity.type === 'ar_experience' && '📱 AR 체험'}
                      {activity.type === 'virtual_tour' && '🌿 가상 투어'}
                    </p>
                    <p className="text-sm text-earth-600">
                      {activity.duration}분 • 스트레스 {activity.stressLevel}/10
                    </p>
                  </div>
                  <span className="text-sm text-earth-500">
                    {new Date(activity.date).toLocaleDateString('ko-KR')}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}