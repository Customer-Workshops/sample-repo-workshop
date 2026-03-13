# Copilot Instructions — Employee Management System

## Project Overview

Full-stack **Employee Management System** built as a workshop reference app.

- **Backend:** Node.js + Express + MongoDB (Mongoose) — REST API at `/api`
- **Frontend:** React 18 + Vite — served from `client/`, proxied to backend during dev
- **Auth:** JWT (stored in `localStorage`), injected by Axios interceptor in `client/src/api/axiosInstance.js`

---

## Repository Layout

```
server.js                  # Express entry point, MongoDB connect, route mounting
routes/                    # auth.js · employees.js · attendance.js
controllers/               # employeeController.js · attendanceController.js
middleware/                # authMiddleware.js (JWT verify) · validate.js (express-validator rules)
models/                    # Employee.js · Attendance.js (Mongoose schemas)
client/
  vite.config.js           # /api/* proxied to http://localhost:3000 in dev
  src/
    App.jsx                # React Router + PrivateRoute guard
    pages/                 # Login · Dashboard · Employees · AttendancePage
    components/            # EmployeeForm · EmployeeTable · SearchFilter · Navbar · AttendanceForm
    api/                   # axiosInstance.js · auth.js · employees.js (API wrappers)
```

---

## Dev Commands

### Backend (repo root)
```bash
npm run dev        # nodemon server.js — auto-reload
npm start          # node server.js — production
```

### Frontend (inside client/)
```bash
npm run dev        # Vite dev server → http://localhost:5173
npm run build      # Production build → client/dist/
npm run preview    # Preview production build
```

### Tests
```bash
cd client && npm test   # React Testing Library tests (Jest setup required — not yet configured)
```

---

## Environment Variables

Create a `.env` file at the repo root (never commit it):

```
PORT=3000
MONGO_URI=mongodb://localhost:27017/emp-mgmt
JWT_SECRET=<strong-random-secret>
JWT_EXPIRES_IN=1h
CLIENT_ORIGIN=http://localhost:5173
```

> **Note:** `.env` exists in the repo for workshop convenience, but in real projects it must be in `.gitignore`.

---

## Key Conventions

### API Pattern
- All routes mounted under `/api` in `server.js`
- Protected routes require `Authorization: Bearer <token>` header
- Express-validator rules live in `middleware/validate.js` and are chained in route definitions

### Backend Error Responses
| Scenario | Status |
|----------|--------|
| Validation failure | 400 |
| Unauthorized / bad token | 401 / 403 |
| Resource not found | 404 |
| Duplicate email (Mongoose code 11000) | 409 |
| Server error | 500 |

### Frontend Data Flow
1. User action → `client/src/api/*.js` wrapper function
2. Axios interceptor attaches JWT from `localStorage`
3. Vite proxy forwards `/api/*` → `http://localhost:3000`
4. State updated in page-level component; passed down as props

### Validation
- **Backend:** `express-validator` chains in `middleware/validate.js`
- **Frontend:** Inline validation in `EmployeeForm.jsx` (regex email, min salary, required fields)
- Always validate on **both** sides; frontend validation is UX-only

### Data Models
- **Employee:** `name`, `email` (unique index), `department`, `role`, `hireDate` (ISO8601), `salary` (≥0), timestamps
- **Attendance:** `employee` (ObjectId ref → Employee), `date`, `status` (`Present|Absent|Leave`), timestamps

---

## Known Issues & Gotchas

| # | Issue | Impact |
|---|-------|--------|
| 1 | Auth users stored **in-memory** — reset on restart | Workshop-only; needs MongoDB users collection for prod |
| 2 | Default credentials `admin / password` hardcoded | Never deploy as-is |
| 3 | Deleting an employee does **not** cascade to attendance records | Leaves orphaned documents |
| 4 | No pagination on `/api/employees` | Scales poorly |
| 5 | Jest / Vitest not configured — `EmployeeForm.test.jsx` can't run | Add test runner before writing new tests |
| 6 | Production deployment requires a reverse proxy for `/api` | Vite proxy is dev-only |
| 7 | UI uses inline style objects throughout | No CSS framework; maintain that pattern for consistency |

---

## Testing

Test file: `client/src/components/EmployeeForm.test.jsx`
- Uses React Testing Library (`render`, `fireEvent`, `screen`)
- Covers: empty-form validation errors, valid submission with correct payload

UI test scenarios documented in `UITESTS.md` (manual test cases for auth, CRUD, filters, attendance).

When writing new tests:
- Follow the existing RTL pattern in `EmployeeForm.test.jsx`
- Mock API calls (`client/src/api/*.js`) — do not make real HTTP calls in unit tests
- Add Jest/Vitest config to `client/package.json` before running

---

## Security Notes

- Never log or expose `JWT_SECRET`
- Sanitize all user input via `express-validator` before touching the DB
- Axios interceptor auto-attaches JWT — do not manually include tokens in component code
- CORS origin is restricted to `CLIENT_ORIGIN` env var; do not wildcard in production
