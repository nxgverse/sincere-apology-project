import { useCallback, useEffect, useRef, useState } from "react";
import { Maximize2, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { useSoundtrack } from "@/lib/audio";

type Props = {
  src: string;
  poster: string;
  label: string;
};

export function MemoryVideo({ src, poster, label }: Props) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const hideTimer = useRef<number | null>(null);
  const duckingRef = useRef(false);
  const { duck, unduck } = useSoundtrack();

  const [near, setNear] = useState(true);
  const [playing, setPlaying] = useState(false);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node) return;
    const io = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        setNear(entry.isIntersecting || entry.intersectionRatio > 0);
        if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
          videoRef.current.pause();
        }
      },
      { rootMargin: "300px 0px", threshold: 0 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  const setDuck = useCallback(
    (on: boolean) => {
      if (on === duckingRef.current) return;
      duckingRef.current = on;
      if (on) duck();
      else unduck();
    },
    [duck, unduck],
  );

  useEffect(() => () => setDuck(false), [setDuck]);

  const nudgeControls = useCallback(() => {
    setControlsVisible(true);
    if (hideTimer.current) window.clearTimeout(hideTimer.current);
    hideTimer.current = window.setTimeout(() => {
      if (videoRef.current && !videoRef.current.paused) setControlsVisible(false);
    }, 2600);
  }, []);

  const toggle = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) void v.play().catch(() => undefined);
    else v.pause();
    nudgeControls();
  }, [nudgeControls]);

  return (
    <div
      ref={wrapRef}
      className="memory-frame group relative w-full overflow-hidden rounded-[26px] border border-[color:var(--hairline)] bg-[color:var(--surface)] shadow-[var(--shadow-cinema)] sm:rounded-[32px]"
      onMouseMove={nudgeControls}
      onTouchStart={nudgeControls}
    >
      <video
        ref={videoRef}
        className="block h-auto w-full"
        src={src}
        preload="metadata"
        playsInline
        aria-label={label}
        onPlay={() => {
          setPlaying(true);
          if (!videoRef.current?.muted) setDuck(true);
          nudgeControls();
        }}
        onPause={() => {
          setPlaying(false);
          setDuck(false);
          setControlsVisible(true);
        }}
        onEnded={() => {
          setPlaying(false);
          setDuck(false);
          setControlsVisible(true);
        }}
        onTimeUpdate={(e) => {
          const v = e.currentTarget;
          if (v.duration) setProgress((v.currentTime / v.duration) * 100);
        }}
        onClick={toggle}
      />

      {!playing && (
        <button
          type="button"
          onClick={toggle}
          aria-label={`Play memory: ${label}`}
          className="absolute inset-0 grid place-items-center focus-visible:outline-none"
        >
          <span className="grid h-[76px] w-[76px] place-items-center rounded-full border border-white/25 bg-black/35 backdrop-blur-md transition-transform duration-500 group-hover:scale-105">
            <Play className="ml-[3px] h-7 w-7 text-[color:var(--ink)]" strokeWidth={1.4} />
          </span>
        </button>
      )}

      <div
        className={`pointer-events-none absolute inset-x-0 bottom-0 p-3 transition-opacity duration-500 sm:p-4 ${
          controlsVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="pointer-events-auto flex items-center gap-3 rounded-full border border-white/12 bg-black/45 px-3 py-2 backdrop-blur-xl">
          <button
            type="button"
            onClick={toggle}
            aria-label={playing ? "Pause" : "Play"}
            className="ctl"
          >
            {playing ? (
              <Pause className="h-4 w-4" strokeWidth={1.6} />
            ) : (
              <Play className="h-4 w-4" strokeWidth={1.6} />
            )}
          </button>

          <input
            type="range"
            min={0}
            max={100}
            step={0.1}
            value={progress}
            aria-label="Seek"
            suppressHydrationWarning
            onChange={(e) => {
              const v = videoRef.current;
              if (v?.duration) v.currentTime = (Number(e.target.value) / 100) * v.duration;
              setProgress(Number(e.target.value));
            }}
            className="track min-w-0 flex-1"
          />

          <button
            type="button"
            aria-label={muted ? "Unmute video" : "Mute video"}
            onClick={() => {
              const v = videoRef.current;
              if (!v) return;
              v.muted = !v.muted;
              setMuted(v.muted);
              setDuck(!v.muted && !v.paused);
            }}
            className="ctl"
          >
            {muted ? (
              <VolumeX className="h-4 w-4" strokeWidth={1.6} />
            ) : (
              <Volume2 className="h-4 w-4" strokeWidth={1.6} />
            )}
          </button>

          <button
            type="button"
            aria-label="Fullscreen"
            onClick={() => {
              const v = videoRef.current as
                | (HTMLVideoElement & { webkitEnterFullscreen?: () => void })
                | null;
              if (!v) return;
              if (v.requestFullscreen) void v.requestFullscreen().catch(() => undefined);
              else v.webkitEnterFullscreen?.();
            }}
            className="ctl"
          >
            <Maximize2 className="h-4 w-4" strokeWidth={1.6} />
          </button>
        </div>
      </div>
    </div>
  );
}
