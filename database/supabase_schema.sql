-- ====================================================================
-- MLR Institute of Technology (MLRIT) Unified Portal - Supabase Schema
-- Merged LMS (Moodle-style) + Exam/ERP System
-- Target: Supabase (PostgreSQL 15+)
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Drop existing tables if needed (in reverse dependency order)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS notices CASCADE;
DROP TABLE IF EXISTS timetables CASCADE;
DROP TABLE IF EXISTS fee_payments CASCADE;
DROP TABLE IF EXISTS fee_structures CASCADE;
DROP TABLE IF EXISTS student_semester_gpa CASCADE;
DROP TABLE IF EXISTS mark_records CASCADE;
DROP TABLE IF EXISTS exams CASCADE;
DROP TABLE IF EXISTS attendance_records CASCADE;
DROP TABLE IF EXISTS assignment_submissions CASCADE;
DROP TABLE IF EXISTS assignments CASCADE;
DROP TABLE IF EXISTS course_materials CASCADE;
DROP TABLE IF EXISTS course_modules CASCADE;
DROP TABLE IF EXISTS course_enrollments CASCADE;
DROP TABLE IF EXISTS faculty_course_allocations CASCADE;
DROP TABLE IF EXISTS courses CASCADE;
DROP TABLE IF EXISTS faculty_profiles CASCADE;
DROP TABLE IF EXISTS student_profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- 1. USERS TABLE
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,      -- Hall ticket for students, EmpId for faculty, admin email for admins
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('STUDENT', 'FACULTY', 'ADMIN')),
    full_name VARCHAR(100) NOT NULL,
    phone VARCHAR(20),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. STUDENT PROFILES
CREATE TABLE student_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    hall_ticket_no VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,           -- e.g., CSE, CSE-AIML, ECE, IT, MECH
    branch VARCHAR(100) NOT NULL,
    batch_year VARCHAR(20) NOT NULL,          -- e.g., 2022-2026
    current_semester INT NOT NULL DEFAULT 1,
    section VARCHAR(10) NOT NULL DEFAULT 'A',
    current_cgpa NUMERIC(4, 2) DEFAULT 0.00,
    total_credits INT DEFAULT 0,
    fee_category VARCHAR(50) DEFAULT 'CONVENER' CHECK (fee_category IN ('CONVENER', 'MANAGEMENT'))
);

-- 3. FACULTY PROFILES
CREATE TABLE faculty_profiles (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    department VARCHAR(50) NOT NULL,
    designation VARCHAR(50) NOT NULL,          -- e.g., Professor, Associate Professor, Assistant Professor
    qualification VARCHAR(100) NOT NULL,       -- e.g., Ph.D, M.Tech
    cabin_no VARCHAR(50)
);

-- 4. COURSES
CREATE TABLE courses (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(20) UNIQUE NOT NULL,          -- e.g., CS501PC, EC402PC
    title VARCHAR(150) NOT NULL,
    department VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    credits INT NOT NULL,
    description TEXT,
    syllabus_url VARCHAR(255)
);

-- 5. FACULTY ALLOCATIONS
CREATE TABLE faculty_course_allocations (
    id BIGSERIAL PRIMARY KEY,
    faculty_id BIGINT NOT NULL REFERENCES faculty_profiles(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    section VARCHAR(10) NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    UNIQUE(faculty_id, course_id, section, academic_year)
);

-- 6. COURSE ENROLLMENTS
CREATE TABLE course_enrollments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    academic_year VARCHAR(20) NOT NULL,
    semester INT NOT NULL,
    status VARCHAR(20) DEFAULT 'ENROLLED',
    UNIQUE(student_id, course_id, academic_year)
);

-- 7. COURSE MODULES (LMS)
CREATE TABLE course_modules (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    order_index INT NOT NULL DEFAULT 1
);

-- 8. COURSE MATERIALS (LMS)
CREATE TABLE course_materials (
    id BIGSERIAL PRIMARY KEY,
    module_id BIGINT NOT NULL REFERENCES course_modules(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('PDF', 'NOTES', 'PPT', 'LINK', 'VIDEO')),
    resource_url TEXT NOT NULL,
    uploaded_by BIGINT REFERENCES faculty_profiles(id),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. ASSIGNMENTS (LMS)
CREATE TABLE assignments (
    id BIGSERIAL PRIMARY KEY,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    section VARCHAR(10) NOT NULL,
    title VARCHAR(200) NOT NULL,
    instructions TEXT NOT NULL,
    due_date TIMESTAMP WITH TIME ZONE NOT NULL,
    max_marks INT NOT NULL DEFAULT 10,
    created_by BIGINT REFERENCES faculty_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. ASSIGNMENT SUBMISSIONS (LMS)
CREATE TABLE assignment_submissions (
    id BIGSERIAL PRIMARY KEY,
    assignment_id BIGINT NOT NULL REFERENCES assignments(id) ON DELETE CASCADE,
    student_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    content_text TEXT,
    attachment_url TEXT,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    status VARCHAR(20) DEFAULT 'SUBMITTED' CHECK (status IN ('SUBMITTED', 'GRADED', 'LATE')),
    marks_obtained NUMERIC(5, 2),
    feedback TEXT,
    graded_by BIGINT REFERENCES faculty_profiles(id),
    graded_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(assignment_id, student_id)
);

-- 11. ATTENDANCE RECORDS (ERP)
CREATE TABLE attendance_records (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL,
    period_slot INT NOT NULL,
    status VARCHAR(20) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'ON_DUTY')),
    marked_by BIGINT REFERENCES faculty_profiles(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, attendance_date, period_slot)
);

