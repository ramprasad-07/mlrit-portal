package com.mlrit.portal.dto;

import jakarta.validation.constraints.NotNull;

public class AssignmentSubmitRequest {

    @NotNull(message = "Assignment ID is required")
    private Long assignmentId;

    private String contentText;

    private String attachmentUrl;

    public AssignmentSubmitRequest() {}

    public Long getAssignmentId() { return assignmentId; }
    public void setAssignmentId(Long assignmentId) { this.assignmentId = assignmentId; }

    public String getContentText() { return contentText; }
    public void setContentText(String contentText) { this.contentText = contentText; }

    public String getAttachmentUrl() { return attachmentUrl; }
    public void setAttachmentUrl(String attachmentUrl) { this.attachmentUrl = attachmentUrl; }
}
