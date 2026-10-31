const express = require('express');
const db = require('../db');
const { auth } = require('../middleware/auth');
const { parseBatchUpload } = require('../middleware/upload');
const { enforceGuestLimit, recordGuestUsage } = require('../middleware/guestLimit');
const { extractAndMatch, errorDetail, toHttpError } = require('../services/python');
const { resolveJobInput } = require('../utils/jobInput');
const { newId, parseJson } = require('../utils/helpers');
const { discardUploads } = require('../utils/files');
const { GUEST_MAX_FILES, USER_MAX_FILES } = require('../config');

const router = express.Router();

router.use(auth);

const failedResult = (message) => ({
  match_score: 0,
  verdict: 'Error',
  advice: `Processing failed: ${message}`,
  matched_keywords: [],
  missing_keywords: [],
  section_scores: { skills: 0, experience: 0, education: 0 },
});

async function scoreResume(file, jobPayload) {
  try {
    const { resume_text, algorithm_result } = await extractAndMatch(file.path, jobPayload);
    return { file, resume_text, algorithm_result };
  } catch (err) {
    if (err.code === 'ECONNREFUSED') throw err; // the service is down: fail the batch instead of scoring everything as 0
    const message = errorDetail(err);
    console.error(`[Batch] ${file.originalname}: ${message}`);
    return { file, resume_text: '', algorithm_result: failedResult(message) };
  }
}

router.post('/', parseBatchUpload, enforceGuestLimit, async (req, res) => {
  const files = req.files?.resumes ?? [];
  const maxFiles = req.user ? USER_MAX_FILES : GUEST_MAX_FILES;

  if (files.length === 0) {
    await discardUploads(req);
    return res.status(400).json({ error: 'No resume files uploaded.' });
  }
  if (files.length > maxFiles) {
    await discardUploads(req);
    return res.status(400).json({
      error: `Maximum ${maxFiles} resumes allowed per batch${req.user ? '.' : ' for guests. Sign up for more.'}`,
    });
  }

  const job = resolveJobInput(req);
  if (job.error) {
    await discardUploads(req);
    return res.status(400).json({ error: job.error });
  }

  const batchId = newId();

  await db.execute(
    `INSERT INTO batch_analyses (id, user_id, guest_id, job_text, resume_count, status)
     VALUES (?, ?, ?, ?, ?, 'processing')`,
    [batchId, req.user?.id ?? null, req.guestId ?? null, job.label, files.length]
  );

  try {
    // Sequential on purpose: avoids overloading the single Python service.
    const scored = [];
    for (const file of files) {
      scored.push(await scoreResume(file, job.payload));
    }
    scored.sort((a, b) => b.algorithm_result.match_score - a.algorithm_result.match_score);

    const results = [];
    for (const [index, { file, resume_text, algorithm_result }] of scored.entries()) {
      const result = {
        id: newId(),
        resume_filename: file.originalname,
        match_score: algorithm_result.match_score,
        rank_position: index + 1,
        algorithm_result,
      };

      await db.execute(
        `INSERT INTO batch_results
           (id, batch_id, resume_filename, resume_path, resume_text,
            match_score, algorithm_result, rank_position)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          result.id,
          batchId,
          file.originalname,
          file.path,
          resume_text,
          result.match_score,
          JSON.stringify(algorithm_result),
          result.rank_position,
        ]
      );
      results.push(result);
    }

    await db.execute("UPDATE batch_analyses SET status = 'complete' WHERE id = ?", [batchId]);
    await recordGuestUsage(req.guestId);

    res.json({ success: true, batch_id: batchId, resume_count: files.length, results });
  } catch (err) {
    console.error('[Batch] Error:', err.message);
    await discardUploads(req);
    await db.execute("UPDATE batch_analyses SET status = 'failed' WHERE id = ?", [batchId]).catch(() => {});
    const { status, message } = toHttpError(err);
    res.status(status).json({ error: message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [batches] = await db.execute(
      'SELECT id, resume_count FROM batch_analyses WHERE id = ?',
      [req.params.id]
    );
    if (batches.length === 0) {
      return res.status(404).json({ error: 'Batch not found.' });
    }

    const [rows] = await db.execute(
      `SELECT id, resume_filename, match_score, rank_position, algorithm_result
       FROM batch_results WHERE batch_id = ? ORDER BY rank_position ASC`,
      [req.params.id]
    );

    res.json({
      batch_id: batches[0].id,
      resume_count: batches[0].resume_count,
      results: rows.map((row) => ({ ...row, algorithm_result: parseJson(row.algorithm_result) })),
    });
  } catch (err) {
    console.error('[Batch] Fetch error:', err.message);
    res.status(500).json({ error: 'Failed to fetch batch results.' });
  }
});

module.exports = router;
