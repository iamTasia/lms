package lms.lms.catalog.repository;

import lms.lms.catalog.entity.Book;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookRepository extends JpaRepository<Book, Long> {

    boolean existsByIsbn(String isbn);

    boolean existsByAuthorId(Long authorId);

    boolean existsByPublisherId(Long publisherId);

    @Override
    @EntityGraph(attributePaths = {"author", "publisher"})
    List<Book> findAll();

    @Query("SELECT b FROM Book b LEFT JOIN FETCH b.author LEFT JOIN FETCH b.publisher " +
           "WHERE (:title IS NULL OR b.title LIKE %:title%) " +
           "AND (:author IS NULL OR b.author.name LIKE %:author%) " +
           "AND (:available IS NULL OR (:available = true AND b.availableCopies > 0))")
    List<Book> searchBooks(@Param("title") String title,
                           @Param("author") String author,
                           @Param("available") Boolean available);
}