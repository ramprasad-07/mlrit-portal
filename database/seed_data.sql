-- ====================================================================
-- MLR Institute of Technology (MLRIT) Unified Portal - Seed Data
-- ====================================================================

-- 1. Insert Users (BCrypt hashed for Password@123 / Admin@123 / Student@123 / Faculty@123)
-- BCrypt hash for "Password@123" is: $2a$10$wK7.0YmC9EfxP9r3k0pWk.zV6Z3bJ4Sg/aG1Xy4Z8Vq8K.9J2lC1i
INSERT INTO users (id, username, email, password_hash, role, full_name, phone, is_active)
VALUES 
  (1, 'admin', 'admin@mlrit.ac.in', '$2a$10$wK7.0YmC9EfxP9r3k0pWk.zV6Z3bJ4Sg/aG1Xy4Z8Vq8K.9J2lC1i', 'ADMIN', 'Dean & Portal Administrator', '9849012345', true),
  (2, 'MLRIT-FAC-101', 'srinivas.k@mlrit.ac.in', '$2a$10$wK7.0YmC9EfxP9r3k0pWk.zV6Z3bJ4Sg/aG1Xy4Z8Vq8K.9J2lC1i', 'FACULTY', 'Dr. K. Srinivas Rao', '9849023456', true),
  (3, 'MLRIT-FAC-102', 'radhika.p@mlrit.ac.in', '$2a$10$wK7.0YmC9EfxP9r3k0pWk.zV6Z3bJ4Sg/aG1Xy4Z8Vq8K.9J2lC1i', 'FACULTY', 'Prof. P. Radhika', '9849034567', true),
  (4, '21R21A0501', 'rahul.sharma@student.mlrit.ac.in', '$2a$10$wK7.0YmC9EfxP9r3k0pWk.zV6Z3bJ4Sg/aG1Xy4Z8Vq8K.9J2lC1i', 'STUDENT', 'Rahul Sharma', '9849045678', true),
  (5, '21R21A0502', 'sneha.reddy@student.mlrit.ac.in', '$2a$10$wK7.0YmC9EfxP9r3k0pWk.zV6Z3bJ4Sg/aG1Xy4Z8Vq8K.9J2lC1i', 'STUDENT', 'Sneha Reddy', '9849056789', true)
ON CONFLICT (username) DO NOTHING;

-- 2. Student Profiles
INSERT INTO student_profiles (user_id, hall_ticket_no, department, branch, batch_year, current_semester, section, current_cgpa, total_credits, fee_category)
VALUES
  (4, '21R21A0501', 'CSE', 'B.Tech Computer Science & Engineering', '2022-2026', 5, 'A', 8.45, 96, 'CONVENER'),
  (5, '21R21A0502', 'CSE', 'B.Tech Computer Science & Engineering', '2022-2026', 5, 'A', 8.90, 96, 'CONVENER')
ON CONFLICT (hall_ticket_no) DO NOTHING;

-- 3. Faculty Profiles
INSERT INTO faculty_profiles (user_id, employee_id, department, designation, qualification, cabin_no)
VALUES
  (2, 'MLRIT-FAC-101', 'CSE', 'Professor & Head of Department', 'Ph.D. in Computer Science (IIT Madras)', 'Cabin 204, Ramanujan Block'),
  (3, 'MLRIT-FAC-102', 'CSE', 'Associate Professor', 'M.Tech, Ph.D (Pursuing - JNTUH)', 'Cabin 209, Ramanujan Block')
ON CONFLICT (employee_id) DO NOTHING;

-- 4. Courses
INSERT INTO courses (id, code, title, department, semester, credits, description, syllabus_url)
VALUES
  (1, 'CS501PC', 'Software Engineering & Agile Methodologies', 'CSE', 5, 3, 'Principles of SDLC, Agile Scrum sprints, UML modeling, testing & software metrics.', 'https://mlrit.ac.in/syllabus/cs501pc.pdf'),
  (2, 'CS502PC', 'Computer Networks & Protocols', 'CSE', 5, 4, 'OSI and TCP/IP protocol suite, routing algorithms, socket programming, network security.', 'https://mlrit.ac.in/syllabus/cs502pc.pdf'),
  (3, 'CS503PC', 'Full-Stack Web Technologies', 'CSE', 5, 3, 'Modern React, TypeScript, Spring Boot, REST APIs, PostgreSQL and authentication paradigms.', 'https://mlrit.ac.in/syllabus/cs503pc.pdf'),
  (4, 'CS504PE', 'Machine Learning & Neural Networks', 'CSE', 5, 3, 'Supervised & unsupervised learning, classification, gradient descent, deep networks.', 'https://mlrit.ac.in/syllabus/cs504pe.pdf')
