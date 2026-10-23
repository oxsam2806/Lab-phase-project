import { Minus, Plus } from "lucide-react";

interface Props {
  value: number;
  max: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

function QuantitySelector({ value, max, onChange, disabled }: Props) {
  const buttonClass = "p-2 text-stone-600 hover:text-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <div className="inline-flex items-center border border-stone-300 rounded-lg bg-white">
      <button
        type="button"
        onClick={() => onChange(value - 1)}
        disabled={disabled || value <= 1}
        aria-label="Decrease quantity"
        className={buttonClass}
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-medium" aria-live="polite">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        disabled={disabled || value >= max}
        aria-label="Increase quantity"
        className={buttonClass}
      >
        <Plus size={14} />
      </button>
    </div>
  );
}

export default QuantitySelector;