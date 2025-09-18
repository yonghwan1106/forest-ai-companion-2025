# 융합형 산림복지 AI 동반자 플랫폼 "숲심(森心)" PRD

## 1. 프로젝트 개요

### 목표
한국산림복지진흥원 공모전 제출용 프로토타입으로, AI 기반 개인 맞춤형 산림치료 서비스를 제공하는 웹 애플리케이션 개발

### 기술 스택
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **AI**: Claude Sonnet API
- **Database**: localStorage (브라우저 로컬 저장)
- **배포**: Vercel
- **기타**: PWA 설정, 반응형 디자인

---

## 2. 핵심 기능 명세 (MVP)

### 2.1 사용자 프로필 및 온보딩
**기능**: 초기 설문을 통한 사용자 프로필 생성
- 나이, 성별, 거주지역 선택
- 스트레스 수준 체크 (1-10점)
- 선호하는 활동 유형 (산책, 명상, 운동 등)
- 현재 건강 상태 간단 체크
- 산림복지시설 이용 경험

**저장 데이터**: localStorage에 JSON 형태로 저장

### 2.2 AI 맞춤형 산림치료 추천
**기능**: Claude API를 활용한 개인화 추천
- 사용자 프로필 기반 맞춤형 산림치료 프로그램 생성
- 오늘의 추천 활동 (날씨, 계절, 스트레스 수준 고려)
- 주변 산림복지시설 추천 (가상 데이터 활용)
- 간단한 명상 가이드 및 산림욕 방법 안내

**AI 프롬프트 예시**:
```
사용자 정보: 나이 ${age}, 거주지 ${location}, 스트레스 수준 ${stress}/10
현재 계절: ${season}, 날씨: ${weather}

위 정보를 바탕으로 한국의 산림복지 전문가로서 다음을 제공해주세요:
1. 오늘 추천하는 산림치료 활동 (30분 이내)
2. 스트레스 해소를 위한 구체적 방법
3. 집 주변에서 할 수 있는 간단한 숲 체험
응답은 친근하고 실용적으로 200자 이내로 해주세요.
```

### 2.3 가상 AR 산림 체험
**기능**: 웹캠을 활용한 간단한 AR 체험
- 브라우저 카메라 접근
- CSS 애니메이션으로 나뭇잎, 새소리 등 오버레이
- 360도 산림 배경 이미지와 함께 명상 가이드
- 간단한 식물 식별 게임 (사전 정의된 이미지 매칭)

### 2.4 진행상황 추적
**기능**: 사용자 활동 기록 및 통계
- 일일 활동 체크인 (산림 활동 여부)
- 스트레스 수준 변화 그래프
- 연속 사용일 기록
- 월별 활동 요약

### 2.5 커뮤니티 (간단 버전)
**기능**: 기본적인 소통 공간
- 오늘의 산림 사진 공유 (로컬 저장)
- 간단한 후기 작성
- 추천 장소 정보 공유

---

## 3. 상세 기술 구현

### 3.1 폴더 구조
```
forest-ai-platform/
├── app/
│   ├── globals.css
│   ├── layout.tsx
│   ├── page.tsx
│   ├── onboarding/
│   │   └── page.tsx
│   ├── dashboard/
│   │   └── page.tsx
│   ├── ar-experience/
│   │   └── page.tsx
│   ├── progress/
│   │   └── page.tsx
│   ├── community/
│   │   └── page.tsx
│   └── api/
│       └── claude/
│           └── route.ts
├── components/
│   ├── ui/
│   ├── OnboardingForm.tsx
│   ├── AIRecommendation.tsx
│   ├── ARCamera.tsx
│   ├── ProgressChart.tsx
│   └── Navigation.tsx
├── lib/
│   ├── localStorage.ts
│   ├── claudeApi.ts
│   └── types.ts
├── public/
│   ├── images/
│   └── sounds/
└── package.json
```

### 3.2 핵심 데이터 타입
```typescript
interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  location: string;
  stressLevel: number; // 1-10
  preferredActivities: string[];
  healthCondition: string;
  forestExperience: boolean;
  createdAt: Date;
}

interface ActivityRecord {
  id: string;
  date: Date;
  type: 'forest_visit' | 'meditation' | 'ar_experience' | 'virtual_tour';
  duration: number; // minutes
  stressLevel: number; // after activity
  notes?: string;
}

interface AIRecommendation {
  id: string;
  userId: string;
  content: string;
  type: 'daily' | 'weekly' | 'emergency';
  createdAt: Date;
}
```

