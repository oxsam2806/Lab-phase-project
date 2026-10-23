import type { ReactNode } from "react";

interface Props {
  title: string;
  message?: string;
  action?: ReactNode;
}

function EmptyState({ title, message, action }: Props) {
  return (
    <div className="text-center py-16 px-4 bg-white rounded-xl border border-dashed border-stone-300">
      <h2 className="text-lg font-semibold text-stone-800 mb-2">{title}</h2>
      {message && <p className="text-stone-600 mb-4">{message}</p>}
      {action}
    </div>
  );
}

export default EmptyState;