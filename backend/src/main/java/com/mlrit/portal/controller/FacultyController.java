package com.mlrit.portal.controller;

import com.mlrit.portal.dto.AssignmentCreateRequest;
import com.mlrit.portal.dto.AssignmentGradeRequest;
import com.mlrit.portal.dto.AttendanceEntryRequest;
import com.mlrit.portal.dto.MarksEntryRequest;
import com.mlrit.portal.model.*;
import com.mlrit.portal.service.FacultyService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/faculty")
@PreAuthorize("hasRole('FACULTY')")
public class FacultyController {

    private final FacultyService facultyService;

    public FacultyController(FacultyService facultyService) {
        this.facultyService = facultyService;
    }

    @GetMapping("/profile")
    public ResponseEntity<FacultyProfile> getProfile(Authentication auth) {
        return ResponseEntity.ok(facultyService.getProfileByUsername(auth.getName()));
    }

    @GetMapping("/classes")
    public ResponseEntity<List<FacultyCourseAllocation>> getAssignedClasses(Authentication auth) {
        return ResponseEntity.ok(facultyService.getAssignedClasses(auth.getName()));
    }

    @PostMapping("/courses/{courseId}/modules")
    public ResponseEntity<CourseModule> createModule(
            @PathVariable Long courseId,
            @RequestBody Map<String, Object> body) {
        String title = (String) body.get("title");
        String description = (String) body.get("description");
        Integer orderIndex = body.get("orderIndex") != null ? ((Number) body.get("orderIndex")).intValue() : 1;
        return ResponseEntity.ok(facultyService.createCourseModule(courseId, title, description, orderIndex));
    }

    @PostMapping("/modules/{moduleId}/materials")
    public ResponseEntity<CourseMaterial> uploadMaterial(
            Authentication auth,
            @PathVariable Long moduleId,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(facultyService.uploadCourseMaterial(
                auth.getName(), moduleId, body.get("title"), body.get("fileType"), body.get("resourceUrl")
        ));
    }

    @PostMapping("/assignments")
    public ResponseEntity<Assignment> createAssignment(
            Authentication auth,
            @Valid @RequestBody AssignmentCreateRequest request) {
        return ResponseEntity.ok(facultyService.createAssignment(auth.getName(), request));
    }

    @GetMapping("/assignments/{assignmentId}/submissions")
    public ResponseEntity<List<AssignmentSubmission>> getSubmissions(@PathVariable Long assignmentId) {
        return ResponseEntity.ok(facultyService.getAssignmentSubmissions(assignmentId));
    }

    @PostMapping("/assignments/grade")
    public ResponseEntity<AssignmentSubmission> gradeSubmission(
            Authentication auth,
            @Valid @RequestBody AssignmentGradeRequest request) {
        return ResponseEntity.ok(facultyService.gradeSubmission(auth.getName(), request));
    }

    @GetMapping("/marks")
    public ResponseEntity<List<MarkRecord>> getMarks(
            @RequestParam Long courseId,
            @RequestParam Long examId) {
        return ResponseEntity.ok(facultyService.getMarksByCourseAndExam(courseId, examId));
    }

    @PostMapping("/marks")
    public ResponseEntity<MarkRecord> enterOrUpdateMarks(
            Authentication auth,
            @Valid @RequestBody MarksEntryRequest request,
            HttpServletRequest servletRequest) {
        String ipAddress = servletRequest.getRemoteAddr();
        return ResponseEntity.ok(facultyService.enterOrUpdateMarks(auth.getName(), request, ipAddress));
    }

    @PostMapping("/attendance")
    public ResponseEntity<List<AttendanceRecord>> recordAttendance(
            Authentication auth,
            @Valid @RequestBody AttendanceEntryRequest request) {
        return ResponseEntity.ok(facultyService.recordAttendance(auth.getName(), request));
    }

    @GetMapping("/timetable")
    public ResponseEntity<List<Timetable>> getTimetable(Authentication auth) {
        return ResponseEntity.ok(facultyService.getTimetable(auth.getName()));
    }

    @GetMapping("/leaves")
    public ResponseEntity<List<FacultyLeave>> getLeaves(Authentication auth) {
        return ResponseEntity.ok(facultyService.getLeaves(auth.getName()));
    }

    @PostMapping("/leaves")
    public ResponseEntity<FacultyLeave> applyLeave(
            Authentication auth,
            @Valid @RequestBody com.mlrit.portal.dto.FacultyLeaveRequest request) {
        return ResponseEntity.ok(facultyService.applyLeave(auth.getName(), request));
    }

    @GetMapping("/students")
    public ResponseEntity<List<StudentProfile>> getAllStudents() {
        return ResponseEntity.ok(facultyService.getAllStudentProfiles());
    }

    @GetMapping("/exams")
    public ResponseEntity<List<Exam>> getAllExams() {
        return ResponseEntity.ok(facultyService.getAllExams());
    }
}
