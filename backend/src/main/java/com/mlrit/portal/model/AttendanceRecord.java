package com.mlrit.portal.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "attendance_records", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "course_id", "attendance_date", "period_slot"})
})
public class AttendanceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(name = "attendance_date", nullable = false)
    private LocalDate attendanceDate;

    @Column(name = "period_slot", nullable = false)
    private Integer periodSlot;

    @Column(nullable = false, length = 20)
    private String status; // PRESENT, ABSENT, ON_DUTY

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "marked_by")
    private FacultyProfile markedBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public AttendanceRecord() {}

    public AttendanceRecord(Long id, StudentProfile student, Course course, LocalDate attendanceDate, Integer periodSlot, String status, FacultyProfile markedBy) {
        this.id = id;
        this.student = student;
        this.course = course;
        this.attendanceDate = attendanceDate;
        this.periodSlot = periodSlot;
        this.status = status;
        this.markedBy = markedBy;
        this.createdAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public Integer getPeriodSlot() { return periodSlot; }
    public void setPeriodSlot(Integer periodSlot) { this.periodSlot = periodSlot; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public FacultyProfile getMarkedBy() { return markedBy; }
    public void setMarkedBy(FacultyProfile markedBy) { this.markedBy = markedBy; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
