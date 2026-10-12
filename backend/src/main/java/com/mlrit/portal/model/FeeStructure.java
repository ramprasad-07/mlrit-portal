package com.mlrit.portal.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "fee_structures", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"academic_year", "department", "category"})
})
public class FeeStructure {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "academic_year", nullable = false, length = 20)
    private String academicYear;

    @Column(nullable = false, length = 50)
    private String department;

    @Column(nullable = false, length = 50)
    private String category; // CONVENER or MANAGEMENT

    @Column(name = "tuition_fee", precision = 10, scale = 2, nullable = false)
    private BigDecimal tuitionFee;

    @Column(name = "special_fee", precision = 10, scale = 2)
    private BigDecimal specialFee = BigDecimal.ZERO;

    @Column(name = "exam_fee", precision = 10, scale = 2)
    private BigDecimal examFee = BigDecimal.ZERO;

    @Column(name = "bus_fee", precision = 10, scale = 2)
    private BigDecimal busFee = BigDecimal.ZERO;

    @Column(name = "hostel_fee", precision = 10, scale = 2)
    private BigDecimal hostelFee = BigDecimal.ZERO;

    @Column(name = "total_amount", precision = 10, scale = 2, nullable = false)
    private BigDecimal totalAmount;

    public FeeStructure() {}

    public FeeStructure(Long id, String academicYear, String department, String category, BigDecimal tuitionFee, BigDecimal specialFee, BigDecimal examFee, BigDecimal busFee, BigDecimal hostelFee, BigDecimal totalAmount) {
        this.id = id;
        this.academicYear = academicYear;
        this.department = department;
        this.category = category;
        this.tuitionFee = tuitionFee;
        this.specialFee = specialFee;
        this.examFee = examFee;
        this.busFee = busFee;
        this.hostelFee = hostelFee;
        this.totalAmount = totalAmount;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAcademicYear() { return academicYear; }
    public void setAcademicYear(String academicYear) { this.academicYear = academicYear; }

    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public BigDecimal getTuitionFee() { return tuitionFee; }
    public void setTuitionFee(BigDecimal tuitionFee) { this.tuitionFee = tuitionFee; }

    public BigDecimal getSpecialFee() { return specialFee; }
    public void setSpecialFee(BigDecimal specialFee) { this.specialFee = specialFee; }

    public BigDecimal getExamFee() { return examFee; }
    public void setExamFee(BigDecimal examFee) { this.examFee = examFee; }

    public BigDecimal getBusFee() { return busFee; }
    public void setBusFee(BigDecimal busFee) { this.busFee = busFee; }

    public BigDecimal getHostelFee() { return hostelFee; }
    public void setHostelFee(BigDecimal hostelFee) { this.hostelFee = hostelFee; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
}
