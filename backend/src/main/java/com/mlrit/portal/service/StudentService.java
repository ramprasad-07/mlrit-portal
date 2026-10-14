package com.mlrit.portal.service;

import com.mlrit.portal.dto.AssignmentSubmitRequest;
import com.mlrit.portal.model.*;
import com.mlrit.portal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class StudentService {

    private final StudentProfileRepository studentProfileRepository;
    private final CourseEnrollmentRepository courseEnrollmentRepository;
    private final CourseModuleRepository courseModuleRepository;
    private final CourseMaterialRepository courseMaterialRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository assignmentSubmissionRepository;
    private final AttendanceRecordRepository attendanceRecordRepository;
    private final MarkRecordRepository markRecordRepository;
    private final StudentSemesterGpaRepository studentSemesterGpaRepository;
    private final FeeStructureRepository feeStructureRepository;
    private final FeePaymentRepository feePaymentRepository;
    private final TimetableRepository timetableRepository;

    public StudentService(
            StudentProfileRepository studentProfileRepository,
            CourseEnrollmentRepository courseEnrollmentRepository,
            CourseModuleRepository courseModuleRepository,
            CourseMaterialRepository courseMaterialRepository,
            AssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository assignmentSubmissionRepository,
            AttendanceRecordRepository attendanceRecordRepository,
            MarkRecordRepository markRecordRepository,
            StudentSemesterGpaRepository studentSemesterGpaRepository,
            FeeStructureRepository feeStructureRepository,
            FeePaymentRepository feePaymentRepository,
            TimetableRepository timetableRepository) {
        this.studentProfileRepository = studentProfileRepository;
        this.courseEnrollmentRepository = courseEnrollmentRepository;
        this.courseModuleRepository = courseModuleRepository;
        this.courseMaterialRepository = courseMaterialRepository;
        this.assignmentRepository = assignmentRepository;
        this.assignmentSubmissionRepository = assignmentSubmissionRepository;
        this.attendanceRecordRepository = attendanceRecordRepository;
        this.markRecordRepository = markRecordRepository;
        this.studentSemesterGpaRepository = studentSemesterGpaRepository;
        this.feeStructureRepository = feeStructureRepository;
        this.feePaymentRepository = feePaymentRepository;
        this.timetableRepository = timetableRepository;
    }

    public StudentProfile getProfileByUsername(String username) {
        return studentProfileRepository.findByHallTicketNo(username)
                .or(() -> studentProfileRepository.findAll().stream()
                        .filter(sp -> sp.getUser().getUsername().equalsIgnoreCase(username) || sp.getUser().getEmail().equalsIgnoreCase(username))
                        .findFirst())
                .orElseThrow(() -> new IllegalArgumentException("Student profile not found for: " + username));
    }

    public List<Course> getEnrolledCourses(String username) {
        StudentProfile student = getProfileByUsername(username);
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByStudentId(student.getId());
        return enrollments.stream().map(CourseEnrollment::getCourse).toList();
    }

    public Map<String, Object> getCourseLmsContent(Long courseId) {
        List<CourseModule> modules = courseModuleRepository.findByCourseIdOrderByOrderIndexAsc(courseId);
        List<Map<String, Object>> moduleList = new ArrayList<>();

        for (CourseModule mod : modules) {
            List<CourseMaterial> materials = courseMaterialRepository.findByModuleIdOrderByUploadedAtDesc(mod.getId());
            Map<String, Object> map = new HashMap<>();
            map.put("module", mod);
            map.put("materials", materials);
            moduleList.add(map);
        }

        Map<String, Object> response = new HashMap<>();
        response.put("courseId", courseId);
        response.put("modules", moduleList);
        return response;
    }

    public List<Map<String, Object>> getStudentAssignments(String username) {
        StudentProfile student = getProfileByUsername(username);
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByStudentId(student.getId());
        List<Map<String, Object>> result = new ArrayList<>();

        for (CourseEnrollment ce : enrollments) {
            List<Assignment> assignments = assignmentRepository.findByCourseId(ce.getCourse().getId());
            for (Assignment a : assignments) {
                Map<String, Object> map = new HashMap<>();
                map.put("assignment", a);
                Optional<AssignmentSubmission> sub = assignmentSubmissionRepository.findByAssignmentIdAndStudentId(a.getId(), student.getId());
                map.put("submission", sub.orElse(null));
                result.add(map);
            }
        }
        return result;
    }

    @Transactional
    public AssignmentSubmission submitAssignment(String username, AssignmentSubmitRequest request) {
        StudentProfile student = getProfileByUsername(username);
        Assignment assignment = assignmentRepository.findById(request.getAssignmentId())
                .orElseThrow(() -> new IllegalArgumentException("Assignment not found: " + request.getAssignmentId()));

        AssignmentSubmission submission = assignmentSubmissionRepository
                .findByAssignmentIdAndStudentId(assignment.getId(), student.getId())
                .orElse(new AssignmentSubmission(null, assignment, student, request.getContentText(), request.getAttachmentUrl()));

        submission.setContentText(request.getContentText());
        submission.setAttachmentUrl(request.getAttachmentUrl());
        submission.setSubmittedAt(LocalDateTime.now());
        submission.setStatus("SUBMITTED");

        return assignmentSubmissionRepository.save(submission);
    }

    public Map<String, Object> getAttendanceSummary(String username) {
        StudentProfile student = getProfileByUsername(username);
        List<CourseEnrollment> enrollments = courseEnrollmentRepository.findByStudentId(student.getId());

        List<Map<String, Object>> subjects = new ArrayList<>();
        long totalAll = 0;
        long attendedAll = 0;

        for (CourseEnrollment ce : enrollments) {
            long total = attendanceRecordRepository.countTotalClasses(student.getId(), ce.getCourse().getId());
            long attended = attendanceRecordRepository.countAttendedClasses(student.getId(), ce.getCourse().getId());
            double percentage = total > 0 ? (double) attended / total * 100.0 : 100.0;

            totalAll += total;
            attendedAll += attended;

            Map<String, Object> subMap = new HashMap<>();
            subMap.put("courseId", ce.getCourse().getId());
            subMap.put("courseCode", ce.getCourse().getCode());
            subMap.put("courseTitle", ce.getCourse().getTitle());
            subMap.put("totalClasses", total);
            subMap.put("attendedClasses", attended);
            subMap.put("percentage", Math.round(percentage * 10.0) / 10.0);
            subMap.put("isLowAttendance", percentage < 75.0);
            subjects.add(subMap);
        }

        double overallPercentage = totalAll > 0 ? (double) attendedAll / totalAll * 100.0 : 100.0;

        Map<String, Object> res = new HashMap<>();
        res.put("overallPercentage", Math.round(overallPercentage * 10.0) / 10.0);
        res.put("totalClasses", totalAll);
        res.put("attendedClasses", attendedAll);
        res.put("isEligibleForExams", overallPercentage >= 75.0);
        res.put("subjects", subjects);
        return res;
    }

    public Map<String, Object> getMarksAndGpa(String username) {
        StudentProfile student = getProfileByUsername(username);
        List<MarkRecord> markRecords = markRecordRepository.findByStudentId(student.getId());
        List<StudentSemesterGpa> semesterGpas = studentSemesterGpaRepository.findByStudentIdOrderBySemesterAsc(student.getId());

        Map<String, Object> response = new HashMap<>();
        response.put("currentCgpa", student.getCurrentCgpa());
        response.put("totalCredits", student.getTotalCredits());
        response.put("semesterGpas", semesterGpas);
        response.put("marks", markRecords);
        return response;
    }

    public Map<String, Object> getFeeStatus(String username) {
        StudentProfile student = getProfileByUsername(username);

        // Find applicable fee structure
        List<FeeStructure> structures = feeStructureRepository.findByDepartment(student.getDepartment());
        BigDecimal totalFee = BigDecimal.valueOf(115000.00); // Standard institutional fee
        if (!structures.isEmpty()) {
            totalFee = structures.get(0).getTotalAmount();
        }

        BigDecimal paid = feePaymentRepository.sumAmountPaidByStudent(student.getId());
        if (paid == null) paid = BigDecimal.ZERO;

        BigDecimal dues = totalFee.subtract(paid);
        if (dues.compareTo(BigDecimal.ZERO) < 0) dues = BigDecimal.ZERO;

        List<FeePayment> receipts = feePaymentRepository.findByStudentIdOrderByPaymentDateDesc(student.getId());

        Map<String, Object> feeInfo = new HashMap<>();
        feeInfo.put("studentId", student.getId());
        feeInfo.put("hallTicketNo", student.getHallTicketNo());
        feeInfo.put("totalFee", totalFee);
        feeInfo.put("amountPaid", paid);
        feeInfo.put("feeDues", dues);
        feeInfo.put("isCleared", dues.compareTo(BigDecimal.ZERO) <= 0);
        feeInfo.put("receipts", receipts);

        return feeInfo;
    }

    public List<Timetable> getTimetable(String username) {
        StudentProfile student = getProfileByUsername(username);
        return timetableRepository.findByDepartmentAndSemesterAndSectionOrderByStartTimeAsc(
                student.getDepartment(), student.getCurrentSemester(), student.getSection()
        );
    }

    @Transactional
    public FeePayment payStudentFee(String username, String feeType, BigDecimal amount, String mode, String refId) {
        StudentProfile student = getProfileByUsername(username);
        String prefix = feeType != null && feeType.length() >= 3 ? feeType.substring(0, 3).toUpperCase() : "REG";
        String receiptNo = "MLRIT-" + prefix + "-" + (System.currentTimeMillis() % 1000000);
        FeePayment payment = new FeePayment(
                null,
                student,
                receiptNo,
                amount,
                LocalDate.now(),
                mode != null ? mode : "ONLINE_UPI",
                refId != null ? refId : "TXN" + UUID.randomUUID().toString().substring(0, 8).toUpperCase(),
                feeType != null ? feeType : "Regular Fee",
                "SUCCESS",
                student.getUser()
        );
        return feePaymentRepository.save(payment);
    }
}
