export default function Pagination({ page, pages, onPage }) {
  if (pages <= 1) return null;

  const items = [];
  for (let i = 1; i <= pages; i++) {
    items.push(i);
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <button
        className="px-3 py-1.5 rounded-lg bg-dark-card border border-white/10 text-sm disabled:opacity-30 hover:border-brand/50 transition-colors"
        disabled={page <= 1}
        onClick={() => onPage(page - 1)}
      >
        ← Prev
      </button>

      <div className="flex gap-1">
        {items.map(i => (
          <button
            key={i}
            className={`w-9 h-9 rounded-lg text-sm font-medium transition-colors ${
              i === page
                ? 'bg-brand text-black'
                : 'bg-dark-card border border-white/10 hover:border-brand/50'
            }`}
            onClick={() => onPage(i)}
          >
            {i}
          </button>
        ))}
      </div>

      <button
        className="px-3 py-1.5 rounded-lg bg-dark-card border border-white/10 text-sm disabled:opacity-30 hover:border-brand/50 transition-colors"
        disabled={page >= pages}
        onClick={() => onPage(page + 1)}
      >
        Next →
      </button>
    </div>
  );
}
