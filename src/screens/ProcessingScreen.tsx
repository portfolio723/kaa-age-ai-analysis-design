import { useEffect, useState } from 'react';
import { AnalysisResults } from '../types';

const STATUS_MESSAGES = [
  'Reviewing alignment…',
  'Checking tooth shade…',
  'Evaluating gum visibility…',
  'Measuring symmetry…',
  'Preparing your results…',
];

const MOCK_RESULTS: AnalysisResults = {
  confidence: 85,
  summary: 'Your smile appears healthy with minor color variation. Overall dental hygiene looks good.',
  metrics: {
    toothColor: 'Slightly Yellow',
    gumVisibility: 'Normal',
    alignment: 'Straight',
    cleanliness: 'Good',
  },
  recommendations: [
    'Consider mild whitening treatment for a brighter smile',
    'Maintain daily brushing & flossing routine',
    'Schedule a routine professional check-up',
  ],
};

interface Props {
  onComplete: (results: AnalysisResults) => void;
}

export default function ProcessingScreen({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    const duration = 4200;
    const interval = 40;
    const steps = duration / interval;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      const pct = Math.min(100, Math.round((step / steps) * 100));
      setProgress(pct);
      setMessageIndex(Math.floor((pct / 100) * (STATUS_MESSAGES.length - 1)));

      if (step >= steps) {
        clearInterval(timer);
        setTimeout(() => onComplete(MOCK_RESULTS), 300);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="animate-fade-in flex flex-col items-center text-center py-4">
      {/* Animated pulse rings */}
      <div className="relative flex items-center justify-center mb-8" style={{ width: 120, height: 120 }}>
        {/* Outer ring */}
        <div
          className="absolute rounded-full animate-pulse-soft"
          style={{ width: 120, height: 120, backgroundColor: 'rgba(21,27,64,0.06)' }}
        />
        {/* Middle ring */}
        <div
          className="absolute rounded-full animate-pulse-soft animation-delay-200"
          style={{ width: 88, height: 88, backgroundColor: 'rgba(21,27,64,0.08)' }}
        />
        {/* Inner circle */}
        <div
          className="relative rounded-full flex items-center justify-center"
          style={{ width: 60, height: 60, backgroundColor: '#151B40' }}
        >
          {/* Scan line */}
          <div className="absolute inset-0 rounded-full overflow-hidden">
            <div
              className="absolute left-0 right-0 h-0.5 animate-scan"
              style={{ backgroundColor: '#D29032', opacity: 0.9 }}
            />
          </div>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z" fill="white" opacity="0.9"/>
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold mb-2" style={{ color: '#151B40', fontWeight: 700 }}>
        Analyzing Your Smile
      </h2>

      {/* Rotating status message */}
      <div className="h-6 flex items-center justify-center mb-6">
        <p
          key={messageIndex}
          className="text-sm animate-fade-in"
          style={{ color: '#6B7280' }}
        >
          {STATUS_MESSAGES[messageIndex]}
        </p>
      </div>

      {/* Progress bar */}
      <div className="w-full max-w-xs mb-3">
        <div className="w-full h-1.5 rounded-full bg-neutral-100 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-150 ease-out"
            style={{
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #151B40 0%, #D29032 100%)',
            }}
          />
        </div>
      </div>

      <p className="text-xs" style={{ color: '#9CA3AF' }}>
        {progress}% — Please stay on this page.
      </p>
    </div>
  );
}
