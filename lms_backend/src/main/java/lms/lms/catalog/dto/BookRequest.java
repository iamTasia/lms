package lms.lms.catalog.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BookRequest {
    @NotBlank
    private String title;

    private String isbn;

    @NotNull
    private Long authorId;

    @NotNull
    private Long publisherId;

    @Min(1)
    private int totalCopies;
}