import { UserProfile, AIRecommendation } from './types';

export async function getForestRecommendation(
  userProfile: UserProfile,
  customPrompt?: string
): Promise<AIRecommendation> {
  try {
    const prompt = customPrompt || generateDefaultPrompt(userProfile);

    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        userProfile
      }),
    });

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'API call failed');
    }

    const recommendation: AIRecommendation = {
      id: `rec_${Date.now()}`,
      userId: userProfile.id,
      content: data.content,
      type: 'daily',
      createdAt: new Date(),
    };

    return recommendation;

  } catch (error) {
    console.error('Error getting forest recommendation:', error);

    // Return fallback recommendation
    return {
      id: `rec_${Date.now()}`,
      userId: userProfile.id,
      content: generateFallbackRecommendation(userProfile),
      type: 'daily',
      createdAt: new Date(),
    };
  }
}

function generateDefaultPrompt(userProfile: UserProfile): string {
  const timeOfDay = getTimeOfDay();
  const weather = "맑음"; // In real app, get from weather API

  return `오늘 ${timeOfDay}에 추천할 수 있는 산림치료 활동을 알려주세요. 날씨는 ${weather}입니다.`;
}

function generateFallbackRecommendation(userProfile: UserProfile): string {
  const stressLevel = userProfile.stressLevel;
  const activities = userProfile.preferredActivities;

  if (stressLevel >= 8) {
    return "🧘‍♀️ 스트레스가 높으시네요. 오늘은 조용한 공원에서 10분간 명상해보세요. 나무 아래 앉아 천천히 숨을 고르며 마음을 비워보시면 한결 나아질 거예요.";
  } else if (stressLevel >= 5) {
    return "🚶‍♂️ 가까운 산책로에서 20분간 여유롭게 걸어보세요. 걸으면서 주변의 나무와 꽃들을 관찰하며 자연과 하나 되는 시간을 가져보시기 바랍니다.";
  } else {
    return "🌲 컨디션이 좋으시네요! 오늘은 조금 더 활동적인 등산이나 자연 탐방을 해보시는 건 어떨까요? 새로운 산림욕장을 방문해보시는 것도 좋겠어요.";
  }
}

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "오전";
  if (hour < 18) return "오후";
  return "저녁";
}

export async function getWeeklyRecommendation(userProfile: UserProfile): Promise<AIRecommendation> {
  const prompt = "이번 주 전체를 위한 산림치료 계획을 세워주세요. 일주일 동안 실천할 수 있는 구체적인 활동들을 제안해주세요.";

  const recommendation = await getForestRecommendation(userProfile, prompt);
  return {
    ...recommendation,
    type: 'weekly'
  };
}

export async function getEmergencyRecommendation(userProfile: UserProfile): Promise<AIRecommendation> {
  const prompt = "지금 당장 스트레스를 해소할 수 있는 5분 이내의 긴급 산림치료법을 알려주세요. 실내에서도 할 수 있는 방법을 포함해주세요.";

  const recommendation = await getForestRecommendation(userProfile, prompt);
  return {
    ...recommendation,
    type: 'emergency'
  };
}