// Header for Logged-in Users
import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import './Header.css';
import logo from './LaWatch Logo.png';

const UserHeader = (setIsLoggedIn) => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [actionMessage, setActionMessage] = useState(null);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();
    const [menuOpen, setMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    const location = useLocation();
    const showDashboard = location.pathname === "/profile" || 
                          location.pathname === "/manageusers" || 
                          location.pathname === "/reports";

    useEffect(() => {
      const loadUserData = () => {
          const userRaw = localStorage.getItem('user');
          const token = localStorage.getItem('token');
    
          if (!userRaw || !token) {
            navigate('/login');
            return;
          }
    
          const userData = JSON.parse(userRaw);
          setUser(userData);
          fetchUsers();
        };
      
    
      loadUserData();
    }, [navigate]);

    const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token:', token ? 'Token exists' : 'No token found');
      
      if (!token) {
        navigate('/login');
        return;
      }

      const url = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users`;
      console.log('Fetching from URL:', url);
      
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Response status:', response.status);
      
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          console.log('Authentication error:', response.status);
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
          return;
        }
        throw new Error(`Failed to fetch users: ${response.status}`);
      }

      const data = await response.json();
      console.log('Users data received:', data.length, 'users');
      setUsers(data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('Failed to load users. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

    return (
        <>
            <header className={`header ${scrolled ? 'scrolled' : ''}`}>
                <div className="logo-container">
                    <Link to="/"><img src={logo} alt="LaWatch Logo" className="logo-img" /></Link>
                </div>
                
                <button 
                    className={`menu-toggle ${menuOpen ? 'open' : ''}`} 
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                <nav className={`nav ${menuOpen ? 'open' : ''}`}>
                    <ul className="nav-list">
                        <li className="nav-item"><Link to="/">MAIN</Link></li>
                        <li className="nav-item"><Link to="/maps">MAPS</Link></li>
                        <li className="nav-item"><Link to="/ldb">LAGUNA DE BAY</Link></li>
                        <li className="nav-item"><Link to="/about">ABOUT</Link></li>
                        <li className="nav-item"><Link to="/profile">PROFILE</Link></li>
                    </ul>
                </nav>
            </header>
            {showDashboard && (
                <div className="manageusers-hero">
                    <div className="dashboard">
                        <p>{user?.role === 'admin' ? 'Administrator Dashboard' : 'User Dashboard'}</p>
                    </div>
                </div>
            )}
        </>
    );
};

export default UserHeader;