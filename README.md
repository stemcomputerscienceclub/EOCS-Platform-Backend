# EOCS Competition Platform

**Egyptian Olympiad in Computational Science** — a full-stack web application for hosting timed online science and programming competitions.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 19, Vite 8, Tailwind CSS, React Router v7, Axios |
| Backend | Node.js, Express 5, MongoDB / Mongoose 9 |
| Auth | JWT, bcryptjs, httpOnly cookies + Bearer tokens |
| Code Runner | Pyodide (Python WASM in-browser) |
| Email | Nodemailer + Gmail App Password |
| Deployment | Frontend → Vercel, Backend → Render |

## Project Structure

```
eocs-platform/
├── EOCS-Platform-Frontend/          # React SPA (Vite)
│   ├── src/
│   │   ├── api/axios.js             # Axios instance with interceptors (BROKEN — uses process.env, see below)
│   │   ├── context/                 # AuthContext, CompetitionContext (preferred for API calls)
│   │   ├── components/              # Layout, Navigation, Timer, PrivateRoute, PublicRoute, etc.
│   │   ├── pages/                   # Login, ForgotPassword, ResetPassword, Dashboard, Competition, Results, NotFound
│   │   ├── styles/                  # theme, pages, components, utilities CSS
│   │   ├── router.jsx               # Route definitions
│   │   └── main.jsx                 # Entry point
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── vercel.json
│
└── EOCS-Platform-Backend/           # Express API
    └── src/
        ├── app.js                   # Express setup (mounts routes/index.js at /api)
        ├── index.js                 # Entry point (imports app.js)
        ├── server.js                # Standalone alt (NOT used)
        ├── config/index.js          # Env config loader
        ├── models/                  # User, Competition, Participation, Question
        ├── routes/                  # authRoutes.js (mounted), auth.js (unused), competitionRoutes.js
        ├── middleware/              # auth.js (JWT guard)
        ├── data/sampleQuestions.js  # 30 questions (5 subjects × 3 difficulties × 2)
        └── utils/                   # email.js, sendEmail.js
```

## Setup

### Prerequisites
- Node.js >= 18
- MongoDB instance (local or Atlas)

### Backend

```bash
cd EOCS-Platform-Backend
npm install
cp .env.sample .env    # or create .env (see below)
npm run dev            # starts on port 5000
```

### Frontend

```bash
cd EOCS-Platform-Frontend
npm install
npm run dev            # starts on port 5173
```

## Environment Variables

### Backend (`.env`)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGODB_URI` | Yes | — | MongoDB connection string |
| `JWT_SECRET` | Yes | — | Random 64-char hex |
| `PORT` | No | 5000 | Server port |
| `NODE_ENV` | No | `development` | `development` or `production` |
| `CLIENT_URL` | No | `http://localhost:3000` | CORS / reset-link base URL |
| `ALLOWED_ORIGINS` | No | `http://localhost:3000,...` | Comma-separated CORS origins |
| `JWT_EXPIRE` | No | `24h` | Token expiry duration |
| `JWT_COOKIE_EXPIRE` | No | 24 | Cookie expiry in hours |
| `COMPETITION_START_TIME` | For testing | ISO date | When competition starts |
| `COMPETITION_ENTRANCE_TIME` | No | 1800 | Entrance window in seconds |
| `COMPETITION_LENGTH` | No | 1800 | Exam duration in seconds |
| `EMAIL_SERVICE` | For pw reset | — | e.g. `gmail` |
| `EMAIL_USER` | For pw reset | — | Gmail address |
| `EMAIL_PASS` | For pw reset | — | Gmail App Password |
| `FROM_NAME` | No | EOCS | Sender name for reset emails |
| `FROM_EMAIL` | No | same as EMAIL_USER | Sender address |

### Frontend (`.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | `http://localhost:5000/api` | Backend API base URL |
| `VITE_SOCKET_URL` | `http://localhost:5000` | WebSocket URL (unused) |

## Test Users

| Username | Email | Password | Role |
|----------|-------|----------|------|
| `kero` | `kero@example.com` | `UserYaseen@1234` | user |
| `testuser` | `test@test.com` | `Test@1234!` | user |
| `demo` | `demo@test.com` | `Demo@1234!` | user |

Register more via the forgot-password flow or use the demo-accounts.txt file.

## API Routes

