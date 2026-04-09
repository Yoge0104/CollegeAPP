package com.collegecompanion.controller;

import com.collegecompanion.model.Timetable;
import com.collegecompanion.service.TimetableService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/timetable")
@CrossOrigin(origins = "*")
public class TimetableController {

    @Autowired
    private TimetableService timetableService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'admin', 'faculty')")
    public ResponseEntity<Timetable> createTimetable(@RequestBody Timetable timetable) {
        return ResponseEntity.ok(timetableService.createTimetableEntry(timetable));
    }

    @GetMapping
    public ResponseEntity<List<Timetable>> getTimetableForStudent(
            @RequestParam String branch,
            @RequestParam Integer year,
            @RequestParam String section,
            @RequestParam(required = false) String day) {
        
        if (day != null && !day.isEmpty()) {
            return ResponseEntity.ok(timetableService.getTimetableForDay(branch, year, section, day));
        }
        return ResponseEntity.ok(timetableService.getTimetableForStudent(branch, year, section));
    }

    @GetMapping("/all")
    public ResponseEntity<List<Timetable>> getAllTimetables() {
        return ResponseEntity.ok(timetableService.getAllTimetables());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'admin', 'faculty')")
    public ResponseEntity<Timetable> updateTimetable(@PathVariable Long id, @RequestBody Timetable timetable) {
        return ResponseEntity.ok(timetableService.updateTimetableEntry(id, timetable));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FACULTY', 'admin', 'faculty')")
    public ResponseEntity<?> deleteTimetable(@PathVariable Long id) {
        timetableService.deleteTimetableEntry(id);
        return ResponseEntity.ok("Timetable entry deleted successfully");
    }
}
