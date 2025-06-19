import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    username: '',
    email: '',
    password: '',
    passkey: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Signup component mounted');
    window.addEventListener('unhandledrejection', e => {
      console.error('Unhandled rejection:', e.reason);
    });
  }, []);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(f => ({ ...f, [name]: value }));
  };

  const validateForm = () => {
    if (formData.password.length < 8) {
      throw new Error('Password must be at least 8 characters');
    }
    if (!formData.passkey) {
      throw new Error('Organization passkey is required');
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      validateForm();
      console.log('Submitting signup:', formData);

      const res = await fetch('http://localhost:5000/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      console.log('→ status:', res.status, res.statusText);

      const ct = res.headers.get('content-type') || '';
      if (!ct.includes('application/json')) {
        const text = await res.text();
        console.error('Non-JSON response:', text);
        throw new Error(`Server error (${res.status})`);
      }

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');

      navigate('/login?registration=success');
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-left">
          <h1 className="login-title">
            Join <span className="login-bold">LaWatch</span>
          </h1>
          <p className="login-description">
            LLDA-FEU Water Quality Monitoring System
          </p>
        </div>

        <div className="login-right">
          <form onSubmit={handleSubmit} className="login-form">
            <h2 className="form-title">Request Access</h2>
            <div className="form-row">
              <div className="form-group half-width">
                <label>First Name</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required disabled={loading}
                />
              </div>
              <div className="form-group half-width">
                <label>Last Name</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required disabled={loading}
                />
              </div>
            </div>
            <div className="form-group">
              <label>Username</label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Password (min 8 characters)</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required minLength="8" disabled={loading}
              />
            </div>
            <div className="form-group">
              <label>Organization Passkey</label>
              <input
                type="password"
                name="passkey"
                value={formData.passkey}
                onChange={handleChange}
                required disabled={loading}
              />
            </div>
            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'PROCESSING...' : 'REQUEST ACCESS'}
            </button>
            <div className="signup-prompt">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;