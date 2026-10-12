package com.mlrit.portal.controller;

import com.mlrit.portal.dto.NoticeRequest;
import com.mlrit.portal.model.Notice;
import com.mlrit.portal.model.User;
import com.mlrit.portal.repository.NoticeRepository;
import com.mlrit.portal.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/notices")
public class NoticeController {

    private final NoticeRepository noticeRepository;
    private final UserRepository userRepository;

    public NoticeController(NoticeRepository noticeRepository, UserRepository userRepository) {
        this.noticeRepository = noticeRepository;
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<Notice>> getAllNotices() {
        return ResponseEntity.ok(noticeRepository.findAllByOrderByIsPinnedDescPublishedAtDesc());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Notice> createNotice(
            Authentication auth,
            @Valid @RequestBody NoticeRequest request) {
        User user = userRepository.findByUsername(auth.getName()).orElse(null);
        Notice notice = new Notice(
                null,
                request.getTitle(),
                request.getContent(),
                request.getCategory(),
                request.getTargetAudience() != null ? request.getTargetAudience() : "ALL",
                Boolean.TRUE.equals(request.getIsPinned()),
                user
        );
        return ResponseEntity.ok(noticeRepository.save(notice));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, String>> deleteNotice(@PathVariable Long id) {
        noticeRepository.deleteById(id);
        return ResponseEntity.ok(Map.of("message", "Notice deleted"));
    }
}
