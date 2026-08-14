package lms.lms.members.controller;

import jakarta.validation.Valid;
import lms.lms.members.dto.AuthResponse;
import lms.lms.members.dto.LoginRequest;
import lms.lms.members.dto.MemberResponse;
import lms.lms.members.dto.RegisterRequest;
import lms.lms.members.entity.Member;
import lms.lms.members.service.MemberService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/members")
@RequiredArgsConstructor
public class MemberController {
    private final MemberService memberService;

    @PostMapping("/register")
    public ResponseEntity<MemberResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(memberService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(memberService.login(request));
    }

    @GetMapping("/me")
    public ResponseEntity<MemberResponse> me(Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(memberService.getProfile(member.getId()));
    }
}