import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function BookForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const isEdit = Boolean(id);

  const [form, setForm] = useState({
    title: '',
    isbn: '',
    authorId: '',
    publisherId: '',
    totalCopies: 1,
  });
  const [authors, setAuthors] = useState([]);
  const [publishers, setPublishers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  // Not admin → no render at all (not just hide the form)
  if (!isAdmin) {
    return (
      <div className="page">
        <p className="error-msg">You don't have permission to access this page.</p>
        <Link to="/books" className="link">&larr; Back to Books</Link>
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [authorsRes, publishersRes] = await Promise.all([
          client.get('/api/catalog/authors'),
          client.get('/api/catalog/publishers'),
        ]);
        setAuthors(authorsRes.data);
        setPublishers(publishersRes.data);

        if (isEdit) {
          const bookRes = await client.get(`/api/catalog/books/${id}`);
          const b = bookRes.data;
          setForm({
            title: b.title,
            isbn: b.isbn || '',
            authorId: b.authorId.toString(),
            publisherId: b.publisherId.toString(),
            totalCopies: b.totalCopies,
          });
        }
      } catch (err) {
        setError('Failed to load form data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSaving(true);

    try {
      const payload = {
        ...form,
        authorId: parseInt(form.authorId),
        publisherId: parseInt(form.publisherId),
        totalCopies: parseInt(form.totalCopies),
      };

      if (isEdit) {
        await client.put(`/api/catalog/books/${id}`, payload);
      } else {
        const res = await client.post('/api/catalog/books', payload);
        navigate(`/books/${res.data.id}`);
        return;
      }
      navigate(`/books/${id}`);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Failed to save book.'
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="status-msg">Loading form...</p>;

  return (
    <div className="page">
      <h2>{isEdit ? 'Edit Book' : 'Add Book'}</h2>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <p className="error-msg">{error}</p>}

        <label htmlFor="title">Title</label>
        <input id="title" name="title" type="text" value={form.title} onChange={handleChange} required />

        <label htmlFor="isbn">ISBN</label>
        <input id="isbn" name="isbn" type="text" value={form.isbn} onChange={handleChange} />

        <label htmlFor="authorId">Author</label>
        <select id="authorId" name="authorId" value={form.authorId} onChange={handleChange} required>
          <option value="">-- Select Author --</option>
          {authors.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>

        <label htmlFor="publisherId">Publisher</label>
        <select id="publisherId" name="publisherId" value={form.publisherId} onChange={handleChange} required>
          <option value="">-- Select Publisher --</option>
          {publishers.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        <label htmlFor="totalCopies">Total Copies</label>
        <input id="totalCopies" name="totalCopies" type="number" min="1" value={form.totalCopies} onChange={handleChange} required />

        <div className="form-actions">
          <button type="submit" disabled={saving} className="btn btn-primary">
            {saving ? 'Saving...' : isEdit ? 'Update Book' : 'Create Book'}
          </button>
          <Link to="/books" className="btn btn-secondary">Cancel</Link>
        </div>
      </form>
    </div>
  );
}