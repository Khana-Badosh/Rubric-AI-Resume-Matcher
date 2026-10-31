const axios = require('axios');
const { PYTHON_TIMEOUT_MS } = require('../config');

async function extractAndMatch(resumePath, jobPayload) {
  const { data } = await axios.post(
    `${process.env.PYTHON_SERVICE_URL}/extract`,
    { resume_path: resumePath, ...jobPayload },
    { timeout: PYTHON_TIMEOUT_MS }
  );
  return data;
}

const errorDetail = (err) => err.response?.data?.detail ?? err.message;

function toHttpError(err) {
  if (err.code === 'ECONNREFUSED') {
    return { status: 503, message: 'Python service unavailable. Is it running on port 5001?' };
  }
  if (err.response?.data?.detail) {
    return { status: 422, message: err.response.data.detail };
  }
  return { status: 500, message: 'Something went wrong during analysis.' };
}

module.exports = { extractAndMatch, errorDetail, toHttpError };
