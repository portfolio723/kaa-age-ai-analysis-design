import { useRef, useState, DragEvent, ChangeEvent } from 'react';
import { Upload, Lock, Clock, Smile } from 'lucide-react';

interface Props {
  onImageSelected: (file: File) => void;
}

export default function UploadScreen({ onImageSelected }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  function handleFile(file: File) {
    if (file.type.startsWith('image/')) {
      onImageSelected(file);
    }
  }

  function onDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function onDragOver(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setIsDragging(true);
  }

  function onDragLeave() {
    setIsDragging(false);
  }

  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="animate-fade-up">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-primary/8 mb-4" style={{ backgroundColor: 'rgba(21,27,64,0.07)' }}>
          <Smile className="w-7 h-7 text-primary" style={{ color: '#151B40' }} />
        </div>
        <h1 className="text-3xl font-bold text-primary mb-2 tracking-tight" style={{ color: '#151B40', fontWeight: 700 }}>
          Smile Analysis
        </h1>
        <p className="text-base text-neutral-500 max-w-xs mx-auto leading-relaxed">
          Get a quick, private assessment of your smile in seconds.
        </p>
      </div>

      {/* Upload Box */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={`
          relative cursor-pointer rounded-2xl border-2 border-dashed p-10 flex flex-col items-center gap-4
          transition-all duration-200 group
          ${isDragging
            ? 'border-gold bg-amber-50 shadow-glow scale-[1.01]'
            : 'border-neutral-200 bg-white hover:border-gold hover:bg-amber-50/40 hover:shadow-glow'
          }
        `}
        style={isDragging ? { boxShadow: '0 0 0 3px rgba(210, 144, 50, 0.2)' } : undefined}
      >
        <div className={`
          w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-200
          ${isDragging ? 'bg-gold/15 scale-110' : 'bg-neutral-100 group-hover:bg-gold/10 group-hover:scale-105'}
        `}>
          <Upload className={`w-7 h-7 transition-colors duration-200 ${isDragging ? 'text-gold' : 'text-neutral-400 group-hover:text-gold'}`} />
        </div>

        <div className="text-center">
          <p className="text-base font-semibold text-neutral-700 mb-1" style={{ fontWeight: 600 }}>
            Upload your smile
          </p>
          <p className="text-sm text-neutral-400">
            Drag & drop or choose a photo
          </p>
        </div>

        <button
          type="button"
          className="mt-1 px-6 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200
            bg-primary hover:bg-primary-light active:scale-95 shadow-sm hover:shadow-elevated"
          style={{ backgroundColor: '#151B40', fontWeight: 600 }}
          onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
        >
          Select Image
        </button>

        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onInputChange}
        />
      </div>

      {/* Trust Indicators */}
      <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
        {[
          { icon: Lock, text: 'Your image is private & secure' },
          { icon: Clock, text: 'Takes less than 30 seconds' },
          { icon: Smile, text: 'No sign-up required' },
        ].map(({ icon: Icon, text }, i) => (
          <div key={i} className="flex items-center gap-2 justify-center sm:justify-start">
            <div className="w-5 h-5 flex items-center justify-center rounded-full bg-success-50" style={{ backgroundColor: '#ECFDF5' }}>
              <Icon className="w-3 h-3 text-success-600" style={{ color: '#059669' }} />
            </div>
            <span className="text-xs text-neutral-500">{text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
