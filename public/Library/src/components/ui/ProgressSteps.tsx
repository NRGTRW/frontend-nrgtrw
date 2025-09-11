import React from 'react';

interface ProgressStepsProps {
  steps: string[];
  current: number;
  className?: string;
}

export const ProgressSteps: React.FC<ProgressStepsProps> = ({ 
  steps, 
  current, 
  className = '' 
}) => {
  return (
    <div className={`w-full ${className}`}>
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[hsl(var(--border))] -translate-y-1/2 z-0">
          <div 
            className="h-full bg-[hsl(var(--accent))] transition-all duration-[var(--normal)] ease-[var(--ease)]"
            style={{ 
              width: `${current > 0 ? ((current) / (steps.length - 1)) * 100 : 0}%` 
            }}
          />
        </div>

        {/* Steps */}
        {steps.map((step, index) => {
          const isCompleted = index < current;
          const isCurrent = index === current;
          const isUpcoming = index > current;

          return (
            <div key={index} className="relative z-10 flex flex-col items-center">
              {/* Step circle */}
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-[var(--normal)] ease-[var(--ease)]
                  ${isCompleted 
                    ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-[var(--e1)]' 
                    : isCurrent 
                    ? 'bg-[hsl(var(--accent))] text-[hsl(var(--accent-foreground))] shadow-[var(--e2)] animate-pulse-glow' 
                    : 'bg-[hsl(var(--secondary))] text-[hsl(var(--muted))] border-2 border-[hsl(var(--border))]'
                  }
                `}
              >
                {isCompleted ? (
                  <svg 
                    className="w-4 h-4" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M5 13l4 4L19 7" 
                    />
                  </svg>
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>

              {/* Step label */}
              <div className="mt-2 text-center">
                <div
                  className={`
                    text-xs font-medium transition-colors duration-[var(--normal)] ease-[var(--ease)]
                    ${isCompleted || isCurrent 
                      ? 'text-[hsl(var(--fg))]' 
                      : 'text-[hsl(var(--muted))]'
                    }
                  `}
                >
                  {step}
                </div>
                
                {/* Current step indicator */}
                {isCurrent && (
                  <div className="mt-1 w-1 h-1 bg-[hsl(var(--accent))] rounded-full mx-auto animate-pulse" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress percentage */}
      <div className="mt-4 text-center">
        <div className="text-sm text-[hsl(var(--muted))]">
          Step {current + 1} of {steps.length}
        </div>
        <div className="text-xs text-[hsl(var(--muted))] mt-1">
          {Math.round(((current + 1) / steps.length) * 100)}% complete
        </div>
      </div>
    </div>
  );
};

// Default steps for landing page generation
export const defaultGenerationSteps = [
  'Validate',
  'Plan', 
  'Compose',
  'Render',
  'QA',
  'Done'
];

// Preset step configurations
export const stepPresets = {
  generation: defaultGenerationSteps,
  onboarding: ['Welcome', 'Setup', 'Configure', 'Complete'],
  checkout: ['Cart', 'Shipping', 'Payment', 'Confirmation'],
  signup: ['Email', 'Verify', 'Profile', 'Complete'],
  upload: ['Select', 'Upload', 'Process', 'Complete'],
} as const;

export type StepPreset = keyof typeof stepPresets;
