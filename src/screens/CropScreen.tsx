import { useRef, useState, MouseEvent, TouchEvent, useEffect } from 'react';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface Props {
  imageUrl: string;
  onConfirm: (croppedUrl: string) => void;
  onCancel: () => void;
}

export default function CropScreen({ imageUrl, onConfirm, onCancel }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imgSize, setImgSize] = useState({ w: 0, h: 0 });
  const [crop, setCrop] = useState<CropArea>({ x: 0.15, y: 0.2, width: 0.7, height: 0.6 });
  const dragging = useRef<{ type: 'move' | 'resize'; startX: number; startY: number; startCrop: CropArea } | null>(null);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setImgSize({ w: img.naturalWidth, h: img.naturalHeight });
    img.src = imageUrl;
  }, [imageUrl]);

  function getRelativePos(e: MouseEvent | TouchEvent) {
    const rect = containerRef.current!.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    return {
      rx: (clientX - rect.left) / rect.width,
      ry: (clientY - rect.top) / rect.height,
    };
  }

  function onMouseDown(e: MouseEvent, type: 'move' | 'resize') {
    e.preventDefault();
    const { rx, ry } = getRelativePos(e);
    dragging.current = { type, startX: rx, startY: ry, startCrop: { ...crop } };
  }

  function onMouseMove(e: MouseEvent) {
    if (!dragging.current) return;
    const { rx, ry } = getRelativePos(e);
    const dx = rx - dragging.current.startX;
    const dy = ry - dragging.current.startY;
    const sc = dragging.current.startCrop;

    if (dragging.current.type === 'move') {
      const newX = Math.max(0, Math.min(1 - sc.width, sc.x + dx));
      const newY = Math.max(0, Math.min(1 - sc.height, sc.y + dy));
      setCrop({ ...sc, x: newX, y: newY });
    } else {
      const newW = Math.max(0.2, Math.min(1 - sc.x, sc.width + dx));
      const newH = Math.max(0.2, Math.min(1 - sc.y, sc.height + dy));
      setCrop({ ...sc, width: newW, height: newH });
    }
  }

  function onMouseUp() {
    dragging.current = null;
  }

  function applyCrop() {
    const canvas = document.createElement('canvas');
    const img = new Image();
    img.onload = () => {
      const sx = crop.x * img.naturalWidth;
      const sy = crop.y * img.naturalHeight;
      const sw = crop.width * img.naturalWidth;
      const sh = crop.height * img.naturalHeight;
      canvas.width = sw;
      canvas.height = sh;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);
      onConfirm(canvas.toDataURL('image/jpeg', 0.92));
    };
    img.src = imageUrl;
  }

  const pct = (v: number) => `${(v * 100).toFixed(2)}%`;

  return (
    <div className="animate-fade-up">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-primary mb-1" style={{ color: '#151B40', fontWeight: 700 }}>
          Adjust Your Smile Area
        </h2>
        <p className="text-sm text-neutral-500">
          Focus on your teeth for the most accurate results.
        </p>
      </div>

      {/* Crop Container */}
      <div
        ref={containerRef}
        className="relative rounded-2xl overflow-hidden bg-black cursor-move select-none"
        style={{ aspectRatio: imgSize.w && imgSize.h ? `${imgSize.w}/${imgSize.h}` : '4/3', maxHeight: '340px' }}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
      >
        <img
          src={imageUrl}
          alt="Upload preview"
          className="w-full h-full object-contain"
          draggable={false}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `linear-gradient(to right,
              rgba(0,0,0,0.55) ${pct(crop.x)},
              transparent ${pct(crop.x)},
              transparent ${pct(crop.x + crop.width)},
              rgba(0,0,0,0.55) ${pct(crop.x + crop.width)}
            ), linear-gradient(to bottom,
              rgba(0,0,0,0.55) ${pct(crop.y)},
              transparent ${pct(crop.y)},
              transparent ${pct(crop.y + crop.height)},
              rgba(0,0,0,0.55) ${pct(crop.y + crop.height)}
            )`,
          }}
        />

        {/* Crop frame */}
        <div
          className="absolute border-2 border-gold"
          style={{
            left: pct(crop.x),
            top: pct(crop.y),
            width: pct(crop.width),
            height: pct(crop.height),
          }}
          onMouseDown={(e) => onMouseDown(e, 'move')}
        >
          {/* Corner indicators */}
          {[
            'top-0 left-0 border-t-2 border-l-2',
            'top-0 right-0 border-t-2 border-r-2',
            'bottom-0 left-0 border-b-2 border-l-2',
            'bottom-0 right-0 border-b-2 border-r-2',
          ].map((cls, i) => (
            <div
              key={i}
              className={`absolute w-4 h-4 border-gold ${cls}`}
              style={{ borderColor: '#D29032' }}
            />
          ))}

          {/* Grid lines */}
          <div className="absolute inset-0 pointer-events-none" style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '33.33% 33.33%',
          }} />

          {/* Resize handle */}
          <div
            className="absolute bottom-0 right-0 w-5 h-5 cursor-se-resize flex items-end justify-end pb-0.5 pr-0.5"
            onMouseDown={(e) => { e.stopPropagation(); onMouseDown(e, 'resize'); }}
          >
            <div className="w-3 h-3 bg-gold rounded-sm" style={{ backgroundColor: '#D29032' }} />
          </div>
        </div>
      </div>

      {/* Tip */}
      <p className="mt-3 text-xs text-neutral-400 text-center">
        Keep your teeth centered and clearly visible.
      </p>

      {/* Actions */}
      <div className="flex gap-3 mt-5">
        <button
          onClick={onCancel}
          className="flex-1 py-3 rounded-xl border border-neutral-200 text-sm font-medium text-neutral-600 bg-white hover:bg-neutral-50 transition-all duration-150 active:scale-95"
          style={{ fontWeight: 500 }}
        >
          Cancel
        </button>
        <button
          onClick={applyCrop}
          className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition-all duration-150 hover:shadow-elevated active:scale-95"
          style={{ backgroundColor: '#151B40', fontWeight: 600 }}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
