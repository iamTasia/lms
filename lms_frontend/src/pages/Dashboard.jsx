import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  if (loading) return <p className="status-msg">Loading profile...</p>;
  if (!user) {
    navigate('/login');
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard">
      <h2>Welcome, {user.name}!</h2>
      <div className="profile-card">
        <p>
          <strong>Email:</strong> {user.email}
        </p>
        <p>
          <strong>Role:</strong> {user.role}
        </p>
        <p>
          <strong>Member since:</strong>{' '}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </div>
  );
}