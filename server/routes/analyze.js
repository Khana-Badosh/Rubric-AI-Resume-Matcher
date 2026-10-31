const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const { parseAnalyzeUpload } = require('../middleware/upload');
const { enforceGuestLimit, recordGuestUsage } = require('../middleware/guestLimit');
const { extractAndMatch, toHttpError } = require('../services/python');
const { generateSuggestions } = require('../services/gemini');
const { resolveJobInput } = require('../utils/jobInput');
const { newId, parseJson } = require('../utils/helpers');
const { discardUploads } = require('../utils/files');

const router = express.Router();

router.use(auth);

router.post('/', parseAnalyzeUpload, enforceGuestLimit, async (req, res) => {
  const resumeFile = req.files?.resume?.[0];
  if (!resumeFile) {
    await discardUploads(req);
    return res.status(400).json({ error: 'No resume file uploaded.' });
  }

  const job = resolveJobInput(req);
  if (job.error) {
    await discardUploads(req);
    return res.status(400).json({ error: job.error });
  }

  try {
    const { resume_text, job_text, algorithm_result } = await extractAndMatch(resumeFile.path, job.payload);
    const gemini_result = await generateSuggestions(algorithm_result, job_text);
    const analysisId = newId();

    await db.execute(
      `INSERT INTO analyses
         (id, user_id, resume_filename, resume_path, resume_text,
          job_text, match_score, algorithm_result, gemini_suggestions)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        analysisId,
        req.user?.id ?? null,
        resumeFile.originalname,
        resumeFile.path,
        resume_text,
        job_text,
        algorithm_result.match_score,
        JSON.stringify(algorithm_result),
        JSON.stringify(gemini_result),
      ]
    );
    await recordGuestUsage(req.guestId);

    res.json({ success: true, analysis_id: analysisId, algorithm_result, gemini_result });
  } catch (err) {
    console.error('[Analyze] Error:', err.message);
    await discardUploads(req);
    const { status, message } = toHttpError(err);
    res.status(status).json({ error: message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.execute(
      'SELECT id, algorithm_result, gemini_suggestions FROM analyses WHERE id = ?',
      [req.params.id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Analysis not found.' });
    }

    const [row] = rows;
    res.json({
      analysis_id: row.id,
      algorithm_result: parseJson(row.algorithm_result),
      gemini_result: parseJson(row.gemini_suggestions),
    });
  } catch {
    res.status(500).json({ error: 'Failed to fetch analysis.' });
  }
});

module.exports = router;
