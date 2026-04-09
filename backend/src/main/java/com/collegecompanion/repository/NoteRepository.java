package com.collegecompanion.repository;

import com.collegecompanion.model.Note;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoteRepository extends JpaRepository<Note, Long> {
    List<Note> findBySubjectOrderByCreatedAtDesc(String subject);
    List<Note> findBySubjectAndTopicOrderByCreatedAtDesc(String subject, String topic);
    List<Note> findBySemesterOrderByCreatedAtDesc(String semester);
    List<Note> findAllByOrderByCreatedAtDesc();
}
