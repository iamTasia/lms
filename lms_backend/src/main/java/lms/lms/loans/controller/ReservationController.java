package lms.lms.loans.controller;

import jakarta.validation.Valid;
import lms.lms.loans.dto.ReservationRequest;
import lms.lms.loans.dto.ReservationResponse;
import lms.lms.loans.service.ReservationService;
import lms.lms.members.entity.Member;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reservations")
@RequiredArgsConstructor
public class ReservationController {

    private final ReservationService reservationService;

    @PostMapping
    public ResponseEntity<ReservationResponse> create(
            @Valid @RequestBody ReservationRequest request,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(reservationService.createReservation(member, request));
    }

    @PutMapping("/{id}/cancel")
    public ResponseEntity<Void> cancel(
            @PathVariable Long id,
            Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        reservationService.cancelReservation(id, member);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<ReservationResponse>> getMyReservations(Authentication authentication) {
        Member member = (Member) authentication.getPrincipal();
        return ResponseEntity.ok(reservationService.getMyReservations(member));
    }
}