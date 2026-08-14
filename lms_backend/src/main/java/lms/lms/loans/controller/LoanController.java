package lms.lms.loans.controller;

import jakarta.validation.Valid;
import lms.lms.loans.dto.BorrowRequest;
import lms.lms.loans.dto.LoanResponse;
import lms.lms.loans.service.LoanService;
import lms.lms.members.entity.Member;
import lombok.RequiredArgsConstructor;
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
    public ResponseEntity<List<LoanResponse>> getMyLoans(Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getMyLoans(member));
    }

    @GetMapping("/{id}")
    public ResponseEntity<LoanResponse> getLoan(
            @PathVariable Long id,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getLoan(id, member));
    }

    @GetMapping("/members/{memberId}")
    public ResponseEntity<List<LoanResponse>> getMemberLoans(
            @PathVariable Long memberId,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getMemberLoans(memberId, member));
    }

    @GetMapping("/all")
    public ResponseEntity<List<LoanResponse>> getAllLoans(Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getAllLoans(member));
    }

    @GetMapping("/overdue")
    public ResponseEntity<List<LoanResponse>> getOverdueLoans(Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(loanService.getOverdueLoans(member));
    }
}