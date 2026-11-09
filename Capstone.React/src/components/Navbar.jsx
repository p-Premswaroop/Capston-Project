import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const userName = localStorage.getItem('userName') || 'User';
  const role = localStorage.getItem('role') || 'User';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    localStorage.removeItem('role');
    navigate('/');
  };

  const initial = userName.charAt(0).toUpperCase();

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div>

        </div>

        <nav className="navbar-nav">
        
         
        </nav>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{userName}</span>
            <span className="user-role">{role}</span>
          </div>

          <button className="btn-logout" onClick={handleLogout} title="Logout">
            <i className="ri-logout-box-r-line"></i>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
