package com.mlrit.portal.controller;

import com.mlrit.portal.dto.ChatbotResponse;
import com.mlrit.portal.service.ChatbotService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collections;

import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest
public class ChatbotControllerTest {

    @Autowired
    private ChatbotService chatbotService;

    @Autowired
    private ChatbotController chatbotController;

    @Test
    @DisplayName("Public user can check status of chatbot")
    void testChatbotStatus() {
        var status = chatbotController.getStatus().getBody();
        assertNotNull(status);
        assertEquals("ONLINE", status.get("status"));
        assertEquals("MLRIT Mitra Assistant", status.get("name"));
    }

    @Test
    @DisplayName("Public user gets relevant starter suggestions")
    void testChatbotSuggestionsPublic() {
        var suggestions = chatbotController.getSuggestions(null).getBody();
        assertNotNull(suggestions);
        assertFalse(suggestions.isEmpty());
        assertTrue(suggestions.stream().anyMatch(s -> s.contains("placement") || s.contains("branches") || s.contains("credentials")));
    }

    @Test
    @DisplayName("Public user can query MLRIT placements")
    void testPlacementsQuery() {
        ChatbotResponse res = chatbotService.processMessage("Tell me about MLRIT placements and highest package", null);
        assertNotNull(res);
        assertEquals("PLACEMENTS", res.getIntent());
        assertTrue(res.getReply().contains("30+ LPA"));
        assertTrue(res.getReply().contains("Amazon"));
    }

    @Test
    @DisplayName("Public user can query demo credentials")
    void testDemoCredentialsQuery() {
        ChatbotResponse res = chatbotService.processMessage("How to login and what are demo passwords?", null);
        assertNotNull(res);
        assertEquals("CREDENTIALS", res.getIntent());
        assertTrue(res.getReply().contains("21R21A0501"));
        assertTrue(res.getReply().contains("MLRIT-FAC-101"));
    }

    @Test
    @DisplayName("Public user can query campus facilities and location")
    void testCampusQuery() {
        ChatbotResponse res = chatbotService.processMessage("Where is the campus located?", null);
        assertNotNull(res);
        assertEquals("CAMPUS", res.getIntent());
        assertTrue(res.getReply().contains("Dundigal"));
    }

    @Test
    @DisplayName("Authenticated student can query live attendance")
    void testStudentAttendance() {
        var auth = new UsernamePasswordAuthenticationToken(
                "21R21A0501",
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        ChatbotResponse res = chatbotService.processMessage("What is my current attendance?", auth);
        assertNotNull(res);
        assertEquals("ATTENDANCE", res.getIntent());
        assertNotNull(res.getDataCard());
        assertEquals("ATTENDANCE", res.getDataCard().get("type"));
        assertNotNull(res.getDataCard().get("percentage"));
        assertFalse(res.getQuickActions().isEmpty());
    }

    @Test
    @DisplayName("Authenticated student can query fee balance")
    void testStudentFees() {
        var auth = new UsernamePasswordAuthenticationToken(
                "21R21A0501",
                null,
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_STUDENT"))
        );

        ChatbotResponse res = chatbotService.processMessage("Do I have pending fees?", auth);
        assertNotNull(res);
        assertEquals("FEES", res.getIntent());
        assertNotNull(res.getDataCard());
        assertEquals("FEES", res.getDataCard().get("type"));
        assertNotNull(res.getDataCard().get("feeDues"));
    }
}
