import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function BookDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin, user } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionMsg, setActionMsg] = useState(null);
  const [actionError, setActionError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const fetchBook = () => {
    setLoading(true);
    client
      .get(`/api/catalog/books/${id}`)
      .then((res) => setBook(res.data))
      .catch((err) => {
        if (err.response?.status === 404) setError('Book not found.');
        else setError(err.response?.data?.message || 'Failed to load book.');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchBook(); }, [id]);

  const handleBorrow = async () => {
    if (!user) { navigate('/login'); return; }
    setActionMsg(null);
    setActionError(null);
    setActionLoading(true);
    try {
      await client.post('/api/loans', { bookId: book.id });
      setActionMsg('Book borrowed successfully!');
      fetchBook();
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to borrow book.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReserve = async () => {
    if (!user) { navigate('/login'); return; }
    setActionMsg(null);
    setActionError(null);
    setActionLoading(true);
    try {
      await client.post('/api/reservations', { bookId: book.id });
      setActionMsg('Book reserved! You\'ll be notified when a copy becomes available.');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to reserve book.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Delete this book permanently?')) return;
    try {
      await client.delete(`/api/catalog/books/${id}`);
      navigate('/books');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  if (loading) return <p className="status-msg">Loading book details...</p>;
  if (error) return <p className="error-msg">{error}</p>;
  if (!book) return <p className="status-msg">Book not found.</p>;

  return (
    <div className="page">
      <Link to="/books" className="link back-link">&larr; Back to Books</Link>

      <div className="detail-card">
        <h2>{book.title}</h2>

        <div className="detail-grid">
          <div className="detail-field">
            <span className="detail-label">ISBN</span>
            <span className="detail-value">{book.isbn || '—'}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Author</span>
            <span className="detail-value">{book.authorName}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Publisher</span>
            <span className="detail-value">{book.publisherName}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Total Copies</span>
            <span className="detail-value">{book.totalCopies}</span>
          </div>
          <div className="detail-field">
            <span className="detail-label">Available Copies</span>
            <span className="detail-value">
              <span className={book.availableCopies > 0 ? 'badge badge-ok' : 'badge badge-empty'}>
                {book.availableCopies}
              </span>
            </span>
          </div>
        </div>

        {/* Borrow / Reserve actions */}
        <div className="borrow-placeholder">
          {actionMsg && <p className="success-msg">{actionMsg}</p>}
          {actionError && <p className="error-msg">{actionError}</p>}

          {book.availableCopies > 0 ? (
            <>
              <p className="borrow-placeholder-text">This book is available to borrow.</p>
              {user ? (
                <button
                  onClick={handleBorrow}
                  disabled={actionLoading}
                  className="btn btn-primary"
                >
                  {actionLoading ? 'Borrowing...' : 'Borrow This Book'}
                </button>
              ) : (
                <Link to="/login" className="btn btn-primary">
                  Log in to Borrow
                </Link>
              )}
            </>
          ) : (
            <>
              <p className="borrow-placeholder-text">
                All copies are currently borrowed.
              </p>
              {user ? (
                <button
                  onClick={handleReserve}
                  disabled={actionLoading}
                  className="btn btn-secondary"
                >
                  {actionLoading ? 'Reserving...' : 'Reserve This Book'}
                </button>
              ) : (
                <Link to="/login" className="btn btn-secondary">
                  Log in to Reserve
                </Link>
              )}
            </>
          )}
        </div>

        {isAdmin && (
          <div className="admin-actions">
            <Link to={`/books/${id}/edit`} className="btn btn-secondary">
              Edit
            </Link>
            <button onClick={handleDelete} className="btn btn-danger">
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}