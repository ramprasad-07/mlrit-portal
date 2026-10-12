package com.mlrit.portal.repository;

import com.mlrit.portal.model.MarkRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface MarkRecordRepository extends JpaRepository<MarkRecord, Long> {
    List<MarkRecord> findByStudentId(Long studentId);
    List<MarkRecord> findByStudentIdAndExamSemester(Long studentId, Integer semester);
    List<MarkRecord> findByCourseIdAndExamId(Long courseId, Long examId);
    Optional<MarkRecord> findByStudentIdAndCourseIdAndExamId(Long studentId, Long courseId, Long examId);
}
