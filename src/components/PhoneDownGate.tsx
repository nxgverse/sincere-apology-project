import { useCallback, useEffect, useRef, useState } from "react";
import { Play } from "lucide-react";
import { useSoundtrack } from "@/lib/audio";
import { Reveal } from "@/components/Reveal";

type Props = {
  src: string;
  poster: string;
  label: string;
  onCinema: (on: boolean) => void;
};

export function PhoneDownGate({ src, poster, label, onCinema }: Props) {
  const [open, setOpen] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [done, setDone] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const ducking = useRef(false);
  const { duck, unduck } = useSoundtrack();

  const setDuck = useCallback(
    (on: boolean) => {
      if (on === ducking.current) return;
      ducking.current = on;
      if (on) duck();
      else unduck();
    },
    [duck, unduck],
  );

  useEffect(() => {
    onCinema(open);
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open, onCinema]);

  useEffect(() => () => setDuck(false), [setDuck]);

  const close = () => {
    videoRef.current?.pause();
    setDuck(false);
    setOpen(false);
    setDone(false);
  };

  return (
    <>
      <div className="mx-auto max-w-[36ch] space-y-8 text-center">
        <Reveal as="p" className="prose-line">
          For this part, don&apos;t rush.
        </Reveal>
        <Reveal as="p" className="display-lg" delay={220}>
          Put your phone down for a second.
        </Reveal>
        <Reveal delay={420}>
          <button type="button" onClick={() => setOpen(true)} className="quiet-btn">
            I&apos;m ready
          </button>
        </Reveal>
      </div>

      {open && (
        <div
          className="cinema-veil fixed inset-0 z-[60] grid place-items-center px-4 py-8"
          role="dialog"
          aria-label="A memory"
        >
          <div className="relative w-full max-w-[520px]">
            <video
              ref={videoRef}
              className="block h-auto max-h-[82svh] w-full rounded-[26px] sm:rounded-[32px]"
              src={src}
              preload="metadata"
              playsInline
              aria-label={label}
              onPlay={() => {
                setPlaying(true);
                if (!videoRef.current?.muted) setDuck(true);
              }}
              onPause={() => {
                setPlaying(false);
                setDuck(false);
              }}
              onEnded={() => {
                setPlaying(false);
                setDuck(false);
                setDone(true);
              }}
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                if (v.paused) void v.play().catch(() => undefined);
                else v.pause();
              }}
            />

            {!playing && (
              <button
                type="button"
                aria-label={`Play memory: ${label}`}
                onClick={() => void videoRef.current?.play().catch(() => undefined)}
                className="absolute inset-0 grid place-items-center"
              >
                <span className="grid h-[76px] w-[76px] place-items-center rounded-full border border-white/25 bg-black/35 backdrop-blur-md">
                  <Play className="ml-[3px] h-7 w-7 text-[color:var(--ink)]" strokeWidth={1.4} />
                </span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={close}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 whisper transition-opacity duration-1000"
            style={{ opacity: done || !playing ? 0.75 : 0 }}
          >
            Come back
          </button>
        </div>
      )}
    </>
  );
}
