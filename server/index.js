require('dotenv').config();

const REQUIRED_ENV = ['DB_HOST', 'DB_USER', 'DB_NAME', 'JWT_SECRET', 'PYTHON_SERVICE_URL'];
const missingEnv = REQUIRED_ENV.filter((name) => !process.env[name]);
if (missingEnv.length > 0) {
  console.error(`Missing environment variables: ${missingEnv.join(', ')}. Copy .env.example to .env and fill them in.`);
  process.exit(1);
}
if (!process.env.GEMINI_API_KEY) {
  console.warn('GEMINI_API_KEY is not set. Suggestions and cover letters will use the fallback text.');
}

const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();

// CLIENT_ORIGIN lists the allowed browser origins (comma separated). Unset, any localhost port is allowed.
const allowedOrigins = process.env.CLIENT_ORIGIN?.split(',').map((origin) => origin.trim()).filter(Boolean);
const isLocalOrigin = (origin) => /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin);

app.disable('x-powered-by');
app.use(cors({
  origin: (origin, callback) => callback(null, !origin || (allowedOrigins ? allowedOrigins.includes(origin) : isLocalOrigin(origin))),
}));
app.use(express.json({ limit: '100kb' }));

app.use('/api/analyze', require('./routes/analyze'));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/batch', require('./routes/batch'));

app.get('/', (req, res) => res.json({ status: 'Server is running' }));

app.use((err, req, res, next) => {
  const status = err.status || 500;
  if (status >= 500) console.error(err.stack);
  res.status(status).json({ error: status >= 500 ? 'Internal server error' : err.message });
});

db.getConnection()
  .then((conn) => {
    conn.release();
    console.log('Connected to the AI Resume Analyzer database.');
  })
  .catch((err) => console.error('Database connection failed:', err.message));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
