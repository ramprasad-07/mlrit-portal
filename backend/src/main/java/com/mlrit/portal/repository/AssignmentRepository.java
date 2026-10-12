package com.mlrit.portal.repository;

import com.mlrit.portal.model.Assignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository extends JpaRepository<Assignment, Long> {
    List<Assignment> findByCourseId(Long courseId);
    List<Assignment> findByCourseIdAndSection(Long courseId, String section);
    List<Assignment> findByCreatedById(Long facultyId);
}
