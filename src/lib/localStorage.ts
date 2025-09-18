import { UserProfile, ActivityRecord, AIRecommendation, CommunityPost } from './types';

const STORAGE_KEYS = {
  USER_PROFILE: 'forest_user_profile',
  ACTIVITIES: 'forest_activities',
  RECOMMENDATIONS: 'forest_recommendations',
  COMMUNITY_POSTS: 'forest_community_posts',
  ONBOARDING_COMPLETED: 'forest_onboarding_completed'
};

export const LocalStorage = {
  // User Profile
  saveUserProfile: (profile: UserProfile): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(profile));
    }
  },

  getUserProfile: (): UserProfile | null => {
    if (typeof window === 'undefined') return null;
    const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
    if (!data) return null;

    const profile = JSON.parse(data);
    return {
      ...profile,
      createdAt: new Date(profile.createdAt)
    };
  },

  // Activities
  saveActivity: (activity: ActivityRecord): void => {
    if (typeof window === 'undefined') return;
    const activities = LocalStorage.getActivities();
    activities.push(activity);
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  },

  getActivities: (): ActivityRecord[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    if (!data) return [];

    return JSON.parse(data).map((activity: any) => ({
      ...activity,
      date: new Date(activity.date)
    }));
  },

  // Recommendations
  saveRecommendation: (recommendation: AIRecommendation): void => {
    if (typeof window === 'undefined') return;
    const recommendations = LocalStorage.getRecommendations();
    recommendations.push(recommendation);
    localStorage.setItem(STORAGE_KEYS.RECOMMENDATIONS, JSON.stringify(recommendations));
  },

  getRecommendations: (): AIRecommendation[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.RECOMMENDATIONS);
    if (!data) return [];

    return JSON.parse(data).map((rec: any) => ({
      ...rec,
      createdAt: new Date(rec.createdAt)
    }));
  },

  // Community Posts
  saveCommunityPost: (post: CommunityPost): void => {
    if (typeof window === 'undefined') return;
    const posts = LocalStorage.getCommunityPosts();
    posts.unshift(post); // Add to beginning
    localStorage.setItem(STORAGE_KEYS.COMMUNITY_POSTS, JSON.stringify(posts));
  },

  getCommunityPosts: (): CommunityPost[] => {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(STORAGE_KEYS.COMMUNITY_POSTS);
    if (!data) return [];

    return JSON.parse(data).map((post: any) => ({
      ...post,
      createdAt: new Date(post.createdAt),
      comments: post.comments?.map((comment: any) => ({
        ...comment,
        createdAt: new Date(comment.createdAt)
      })) || []
    }));
  },

  // Onboarding
  setOnboardingCompleted: (completed: boolean): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.ONBOARDING_COMPLETED, JSON.stringify(completed));
  },

  isOnboardingCompleted: (): boolean => {
    if (typeof window === 'undefined') return false;
    const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING_COMPLETED);
    return data ? JSON.parse(data) : false;
  },

  // Clear all data
  clearAllData: (): void => {
    if (typeof window === 'undefined') return;
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }
};