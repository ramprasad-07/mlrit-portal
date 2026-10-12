package com.mlrit.portal.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "student_semester_gpa", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"student_id", "semester"})
})
public class StudentSemesterGpa {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    private StudentProfile student;

    @Column(nullable = false)
    private Integer semester;

    @Column(precision = 4, scale = 2, nullable = false)
    private BigDecimal sgpa;

    @Column(precision = 4, scale = 2, nullable = false)
    private BigDecimal cgpa;

    @Column(name = "credits_registered", nullable = false)
    private Integer creditsRegistered;

    @Column(name = "credits_earned", nullable = false)
    private Integer creditsEarned;

    @Column(nullable = false)
    private Boolean passed = true;

    public StudentSemesterGpa() {}

    public StudentSemesterGpa(Long id, StudentProfile student, Integer semester, BigDecimal sgpa, BigDecimal cgpa, Integer creditsRegistered, Integer creditsEarned, Boolean passed) {
        this.id = id;
        this.student = student;
        this.semester = semester;
        this.sgpa = sgpa;
        this.cgpa = cgpa;
        this.creditsRegistered = creditsRegistered;
        this.creditsEarned = creditsEarned;
        this.passed = passed;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public StudentProfile getStudent() { return student; }
    public void setStudent(StudentProfile student) { this.student = student; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public BigDecimal getSgpa() { return sgpa; }
    public void setSgpa(BigDecimal sgpa) { this.sgpa = sgpa; }

    public BigDecimal getCgpa() { return cgpa; }
    public void setCgpa(BigDecimal cgpa) { this.cgpa = cgpa; }

    public Integer getCreditsRegistered() { return creditsRegistered; }
    public void setCreditsRegistered(Integer creditsRegistered) { this.creditsRegistered = creditsRegistered; }

    public Integer getCreditsEarned() { return creditsEarned; }
    public void setCreditsEarned(Integer creditsEarned) { this.creditsEarned = creditsEarned; }

    public Boolean getPassed() { return passed; }
    public void setPassed(Boolean passed) { this.passed = passed; }
}
