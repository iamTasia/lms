package lms.lms.catalog.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookResponse {
    private Long id;
    private String title;
    private String isbn;
    private Long authorId;
    private String authorName;
    private Long publisherId;
    private String publisherName;
    private int totalCopies;
    private int availableCopies;
}