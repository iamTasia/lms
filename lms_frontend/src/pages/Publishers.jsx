import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function Publishers() {
  const { isAdmin } = useAuth();
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [creating, setCreating] = useState(false);

  const fetchPublishers = () => {
    setLoading(true);
    client
      .get('/api/catalog/publishers')
      .then((res) => setPublishers(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load publishers.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPublishers(); }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    try {
      await client.post('/api/catalog/publishers', { name, address });
      setName('');
      setAddress('');
      fetchPublishers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create publisher.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="page">
      <h2>Publishers</h2>

      {isAdmin && (
        <form onSubmit={handleCreate} className="inline-form">
          <h3>Add Publisher</h3>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Address (optional)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button type="submit" disabled={creating} className="btn btn-primary">
            {creating ? 'Adding...' : 'Add Publisher'}
          </button>
        </form>
      )}

      {loading && <p className="status-msg">Loading publishers...</p>}
      {error && <p className="error-msg">{error}</p>}

      {!loading && !error && publishers.length === 0 && (
        <p className="status-msg">No publishers found.</p>
      )}

      {!loading && !error && publishers.length > 0 && (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Address</th>
            </tr>
          </thead>
          <tbody>
            {publishers.map((p) => (
              <tr key={p.id}>
                <td>{p.name}</td>
                <td className="text-muted">{p.address || '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}