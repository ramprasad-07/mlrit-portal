package com.mlrit.portal.dto;

import jakarta.validation.constraints.NotBlank;

public class LoginRequest {

    @NotBlank(message = "Username / Identifier is required")
    private String username; // Hall ticket for student, Employee ID for faculty, Email for admin

    @NotBlank(message = "Password is required")
    private String password;

    private String role; // Optional hint: STUDENT, FACULTY, ADMIN

    public LoginRequest() {}

    public LoginRequest(String username, String password, String role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
}
