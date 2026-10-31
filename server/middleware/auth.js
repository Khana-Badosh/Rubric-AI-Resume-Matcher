const jwt = require('jsonwebtoken');

const bearerToken = (req) => req.headers.authorization?.split(' ')[1];

const auth = (req, res, next) => {
  req.user = null;
  const token = bearerToken(req);

  if (token) {
    try {
      req.user = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      // invalid or expired token: continue as a guest
    }
  }
  next();
};

const requireAuth = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'You must be logged in to do this.' });
  }
  next();
};

module.exports = { auth, requireAuth };
