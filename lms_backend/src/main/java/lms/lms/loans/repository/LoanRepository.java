package lms.lms.loans.repository;

import lms.lms.loans.entity.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface LoanRepository extends JpaRepository<Loan, Long> {

    @Query("SELECT l FROM Loan l WHERE l.member.id = :memberId AND l.returnedAt IS NULL")
    List<Loan> findActiveByMemberId(@Param("memberId") Long memberId);

    @Query("SELECT l FROM Loan l WHERE l.returnedAt IS NULL AND l.dueAt < :now")
    List<Loan> findOverdueLoans(@Param("now") LocalDateTime now);

    @Query("SELECT l FROM Loan l WHERE l.member.id = :memberId AND l.book.id = :bookId AND l.returnedAt IS NULL")
    Optional<Loan> findActiveByMemberAndBook(@Param("memberId") Long memberId, @Param("bookId") Long bookId);

    List<Loan> findByMemberIdOrderByBorrowedAtDesc(Long memberId);

    @Query("SELECT COUNT(l) FROM Loan l WHERE l.member.id = :memberId AND l.returnedAt IS NULL")
    long countActiveByMemberId(@Param("memberId") Long memberId);

    @Query("SELECT l FROM Loan l JOIN FETCH l.book WHERE l.member.id = :memberId ORDER BY l.borrowedAt DESC")
    List<Loan> findByMemberIdWithBook(@Param("memberId") Long memberId);
}