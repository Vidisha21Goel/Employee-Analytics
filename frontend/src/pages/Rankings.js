import React, { useState, useEffect } from 'react';
import { getEmployeeRankings } from '../utils/api';
import { toast } from 'react-toastify';

const Rankings = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEmployeeRankings()
      .then((res) => setEmployees(res.data.data))
      .catch(() => toast.error('Failed to load rankings'))
      .finally(() => setLoading(false));
  }, []);

  const getScoreClass = (score) => score >= 85 ? 'score-high' : score >= 60 ? 'score-medium' : 'score-low';
  const getRankIcon = (rank) => rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `#${rank}`;
  const getCategory = (score) => score >= 85 ? 'Top Performer' : score >= 60 ? 'Meets Expectations' : 'Needs Improvement';

  if (loading) return <div className="loading">Loading rankings...</div>;

  const topThree = employees.slice(0, 3);
  const rest = employees.slice(3);

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🏆 Employee Rankings</h1>
        <span style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>Ranked by performance score</span>
      </div>

      {employees.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-light)' }}>No employees to rank yet.</p>
        </div>
      ) : (
        <>
          {/* Top 3 Podium */}
          {topThree.length > 0 && (
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {topThree.map((emp) => (
                <div
                  key={emp._id}
                  className="card"
                  style={{
                    textAlign: 'center',
                    flex: '1',
                    minWidth: '200px',
                    maxWidth: '280px',
                    border: emp.rank === 1 ? '2px solid #f59e0b' : '1px solid var(--border)',
                    background: emp.rank === 1 ? 'linear-gradient(135deg, #fffbeb, #fef3c7)' : 'white',
                  }}
                >
                  <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{getRankIcon(emp.rank)}</div>
                  <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{emp.name}</h3>
                  <span className="dept-badge" style={{ marginBottom: '0.75rem', display: 'inline-block' }}>{emp.department}</span>
                  <div>
                    <span className={`score-badge ${getScoreClass(emp.performanceScore)}`} style={{ fontSize: '1rem' }}>
                      {emp.performanceScore}/100
                    </span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.5rem' }}>
                    {emp.experience} yrs experience
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Full Rankings Table */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.1rem' }}>📋 Full Rankings</h2>
            </div>
            <div className="table-wrapper">
              <table>
                <thead>
                  <tr>
                    <th>Rank</th>
                    <th>Employee</th>
                    <th>Department</th>
                    <th>Skills</th>
                    <th>Score</th>
                    <th>Experience</th>
                    <th>Category</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map((emp) => (
                    <tr key={emp._id}>
                      <td>
                        <strong style={{ fontSize: '1.1rem' }}>{getRankIcon(emp.rank)}</strong>
                      </td>
                      <td>
                        <div><strong>{emp.name}</strong></div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{emp.email}</div>
                      </td>
                      <td><span className="dept-badge">{emp.department}</span></td>
                      <td>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {emp.skills.slice(0, 2).map((s) => (
                            <span key={s} className="skill-tag" style={{ fontSize: '0.7rem' }}>{s}</span>
                          ))}
                          {emp.skills.length > 2 && <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>+{emp.skills.length - 2}</span>}
                        </div>
                      </td>
                      <td>
                        <span className={`score-badge ${getScoreClass(emp.performanceScore)}`}>
                          {emp.performanceScore}/100
                        </span>
                      </td>
                      <td>{emp.experience} yrs</td>
                      <td>
                        <span style={{
                          fontSize: '0.78rem',
                          padding: '0.2rem 0.5rem',
                          borderRadius: '4px',
                          background: emp.performanceScore >= 85 ? '#d1fae5' : emp.performanceScore >= 60 ? '#fef3c7' : '#fee2e2',
                          color: emp.performanceScore >= 85 ? '#065f46' : emp.performanceScore >= 60 ? '#92400e' : '#991b1b',
                        }}>
                          {getCategory(emp.performanceScore)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Rankings;
