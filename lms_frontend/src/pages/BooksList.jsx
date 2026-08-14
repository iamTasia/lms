import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Pagination from '../components/Pagination';
import BookCover from '../components/BookCover';

export default function BooksList() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const title = searchParams.get('title') || '';
  const available = searchParams.get('available');

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = { page, size: 20 };
    if (title) params.title = title;
    if (available === 'true') params.available = true;

    const endpoint = title || available === 'true'
      ? '/api/catalog/books/search'
      : '/api/catalog/books';

    client
      .get(endpoint, { params })
      .then((res) => {
        setBooks(res.data.content || res.data || []);
        setTotalPages(res.data.totalPages ?? 0);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load books.'))
      .finally(() => setLoading(false));
  }, [title, available, page]);

  const updateTitle = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('title', value);
    else next.delete('title');
    setSearchParams(next);
    setPage(0);
  };

  const toggleAvailable = () => {
    const next = new URLSearchParams(searchParams);
    if (available === 'true') next.delete('available');
    else next.set('available', 'true');
    setSearchParams(next);
    setPage(0);
  };

  const totalCount = books.length;

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">The Collection</p>
          <h1 className="page-header__title">Browse the Catalog</h1>
          <p className="page-header__subtitle">Search the library's holdings and find what to read next.</p>
        </div>
        {isAdmin && (
          <div className="page-header__actions">
            <Link to="/books/new" className="btn btn-primary">Add Book</Link>
          </div>
        )}
      </header>

      <div className="catalog-toolbar" role="search">
        <input
          type="text"
          placeholder="Search by title…"
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          className="catalog-toolbar__search"
          aria-label="Search books by title"
        />
        <label className="catalog-toolbar__toggle">
          <input
            type="checkbox"
            checked={available === 'true'}
            onChange={toggleAvailable}
          />
          Available only
        </label>
      </div>

      {loading && (
        <div className="state-block state-block--loading">
          <p className="state-block__hint">Loading the shelves…</p>
        </div>
      )}

      {error && <p className="error-msg" role="alert">{error}</p>}

      {!loading && !error && totalCount === 0 && (
        <div className="state-block">
          <h3 className="state-block__title">No books found</h3>
          <p className="state-block__hint">
            {title
              ? `Nothing in the catalog matches "${title}". Try a different search.`
              : 'The catalog is empty right now. New arrivals will appear here.'}
          </p>
        </div>
      )}

      {!loading && !error && totalCount > 0 && (
        <>
          <div className="catalog-grid">
            {books.map((book) => {
              const inStock = book.availableCopies > 0;
              return (
                <Link
                  to={`/books/${book.id}`}
                  key={book.id}
                  className="book-card"
                >
                  <BookCover title={book.title} author={book.authorName} />
                  <div className="book-card__body">
                    <h3 className="book-card__title">{book.title}</h3>
                    <p className="book-card__author">{book.authorName}</p>
                    <div className="book-card__meta">
                      <span
                        className={`book-card__availability ${
                          inStock ? 'book-card__availability--ok' : 'book-card__availability--out'
                        }`}
                      >
                        <span className="book-card__availability-dot" />
                        {inStock
                          ? `${book.availableCopies} of ${book.totalCopies} available`
                          : 'All copies on loan'}
                      </span>
                      <span className="book-card__view">View →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
