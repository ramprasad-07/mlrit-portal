package com.mlrit.portal.repository;

import com.mlrit.portal.model.FeeStructure;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FeeStructureRepository extends JpaRepository<FeeStructure, Long> {
    Optional<FeeStructure> findByAcademicYearAndDepartmentAndCategory(String academicYear, String department, String category);
    List<FeeStructure> findByDepartment(String department);
    List<FeeStructure> findByAcademicYear(String academicYear);
}
