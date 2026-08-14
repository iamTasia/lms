package lms.lms.analytics.service;

import lms.lms.analytics.dto.AnalyticsDTO.CountResponse;
import lms.lms.analytics.dto.AnalyticsDTO.LoanCountByDate;
import lms.lms.analytics.dto.AnalyticsDTO.MostBorrowedBook;
import lms.lms.loans.entity.Loan;
import lms.lms.loans.repository.LoanRepository;
import lms.lms.members.entity.Member;
import lms.lms.members.entity.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class AnalyticsService {

    private final LoanRepository loanRepository;

    public List<MostBorrowedBook> getMostBorrowedBooks(Member authMember, int limit) {
        if (authMember.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Access denied");
        }

        return loanRepository.findMostBorrowedBooks(PageRequest.of(0, limit)).stream()
                .map(row -> MostBorrowedBook.builder()
                        .bookId((Long) row[0])
                        .bookTitle((String) row[1])
                        .borrowCount((Long) row[2])
                        .build())
                .collect(Collectors.toList());
    }

    public List<LoanCountByDate> getLoansOverTime(Member authMember, int days) {
        if (authMember.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Access denied");
        }

        LocalDateTime start = LocalDateTime.now().minusDays(days);
        List<Loan> loans = loanRepository.findByBorrowedAtBetween(start, LocalDateTime.now());

        Map<LocalDate, Long> grouped = loans.stream()
                .collect(Collectors.groupingBy(
                        loan -> loan.getBorrowedAt().toLocalDate(),
                        Collectors.counting()
                ));

        return grouped.entrySet().stream()
                .map(entry -> LoanCountByDate.builder()
                        .date(entry.getKey())
                        .count(entry.getValue())
                        .build())
                .sorted((a, b) -> a.getDate().compareTo(b.getDate()))
                .collect(Collectors.toList());
    }

    public CountResponse getOverdueCount(Member authMember) {
        if (authMember.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Access denied");
        }

        long count = loanRepository.countOverdueLoans(LocalDateTime.now());
        return new CountResponse(count);
    }

    public CountResponse getActiveMembersCount(Member authMember) {
        if (authMember.getRole() != Role.ADMIN) {
            throw new IllegalArgumentException("Access denied");
        }

        long count = loanRepository.countDistinctActiveMembers();
        return new CountResponse(count);
    }
}