export default function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const pages = [];
  const maxVisible = 5;
  let start = Math.max(0, page - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible);
  if (end - start < maxVisible) start = Math.max(0, end - maxVisible);

  for (let i = start; i < end; i++) pages.push(i);

  return (
    <div className="pagination">
      <button
        className="btn btn-sm btn-secondary"
        disabled={page === 0}
        onClick={() => onPageChange(0)}
        aria-label="First page"
      >
        &laquo;
      </button>
      <button
        className="btn btn-sm btn-secondary"
        disabled={page === 0}
        onClick={() => onPageChange(page - 1)}
        aria-label="Previous page"
      >
        &lsaquo;
      </button>
      {pages.map((p) => (
        <button
          key={p}
          className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => onPageChange(p)}
        >
          {p + 1}
        </button>
      ))}
      <button
        className="btn btn-sm btn-secondary"
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(page + 1)}
        aria-label="Next page"
      >
        &rsaquo;
      </button>
      <button
        className="btn btn-sm btn-secondary"
        disabled={page === totalPages - 1}
        onClick={() => onPageChange(totalPages - 1)}
        aria-label="Last page"
      >
        &raquo;
      </button>
    </div>
  );
}