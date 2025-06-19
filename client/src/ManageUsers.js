import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './ManageUsers.css'; // Reused profile style

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

const ManageUsers = (setIsLoggedIn) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [actionMessage, setActionMessage] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const handleDeleteUser = async (userId) => {
    if (confirmDelete !== userId) {
      setConfirmDelete(userId);
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove user from the list
      setUsers(users.filter(user => user.user_id !== userId));
      setActionMessage({ type: 'success', text: 'User successfully deleted' });
    } catch (err) {
      console.error('Error deleting user:', err);
      setActionMessage({ type: 'error', text: 'Failed to delete user' });
    } finally {
      setLoading(false);
      setConfirmDelete(null);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.REACT_APP_API_URL || ''}/api/users/${userId}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      const updatedUser = await response.json();
      
      // Update the user in the list
      setUsers(users.map(user => 
        user.user_id === userId ? { ...user, role: updatedUser.role } : user
      ));
      
      setActionMessage({ type: 'success', text: 'User role updated successfully' });
    } catch (err) {
      console.error('Error updating user role:', err);
      setActionMessage({ type: 'error', text: 'Failed to update user role' });
    } finally {
      setLoading(false);
    }
  };


  if (loading && users.length === 0) {
    return (
      <div className="profile-content">
        <div className="spinner">
          <div className="spinner-circle"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-users-page">
      <div className="container">
        {/* Sidebar */}
        <div className="manageusers-sidebar">
          <div className="user-card">
            <div className="user-info">
              <p className="user-role">{user?.role?.toUpperCase()}</p>
              <p className="user-org">{user?.role === 'admin' ? 'FEU Alabang - Axiom BEAP' : 'Laguna Lake Development Authority'}</p>
            </div>
          </div>

          <div className="sidebar-nav">
            <Link to="/profile">Dashboard</Link>
            {user?.role === 'admin' && (
              <Link to="/manageusers" className="active">Manage Users</Link>
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

        {/* Main Content */}
        <div className="profile-content">
          <div className="page-header">
            <p>View and manage all registered users in the system</p>
          </div>

          {actionMessage && (
            <div className={`alert ${actionMessage.type === 'success' ? 'alert-success' : 'alert-error'}`}>
              {actionMessage.text}
              <button onClick={() => setActionMessage(null)}>&times;</button>
            </div>
          )}

          {error ? (
            <div className="error-message">
              <p>{error}</p>
              <button onClick={() => window.location.reload()}>Try Again</button>
            </div>
          ) : (
            <div className="users-table-container">
              <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Created</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.user_id}>
                    <td>{`${user.first_name} ${user.last_name}`}</td>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      <select 
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                        className="role-select"
                      >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                      </select>
                    </td>
                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                    <td>
                      {confirmDelete === user.user_id ? (
                        <div className="confirm-delete">
                          <button 
                            onClick={() => handleDeleteUser(user.user_id)}
                            className="confirm-button"
                          >
                            Confirm
                          </button>
                          <button 
                            onClick={() => setConfirmDelete(null)}
                            className="cancel-button"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="delete-button"
                          title="Delete user"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageUsers;