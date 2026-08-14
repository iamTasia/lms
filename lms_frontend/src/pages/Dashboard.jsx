import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import client from '../api/client';

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get('lms_token');
    if (!token) {
      navigate('/login');
      return;
    }

    client
      .get('/api/members/me')
      .then((res) => setProfile(res.data))
      .catch(() => {
        Cookies.remove('lms_token');
        navigate('/login');
      })
      .finally(() => setLoading(false));
  }, [navigate]);

  const handleLogout = () => {
    Cookies.remove('lms_token');
    navigate('/login');
  };

  if (loading) return <p>Loading profile...</p>;
  if (!profile) return <p>Could not load profile.</p>;

  return (
    <div className="dashboard">
      <h2>Welcome, {profile.name}!</h2>
      <div className="profile-card">
        <p>
          <strong>Email:</strong> {profile.email}
        </p>
        <p>
          <strong>Role:</strong> {profile.role}
        </p>
        <p>
          <strong>Member since:</strong>{' '}
          {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>
      <button onClick={handleLogout} className="logout-btn">
        Log Out
      </button>
    </div>
  );
}