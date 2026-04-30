import { useEffect, useState } from 'react';
import { CheckCircle, Calendar, RefreshCw } from 'lucide-react';
import { AnalysisResults } from '../types';

interface MetricCardProps {
  label: string;
  value: string;
  delay: number;
}

function MetricCard({ label, value, delay }: MetricCardProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const getValueColor = (val: string) => {
    const v = val.toLowerCase();
    if (['good', 'normal', 'straight', 'excellent'].includes(v)) return '#059669';
    if (['slightly yellow', 'fair'].includes(v)) return '#D97706';
    return '#6B7280';
  };

  return (
    <div
      className={`rounded-xl p-4 border border-neutral-100 bg-white transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-3'
      }`}
      style={{ transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
    >
      <p className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: '#9CA3AF', letterSpacing: '0.06em' }}>
        {label}
      </p>
      <p className="text-base font-semibold" style={{ color: getValueColor(value), fontWeight: 600 }}>
        {value}
      </p>
    </div>
  );
}

interface RecommendationProps {
  text: string;
  delay: number;
}

function Recommendation({ text, delay }: RecommendationProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className={`flex items-start gap-3 transition-all duration-500 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ transform: visible ? 'translateY(0)' : 'translateY(10px)' }}
    >
      <div
        className="flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
        style={{ backgroundColor: 'rgba(210,144,50,0.12)' }}
      >
        <CheckCircle className="w-3 h-3" style={{ color: '#D29032' }} />
      </div>
      <p className="text-sm leading-relaxed" style={{ color: '#374151' }}>
        {text}
      </p>
    </div>
  );
}

interface Props {
  results: AnalysisResults;
  imageUrl: string;
  onRestart: () => void;
}

export default function ResultsScreen({ results, imageUrl, onRestart }: Props) {
  const [headerVisible, setHeaderVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  useEffect(() => {
    const t1 = setTimeout(() => setHeaderVisible(true), 50);
    const t2 = setTimeout(() => setSummaryVisible(true), 200);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  const metrics = [
    { label: 'Tooth Color', value: results.metrics.toothColor },
    { label: 'Gum Visibility', value: results.metrics.gumVisibility },
    { label: 'Alignment', value: results.metrics.alignment },
    { label: 'Cleanliness', value: results.metrics.cleanliness },
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div
        className={`flex items-start justify-between gap-3 transition-all duration-500 ${
          headerVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 ring-2 ring-neutral-100">
            <img src={imageUrl} alt="Your smile" className="w-full h-full object-cover" />
          </div>
          <div>
            <h2 className="text-xl font-bold" style={{ color: '#151B40', fontWeight: 700 }}>
              Your Smile Analysis
            </h2>
            <p className="text-xs" style={{ color: '#9CA3AF' }}>Reviewed using advanced dental AI</p>
          </div>
        </div>

        {/* Confidence Badge */}
        <div
          className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{ backgroundColor: '#ECFDF5', color: '#059669', fontWeight: 600 }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          {results.confidence}% Confidence
        </div>
      </div>

      {/* Summary Card */}
      <div
        className={`rounded-2xl p-5 transition-all duration-500 ${
          summaryVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background: 'linear-gradient(135deg, rgba(21,27,64,0.04) 0%, rgba(210,144,50,0.06) 100%)',
          border: '1px solid rgba(21,27,64,0.07)',
          transform: summaryVisible ? 'translateY(0)' : 'translateY(8px)',
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: '#9CA3AF', letterSpacing: '0.06em' }}>
          Summary
        </p>
        <p className="text-sm leading-relaxed" style={{ color: '#0F172A' }}>
          {results.summary}
        </p>
      </div>

      {/* Key Metrics */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-3" style={{ color: '#9CA3AF', letterSpacing: '0.06em' }}>
          Key Metrics
        </p>
        <div className="grid grid-cols-2 gap-3">
          {metrics.map((m, i) => (
            <MetricCard key={m.label} label={m.label} value={m.value} delay={350 + i * 80} />
          ))}
        </div>
      </div>

      {/* Recommendations */}
      <div className="rounded-2xl p-5 bg-white border border-neutral-100">
        <p className="text-xs font-semibold uppercase tracking-wide mb-4" style={{ color: '#9CA3AF', letterSpacing: '0.06em' }}>
          Recommendations
        </p>
        <div className="space-y-3">
          {results.recommendations.map((rec, i) => (
            <Recommendation key={i} text={rec} delay={700 + i * 100} />
          ))}
        </div>
      </div>

      {/* CTAs */}
      <div className="space-y-3 pt-1">
        <button
          className="w-full py-3.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all duration-200 hover:shadow-elevated active:scale-95"
          style={{ backgroundColor: '#D29032', fontWeight: 600 }}
        >
          <Calendar className="w-4 h-4" />
          Book Professional Consultation
        </button>
        <button
          onClick={onRestart}
          className="w-full py-3 rounded-xl border border-neutral-200 text-sm font-medium bg-white hover:bg-neutral-50 transition-all duration-150 active:scale-95 flex items-center justify-center gap-2"
          style={{ color: '#374151', fontWeight: 500 }}
        >
          <RefreshCw className="w-4 h-4 text-neutral-400" />
          Analyze Another Smile
        </button>
      </div>

      {/* Disclaimer */}
      <p className="text-xs text-center" style={{ color: '#9CA3AF' }}>
        This assessment is for informational purposes only and does not replace professional dental advice.
      </p>
    </div>
  );
}
