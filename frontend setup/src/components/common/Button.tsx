import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

function Button({ loading, children, disabled, className = "", ...props }: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`w-full bg-emerald-700 text-white font-medium py-2.5 rounded-lg transition-all duration-200 hover:bg-emerald-800 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ${className}`}
      {...props}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export default Button;