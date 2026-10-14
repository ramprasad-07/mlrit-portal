package com.mlrit.portal.repository;

import com.mlrit.portal.model.FacultyLeave;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FacultyLeaveRepository extends JpaRepository<FacultyLeave, Long> {
    List<FacultyLeave> findByFacultyIdOrderByAppliedAtDesc(Long facultyId);
    List<FacultyLeave> findAllByOrderByAppliedAtDesc();
}
