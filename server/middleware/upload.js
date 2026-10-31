const fs = require('fs');
const multer = require('multer');
const path = require('path');
const { MAX_FILE_SIZE, ALLOWED_EXTENSIONS, USER_MAX_FILES } = require('../config');
const { newId } = require('../utils/helpers');

const UPLOAD_DIR = path.join(__dirname, '../uploads/resumes');
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Browsers send file names as UTF-8 but multer reads them as latin1, which garbles accents and non-Latin scripts
const decodeName = (name) => Buffer.from(name, 'latin1').toString('utf8');

// Stored names are ASCII only and unique; the readable original name is kept in the database
const storedName = (originalname) => `${Date.now()}_${newId().slice(0, 6)}_${originalname.replace(/[^\w.-]+/g, '_')}`;

const upload = multer({
  storage: multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => cb(null, storedName(file.originalname)),
  }),
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter: (req, file, cb) => {
    file.originalname = decodeName(file.originalname);
    const ext = path.extname(file.originalname).toLowerCase();
    if (ALLOWED_EXTENSIONS.includes(ext)) return cb(null, true);
    cb(new Error('Only PDF, DOC, and DOCX files are allowed'), false);
  },
});

const handleUpload = (fields) => (req, res, next) =>
  upload.fields(fields)(req, res, (err) => (err ? res.status(400).json({ error: err.message }) : next()));

const jobFileField = { name: 'job_file', maxCount: 1 };

module.exports = {
  parseAnalyzeUpload: handleUpload([{ name: 'resume', maxCount: 1 }, jobFileField]),
  parseBatchUpload: handleUpload([{ name: 'resumes', maxCount: USER_MAX_FILES }, jobFileField]),
};
