package com.mlrit.portal.controller;

import com.mlrit.portal.dto.CreateFacultyRequest;
import com.mlrit.portal.dto.CreateStudentRequest;
import com.mlrit.portal.dto.FeePaymentRequest;
import com.mlrit.portal.dto.FeeStructureRequest;
import com.mlrit.portal.dto.PasswordResetRequest;
import com.mlrit.portal.model.*;
import com.mlrit.portal.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        return ResponseEntity.ok(adminService.getDashboardStats());
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentProfile>> getAllStudents() {
        return ResponseEntity.ok(adminService.getAllStudents());
    }

    @PostMapping("/students")
    public ResponseEntity<StudentProfile> createStudent(
            Authentication auth,
            @Valid @RequestBody CreateStudentRequest request,
            HttpServletRequest servletRequest) {
        return ResponseEntity.ok(adminService.createStudent(auth.getName(), request, servletRequest.getRemoteAddr()));
    }

    @GetMapping("/faculty")
    public ResponseEntity<List<FacultyProfile>> getAllFaculty() {
        return ResponseEntity.ok(adminService.getAllFaculty());
    }

    @PostMapping("/faculty")
    public ResponseEntity<FacultyProfile> createFaculty(
            Authentication auth,
            @Valid @RequestBody CreateFacultyRequest request,
            HttpServletRequest servletRequest) {
        return ResponseEntity.ok(adminService.createFaculty(auth.getName(), request, servletRequest.getRemoteAddr()));
    }

    @GetMapping("/courses")
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(adminService.getAllCourses());
    }

    @GetMapping("/fees/structures")
    public ResponseEntity<List<FeeStructure>> getFeeStructures() {
        return ResponseEntity.ok(adminService.getAllFeeStructures());
    }

    @PostMapping("/fees/structures")
    public ResponseEntity<FeeStructure> setupFeeStructure(
            Authentication auth,
            @Valid @RequestBody FeeStructureRequest request,
            HttpServletRequest servletRequest) {
        return ResponseEntity.ok(adminService.setupFeeStructure(auth.getName(), request, servletRequest.getRemoteAddr()));
    }

    @GetMapping("/fees/payments")
    public ResponseEntity<List<FeePayment>> getFeePayments() {
        return ResponseEntity.ok(adminService.getAllFeePayments());
    }

    @PostMapping("/fees/collect")
    public ResponseEntity<FeePayment> collectFee(
            Authentication auth,
            @Valid @RequestBody FeePaymentRequest request,
            HttpServletRequest servletRequest) {
        return ResponseEntity.ok(adminService.recordFeePayment(auth.getName(), request, servletRequest.getRemoteAddr()));
    }

    @PostMapping("/users/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(
            Authentication auth,
            @Valid @RequestBody PasswordResetRequest request,
            HttpServletRequest servletRequest) {
        adminService.resetUserPassword(auth.getName(), request, servletRequest.getRemoteAddr());
        return ResponseEntity.ok(Map.of("message", "Password successfully reset for user ID " + request.getUserId()));
    }

    @GetMapping("/exams")
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(adminService.getAllExams());
    }

    @PostMapping("/exams/{examId}/publish")
    public ResponseEntity<Exam> publishExam(
            Authentication auth,
            @PathVariable Long examId,
            @RequestBody Map<String, Boolean> body,
            HttpServletRequest servletRequest) {
        Boolean isPublished = body.getOrDefault("isPublished", true);
        return ResponseEntity.ok(adminService.publishExamResults(auth.getName(), examId, isPublished, servletRequest.getRemoteAddr()));
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<FacultyLeave>> getAllLeaves() {
        return ResponseEntity.ok(adminService.getAllLeaves());
    }

    @PostMapping("/leaves/{leaveId}/action")
    public ResponseEntity<FacultyLeave> updateLeaveStatus(
            Authentication auth,
            @PathVariable Long leaveId,
            @RequestBody Map<String, String> body,
            HttpServletRequest servletRequest) {
        String status = body.getOrDefault("status", "APPROVED");
        String comments = body.getOrDefault("comments", "Processed by Dean & Portal Administrator");
        return ResponseEntity.ok(adminService.updateLeaveStatus(auth.getName(), leaveId, status, comments, servletRequest.getRemoteAddr()));
    }
}
