package lms.lms.loans.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReservationResponse {
    private Long id;
    private Long bookId;
    private String bookTitle;
    private String bookIsbn;
    private LocalDateTime reservedAt;
    private String status; // PENDING | FULFILLED | CANCELLED | EXPIRED
}