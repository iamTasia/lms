package lms.lms.loans.repository;

import lms.lms.loans.entity.Reservation;
import lms.lms.loans.entity.ReservationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ReservationRepository extends JpaRepository<Reservation, Long> {

    @Query("SELECT r FROM Reservation r WHERE r.book.id = :bookId AND r.status = :status ORDER BY r.reservedAt ASC")
    List<Reservation> findByBookIdAndStatusOrderByReservedAtAsc(
            @Param("bookId") Long bookId,
            @Param("status") ReservationStatus status);

    List<Reservation> findByMemberIdAndStatus(Long memberId, ReservationStatus status);

    Optional<Reservation> findByMemberIdAndBookIdAndStatus(Long memberId, Long bookId, ReservationStatus status);

    Page<Reservation> findByMemberId(Long memberId, Pageable pageable);
}