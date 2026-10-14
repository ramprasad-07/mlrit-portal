package com.mlrit.portal.dto;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

public class ChatbotResponse {
    private String reply;
    private String intent;
    private List<QuickAction> quickActions = new ArrayList<>();
    private Map<String, Object> dataCard;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ChatbotResponse() {}

    public ChatbotResponse(String reply, String intent) {
        this.reply = reply;
        this.intent = intent;
    }

    public static class QuickAction {
        private String label;
        private String path;
        private String actionType; // NAVIGATE, QUERY, EXTERNAL

        public QuickAction() {}

        public QuickAction(String label, String path, String actionType) {
            this.label = label;
            this.path = path;
            this.actionType = actionType;
        }

        public String getLabel() {
            return label;
        }

        public void setLabel(String label) {
            this.label = label;
        }

        public String getPath() {
            return path;
        }

        public void setPath(String path) {
            this.path = path;
        }

        public String getActionType() {
            return actionType;
        }

        public void setActionType(String actionType) {
            this.actionType = actionType;
        }
    }

    public String getReply() {
        return reply;
    }

    public void setReply(String reply) {
        this.reply = reply;
    }

    public String getIntent() {
        return intent;
    }

    public void setIntent(String intent) {
        this.intent = intent;
    }

    public List<QuickAction> getQuickActions() {
        return quickActions;
    }

    public void setQuickActions(List<QuickAction> quickActions) {
        this.quickActions = quickActions;
    }

    public Map<String, Object> getDataCard() {
        return dataCard;
    }

    public void setDataCard(Map<String, Object> dataCard) {
        this.dataCard = dataCard;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }
}
