import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt, userProfile } = await request.json();

    if (!prompt) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    // Create enhanced prompt with user context
    const enhancedPrompt = `
당신은 한국의 산림복지 전문가입니다. 사용자의 개인 정보를 바탕으로 따뜻하고 실용적인 조언을 제공해주세요.

사용자 정보:
${userProfile ? `
- 나이: ${userProfile.age}세
- 거주지: ${userProfile.location}
- 스트레스 수준: ${userProfile.stressLevel}/10
- 선호 활동: ${userProfile.preferredActivities?.join(', ')}
- 건강 상태: ${userProfile.healthCondition || '특별한 건강 문제 없음'}
- 산림복지 경험: ${userProfile.forestExperience ? '있음' : '없음'}
` : ''}

현재 날짜: ${new Date().toLocaleDateString('ko-KR')}
계절: ${getCurrentSeason()}

요청사항: ${prompt}

응답 가이드라인:
1. 친근하고 따뜻한 어조로 작성
2. 실제로 실행 가능한 구체적인 조언 제공
3. 한국의 산림복지시설과 자연환경을 고려
4. 사용자의 스트레스 수준과 선호도 반영
5. 200-300자 내외로 간결하게 작성
6. 이모지를 적절히 활용하여 친근함 표현

응답해주세요.`;

    const message = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1024,
      messages: [
        {
          role: 'user',
          content: enhancedPrompt
        }
      ]
    });

    const response = message.content[0];

    if (response.type === 'text') {
      return NextResponse.json({
        success: true,
        content: response.text
      });
    } else {
      throw new Error('Unexpected response type');
    }

  } catch (error) {
    console.error('Claude API Error:', error);

    // Fallback response for demo purposes
    const fallbackResponse = generateFallbackResponse();

    return NextResponse.json({
      success: true,
      content: fallbackResponse,
      fallback: true
    });
  }
}

function getCurrentSeason(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return '봄';
  if (month >= 6 && month <= 8) return '여름';
  if (month >= 9 && month <= 11) return '가을';
  return '겨울';
}

function generateFallbackResponse(): string {
  const responses = [
    "🌲 오늘은 가까운 공원에서 15분간 천천히 산책해보세요. 나무들의 초록빛을 바라보며 깊게 호흡하면 스트레스가 한결 줄어들 거예요. 걸으면서 새소리에 귀 기울여보시는 것도 좋습니다.",

    "🍃 잠시 휴대폰을 내려놓고 창문을 열어 자연의 소리에 집중해보세요. 5분간 눈을 감고 바람소리나 새소리를 들으며 마음을 비워보시면 어떨까요? 간단한 명상으로도 큰 효과를 볼 수 있어요.",

    "🌸 오늘 점심시간에 야외로 나가서 하늘을 올려다보며 구름의 모양을 관찰해보세요. 자연을 관찰하는 것만으로도 마음이 차분해지고 스트레스가 완화됩니다. 5분이면 충분해요!",

    "🌿 집 주변 작은 화분이나 식물을 돌보는 시간을 가져보세요. 물을 주고 잎사귀를 만지며 식물과 교감하는 것은 마음의 안정에 큰 도움이 됩니다. 작은 다육식물부터 시작해보시면 어떨까요?",
  ];

  return responses[Math.floor(Math.random() * responses.length)];
}