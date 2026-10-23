import type { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

function Input({ label, error, id, name, ...props }: InputProps) {
  const inputId = id || name;

  return (
    <div>
      <label htmlFor={inputId} className="block text-sm font-medium text-stone-700 mb-1">
        {label}
      </label>
      <input
        id={inputId}
        name={name}
        aria-invalid={!!error}
        className={`w-full rounded-lg border px-3 py-2 text-stone-800 focus:outline-none focus:ring-2 focus:ring-emerald-600 ${
          error ? "border-red-500" : "border-stone-300"
        }`}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}

export default Input;