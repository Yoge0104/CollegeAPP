package com.collegecompanion.service;

import com.collegecompanion.model.Attendance;
import com.collegecompanion.model.AttendanceSession;
import com.collegecompanion.model.User;
import com.collegecompanion.repository.AttendanceRepository;
import com.collegecompanion.repository.AttendanceSessionRepository;
import com.collegecompanion.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceSessionRepository sessionRepository;

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // Faculty creates a new attendance session
    public AttendanceSession createSession(AttendanceSession session) {
        // 1. Close ALL active sessions for THIS class (branch/year/section)
        // to ensure students only see one "LIVE" attendance at a time.
        List<AttendanceSession> activeClassSessions = sessionRepository.findByBranchAndYearAndSectionAndIsActiveTrueOrderByCreatedAtDesc(
            session.getBranch(), session.getYear(), session.getSection());
        
        for (AttendanceSession s : activeClassSessions) {
            s.setIsActive(false);
            s.setClosedAt(LocalDateTime.now());
            sessionRepository.save(s);
        }

        // 2. Close ANY other active sessions by THIS faculty
        List<AttendanceSession> facultyActiveSessions = sessionRepository.findByCreatedByAndIsActiveTrue(session.getCreatedBy());
        for (AttendanceSession s : facultyActiveSessions) {
            s.setIsActive(false);
            s.setClosedAt(LocalDateTime.now());
            sessionRepository.save(s);
        }

        session.setIsActive(true);
        if (session.getSessionDate() == null) {
            session.setSessionDate(LocalDate.now());
        }
        return sessionRepository.save(session);
    }

    // Faculty closes an attendance session (permanently)
    public AttendanceSession closeSession(Long sessionId) {
        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!session.getIsActive()) {
            throw new RuntimeException("This session is already closed.");
        }

        session.setIsActive(false);
        session.setClosedAt(LocalDateTime.now());
        return sessionRepository.save(session);
    }

    // Get active sessions for student's class
    public List<AttendanceSession> getActiveSessionsForStudent(String branch, Integer year, String section) {
        // Only return active sessions for TODAY'S DATE
        return sessionRepository.findByBranchAndYearAndSectionAndSessionDateAndIsActiveTrueOrderByCreatedAtDesc(
            branch, year, section, LocalDate.now());
    }

    // Get all sessions created by faculty
    public List<AttendanceSession> getSessionsByFaculty(Long facultyId) {
        return sessionRepository.findByCreatedByOrderByCreatedAtDesc(facultyId);
    }

    // Mark attendance for a student (only faculty can call this, only once per session)
    public Attendance markAttendance(Long sessionId, Long studentId, String studentName, 
                                     String studentEmail, String status, Long facultyId, String facultyName) {
        // Check if session exists and is active
        AttendanceSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
        
        if (!session.getIsActive()) {
            throw new RuntimeException("This attendance session has been closed permanently.");
        }

        // Check if student already has attendance marked for this session
        Optional<Attendance> existing = attendanceRepository.findBySessionIdAndStudentId(sessionId, studentId);
        if (existing.isPresent()) {
            // If already marked, we can either allow correction (previous logic) 
            // or strictly block if user means "only one time no proxy"
            // Let's allow correction but ONLY if the status is different (to prevent redundant saves)
            Attendance attendance = existing.get();
            if (attendance.getStatus().equals(status)) {
                return attendance;
            }
            attendance.setStatus(status);
            attendance.setMarkedBy(facultyId);
            attendance.setMarkedByName(facultyName);
            attendance.setMarkedAt(LocalDateTime.now());
            return attendanceRepository.save(attendance);
        }

        // Create new attendance record
        Attendance attendance = new Attendance();
        attendance.setSession(session);
        attendance.setStudentId(studentId);
        attendance.setStudentName(studentName);
        attendance.setStudentEmail(studentEmail);
        attendance.setStatus(status);
        attendance.setMarkedBy(facultyId);
        attendance.setMarkedByName(facultyName);

        return attendanceRepository.save(attendance);
    }

    // Bulk mark attendance
    public List<Attendance> markBulkAttendance(Long sessionId, List<Map<String, Object>> attendanceList, Long facultyId, String facultyName) {
        List<Attendance> results = new ArrayList<>();
        for (Map<String, Object> item : attendanceList) {
            Long studentId = Long.valueOf(item.get("studentId").toString());
            String studentName = item.get("studentName").toString();
            String studentEmail = item.get("studentEmail").toString();
            String status = item.get("status").toString();
            
            results.add(markAttendance(sessionId, studentId, studentName, studentEmail, status, facultyId, facultyName));
        }
        return results;
    }

    // Get students for a class
    public List<User> getStudentsByClass(String branch, Integer year, String section) {
        return userRepository.findByBranchAndYearAndSectionAndRole(branch, year, section, "STUDENT");
    }

    // Bulk upload students for a class
    public List<User> uploadStudents(String branch, Integer year, String section, List<Map<String, String>> studentList) {
        List<User> createdUsers = new ArrayList<>();
        String defaultPassword = passwordEncoder.encode("student123");

        for (Map<String, String> data : studentList) {
            String email = data.get("email");
            String name = data.get("name");

            if (email != null && !userRepository.existsByEmail(email)) {
                User user = new User();
                user.setName(name);
                user.setEmail(email);
                user.setPassword(defaultPassword);
                user.setRole("STUDENT");
                user.setBranch(branch);
                user.setYear(year);
                user.setSection(section);
                createdUsers.add(userRepository.save(user));
            }
        }
        return createdUsers;
    }

    // Get student's attendance history
    public List<Attendance> getStudentAttendance(Long studentId) {
        return attendanceRepository.findByStudentIdOrderByMarkedAtDesc(studentId);
    }

    // Get attendance statistics for a student
    public Map<String, Object> getStudentAttendanceStats(Long studentId) {
        Map<String, Object> stats = new HashMap<>();
        
        Long totalPresent = attendanceRepository.countByStudentIdAndStatus(studentId, "PRESENT");
        Long totalAbsent = attendanceRepository.countByStudentIdAndStatus(studentId, "ABSENT");
        Long totalSessions = totalPresent + totalAbsent;
        
        double percentage = totalSessions > 0 ? (totalPresent * 100.0 / totalSessions) : 0.0;
        
        stats.put("totalPresent", totalPresent);
        stats.put("totalAbsent", totalAbsent);
        stats.put("totalSessions", totalSessions);
        stats.put("percentage", Math.round(percentage * 100.0) / 100.0);
        
        return stats;
    }

    // Get attendance for a specific session (for faculty to view)
    public List<Attendance> getSessionAttendance(Long sessionId) {
        return attendanceRepository.findBySessionId(sessionId);
    }

    // Get session details
    public AttendanceSession getSessionById(Long sessionId) {
        return sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));
    }

    // Get all active sessions
    public List<AttendanceSession> getAllActiveSessions() {
        return sessionRepository.findByIsActiveTrueOrderByCreatedAtDesc();
    }
}
