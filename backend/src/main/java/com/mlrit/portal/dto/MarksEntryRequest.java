package com.mlrit.portal.dto;

import jakarta.validation.constraints.DecimalMax;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class MarksEntryRequest {

    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Exam ID is required")
    private Long examId;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal internalMarks = BigDecimal.ZERO;

    @DecimalMin("0.0")
    @DecimalMax("100.0")
    private BigDecimal externalMarks = BigDecimal.ZERO;

    private String grade;

    private Integer gradePoints = 0;

    private String status = "SUBMITTED";

    private String reason = "Marks entered by faculty"; // For Audit Log

    public MarksEntryRequest() {}

    public Long getStudentId() { return studentId; }
    public void setStudentId(Long studentId) { this.studentId = studentId; }

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public Long getExamId() { return examId; }
    public void setExamId(Long examId) { this.examId = examId; }

    public BigDecimal getInternalMarks() { return internalMarks; }
    public void setInternalMarks(BigDecimal internalMarks) { this.internalMarks = internalMarks; }

    public BigDecimal getExternalMarks() { return externalMarks; }
    public void setExternalMarks(BigDecimal externalMarks) { this.externalMarks = externalMarks; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public Integer getGradePoints() { return gradePoints; }
    public void setGradePoints(Integer gradePoints) { this.gradePoints = gradePoints; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
