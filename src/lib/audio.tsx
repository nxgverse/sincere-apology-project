import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import aeo from "@/assets/aeo.mp3.asset.json";

type AudioApi = {
  started: boolean;
  muted: boolean;
  start: () => void;
  toggleMute: () => void;
  duck: () => void;
  unduck: () => void;
};

const Ctx = createContext<AudioApi | null>(null);

const FULL = 0.42;
const DUCKED = 0.06;

export function SoundtrackProvider({ children }: { children: ReactNode }) {
  const elRef = useRef<HTMLAudioElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const breathRef = useRef<number | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const duckCount = useRef(0);
  const [started, setStarted] = useState(false);
  const [muted, setMuted] = useState(false);

  const fadeTo = useCallback((target: number, ms: number) => {
    const el = elRef.current;
    if (!el) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const from = el.volume;
    const t0 = performance.now();
    const step = (t: number) => {
      const k = Math.min(1, (t - t0) / ms);
      el.volume = Math.max(0, Math.min(1, from + (target - from) * k));
      if (k < 1) rafRef.current = requestAnimationFrame(step);
    };
    rafRef.current = requestAnimationFrame(step);
  }, []);

  // Ambient "breathing": drives a single CSS variable from the song's energy.
  const startBreathing = useCallback(() => {
    const el = elRef.current;
    if (!el || analyserRef.current) return;
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    type W = typeof window & { webkitAudioContext?: typeof AudioContext };
    const AC = window.AudioContext ?? (window as W).webkitAudioContext;
    if (!AC) return;

    let ctx: AudioContext;
    try {
      ctx = new AC();
      const source = ctx.createMediaElementSource(el);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.85;
      source.connect(analyser);
      analyser.connect(ctx.destination);
      analyserRef.current = analyser;
      void ctx.resume().catch(() => undefined);
    } catch {
      return;
    }

    const data = new Uint8Array(analyserRef.current.frequencyBinCount);
    let smooth = 0;
    const loop = () => {
      const a = analyserRef.current;
      const audio = elRef.current;
      if (a && audio) {
        let energy = 0;
        if (!audio.muted && !audio.paused) {
          a.getByteFrequencyData(data);
          let sum = 0;
          const n = Math.floor(data.length * 0.6);
          for (let i = 0; i < n; i++) sum += data[i]! * data[i]!;
          energy = Math.min(1, Math.sqrt(sum / n) / 128);
        }
        smooth += (energy - smooth) * (energy > smooth ? 0.12 : 0.045);
        document.documentElement.style.setProperty("--breath", smooth.toFixed(4));
      }
      breathRef.current = requestAnimationFrame(loop);
    };
    breathRef.current = requestAnimationFrame(loop);
  }, []);

  const start = useCallback(() => {
    const el = elRef.current;
    if (!el || started) return;
    el.volume = 0;
    void el.play().catch(() => undefined);
    setStarted(true);
    fadeTo(FULL, 3200);
    startBreathing();
  }, [fadeTo, started, startBreathing]);

  const toggleMute = useCallback(() => {
    const el = elRef.current;
    if (!el) return;
    setMuted((m) => {
      const next = !m;
      el.muted = next;
      return next;
    });
  }, []);

  const duck = useCallback(() => {
    duckCount.current += 1;
    fadeTo(DUCKED, 700);
  }, [fadeTo]);

  const unduck = useCallback(() => {
    duckCount.current = Math.max(0, duckCount.current - 1);
    if (duckCount.current === 0) fadeTo(FULL, 1400);
  }, [fadeTo]);

  useEffect(() => () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (breathRef.current) cancelAnimationFrame(breathRef.current);
  }, []);

  const value = useMemo(
    () => ({ started, muted, start, toggleMute, duck, unduck }),
    [started, muted, start, toggleMute, duck, unduck],
  );

  return (
    <Ctx.Provider value={value}>
      <audio ref={elRef} src={aeo.url} loop preload="auto" playsInline crossOrigin="anonymous" />
      {children}
    </Ctx.Provider>
  );
}

export function useSoundtrack() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useSoundtrack must be used inside SoundtrackProvider");
  return ctx;
}
