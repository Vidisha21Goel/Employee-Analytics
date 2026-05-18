import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllEmployees } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const res = await getAllEmployees();
      setEmployees(res.data.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const avgScore =
    employees.length > 0
      ? (employees.reduce((sum, e) => sum + e.performanceScore, 0) / employees.length).toFixed(1)
      : 0;

  const topPerformers = employees.filter((e) => e.performanceScore >= 85).length;
  const needsImprovement = employees.filter((e) => e.performanceScore < 60).length;
  const departments = [...new Set(employees.map((e) => e.department))].length;

  const recentEmployees = [...employees].slice(0, 5);

  const getScoreClass = (score) => {
    if (score >= 85) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  if (loading) return <div className="loading">Loading dashboard...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 Dashboard</h1>
          <p style={{ color: 'var(--text-light)' }}>Welcome back, {user?.name}! Here's your HR overview.</p>
        </div>
        <Link to="/employees/add" className="btn btn-primary">
          + Add Employee
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon">👥</span>
          <span className="stat-value">{employees.length}</span>
          <span className="stat-label">Total Employees</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⭐</span>
          <span className="stat-value">{avgScore}</span>
          <span className="stat-label">Avg Performance Score</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">🚀</span>
          <span className="stat-value">{topPerformers}</span>
          <span className="stat-label">Top Performers (85+)</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">📈</span>
          <span className="stat-value">{departments}</span>
          <span className="stat-label">Active Departments</span>
        </div>
        <div className="stat-card">
          <span className="stat-icon">⚠️</span>
          <span className="stat-value" style={{ color: 'var(--danger)' }}>{needsImprovement}</span>
          <span className="stat-label">Needs Improvement (&lt;60)</span>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="card" style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>⚡ Quick Actions</h2>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <Link to="/employees" className="btn btn-outline">📋 View All Employees</Link>
          <Link to="/ai-recommendations" className="btn btn-primary">🤖 AI Recommendations</Link>
          <Link to="/rankings" className="btn btn-success">🏆 View Rankings</Link>
        </div>
      </div>

      {/* Recent Employees */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.1rem' }}>🕐 Recent Employees</h2>
          <Link to="/employees" className="btn btn-sm btn-outline">View All</Link>
        </div>

        {recentEmployees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-light)' }}>
            No employees yet. <Link to="/employees/add">Add your first employee</Link>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Department</th>
                  <th>Score</th>
                  <th>Experience</th>
                </tr>
              </thead>
              <tbody>
                {recentEmployees.map((emp) => (
                  <tr key={emp._id}>
                    <td><strong>{emp.name}</strong><br /><small style={{ color: 'var(--text-light)' }}>{emp.email}</small></td>
                    <td><span className="dept-badge">{emp.department}</span></td>
                    <td>
                      <span className={`score-badge ${getScoreClass(emp.performanceScore)}`}>
                        {emp.performanceScore}/100
                      </span>
                    </td>
                    <td>{emp.experience} yrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
