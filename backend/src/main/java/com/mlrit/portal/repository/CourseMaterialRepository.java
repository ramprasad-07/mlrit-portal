package com.mlrit.portal.repository;

import com.mlrit.portal.model.CourseMaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseMaterialRepository extends JpaRepository<CourseMaterial, Long> {
    List<CourseMaterial> findByModuleIdOrderByUploadedAtDesc(Long moduleId);
    List<CourseMaterial> findByModuleCourseIdOrderByUploadedAtDesc(Long courseId);
}
