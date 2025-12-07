import React, { useEffect, useState, useRef } from 'react';
import { useOnboarding } from '../context/OnboardingContext';
import { X } from 'lucide-react';

const OnboardingOverlay: React.FC = () => {
  const { isActive, currentStep, nextStep, skipTutorial, isLastStep } = useOnboarding();
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const [isPositioned, setIsPositioned] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const updatePosition = () => {
      // Small timeout to ensure DOM is rendered after route change
      setTimeout(() => {
        const element = document.getElementById(currentStep.targetId);
        if (element) {
          const rect = element.getBoundingClientRect();
          setTargetRect(rect);
          setIsPositioned(true);
          
          // Scroll element into view if needed
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
          setIsPositioned(false);
        }
      }, 300);
    };

    updatePosition();
    window.addEventListener('resize', updatePosition);
    return () => window.removeEventListener('resize', updatePosition);
  }, [isActive, currentStep]);

  if (!isActive || !targetRect || !isPositioned) return null;

  return (
    <div className="fixed inset-0 z-[100] overflow-hidden">
      {/* Dimmed Background with Cutout using mix-blend-mode or multiple divs. 
          Here we use a simpler SVG mask approach for the spotlight. */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <mask id="spotlight-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <rect 
              x={targetRect.left - 5} 
              y={targetRect.top - 5} 
              width={targetRect.width + 10} 
              height={targetRect.height + 10} 
              rx="12" 
              fill="black" 
            />
          </mask>
        </defs>
        <rect 
          x="0" 
          y="0" 
          width="100%" 
          height="100%" 
          fill="rgba(0, 0, 0, 0.7)" 
          mask="url(#spotlight-mask)" 
        />
      </svg>

      {/* Target Highlight Border (Visual only) */}
      <div 
        className="absolute border-2 border-primary rounded-xl pointer-events-none animate-pulse"
        style={{
          top: targetRect.top - 5,
          left: targetRect.left - 5,
          width: targetRect.width + 10,
          height: targetRect.height + 10,
        }}
      />

      {/* Tooltip Card */}
      <div 
        className={`absolute left-0 right-0 mx-auto w-[90%] max-w-sm bg-white p-5 rounded-2xl shadow-2xl animate-fade-in-up`}
        style={{
          top: currentStep.position === 'top' 
            ? Math.max(20, targetRect.top - 180) 
            : Math.min(window.innerHeight - 200, targetRect.bottom + 20)
        }}
      >
        <button 
          onClick={skipTutorial}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h3 className="text-lg font-bold text-gray-900 mb-2">{currentStep.title}</h3>
        <p className="text-gray-600 text-sm mb-6 leading-relaxed">
          {currentStep.content}
        </p>

        <div className="flex justify-between items-center">
            <div className="flex gap-1">
                 {/* Simple dots indicator */}
                 {[0, 1, 2, 3].map(i => (
                     <div 
                        key={i} 
                        className={`w-2 h-2 rounded-full ${i === (isLastStep ? 3 : currentStep.route === '/chat' ? 3 : currentStep.route === '/courses' ? 2 : currentStep.route === '/profile' ? 1 : 0) ? 'bg-primary' : 'bg-gray-200'}`} 
                     />
                 ))}
            </div>
            <button 
              onClick={nextStep}
              className="px-6 py-2 bg-primary text-white font-bold rounded-full text-sm shadow-lg shadow-orange-200 hover:shadow-orange-300 transition-shadow"
            >
              {isLastStep ? 'Hoàn tất' : 'Tiếp theo'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default OnboardingOverlay;
