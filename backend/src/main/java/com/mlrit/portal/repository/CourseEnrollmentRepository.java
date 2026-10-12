package com.mlrit.portal.repository;

import com.mlrit.portal.model.CourseEnrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseEnrollmentRepository extends JpaRepository<CourseEnrollment, Long> {
    List<CourseEnrollment> findByStudentId(Long studentId);
    List<CourseEnrollment> findByStudentIdAndSemester(Long studentId, Integer semester);
    List<CourseEnrollment> findByCourseId(Long courseId);
}
