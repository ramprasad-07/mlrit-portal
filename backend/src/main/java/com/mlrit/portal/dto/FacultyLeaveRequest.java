package com.mlrit.portal.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public class FacultyLeaveRequest {

    @NotBlank(message = "Leave type is required")
    private String leaveType; // CASUAL, MEDICAL, ON_DUTY

    @NotNull(message = "Start date is required")
    private LocalDate fromDate;

    @NotNull(message = "End date is required")
    private LocalDate toDate;

    @NotNull(message = "Total days is required")
    private Integer totalDays;

    private String reason;

    public FacultyLeaveRequest() {}

    public String getLeaveType() { return leaveType; }
    public void setLeaveType(String leaveType) { this.leaveType = leaveType; }

    public LocalDate getFromDate() { return fromDate; }
    public void setFromDate(LocalDate fromDate) { this.fromDate = fromDate; }

    public LocalDate getToDate() { return toDate; }
    public void setToDate(LocalDate toDate) { this.toDate = toDate; }

    public Integer getTotalDays() { return totalDays; }
    public void setTotalDays(Integer totalDays) { this.totalDays = totalDays; }

    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
}
