'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '@/lib/localStorage';
import { UserProfile, ActivityRecord, ProgressData } from '@/lib/types';
import Navigation from '@/components/Navigation';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import {
  TrendingDown,
  TrendingUp,
  Calendar,
  Activity,
  Heart,
  Award,
  Target,
  Clock
} from 'lucide-react';

export default function ProgressPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [activities, setActivities] = useState<ActivityRecord[]>([]);
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'all'>('week');

  useEffect(() => {
    // Check authentication
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
    const allActivities = LocalStorage.getActivities();
    setActivities(allActivities);

    // Generate progress data
    generateProgressData(allActivities, profile);
  }, [router]);

  const generateProgressData = (activities: ActivityRecord[], profile: UserProfile) => {
    const data: ProgressData[] = [];
    const now = new Date();
    const daysToShow = selectedPeriod === 'week' ? 7 : selectedPeriod === 'month' ? 30 : 90;

    for (let i = daysToShow - 1; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];

      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date).toISOString().split('T')[0];
        return activityDate === dateStr;
      });

      const avgStress = dayActivities.length > 0
        ? dayActivities.reduce((sum, act) => sum + act.stressLevel, 0) / dayActivities.length
        : profile.stressLevel;

      const moodScore = Math.max(1, 10 - avgStress + Math.random() * 2);

      data.push({
        date: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
        stressLevel: Math.round(avgStress * 10) / 10,
        activitiesCount: dayActivities.length,
        moodScore: Math.round(moodScore * 10) / 10
      });
    }

    setProgressData(data);
  };

  useEffect(() => {
    if (activities.length > 0 && userProfile) {
      generateProgressData(activities, userProfile);
    }
  }, [selectedPeriod, activities, userProfile]);

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  const totalActivities = activities.length;
  const avgStressLevel = activities.length > 0
    ? activities.reduce((sum, act) => sum + act.stressLevel, 0) / activities.length
    : userProfile.stressLevel;
  const totalDuration = activities.reduce((sum, act) => sum + act.duration, 0);
  const daysActive = new Set(activities.map(act => new Date(act.date).toDateString())).size;

  const activityTypeData = [
    { name: '산림 방문', value: activities.filter(act => act.type === 'forest_visit').length, color: '#22c55e' },
    { name: '명상', value: activities.filter(act => act.type === 'meditation').length, color: '#8b5cf6' },
    { name: 'AR 체험', value: activities.filter(act => act.type === 'ar_experience').length, color: '#3b82f6' },
    { name: '가상 투어', value: activities.filter(act => act.type === 'virtual_tour').length, color: '#f59e0b' },
  ].filter(item => item.value > 0);

  const achievements = [
    {
      id: 'first_week',
      title: '첫 주 완주',
      description: '7일 연속 활동 달성',
      achieved: daysActive >= 7,
      icon: '🎯'
    },
    {
      id: 'stress_reducer',
      title: '스트레스 해소 마스터',
      description: '평균 스트레스 5점 이하 달성',
      achieved: avgStressLevel <= 5,
      icon: '😌'
    },
    {
      id: 'ar_explorer',
      title: 'AR 탐험가',
      description: 'AR 체험 10회 이상',
      achieved: activities.filter(act => act.type === 'ar_experience').length >= 10,
      icon: '📱'
    },
    {
      id: 'time_keeper',
      title: '시간 관리 전문가',
      description: '총 활동 시간 300분 이상',
      achieved: totalDuration >= 300,
      icon: '⏰'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-forest-100">
      <Navigation />

      <main className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 mt-16 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold text-forest-800 mb-2">
            📊 나의 힐링 여정
          </h1>
          <p className="text-earth-600">
            지금까지의 성장 과정을 확인해보세요
          </p>
        </div>

        {/* Period Selector */}
        <div className="flex gap-2 mb-8">
          {[
            { key: 'week', label: '최근 7일' },
            { key: 'month', label: '최근 30일' },
            { key: 'all', label: '전체' }
          ].map(period => (
            <button
              key={period.key}
              onClick={() => setSelectedPeriod(period.key as any)}
              className={`px-4 py-2 rounded-xl transition-all ${
                selectedPeriod === period.key
                  ? 'forest-gradient text-white'
                  : 'bg-white text-earth-600 hover:bg-forest-50'
              }`}
            >
              {period.label}
            </button>
          ))}
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="forest-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-600">총 활동 횟수</p>
                <p className="text-2xl font-bold text-forest-800">{totalActivities}</p>
                <p className="text-xs text-earth-500 mt-1">
                  {daysActive}일 활동
                </p>
              </div>
              <Activity className="w-8 h-8 text-forest-500" />
            </div>
          </div>

          <div className="forest-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-600">평균 스트레스</p>
                <p className="text-2xl font-bold text-forest-800">
                  {avgStressLevel.toFixed(1)}/10
                </p>
                <div className="flex items-center mt-1">
                  {avgStressLevel < userProfile.stressLevel ? (
                    <TrendingDown className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingUp className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span className="text-xs text-earth-500">
                    초기 대비
                  </span>
                </div>
              </div>
              <Heart className="w-8 h-8 text-red-500" />
            </div>
          </div>

          <div className="forest-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-600">총 활동 시간</p>
                <p className="text-2xl font-bold text-forest-800">
                  {Math.floor(totalDuration / 60)}h {totalDuration % 60}m
                </p>
                <p className="text-xs text-earth-500 mt-1">
                  평균 {Math.round(totalDuration / Math.max(totalActivities, 1))}분
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="forest-card rounded-2xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-earth-600">달성 배지</p>
                <p className="text-2xl font-bold text-forest-800">
                  {achievements.filter(a => a.achieved).length}/{achievements.length}
                </p>
                <p className="text-xs text-earth-500 mt-1">
                  수집 완료
                </p>
              </div>
              <Award className="w-8 h-8 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Stress Level Trend */}
          <div className="forest-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-forest-800 mb-4">스트레스 수준 변화</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  formatter={(value: number) => [`${value}/10`, '스트레스 수준']}
                  labelStyle={{ color: '#374151' }}
                />
                <Line
                  type="monotone"
                  dataKey="stressLevel"
                  stroke="#ef4444"
                  strokeWidth={3}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Mood Score */}
          <div className="forest-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-forest-800 mb-4">기분 점수</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip
                  formatter={(value: number) => [`${value}/10`, '기분 점수']}
                  labelStyle={{ color: '#374151' }}
                />
                <Area
                  type="monotone"
                  dataKey="moodScore"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.3}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Count */}
          <div className="forest-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-forest-800 mb-4">일별 활동 횟수</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip
                  formatter={(value: number) => [`${value}회`, '활동 횟수']}
                  labelStyle={{ color: '#374151' }}
                />
                <Bar dataKey="activitiesCount" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Activity Types */}
          <div className="forest-card rounded-2xl p-6">
            <h3 className="text-lg font-semibold text-forest-800 mb-4">활동 유형 분포</h3>
            {activityTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={activityTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}`}
                  >
                    {activityTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-300 flex items-center justify-center text-earth-500">
                아직 활동 데이터가 없습니다
              </div>
            )}
          </div>
        </div>

        {/* Achievements */}
        <div className="forest-card rounded-2xl p-6">
          <h3 className="text-lg font-semibold text-forest-800 mb-6 flex items-center">
            <Award className="w-5 h-5 mr-2" />
            달성 배지
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map(achievement => (
              <div
                key={achievement.id}
                className={`p-4 rounded-xl border-2 text-center transition-all ${
                  achievement.achieved
                    ? 'border-yellow-300 bg-yellow-50'
                    : 'border-earth-200 bg-earth-50'
                }`}
              >
                <div className={`text-4xl mb-2 ${achievement.achieved ? '' : 'grayscale opacity-50'}`}>
                  {achievement.icon}
                </div>
                <h4 className={`font-semibold mb-1 ${
                  achievement.achieved ? 'text-yellow-800' : 'text-earth-600'
                }`}>
                  {achievement.title}
                </h4>
                <p className={`text-sm ${
                  achievement.achieved ? 'text-yellow-600' : 'text-earth-500'
                }`}>
                  {achievement.description}
                </p>
                {achievement.achieved && (
                  <div className="mt-2">
                    <span className="inline-block bg-yellow-200 text-yellow-800 text-xs px-2 py-1 rounded-full">
                      달성 완료!
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}