package com.mlrit.portal.repository;

import com.mlrit.portal.model.Course;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    Optional<Course> findByCode(String code);
    List<Course> findByDepartmentAndSemester(String department, Integer semester);
    List<Course> findByDepartment(String department);
}
