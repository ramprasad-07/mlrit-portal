package com.mlrit.portal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "student_profiles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class StudentProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "hall_ticket_no", unique = true, nullable = false, length = 50)
    private String hallTicketNo;

    @Column(nullable = false, length = 50)
    private String department; // e.g. CSE, CSE-AIML, ECE, IT, MECH

    @Column(nullable = false, length = 100)
    private String branch;

    @Column(name = "batch_year", nullable = false, length = 20)
    private String batchYear;

    @Column(name = "current_semester", nullable = false)
    private Integer currentSemester = 1;

    @Column(nullable = false, length = 10)
    private String section = "A";

    @Column(name = "current_cgpa", precision = 4, scale = 2)
    private BigDecimal currentCgpa = BigDecimal.ZERO;

    @Column(name = "total_credits")
    private Integer totalCredits = 0;

    @Column(name = "fee_category", length = 50)
    private String feeCategory = "CONVENER"; // CONVENER or MANAGEMENT

    public StudentProfile() {}

    public StudentProfile(Long id, User user, String hallTicketNo, String department, String branch, String batchYear, Integer currentSemester, String section, BigDecimal currentCgpa, Integer totalCredits, String feeCategory) {
        this.id = id;
        this.user = user;
        this.hallTicketNo = hallTicketNo;
        this.department = department;
        this.branch = branch;
        this.batchYear = batchYear;
        this.currentSemester = currentSemester;
        this.section = section;
        this.currentCgpa = currentCgpa;
        this.totalCredits = totalCredits;
        this.feeCategory = feeCategory;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getHallTicketNo() { return hallTicketNo; }
    public void setHallTicketNo(String hallTicketNo) { this.hallTicketNo = hallTicketNo; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getBranch() { return branch; }
    public void setBranch(String branch) { this.branch = branch; }

    public String getBatchYear() { return batchYear; }
    public void setBatchYear(String batchYear) { this.batchYear = batchYear; }

    public Integer getCurrentSemester() { return currentSemester; }
    public void setCurrentSemester(Integer currentSemester) { this.currentSemester = currentSemester; }

    public String getSection() { return section; }
    public void setSection(String section) { this.section = section; }

    public BigDecimal getCurrentCgpa() { return currentCgpa; }
    public void setCurrentCgpa(BigDecimal currentCgpa) { this.currentCgpa = currentCgpa; }

    public Integer getTotalCredits() { return totalCredits; }
    public void setTotalCredits(Integer totalCredits) { this.totalCredits = totalCredits; }

    public String getFeeCategory() { return feeCategory; }
    public void setFeeCategory(String feeCategory) { this.feeCategory = feeCategory; }
}
