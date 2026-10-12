package com.mlrit.portal.repository;

import com.mlrit.portal.model.Exam;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    Optional<Exam> findByNameAndSemesterAndAcademicYear(String name, Integer semester, String academicYear);
    List<Exam> findBySemesterAndAcademicYear(Integer semester, String academicYear);
    List<Exam> findByIsPublishedTrue();
}