All under `/api`:

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/auth/register` | POST | No | Register user |
| `/auth/login` | POST | No | Login (returns JWT) |
| `/auth/me` | GET | Yes | Get current user |
| `/auth/logout` | GET | Yes | Logout |
| `/auth/forgotpassword` | POST | No | Send reset email |
| `/auth/resetpassword/:token` | PUT | No | Reset password |
| `/competition/config` | GET | Yes | Get competition timing config |
| `/competition/status` | GET | Yes | Get user's participation status (active / completed / not_started) |
| `/competition/start` | POST | Yes | Start the exam |
| `/competition/progress` | GET | Yes | Get ongoing progress |
| `/competition/submit/:questionId` | POST | Yes | Submit individual answer |
| `/competition/finish` | POST | Yes | Finish exam — accepts `{ answers: [{ questionId, answer }] }` |
| `/competition/results` | GET | Yes | Get exam results |
| `/competition/log-activity` | POST | Yes | Log anti-cheat event |
| `/competition/dev/reset` | POST | Admin | Reset all participations |
| `/health` | GET | No | Health check |

## Code Runner (Pyodide)

Coding questions use **Pyodide** — CPython compiled to WebAssembly — running entirely in the user's browser.

**How it works:**
- Pyodide (~10 MB) is loaded from CDN on first "Run Code" click
- Python code executes in-browser via `pyodide.runPythonAsync()`
- stdout/stderr are captured via StringIO redirection
- Output is displayed in a panel below the editor

**Supported:** Full Python stdlib + numpy, matplotlib, scipy, etc.

**Limitation:** `input()` calls won't work interactively (no stdin passthrough). Competition problems should avoid `input()`.

## Competition Flow

1. Admin sets `COMPETITION_START_TIME` + `COMPETITION_ENTRANCE_TIME` + `COMPETITION_LENGTH` in `.env`
2. Users log in → see dashboard with countdown / status
3. During entrance window, user clicks **Start Competition**
4. Timer starts → 30 questions (MCQ + coding) presented
5. MCQ answers stored in local state; submitted on final finish
6. Anti-cheat monitors: tab switches, fullscreen exits, copy/paste, page close
7. After 3 warnings → auto-submit; timer expiry → auto-submit
8. On finish: ALL questions stored in `participation.answers` (answered with the user's answer, unanswered with `""`)
9. `checkStatus()` polling detects `'completed'` → clears context state → Dashboard redirects to Results

## Known Quirks

| Issue | Details |
|-------|---------|
| `api` from `../api/axios.js` | Uses `process.env.NEXT_PUBLIC_API_URL` (Next.js) → always resolves to render.com in Vite. **Do not use.** Use `CompetitionContext`'s internal `api` or `fetch()` with `VITE_API_URL` instead. |
| `checkStatus()` returns truthy for `'completed'` | Fixed in code — returns `false` so polling stops. |
| `hasActiveCompetition` never cleared | Fixed — `finishCompetition()` resets it; `checkStatus()` also clears it on completed/not_started. |
| LightningCSS `@apply` warnings | Harmless — Tailwind directives not recognized by LightningCSS at build time. |

## Reset Participation (for testing)

```bash
cd EOCS-Platform-Backend
node -e "
import mongoose from 'mongoose';
import { config } from './src/config/index.js';
import Participation from './src/models/Participation.js';
import { User } from './src/models/User.js';

await mongoose.connect(config.mongoUri);
const user = await User.findOne({ email: 'test@test.com' });
if (user) {
  const r = await Participation.deleteMany({ user: user._id });
  console.log('Deleted', r.deletedCount, 'participation(s)');
}
await mongoose.disconnect();
"
```

Then clear localStorage: `localStorage.removeItem('activeParticipation')`

## Common Issues

| Error | Fix |
|-------|-----|
| `next is not a function` in pre('save') hooks | Mongoose 9 removed `next` param — use `async function()` without `next` |
| `Missing parameter name at index 1: *` | Express 5 / path-to-regexp v8 — replace `'*'` with `'/{*path}'` |
| `options usenewurlparser, useunifiedtopology are not supported` | Mongoose 9 removed these — use `mongoose.connect(uri)` without options |
| `Unknown at rule: @tailwind` | Harmless CSS warning — LightningCSS doesn't recognize Tailwind directives |
| Redirect loop after finishing | Backend `/status` now returns `'completed'`; context resets `hasActiveCompetition`; polling stops. Restart backend. |

## Anti-Cheat System

The competition page (`Competition.jsx`) monitors:

- **Tab switches** — `visibilitychange` event → warning dialog with remaining leaves count
- **Fullscreen exits** — `fullscreenchange` event → warning count + log
- **Copy/Paste/Cut** — blocked + logged to backend
- **Page close** — `beforeunload` → auto-submits all answers
- After **3 warnings** → exam auto-submitted

## Password Reset Flow

1. Login page has **"Forgot Password?"** link → `/forgot-password`
2. User enters email → `POST /auth/forgotpassword`
3. Backend generates reset token (SHA256 hash, 1-hour expiry), saves to user doc
4. Email sent via Nodemailer (Gmail SMTP) with link: `{CLIENT_URL}/reset-password/{rawToken}`
5. User clicks link → `/reset-password/:token` → enters new password
6. Frontend sends `PUT /auth/resetpassword/:token` with new password
7. Backend hashes the token, finds matching user, updates password, clears token
8. User redirected to login

## Git Repos

Two separate repos (SSH):

```bash
git@github.com:stemcomputerscienceclub/EOCS-Platform-Backend.git
git@github.com:stemcomputerscienceclub/EOCS-Platform-Frontend.git
```
