import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await client.post('/api/members/register', { ...form, role: 'MEMBER' });
      const { token, member } = res.data;
      Cookies.set('lms_token', token, { expires: 7 });
      setUser(member);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-portal">
      <div className="auth-portal__bg" aria-hidden="true" />

      <div className="auth-portal__card">
        <p className="auth-portal__brand">Join the Library</p>
        <h1 className="auth-portal__title">Create Your Account</h1>
        <p className="auth-portal__lede">
          Borrow, reserve, and curate your personal reading list.
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error && <p className="auth-portal__error" role="alert">{error}</p>}

          <div className="auth-form-field">
            <label htmlFor="name" className="auth-form-field__label">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              placeholder="Alex Carter"
              autoComplete="name"
              required
              className="auth-form-field__input"
            />
          </div>

          <div className="auth-form-field">
            <label htmlFor="email" className="auth-form-field__label">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@university.edu"
              autoComplete="email"
              required
              className="auth-form-field__input"
            />
          </div>

          <div className="auth-form-field">
            <label htmlFor="password" className="auth-form-field__label">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              autoComplete="new-password"
              minLength={6}
              required
              className="auth-form-field__input"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-portal__submit">
            {loading ? 'Creating account…' : 'Create Account'}
          </button>
        </form>

        <p className="auth-portal__footer">
          Already a member?
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </section>
  );
}
