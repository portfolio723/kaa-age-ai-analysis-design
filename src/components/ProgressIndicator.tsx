import { Step } from '../types';

const STEPS: { key: Step; label: string }[] = [
  { key: 'upload', label: 'Upload' },
  { key: 'crop', label: 'Crop' },
  { key: 'confirm', label: 'Confirm' },
  { key: 'processing', label: 'Analyze' },
  { key: 'results', label: 'Results' },
];

const STEP_NUMBER: Record<Step, number> = {
  upload: 1,
  crop: 2,
  confirm: 3,
  processing: 4,
  results: 5,
};

interface Props {
  current: Step;
}

export default function ProgressIndicator({ current }: Props) {
  const currentIndex = STEP_NUMBER[current] - 1;

  return (
    <div className="flex items-center justify-center gap-0 mb-8">
      {STEPS.map((step, i) => {
        const isCompleted = i < currentIndex;
        const isActive = i === currentIndex;

        return (
          <div key={step.key} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`
                  w-8 h-8 rounded-full flex items-center justify-center text-xs font-600 transition-all duration-300
                  ${isCompleted ? 'bg-primary text-white' : ''}
                  ${isActive ? 'bg-gold text-white shadow-glow' : ''}
                  ${!isCompleted && !isActive ? 'bg-white border-2 border-neutral-200 text-neutral-400' : ''}
                `}
                style={{ fontWeight: 600 }}
              >
                {isCompleted ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path d="M2.5 7L5.5 10L11.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`mt-1 text-xs hidden sm:block transition-colors duration-200 ${
                  isActive ? 'text-gold font-medium' : isCompleted ? 'text-primary' : 'text-neutral-400'
                }`}
              >
                {step.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`w-8 sm:w-12 h-0.5 mx-1 transition-all duration-500 ${
                  i < currentIndex ? 'bg-primary' : 'bg-neutral-200'
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
