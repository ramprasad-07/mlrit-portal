package com.mlrit.portal.repository;

import com.mlrit.portal.model.FacultyProfile;
import com.mlrit.portal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FacultyProfileRepository extends JpaRepository<FacultyProfile, Long> {
    Optional<FacultyProfile> findByEmployeeId(String employeeId);
    Optional<FacultyProfile> findByUser(User user);
    Optional<FacultyProfile> findByUserId(Long userId);
    List<FacultyProfile> findByDepartment(String department);
}
