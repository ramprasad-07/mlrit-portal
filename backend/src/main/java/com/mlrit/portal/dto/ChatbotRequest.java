package com.mlrit.portal.dto;

public class ChatbotRequest {
    private String message;
    private String context; // optional client context (e.g. current page path)

    public ChatbotRequest() {}

    public ChatbotRequest(String message, String context) {
        this.message = message;
        this.context = context;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getContext() {
        return context;
    }

    public void setContext(String context) {
        this.context = context;
    }
}
