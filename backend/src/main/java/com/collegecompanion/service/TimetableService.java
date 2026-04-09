package com.collegecompanion.service;

import com.collegecompanion.model.Timetable;
import com.collegecompanion.repository.TimetableRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TimetableService {

    @Autowired
    private TimetableRepository timetableRepository;

    public Timetable createTimetableEntry(Timetable timetable) {
        return timetableRepository.save(timetable);
    }

    public List<Timetable> getTimetableForStudent(String branch, Integer year, String section) {
        return timetableRepository.findByBranchAndYearAndSectionOrderByDayOfWeekAscStartTimeAsc(
            branch, year, section);
    }

    public List<Timetable> getTimetableForDay(String branch, Integer year, String section, String dayOfWeek) {
        return timetableRepository.findByBranchAndYearAndSectionAndDayOfWeekOrderByStartTimeAsc(
            branch, year, section, dayOfWeek);
    }

    public List<Timetable> getAllTimetables() {
        return timetableRepository.findAll();
    }

    public void deleteTimetableEntry(Long id) {
        timetableRepository.deleteById(id);
    }

    public Timetable updateTimetableEntry(Long id, Timetable timetable) {
        Timetable existing = timetableRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Timetable entry not found"));
        
        existing.setDayOfWeek(timetable.getDayOfWeek());
        existing.setSubject(timetable.getSubject());
        existing.setStartTime(timetable.getStartTime());
        existing.setEndTime(timetable.getEndTime());
        existing.setFaculty(timetable.getFaculty());
        existing.setRoom(timetable.getRoom());
        existing.setBranch(timetable.getBranch());
        existing.setYear(timetable.getYear());
        existing.setSection(timetable.getSection());
        
        return timetableRepository.save(existing);
    }
}
