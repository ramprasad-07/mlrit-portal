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

    @Column(name = "admit_date", length = 30)
    private String admitDate = "18-Aug-2022";

    @Column(name = "date_of_birth", length = 30)
    private String dateOfBirth = "15-Jun-2004";

    @Column(length = 50)
    private String caste = "BC-B";

    @Column(name = "father_name", length = 100)
    private String fatherName = "K. Ramesh";

    @Column(name = "mother_name", length = 100)
    private String motherName = "K. Sunitha";

    @Column(name = "parent_mobile", length = 20)
    private String parentMobile = "9849098765";

    @Column(name = "aadhaar_no", length = 30)
    private String aadhaarNo = "7849 2039 1102";

    @Column(name = "apaar_id", length = 50)
    private String apaarId = "APAAR-2022-9901";

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

    public String getFeeCategory() { return feeCategory != null ? feeCategory : "CONVENER"; }
    public void setFeeCategory(String feeCategory) { this.feeCategory = feeCategory; }

    public String getAdmitDate() { return admitDate != null ? admitDate : "18-Aug-2022"; }
    public void setAdmitDate(String admitDate) { this.admitDate = admitDate; }

    public String getDateOfBirth() { return dateOfBirth != null ? dateOfBirth : "15-Jun-2004"; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getCaste() { return caste != null ? caste : "BC-B"; }
    public void setCaste(String caste) { this.caste = caste; }

    public String getFatherName() { return fatherName != null ? fatherName : "K. Ramesh"; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getMotherName() { return motherName != null ? motherName : "K. Sunitha"; }
    public void setMotherName(String motherName) { this.motherName = motherName; }

    public String getParentMobile() { return parentMobile != null ? parentMobile : "9849098765"; }
    public void setParentMobile(String parentMobile) { this.parentMobile = parentMobile; }

    public String getAadhaarNo() { return aadhaarNo != null ? aadhaarNo : "7849 2039 1102"; }
    public void setAadhaarNo(String aadhaarNo) { this.aadhaarNo = aadhaarNo; }

    public String getApaarId() { return apaarId != null ? apaarId : "APAAR-2022-9901"; }
    public void setApaarId(String apaarId) { this.apaarId = apaarId; }
}
