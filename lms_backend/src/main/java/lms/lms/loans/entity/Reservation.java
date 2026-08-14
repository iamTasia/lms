package lms.lms.loans.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

import lms.lms.catalog.entity.Book;

@Entity
@Table(name = "reservations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Reservation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "member_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private lms.lms.members.entity.Member member;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "book_id", nullable = false)
    @ToString.Exclude
    @EqualsAndHashCode.Exclude
    private Book book;

    @Column(name = "reserved_at", nullable = false, updatable = false)
    private LocalDateTime reservedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ReservationStatus status;

    @PrePersist
    protected void onCreate() {
        this.reservedAt = LocalDateTime.now();
        if (this.status == null) this.status = ReservationStatus.PENDING;
    }
}