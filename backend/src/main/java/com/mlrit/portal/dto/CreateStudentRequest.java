package com.mlrit.portal.dto;

import jakarta.validation.constraints.NotBlank;
import java.math.BigDecimal;

public class CreateStudentRequest {

    @NotBlank(message = "Hall ticket / Roll number is required")
    private String hallTicketNo;

    @NotBlank(message = "Full name is required")
    private String fullName;

    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    private String password;

    private String phone = "9849012345";
    private String department = "CSE";
    private String branch = "B.Tech Computer Science & Engineering";
    private String batchYear = "2024-2028";
    private Integer currentSemester = 3;
    private String section = "A";
    private BigDecimal currentCgpa = new BigDecimal("8.50");
    private Integer totalCredits = 48;
    private String feeCategory = "CONVENER";
    private String admitDate = "18-Aug-2022";
    private String dateOfBirth = "15-Jun-2004";
    private String caste = "BC-B";
    private String fatherName = "K. Ramesh";
    private String motherName = "K. Sunitha";
    private String parentMobile = "9849098765";
    private String aadhaarNo = "7849 2039 1102";
    private String apaarId = "APAAR-2022-9901";

    public CreateStudentRequest() {}

    public String getHallTicketNo() { return hallTicketNo; }
    public void setHallTicketNo(String hallTicketNo) { this.hallTicketNo = hallTicketNo; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

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

    public String getAdmitDate() { return admitDate; }
    public void setAdmitDate(String admitDate) { this.admitDate = admitDate; }

    public String getDateOfBirth() { return dateOfBirth; }
    public void setDateOfBirth(String dateOfBirth) { this.dateOfBirth = dateOfBirth; }

    public String getCaste() { return caste; }
    public void setCaste(String caste) { this.caste = caste; }

    public String getFatherName() { return fatherName; }
    public void setFatherName(String fatherName) { this.fatherName = fatherName; }

    public String getMotherName() { return motherName; }
    public void setMotherName(String motherName) { this.motherName = motherName; }

    public String getParentMobile() { return parentMobile; }
    public void setParentMobile(String parentMobile) { this.parentMobile = parentMobile; }

    public String getAadhaarNo() { return aadhaarNo; }
    public void setAadhaarNo(String aadhaarNo) { this.aadhaarNo = aadhaarNo; }

    public String getApaarId() { return apaarId; }
    public void setApaarId(String apaarId) { this.apaarId = apaarId; }
}
