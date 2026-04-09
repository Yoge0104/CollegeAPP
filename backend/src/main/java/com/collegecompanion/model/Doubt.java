package com.collegecompanion.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "doubts")
public class Doubt {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String title;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;
    
    @Column(nullable = false)
    private String subject;
    
    private String tags;
    
    @Column(name = "posted_by")
    private Long postedBy;
    
    @Column(name = "poster_name")
    private String posterName;
    
    @Column(name = "poster_email")
    private String posterEmail;
    
    private Integer upvotes = 0;
    
    private Boolean resolved = false;
    
    @OneToMany(mappedBy = "doubt", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<DoubtReply> replies = new ArrayList<>();
    
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
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle(String title) {
        this.title = title;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public String getSubject() {
        return subject;
    }
    
    public void setSubject(String subject) {
        this.subject = subject;
    }
    
    public String getTags() {
        return tags;
    }
    
    public void setTags(String tags) {
        this.tags = tags;
    }
    
    public Long getPostedBy() {
        return postedBy;
    }
    
    public void setPostedBy(Long postedBy) {
        this.postedBy = postedBy;
    }
    
    public String getPosterName() {
        return posterName;
    }
    
    public void setPosterName(String posterName) {
        this.posterName = posterName;
    }
    
    public String getPosterEmail() {
        return posterEmail;
    }
    
    public void setPosterEmail(String posterEmail) {
        this.posterEmail = posterEmail;
    }
    
    public Integer getUpvotes() {
        return upvotes;
    }
    
    public void setUpvotes(Integer upvotes) {
        this.upvotes = upvotes;
    }
    
    public Boolean getResolved() {
        return resolved;
    }
    
    public void setResolved(Boolean resolved) {
        this.resolved = resolved;
    }
    
    public List<DoubtReply> getReplies() {
        return replies;
    }
    
    public void setReplies(List<DoubtReply> replies) {
        this.replies = replies;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
