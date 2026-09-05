/**
 * A single, very quiet atmospheric glow that expands and contracts with the
 * song. Driven by the --breath CSS variable set by the soundtrack provider.
 */
export function AmbientBreath() {
  return (
    <div aria-hidden className="breath-layer">
      <div className="breath-glow" />
    </div>
  );
}
