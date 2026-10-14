package com.mlrit.portal.controller;

import com.mlrit.portal.dto.AssignmentSubmitRequest;
import com.mlrit.portal.model.AssignmentSubmission;
import com.mlrit.portal.model.Course;
import com.mlrit.portal.model.StudentProfile;
import com.mlrit.portal.model.Timetable;
import com.mlrit.portal.service.StudentService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/student")
@PreAuthorize("hasAnyRole('STUDENT', 'FACULTY', 'ADMIN')")
public class StudentController {

    private final StudentService studentService;

    public StudentController(StudentService studentService) {
        this.studentService = studentService;
    }

    @GetMapping("/profile")
    public ResponseEntity<StudentProfile> getProfile(Authentication auth) {
        return ResponseEntity.ok(studentService.getProfileByUsername(auth.getName()));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getCourses(Authentication auth) {
        return ResponseEntity.ok(studentService.getEnrolledCourses(auth.getName()));
    }

    @GetMapping("/courses/{courseId}/lms")
    public ResponseEntity<Map<String, Object>> getCourseLmsContent(@PathVariable Long courseId) {
        return ResponseEntity.ok(studentService.getCourseLmsContent(courseId));
    }

    @GetMapping("/assignments")
    public ResponseEntity<List<Map<String, Object>>> getAssignments(Authentication auth) {
        return ResponseEntity.ok(studentService.getStudentAssignments(auth.getName()));
    }

    @PostMapping("/assignments/submit")
    public ResponseEntity<AssignmentSubmission> submitAssignment(
            Authentication auth,
            @Valid @RequestBody AssignmentSubmitRequest request) {
        return ResponseEntity.ok(studentService.submitAssignment(auth.getName(), request));
    }

    @GetMapping("/attendance")
    public ResponseEntity<Map<String, Object>> getAttendance(Authentication auth) {
        return ResponseEntity.ok(studentService.getAttendanceSummary(auth.getName()));
    }

    @GetMapping("/marks")
    public ResponseEntity<Map<String, Object>> getMarks(Authentication auth) {
        return ResponseEntity.ok(studentService.getMarksAndGpa(auth.getName()));
    }

    @GetMapping("/fees")
    public ResponseEntity<Map<String, Object>> getFeeStatus(Authentication auth) {
        return ResponseEntity.ok(studentService.getFeeStatus(auth.getName()));
    }

    @GetMapping("/timetable")
    public ResponseEntity<List<Timetable>> getTimetable(Authentication auth) {
        return ResponseEntity.ok(studentService.getTimetable(auth.getName()));
    }

    @PostMapping("/fees/pay")
    public ResponseEntity<com.mlrit.portal.model.FeePayment> payFee(
            Authentication auth,
            @RequestBody Map<String, Object> body) {
        String feeType = (String) body.getOrDefault("feeType", "Regular Fee");
        java.math.BigDecimal amount = new java.math.BigDecimal(body.getOrDefault("amount", 2500).toString());
        String mode = (String) body.getOrDefault("paymentMode", "ONLINE_UPI");
        String refId = (String) body.getOrDefault("referenceId", "TXN" + System.currentTimeMillis());
        return ResponseEntity.ok(studentService.payStudentFee(auth.getName(), feeType, amount, mode, refId));
    }
}
