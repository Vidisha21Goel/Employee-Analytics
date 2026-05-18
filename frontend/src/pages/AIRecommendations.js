import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { getAllEmployees, getAIRecommendation, rankAllEmployees } from '../utils/api';

const AIRecommendations = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedId, setSelectedId] = useState('');
  const [recommendation, setRecommendation] = useState(null);
  const [bulkAnalysis, setBulkAnalysis] = useState(null);
  const [loadingSingle, setLoadingSingle] = useState(false);
  const [loadingBulk, setLoadingBulk] = useState(false);

  useEffect(() => {
    getAllEmployees().then((res) => setEmployees(res.data.data)).catch(() => {});
  }, []);

  const handleSingleRecommend = async () => {
    if (!selectedId) { toast.warning('Please select an employee'); return; }
    setLoadingSingle(true);
    setRecommendation(null);
    try {
      const res = await getAIRecommendation(selectedId);
      setRecommendation(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'AI recommendation failed');
    } finally {
      setLoadingSingle(false);
    }
  };

  const handleBulkAnalysis = async () => {
    setLoadingBulk(true);
    setBulkAnalysis(null);
    try {
      const res = await rankAllEmployees();
      setBulkAnalysis(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Bulk analysis failed');
    } finally {
      setLoadingBulk(false);
    }
  };

  const formatRecommendation = (text) => {
    return text.split('\n').map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <h4 key={i} style={{ color: 'var(--primary-dark)', margin: '0.75rem 0 0.25rem' }}>{line.replace(/\*\*/g, '')}</h4>;
      }
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={i} style={{ marginBottom: '0.25rem' }}>
            {parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p)}
          </p>
        );
      }
      if (line.startsWith('- ')) {
        return <li key={i} style={{ marginLeft: '1.5rem', marginBottom: '0.2rem' }}>{line.slice(2)}</li>;
      }
      if (line.trim() === '') return <br key={i} />;
      return <p key={i} style={{ marginBottom: '0.3rem' }}>{line}</p>;
    });
  };

  const getScoreClass = (score) => score >= 85 ? 'score-high' : score >= 60 ? 'score-medium' : 'score-low';

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">🤖 AI Recommendations</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>

        {/* Single Employee */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>👤 Single Employee Analysis</h2>
          <div className="form-group" style={{ marginBottom: '1rem' }}>
            <label className="form-label">Select Employee</label>
            <select className="form-select" value={selectedId} onChange={(e) => { setSelectedId(e.target.value); setRecommendation(null); }}>
              <option value="">-- Choose an employee --</option>
              {employees.map((emp) => (
                <option key={emp._id} value={emp._id}>
                  {emp.name} — {emp.department} (Score: {emp.performanceScore})
                </option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleSingleRecommend} disabled={loadingSingle || !selectedId}>
            {loadingSingle ? '⏳ Analyzing...' : '🤖 Get AI Recommendation'}
          </button>
        </div>

        {/* Bulk Analysis */}
        <div className="card">
          <h2 style={{ marginBottom: '1rem', fontSize: '1.1rem' }}>📊 Bulk Team Analysis</h2>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', marginBottom: '1rem' }}>
            Analyze all employees at once. Get rankings, promotion candidates, and team insights.
          </p>
          <button className="btn btn-success" onClick={handleBulkAnalysis} disabled={loadingBulk || employees.length === 0}>
            {loadingBulk ? '⏳ Analyzing team...' : '📈 Analyze All Employees'}
          </button>
          {employees.length === 0 && (
            <p style={{ color: 'var(--danger)', fontSize: '0.8rem', marginTop: '0.5rem' }}>No employees found. Add employees first.</p>
          )}
        </div>
      </div>

      {/* Single Recommendation Result */}
      {loadingSingle && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
          <p style={{ color: 'var(--text-light)' }}>AI is analyzing the employee profile...</p>
        </div>
      )}

      {recommendation && (
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <div style={{ flex: 1 }}>
              <h2 style={{ fontSize: '1.2rem' }}>
                🎯 Recommendation for <strong>{recommendation.employee.name}</strong>
              </h2>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                <span className="dept-badge">{recommendation.employee.department}</span>
                <span className={`score-badge ${getScoreClass(recommendation.employee.performanceScore)}`}>
                  Score: {recommendation.employee.performanceScore}/100
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-light)' }}>
                  {recommendation.employee.experience} yrs exp
                </span>
              </div>
            </div>
          </div>

          <div className="ai-card">
            <h3>🤖 AI Analysis</h3>
            <div className="ai-content">
              {formatRecommendation(recommendation.recommendation)}
            </div>
          </div>
        </div>
      )}

      {/* Bulk Analysis Result */}
      {loadingBulk && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ color: 'var(--text-light)' }}>AI is analyzing your entire team...</p>
        </div>
      )}

      {bulkAnalysis && (
        <div className="card">
          <h2 style={{ marginBottom: '1.25rem', fontSize: '1.2rem' }}>📈 Team Analysis Report</h2>

          <div className="table-wrapper" style={{ marginBottom: '1.5rem' }}>
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Score</th>
                  <th>Experience</th>
                </tr>
              </thead>
              <tbody>
                {bulkAnalysis.employees.map((emp) => (
                  <tr key={emp._id}>
                    <td>
                      <span className={`rank-${emp.rank}`} style={{ fontWeight: 700, fontSize: '1rem' }}>
                        {emp.rank === 1 ? '🥇' : emp.rank === 2 ? '🥈' : emp.rank === 3 ? '🥉' : `#${emp.rank}`}
                      </span>
                    </td>
                    <td><strong>{emp.name}</strong></td>
                    <td><span className="dept-badge">{emp.department}</span></td>
                    <td><span className={`score-badge ${getScoreClass(emp.performanceScore)}`}>{emp.performanceScore}/100</span></td>
                    <td>{emp.experience} yrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="ai-card">
            <h3>🤖 AI Team Analysis</h3>
            <div className="ai-content">
              {formatRecommendation(bulkAnalysis.aiAnalysis)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIRecommendations;
