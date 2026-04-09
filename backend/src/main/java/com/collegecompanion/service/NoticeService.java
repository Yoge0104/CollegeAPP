package com.collegecompanion.service;

import com.collegecompanion.model.Notice;
import com.collegecompanion.repository.NoticeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NoticeService {

    @Autowired
    private NoticeRepository noticeRepository;

    public Notice createNotice(Notice notice) {
        return noticeRepository.save(notice);
    }

    public List<Notice> getAllNotices() {
        return noticeRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Notice> getNoticesByCategory(String category) {
        return noticeRepository.findByCategoryOrderByCreatedAtDesc(category);
    }

    public Notice getNoticeById(Long id) {
        return noticeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Notice not found"));
    }

    public void deleteNotice(Long id) {
        noticeRepository.deleteById(id);
    }

    public Notice updateNotice(Long id, Notice notice) {
        Notice existing = getNoticeById(id);
        existing.setTitle(notice.getTitle());
        existing.setContent(notice.getContent());
        existing.setCategory(notice.getCategory());
        existing.setPriority(notice.getPriority());
        return noticeRepository.save(existing);
    }
}
