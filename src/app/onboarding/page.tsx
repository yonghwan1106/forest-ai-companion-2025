'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '@/lib/localStorage';
import { UserProfile } from '@/lib/types';
import OnboardingStep from '@/components/OnboardingStep';
import { ArrowLeft, ArrowRight, User, MapPin, Heart, Activity, Trees } from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  const [formData, setFormData] = useState({
    name: '',
    age: 30,
    gender: 'male' as 'male' | 'female' | 'other',
    location: '',
    stressLevel: 5,
    preferredActivities: [] as string[],
    healthCondition: '',
    forestExperience: false,
  });

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleComplete = () => {
    const userProfile: UserProfile = {
      id: `user_${Date.now()}`,
      ...formData,
      createdAt: new Date(),
    };

    LocalStorage.saveUserProfile(userProfile);
    LocalStorage.setOnboardingCompleted(true);
    router.push('/dashboard');
  };

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const toggleActivity = (activity: string) => {
    setFormData(prev => ({
      ...prev,
      preferredActivities: prev.preferredActivities.includes(activity)
        ? prev.preferredActivities.filter(a => a !== activity)
        : [...prev.preferredActivities, activity]
    }));
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <OnboardingStep
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="안녕하세요! 🌲"
            subtitle="당신의 숲 여정을 시작하기 위해 몇 가지 정보가 필요해요"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  <User className="w-4 h-4 inline mr-2" />
                  이름 또는 닉네임
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  placeholder="어떻게 불러드릴까요?"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    나이
                  </label>
                  <input
                    type="number"
                    value={formData.age}
                    onChange={(e) => updateFormData({ age: parseInt(e.target.value) || 30 })}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                    min="10"
                    max="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-earth-700 mb-2">
                    성별
                  </label>
                  <select
                    value={formData.gender}
                    onChange={(e) => updateFormData({ gender: e.target.value as any })}
                    className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  >
                    <option value="male">남성</option>
                    <option value="female">여성</option>
                    <option value="other">기타</option>
                  </select>
                </div>
              </div>
            </div>
          </OnboardingStep>
        );

      case 2:
        return (
          <OnboardingStep
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="어디에 거주하시나요? 📍"
            subtitle="지역별 맞춤 추천을 위해 필요해요"
          >
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  <MapPin className="w-4 h-4 inline mr-2" />
                  거주 지역
                </label>
                <select
                  value={formData.location}
                  onChange={(e) => updateFormData({ location: e.target.value })}
                  className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                >
                  <option value="">지역을 선택해주세요</option>
                  <option value="서울">서울특별시</option>
                  <option value="경기">경기도</option>
                  <option value="인천">인천광역시</option>
                  <option value="부산">부산광역시</option>
                  <option value="대구">대구광역시</option>
                  <option value="대전">대전광역시</option>
                  <option value="광주">광주광역시</option>
                  <option value="울산">울산광역시</option>
                  <option value="강원">강원도</option>
                  <option value="충북">충청북도</option>
                  <option value="충남">충청남도</option>
                  <option value="전북">전라북도</option>
                  <option value="전남">전라남도</option>
                  <option value="경북">경상북도</option>
                  <option value="경남">경상남도</option>
                  <option value="제주">제주특별자치도</option>
                </select>
              </div>
            </div>
          </OnboardingStep>
        );

      case 3:
        return (
          <OnboardingStep
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="현재 스트레스 수준은 어떠신가요? 😰"
            subtitle="1(매우 낮음) ~ 10(매우 높음)"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-4">
                  <Heart className="w-4 h-4 inline mr-2" />
                  스트레스 수준: {formData.stressLevel}점
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={formData.stressLevel}
                  onChange={(e) => updateFormData({ stressLevel: parseInt(e.target.value) })}
                  className="w-full h-3 bg-earth-200 rounded-lg appearance-none cursor-pointer slider"
                />
                <div className="flex justify-between text-sm text-earth-500 mt-2">
                  <span>1 (평온)</span>
                  <span>5 (보통)</span>
                  <span>10 (매우 높음)</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className={`p-4 rounded-xl ${formData.stressLevel <= 3 ? 'bg-green-100 text-green-800' : 'bg-earth-100 text-earth-500'}`}>
                  <div className="text-2xl mb-2">😌</div>
                  <div className="text-sm">평온</div>
                </div>
                <div className={`p-4 rounded-xl ${formData.stressLevel >= 4 && formData.stressLevel <= 7 ? 'bg-yellow-100 text-yellow-800' : 'bg-earth-100 text-earth-500'}`}>
                  <div className="text-2xl mb-2">😐</div>
                  <div className="text-sm">보통</div>
                </div>
                <div className={`p-4 rounded-xl ${formData.stressLevel >= 8 ? 'bg-red-100 text-red-800' : 'bg-earth-100 text-earth-500'}`}>
                  <div className="text-2xl mb-2">😰</div>
                  <div className="text-sm">높음</div>
                </div>
              </div>
            </div>
          </OnboardingStep>
        );

      case 4:
        return (
          <OnboardingStep
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="어떤 활동을 선호하시나요? 🏃‍♂️"
            subtitle="관심 있는 활동을 모두 선택해주세요"
          >
            <div className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  { id: 'walking', label: '산책', icon: '🚶‍♂️' },
                  { id: 'meditation', label: '명상', icon: '🧘‍♀️' },
                  { id: 'hiking', label: '등산', icon: '🥾' },
                  { id: 'exercise', label: '운동', icon: '🏃‍♂️' },
                  { id: 'reading', label: '독서', icon: '📚' },
                  { id: 'photography', label: '사진촬영', icon: '📸' },
                ].map((activity) => (
                  <button
                    key={activity.id}
                    onClick={() => toggleActivity(activity.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.preferredActivities.includes(activity.id)
                        ? 'border-forest-500 bg-forest-50 text-forest-800'
                        : 'border-earth-200 bg-white text-earth-600 hover:border-forest-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">{activity.icon}</div>
                    <div className="text-sm font-medium">{activity.label}</div>
                  </button>
                ))}
              </div>
            </div>
          </OnboardingStep>
        );

      case 5:
        return (
          <OnboardingStep
            currentStep={currentStep}
            totalSteps={totalSteps}
            title="마지막 질문이에요! 🌲"
            subtitle="더 나은 추천을 위한 추가 정보"
          >
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-earth-700 mb-2">
                  <Activity className="w-4 h-4 inline mr-2" />
                  현재 건강 상태나 고민이 있다면?
                </label>
                <textarea
                  value={formData.healthCondition}
                  onChange={(e) => updateFormData({ healthCondition: e.target.value })}
                  className="w-full px-4 py-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  placeholder="예: 어깨 결림, 불면증, 집중력 저하 등 (선택사항)"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-earth-700 mb-3">
                  <Trees className="w-4 h-4 inline mr-2" />
                  산림복지시설을 이용해본 경험이 있나요?
                </label>
                <div className="flex gap-4">
                  <button
                    onClick={() => updateFormData({ forestExperience: true })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      formData.forestExperience
                        ? 'border-forest-500 bg-forest-50 text-forest-800'
                        : 'border-earth-200 bg-white text-earth-600 hover:border-forest-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">✅</div>
                    <div className="font-medium">있어요</div>
                  </button>
                  <button
                    onClick={() => updateFormData({ forestExperience: false })}
                    className={`flex-1 p-4 rounded-xl border-2 transition-all ${
                      !formData.forestExperience
                        ? 'border-forest-500 bg-forest-50 text-forest-800'
                        : 'border-earth-200 bg-white text-earth-600 hover:border-forest-300'
                    }`}
                  >
                    <div className="text-2xl mb-2">🆕</div>
                    <div className="font-medium">처음이에요</div>
                  </button>
                </div>
              </div>
            </div>
          </OnboardingStep>
        );

      default:
        return null;
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.name.length > 0;
      case 2:
        return formData.location.length > 0;
      case 3:
        return true; // Stress level always has a default value
      case 4:
        return formData.preferredActivities.length > 0;
      case 5:
        return true; // Optional fields
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {renderStep()}

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8 max-w-2xl mx-auto">
          <button
            onClick={handleBack}
            disabled={currentStep === 1}
            className={`flex items-center px-6 py-3 rounded-xl font-medium transition-all ${
              currentStep === 1
                ? 'text-earth-400 cursor-not-allowed'
                : 'text-earth-600 hover:text-forest-600 hover:bg-forest-50'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            이전
          </button>

          <button
            onClick={handleNext}
            disabled={!isStepValid()}
            className={`flex items-center px-8 py-3 rounded-xl font-medium transition-all ${
              isStepValid()
                ? 'forest-gradient text-white hover:shadow-lg transform hover:-translate-y-0.5'
                : 'bg-earth-200 text-earth-400 cursor-not-allowed'
            }`}
          >
            {currentStep === totalSteps ? '완료' : '다음'}
            {currentStep !== totalSteps && <ArrowRight className="w-4 h-4 ml-2" />}
          </button>
        </div>
      </div>
    </div>
  );
}