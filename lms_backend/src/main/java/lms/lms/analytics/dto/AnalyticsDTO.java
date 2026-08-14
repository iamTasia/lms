package lms.lms.analytics.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

public final class AnalyticsDTO {

    private AnalyticsDTO() {}

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MostBorrowedBook {
        private Long bookId;
        private String bookTitle;
        private long borrowCount;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class LoanCountByDate {
        private LocalDate date;
        private long count;
    }

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CountResponse {
        private long count;
    }
}