-- 12. EXAMS
CREATE TABLE exams (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,                 -- e.g., MID-1, MID-2, SEMESTER_END, LAB_INTERNAL
    semester INT NOT NULL,
    academic_year VARCHAR(20) NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    UNIQUE(name, semester, academic_year)
);

-- 13. MARK RECORDS (ERP/Exam)
CREATE TABLE mark_records (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    course_id BIGINT NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
    exam_id BIGINT NOT NULL REFERENCES exams(id) ON DELETE CASCADE,
    internal_marks NUMERIC(5, 2) DEFAULT 0.00,
    external_marks NUMERIC(5, 2) DEFAULT 0.00,
    total_marks NUMERIC(5, 2) DEFAULT 0.00,
    grade VARCHAR(5),                          -- O, A+, A, B+, B, C, F, AB
    grade_points INT DEFAULT 0,
    status VARCHAR(20) DEFAULT 'SUBMITTED' CHECK (status IN ('DRAFT', 'SUBMITTED', 'PUBLISHED')),
    entered_by BIGINT REFERENCES faculty_profiles(id),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, course_id, exam_id)
);

-- 14. STUDENT SEMESTER GPA (SGPA/CGPA history)
CREATE TABLE student_semester_gpa (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    semester INT NOT NULL,
    sgpa NUMERIC(4, 2) NOT NULL,
    cgpa NUMERIC(4, 2) NOT NULL,
    credits_registered INT NOT NULL,
    credits_earned INT NOT NULL,
    passed BOOLEAN DEFAULT TRUE,
    UNIQUE(student_id, semester)
);

-- 15. FEE STRUCTURES
CREATE TABLE fee_structures (
    id BIGSERIAL PRIMARY KEY,
    academic_year VARCHAR(20) NOT NULL,
    department VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('CONVENER', 'MANAGEMENT')),
    tuition_fee NUMERIC(10, 2) NOT NULL,
    special_fee NUMERIC(10, 2) DEFAULT 0.00,
    exam_fee NUMERIC(10, 2) DEFAULT 0.00,
    bus_fee NUMERIC(10, 2) DEFAULT 0.00,
    hostel_fee NUMERIC(10, 2) DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    UNIQUE(academic_year, department, category)
);

-- 16. FEE PAYMENTS & RECEIPTS
CREATE TABLE fee_payments (
    id BIGSERIAL PRIMARY KEY,
    student_id BIGINT NOT NULL REFERENCES student_profiles(id) ON DELETE CASCADE,
    receipt_no VARCHAR(50) UNIQUE NOT NULL,
    amount_paid NUMERIC(10, 2) NOT NULL,
    payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_mode VARCHAR(30) NOT NULL CHECK (payment_mode IN ('UPI', 'NET_BANKING', 'CARD', 'CASH', 'CHALLAN')),
    reference_id VARCHAR(100),
    fee_type VARCHAR(50) NOT NULL,             -- Tuition Fee, Exam Fee, Bus Fee, Special Fee
    status VARCHAR(20) DEFAULT 'SUCCESS' CHECK (status IN ('SUCCESS', 'PENDING', 'FAILED')),
    recorded_by BIGINT REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 17. TIMETABLES
CREATE TABLE timetables (
    id BIGSERIAL PRIMARY KEY,
    department VARCHAR(50) NOT NULL,
    semester INT NOT NULL,
    section VARCHAR(10) NOT NULL,
    day_of_week VARCHAR(20) NOT NULL CHECK (day_of_week IN ('MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY')),
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    course_id BIGINT REFERENCES courses(id),
    faculty_id BIGINT REFERENCES faculty_profiles(id),
    room_no VARCHAR(50) NOT NULL
);

-- 18. NOTICES & ANNOUNCEMENTS
CREATE TABLE notices (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(250) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('ACADEMIC', 'EXAM', 'FEES', 'EVENTS', 'CIRCULAR')),
    target_audience VARCHAR(20) NOT NULL CHECK (target_audience IN ('ALL', 'STUDENT', 'FACULTY')),
    is_pinned BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_by BIGINT REFERENCES users(id)
);

-- 19. AUDIT LOGS (MANDATORY REQUIREMENT: audit log for every marks or fee change)
CREATE TABLE audit_logs (
    id BIGSERIAL PRIMARY KEY,
    actor_username VARCHAR(50) NOT NULL,
    actor_role VARCHAR(20) NOT NULL,
    entity_type VARCHAR(50) NOT NULL CHECK (entity_type IN ('MARKS', 'FEE_PAYMENT', 'FEE_STRUCTURE', 'RESULT_PUBLISH', 'USER_MANAGEMENT')),
    entity_id BIGINT NOT NULL,
    action VARCHAR(50) NOT NULL CHECK (action IN ('CREATE', 'UPDATE', 'DELETE', 'PUBLISH')),
    old_value TEXT,
    new_value TEXT,
    reason VARCHAR(255),
    ip_address VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create helpful performance indexes
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_student_hallticket ON student_profiles(hall_ticket_no);
CREATE INDEX idx_faculty_empid ON faculty_profiles(employee_id);
CREATE INDEX idx_attendance_student ON attendance_records(student_id, course_id);
CREATE INDEX idx_mark_records_student ON mark_records(student_id, exam_id);
CREATE INDEX idx_fee_payments_student ON fee_payments(student_id);
CREATE INDEX idx_audit_logs_entity ON audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_actor ON audit_logs(actor_username);
