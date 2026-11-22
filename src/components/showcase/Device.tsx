import React, { useState } from 'react';
import { VideoPlayer } from '../VideoPlayer';

/** What a screen shows until its recording or screenshot exists: the product's monogram on its accent. */
export function PlaceholderScreen({ monogram, accent, accentDeep, label = 'Screen coming soon' }: { monogram: string; accent: string; accentDeep: string; label?: string }) {
  return (
    <div
      className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4"
      style={{ background: `radial-gradient(ellipse at 50% 30%, ${accentDeep} 0%, #0b0a0d 65%, #050506 100%)` }}
    >
      <div className="w-14 h-14 rounded-full border flex items-center justify-center" style={{ borderColor: `${accent}66` }}>
        <span className="font-display text-2xl italic" style={{ color: accent }}>{monogram}</span>
      </div>
      <span className="text-[9px] font-mono uppercase tracking-[0.3em] text-white/35">{label}</span>
    </div>
  );
}

interface ScreenProps {
  image: string;
  video?: string;
  playing?: boolean;
  monogram: string;
  accent: string;
  accentDeep: string;
}

/** A recording if there is one, then the screenshot, then the placeholder. */
function Screen({ image, video, playing, ...brand }: ScreenProps) {
  const [imageFailed, setImageFailed] = useState(false);
  const still = imageFailed
    ? <PlaceholderScreen {...brand} />
    : <img src={image} alt="" draggable={false} onError={() => setImageFailed(true)} className="absolute inset-0 w-full h-full object-cover" />;

  if (video && playing) {
    return (
      <VideoPlayer
        src={video}
        autoPlay
        loop
        muted
        playsInline
        fallback={still}
        className="absolute inset-0 w-full h-full object-cover z-10"
      />
    );
  }
  return still;
}

const SLICES = 7;

/**
 * A phone with real thickness: the frame is drawn as a stack of slices in 3D, so turning it shows
 * a solid titanium edge instead of a flat card. The parent must keep `transform-style: preserve-3d`.
 */
export function Device({
  className = '',
  active = false,
  glow,
  ...screen
}: ScreenProps & { className?: string; active?: boolean; glow?: string }) {
  return (
    <div className={`relative aspect-[1/2.16] [transform-style:preserve-3d] ${className}`}>
      {/* Edge: slices behind the face */}
      {Array.from({ length: SLICES }).map((_, i) => (
        <div
          key={i}
          aria-hidden
          className="absolute inset-0 rounded-[13%/6%]"
          style={{
            transform: `translateZ(${-(i + 1) * 1.6}px)`,
            background: i === SLICES - 1 ? '#0c0c0e' : `linear-gradient(135deg, #5b5b62, #232327 45%, #3a3a40)`
          }}
        />
      ))}

      {/* Face */}
      <div className="absolute inset-0 rounded-[13%/6%] p-[2.4%] bg-gradient-to-br from-zinc-500 via-zinc-800 to-zinc-900 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
        <div className="relative w-full h-full rounded-[11%/5%] overflow-hidden bg-black">
          <Screen {...screen} />
          {/* Dynamic island */}
          <div className="absolute top-[2.2%] left-1/2 -translate-x-1/2 w-[30%] h-[3.2%] rounded-full bg-black z-30" />
          {/* Glass reflection */}
          <div className="absolute inset-0 z-20 pointer-events-none bg-[linear-gradient(115deg,rgba(255,255,255,0.16)_0%,rgba(255,255,255,0.03)_28%,transparent_45%)]" />
        </div>
        <div className="absolute inset-0 rounded-[13%/6%] ring-1 ring-inset ring-white/20 pointer-events-none" />
      </div>

      {glow && (
        <div
          aria-hidden
          className={`absolute -inset-[35%] -z-10 rounded-full blur-3xl transition-opacity duration-700 ${active ? 'opacity-100' : 'opacity-0'}`}
          style={{ background: `radial-gradient(circle, ${glow}40 0%, transparent 60%)`, transform: 'translateZ(-40px)' }}
        />
      )}
    </div>
  );
}
