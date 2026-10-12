package com.mlrit.portal.dto;

import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.util.List;

public class AttendanceEntryRequest {

    @NotNull(message = "Course ID is required")
    private Long courseId;

    @NotNull(message = "Attendance Date is required")
    private LocalDate attendanceDate;

    @NotNull(message = "Period slot is required")
    private Integer periodSlot;

    @NotNull(message = "Student records list is required")
    private List<StudentAttendanceItem> items;

    public static class StudentAttendanceItem {
        private Long studentId;
        private String status; // PRESENT, ABSENT, ON_DUTY

        public StudentAttendanceItem() {}
        public StudentAttendanceItem(Long studentId, String status) {
            this.studentId = studentId;
            this.status = status;
        }

        public Long getStudentId() { return studentId; }
        public void setStudentId(Long studentId) { this.studentId = studentId; }

        public String getStatus() { return status; }
        public void setStatus(String status) { this.status = status; }
    }

    public AttendanceEntryRequest() {}

    public Long getCourseId() { return courseId; }
    public void setCourseId(Long courseId) { this.courseId = courseId; }

    public LocalDate getAttendanceDate() { return attendanceDate; }
    public void setAttendanceDate(LocalDate attendanceDate) { this.attendanceDate = attendanceDate; }

    public Integer getPeriodSlot() { return periodSlot; }
    public void setPeriodSlot(Integer periodSlot) { this.periodSlot = periodSlot; }

    public List<StudentAttendanceItem> getItems() { return items; }
    public void setItems(List<StudentAttendanceItem> items) { this.items = items; }
}
