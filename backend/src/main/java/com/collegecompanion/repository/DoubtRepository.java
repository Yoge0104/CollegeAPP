package com.collegecompanion.repository;

import com.collegecompanion.model.Doubt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoubtRepository extends JpaRepository<Doubt, Long> {
    List<Doubt> findBySubjectOrderByCreatedAtDesc(String subject);
    List<Doubt> findByResolvedOrderByCreatedAtDesc(Boolean resolved);
    List<Doubt> findAllByOrderByCreatedAtDesc();
}
