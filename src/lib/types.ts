export interface UserProfile {
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

export interface ActivityRecord {
  id: string;
  date: Date;
  type: 'forest_visit' | 'meditation' | 'ar_experience' | 'virtual_tour';
  duration: number; // minutes
  stressLevel: number; // after activity
  notes?: string;
}

export interface AIRecommendation {
  id: string;
  userId: string;
  content: string;
  type: 'daily' | 'weekly' | 'emergency';
  createdAt: Date;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userName: string;
  content: string;
  imageUrl?: string;
  location?: string;
  createdAt: Date;
  likes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface ProgressData {
  date: string;
  stressLevel: number;
  activitiesCount: number;
  moodScore: number;
}