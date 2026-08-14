import { useState, useEffect } from 'react';
import client from '../api/client';

export default function HealthCheck() {
  const [status, setStatus] = useState('loading');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    client
      .get('/v3/api-docs')
      .then((res) => {
        setData(res.data);
        setStatus('success');
      })
      .catch((err) => {
        setError(err.message);
        setStatus('error');
      });
  }, []);

  return (
    <div className="healthcheck">
      <h2>Backend Connection</h2>
      {status === 'loading' && <p>Checking backend connection...</p>}
      {status === 'error' && (
        <p style={{ color: 'red' }}>
          Failed to reach backend: {error}
        </p>
      )}
      {status === 'success' && (
        <div>
          <p style={{ color: 'green' }}>✓ Backend is reachable!</p>
          <p>
            <strong>API Version:</strong>{' '}
            {data?.info?.title || 'LMS API'} — v{data?.info?.version || '?'}
          </p>
        </div>
      )}
    </div>
  );
}