package lms.lms.catalog.service;

import lms.lms.catalog.dto.PublisherRequest;
import lms.lms.catalog.dto.PublisherResponse;
import lms.lms.catalog.entity.Publisher;
import lms.lms.catalog.repository.PublisherRepository;
import lms.lms.catalog.repository.BookRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PublisherService {

    private final PublisherRepository publisherRepository;
    private final BookRepository bookRepository;

    public Page<PublisherResponse> findAll(Pageable pageable) {
        return publisherRepository.findAll(pageable).map(this::toPublisherResponse);
    }

    public PublisherResponse findById(Long id) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Publisher not found"));
        return toPublisherResponse(publisher);
    }

    public PublisherResponse create(PublisherRequest request) {
        Publisher publisher = Publisher.builder()
                .name(request.getName())
                .address(request.getAddress())
                .build();
        publisher = publisherRepository.save(publisher);
        return toPublisherResponse(publisher);
    }

    public PublisherResponse update(Long id, PublisherRequest request) {
        Publisher publisher = publisherRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Publisher not found"));
        publisher.setName(request.getName());
        publisher.setAddress(request.getAddress());
        publisher = publisherRepository.save(publisher);
        return toPublisherResponse(publisher);
    }

    public void delete(Long id) {
        if (!publisherRepository.existsById(id)) {
            throw new IllegalArgumentException("Publisher not found");
        }
        if (bookRepository.existsByPublisherId(id)) {
            throw new IllegalArgumentException("Cannot delete publisher with associated books");
        }
        publisherRepository.deleteById(id);
    }

    private PublisherResponse toPublisherResponse(Publisher publisher) {
        return PublisherResponse.builder()
                .id(publisher.getId())
                .name(publisher.getName())
                .address(publisher.getAddress())
                .build();
    }
}