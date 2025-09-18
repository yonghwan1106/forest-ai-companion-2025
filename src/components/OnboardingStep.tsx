'use client';

import { ReactNode } from 'react';

interface OnboardingStepProps {
  children: ReactNode;
  currentStep: number;
  totalSteps: number;
  title: string;
  subtitle?: string;
}

export default function OnboardingStep({
  children,
  currentStep,
  totalSteps,
  title,
  subtitle
}: OnboardingStepProps) {
  const progress = (currentStep / totalSteps) * 100;

  return (
    <div className="max-w-2xl mx-auto">
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-earth-500 mb-2">
          <span>진행률</span>
          <span>{currentStep}/{totalSteps}</span>
        </div>
        <div className="w-full bg-earth-200 rounded-full h-2">
          <div
            className="forest-gradient h-2 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>
      </div>

      {/* Content */}
      <div className="forest-card rounded-3xl p-8 md:p-12">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-forest-800 mb-3">
            {title}
          </h2>
          {subtitle && (
            <p className="text-earth-600 text-lg">
              {subtitle}
            </p>
          )}
        </div>

        {children}
      </div>
    </div>
  );
}