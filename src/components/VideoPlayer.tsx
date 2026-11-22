import React, { useCallback, useEffect, useRef, useState } from 'react';

type VideoPlayerProps = React.VideoHTMLAttributes<HTMLVideoElement> & {
  /** The opacity class the video settles at once it can be seen. */
  loadedOpacity?: string;
  /** Shown in place of the video if it can't be loaded (e.g. the file hasn't been added yet). */
  fallback?: React.ReactNode;
};

/** Each video's first-frame poster, written next to it by the compression script: /videos/posters/<name>.jpg */
function posterFor(src?: string) {
  const match = src?.match(/^\/videos\/(.+)\.mp4$/);
  return match ? `/videos/posters/${match[1]}.jpg` : undefined;
}

/**
 * A looping product video that costs nothing until it's needed: it doesn't download until it's within
 * a screen of the viewport, plays only while visible, and pauses once scrolled away. Until the video
 * itself is ready, its poster frame shows (over the pulsing placeholder).
 */
export const VideoPlayer = React.forwardRef<HTMLVideoElement, VideoPlayerProps>(
  ({ src, className, onLoadedData, loadedOpacity = 'opacity-100', fallback, autoPlay, ...props }, ref) => {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const [isNear, setIsNear] = useState(false);
    const [isLoaded, setIsLoaded] = useState(false);
    const [failed, setFailed] = useState(false);
    const [posterReady, setPosterReady] = useState(false);
    const poster = posterFor(src);

    useEffect(() => {
      setIsLoaded(false);
      setFailed(false);
    }, [src]);

    // Find out whether the poster exists before showing the video element over the placeholder.
    useEffect(() => {
      setPosterReady(false);
      if (!poster) return;
      const img = new Image();
      img.onload = () => setPosterReady(true);
      img.src = poster;
      return () => { img.onload = null; };
    }, [poster]);

    const setRefs = useCallback((el: HTMLVideoElement | null) => {
      videoRef.current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) ref.current = el;
    }, [ref]);

    useEffect(() => {
      const el = videoRef.current;
      if (!el) return;
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setIsNear(true);
          if (autoPlay) el.play().catch(() => {});
        } else {
          el.pause();
        }
      }, { rootMargin: '300px 0px' });
      observer.observe(el);
      return () => observer.disconnect();
    }, [autoPlay, failed]);

    if (failed && fallback) {
      return (
        <>
          <div className="absolute inset-0 bg-zinc-900 animate-pulse z-0" />
          {fallback}
        </>
      );
    }

    return (
      <>
        <div className="absolute inset-0 bg-zinc-900 animate-pulse z-0" />
        <video
          {...props}
          ref={setRefs}
          src={isNear ? src : undefined}
          poster={posterReady ? poster : undefined}
          autoPlay={autoPlay}
          preload={isNear ? 'auto' : 'none'}
          onLoadedData={(e) => {
            setIsLoaded(true);
            onLoadedData?.(e);
          }}
          onError={(e) => {
            setFailed(true);
            props.onError?.(e);
          }}
          className={`${className} transition-opacity duration-700 ${isLoaded || posterReady ? loadedOpacity : 'opacity-0'}`}
        />
      </>
    );
  }
);
VideoPlayer.displayName = 'VideoPlayer';
