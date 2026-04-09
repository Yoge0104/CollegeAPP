package com.collegecompanion.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "doubt_replies")
public class DoubtReply {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "doubt_id", nullable = false)
    @JsonBackReference
    private Doubt doubt;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;
    
    @Column(name = "replied_by")
    private Long repliedBy;
    
    @Column(name = "replier_name")
    private String replierName;
    
    @Column(name = "replier_role")
    private String replierRole;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Doubt getDoubt() {
        return doubt;
    }
    
    public void setDoubt(Doubt doubt) {
        this.doubt = doubt;
    }
    
    public String getContent() {
        return content;
    }
    
    public void setContent(String content) {
        this.content = content;
    }
    
    public Long getRepliedBy() {
        return repliedBy;
    }
    
    public void setRepliedBy(Long repliedBy) {
        this.repliedBy = repliedBy;
    }
    
    public String getReplierName() {
        return replierName;
    }
    
    public void setReplierName(String replierName) {
        this.replierName = replierName;
    }
    
    public String getReplierRole() {
        return replierRole;
    }
    
    public void setReplierRole(String replierRole) {
        this.replierRole = replierRole;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
