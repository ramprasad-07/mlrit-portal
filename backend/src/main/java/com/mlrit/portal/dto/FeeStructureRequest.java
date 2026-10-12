package com.mlrit.portal.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public class FeeStructureRequest {

    @NotBlank(message = "Academic year is required")
    private String academicYear;

    @NotBlank(message = "Department is required")
    private String department;

    @NotBlank(message = "Category is required")
    private String category; // CONVENER, MANAGEMENT

    @NotNull(message = "Tuition fee is required")
    @DecimalMin("0.0")
    private BigDecimal tuitionFee;

    private BigDecimal specialFee = BigDecimal.ZERO;
    private BigDecimal examFee = BigDecimal.ZERO;
    private BigDecimal busFee = BigDecimal.ZERO;
    private BigDecimal hostelFee = BigDecimal.ZERO;

    private String reason = "Fee structure setup"; // For Audit Log

    public FeeStructureRequest() {}

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

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
