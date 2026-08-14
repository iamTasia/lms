package lms.lms.analytics.controller;

import lms.lms.analytics.dto.AnalyticsDTO.CountResponse;
import lms.lms.analytics.dto.AnalyticsDTO.LoanCountByDate;
import lms.lms.analytics.dto.AnalyticsDTO.MostBorrowedBook;
import lms.lms.analytics.service.AnalyticsService;
import lms.lms.members.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/analytics")
@RequiredArgsConstructor
public class AnalyticsController {

    private final AnalyticsService analyticsService;

    @GetMapping("/most-borrowed")
    public ResponseEntity<List<MostBorrowedBook>> getMostBorrowed(
            @RequestParam(defaultValue = "10") int limit,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(analyticsService.getMostBorrowedBooks(member, limit));
    }

    @GetMapping("/loans-over-time")
    public ResponseEntity<List<LoanCountByDate>> getLoansOverTime(
            @RequestParam(defaultValue = "30") int days,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(analyticsService.getLoansOverTime(member, days));
    }

    @GetMapping("/overdue-count")
    public ResponseEntity<CountResponse> getOverdueCount(Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(analyticsService.getOverdueCount(member));
    }

    @GetMapping("/active-members")
    public ResponseEntity<CountResponse> getActiveMembersCount(Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(analyticsService.getActiveMembersCount(member));
    }
}