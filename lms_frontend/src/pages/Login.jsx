import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
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
      const res = await client.post('/api/members/login', form);
      const { token, member } = res.data;
      Cookies.set('lms_token', token, { expires: 7 });
      setUser(member);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.error || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-portal">
      <div className="auth-portal__bg" aria-hidden="true" />

      <div className="auth-portal__card">
        <p className="auth-portal__brand">Library Access</p>
        <h1 className="auth-portal__title">Welcome Back</h1>
        <p className="auth-portal__lede">
          Sign in to browse the catalog, manage loans, and track reservations.
        </p>

        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {error && <p className="auth-portal__error" role="alert">{error}</p>}

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
              placeholder="••••••••"
              autoComplete="current-password"
              required
              className="auth-form-field__input"
            />
          </div>

          <button type="submit" disabled={loading} className="auth-portal__submit">
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <p className="auth-portal__footer">
          New to the library?
          <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  );
}
