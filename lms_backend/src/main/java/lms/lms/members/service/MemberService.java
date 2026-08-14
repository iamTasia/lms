package lms.lms.members.service;

import lms.lms.members.dto.AuthResponse;
import lms.lms.members.dto.LoginRequest;
import lms.lms.members.dto.MemberResponse;
import lms.lms.members.dto.RegisterRequest;
import lms.lms.members.entity.Member;
import lms.lms.members.entity.Role;
import lms.lms.members.repository.MemberRepository;
import lms.lms.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class MemberService {
    private final MemberRepository memberRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public MemberResponse register(RegisterRequest request) {
        if (memberRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already registered");
        }

        Member member = Member.builder()
                .name(request.getName())
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole() != null ? request.getRole() : Role.MEMBER)
                .build();

        member = memberRepository.save(member);
        return toMemberResponse(member);
    }

    public AuthResponse login(LoginRequest request) {
        Member member = memberRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new IllegalArgumentException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), member.getPasswordHash())) {
            throw new IllegalArgumentException("Invalid credentials");
        }

        String token = jwtUtil.generateToken(member.getEmail());
        return AuthResponse.builder()
                .token(token)
                .member(toMemberResponse(member))
                .build();
    }

    public MemberResponse getProfile(Long memberId) {
        Member member = memberRepository.findById(memberId)
                .orElseThrow(() -> new IllegalArgumentException("Member not found"));
        return toMemberResponse(member);
    }

    private MemberResponse toMemberResponse(Member member) {
        return MemberResponse.builder()
                .id(member.getId())
                .name(member.getName())
                .email(member.getEmail())
                .role(member.getRole().name())
                .createdAt(member.getCreatedAt())
                .build();
    }
}