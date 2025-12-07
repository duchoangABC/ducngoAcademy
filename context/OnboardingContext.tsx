import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export interface Step {
  targetId: string;
  title: string;
  content: string;
  route: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

const TUTORIAL_STEPS: Step[] = [
  {
    targetId: 'home-profile-card',
    title: 'Theo dõi tiến độ',
    content: 'Truy cập trang cá nhân để xem thống kê học tập và biểu đồ năng lực của bạn.',
    route: '/home',
    position: 'bottom'
  },
  {
    targetId: 'profile-radar',
    title: 'Khung năng lực',
    content: 'Biểu đồ Radar giúp bạn so sánh năng lực hiện tại với mục tiêu của chương trình.',
    route: '/profile',
    position: 'top'
  },
  {
    targetId: 'course-list',
    title: 'Lộ trình học tập',
    content: 'Tiếp tục bài học của bạn và theo dõi các khóa học sắp tới tại đây.',
    route: '/courses',
    position: 'bottom'
  },
  {
    targetId: 'chat-input',
    title: 'Trợ lý AI',
    content: 'Chat trực tiếp với Mentor AI để được giải đáp thắc mắc mọi lúc mọi nơi.',
    route: '/chat',
    position: 'top'
  }
];

interface OnboardingContextType {
  isActive: boolean;
  currentStepIndex: number;
  currentStep: Step;
  startTutorial: () => void;
  nextStep: () => void;
  skipTutorial: () => void;
  isLastStep: boolean;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

export const OnboardingProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();

  const currentStep = TUTORIAL_STEPS[currentStepIndex];
  const isLastStep = currentStepIndex === TUTORIAL_STEPS.length - 1;

  const startTutorial = () => {
    setIsActive(true);
    setCurrentStepIndex(0);
    navigate(TUTORIAL_STEPS[0].route);
  };

  const nextStep = () => {
    if (isLastStep) {
      completeTutorial();
    } else {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      // Navigate to the route of the next step
      if (location.pathname !== TUTORIAL_STEPS[nextIndex].route) {
        navigate(TUTORIAL_STEPS[nextIndex].route);
      }
    }
  };

  const skipTutorial = () => {
    setIsActive(false);
    localStorage.setItem('has_completed_onboarding', 'true');
  };

  const completeTutorial = () => {
    setIsActive(false);
    localStorage.setItem('has_completed_onboarding', 'true');
    navigate('/home'); // Return home after completion
  };

  // Sync route if user navigates manually while tutorial is active (optional safety)
  useEffect(() => {
    if (isActive && location.pathname !== currentStep.route) {
       // Allow a small delay for page transition before re-enforcing route or handling logic
    }
  }, [isActive, location.pathname, currentStep.route]);

  return (
    <OnboardingContext.Provider value={{ 
      isActive, 
      currentStepIndex, 
      currentStep, 
      startTutorial, 
      nextStep, 
      skipTutorial,
      isLastStep
    }}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};
