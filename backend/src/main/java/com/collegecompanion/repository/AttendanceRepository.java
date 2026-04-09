package com.collegecompanion.repository;

import com.collegecompanion.model.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    
    // Check if student already marked attendance for a session (prevent proxy)
    Optional<Attendance> findBySessionIdAndStudentId(Long sessionId, Long studentId);
    
    // Get all attendance records for a student
    List<Attendance> findByStudentIdOrderByMarkedAtDesc(Long studentId);
    
    // Get attendance for a specific session
    List<Attendance> findBySessionId(Long sessionId);
    
    // Get student's attendance count by status
    @Query("SELECT COUNT(a) FROM Attendance a WHERE a.studentId = ?1 AND a.status = ?2")
    Long countByStudentIdAndStatus(Long studentId, String status);
    
    // Get student's attendance for specific subject
    @Query("SELECT a FROM Attendance a WHERE a.studentId = ?1 AND a.session.subject = ?2 ORDER BY a.markedAt DESC")
    List<Attendance> findByStudentIdAndSubject(Long studentId, String subject);
}
