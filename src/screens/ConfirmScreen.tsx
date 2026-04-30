import { ShieldCheck } from 'lucide-react';

interface Props {
  imageUrl: string;
  onConfirm: () => void;
  onEditCrop: () => void;
}

export default function ConfirmScreen({ imageUrl, onConfirm, onEditCrop }: Props) {
  return (
    <div className="animate-fade-up">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-1" style={{ color: '#151B40', fontWeight: 700 }}>
          Confirm Your Smile
        </h2>
        <p className="text-sm text-neutral-500">
          Looking good? We'll use this for your smile assessment.
        </p>
      </div>

      {/* Image Preview */}
      <div className="relative rounded-2xl overflow-hidden bg-neutral-100 shadow-card animate-scale-in">
        <img
          src={imageUrl}
          alt="Cropped smile preview"
          className="w-full object-cover"
          style={{ maxHeight: '300px', objectFit: 'contain', backgroundColor: '#0F172A' }}
        />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ boxShadow: 'inset 0 0 40px rgba(0,0,0,0.12)' }}
        />
      </div>

      {/* Privacy note */}
      <div className="mt-4 flex items-center gap-2 justify-center">
        <ShieldCheck className="w-4 h-4 flex-shrink-0" style={{ color: '#059669' }} />
        <p className="text-xs text-neutral-400">
          Your image will only be used for this analysis.
        </p>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={onEditCrop}
          className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 bg-white hover:bg-neutral-50 transition-all duration-150 active:scale-95"
          style={{ fontWeight: 500 }}
        >
          Edit Crop
        </button>
        <button
          onClick={onConfirm}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:shadow-elevated active:scale-95 flex items-center justify-center gap-2"
          style={{ backgroundColor: '#D29032', fontWeight: 600 }}
        >
          Analyze Smile
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M3 8H13M9 4L13 8L9 12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </div>
  );
}
