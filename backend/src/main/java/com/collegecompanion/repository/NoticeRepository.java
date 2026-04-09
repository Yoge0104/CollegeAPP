package com.collegecompanion.repository;

import com.collegecompanion.model.Notice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NoticeRepository extends JpaRepository<Notice, Long> {
    List<Notice> findByCategoryOrderByCreatedAtDesc(String category);
    List<Notice> findAllByOrderByCreatedAtDesc();
}
