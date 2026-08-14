import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import BookCover from '../components/BookCover';

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
  const [confirmDelete, setConfirmDelete] = useState(false);

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

  useEffect(() => { fetchBook(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [id]);

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
      setActionMsg("Book reserved! You'll be notified when a copy becomes available.");
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to reserve book.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmDelete) { setConfirmDelete(true); return; }
    setConfirmDelete(false);
    try {
      await client.delete(`/api/catalog/books/${id}`);
      navigate('/books');
    } catch (err) {
      setActionError(err.response?.data?.message || 'Failed to delete book.');
    }
  };

  if (loading) {
    return (
      <div>
        <Link to="/books" className="book-detail__back">← Back to Catalog</Link>
        <p className="status-msg">Loading this volume…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Link to="/books" className="book-detail__back">← Back to Catalog</Link>
        <p className="error-msg" role="alert">{error}</p>
      </div>
    );
  }

  if (!book) return null;

  const inStock = book.availableCopies > 0;

  return (
    <div>
      <Link to="/books" className="book-detail__back">← Back to Catalog</Link>

      <div className="book-detail">
        <div className="book-detail__cover-wrap">
          <BookCover
            title={book.title}
            author={book.authorName}
            detail
          />
        </div>

        <div className="book-detail__meta">
          <p className="book-detail__eyebrow">
            {inStock ? 'Available now' : 'Currently on loan'}
          </p>
          <h1 className="book-detail__title">{book.title}</h1>
          <p className="book-detail__author">by {book.authorName}</p>

          <div className="book-detail__fields">
            <div className="detail-field">
              <span className="detail-field__label">ISBN</span>
              <span className="detail-field__value detail-field__value--mono">
                {book.isbn || '—'}
              </span>
            </div>
            <div className="detail-field">
              <span className="detail-field__label">Publisher</span>
              <span className="detail-field__value">{book.publisherName}</span>
            </div>
            <div className="detail-field">
              <span className="detail-field__label">Total Copies</span>
              <span className="detail-field__value">{book.totalCopies}</span>
            </div>
            <div className="detail-field">
              <span className="detail-field__label">Available Copies</span>
              <span className="detail-field__value detail-field__availability">
                <span
                  className="detail-field__availability-dot"
                  style={{
                    background: inStock ? 'var(--success)' : 'var(--danger)',
                  }}
                />
                {book.availableCopies}
              </span>
            </div>
          </div>

          <div className="book-detail__cta">
            {actionMsg && <p className="success-msg" role="status">{actionMsg}</p>}
            {actionError && <p className="error-msg" role="alert">{actionError}</p>}

            {inStock ? (
              <>
                <p className="book-detail__cta-text">
                  <strong>{book.availableCopies}</strong> of {book.totalCopies} copies available to borrow now.
                </p>
                {user ? (
                  <button
                    onClick={handleBorrow}
                    disabled={actionLoading}
                    className="book-detail__cta-button"
                  >
                    {actionLoading ? 'Borrowing…' : 'Borrow This Book'}
                  </button>
                ) : (
                  <Link to="/login" className="book-detail__cta-button">
                    Log in to Borrow
                  </Link>
                )}
              </>
            ) : (
              <>
                <p className="book-detail__cta-text">
                  All copies are currently on loan. Reserve this title and we'll notify you when one becomes available.
                </p>
                {user ? (
                  <button
                    onClick={handleReserve}
                    disabled={actionLoading}
                    className="book-detail__cta-button book-detail__cta-button--secondary"
                  >
                    {actionLoading ? 'Reserving…' : 'Reserve This Book'}
                  </button>
                ) : (
                  <Link to="/login" className="book-detail__cta-button book-detail__cta-button--secondary">
                    Log in to Reserve
                  </Link>
                )}
              </>
            )}
          </div>

          {isAdmin && (
            <div className="book-detail__admin">
              <Link to={`/books/${id}/edit`} className="btn btn-secondary">
                Edit Details
              </Link>
              {confirmDelete ? (
                <>
                  <span style={{ fontSize: 14, color: 'var(--text)', alignSelf: 'center' }}>
                    Delete permanently?
                  </span>
                  <button onClick={handleDelete} className="btn btn-danger btn-sm">
                    Confirm Delete
                  </button>
                  <button onClick={() => setConfirmDelete(false)} className="btn btn-secondary btn-sm">
                    Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleDelete} className="btn btn-danger">
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
