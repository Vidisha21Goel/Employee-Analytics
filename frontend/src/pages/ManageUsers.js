import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getProfile } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Guard: only admin can access this page
    if (user && user.role !== 'admin') {
      toast.error('Access denied: Admins only');
      navigate('/');
      return;
    }
    fetchUsers();
  }, [user, navigate]);

  const fetchUsers = async () => {
    try {
      const res = await API.get('/auth/users');
      setUsers(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeStyle = (role) => ({
    padding: '0.2rem 0.6rem',
    borderRadius: '12px',
    fontSize: '0.75rem',
    fontWeight: 600,
    background: role === 'admin' ? '#dbeafe' : '#d1fae5',
    color: role === 'admin' ? '#1e40af' : '#065f46',
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit', month: 'short', year: 'numeric',
    });
  };

  if (loading) return <div className="loading">Loading users...</div>;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">👑 Manage Users</h1>
          <p style={{ color: 'var(--text-light)', fontSize: '0.9rem' }}>
            Admin view — all registered accounts
          </p>
        </div>
      </div>

      <div className="card" style={{ padding: 0 }}>
        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', color: 'var(--text-light)', fontSize: '0.9rem' }}>
          {users.length} registered user(s)
        </div>

        {users.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-light)' }}>
            No users found.
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u, idx) => (
                  <tr key={u._id}>
                    <td style={{ color: 'var(--text-light)' }}>{idx + 1}</td>
                    <td>
                      <strong>{u.name}</strong>
                      {u._id === user?._id && (
                        <span style={{ marginLeft: '0.4rem', fontSize: '0.72rem', color: 'var(--primary)', fontWeight: 600 }}>
                          (You)
                        </span>
                      )}
                    </td>
                    <td style={{ color: 'var(--text-light)' }}>{u.email}</td>
                    <td>
                      <span style={getRoleBadgeStyle(u.role)}>
                        {u.role === 'admin' ? '👑 Admin' : '👤 HR'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--text-light)', fontSize: '0.85rem' }}>
                      {formatDate(u.createdAt)}
                    </td>
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

export default ManageUsers;
