package lms.lms.catalog.service;

import lms.lms.catalog.dto.AuthorRequest;
import lms.lms.catalog.dto.AuthorResponse;
import lms.lms.catalog.entity.Author;
import lms.lms.catalog.repository.AuthorRepository;
import lms.lms.catalog.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class AuthorService {

    private final AuthorRepository authorRepository;
    private final BookRepository bookRepository;

    public List<AuthorResponse> findAll() {
        return authorRepository.findAll().stream()
                .map(this::toAuthorResponse)
                .collect(Collectors.toList());
    }

    public AuthorResponse findById(Long id) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Author not found"));
        return toAuthorResponse(author);
    }

    public AuthorResponse create(AuthorRequest request) {
        Author author = Author.builder()
                .name(request.getName())
                .biography(request.getBiography())
                .build();
        author = authorRepository.save(author);
        return toAuthorResponse(author);
    }

    public AuthorResponse update(Long id, AuthorRequest request) {
        Author author = authorRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Author not found"));
        author.setName(request.getName());
        author.setBiography(request.getBiography());
        author = authorRepository.save(author);
        return toAuthorResponse(author);
    }

    public void delete(Long id) {
        if (!authorRepository.existsById(id)) {
            throw new IllegalArgumentException("Author not found");
        }
        if (bookRepository.existsByAuthorId(id)) {
            throw new IllegalArgumentException("Cannot delete author with associated books");
        }
        authorRepository.deleteById(id);
    }

    private AuthorResponse toAuthorResponse(Author author) {
        return AuthorResponse.builder()
                .id(author.getId())
                .name(author.getName())
                .biography(author.getBiography())
                .build();
    }
}