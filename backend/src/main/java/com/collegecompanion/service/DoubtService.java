package com.collegecompanion.service;

import com.collegecompanion.model.Doubt;
import com.collegecompanion.model.DoubtReply;
import com.collegecompanion.repository.DoubtRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoubtService {

    @Autowired
    private DoubtRepository doubtRepository;

    public Doubt createDoubt(Doubt doubt) {
        return doubtRepository.save(doubt);
    }

    public List<Doubt> getAllDoubts() {
        return doubtRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Doubt> getDoubtsBySubject(String subject) {
        return doubtRepository.findBySubjectOrderByCreatedAtDesc(subject);
    }

    public List<Doubt> getDoubtsByResolved(Boolean resolved) {
        return doubtRepository.findByResolvedOrderByCreatedAtDesc(resolved);
    }

    public Doubt getDoubtById(Long id) {
        return doubtRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doubt not found"));
    }

    public Doubt addReply(Long doubtId, DoubtReply reply) {
        Doubt doubt = getDoubtById(doubtId);
        reply.setDoubt(doubt);
        doubt.getReplies().add(reply);
        return doubtRepository.save(doubt);
    }

    public Doubt upvoteDoubt(Long id) {
        Doubt doubt = getDoubtById(id);
        doubt.setUpvotes(doubt.getUpvotes() + 1);
        return doubtRepository.save(doubt);
    }

    public Doubt markAsResolved(Long id) {
        Doubt doubt = getDoubtById(id);
        doubt.setResolved(true);
        return doubtRepository.save(doubt);
    }

    public void deleteDoubt(Long id) {
        doubtRepository.deleteById(id);
    }
}
