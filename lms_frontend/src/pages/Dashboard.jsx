import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function formatMemberSince(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return '—';
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, isAdmin, logout } = useAuth();

  if (loading) {
    return (
      <div className="dashboard-shell">
        <p className="status-msg">Loading your library…</p>
      </div>
    );
  }

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-shell">
      <section className="dashboard-welcome">
        <p className="dashboard-welcome__eyebrow">Welcome back</p>
        <h1 className="dashboard-welcome__name">{user.name}</h1>
        <p className="dashboard-welcome__role">
          Member since {formatMemberSince(user.createdAt)}
          {user.role && (
            <span
              className={`dashboard-welcome__role-badge${
                isAdmin ? ' dashboard-welcome__role-badge--admin' : ''
              }`}
            >
              {user.role}
            </span>
          )}
        </p>
      </section>

      <div className="dashboard-grid">
        <section className="dashboard-card">
          <h2 className="dashboard-card__heading">Your Profile</h2>
          <div className="dashboard-profile__row">
            <span className="dashboard-profile__label">Name</span>
            <span className="dashboard-profile__value">{user.name}</span>
          </div>
          <div className="dashboard-profile__row">
            <span className="dashboard-profile__label">Email</span>
            <span className="dashboard-profile__value dashboard-profile__value--mono">{user.email}</span>
          </div>
          <div className="dashboard-profile__row">
            <span className="dashboard-profile__label">Role</span>
            <span className="dashboard-profile__value">{user.role}</span>
          </div>
          <div className="dashboard-profile__row">
            <span className="dashboard-profile__label">Member Since</span>
            <span className="dashboard-profile__value">{formatMemberSince(user.createdAt)}</span>
          </div>
        </section>

        <section className="dashboard-actions" aria-label="Quick links">
          <Link to="/books" className="dashboard-action">
            <span className="dashboard-action__title">Browse the Catalog</span>
            <span className="dashboard-action__hint">Discover books by title, author, or publisher.</span>
          </Link>
          <Link to="/my-loans" className="dashboard-action">
            <span className="dashboard-action__title">Your Loans</span>
            <span className="dashboard-action__hint">See what's borrowed and what's due.</span>
          </Link>
          <Link to="/my-reservations" className="dashboard-action">
            <span className="dashboard-action__title">Reservations</span>
            <span className="dashboard-action__hint">Books waiting for you to pick up.</span>
          </Link>
          {isAdmin && (
            <Link to="/admin/loans" className="dashboard-action">
              <span className="dashboard-action__title">Admin: Loans</span>
              <span className="dashboard-action__hint">Process returns and oversee circulation.</span>
            </Link>
          )}
          {isAdmin && (
            <Link to="/analytics" className="dashboard-action">
              <span className="dashboard-action__title">Library Analytics</span>
              <span className="dashboard-action__hint">Aggregates across the whole collection.</span>
            </Link>
          )}
          <button type="button" onClick={handleLogout} className="dashboard-logout">
            Log Out
          </button>
        </section>
      </div>
    </div>
  );
}
