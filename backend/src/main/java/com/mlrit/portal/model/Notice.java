package com.mlrit.portal.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "notices")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 250)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(nullable = false, length = 50)
    private String category; // ACADEMIC, EXAM, FEES, EVENTS, CIRCULAR

    @Column(name = "target_audience", nullable = false, length = 20)
    private String targetAudience = "ALL"; // ALL, STUDENT, FACULTY

    @Column(name = "is_pinned", nullable = false)
    private Boolean isPinned = false;

    @Column(name = "published_at")
    private LocalDateTime publishedAt = LocalDateTime.now();

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    public Notice() {}

    public Notice(Long id, String title, String content, String category, String targetAudience, Boolean isPinned, User createdBy) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.category = category;
        this.targetAudience = targetAudience;
        this.isPinned = isPinned;
        this.createdBy = createdBy;
        this.publishedAt = LocalDateTime.now();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getTargetAudience() { return targetAudience; }
    public void setTargetAudience(String targetAudience) { this.targetAudience = targetAudience; }

    public Boolean getIsPinned() { return isPinned; }
    public void setIsPinned(Boolean isPinned) { this.isPinned = isPinned; }

    public LocalDateTime getPublishedAt() { return publishedAt; }
    public void setPublishedAt(LocalDateTime publishedAt) { this.publishedAt = publishedAt; }

    public User getCreatedBy() { return createdBy; }
    public void setCreatedBy(User createdBy) { this.createdBy = createdBy; }
}
