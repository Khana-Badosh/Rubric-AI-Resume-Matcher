const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('crypto');
const db = require('../db');
const { auth, requireAuth } = require('../middleware/auth');
const { rateLimit } = require('../middleware/rateLimit');
const { GUEST_LIMIT, AUTH_ATTEMPTS_PER_15_MIN, GUEST_SESSIONS_PER_HOUR } = require('../config');

const router = express.Router();

const limitCredentials = rateLimit({ windowMs: 15 * 60 * 1000, max: AUTH_ATTEMPTS_PER_15_MIN });
const limitGuestSessions = rateLimit({ windowMs: 60 * 60 * 1000, max: GUEST_SESSIONS_PER_HOUR });

const signToken = ({ id, email }) =>
  jwt.sign({ id, email }, process.env.JWT_SECRET, { expiresIn: '7d' });

const session = ({ id, email }) => ({ token: signToken({ id, email }), user: { id, email } });

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const isText = (value) => typeof value === 'string' && value.length > 0;

router.post('/register', limitCredentials, async (req, res) => {
  const { password } = req.body;
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  if (!email || !isText(password)) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }
  if (!EMAIL_PATTERN.test(email) || email.length > 255) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });
  }

  try {
    const [existing] = await db.execute('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const hash = await bcrypt.hash(password, 12);
    const [result] = await db.execute(
      'INSERT INTO users (email, password_hash) VALUES (?, ?)',
      [email, hash]
    );

    res.status(201).json(session({ id: result.insertId, email }));
  } catch (err) {
    console.error('[Auth] Register error:', err.message);
    res.status(500).json({ error: 'Registration failed. Please try again.' });
  }
});

router.post('/login', limitCredentials, async (req, res) => {
  const { password } = req.body;
  const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';

  if (!email || !isText(password)) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
    const user = rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: 'Incorrect email or password.' });
    }

    res.json(session(user));
  } catch (err) {
    console.error('[Auth] Login error:', err.message);
    res.status(500).json({ error: 'Login failed. Please try again.' });
  }
});

router.get('/me', auth, requireAuth, (req, res) => {
  const { id, email } = req.user;
  res.json({ user: { id, email } });
});

router.post('/guest-session', limitGuestSessions, async (req, res) => {
  const guestId = randomUUID();

  try {
    await db.execute('INSERT INTO guest_sessions (id, analysis_count) VALUES (?, 0)', [guestId]);
    res.json({ guest_id: guestId });
  } catch (err) {
    console.error('[Auth] Guest session error:', err.message);
    res.status(500).json({ error: 'Could not create guest session.' });
  }
});

router.get('/guest-status/:guestId', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT analysis_count FROM guest_sessions WHERE id = ?',
      [req.params.guestId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Guest session not found.' });
    }

    const used = rows[0].analysis_count;
    res.json({
      analysis_count: used,
      limit: GUEST_LIMIT,
      remaining: Math.max(0, GUEST_LIMIT - used),
    });
  } catch {
    res.status(500).json({ error: 'Could not fetch guest status.' });
  }
});

module.exports = router;
