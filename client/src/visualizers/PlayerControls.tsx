interface Props {
  playing: boolean;
  speed: number;
  onPlay: () => void;
  onPrev: () => void;
  onNext: () => void;
  onSpeed: (n: number) => void;
  extra?: React.ReactNode;
}

const btn = "rounded-md px-3 py-1.5 text-sm transition";

export default function PlayerControls({
  playing,
  speed,
  onPlay,
  onPrev,
  onNext,
  onSpeed,
  extra,
}: Props) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        onClick={onPlay}
        className={`${btn} bg-brand-600 font-medium hover:bg-brand-500`}
      >
        {playing ? "Pause" : "Play"}
      </button>
      <button onClick={onPrev} className={`${btn} bg-slate-700 hover:bg-slate-600`}>
        Prev
      </button>
      <button onClick={onNext} className={`${btn} bg-slate-700 hover:bg-slate-600`}>
        Next
      </button>
      <label className="ml-2 flex items-center gap-2 text-xs text-slate-300">
        Speed
        <input
          type="range"
          min={0.5}
          max={5}
          step={0.5}
          value={speed}
          onChange={(e) => onSpeed(Number(e.target.value))}
        />
      </label>
      {extra}
    </div>
  );
}

export function StepBar({ idx, total }: { idx: number; total: number }) {
  return (
    <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full bg-brand-500 transition-all"
        style={{ width: `${total > 1 ? (idx / (total - 1)) * 100 : 0}%` }}
      />
    </div>
  );
}
