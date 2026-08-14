import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Pagination from '../components/Pagination';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || '').join('') || '?';
}

export default function Publishers() {
  const { isAdmin } = useAuth();
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchPublishers = (pageNum) => {
    setLoading(true);
    client
      .get('/api/catalog/publishers', { params: { page: pageNum, size: 20 } })
      .then((res) => {
        setPublishers(res.data.content || res.data || []);
        setTotalPages(res.data.totalPages ?? 0);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load publishers.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPublishers(page); }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      await client.post('/api/catalog/publishers', { name, address });
      setName('');
      setAddress('');
      setPage(0);
      fetchPublishers(0);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create publisher.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">The Collection</p>
          <h1 className="page-header__title">Trusted Publishers</h1>
          <p className="page-header__subtitle">The houses that bring authors' work into the world.</p>
        </div>
      </header>

      {isAdmin && (
        <form onSubmit={handleCreate} className="inline-add-form" noValidate>
          <h2 className="inline-add-form__heading">Add Publisher</h2>
          {createError && <p className="error-msg" role="alert">{createError}</p>}
          <div className="inline-add-form__field">
            <label htmlFor="publisher-name" className="inline-add-form__label">Name</label>
            <input
              id="publisher-name"
              type="text"
              placeholder="e.g. Penguin Random House"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (createError) setCreateError('');
              }}
              required
              className="inline-add-form__input"
            />
          </div>
          <div className="inline-add-form__field">
            <label htmlFor="publisher-address" className="inline-add-form__label">Address (optional)</label>
            <input
              id="publisher-address"
              type="text"
              placeholder="City, country"
              value={address}
              onChange={(e) => {
                setAddress(e.target.value);
                if (createError) setCreateError('');
              }}
              className="inline-add-form__input"
            />
          </div>
          <button type="submit" disabled={creating} className="btn btn-primary inline-add-form__submit">
            {creating ? 'Adding…' : 'Add Publisher'}
          </button>
        </form>
      )}

      {loading && (
        <div className="state-block state-block--loading">
          <p className="state-block__hint">Loading publishers…</p>
        </div>
      )}

      {error && <p className="error-msg" role="alert">{error}</p>}

      {!loading && !error && publishers.length === 0 && (
        <div className="state-block">
          <h3 className="state-block__title">No publishers yet</h3>
          <p className="state-block__hint">Once publishers are added, they'll appear here with their catalog.</p>
        </div>
      )}

      {!loading && !error && publishers.length > 0 && (
        <>
          <div className="entity-list">
            {publishers.map((publisher) => (
              <article key={publisher.id} className="entity-card">
                <div className="entity-card__avatar" aria-hidden="true">
                  {getInitials(publisher.name)}
                </div>
                <div className="entity-card__body">
                  <h3 className="entity-card__name">{publisher.name}</h3>
                  {publisher.address ? (
                    <p className="entity-card__field">{publisher.address}</p>
                  ) : (
                    <p className="entity-card__field entity-card__field--muted">
                      No address provided.
                    </p>
                  )}
                </div>
                <div className="entity-card__count">
                  Books
                  <span className="entity-card__count-number">
                    {publisher.bookCount ?? '—'}
                  </span>
                </div>
              </article>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
}
