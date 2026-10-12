package com.mlrit.portal.repository;

import com.mlrit.portal.model.Timetable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TimetableRepository extends JpaRepository<Timetable, Long> {
    List<Timetable> findByDepartmentAndSemesterAndSectionOrderByStartTimeAsc(String department, Integer semester, String section);
    List<Timetable> findByFacultyIdOrderByStartTimeAsc(Long facultyId);
}
