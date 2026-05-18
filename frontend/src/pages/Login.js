import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { loginUser } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginUser(formData);
      login(res.data.data);
      toast.success(`Welcome back, ${res.data.data.name}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">🏢 EmpAnalytics</h2>
        <p className="auth-subtitle">Sign in to your HR dashboard</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading} style={{ width: '100%', justifyContent: 'center', padding: '0.75rem' }}>
            {loading ? 'Signing in...' : '🔐 Sign In'}
          </button>
        </form>

        <p className="auth-link">
          Don't have an account? <Link to="/signup">Create one</Link>
        </p>

        <div style={{ marginTop: '1.5rem', padding: '1rem', background: '#f0f4ff', borderRadius: '8px', fontSize: '0.8rem', color: '#64748b' }}>
          <strong>Demo:</strong> Create an account via Sign Up first, then login here.
        </div>
      </div>
    </div>
  );
};

export default Login;
