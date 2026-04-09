package com.collegecompanion.service;

import com.collegecompanion.model.Note;
import com.collegecompanion.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    @Autowired
    private FileStorageService fileStorageService;

    public Note createNote(Note note, org.springframework.web.multipart.MultipartFile file) {
        if (file != null && !file.isEmpty()) {
            String fileName = fileStorageService.storeFile(file);
            note.setFileUrl(fileName);
            note.setFileName(file.getOriginalFilename());
        }
        return noteRepository.save(note);
    }

    public List<Note> getAllNotes() {
        return noteRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Note> getNotesBySubject(String subject) {
        return noteRepository.findBySubjectOrderByCreatedAtDesc(subject);
    }

    public List<Note> getNotesBySubjectAndTopic(String subject, String topic) {
        return noteRepository.findBySubjectAndTopicOrderByCreatedAtDesc(subject, topic);
    }

    public List<Note> getNotesBySemester(String semester) {
        return noteRepository.findBySemesterOrderByCreatedAtDesc(semester);
    }

    public Note getNoteById(Long id) {
        return noteRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Note not found"));
    }

    public void deleteNote(Long id) {
        noteRepository.deleteById(id);
    }

    public Note updateNote(Long id, Note note) {
        Note existing = getNoteById(id);
        existing.setTitle(note.getTitle());
        existing.setDescription(note.getDescription());
        existing.setSubject(note.getSubject());
        existing.setTopic(note.getTopic());
        existing.setSemester(note.getSemester());
        return noteRepository.save(existing);
    }
}
