'use client';

import { useState } from 'react';
import { AIRecommendation } from '@/lib/types';
import { Heart, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { getForestRecommendation, getEmergencyRecommendation } from '@/lib/claudeApi';
import { LocalStorage } from '@/lib/localStorage';

interface AIRecommendationCardProps {
  userProfile: any;
  recommendation: AIRecommendation | null;
  onRecommendationUpdate: (recommendation: AIRecommendation) => void;
}

export default function AIRecommendationCard({
  userProfile,
  recommendation,
  onRecommendationUpdate
}: AIRecommendationCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const handleRefreshRecommendation = async () => {
    if (!userProfile) return;

    setIsLoading(true);
    try {
      const newRecommendation = await getForestRecommendation(userProfile);
      LocalStorage.saveRecommendation(newRecommendation);
      onRecommendationUpdate(newRecommendation);
    } catch (error) {
      console.error('Error refreshing recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmergencyRecommendation = async () => {
    if (!userProfile) return;

    setIsLoading(true);
    try {
      const emergencyRec = await getEmergencyRecommendation(userProfile);
      LocalStorage.saveRecommendation(emergencyRec);
      onRecommendationUpdate(emergencyRec);
    } catch (error) {
      console.error('Error getting emergency recommendation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
  };

  const handleMarkCompleted = () => {
    if (recommendation) {
      // Save activity record
      const activity = {
        id: `activity_${Date.now()}`,
        date: new Date(),
        type: 'virtual_tour' as const,
        duration: 10, // Default 10 minutes
        stressLevel: Math.max(1, userProfile.stressLevel - 1), // Assume improvement
        notes: `AI 추천 활동 완료: ${recommendation.content.slice(0, 50)}...`
      };
      LocalStorage.saveActivity(activity);

      // Get new recommendation
      handleRefreshRecommendation();
    }
  };

  if (!recommendation) {
    return (
      <div className="forest-card rounded-2xl p-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-forest-600 mx-auto mb-4"></div>
          <p className="text-earth-600">맞춤 추천을 생성하고 있어요...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="forest-card rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="w-3 h-3 bg-forest-500 rounded-full mr-3 animate-pulse"></div>
          <h3 className="text-lg font-semibold text-forest-800">
            {recommendation.type === 'emergency' ? '🚨 긴급 스트레스 해소' : '🌿 오늘의 추천'}
          </h3>
        </div>
        <div className="flex items-center text-sm text-earth-500">
          <Clock className="w-4 h-4 mr-1" />
          {new Date(recommendation.createdAt).toLocaleTimeString('ko-KR', {
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      </div>

      <div className="mb-6">
        <p className="text-earth-700 leading-relaxed text-lg">
          {recommendation.content}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={handleLike}
          className={`flex items-center px-4 py-2 rounded-xl transition-all ${
            isLiked
              ? 'bg-red-100 text-red-600'
              : 'bg-earth-100 text-earth-600 hover:bg-red-50 hover:text-red-500'
          }`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isLiked ? 'fill-current' : ''}`} />
          {isLiked ? '좋아요!' : '좋아요'}
        </button>

        <button
          onClick={handleMarkCompleted}
          className="flex items-center px-4 py-2 bg-forest-100 text-forest-600 rounded-xl hover:bg-forest-200 transition-all"
        >
          <CheckCircle className="w-4 h-4 mr-2" />
          완료
        </button>

        <button
          onClick={handleRefreshRecommendation}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-earth-100 text-earth-600 rounded-xl hover:bg-earth-200 transition-all disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          새로고침
        </button>

        <button
          onClick={handleEmergencyRecommendation}
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-red-100 text-red-600 rounded-xl hover:bg-red-200 transition-all disabled:opacity-50"
        >
          🚨 긴급 처방
        </button>
      </div>
    </div>
  );
}