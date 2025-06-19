import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Profile.css';

const Profile = ({ setIsLoggedIn }) => {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ users: '...', reports: '...', stations: 9 });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserData = () => {
      window.scrollTo(0, 0);
      try {
        const userRaw = localStorage.getItem('user');
        console.log('Raw user data from localStorage:', userRaw);
        
        const userData = JSON.parse(userRaw);
        console.log('Parsed user data:', userData);
        
        const token = localStorage.getItem('token');
        console.log('Token exists:', !!token);

        if (!userData || !token || !['admin', 'user'].includes(userData?.role)) {
          console.log('Missing required user data, redirecting to login');
          navigate('/login');
          return;
        }

        setUser(userData);
        fetchUserStats(userData.role);
      } catch (error) {
        console.error('Profile load error:', error);
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

  const fetchUserStats = async (role) => {
    if (role !== 'admin') return;

    try {
      const responseUsers = await fetch('http://localhost:5000/api/stats/users', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Add token if required
        },
      });
      if (responseUsers.ok) {
        const dataUsers = await responseUsers.json();
        setStats((prevStats) => ({
          ...prevStats,
          users: dataUsers.usersCount,
        }));
      } else {
        console.error('Failed to fetch users:', await responseUsers.text());
      }

      //Fetch reports count
      const responseReports = await fetch('http://localhost:5000/api/stats/reports', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, //Add token if required
        },
      });
      if (responseReports.ok) {
        const dataReports = await responseReports.json();
        setStats((prevStats) => ({
          ...prevStats,
          reports: dataReports.reportsCount,
        }));
      } else {
        console.error('Failed to fetch reports:', await responseReports.text());
      }
    } catch (error) {
      console.error('Failed to load stats:', error);
    }
  };

    loadUserData();
  }, [navigate]);

  if (loading) return (
    <div className="profile-loading">
      <div className="loading-spinner"></div>
      <p>Loading profile data...</p>
    </div>
  );

  return (
    <div className="profile-page">
      <div className="profile-container container">
            <div className="profile-sidebar">
              <div className="user-card">
                <div className="user-info">
                  <p className="user-role">{user?.role?.toUpperCase()}</p>
                  <p className="user-org">{user?.role === 'admin' ? 'FEU Alabang - Axiom BEAP' : 'Laguna Lake Development Authority'}</p>
                </div>
              </div>
        
              <div className="sidebar-nav">
                <Link to="/profile" className="active">Dashboard</Link>
                {user?.role === 'admin' && (
                  <Link to="/manageusers">Manage Users</Link>
                )}
                <Link to="/reports">View Reports</Link>
                <button 
                  className="logout-btn" 
                  onClick={() => {
                    localStorage.removeItem('user');
                    localStorage.removeItem('token');
                    setIsLoggedIn(false);
                    navigate('/Login');
                  }}
                >
                  Log Out
                </button>
              </div>
            </div>
        <div className="profile-content">
          <section className="profile-section">
            <h2>System Overview</h2>
            <div className="stats-grid">
              {user?.role === 'admin' ? (
                <>
                  <StatCard value={stats.users} label="Registered Users" icon="users" />
                  <StatCard value={stats.reports} label="Reports Generated" icon="reports" />
                  <StatCard value={stats.stations} label="Monitoring Stations" icon="stations" />
                </>
              ) : (
                <>
                  <StatCard value={stats.reports} label="Total Reports" icon="reports" />
                  <StatCard value={stats.stations} label="Monitoring Stations" icon="stations" />
                  <StatCard value="Active" label="Account Status" icon="status" />
                </>
              )}
            </div>
          </section>

          <section className="profile-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              <div className="activity-item">
                <div className="activity-date">Today</div>
                <div className="activity-content">
                  <p>You logged in to the system</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">Yesterday</div>
                <div className="activity-content">
                  <p>System update: New water quality data available</p>
                </div>
              </div>
              <div className="activity-item">
                <div className="activity-date">3 days ago</div>
                <div className="activity-content">
                  <p>Report generated</p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ value, label, icon }) => (
  <div className="stat-card">
    <div className={`stat-icon ${icon}`}></div>
    <div className="stat-value">{value}</div>
    <div className="stat-label">{label}</div>
  </div>
);

const ActionButton = ({ to, label }) => (
  <Link to={to} className="action-button">
    {label}
  </Link>
);

export default Profile;