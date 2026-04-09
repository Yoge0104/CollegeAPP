package com.collegecompanion.repository;

import com.collegecompanion.model.AttendanceSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceSessionRepository extends JpaRepository<AttendanceSession, Long> {
    
    // Get active sessions for a specific class
    List<AttendanceSession> findByBranchAndYearAndSectionAndIsActiveTrueOrderByCreatedAtDesc(
        String branch, Integer year, String section);

    // Get active sessions for a specific class on a specific date
    List<AttendanceSession> findByBranchAndYearAndSectionAndSessionDateAndIsActiveTrueOrderByCreatedAtDesc(
        String branch, Integer year, String section, LocalDate date);
    
    // Get all sessions created by a faculty
    List<AttendanceSession> findByCreatedByOrderByCreatedAtDesc(Long facultyId);
    
    // Get active sessions created by a faculty
    List<AttendanceSession> findByCreatedByAndIsActiveTrue(Long facultyId);
    
    // Get sessions for a specific date
    List<AttendanceSession> findBySessionDateOrderByCreatedAtDesc(LocalDate date);
    
    // Get all active sessions
    List<AttendanceSession> findByIsActiveTrueOrderByCreatedAtDesc();
    
    // Get sessions for specific class and subject
    List<AttendanceSession> findByBranchAndYearAndSectionAndSubjectOrderByCreatedAtDesc(
        String branch, Integer year, String section, String subject);
}
