const { MIN_JOB_TEXT_LENGTH } = require('../config');

function resolveJobInput(req) {
  const jobFile = req.files?.job_file?.[0];
  if (jobFile) {
    return { payload: { job_path: jobFile.path }, label: jobFile.originalname };
  }

  const jobText = req.body.job_text?.trim() ?? '';
  if (jobText.length < MIN_JOB_TEXT_LENGTH) {
    return { error: 'Please provide a job description. Paste the text or upload a PDF or DOCX file.' };
  }
  if (jobText.startsWith('%PDF') || jobText.includes('\x00')) {
    return {
      error: 'The job description field contains raw PDF data. Upload it as a file using the job_file field, or paste the text directly.',
    };
  }
  return { payload: { job_text: jobText }, label: jobText };
}

module.exports = { resolveJobInput };
