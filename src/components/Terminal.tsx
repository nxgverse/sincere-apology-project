import { useEffect, useRef, useState } from "react";

const LINES = [
  "josiah@localhost:~$ system_check",
  "Running diagnostics...",
  "heart: still attached",
  "brain: questionable",
  "decision_making: failed",
  "distance: still exists",
  "regret: 100%",
  "love: still running",
  "status: hoping",
  "",
  "Error 404",
  "Common sense not found when breakup decision was made.",
  "Would you like to reinstall?",
];

export function Terminal() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(0);
  const [phase, setPhase] = useState<"idle" | "installing" | "done">("idle");
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          io.disconnect();
          let i = 0;
          const tick = () => {
            i += 1;
            setVisible(i);
            if (i < LINES.length) window.setTimeout(tick, i === 2 ? 700 : 320);
          };
          window.setTimeout(tick, 300);
        }
      },
      { threshold: 0.3 },
    );
    io.observe(node);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (phase !== "installing") return;
    const id = window.setInterval(() => {
      setPct((p) => {
        if (p >= 100) {
          window.clearInterval(id);
          setPhase("done");
          return 100;
        }
        return Math.min(100, p + Math.random() * 9 + 2);
      });
    }, 130);
    return () => window.clearInterval(id);
  }, [phase]);

  return (
    <div
      ref={ref}
      className="mx-auto w-full max-w-2xl overflow-hidden rounded-[22px] border border-[color:var(--hairline)] bg-black/60 shadow-[var(--shadow-cinema)] backdrop-blur-xl"
    >
      <div className="flex items-center gap-2 border-b border-[color:var(--hairline)] px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-white/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/15" />
        <span className="h-2.5 w-2.5 rounded-full bg-white/10" />
        <span className="ml-2 font-mono text-[11px] tracking-wide text-[color:var(--ink-dim)]">
          system_check
        </span>
      </div>

      <div className="space-y-1.5 p-5 font-mono text-[12.5px] leading-relaxed text-[color:var(--ink-soft)] sm:p-6 sm:text-[13.5px]">
        {LINES.slice(0, visible).map((l, i) => (
          <p key={i} className="whitespace-pre-wrap break-words">
            {l || "\u00A0"}
          </p>
        ))}

        {visible >= LINES.length && phase === "idle" && (
          <button type="button" onClick={() => setPhase("installing")} className="term-btn mt-4">
            YES
          </button>
        )}

        {phase !== "idle" && (
          <div className="mt-5 space-y-3">
            <p>{phase === "done" ? "Update complete." : "Installing..."}</p>
            <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-[color:var(--ink)] transition-[width] duration-200 ease-out"
                style={{ width: `${pct}%` }}
              />
            </div>
            {phase === "done" && (
              <p className="text-[color:var(--ink)]">
                Don&apos;t run away from something worth fighting for.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
