const db = require('../db');
const { GUEST_LIMIT } = require('../config');
const { discardUploads } = require('../utils/files');

async function enforceGuestLimit(req, res, next) {
  if (req.user) return next();

  const guestId = req.headers['x-guest-id'];
  const refuse = async (status, body) => {
    await discardUploads(req);
    return res.status(status).json(body);
  };

  if (!guestId) {
    return refuse(400, { error: 'Guest session ID missing.', code: 'NO_GUEST_ID' });
  }

  const [rows] = await db.execute('SELECT analysis_count FROM guest_sessions WHERE id = ?', [guestId]);
  if (rows.length === 0) {
    return refuse(404, { error: 'Guest session not found.', code: 'INVALID_GUEST_ID' });
  }
  if (rows[0].analysis_count >= GUEST_LIMIT) {
    return refuse(403, {
      error: `Guest limit reached. You've used all ${GUEST_LIMIT} free submissions.`,
      code: 'GUEST_LIMIT_REACHED',
      limit: GUEST_LIMIT,
      used: rows[0].analysis_count,
    });
  }

  req.guestId = guestId;
  next();
}

const recordGuestUsage = (guestId) =>
  guestId && db.execute('UPDATE guest_sessions SET analysis_count = analysis_count + 1 WHERE id = ?', [guestId]);

module.exports = { enforceGuestLimit, recordGuestUsage };
