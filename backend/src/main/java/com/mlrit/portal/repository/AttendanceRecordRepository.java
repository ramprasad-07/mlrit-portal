package com.mlrit.portal.repository;

import com.mlrit.portal.model.AttendanceRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRecordRepository extends JpaRepository<AttendanceRecord, Long> {
    List<AttendanceRecord> findByStudentId(Long studentId);
    List<AttendanceRecord> findByStudentIdAndCourseId(Long studentId, Long courseId);
    List<AttendanceRecord> findByCourseIdAndAttendanceDate(Long courseId, LocalDate attendanceDate);
    Optional<AttendanceRecord> findByStudentIdAndCourseIdAndAttendanceDateAndPeriodSlot(Long studentId, Long courseId, LocalDate attendanceDate, Integer periodSlot);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.student.id = :studentId AND a.course.id = :courseId")
    long countTotalClasses(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.student.id = :studentId AND a.course.id = :courseId AND a.status IN ('PRESENT', 'ON_DUTY')")
    long countAttendedClasses(@Param("studentId") Long studentId, @Param("courseId") Long courseId);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.student.id = :studentId")
    long countTotalStudentClasses(@Param("studentId") Long studentId);

    @Query("SELECT COUNT(a) FROM AttendanceRecord a WHERE a.student.id = :studentId AND a.status IN ('PRESENT', 'ON_DUTY')")
    long countTotalStudentAttended(@Param("studentId") Long studentId);
}
