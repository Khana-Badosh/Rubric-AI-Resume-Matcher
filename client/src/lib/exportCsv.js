import { toPercent } from './scoring';

// A cell that starts with = + - @ (or a tab/CR) is run as a formula by Excel and Sheets, so it is prefixed with an apostrophe
const FORMULA_START = /^[=+\-@\t\r]/;

const cell = (value) => {
  const text = String(value ?? '');
  const safe = FORMULA_START.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
};

const HEADER = ['Rank', 'Filename', 'Match Score', 'Verdict', 'Semantic %', 'Skill Match %', 'Matched Skills', 'Missing Skills'];

// Filenames may contain any script; the byte order mark makes Excel read the file as UTF-8
const BYTE_ORDER_MARK = '\uFEFF';

export function exportRankingsCsv(results, batchId) {
  const rows = results.map(({ rank_position, resume_filename, match_score, algorithm_result: a = {} }) => [
    rank_position,
    resume_filename,
    match_score,
    a.verdict,
    toPercent(a.semantic_score ?? 0),
    toPercent(a.skill_score ?? 0),
    (a.matched_keywords ?? []).join(', '),
    (a.missing_keywords ?? []).join(', '),
  ]);

  const csv = BYTE_ORDER_MARK + [HEADER, ...rows].map((row) => row.map(cell).join(',')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));

  const link = document.createElement('a');
  link.href = url;
  link.download = `candidate-rankings-${String(batchId).replace(/[^\w-]/g, '_')}.csv`;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
