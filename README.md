# Rubric - AI Resume Matcher



## Introduction
Rubric is a full stack web application that measures how well a resume fits a job description. It extracts the text from both documents, calculates a match score, identifies the skills that match, the skills that are missing and the additional skills, and uses Google Gemini to produce four targeted recommendations and a tailored cover letter. A second mode lets employers screen many resumes against a single job description and receive a ranked list of candidates.

The system is made up of three services: a React front end, a Node.js API and a Python service that performs the language analysis. Results are stored in MySQL, so every report has a permanent link.



## Interface Preview
Full page captures of the application at three screen sizes.

### Laptop - 1280 px
<table align="center">
  <tr>
    <td align="center"><b>Home</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/laptop-01-home.png" width="700" alt="Laptop home page"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Job Seeker Mode</b></td>
    <td align="center"><b>Employer Mode</b></td>
    <td align="center"><b>Loading</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/laptop-02-job-seeker.png" width="260" alt="Laptop Job Seeker mode"></td>
    <td valign="top"><img src="docs/screenshots/laptop-03-employer.png" width="260" alt="Laptop Employer mode"></td>
    <td valign="top"><img src="docs/screenshots/laptop-04-loading.png" width="260" alt="Laptop loading screen"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Match report</b></td>
    <td align="center"><b>Candidate rankings</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/laptop-05-report.png" width="395" alt="Laptop match report"></td>
    <td valign="top"><img src="docs/screenshots/laptop-06-rankings.png" width="395" alt="Laptop candidate rankings"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Privacy policy</b></td>
    <td align="center"><b>Terms of service</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/laptop-07-privacy.png" width="395" alt="Laptop privacy policy"></td>
    <td valign="top"><img src="docs/screenshots/laptop-08-terms.png" width="395" alt="Laptop terms of service page"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Log in</b></td>
    <td align="center"><b>Sign up</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/laptop-09-login.png" width="395" alt="Laptop log in page"></td>
    <td valign="top"><img src="docs/screenshots/laptop-10-signup.png" width="395" alt="Laptop sign up page"></td>
  </tr>
</table>

### Tablet - 768 px
<table align="center">
  <tr>
    <td align="center"><b>Home</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/tablet-01-home.png" width="500" alt="Tablet home page"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Job Seeker Mode</b></td>
    <td align="center"><b>Employer Mode</b></td>
    <td align="center"><b>Loading</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/tablet-02-job-seeker.png" width="260" alt="Tablet Job Seeker mode"></td>
    <td valign="top"><img src="docs/screenshots/tablet-03-employer.png" width="260" alt="Tablet Employer mode"></td>
    <td valign="top"><img src="docs/screenshots/tablet-04-loading.png" width="260" alt="Tablet loading screen"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Match report</b></td>
    <td align="center"><b>Candidate rankings</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/tablet-05-report.png" width="395" alt="Tablet match report"></td>
    <td valign="top"><img src="docs/screenshots/tablet-06-rankings.png" width="395" alt="Tablet candidate rankings"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Privacy policy</b></td>
    <td align="center"><b>Terms of service</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/tablet-07-privacy.png" width="395" alt="Tablet privacy policy"></td>
    <td valign="top"><img src="docs/screenshots/tablet-08-terms.png" width="395" alt="Tablet terms of service page"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Log in</b></td>
    <td align="center"><b>Sign up</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/tablet-09-login.png" width="395" alt="Tablet log in page"></td>
    <td valign="top"><img src="docs/screenshots/tablet-10-signup.png" width="395" alt="Tablet sign up page"></td>
  </tr>
</table>

