import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function Authors() {
  const { isAdmin } = useAuth();
  const [authors, setAuthors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [biography, setBiography] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchAuthors = () => {
    setLoading(true);
    client
      .get('/api/catalog/authors')
      .then((res) => setAuthors(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load authors.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAuthors(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await client.post('/api/catalog/authors', { name, biography });
      setName('');
      setBiography('');
      fetchAuthors();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create author.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page">
      <h2>Authors</h2>

      {isAdmin && (
        <form onSubmit={handleCreate} className="inline-form">
          <h3>Add Author</h3>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Biography (optional)"
            value={biography}
            onChange={(e) => setBiography(e.target.value)}
            rows={2}
          />
          <button type="submit" disabled={creating} className="btn btn-primary">
            {creating ? 'Adding...' : 'Add Author'}
          </button>
        </form>
      )}

      {loading && <p className="status-msg">Loading authors...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && authors.length === 0 && (
        <p className="status-msg">No authors found.</p>
      )}

      {!loading && !error && authors.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Biography</th>
            </tr>
          </thead>
          <tbody>
            {authors.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td className="text-muted">{a.biography || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}