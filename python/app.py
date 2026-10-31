"""
Resume matching service (FastAPI, port 5001).

Run: uvicorn app:app --reload --port 5001
"""

import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel

from extractor import extract_text
from ml_matcher import HybridMatcher, SemanticMatcher

MIN_RESUME_CHARS = 50
MIN_JOB_CHARS = 20

# Only files the Node server saved can be read, so the service cannot be asked for arbitrary paths
UPLOAD_ROOT = Path(os.environ.get('UPLOAD_DIR') or Path(__file__).resolve().parent.parent / 'server' / 'uploads').resolve()


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.matcher = HybridMatcher()
    yield


app = FastAPI(title='Resume Matcher ML Service', version='2.1.0', lifespan=lifespan)


class ExtractRequest(BaseModel):
    resume_path: str
    job_text: str | None = None
    job_path: str | None = None


def read_document(path: str, label: str, min_chars: int) -> str:
    if not Path(path).resolve().is_relative_to(UPLOAD_ROOT):
        raise HTTPException(status_code=422, detail=f'Could not read {label} file.')

    try:
        text = extract_text(path)
    except Exception as e:
        raise HTTPException(status_code=422, detail=f'Could not read {label} file: {e}')

    if len(text.strip()) < min_chars:
        raise HTTPException(
            status_code=422,
            detail=(
                f'Could not extract readable text from the {label}. '
                'Make sure it is not a scanned image PDF.'
            ),
        )
    return text


def resolve_job_text(req: ExtractRequest) -> str:
    """The uploaded job file takes priority over pasted text."""
    if req.job_path:
        return read_document(req.job_path, 'job description', MIN_JOB_CHARS)

    if not req.job_text:
        raise HTTPException(status_code=400, detail='Either job_text or job_path must be provided.')

    if req.job_text.startswith('%PDF') or '\x00' in req.job_text[:200]:
        raise HTTPException(
            status_code=422,
            detail=(
                'The job description appears to be a raw PDF file, not plain text. '
                'Upload it as a file (job_file field) or paste the text directly.'
            ),
        )

    if len(req.job_text.strip()) < MIN_JOB_CHARS:
        raise HTTPException(
            status_code=400,
            detail='Job description is too short. Please provide more detail.',
        )
    return req.job_text


@app.get('/health')
def health():
    return {'status': 'Python ML service is running', 'model': SemanticMatcher.MODEL_NAME}


@app.post('/extract')
def extract(req: ExtractRequest, request: Request):
    resume_text = read_document(req.resume_path, 'resume', MIN_RESUME_CHARS)
    job_text = resolve_job_text(req)

    return {
        'resume_text': resume_text,
        'job_text': job_text,
        'algorithm_result': request.app.state.matcher.safe_match(resume_text, job_text),
    }


if __name__ == '__main__':
    import uvicorn

    uvicorn.run('app:app', host='127.0.0.1', port=5001, reload=True)
