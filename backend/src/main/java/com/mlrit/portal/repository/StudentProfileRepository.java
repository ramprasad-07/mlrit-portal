package com.mlrit.portal.repository;

import com.mlrit.portal.model.StudentProfile;
import com.mlrit.portal.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentProfileRepository extends JpaRepository<StudentProfile, Long> {
    Optional<StudentProfile> findByHallTicketNo(String hallTicketNo);
    Optional<StudentProfile> findByUser(User user);
    Optional<StudentProfile> findByUserId(Long userId);
    List<StudentProfile> findByDepartmentAndCurrentSemesterAndSection(String department, Integer currentSemester, String section);
    List<StudentProfile> findByDepartment(String department);
}
