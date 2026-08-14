import { useState, useEffect } from 'react';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import client from '../api/client';

const ACCENT = '#aa3bff';
const ACCENT_LIGHT = 'rgba(170, 59, 255, 0.15)';
const RED = '#ef4444';
const GREEN = '#22c55e';

function StatTile({ title, value, subtitle, loading, color }) {
  return (
    <div className="analytics-card">
      <h3 className="analytics-card-title">{title}</h3>
      {loading ? (
        <p className="analytics-loading">Loading...</p>
      ) : (
        <>
          <p className="analytics-stat" style={{ color: color || 'var(--text-h)' }}>
            {value}
          </p>
          {subtitle && <p className="analytics-subtitle">{subtitle}</p>}
        </>
      )}
    </div>
  );
}

function ChartCard({ title, children, loading, error, empty }) {
  return (
    <div className="analytics-card">
      <h3 className="analytics-card-title">{title}</h3>
      {loading && <p className="analytics-loading">Loading...</p>}
      {error && <p className="error-msg">{error}</p>}
      {!loading && !error && empty && <p className="analytics-loading">No data yet.</p>}
      {!loading && !error && !empty && children}
    </div>
  );
}

export default function Analytics() {
  const [mostBorrowed, setMostBorrowed] = useState([]);
  const [loansOverTime, setLoansOverTime] = useState([]);
  const [overdueCount, setOverdueCount] = useState(null);
  const [activeMembers, setActiveMembers] = useState(null);
  const [loading, setLoading] = useState({
    borrowed: true,
    overtime: true,
    overdue: true,
    active: true,
  });
  const [error, setError] = useState({});

  useEffect(() => {
    client.get('/api/analytics/most-borrowed?limit=10')
      .then((res) => setMostBorrowed(res.data))
      .catch((err) => setError((e) => ({ ...e, borrowed: err.response?.data?.message || 'Failed to load' })))
      .finally(() => setLoading((l) => ({ ...l, borrowed: false })));

    client.get('/api/analytics/loans-over-time?days=60')
      .then((res) => setLoansOverTime(res.data))
      .catch((err) => setError((e) => ({ ...e, overtime: err.response?.data?.message || 'Failed to load' })))
      .finally(() => setLoading((l) => ({ ...l, overtime: false })));

    client.get('/api/analytics/overdue-count')
      .then((res) => setOverdueCount(res.data.count))
      .catch((err) => setError((e) => ({ ...e, overdue: err.response?.data?.message || 'Failed to load' })))
      .finally(() => setLoading((l) => ({ ...l, overdue: false })));

    client.get('/api/analytics/active-members')
      .then((res) => setActiveMembers(res.data.count))
      .catch((err) => setError((e) => ({ ...e, active: err.response?.data?.message || 'Failed to load' })))
      .finally(() => setLoading((l) => ({ ...l, active: false })));
  }, []);

  const formatDate = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()}`;
  };

  return (
    <div className="analytics-page">
      <h2>Analytics</h2>

      {/* Top stat tiles */}
      <div className="analytics-stats">
        <StatTile
          title="Overdue Loans"
          value={overdueCount ?? '—'}
          loading={loading.overdue}
          color={overdueCount > 0 ? RED : GREEN}
        />
        <StatTile
          title="Active Members"
          value={activeMembers ?? '—'}
          subtitle="members with active loans"
          loading={loading.active}
        />
      </div>

      {/* Charts grid */}
      <div className="analytics-charts">
        <ChartCard
          title="Most-Borrowed Books"
          loading={loading.borrowed}
          error={error.borrowed}
          empty={mostBorrowed.length === 0}
        >
          <ResponsiveContainer width="100%" height={Math.max(200, mostBorrowed.length * 50)}>
            <BarChart
              data={mostBorrowed}
              layout="vertical"
              margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 13, fill: 'var(--text)' }} />
              <YAxis
                type="category"
                dataKey="bookTitle"
                width={160}
                tick={{ fontSize: 12, fill: 'var(--text)' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 13,
                }}
                formatter={(value, name) => [value, 'Borrows']}
              />
              <Bar dataKey="borrowCount" radius={[0, 4, 4, 0]} maxBarSize={24}>
                {mostBorrowed.map((_, i) => (
                  <Cell key={i} fill={i === 0 ? ACCENT : 'var(--accent-bg)'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard
          title="Loans Over Time (Last 60 Days)"
          loading={loading.overtime}
          error={error.overtime}
          empty={loansOverTime.length === 0}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={loansOverTime}
              margin={{ top: 8, right: 8, left: 8, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                tick={{ fontSize: 12, fill: 'var(--text)' }}
                interval="preserveStartEnd"
              />
              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 13, fill: 'var(--text)' }}
              />
              <Tooltip
                contentStyle={{
                  background: 'var(--bg)',
                  border: '1px solid var(--border)',
                  borderRadius: 6,
                  fontSize: 13,
                }}
                labelFormatter={(label) => new Date(label).toLocaleDateString()}
                formatter={(value) => [value, 'Borrows']}
              />
              <Line
                type="monotone"
                dataKey="count"
                stroke={ACCENT}
                strokeWidth={2}
                dot={{ r: 3, fill: ACCENT }}
                activeDot={{ r: 5, fill: ACCENT }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}