package com.mlrit.portal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "faculty_profiles")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class FacultyProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", referencedColumnName = "id", nullable = false)
    private User user;

    @Column(name = "employee_id", unique = true, nullable = false, length = 50)
    private String employeeId;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(nullable = false, length = 50)
    private String designation; // Professor, Associate Professor, Assistant Professor

    @Column(nullable = false, length = 100)
    private String qualification; // Ph.D, M.Tech

    @Column(name = "cabin_no", length = 50)
    private String cabinNo;

    public FacultyProfile() {}

    public FacultyProfile(Long id, User user, String employeeId, String department, String designation, String qualification, String cabinNo) {
        this.id = id;
        this.user = user;
        this.employeeId = employeeId;
        this.department = department;
        this.designation = designation;
        this.qualification = qualification;
        this.cabinNo = cabinNo;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public String getEmployeeId() { return employeeId; }
    public void setEmployeeId(String employeeId) { this.employeeId = employeeId; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getDesignation() { return designation; }
    public void setDesignation(String designation) { this.designation = designation; }

    public String getQualification() { return qualification; }
    public void setQualification(String qualification) { this.qualification = qualification; }

    public String getCabinNo() { return cabinNo; }
    public void setCabinNo(String cabinNo) { this.cabinNo = cabinNo; }
}
