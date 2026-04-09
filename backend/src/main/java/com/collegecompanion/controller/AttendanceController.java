package com.collegecompanion.controller;

import com.collegecompanion.model.Attendance;
import com.collegecompanion.model.AttendanceSession;
import com.collegecompanion.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "*", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS})
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // Get students for a class
    @GetMapping("/students")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN', 'faculty', 'admin')")
    public ResponseEntity<List<com.collegecompanion.model.User>> getStudentsByClass(
            @RequestParam String branch,
            @RequestParam Integer year,
            @RequestParam String section) {
        return ResponseEntity.ok(attendanceService.getStudentsByClass(branch, year, section));
    }

    // Faculty: Bulk upload students for a class
    @PostMapping("/students/upload")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN', 'faculty', 'admin')")
    public ResponseEntity<?> uploadStudents(@RequestBody Map<String, Object> request) {
        try {
            String branch = request.get("branch").toString();
            Integer year = Integer.valueOf(request.get("year").toString());
            String section = request.get("section").toString();
            List<Map<String, String>> studentList = (List<Map<String, String>>) request.get("studentList");

            List<com.collegecompanion.model.User> created = attendanceService.uploadStudents(branch, year, section, studentList);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to upload students");
        }
    }

    // Faculty: Bulk mark attendance
    @PostMapping("/mark/bulk")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN', 'faculty', 'admin')")
    public ResponseEntity<?> markBulkAttendance(@RequestBody Map<String, Object> request) {
        try {
            Long sessionId = Long.valueOf(request.get("sessionId").toString());
            List<Map<String, Object>> attendanceList = (List<Map<String, Object>>) request.get("attendanceList");
            Long facultyId = Long.valueOf(request.get("facultyId").toString());
            String facultyName = request.get("facultyName").toString();

            List<Attendance> results = attendanceService.markBulkAttendance(sessionId, attendanceList, facultyId, facultyName);
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to mark bulk attendance");
        }
    }

    // Faculty: Create new attendance session
    @PostMapping("/session")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN', 'faculty', 'admin')")
    public ResponseEntity<AttendanceSession> createSession(@RequestBody AttendanceSession session) {
        try {
            AttendanceSession created = attendanceService.createSession(session);
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Faculty: Close attendance session
    @PutMapping("/session/{id}/close")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN', 'faculty', 'admin')")
    public ResponseEntity<AttendanceSession> closeSession(@PathVariable Long id) {
        try {
            AttendanceSession closed = attendanceService.closeSession(id);
            return ResponseEntity.ok(closed);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    // Faculty: Get sessions created by them
    @GetMapping("/session/faculty/{facultyId}")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN', 'faculty', 'admin')")
    public ResponseEntity<List<AttendanceSession>> getFacultySessions(@PathVariable Long facultyId) {
        return ResponseEntity.ok(attendanceService.getSessionsByFaculty(facultyId));
    }

    // Faculty: Mark attendance for a student
    @PostMapping("/mark")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN', 'faculty', 'admin')")
    public ResponseEntity<?> markAttendance(@RequestBody Map<String, Object> request) {
        try {
            Long sessionId = Long.valueOf(request.get("sessionId").toString());
            Long studentId = Long.valueOf(request.get("studentId").toString());
            String studentName = request.get("studentName").toString();
            String studentEmail = request.get("studentEmail").toString();
            String status = request.get("status").toString();
            Long facultyId = Long.valueOf(request.get("facultyId").toString());
            String facultyName = request.get("facultyName").toString();

            Attendance attendance = attendanceService.markAttendance(
                sessionId, studentId, studentName, studentEmail, status, facultyId, facultyName
            );
            return ResponseEntity.ok(attendance);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to mark attendance");
        }
    }

    // Student: Get active sessions for their class
    @GetMapping("/session/active")
    public ResponseEntity<List<AttendanceSession>> getActiveSessions(
            @RequestParam String branch,
            @RequestParam Integer year,
            @RequestParam String section) {
        return ResponseEntity.ok(attendanceService.getActiveSessionsForStudent(branch, year, section));
    }

    // Student: Get their attendance history
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Attendance>> getStudentAttendance(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendance(studentId));
    }

    // Student: Get their attendance statistics
    @GetMapping("/student/{studentId}/stats")
    public ResponseEntity<Map<String, Object>> getStudentStats(@PathVariable Long studentId) {
        return ResponseEntity.ok(attendanceService.getStudentAttendanceStats(studentId));
    }

    // Faculty: Get attendance for a specific session
    @GetMapping("/session/{sessionId}/attendance")
    @PreAuthorize("hasAnyRole('FACULTY', 'ADMIN')")
    public ResponseEntity<List<Attendance>> getSessionAttendance(@PathVariable Long sessionId) {
        return ResponseEntity.ok(attendanceService.getSessionAttendance(sessionId));
    }

    // Get session details
    @GetMapping("/session/{sessionId}")
    public ResponseEntity<AttendanceSession> getSession(@PathVariable Long sessionId) {
        try {
            return ResponseEntity.ok(attendanceService.getSessionById(sessionId));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // Get all active sessions (for admin)
    @GetMapping("/session/all/active")
    public ResponseEntity<List<AttendanceSession>> getAllActiveSessions() {
        return ResponseEntity.ok(attendanceService.getAllActiveSessions());
    }
}