### Phone - 390 px
<table align="center">
  <tr>
    <td align="center"><b>Home</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/phone-01-home.png" width="260" alt="Phone home page"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Job Seeker Mode</b></td>
    <td align="center"><b>Employer Mode</b></td>
    <td align="center"><b>Loading</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/phone-02-job-seeker.png" width="200" alt="Phone Job Seeker mode"></td>
    <td valign="top"><img src="docs/screenshots/phone-03-employer.png" width="200" alt="Phone Employer mode"></td>
    <td valign="top"><img src="docs/screenshots/phone-04-loading.png" width="200" alt="Phone loading screen"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Match report</b></td>
    <td align="center"><b>Candidate rankings</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/phone-05-report.png" width="260" alt="Phone match report"></td>
    <td valign="top"><img src="docs/screenshots/phone-06-rankings.png" width="260" alt="Phone candidate rankings"></td>
  </tr>
</table>

<table align="center">
  <tr>
    <td align="center"><b>Log in</b></td>
    <td align="center"><b>Privacy policy</b></td>
    <td align="center"><b>Terms of service</b></td>
    <td align="center"><b>Sign up</b></td>
  </tr>
  <tr>
    <td valign="top"><img src="docs/screenshots/phone-09-login.png" width="260" alt="Phone log in page"></td>
    <td valign="top"><img src="docs/screenshots/phone-07-privacy.png" width="260" alt="Phone privacy policy"></td>
    <td valign="top"><img src="docs/screenshots/phone-08-terms.png" width="260" alt="Phone terms of service page"></td>
    <td valign="top"><img src="docs/screenshots/phone-10-signup.png" width="260" alt="Phone sign up page"></td>
  </tr>
</table>



## How It Works
```
Browser (React + Vite)  :5173
│
│  resume + job description  (multipart upload)
▼
Express API  :5000 ───────────────► MySQL (XAMPP)
│        │                          users, guest sessions, analyses, batches
│        │ 
│        └────────────────────────► Gemini API
│                                   4 suggestions + cover letter
▼
FastAPI ML service  :5001
├─ extractor.py    PDF / DOCX → plain text
└─ ml_matcher.py   spaCy skills + MiniLM embeddings → match score
```
1. The user uploads one or more resumes and a job description in the browser.
2. The Express server validates the files, applies the guest limit and saves the uploads.
3. The server passes the saved file paths to the Python service, which extracts the text and scores the match.
4. In Job Seeker mode the server sends the scores and keyword lists to Gemini to generate recommendations and a cover letter.
5. The results are stored in MySQL and the browser opens a report page with its own link, for example `/results/a1b2c3d4e5f6`.

| Mode       | Input                                    | Output                                              |
| :--------- | :--------------------------------------- | :-------------------------------------------------- |
| Job Seeker | One resume and one job description       | A match report, four suggestions and a cover letter |
| Employer   | Up to 5 resumes as a guest, 20 when signed in, and one job description | A ranked list of candidates with a CSV export       |



