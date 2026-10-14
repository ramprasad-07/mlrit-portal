package com.mlrit.portal.service;

import com.mlrit.portal.dto.CreateFacultyRequest;
import com.mlrit.portal.dto.CreateStudentRequest;
import com.mlrit.portal.dto.FeePaymentRequest;
import com.mlrit.portal.dto.FeeStructureRequest;
import com.mlrit.portal.dto.PasswordResetRequest;
import com.mlrit.portal.model.*;
import com.mlrit.portal.repository.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class AdminService {

    private final UserRepository userRepository;
    private final StudentProfileRepository studentRepository;
    private final FacultyProfileRepository facultyRepository;
    private final CourseRepository courseRepository;
    private final FacultyCourseAllocationRepository allocationRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final ExamRepository examRepository;
    private final NoticeRepository noticeRepository;
    private final AuditLogService auditLogService;
    private final PasswordEncoder passwordEncoder;
    private final FacultyLeaveRepository facultyLeaveRepository;

    public AdminService(
            UserRepository userRepository,
            StudentProfileRepository studentRepository,
            FacultyProfileRepository facultyRepository,
            CourseRepository courseRepository,
            FacultyCourseAllocationRepository allocationRepository,
            FeeStructureRepository feeStructureRepository,
            FeePaymentRepository feePaymentRepository,
            ExamRepository examRepository,
            NoticeRepository noticeRepository,
            AuditLogService auditLogService,
            PasswordEncoder passwordEncoder,
            FacultyLeaveRepository facultyLeaveRepository) {
        this.userRepository = userRepository;
        this.studentRepository = studentRepository;
        this.facultyRepository = facultyRepository;
        this.courseRepository = courseRepository;
        this.allocationRepository = allocationRepository;
        this.feeStructureRepository = feeStructureRepository;
        this.feePaymentRepository = feePaymentRepository;
        this.examRepository = examRepository;
        this.noticeRepository = noticeRepository;
        this.auditLogService = auditLogService;
        this.passwordEncoder = passwordEncoder;
        this.facultyLeaveRepository = facultyLeaveRepository;
    }

    public List<StudentProfile> getAllStudents() {
        return studentRepository.findAll();
    }

    public List<FacultyProfile> getAllFaculty() {
        return facultyRepository.findAll();
    }

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public List<FeeStructure> getAllFeeStructures() {
        return feeStructureRepository.findAll();
    }

    public List<FeePayment> getAllFeePayments() {
        return feePaymentRepository.findAll();
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }

    @Transactional
    public void resetUserPassword(String adminUsername, PasswordResetRequest request, String clientIp) {
        User user = userRepository.findById(request.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + request.getUserId()));

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setUpdatedAt(LocalDateTime.now());
        userRepository.save(user);

        auditLogService.log(
                adminUsername,
                "ADMIN",
                "USER_MANAGEMENT",
                user.getId(),
                "UPDATE",
                "password_hash: [OLD_HASH]",
                "password_hash: [NEW_HASH_UPDATED]",
                request.getReason() != null ? request.getReason() : "Password reset by admin for " + user.getUsername(),
                clientIp
        );
    }

    @Transactional
    public FeeStructure setupFeeStructure(String adminUsername, FeeStructureRequest request, String clientIp) {
        Optional<FeeStructure> existing = feeStructureRepository
                .findByAcademicYearAndDepartmentAndCategory(request.getAcademicYear(), request.getDepartment(), request.getCategory());

        String oldValueJson = "null";
        String action = "CREATE";
        FeeStructure structure;

        if (existing.isPresent()) {
            structure = existing.get();
            action = "UPDATE";
            oldValueJson = String.format("{\"total\": %s, \"tuition\": %s}", structure.getTotalAmount(), structure.getTuitionFee());
        } else {
            structure = new FeeStructure();
            structure.setAcademicYear(request.getAcademicYear());
            structure.setDepartment(request.getDepartment());
            structure.setCategory(request.getCategory());
        }

        structure.setTuitionFee(request.getTuitionFee());
        structure.setSpecialFee(request.getSpecialFee() != null ? request.getSpecialFee() : BigDecimal.ZERO);
        structure.setExamFee(request.getExamFee() != null ? request.getExamFee() : BigDecimal.ZERO);
        structure.setBusFee(request.getBusFee() != null ? request.getBusFee() : BigDecimal.ZERO);
        structure.setHostelFee(request.getHostelFee() != null ? request.getHostelFee() : BigDecimal.ZERO);

        BigDecimal total = structure.getTuitionFee()
                .add(structure.getSpecialFee())
                .add(structure.getExamFee())
                .add(structure.getBusFee())
                .add(structure.getHostelFee());
        structure.setTotalAmount(total);

        FeeStructure saved = feeStructureRepository.save(structure);

        String newValueJson = String.format("{\"total\": %s, \"tuition\": %s}", saved.getTotalAmount(), saved.getTuitionFee());

        // MANDATORY AUDIT LOG FOR FEE STRUCTURE CHANGE
        auditLogService.log(
                adminUsername,
                "ADMIN",
                "FEE_STRUCTURE",
                saved.getId(),
                action,
                oldValueJson,
                newValueJson,
                request.getReason() != null ? request.getReason() : "Fee structure configured for " + saved.getDepartment() + " (" + saved.getAcademicYear() + ")",
                clientIp
        );

        return saved;
    }

    @Transactional
    public FeePayment recordFeePayment(String adminUsername, FeePaymentRequest request, String clientIp) {
        User admin = userRepository.findByUsername(adminUsername).orElse(null);
        StudentProfile student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + request.getStudentId()));

        String receiptNo = "MLRIT-REC-" + System.currentTimeMillis() % 1000000;

        FeePayment payment = new FeePayment(
                null,
                student,
                receiptNo,
                request.getAmountPaid(),
                request.getPaymentDate() != null ? request.getPaymentDate() : LocalDate.now(),
                request.getPaymentMode(),
                request.getReferenceId() != null ? request.getReferenceId() : "REF-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                request.getFeeType(),
                "SUCCESS",
                admin
        );

        FeePayment saved = feePaymentRepository.save(payment);

        String newValueJson = String.format("{\"receipt\": \"%s\", \"amount\": %s, \"student\": \"%s\", \"mode\": \"%s\"}",
                saved.getReceiptNo(), saved.getAmountPaid(), student.getHallTicketNo(), saved.getPaymentMode());

        // MANDATORY AUDIT LOG FOR FEE PAYMENT
        auditLogService.log(
                adminUsername,
                "ADMIN",
                "FEE_PAYMENT",
                saved.getId(),
                "CREATE",
                "null",
                newValueJson,
                request.getReason() != null ? request.getReason() : "Offline fee collected at MLRIT Accounts Desk",
                clientIp
        );

        return saved;
    }

    @Transactional
    public Exam publishExamResults(String adminUsername, Long examId, Boolean isPublished, String clientIp) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + examId));

        boolean oldStatus = Boolean.TRUE.equals(exam.getIsPublished());
        exam.setIsPublished(isPublished);
        if (isPublished) {
            exam.setPublishedAt(LocalDateTime.now());
        }
        Exam saved = examRepository.save(exam);

        auditLogService.log(
                adminUsername,
                "ADMIN",
                "RESULT_PUBLISH",
                saved.getId(),
                "PUBLISH",
                "{\"published\": " + oldStatus + "}",
                "{\"published\": " + isPublished + "}",
                "Exam result publication toggled to " + isPublished + " for " + saved.getName(),
                clientIp
        );

        return saved;
    }

    public Map<String, Object> getDashboardStats() {
        long totalStudents = studentRepository.count();
        long totalFaculty = facultyRepository.count();
        long totalCourses = courseRepository.count();
        BigDecimal totalFeesCollected = feePaymentRepository.sumTotalFeeCollected();
        if (totalFeesCollected == null) totalFeesCollected = BigDecimal.ZERO;

        long auditLogCount = auditLogService.getAllAuditLogs().size();

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalStudents", totalStudents);
        stats.put("totalFaculty", totalFaculty);
        stats.put("totalCourses", totalCourses);
        stats.put("totalFeesCollected", totalFeesCollected);
        stats.put("totalAuditLogs", auditLogCount);
        return stats;
    }

    @Transactional
    public StudentProfile createStudent(String adminUsername, CreateStudentRequest req, String clientIp) {
        if (userRepository.existsByUsername(req.getHallTicketNo())) {
            throw new IllegalArgumentException("User with roll number / username already exists: " + req.getHallTicketNo());
        }

        User user = new User(
                null,
                req.getHallTicketNo().trim(),
                req.getEmail().trim(),
                passwordEncoder.encode(req.getPassword().trim()),
                Role.STUDENT,
                req.getFullName().trim(),
                req.getPhone(),
                true
        );
        user = userRepository.save(user);

        StudentProfile profile = new StudentProfile(
                null,
                user,
                req.getHallTicketNo().trim(),
                req.getDepartment(),
                req.getBranch(),
                req.getBatchYear(),
                req.getCurrentSemester(),
                req.getSection(),
                req.getCurrentCgpa() != null ? req.getCurrentCgpa() : BigDecimal.ZERO,
                req.getTotalCredits() != null ? req.getTotalCredits() : 0,
                req.getFeeCategory() != null ? req.getFeeCategory() : "CONVENER"
        );
        if (req.getAdmitDate() != null && !req.getAdmitDate().isBlank()) profile.setAdmitDate(req.getAdmitDate());
        if (req.getDateOfBirth() != null && !req.getDateOfBirth().isBlank()) profile.setDateOfBirth(req.getDateOfBirth());
        if (req.getCaste() != null && !req.getCaste().isBlank()) profile.setCaste(req.getCaste());
        if (req.getFatherName() != null && !req.getFatherName().isBlank()) profile.setFatherName(req.getFatherName());
        if (req.getMotherName() != null && !req.getMotherName().isBlank()) profile.setMotherName(req.getMotherName());
        if (req.getParentMobile() != null && !req.getParentMobile().isBlank()) profile.setParentMobile(req.getParentMobile());
        if (req.getAadhaarNo() != null && !req.getAadhaarNo().isBlank()) profile.setAadhaarNo(req.getAadhaarNo());
        if (req.getApaarId() != null && !req.getApaarId().isBlank()) profile.setApaarId(req.getApaarId());
        profile = studentRepository.save(profile);

        auditLogService.log(
                adminUsername,
                "ADMIN",
                "USER_MANAGEMENT",
                user.getId(),
                "CREATE_STUDENT",
                "null",
                "{\"roll\": \"" + req.getHallTicketNo() + "\", \"name\": \"" + req.getFullName() + "\"}",
                "New student account provisioned by administrator",
                clientIp
        );

        return profile;
    }

    @Transactional
    public FacultyProfile createFaculty(String adminUsername, CreateFacultyRequest req, String clientIp) {
        if (userRepository.existsByUsername(req.getEmployeeId())) {
            throw new IllegalArgumentException("Faculty with employee ID already exists: " + req.getEmployeeId());
        }

        User user = new User(
                null,
                req.getEmployeeId().trim(),
                req.getEmail().trim(),
                passwordEncoder.encode(req.getPassword().trim()),
                Role.FACULTY,
                req.getFullName().trim(),
                req.getPhone(),
                true
        );
        user = userRepository.save(user);

        FacultyProfile profile = new FacultyProfile(
                null,
                user,
                req.getEmployeeId().trim(),
                req.getDepartment(),
                req.getDesignation(),
                req.getQualification(),
                req.getCabinNo()
        );
        profile = facultyRepository.save(profile);

        auditLogService.log(
                adminUsername,
                "ADMIN",
                "USER_MANAGEMENT",
                user.getId(),
                "CREATE_FACULTY",
                "null",
                "{\"empId\": \"" + req.getEmployeeId() + "\", \"name\": \"" + req.getFullName() + "\"}",
                "New faculty account provisioned by administrator",
                clientIp
        );

        return profile;
    }

    public List<FacultyLeave> getAllLeaves() {
        return facultyLeaveRepository.findAllByOrderByAppliedAtDesc();
    }

    @Transactional
    public FacultyLeave updateLeaveStatus(String adminUsername, Long leaveId, String status, String comments, String clientIp) {
        FacultyLeave leave = facultyLeaveRepository.findById(leaveId)
                .orElseThrow(() -> new IllegalArgumentException("Leave request not found: " + leaveId));
        leave.setStatus(status);
        leave.setAdminComments(comments);
        FacultyLeave saved = facultyLeaveRepository.save(leave);

        auditLogService.log(
                adminUsername,
                "ADMIN",
                "LEAVE_MANAGEMENT",
                saved.getId(),
                "UPDATE",
                "{\"status\": \"PENDING\"}",
                "{\"status\": \"" + status + "\"}",
                "Leave request " + status + " for faculty " + (saved.getFaculty() != null ? saved.getFaculty().getEmployeeId() : ""),
                clientIp
        );

        return saved;
    }
}
