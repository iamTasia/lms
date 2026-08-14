package lms.lms.loans.service;

import lms.lms.catalog.entity.Book;
import lms.lms.catalog.repository.BookRepository;
import lms.lms.loans.dto.ReservationRequest;
import lms.lms.loans.dto.ReservationResponse;
import lms.lms.loans.entity.Reservation;
import lms.lms.loans.entity.ReservationStatus;
import lms.lms.loans.repository.ReservationRepository;
import lms.lms.members.entity.Member;
import lms.lms.members.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ReservationService {

    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;

    public ReservationResponse createReservation(Member member, ReservationRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        if (book.getAvailableCopies() > 0) {
            throw new IllegalArgumentException("Book has available copies, borrow instead");
        }

        if (reservationRepository.findByMemberIdAndBookIdAndStatus(
                member.getId(), book.getId(), ReservationStatus.PENDING).isPresent()) {
            throw new IllegalArgumentException("Already have a pending reservation for this book");
        }

        Reservation reservation = Reservation.builder()
                .member(member)
                .book(book)
                .status(ReservationStatus.PENDING)
                .build();

        reservation = reservationRepository.save(reservation);
        return toReservationResponse(reservation);
    }

    public void cancelReservation(Long reservationId, Member member) {
        Reservation reservation = reservationRepository.findById(reservationId)
                .orElseThrow(() -> new IllegalArgumentException("Reservation not found"));

        boolean isOwner = reservation.getMember().getId().equals(member.getId());
        boolean isAdmin = member.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("Access denied");
        }

        if (reservation.getStatus() != ReservationStatus.PENDING) {
            throw new IllegalArgumentException("Only pending reservations can be cancelled");
        }

        reservation.setStatus(ReservationStatus.CANCELLED);
        reservationRepository.save(reservation);
    }

    @Transactional(readOnly = true)
    public Page<ReservationResponse> getMyReservations(Member member, Pageable pageable) {
        return reservationRepository.findByMemberId(member.getId(), pageable)
                .map(this::toReservationResponse);
    }

    private ReservationResponse toReservationResponse(Reservation reservation) {
        return ReservationResponse.builder()
                .id(reservation.getId())
                .bookId(reservation.getBook().getId())
                .bookTitle(reservation.getBook().getTitle())
                .bookIsbn(reservation.getBook().getIsbn())
                .reservedAt(reservation.getReservedAt())
                .status(reservation.getStatus().name())
                .build();
    }
}