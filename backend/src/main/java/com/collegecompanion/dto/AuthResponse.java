package com.collegecompanion.dto;

public class AuthResponse {
    private Long id;
    private String token;
    private String email;
    private String name;
    private String role;
    private String branch;
    private Integer year;
    private String section;
    
    public AuthResponse(Long id, String token, String email, String name, String role, String branch, Integer year, String section) {
        this.id = id;
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
        this.branch = branch;
        this.year = year;
        this.section = section;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    public String getToken() {
        return token;
    }
    
    public void setToken(String token) {
        this.token = token;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getRole() {
        return role;
    }
    
    public void setRole(String role) {
        this.role = role;
    }
    
    public String getBranch() {
        return branch;
    }
    
    public void setBranch(String branch) {
        this.branch = branch;
    }
    
    public Integer getYear() {
        return year;
    }
    
    public void setYear(Integer year) {
        this.year = year;
    }
    
    public String getSection() {
        return section;
    }
    
    public void setSection(String section) {
        this.section = section;
    }
}
