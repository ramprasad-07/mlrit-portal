package com.mlrit.portal.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "mark_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "course_id", "exam_id"})
})
public class MarkRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "exam_id", nullable = false)
    private Exam exam;

    @Column(name = "internal_marks", precision = 5, scale = 2)
    private BigDecimal internalMarks = BigDecimal.ZERO;

    @Column(name = "external_marks", precision = 5, scale = 2)
    private BigDecimal externalMarks = BigDecimal.ZERO;

    @Column(name = "total_marks", precision = 5, scale = 2)
    private BigDecimal totalMarks = BigDecimal.ZERO;

    @Column(length = 5)
    private String grade; // O, A+, A, B+, B, C, F, AB

    @Column(name = "grade_points")
    private Integer gradePoints = 0;

    @Column(length = 20)
    private String status = "SUBMITTED"; // DRAFT, SUBMITTED, PUBLISHED

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "entered_by")
    private FacultyProfile enteredBy;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public MarkRecord() {}

    public MarkRecord(Long id, StudentProfile student, Course course, Exam exam, BigDecimal internalMarks, BigDecimal externalMarks, BigDecimal totalMarks, String grade, Integer gradePoints, String status, FacultyProfile enteredBy) {
        this.id = id;
        this.student = student;
        this.course = course;
        this.exam = exam;
        this.internalMarks = internalMarks;
        this.externalMarks = externalMarks;
        this.totalMarks = totalMarks;
        this.grade = grade;
        this.gradePoints = gradePoints;
        this.status = status;
        this.enteredBy = enteredBy;
        this.updatedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public Exam getExam() { return exam; }
    public void setExam(Exam exam) { this.exam = exam; }

    public BigDecimal getInternalMarks() { return internalMarks; }
    public void setInternalMarks(BigDecimal internalMarks) { this.internalMarks = internalMarks; }

    public BigDecimal getExternalMarks() { return externalMarks; }
    public void setExternalMarks(BigDecimal externalMarks) { this.externalMarks = externalMarks; }

    public BigDecimal getTotalMarks() { return totalMarks; }
    public void setTotalMarks(BigDecimal totalMarks) { this.totalMarks = totalMarks; }

    public String getGrade() { return grade; }
    public void setGrade(String grade) { this.grade = grade; }

    public Integer getGradePoints() { return gradePoints; }
    public void setGradePoints(Integer gradePoints) { this.gradePoints = gradePoints; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public FacultyProfile getEnteredBy() { return enteredBy; }
    public void setEnteredBy(FacultyProfile enteredBy) { this.enteredBy = enteredBy; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
