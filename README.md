# MLR Institute of Technology (MLRIT) Unified College Portal
### Integrated LMS (Moodle-Style) + Academic ERP System

An enterprise-grade, mobile-responsive, role-based college portal built for **MLR Institute of Technology (Autonomous)** that merges:
1. **LMS**: Courses, learning modules, lecture notes/materials download, assignment workflows, student submissions, and grading.
2. **ERP & Exam Portal**: Student profile, Mid & End-semester marks sheets, SGPA/CGPA calculation & trends, fee structure & dues tracking, printable e-receipts, attendance percentage tracking (< 75% examination eligibility alerts), timetables, and college bulletin circulars.
3. **Security & Audit Logs**: Server-side Role-Based Access Control (RBAC), BCrypt password hashing, signed JWT authentication, and a non-repudiable **Audit Trail Log** for every mark revision, fee collection, and exam publishing event.
4. **MLRIT Mitra AI Campus Assistant**: 24/7 intelligent conversational chatbot with real-time student record queries (live attendance %, mid marks, CGPA, fee dues, today's timetable), interactive quick actions, visual progress meters, speech-to-text, and comprehensive MLRIT knowledge base (placements, courses, campus facilities, demo accounts).

---

## 🏛️ Architecture & Tech Stack

| Layer | Technology | Details |
|---|---|---|
| **Frontend** | React (Vite, TypeScript, HTML5, CSS3) | Tailwind CSS, Lucide Icons, React Router v7, Axios, responsive mobile drawer |
| **Backend** | Spring Boot (Java 25 / 21) | REST APIs, Spring Security (Stateless JWT), Spring Data JPA, Jakarta Validation |
| **Database** | Supabase (PostgreSQL 15+) | Cloud PostgreSQL with H2 in-memory dev fallback, full DDL schema & triggers |
| **Security** | BCrypt & JJWT (Java JWT) | Role-based server-side endpoint protection, zero plaintext secrets, audit logging |
| **AI Assistant** | MLRIT Mitra (Spring Boot + React) | Context-aware NLP engine, real-time database queries, TTS & voice transcription |

---

## 👥 Roles & Test Accounts

You can test all three roles directly using the one-click demo selectors on the `/login` screen:

| Role | Login Identifier | Password | Access & Capabilities |
|---|---|---|---|
| **STUDENT** | `21R21A0501` (Hall Ticket) | `Student@123` | View enrolled courses, LMS modules, notes, submit assignments, check mid marks, SGPA/CGPA history, attendance % alerts, fee balance, and download payment e-receipts. |
| **STUDENT 2** | `21R21A0502` | `Student@123` | Alternate student account (Sneha Reddy - 100% fees cleared). |
| **FACULTY** | `MLRIT-FAC-101` (Employee ID) | `Faculty@123` | Dr. K. Srinivas Rao (HOD CSE). Assigned sections, create LMS modules, attach study materials, post assignments, grade submissions, spreadsheet marks entry, and daily attendance marker. |
| **FACULTY 2** | `MLRIT-FAC-102` | `Faculty@123` | Prof. P. Radhika (Assoc. Professor). |
| **ADMIN** | `admin` (or `admin@mlrit.ac.in`) | `Admin@123` | Student/faculty directory, BCrypt password reset, fee structures, offline counter fee collection with receipt generation, result publishing toggles, college notices, and the **Audit Trail Log Explorer**. |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Java**: JDK 21 or JDK 25 installed
- **Node.js**: Node v18+ and npm installed

### 2. Start the Spring Boot Backend

Open a terminal in `backend/`:
```bash
cd backend

# On Windows PowerShell:
.\mvnw.cmd spring-boot:run

# On Linux / macOS:
./mvnw spring-boot:run
```
The backend starts on `http://localhost:8080`.
> **Note**: On first boot, the built-in `DataInitializer` automatically seeds demo students, faculty, courses, assignments, attendance, marks, fees, and initial audit logs!

### 3. Start the React Frontend

Open a second terminal in `frontend/`:
```bash
cd frontend
npm install
npm run dev
```
The React frontend starts on `http://localhost:5173`.
All requests to `/api/*` are automatically proxied to Spring Boot on `http://localhost:8080`.

---

## 🗄️ Supabase PostgreSQL Setup

By default, the backend runs in rapid dev mode with an embedded PostgreSQL-mode database so you can test immediately without waiting for database credentials.

To connect directly to your **Supabase Cloud Project**:

1. Copy `.env.example` in `backend/` to `.env` (or configure your shell environment variables):
   ```properties
   SPRING_DATASOURCE_URL=jdbc:postgresql://db.YOUR_PROJECT_REF.supabase.co:5432/postgres?sslmode=require
   SPRING_DATASOURCE_USERNAME=postgres
   SPRING_DATASOURCE_PASSWORD=YOUR_SUPABASE_PASSWORD
   SPRING_DATASOURCE_DRIVER=org.postgresql.Driver
   ```
2. In your Supabase Dashboard:
   - Navigate to the **SQL Editor**.
   - Open and execute `database/supabase_schema.sql` to initialize all 19 relational tables, constraints, foreign keys, and indexes.
   - Run `database/seed_data.sql` to populate initial MLRIT records.
3. Restart Spring Boot. It will connect directly to Supabase via standard PostgreSQL JDBC.

---

## 🛡️ Security & Audit Logging Rules

1. **Server-Side RBAC Enforcement**:
   - `ROLE_STUDENT`: Restricted strictly to `/api/student/**`.
   - `ROLE_FACULTY`: Restricted strictly to `/api/faculty/**`.
   - `ROLE_ADMIN`: Restricted strictly to `/api/admin/**` and `/api/audit-logs/**`.
   - Any client-side bypass attempt receives HTTP `403 Forbidden` / `401 Unauthorized` directly from Spring Security.
2. **Audit Trail for Marks & Fees**:
   - Every mark entry, grade modification, fee payment, fee structure edit, and exam result publication generates an immutable row in the `audit_logs` table.
   - Captures: `actor_username`, `actor_role`, `entity_type`, `entity_id`, `action`, `old_value` (JSON), `new_value` (JSON), `reason`, `ip_address`, and `created_at`.
   - Viewable with a before-and-after diff inspector in the Admin portal under **Audit Trail Logs**.
3. **Password Security**:
   - Passwords are encrypted with BCrypt (strength factor 10) before persisting to the database.
   - Zero hardcoded plaintext credentials.
