package com.mlrit.portal.model;

import jakarta.persistence.*;

@Entity
@Table(name = "faculty_course_allocations", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"faculty_id", "course_id", "section", "academic_year"})
})
public class FacultyCourseAllocation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "faculty_id", nullable = false)
    private FacultyProfile faculty;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "course_id", nullable = false)
    private Course course;

    @Column(nullable = false, length = 10)
    private String section;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    public FacultyCourseAllocation() {}

    public FacultyCourseAllocation(Long id, FacultyProfile faculty, Course course, String section, String academicYear) {
        this.id = id;
        this.faculty = faculty;
        this.course = course;
        this.section = section;
        this.academicYear = academicYear;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public FacultyProfile getFaculty() { return faculty; }
    public void setFaculty(FacultyProfile faculty) { this.faculty = faculty; }

    public Course getCourse() { return course; }
    public void setCourse(Course course) { this.course = course; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }
}
