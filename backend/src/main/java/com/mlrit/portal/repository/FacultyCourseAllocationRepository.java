package com.mlrit.portal.repository;

import com.mlrit.portal.model.FacultyCourseAllocation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyCourseAllocationRepository extends JpaRepository<FacultyCourseAllocation, Long> {
    List<FacultyCourseAllocation> findByFacultyId(Long facultyId);
    List<FacultyCourseAllocation> findByFacultyIdAndAcademicYear(Long facultyId, String academicYear);
    List<FacultyCourseAllocation> findByCourseId(Long courseId);
}
