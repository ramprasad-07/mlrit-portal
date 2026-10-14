package com.mlrit.portal.service;

import com.mlrit.portal.dto.AssignmentCreateRequest;
import com.mlrit.portal.dto.AssignmentGradeRequest;
import com.mlrit.portal.dto.AttendanceEntryRequest;
import com.mlrit.portal.dto.MarksEntryRequest;
import com.mlrit.portal.model.*;
import com.mlrit.portal.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class FacultyService {

    private final FacultyProfileRepository facultyProfileRepository;
    private final FacultyCourseAllocationRepository allocationRepository;
    private final CourseRepository courseRepository;
    private final CourseModuleRepository moduleRepository;
    private final CourseMaterialRepository materialRepository;
    private final AssignmentRepository assignmentRepository;
    private final AssignmentSubmissionRepository submissionRepository;
    private final AttendanceRecordRepository attendanceRepository;
    private final MarkRecordRepository markRecordRepository;
    private final ExamRepository examRepository;
    private final StudentProfileRepository studentRepository;
    private final AuditLogService auditLogService;
    private final TimetableRepository timetableRepository;
    private final FacultyLeaveRepository facultyLeaveRepository;

    public FacultyService(
            FacultyProfileRepository facultyProfileRepository,
            FacultyCourseAllocationRepository allocationRepository,
            CourseRepository courseRepository,
            CourseModuleRepository moduleRepository,
            CourseMaterialRepository materialRepository,
            AssignmentRepository assignmentRepository,
            AssignmentSubmissionRepository submissionRepository,
            AttendanceRecordRepository attendanceRepository,
            MarkRecordRepository markRecordRepository,
            ExamRepository examRepository,
            StudentProfileRepository studentRepository,
            AuditLogService auditLogService,
            TimetableRepository timetableRepository,
            FacultyLeaveRepository facultyLeaveRepository) {
        this.facultyProfileRepository = facultyProfileRepository;
        this.allocationRepository = allocationRepository;
        this.courseRepository = courseRepository;
        this.moduleRepository = moduleRepository;
        this.materialRepository = materialRepository;
        this.assignmentRepository = assignmentRepository;
        this.submissionRepository = submissionRepository;
        this.attendanceRepository = attendanceRepository;
        this.markRecordRepository = markRecordRepository;
        this.examRepository = examRepository;
        this.studentRepository = studentRepository;
        this.auditLogService = auditLogService;
        this.timetableRepository = timetableRepository;
        this.facultyLeaveRepository = facultyLeaveRepository;
    }

    public FacultyProfile getProfileByUsername(String username) {
        return facultyProfileRepository.findByEmployeeId(username)
                .or(() -> facultyProfileRepository.findAll().stream()
                        .filter(fp -> fp.getUser().getUsername().equalsIgnoreCase(username) || fp.getUser().getEmail().equalsIgnoreCase(username))
                        .findFirst())
                .orElseThrow(() -> new IllegalArgumentException("Faculty profile not found for: " + username));
    }

    public List<FacultyCourseAllocation> getAssignedClasses(String username) {
        FacultyProfile faculty = getProfileByUsername(username);
        return allocationRepository.findByFacultyId(faculty.getId());
    }

    @Transactional
    public CourseModule createCourseModule(Long courseId, String title, String description, Integer orderIndex) {
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + courseId));
        CourseModule module = new CourseModule(null, course, title, description, orderIndex != null ? orderIndex : 1);
        return moduleRepository.save(module);
    }

    @Transactional
    public CourseMaterial uploadCourseMaterial(String username, Long moduleId, String title, String fileType, String resourceUrl) {
        FacultyProfile faculty = getProfileByUsername(username);
        CourseModule module = moduleRepository.findById(moduleId)
                .orElseThrow(() -> new IllegalArgumentException("Module not found: " + moduleId));

        CourseMaterial material = new CourseMaterial(null, module, title, fileType, resourceUrl, faculty);
        return materialRepository.save(material);
    }

    @Transactional
    public Assignment createAssignment(String username, AssignmentCreateRequest request) {
        FacultyProfile faculty = getProfileByUsername(username);
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + request.getCourseId()));

        Assignment assignment = new Assignment(
                null,
                course,
                request.getSection(),
                request.getTitle(),
                request.getInstructions(),
                request.getDueDate(),
                request.getMaxMarks() != null ? request.getMaxMarks() : 10,
                faculty
        );
        return assignmentRepository.save(assignment);
    }

    public List<AssignmentSubmission> getAssignmentSubmissions(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    @Transactional
    public AssignmentSubmission gradeSubmission(String username, AssignmentGradeRequest request) {
        FacultyProfile faculty = getProfileByUsername(username);
        AssignmentSubmission submission = submissionRepository.findById(request.getSubmissionId())
                .orElseThrow(() -> new IllegalArgumentException("Submission not found: " + request.getSubmissionId()));

        submission.setMarksObtained(request.getMarksObtained());
        submission.setFeedback(request.getFeedback());
        submission.setStatus("GRADED");
        submission.setGradedBy(faculty);
        submission.setGradedAt(LocalDateTime.now());

        return submissionRepository.save(submission);
    }

    @Transactional
    public MarkRecord enterOrUpdateMarks(String username, MarksEntryRequest request, String clientIp) {
        FacultyProfile faculty = getProfileByUsername(username);
        StudentProfile student = studentRepository.findById(request.getStudentId())
                .orElseThrow(() -> new IllegalArgumentException("Student not found: " + request.getStudentId()));
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + request.getCourseId()));
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new IllegalArgumentException("Exam not found: " + request.getExamId()));

        Optional<MarkRecord> existingOpt = markRecordRepository
                .findByStudentIdAndCourseIdAndExamId(student.getId(), course.getId(), exam.getId());

        String oldValueJson = "null";
        String actionType = "CREATE";
        MarkRecord record;

        if (existingOpt.isPresent()) {
            record = existingOpt.get();
            actionType = "UPDATE";
            oldValueJson = String.format("{\"internal\": %s, \"external\": %s, \"total\": %s, \"grade\": \"%s\"}",
                    record.getInternalMarks(), record.getExternalMarks(), record.getTotalMarks(), record.getGrade());
        } else {
            record = new MarkRecord();
            record.setStudent(student);
            record.setCourse(course);
            record.setExam(exam);
        }

        record.setInternalMarks(request.getInternalMarks());
        record.setExternalMarks(request.getExternalMarks());
        record.setTotalMarks(request.getInternalMarks().add(request.getExternalMarks()));
        record.setGrade(request.getGrade() != null ? request.getGrade() : "A");
        record.setGradePoints(request.getGradePoints() != null ? request.getGradePoints() : 8);
        record.setStatus(request.getStatus() != null ? request.getStatus() : "SUBMITTED");
        record.setEnteredBy(faculty);
        record.setUpdatedAt(LocalDateTime.now());

        MarkRecord saved = markRecordRepository.save(record);

        String newValueJson = String.format("{\"internal\": %s, \"external\": %s, \"total\": %s, \"grade\": \"%s\"}",
                saved.getInternalMarks(), saved.getExternalMarks(), saved.getTotalMarks(), saved.getGrade());

        // MANDATORY AUDIT LOG FOR MARKS
        auditLogService.log(
                faculty.getEmployeeId(),
                "FACULTY",
                "MARKS",
                saved.getId(),
                actionType,
                oldValueJson,
                newValueJson,
                request.getReason() != null ? request.getReason() : "Faculty marks entry for " + exam.getName() + " - " + course.getCode(),
                clientIp
        );

        return saved;
    }

    @Transactional
    public List<AttendanceRecord> recordAttendance(String username, AttendanceEntryRequest request) {
        FacultyProfile faculty = getProfileByUsername(username);
        Course course = courseRepository.findById(request.getCourseId())
                .orElseThrow(() -> new IllegalArgumentException("Course not found: " + request.getCourseId()));

        List<AttendanceRecord> savedList = new ArrayList<>();

        for (AttendanceEntryRequest.StudentAttendanceItem item : request.getItems()) {
            StudentProfile student = studentRepository.findById(item.getStudentId()).orElse(null);
            if (student == null) continue;

            AttendanceRecord record = attendanceRepository
                    .findByStudentIdAndCourseIdAndAttendanceDateAndPeriodSlot(
                            student.getId(), course.getId(), request.getAttendanceDate(), request.getPeriodSlot())
                    .orElse(new AttendanceRecord(null, student, course, request.getAttendanceDate(), request.getPeriodSlot(), item.getStatus(), faculty));

            record.setStatus(item.getStatus());
            record.setMarkedBy(faculty);
            savedList.add(attendanceRepository.save(record));
        }

        return savedList;
    }

    public List<MarkRecord> getMarksByCourseAndExam(Long courseId, Long examId) {
        return markRecordRepository.findByCourseIdAndExamId(courseId, examId);
    }

    public List<Timetable> getTimetable(String username) {
        FacultyProfile faculty = getProfileByUsername(username);
        return timetableRepository.findByFacultyIdOrderByStartTimeAsc(faculty.getId());
    }

    public List<FacultyLeave> getLeaves(String username) {
        FacultyProfile faculty = getProfileByUsername(username);
        return facultyLeaveRepository.findByFacultyIdOrderByAppliedAtDesc(faculty.getId());
    }

    @Transactional
    public FacultyLeave applyLeave(String username, com.mlrit.portal.dto.FacultyLeaveRequest request) {
        FacultyProfile faculty = getProfileByUsername(username);
        FacultyLeave leave = new FacultyLeave(
                null,
                faculty,
                request.getLeaveType(),
                request.getFromDate(),
                request.getToDate(),
                request.getTotalDays(),
                request.getReason(),
                "PENDING"
        );
        return facultyLeaveRepository.save(leave);
    }

    public List<StudentProfile> getAllStudentProfiles() {
        return studentRepository.findAll();
    }

    public List<Exam> getAllExams() {
        return examRepository.findAll();
    }
}
