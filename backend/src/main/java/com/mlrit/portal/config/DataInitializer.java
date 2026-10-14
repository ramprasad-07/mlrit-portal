package com.mlrit.portal.config;

import com.mlrit.portal.model.*;
import com.mlrit.portal.repository.*;
import com.mlrit.portal.service.AuditLogService;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentRepository;
    private final FacultyProfileRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final FacultyCourseAllocationRepository allocationRepository;
    private final CourseEnrollmentRepository enrollmentRepository;
    private final CourseModuleRepository moduleRepository;
    private final CourseMaterialRepository materialRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final AttendanceRecordRepository attendanceRepository;
    private final ExamRepository examRepository;
    private final MarkRecordRepository markRepository;
    private final StudentSemesterGpaRepository gpaRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final TimetableRepository timetableRepository;
    private final NoticeRepository noticeRepository;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(
            UserRepository userRepository,
            StudentProfileRepository studentRepository,
            FacultyProfileRepository facultyRepository,
            CourseRepository courseRepository,
            FacultyCourseAllocationRepository allocationRepository,
            CourseEnrollmentRepository enrollmentRepository,
            CourseModuleRepository moduleRepository,
            CourseMaterialRepository materialRepository,
            AssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository submissionRepository,
            AttendanceRecordRepository attendanceRepository,
            ExamRepository examRepository,
            MarkRecordRepository markRepository,
            StudentSemesterGpaRepository gpaRepository,
            FeeStructureRepository feeStructureRepository,
            FeePaymentRepository feePaymentRepository,
            TimetableRepository timetableRepository,
            NoticeRepository noticeRepository,
            AuditLogService auditLogService,
            PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.courseRepository = courseRepository;
        this.allocationRepository = allocationRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.moduleRepository = moduleRepository;
        this.materialRepository = materialRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.attendanceRepository = attendanceRepository;
        this.examRepository = examRepository;
        this.markRepository = markRepository;
        this.gpaRepository = gpaRepository;
        this.feeStructureRepository = feeStructureRepository;
        this.feePaymentRepository = feePaymentRepository;
        this.timetableRepository = timetableRepository;
        this.noticeRepository = noticeRepository;
        this.auditLogService = auditLogService;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (userRepository.count() > 0) {
            seedAdditionalAccountsIfMissing();
            return;
        }

        System.out.println(">>> Initializing MLRIT Portal Seed Data...");

        // 1. ADMIN USER
        User adminUser = new User(
                null,
                "admin",
                "admin@mlrit.ac.in",
                passwordEncoder.encode("Admin@123"),
                Role.ADMIN,
                "Dean & Portal Administrator",
                "9849012345",
                true
        );
        adminUser = userRepository.save(adminUser);

        // 2. FACULTY USERS & PROFILES
        User facUser1 = new User(
                null,
                "MLRIT-FAC-101",
                "srinivas.k@mlrit.ac.in",
                passwordEncoder.encode("Faculty@123"),
                Role.FACULTY,
                "Dr. K. Srinivas Rao",
                "9849023456",
                true
        );
        facUser1 = userRepository.save(facUser1);

        FacultyProfile facProf1 = new FacultyProfile(
                null,
                facUser1,
                "MLRIT-FAC-101",
                "CSE",
                "Professor & Head of Department",
                "Ph.D. in Computer Science (IIT Madras)",
                "Cabin 204, Ramanujan Block"
        );
        facProf1 = facultyRepository.save(facProf1);

        User facUser2 = new User(
                null,
                "MLRIT-FAC-102",
                "radhika.p@mlrit.ac.in",
                passwordEncoder.encode("Faculty@123"),
                Role.FACULTY,
                "Prof. P. Radhika",
                "9849034567",
                true
        );
        facUser2 = userRepository.save(facUser2);

        FacultyProfile facProf2 = new FacultyProfile(
                null,
                facUser2,
                "MLRIT-FAC-102",
                "CSE",
                "Associate Professor",
                "M.Tech, Ph.D (Pursuing - JNTUH)",
                "Cabin 209, Ramanujan Block"
        );
        facProf2 = facultyRepository.save(facProf2);

        // 3. STUDENT USERS & PROFILES
        User stuUser1 = new User(
                null,
                "21R21A0501",
                "rahul.sharma@student.mlrit.ac.in",
                passwordEncoder.encode("Student@123"),
                Role.STUDENT,
                "Rahul Sharma",
                "9849045678",
                true
        );
        stuUser1 = userRepository.save(stuUser1);

        StudentProfile stuProf1 = new StudentProfile(
                null,
                stuUser1,
                "21R21A0501",
                "CSE",
                "B.Tech Computer Science & Engineering",
                "2022-2026",
                5,
                "A",
                new BigDecimal("8.45"),
                96,
                "CONVENER"
        );
        stuProf1 = studentRepository.save(stuProf1);

        User stuUser2 = new User(
                null,
                "21R21A0502",
                "sneha.reddy@student.mlrit.ac.in",
                passwordEncoder.encode("Student@123"),
                Role.STUDENT,
                "Sneha Reddy",
                "9849056789",
                true
        );
        stuUser2 = userRepository.save(stuUser2);

        StudentProfile stuProf2 = new StudentProfile(
                null,
                stuUser2,
                "21R21A0502",
                "CSE",
                "B.Tech Computer Science & Engineering",
                "2022-2026",
                5,
                "A",
                new BigDecimal("8.92"),
                96,
                "CONVENER"
        );
        stuProf2 = studentRepository.save(stuProf2);

        // 4. COURSES
        Course c1 = courseRepository.save(new Course(
                null, "CS501PC", "Software Engineering & Agile Methodologies", "CSE", 5, 3,
                "Principles of SDLC, Agile Scrum sprints, UML modeling, testing & software metrics.",
                "https://mlrit.ac.in/syllabus/cs501pc.pdf"
        ));
        Course c2 = courseRepository.save(new Course(
                null, "CS502PC", "Computer Networks & Protocols", "CSE", 5, 4,
                "OSI and TCP/IP protocol suite, routing algorithms, socket programming, network security.",
                "https://mlrit.ac.in/syllabus/cs502pc.pdf"
        ));
        Course c3 = courseRepository.save(new Course(
                null, "CS503PC", "Full-Stack Web Technologies", "CSE", 5, 3,
                "Modern React, TypeScript, Spring Boot, REST APIs, PostgreSQL and authentication paradigms.",
                "https://mlrit.ac.in/syllabus/cs503pc.pdf"
        ));
        Course c4 = courseRepository.save(new Course(
                null, "CS504PE", "Machine Learning & Neural Networks", "CSE", 5, 3,
                "Supervised & unsupervised learning, classification, gradient descent, deep networks.",
                "https://mlrit.ac.in/syllabus/cs504pe.pdf"
        ));

        // 5. ALLOCATIONS & ENROLLMENTS
        allocationRepository.save(new FacultyCourseAllocation(null, facProf1, c1, "A", "2026-27"));
        allocationRepository.save(new FacultyCourseAllocation(null, facProf1, c3, "A", "2026-27"));
        allocationRepository.save(new FacultyCourseAllocation(null, facProf2, c2, "A", "2026-27"));
        allocationRepository.save(new FacultyCourseAllocation(null, facProf2, c4, "A", "2026-27"));

        enrollmentRepository.save(new CourseEnrollment(null, stuProf1, c1, "2026-27", 5, "ENROLLED"));
        enrollmentRepository.save(new CourseEnrollment(null, stuProf1, c2, "2026-27", 5, "ENROLLED"));
        enrollmentRepository.save(new CourseEnrollment(null, stuProf1, c3, "2026-27", 5, "ENROLLED"));
        enrollmentRepository.save(new CourseEnrollment(null, stuProf1, c4, "2026-27", 5, "ENROLLED"));

        enrollmentRepository.save(new CourseEnrollment(null, stuProf2, c1, "2026-27", 5, "ENROLLED"));
        enrollmentRepository.save(new CourseEnrollment(null, stuProf2, c2, "2026-27", 5, "ENROLLED"));
        enrollmentRepository.save(new CourseEnrollment(null, stuProf2, c3, "2026-27", 5, "ENROLLED"));
        enrollmentRepository.save(new CourseEnrollment(null, stuProf2, c4, "2026-27", 5, "ENROLLED"));

        // 6. LMS MODULES & MATERIALS
        CourseModule m1 = moduleRepository.save(new CourseModule(
                null, c3, "Module 1: Modern Frontend Architecture with React & Tailwind",
                "Components, React hooks, state management, responsive designs.", 1
        ));
        CourseModule m2 = moduleRepository.save(new CourseModule(
                null, c3, "Module 2: Enterprise Backend with Spring Boot & REST APIs",
                "Spring controllers, JPA entities, security filters, JWT authentication.", 2
        ));

        materialRepository.save(new CourseMaterial(
                null, m1, "Lecture 1: Modern React 19 Component Lifecycle & State", "PDF",
                "https://mlrit.ac.in/materials/cs503-lecture1.pdf", facProf1
        ));
        materialRepository.save(new CourseMaterial(
                null, m1, "Reference: Tailwind CSS Utility Guide & UI Best Practices", "NOTES",
                "https://mlrit.ac.in/materials/tailwind-guide.notes", facProf1
        ));
        materialRepository.save(new CourseMaterial(
                null, m2, "Lecture 2: Spring Boot Architecture & JPA Repository Patterns", "PDF",
                "https://mlrit.ac.in/materials/cs503-spring-boot.pdf", facProf1
        ));

        // 7. ASSIGNMENTS
        Assignment a1 = assignmentRepository.save(new Assignment(
                null, c3, "A", "Lab Project 1: RESTful Student Management API",
                "Implement a Spring Boot service with JPA CRUD endpoints, validation, and unit tests.",
                LocalDateTime.now().plusDays(5), 10, facProf1
        ));
        Assignment a2 = assignmentRepository.save(new Assignment(
                null, c1, "A", "SRS Document: Campus Automated Attendance System",
                "Draft complete IEEE 830 compliant SRS including UML use-case and sequence diagrams.",
                LocalDateTime.now().plusDays(9), 10, facProf1
        ));

        // 8. SUBMISSIONS
        AssignmentSubmission sub1 = new AssignmentSubmission(
                null, a1, stuProf1,
                "Implemented Spring Boot REST controller with full validation and exception handling.",
                "https://github.com/rahul-mlrit/student-api-project"
        );
        sub1.setStatus("GRADED");
        sub1.setMarksObtained(new BigDecimal("9.5"));
        sub1.setFeedback("Excellent code structure, robust validation and clear test coverage.");
        sub1.setGradedBy(facProf1);
        sub1.setGradedAt(LocalDateTime.now().minusDays(1));
        submissionRepository.save(sub1);

        // 9. ATTENDANCE SEEDING
        LocalDate today = LocalDate.now();
        for (int i = 1; i <= 15; i++) {
            LocalDate date = today.minusDays(i * 2L);
            attendanceRepository.save(new AttendanceRecord(null, stuProf1, c1, date, 1, "PRESENT", facProf1));
            attendanceRepository.save(new AttendanceRecord(null, stuProf1, c2, date, 2, i % 5 == 0 ? "ABSENT" : "PRESENT", facProf2));
            attendanceRepository.save(new AttendanceRecord(null, stuProf1, c3, date, 3, "PRESENT", facProf1));
            attendanceRepository.save(new AttendanceRecord(null, stuProf1, c4, date, 4, "PRESENT", facProf2));

            attendanceRepository.save(new AttendanceRecord(null, stuProf2, c1, date, 1, "PRESENT", facProf1));
            attendanceRepository.save(new AttendanceRecord(null, stuProf2, c2, date, 2, "PRESENT", facProf2));
            attendanceRepository.save(new AttendanceRecord(null, stuProf2, c3, date, 3, "PRESENT", facProf1));
            attendanceRepository.save(new AttendanceRecord(null, stuProf2, c4, date, 4, "PRESENT", facProf2));
        }

        // 10. EXAMS & MARKS
        Exam mid1 = examRepository.save(new Exam(null, "MID-1 Examinations", 5, "2026-27", true));
        Exam mid2 = examRepository.save(new Exam(null, "MID-2 Examinations", 5, "2026-27", false));

        MarkRecord mr1 = markRepository.save(new MarkRecord(
                null, stuProf1, c1, mid1, new BigDecimal("26.50"), new BigDecimal("0.00"),
                new BigDecimal("26.50"), "A+", 9, "PUBLISHED", facProf1
        ));
        MarkRecord mr2 = markRepository.save(new MarkRecord(
                null, stuProf1, c2, mid1, new BigDecimal("24.00"), new BigDecimal("0.00"),
                new BigDecimal("24.00"), "A", 8, "PUBLISHED", facProf2
        ));
        MarkRecord mr3 = markRepository.save(new MarkRecord(
                null, stuProf1, c3, mid1, new BigDecimal("28.00"), new BigDecimal("0.00"),
                new BigDecimal("28.00"), "O", 10, "PUBLISHED", facProf1
        ));
        MarkRecord mr4 = markRepository.save(new MarkRecord(
                null, stuProf1, c4, mid1, new BigDecimal("25.50"), new BigDecimal("0.00"),
                new BigDecimal("25.50"), "A+", 9, "PUBLISHED", facProf2
        ));

        // 11. SGPA HISTORY
        gpaRepository.save(new StudentSemesterGpa(null, stuProf1, 1, new BigDecimal("8.20"), new BigDecimal("8.20"), 20, 20, true));
        gpaRepository.save(new StudentSemesterGpa(null, stuProf1, 2, new BigDecimal("8.40"), new BigDecimal("8.30"), 20, 20, true));
        gpaRepository.save(new StudentSemesterGpa(null, stuProf1, 3, new BigDecimal("8.60"), new BigDecimal("8.40"), 22, 22, true));
        gpaRepository.save(new StudentSemesterGpa(null, stuProf1, 4, new BigDecimal("8.55"), new BigDecimal("8.45"), 22, 22, true));

        // 12. FEE STRUCTURE & PAYMENTS
        FeeStructure fs = feeStructureRepository.save(new FeeStructure(
                null, "2026-27", "CSE", "CONVENER",
                new BigDecimal("100000.00"), new BigDecimal("10000.00"), new BigDecimal("5000.00"),
                BigDecimal.ZERO, BigDecimal.ZERO, new BigDecimal("115000.00")
        ));

        FeePayment p1 = feePaymentRepository.save(new FeePayment(
                null, stuProf1, "MLRIT-REC-2601", new BigDecimal("65000.00"),
                LocalDate.now().minusMonths(2), "UPI", "UPI-HDFC-991823", "Tuition Fee (Installment 1)", "SUCCESS", adminUser
        ));
        FeePayment p2 = feePaymentRepository.save(new FeePayment(
                null, stuProf2, "MLRIT-REC-2602", new BigDecimal("115000.00"),
                LocalDate.now().minusMonths(3), "NET_BANKING", "NEFT-SBIN-882736", "Full Annual Fee", "SUCCESS", adminUser
        ));

        // 13. TIMETABLE
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "MONDAY", LocalTime.of(9, 30), LocalTime.of(10, 30), c1, facProf1, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "MONDAY", LocalTime.of(10, 30), LocalTime.of(11, 30), c2, facProf2, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "MONDAY", LocalTime.of(11, 45), LocalTime.of(12, 45), c3, facProf1, "Computer Lab 4"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "MONDAY", LocalTime.of(13, 30), LocalTime.of(15, 30), c4, facProf2, "AI & ML Lab"));

        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "TUESDAY", LocalTime.of(9, 30), LocalTime.of(10, 30), c3, facProf1, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "TUESDAY", LocalTime.of(10, 30), LocalTime.of(11, 30), c4, facProf2, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "TUESDAY", LocalTime.of(11, 45), LocalTime.of(12, 45), c1, facProf1, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "TUESDAY", LocalTime.of(13, 30), LocalTime.of(15, 30), c2, facProf2, "Systems Lab 2"));

        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "WEDNESDAY", LocalTime.of(9, 30), LocalTime.of(10, 30), c2, facProf2, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "WEDNESDAY", LocalTime.of(10, 30), LocalTime.of(11, 30), c1, facProf1, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "WEDNESDAY", LocalTime.of(11, 45), LocalTime.of(12, 45), c4, facProf2, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "WEDNESDAY", LocalTime.of(13, 30), LocalTime.of(15, 30), c3, facProf1, "Web Tech Lab 3"));

        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "THURSDAY", LocalTime.of(9, 30), LocalTime.of(10, 30), c4, facProf2, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "THURSDAY", LocalTime.of(10, 30), LocalTime.of(11, 30), c3, facProf1, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "THURSDAY", LocalTime.of(11, 45), LocalTime.of(12, 45), c2, facProf2, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "THURSDAY", LocalTime.of(13, 30), LocalTime.of(14, 30), c1, facProf1, "L-201"));

        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "FRIDAY", LocalTime.of(9, 30), LocalTime.of(10, 30), c1, facProf1, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "FRIDAY", LocalTime.of(10, 30), LocalTime.of(11, 30), c2, facProf2, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "FRIDAY", LocalTime.of(11, 45), LocalTime.of(12, 45), c3, facProf1, "L-201"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "FRIDAY", LocalTime.of(13, 30), LocalTime.of(15, 30), c4, facProf2, "Center of Excellence Lab"));

        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "SATURDAY", LocalTime.of(9, 30), LocalTime.of(10, 30), c3, facProf1, "Innovation Hub"));
        timetableRepository.save(new Timetable(null, "CSE", 5, "A", "SATURDAY", LocalTime.of(10, 30), LocalTime.of(11, 30), c4, facProf2, "Seminar Hall 1"));

        // 14. NOTICES
        noticeRepository.save(new Notice(
                null, "MID-1 Examination Schedule & Hall Ticket Verification Notification",
                "The B.Tech V Semester MID-1 Examinations will commence from 15th October 2026. Students must ensure minimum 75% attendance to download admit cards.",
                "EXAM", "ALL", true, adminUser
        ));
        noticeRepository.save(new Notice(
                null, "Annual Technical Symposium & Hackathon - INNOVISION 2026",
                "MLRIT is thrilled to announce INNOVISION 2026. Register teams for National Hackathon with prizes worth INR 3 Lakhs by end of week.",
                "EVENTS", "ALL", true, adminUser
        ));
        noticeRepository.save(new Notice(
                null, "Academic Tuition Fee Installment-2 Due Date Circular",
                "Students with outstanding fee balances are requested to clear dues by 25th October 2026 via the online portal or accounts desk to avoid late penalties.",
                "FEES", "STUDENT", false, adminUser
        ));

        // 15. AUDIT LOGS (SEED DEMO AUDIT RECORDS)
        auditLogService.log(
                "MLRIT-FAC-101", "FACULTY", "MARKS", mr3.getId(), "CREATE", "null",
                "{\"internal\": 28.00, \"external\": 0.00, \"total\": 28.00, \"grade\": \"O\"}",
                "Mid-1 marks evaluation submitted for CS503PC", "192.168.1.104"
        );
        auditLogService.log(
                "admin", "ADMIN", "FEE_PAYMENT", p1.getId(), "CREATE", "null",
                "{\"receipt\": \"MLRIT-REC-2601\", \"amount\": 65000.00, \"student\": \"21R21A0501\", \"mode\": \"UPI\"}",
                "Tuition fee installment payment recorded at accounts counter", "192.168.1.10"
        );
        auditLogService.log(
                "admin", "ADMIN", "RESULT_PUBLISH", mid1.getId(), "PUBLISH",
                "{\"published\": false}", "{\"published\": true}",
                "Mid-1 Semester Results published for College View", "192.168.1.10"
        );

        System.out.println(">>> MLRIT Portal Seed Data initialized successfully!");
    }

    private void seedAdditionalAccountsIfMissing() {
        // 10 Students across CSE, CSE-AIML, ECE, MECH, CIVIL
        seedStudentIfMissing("21R21A0501", "rahul.sharma@student.mlrit.ac.in", "Rahul Sharma", "CSE", "B.Tech Computer Science & Engineering", "2022-2026", 5, "A", "8.45", 96);
        seedStudentIfMissing("21R21A0502", "sneha.reddy@student.mlrit.ac.in", "Sneha Reddy", "CSE", "B.Tech Computer Science & Engineering", "2022-2026", 5, "A", "8.92", 96);
        seedStudentIfMissing("24R21A05B7", "24r21a05b7@student.mlrit.ac.in", "Ram Charan", "CSE", "B.Tech Computer Science & Engineering", "2024-2028", 3, "B", "8.75", 48);
        seedStudentIfMissing("22R21A6601", "aarav.patel@student.mlrit.ac.in", "Aarav Patel", "CSE-AIML", "B.Tech Artificial Intelligence & Machine Learning", "2022-2026", 5, "A", "9.10", 96);
        seedStudentIfMissing("22R21A6602", "divya.teja@student.mlrit.ac.in", "Divya Teja", "CSE-AIML", "B.Tech Artificial Intelligence & Machine Learning", "2022-2026", 5, "B", "8.65", 96);
        seedStudentIfMissing("22R21A0401", "vikas.verma@student.mlrit.ac.in", "Vikas Verma", "ECE", "B.Tech Electronics & Communication Engineering", "2022-2026", 5, "A", "8.30", 96);
        seedStudentIfMissing("22R21A0402", "ananya.rao@student.mlrit.ac.in", "Ananya Rao", "ECE", "B.Tech Electronics & Communication Engineering", "2022-2026", 5, "B", "8.85", 96);
        seedStudentIfMissing("23R21A0301", "karthik.naidu@student.mlrit.ac.in", "Karthik Naidu", "MECH", "B.Tech Mechanical Engineering", "2023-2027", 3, "A", "7.95", 48);
        seedStudentIfMissing("23R21A0302", "rohit.goud@student.mlrit.ac.in", "Rohit Goud", "MECH", "B.Tech Mechanical Engineering", "2023-2027", 3, "B", "8.15", 48);
        seedStudentIfMissing("23R21A0101", "pooja.hegde@student.mlrit.ac.in", "Pooja Hegde", "CIVIL", "B.Tech Civil Engineering", "2023-2027", 3, "A", "8.55", 48);

        // 10 Faculty across CSE, CSE-AIML, ECE, MECH, CIVIL
        seedFacultyIfMissing("MLRIT-FAC-101", "srinivas.k@mlrit.ac.in", "Dr. K. Srinivas Rao", "CSE", "Professor & Head of Department", "Ph.D. in Computer Science (IIT Madras)", "Cabin 204, Ramanujan Block");
        seedFacultyIfMissing("MLRIT-FAC-102", "radhika.p@mlrit.ac.in", "Prof. P. Radhika", "CSE", "Associate Professor", "M.Tech, Ph.D (Pursuing - JNTUH)", "Cabin 209, Ramanujan Block");
        seedFacultyIfMissing("MLRIT-FAC-103", "suresh.m@mlrit.ac.in", "Dr. M. Suresh", "CSE", "Professor", "Ph.D. (NIT Warangal)", "Cabin 210, Ramanujan Block");
        seedFacultyIfMissing("MLRIT-FAC-104", "anusha.ch@mlrit.ac.in", "Dr. Ch. Anusha", "CSE-AIML", "Associate Professor & HOD", "Ph.D. in AI (JNTUH)", "Cabin 301, Aryabhata Block");
        seedFacultyIfMissing("MLRIT-FAC-105", "mahesh.v@mlrit.ac.in", "Prof. V. Mahesh", "CSE-AIML", "Assistant Professor", "M.Tech in Machine Learning", "Cabin 305, Aryabhata Block");
        seedFacultyIfMissing("MLRIT-FAC-106", "ramanjaneyulu.b@mlrit.ac.in", "Dr. B. Ramanjaneyulu", "ECE", "Professor & Head of Department", "Ph.D. (Osmania University)", "Cabin 102, Visvesvaraya Block");
        seedFacultyIfMissing("MLRIT-FAC-107", "lavanya.s@mlrit.ac.in", "Prof. S. Lavanya", "ECE", "Associate Professor", "M.Tech VLSI Design", "Cabin 108, Visvesvaraya Block");
        seedFacultyIfMissing("MLRIT-FAC-108", "venkateshwarlu.g@mlrit.ac.in", "Dr. G. Venkateshwarlu", "MECH", "Professor & Head of Department", "Ph.D. (IIT Bombay)", "Cabin 401, Kalam Block");
        seedFacultyIfMissing("MLRIT-FAC-109", "sandeep.k@mlrit.ac.in", "Prof. K. Sandeep", "MECH", "Assistant Professor", "M.Tech Thermal Engg", "Cabin 405, Kalam Block");
        seedFacultyIfMissing("MLRIT-FAC-110", "vijaykumar.t@mlrit.ac.in", "Dr. T. Vijay Kumar", "CIVIL", "Professor & Head of Department", "Ph.D. (NIT Calicut)", "Cabin 501, CV Raman Block");

        // Ensure all student profiles have ERP attributes
        List<StudentProfile> allProfiles = studentRepository.findAll();
        for (StudentProfile p : allProfiles) {
            boolean updated = false;
            if (p.getFatherName() == null || p.getFatherName().isBlank()) {
                p.setFatherName("K. " + (p.getUser() != null ? p.getUser().getFullName().split(" ")[0] : "Ramesh") + " Sharma");
                updated = true;
            }
            if (p.getMotherName() == null || p.getMotherName().isBlank()) {
                p.setMotherName("K. Saraswathi Devi");
                updated = true;
            }
            if (p.getAadhaarNo() == null || p.getAadhaarNo().isBlank()) {
                p.setAadhaarNo("7849 2039 " + (1000 + (p.getId() != null ? p.getId() : 1) * 37));
                updated = true;
            }
            if (p.getApaarId() == null || p.getApaarId().isBlank()) {
                p.setApaarId("APAAR-2024-" + p.getHallTicketNo());
                updated = true;
            }
            if (p.getParentMobile() == null || p.getParentMobile().isBlank()) {
                p.setParentMobile("98480" + (10000 + (p.getId() != null ? p.getId() : 1) * 73));
                updated = true;
            }
            if (p.getAdmitDate() == null || p.getAdmitDate().isBlank()) {
                p.setAdmitDate(p.getBatchYear() != null && p.getBatchYear().contains("2024") ? "14-Aug-2024" : "18-Aug-2022");
                updated = true;
            }
            if (p.getDateOfBirth() == null || p.getDateOfBirth().isBlank()) {
                p.setDateOfBirth("15-Jun-2004");
                updated = true;
            }
            if (p.getCaste() == null || p.getCaste().isBlank()) {
                p.setCaste("BC-B");
                updated = true;
            }
            if (updated) {
                studentRepository.save(p);
            }
        }
    }

    private void seedStudentIfMissing(String roll, String email, String name, String dept, String branch, String batch, int sem, String sec, String cgpa, int credits) {
        if (userRepository.findByUsernameIgnoreCase(roll).isEmpty()) {
            User user = new User(null, roll, email, passwordEncoder.encode("Student@123"), Role.STUDENT, name, "98490" + (10000 + (int)(Math.random() * 89999)), true);
            user = userRepository.save(user);

            StudentProfile prof = new StudentProfile(null, user, roll, dept, branch, batch, sem, sec, new BigDecimal(cgpa), credits, "CONVENER");
            prof.setAdmitDate(batch.contains("2024") ? "14-Aug-2024" : "18-Aug-2022");
            prof.setDateOfBirth("15-Jun-2004");
            prof.setCaste("BC-B");
            prof.setFatherName("K. " + name.split(" ")[0] + " Sharma");
            prof.setMotherName("K. Saraswathi Devi");
            prof.setParentMobile("98480" + (10000 + (int)(Math.random() * 89999)));
            prof.setAadhaarNo("7849 2039 " + (1000 + (int)(Math.random() * 8999)));
            prof.setApaarId("APAAR-2024-" + roll);
            prof = studentRepository.save(prof);

            List<Course> courses = courseRepository.findAll();
            for (Course c : courses) {
                enrollmentRepository.save(new CourseEnrollment(null, prof, c, "2026-27", sem, "ENROLLED"));
            }
            System.out.println(">>> Seeded Student: " + roll + " - " + name + " (" + dept + ")");
        }
    }

    private void seedFacultyIfMissing(String empId, String email, String name, String dept, String desig, String qual, String cabin) {
        if (userRepository.findByUsernameIgnoreCase(empId).isEmpty()) {
            User user = new User(null, empId, email, passwordEncoder.encode("Faculty@123"), Role.FACULTY, name, "98490" + (10000 + (int)(Math.random() * 89999)), true);
            user = userRepository.save(user);

            FacultyProfile prof = new FacultyProfile(null, user, empId, dept, desig, qual, cabin);
            facultyRepository.save(prof);
            System.out.println(">>> Seeded Faculty: " + empId + " - " + name + " (" + dept + ")");
        }
    }
}
