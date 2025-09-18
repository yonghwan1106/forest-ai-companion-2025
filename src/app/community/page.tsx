'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LocalStorage } from '@/lib/localStorage';
import { UserProfile, CommunityPost } from '@/lib/types';
import Navigation from '@/components/Navigation';
import {
  Plus,
  Heart,
  MessageCircle,
  MapPin,
  Clock,
  Camera,
  Send,
  Image as ImageIcon,
  Users,
  Leaf
} from 'lucide-react';

export default function CommunityPage() {
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [isWriting, setIsWriting] = useState(false);
  const [newPost, setNewPost] = useState({
    content: '',
    location: '',
    imageUrl: ''
  });
  const [selectedTab, setSelectedTab] = useState<'all' | 'photos' | 'tips'>('all');

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
    loadPosts();
  }, [router]);

  const loadPosts = () => {
    const existingPosts = LocalStorage.getCommunityPosts();
    if (existingPosts.length === 0) {
      // Add some sample posts for demo
      const samplePosts: CommunityPost[] = [
        {
          id: 'post_1',
          userId: 'sample_user_1',
          userName: '산림러버',
          content: '오늘 북한산에서 정말 아름다운 단풍을 봤어요! 🍂 스트레스가 확 풀리는 느낌이었습니다. 가을 산행 정말 추천해요.',
          location: '북한산',
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 12,
          comments: [
            {
              id: 'comment_1',
              userId: 'sample_user_2',
              userName: '힐링마스터',
              content: '와 정말 예쁘네요! 저도 가보고 싶어요',
              createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'post_2',
          userId: 'sample_user_3',
          userName: '자연치유사',
          content: '집 근처 공원에서 하는 아침 명상이 정말 효과적이에요. 15분만 투자해도 하루가 달라집니다! 💚',
          createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
          likes: 8,
          comments: []
        },
        {
          id: 'post_3',
          userId: 'sample_user_4',
          userName: '숲속산책',
          content: 'AR 체험 기능 진짜 신기해요! 집에서도 숲에 있는 기분이 들어서 스트레스가 많이 줄었습니다. 기술의 힘이 대단하네요 📱✨',
          createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
          likes: 15,
          comments: [
            {
              id: 'comment_2',
              userId: 'sample_user_5',
              userName: '테크힐러',
              content: '저도 AR 체험 정말 좋아해요! 특히 명상 모드가 최고예요',
              createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000)
            }
          ]
        }
      ];

      samplePosts.forEach(post => LocalStorage.saveCommunityPost(post));
      setPosts(samplePosts);
    } else {
      setPosts(existingPosts);
    }
  };

  const handleCreatePost = () => {
    if (!userProfile || !newPost.content.trim()) return;

    const post: CommunityPost = {
      id: `post_${Date.now()}`,
      userId: userProfile.id,
      userName: userProfile.name,
      content: newPost.content,
      location: newPost.location || undefined,
      imageUrl: newPost.imageUrl || undefined,
      createdAt: new Date(),
      likes: 0,
      comments: []
    };

    LocalStorage.saveCommunityPost(post);
    setPosts([post, ...posts]);
    setNewPost({ content: '', location: '', imageUrl: '' });
    setIsWriting(false);
  };

  const handleLikePost = (postId: string) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, likes: post.likes + 1 }
        : post
    ));
  };

  const filteredPosts = posts.filter(post => {
    if (selectedTab === 'photos') return post.imageUrl;
    if (selectedTab === 'tips') return post.content.includes('추천') || post.content.includes('팁');
    return true;
  });

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    return `${Math.floor(diffInHours / 24)}일 전`;
  };

  if (!userProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-forest-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-forest-100">
      <Navigation />

      <main className="md:ml-64 p-4 md:p-8">
        {/* Header */}
        <div className="mb-8 mt-16 md:mt-0">
          <h1 className="text-2xl md:text-3xl font-bold text-forest-800 mb-2 flex items-center">
            <Users className="w-8 h-8 mr-3" />
            힐링 커뮤니티
          </h1>
          <p className="text-earth-600">
            다른 사람들과 산림치료 경험을 공유하고 소통해보세요
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {[
            { key: 'all', label: '전체', icon: Users },
            { key: 'photos', label: '사진', icon: Camera },
            { key: 'tips', label: '팁 공유', icon: Leaf }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex items-center px-4 py-2 rounded-xl transition-all ${
                  selectedTab === tab.key
                    ? 'forest-gradient text-white'
                    : 'bg-white text-earth-600 hover:bg-forest-50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Create Post Button */}
        <div className="mb-6">
          <button
            onClick={() => setIsWriting(true)}
            className="forest-gradient text-white px-6 py-3 rounded-xl flex items-center hover:shadow-lg transition-all"
          >
            <Plus className="w-5 h-5 mr-2" />
            새 글 작성
          </button>
        </div>

        {/* Write Post Modal */}
        {isWriting && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
              <h3 className="text-lg font-semibold text-forest-800 mb-4">새 글 작성</h3>

              <div className="space-y-4">
                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                  placeholder="오늘의 힐링 경험을 공유해주세요..."
                  className="w-full h-32 p-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent resize-none"
                />

                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newPost.location}
                    onChange={(e) => setNewPost({...newPost, location: e.target.value})}
                    placeholder="장소 (선택사항)"
                    className="flex-1 p-3 border border-earth-300 rounded-xl focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                  />
                  <button className="p-3 bg-earth-100 text-earth-600 rounded-xl hover:bg-earth-200 transition-all">
                    <ImageIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsWriting(false)}
                  className="flex-1 py-3 text-earth-600 border border-earth-300 rounded-xl hover:bg-earth-50 transition-all"
                >
                  취소
                </button>
                <button
                  onClick={handleCreatePost}
                  disabled={!newPost.content.trim()}
                  className="flex-1 py-3 forest-gradient text-white rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
                >
                  게시하기
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="forest-card rounded-2xl p-12 text-center">
              <Users className="w-16 h-16 text-earth-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-earth-600 mb-2">
                아직 게시글이 없어요
              </h3>
              <p className="text-earth-500">
                첫 번째 글을 작성해서 커뮤니티를 시작해보세요!
              </p>
            </div>
          ) : (
            filteredPosts.map(post => (
              <div key={post.id} className="forest-card rounded-2xl p-6">
                {/* Post Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-forest-500 rounded-full flex items-center justify-center text-white font-semibold mr-3">
                      {post.userName.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-forest-800">{post.userName}</h4>
                      <div className="flex items-center text-sm text-earth-500">
                        <Clock className="w-3 h-3 mr-1" />
                        {formatTimeAgo(post.createdAt)}
                        {post.location && (
                          <>
                            <span className="mx-2">•</span>
                            <MapPin className="w-3 h-3 mr-1" />
                            {post.location}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <p className="text-earth-700 leading-relaxed whitespace-pre-wrap">
                    {post.content}
                  </p>
                  {post.imageUrl && (
                    <div className="mt-3 rounded-xl overflow-hidden">
                      <img
                        src={post.imageUrl}
                        alt="Post image"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}
                </div>

                {/* Post Actions */}
                <div className="flex items-center gap-4 pt-4 border-t border-earth-200">
                  <button
                    onClick={() => handleLikePost(post.id)}
                    className="flex items-center text-earth-600 hover:text-red-500 transition-all"
                  >
                    <Heart className="w-4 h-4 mr-1" />
                    {post.likes}
                  </button>
                  <button className="flex items-center text-earth-600 hover:text-forest-600 transition-all">
                    <MessageCircle className="w-4 h-4 mr-1" />
                    {post.comments.length}
                  </button>
                </div>

                {/* Comments */}
                {post.comments.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-earth-200">
                    <div className="space-y-3">
                      {post.comments.map(comment => (
                        <div key={comment.id} className="flex items-start">
                          <div className="w-8 h-8 bg-earth-300 rounded-full flex items-center justify-center text-earth-600 text-sm font-semibold mr-3 flex-shrink-0">
                            {comment.userName.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="bg-earth-50 rounded-xl p-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium text-earth-800 text-sm">
                                  {comment.userName}
                                </span>
                                <span className="text-xs text-earth-500">
                                  {formatTimeAgo(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-earth-700 text-sm">{comment.content}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment */}
                    <div className="mt-3 flex gap-2">
                      <input
                        type="text"
                        placeholder="댓글을 입력하세요..."
                        className="flex-1 px-3 py-2 border border-earth-300 rounded-xl text-sm focus:ring-2 focus:ring-forest-500 focus:border-transparent"
                      />
                      <button className="px-4 py-2 forest-gradient text-white rounded-xl hover:shadow-md transition-all">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}