require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

console.log('DB URL:', process.env.DATABASE_URL ? '✅ Loaded' : '❌ Missing');

const app = express();

const allowedOrigins = [
  'https://lawatch.vercel.app',
  'https://lawatch-git-main-aishi2303.vercel.app',
  'https://lawatch-*.vercel.app', // Wildcard for all preview deployments
  process.env.NODE_ENV === 'development' && 'http://localhost:3000'
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.some(allowed => {
      return origin === allowed || 
             (allowed.includes('*') && 
              origin.startsWith(allowed.split('*')[0]));
    })) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`, 'body=', req.body);
  next();
});

// DB connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});

const authenticateToken = (req, res, next) => {
  const h = req.headers.authorization;
  const token = h && h.split(' ')[1];
  if (!token) return res.sendStatus(401);
  
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

app.get('/api/health', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT NOW() AS now');
    res.json({ status: 'ok', time: rows[0].now });
  } catch (e) {
    console.error('Health Check Error:', e);
    res.status(500).json({ error: e.message });
  }
});

// User signup
app.post('/api/signup', async (req, res) => {
  const c = await pool.connect();
  try {
    const { first_name, last_name, username, email, password, passkey } = req.body;
    if (![first_name, last_name, username, email, password, passkey].every(x => x))
      return res.status(400).json({ error: 'All fields required' });

    const role = passkey === process.env.ADMIN_PASSKEY ? 'admin' :
                 passkey === process.env.USER_PASSKEY ? 'user' :
                 null;
    if (!role) return res.status(403).json({ error: 'Invalid passkey' });

    const ex = await c.query(
      'SELECT 1 FROM public._users WHERE username=$1 OR email=$2',
      [username, email]
    );
    if (ex.rows.length) return res.status(409).json({ error: 'Exists' });

    const hp = await bcrypt.hash(password, 10);
    const r = await c.query(
      `INSERT INTO public._users 
       (user_id, first_name, last_name, username, email, password, role, passkey, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING user_id, username, email, role`,
      [uuidv4(), first_name, last_name, username, email, hp, role, passkey, new Date().toISOString()]
    );
    res.status(201).json(r.rows[0]);
  } catch (e) {
    console.error('Signup Error:', e);
    res.status(500).json({ error: 'Server error' });
  } finally {
    c.release();
  }
});

// User login
app.post('/api/login', async (req, res) => {
  console.log('→ POST /api/login', req.body);
  const c = await pool.connect();
  try {
    const { username, password } = req.body;
    if (!username || !password)
      return res.status(400).json({ error: 'username+password required' });

    const u = await c.query(
      'SELECT * FROM public._users WHERE username=$1',
      [username]
    );
    if (!u.rows.length) return res.status(401).json({ error: 'Invalid credentials' });

    const user = u.rows[0];
    if (!await bcrypt.compare(password, user.password))
      return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { userId: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );
    res.json({ message: 'ok', token, user: { userId: user.user_id, username: user.username, role: user.role } });
  } catch (e) {
    console.error('Login Error:', e);
    res.status(500).json({ error: 'Server error' });
  } finally {
    c.release();
  } 
});

app.get('/api/protected', authenticateToken, (req, res) => {
  res.json({ msg: 'secret', user: req.user });
});

// Manage Users for Admin
app.get('/api/users', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  
  const c = await pool.connect();
  try {
    const result = await c.query(
      'SELECT user_id, first_name, last_name, username, email, role, created_at FROM public._users ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (e) {
    console.error('Get Users Error:', e);
    res.status(500).json({ error: 'Server error' });
  } finally {
    c.release();
  }
});

app.get('/api/stats/users', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) AS count FROM public._users');
    const count = parseInt(rows[0].count, 10);
    res.json({ usersCount: count });
  } catch (error) {
    console.error('Error fetching user count:', error);
    res.status(500).json({ error: 'Error fetching user count' });
  }
});

app.get('/api/stats/reports', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) AS count FROM public._reports');
    const count = parseInt(rows[0].count, 10);
    res.json({ reportsCount: count });
  } catch (error) {
    console.error('Error fetching reports count:', error);
    res.status(500).json({ error: 'Error fetching reports count' });
  }
});

// Delete user endpoint
app.delete('/api/users/:userId', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  
  const userId = req.params.userId;
  const c = await pool.connect();
  try {
    const checkUser = await c.query('SELECT 1 FROM public._users WHERE user_id = $1', [userId]);
    if (checkUser.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await c.query('DELETE FROM public._users WHERE user_id = $1', [userId]);
    res.json({ message: 'User deleted successfully' });
  } catch (e) {
    console.error('Delete User Error:', e);
    res.status(500).json({ error: 'Server error' });
  } finally {
    c.release();
  }
});

// Update user role endpoint
app.patch('/api/users/:userId/role', authenticateToken, async (req, res) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
  }
  
  const userId = req.params.userId;
  const { role } = req.body;

  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({ error: 'Valid role required' });
  }
  
  const c = await pool.connect();
  try {
    const { rows } = await c.query(
      'UPDATE public._users SET role = $1 WHERE user_id = $2 RETURNING user_id, username, email, role', 
      [role, userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(rows[0]);
  } catch (e) {
    console.error('Update Role Error:', e);
    res.status(500).json({ error: 'Server error' });
  } finally {
    c.release();
  }
});

// Catch-all error handler
app.use((err, req, res, next) => {
  console.error('ERR>', err);
  res.status(500).json({ error: 'Server error' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Express server running at http://0.0.0.0:${PORT}`);
});