## Prerequisites
Install these before starting. The setup instructions below assume **Windows with XAMPP**, but everything also runs on macOS and Linux (see [Manual Setup](#manual-setup-any-os)).
1.  `Python 3.10 to 3.14:` runs the ML service. **3.12 is the safest choice.** The service is also known to run on 3.14. If a package fails to install on a newer version, recreate the venv with 3.12.
    * Download from [python.org](https://www.python.org/downloads/).
    * During installation make sure to check **"Add python.exe to PATH"**.
2.  `Node.js 20 or newer (LTS):` runs the Express server and the Vite client.
    * Download from [nodejs.org](https://nodejs.org/).
3.  `XAMPP:` provides the MySQL database and phpMyAdmin.
    * Download from [apachefriends.org](https://www.apachefriends.org/).
4.  `Gemini API key:` used for suggestions and cover letters. It is free.
    * Create one at [Google AI Studio](https://aistudio.google.com/app/apikey).
5.  `Git` (optional): only needed if you want to clone instead of downloading a ZIP.
    * Download from [git-scm.com](https://git-scm.com/).
> [!NOTE]
> The first start downloads two language models (about 90 MB for the embedding model and 12 MB for spaCy), and the Python packages are large because they include PyTorch. Plan for roughly **3 GB of free disk space** and an internet connection for the first setup.



## Step-by-Step Installation & Setup
The setup has three steps: download the project, install it with either the automatic scripts (Windows) or the manual commands (any operating system), then verify that every service responds.

### 1. Download the Project
- **Download ZIP (easiest for beginners):**
  * Scroll to the top of this GitHub page.
  * Click the green **Code** button on the right side.
  * Click **Download ZIP** from the dropdown menu.
  * Extract the ZIP into a folder.
- **Clone with Git:**
  Open a terminal and run:
  ```
  git clone https://github.com/Khana-Badosh/Rubric-AI-Resume-Matcher.git
  ```

### 2. Install and Configure
Follow **one** of the two paths below. Automatic Setup needs Windows with XAMPP. Manual Setup works on any operating system.

#### Automatic Setup (Windows)
1. **Start MySQL.**
   * Open the **XAMPP Control Panel**.
   * Click **Start** next to **MySQL** (the row turns green).
2. **Run the setup script.** In the project folder, double-click **`setup.bat`**. It will:
   * Create a Python virtual environment, then install the Python packages and the spaCy model. A venv that was moved or half installed is rebuilt automatically.
   * Run `npm install` for the server and the client.
   * Create `server/.env` from `server/.env.example`.
   * Import the database (`database/schema.sql`) into XAMPP's MySQL.

   This takes several minutes the first time because of PyTorch. If a step fails, the script stops and shows the error.
   > [!TIP]
   > If setup says it could not find Python, open a terminal and run `py install 3.12`, then run `setup.bat` again.
3. **Add your secrets.** Open **`server/.env`** and set these two values:
   ```
   JWT_SECRET=<a long random string>
   GEMINI_API_KEY=<your Gemini API key>
   ```
   To generate a `JWT_SECRET`, run this in any terminal:
   ```
   node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
   ```
   > [!IMPORTANT]
   > Never commit `server/.env`. It is already listed in `.gitignore`.
4. **Start the application.** Make sure MySQL is still running in XAMPP, then double-click **`start.bat`**. It opens three windows (Python service, server, client) and then your browser at `http://localhost:5173`. If the project venv does not work, `start.bat` falls back to the Python on your PATH and tells you so.
   > [!NOTE]
   > The Python window takes the longest. Wait until it shows **`Application startup complete`** before running your first analysis.

#### Manual Setup (Any OS)
**1. Set up the database.** You only need to do this once. Use phpMyAdmin or the command line.

*Using phpMyAdmin (no command line):*
1. Open the **XAMPP Control Panel** and start **MySQL** and **Apache**.
2. Open [http://localhost/phpmyadmin](http://localhost/phpmyadmin).
3. Click the **Import** tab at the top.
4. Click **Choose File** and select **`database/schema.sql`** from this project.
5. Scroll down and click **Import**.
6. In the left sidebar you should now see the **`ai_resume_analyzer`** database with 5 tables.

*Using the command line:*
```
# Windows (XAMPP)
C:\xampp\mysql\bin\mysql.exe -u root < database\schema.sql

# macOS / Linux
mysql -u root -p < database/schema.sql
```
The script is safe to run again. It only creates what is missing and never deletes data.

**2. Set up the Python service.**
```
cd python
python -m venv venv
venv\Scripts\activate          # macOS / Linux: source venv/bin/activate
pip install -r requirements.txt
python -m spacy download en_core_web_sm
```
> [!IMPORTANT]
> The `spacy download` step is separate from `pip install` and is easy to miss. Without it the service stops with `Can't find model 'en_core_web_sm'`.

**3. Set up the server.**
```
cd server
npm install
```
Copy `.env.example` to `.env` and fill it in:
```
# Windows
copy .env.example .env

# macOS / Linux
cp .env.example .env
```
| Variable             | Description                                                                                                                                                   |
| :------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `PORT`               | Server port (default `5000`)                                                                                                                                  |
| `DB_HOST`            | `127.0.0.1`                                                                                                                                                   |
| `DB_USER`            | `root` (XAMPP default)                                                                                                                                        |
| `DB_PASSWORD`        | Empty for a default XAMPP install                                                                                                                             |
| `DB_NAME`            | `ai_resume_analyzer`                                                                                                                                          |
| `PYTHON_SERVICE_URL` | `http://127.0.0.1:5001`                                                                                                                                       |
| `CLIENT_ORIGIN`      | Optional. Leave it out in development, where any `localhost` port may call the API. In production, set it to the site address, or several separated by commas |
| `JWT_SECRET`         | Long random string (see the command under "Add your secrets")                                                                                                 |
| `GEMINI_API_KEY`     | Your key from Google AI Studio                                                                                                                                |

The server stops at startup and names any missing required variable. To generate a `JWT_SECRET`, run:
```
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

**4. Set up the client.**
```
cd client
npm install
```
The client connects to `http://localhost:5000` by default. To change this, create `client/.env` with `VITE_API_URL=http://your-server:5000`.

**5. Run the three services.** Open **three terminals** (MySQL must already be running in XAMPP):

| Terminal | Folder   | Command                                                    |
| :------- | :------- | :--------------------------------------------------------- |
| 1        | `python` | `venv\Scripts\activate` then `uvicorn app:app --port 5001` |
| 2        | `server` | `npm run dev` (restarts on changes) or `npm start`         |
| 3        | `client` | `npm run dev`                                              |

Then open [http://localhost:5173](http://localhost:5173).

### 3. Verify the Setup
Check each service before running an analysis:

| Check                                                        | Expected result                                  |
| :----------------------------------------------------------- | :----------------------------------------------- |
| [http://127.0.0.1:5001/health](http://127.0.0.1:5001/health) | `{"status":"Python ML service is running", ...}` |
| [http://localhost:5000](http://localhost:5000)               | `{"status":"Server is running"}`                 |
| Server terminal                                              | `Connected to the AI Resume Analyzer database.`  |
| [http://localhost:5173](http://localhost:5173)               | The landing page loads                           |

Then run a full test:
1. Click **Match My Resume**.
2. Upload a PDF or DOCX resume.
3. Paste a job description (more than 20 characters).
4. Click **Analyze My Resume**.
5. You should land on a report with a score, keyword pills, suggestions and a cover letter, and the counter on the Analyze page should drop from `5 of 5` to `4 of 5`.

If all of that works, your installation was successful.



## Using the App
### Job Seeker
Upload one resume and provide a job description, either pasted as text or uploaded as a file. The result is a full match report with recommendations and a cover letter.
### Employer
Select **Employer** on the Analyze page, add several resumes and provide one job description. Candidates are ranked by match score. Each row expands to show section scores and skills, and **Download CSV** exports the ranking.
### Limits
|                   | Guest                                  | Signed-in user |
| :---------------- | :------------------------------------- | :------------- |
| Submissions       | 5 in total (a whole batch counts as 1) | Unlimited      |
| Resumes per batch | 5                                      | 20             |
| File types        | PDF, DOC, DOCX                         | PDF, DOC, DOCX |
| Max file size     | 5 MB                                   | 5 MB           |

These limits live in `server/config.js` and `client/src/lib/config.js`. Keep both files in sync if you change them.

| Safety limit            | Value                                     |
| :---------------------- | :---------------------------------------- |
| Register and log in     | 20 attempts per 15 minutes per IP address |
| New guest sessions      | 100 per hour per IP address               |
| JSON request body       | 100 KB                                    |
| Python analysis timeout | 120 seconds per resume                    |
| Gemini timeout          | 60 seconds                                |



## Understanding the Report
### The Score
```
final score = 50% document similarity + 35% skill coverage + 15% experience
```
| Component            | What it measures                                                                                 |
| :------------------- | :----------------------------------------------------------------------------------------------- |
| Semantic match (50%) | How close the overall meaning of the resume is to the job description, using sentence embeddings |
| Skill match (35%)    | The share of the job's required skills that the resume covers                                    |
| Experience (15%)     | The years of experience the job asks for compared with the years found in the resume             |

| Score        | Verdict         |
| :----------- | :-------------- |
| 75 and above | Excellent Match |
| 55 to 74     | Good Match      |
| 35 to 54     | Partial Match   |
| Below 35     | Weak Match      |
### The Cards on the Report Page
- **Score ring and stat tiles:** the final score and the three components above, shown as percentages.
- **Priority Fixes:** the first three recommendations as a short list.
- **Section Breakdown:** a score for Skills, Experience and Education, worked out separately (see below).
- **Keyword Analysis:** the share of required skills covered, then the skills that are **Matched**, **Missing from resume** and **Additional** (in the resume but not asked for). Each group shows a count and long groups show twelve with a Show all link.
- **Improvement Suggestions:** four recommendations generated by Gemini from the actual scores and keywords.
- **Cover Letter:** three paragraphs with a Copy button.
### How the Section Scores Are Worked Out
| Section    | How it is scored                                                                                                                                                                 |
| :--------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Skills     | The resume's skills section (or the whole resume if it has none) is matched against the job's skills                                                                             |
| Experience | Semantic similarity between the resume's experience section and the job description                                                                                              |
| Education  | 85 when the job asks for a degree and the resume has an education section with degree words, 35 when it does not, otherwise a base of 50 plus a small bonus for each degree word |

A section that is missing from the resume receives a neutral score of 50.



## How the Back End Works
### Request Flow
```
POST /api/analyze  (resume + job_text or job_file)
│
├─ cors               only localhost, or the origins in CLIENT_ORIGIN
├─ express.json       JSON bodies up to 100 KB
├─ auth               reads the JWT if present, otherwise the visitor is a guest
├─ upload             Multer saves files to server/uploads/resumes
├─ guestLimit         guests need a known x-guest-id with submissions left
├─ resolveJobInput    pasted text or an uploaded file, with length checks
├─ Python /extract    text extraction and scoring
├─ Gemini             suggestions and cover letter, with a fallback
├─ MySQL              saves the analysis and counts the guest submission
└─ 200                { analysis_id, algorithm_result, gemini_result }
```
Requests that are refused or fail delete their uploaded files, so the uploads folder only holds files that belong to saved reports.
### The Express Server (`server/`)
| File                       | Job                                                                                                                                                       |
| :------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `index.js`                 | Checks the required environment variables, applies cors and JSON parsing, mounts the three routers and returns a generic message for any unexpected error |
| `routes/analyze.js`        | Job Seeker analysis: validates input, calls Python and Gemini, saves the result and serves it back by id                                                  |
| `routes/batch.js`          | Employer ranking: scores each resume one at a time, sorts by score, saves each row and marks the batch `complete` or `failed`                             |
| `routes/auth.js`           | Register, log in, validate a token, create guest sessions and report a guest's remaining submissions                                                      |
| `middleware/auth.js`       | Reads the JWT. Anything missing or invalid simply means the visitor is a guest. `requireAuth` protects routes that need a login                           |
| `middleware/guestLimit.js` | Rejects guests without a known session or with no submissions left, and records usage after a success                                                     |
| `middleware/upload.js`     | Multer setup: 5 MB limit, PDF, DOC and DOCX only, names decoded from UTF-8 and stored under a unique ASCII name                                           |
| `middleware/rateLimit.js`  | Fixed-window limiter per IP address for sign in and guest sessions                                                                                        |
| `services/python.js`       | Calls the Python service and turns its failures into clear HTTP errors (503 when it is down, 422 for unreadable files)                                    |
| `services/gemini.js`       | Builds the prompt, asks for JSON, validates the reply and returns a fallback message when Gemini fails                                                    |
| `utils/jobInput.js`        | Chooses between an uploaded job file and pasted text and rejects raw PDF data pasted as text                                                              |
| `utils/files.js`           | Deletes uploads from refused or failed requests                                                                                                           |
| `utils/helpers.js`         | Twelve character ids and safe JSON parsing                                                                                                                |
### Accounts and Guests
- **Accounts:** passwords are hashed with bcrypt (cost 12). A successful login or signup returns a JWT that expires after seven days. The browser stores it in local storage and sends it as `Authorization: Bearer <token>`. Emails are trimmed and lower-cased.
- **Guests:** the browser asks for a guest session on first visit and keeps the id in local storage. The id is sent as `x-guest-id` and the database counts the submissions. If the server ever forgets an id the browser quietly asks for a new one.
### Batch Behaviour
- Resumes are scored one after another so the single Python service is never overloaded.
- A resume that cannot be read gets a score of 0 and a message explaining why, and the rest of the batch continues.
- If the Python service is down the whole batch stops with a 503, is marked `failed` and does not use up a guest submission.
### The Python Service (`python/`)
| File            | Job                                                                                                                                         |
| :-------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `app.py`        | FastAPI app. Loads the model once at startup. `/extract` reads both documents and returns the text and the result, `/health` reports status |
| `extractor.py`  | `pdfplumber` for PDF, `python-docx` for DOCX (paragraphs and table cells). Old binary `.doc` files get a clear "save as .docx" message      |
| `ml_matcher.py` | Skill extraction, embeddings and the scoring described below                                                                                |

The service only reads files inside `server/uploads`, so it cannot be asked for other files on the machine. It rejects a resume with fewer than 50 readable characters, which usually means a scanned PDF.
### How the Matcher Reads Text
1. **Skill phrases** are pulled out of the resume and the job description with spaCy: noun chunks, named entities and runs of up to four content words. Filler such as "experience", "strong" or "team" and certification names are removed, then a TF-IDF pass drops the weakest quarter of phrases.
2. **Embeddings** turn texts into vectors with the `all-MiniLM-L6-v2` sentence model.
3. **Document similarity** is the cosine similarity of the whole resume and the whole job description.
4. **Skill matching** compares every job skill with every resume skill. A job skill counts as matched when its closest resume skill scores 0.60 or higher, otherwise it is missing. Resume skills that matched nothing become the additional skills.
5. **Experience** finds the sentence in each text that mentions years or months and compares the numbers. No requirement scores 0.5, an unreadable resume figure 0.3 and a gap of one, two or more years 0.75, 0.45 and 0.15. Meeting the requirement scores 1.0.
6. A job description parsed once is reused for every resume in a batch.
### Gemini
The server sends the score, verdict, matched and missing skills, section scores and the opening of the job description to `gemini-2.5-flash`, and requests exactly four recommendations and a three paragraph cover letter as JSON. If the key is missing, the call fails or the reply has an unexpected shape, the report is still saved with a short fallback message.
### The Database (`database/schema.sql`)
| Table            | Columns                                                                                                                                                           | Purpose                                                    |
| :--------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------- |
| `users`          | `id`, `email` (unique), `password_hash`, `created_at`                                                                                                             | Registered accounts                                        |
| `guest_sessions` | `id`, `analysis_count`, `created_at`, `last_used_at`                                                                                                              | Anonymous visitors and their free submissions              |
| `analyses`       | `id`, `user_id`, `resume_filename`, `resume_path`, `resume_text`, `job_text`, `match_score`, `algorithm_result` (JSON), `gemini_suggestions` (JSON), `created_at` | Saved Job Seeker reports                                   |
| `batch_analyses` | `id`, `user_id`, `guest_id`, `job_text`, `resume_count`, `status` (`processing`, `complete`, `failed`), `created_at`                                              | One row per Employer batch                                 |
| `batch_results`  | `id`, `batch_id`, `resume_filename`, `resume_path`, `resume_text`, `match_score`, `algorithm_result` (JSON), `rank_position`, `created_at`                        | The ranked candidates of a batch, deleted with their batch |
### How the Front End Works (`client/`)
| Area     | Details                                                                                                                                                                                                                      |
| :------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Stack    | React 19, Vite, Tailwind CSS 4, React Router 7                                                                                                                                                                               |
| Styling  | `tokens.css` holds the design tokens, `base.css` the element defaults and `index.css` the shared components, motion, touch and print rules                                                                                   |
| Data     | `lib/api.js` wraps `fetch` with timeouts and plain-language errors for offline, 401, 404, 413, 429 and 5xx. `hooks/useResultData.js` shows a result straight away from router state or loads it by link, with a retry button |
| Auth     | `context/AuthContext.jsx` restores the login and the guest session on load                                                                                                                                                   |
| Uploads  | `DropZone` checks type, size and empty files before anything is sent and explains why a file was refused                                                                                                                     |
| Forms    | The Analyze button keeps a constant label and explains any missing input when pressed. Leaving the page with unsent files prompts for confirmation                                                                           |
| Export   | `lib/exportCsv.js` writes the ranking as UTF-8 CSV and escapes cells that begin with `=`, `+`, `-` or `@` to prevent spreadsheet formula injection                                                                           |
| Pictures | `components/home/Artifacts.jsx` holds every SVG picture                                                                                                                                                                      |



## Project Structure
```
Rubric-AI-Resume-Matcher/
├── client/                           React + Vite + Tailwind front end
│   └── src/
│       ├── pages/                    Home, Analyzer, Results, BatchResults, Login, Signup, Legal
│       ├── components/
│       │   ├── ui/                   Button, Icon, Card, Page, Alert, SectionHeading, Logo, Reveal, PageStatus
│       │   ├── layout/               NavBar, Footer
│       │   ├── home/                 Hero, HowItWorks, WhyChoose, CallToAction, Artifacts
│       │   ├── analyzer/             DropZone, UploadZone, MultiUploadZone, JobDescriptionInput, ModeCard,
│       │   │                         StepHeading, LoadingScreen, GuestLimitWall
│       │   ├── auth/                 AuthForm (shared by Login and Signup)
│       │   └── results/              ScoreRing, ScoreBar, SkillBreakdown, CopyButton
│       ├── context/AuthContext.jsx   Login state and guest session
│       ├── hooks/                    useResultData, useCountUp
│       ├── lib/                      api, config, scoring, exportCsv
│       ├── tokens.css                Design tokens
│       ├── base.css                  Element defaults
│       └── index.css                 Shared styles
│
├── server/                           Node.js + Express API
│   ├── routes/                       analyze.js, batch.js, auth.js
│   ├── middleware/                   auth.js, guestLimit.js, upload.js, rateLimit.js
│   ├── services/                     gemini.js, python.js
│   ├── utils/                        helpers.js, jobInput.js, files.js
│   ├── config.js                     Limits and constants
│   ├── db.js                         MySQL connection pool
│   └── index.js                      Entry point
│
├── python/                           FastAPI ML service
│   ├── app.py                        /extract and /health endpoints
│   ├── extractor.py                  PDF and DOCX text extraction
│   └── ml_matcher.py                 Skill extraction, embeddings, scoring
│
├── database/
│   ├── schema.sql                    Creates the database and all tables
│   └── import-db.bat                 One-click import for XAMPP (Windows)
│
├── docs/screenshots/                 README images
├── setup.bat                         One-time setup (Windows)
├── start.bat                         Starts all three services (Windows)
└── README.md
```



## API Reference
**Express server (`:5000`)**

| Method | Endpoint                     | Description                                                                        |
| :----- | :--------------------------- | :--------------------------------------------------------------------------------- |
| `POST` | `/api/analyze`               | Analyze one resume. Form fields: `resume`, plus `job_text` or `job_file`           |
| `GET`  | `/api/analyze/:id`           | Fetch a saved analysis                                                             |
| `POST` | `/api/batch`                 | Rank many resumes. Form fields: `resumes` (several), plus `job_text` or `job_file` |
| `GET`  | `/api/batch/:id`             | Fetch a saved batch                                                                |
| `POST` | `/api/auth/register`         | Create an account and receive a token                                              |
| `POST` | `/api/auth/login`            | Log in and receive a token                                                         |
| `GET`  | `/api/auth/me`               | Validate a token                                                                   |
| `POST` | `/api/auth/guest-session`    | Create an anonymous guest session                                                  |
| `GET`  | `/api/auth/guest-status/:id` | Free submissions used and remaining                                                |

Guests send an `x-guest-id` header. Signed-in users send `Authorization: Bearer <token>`.

**Example: analyze a resume from the command line**
```
curl -X POST http://localhost:5000/api/analyze \
  -H "x-guest-id: <id from /api/auth/guest-session>" \
  -F "resume=@resume.pdf" \
  -F "job_text=We are hiring a full stack developer with React and Node.js experience."
```
```json
{
  "success": true,
  "analysis_id": "da989ab5343e",
  "algorithm_result": {
    "match_score": 79,
    "verdict": "Excellent Match",
    "advice": "Strong alignment. Highly recommended to apply.",
    "matched_keywords": ["api design", "aws", "..."],
    "missing_keywords": ["graphql", "..."],
    "extra_keywords": ["..."],
    "section_scores": { "skills": 31, "experience": 62, "education": 85 },
    "semantic_score": 0.74,
    "skill_score": 0.77,
    "experience_score": 1.0,
    "token_counts": { "resume": 156, "jd": 190 }
  },
  "gemini_result": {
    "suggestions": [{ "title": "...", "description": "..." }],
    "cover_letter": "..."
  }
}
```
**Status codes the API uses**

| Code  | Meaning                                                                            |
| :---- | :--------------------------------------------------------------------------------- |
| `400` | Missing file, missing or too short job description, wrong file type or no guest id |
| `403` | The guest has used all free submissions (`code: GUEST_LIMIT_REACHED`)              |
| `404` | Unknown report, batch or guest session                                             |
| `409` | An account with that email already exists                                          |
| `422` | The resume or job file could not be read                                           |
| `429` | Too many sign in attempts or guest sessions from one address                       |
| `503` | The Python service is not running                                                  |

**Python service (`:5001`)**

| Method | Endpoint   | Description                                                                                            |
| :----- | :--------- | :----------------------------------------------------------------------------------------------------- |
| `GET`  | `/health`  | Service status and model name                                                                          |
| `POST` | `/extract` | Body `{ resume_path, job_text or job_path }`. Returns `resume_text`, `job_text` and `algorithm_result` |



## Development
| Task                             | Command                                                    |
| :------------------------------- | :--------------------------------------------------------- |
| Production build of the client   | `cd client` then `npm run build` (output in `client/dist`) |
| Run the server with auto restart | `cd server` then `npm run dev`                             |
| Run the server once              | `cd server` then `npm start`                               |

Responsive, touch and print behaviour were verified in emulated browsers. The project does not include an automated test suite.



## Known Limitations
- **English resumes only.** The skill extractor uses the English spaCy model.
- **Scanned PDFs are not supported.** Text must be selectable. There is no OCR.
- **Old `.doc` files** are accepted by the upload but cannot be read. The app asks for a `.docx` or PDF instead.
- **Anyone with a report link can open it.** Ids are random but reports are not tied to a login.
- **The sign in limiter lives in memory.** It resets when the server restarts and does not span several server processes.
- **The policy pages are drafts.** `client/src/pages/legalContent.js` describes the application and makes assumptions about data retention. Review it before a public launch.



## Privacy
Uploaded resumes are stored in `server/uploads/` and their extracted text in the database. They are not served publicly. To generate recommendations and cover letters, the match scores, keywords and the opening of the job description are sent to Google Gemini. The `uploads/` folder and `.env` are excluded from Git and must remain in `.gitignore`.

