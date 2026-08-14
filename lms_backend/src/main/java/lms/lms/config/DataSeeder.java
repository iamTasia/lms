package lms.lms.config;

import lms.lms.catalog.entity.Author;
import lms.lms.catalog.entity.Book;
import lms.lms.catalog.entity.Publisher;
import lms.lms.catalog.repository.AuthorRepository;
import lms.lms.catalog.repository.BookRepository;
import lms.lms.catalog.repository.PublisherRepository;
import lms.lms.loans.entity.Loan;
import lms.lms.loans.repository.LoanRepository;
import lms.lms.members.entity.Member;
import lms.lms.members.entity.Role;
import lms.lms.members.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataSeeder implements CommandLineRunner {

    private final AuthorRepository authorRepository;
    private final PublisherRepository publisherRepository;
    private final BookRepository bookRepository;
    private final MemberRepository memberRepository;
    private final LoanRepository loanRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        if (bookRepository.count() > 0) {
            log.info("Database already seeded, skipping.");
            return;
        }

        log.info("Seeding demo data...");

        // === Authors ===
        Author rowling = authorRepository.save(Author.builder()
                .name("J.K. Rowling")
                .biography("British author, best known for the Harry Potter series.")
                .build());

        Author orwell = authorRepository.save(Author.builder()
                .name("George Orwell")
                .biography("English novelist and essayist, known for dystopian fiction.")
                .build());

        Author tolkien = authorRepository.save(Author.builder()
                .name("J.R.R. Tolkien")
                .biography("English writer, poet, and philologist, author of The Lord of the Rings.")
                .build());

        Author austen = authorRepository.save(Author.builder()
                .name("Jane Austen")
                .biography("English novelist known for works exploring dependence on marriage.")
                .build());

        // === Publishers ===
        Publisher bloomsbury = publisherRepository.save(Publisher.builder()
                .name("Bloomsbury Publishing")
                .address("London, UK")
                .build());

        Publisher penguin = publisherRepository.save(Publisher.builder()
                .name("Penguin Books")
                .address("London, UK")
                .build());

        Publisher harperCollins = publisherRepository.save(Publisher.builder()
                .name("HarperCollins")
                .address("New York, USA")
                .build());

        // === Books ===
        Book hp1 = bookRepository.save(Book.builder()
                .title("Harry Potter and the Sorcerer's Stone")
                .isbn("978-0439708180")
                .author(rowling)
                .publisher(bloomsbury)
                .totalCopies(5)
                .availableCopies(3)
                .build());

        Book hp2 = bookRepository.save(Book.builder()
                .title("Harry Potter and the Chamber of Secrets")
                .isbn("978-0439064873")
                .author(rowling)
                .publisher(bloomsbury)
                .totalCopies(3)
                .availableCopies(1)
                .build());

        Book book1984 = bookRepository.save(Book.builder()
                .title("1984")
                .isbn("978-0451524935")
                .author(orwell)
                .publisher(penguin)
                .totalCopies(4)
                .availableCopies(2)
                .build());

        Book animalFarm = bookRepository.save(Book.builder()
                .title("Animal Farm")
                .isbn("978-0451526342")
                .author(orwell)
                .publisher(penguin)
                .totalCopies(3)
                .availableCopies(0)
                .build());

        Book lotr = bookRepository.save(Book.builder()
                .title("The Fellowship of the Ring")
                .isbn("978-0547928210")
                .author(tolkien)
                .publisher(harperCollins)
                .totalCopies(2)
                .availableCopies(1)
                .build());

        Book pride = bookRepository.save(Book.builder()
                .title("Pride and Prejudice")
                .isbn("978-0141439518")
                .author(austen)
                .publisher(penguin)
                .totalCopies(3)
                .availableCopies(3)
                .build());

        // === Members ===
        Member testUser = memberRepository.save(Member.builder()
                .name("Test User")
                .email("test@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.MEMBER)
                .build());

        Member admin = memberRepository.save(Member.builder()
                .name("Admin User")
                .email("admin@example.com")
                .passwordHash(passwordEncoder.encode("admin123"))
                .role(Role.ADMIN)
                .build());

        Member alice = memberRepository.save(Member.builder()
                .name("Alice Johnson")
                .email("alice@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.MEMBER)
                .build());

        Member bob = memberRepository.save(Member.builder()
                .name("Bob Smith")
                .email("bob@example.com")
                .passwordHash(passwordEncoder.encode("password123"))
                .role(Role.MEMBER)
                .build());

        // === Loans ===

        // Active loan: test user borrowed Harry Potter 1 (5 days ago, due in 16 days)
        loanRepository.save(Loan.builder()
                .member(testUser)
                .book(hp1)
                .borrowedAt(LocalDateTime.now().minusDays(5))
                .dueAt(LocalDateTime.now().plusDays(16))
                .build());

        // Overdue loan: test user borrowed Animal Farm (30 days ago, due 9 days ago)
        loanRepository.save(Loan.builder()
                .member(testUser)
                .book(animalFarm)
                .borrowedAt(LocalDateTime.now().minusDays(30))
                .dueAt(LocalDateTime.now().minusDays(9))
                .build());

        // Active loan: alice borrowed HP2 (10 days ago, due in 11 days)
        loanRepository.save(Loan.builder()
                .member(alice)
                .book(hp2)
                .borrowedAt(LocalDateTime.now().minusDays(10))
                .dueAt(LocalDateTime.now().plusDays(11))
                .build());

        // Active loan: alice borrowed 1984 (3 days ago, due in 18 days)
        loanRepository.save(Loan.builder()
                .member(alice)
                .book(book1984)
                .borrowedAt(LocalDateTime.now().minusDays(3))
                .dueAt(LocalDateTime.now().plusDays(18))
                .build());

        // Overdue loan: bob borrowed HP1 (40 days ago, due 19 days ago)
        loanRepository.save(Loan.builder()
                .member(bob)
                .book(hp1)
                .borrowedAt(LocalDateTime.now().minusDays(40))
                .dueAt(LocalDateTime.now().minusDays(19))
                .build());

        // Returned loan: bob returned 1984 (borrowed 20 days ago, returned 2 days ago, on time)
        loanRepository.save(Loan.builder()
                .member(bob)
                .book(book1984)
                .borrowedAt(LocalDateTime.now().minusDays(20))
                .dueAt(LocalDateTime.now().plusDays(1))
                .returnedAt(LocalDateTime.now().minusDays(2))
                .build());

        // Returned loan with fine: bob returned LOTR late (borrowed 35 days ago, due 14 days ago, returned 5 days ago)
        loanRepository.save(Loan.builder()
                .member(bob)
                .book(lotr)
                .borrowedAt(LocalDateTime.now().minusDays(35))
                .dueAt(LocalDateTime.now().minusDays(14))
                .returnedAt(LocalDateTime.now().minusDays(5))
                .fineAmount(java.math.BigDecimal.valueOf(9.00))
                .build());

        log.info("Seed data created: 4 authors, 3 publishers, 6 books, 4 members, 7 loans (3 active, 2 overdue, 2 returned)");
    }
}