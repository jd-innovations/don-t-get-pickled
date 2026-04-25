import { useEffect, useRef, useState } from "react";
import { Check, ChevronDown, Lock } from "lucide-react";
import { phaseColor, type Exercise } from "@/data/exercises";
import { ImageLightbox } from "@/components/ImageLightbox";

interface Props {
  exercise: Exercise;
  completed?: boolean;
  onToggleComplete?: (id: string) => void;
  displayDose?: string;
  priority?: boolean;
  focus?: boolean;
  locked?: boolean;
  onLockedClick?: () => void;
}

export function ExerciseCard({
  exercise,
  completed,
  onToggleComplete,
  displayDose,
  priority,
  focus,
  locked,
  onLockedClick,
}: Props) {
  const [open, setOpen] = useState(false);
  const [videoError, setVideoError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const color = phaseColor(exercise.phase);

  useEffect(() => {
    if (open && videoRef.current) {
      const v = videoRef.current;
      v.muted = true;
      v.defaultMuted = true;
      const p = v.play();
      if (p && typeof p.catch === "function") {
        p.catch(() => {
          // Autoplay blocked — native controls fallback will let user tap play.
        });
      }
    } else if (!open && videoRef.current) {
      videoRef.current.pause();
    }
  }, [open]);
  const interactive = typeof onToggleComplete === "function";
  const dose = displayDose ?? exercise.dose;

  return (
    <div
      className="rounded-xl border bg-[#111111] transition-colors duration-300 overflow-hidden"
      style={{
        borderColor: open ? "#C8F135" : "#1e1e1e",
      }}
    >
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        {interactive ? (
          <span
            role="checkbox"
            aria-checked={!!completed}
            aria-label={completed ? "Mark incomplete" : "Mark complete"}
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              onToggleComplete!(exercise.id);
            }}
            onKeyDown={(e) => {
              if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                onToggleComplete!(exercise.id);
              }
            }}
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center font-display text-base transition-colors cursor-pointer"
            style={{
              backgroundColor: completed ? "#C8F135" : "transparent",
              border: `2px solid #C8F135`,
              color: completed ? "#000" : "#C8F135",
            }}
          >
            {completed ? <Check className="w-4 h-4" strokeWidth={3} /> : exercise.number}
          </span>
        ) : (
          <div
            className="flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center font-display text-lg"
            style={{ backgroundColor: "#1a1a1a", color: "#C8F135" }}
          >
            {exercise.number}
          </div>
        )}
        <div className={`flex-1 min-w-0 transition-opacity ${completed ? "opacity-50" : ""}`}>
          <h3
            className={`font-display text-lg leading-tight tracking-wide text-white ${completed ? "line-through" : ""}`}
          >
            {exercise.name}
          </h3>
          <p className="text-xs text-neutral-400 mt-0.5 truncate">{exercise.muscles}</p>
        </div>
        <div className="flex flex-col items-end gap-1 flex-shrink-0">
          {priority && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider"
              style={{ backgroundColor: "#ef4444", color: "white" }}
            >
              PRIORITY
            </span>
          )}
          {focus && (
            <span
              className="text-[9px] px-1.5 py-0.5 rounded font-bold tracking-wider"
              style={{ backgroundColor: "#C8F135", color: "black" }}
            >
              FOCUS
            </span>
          )}
          <span className="text-[10px] font-semibold text-neutral-300">{dose}</span>
          <span
            className="text-[10px] px-1.5 py-0.5 rounded font-medium"
            style={{ backgroundColor: `${color}22`, color }}
          >
            {exercise.phase}
          </span>
        </div>
        <ChevronDown
          className="w-5 h-5 text-neutral-500 transition-transform duration-300 flex-shrink-0 mt-1"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      <div
        className="grid transition-all duration-300 ease-out"
        style={{ gridTemplateRows: open ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-4 space-y-4">
            {exercise.video && !videoError ? (
              <video
                ref={videoRef}
                src={exercise.video}
                autoPlay
                loop
                muted
                playsInline
                controls
                preload="metadata"
                onError={() => setVideoError(true)}
                className="w-full h-auto rounded-lg object-contain bg-neutral-900"
              />
            ) : exercise.video && videoError ? (
              <div className="aspect-video w-full rounded-lg bg-neutral-800/60 flex items-center justify-center text-neutral-500 text-xs">
                Video unavailable
              </div>
            ) : exercise.image ? (
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                aria-label="View full image"
                className="block w-full cursor-zoom-in"
              >
                <img
                  src={exercise.image}
                  alt={exercise.name}
                  className="w-full h-auto rounded-lg object-contain bg-neutral-900"
                />
              </button>
            ) : (
              <div className="aspect-video w-full rounded-lg bg-neutral-800/60 flex items-center justify-center text-neutral-600 text-xs">
                Illustration coming soon
              </div>
            )}

            <p className="text-sm text-neutral-300 italic">{exercise.shortBenefit}</p>

            <ol className="space-y-2">
              {exercise.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-sm text-neutral-200 opacity-0"
                  style={{
                    animation: open
                      ? `fadeSlideIn 0.4s ease-out ${i * 0.08}s forwards`
                      : "none",
                  }}
                >
                  <span className="font-display text-base text-[#C8F135] flex-shrink-0 w-5">
                    {i + 1}.
                  </span>
                  <span className="leading-snug">{step}</span>
                </li>
              ))}
            </ol>

            <div
              className="border-l-2 pl-3 py-1 text-sm text-neutral-300"
              style={{ borderColor: "#C8F135" }}
            >
              <span className="font-semibold text-[#C8F135]">Tip: </span>
              {exercise.tip}
            </div>

            {interactive && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleComplete!(exercise.id);
                }}
                className="w-full rounded-lg py-3 font-display text-base tracking-wider transition-colors"
                style={{
                  backgroundColor: completed ? "transparent" : "#C8F135",
                  border: `2px solid #C8F135`,
                  color: completed ? "#C8F135" : "#000",
                }}
              >
                {completed ? "✓ COMPLETED — TAP TO UNDO" : "MARK DONE"}
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {exercise.image && (
        <ImageLightbox
          src={exercise.image}
          alt={exercise.name}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
