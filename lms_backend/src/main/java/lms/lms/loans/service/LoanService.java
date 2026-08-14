package lms.lms.loans.service;

import lms.lms.catalog.entity.Book;
import lms.lms.catalog.repository.BookRepository;
import lms.lms.loans.dto.BorrowRequest;
import lms.lms.loans.dto.LoanResponse;
import lms.lms.loans.entity.Loan;
import lms.lms.loans.entity.Reservation;
import lms.lms.loans.entity.ReservationStatus;
import lms.lms.loans.repository.LoanRepository;
import lms.lms.loans.repository.ReservationRepository;
import lms.lms.members.entity.Member;
import lms.lms.members.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class LoanService {

    private static final int LOAN_DURATION_DAYS = 21;
    private static final int MAX_CONCURRENT_LOANS = 5;
    private static final BigDecimal FINE_PER_DAY = BigDecimal.valueOf(1.00);

    private final LoanRepository loanRepository;
    private final ReservationRepository reservationRepository;
    private final BookRepository bookRepository;

    public LoanResponse borrowBook(Member member, BorrowRequest request) {
        Book book = bookRepository.findById(request.getBookId())
                .orElseThrow(() -> new IllegalArgumentException("Book not found"));

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalArgumentException("No copies available");
        }

        if (loanRepository.findActiveByMemberAndBook(member.getId(), book.getId()).isPresent()) {
            throw new IllegalArgumentException("Already borrowed this book");
        }

        if (loanRepository.countActiveByMemberId(member.getId()) >= MAX_CONCURRENT_LOANS) {
            throw new IllegalArgumentException("Maximum concurrent loans reached");
        }

        book.setAvailableCopies(book.getAvailableCopies() - 1);

        Loan loan = Loan.builder()
                .member(member)
                .book(book)
                .dueAt(LocalDateTime.now().plusDays(LOAN_DURATION_DAYS))
                .build();

        bookRepository.save(book);
        loan = loanRepository.save(loan);

        return toLoanResponse(loan);
    }

    public LoanResponse returnBook(Long loanId, Member member) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));

        boolean isOwner = loan.getMember().getId().equals(member.getId());
        boolean isAdmin = member.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("Access denied");
        }

        if (loan.getReturnedAt() != null) {
            throw new IllegalArgumentException("Book already returned");
        }

        LocalDateTime now = LocalDateTime.now();
        loan.setReturnedAt(now);

        long overdueDays = ChronoUnit.DAYS.between(loan.getDueAt(), now);
        if (overdueDays > 0) {
            BigDecimal fine = FINE_PER_DAY.multiply(BigDecimal.valueOf(overdueDays))
                    .setScale(2, RoundingMode.HALF_UP);
            loan.setFineAmount(fine);
        }

        Book book = loan.getBook();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepository.save(book);

        // Promote earliest pending reservation to fulfilled
        List<Reservation> pending = reservationRepository
                .findByBookIdAndStatusOrderByReservedAtAsc(book.getId(), ReservationStatus.PENDING);
        if (!pending.isEmpty()) {
            Reservation first = pending.getFirst();
            first.setStatus(ReservationStatus.FULFILLED);
            reservationRepository.save(first);
        }

        loan = loanRepository.save(loan);
        return toLoanResponse(loan);
    }

    @Transactional(readOnly = true)
    public LoanResponse getLoan(Long loanId, Member member) {
        Loan loan = loanRepository.findById(loanId)
                .orElseThrow(() -> new IllegalArgumentException("Loan not found"));

        boolean isOwner = loan.getMember().getId().equals(member.getId());
        boolean isAdmin = member.getRole() == Role.ADMIN;

        if (!isOwner && !isAdmin) {
            throw new IllegalArgumentException("Access denied");
        }

        return toLoanResponse(loan);
    }

    @Transactional(readOnly = true)
    public Page<LoanResponse> getMemberLoans(Long memberId, Member authMember, Pageable pageable) {
        if (!memberId.equals(authMember.getId()) && authMember.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Access denied");
        }

        return loanRepository.findByMemberIdWithBook(memberId, pageable)
                .map(this::toLoanResponse);
    }

    @Transactional(readOnly = true)
    public Page<LoanResponse> getMyLoans(Member member, Pageable pageable) {
        return getMemberLoans(member.getId(), member, pageable);
    }

    @Transactional(readOnly = true)
    public Page<LoanResponse> getAllLoans(Member authMember, Pageable pageable) {
        if (authMember.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Access denied");
        }
        return loanRepository.findAllWithMemberAndBook(pageable)
                .map(this::toLoanResponse);
    }

    @Transactional(readOnly = true)
    public Page<LoanResponse> getOverdueLoans(Member authMember, Pageable pageable) {
        if (authMember.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Access denied");
        }
        return loanRepository.findOverdueLoans(LocalDateTime.now(), pageable)
                .map(this::toLoanResponse);
    }

    private LoanResponse toLoanResponse(Loan loan) {
        String status;
        if (loan.getReturnedAt() != null) {
            status = "RETURNED";
        } else if (loan.getDueAt().isBefore(LocalDateTime.now())) {
            status = "OVERDUE";
        } else {
            status = "ACTIVE";
        }

        return LoanResponse.builder()
                .id(loan.getId())
                .memberId(loan.getMember().getId())
                .memberName(loan.getMember().getName())
                .bookId(loan.getBook().getId())
                .bookTitle(loan.getBook().getTitle())
                .bookIsbn(loan.getBook().getIsbn())
                .borrowedAt(loan.getBorrowedAt())
                .dueAt(loan.getDueAt())
                .returnedAt(loan.getReturnedAt())
                .fineAmount(loan.getFineAmount())
                .status(status)
                .build();
    }
}