import { phaseColor, type Phase } from "@/data/exercises";

interface Props {
  phase: Phase;
  label?: string;
}

export function PhaseDivider({ phase, label }: Props) {
  const color = phaseColor(phase);
  return (
    <div className="flex items-center gap-3 mt-8 mb-4">
      <span
        className="font-display text-xl tracking-wider whitespace-nowrap anim-fade-in"
        style={{ color }}
      >
        {label ?? phase.toUpperCase()}
      </span>
      <div
        className="flex-1 h-[2px] rounded-full anim-grow-x"
        style={{ backgroundColor: color, opacity: 0.7 }}
      />
    </div>
  );
}
