import { useEffect, useState } from "react";
import { Reveal } from "@/components/Reveal";

const REWIND = [
  "I want more moments like those.",
  "I miss us.",
  "I don't want a life where I get used to you not being in it.",
  "I was hurting quietly.",
  "The distance was getting to me.",
  "I was the one who ended us.",
];

export function GoBack() {
  const [phase, setPhase] = useState<"idle" | "rewind" | "reveal">("idle");
  const [i, setI] = useState(0);

  useEffect(() => {
    if (phase !== "rewind") return;
    if (i >= REWIND.length - 1) {
      const id = window.setTimeout(() => setPhase("reveal"), 1600);
      return () => window.clearTimeout(id);
    }
    const id = window.setTimeout(() => setI((n) => n + 1), 1150);
    return () => window.clearTimeout(id);
  }, [phase, i]);

  return (
    <div className="mx-auto max-w-[42ch] space-y-10">
      {phase === "idle" && (
        <>
          <Reveal as="p" className="display-lg">
            If I could go back...
          </Reveal>
          <Reveal delay={200}>
            <button
              type="button"
              onClick={() => {
                setI(0);
                setPhase("rewind");
              }}
              className="quiet-btn"
            >
              Go back
            </button>
          </Reveal>
        </>
      )}

      {phase === "rewind" && (
        <div className="rewind-stage min-h-[46svh] grid place-items-center text-center">
          <p key={i} className="rewind-line prose-line">
            {REWIND[i]}
          </p>
        </div>
      )}

      {phase === "reveal" && (
        <div className="space-y-8">
          <p className="soft-in display-lg">I wouldn&apos;t change you.</p>
          <p
            className="soft-in display-lg"
            style={{ animationDelay: "1400ms" }}
          >
            I would change my decision.
          </p>
        </div>
      )}
    </div>
  );
}
