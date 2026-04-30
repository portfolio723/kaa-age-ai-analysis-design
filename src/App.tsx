import { useState, useCallback } from 'react';
import { Step, AnalysisResults } from './types';
import ProgressIndicator from './components/ProgressIndicator';
import UploadScreen from './screens/UploadScreen';
import CropScreen from './screens/CropScreen';
import ConfirmScreen from './screens/ConfirmScreen';
import ProcessingScreen from './screens/ProcessingScreen';
import ResultsScreen from './screens/ResultsScreen';

export default function App() {
  const [step, setStep] = useState<Step>('upload');
  const [rawImageUrl, setRawImageUrl] = useState<string>('');
  const [croppedImageUrl, setCroppedImageUrl] = useState<string>('');
  const [results, setResults] = useState<AnalysisResults | null>(null);

  function handleImageSelected(file: File) {
    const url = URL.createObjectURL(file);
    setRawImageUrl(url);
    setStep('crop');
  }

  function handleCropConfirm(croppedUrl: string) {
    setCroppedImageUrl(croppedUrl);
    setStep('confirm');
  }

  function handleAnalyze() {
    setStep('processing');
  }

  const handleProcessingComplete = useCallback((analysisResults: AnalysisResults) => {
    setResults(analysisResults);
    setStep('results');
  }, []);

  function handleRestart() {
    if (rawImageUrl) URL.revokeObjectURL(rawImageUrl);
    setRawImageUrl('');
    setCroppedImageUrl('');
    setResults(null);
    setStep('upload');
  }

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-start py-10 px-4"
      style={{ backgroundColor: '#F9FAFB' }}
    >
      {/* Logo / Brand */}
      <div className="flex items-center gap-2 mb-8">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: '#151B40' }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <a target="_blank" href="https://icons8.com/icon/9557/tooth">Teeth</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
          </svg>
        </div>
        <span className="text-sm font-semibold" style={{ color: '#151B40', fontWeight: 600 }}>
          KAA Dental
        </span>
      </div>

      {/* Card */}
      <div
        className="w-full rounded-3xl p-6 sm:p-8"
        style={{
          maxWidth: step === 'results' ? '540px' : '480px',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 4px 24px 0 rgba(0,0,0,0.07), 0 1px 4px 0 rgba(0,0,0,0.04)',
        }}
      >
        {/* Progress indicator - hide on upload and results */}
        {step !== 'upload' && (
          <ProgressIndicator current={step} />
        )}

        {step === 'upload' && (
          <UploadScreen onImageSelected={handleImageSelected} />
        )}

        {step === 'crop' && rawImageUrl && (
          <CropScreen
            imageUrl={rawImageUrl}
            onConfirm={handleCropConfirm}
            onCancel={handleRestart}
          />
        )}

        {step === 'confirm' && croppedImageUrl && (
          <ConfirmScreen
            imageUrl={croppedImageUrl}
            onConfirm={handleAnalyze}
            onEditCrop={() => setStep('crop')}
          />
        )}

        {step === 'processing' && (
          <ProcessingScreen onComplete={handleProcessingComplete} />
        )}

        {step === 'results' && results && croppedImageUrl && (
          <ResultsScreen
            results={results}
            imageUrl={croppedImageUrl}
            onRestart={handleRestart}
          />
        )}
      </div>

      {/* Footer */}
      <p className="mt-6 text-xs" style={{ color: '#D1D5DB' }}>
        © 2026 DentalAI · Private & Secure
      </p>
    </div>
  );
}
