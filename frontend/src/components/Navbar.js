import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        🏢 EmpAnalytics
      </Link>

      <ul className="navbar-links">
        <li><NavLink to="/">Dashboard</NavLink></li>
        <li><NavLink to="/employees">Employees</NavLink></li>
        <li><NavLink to="/employees/add">Add Employee</NavLink></li>
        <li><NavLink to="/ai-recommendations">AI Insights</NavLink></li>
        <li><NavLink to="/rankings">Rankings</NavLink></li>
      </ul>

      <div className="navbar-user">
        <span style={{ fontSize: '0.85rem', opacity: 0.9 }}>
          👤 {user?.name} ({user?.role})
        </span>
        <button className="btn-logout" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
