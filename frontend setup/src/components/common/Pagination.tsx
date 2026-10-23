interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  const buttonClass =
    "px-4 py-2 rounded-lg border border-stone-300 text-sm text-stone-700 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed";

  return (
    <nav className="flex items-center justify-center gap-4 mt-8" aria-label="Pagination">
      <button className={buttonClass} disabled={page <= 1} onClick={() => onChange(page - 1)}>
        Previous
      </button>
      <span className="text-sm text-stone-600">
        Page {page} of {totalPages}
      </span>
      <button className={buttonClass} disabled={page >= totalPages} onClick={() => onChange(page + 1)}>
        Next
      </button>
    </nav>
  );
}

export default Pagination;