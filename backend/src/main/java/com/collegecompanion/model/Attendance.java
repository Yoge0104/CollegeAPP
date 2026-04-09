package com.collegecompanion.model;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "attendance", 
    uniqueConstraints = @UniqueConstraint(columnNames = {"session_id", "student_id"}))
public class Attendance {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private AttendanceSession session;
    
    @Column(name = "student_id", nullable = false)
    private Long studentId;
    
    @Column(name = "student_name", nullable = false)
    private String studentName;
    
    @Column(name = "student_email", nullable = false)
    private String studentEmail;
    
    @Column(nullable = false)
    private String status; // PRESENT, ABSENT
    
    @Column(name = "marked_at")
    private LocalDateTime markedAt;
    
    @Column(name = "marked_by")
    private Long markedBy; // Faculty who marked attendance
    
    @Column(name = "marked_by_name")
    private String markedByName;
    
    @PrePersist
    protected void onCreate() {
        markedAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public AttendanceSession getSession() {
        return session;
    }
    
    public void setSession(AttendanceSession session) {
        this.session = session;
    }
    
    public Long getStudentId() {
        return studentId;
    }
    
    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }
    
    public String getStudentName() {
        return studentName;
    }
    
    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }
    
    public String getStudentEmail() {
        return studentEmail;
    }
    
    public void setStudentEmail(String studentEmail) {
        this.studentEmail = studentEmail;
    }
    
    public String getStatus() {
        return status;
    }
    
    public void setStatus(String status) {
        this.status = status;
    }
    
    public LocalDateTime getMarkedAt() {
        return markedAt;
    }
    
    public void setMarkedAt(LocalDateTime markedAt) {
        this.markedAt = markedAt;
    }
    
    public Long getMarkedBy() {
        return markedBy;
    }
    
    public void setMarkedBy(Long markedBy) {
        this.markedBy = markedBy;
    }
    
    public String getMarkedByName() {
        return markedByName;
    }
    
    public void setMarkedByName(String markedByName) {
        this.markedByName = markedByName;
    }
}
