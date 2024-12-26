// Navbar Component
import React from 'react';
import { FaBell, FaSignOutAlt } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../utils/AuthContext';

const Navbar = ({ buttons, unreadCount }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav
      style={{
        position: 'fixed',
        top: '20px',
        left: 0,
        marginLeft: '40px',
        width: '90%',
        backgroundColor: '#fff',
        padding: '10px 20px',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        zIndex: 1000,
      }}
    >
      <span style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
        {user ? `Hello, ${user.username}!` : ''}
      </span>

      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {buttons.map((btn, index) => (
          <Link key={index} to={btn.path}>
            <button
              style={{
                backgroundColor: '#4299e1',
                color: '#fff',
                padding: '8px 12px',
                border: 'none',
                borderRadius: '5px',
                fontSize: '14px',
                cursor: 'pointer',
              }}
            >
              {btn.icon} {btn.label}
            </button>
          </Link>
        ))}

        <div style={{ position: 'relative', cursor: 'pointer' }}>
          <FaBell
            style={{
              fontSize: '20px',
              color: '#333',
            }}
            title="Notifications"
          />
          {unreadCount > 0 && (
            <span
              style={{
                position: 'absolute',
                top: '-5px',
                right: '-5px',
                backgroundColor: 'red',
                color: '#fff',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '10px',
              }}
            >
              {unreadCount}
            </span>
          )}
        </div>

        <FaSignOutAlt
          onClick={handleLogout}
          style={{
            fontSize: '20px',
            cursor: 'pointer',
            color: '#333',
          }}
          title="Logout"
        />
      </div>
    </nav>
  );
};

export default Navbar;
