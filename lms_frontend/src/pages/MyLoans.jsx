import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import client from '../api/client';
import Pagination from '../components/Pagination';

export default function MyLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [returningId, setReturningId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLoans = (pageNum) => {
    setLoading(true);
    client
      .get('/api/loans', { params: { page: pageNum, size: 20 } })
      .then((res) => {
        setLoans(res.data.content || res.data);
        setTotalPages(res.data.totalPages ?? 0);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load loans.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchLoans(page); }, [page]);

  const handleReturn = async (loanId) => {
    setReturningId(loanId);
    setError(null);
    try {
      const res = await client.put(`/api/loans/${loanId}/return`);
      setLoans((prev) =>
        prev.map((l) => (l.id === loanId ? res.data : l))
      );
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to return book.');
    } finally {
      setReturningId(null);
    }
  };

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  if (loading && loans.length === 0) return <p className="status-msg">Loading your loans...</p>;
  if (error && loans.length === 0) return <p className="error-msg">{error}</p>;

  return (
    <div className="page">
      <h2>My Loans</h2>

      {error && <p className="error-msg">{error}</p>}

      {!loading && loans.length === 0 && (
        <p className="status-msg">
          No loans yet.{' '}
          <Link to="/books" className="link">Browse books</Link> to borrow one.
        </p>
      )}

      {loans.length > 0 && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Book</th>
                <th>Borrowed</th>
                <th>Due</th>
                <th>Status</th>
                <th>Fine</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className={loan.status === 'OVERDUE' ? 'row-overdue' : ''}>
                  <td>
                    <Link to={`/books/${loan.bookId}`} className="link">
                      {loan.bookTitle}
                    </Link>
                  </td>
                  <td>{formatDate(loan.borrowedAt)}</td>
                  <td>{formatDate(loan.dueAt)}</td>
                  <td>
                    <span className={`badge badge-${loan.status.toLowerCase()}`}>
                      {loan.status}
                    </span>
                  </td>
                  <td>
                    {loan.fineAmount != null ? (
                      <span className="fine-amount">
                        ${parseFloat(loan.fineAmount).toFixed(2)}
                      </span>
                    ) : loan.status === 'OVERDUE' ? (
                      <span className="fine-pending">Calculating...</span>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>
                  <td>
                    {(loan.status === 'ACTIVE' || loan.status === 'OVERDUE') && (
                      <button
                        onClick={() => handleReturn(loan.id)}
                        disabled={returningId === loan.id}
                        className="btn btn-secondary btn-sm"
                      >
                        {returningId === loan.id ? 'Returning...' : 'Return'}
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