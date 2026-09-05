import { useEffect, useState } from "react";

const THOUGHTS = [
  { text: "I miss your voice.", after: 3200 },
  { text: "I miss our conversations.", after: 3200 },
  { text: "I miss the random things I'd tell you.", after: 3400 },
  { text: "I miss having you there.", after: 4600 },
  { text: "I miss us.", after: 0 },
];

export function ThingsIMiss() {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (!open) return;
    if (step >= THOUGHTS.length - 1) return;
    const delay = THOUGHTS[step]?.after ?? 3000;
    const id = window.setTimeout(() => setStep((s) => s + 1), delay);
    return () => window.clearTimeout(id);
  }, [open, step]);

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => {
          setStep(0);
          setOpen(true);
        }}
        className="group block text-left"
      >
        <span className="prose-line border-b border-dotted border-white/25 pb-1 transition-colors duration-500 group-hover:border-white/60">
          There are some things I haven&apos;t said yet.
        </span>
      </button>
    );
  }

  return (
    <div className="space-y-8">
      <ul className="space-y-7">
        {THOUGHTS.slice(0, step + 1).map((t, i) => (
          <li
            key={t.text}
            className={`reveal is-in ${i === THOUGHTS.length - 1 ? "display-lg" : "prose-line"}`}
            style={{ transitionDelay: "0ms" }}
          >
            {t.text}
          </li>
        ))}
      </ul>
      {step >= THOUGHTS.length - 1 && (
        <button type="button" onClick={() => setOpen(false)} className="quiet-btn">
          Close
        </button>
      )}
    </div>
  );
}