ON CONFLICT (code) DO NOTHING;

-- 5. Allocations
INSERT INTO faculty_course_allocations (faculty_id, course_id, section, academic_year)
VALUES
  (1, 1, 'A', '2026-27'),
  (1, 3, 'A', '2026-27'),
  (2, 2, 'A', '2026-27'),
  (2, 4, 'A', '2026-27')
ON CONFLICT DO NOTHING;

-- 6. Enrollments
INSERT INTO course_enrollments (student_id, course_id, academic_year, semester, status)
VALUES
  (1, 1, '2026-27', 5, 'ENROLLED'),
  (1, 2, '2026-27', 5, 'ENROLLED'),
  (1, 3, '2026-27', 5, 'ENROLLED'),
  (1, 4, '2026-27', 5, 'ENROLLED'),
  (2, 1, '2026-27', 5, 'ENROLLED'),
  (2, 2, '2026-27', 5, 'ENROLLED'),
  (2, 3, '2026-27', 5, 'ENROLLED'),
  (2, 4, '2026-27', 5, 'ENROLLED')
ON CONFLICT DO NOTHING;

-- 7. Fee Structure
INSERT INTO fee_structures (academic_year, department, category, tuition_fee, special_fee, exam_fee, bus_fee, hostel_fee, total_amount)
VALUES
  ('2026-27', 'CSE', 'CONVENER', 100000.00, 10000.00, 5000.00, 0.00, 0.00, 115000.00)
ON CONFLICT DO NOTHING;

-- 8. Fee Payments
INSERT INTO fee_payments (student_id, receipt_no, amount_paid, payment_date, payment_mode, reference_id, fee_type, status, recorded_by)
VALUES
  (1, 'MLRIT-REC-2601', 65000.00, CURRENT_DATE - INTERVAL '60 days', 'UPI', 'UPI-HDFC-991823', 'Tuition Fee (Installment 1)', 'SUCCESS', 1),
  (2, 'MLRIT-REC-2602', 115000.00, CURRENT_DATE - INTERVAL '90 days', 'NET_BANKING', 'NEFT-SBIN-882736', 'Full Annual Fee', 'SUCCESS', 1)
ON CONFLICT DO NOTHING;

-- 9. Notices
INSERT INTO notices (title, content, category, target_audience, is_pinned, created_by)
VALUES
  ('MID-1 Examination Schedule & Hall Ticket Verification Notification', 'The B.Tech V Semester MID-1 Examinations will commence from 15th October 2026. Students must ensure minimum 75% attendance to download admit cards.', 'EXAM', 'ALL', true, 1),
  ('Annual Technical Symposium & Hackathon - INNOVISION 2026', 'MLRIT is thrilled to announce INNOVISION 2026. Register teams for National Hackathon with prizes worth INR 3 Lakhs by end of week.', 'EVENTS', 'ALL', true, 1),
  ('Academic Tuition Fee Installment-2 Due Date Circular', 'Students with outstanding fee balances are requested to clear dues by 25th October 2026 via the online portal or accounts desk to avoid late penalties.', 'FEES', 'STUDENT', false, 1);

-- 10. Audit Logs
INSERT INTO audit_logs (actor_username, actor_role, entity_type, entity_id, action, old_value, new_value, reason, ip_address)
VALUES
  ('MLRIT-FAC-101', 'FACULTY', 'MARKS', 1, 'CREATE', 'null', '{"internal": 28.00, "external": 0.00, "total": 28.00, "grade": "O"}', 'Mid-1 marks evaluation submitted for CS503PC', '192.168.1.104'),
  ('admin', 'ADMIN', 'FEE_PAYMENT', 1, 'CREATE', 'null', '{"receipt": "MLRIT-REC-2601", "amount": 65000.00, "student": "21R21A0501", "mode": "UPI"}', 'Tuition fee installment payment recorded at accounts counter', '192.168.1.10'),
  ('admin', 'ADMIN', 'RESULT_PUBLISH', 1, 'PUBLISH', '{"published": false}', '{"published": true}', 'Mid-1 Semester Results published for College View', '192.168.1.10');
