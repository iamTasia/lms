package lms.lms.loans.controller;

import jakarta.validation.Valid;
import lms.lms.loans.dto.BorrowRequest;
import lms.lms.loans.dto.LoanResponse;
import lms.lms.loans.service.LoanService;
import lms.lms.members.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/loans")
@RequiredArgsConstructor
public class LoanController {

    private final LoanService loanService;

    @PostMapping
    public ResponseEntity<LoanResponse> borrow(
            @Valid @RequestBody BorrowRequest request,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.borrowBook(member, request));
    }

    @PutMapping("/{id}/return")
    public ResponseEntity<LoanResponse> returnBook(
            @PathVariable Long id,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.returnBook(id, member));
    }

    @GetMapping
    public ResponseEntity<Page<LoanResponse>> getMyLoans(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getMyLoans(member, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanResponse> getLoan(
            @PathVariable Long id,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getLoan(id, member));
    }

    @GetMapping("/members/{memberId}")
    public ResponseEntity<Page<LoanResponse>> getMemberLoans(
            @PathVariable Long memberId,
            @PageableDefault(size = 20) Pageable pageable,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getMemberLoans(memberId, member, pageable));
    }

    @GetMapping("/all")
    public ResponseEntity<Page<LoanResponse>> getAllLoans(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getAllLoans(member, pageable));
    }

    @GetMapping("/overdue")
    public ResponseEntity<Page<LoanResponse>> getOverdueLoans(
            @PageableDefault(size = 20) Pageable pageable,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getOverdueLoans(member, pageable));
    }
}