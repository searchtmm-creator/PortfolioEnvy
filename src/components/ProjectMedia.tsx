import { useEffect, useRef, type ImgHTMLAttributes, type IframeHTMLAttributes } from 'react';
import { useReducedMotion } from 'framer-motion';
import { mediaInfo } from '../data/media';
import { VimeoVideo } from './VideoPlayer';

// Motion pieces behave like the original animated layouts: silent loops with
// no player UI. Playback pauses outside the viewport or in a hidden tab.
function LayoutClip({ src, poster, title, width, height, className }: { src: string; poster?: string; title: string; width?: number; height?: number; className?: string }) {
  const video = useRef<HTMLVideoElement>(null);
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const element = video.current;
    if (!element) return;
    let visible = false;
    const syncPlayback = () => {
      if (visible && !reducedMotion && !document.hidden) void element.play().catch(() => {});
      else element.pause();
    };
    const observer = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; syncPlayback(); });
    observer.observe(element);
    document.addEventListener('visibilitychange', syncPlayback);
    return () => { observer.disconnect(); document.removeEventListener('visibilitychange', syncPlayback); element.pause(); };
  }, [src, reducedMotion]);
  return <video ref={video} src={src} poster={poster} width={width} height={height} preload="none" muted loop playsInline
    className={`block ${className ?? ''}`} aria-label={title} />;
}

export function GalleryMedia({ src = '', alt = '', loading = 'lazy', className, ...rest }: ImgHTMLAttributes<HTMLImageElement>) {
  const info = mediaInfo[src];
  const isVideo = /\.mp4(?:\?|$)/i.test(src);
  const isCover = alt === '';

  if (isVideo && !isCover) {
    return <LayoutClip src={src} poster={info?.poster} title={alt} width={info?.width} height={info?.height} className={className} />;
  }
  return <img {...rest} src={isVideo ? info?.poster : src} alt={alt} width={rest.width ?? info?.width} height={rest.height ?? info?.height} loading={loading} decoding="async" className={className} />;
}

// Video playback uses site controls; audio retains Spotify's embedded player.
export function RemoteVideo({ src = '', title = 'Project video', className, poster, ...rest }: IframeHTMLAttributes<HTMLIFrameElement> & { poster?: string }) {
  const videoId = src.match(/player\.vimeo\.com\/video\/(\d+)/)?.[1];
  if (videoId) {
    const info = poster ? mediaInfo[poster] : undefined;
    return <VimeoVideo src={src} title={title} className={className}
      poster={poster ? { src: info?.poster ?? poster, width: info?.width, height: info?.height } : undefined} />;
  }
  return <iframe {...rest} src={src} title={title} loading="eager" className={className} />;
}
