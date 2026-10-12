package com.mlrit.portal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "courses")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 20)
    private String code; // e.g. CS501PC

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(nullable = false)
    private Integer semester;

    @Column(nullable = false)
    private Integer credits;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "syllabus_url", length = 255)
    private String syllabusUrl;

    public Course() {}

    public Course(Long id, String code, String title, String department, Integer semester, Integer credits, String description, String syllabusUrl) {
        this.id = id;
        this.code = code;
        this.title = title;
        this.department = department;
        this.semester = semester;
        this.credits = credits;
        this.description = description;
        this.syllabusUrl = syllabusUrl;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public Integer getSemester() { return semester; }
    public void setSemester(Integer semester) { this.semester = semester; }

    public Integer getCredits() { return credits; }
    public void setCredits(Integer credits) { this.credits = credits; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getSyllabusUrl() { return syllabusUrl; }
    public void setSyllabusUrl(String syllabusUrl) { this.syllabusUrl = syllabusUrl; }
}
