import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react';
import { Maximize, Minimize, Pause, Play, Volume2, VolumeX } from 'lucide-react';

type PlayerEvent = { seconds?: number; duration?: number; volume?: number; muted?: boolean; method?: string };
interface VimeoPlayer {
  ready(): Promise<void>;
  play(): Promise<void>;
  pause(): Promise<void>;
  destroy(): Promise<void>;
  getDuration(): Promise<number>;
  getVolume(): Promise<number>;
  getMuted(): Promise<boolean>;
  setCurrentTime(seconds: number): Promise<number>;
  setVolume(volume: number): Promise<number>;
  setMuted(muted: boolean): Promise<boolean>;
  requestFullscreen(): Promise<void>;
  on(event: string, callback: (data: PlayerEvent) => void): void;
  off(event: string): void;
}
type VimeoConstructor = new (iframe: HTMLIFrameElement) => VimeoPlayer;
declare global { interface Window { Vimeo?: { Player: VimeoConstructor } } }

let sdkPromise: Promise<VimeoConstructor> | undefined;
function loadVimeo() {
  if (window.Vimeo) return Promise.resolve(window.Vimeo.Player);
  if (!sdkPromise) {
    sdkPromise = new Promise<VimeoConstructor>((resolve, reject) => {
      const script = document.createElement('script');
      const fail = () => { clearTimeout(timeout); script.remove(); reject(new Error('Vimeo unavailable')); };
      const timeout = window.setTimeout(fail, 12000);
      script.src = 'https://player.vimeo.com/api/player.js';
      script.async = true;
      script.onload = () => {
        clearTimeout(timeout);
        if (window.Vimeo) resolve(window.Vimeo.Player);
        else fail();
      };
      script.onerror = fail;
      document.head.append(script);
    }).catch(error => { sdkPromise = undefined; throw error; });
  }
  return sdkPromise;
}