### 3.3 localStorage 관리
```typescript
// lib/localStorage.ts
export const LocalStorage = {
  saveUserProfile: (profile: UserProfile) => {
    localStorage.setItem('userProfile', JSON.stringify(profile));
  },
  
  getUserProfile: (): UserProfile | null => {
    const data = localStorage.getItem('userProfile');
    return data ? JSON.parse(data) : null;
  },
  
  saveActivity: (activity: ActivityRecord) => {
    const activities = getActivities();
    activities.push(activity);
    localStorage.setItem('activities', JSON.stringify(activities));
  },
  
  getActivities: (): ActivityRecord[] => {
    const data = localStorage.getItem('activities');
    return data ? JSON.parse(data) : [];
  }
};
```

### 3.4 Claude API 연동
```typescript
// lib/claudeApi.ts
export async function getForestRecommendation(userProfile: UserProfile) {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      prompt: `사용자 정보: 나이 ${userProfile.age}, 거주지 ${userProfile.location}, 스트레스 수준 ${userProfile.stressLevel}/10
      
      위 정보를 바탕으로 한국의 산림복지 전문가로서 오늘 추천하는 산림치료 활동을 200자 이내로 친근하게 제안해주세요.`
    })
  });
  
  return response.json();
}
```

---

## 4. UI/UX 설계

### 4.1 색상 팔레트
- **Primary**: 초록색 계열 (#22c55e, #16a34a)
- **Secondary**: 갈색 계열 (#a3a3a3, #525252)
- **Accent**: 하늘색 (#3b82f6)
- **Background**: 크림색 (#f9fafb)

### 4.2 주요 화면 구성

**온보딩 화면**
- 진행 바 (1/5, 2/5...)
- 각 단계별 간단한 질문
- 친근한 일러스트
- "다음" 버튼

**대시보드**
- 오늘의 AI 추천 카드
- 스트레스 수준 입력
- 빠른 액션 버튼들
- 진행상황 요약

**AR 체험 화면**
- 카메라 뷰
- 오버레이 UI
- 종료 버튼
- 활동 기록 버튼

### 4.3 반응형 디자인
- Mobile First 접근
- Tailwind CSS 브레이크포인트 활용
- 터치 친화적 UI

---

## 5. 개발 단계별 계획

### Phase 1 (1-2주): 기본 구조
1. Next.js 프로젝트 셋업
2. 기본 라우팅 구조 생성
3. Tailwind CSS 설정
4. 기본 컴포넌트 생성

### Phase 2 (1주): 온보딩 & 프로필
1. 온보딩 폼 구현
2. localStorage 저장 로직
3. 프로필 편집 기능

### Phase 3 (1주): AI 연동
1. Claude API 라우트 생성
2. AI 추천 컴포넌트
3. 추천 히스토리 관리

### Phase 4 (1주): AR 체험
1. 카메라 접근 기능
2. CSS 애니메이션 효과
3. 가상 오버레이

### Phase 5 (1주): 진행상황 & 커뮤니티
1. 차트 라이브러리 연동
2. 활동 기록 기능
3. 간단한 커뮤니티 기능

### Phase 6 (1주): 배포 & 최적화
1. Vercel 배포 설정
2. PWA 설정
3. 성능 최적화
4. 버그 수정

---

## 6. 필요한 환경 변수

```env
# .env.local
CLAUDE_API_KEY=your_claude_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 7. 초보자를 위한 시작 가이드

### 7.1 개발 환경 설정
```bash
# 1. Node.js 설치 확인
node --version

# 2. 프로젝트 생성
npx create-next-app@latest forest-ai-platform --typescript --tailwind --eslint --app

# 3. 프로젝트 폴더로 이동
cd forest-ai-platform

# 4. 필요한 패키지 설치
npm install lucide-react recharts

# 5. 개발 서버 실행
npm run dev
```

### 7.2 첫 번째 구현할 파일들
1. `app/layout.tsx` - 기본 레이아웃
2. `app/page.tsx` - 홈페이지
3. `components/Navigation.tsx` - 네비게이션 바
4. `app/onboarding/page.tsx` - 온보딩 페이지

---

## 8. 성공 지표

### 개발 완료 기준
- [ ] 온보딩 플로우 완성
- [ ] AI 추천 기능 작동
- [ ] 카메라 접근 및 AR 효과
- [ ] 데이터 저장/불러오기
- [ ] 모바일 반응형 완성
- [ ] Vercel 배포 성공

### 데모용 핵심 기능
1. 3분 이내 온보딩 완료
2. 실시간 AI 추천 받기
3. AR 카메라 체험
4. 진행상황 확인

이 PRD를 바탕으로 단계적으로 개발하시면 됩니다. 어떤 부분부터 시작하고 싶으신지 알려주시면 더 구체적인 코드와 가이드를 제공해드리겠습니다!