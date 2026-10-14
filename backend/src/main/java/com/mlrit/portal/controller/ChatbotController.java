package com.mlrit.portal.controller;

import com.mlrit.portal.dto.ChatbotRequest;
import com.mlrit.portal.dto.ChatbotResponse;
import com.mlrit.portal.service.ChatbotService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/api/chatbot")
public class ChatbotController {

    private final ChatbotService chatbotService;

    public ChatbotController(ChatbotService chatbotService) {
        this.chatbotService = chatbotService;
    }

    @PostMapping("/message")
    public ResponseEntity<ChatbotResponse> sendMessage(
            @RequestBody ChatbotRequest request,
            Authentication authentication) {
        ChatbotResponse response = chatbotService.processMessage(request.getMessage(), authentication);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/suggestions")
    public ResponseEntity<List<String>> getSuggestions(Authentication authentication) {
        List<String> list = new ArrayList<>();
        boolean isAuth = authentication != null && authentication.isAuthenticated() && !authentication.getName().equalsIgnoreCase("anonymousUser");

        if (isAuth) {
            String role = authentication.getAuthorities().stream()
                    .map(a -> a.getAuthority().replace("ROLE_", ""))
                    .findFirst()
                    .orElse("STUDENT");

            if ("STUDENT".equalsIgnoreCase(role)) {
                list.add("What is my attendance percentage?");
                list.add("What is my current CGPA & mid marks?");
                list.add("Do I have pending fee dues?");
                list.add("What classes do I have today?");
                list.add("Show latest college notices");
                list.add("What assignments are due?");
            } else if ("FACULTY".equalsIgnoreCase(role)) {
                list.add("How do I mark daily attendance?");
                list.add("How to upload LMS study notes?");
                list.add("What are the college circulars?");
                list.add("Faculty leave policy");
            } else {
                list.add("Show audit trail info");
                list.add("Fee collection overview");
                list.add("Campus statistics");
                list.add("Recent notices");
            }
        } else {
            list.add("What is MLRIT's highest placement package?");
            list.add("What B.Tech branches are available?");
            list.add("Where is MLRIT campus located?");
            list.add("What are the demo login credentials?");
            list.add("Tell me about the portal features");
        }

        return ResponseEntity.ok(list);
    }

    @GetMapping("/status")
    public ResponseEntity<Map<String, Object>> getStatus() {
        Map<String, Object> map = new HashMap<>();
        map.put("name", "MLRIT Mitra Assistant");
        map.put("status", "ONLINE");
        map.put("version", "1.0.0");
        return ResponseEntity.ok(map);
    }
}
