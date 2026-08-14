import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import Pagination from '../components/Pagination';

function getInitials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((p) => p[0]?.toUpperCase() || '').join('') || '?';
}

export default function Authors() {
  const { isAdmin } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const fetchAuthors = (pageNum) => {
    setLoading(true);
    client
      .get('/api/catalog/authors', { params: { page: pageNum, size: 20 } })
      .then((res) => {
        setAuthors(res.data.content || res.data || []);
        setTotalPages(res.data.totalPages ?? 0);
      })
      .catch((err) => setError(err.response?.data?.message || 'Failed to load authors.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAuthors(page); }, [page]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreateError('');
    setCreating(true);
    try {
      await client.post('/api/catalog/authors', { name, biography });
      setName('');
      setBiography('');
      setPage(0);
      fetchAuthors(0);
    } catch (err) {
      setCreateError(err.response?.data?.message || 'Failed to create author.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <header className="page-header">
        <div>
          <p className="page-header__eyebrow">The Collection</p>
          <h1 className="page-header__title">Meet the Authors</h1>
          <p className="page-header__subtitle">The minds behind the works on our shelves.</p>
        </div>
      </header>

      {isAdmin && (
        <form onSubmit={handleCreate} className="inline-add-form" noValidate>
          <h2 className="inline-add-form__heading">Add Author</h2>
          {createError && <p className="error-msg" role="alert">{createError}</p>}
          <div className="inline-add-form__field">
            <label htmlFor="author-name" className="inline-add-form__label">Name</label>
            <input
              id="author-name"
              type="text"
              placeholder="e.g. Toni Morrison"
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
            <label htmlFor="author-bio" className="inline-add-form__label">Biography (optional)</label>
            <textarea
              id="author-bio"
              placeholder="A short biographical note…"
              value={biography}
              onChange={(e) => {
                setBiography(e.target.value);
                if (createError) setCreateError('');
              }}
              rows={3}
              className="inline-add-form__textarea"
            />
          </div>
          <button type="submit" disabled={creating} className="btn btn-primary inline-add-form__submit">
            {creating ? 'Adding…' : 'Add Author'}
          </button>
        </form>
      )}

      {loading && (
        <div className="state-block state-block--loading">
          <p className="state-block__hint">Loading authors…</p>
        </div>
      )}

      {error && <p className="error-msg" role="alert">{error}</p>}

      {!loading && !error && authors.length === 0 && (
        <div className="state-block">
          <h3 className="state-block__title">No authors yet</h3>
          <p className="state-block__hint">Once authors are added, they'll appear here with their works.</p>
        </div>
      )}

      {!loading && !error && authors.length > 0 && (
        <>
          <div className="entity-list">
            {authors.map((author) => (
              <article key={author.id} className="entity-card">
                <div className="entity-card__avatar" aria-hidden="true">
                  {getInitials(author.name)}
                </div>
                <div className="entity-card__body">
                  <h3 className="entity-card__name">{author.name}</h3>
                  {author.biography ? (
                    <p className="entity-card__field">{author.biography}</p>
                  ) : (
                    <p className="entity-card__field entity-card__field--muted">
                      No biography provided.
                    </p>
                  )}
                </div>
                <div className="entity-card__count">
                  Books
                  <span className="entity-card__count-number">
                    {author.bookCount ?? '—'}
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
