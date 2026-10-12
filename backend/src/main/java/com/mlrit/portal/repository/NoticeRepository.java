package com.mlrit.portal.repository;

import com.mlrit.portal.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findAllByOrderByIsPinnedDescPublishedAtDesc();
    List<Notice> findByTargetAudienceInOrderByIsPinnedDescPublishedAtDesc(List<String> targetAudiences);
    List<Notice> findByCategoryOrderByPublishedAtDesc(String category);
}
