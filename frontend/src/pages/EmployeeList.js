import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAllEmployees, searchEmployees, deleteEmployee } from '../utils/api';

const DEPARTMENTS = ['All', 'Development', 'HR', 'Marketing', 'Finance', 'Operations', 'Sales', 'Design', 'QA', 'DevOps'];

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', department: 'All', minScore: '', maxScore: '' });
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    setLoading(true);
    try {
      const res = await getAllEmployees();
      setEmployees(res.data.data);
    } catch (err) {
      toast.error('Failed to fetch employees');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.name) params.name = filters.name;
      if (filters.department !== 'All') params.department = filters.department;
      if (filters.minScore) params.minScore = filters.minScore;
      if (filters.maxScore) params.maxScore = filters.maxScore;

      const res = await searchEmployees(params);
      setEmployees(res.data.data);
    } catch (err) {
      toast.error('Search failed');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFilters({ name: '', department: 'All', minScore: '', maxScore: '' });
    fetchEmployees();
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete ${name}? This cannot be undone.`)) return;
    setDeleting(id);
    try {
      await deleteEmployee(id);
      toast.success(`${name} deleted successfully`);
      setEmployees(employees.filter((e) => e._id !== id));
    } catch (err) {
      toast.error('Failed to delete employee');
    } finally {
      setDeleting(null);
    }
  };

  const getScoreClass = (score) => {
    if (score >= 85) return 'score-high';
    if (score >= 60) return 'score-medium';
    return 'score-low';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">👥 Employees</h1>
        <Link to="/employees/add" className="btn btn-primary">+ Add Employee</Link>
      </div>

      {/* Search & Filter Section */}
      <div className="search-section">
        <div className="form-group">
          <label className="form-label">Search by Name</label>
          <input
            type="text"
            className="form-input"
            placeholder="Employee name..."
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Department</label>
          <select
            className="form-select"
            value={filters.department}
            onChange={(e) => setFilters({ ...filters, department: e.target.value })}
          >
            {DEPARTMENTS.map((d) => <option key={d}>{d}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Min Score</label>
          <input
            type="number"
            className="form-input"
            placeholder="0"
            min="0"
            max="100"
            value={filters.minScore}
            onChange={(e) => setFilters({ ...filters, minScore: e.target.value })}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Max Score</label>
          <input
            type="number"
            className="form-input"
            placeholder="100"
            min="0"
            max="100"
            value={filters.maxScore}
            onChange={(e) => setFilters({ ...filters, maxScore: e.target.value })}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignSelf: 'flex-end' }}>
          <button className="btn btn-primary" onClick={handleSearch}>🔍 Search</button>
          <button className="btn btn-outline" onClick={handleReset}>Reset</button>
        </div>
      </div>

      {/* Employee Table */}
      {loading ? (
        <div className="loading">Loading employees...</div>
      ) : employees.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-light)', marginBottom: '1rem' }}>No employees found.</p>
          <Link to="/employees/add" className="btn btn-primary">Add First Employee</Link>
        </div>
      ) : (
        <div className="card" style={{ padding: 0 }}>
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Showing {employees.length} employee(s)
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Skills</th>
                  <th>Score</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {employees.map((emp, idx) => (
                  <tr key={emp._id}>
                    <td style={{ color: 'var(--text-light)' }}>{idx + 1}</td>
                    <td>
                      <div><strong>{emp.name}</strong></div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-light)' }}>{emp.email}</div>
                    </td>
                    <td><span className="dept-badge">{emp.department}</span></td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                        {emp.skills.slice(0, 3).map((s) => (
                          <span key={s} className="skill-tag" style={{ fontSize: '0.72rem' }}>{s}</span>
                        ))}
                        {emp.skills.length > 3 && (
                          <span style={{ fontSize: '0.72rem', color: 'var(--text-light)' }}>+{emp.skills.length - 3}</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <span className={`score-badge ${getScoreClass(emp.performanceScore)}`}>
                        {emp.performanceScore}/100
                      </span>
                    </td>
                    <td>{emp.experience} yrs</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem' }}>
                        <Link to={`/employees/edit/${emp._id}`} className="btn btn-sm btn-warning">✏️ Edit</Link>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(emp._id, emp.name)}
                          disabled={deleting === emp._id}
                        >
                          {deleting === emp._id ? '...' : '🗑️ Delete'}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
