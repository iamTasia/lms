import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Pagination from '../components/Pagination';

export default function MyReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cancellingId, setCancellingId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchReservations = (pageNum) => {
    setLoading(true);
    client
      .get('/api/reservations', { params: { page: pageNum, size: 20 } })
      .then((res) => {
        setReservations(res.data.content || res.data);
        setTotalPages(res.data.totalPages ?? 0);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load reservations.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchReservations(page); }, [page]);

  const handleCancel = async (reservationId) => {
    setCancellingId(reservationId);
    setError(null);
    try {
      await client.put(`/api/reservations/${reservationId}/cancel`);
      setReservations((prev) =>
        prev.map((r) =>
          r.id === reservationId ? { ...r, status: 'CANCELLED' } : r
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to cancel reservation.');
    } finally {
      setCancellingId(null);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  if (loading && reservations.length === 0) return <p className="status-msg">Loading your reservations...</p>;
  if (error && reservations.length === 0) return <p className="error-msg">{error}</p>;

  return (
    <div className="page">
      <h2>My Reservations</h2>

      {error && <p className="error-msg">{error}</p>}

      {!loading && reservations.length === 0 && (
        <p className="status-msg">
          No reservations.{' '}
          <Link to="/books" className="link">Browse books</Link> to reserve one when copies run out.
        </p>
      )}

      {reservations.length > 0 && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Reserved</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r) => (
                <tr key={r.id}>
                  <td>
                    <Link to={`/books/${r.bookId}`} className="link">
                      {r.bookTitle}
                    </Link>
                  </td>
                  <td>{formatDate(r.reservedAt)}</td>
                  <td>
                    <span className={`badge badge-${r.status.toLowerCase()}`}>
                      {r.status}
                    </span>
                  </td>
                  <td>
                    {r.status === 'PENDING' && (
                      <button
                        onClick={() => handleCancel(r.id)}
                        disabled={cancellingId === r.id}
                        className="btn btn-danger btn-sm"
                      >
                        {cancellingId === r.id ? 'Cancelling...' : 'Cancel'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}