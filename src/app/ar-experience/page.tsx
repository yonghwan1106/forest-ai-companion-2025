'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Navigation from '@/components/Navigation';
import { LocalStorage } from '@/lib/localStorage';
import { Camera, X, Play, Pause, RotateCcw, Volume2, VolumeX } from 'lucide-react';

export default function ARExperiencePage() {
  const router = useRouter();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [experienceType, setExperienceType] = useState<'meditation' | 'walking' | 'breathing' | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isActive) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive]);

  const startCamera = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreaming(true);
      }
    } catch (err) {
      console.error('Error accessing camera:', err);
      setError('카메라에 접근할 수 없습니다. 권한을 확인해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    setIsStreaming(false);
    setIsActive(false);
    setTimer(0);
    setExperienceType(null);
  };

  const startExperience = (type: 'meditation' | 'walking' | 'breathing') => {
    setExperienceType(type);
    setIsActive(true);
    setTimer(0);
  };

  const finishExperience = () => {
    if (experienceType && timer > 0) {
      // Save activity
      const activity = {
        id: `activity_${Date.now()}`,
        date: new Date(),
        type: 'ar_experience' as const,
        duration: Math.floor(timer / 60), // Convert to minutes
        stressLevel: Math.max(1, Math.floor(Math.random() * 3) + 3), // Random improvement
        notes: `AR ${getExperienceTitle(experienceType)} 체험`
      };
      LocalStorage.saveActivity(activity);
    }

    setIsActive(false);
    setTimer(0);
    setExperienceType(null);
    stopCamera();
    router.push('/dashboard');
  };

  const getExperienceTitle = (type: 'meditation' | 'walking' | 'breathing') => {
    switch (type) {
      case 'meditation': return '숲속 명상';
      case 'walking': return '가상 산책';
      case 'breathing': return '산림 호흡';
      default: return 'AR 체험';
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const renderExperienceOverlay = () => {
    if (!experienceType || !isActive) return null;

    return (
      <div className="absolute inset-0 pointer-events-none">
        {/* Floating particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400 rounded-full opacity-70 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 3}s`,
                animationDuration: `${3 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>

        {/* Experience-specific overlays */}
        {experienceType === 'meditation' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8 bg-black bg-opacity-30 rounded-3xl backdrop-blur-sm">
              <div className="text-6xl mb-4">🧘‍♀️</div>
              <h3 className="text-2xl font-bold mb-2">숲속 명상</h3>
              <p className="text-lg opacity-90">깊게 숨을 들이쉬고</p>
              <p className="text-lg opacity-90">자연의 에너지를 느껴보세요</p>
            </div>
          </div>
        )}

        {experienceType === 'walking' && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2">
            <div className="text-center text-white p-6 bg-black bg-opacity-30 rounded-2xl backdrop-blur-sm">
              <div className="text-4xl mb-2">🚶‍♂️</div>
              <p className="text-lg">천천히 걸으며</p>
              <p className="text-lg">주변을 관찰해보세요</p>
            </div>
          </div>
        )}

        {experienceType === 'breathing' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="w-32 h-32 border-4 border-white rounded-full flex items-center justify-center mb-4 animate-pulse">
                <div className="w-20 h-20 bg-white bg-opacity-30 rounded-full"></div>
              </div>
              <p className="text-white text-xl font-semibold">숨을 깊게 들이쉬세요</p>
            </div>
          </div>
        )}

        {/* Timer overlay */}
        <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-xl backdrop-blur-sm">
          <span className="text-lg font-mono">{formatTime(timer)}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />

      {!isStreaming ? (
        <div className="md:ml-64 min-h-screen flex flex-col items-center justify-center p-8">
          <div className="max-w-md mx-auto text-center">
            <div className="mb-8">
              <Camera className="w-20 h-20 text-forest-500 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-4">AR 산림욕 체험</h1>
              <p className="text-gray-300 text-lg">
                카메라를 통해 가상의 숲 환경에서 힐링 체험을 해보세요
              </p>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
                {error}
              </div>
            )}

            <button
              onClick={startCamera}
              disabled={isLoading}
              className="forest-gradient text-white font-semibold py-4 px-8 rounded-2xl text-lg hover:shadow-lg transform hover:-translate-y-1 transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  카메라 준비 중...
                </div>
              ) : (
                '카메라 시작하기'
              )}
            </button>

            <div className="mt-8 text-sm text-gray-400">
              <p>💡 카메라 권한이 필요합니다</p>
              <p>🔒 영상은 저장되지 않습니다</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="md:ml-64 relative h-screen">
          {/* Camera view */}
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />

          {/* Experience overlays */}
          {renderExperienceOverlay()}

          {/* Controls */}
          <div className="absolute top-4 left-4 flex gap-2">
            <button
              onClick={stopCamera}
              className="bg-red-500 text-white p-3 rounded-xl hover:bg-red-600 transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Experience selection */}
          {!experienceType && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
              <div className="bg-black bg-opacity-50 backdrop-blur-sm rounded-2xl p-6">
                <h3 className="text-white text-xl font-bold text-center mb-4">
                  체험을 선택하세요
                </h3>
                <div className="grid grid-cols-1 gap-3">
                  <button
                    onClick={() => startExperience('meditation')}
                    className="bg-purple-600 text-white py-3 px-4 rounded-xl hover:bg-purple-700 transition-all"
                  >
                    🧘‍♀️ 숲속 명상 (5-10분)
                  </button>
                  <button
                    onClick={() => startExperience('walking')}
                    className="bg-green-600 text-white py-3 px-4 rounded-xl hover:bg-green-700 transition-all"
                  >
                    🚶‍♂️ 가상 산책 (10-15분)
                  </button>
                  <button
                    onClick={() => startExperience('breathing')}
                    className="bg-blue-600 text-white py-3 px-4 rounded-xl hover:bg-blue-700 transition-all"
                  >
                    🫁 산림 호흡법 (3-5분)
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Active experience controls */}
          {experienceType && isActive && (
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <div className="flex gap-4">
                <button
                  onClick={() => setIsActive(!isActive)}
                  className="bg-white text-gray-800 p-4 rounded-full hover:bg-gray-100 transition-all shadow-lg"
                >
                  {isActive ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
                <button
                  onClick={finishExperience}
                  className="bg-forest-600 text-white px-6 py-4 rounded-full hover:bg-forest-700 transition-all shadow-lg"
                >
                  체험 완료
                </button>
                <button
                  onClick={() => setTimer(0)}
                  className="bg-gray-600 text-white p-4 rounded-full hover:bg-gray-700 transition-all shadow-lg"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {/* Sound toggle */}
          <div className="absolute top-4 right-4">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="bg-black bg-opacity-50 text-white p-3 rounded-xl hover:bg-opacity-70 transition-all"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}