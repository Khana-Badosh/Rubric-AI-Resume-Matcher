import zipfile
from pathlib import Path

import docx
import pdfplumber

LEGACY_DOC_MESSAGE = 'Old .doc files cannot be read. Save the file as .docx or PDF and upload it again.'


def extract_text(file_path: str) -> str:
    """Extract plain text from a PDF or DOCX file."""
    ext = Path(file_path).suffix.lower()

    if ext == '.pdf':
        return _read_pdf(file_path)
    if ext in ('.docx', '.doc'):
        return _read_docx(file_path)
    raise ValueError(f'Unsupported file type: {ext}')


def _read_pdf(file_path: str) -> str:
    try:
        with pdfplumber.open(file_path) as pdf:
            pages = (page.extract_text() for page in pdf.pages)
            return '\n'.join(text for text in pages if text).strip()
    except Exception as e:
        raise RuntimeError(f'Failed to read PDF: {e}')


def _read_docx(file_path: str) -> str:
    # A .docx is a zip archive; a legacy binary .doc is not, and python-docx cannot open it
    if not zipfile.is_zipfile(file_path):
        raise RuntimeError(LEGACY_DOC_MESSAGE)

    try:
        document = docx.Document(file_path)
        lines = [p.text for p in document.paragraphs]
        # Many resumes lay out skills and dates in tables
        for table in document.tables:
            for row in table.rows:
                lines.extend(cell.text for cell in row.cells)
        return '\n'.join(lines).strip()
    except Exception as e:
        raise RuntimeError(f'Failed to read DOCX: {e}')
