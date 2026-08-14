import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function BooksList() {
  const { isAdmin } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const title = searchParams.get('title') || '';
  const available = searchParams.get('available');

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {};
    if (title) params.title = title;
    if (available === 'true') params.available = true;

    const endpoint = title || available === 'true'
      ? '/api/catalog/books/search'
      : '/api/catalog/books';

    client
      .get(endpoint, { params })
      .then((res) => setBooks(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load books'))
      .finally(() => setLoading(false));
  }, [title, available]);

  const updateTitle = (value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set('title', value);
    else next.delete('title');
    setSearchParams(next);
  };

  const toggleAvailable = () => {
    const next = new URLSearchParams(searchParams);
    if (available === 'true') next.delete('available');
    else next.set('available', 'true');
    setSearchParams(next);
  };

  return (
    <div className="page">
      <div className="page-header">
        <h2>Books</h2>
        {isAdmin && <Link to="/books/new" className="btn btn-primary">Add Book</Link>}
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search by title..."
          value={title}
          onChange={(e) => updateTitle(e.target.value)}
          className="search-input"
        />
        <label className="toggle-label">
          <input
            type="checkbox"
            checked={available === 'true'}
            onChange={toggleAvailable}
          />
          Available only
        </label>
      </div>

      {loading && <p className="status-msg">Loading books...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && books.length === 0 && (
        <p className="status-msg">No books found.</p>
      )}

      {!loading && !error && books.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Available</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id}>
                <td>{book.title}</td>
                <td>{book.authorName}</td>
                <td>
                  <span className={book.availableCopies > 0 ? 'badge badge-ok' : 'badge badge-empty'}>
                    {book.availableCopies}/{book.totalCopies}
                  </span>
                </td>
                <td>
                  <Link to={`/books/${book.id}`} className="link">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}