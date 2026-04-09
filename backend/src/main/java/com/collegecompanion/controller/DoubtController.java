package com.collegecompanion.controller;

import com.collegecompanion.model.Doubt;
import com.collegecompanion.model.DoubtReply;
import com.collegecompanion.service.DoubtService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doubts")
@CrossOrigin(origins = "*")
public class DoubtController {

    @Autowired
    private DoubtService doubtService;

    @PostMapping
    public ResponseEntity<Doubt> createDoubt(@RequestBody Doubt doubt) {
        return ResponseEntity.ok(doubtService.createDoubt(doubt));
    }

    @GetMapping
    public ResponseEntity<List<Doubt>> getDoubts(
            @RequestParam(required = false) String subject,
            @RequestParam(required = false) Boolean resolved) {
        
        if (subject != null) {
            return ResponseEntity.ok(doubtService.getDoubtsBySubject(subject));
        } else if (resolved != null) {
            return ResponseEntity.ok(doubtService.getDoubtsByResolved(resolved));
        }
        return ResponseEntity.ok(doubtService.getAllDoubts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Doubt> getDoubtById(@PathVariable Long id) {
        return ResponseEntity.ok(doubtService.getDoubtById(id));
    }

    @PostMapping("/{id}/reply")
    public ResponseEntity<Doubt> addReply(@PathVariable Long id, @RequestBody DoubtReply reply) {
        return ResponseEntity.ok(doubtService.addReply(id, reply));
    }

    @PutMapping("/{id}/upvote")
    public ResponseEntity<Doubt> upvoteDoubt(@PathVariable Long id) {
        return ResponseEntity.ok(doubtService.upvoteDoubt(id));
    }

    @PutMapping("/{id}/resolve")
    public ResponseEntity<Doubt> resolveDoubt(@PathVariable Long id) {
        return ResponseEntity.ok(doubtService.markAsResolved(id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoubt(@PathVariable Long id) {
        doubtService.deleteDoubt(id);
        return ResponseEntity.ok("Doubt deleted successfully");
    }
}