function timeLabel(seconds: number) {
  const total = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, '0')}`;
}

function useFullscreen() {
  const root = useRef<HTMLDivElement>(null);
  const [fullscreen, setFullscreen] = useState(false);
  useEffect(() => {
    const change = () => setFullscreen(document.fullscreenElement === root.current);
    document.addEventListener('fullscreenchange', change);
    return () => document.removeEventListener('fullscreenchange', change);
  }, []);
  const toggle = async (fallback?: () => Promise<void>) => {
    if (document.fullscreenElement === root.current) await document.exitFullscreen();
    else if (root.current?.requestFullscreen) await root.current.requestFullscreen();
    else await fallback?.();
  };
  return { root, fullscreen, toggle };
}

interface ControlsProps {
  playing: boolean; time: number; duration: number; volume: number; muted: boolean;
  fullscreen: boolean; disabled?: boolean; silent?: boolean;
  onPlay(): void; onSeek(time: number): void; onMute(): void; onVolume(volume: number): void; onFullscreen(): void;
}
function VideoControls(props: ControlsProps) {
  const progress = props.duration > 0 ? Math.min(100, props.time / props.duration * 100) : 0;
  return <div className="video-controls" aria-label="Video controls">
    <input className="video-progress" type="range" min="0" max={props.duration || 1} step="0.1"
      value={Math.min(props.time, props.duration || 1)} disabled={props.disabled || !props.duration}
      aria-label="Video progress" aria-valuetext={`${timeLabel(props.time)} of ${timeLabel(props.duration)}`}
      style={{ '--progress': `${progress}%` } as CSSProperties} onChange={event => props.onSeek(Number(event.target.value))} />
    <div className="video-toolbar">
      <button type="button" aria-label={props.playing ? 'Pause video' : 'Play video'} disabled={props.disabled} onClick={props.onPlay}>
        {props.playing ? <Pause size={18} /> : <Play size={18} />}
      </button>
      <span className="video-time" aria-hidden="true">{timeLabel(props.time)} / {timeLabel(props.duration)}</span>
      <div className="video-toolbar-spacer" />
      {!props.silent && <>
        <button type="button" aria-label={props.muted || props.volume === 0 ? 'Unmute video' : 'Mute video'} disabled={props.disabled} onClick={props.onMute}>
          {props.muted || props.volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </button>
        <input className="video-volume" type="range" min="0" max="1" step="0.05" aria-label="Video volume"
          value={props.muted ? 0 : props.volume} disabled={props.disabled} onChange={event => props.onVolume(Number(event.target.value))} />
      </>}
      <button type="button" aria-label={props.fullscreen ? 'Exit fullscreen' : 'Fullscreen video'} onClick={props.onFullscreen}>
        {props.fullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
      </button>
    </div>
  </div>;
}

export function VimeoVideo({ src, title, className, poster }: { src: string; title: string; className?: string; poster?: { src: string; width?: number; height?: number } }) {
  const { root, fullscreen, toggle } = useFullscreen();
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<VimeoPlayer | null>(null);
  const [attempt, setAttempt] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [error, setError] = useState('');
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [notice, setNotice] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const [controlsAwake, setControlsAwake] = useState(true);
  const idleTimer = useRef<number | undefined>(undefined);
  const keyboardInteraction = useRef(true);
  const focusWithin = useRef(false);
  const controlsHovered = useRef(false);
  const draggingControl = useRef(false);
  const canHideControls = playing && hasStarted && ready && !buffering && !notice && !error;
  const controlsHidden = canHideControls && !controlsAwake;
  const clearIdle = useCallback(() => {
    if (idleTimer.current !== undefined) window.clearTimeout(idleTimer.current);
    idleTimer.current = undefined;
  }, []);
  const scheduleIdle = useCallback(() => {
    clearIdle();
    if (!canHideControls || controlsHovered.current || draggingControl.current || (keyboardInteraction.current && focusWithin.current)) return;
    idleTimer.current = window.setTimeout(() => setControlsAwake(false), 2200);
  }, [canHideControls, clearIdle]);
  const wakeControls = () => { setControlsAwake(true); scheduleIdle(); };
  useEffect(() => { scheduleIdle(); return clearIdle; }, [scheduleIdle, clearIdle, fullscreen]);
  useEffect(() => {
    const release = () => {
      if (draggingControl.current) { draggingControl.current = false; scheduleIdle(); }
    };
    window.addEventListener('pointerup', release);
    window.addEventListener('pointercancel', release);
    return () => { window.removeEventListener('pointerup', release); window.removeEventListener('pointercancel', release); };
  }, [scheduleIdle]);
  const external = new URL(src);
  external.hostname = 'vimeo.com';
  external.pathname = external.pathname.replace('/video/', '/');
  const hash = external.searchParams.get('h');
  external.search = '';
  if (hash) external.pathname += `/${hash}`;

  useEffect(() => {
    if (!attempt || !host.current) return;
    const container = host.current;
    let cancelled = false;
    let instance: VimeoPlayer | undefined;
    const events: string[] = [];
    const timeout = window.setTimeout(() => {
      if (!cancelled) { setError('The video could not load. Please retry.'); setBuffering(false); }
    }, 20000);
    const initialize = async () => {
      try {
        const Player = await loadVimeo();
        if (cancelled) return;
        const url = new URL(src);
        Object.entries({ controls: '0', title: '0', byline: '0', portrait: '0', dnt: '1', playsinline: '1', keyboard: '0', muted: '0' })
          .forEach(([key, value]) => url.searchParams.set(key, value));
        const iframe = document.createElement('iframe');
        iframe.src = url.toString();
        iframe.title = title;
        iframe.allow = 'autoplay; fullscreen; picture-in-picture; encrypted-media';
        iframe.allowFullscreen = true;
        iframe.tabIndex = -1;
        container.replaceChildren(iframe);
        instance = new Player(iframe);
        player.current = instance;
        const on = (event: string, callback: (data: PlayerEvent) => void) => {
          events.push(event);
          instance!.on(event, data => { if (!cancelled) callback(data); });
        };
        on('play', () => { setPlaying(true); setControlsAwake(true); setError(''); });
        on('playing', () => { setHasStarted(true); setPlaying(true); setBuffering(false); setControlsAwake(true); });
        on('pause', () => { setPlaying(false); setBuffering(false); setControlsAwake(true); });
        on('ended', () => { setPlaying(false); setBuffering(false); setControlsAwake(true); });
        on('timeupdate', data => { setTime(data.seconds ?? 0); setDuration(data.duration ?? 0); });
        on('durationchange', data => setDuration(data.duration ?? 0));
        on('volumechange', data => { setVolume(data.volume ?? 1); setMuted(data.muted ?? false); });
        on('bufferstart', () => { setBuffering(true); setControlsAwake(true); });
        on('bufferend', () => setBuffering(false));
        on('error', data => {
          if (!data.method) { setError('The video is unavailable. Please retry.'); setPlaying(false); setBuffering(false); }
        });
        await instance.ready();
        clearTimeout(timeout);
        if (cancelled) return;
        setError('');
        const totalDuration = await instance.getDuration();
        if (cancelled) return;
        setDuration(totalDuration);
        // Vimeo can remember a muted/zero-volume session. Each film starts audible
        // after the visitor presses Play; later mute/volume choices stay intact.
        await instance.setMuted(false);
        if (cancelled) return;
        setMuted(false);
        try { await instance.setVolume(1); }
        catch { /* Some mobile devices control volume only with system buttons. */ }
        if (cancelled) return;
        const initialVolume = await instance.getVolume();
        if (cancelled) return;
        setVolume(initialVolume);
        setReady(true);
        try { await instance.play(); }
        catch { if (!cancelled) { setBuffering(false); setNotice('Press play to start the video.'); } }
      } catch {
        clearTimeout(timeout);
        if (!cancelled) { setError('The video could not load. Please retry.'); setBuffering(false); }
      }
    };
    void initialize();
    const visibility = () => { if (document.hidden) void instance?.pause().catch(() => {}); };
    document.addEventListener('visibilitychange', visibility);
    return () => {
      cancelled = true;
      clearTimeout(timeout);
      document.removeEventListener('visibilitychange', visibility);
      if (instance) { events.forEach(event => instance!.off(event)); void instance.destroy().catch(() => {}); }
      player.current = null;
    };
  }, [attempt, src, title]);

  const start = () => {
    clearIdle(); setControlsAwake(true); setHasStarted(false);
    controlsHovered.current = false; draggingControl.current = false;
    setReady(false); setPlaying(false); setTime(0); setDuration(0); setError(''); setNotice(''); setBuffering(true);
    root.current?.focus({ preventScroll: true });
    setAttempt(value => value + 1);
  };
  const command = (action: () => Promise<unknown>) => {
    setNotice(''); setControlsAwake(true);
    void action().catch(() => { setControlsAwake(true); setBuffering(false); setNotice('This control is unavailable. Please try again or use your device controls.'); });
  };
  return <div ref={root} className={`site-video ${className ?? ''}`} role="group" aria-label={`${title} video player`} tabIndex={-1}
    data-controls-hidden={controlsHidden} data-playback-started={hasStarted}
    onPointerMove={event => { if (event.pointerType === 'mouse') keyboardInteraction.current = false; wakeControls(); }}
    onPointerDown={() => { keyboardInteraction.current = false; wakeControls(); }}
    onFocusCapture={() => { focusWithin.current = true; wakeControls(); }}
    onBlurCapture={event => { if (!event.currentTarget.contains(event.relatedTarget)) { focusWithin.current = false; scheduleIdle(); } }}
    onKeyDown={event => {
      keyboardInteraction.current = true; wakeControls();
      if (event.target === event.currentTarget && ready && (event.key === ' ' || event.key === 'Enter')) {
        event.preventDefault(); command(() => playing ? player.current!.pause() : player.current!.play());
      }
    }}>
    <div ref={host} className="video-host" />
    <div className={`video-start ${hasStarted ? 'video-start--departed' : ''}`} aria-hidden={hasStarted} inert={hasStarted || attempt > 0}>
      {poster && <img className="video-poster" src={poster.src} width={poster.width} height={poster.height} alt="" loading="lazy" decoding="async" />}
      {!attempt && <>
        <span className="video-caption">{title}</span>
        <button type="button" className="video-start-button" aria-label="Play video" onClick={start}><Play size={24} /><span>PLAY FILM</span></button>
        <span className="video-caption video-caption-small">SERGIO ALZATE / SELECTED WORK</span>
      </>}
    </div>
    {attempt > 0 && !error && buffering && <div className="video-loading" role="status">LOADING VIDEO…</div>}
    {error && <div className="video-error" role="alert">
      <p>{error}</p>
      <button type="button" onClick={start}>Retry video</button>
      <a href={external.toString()} target="_blank" rel="noopener noreferrer">Open on Vimeo ↗</a>
    </div>}
    {notice && <p className="video-notice" role="status">{notice}</p>}
    {attempt > 0 && !error && <div className={`video-control-layer ${controlsHidden ? 'video-control-layer--hidden' : ''}`}
      onPointerEnter={event => { if (event.pointerType === 'mouse') controlsHovered.current = true; wakeControls(); }}
      onPointerLeave={() => { controlsHovered.current = false; scheduleIdle(); }}
      onPointerDown={event => { if (event.target instanceof HTMLInputElement && event.target.type === 'range') draggingControl.current = true; wakeControls(); }}>
      <VideoControls playing={playing} time={time} duration={duration} volume={volume} muted={muted} fullscreen={fullscreen} disabled={!ready}
      onPlay={() => command(() => playing ? player.current!.pause() : player.current!.play())}
      onSeek={value => command(async () => { await player.current!.setCurrentTime(value); setTime(value); })}
      onMute={() => command(async () => { const next = !muted && volume > 0; await player.current!.setMuted(next); setMuted(next); if (!next && volume === 0) { await player.current!.setVolume(1); setVolume(1); } })}
      onVolume={value => command(async () => { await player.current!.setVolume(value); await player.current!.setMuted(value === 0); setVolume(value); setMuted(value === 0); })}
      onFullscreen={() => command(() => toggle(() => player.current?.requestFullscreen() ?? Promise.resolve()))} />
    </div>}
  </div>;
}
