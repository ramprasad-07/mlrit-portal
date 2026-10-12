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
        if (userRepository.findByUsernameIgnoreCase("24R21A05B7").isEmpty()) {
            User stuUser = new User(
                    null,
                    "24R21A05B7",
                    "24r21a05b7@student.mlrit.ac.in",
                    passwordEncoder.encode("Student@123"),
                    Role.STUDENT,
                    "MLRIT Student (24R21A05B7)",
                    "9849099999",
                    true
            );
            stuUser = userRepository.save(stuUser);

            StudentProfile stuProf = new StudentProfile(
                    null,
                    stuUser,
                    "24R21A05B7",
                    "CSE",
                    "B.Tech Computer Science & Engineering",
                    "2024-2028",
                    3,
                    "B",
                    new BigDecimal("8.75"),
                    48,
                    "CONVENER"
            );
            stuProf = studentRepository.save(stuProf);

            List<Course> courses = courseRepository.findAll();
            for (Course course : courses) {
                enrollmentRepository.save(new CourseEnrollment(null, stuProf, course, "2026-27", 3, "ENROLLED"));
            }
            System.out.println(">>> Seeded student account: 24R21A05B7");
        }
    }
}
