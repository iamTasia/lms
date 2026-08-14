import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Pagination from '../components/Pagination';

export default function AdminLoans() {
  const { isAdmin } = useAuth();
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState('all'); // 'all' | 'overdue'
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchLoans = (mode, pageNum) => {
    setLoading(true);
    setError(null);
    const endpoint = mode === 'overdue' ? '/api/loans/overdue' : '/api/loans/all';
    client
      .get(endpoint, { params: { page: pageNum, size: 20 } })
      .then((res) => {
        setLoans(res.data.content || res.data);
        setTotalPages(res.data.totalPages ?? 0);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load loans.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLoans(tab, page);
  }, [tab, page]);

  const switchTab = (newTab) => {
    setTab(newTab);
    setPage(0);
  };

  if (!isAdmin) {
    return (
      <div className="page">
        <p className="error-msg">Access denied. Admin privileges required.</p>
      </div>
    );
  }

  const formatDate = (iso) => new Date(iso).toLocaleDateString();

  return (
    <div className="page">
      <div className="page-header">
        <h2>All Loans</h2>
        <div className="tab-group">
          <button
            className={`btn btn-sm ${tab === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => switchTab('all')}
          >
            All Loans
          </button>
          <button
            className={`btn btn-sm ${tab === 'overdue' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => switchTab('overdue')}
          >
            Overdue Only
          </button>
        </div>
      </div>

      {loading && <p className="status-msg">Loading loans...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && loans.length === 0 && (
        <p className="status-msg">
          {tab === 'overdue' ? 'No overdue loans!' : 'No loans found.'}
        </p>
      )}

      {!loading && !error && loans.length > 0 && (
        <>
          <table className="data-table">
            <thead>
              <tr>
                <th>Member</th>
                <th>Book</th>
                <th>Borrowed</th>
                <th>Due</th>
                <th>Status</th>
                <th>Fine</th>
              </tr>
            </thead>
            <tbody>
              {loans.map((loan) => (
                <tr key={loan.id} className={loan.status === 'OVERDUE' ? 'row-overdue' : ''}>
                  <td>
                    {loan.memberName ? (
                      <>
                        {loan.memberName}
                        <br />
                        <span className="text-muted" style={{ fontSize: 12 }}>ID: {loan.memberId}</span>
                      </>
                    ) : (
                      <span className="text-muted">ID: {loan.memberId || '—'}</span>
                    )}
                  </td>
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
                    ) : (
                      <span className="text-muted">—</span>
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